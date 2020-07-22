<template>
  <div class="container-fluid">
    <div class="row my-3 justify-content-center">
      <div id="boxLeft" class="boxLeft my-2" style="width:425px; height:700px;"></div>
      <div id="boxRight" class="boxRight my-2" style="width:700px; height:700px;"></div>
    </div>
    <!-- <div id="jxgbox2" class="jxgbox" style="width:500px; height:500px; margin:auto;"></div> -->
  </div>
</template>

<script>
export default {
  components: {},
  data: () => {
    return {
      state: 0,
      values: {
        coords: "on"
      },
      textToUpdate: {},
      objectsToEnable: {},
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
    let sliders = {};
    const LABEL_SIZE = 18;

    // Function that updates a slider value to that inside the textbox
    let buttonClick = (textbox, slider) => {
      return () => {
        if (textbox.Value() === "") return;
        if (!isNaN(textbox.Value())) {
          let val = Number(textbox.Value());
          val = Math.min(slider._smax, val);
          val = Math.max(slider._smin, val);
          val = Math.round(val * 100) / 100;
          slider.setValue(val);
          textbox.rendNodeInput.value = "";
          textbox.update();
          slider.update();
          this.fixTextAlignment();
        }
      };
    };

    const INTERVAL = -4.25;
    // Generate sliders, along with their related components
    // Can either have textbox + update button, or on/off system
    const TOP_Y = 12;
    const LEFT_X = -1;
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
        "<b>y = f(x) = <span style='color:red'>a</span>x^2 + <span style='color:blue'>b</span>x + <span style='color:green'>c</span>:</b>",
        INTERVAL * 1,
        false
      ],
      ["a", "a", INTERVAL * 1.5, true, [-3, 0, 3], [0], "red"],
      ["b", "b", INTERVAL * 2.5, true, [-3, 0, 3], [0], "blue"],
      ["c", "c", INTERVAL * 3.5, true, [-3, 0, 3], [0], "green"],
      [false, "<b>Range of element, from x_1 to x_2:</b>", INTERVAL * 4.75, false],
      ["x1", "x_1", INTERVAL * 5.5, true, [-3, 0, 3], [0], "black"],
      ["x2", "x_2", INTERVAL * 6.5, true, [-3, 3, 3], [0], "black"],
      [false, "<b>Translate graph:</b>", INTERVAL * 7.75, false],
      ["xT", "x", INTERVAL * 8.5, true, [-3, 0, 3], [0], "black"],
      ["yT", "y", INTERVAL * 9.5, true, [-3, 0, 3], [0], "black"]
    ]) {
      bL.create("text", [-15, TOP_Y + data[2], data[1] + (data[0] != false ? ":" : "")], {
        fontSize: LABEL_SIZE,
        color: "black",
        fixed: true,
        useMathJax: data[0] != false ? false : data[3]
      });

      // Just label
      if (data[0] === false) continue;

      if (data[3]) {
        // True case

        sliders[data[0]] = bL.create("slider", [[LEFT_X, TOP_Y + data[2]], [9, TOP_Y + data[2]], data[4]], {
          name: "",
          withTicks: false,
          strokeColor: data[6],
          fillColor: "white",
          highline: { color: data[6] },
          baseline: { color: data[6] },
          label: {
            color: "black",
            fontSize: LABEL_SIZE,
            visible: () => {
              return data[5].includes(this.state);
            }
          },
          snapWidth: 0.01,
          visible: () => {
            return data[5].includes(this.state);
          }
        });
        let textbox = bL.create("input", [LEFT_X, TOP_Y + data[2] - 1.5, "", ""], {
          cssStyle: "width: 58px",
          fixed: true
        });
        let button = bL.create("button", [5, TOP_Y + data[2] - 1.5, "Update", buttonClick(textbox, sliders[data[0]])], { fixed: true });

        textbox.rendNodeInput.addEventListener("keyup", function(event) {
          // Number 13 is the "Enter" key on the keyboard
          if (event.keyCode === 13) {
            // Trigger the button element with a click
            button.rendNodeButton.click();
          }
        });

        this.objectsToEnable[data[0] + "1"] = {
          object: textbox,
          component: "rendNodeInput",
          formula: () => {
            return !data[5].includes(this.state);
          }
        };
        this.objectsToEnable[data[0] + "2"] = {
          object: button,
          component: "rendNodeButton",
          formula: () => {
            return !data[5].includes(this.state);
          }
        };
      } else {
        // False case
        this.objectsToEnable[data[0] + "1"] = { object: undefined, formula: undefined, component: "rendNodeButton" };
        this.objectsToEnable[data[0] + "2"] = { object: undefined, formula: undefined, component: "rendNodeButton" };
        this.objectsToEnable[data[0] + "1"].object = bL.create(
          "button",
          [
            LEFT_X,
            TOP_Y + data[2],
            data[4][0],
            () => {
              this.values[data[0]] = data[4][1];
              this.fixTextAlignment();
            }
          ],
          {
            fixed: true
          }
        );
        this.objectsToEnable[data[0] + "1"].formula = () => {
          return !data[5].includes(this.state);
        };

        this.objectsToEnable[data[0] + "2"].object = bL.create(
          "button",
          [
            5,
            TOP_Y + data[2],
            data[4][2],
            () => {
              this.values[data[0]] = data[4][3];
              this.fixTextAlignment();
            }
          ],
          {
            fixed: true,
            disabled: () => {
              return data[5].includes(this.state);
            }
          }
        );
        this.objectsToEnable[data[0] + "2"].formula = () => {
          return !data[5].includes(this.state);
        };
      }
    }

    let valCheck = (value, target) => {
      return () => {
        return this.values[value] === target;
      };
    };

    let stateCheck = states => {
      return () => {
        return states.includes(this.state);
      };
    };

    let stateValCheck = (states, value, target) => {
      return () => {
        return states.includes(this.state) && valCheck(value, target)();
      };
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

    // Handles all calculations
    let comp = {};
    comp.zero = () => {
      return 0;
    };
    comp.fX = x => {
      return sliders.a.Value() * x * x + sliders.b.Value() * x + sliders.c.Value();
    };
    comp.minX = () => {
      return Math.min(sliders.x1.Value(), sliders.x2.Value());
    };
    comp.maxX = () => {
      return Math.max(sliders.x1.Value(), sliders.x2.Value());
    };
    comp.normalize = (lil, big, val, newLil, newBig) => {
      let range = big - lil;
      let normVal = (val - lil) / range;
      let newRange = newBig - newLil;
      return normVal * newRange + newLil;
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
        const curveProps = { strokeColor: g.color, visible: g.visible, strokeWidth: 3 };

        // Function curve
        bR.create(
          "curve",
          [
            t => {
              return convX(t + sliders.xT.Value(), g);
            },
            t => {
              return convY(g.func(t) + sliders.yT.Value(), g);
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
              return convXY(comp.minX() + sliders.xT.Value(), 0 + sliders.yT.Value(), g);
            },
            () => {
              return convXY(comp.minX() + sliders.xT.Value(), comp.fX(comp.minX()) + sliders.yT.Value(), g);
            }
          ],
          { ...curveProps, straightFirst: false, straightLast: false }
        );
        // Right line
        bR.create(
          "line",
          [
            () => {
              return convXY(comp.maxX() + sliders.xT.Value(), 0 + sliders.yT.Value(), g);
            },
            () => {
              return convXY(comp.maxX() + sliders.xT.Value(), comp.fX(comp.maxX()) + sliders.yT.Value(), g);
            }
          ],
          { ...curveProps, straightFirst: false, straightLast: false }
        );
        // Baseline
        bR.create(
          "line",
          [
            () => {
              return convXY(comp.minX() + sliders.xT.Value(), 0 + sliders.yT.Value(), g);
            },
            () => {
              return convXY(comp.maxX() + sliders.xT.Value(), 0 + sliders.yT.Value(), g);
            }
          ],
          { ...curveProps, straightFirst: false, straightLast: false }
        );

        // console.log(funcCurve.points);
        let myCurvePoints = [];
        // myCurvePoints.push(
        //   bR.create(
        //     "point",
        //     [
        //       () => {
        //         return convX(comp.minX() + sliders.xT.Value(), g);
        //       },
        //       () => {
        //         return convY(0 + sliders.yT.Value(), g);
        //       }
        //     ],
        //     { visible: true, name: "" }
        //   )
        // );
        // Function curve
        for (let i = -3; i <= 3; i += 0.2) {
          myCurvePoints.push(
            bR.create(
              "point",
              [
                () => {
                  return convX(comp.normalize(-3, 3, i, comp.minX(), comp.maxX()) + sliders.xT.Value(), g);
                },
                () => {
                  return convY(comp.fX(comp.normalize(-3, 3, i, comp.minX(), comp.maxX())) + sliders.yT.Value(), g);
                }
              ],
              { visible: false, name: "" }
            )
          );
        }
        // myCurvePoints.push(
        //   bR.create(
        //     "point",
        //     [
        //       () => {
        //         return convX(comp.maxX() + sliders.xT.Value(), g);
        //       },
        //       () => {
        //         return convY(comp.fX(comp.maxX()) + sliders.yT.Value(), g);
        //       }
        //     ],
        //     { visible: false, name: "" }
        //   )
        // );
        // Right line
        for (let i = 1; i >= 0; i -= 0.1) {
          myCurvePoints.push(
            bR.create(
              "point",
              [
                () => {
                  return convX(comp.maxX() + sliders.xT.Value(), g);
                },
                () => {
                  return convY(comp.fX(comp.maxX()) * i + sliders.yT.Value(), g);
                }
              ],
              { visible: false, name: "" }
            )
          );
        }
        myCurvePoints.push(
          bR.create(
            "point",
            [
              () => {
                return convX(comp.maxX() + sliders.xT.Value(), g);
              },
              () => {
                return convY(0 + sliders.yT.Value(), g);
              }
            ],
            { visible: false, name: "" }
          )
        );
        // baseline
        for (let i = 3; i >= -3; i -= 0.5) {
          myCurvePoints.push(
            bR.create(
              "point",
              [
                () => {
                  return convX(comp.normalize(-3, 3, i, comp.minX(), comp.maxX()) + sliders.xT.Value(), g);
                },
                () => {
                  return convY(0 + sliders.yT.Value(), g);
                }
              ],
              { visible: false, name: "" }
            )
          );
        }
        // myCurvePoints.push(
        //   bR.create(
        //     "point",
        //     [
        //       () => {
        //         return convX(comp.minX() + sliders.xT.Value(), g);
        //       },
        //       () => {
        //         return convY(0 + sliders.yT.Value(), g);
        //       }
        //     ],
        //     { visible: false, name: "" }
        //   )
        // );
        // left line
        for (let i = 0.1; i <= 1.01; i += 0.1) {
          myCurvePoints.push(
            bR.create(
              "point",
              [
                () => {
                  return convX(comp.minX() + sliders.xT.Value(), g);
                },
                () => {
                  return convY(comp.fX(comp.minX()) * i + sliders.yT.Value(), g);
                }
              ],
              { visible: false, name: "" }
            )
          );
        }
        // myCurvePoints.push(
        //   bR.create(
        //     "point",
        //     [
        //       () => {
        //         return convX(comp.minX() + sliders.xT.Value(), g);
        //       },
        //       () => {
        //         return convY(comp.fX(comp.minX()) + sliders.yT.Value(), g);
        //       }
        //     ],
        //     { visible: false, name: "" }
        //   )
        // );

        // myCurvePoints.push(
        //   bR.create(
        //     "point",
        //     [
        //       () => {
        //         return convX(comp.minX() + sliders.xT.Value(), g);
        //       },
        //       () => {
        //         return convY(0 + sliders.yT.Value(), g);
        //       }
        //     ],
        //     { visible: true, name: "" }
        //   )
        // );
        bR.create("curve", JXG.Math.Numerics.bezier(myCurvePoints), {
          strokeWidth: 0,
          fillColor: "blue",
          fixed: true,
          fillOpacity: 0.5
        });
      }

      // Text
      if (g.title != "") {
        this.textToUpdate[key + "_1"] = {};
        this.textToUpdate[key + "_1"].object = bR.create("text", [g.corner.x + 0.5 * g.size.x, g.corner.y + g.size.y + 0.5, ""], {
          fixed: true,
          anchorX: "middle",
          anchorY: "bottom",
          visible: g.visible
        });
        this.textToUpdate[key + "_1"].formula = "<b>" + g.title + "</b>";
      }

      if (g.axis.x != "") {
        this.textToUpdate[key + "_2"] = {};
        this.textToUpdate[key + "_2"].object = bR.create("text", [g.corner.x + 0.5 * g.size.x, g.corner.y - 0.5, ""], {
          fixed: true,
          anchorX: "middle",
          anchorY: "top",
          visible: g.visible
        });
        this.textToUpdate[key + "_2"].formula = g.axis.x;
      }

      if (g.axis.y != "") {
        this.textToUpdate[key + "_3"] = {};
        this.textToUpdate[key + "_3"].object = bR.create("text", [g.corner.x - 1.25, g.corner.y + 0.5 * g.size.y, ""], {
          fixed: true,
          anchorX: "middle",
          anchorY: "bottom",
          rotate: 90,
          display: "internal",
          visible: g.visible
        });
        this.textToUpdate[key + "_3"].formula = g.axis.y;
      }
    }

    const hidden = { fixed: true, visible: false };
    const hiddenLabel = { fixed: true, visible: true, withLabel: true, size: 0 };

    // Coordinate lines
    // X axis
    bR.create("line", [convXY(-3.25, 0, graphs.large), convXY(3.25, 0, graphs.large)], {
      straightFirst: false,
      straightLast: false,
      firstArrow: { size: 4 },
      lastArrow: { size: 4 },
      touchLastPoint: true,
      point1: { ...hidden },
      point2: { ...hiddenLabel, name: "<b><i>x</i></b>", label: { visible: valCheck("coords", "on"), offset: [-18, -8], fontSize: 16 } },
      visible: valCheck("coords", "on"),
      strokeColor: "black",
      strokeWidth: 2
    });

    bR.create("line", [convXY(0, -3.25, graphs.large), convXY(0, 3.25, graphs.large)], {
      straightFirst: false,
      straightLast: false,
      firstArrow: { size: 4 },
      lastArrow: { size: 4 },
      touchLastPoint: true,
      point1: { ...hidden },
      point2: { ...hiddenLabel, name: "<b><i>y</i></b>", label: { visible: valCheck("coords", "on"), offset: [-18, -8], fontSize: 16 } },
      visible: valCheck("coords", "on"),
      strokeColor: "black",
      strokeWidth: 2
    });

    // Red point
    const redPoint = bR.create(
      "point",
      [
        () => {
          return convX(comp.xBar(comp.minX(), comp.maxX()) + sliders.xT.Value(), graphs.large);
        },
        () => {
          return convY(comp.yBar(comp.minX(), comp.maxX()) + sliders.yT.Value(), graphs.large);
        }
      ],
      { name: "", size: 5 }
    );

    bR.create(
      "text",
      [
        convX(0, graphs.large),
        convY(3.4, graphs.large),
        () => {
          return (
            "<b>" +
            "P = (" +
            Math.round((comp.xBar(comp.minX(), comp.maxX()) + sliders.xT.Value()) * 1000, 3) / 1000 +
            ", " +
            Math.round((comp.yBar(comp.minX(), comp.maxX()) + sliders.yT.Value()) * 1000, 3) / 1000 +
            ")</b>"
          );
        }
      ],
      { fixed: true, fontSize: 16, anchorX: "middle" }
    );

    //Math.round(x * 1000, 3) / 1000
    bL.addChild(bR);
    bR.addChild(bL);
    this.bL = bL;
    this.bR = bR;
    this.changeState(0);

    // var brd2 = JXG.JSXGraph.initBoard("jxgbox2", {
    //   boundingbox: [-1, 14, 14, -1],
    //   axis: true,
    //   keepaspectratio: true,
    //   showcopyright: false,
    //   shownavigation: false
    // });

    // var pA = [], // main points (P, Q, R)
    //   pB = [],
    //   pC = [],
    //   fA = [], // the y functions of the graphs 0, 1, 2/3
    //   gA = []; // the curves (x^2, 24/x + 1, tangent, redo of tangent)

    // gA[0] = brd2.create("curve", [
    //   function(x) {
    //     return x;
    //   },
    //   function(x) {
    //     return x * x;
    //   },
    //   0,
    //   14
    // ]);
    // gA[1] = brd2.create("curve", [
    //   function(x) {
    //     return x;
    //   },
    //   function(x) {
    //     return 24 / x + 1;
    //   },
    //   0,
    //   14
    // ]);
    // pA[0] = brd2.create("glider", [1, 1, gA[0]], { name: "$$P(1,1)$$", fixed: true });
    // pA[1] = brd2.create("intersection", [gA[0], gA[1]], { name: "Q" });
    // for (let i = 0; i < 2; i++) {
    //   gA[i].setProperty({ strokeWidth: 2, strokeColor: "#E8981D" });
    // }
    // gA[2] = brd2.create("tangent", [pA[0]], { visible: false });
    // pA[2] = brd2.create("intersection", [gA[2], gA[1]], { name: "R" });
    // for (let i = 0; i < 3; i++) {
    //   pA[i].setProperty({ size: 2, color: "#555555" });
    // }
    // gA[3] = brd2.create("curve", [
    //   function(x) {
    //     return x;
    //   },
    //   function(x) {
    //     return gA[2].getSlope() * x + gA[2].getRise();
    //   },
    //   0,
    //   14
    // ]);
    // fA[0] = function(x) {
    //   return x * x;
    // };
    // fA[1] = function(x) {
    //   return 24 / x + 1;
    // };
    // fA[2] = function(x) {
    //   return gA[2].getSlope() * x + gA[2].getRise();
    // };
    // for (let i = 0; i < pA[1].X() * 2; i++) {
    //   pB.push(brd2.create("point", [i * 0.5, fA[0](i * 0.5)]));
    // }
    // for (let i = 0; i < (pA[2].X() * 1 - pA[1].X()) * 2; i++) {
    //   pB.push(brd2.create("point", [pA[1].X() + i * 0.5, fA[1](pA[1].X() + i * 0.5)]));
    // }
    // for (let i = 0; i < (pA[2].X() * 1 - pA[0].X()) * 2; i++) {
    //   pB.push(brd2.create("point", [pA[2].X() - i * 0.5, fA[2](pA[2].X() - i * 0.5)]));
    // }
    // for (let i = 0; i < pB.length; i++) {
    //   pB[i].setProperty({ visible: false });
    // }
    // pC = pB.slice(3, pB.length);
    // gA[4] = brd2.create("curve", JXG.Math.Numerics.bezier(pC), { fillColor: "red", strokeWidth: 0.5, fixed: true, fillOpacity: 0.5 });
  },
  methods: {
    changeState(newState) {
      // Handle state specific changes

      // Update the current state
      this.state = newState;

      // Align text and enable/disable components
      this.fixTextAlignment();
      this.bL.fullUpdate();
      //this.bR.fullUpdate();
    },
    fixTextAlignment() {
      for (const lbl of Object.keys(this.textToUpdate)) {
        this.textToUpdate[lbl].object.setText("");
        this.textToUpdate[lbl].object.setText(this.textToUpdate[lbl].formula);
      }
      // Also does buttons
      for (const lbl of Object.keys(this.objectsToEnable)) {
        // console.log(lbl);
        this.objectsToEnable[lbl].object[this.objectsToEnable[lbl].component].disabled = this.objectsToEnable[lbl].formula();
      }
    }
  }
};
</script>
