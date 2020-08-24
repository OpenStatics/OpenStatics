<template>
  <div class="container-fluid">
    <!-- <div class="row justify-content-center">
      <button class="btn btn-primary mx-3" :class="{ 'btn-warning': state === 0 }" @click="() => changeState(0)">
        Clear
      </button>
      <button class="btn btn-primary mx-3" :class="{ 'btn-warning': state === 1 }" @click="() => changeState(1)">
        Step 1: External loadings on the beam
      </button>
      <button class="btn btn-primary mx-3" :class="{ 'btn-warning': state === 2 }" @click="() => changeState(2)">
        Step 2: Internal forces in the beam
      </button>
      <button class="btn btn-primary mx-3" :class="{ 'btn-warning': state === 3 }" @click="() => changeState(3)">
        Step 3: Internal force diagrams of the beam
      </button>
    </div> -->
    <div class="row my-3 justify-content-center">
      <div id="boxLeft" class="boxLeft my-2" style="width:425px; height:800px;"></div>

      <div id="boxRight" class="boxRight my-2" style="width:800px; height:800px;"></div>
    </div>
  </div>
</template>

<script>
import { CircleSlider } from "../../../classes/CircleSlider.js";
export default {
  components: {},
  data: () => {
    return {
      state: 0,
      values: {
        rotation: "off",
        show_AB: "off",
        show_AC: "off",
        show_F: "off",
        proj_force: "off"
      },
      textToUpdate: {
        /* arbitrary name: {
            object: reference to object
            formula: function that returns text (string)
        }*/
      },
      objectsToEnable: {
        /* arbitrary name: {
            object: reference to object
            component: component to enable/disable
            formula: function that returns true for disable
        }
        */
      },
      buttonsToToggle: {
        /* key from values: {
            possible value: corresponding button
        }
        */
      },
      bL: undefined,
      bR: undefined
    };
  },
  mounted() {
    // Setup the two boards
    // The lefthand board (sliders and text)
    const bL = JXG.JSXGraph.initBoard("boxLeft", {
      boundingbox: [-15, 15, 15, -15],
      keepAspectRatio: true,
      showCopyright: false,
      pan: { enabled: false },
      zoom: { wheel: false },
      showNavigation: false,
      showZoom: false,
      axis: false
    });
    // The size of the container (matches explicit css style in html)
    bL.resizeContainer(425, 800);

    const bR = JXG.JSXGraph.initBoard("boxRight", {
      boundingbox: [-11, 11, 11, -11],
      keepAspectRatio: true,
      showCopyright: false,
      pan: { enabled: false },
      zoom: { wheel: false },
      showNavigation: false,
      showZoom: false,
      axis: false
    });
    // The size of the container (matches explicit css style in html)
    bR.resizeContainer(800, 800);
    //bR.options.layer["text"] = 10;

    // All sliders are stored in these objects
    // They can be accessed with brackets sliders["force"] or dot notation sliders.force
    let sliders = {};
    const LABEL_SIZE = 18;

    // Function that updates a slider value to that inside the textbox
    let buttonClick = (textbox, slider) => {
      return () => {
        if (textbox.Value() === "") return;
        if (!isNaN(textbox.Value())) {
          let val = Number(textbox.Value());
          val = Math.min(slider._smax, val);
          val = Math.max(slider._smin, val);
          val = Math.round(val * 100) / 100;
          slider.setValue(val);
          textbox.rendNodeInput.value = "";
          textbox.update();
          slider.update();
          this.fixTextAlignment();
        }
      };
    };

    let valCheck = (value, target) => {
      return () => {
        return this.values[value] === target;
      };
    };

    // let stateCheck = states => {
    //   return () => {
    //     return states.includes(this.state);
    //   };
    // };

    // let stateValCheck = (states, value, target) => {
    //   return () => {
    //     return states.includes(this.state) && valCheck(value, target)();
    //   };
    // };

    const INTERVAL = -3.5;
    // Generate sliders, along with their related components
    // Can either have textbox + update button, or on/off system
    const TOP_Y = 12.5;
    const LEFT_X = -1;
    for (let data of [
      /* [key value,
          label name,
          y position,
          true: update button | false: on/off,
          [min, start, max] (if true) | [lbl1, val1, lbl2, val2] (if false),
          [allowed states],
          color ]*/
      /* For just text: [false, label name, mathJax] */
      ["rotation", "Rotate Axes", INTERVAL * -0.5, false, ["On", "on", "Off", "off"], [0]],
      [false, "<b>Point A Coordinates</b>:", INTERVAL * 0, false],
      ["xA", "x_A", INTERVAL * 0.5, true, [-5, -3, 5], [0], "blue"],
      ["yA", "y_A", INTERVAL * 1.5, true, [-5, -3, 5], [0], "blue"],
      ["zA", "z_A", INTERVAL * 2.5, true, [-5, -3, 5], [0], "blue"],
      [false, "<b>Point B Coordinates</b>:", INTERVAL * 3.5, false],
      ["xB", "x_B", INTERVAL * 4, true, [-5, 2, 5], [0], "green"],
      ["yB", "y_B", INTERVAL * 5, true, [-5, 4, 5], [0], "green"],
      ["zB", "z_B", INTERVAL * 6, true, [-5, 4, 5], [0], "green"],
      [false, "<b>Point C Coordinates</b>:", INTERVAL * 7, false],
      ["xC", "x_C", INTERVAL * 7.5, true, [-5, -3, 5], [0], "orange"],
      ["yC", "y_C", INTERVAL * 8.5, true, [-5, 2, 5], [0], "orange"],
      ["zC", "z_C", INTERVAL * 9.5, true, [-5, 4, 5], [0], "orange"],
      [false, "<b>Magnitude of F_{AC}</b>:", INTERVAL * 10.5, false],
      ["f", "F_{AC}", INTERVAL * 11, true, [-20, 7, 20], [0], "red"],
      ["show_AB", "Show line AB", INTERVAL * 12, false, ["On", "on", "Off", "off"], [0]],
      ["show_AC", "Show line AC", INTERVAL * 12.5, false, ["On", "on", "Off", "off"], [0]],
      ["show_F", "Show F_{AC}", INTERVAL * 13, false, ["On", "on", "Off", "off"], [0]],
      ["proj_force", "Projection of Force", INTERVAL * 13.5, false, ["On", "on", "Off", "off"], [0]]
    ]) {
      bL.create("text", [-15, TOP_Y + data[2], data[1] + (data[0] != false ? ":" : "")], {
        fontSize: LABEL_SIZE,
        color: "black",
        fixed: true,
        useMathJax: data[0] != false ? false : data[3]
      });

      // Just label
      if (data[0] === false) continue;

      if (data[3]) {
        // True case

        sliders[data[0]] = bL.create("slider", [[LEFT_X, TOP_Y + data[2]], [9, TOP_Y + data[2]], data[4]], {
          name: "",
          withTicks: false,
          strokeColor: data[6],
          fillColor: "white",
          highline: { color: data[6] },
          baseline: { color: data[6] },
          label: {
            color: "black",
            fontSize: LABEL_SIZE,
            visible: () => {
              return data[5].includes(this.state);
            }
          },
          snapWidth: 0.01,
          visible: () => {
            return data[5].includes(this.state);
          }
        });
        let textbox = bL.create("input", [LEFT_X, TOP_Y + data[2] - 1.5, "", ""], {
          cssStyle: "width: 58px",
          fixed: true
        });
        let button = bL.create("button", [5, TOP_Y + data[2] - 1.5, "Update", buttonClick(textbox, sliders[data[0]])], { fixed: true });

        textbox.rendNodeInput.addEventListener("keyup", function(event) {
          // Number 13 is the "Enter" key on the keyboard
          if (event.keyCode === 13) {
            // Trigger the button element with a click
            button.rendNodeButton.click();
          }
        });

        this.objectsToEnable[data[0] + "1"] = {
          object: textbox,
          component: "rendNodeInput",
          formula: () => {
            return !data[5].includes(this.state);
          }
        };
        this.objectsToEnable[data[0] + "2"] = {
          object: button,
          component: "rendNodeButton",
          formula: () => {
            return !data[5].includes(this.state);
          }
        };
      } else {
        // False case
        this.objectsToEnable[data[0] + "1"] = { object: undefined, formula: undefined, component: "rendNodeButton" };
        this.objectsToEnable[data[0] + "2"] = { object: undefined, formula: undefined, component: "rendNodeButton" };
        this.objectsToEnable[data[0] + "1"].object = bL.create(
          "button",
          [
            LEFT_X,
            TOP_Y + data[2],
            data[4][0],
            () => {
              this.values[data[0]] = data[4][1];
              this.fixTextAlignment();
              this.toggleButtons();
            }
          ],
          {
            fixed: true
          }
        );
        this.objectsToEnable[data[0] + "1"].formula = () => {
          return !data[5].includes(this.state);
        };

        this.objectsToEnable[data[0] + "2"].object = bL.create(
          "button",
          [
            5,
            TOP_Y + data[2],
            data[4][2],
            () => {
              this.values[data[0]] = data[4][3];
              this.fixTextAlignment();
              this.toggleButtons();
            }
          ],
          {
            fixed: true,
            disabled: () => {
              return data[5].includes(this.state);
            }
          }
        );
        this.objectsToEnable[data[0] + "2"].formula = () => {
          return !data[5].includes(this.state);
        };

        this.objectsToEnable[data[0] + "1"].object.rendNodeButton.classList.add("btn-primary");
        this.objectsToEnable[data[0] + "2"].object.rendNodeButton.classList.add("btn-primary");
        this.buttonsToToggle[data[0]] = {};
        this.buttonsToToggle[data[0]][data[4][1]] = this.objectsToEnable[data[0] + "1"].object;
        this.buttonsToToggle[data[0]][data[4][3]] = this.objectsToEnable[data[0] + "2"].object;
      }
    }

    // Handles circle gliders
    let CSProps = {};
    for (let key of ["circle", "glider", "textLabel"]) CSProps[key] = { visible: valCheck("rotation", "on") };
    let circleSlides = {};
    for (let data of [
      ["tx", 8, -8, 1, 250, "\u03b8_x"],
      ["ty", 5, -8, 1, 180, "\u03b8_y"],
      ["tz", 2, -8, 1, 150, "\u03b8_z"]
    ]) {
      circleSlides[data[0]] = new CircleSlider(bR, data[0], data[1], data[2], data[3], data[4], data[5], this.textToUpdate, CSProps);
    }

    const glideVal = root => {
      return circleSlides[root].glideVal();
    };

    // Handles all calculations
    let comp = {};
    comp.zero = () => {
      return 0;
    };
    comp.radians = deg => {
      return (deg * Math.PI) / 180;
    };
    comp.degrees = rad => {
      return (rad * 180) / Math.PI;
    };
    // comp.THETA = { x: 250, y: 180, z: 150 };
    // comp.ROT = {};
    // for (let axis of Object.keys(comp.THETA)) comp.ROT[axis] = comp.radians(comp.THETA[axis]);
    comp.x = (a, b, c) => {
      return (a * Math.cos(glideVal("tz")) - b * Math.sin(glideVal("tz"))) * Math.cos(glideVal("ty")) - c * Math.sin(glideVal("ty"));
    };
    comp.y = (a, b, c) => {
      return (b * Math.cos(glideVal("tz")) + a * Math.sin(glideVal("tz"))) * Math.cos(glideVal("tx")) - c * Math.sin(glideVal("tx"));
    };
    comp.xy = (a, b, c) => {
      return [comp.x(a, b, c), comp.y(a, b, c)];
    };
    comp.magnitude = v => {
      // Assumes 3D vector as input
      return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    };
    comp.scalar_mult = (v, s) => {
      // Assumes 3D vector as input
      return [v[0] * s, v[1] * s, v[2] * s];
    };
    comp.dot_mult = (v1, v2) => {
      return v2[0] * v1[0] + v2[1] * v1[1] + v2[2] * v1[2];
    };
    comp.vector_add = (v2, v1) => {
      return [v2[0] + v1[0], v2[1] + v1[1], v2[2] + v1[2]];
    };
    comp.vector_sub = (v2, v1) => {
      return [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
    };
    comp.pos_vec = point => {
      return [sliders["x" + point].Value(), sliders["y" + point].Value(), sliders["z" + point].Value()];
    };
    comp.v_AC = () => {
      //return [sliders.xC.Value() - sliders.xA.Value(), sliders.yC.Value() - sliders.yA.Value(), sliders.zC.Value() - sliders.zA.Value()];
      return comp.vector_sub(comp.pos_vec("C"), comp.pos_vec("A"));
    };
    comp.v_AB = () => {
      //return [sliders.xB.Value() - sliders.xA.Value(), sliders.yB.Value() - sliders.yA.Value(), sliders.zB.Value() - sliders.zA.Value()];
      return comp.vector_sub(comp.pos_vec("B"), comp.pos_vec("A"));
    };
    comp.unit_vector = v => {
      // Assumes 3D vector as input
      let mag = comp.magnitude(v);
      if (mag != 0) return [v[0] / mag, v[1] / mag, v[2] / mag];
      else return [0, 0, 0];
    };
    comp.v_F = () => {
      return comp.scalar_mult(comp.unit_vector(comp.v_AC()), sliders.f.Value());
    };
    comp.theta = () => {
      let v1 = comp.v_AC();
      let v2 = comp.v_AB();
      return comp.degrees(Math.acos(comp.dot_mult(v1, v2) / (comp.magnitude(v1) * comp.magnitude(v2))));
    };
    comp.mag_proj = () => {
      let v1 = comp.v_F();
      let v2 = comp.v_AB();
      let scalar = comp.dot_mult(v1, v2) / comp.dot_mult(v2, v2);
      return comp.magnitude(comp.scalar_mult(v2, scalar));
    };

    for (let data of [
      /* [x offset from left side, y coordinate, [label, function, unit], valCheck arg 1, valCheck arg 2, color] */
      [0, INTERVAL * 14, ["\u03b8", comp.theta, "\u00b0"], "proj_force", "on", "red"],
      [10, INTERVAL * 14, ["F_{AB}", comp.mag_proj, ""], "proj_force", "on", "red"]
    ]) {
      bL.create(
        "text",
        [
          -15 + data[0],
          TOP_Y + data[1],
          () => {
            let x = data[2][1]();
            return (
              "<span style='color:" +
              data[5] +
              "'><i>" +
              data[2][0] +
              "</i> = </span>" +
              Math.round(x * 100, 3) / 100 +
              " <span style='color:" +
              data[5] +
              "'><b>" +
              data[2][2] +
              "</b></span>"
            );
          }
        ],
        { fontSize: LABEL_SIZE, fixed: true, visible: valCheck(data[3], data[4]), anchorX: "left", anchorY: "top" }
      );
    }

    let points = {};
    const hiddenProps = { fixed: true, visible: false, showInfobox: false };
    const hiddenLabelProps = { fixed: true, visible: true, withLabel: true, size: 0, showInfobox: false };
    const lineSegProps = { straightFirst: false, straightLast: false };
    // const COPY = bR.create("transform", [0, 0], { type: "translate" });

    // axes (x, y, z)
    const axisLength = 10;
    const axisProps = { strokeColor: "black", strokeWidth: 3, ...lineSegProps, lastArrow: true };
    bR.create(
      "line",
      [
        () => {
          return comp.xy(-axisLength, 0, 0);
        },
        () => {
          return comp.xy(axisLength, 0, 0);
        }
      ],
      { ...axisProps, point2: { ...hiddenLabelProps, name: "x" } }
    );
    bR.create(
      "line",
      [
        () => {
          return comp.xy(0, -axisLength, 0);
        },
        () => {
          return comp.xy(0, axisLength, 0);
        }
      ],
      { ...axisProps, point2: { ...hiddenLabelProps, name: "y" } }
    );
    bR.create(
      "line",
      [
        () => {
          return comp.xy(0, 0, -axisLength);
        },
        () => {
          return comp.xy(0, 0, axisLength);
        }
      ],
      { ...axisProps, point2: { ...hiddenLabelProps, name: "z" } }
    );

    for (let data of [
      ["A", "blue"],
      ["B", "green"],
      ["C", "orange"]
    ]) {
      points[data[0]] = bR.create(
        "point",
        [
          () => {
            return comp.x(sliders["x" + data[0]].Value(), sliders["y" + data[0]].Value(), sliders["z" + data[0]].Value());
          },
          () => {
            return comp.y(sliders["x" + data[0]].Value(), sliders["y" + data[0]].Value(), sliders["z" + data[0]].Value());
          }
        ],
        { name: data[0], fillColor: data[1], strokeColor: data[1], size: 5, label: { strokeColor: data[1] } }
      );
    }

    bR.create("line", [points.A, points.B], { ...lineSegProps, strokeColor: "black", dash: 2, strokeWidth: 2, visible: valCheck("show_AB", "on") });
    bR.create("line", [points.A, points.C], { ...lineSegProps, strokeColor: "black", dash: 2, strokeWidth: 2, visible: valCheck("show_AC", "on") });

    points.F = bR.create(
      "point",
      [
        () => {
          return comp.x.apply(null, comp.vector_add(comp.v_F(), comp.pos_vec("A")));
          //return comp.x.apply(null, comp.vector_add(comp.scalar_mult(comp.unit_vector(comp.v_AC()), sliders.f.Value()), comp.pos_vec("A")));
        },
        () => {
          return comp.y.apply(null, comp.vector_add(comp.v_F(), comp.pos_vec("A")));
          //return comp.y.apply(null, comp.vector_add(comp.scalar_mult(comp.unit_vector(comp.v_AC()), sliders.f.Value()), comp.pos_vec("A")));
        }
      ],
      { ...hiddenProps }
    );

    bR.create("line", [points.A, points.F], {
      ...lineSegProps,
      strokeColor: "red",
      strokeWidth: 3,
      lastArrow: true,
      visible: valCheck("show_F", "on")
    });

    points.proj = bR.create(
      "point",
      [
        () => {
          let v1 = comp.v_F();
          let v2 = comp.v_AB();
          let scalar = comp.dot_mult(v1, v2) / comp.dot_mult(v2, v2);
          // console.log(comp.magnitude(comp.scalar_mult(v2, scalar)));
          return comp.x.apply(null, comp.vector_add(comp.scalar_mult(v2, scalar), comp.pos_vec("A")));
        },
        () => {
          let v1 = comp.v_F();
          let v2 = comp.v_AB();
          let scalar = comp.dot_mult(v1, v2) / comp.dot_mult(v2, v2);
          return comp.y.apply(null, comp.vector_add(comp.scalar_mult(v2, scalar), comp.pos_vec("A")));
        }
      ],
      { ...hiddenProps }
    );

    bR.create("line", [points.A, points.proj], {
      ...lineSegProps,
      strokeColor: "purple",
      strokeWidth: 3,
      lastArrow: true,
      visible: valCheck("proj_force", "on")
    });

    bR.create("line", [points.F, points.proj], {
      ...lineSegProps,
      strokeColor: "black",
      strokeWidth: 3,
      dash: 2,
      visible: valCheck("proj_force", "on")
    });

    bR.create("polygon", [points.A, points.F, points.proj], {
      visible: valCheck("proj_force", "on"),
      withLines: false,
      fillColor: "blue"
    });

    let angle = bR.create("angle", [points.F, points.A, points.proj], { name: "\u03b8", strokeColor: "red", label: { strokeColor: "red" } });
    angle.setAttribute({
      visible: () => {
        return valCheck("proj_force", "on")() && angle.Value() < Math.PI;
      }
    });
    let angle2 = bR.create("angle", [points.proj, points.A, points.F], { name: "\u03b8", strokeColor: "red", label: { strokeColor: "red" } });
    angle2.setAttribute({
      visible: () => {
        return valCheck("proj_force", "on")() && angle2.Value() <= Math.PI;
      }
    });

    bL.addChild(bR);
    bR.addChild(bL);
    this.bL = bL;
    this.bR = bR;
    this.changeState(0);
  },
  methods: {
    changeState(newState) {
      // Handle state specific changes

      // Update the current state
      this.state = newState;

      // Align text and enable/disable components
      this.fixTextAlignment();
      this.toggleButtons();
      this.bL.fullUpdate();
      //this.bR.fullUpdate();
    },
    fixTextAlignment() {
      for (const lbl of Object.keys(this.textToUpdate)) {
        this.textToUpdate[lbl].object.setText("");
        this.textToUpdate[lbl].object.setText(this.textToUpdate[lbl].formula);
      }
      // Also does buttons
      for (const lbl of Object.keys(this.objectsToEnable)) {
        // console.log(lbl);
        this.objectsToEnable[lbl].object[this.objectsToEnable[lbl].component].disabled = this.objectsToEnable[lbl].formula();
      }
    },
    toggleButtons() {
      for (const lbl of Object.keys(this.values)) {
        const currVal = this.values[lbl];
        for (const option of Object.keys(this.buttonsToToggle[lbl])) {
          if (currVal === option) {
            if (!this.buttonsToToggle[lbl][option].rendNodeButton.classList.contains("btn-warning"))
              this.buttonsToToggle[lbl][option].rendNodeButton.classList.add("btn-warning");
          } else {
            if (this.buttonsToToggle[lbl][option].rendNodeButton.classList.contains("btn-warning"))
              this.buttonsToToggle[lbl][option].rendNodeButton.classList.remove("btn-warning");
          }
        }
      }
    }
  }
};
</script>

<style>
button:disabled {
  opacity: 0.5;
  /* visibility: hidden; */
}
input:disabled {
  opacity: 0.7;
  /* visibility: hidden; */
}
</style>
