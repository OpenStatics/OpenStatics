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

    const INTERVAL = -3.75;
    // Generate sliders, along with their related components
    // Can either have textbox + update button, or on/off system
    const TOP_Y = 12;
    const LEFT_X = -1;
    const RIGHT_X = 5;

    const INITIAL_VALUES = { r_vis: "on", s_vis: "on", f_vis: "on", m_vis: "on", rotation: "off", coords: "on", direction: "forward", anim: "off" };
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
      ["rotation", "Rotate Axes", INTERVAL * -0.5, false, ["On", "on", "Off", "off"], [0]],
      ["coords", "Coordinate Visibility", INTERVAL * 0, false, ["On", "on", "Off", "off"], [0]],
      ["time", "Time (sec)", INTERVAL * 0.5, true, [0, 0, 15], [0], "black"],
      ["anim", "Animation", INTERVAL * 1.5, false, ["\u23F5", "on", "\u23F8", "off"], [0]],
      ["direction", "Direction", INTERVAL * 2, false, ["Forward", "forward", "Reverse", "reverse"], [0]],
      [false, "Speed:", INTERVAL * 2.5, false],
      [false, "<span style='color:green'>Vector <b>r</b> = [r_x,r_y,r_z]</span>", INTERVAL * 3, false],
      ["rx", "r_x", INTERVAL * 3.5, true, [-5, 2, 5], [0], "green"],
      ["ry", "r_y", INTERVAL * 4.5, true, [-5, 0, 5], [0], "green"],
      ["rz", "r_z", INTERVAL * 5.5, true, [-5, 0, 5], [0], "green"],
      ["r_vis", "Show Vector <b>r</b>", INTERVAL * 6.5, false, ["On", "on", "Off", "off"], [0]],
      [false, "<span style='color:gold'>Radius of Sphere</span>", INTERVAL * 7, false],
      ["R", "R", INTERVAL * 7.5, true, [0, 0.5, 3], [0], "gold"],
      ["s_vis", "Show Sphere", INTERVAL * 8.5, false, ["On", "on", "Off", "off"], [0]],
      [false, "<span style='color:red'>Force <b>F</b> = [F_x,F_y,F_z]</span>", INTERVAL * 9, false],
      ["fx", "f_x", INTERVAL * 9.5, true, [-5, 0, 5], [0], "red"],
      ["fy", "f_y", INTERVAL * 10.5, true, [-5, 2, 5], [0], "red"],
      ["fz", "f_z", INTERVAL * 11.5, true, [-5, 0, 5], [0], "red"],
      ["f_vis", "Show Force", INTERVAL * 12.5, false, ["On", "on", "Off", "off"], [0]],
      ["m_vis", "Show Moment", INTERVAL * 13, false, ["On", "on", "Off", "off"], [0]]
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

    for (let data of ["rx", "ry", "rz", "fx", "fy", "fz", "R"]) {
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

    comp.v_r = () => {
      return [sliders.rx.Value(), sliders.ry.Value(), sliders.rz.Value()];
    };
    comp.v_f = () => {
      return [sliders.fx.Value(), sliders.fy.Value(), sliders.fz.Value()];
    };

    comp.RHO = 1;
    comp.mass = () => {
      //M = rho * 4/3 * pi * R^3
      return comp.RHO * (4 / 3) * Math.PI * Math.pow(sliders.R.Value(), 3);
    };
    comp.inertia = () => {
      const R = sliders.R.Value();
      const M = comp.mass();
      const L = comp.magnitude(comp.v_r());
      return (2 / 5) * M * R * R + M * (L + R) * (L + R);
      //(2/5)MR^2 + M(L + R)^2
    };
    comp.moment = () => {
      // returns vector
      return comp.cross_prod(comp.v_r(), comp.v_f());
    };
    comp.angAcc = () => {
      return comp.scalar_mult(comp.moment(), 1 / comp.inertia());
    };
    comp.currRotation = () => {
      // Returns value in radians
      return comp.scalar_mult(comp.angAcc(), 0.5 * Math.pow(sliders.time.Value(), 2));
    };

    comp.distance = (x, y) => {
      return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    };
    comp.angle = (x, y) => {
      const dX = x;
      const dY = y;
      // Handles special case of pi/2 or 3pi/2
      const angle = dX != 0 ? Math.atan(dY / dX) : dY >= 0 ? Math.PI / 2 : 1.5 * Math.PI;
      return dX >= 0 ? angle : angle + Math.PI;
    };
    comp.rotateOnAxis = (x, y, angle, radians = true) => {
      if (!radians) {
        angle = comp.radians(angle);
      }
      const length = comp.distance(x, y);
      const prevAngle = comp.angle(x, y);
      const myX = length * Math.cos(angle + prevAngle);
      const myY = length * Math.sin(angle + prevAngle);
      return [myX, myY];
    };

    comp.xt = (a, b, c) => {
      let rot = comp.currRotation();
      let adjXY = comp.rotateOnAxis(a, b, rot[2]);
      a = adjXY[0];
      b = adjXY[1];

      let adjXZ = comp.rotateOnAxis(a, c, -rot[1]);
      a = adjXZ[0];
      c = adjXZ[1];

      if (rot[1] == 0 || rot[2] == 0) {
        let adjYZ = comp.rotateOnAxis(b, c, rot[0]);
        b = adjYZ[0];
        c = adjYZ[1];
      }
      return comp.x(a, b, c);
    };
    comp.yt = (a, b, c) => {
      let rot = comp.currRotation();
      let adjXY = comp.rotateOnAxis(a, b, rot[2]);
      a = adjXY[0];
      b = adjXY[1];

      let adjXZ = comp.rotateOnAxis(a, c, -rot[1]);
      a = adjXZ[0];
      c = adjXZ[1];

      if (rot[1] == 0 || rot[2] == 0) {
        let adjYZ = comp.rotateOnAxis(b, c, rot[0]);
        b = adjYZ[0];
        c = adjYZ[1];
      }
      return comp.y(a, b, c);
    };
    comp.xyt = (a, b, c) => {
      return [comp.xt(a, b, c), comp.yt(a, b, c)];
    };

    let points = {};
    const hidden = { fixed: true, visible: false };
    const hiddenLabel = { fixed: true, visible: true, withLabel: true, size: 0 };
    const lineSegProps = { straightFirst: false, straightLast: false, fixed: true };

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
        {
          ...axisProps,
          point2: { ...hiddenLabel, name: data[3], label: { fontSize: 14, visible: IH.valCheck("coords", "on") } },
          visible: IH.valCheck("coords", "on")
        }
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
      { ...hidden }
    );

    points.sphere = bR.create(
      "point",
      [
        () => {
          return comp.xt.apply(null, comp.v_r());
        },
        () => {
          return comp.yt.apply(null, comp.v_r());
        }
      ],
      { ...hiddenLabel, name: "<b>r</b>", label: { fontSize: LABEL_SIZE, strokeColor: "green", visible: IH.valCheck("r_vis", "on") } }
    );

    bR.create("line", [points.origin, points.sphere], {
      ...lineSegProps,
      strokeColor: "green",
      lastArrow: true,
      strokeWidth: 4,
      visible: IH.valCheck("r_vis", "on")
    });

    points.force = bR.create(
      "point",
      [
        () => {
          const vec = comp.vector_add(comp.v_r(), comp.v_f());
          return comp.xt.apply(null, vec);
        },
        () => {
          const vec = comp.vector_add(comp.v_r(), comp.v_f());
          return comp.yt.apply(null, vec);
        }
      ],
      { ...hiddenLabel, name: "<b>F</b>", label: { fontSize: LABEL_SIZE, strokeColor: "red", visible: IH.valCheck("f_vis", "on") } }
    );

    bR.create("line", [points.sphere, points.force], {
      ...lineSegProps,
      strokeColor: "red",
      lastArrow: true,
      strokeWidth: 4,
      visible: IH.valCheck("f_vis", "on")
    });

    points.moment = bR.create(
      "point",
      [
        () => {
          return comp.x.apply(null, comp.moment());
        },
        () => {
          return comp.y.apply(null, comp.moment());
        }
      ],
      { ...hiddenLabel, name: "<b>M_0</b>", label: { fontSize: LABEL_SIZE, strokeColor: "blue", visible: IH.valCheck("m_vis", "on") } }
    );

    bR.create("line", [points.origin, points.moment], {
      ...lineSegProps,
      strokeColor: "blue",
      lastArrow: true,
      strokeWidth: 4,
      visible: IH.valCheck("m_vis", "on")
    });

    bL.create(
      "text",
      [
        -15 + 0,
        TOP_Y + INTERVAL * 13.5,
        () => {
          let u = comp.unit_vector(comp.moment());
          return (
            "<span style='color:blue'><i>M</i> = </span>" +
            Math.round(comp.magnitude(comp.moment()) * 10000) / 10000 +
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
      { fontSize: LABEL_SIZE, fixed: true, anchorX: "left", anchorY: "top", visible: IH.valCheck("m_vis", "on") }
    );

    bR.create(
      "text",
      [
        -9,
        9,
        () => {
          let u = comp.currRotation();
          return (
            "<span style='color:blue'><i>Rot</i> = </span>" +
            "1 {" +
            Math.round(u[0] * 10000) / 10000 +
            ", " +
            Math.round(u[1] * 10000) / 10000 +
            ", " +
            Math.round(u[2] * 10000) / 10000 +
            "}"
          );
        }
      ],
      { fontSize: LABEL_SIZE, fixed: true, anchorX: "left", anchorY: "top", visible: IH.valCheck("m_vis", "on") }
    );

    points.sphere2 = bR.create(
      "point",
      [
        () => {
          // const length = comp.magnitude(comp.v_r()) - sliders.R.Value();
          // const vec = comp.scalar_mult(comp.unit_vector(comp.v_r()), [sliders.R.Value(), 0, 0]);
          const vec = comp.vector_add(comp.v_r(), [sliders.R.Value(), 0, 0]);
          return comp.xt.apply(null, vec);
        },
        () => {
          const vec = comp.vector_add(comp.v_r(), [sliders.R.Value(), 0, 0]);
          return comp.yt.apply(null, vec);
        }
      ],
      { ...hidden }
    );

    bR.create("circle", [points.sphere, points.sphere2], { fillColor: "gold", strokeColor: "gold" });
    bR.create("polygon", [points.origin, points.sphere, points.force], { fillColor: "teal", withLines: false });

    // const COPY = bR.create("transform", [0, 0], { type: "translate" });

    // for (let data of [
    //   [1, 0, "x"],
    //   [0, 1, "y"]
    // ]) {
    //   bR.create("line", [convXY(-3.25 * data[0], -3.25 * data[1], graphs.large), convXY(3.25 * data[0], 3.25 * data[1], graphs.large)], {
    //     ...lineSegProps,
    //     lastArrow: true,
    //     strokeColor: "black",
    //     strokeWidth: 2,
    //     visible: IH.valCheck("coords", "on"),
    //     point2: { ...hiddenLabel, name: data[2], label: { visible: IH.valCheck("coords", "on") } }
    //   });
    // }

    // points.hinge = bR.create(
    //   "point",
    //   [
    //     () => {
    //       return convX(sliders.h_pos.Value(), graphs.large);
    //     },
    //     () => {
    //       return convY(0, graphs.large);
    //     }
    //   ],
    //   {
    //     size: 3,
    //     strokeColor: "purple",
    //     fillColor: "purple",
    //     name: ""
    //   }
    // );

    // const TRIANGLE_LENGTH = 0.2;

    // points.t1 = bR.create(
    //   "point",
    //   [
    //     () => {
    //       return convX(sliders.h_pos.Value() - TRIANGLE_LENGTH / 2, graphs.large);
    //     },
    //     () => {
    //       return convY(0 - TRIANGLE_LENGTH, graphs.large);
    //     }
    //   ],
    //   { ...hidden }
    // );

    // points.t2 = bR.create(
    //   "point",
    //   [
    //     () => {
    //       return convX(sliders.h_pos.Value() + TRIANGLE_LENGTH / 2, graphs.large);
    //     },
    //     () => {
    //       return convY(0 - TRIANGLE_LENGTH, graphs.large);
    //     }
    //   ],
    //   { ...hidden }
    // );

    // points.c1 = bR.create(
    //   "point",
    //   [
    //     () => {
    //       return convX(sliders.h_pos.Value() - TRIANGLE_LENGTH, graphs.large);
    //     },
    //     () => {
    //       return convY(0 - TRIANGLE_LENGTH, graphs.large);
    //     }
    //   ],
    //   { ...hidden }
    // );

    // points.c2 = bR.create(
    //   "point",
    //   [
    //     () => {
    //       return convX(sliders.h_pos.Value() + TRIANGLE_LENGTH, graphs.large);
    //     },
    //     () => {
    //       return convY(0 - TRIANGLE_LENGTH, graphs.large);
    //     }
    //   ],
    //   { ...hidden }
    // );

    // bR.create("polygon", [points.hinge, points.t1, points.t2], {
    //   withLines: "false",
    //   borders: { strokeColor: "purple" },
    //   fillColor: "purple",
    //   fillOpacity: 1
    // });

    // bR.create("comb", [points.c2, points.c1], { curve: { strokeColor: "purple" }, width: 0.3 });
    // bR.create("line", [points.c2, points.c1], { ...lineSegProps, strokeColor: "purple" });

    // points.beam1 = bR.create(
    //   "point",
    //   [
    //     () => {
    //       const coords = comp.beamRelPos(0, 0);
    //       return convX(coords[0], graphs.large);
    //     },
    //     () => {
    //       const coords = comp.beamRelPos(0, 0);
    //       return convY(coords[1], graphs.large);
    //     }
    //   ],
    //   { ...hidden }
    // );

    // points.beam2 = bR.create(
    //   "point",
    //   [
    //     () => {
    //       const coords = comp.beamRelPos(3, 0);
    //       return convX(coords[0], graphs.large);
    //     },
    //     () => {
    //       const coords = comp.beamRelPos(3, 0);
    //       return convY(coords[1], graphs.large);
    //     }
    //   ],
    //   { ...hidden }
    // );

    // bR.create("line", [points.beam1, points.beam2], { ...lineSegProps, strokeColor: "black", strokeWidth: 5 });
    // bR.create("line", [convXY(0, 0, graphs.large), convXY(3, 0, graphs.large)], { ...lineSegProps, strokeWidth: 2, dash: 2, strokeColor: "black" });

    // points.f1_1 = bR.create(
    //   "point",
    //   [
    //     () => {
    //       const coords = comp.beamRelPos(sliders.f1_pos.Value(), 0);
    //       return convX(coords[0], graphs.large);
    //     },
    //     () => {
    //       const coords = comp.beamRelPos(sliders.f1_pos.Value(), 0);
    //       return convY(coords[1], graphs.large);
    //     }
    //   ],
    //   { ...hidden }
    // );

    // points.f1_2 = bR.create(
    //   "point",
    //   [
    //     () => {
    //       const coords = comp.polarToRadial(sliders.f1_pos.Value(), 0, sliders.f1_mag.Value(), sliders.f1_angle.Value(), false);
    //       const coords2 = comp.beamRelPos.apply(null, coords);
    //       return convX(coords2[0], graphs.large);
    //     },
    //     () => {
    //       const coords = comp.polarToRadial(sliders.f1_pos.Value(), 0, sliders.f1_mag.Value(), sliders.f1_angle.Value(), false);
    //       const coords2 = comp.beamRelPos.apply(null, coords);
    //       return convY(coords2[1], graphs.large);
    //     }
    //   ],
    //   {
    //     ...hiddenLabel,
    //     name: "F_1",
    //     label: {
    //       strokeColor: "blue",
    //       visible: () => {
    //         return sliders.f1_mag.Value() > 0;
    //       }
    //     }
    //   }
    // );

    // points.f2_1 = bR.create(
    //   "point",
    //   [
    //     () => {
    //       const coords = comp.beamRelPos(sliders.f2_pos.Value(), 0);
    //       return convX(coords[0], graphs.large);
    //     },
    //     () => {
    //       const coords = comp.beamRelPos(sliders.f2_pos.Value(), 0);
    //       return convY(coords[1], graphs.large);
    //     }
    //   ],
    //   { ...hidden }
    // );

    // points.f2_2 = bR.create(
    //   "point",
    //   [
    //     () => {
    //       const coords = comp.polarToRadial(sliders.f2_pos.Value(), 0, sliders.f2_mag.Value(), sliders.f2_angle.Value(), false);
    //       const coords2 = comp.beamRelPos.apply(null, coords);
    //       return convX(coords2[0], graphs.large);
    //     },
    //     () => {
    //       const coords = comp.polarToRadial(sliders.f2_pos.Value(), 0, sliders.f2_mag.Value(), sliders.f2_angle.Value(), false);
    //       const coords2 = comp.beamRelPos.apply(null, coords);
    //       return convY(coords2[1], graphs.large);
    //     }
    //   ],
    //   {
    //     ...hiddenLabel,
    //     name: "F_2",
    //     label: {
    //       strokeColor: "green",
    //       visible: () => {
    //         return sliders.f2_mag.Value() > 0;
    //       }
    //     }
    //   }
    // );

    // bR.create("line", [points.f1_1, points.f1_2], { ...lineSegProps, lastArrow: true, strokeColor: "blue", strokeWidth: 3 });

    // bR.create("line", [points.f2_1, points.f2_2], { ...lineSegProps, lastArrow: true, strokeColor: "green", strokeWidth: 3 });

    // const MOMENT_RADIUS = 0.3;

    // points.momentCenter = bR.create(
    //   "point",
    //   [
    //     () => {
    //       return convX(sliders.h_pos.Value(), graphs.large);
    //     },
    //     convY(-1, graphs.large)
    //   ],
    //   {
    //     ...hiddenLabel,
    //     name: "M",
    //     label: {
    //       visible: () => {
    //         return comp.moment() != 0;
    //       },
    //       strokeColor: "red",
    //       anchorX: "middle",
    //       anchorY: "middle",
    //       offset: [-4, 9]
    //     }
    //   }
    // );

    // points.momentEnd = bR.create(
    //   "point",
    //   [
    //     () => {
    //       const coords = comp.polarToRadial(sliders.h_pos.Value(), -1, MOMENT_RADIUS, Math.max(0, (comp.moment() * Math.PI) / 4.5));
    //       return convX(coords[0], graphs.large);
    //     },
    //     () => {
    //       const coords = comp.polarToRadial(sliders.h_pos.Value(), -1, MOMENT_RADIUS, Math.max(0, (comp.moment() * Math.PI) / 4.5));
    //       return convY(coords[1], graphs.large);
    //     }
    //   ],
    //   { ...hidden }
    // );

    // points.momentStart = bR.create(
    //   "point",
    //   [
    //     () => {
    //       const coords = comp.polarToRadial(sliders.h_pos.Value(), -1, MOMENT_RADIUS, Math.min(0, (comp.moment() * Math.PI) / 4.5));
    //       return convX(coords[0], graphs.large);
    //     },
    //     () => {
    //       const coords = comp.polarToRadial(sliders.h_pos.Value(), -1, MOMENT_RADIUS, Math.min(0, (comp.moment() * Math.PI) / 4.5));
    //       return convY(coords[1], graphs.large);
    //     }
    //   ],
    //   { ...hidden }
    // );

    // bR.create(
    //   "arc",
    //   [
    //     // Center point
    //     points.momentCenter,
    //     // CW point
    //     points.momentStart,
    //     // CWW point
    //     points.momentEnd
    //   ],
    //   {
    //     strokeWidth: 3,
    //     strokeColor: "red",
    //     firstArrow: () => {
    //       return comp.moment() < 0;
    //     },
    //     lastArrow: () => {
    //       return comp.moment() > 0;
    //     },
    //     visible: () => {
    //       return comp.moment() != 0;
    //     }
    //   }
    // );

    // bR.create("circle", [points.momentCenter, points.momentStart], {
    //   strokeColor: "red",
    //   strokeWidth: 3,
    //   visible: () => {
    //     return Math.abs(comp.moment()) >= 9;
    //   }
    // });

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
