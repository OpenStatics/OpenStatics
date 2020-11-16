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

    const INITIAL_VALUES = { coords: "off", b: "1" };
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
      [
        false,
        "<b>Input y = f(x) = <span style='color:red'>a</span>x^{<span style='color:blue'>b</span>} + <span style='color:green'>c</span>:</b>",
        INTERVAL * 1,
        false
      ],
      ["a", "a", INTERVAL * 1.5, true, [0, 0, 3], [0], "red"],
      [false, "b", INTERVAL * 2.5, false],
      ["c", "c", INTERVAL * 3.5, true, [-3, 0, 3], [0], "green"],
      [false, "<b>Range of element, from x_1 to x_2:</b>", INTERVAL * 4.75, false],
      ["x1", "x_1", INTERVAL * 5.5, true, [0, 0, 3], [0], "black"],
      ["x2", "x_2", INTERVAL * 6.5, true, [0, 3, 3], [0], "black"]
    ]) {
      IH.generate(data, sliders);
    }

    IH.buttonsToToggle.b = {};
    for (let data of [
      ["1", -1, "1/3"],
      ["2", 2, "1/2"],
      ["3", 5.2, "1"],
      ["4", 7.5, "2"]
    ]) {
      // Left button (usually "on")
      IH.objectsToEnable["b" + data[0]] = {
        object: bL.create(
          "button",
          [
            data[1],
            TOP_Y + INTERVAL * 2.5,
            data[2],
            () => {
              IH.values.b = data[2];
              IH.fixTextAlignment();
              IH.toggleButtons();
            }
          ],
          {
            fixed: true
          }
        ),
        formula: () => {
          return !IH.stateCheck([0])();
        },
        component: "rendNodeButton"
      };
      // Make buttons blue
      IH.objectsToEnable["b" + data[0]].object.rendNodeButton.classList.add("btn-primary");
      // Setup yellow button system for this value
      IH.buttonsToToggle.b[data[2]] = IH.objectsToEnable["b" + data[0]].object;
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
    comp.bObj = {};
    comp.bObj["1/3"] = 1 / 3;
    comp.bObj["1/2"] = 1 / 2;
    comp.bObj["1"] = 1;
    comp.bObj["2"] = 2;
    comp.b = () => {
      return comp.bObj[this.IH.values.b];
    };

    comp.fX = x => {
      return sliders.a.Value() * Math.pow(x, comp.b()) + sliders.c.Value();
    };
    comp.minX = () => {
      return Math.min(sliders.x1.Value(), sliders.x2.Value());
    };
    comp.maxX = () => {
      return Math.max(sliders.x1.Value(), sliders.x2.Value());
    };
    comp.diffInt = (x1, x2, pow) => {
      return Math.pow(x2, pow) - Math.pow(x1, pow);
    };
    comp.Area = (x1, x2) => {
      // \int _0^3\:\:ax^b+cdx = a\frac{3^{b+1}}{b+1}+3c
      return sliders.a.Value() * (1 / (comp.b() + 1)) * comp.diffInt(x1, x2, comp.b() + 1) + sliders.c.Value() * comp.diffInt(x1, x2, 1);
      // if (this.IH.values.b === "2") {
      //   return sliders.a.Value() * (1 / 3) * comp.diffInt(x1, x2, 3) + sliders.c.Value() * (1 / 1) * comp.diffInt(x1, x2, 1);
      // }
    };
    comp.My = (x1, x2) => {
      // \int \:x\left(ax^b+c\right)dx = \frac{ax^{b+2}}{b+2}+\frac{cx^2}{2}
      return sliders.a.Value() * (1 / (comp.b() + 2)) * comp.diffInt(x1, x2, comp.b() + 2) + sliders.c.Value() * (1 / 2) * comp.diffInt(x1, x2, 2);
    };
    comp.Mx = (x1, x2) => {
      // \int \:0.5\left(ax^b+c\right)^2dx = =0.5\left(\frac{a^2x^{2b+1}}{2b+1}+\frac{2acx^{b+1}}{b+1}+c^2x\right)
      return (
        0.5 *
        ((sliders.a.Value() * sliders.a.Value() * comp.diffInt(x1, x2, 2 * comp.b() + 1)) / (2 * comp.b() + 1) +
          (2 * sliders.a.Value() * sliders.c.Value() * comp.diffInt(x1, x2, comp.b() + 1)) / (comp.b() + 1) +
          sliders.c.Value() * sliders.c.Value() * comp.diffInt(x1, x2, 1))
      );
    };
    comp.delta = () => {
      return -4 * sliders.a.Value() * sliders.c.Value();
    };
    comp.quad = positive => {
      const sign = positive ? 1 : -1;
      return (sign * Math.sqrt(comp.delta())) / (2 * sliders.a.Value());
    };
    comp.getBoundVals = () => {
      const easyVal = [comp.minX(), comp.maxX()];
      if (sliders.a.Value() === 0) return easyVal;

      let intersects = [];
      if (this.IH.values.b === "2") {
        // Check if no quadratic intersects
        if (comp.delta() < 0) return easyVal;
        // there must be intersects
        intersects = [comp.quad(true), comp.quad(false)];
        intersects.sort();
      } else if (this.IH.values.b === "1") {
        // Already assume a != 0, so must be intersect
        // If so, intersect must be at x = -c/a
        intersects = [-sliders.c.Value() / sliders.a.Value()];
      } else if (this.IH.values.b === "1/2") {
        // Already assume a != 0, so must be intersect
        // If so, intersect must be at x = (-c/a)^2
        intersects = [Math.pow(-sliders.c.Value() / sliders.a.Value(), 2)];
      } else if (this.IH.values.b === "1/3") {
        // Already assume a != 0, so must be intersect
        // If so, intersect must be at x = (-c/a)^3
        intersects = [Math.pow(-sliders.c.Value() / sliders.a.Value(), 3)];
      }

      let vals = [comp.minX()];
      for (let val of intersects) {
        if (val >= comp.minX() && val <= comp.maxX()) vals.push(val);
      }
      vals.push(comp.maxX());
      vals = [...new Set(vals)];
      return vals;
    };
    comp.xBar = (x1, x2) => {
      return comp.My(x1, x2) / comp.Area(x1, x2);
    };
    comp.yBar = (x1, x2) => {
      return comp.Mx(x1, x2) / comp.Area(x1, x2);
    };
    comp.xBarComp = () => {
      const easyVal = comp.xBar(comp.minX(), comp.maxX());
      // Check if a, b = 0 (y=c)
      let vals = comp.getBoundVals();
      // Check if no intersections fit
      if (sliders.a.Value() === 0 && sliders.c.Value() === 0) return;
      if (vals.length === 2) return easyVal;
      if (vals.length === 1) return comp.minX();
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
    comp.yBarComp = () => {
      const easyVal = comp.yBar(comp.minX(), comp.maxX());
      // Check if a, b = 0 (y=c)
      let vals = comp.getBoundVals();
      // Check if no intersections fit
      if (vals.length == 2) return easyVal;
      if (vals.length == 1) return comp.fX(comp.minX()) / 2;

      let yBars = [];
      let areas = [];
      let totalArea = 0;
      for (let i = 0; i < vals.length - 1; i++) {
        areas.push(comp.Area(vals[i], vals[i + 1]));
        yBars.push(comp.Mx(vals[i], vals[i + 1]) / areas[i]);
        areas[i] = Math.abs(areas[i]);
        totalArea += areas[i];
      }

      let finalVal = 0;
      for (let i = 0; i < areas.length; i++) {
        finalVal += (yBars[i] * areas[i]) / totalArea;
      }
      return finalVal;
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
        scale: { x: 4, y: 4 },
        anchor: { x: 0.3 / 4, y: 0.3 / 4 },
        axis: { x: "", y: "" },
        title: "",
        visible: true,
        func: comp.fX,
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
        const curveProps = { strokeColor: g.color, visible: g.visible, strokeWidth: 3 };
        bR.create(
          "curve",
          [
            t => {
              return convX(t, g);
            },
            t => {
              return convY(g.func(t), g);
            },
            comp.minX,
            comp.maxX
          ],
          { name: "funcCurve", ...curveProps, doAdvancedPlot: false, doAdvancedPlotOld: false, numberPointsHigh: 400, numberPointsLow: 400 }
        );
        // Left line
        bR.create(
          "line",
          [
            () => {
              return convXY(comp.minX(), 0, g);
            },
            () => {
              return convXY(comp.minX(), comp.fX(comp.minX()), g);
            }
          ],
          { ...curveProps, straightFirst: false, straightLast: false }
        );
        // Right line
        bR.create(
          "line",
          [
            () => {
              return convXY(comp.maxX(), 0, g);
            },
            () => {
              return convXY(comp.maxX(), comp.fX(comp.maxX()), g);
            }
          ],
          { ...curveProps, straightFirst: false, straightLast: false }
        );
        // Baseline
        bR.create(
          "line",
          [
            () => {
              return convXY(comp.minX(), 0, g);
            },
            () => {
              return convXY(comp.maxX(), 0, g);
            }
          ],
          { ...curveProps, straightFirst: false, straightLast: false }
        );
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

    const hidden = { fixed: true, visible: false };
    const hiddenLabel = { fixed: true, visible: true, withLabel: true, size: 0 };

    let points = {};
    points.val1 = bR.create(
      "point",
      [
        () => {
          let vals = comp.getBoundVals();
          return convX(vals[0], graphs.large);
        },
        () => {
          return convY(0, graphs.large);
        }
      ],
      { ...hidden, name: "S" }
    );
    points.val2 = bR.create(
      "point",
      [
        () => {
          let vals = comp.getBoundVals();
          return convX(vals[vals.length - 1], graphs.large);
        },
        () => {
          return convY(0, graphs.large);
        }
      ],
      { ...hidden, name: "E" }
    );
    points.val3 = bR.create(
      "point",
      [
        () => {
          let vals = comp.getBoundVals();
          return convX(vals[1], graphs.large);
        },
        () => {
          return convY(0, graphs.large);
        }
      ],
      { ...hidden, name: "M" }
    );

    points.center = bR.create(
      "point",
      [
        () => {
          return convX(comp.xBarComp(), graphs.large);
        },
        () => {
          return convY(comp.yBarComp(), graphs.large);
        }
      ],
      { name: "" }
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
