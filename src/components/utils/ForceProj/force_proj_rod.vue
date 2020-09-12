<template>
  <div class="container-fluid">
    <div class="row my-3 justify-content-center">
      <div id="boxLeft" class="boxLeft my-2" style="width:425px; height:700px;"></div>

      <div id="boxRight" class="boxRight my-2" style="width:700px; height:700px;"></div>
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
    bL.resizeContainer(425, 700);

    const bR = JXG.JSXGraph.initBoard("boxRight", {
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
    bR.resizeContainer(700, 700);

    // All sliders are stored in these objects
    // They can be accessed with brackets sliders["force"] or dot notation sliders.force
    this.bL = bL;
    this.bR = bR;

    let sliders = {};
    const LABEL_SIZE = 18;

    const INTERVAL = -4.5;
    // Generate sliders, along with their related components
    // Can either have textbox + update button, or on/off system
    const TOP_Y = 12;
    const LEFT_X = -1;
    const RIGHT_X = 5;

    const INITIAL_VALUES = { rotation: "off", proj_force: "off" };
    let IH = new InputHandler(bL, INTERVAL, TOP_Y, LEFT_X, RIGHT_X, LABEL_SIZE, INITIAL_VALUES, 0);
    this.IH = IH;

    for (let data of [
      ["rotation", "Rotate Axes", INTERVAL * -0.5, false, ["On", "on", "Off", "off"], [0]],
      [false, "<b>Distance from C along Rod</b>:", INTERVAL * 0, false],
      ["R", "R", INTERVAL * 0.5, true, [0, 4, 6], [0], "black"],
      [false, "<b>Point C Coordinates</b>:", INTERVAL * 1.5, false],
      ["xC", "x_C", INTERVAL * 2, true, [-6, -1, 6], [0], "blue"],
      ["yC", "y_C", INTERVAL * 3, true, [-6, 5, 6], [0], "blue"],
      [false, "<b>Point D Coordinates</b>:", INTERVAL * 4, false],
      ["xD", "x_D", INTERVAL * 4.5, true, [-6, 2, 6], [0], "green"],
      ["yD", "y_D", INTERVAL * 5.5, true, [-6, 5, 6], [0], "green"],
      [false, "<b>Magnitude of Force</b>:", INTERVAL * 6.5, false],
      ["F", "|F|", INTERVAL * 7, true, [-10, 2, 10], [0], "red"],
      ["proj_force", "Projection of Force", INTERVAL * 8, false, ["On", "on", "Off", "off"], [0]]
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
    comp.cross_prod = (u, v) => {
      let u1 = u[0],
        u2 = u[1],
        u3 = u[2],
        v1 = v[0],
        v2 = v[1],
        v3 = v[2];
      return [u2 * v3 - v2 * u3, -(u1 * v3 - v1 * u3), u1 * v2 - v1 * u2];
    };
    comp.vector_add = (v2, v1) => {
      return [v2[0] + v1[0], v2[1] + v1[1], v2[2] + v1[2]];
    };
    comp.vector_sub = (v2, v1) => {
      return [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
    };
    comp.unit_vector = v => {
      // Assumes 3D vector as input
      let mag = comp.magnitude(v);
      if (mag != 0) return [v[0] / mag, v[1] / mag, v[2] / mag];
      else return [0, 0, 0];
    };
    comp.v_A = () => {
      return [0, 0, 4];
    };
    comp.v_C = () => {
      return [sliders["xC"].Value(), sliders["yC"].Value(), 0];
    };
    comp.v_D = () => {
      return [sliders["xD"].Value(), sliders["yD"].Value(), 0];
    };
    comp.v_Cx = () => {
      return [sliders["xC"].Value(), 0, 0];
    };
    comp.v_Cy = () => {
      return [0, sliders["yC"].Value(), 0];
    };
    comp.v_Dx = () => {
      return [sliders["xD"].Value(), 0, 0];
    };
    comp.v_Dy = () => {
      return [0, sliders["yD"].Value(), 0];
    };
    comp.v_AC = () => {
      return comp.vector_sub(comp.v_C(), comp.v_A());
    };
    comp.v_B = () => {
      let newV = comp.scalar_mult(comp.unit_vector(comp.v_AC()), sliders.R.Value());
      return comp.vector_add(newV, comp.v_A());
    };
    comp.v_BD = () => {
      return comp.vector_sub(comp.v_D(), comp.v_B());
    };
    comp.max_R = () => {
      return comp.magnitude(comp.v_AC());
    };
    comp.v_F = () => {
      let newV = comp.scalar_mult(comp.unit_vector(comp.v_BD()), sliders.F.Value());
      return comp.vector_add(newV, comp.v_B());
    };
    comp.v_F_par = () => {
      let v1 = comp.vector_sub(comp.v_F(), comp.v_B());
      let v2 = comp.vector_sub(comp.v_C(), comp.v_B());
      let cosT = comp.dot_mult(v1, v2) / (comp.magnitude(v1) * comp.magnitude(v2));
      return comp.scalar_mult(comp.unit_vector(v2), cosT * comp.magnitude(v1));
    };
    comp.v_F_par_pos = () => {
      return comp.vector_add(comp.v_F_par(), comp.v_B());
    };
    comp.v_F_perp = () => {
      let v1 = comp.vector_sub(comp.v_F(), comp.v_B());
      let v2 = comp.v_F_par();
      let normal = comp.cross_prod(v1, v2);
      let normal2 = comp.cross_prod(normal, v2);
      let scalar = Math.sqrt(Math.pow(comp.magnitude(v1), 2) - Math.pow(comp.magnitude(v2), 2));
      return comp.scalar_mult(comp.unit_vector(normal2), -scalar);
    };
    comp.v_F_perp_pos = () => {
      return comp.vector_add(comp.v_F_perp(), comp.v_B());
    };
    comp.mag_par = () => {
      return comp.magnitude(comp.v_F_par()) * (sliders.F.Value() >= 0 ? 1 : -1);
    };
    comp.mag_perp = () => {
      return comp.magnitude(comp.v_F_perp());
    };

    for (let data of [
      /* [x offset from left side, y coordinate, [label, function, unit], valCheck arg 1, valCheck arg 2, color] */
      [0, INTERVAL * 8.5, ["F_{||}", comp.mag_par, ""], "proj_force", "on", "red"],
      [10, INTERVAL * 8.5, ["F_{\u27C2}", comp.mag_perp, ""], "proj_force", "on", "red"]
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
      [axisLength, axisLength, "Q1"],
      [-axisLength, axisLength, "Q2"],
      [-axisLength, -axisLength, "Q3"],
      [axisLength, -axisLength, "Q4"]
    ]) {
      points[data[2]] = bR.create(
        "point",
        [
          () => {
            return comp.x(data[0], data[1], 0);
          },
          () => {
            return comp.y(data[0], data[1], 0);
          }
        ],
        //{ size: 8, name: data[2] }
        { ...hiddenProps }
      );
    }

    bR.create("polygon", [points.Q1, points.Q2, points.Q3, points.Q4], {
      fillColor: "gray",
      borders: { strokeColor: "black", strokeWidth: 1, highlight: false },
      highlight: false
    });

    for (let data of [
      ["A", "black", true],
      ["C", "blue", true],
      ["D", "green", true],
      ["B", "black", true],
      ["Cx", "black", false],
      ["Cy", "black", false],
      ["Dx", "black", false],
      ["Dy", "black", false],
      ["F", "black", false],
      ["F_par_pos", "black", false],
      ["F_perp_pos", "black", false]
    ]) {
      let props = data[2] ? { name: data[0], strokeColor: data[1], fillColor: data[1], label: { strokeColor: data[1] } } : hiddenProps;
      points[data[0]] = bR.create(
        "point",
        [
          () => {
            return comp.x.apply(null, comp["v_" + data[0]]());
          },
          () => {
            return comp.y.apply(null, comp["v_" + data[0]]());
          }
        ],
        { ...props }
      );
    }

    for (let data of [
      ["Cx", "C"],
      ["Cy", "C"],
      ["Dx", "D"],
      ["Dy", "D"],
      ["B", "D"]
    ]) {
      bR.create("line", [points[data[0]], points[data[1]]], { ...lineSegProps, strokeColor: "black", dash: 2, strokeWidth: 2 });
    }

    // console.log(sliders.R);
    // sliders.R.on("update", function(e, i) {
    //   console.log("hi");
    // });
    // sliders.R.on("move", function(e, i) {
    //   console.log("hello");
    // });
    for (let data of ["xC", "yC"]) {
      // eslint-disable-next-line no-unused-vars
      sliders[data].on("drag", function(e, i) {
        sliders.R.setMax(comp.max_R());
      });
    }

    bR.create("line", [points.A, points.C], { ...lineSegProps, strokeColor: "brown", strokeWidth: 3 });

    bR.create("line", [points.B, points.F], { ...lineSegProps, strokeColor: "red", lastArrow: true, strokeWidth: 3 });

    bR.create("line", [points.B, points.F_par_pos], {
      ...lineSegProps,
      strokeColor: "blue",
      lastArrow: true,
      strokeWidth: 3,
      visible: IH.valCheck("proj_force", "on")
    });

    bR.create("line", [points.B, points.F_perp_pos], {
      ...lineSegProps,
      strokeColor: "blue",
      lastArrow: true,
      strokeWidth: 3,
      visible: IH.valCheck("proj_force", "on")
    });

    bR.create("polygon", [points.B, points.F_perp_pos, points.F, points.F_par_pos], {
      withLines: false,
      fillColor: "#77b5fe",
      visible: IH.valCheck("proj_force", "on")
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
