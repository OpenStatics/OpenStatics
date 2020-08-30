<template>
  <div class="container-fluid">
    <div class="row my-3 justify-content-center">
      <div id="boxLeft" class="boxLeft my-2" style="width:425px; height:800px;"></div>

      <div id="boxRight" class="boxRight my-2" style="width:800px; height:800px;"></div>
    </div>
  </div>
</template>

<script>
import { CircleSlider } from "../../../classes/CircleSlider.js";
import { InputHandler } from "../../../classes/InputHandler.js";
export default {
  components: {},
  data: () => {
    return {
      IH: undefined,
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
    this.bL = bL;
    this.bR = bR;

    let sliders = {};
    const LABEL_SIZE = 18;

    const INTERVAL = -3.5;
    // Generate sliders, along with their related components
    // Can either have textbox + update button, or on/off system
    const TOP_Y = 12.5;
    const LEFT_X = -1;
    const RIGHT_X = 5;

    const INITIAL_VALUES = { rotation: "off", show_AB: "off", show_AC: "off", show_F: "off", proj_force: "off" };
    let IH = new InputHandler(bL, INTERVAL, TOP_Y, LEFT_X, RIGHT_X, LABEL_SIZE, INITIAL_VALUES, 0);
    this.IH = IH;

    for (let data of [
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
      IH.generate(data, sliders);
    }

    // Handles circle gliders
    let CSProps = {};
    for (let key of ["circle", "glider", "textLabel"]) CSProps[key] = { visible: IH.valCheck("rotation", "on") };
    let circleSlides = {};
    for (let data of [
      ["tx", 8, -8, 1, 250, "\u03b8_x"],
      ["ty", 5, -8, 1, 180, "\u03b8_y"],
      ["tz", 2, -8, 1, 150, "\u03b8_z"]
    ]) {
      circleSlides[data[0]] = new CircleSlider(bR, data[0], data[1], data[2], data[3], data[4], data[5], IH.textToUpdate, CSProps);
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
        { fontSize: LABEL_SIZE, fixed: true, visible: IH.valCheck(data[3], data[4]), anchorX: "left", anchorY: "top" }
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

    bR.create("line", [points.A, points.B], {
      ...lineSegProps,
      strokeColor: "black",
      dash: 2,
      strokeWidth: 2,
      visible: IH.valCheck("show_AB", "on")
    });
    bR.create("line", [points.A, points.C], {
      ...lineSegProps,
      strokeColor: "black",
      dash: 2,
      strokeWidth: 2,
      visible: IH.valCheck("show_AC", "on")
    });

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
      visible: IH.valCheck("show_F", "on")
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
      visible: IH.valCheck("proj_force", "on")
    });

    bR.create("line", [points.F, points.proj], {
      ...lineSegProps,
      strokeColor: "black",
      strokeWidth: 3,
      dash: 2,
      visible: IH.valCheck("proj_force", "on")
    });

    bR.create("polygon", [points.A, points.F, points.proj], {
      visible: IH.valCheck("proj_force", "on"),
      withLines: false,
      fillColor: "blue"
    });

    let angle = bR.create("angle", [points.F, points.A, points.proj], { name: "\u03b8", strokeColor: "red", label: { strokeColor: "red" } });
    angle.setAttribute({
      visible: () => {
        return IH.valCheck("proj_force", "on")() && angle.Value() < Math.PI;
      }
    });
    let angle2 = bR.create("angle", [points.proj, points.A, points.F], { name: "\u03b8", strokeColor: "red", label: { strokeColor: "red" } });
    angle2.setAttribute({
      visible: () => {
        return IH.valCheck("proj_force", "on")() && angle2.Value() <= Math.PI;
      }
    });

    bL.addChild(bR);
    bR.addChild(bL);
    this.changeState(0);
  },
  methods: {
    changeState(newState) {
      this.IH.updateState(newState);
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
