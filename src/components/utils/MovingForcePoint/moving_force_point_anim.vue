<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <button class="btn btn-primary mx-3" :class="{ 'btn-warning': state === 1 }" @click="() => changeState(1)">
        Step 1
      </button>
      <button class="btn btn-primary mx-3" :class="{ 'btn-warning': state === 2 }" @click="() => changeState(2)">
        Step 2
      </button>
      <button class="btn btn-primary mx-3" :class="{ 'btn-warning': state === 3 }" @click="() => changeState(3)">
        Step 3
      </button>
    </div>
    <div class="row my-3 justify-content-center">
      <div id="boxLeft" class="boxLeft my-2" style="width:425px; height:800px;"></div>
      <div id="boxRight" class="boxRight my-2" style="width:800px; height:800px;"></div>
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
      sliders: undefined,
      state: 1,
      speed: 1,
      interval: null,
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
    bR.resizeContainer(800, 800);

    // All sliders are stored in these objects
    // They can be accessed with brackets sliders["force"] or dot notation sliders.force
    this.bL = bL;
    this.bR = bR;

    let sliders = {};
    const LABEL_SIZE = 18;

    const INTERVAL = -3.625;
    // Generate sliders, along with their related components
    // Can either have textbox + update button, or on/off system
    const TOP_Y = 12 - 3.75 * 0.5;
    const LEFT_X = -1;
    const RIGHT_X = 5;

    const INITIAL_VALUES = { direction: "forward", anim: "off", rotation: "off", coords: "on", replace: "off" };
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
      ["rotation", "Rotate Axes", INTERVAL * -1, false, ["On", "on", "Off", "off"], [1, 2, 3, 4]],
      ["coords", "Coordinate Visibility", INTERVAL * -0.5, false, ["On", "on", "Off", "off"], [1, 2, 3, 4]],
      [false, "<b>F_A location:</b>", INTERVAL * 0, false],
      ["Ax", "r_{Ax}", INTERVAL * 0.5, true, [-2, 0, 2], [1, 2, 3, 4], "blue"],
      ["Ay", "r_{Ay}", INTERVAL * 1.5, true, [-2, 0, 2], [1, 2, 3, 4], "blue"],
      ["Az", "r_{Az}", INTERVAL * 2.5, true, [-2, 0, 2], [1, 2, 3, 4], "blue"],
      [false, "<b>F_A specification:</b>", INTERVAL * 3.5, false],
      ["Fx", "F_{x}", INTERVAL * 4, true, [-2, 0, 2], [1, 2, 3, 4], "red"],
      ["Fy", "F_{y}", INTERVAL * 5, true, [-2, 0, 2], [1, 2, 3, 4], "red"],
      ["Fz", "F_{z}", INTERVAL * 6, true, [-2, 0, 2], [1, 2, 3, 4], "red"],
      [false, "<b>B location:</b>", INTERVAL * 7, false],
      ["Bx", "r_{Bx}", INTERVAL * 7.5, true, [-2, 0, 2], [2, 3, 4], "green"],
      ["By", "r_{By}", INTERVAL * 8.5, true, [-2, 0, 2], [2, 3, 4], "green"],
      ["Bz", "r_{Bz}", INTERVAL * 9.5, true, [-2, 0, 2], [2, 3, 4], "green"],
      [false, "<b>Show couple moment at</b>", INTERVAL * 10.5, false],
      ["replace", "<b>point B</b>", INTERVAL * 11, false, ["On", "on", "Off", "off"], [3]],
      ["time", "Time (sec)", INTERVAL * 11.5, true, [0, 0, 5], [3], "black"],
      ["anim", "Animation", INTERVAL * 12.5, false, ["\u23F5", "on", "\u23F8", "off"], [3]],
      ["direction", "Direction", INTERVAL * 13, false, ["Forward", "forward", "Reverse", "reverse"], [3]]
      //["add", "<b>with same magnitude</b>", INTERVAL * 11, false, ["On", "on", "Off", "off"], [3, 4]],
      //[false, "<b>Replace two forces with red color</b>", INTERVAL * 12, false],
      //["replace", "<b> as couple moment</b>", INTERVAL * 12.5, false, ["On", "on", "Off", "off"], [4]]
    ]) {
      IH.generate(data, sliders);
    }

    this.timeAdjustmentFunction = () => {
      let t = (() => {
        return 0.05 * this.speed * (IH.values.direction === "forward" ? 1 : -1);
      })();
      t = (t + sliders.time.Value() + 5) % 5;
      sliders.time.setValue(t);
      bL.fullUpdate();
    };

    IH.setCallback(() => {
      // Interval handling
      if (this.interval === null && this.IH.values.anim === "on") {
        this.interval = setInterval(this.timeAdjustmentFunction, 50);
      } else if (this.interval !== null && this.IH.values.anim === "off") {
        clearInterval(this.interval);
        this.interval = null;
      }
    });

    // Handles circle gliders
    let CSProps = {};
    for (let key of ["circle", "glider", "textLabel"]) CSProps[key] = { visible: IH.valCheck("rotation", "on") };
    let circleSlides = {};
    for (let data of [
      ["tx", 8 * 0.4, -8 * 0.4, 0.4, 250, "\u03b8_x"],
      ["ty", 5 * 0.4, -8 * 0.4, 0.4, 180, "\u03b8_y"],
      ["tz", 2 * 0.4, -8 * 0.4, 0.4, 150, "\u03b8_z"]
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
      return [sliders.Ax.Value(), sliders.Ay.Value(), sliders.Az.Value()];
    };
    comp.v_F = () => {
      return [sliders.Fx.Value(), sliders.Fy.Value(), sliders.Fz.Value()];
    };
    comp.v_B = () => {
      return [sliders.Bx.Value(), sliders.By.Value(), sliders.Bz.Value()];
    };
    comp.v_C = () => {
      let u = comp.scalar_mult(comp.v_A_to_B(), sliders.time.Value() / -5);
      return comp.vector_add(u, comp.v_A());
    };
    comp.moment = () => {
      let mA = comp.cross_prod(comp.v_A(), comp.v_F());
      let mB = comp.cross_prod(comp.v_B(), comp.scalar_mult(comp.v_F(), -1));
      return comp.vector_add(mA, mB);
    };
    comp.momentB = () => {
      return comp.cross_prod(comp.vector_sub(comp.v_C(), comp.v_B()), comp.v_F());
    };
    comp.momentC = () => {
      return comp.cross_prod(comp.vector_sub(comp.v_A(), comp.v_C()), comp.v_F());
    };
    comp.v_pos_center = () => {
      return comp.scalar_mult(comp.vector_add(comp.v_A(), comp.v_B()), 0.5);
    };
    comp.v_A_to_B = () => {
      return comp.vector_sub(comp.v_A(), comp.v_B());
    };
    comp.v_C_to_B = () => {
      return comp.vector_sub(comp.v_C(), comp.v_B());
    };
    comp.separation = () => {
      return comp.magnitude(comp.v_A_to_B());
    };
    comp.v_F_mag = () => {
      return comp.magnitude(comp.v_F()) * 2;
    };
    comp.projectOut = (posVector, dirVec, scale) => {
      let u = comp.unit_vector(dirVec);
      return comp.vector_add(posVector, comp.scalar_mult(u, scale));
    };

    let points = {};
    const hidden = { fixed: true, visible: false };
    const hiddenLabel = { fixed: true, visible: true, withLabel: true, size: 0 };
    const lineSegProps = { straightFirst: false, straightLast: false, fixed: true };

    // axes (x, y, z)
    const axisLength = 2;
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
          point2: { ...hiddenLabel, name: data[3], label: { fontSize: LABEL_SIZE, visible: IH.valCheck("coords", "on") } },
          visible: IH.valCheck("coords", "on")
        }
      );
    }

    points.A = bR.create(
      "point",
      [
        () => {
          return comp.x.apply(null, comp.v_A());
        },
        () => {
          return comp.y.apply(null, comp.v_A());
        }
      ],
      { strokeColor: "blue", fillColor: "blue", size: 3, name: "r_A", label: { fontSize: LABEL_SIZE, strokeColor: "blue" } }
    );

    points.B = bR.create(
      "point",
      [
        () => {
          return comp.x.apply(null, comp.v_B());
        },
        () => {
          return comp.y.apply(null, comp.v_B());
        }
      ],
      {
        strokeColor: "green",
        fillColor: "green",
        size: 3,
        name: "r_B",
        visible: IH.stateCheck([2, 3, 4]),
        label: { fontSize: LABEL_SIZE, strokeColor: "green", visible: IH.stateCheck([2, 3, 4]) }
      }
    );

    points.C = bR.create(
      "point",
      [
        () => {
          return comp.x.apply(null, comp.v_C());
        },
        () => {
          return comp.y.apply(null, comp.v_C());
        }
      ],
      // { name: "C", size: 1 }
      { ...hidden }
    );

    points.F = bR.create(
      "point",
      [
        () => {
          return comp.x.apply(null, comp.vector_add(comp.v_C(), comp.v_F()));
        },
        () => {
          return comp.y.apply(null, comp.vector_add(comp.v_C(), comp.v_F()));
        }
      ],
      { ...hidden }
    );

    bR.create("line", [points.C, points.F], {
      ...lineSegProps,
      lastArrow: true,
      strokeColor: "red",
      strokeWidth: 3
      // visible: IH.valCheck("replace", "off")
    });

    points.MC = bR.create(
      "point",
      [
        () => {
          return comp.x.apply(null, comp.vector_add(comp.momentC(), comp.v_C()));
        },
        () => {
          return comp.y.apply(null, comp.vector_add(comp.momentC(), comp.v_C()));
        }
      ],
      {
        ...hiddenLabel,
        name: "M_C",
        label: {
          fontSize: LABEL_SIZE,
          strokeColor: "purple",
          visible: () => {
            return IH.stateCheck([3])() && comp.magnitude(comp.momentC()) != 0;
          }
        }
      }
    );

    points.MB = bR.create(
      "point",
      [
        () => {
          return comp.x.apply(null, comp.vector_add(comp.momentB(), comp.v_B()));
        },
        () => {
          return comp.y.apply(null, comp.vector_add(comp.momentB(), comp.v_B()));
        }
      ],
      {
        ...hiddenLabel,
        name: "M_B",
        label: {
          fontSize: LABEL_SIZE,
          strokeColor: "purple",
          visible: () => {
            return IH.stateValCheck([3], "replace", "on")() && comp.magnitude(comp.momentB()) != 0;
          }
        }
      }
    );

    // bR.create("line", [points.B, points.M], {
    //   ...lineSegProps,
    //   lastArrow: true,
    //   strokeColor: "purple",
    //   strokeWidth: 3,
    //   visible: IH.valCheck("replace", "on")
    // });

    bR.create("line", [points.C, points.MC], {
      ...lineSegProps,
      lastArrow: true,
      strokeColor: "purple",
      strokeWidth: 3,
      visible: IH.stateCheck([3])
    });

    bR.create("line", [points.B, points.MB], {
      ...lineSegProps,
      lastArrow: true,
      strokeColor: "purple",
      strokeWidth: 3,
      visible: IH.valCheck("replace", "on")
    });

    bL.create(
      "text",
      [
        -15 + 0,
        TOP_Y + INTERVAL * 13.5,
        () => {
          let u = comp.momentC();
          return (
            "<span style='color:purple'><i>M_C</i> = </span>" +
            " [" +
            Math.round(u[0] * 100) / 100 +
            ", " +
            Math.round(u[1] * 100) / 100 +
            ", " +
            Math.round(u[2] * 100) / 100 +
            "]"
          );
        }
      ],
      { fontSize: LABEL_SIZE, fixed: true, anchorX: "left", anchorY: "top", visible: IH.valCheck("replace", "on") }
    );

    bL.create(
      "text",
      [
        -15 + 15,
        TOP_Y + INTERVAL * 13.5,
        () => {
          let u = comp.momentB();
          return (
            "<span style='color:purple'><i>M_B</i> = </span>" +
            " [" +
            Math.round(u[0] * 100) / 100 +
            ", " +
            Math.round(u[1] * 100) / 100 +
            ", " +
            Math.round(u[2] * 100) / 100 +
            "]"
          );
        }
      ],
      { fontSize: LABEL_SIZE, fixed: true, anchorX: "left", anchorY: "top", visible: IH.valCheck("replace", "on") }
    );

    for (let data of [
      ["plane1", comp.v_pos_center, comp.v_A_to_B, comp.separation, 1],
      ["plane3", comp.v_pos_center, comp.v_A_to_B, comp.separation, -1],
      ["plane2", comp.v_pos_center, comp.v_F, comp.v_F_mag, 1],
      ["plane4", comp.v_pos_center, comp.v_F, comp.v_F_mag, -1]
    ]) {
      points[data[0]] = bR.create(
        "point",
        [
          () => {
            return comp.x.apply(null, comp.projectOut(data[1](), data[2](), data[3]() * data[4]));
          },
          () => {
            return comp.y.apply(null, comp.projectOut(data[1](), data[2](), data[3]() * data[4]));
          }
        ],
        { ...hidden }
      );
    }

    bR.create("polygon", [points.plane1, points.plane2, points.plane3, points.plane4], {
      withLines: false,
      fillColor: "green",
      visible: IH.valCheck("replace", "on")
    });

    for (let data of ["Ax", "Ay", "Az", "Bx", "By", "Bz", "Fx", "Fy", "Fz"]) {
      // eslint-disable-next-line no-unused-vars
      sliders[data].on("drag", (e, i) => {
        if (this.interval != null) {
          clearInterval(this.interval);
          this.interval = null;
          IH.values.anim = "off";
          IH.toggleButtons();
        }
        sliders.time.setValue(0);
        bL.fullUpdate();
      });
    }

    this.sliders = sliders;
    bL.addChild(bR);
    bR.addChild(bL);
    this.changeState(3);
    this.changeState(1);
  },
  methods: {
    changeState(newState) {
      if (newState < 3) {
        this.IH.values.replace = "off";
        this.sliders.time.setValue(0);
      }
      this.IH.updateState(newState);
      this.state = this.IH.state;
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
