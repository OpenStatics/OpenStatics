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

    const INITIAL_VALUES = { coords: "off", direction: "forward", anim: "off" };
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
      ["coords", "Coordinate Visibility", INTERVAL * 0, false, ["On", "on", "Off", "off"], [0]],
      ["time", "Time (sec)", INTERVAL * 0.5, true, [0, 0, 15], [0], "black"],
      ["anim", "Animation", INTERVAL * 1.5, false, ["\u23F5", "on", "\u23F8", "off"], [0]],
      ["direction", "Direction", INTERVAL * 2, false, ["Forward", "forward", "Reverse", "reverse"], [0]],
      [false, "Speed:", INTERVAL * 2.5, false],
      ["h_pos", "Hinge Position (m)", INTERVAL * 3, true, [0, 0, 3], [0], "purple"],
      ["f1_mag", "F_1 Magnitude (N)", INTERVAL * 4, true, [-3, 0, 3], [0], "blue"],
      ["f1_angle", "Angle of F_1: \u03b1_1 (\u00b0)", INTERVAL * 5, true, [0, 0, 360], [0], "blue"],
      ["f1_pos", "F_1 Position (m)", INTERVAL * 6, true, [0, 0, 3], [0], "blue"],
      ["f2_mag", "F_2 Magnitude (N)", INTERVAL * 7, true, [-3, 0, 3], [0], "green"],
      ["f2_angle", "Angle of F_2: \u03b1_2 (\u00b0)", INTERVAL * 8, true, [0, 0, 360], [0], "green"],
      ["f2_pos", "F_2 Position (m)", INTERVAL * 9, true, [0, 0, 3], [0], "green"]
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

    for (let data of ["h_pos", "f1_pos", "f1_angle", "f1_mag", "f2_pos", "f2_angle", "f2_mag"]) {
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
    comp.distance = (x1, y1, x2, y2) => {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };
    comp.angle = (centerX, centerY, x, y) => {
      const dX = x - centerX;
      const dY = y - centerY;
      // Handles special case of pi/2 or 3pi/2
      const angle = dX != 0 ? Math.atan(dY / dX) : dY >= 0 ? Math.PI / 2 : 1.5 * Math.PI;
      return dX >= 0 ? angle : angle + Math.PI;
    };
    comp.polarToRadial = (centerX, centerY, length, angle, radians = true) => {
      if (!radians) {
        angle = comp.radians(angle);
      }
      const myX = centerX + length * Math.cos(angle);
      const myY = centerY + length * Math.sin(angle);
      return [myX, myY];
    };
    comp.MASS = 3;
    comp.inertia = () => {
      const a = sliders.h_pos.Value();
      return comp.MASS * (a * a - 3 * a + 3);
    };
    comp.moment = () => {
      const t1 = (sliders.f1_pos.Value() - sliders.h_pos.Value()) * sliders.f1_mag.Value() * Math.sin(comp.radians(sliders.f1_angle.Value()));
      const t2 = (sliders.f2_pos.Value() - sliders.h_pos.Value()) * sliders.f2_mag.Value() * Math.sin(comp.radians(sliders.f2_angle.Value()));
      return t1 + t2;
    };
    comp.angAcc = () => {
      return comp.moment() / comp.inertia();
    };
    comp.currRotation = () => {
      // Returns value in radians
      return 0.5 * comp.angAcc() * Math.pow(sliders.time.Value(), 2);
    };
    comp.beamRelPos = (x, y) => {
      const beamX = sliders.h_pos.Value();
      const beamY = 0;
      if (beamX === x && beamY === y) {
        return [x, y];
      }
      const dist = comp.distance(beamX, beamY, x, y);
      const angle = comp.angle(beamX, beamY, x, y);
      return comp.polarToRadial(beamX, beamY, dist, angle + comp.currRotation());
    };

    let convX = (x, g) => {
      let zero = g.corner.x + g.size.x * g.anchor.x;
      return zero + (x / g.scale.x) * g.size.x;
    };

    let convY = (y, g) => {
      let zero = g.corner.y + g.size.y * g.anchor.y;
      return zero + (y / g.scale.y) * g.size.y;
    };

    let convXY = (x, y, g) => {
      return [convX(x, g), convY(y, g)];
    };

    let graphs = {
      /*
      arbitrary name of graph
        corner: lower left point coordinates
        size: length of graph on each side
        delta: tick distancing
        scale: length of relative space to exist on each axis
        anchor: 0 - lowest point, 1 - highest point, 0.5 - middle, location of 0
        axis: Axes labels
        Title: title label
        func: what the curve should use
        Color: undefined for no curve, color for curve
      */
      large: {
        corner: { x: -13, y: -13 },
        size: { x: 26, y: 26 },
        delta: { x: 1, y: 1 },
        scale: { x: 3.25 * 2, y: 3.25 * 2 },
        anchor: { x: 0.5, y: 0.5 },
        axis: { x: "", y: "" },
        title: "",
        visible: true,
        func: undefined,
        color: "blue",
        outlines: false
      }
    };

    // Setup the graphs
    for (let key of Object.keys(graphs)) {
      // The graph of focus
      let g = graphs[key];

      // Generate the lines
      g.lines = {};
      for (let data of [
        ["left", [g.corner.x, g.corner.y], [g.corner.x, g.corner.y + g.size.y]],
        ["top", [g.corner.x, g.corner.y + g.size.y], [g.corner.x + g.size.x, g.corner.y + g.size.y]],
        ["right", [g.corner.x + g.size.x, g.corner.y], [g.corner.x + g.size.x, g.corner.y + g.size.y]],
        ["bottom", [g.corner.x, g.corner.y], [g.corner.x + g.size.x, g.corner.y]]
      ]) {
        g.lines[data[0]] = bR.create("line", [data[1], data[2]], {
          straightFirst: false,
          straightLast: false,
          fixed: true,
          strokeWidth: 3,
          strokeColor: "black",
          visible: g.visible
        });
      }

      // Generate the ticks
      bR.create("ticks", [g.lines.bottom, g.delta.x], {
        anchor: g.anchor.x,
        includeBoundaries: true,
        drawLabels: true,
        drawZero: true,
        fixed: true,
        scale: g.size.x / g.scale.x,
        label: {
          anchorX: "middle",
          anchorY: "top",
          offset: [0, -4],
          visible: g.visible,
          fontSize: 14
        },
        visible: g.visible,
        minorTicks: 3
      });

      bR.create("ticks", [g.lines.top, g.delta.x], {
        anchor: g.anchor.x,
        includeBoundaries: true,
        drawLabels: false,
        fixed: true,
        scale: g.size.x / g.scale.x,
        visible: g.visible,
        minorTicks: 3
      });

      bR.create("ticks", [g.lines.left, g.delta.y], {
        anchor: g.anchor.y,
        includeBoundaries: true,
        drawLabels: true,
        drawZero: true,
        fixed: true,
        scale: g.size.y / g.scale.y,
        label: {
          anchorX: "right",
          anchorY: "middle",
          offset: [-6, 0],
          visible: g.visible,
          fontSize: 14
        },
        visible: g.visible,
        minorTicks: 3
      });

      bR.create("ticks", [g.lines.right, g.delta.y], {
        anchor: g.anchor.y,
        includeBoundaries: true,
        drawLabels: false,
        fixed: true,
        scale: g.size.y / g.scale.y,
        visible: g.visible,
        minorTicks: 3
      });

      if (g.func != undefined) {
        // curve specific options
      }

      // Text
      if (g.title != "") {
        IH.textToUpdate[key + "_1"] = {};
        IH.textToUpdate[key + "_1"].object = bR.create("text", [g.corner.x + 0.5 * g.size.x, g.corner.y + g.size.y + 0.5, ""], {
          fixed: true,
          anchorX: "middle",
          anchorY: "bottom",
          visible: g.visible
        });
        IH.textToUpdate[key + "_1"].formula = "<b>" + g.title + "</b>";
      }

      if (g.axis.x != "") {
        IH.textToUpdate[key + "_2"] = {};
        IH.textToUpdate[key + "_2"].object = bR.create("text", [g.corner.x + 0.5 * g.size.x, g.corner.y - 0.5, ""], {
          fixed: true,
          anchorX: "middle",
          anchorY: "top",
          visible: g.visible
        });
        IH.textToUpdate[key + "_2"].formula = g.axis.x;
      }

      if (g.axis.y != "") {
        IH.textToUpdate[key + "_3"] = {};
        IH.textToUpdate[key + "_3"].object = bR.create("text", [g.corner.x - 1.25, g.corner.y + 0.5 * g.size.y, ""], {
          fixed: true,
          anchorX: "middle",
          anchorY: "bottom",
          rotate: 90,
          display: "internal",
          visible: g.visible
        });
        IH.textToUpdate[key + "_3"].formula = g.axis.y;
      }
    }

    let points = {};
    const hidden = { fixed: true, visible: false };
    const hiddenLabel = { fixed: true, visible: true, withLabel: true, size: 0 };
    const lineSegProps = { straightFirst: false, straightLast: false, fixed: true };
    // const COPY = bR.create("transform", [0, 0], { type: "translate" });

    for (let data of [
      [1, 0, "x"],
      [0, 1, "y"]
    ]) {
      bR.create("line", [convXY(-3.25 * data[0], -3.25 * data[1], graphs.large), convXY(3.25 * data[0], 3.25 * data[1], graphs.large)], {
        ...lineSegProps,
        lastArrow: true,
        strokeColor: "black",
        strokeWidth: 2,
        visible: IH.valCheck("coords", "on"),
        point2: { ...hiddenLabel, name: data[2], label: { visible: IH.valCheck("coords", "on") } }
      });
    }

    points.hinge = bR.create(
      "point",
      [
        () => {
          return convX(sliders.h_pos.Value(), graphs.large);
        },
        () => {
          return convY(0, graphs.large);
        }
      ],
      {
        size: 3,
        strokeColor: "purple",
        fillColor: "purple",
        name: ""
      }
    );

    const TRIANGLE_LENGTH = 0.2;

    points.t1 = bR.create(
      "point",
      [
        () => {
          return convX(sliders.h_pos.Value() - TRIANGLE_LENGTH / 2, graphs.large);
        },
        () => {
          return convY(0 - TRIANGLE_LENGTH, graphs.large);
        }
      ],
      { ...hidden }
    );

    points.t2 = bR.create(
      "point",
      [
        () => {
          return convX(sliders.h_pos.Value() + TRIANGLE_LENGTH / 2, graphs.large);
        },
        () => {
          return convY(0 - TRIANGLE_LENGTH, graphs.large);
        }
      ],
      { ...hidden }
    );

    points.c1 = bR.create(
      "point",
      [
        () => {
          return convX(sliders.h_pos.Value() - TRIANGLE_LENGTH, graphs.large);
        },
        () => {
          return convY(0 - TRIANGLE_LENGTH, graphs.large);
        }
      ],
      { ...hidden }
    );

    points.c2 = bR.create(
      "point",
      [
        () => {
          return convX(sliders.h_pos.Value() + TRIANGLE_LENGTH, graphs.large);
        },
        () => {
          return convY(0 - TRIANGLE_LENGTH, graphs.large);
        }
      ],
      { ...hidden }
    );

    bR.create("polygon", [points.hinge, points.t1, points.t2], {
      withLines: "false",
      borders: { strokeColor: "purple" },
      fillColor: "purple",
      fillOpacity: 1
    });

    bR.create("comb", [points.c2, points.c1], { curve: { strokeColor: "purple" }, width: 0.3 });
    bR.create("line", [points.c2, points.c1], { ...lineSegProps, strokeColor: "purple" });

    points.beam1 = bR.create(
      "point",
      [
        () => {
          const coords = comp.beamRelPos(0, 0);
          return convX(coords[0], graphs.large);
        },
        () => {
          const coords = comp.beamRelPos(0, 0);
          return convY(coords[1], graphs.large);
        }
      ],
      { ...hidden }
    );

    points.beam2 = bR.create(
      "point",
      [
        () => {
          const coords = comp.beamRelPos(3, 0);
          return convX(coords[0], graphs.large);
        },
        () => {
          const coords = comp.beamRelPos(3, 0);
          return convY(coords[1], graphs.large);
        }
      ],
      { ...hidden }
    );

    bR.create("line", [points.beam1, points.beam2], { ...lineSegProps, strokeColor: "black", strokeWidth: 5 });
    bR.create("line", [convXY(0, 0, graphs.large), convXY(3, 0, graphs.large)], { ...lineSegProps, strokeWidth: 2, dash: 2, strokeColor: "black" });

    points.f1_1 = bR.create(
      "point",
      [
        () => {
          const coords = comp.beamRelPos(sliders.f1_pos.Value(), 0);
          return convX(coords[0], graphs.large);
        },
        () => {
          const coords = comp.beamRelPos(sliders.f1_pos.Value(), 0);
          return convY(coords[1], graphs.large);
        }
      ],
      { ...hidden }
    );

    points.f1_2 = bR.create(
      "point",
      [
        () => {
          const coords = comp.polarToRadial(sliders.f1_pos.Value(), 0, sliders.f1_mag.Value(), sliders.f1_angle.Value(), false);
          const coords2 = comp.beamRelPos.apply(null, coords);
          return convX(coords2[0], graphs.large);
        },
        () => {
          const coords = comp.polarToRadial(sliders.f1_pos.Value(), 0, sliders.f1_mag.Value(), sliders.f1_angle.Value(), false);
          const coords2 = comp.beamRelPos.apply(null, coords);
          return convY(coords2[1], graphs.large);
        }
      ],
      {
        ...hiddenLabel,
        name: "F_1",
        label: {
          strokeColor: "blue",
          visible: () => {
            return sliders.f1_mag.Value() > 0;
          }
        }
      }
    );

    points.f2_1 = bR.create(
      "point",
      [
        () => {
          const coords = comp.beamRelPos(sliders.f2_pos.Value(), 0);
          return convX(coords[0], graphs.large);
        },
        () => {
          const coords = comp.beamRelPos(sliders.f2_pos.Value(), 0);
          return convY(coords[1], graphs.large);
        }
      ],
      { ...hidden }
    );

    points.f2_2 = bR.create(
      "point",
      [
        () => {
          const coords = comp.polarToRadial(sliders.f2_pos.Value(), 0, sliders.f2_mag.Value(), sliders.f2_angle.Value(), false);
          const coords2 = comp.beamRelPos.apply(null, coords);
          return convX(coords2[0], graphs.large);
        },
        () => {
          const coords = comp.polarToRadial(sliders.f2_pos.Value(), 0, sliders.f2_mag.Value(), sliders.f2_angle.Value(), false);
          const coords2 = comp.beamRelPos.apply(null, coords);
          return convY(coords2[1], graphs.large);
        }
      ],
      {
        ...hiddenLabel,
        name: "F_2",
        label: {
          strokeColor: "green",
          visible: () => {
            return sliders.f2_mag.Value() > 0;
          }
        }
      }
    );

    bR.create("line", [points.f1_1, points.f1_2], { ...lineSegProps, lastArrow: true, strokeColor: "blue", strokeWidth: 3 });

    bR.create("line", [points.f2_1, points.f2_2], { ...lineSegProps, lastArrow: true, strokeColor: "green", strokeWidth: 3 });

    bL.create(
      "text",
      [
        -15 + 0,
        TOP_Y + INTERVAL * 9.5,
        () => {
          return "<span style='color:red'><i>M</i> = </span>" + Math.round(comp.moment() * 1000, 3) / 1000;
        }
      ],
      { fontSize: LABEL_SIZE, fixed: true, anchorX: "left", anchorY: "top" }
    );

    const MOMENT_RADIUS = 0.3;

    points.momentCenter = bR.create(
      "point",
      [
        () => {
          return convX(sliders.h_pos.Value(), graphs.large);
        },
        convY(-1, graphs.large)
      ],
      {
        ...hiddenLabel,
        name: "M",
        label: {
          visible: () => {
            return comp.moment() != 0;
          },
          strokeColor: "red",
          anchorX: "middle",
          anchorY: "middle",
          offset: [-4, 9]
        }
      }
    );

    points.momentEnd = bR.create(
      "point",
      [
        () => {
          const coords = comp.polarToRadial(sliders.h_pos.Value(), -1, MOMENT_RADIUS, Math.max(0, (comp.moment() * Math.PI) / 4.5));
          return convX(coords[0], graphs.large);
        },
        () => {
          const coords = comp.polarToRadial(sliders.h_pos.Value(), -1, MOMENT_RADIUS, Math.max(0, (comp.moment() * Math.PI) / 4.5));
          return convY(coords[1], graphs.large);
        }
      ],
      { ...hidden }
    );

    points.momentStart = bR.create(
      "point",
      [
        () => {
          const coords = comp.polarToRadial(sliders.h_pos.Value(), -1, MOMENT_RADIUS, Math.min(0, (comp.moment() * Math.PI) / 4.5));
          return convX(coords[0], graphs.large);
        },
        () => {
          const coords = comp.polarToRadial(sliders.h_pos.Value(), -1, MOMENT_RADIUS, Math.min(0, (comp.moment() * Math.PI) / 4.5));
          return convY(coords[1], graphs.large);
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
        strokeColor: "red",
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
      strokeColor: "red",
      strokeWidth: 3,
      visible: () => {
        return Math.abs(comp.moment()) >= 9;
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
