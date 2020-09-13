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
      state: 0,
      speed: 1,
      speedOptions: [0.25, 0.5, 1, 1.5, 2, 4],
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
      boundingbox: [-10, 10, 10, -10],
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

    const INTERVAL = -4.25;
    // Generate sliders, along with their related components
    // Can either have textbox + update button, or on/off system
    const TOP_Y = 12;
    const LEFT_X = -1;
    const RIGHT_X = 5;

    const INITIAL_VALUES = {
      rotation: "off",
      direction: "forward",
      fr: "off",
      anim: "off"
    };
    let IH = new InputHandler(bL, INTERVAL, TOP_Y, LEFT_X, RIGHT_X, LABEL_SIZE, INITIAL_VALUES, 0);
    this.IH = IH;

    for (let data of [
      /* [key value,
          label name,
          y position,
          true: slider | false: on/off,
          [min, start, max] (if true) | [lbl1, val1, lbl2, val2] (if false),
          [allowed states],
          color ]*/
      /* For just text: [false, label name, y position, mathJax] */
      ["rotation", "Rotate Axes", INTERVAL * -0.5, false, ["On", "on", "Off", "off"], [0]],
      ["time", "Time (sec)", INTERVAL * 0, true, [0, 0, 15], [0], "black"],
      ["anim", "Animation", INTERVAL * 1, false, ["\u23F5", "on", "\u23F8", "off"], [0]],
      ["direction", "Direction", INTERVAL * 1.5, false, ["Forward", "forward", "Reverse", "reverse"], [0]],
      [false, "Speed:", INTERVAL * 2, false],
      //["speed", "Speed", INTERVAL * 1.5, false, ["Faster", "f", "Slower", "s"], [0], null],
      ["x1", "F_{x1}", INTERVAL * 2.5, true, [-10, 5, 10], [0], "red"],
      ["y1", "F_{y1}", INTERVAL * 3.5, true, [-10, 0, 10], [0], "red"],
      ["z1", "F_{z1}", INTERVAL * 4.5, true, [-10, 0, 10], [0], "red"],
      ["x2", "F_{x2}", INTERVAL * 5.5, true, [-10, 0, 10], [0], "blue"],
      ["y2", "F_{y2}", INTERVAL * 6.5, true, [-10, 4, 10], [0], "blue"],
      ["z2", "F_{z2}", INTERVAL * 7.5, true, [-10, 0, 10], [0], "blue"],
      ["x3", "F_{x3}", INTERVAL * 8.5, true, [-10, 0, 10], [0], "green"],
      ["y3", "F_{y3}", INTERVAL * 9.5, true, [-10, 0, 10], [0], "green"],
      ["z3", "F_{z3}", INTERVAL * 10.5, true, [-10, 3, 10], [0], "green"],
      ["fr", "F_R", INTERVAL * 11.5, false, ["On", "on", "Off", "off"], [0]]
    ]) {
      IH.generate(data, sliders);
    }

    let speedChange = delta => {
      let index = this.speedOptions.findIndex(val => {
        return val === this.speed;
      });
      let newIndex = index + delta;
      newIndex = Math.min(newIndex, this.speedOptions.length - 1);
      newIndex = Math.max(newIndex, 0);
      this.speed = this.speedOptions[newIndex];
    };

    IH.textToUpdate.speed = {
      object: bL.create("text", [3.15, TOP_Y + INTERVAL * 2, ""], { anchorX: "middle", anchorY: "middle" }),
      formula: () => {
        return "x" + this.speed;
      }
    };

    // Speed buttons
    let sp1 = bL.create(
      "button",
      [
        LEFT_X,
        TOP_Y + INTERVAL * 2,
        "\u25b2",
        () => {
          speedChange(1);
          IH.fixTextAlignment();
          IH.toggleButtons();
        }
      ],
      {
        fixed: true
      }
    );
    sp1.rendNodeButton.classList.add("btn-primary");

    let sp2 = bL.create(
      "button",
      [
        5,
        TOP_Y + INTERVAL * 2,
        "\u25bc",
        () => {
          speedChange(-1);
          IH.fixTextAlignment();
          IH.toggleButtons();
        }
      ],
      {
        fixed: true
      }
    );
    sp2.rendNodeButton.classList.add("btn-primary");

    this.timeAdjustmentFunction = () => {
      let t = (() => {
        return 0.05 * this.speed * (IH.values.direction === "forward" ? 1 : -1);
      })();
      t = (t + sliders.time.Value() + 15) % 15;
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

    for (let data of ["x1", "x2", "x3", "y1", "y2", "y3", "z1", "z2", "z3"]) {
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

    // Handles circle gliders
    let CSProps = {};
    for (let key of ["circle", "glider", "textLabel"]) CSProps[key] = { visible: IH.valCheck("rotation", "on") };
    let circleSlides = {};
    for (let data of [
      ["tx", 8, -8, 0.8, 250, "\u03b8_x"],
      ["ty", 5, -8, 0.8, 180, "\u03b8_y"],
      ["tz", 2, -8, 0.8, 150, "\u03b8_z"]
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
    comp.v_f1 = () => {
      return [sliders.x1.Value(), sliders.y1.Value(), sliders.z1.Value()];
    };
    comp.v_f2 = () => {
      return [sliders.x2.Value(), sliders.y2.Value(), sliders.z2.Value()];
    };
    comp.v_f3 = () => {
      return [sliders.x3.Value(), sliders.y3.Value(), sliders.z3.Value()];
    };
    comp.v_f = () => {
      return comp.vector_add(comp.vector_add(comp.v_f1(), comp.v_f2()), comp.v_f3());
    };
    comp.TIME_SCALE = 1 / (7 * 20);
    comp.v_pos = () => {
      return comp.scalar_mult(comp.v_f(), comp.TIME_SCALE * Math.pow(sliders.time.Value(), 2));
    };
    comp.FORCE_SCALE = 1 / 3;
    comp.v_fx = () => {
      return comp.v_f()[0];
    };
    comp.v_fy = () => {
      return comp.v_f()[1];
    };
    comp.v_fz = () => {
      return comp.v_f()[2];
    };

    let points = {};
    const hiddenProps = { fixed: true, visible: false, showInfobox: false };
    const hiddenLabelProps = { fixed: true, visible: true, withLabel: true, size: 0, showInfobox: false };
    const lineSegProps = { straightFirst: false, straightLast: false };
    // const COPY = bR.create("transform", [0, 0], { type: "translate" });

    // axes (x, y, z)
    const axisLength = 10;
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
        { ...axisProps, point2: { ...hiddenLabelProps, name: data[3], label: { fontSize: 14 } } }
      );
    }

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
      { ...hiddenProps }
    );

    points.dot = bR.create(
      "point",
      [
        () => {
          return comp.x.apply(null, comp.v_pos());
        },
        () => {
          return comp.y.apply(null, comp.v_pos());
        }
      ],
      { strokeColor: "brown", fillColor: "brown", size: 3, name: "" }
    );

    for (let data of [
      ["f1", "red", false],
      ["f2", "blue", false],
      ["f3", "green", false],
      ["f", "brown", true]
    ]) {
      points[data[0]] = bR.create(
        "point",
        [
          () => {
            return comp.x.apply(null, comp.vector_add(comp.v_pos(), comp.scalar_mult(comp["v_" + data[0]](), comp.FORCE_SCALE)));
          },
          () => {
            return comp.y.apply(null, comp.vector_add(comp.v_pos(), comp.scalar_mult(comp["v_" + data[0]](), comp.FORCE_SCALE)));
          }
        ],
        { ...hiddenProps }
      );

      bR.create("line", [points.dot, points[data[0]]], {
        ...lineSegProps,
        strokeColor: data[1],
        lastArrow: true,
        strokeWidth: 3,
        visible: data[2] ? IH.valCheck("fr", "on") : true
      });
    }

    bR.create("line", [points.origin, points.dot], { ...lineSegProps, strokeColor: "black", strokeWidth: 2, dash: 2 });

    for (let data of [
      /* [x offset from left side, y coordinate, [label, function, unit], valCheck arg 1, valCheck arg 2, color] */
      [0, INTERVAL * 12, ["F_{Rx}", comp.v_fx, ""], "fr", "on", "brown"],
      [8, INTERVAL * 12, ["F_{Ry}", comp.v_fy, ""], "fr", "on", "brown"],
      [16, INTERVAL * 12, ["F_{Rz}", comp.v_fz, ""], "fr", "on", "brown"]
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

    bL.create(
      "text",
      [
        -15 + 24,
        TOP_Y + INTERVAL * 12,
        () => {
          if (comp.v_f().every(item => item === 0)) {
            return "Balanced";
          } else {
            return "";
          }
        }
      ],
      { fontSize: LABEL_SIZE, fixed: true, visible: IH.valCheck("fr", "on"), anchorX: "left", anchorY: "top", strokeColor: "green" }
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
