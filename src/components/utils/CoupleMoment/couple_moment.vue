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
import * as mathjs from "mathjs";
export default {
  components: {},
  data: () => {
    return {
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
    bL.resizeContainer(425, 750);

    const bR = JXG.JSXGraph.initBoard("boxRight", {
      boundingbox: [-5, 5, 5, -5],
      keepAspectRatio: true,
      showCopyright: false,
      pan: { enabled: false },
      zoom: { wheel: false },
      showNavigation: false,
      showZoom: false,
      axis: false
    });
    // The size of the container (matches explicit css style in html)
    bR.resizeContainer(750, 750);

    // All sliders are stored in these objects
    // They can be accessed with brackets sliders["force"] or dot notation sliders.force
    this.bL = bL;
    this.bR = bR;

    let sliders = {};
    const LABEL_SIZE = 18;

    const INTERVAL = -4.5;
    // Generate sliders, along with their related components
    // Can either have textbox + update button, or on/off system
    const TOP_Y = 14.5;
    const LEFT_X = -1;
    const RIGHT_X = 5;

    const INITIAL_VALUES = { direction: "forward", anim: "off", dist: "off" };
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
      ["time", "Time (sec)", INTERVAL * 0.5, true, [0, 0, 15], [0], "black"],
      ["anim", "Animation", INTERVAL * 1.5, false, ["\u23F5", "on", "\u23F8", "off"], [0]],
      ["direction", "Direction", INTERVAL * 2, false, ["Forward", "forward", "Reverse", "reverse"], [0]],
      [false, "Speed:", INTERVAL * 2.5, false],
      [false, "F_A Location:", INTERVAL * 3, false],
      ["r_A", "Radial coordinate r_A", INTERVAL * 3.5, true, [0, 0, 3], [0], "blue"],
      ["theta_A", "Angular coordinate t_A", INTERVAL * 4.5, true, [0, 0, 360], [0], "blue"],
      [false, "F_B Location:", INTERVAL * 5.5, false],
      ["r_B", "Radial coordinate r_B", INTERVAL * 6, true, [0, 0, 3], [0], "green"],
      ["theta_B", "Angular coordinate t_B", INTERVAL * 7, true, [0, 0, 360], [0], "green"],
      [false, "F_A Specification:", INTERVAL * 8, false],
      ["mag", "Magnitude", INTERVAL * 8.5, true, [0, 0, 5], [0], "red"],
      ["orien", "Orientation", INTERVAL * 9.5, true, [0, 0, 360], [0], "red"],
      ["dist", "Dist. between F_A & F_B", INTERVAL * 10.5, false, ["On", "on", "Off", "off"], [0]]
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
      object: bL.create("text", [3.15, TOP_Y + INTERVAL * 2.5, ""], { anchorX: "middle", anchorY: "middle" }),
      formula: () => {
        return "x" + this.speed;
      }
    };

    // Speed buttons
    let sp1 = bL.create(
      "button",
      [
        LEFT_X,
        TOP_Y + INTERVAL * 2.5,
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
        TOP_Y + INTERVAL * 2.5,
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

    // for (let data of ["h_pos", "f1_pos", "f1_angle", "f1_mag", "f2_pos", "f2_angle", "f2_mag"]) {
    //   // eslint-disable-next-line no-unused-vars
    //   sliders[data].on("drag", (e, i) => {
    //     if (this.interval != null) {
    //       clearInterval(this.interval);
    //       this.interval = null;
    //       IH.values.anim = "off";
    //       IH.toggleButtons();
    //     }

    //     sliders.time.setValue(0);
    //     bL.fullUpdate();
    //   });
    // }

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

    comp.magnitude = v => {
      // Assumes 2D vector as input
      return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
    };
    comp.vector_add = (v2, v1) => {
      // Assumes 2D vector as input
      return [v2[0] + v1[0], v2[1] + v1[1]];
    };
    comp.scalar_mult = (v, s) => {
      // Assumes 2D vector as input
      return [v[0] * s, v[1] * s];
    };
    comp.dot_mult = (v1, v2) => {
      // Assumes 2D vector as input
      return v2[0] * v1[0] + v2[1] * v1[1];
    };
    comp.cross_prod = (u, v) => {
      // Assumes 2D vector as input
      // Outputs a 3D vector as output
      let u1 = u[0],
        u2 = u[1],
        u3 = 0,
        v1 = v[0],
        v2 = v[1],
        v3 = 0;
      return [u2 * v3 - v2 * u3, -(u1 * v3 - v1 * u3), u1 * v2 - v1 * u2];
    };
    comp.unit_vector = v => {
      // Assumes 2D vector as input
      let mag = comp.magnitude(v);
      if (mag != 0) return [v[0] / mag, v[1] / mag];
      else return [0, 0];
    };

    comp.rad_to_cart = (r, a, rad = true) => {
      if (!rad) {
        a = comp.radians(a);
      }
      return [r * Math.cos(a), r * Math.sin(a)];
    };
    comp.cart_to_rad = (x, y) => {
      let dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      // Handles special case of pi/2 or 3pi/2
      let angle = x != 0 ? Math.atan(y / x) : y >= 0 ? Math.PI / 2 : 1.5 * Math.PI;
      angle = x >= 0 ? angle : angle + Math.PI;
      return [dist, angle];
    };
    comp.rotate_cart = (x, y, angle, rad = true) => {
      if (!rad) {
        angle = comp.radians(angle);
      }
      let radial = comp.cart_to_rad(x, y);
      return comp.rad_to_cart(radial[0], radial[1] + angle);
    };

    comp.vec_F_A = () => {
      return comp.rad_to_cart(sliders.mag.Value(), sliders.orien.Value(), false);
    };

    comp.vec_F_B = () => {
      return comp.scalar_mult(comp.vec_F_A(), -1);
    };

    comp.vec_pos_A = () => {
      return comp.rad_to_cart(sliders.r_A.Value(), sliders.theta_A.Value(), false);
    };

    comp.vec_pos_B = () => {
      return comp.rad_to_cart(sliders.r_B.Value(), sliders.theta_B.Value(), false);
    };

    comp.moment = () => {
      let mA = comp.cross_prod(comp.vec_pos_A(), comp.vec_F_A());
      let mB = comp.cross_prod(comp.vec_pos_B(), comp.vec_F_B());
      return mA[2] + mB[2];
    };
    comp.inertia = () => {
      return 12;
    };
    comp.angAcc = () => {
      return comp.moment() / comp.inertia();
    };
    comp.currRotation = () => {
      // Returns value in radians
      return 0.5 * comp.angAcc() * Math.pow(sliders.time.Value(), 2);
    };

    comp.adjusted = (x, y) => {
      return comp.rotate_cart(x, y, comp.currRotation());
    };

    comp.findIntersect = () => {
      let u = comp.unit_vector(comp.vec_F_A());
      let uP = [-u[1], u[0]];
      let p1 = comp.vector_add(comp.scalar_mult(uP, 10), comp.vec_pos_A());
      let p2 = comp.vector_add(comp.scalar_mult(uP, -10), comp.vec_pos_A());
      let p3 = comp.vector_add(comp.scalar_mult(u, 10), comp.vec_pos_B());
      let p4 = comp.vector_add(comp.scalar_mult(u, -10), comp.vec_pos_B());
      return mathjs.intersect(p1, p2, p3, p4);
    };

    comp.distancePoints = (p1, p2) => {
      return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
    };

    let points = {};
    const hidden = { fixed: true, visible: false };
    const hiddenLabel = { fixed: true, visible: true, withLabel: true, size: 0 };
    const lineSegProps = { straightFirst: false, straightLast: false, fixed: true };
    // const COPY = bR.create("transform", [0, 0], { type: "translate" });

    points.origin = bR.create("point", [0, 0], { name: "", strokeColor: "gray", fillColor: "gray", size: 5 });
    points.a = bR.create(
      "point",
      [
        () => {
          let loc = comp.adjusted.apply(null, comp.vec_pos_A());
          return loc[0];
        },
        () => {
          let loc = comp.adjusted.apply(null, comp.vec_pos_A());
          return loc[1];
        }
      ],
      { strokeColor: "blue", fillColor: "blue", name: "A", label: { strokeColor: "blue" } }
    );
    points.b = bR.create(
      "point",
      [
        () => {
          let loc = comp.adjusted.apply(null, comp.vec_pos_B());
          return loc[0];
        },
        () => {
          let loc = comp.adjusted.apply(null, comp.vec_pos_B());
          return loc[1];
        }
      ],
      { strokeColor: "green", fillColor: "green", name: "B", label: { strokeColor: "green" } }
    );
    points.f_a = bR.create(
      "point",
      [
        () => {
          let loc = comp.adjusted.apply(null, comp.vector_add(comp.vec_pos_A(), comp.vec_F_A()));
          return loc[0];
        },
        () => {
          let loc = comp.adjusted.apply(null, comp.vector_add(comp.vec_pos_A(), comp.vec_F_A()));
          return loc[1];
        }
      ],
      { ...hidden }
    );
    points.f_b = bR.create(
      "point",
      [
        () => {
          let loc = comp.adjusted.apply(null, comp.vector_add(comp.vec_pos_B(), comp.vec_F_B()));
          return loc[0];
        },
        () => {
          let loc = comp.adjusted.apply(null, comp.vector_add(comp.vec_pos_B(), comp.vec_F_B()));
          return loc[1];
        }
      ],
      { ...hidden }
    );

    bR.create("line", [points.a, points.f_a], { ...lineSegProps, strokeColor: "red", lastArrow: true, strokeWidth: 4 });
    bR.create("line", [points.b, points.f_b], { ...lineSegProps, strokeColor: "red", lastArrow: true, strokeWidth: 4 });

    bL.create(
      "text",
      [
        -15 + 0,
        TOP_Y + INTERVAL * 11,
        () => {
          return "<span style='color:purple'><i>M</i> = </span>" + Math.round(comp.moment() * 1000, 3) / 1000;
        }
      ],
      { fontSize: LABEL_SIZE, fixed: true, anchorX: "left", anchorY: "top" }
    );

    // bL.create(
    //   "text",
    //   [
    //     -15 + 6,
    //     TOP_Y + INTERVAL * 11,
    //     () => {
    //       return (
    //         "<span style='color:black'><i>D</i> = </span>" + Math.round(comp.distancePoints(comp.findIntersect(), comp.vec_pos_B()) * 1000, 3) / 1000
    //       );
    //     }
    //   ],
    //   { fontSize: LABEL_SIZE, fixed: true, anchorX: "left", anchorY: "top" }
    // );

    const MOMENT_RADIUS = 0.4;

    points.momentCenter = bR.create("point", [0, 0], {
      ...hiddenLabel,
      name: "<b>M</b>",
      label: {
        visible: () => {
          return comp.moment() != 0;
        },
        strokeColor: "purple",
        anchorX: "middle",
        anchorY: "middle",
        offset: [-4, 9]
      }
    });

    points.momentEnd = bR.create(
      "point",
      [
        () => {
          const coords = comp.rad_to_cart(MOMENT_RADIUS, Math.max(0, (comp.moment() * Math.PI) / 4.5));
          return coords[0];
        },
        () => {
          const coords = comp.rad_to_cart(MOMENT_RADIUS, Math.max(0, (comp.moment() * Math.PI) / 4.5));
          return coords[1];
        }
      ],
      { ...hidden }
    );

    points.momentStart = bR.create(
      "point",
      [
        () => {
          const coords = comp.rad_to_cart(MOMENT_RADIUS, Math.min(0, (comp.moment() * Math.PI) / 4.5));
          return coords[0];
        },
        () => {
          const coords = comp.rad_to_cart(MOMENT_RADIUS, Math.min(0, (comp.moment() * Math.PI) / 4.5));
          return coords[1];
        }
      ],
      { ...hidden }
    );
    bR.create(
      "arc",
      [
        // Center point
        points.momentCenter,
        // CW point
        points.momentStart,
        // CWW point
        points.momentEnd
      ],
      {
        strokeWidth: 3,
        strokeColor: "purple",
        firstArrow: () => {
          return comp.moment() < 0;
        },
        lastArrow: () => {
          return comp.moment() > 0;
        },
        visible: () => {
          return comp.moment() != 0;
        }
      }
    );
    bR.create("circle", [points.momentCenter, points.momentStart], {
      strokeColor: "purple",
      strokeWidth: 3,
      visible: () => {
        return Math.abs(comp.moment()) >= 9;
      }
    });

    let dA = comp.radians(360 / 20);
    let dA_2 = dA / 2;

    let gearProps = { ...lineSegProps, strokeColor: "black", strokeWidth: 3 };

    for (let i = 0; i < 20; i++) {
      points["inner" + i] = bR.create(
        "point",
        [
          () => {
            let loc = comp.adjusted.apply(null, comp.rad_to_cart(3.05, dA_2 + dA * i));
            return loc[0];
          },
          () => {
            let loc = comp.adjusted.apply(null, comp.rad_to_cart(3.05, dA_2 + dA * i));
            return loc[1];
          }
        ],
        { ...hidden }
      );
      points["outer" + i] = bR.create(
        "point",
        [
          () => {
            let loc = comp.adjusted.apply(null, comp.rad_to_cart(3.45, dA_2 + dA * i));
            return loc[0];
          },
          () => {
            let loc = comp.adjusted.apply(null, comp.rad_to_cart(3.45, dA_2 + dA * i));
            return loc[1];
          }
        ],
        { ...hidden }
      );
      bR.create("line", [points["inner" + i], points["outer" + i]], { ...gearProps });
    }

    for (let i = 0; i < 20; i++) {
      let j = (i + 1) % 20;
      let stem = "outer";
      if (i % 2 == 0) {
        stem = "inner";
      }
      bR.create("line", [points[stem + i], points[stem + j]], { ...gearProps });
    }

    bR.create("line", [points.a, points.f_a], { strokeColor: "red", strokeWidth: 3, dash: 2, visible: IH.valCheck("dist", "on") });
    bR.create("line", [points.b, points.f_b], { strokeColor: "red", strokeWidth: 3, dash: 2, visible: IH.valCheck("dist", "on") });
    points.intersect = bR.create(
      "point",
      [
        () => {
          let loc = comp.adjusted.apply(null, comp.findIntersect());
          return loc[0];
        },
        () => {
          let loc = comp.adjusted.apply(null, comp.findIntersect());
          return loc[1];
        }
      ],
      { ...hidden }
    );
    bR.create("line", [points.a, points.intersect], {
      ...lineSegProps,
      strokeColor: "black",
      strokeWidth: 3,
      dash: 2,
      visible: IH.valCheck("dist", "on")
    });
    let angle1 = bR.create("angle", [points.a, points.intersect, points.b], {
      strokeColor: "black",
      fillColor: "white",
      strokeWidth: 3,
      dash: 2,
      visible: () => {
        return IH.valCheck("dist", "on")() && angle1.Value() < Math.PI;
      },
      name: "",
      radius: 0.2,
      label: { visible: false },
      orthoSensitivity: 5
    });
    let angle2 = bR.create("angle", [points.b, points.intersect, points.a], {
      strokeColor: "black",
      fillColor: "white",
      strokeWidth: 3,
      dash: 2,
      visible: () => {
        return IH.valCheck("dist", "on")() && angle2.Value() < Math.PI;
      },
      name: "",
      radius: 0.2,
      label: { visible: false },
      orthoSensitivity: 5
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
