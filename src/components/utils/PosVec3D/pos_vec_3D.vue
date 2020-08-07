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
      <div id="boxLeft" class="boxLeft my-2" style="width:425px; height:700px;"></div>

      <div id="boxRight" class="boxRight my-2" style="width:700px; height:700px;"></div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => {
    return {
      state: 0,
      values: {
        pointA: "off",
        pointB: "off",
        pos_vec: "off",
        comps: "off",
        rotation: "off"
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
    bL.resizeContainer(425, 700);

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
    bR.resizeContainer(700, 700);
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

    let stateCheck = states => {
      return () => {
        return states.includes(this.state);
      };
    };

    let stateValCheck = (states, value, target) => {
      return () => {
        return states.includes(this.state) && valCheck(value, target)();
      };
    };

    const INTERVAL = -4.25;
    // Generate sliders, along with their related components
    // Can either have textbox + update button, or on/off system
    const TOP_Y = 12;
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
      ["pointA", "Show point A", INTERVAL * 3.5, false, ["On", "on", "Off", "off"], [0]],
      [false, "<b>Point B Coordinates</b>:", INTERVAL * 4.25, false],
      ["xB", "x_B", INTERVAL * 4.75, true, [-5, 3, 5], [0], "green"],
      ["yB", "y_B", INTERVAL * 5.75, true, [-5, 3, 5], [0], "green"],
      ["zB", "z_B", INTERVAL * 6.75, true, [-5, 3, 5], [0], "green"],
      ["pointB", "Show point B", INTERVAL * 7.75, false, ["On", "on", "Off", "off"], [0]],
      ["pos_vec", "<b>Position Vector</b>", INTERVAL * 8.5, false, ["On", "on", "Off", "off"], [0]],
      ["comps", "Components", INTERVAL * 9, false, ["On", "on", "Off", "off"], [0]]
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

    let glideVal = root => {
      // convert position on circle to angle in radians
      let cS = circleSlides[root];
      let angleRad = Math.acos((cS.glider.X() - cS.center.X()) / cS.circle.Radius());
      angleRad = cS.glider.Y() - cS.center.Y() >= 0 ? angleRad : Math.PI * 2 - angleRad;
      return (Math.round((angleRad * 180) / Math.PI) * Math.PI) / 180;
    };

    // Completely functional, can't find a usage
    // let setGlideVal = (root, deg) => {
    //   let cS = circleSlides[root];
    //   let radius = cS.circle.Radius();
    //   cS.glider.setPositionDirectly(JXG.COORDS_BY_USER, [
    //     radius * Math.cos((deg * Math.PI) / 180) + cS.center.X(),
    //     radius * Math.sin((deg * Math.PI) / 180) + cS.center.Y()
    //   ]);
    // };

    let circleSlides = {};
    for (let data of [
      ["tx", 8, -8, 1, 250, "\u03b8_x"],
      ["ty", 5, -8, 1, 180, "\u03b8_y"],
      ["tz", 2, -8, 1, 150, "\u03b8_z"]
    ]) {
      circleSlides[data[0]] = {};
      let cS = circleSlides[data[0]];
      cS.center = bR.create("point", [data[1], data[2]], { fixed: true, visible: false, showInfobox: false });
      cS.circle = bR.create("circle", [cS.center, data[3]], { fixed: true, visible: valCheck("rotation", "on"), strokeColor: "black" });
      cS.glider = bR.create(
        "glider",
        [data[3] * Math.cos((data[4] * Math.PI) / 180) + data[1], data[3] * Math.sin((data[4] * Math.PI) / 180) + data[2], cS.circle],
        {
          name: data[5],
          showInfobox: false,
          visible: valCheck("rotation", "on"),
          strokeColor: "purple",
          fillColor: "purple",
          label: { strokeColor: "purple" }
        }
      );
      cS.label = bR.create("text", [data[1], data[2], ""], {
        digits: 0,
        fontSize: 12,
        fixed: true,
        anchorX: "middle",
        anchorY: "middle",
        visible: valCheck("rotation", "on"),
        strokeColor: "purple"
      });
      this.textToUpdate[data[0] + "_label"] = {
        object: cS.label,
        formula: () => {
          return Math.round((glideVal(data[0]) * 180) / Math.PI);
        }
      };
    }

    //setGlideVal("tz", 0);

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

    comp.xDiff = () => {
      return sliders.xB.Value() - sliders.xA.Value();
    };
    comp.yDiff = () => {
      return sliders.yB.Value() - sliders.yA.Value();
    };
    comp.zDiff = () => {
      return sliders.zB.Value() - sliders.zA.Value();
    };

    for (let data of [
      /* [x offset from left side, y coordinate, [label, function, unit], valCheck arg 1, valCheck arg 2, color] */
      [0, INTERVAL * 9.5, ["x_B - x_A", comp.xDiff, ""], "comps", "on", "red"],
      [10, INTERVAL * 9.5, ["y_B - y_A", comp.yDiff, ""], "comps", "on", "red"],
      [20, INTERVAL * 9.5, ["z_B - z_A", comp.zDiff, ""], "comps", "on", "red"]
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
              Math.round(x * 1000, 3) / 1000 +
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
    const COPY = bR.create("transform", [0, 0], { type: "translate" });

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

    for (let i = 0; i < 8; i++) {
      // Each i value converted to binary: 7 -> 111
      // Bit 1 -> x, Bit 2 -> y, Bit 3 -> z
      // 1 -> B, 0 -> A
      let d1 = (i & 4) / 4;
      let d2 = (i & 2) / 2;
      let d3 = (i & 1) / 1;
      let s1 = d1 === 1 ? "xB" : "xA";
      let s2 = d2 === 1 ? "yB" : "yA";
      let s3 = d3 === 1 ? "zB" : "zA";
      // console.log([d1, d2, d3]);
      points[String(i)] = bR.create(
        "point",
        [
          () => {
            return comp.x(sliders[s1].Value(), sliders[s2].Value(), sliders[s3].Value());
          },
          () => {
            return comp.y(sliders[s1].Value(), sliders[s2].Value(), sliders[s3].Value());
          }
        ],
        //{ visible: valCheck("comps", "on"), name: String(i) }
        { ...hiddenProps }
      );
    }

    // Dotted lines
    for (let data of [
      ["0", "1", false],
      ["0", "2", false],
      ["1", "3", false],
      ["2", "3", false],
      ["1", "5", false],
      ["3", "7", false],
      ["5", "7", false],
      ["2", "6", false],
      ["4", "5", false],
      ["0", "4", true],
      ["4", "6", true],
      ["6", "7", true]
    ]) {
      if (data[2] === false) {
        bR.create("line", [points[data[0]], points[data[1]]], {
          visible: valCheck("comps", "on"),
          ...lineSegProps,
          strokeColor: "black",
          strokeWidth: 3,
          dash: 2
        });
      } else {
        bR.create("line", [points[data[0]], points[data[1]]], {
          visible: valCheck("comps", "on"),
          ...lineSegProps,
          strokeColor: "red",
          strokeWidth: 3,
          lastArrow: true
        });
      }
    }

    for (let data of [
      [1 / 2, 0, 0, "x_B - x_A", [0, -5]],
      [1, 1 / 2, 0, "y_B - y_A", [5, 0]],
      [1, 1, 1 / 2, "z_B - z_A", [5, 0]]
    ]) {
      bR.create(
        "point",
        [
          () => {
            return comp.x(
              sliders.xA.Value() + data[0] * comp.xDiff(),
              sliders.yA.Value() + data[1] * comp.yDiff(),
              sliders.zA.Value() + data[2] * comp.zDiff()
            );
          },
          () => {
            return comp.y(
              sliders.xA.Value() + data[0] * comp.xDiff(),
              sliders.yA.Value() + data[1] * comp.yDiff(),
              sliders.zA.Value() + data[2] * comp.zDiff()
            );
          }
        ],
        { ...hiddenLabelProps, name: data[3], label: { fontSize: 14, strokeColor: "red", visible: valCheck("comps", "on"), offset: data[4] } }
      );
    }

    points.a = bR.create("point", [points["0"], COPY], {
      visible: valCheck("pointA", "on"),
      name: "<b>A</b>",
      strokeColor: "blue",
      fillColor: "blue",
      label: { strokeColor: "blue", fontSize: 16 }
    });
    points.b = bR.create("point", [points["7"], COPY], {
      visible: valCheck("pointB", "on"),
      name: "<b>B</b>",
      strokeColor: "green",
      fillColor: "green",
      label: { strokeColor: "green", fontSize: 16 }
    });

    bR.create("line", [points.a, points.b], {
      visible: valCheck("pos_vec", "on"),
      ...lineSegProps,
      strokeColor: "red",
      strokeWidth: 5,
      lastArrow: true
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
