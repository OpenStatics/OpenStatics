<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
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
    </div>
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
      state: 3,
      values: {
        reactive: "off",
        i_force: "off",
        diagram_s: "on",
        diagram_b: "on"
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
    bL.resizeContainer(425, 800);

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
    bR.resizeContainer(900, 800);

    // All sliders are stored in these objects
    // They can be accessed with brackets sliders["force"] or dot notation sliders.force
    let sliders = {};
    const LABEL_SIZE = 16;

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
      ["f_pos", "Position of force (ft)", INTERVAL * 0.5, true, [0, 9, 12], [1, 2, 3], "blue"],
      ["f_mag", "Magnitude of force (k-lbs)", INTERVAL * 1.5, true, [0, 2.5, 5], [1, 2, 3], "blue"],
      ["l_pos", "Position of load (ft)", INTERVAL * 2.5, true, [0, 6, 12], [1, 2, 3], "blue"],
      ["l_mag", "Magnitude of load (k-lbs/ft)", INTERVAL * 3.5, true, [0, 0.5, 1], [1, 2, 3], "blue"],
      ["reactive", "Reactive Forces & Moment", INTERVAL * 4.5, false, ["On", "on", "Off", "off"], [1]],
      ["s_pos", "Position of section (ft)", INTERVAL * 6, true, [0, 6, 12], [2, 3], "black"],
      ["i_force", "Internal Forces", INTERVAL * 7, false, ["On", "on", "Off", "off"], [2]],
      ["diagram_s", "Shear Force Diagram", INTERVAL * 8.5, false, ["On", "on", "Off", "off"], [3]],
      ["diagram_b", "Bending Moment Diagram", INTERVAL * 9, false, ["On", "on", "Off", "off"], [3]]
    ]) {
      bL.create("text", [-15, TOP_Y + data[2], data[1] + ":"], {
        fontSize: LABEL_SIZE,
        color: "black",
        fixed: true
      });

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

    let comp = {};
    comp.LENGTH = 12;
    comp.WIDTH = 0.5;
    comp.HEIGHTLOAD = comp.WIDTH + 0.75;
    comp.RECT2MID = -4;

    comp.forceW = () => {
      return sliders.l_mag.Value() * sliders.l_pos.Value();
    };
    comp.reacB = () => {
      return (comp.forceW() * (sliders.l_pos.Value() / 2) + sliders.f_mag.Value() * sliders.f_pos.Value()) / comp.LENGTH;
    };
    comp.reacA = () => {
      return comp.forceW() + sliders.f_mag.Value() - comp.reacB();
    };
    comp.v1 = x => {
      return comp.reacA() - sliders.l_mag.Value() * x;
    };
    comp.v2 = x => {
      if (sliders.f_pos.Value() > sliders.l_pos.Value()) {
        return comp.reacA() - sliders.l_mag.Value() * sliders.l_pos.Value();
      } else {
        return comp.reacA() - sliders.f_mag.Value() - sliders.l_mag.Value() * x;
      }
    };
    // eslint-disable-next-line
    comp.v3 = x => {
      return comp.reacA() - sliders.f_mag.Value() - sliders.l_mag.Value() * sliders.l_pos.Value();
    };
    comp.m1 = x => {
      return comp.reacA() * x - sliders.l_mag.Value() * 0.5 * x * x;
    };
    comp.m2 = x => {
      if (sliders.f_pos.Value() > sliders.l_pos.Value()) {
        return comp.reacA() * x - sliders.l_mag.Value() * sliders.l_pos.Value() * (x - sliders.l_pos.Value() / 2);
      } else {
        return comp.reacA() * x - sliders.l_mag.Value() * 0.5 * x * x - sliders.f_mag.Value() * (x - sliders.f_pos.Value());
      }
    };
    comp.m3 = x => {
      return (
        comp.reacA() * x -
        sliders.l_mag.Value() * sliders.l_pos.Value() * (x - sliders.l_pos.Value() / 2) -
        sliders.f_mag.Value() * (x - sliders.f_pos.Value())
      );
    };

    comp.vc = ps => {
      let small = Math.min(sliders.l_pos.Value(), sliders.f_pos.Value());
      let large = Math.max(sliders.l_pos.Value(), sliders.f_pos.Value());
      if (ps < small) return comp.v1(ps);
      else if (small <= ps && ps <= large) return comp.v2(ps);
      else return comp.v3(ps);
    };

    comp.mc = ps => {
      let small = Math.min(sliders.l_pos.Value(), sliders.f_pos.Value());
      let large = Math.max(sliders.l_pos.Value(), sliders.f_pos.Value());
      if (ps < small) return comp.m1(ps);
      else if (small <= ps && ps <= large) return comp.m2(ps);
      else return comp.m3(ps);
    };
    // eslint-disable-next-line
    comp.zero = () => {
      return 0;
    };

    for (let data of [
      [0, INTERVAL * 5, ["A_x", comp.zero, "k-lbs", false], [1, 2, 3], "reactive", "on", "red"],
      [10, INTERVAL * 5, ["A_y", comp.reacA, "k-lbs", false], [1, 2, 3], "reactive", "on", "red"],
      [20, INTERVAL * 5, ["B_y", comp.reacB, "k-lbs", false], [1, 2, 3], "reactive", "on", "red"],
      [0, INTERVAL * 7.5, ["M_C", comp.mc, "k-lbs*ft", true], [1, 2, 3], "i_force", "on", "purple"],
      [12.5, INTERVAL * 7.5, ["V_C", comp.vc, "k-lbs", true], [2, 3], "i_force", "on", "purple"]
    ]) {
      bL.create(
        "text",
        [
          -15 + data[0],
          TOP_Y + data[1],
          () => {
            let x = data[2][3]
              ? data[2][1](
                  (() => {
                    return sliders.s_pos.Value();
                  })()
                )
              : data[2][1]();
            return (
              "<span style='color:" +
              data[6] +
              "'><i>" +
              data[2][0] +
              "</i> = </span>" +
              Math.round(x * 1000, 3) / 1000 +
              " <span style='color:" +
              data[6] +
              "'><b>" +
              data[2][2] +
              "</b></span>"
            );
          }
        ],
        { fontSize: LABEL_SIZE, fixed: true, visible: stateValCheck(data[3], data[4], data[5]), anchorX: "left", anchorY: "top" }
      );
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
        Color: undefined for no curve, color for curve
        Outlines: true for zero line & point
      */
      large: {
        corner: { x: -14, y: 0 },
        size: { x: 1.8 * 17, y: 1.8 * 8 },
        delta: { x: 5, y: 2 },
        scale: { x: 17, y: 8 },
        anchor: { x: 2 / 17, y: 6 / 8 },
        axis: { x: "", y: "" },
        title: "",
        visible: true,
        func: undefined,
        color: undefined,
        outlines: false
      },
      shear: {
        corner: { x: -13, y: -8 },
        size: { x: 1.2 * 11, y: 1.2 * 5 },
        delta: { x: 2, y: 5 },
        scale: { x: 12, y: 16 },
        anchor: { x: 0, y: 0.5 },
        axis: { x: "x (ft)", y: "V (klbs)" },
        title: "Shear Force",
        visible: stateValCheck([3], "diagram_s", "on"),
        func: ps => {
          return comp.vc(ps);
        },
        color: "purple",
        outlines: true
      },
      moment: {
        corner: { x: 3, y: -8 },
        size: { x: 1.2 * 11, y: 1.2 * 5 },
        delta: { x: 2, y: 5 },
        scale: { x: 12, y: 25 },
        anchor: { x: 0, y: 0 },
        axis: { x: "x (ft)", y: "M (klbs*ft)" },
        title: "Bending Moment",
        visible: stateValCheck([3], "diagram_b", "on"),
        func: ps => {
          return comp.mc(ps);
        },
        color: "green",
        outlines: true
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
          visible: g.visible
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
          visible: g.visible
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

      if (g.outlines) {
        bR.create("line", [convXY(0, 0, g), convXY(12, 0, g)], {
          straightFirst: false,
          straightLast: false,
          strokeWidth: 1,
          fixed: true,
          strokeColor: "black",
          visible: g.visible
        });

        // bR.create(
        //   "line",
        //   [
        //     () => {
        //       return convXY(sliders.s_pos.Value(), g.scale.y / 2, g);
        //     },
        //     () => {
        //       return convXY(sliders.s_pos.Value(), -g.scale.y / 2, g);
        //     }
        //   ],
        //   {
        //     straightFirst: false,
        //     straightLast: false,
        //     strokeWidth: 2,
        //     fixed: true,
        //     strokeColor: "black",
        //     dash: 2,
        //     visible: g.visible
        //   }
        // );
      }

      if (g.func != undefined) {
        bR.create(
          "curve",
          [
            t => {
              return convX(t, g);
            },
            t => {
              return convY(g.func(t), g);
            },
            0,
            12
          ],
          { strokeColor: g.color, visible: g.visible, strokeWidth: 3, doAdvancedPlot: true, recursionDepthHigh: 13 }
        );

        bR.create(
          "point",
          [
            () => {
              return convX(sliders.s_pos.Value(), g);
            },
            () => {
              return convY(g.func(sliders.s_pos.Value()), g);
            }
          ],
          { fillColor: "red", strokeColor: "red", size: 2, name: "", visible: g.visible }
        );
      }

      // Text
      this.textToUpdate[key + "_1"] = {};
      this.textToUpdate[key + "_1"].object = bR.create("text", [g.corner.x + 0.5 * g.size.x, g.corner.y + g.size.y + 0.5, ""], {
        fixed: true,
        anchorX: "middle",
        anchorY: "bottom",
        visible: g.visible
      });
      this.textToUpdate[key + "_1"].formula = "<b>" + g.title + "</b>";

      this.textToUpdate[key + "_2"] = {};
      this.textToUpdate[key + "_2"].object = bR.create("text", [g.corner.x + 0.5 * g.size.x, g.corner.y - 0.5, ""], {
        fixed: true,
        anchorX: "middle",
        anchorY: "top",
        visible: g.visible
      });
      this.textToUpdate[key + "_2"].formula = g.axis.x;

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

    // let points = {};
    // let lines = {};

    let hidden = { fixed: true, visible: false };
    let hiddenLabel = { fixed: true, visible: true, withLabel: true, size: 0 };

    let i_force_drop = slider => {
      return slider.Value() >= sliders.s_pos.Value() && valCheck("i_force", "on")() && this.state >= 2 ? comp.RECT2MID : 0;
    };

    // Blue box part 1

    bR.create(
      "polygon",
      [
        convXY(0, -comp.WIDTH, graphs.large),
        //[convX(0, graphs.large), convY(-BOX_HEIGHT, graphs.large)],
        convXY(0, comp.WIDTH, graphs.large),
        () => {
          return convXY(sliders.s_pos.Value(), comp.WIDTH, graphs.large);
        },
        () => {
          return convXY(sliders.s_pos.Value(), -comp.WIDTH, graphs.large);
        }
      ],
      { vertices: { visible: false }, fixed: true, withLines: false, fillColor: "blue" }
    );

    bR.create(
      "polygon",
      [
        () => {
          const offset = valCheck("i_force", "on")() ? comp.RECT2MID : 0;
          return convXY(sliders.s_pos.Value(), -comp.WIDTH + offset, graphs.large);
        },
        () => {
          const offset = valCheck("i_force", "on")() ? comp.RECT2MID : 0;
          return convXY(sliders.s_pos.Value(), comp.WIDTH + offset, graphs.large);
        },
        () => {
          const offset = valCheck("i_force", "on")() ? comp.RECT2MID : 0;
          return convXY(comp.LENGTH, comp.WIDTH + offset, graphs.large);
        },
        () => {
          const offset = valCheck("i_force", "on")() ? comp.RECT2MID : 0;
          return convXY(comp.LENGTH, -comp.WIDTH + offset, graphs.large);
        }
      ],
      { vertices: { visible: false }, fixed: true, withLines: false, fillColor: "blue" }
    );

    // Force line
    bR.create(
      "line",
      [
        () => {
          return convXY(sliders.f_pos.Value(), 0 + i_force_drop(sliders.f_pos), graphs.large);
        },
        () => {
          return convXY(sliders.f_pos.Value(), sliders.f_mag.Value() * (2 / 5) + i_force_drop(sliders.f_pos), graphs.large);
        }
      ],
      {
        straightFirst: false,
        straightLast: false,
        firstArrow: true,
        fixed: true,
        touchFirstPoint: true,
        strokeWidth: 3,
        visible: stateCheck([1, 2, 3]),
        point1: { size: 2, strokeColor: "blue", fillColor: "blue", name: "", fixed: true, visible: stateCheck([1, 2, 3]) },
        point2: {
          ...hiddenLabel,
          name: "F",
          label: { visible: stateCheck([1, 2, 3]), offset: [5, -5], strokeColor: "blue" }
        }
      }
    );

    //this.textToUpdate.forceLabel = { object: lines.force.point2.label, formula: "F" };

    // Support pieces (green)
    const T_HEIGHT = 0.5;

    let scaleR = r => {
      return (r / graphs.large.scale.x) * graphs.large.size.x;
    };

    // Left triangle
    bR.create(
      "polygon",
      [
        convXY(0, -comp.WIDTH, graphs.large),
        convXY(-T_HEIGHT, -comp.WIDTH - T_HEIGHT, graphs.large),
        convXY(T_HEIGHT, -comp.WIDTH - T_HEIGHT, graphs.large)
      ],
      {
        vertices: { visible: false },
        withLines: false,
        fillColor: "green",
        fixed: true,
        fillOpacity: 1,
        visible: stateValCheck([1], "reactive", "off")
      }
    );

    // Left circle
    bR.create("circle", [bR.create("point", [convX(0, graphs.large), convY(-comp.WIDTH, graphs.large)], { ...hidden }), scaleR(0.15)], {
      strokeColor: "green",
      fixed: true,
      visible: stateValCheck([1], "reactive", "off"),
      fillColor: "green"
    });

    // Right circle
    bR.create(
      "circle",
      [bR.create("point", [convX(comp.LENGTH, graphs.large), convY(-comp.WIDTH - T_HEIGHT / 2, graphs.large)], { ...hidden }), scaleR(T_HEIGHT / 2)],
      { strokeColor: "green", fixed: true, visible: stateValCheck([1], "reactive", "off") }
    );

    // Combs
    const C_LENGTH = 0.75;
    for (let xPoint of [0, comp.LENGTH]) {
      bR.create(
        "line",
        [convXY(xPoint - C_LENGTH, -comp.WIDTH - T_HEIGHT, graphs.large), convXY(xPoint + C_LENGTH, -comp.WIDTH - T_HEIGHT, graphs.large)],
        {
          strokeColor: "green",
          strokeWidth: 2,
          straightFirst: false,
          straightLast: false,
          visible: stateValCheck([1], "reactive", "off")
        }
      );
      bR.create(
        "comb",
        [convXY(xPoint + C_LENGTH, -comp.WIDTH - T_HEIGHT, graphs.large), convXY(xPoint - C_LENGTH, -comp.WIDTH - T_HEIGHT, graphs.large)],
        {
          curve: { strokeColor: "green", visible: stateValCheck([1], "reactive", "off") },
          visible: stateValCheck([1], "reactive", "off"),
          width: 0.3
        }
      );
    }

    // Weight arrows
    // Base line
    bR.create(
      "line",
      [
        () => {
          return convXY(0, sliders.l_mag.Value() * 0.5 + comp.WIDTH + 0.75, graphs.large);
        },
        () => {
          return convXY(
            stateValCheck([2, 3], "i_force", "on")() ? Math.min(sliders.l_pos.Value(), sliders.s_pos.Value()) : sliders.l_pos.Value(),
            sliders.l_mag.Value() * 0.5 + comp.WIDTH + 0.75,
            graphs.large
          );
        }
      ],
      { strokeColor: "blue", straightFirst: false, straightLast: false, visible: stateCheck([1, 2, 3]) }
    );
    // Arrows
    for (let x = 0; x <= 12; x += 0.25) {
      bR.create(
        "line",
        [
          () => {
            return convXY(x, comp.WIDTH, graphs.large);
          },
          () => {
            return convXY(x, sliders.l_mag.Value() * 0.5 + comp.WIDTH + 0.75, graphs.large);
          }
        ],
        {
          strokeWidth: 1,
          straightFirst: false,
          straightLast: false,
          firstArrow: { size: 5 },
          point1: { ...hidden },
          point2: { ...hidden },
          fixed: true,
          visible: () => {
            let limit = stateValCheck([2, 3], "i_force", "on")() ? Math.min(sliders.l_pos.Value(), sliders.s_pos.Value()) : sliders.l_pos.Value();
            return this.state >= 1 && sliders.l_pos.Value() != 0 && sliders.l_mag.Value() != 0 && limit >= x;
          }
        }
      );
    }

    // Second weight piece
    // Base line
    bR.create(
      "line",
      [
        () => {
          return convXY(sliders.s_pos.Value(), sliders.l_mag.Value() * 0.5 + comp.WIDTH + 0.75 - 4, graphs.large);
        },
        () => {
          return convXY(sliders.l_pos.Value(), sliders.l_mag.Value() * 0.5 + comp.WIDTH + 0.75 - 4, graphs.large);
        }
      ],
      {
        strokeColor: "blue",
        straightFirst: false,
        straightLast: false,
        visible: () => {
          return sliders.l_pos.Value() > sliders.s_pos.Value() && stateValCheck([2, 3], "i_force", "on")();
        }
      }
    );
    // Arrows
    for (let x = 0; x <= 12; x += 0.25) {
      bR.create(
        "line",
        [
          () => {
            return convXY(x + sliders.s_pos.Value(), comp.WIDTH - 4, graphs.large);
          },
          () => {
            return convXY(x + sliders.s_pos.Value(), sliders.l_mag.Value() * 0.5 + comp.WIDTH + 0.75 - 4, graphs.large);
          }
        ],
        {
          strokeWidth: 1,
          straightFirst: false,
          straightLast: false,
          firstArrow: { size: 5 },
          point1: { ...hidden },
          point2: { ...hidden },
          fixed: true,
          visible: () => {
            let limit = sliders.l_pos.Value() - sliders.s_pos.Value();
            return stateValCheck([2, 3], "i_force", "on")() && limit >= x;
          }
        }
      );
    }

    // Ax line
    bR.create("line", [convXY(-1, 0, graphs.large), convXY(0, 0, graphs.large)], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      point1: {
        ...hiddenLabel,
        name: "A_x",
        label: {
          visible: () => {
            return stateValCheck([1], "reactive", "on")() || stateValCheck([2], "i_force", "off")();
          },
          offset: [-15, 10],
          strokeColor: "red"
        }
      },
      point2: { ...hidden },
      strokeColor: "red",
      strokeWidth: 3,
      visible: () => {
        return stateValCheck([1], "reactive", "on")() || stateValCheck([2], "i_force", "off")();
      }
    });

    // Ay line
    bR.create(
      "line",
      [
        convXY(0, 0, graphs.large),
        () => {
          return convXY(0, (-1 / 3) * comp.reacA(), graphs.large);
        }
      ],
      {
        straightFirst: false,
        straightLast: false,
        firstArrow: true,
        point2: {
          ...hiddenLabel,
          name: "A_y",
          label: {
            visible: stateValCheck([1, 2, 3], "reactive", "on"),
            offset: [-20, 10],
            strokeColor: "red"
          }
        },
        point1: { ...hidden },
        strokeColor: "red",
        strokeWidth: 3,
        visible: stateValCheck([1, 2, 3], "reactive", "on")
      }
    );

    // By line
    bR.create(
      "line",
      [
        () => {
          return convXY(12, i_force_drop(sliders.s_pos), graphs.large);
        },
        () => {
          return convXY(12, i_force_drop(sliders.s_pos) + (-1 / 3) * comp.reacB(), graphs.large);
        }
      ],
      {
        straightFirst: false,
        straightLast: false,
        firstArrow: true,
        point2: {
          ...hiddenLabel,
          name: "B_y",
          label: {
            visible: stateValCheck([1, 2, 3], "reactive", "on"),
            offset: [8, 10],
            strokeColor: "red"
          }
        },
        point1: { ...hidden },
        strokeColor: "red",
        strokeWidth: 3,
        visible: stateValCheck([1, 2, 3], "reactive", "on")
      }
    );

    // Section partition line (1)
    bR.create(
      "line",
      [
        () => {
          return convXY(sliders.s_pos.Value(), 1, graphs.large);
        },
        () => {
          return convXY(sliders.s_pos.Value(), -1, graphs.large);
        }
      ],
      {
        straightFirst: false,
        straightLast: false,
        strokeColor: "black",
        strokeWidth: 2,
        dash: 3,
        point1: { ...hidden },
        point2: { ...hidden },
        visible: stateCheck([2, 3])
      }
    );

    // Section partition line (2)
    bR.create(
      "line",
      [
        () => {
          return convXY(sliders.s_pos.Value(), comp.RECT2MID + 1, graphs.large);
        },
        () => {
          return convXY(sliders.s_pos.Value(), comp.RECT2MID - 1, graphs.large);
        }
      ],
      {
        straightFirst: false,
        straightLast: false,
        strokeColor: "black",
        strokeWidth: 2,
        dash: 3,
        point1: { ...hidden },
        point2: { ...hidden },
        visible: stateValCheck([2, 3], "i_force", "on")
      }
    );

    // V_C lines
    // Top line
    bR.create(
      "line",
      [
        () => {
          return convXY(sliders.s_pos.Value() + 0.5, 0.25 * Math.abs(comp.vc(sliders.s_pos.Value())) + 0.5, graphs.large);
        },
        () => {
          return convXY(sliders.s_pos.Value() + 0.5, -(0.25 * Math.abs(comp.vc(sliders.s_pos.Value())) + 0.5), graphs.large);
        }
      ],
      {
        straightFirst: false,
        straightLast: false,
        lastArrow: true,
        visible: stateValCheck([2, 3], "i_force", "on"),
        strokeColor: "purple",
        strokeWidth: 2,
        point1: { ...hidden },
        point2: { ...hiddenLabel, name: "V_C", label: { strokeColor: "purple", offset: [-10, 5], visible: stateValCheck([2, 3], "i_force", "on") } }
      }
    );
    // Bottom line
    bR.create(
      "line",
      [
        () => {
          return convXY(sliders.s_pos.Value() - 0.5, 0.25 * Math.abs(comp.vc(sliders.s_pos.Value())) + 0.5 + comp.RECT2MID, graphs.large);
        },
        () => {
          return convXY(sliders.s_pos.Value() - 0.5, -(0.25 * Math.abs(comp.vc(sliders.s_pos.Value())) + 0.5) + comp.RECT2MID, graphs.large);
        }
      ],
      {
        straightFirst: false,
        straightLast: false,
        firstArrow: true,
        visible: stateValCheck([2, 3], "i_force", "on"),
        strokeColor: "purple",
        strokeWidth: 2,
        point2: { ...hidden },
        point1: { ...hiddenLabel, name: "V_C", label: { strokeColor: "purple", offset: [5, 0], visible: stateValCheck([2, 3], "i_force", "on") } }
      }
    );

    const MOMENT_RADIUS = 1; //1.07 / 0.9;

    // Top right reaction moment
    bR.create(
      "arc",
      [
        //Center point
        bR.create(
          "point",
          [
            () => {
              return convX(sliders.s_pos.Value(), graphs.large);
            },
            convY(0, graphs.large)
          ],
          { ...hidden }
        ),
        // CW point
        bR.create(
          "point",
          [
            () => {
              return convX(MOMENT_RADIUS * Math.cos(1.75 * Math.PI) + sliders.s_pos.Value(), graphs.large);
            },
            convY(MOMENT_RADIUS * Math.sin(1.75 * Math.PI) + 0, graphs.large)
          ],
          {
            ...hidden
          }
        ),
        // CCW point
        bR.create(
          "point",
          [
            () => {
              return convX(MOMENT_RADIUS * Math.cos(0.25 * Math.PI) + sliders.s_pos.Value(), graphs.large);
            },
            convY(MOMENT_RADIUS * Math.sin(0.25 * Math.PI) + 0, graphs.large)
          ],
          {
            ...hiddenLabel,
            name: "M_C",
            strokeColor: "purple",
            label: { visible: stateValCheck([2, 3], "i_force", "on"), offset: [10, 15], strokeColor: "purple" }
          }
        )
      ],
      {
        strokeWidth: () => {
          return Math.sqrt(comp.mc(sliders.s_pos.Value()));
        },
        strokeColor: "purple",
        firstArrow: false,
        lastArrow: true,
        fixed: true,
        visible: stateValCheck([2, 3], "i_force", "on")
      }
    );

    // Bottom left reaction moment
    bR.create(
      "arc",
      [
        //Center point
        bR.create(
          "point",
          [
            () => {
              return convX(sliders.s_pos.Value(), graphs.large);
            },
            convY(comp.RECT2MID, graphs.large)
          ],
          { ...hidden }
        ),
        // CW point
        bR.create(
          "point",
          [
            () => {
              return convX(MOMENT_RADIUS * Math.cos(0.75 * Math.PI) + sliders.s_pos.Value(), graphs.large);
            },
            convY(MOMENT_RADIUS * Math.sin(0.75 * Math.PI) + comp.RECT2MID, graphs.large)
          ],
          {
            ...hiddenLabel,
            name: "M_C",
            strokeColor: "purple",
            label: { visible: stateValCheck([2, 3], "i_force", "on"), offset: [-22, 17], strokeColor: "purple" }
          }
        ),
        // CCW point
        bR.create(
          "point",
          [
            () => {
              return convX(MOMENT_RADIUS * Math.cos(1.25 * Math.PI) + sliders.s_pos.Value(), graphs.large);
            },
            convY(MOMENT_RADIUS * Math.sin(1.25 * Math.PI) + comp.RECT2MID, graphs.large)
          ],
          { ...hidden }
        )
      ],
      {
        strokeWidth: () => {
          return Math.sqrt(comp.mc(sliders.s_pos.Value()));
        },
        strokeColor: "purple",
        firstArrow: true,
        lastArrow: false,
        fixed: true,
        visible: stateValCheck([2, 3], "i_force", "on")
      }
    );

    // Coordinates
    bR.create("line", [convXY(-1.5, 0.5, graphs.large), convXY(-0.5, 0.5, graphs.large)], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      strokeColor: "black",
      strokeWidth: 2,
      visible: stateCheck([0])
    });
    bR.create("line", [convXY(-1.5, 0.5, graphs.large), convXY(-1.5, 1.5, graphs.large)], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      strokeColor: "black",
      strokeWidth: 2,
      visible: stateCheck([0])
    });

    // Connecting the two boards together
    bL.addChild(bR);
    bR.addChild(bL);
    this.bL = bL;
    this.bR = bR;
    this.changeState(0);
  },
  methods: {
    changeState(newState) {
      // Handle state specific changes
      if (newState > this.state) {
        if (newState >= 2) this.values.reactive = "on";
        if (newState >= 3) this.values.i_force = "on";
      } else if (newState <= 1) {
        this.values.i_force = "off";
        if (newState === 0) this.values.reactive = "off";
      }

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
