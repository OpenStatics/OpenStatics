<template>
  <div class="container-fluid">
    <div class="row my-3 justify-content-center">
      <div id="boxLeft" class="boxLeft my-2" style="width:425px; height:700px;"></div>
      <div id="boxRight" class="boxRight my-2" style="width:700px; height:700px;"></div>
    </div>
  </div>
</template>

<script>
import { InputHandler } from "../../../classes/InputHandler.js";
import { CircleSlider } from "../../../classes/CircleSlider.js";
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
      boundingbox: [-4, 4, 4, -4],
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

    const INTERVAL = -5;
    // Generate sliders, along with their related components
    // Can either have textbox + update button, or on/off system
    const TOP_Y = 12;
    const LEFT_X = -1;
    const RIGHT_X = 5;

    const INITIAL_VALUES = { rotation: "off", coords: "on", show_r: "on", show_f: "on", show_m: "on" };
    let IH = new InputHandler(bL, INTERVAL, TOP_Y, LEFT_X, RIGHT_X, LABEL_SIZE, INITIAL_VALUES, 0);
    this.IH = IH;

    for (let data of [
      /* [key value,
          label name,
          y position,
          true: update button | false: on/off,
          [min, start, max] (if true) | [lbl1, val1, lbl2, val2] (if false),
          [allowed states],
          color ]*/
      /* For just text: [false, label name, mathJax] */
      ["rotation", "Rotate Axes", INTERVAL * 0, false, ["On", "on", "Off", "off"], [0]],
      ["coords", "Coordinate Visibility", INTERVAL * 0.5, false, ["On", "on", "Off", "off"], [0]],
      ["d", "Diameter of Lid", INTERVAL * 1, true, [0, 1, 2.5], [0], "red"],
      ["a", "Angle of Lid, alpha", INTERVAL * 2, true, [0, 30, 90], [0], "blue"],
      ["b", "Angle of Point A, beta", INTERVAL * 3, true, [-90, 30, 90], [0], "green"],
      ["show_r", "Show Vector <b>r</b>", INTERVAL * 4, false, ["On", "on", "Off", "off"], [0]],
      ["show_f", "Show Force <b>F</b>=450", INTERVAL * 4.5, false, ["On", "on", "Off", "off"], [0]],
      ["show_m", "Show Moment <b>M</b>_O", INTERVAL * 5, false, ["On", "on", "Off", "off"], [0]]
    ]) {
      IH.generate(data, sliders);
    }

    // Handles circle gliders
    let CSProps = {};
    for (let key of ["circle", "glider", "textLabel"]) CSProps[key] = { visible: IH.valCheck("rotation", "on") };
    let circleSlides = {};
    for (let data of [
      ["tx", 8 * 0.4, -8 * 0.4, 1 * 0.4, 250, "\u03b8_x"],
      ["ty", 5 * 0.4, -8 * 0.4, 1 * 0.4, 180, "\u03b8_y"],
      ["tz", 2 * 0.4, -8 * 0.4, 1 * 0.4, 150, "\u03b8_z"]
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

    comp.vec_r = () => {
      let y = Math.cos(comp.radians(sliders.a.Value()));
      let z = Math.sin(comp.radians(sliders.a.Value()));
      return comp.scalar_mult([0, y, z], sliders.d.Value());
    };
    comp.vec_far_flat = () => {
      return [0, sliders.d.Value(), 0];
    };
    comp.vec_center_tilt = () => {
      return comp.scalar_mult(comp.vec_r(), 0.5);
    };
    comp.vec_center_flat = () => {
      return comp.scalar_mult([0, 1, 0], 0.5 * sliders.d.Value());
    };
    comp.vec_A = () => {
      let y = Math.cos(comp.radians(sliders.b.Value()));
      let x = Math.sin(comp.radians(sliders.b.Value()));
      return comp.vector_add(comp.vec_center_flat(), comp.scalar_mult([x, y, 0], sliders.d.Value() * 0.5));
    };
    comp.vec_F = () => {
      return comp.vector_sub(comp.vec_r(), comp.vec_A());
    };
    comp.moment = () => {
      let u = comp.cross_prod(comp.vec_r(), comp.vec_F());
      u = comp.unit_vector(u);
      return comp.scalar_mult(u, (sliders.d.Value() * 450) / 500);
    };

    let points = {};
    const hidden = { fixed: true, visible: false };
    const hiddenLabel = { fixed: true, visible: true, withLabel: true, size: 0 };
    const lineSegProps = { straightFirst: false, straightLast: false, fixed: true };
    const COPY = bR.create("transform", [0, 0], { type: "translate" });

    points.origin = bR.create(
      "point",
      [
        () => {
          return comp.x(0, 0, 0);
        },
        () => {
          return comp.y(0, 0, 0);
        }
      ],
      { ...hidden }
    );

    // axes (x, y, z)
    const axisLength = 4;
    const axisProps = { strokeColor: "black", strokeWidth: 3, ...lineSegProps, lastArrow: true };
    for (let data of [
      [axisLength, 0, 0, "x"],
      [0, axisLength, 0, "y"],
      [0, 0, axisLength, "z"]
    ]) {
      bR.create(
        "line",
        [
          () => {
            return comp.xy(-data[0], -data[1], -data[2]);
          },
          () => {
            return comp.xy(data[0], data[1], data[2]);
          }
        ],
        {
          ...axisProps,
          point2: { ...hiddenLabel, name: data[3], label: { fontSize: 18, visible: IH.valCheck("coords", "on") } },
          visible: IH.valCheck("coords", "on")
        }
      );
    }

    points.R = bR.create(
      "point",
      [
        () => {
          return comp.x.apply(null, comp.vec_r());
        },
        () => {
          return comp.y.apply(null, comp.vec_r());
        }
      ],
      {
        ...hiddenLabel,
        visible: IH.valCheck("show_r", "on"),
        name: "<b>r</b>",
        label: { visible: IH.valCheck("show_r", "on"), fontSize: LABEL_SIZE - 4, strokeColor: "black", offset: [0, 0] }
      }
    );

    bR.create("line", [points.origin, points.R], {
      ...lineSegProps,
      strokeColor: "black",
      visible: IH.valCheck("show_r", "on"),
      strokeWidth: 3,
      lastArrow: true
    });

    points.center_flat = bR.create(
      "point",
      [
        () => {
          return comp.x.apply(null, comp.vec_center_flat());
        },
        () => {
          return comp.y.apply(null, comp.vec_center_flat());
        }
      ],
      { ...hidden }
    );

    points.A = bR.create(
      "point",
      [
        () => {
          return comp.x.apply(null, comp.vec_A());
        },
        () => {
          return comp.y.apply(null, comp.vec_A());
        }
      ],
      { ...hidden }
    );
    console.log(comp.moment());
    // console.log(comp.vec_A());

    points.F = bR.create("point", [points.R, COPY], {
      ...hiddenLabel,
      visible: IH.valCheck("show_f", "on"),
      name: "<b>F</b>",
      label: { visible: IH.valCheck("show_f", "on"), fontSize: LABEL_SIZE - 4, strokeColor: "red" }
    });

    bR.create("line", [points.A, points.F], {
      ...lineSegProps,
      strokeColor: "red",
      visible: IH.valCheck("show_f", "on"),
      strokeWidth: 3,
      lastArrow: true
    });

    points.M = bR.create(
      "point",
      [
        () => {
          return comp.x.apply(null, comp.moment());
        },
        () => {
          return comp.y.apply(null, comp.moment());
        }
      ],
      {
        ...hiddenLabel,
        visible: IH.valCheck("show_m", "on"),
        name: "<b>M_O</b>",
        label: { visible: IH.valCheck("show_m", "on"), fontSize: LABEL_SIZE - 4, strokeColor: "purple" }
      }
    );

    bR.create("line", [points.origin, points.M], {
      ...lineSegProps,
      strokeColor: "purple",
      visible: IH.valCheck("show_m", "on"),
      strokeWidth: 3,
      lastArrow: true
    });

    for (let data of [
      ["1", 1, 0],
      ["2", 0, 1],
      ["3", -1, 0],
      ["4", 0, -1],
      ["5", comp.radians(45), -comp.radians(45)]
    ]) {
      points["elip1" + data[0]] = bR.create(
        "point",
        [
          () => {
            let center = comp.vec_center_flat();
            let u1 = comp.scalar_mult([0, 1, 0], data[1]);
            let u2 = comp.scalar_mult([1, 0, 0], data[2]);
            let u = comp.scalar_mult(comp.vector_add(u1, u2), sliders.d.Value() * 0.5);
            return comp.x.apply(null, comp.vector_add(center, u));
          },
          () => {
            let center = comp.vec_center_flat();
            let u1 = comp.scalar_mult([0, 1, 0], data[1]);
            let u2 = comp.scalar_mult(comp.unit_vector([1, 0, 0]), data[2]);
            let u = comp.scalar_mult(comp.vector_add(u1, u2), sliders.d.Value() * 0.5);
            return comp.y.apply(null, comp.vector_add(center, u));
          }
        ],
        { ...hidden }
      );
    }
    /*let conic = */

    bR.create("conic", [points.elip11, points.elip12, points.elip13, points.elip14, points.elip15], {
      strokeColor: "grey",
      strokeWidth: 4,
      fillColor: "grey"
    });

    for (let data of [
      ["1", 1, 0],
      ["2", 0, 1],
      ["3", -1, 0],
      ["4", 0, -1],
      ["5", comp.radians(45), -comp.radians(45)]
    ]) {
      points["elip2" + data[0]] = bR.create(
        "point",
        [
          () => {
            let center = comp.vec_center_tilt();
            let u1 = comp.scalar_mult(comp.unit_vector(comp.vec_r()), data[1]);
            let u2 = comp.scalar_mult(comp.unit_vector([1, 0, 0]), data[2]);
            let u = comp.scalar_mult(comp.vector_add(u1, u2), sliders.d.Value() * 0.5);
            return comp.x.apply(null, comp.vector_add(center, u));
          },
          () => {
            let center = comp.vec_center_tilt();
            let u1 = comp.scalar_mult(comp.unit_vector(comp.vec_r()), data[1]);
            let u2 = comp.scalar_mult(comp.unit_vector([1, 0, 0]), data[2]);
            let u = comp.scalar_mult(comp.vector_add(u1, u2), sliders.d.Value() * 0.5);
            return comp.y.apply(null, comp.vector_add(center, u));
          }
        ],
        { ...hidden }
      );
    }
    /*let conic = */

    bR.create("conic", [points.elip21, points.elip22, points.elip23, points.elip24, points.elip25], {
      strokeColor: "green",
      strokeWidth: 4,
      fillColor: "green"
    });

    // points.far_flat = bR.create(
    //   "point",
    //   [
    //     () => {
    //       return comp.x.apply(null, comp.vec_far_flat());
    //     },
    //     () => {
    //       return comp.y.apply(null, comp.vec_far_flat());
    //     }
    //   ],
    //   { name: "ff" }
    // );

    // bR.create("angle", [points.A, points.center_flat, points.far_flat], { strokeColor: "gold", name: "beta" });
    bL.create(
      "text",
      [
        -15 + 0,
        TOP_Y + INTERVAL * 5.5,
        () => {
          let u = comp.unit_vector(comp.moment());
          return (
            "<span style='color:purple'><i>M</i> = </span>" +
            Math.round(comp.magnitude(comp.moment()) * 1000) / 1000 +
            " {" +
            Math.round(u[0] * 10000) / 10000 +
            ", " +
            Math.round(u[1] * 10000) / 10000 +
            ", " +
            Math.round(u[2] * 10000) / 10000 +
            "}"
          );
        }
      ],
      { fontSize: LABEL_SIZE, fixed: true, anchorX: "left", anchorY: "top", visible: IH.valCheck("show_m", "on") }
    );

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
