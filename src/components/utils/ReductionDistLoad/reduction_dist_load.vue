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

    const INITIAL_VALUES = { coords: "off", result: "on" };
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
      ["result", "Resultant Force", INTERVAL * 0.5, false, ["On", "on", "Off", "off"], [0]],
      ["h_pos", "Hinge position (m)", INTERVAL * 1.5, true, [0, 0, 3], [0], "purple"],
      [
        false,
        "<b>Input Distributive Load: w(x) = <span style='color:red'>a</span>x^2 + <span style='color:blue'>b</span>x + <span style='color:green'>c</span>:</b>",
        INTERVAL * 2.5,
        false
      ],
      ["a", "a", INTERVAL * 3, true, [-3, 0, 3], [0], "red"],
      ["b", "b", INTERVAL * 4, true, [-3, 0, 3], [0], "blue"],
      ["c", "c", INTERVAL * 5, true, [-3, 0, 3], [0], "green"],
      [false, "<b>Range of Distributive Load, from x_1 to x_2:</b>", INTERVAL * 6, false],
      ["x1", "x_1", INTERVAL * 6.5, true, [0, 0, 3], [0], "black"],
      ["x2", "x_2", INTERVAL * 7.5, true, [0, 3, 3], [0], "black"]
    ]) {
      IH.generate(data, sliders);
    }

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
    comp.polarToRadial = (centerX, centerY, length, angle, radians = true) => {
      if (!radians) {
        angle = comp.radians(angle);
      }
      const myX = centerX + length * Math.cos(angle);
      const myY = centerY + length * Math.sin(angle);
      return [myX, myY];
    };

    comp.minX = () => {
      return Math.min(sliders.x1.Value(), sliders.x2.Value());
    };
    comp.maxX = () => {
      return Math.max(sliders.x1.Value(), sliders.x2.Value());
    };
    comp.rangeMatch = perc => {
      perc = Math.max(0, Math.min(perc, 1));
      let diff = comp.maxX() - comp.minX();
      return perc * diff + comp.minX();
    };

    comp.wX = x => {
      return sliders.a.Value() * x * x + sliders.b.Value() * x + sliders.c.Value();
    };
    comp.f_R = () => {
      let x1 = comp.minX();
      let x2 = comp.maxX();
      let part1 = sliders.a.Value() * x1 * x1 * x1 * (1 / 3) + sliders.b.Value() * x1 * x1 * (1 / 2) + sliders.c.Value() * x1;
      let part2 = sliders.a.Value() * x2 * x2 * x2 * (1 / 3) + sliders.b.Value() * x2 * x2 * (1 / 2) + sliders.c.Value() * x2;
      return -(part2 - part1);
    };

    comp.diffInt = (x1, x2, pow) => {
      return Math.pow(x2, pow) - Math.pow(x1, pow);
    };
    comp.Area = (x1, x2) => {
      // \int ax^2+bx+cdx &= \frac{ax^3}{3}+\frac{bx^2}{2}+cx+C\\
      return (
        sliders.a.Value() * (1 / 3) * comp.diffInt(x1, x2, 3) +
        sliders.b.Value() * (1 / 2) * comp.diffInt(x1, x2, 2) +
        sliders.c.Value() * (1 / 1) * comp.diffInt(x1, x2, 1)
      );
    };
    comp.My = (x1, x2) => {
      // \int x\left(ax^2+bx+c\right)dx &= \frac{ax^4}{3}+\frac{bx^3}{2}+cx^2-\frac{ax^4}{12}-\frac{bx^3}{6}-\frac{cx^2}{2}+C
      return (
        sliders.a.Value() * (1 / 4) * comp.diffInt(x1, x2, 4) +
        sliders.b.Value() * (1 / 3) * comp.diffInt(x1, x2, 3) +
        sliders.c.Value() * (1 / 2) * comp.diffInt(x1, x2, 2)
      );
    };
    comp.Mx = (x1, x2) => {
      // \int \frac{1}{2}\left(ax^2+bx+c\right)^2dx &= \frac{1}{60}\left(6a^2x^5+15abx^4+20acx^3+10b^2x^3+30bcx^2+30c^2x\right)+C
      return (
        (1 / 60) *
        (6 * sliders.a.Value() * sliders.a.Value() * comp.diffInt(x1, x2, 5) +
          15 * sliders.a.Value() * sliders.b.Value() * comp.diffInt(x1, x2, 4) +
          20 * sliders.a.Value() * sliders.c.Value() * comp.diffInt(x1, x2, 3) +
          10 * sliders.b.Value() * sliders.b.Value() * comp.diffInt(x1, x2, 3) +
          30 * sliders.b.Value() * sliders.c.Value() * comp.diffInt(x1, x2, 2) +
          30 * sliders.c.Value() * sliders.c.Value() * comp.diffInt(x1, x2, 1))
      );
    };
    comp.xBar = (x1, x2) => {
      return comp.My(x1, x2) / comp.Area(x1, x2);
    };
    comp.yBar = (x1, x2) => {
      return comp.Mx(x1, x2) / comp.Area(x1, x2);
    };
    comp.delta = () => {
      return Math.pow(sliders.b.Value(), 2) - 4 * sliders.a.Value() * sliders.c.Value();
    };
    comp.quad = positive => {
      const sign = positive ? 1 : -1;
      return (-1 * sliders.b.Value() + sign * Math.sqrt(comp.delta())) / (2 * sliders.a.Value());
    };
    comp.xBarComp = () => {
      const easyVal = comp.xBar(comp.minX(), comp.maxX());
      // Check if a, b = 0 (y=c)
      if (sliders.a.Value() === 0 && sliders.b.Value() === 0) return easyVal;
      // Check if no quadratic intersects
      if (comp.delta() < 0) return easyVal;

      let intersects = [];
      // Check if a = 0 (y = bx + c)
      // If so, intersect must be at x = -c/b
      if (sliders.a.Value() === 0) intersects = [-sliders.c.Value() / sliders.b.Value()];
      else {
        // Since a != 0, treat like quadratic
        intersects = [comp.quad(true), comp.quad(false)];
        intersects.sort();
      }

      let vals = [comp.minX()];
      for (let val of intersects) {
        if (val >= comp.minX() && val <= comp.maxX()) vals.push(val);
      }
      vals.push(comp.maxX());
      vals = [...new Set(vals)];

      // Check if no intersections fit
      if (vals.length == 2) return easyVal;
      //console.log(vals.length);
      let xBars = [];
      let areas = [];
      let totalArea = 0;
      for (let i = 0; i < vals.length - 1; i++) {
        areas.push(comp.Area(vals[i], vals[i + 1]));
        xBars.push(comp.My(vals[i], vals[i + 1]) / areas[i]);
        areas[i] = Math.abs(areas[i]);
        totalArea += areas[i];
      }

      let finalVal = 0;
      for (let i = 0; i < areas.length; i++) {
        finalVal += (xBars[i] * areas[i]) / totalArea;
      }
      return finalVal;
    };
    comp.moment = () => {
      return (comp.xBarComp() - sliders.h_pos.Value()) * comp.f_R();
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
        color: undefined,
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
        point2: { ...hiddenLabel, name: data[2], label: { fontSize: LABEL_SIZE, visible: IH.valCheck("coords", "on") } }
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
          return convX(0, graphs.large);
        },
        () => {
          return convY(0, graphs.large);
        }
      ],
      { ...hidden }
    );

    points.beam2 = bR.create(
      "point",
      [
        () => {
          return convX(3, graphs.large);
        },
        () => {
          return convY(0, graphs.large);
        }
      ],
      { ...hidden }
    );

    bR.create("line", [points.beam1, points.beam2], { ...lineSegProps, strokeColor: "black", strokeWidth: 5 });

    // Function curve
    bR.create(
      "curve",
      [
        t => {
          return convX(t, graphs.large);
        },
        t => {
          return convY(comp.wX(t), graphs.large);
        },
        comp.minX,
        comp.maxX
      ],
      {
        name: "funcCurve",
        strokeColor: "orange",
        dash: 2,
        doAdvancedPlot: false,
        doAdvancedPlotOld: false,
        numberPointsHigh: 200,
        numberPointsLow: 200,
        strokeWidth: 3
      }
    );

    for (let data of [
      ["1", 0],
      ["2", 0.2],
      ["3", 0.4],
      ["4", 0.6],
      ["5", 0.8],
      ["6", 1]
    ]) {
      points["arrowOut_" + data[0]] = bR.create(
        "point",
        [
          () => {
            let x = comp.rangeMatch(data[1]);
            return convX(x, graphs.large);
          },
          () => {
            let x = comp.rangeMatch(data[1]);
            return convX(comp.wX(x), graphs.large);
          }
        ],
        { ...hidden }
      );
      points["arrowIn_" + data[0]] = bR.create(
        "point",
        [
          () => {
            let x = comp.rangeMatch(data[1]);
            return convX(x, graphs.large);
          },
          () => {
            //let x = comp.rangeMatch(data[1]);
            return convX(0, graphs.large);
          }
        ],
        { ...hidden }
      );
      bR.create("line", [points["arrowOut_" + data[0]], points["arrowIn_" + data[0]]], {
        ...lineSegProps,
        strokeWidth: 2,
        strokeColor: "orange",
        lastArrow: true,
        visible: () => {
          let x = comp.rangeMatch(data[1]);
          return comp.wX(x) != 0;
        }
      });
    }

    points.f_r_out = bR.create(
      "point",
      [
        () => {
          return convX(comp.xBarComp(), graphs.large);
        },
        () => {
          return convY(-comp.f_R(), graphs.large);
        }
      ],
      { ...hidden }
    );

    points.f_r_in = bR.create(
      "point",
      [
        () => {
          return convX(comp.xBarComp(), graphs.large);
        },
        () => {
          return convY(0, graphs.large);
        }
      ],
      { ...hiddenLabel, name: "F_R", label: { strokeColor: "red", fontSize: LABEL_SIZE - 4, offset: [-5, -5] } }
    );

    bR.create("line", [points.f_r_out, points.f_r_in], {
      ...lineSegProps,
      strokeColor: "red",
      strokeWidth: 3,
      lastArrow: true,
      visible: IH.valCheck("result", "on")
    });

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
          fontSize: LABEL_SIZE,
          visible: () => {
            return comp.moment() != 0 && !isNaN(comp.moment());
          },
          strokeColor: "red",
          anchorX: "middle",
          anchorY: "middle",
          offset: [-7, 13]
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

    for (let data of [
      [0, INTERVAL * 8.5, "F_R", comp.f_R, "", "red"],
      [9, INTERVAL * 8.5, "x-bar", comp.xBarComp, "", "red"],
      [20, INTERVAL * 8.5, "M", comp.moment, "", "red"]
    ]) {
      bL.create(
        "text",
        [
          -15 + data[0],
          TOP_Y + data[1],
          () => {
            let x = data[3]();
            return (
              "<span style='color:" +
              data[5] +
              "'><i>" +
              data[2] +
              "</i> = </span>" +
              Math.round(x * 1000, 3) / 1000 +
              " <span style='color:" +
              data[5] +
              "'><b>" +
              data[4] +
              "</b></span>"
            );
          }
        ],
        { fontSize: LABEL_SIZE, fixed: true, anchorX: "left", anchorY: "top" }
      );
    }

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
