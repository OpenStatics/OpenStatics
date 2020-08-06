<template>
  <div class="container-fluid">
    <!-- <div class="row justify-content-center">
      <button class="btn btn-primary mx-3" :class="{ 'btn-warning': state === 0 }" @click="() => changeState(0)">
        Clear
      </button>
      <button class="btn btn-primary mx-3" :class="{ 'btn-warning': state === 1 }" @click="() => changeState(1)">
        Step 1: External loadings on the beam
      </button>
      <button class="btn btn-primary mx-3" :class="{ 'btn-warning': state === 2 }" @click="() => changeState(2)">
        Step 2: Internal forces in the beam
      </button>
      <button class="btn btn-primary mx-3" :class="{ 'btn-warning': state === 3 }" @click="() => changeState(3)">
        Step 3: Internal force diagrams of the beam
      </button>
    </div> -->
    <div class="row my-3 justify-content-center">
      <div id="boxLeft" class="boxLeft my-2" style="width:425px; height:800px;"></div>

      <div id="boxRight" class="boxRight my-2" style="width:900px; height:800px;"></div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => {
    return {
      state: 0,
      values: {
        f_comps: "on",
        f_vis: "off",
        sum: "off",
        alpha: "off",
        beta: "off",
        gamma: "off"
      },
      textToUpdate: {
        /* arbitrary name: {
            object: reference to object
            formula: function that returns text (string)
        }*/
      },
      objectsToEnable: {
        /* arbitrary name: {
            object: reference to object
            component: component to enable/disable
            formula: function that returns true for disable
        }
        */
      },
      buttonsToToggle: {
        /* key from values: {
            possible value: corresponding button
        }
        */
      },
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

    const INTERVAL = -4.5;
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
      /*
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
      ["yT", "y", INTERVAL * 9.5, true, [-3, 0, 3], [0], "black"]*/
      ["fx", "F_x", INTERVAL * 0, true, [-5, 0, 5], [0], "blue"],
      ["fy", "F_y", INTERVAL * 1, true, [-5, 0, 5], [0], "blue"],
      ["fz", "F_z", INTERVAL * 2, true, [-5, 0, 5], [0], "blue"],
      ["f_comps", "Components of F", INTERVAL * 3, false, ["On", "on", "Off", "off"], [0]],
      ["f_vis", "F Visibility", INTERVAL * 4, false, ["On", "on", "Off", "off"], [0]],
      ["sum", "Sum of Components", INTERVAL * 5, false, ["On", "on", "Off", "off"], [0]],
      ["alpha", "Show \u03b1", INTERVAL * 6, false, ["On", "on", "Off", "off"], [0]],
      ["beta", "Show \u03b2", INTERVAL * 7, false, ["On", "on", "Off", "off"], [0]],
      ["gamma", "Show \u03b3", INTERVAL * 8, false, ["On", "on", "Off", "off"], [0]]
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
        let textbox = bL.create("input", [LEFT_X, TOP_Y + data[2] - 1.75, "", ""], {
          cssStyle: "width: 58px",
          fixed: true
        });
        let button = bL.create("button", [5, TOP_Y + data[2] - 1.75, "Update", buttonClick(textbox, sliders[data[0]])], { fixed: true });

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
              this.toggleButtons();
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
              this.toggleButtons();
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

        this.objectsToEnable[data[0] + "1"].object.rendNodeButton.classList.add("btn-primary");
        this.objectsToEnable[data[0] + "2"].object.rendNodeButton.classList.add("btn-primary");
        this.buttonsToToggle[data[0]] = {};
        this.buttonsToToggle[data[0]][data[4][1]] = this.objectsToEnable[data[0] + "1"].object;
        this.buttonsToToggle[data[0]][data[4][3]] = this.objectsToEnable[data[0] + "2"].object;
      }
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
    comp.THETA = { x: 250, y: 180, z: 150 };
    comp.radians = deg => {
      return (deg * Math.PI) / 180;
    };
    comp.degrees = rad => {
      return (rad * 180) / Math.PI;
    };
    comp.ROT = {};
    for (let axis of Object.keys(comp.THETA)) comp.ROT[axis] = comp.radians(comp.THETA[axis]);

    comp.x = (a, b, c) => {
      return (a * Math.cos(comp.ROT.z) - b * Math.sin(comp.ROT.z)) * Math.cos(comp.ROT.y) - c * Math.sin(comp.ROT.y);
    };
    comp.y = (a, b, c) => {
      return (b * Math.cos(comp.ROT.z) + a * Math.sin(comp.ROT.z)) * Math.cos(comp.ROT.x) - c * Math.sin(comp.ROT.x);
    };
    comp.xy = (a, b, c) => {
      return [comp.x(a, b, c), comp.y(a, b, c)];
    };
    comp.f_mag = () => {
      return Math.sqrt(Math.pow(sliders.fx.Value(), 2) + Math.pow(sliders.fy.Value(), 2) + Math.pow(sliders.fz.Value(), 2));
    };
    comp.alpha = () => {
      let val = comp.degrees(Math.acos(sliders.fx.Value() / comp.f_mag()));
      return Math.min(val, 180 - val);
    };
    comp.beta = () => {
      let val = comp.degrees(Math.acos(sliders.fy.Value() / comp.f_mag()));
      return Math.min(val, 180 - val);
    };
    comp.gamma = () => {
      let val = comp.degrees(Math.acos(sliders.fz.Value() / comp.f_mag()));
      return Math.min(val, 180 - val);
    };
    // comp.xS = (a, b, c) => {
    //   return comp.x(a.Value(), b.Value(), c.Value())
    // }

    // let graphs = {
    //   /*
    //   arbitrary name of graph
    //     corner: lower left point coordinates
    //     size: length of graph on each side
    //     delta: tick distancing
    //     scale: length of relative space to exist on each axis
    //     anchor: 0 - lowest point, 1 - highest point, 0.5 - middle, location of 0
    //     axis: Axes labels
    //     Title: title label
    //     func: what the curve should use
    //     Color: undefined for no curve, color for curve
    //   */
    //   //   large: {
    //   //     corner: { x: -13, y: -13 },
    //   //     size: { x: 26, y: 26 },
    //   //     delta: { x: 1, y: 1 },
    //   //     scale: { x: 3.25 * 2, y: 3.25 * 2 },
    //   //     anchor: { x: 0.5, y: 0.5 },
    //   //     axis: { x: "", y: "" },
    //   //     title: "",
    //   //     visible: true,
    //   //     func: comp.fX,
    //   //     color: "blue",
    //   //     outlines: false
    //   //   }
    // };

    // // Setup the graphs
    // for (let key of Object.keys(graphs)) {
    //   // The graph of focus
    //   let g = graphs[key];

    //   // Generate the lines
    //   g.lines = {};
    //   for (let data of [
    //     ["left", [g.corner.x, g.corner.y], [g.corner.x, g.corner.y + g.size.y]],
    //     ["top", [g.corner.x, g.corner.y + g.size.y], [g.corner.x + g.size.x, g.corner.y + g.size.y]],
    //     ["right", [g.corner.x + g.size.x, g.corner.y], [g.corner.x + g.size.x, g.corner.y + g.size.y]],
    //     ["bottom", [g.corner.x, g.corner.y], [g.corner.x + g.size.x, g.corner.y]]
    //   ]) {
    //     g.lines[data[0]] = bR.create("line", [data[1], data[2]], {
    //       straightFirst: false,
    //       straightLast: false,
    //       fixed: true,
    //       strokeWidth: 3,
    //       strokeColor: "black",
    //       visible: g.visible
    //     });
    //   }

    //   // Generate the ticks
    //   bR.create("ticks", [g.lines.bottom, g.delta.x], {
    //     anchor: g.anchor.x,
    //     includeBoundaries: true,
    //     drawLabels: true,
    //     drawZero: true,
    //     fixed: true,
    //     scale: g.size.x / g.scale.x,
    //     label: {
    //       anchorX: "middle",
    //       anchorY: "top",
    //       offset: [0, -4],
    //       visible: g.visible,
    //       fontSize: 14
    //     },
    //     visible: g.visible,
    //     minorTicks: 3
    //   });

    //   bR.create("ticks", [g.lines.top, g.delta.x], {
    //     anchor: g.anchor.x,
    //     includeBoundaries: true,
    //     drawLabels: false,
    //     fixed: true,
    //     scale: g.size.x / g.scale.x,
    //     visible: g.visible,
    //     minorTicks: 3
    //   });

    //   bR.create("ticks", [g.lines.left, g.delta.y], {
    //     anchor: g.anchor.y,
    //     includeBoundaries: true,
    //     drawLabels: true,
    //     drawZero: true,
    //     fixed: true,
    //     scale: g.size.y / g.scale.y,
    //     label: {
    //       anchorX: "right",
    //       anchorY: "middle",
    //       offset: [-6, 0],
    //       visible: g.visible,
    //       fontSize: 14
    //     },
    //     visible: g.visible,
    //     minorTicks: 3
    //   });

    //   bR.create("ticks", [g.lines.right, g.delta.y], {
    //     anchor: g.anchor.y,
    //     includeBoundaries: true,
    //     drawLabels: false,
    //     fixed: true,
    //     scale: g.size.y / g.scale.y,
    //     visible: g.visible,
    //     minorTicks: 3
    //   });

    //   if (g.func != undefined) {
    //     // curve specific options
    //   }

    //   // Text
    //   if (g.title != "") {
    //     this.textToUpdate[key + "_1"] = {};
    //     this.textToUpdate[key + "_1"].object = bR.create("text", [g.corner.x + 0.5 * g.size.x, g.corner.y + g.size.y + 0.5, ""], {
    //       fixed: true,
    //       anchorX: "middle",
    //       anchorY: "bottom",
    //       visible: g.visible
    //     });
    //     this.textToUpdate[key + "_1"].formula = "<b>" + g.title + "</b>";
    //   }

    //   if (g.axis.x != "") {
    //     this.textToUpdate[key + "_2"] = {};
    //     this.textToUpdate[key + "_2"].object = bR.create("text", [g.corner.x + 0.5 * g.size.x, g.corner.y - 0.5, ""], {
    //       fixed: true,
    //       anchorX: "middle",
    //       anchorY: "top",
    //       visible: g.visible
    //     });
    //     this.textToUpdate[key + "_2"].formula = g.axis.x;
    //   }

    //   if (g.axis.y != "") {
    //     this.textToUpdate[key + "_3"] = {};
    //     this.textToUpdate[key + "_3"].object = bR.create("text", [g.corner.x - 1.25, g.corner.y + 0.5 * g.size.y, ""], {
    //       fixed: true,
    //       anchorX: "middle",
    //       anchorY: "bottom",
    //       rotate: 90,
    //       display: "internal",
    //       visible: g.visible
    //     });
    //     this.textToUpdate[key + "_3"].formula = g.axis.y;
    //   }
    // }

    const hiddenProps = { fixed: true, visible: false };
    const hiddenLabelProps = { fixed: true, visible: true, withLabel: true, size: 0 };
    const lineSegProps = { straightFirst: false, straightLast: false };

    // axes (x, y, z)
    const axisLength = 10;
    const axisProps = { strokeColor: "black", strokeWidth: 3, ...lineSegProps, lastArrow: true };
    bR.create("line", [comp.xy(-axisLength, 0, 0), comp.xy(axisLength, 0, 0)], { ...axisProps, point2: { ...hiddenLabelProps, name: "x" } });
    bR.create("line", [comp.xy(0, -axisLength, 0), comp.xy(0, axisLength, 0)], { ...axisProps, point2: { ...hiddenLabelProps, name: "y" } });
    bR.create("line", [comp.xy(0, 0, -axisLength), comp.xy(0, 0, axisLength)], { ...axisProps, point2: { ...hiddenLabelProps, name: "z" } });

    let points = {};
    points.origin = bR.create("point", [comp.x(0, 0, 0), comp.y(0, 0, 0)], { ...hiddenProps });
    const componentColor = "blue";

    for (let data of [
      ["fx", "F_x", [1, 0, 0], "fx2", "F_x", [1, 0, 0], "origin"],
      ["fy", "F_y", [0, 1, 0], "fy2", "F_y", [1, 1, 0], "fx2"],
      ["fz", "F_z", [0, 0, 1], "fz2", "F_z", [1, 1, 1], "fy2"]
    ]) {
      let vis1 = () => {
        return valCheck("f_comps", "on")() && valCheck("sum", "off")();
      };
      points[data[0]] = bR.create(
        "point",
        [
          () => {
            let val = sliders[data[0]].Value();
            return comp.x(val * data[2][0], val * data[2][1], val * data[2][2]);
          },
          () => {
            let val = sliders[data[0]].Value();
            return comp.y(val * data[2][0], val * data[2][1], val * data[2][2]);
          }
        ],
        {
          name: "<b>" + data[1] + "</b>",
          ...hiddenLabelProps,
          label: { visible: vis1, fontSize: 14, strokeColor: componentColor }
        }
      );
      bR.create("line", [points.origin, points[data[0]]], {
        visible: vis1,
        ...lineSegProps,
        strokeColor: componentColor,
        strokeWidth: 5,
        lastArrow: true
      });

      points[data[3]] = bR.create(
        "point",
        [
          () => {
            return comp.x(sliders.fx.Value() * data[5][0], sliders.fy.Value() * data[5][1], sliders.fz.Value() * data[5][2]);
          },
          () => {
            return comp.y(sliders.fx.Value() * data[5][0], sliders.fy.Value() * data[5][1], sliders.fz.Value() * data[5][2]);
          }
        ],
        { name: "<b>" + data[4] + "</b>", ...hiddenLabelProps, label: { visible: valCheck("sum", "on"), fontSize: 14, strokeColor: componentColor } }
      );
      bR.create("line", [points[data[6]], points[data[3]]], {
        visible: valCheck("sum", "on"),
        ...lineSegProps,
        strokeColor: componentColor,
        strokeWidth: 5,
        lastArrow: true
      });
    }

    points.f = bR.create(
      "point",
      [
        () => {
          return comp.x(sliders.fx.Value(), sliders.fy.Value(), sliders.fz.Value());
        },
        () => {
          return comp.y(sliders.fx.Value(), sliders.fy.Value(), sliders.fz.Value());
        }
      ],
      { name: "<b>" + "F" + "</b>", ...hiddenLabelProps, label: { visible: valCheck("f_vis", "on"), fontSize: 14, strokeColor: "red" } }
    );

    bR.create("line", [points.origin, points.f], {
      ...lineSegProps,
      strokeColor: "red",
      lastArrow: true,
      strokeWidth: 5,
      visible: valCheck("f_vis", "on")
    });

    for (let data of [
      ["fx", "alpha", "orange", "\u03b1"],
      ["fy", "beta", "green", "\u03b2"],
      ["fz", "gamma", "purple", "\u03b3"]
    ]) {
      bR.create("polygon", [points.origin, points[data[0]], points.f], { withLines: false, fillColor: data[2], visible: valCheck(data[1], "on") });
      bR.create("line", [points[data[0]], points.f], {
        ...lineSegProps,
        dash: 2,
        strokeWidth: 5,
        strokeColor: "black",
        visible: valCheck(data[1], "on")
      });
      let angle = bR.create("angle", [points[data[0]], points.origin, points.f], { name: data[3], label: { strokeColor: data[2] } });
      angle.setAttribute({
        visible: () => {
          return valCheck(data[1], "on")() && angle.Value() < Math.PI;
        }
      });
      let angle2 = bR.create("angle", [points.f, points.origin, points[data[0]]], { name: data[3], label: { strokeColor: data[2] } });
      angle2.setAttribute({
        visible: () => {
          return valCheck(data[1], "on")() && angle2.Value() <= Math.PI;
        }
      });
    }

    for (let data of [
      [0, INTERVAL * 9, ["\u03b1", comp.alpha, "\u00B0"], "alpha", "on", "orange"],
      [10, INTERVAL * 9, ["\u03b2", comp.beta, "\u00B0"], "beta", "on", "green"],
      [20, INTERVAL * 9, ["\u03b3", comp.gamma, "\u00B0"], "gamma", "on", "purple"]
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
              Math.round(x * 1000, 3) / 1000 +
              " <span style='color:" +
              data[5] +
              "'><b>" +
              data[2][2] +
              "</b></span>"
            );
          }
        ],
        { fontSize: LABEL_SIZE, fixed: true, visible: valCheck(data[3], data[4]), anchorX: "left", anchorY: "top" }
      );
    }

    bL.addChild(bR);
    bR.addChild(bL);
    this.bL = bL;
    this.bR = bR;
    this.changeState(0);
  },
  methods: {
    changeState(newState) {
      // Handle state specific changes

      // Update the current state
      this.state = newState;

      // Align text and enable/disable components
      this.fixTextAlignment();
      this.toggleButtons();
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
    },
    toggleButtons() {
      for (const lbl of Object.keys(this.values)) {
        const currVal = this.values[lbl];
        for (const option of Object.keys(this.buttonsToToggle[lbl])) {
          if (currVal === option) {
            if (!this.buttonsToToggle[lbl][option].rendNodeButton.classList.contains("btn-warning"))
              this.buttonsToToggle[lbl][option].rendNodeButton.classList.add("btn-warning");
          } else {
            if (this.buttonsToToggle[lbl][option].rendNodeButton.classList.contains("btn-warning"))
              this.buttonsToToggle[lbl][option].rendNodeButton.classList.remove("btn-warning");
          }
        }
      }
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
