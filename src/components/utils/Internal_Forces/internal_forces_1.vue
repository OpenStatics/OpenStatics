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
    <!-- <div id="jxgbox2" class="jxgbox" style="width:500px; height:500px; margin:auto;"></div> -->
  </div>
</template>

<script>
export default {
  components: {},
  data: () => {
    return {
      state: 1,
      values: {
        beam_type: "C",
        m_dir: "CW",
        reactive: "off",
        i_force: "off",
        diagram_n: "on",
        diagram_s: "on",
        diagram_b: "on"
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
      ["beam_type", "Types of Beam", INTERVAL * 0, false, ["Cantilever", "C", "Simply-Supported", "S"], [1, 2, 3]],
      ["f_pos", "Position of force (m)", INTERVAL * 0.5, true, [0, 0.4, 1], [1, 2, 3], "blue"],
      ["f_mag", "Magnitude of force (kN)", INTERVAL * 1.5, true, [0, 0.25, 0.5], [1, 2, 3], "blue"],
      ["f_dir", "Direction of force (\u00B0)", INTERVAL * 2.5, true, [0, 120, 360], [1, 2, 3], "blue"],
      ["m_pos", "Position of moment (m)", INTERVAL * 3.5, true, [0, 0.6, 1], [1, 2, 3], "green"],
      ["m_mag", "Magnitude of moment (kN)", INTERVAL * 4.5, true, [0, 0.25, 0.5], [1, 2, 3], "green"],
      ["m_dir", "Direction of moment", INTERVAL * 5.5, false, ["CCW (+)", "CCW", "CW (-)", "CW"], [1, 2, 3]],
      ["reactive", "Reactive Forces & Moment", INTERVAL * 6.5, false, ["On", "on", "Off", "off"], [1]],
      ["s_pos", "Position of section (m)", INTERVAL * 8, true, [0, 0.25, 1], [2, 3], "black"],
      ["i_force", "Internal Forces", INTERVAL * 9, false, ["On", "on", "Off", "off"], [2]],
      ["diagram_n", "Normal Force Diagram", INTERVAL * 10.5, false, ["On", "on", "Off", "off"], [3]],
      ["diagram_s", "Shear Force Diagram", INTERVAL * 11, false, ["On", "on", "Off", "off"], [3]],
      ["diagram_b", "Bending Moment Diagram", INTERVAL * 11.5, false, ["On", "on", "Off", "off"], [3]]
    ]) {
      // console.log(() => {
      //   return this.state >= data[5];
      // });
      //console.log(data[5]);

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
            visible: stateCheck(data[5])
          },
          snapWidth: 0.01,
          visible: stateCheck(data[5])
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
            data[4][0] + "",
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
            fixed: true
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

    // Formulas for computed values
    let comp = {};
    // Convert degrees value to radians
    comp.radians = degrees => {
      return (Math.PI * degrees) / 180;
    };
    // Convert radians value to degrees
    comp.degrees = radians => {
      return (180 * radians) / Math.PI;
    };
    // Returns 1 if x >=0, 0 otherwise
    comp.UNIT = x => {
      return x >= 0 ? 1 : 0;
    };
    // Force direction converted to radians
    comp.alfa = () => {
      return comp.radians(sliders.f_dir.Value());
    };
    // Signed version of momement magnitude
    comp.cMm = () => {
      if (valCheck("m_dir", "CCW")()) return sliders.m_mag.Value();
      else return -sliders.m_mag.Value();
    };
    // Force directional component magnitudes
    comp.fx = () => {
      return -sliders.f_mag.Value() * Math.cos(comp.alfa());
    };
    comp.fy = () => {
      return -sliders.f_mag.Value() * Math.sin(comp.alfa());
    };
    // Intermediary values for Cantilever
    comp.cAx = () => {
      return -comp.fx();
    };
    comp.cAy = () => {
      return -comp.fy();
    };
    comp.cMA = () => {
      return sliders.f_pos.Value() * comp.fy() + comp.cMm();
    };
    comp.cMAn = () => {
      return -comp.cMA();
    };
    // Intermediary values for Simply Supported
    comp.sAx = comp.cAx;
    comp.sBy = () => {
      return -comp.cMm() - comp.fy() * sliders.f_pos.Value();
    };
    comp.sAy = () => {
      return -comp.sBy() - comp.fy();
    };
    // Final values for Cantilever (in terms of section position)
    comp.c_MA = ps => {
      return (
        comp.cMA() -
        comp.cMm() * comp.UNIT(ps - sliders.m_pos.Value()) +
        comp.cAy() * ps +
        comp.fy() * (ps - sliders.f_pos.Value()) * comp.UNIT(ps - sliders.f_pos.Value())
      );
    };
    comp.c_NA = ps => {
      return -comp.cAx() - comp.fx() * comp.UNIT(ps - sliders.f_pos.Value());
    };
    comp.c_VA = ps => {
      return comp.cAy() + comp.fy() * comp.UNIT(ps - sliders.f_pos.Value());
    };
    // Final values for Simply Supported (in terms of section position)
    comp.s_MA = ps => {
      return (
        -comp.cMm() * comp.UNIT(ps - sliders.m_pos.Value()) +
        comp.sAy() * ps +
        comp.fy() * (ps - sliders.f_pos.Value()) * comp.UNIT(ps - sliders.f_pos.Value())
      );
    };
    comp.s_NA = ps => {
      return -comp.sAx() - comp.fx() * comp.UNIT(ps - sliders.f_pos.Value());
    };
    comp.s_VA = ps => {
      return comp.sAy() + comp.fy() * comp.UNIT(ps - sliders.f_pos.Value());
    };

    for (let data of [
      [0, INTERVAL * 7, ["M_A", comp.cMAn, "kN*m", false], ["A_x", comp.sAx, "kN", false], [1, 2, 3], "reactive", "on", "red"],
      [10, INTERVAL * 7, ["A_x", comp.cAx, "kN", false], ["A_y", comp.sAy, "kN", false], [1, 2, 3], "reactive", "on", "red"],
      [20, INTERVAL * 7, ["A_y", comp.cAy, "kN", false], ["B_y", comp.sBy, "kN", false], [1, 2, 3], "reactive", "on", "red"],
      [0, INTERVAL * 9.5, ["M_a", comp.c_MA, "kN*m", true], ["M_a", comp.s_MA, "kN*m", true], [1, 2, 3], "i_force", "on", "purple"],
      [10, INTERVAL * 9.5, ["N_a", comp.c_NA, "kN", true], ["N_a", comp.s_NA, "kN", true], [2, 3], "i_force", "on", "purple"],
      [20, INTERVAL * 9.5, ["V_a", comp.c_VA, "kN", true], ["V_a", comp.s_VA, "kN", true], [2, 3], "i_force", "on", "purple"]
    ]) {
      bL.create(
        "text",
        [
          -15 + data[0],
          TOP_Y + data[1],
          () => {
            let i = valCheck("beam_type", "C")() ? 2 : 3;
            let x = data[i][3]
              ? data[i][1](
                  (() => {
                    return sliders.s_pos.Value();
                  })()
                )
              : data[i][1]();
            return (
              "<span style='color:" +
              data[7] +
              "'><i>" +
              data[i][0] +
              "</i> = </span>" +
              Math.round(x * 1000, 3) / 1000 +
              " <span style='color:" +
              data[7] +
              "'><b>" +
              data[i][2] +
              "</b></span>"
            );
          }
        ],
        { fontSize: LABEL_SIZE, fixed: true, visible: stateValCheck(data[4], data[5], data[6]), anchorX: "left", anchorY: "top" }
      );
    }

    let graphs = {
      large: {
        corner: { x: -14, y: -11 },
        size: { x: 1.2 * 12, y: 1.2 * (17 + 1 / 3) },
        delta: { x: 0.5, y: 0.5 },
        scale: { x: 1.8, y: 2.6 },
        anchor: { x: 0.25, y: 18 / 26 },
        axis: { x: "", y: "" },
        title: "",
        visible: true,
        func: undefined,
        color: undefined,
        outlines: false
      },
      bending: {
        corner: { x: 4, y: -11 },
        size: { x: 11, y: 5 },
        delta: { x: 0.2, y: 0.2 },
        scale: { x: 1, y: 2 },
        anchor: { x: 0, y: 0.5 },
        axis: { x: "x (m)", y: "M (kN*m)" },
        title: "Bending Moment",
        visible: () => {
          return this.state === 3 && valCheck("diagram_b", "on")();
        },
        func: ps => {
          return valCheck("beam_type", "C")() ? comp.c_MA(ps) : comp.s_MA(ps);
        },
        color: "purple",
        outlines: true
      },
      shear: {
        corner: { x: 4, y: -3 },
        size: { x: 11, y: 5 },
        delta: { x: 0.2, y: 0.2 },
        scale: { x: 1, y: 2 },
        anchor: { x: 0, y: 0.5 },
        axis: { x: "x (m)", y: "V (kN)" },
        title: "Shear Force",
        visible: () => {
          return this.state === 3 && valCheck("diagram_s", "on")();
        },
        func: ps => {
          return valCheck("beam_type", "C")() ? comp.c_VA(ps) : comp.s_VA(ps);
        },
        color: "green",
        outlines: true
      },
      normal: {
        corner: { x: 4, y: 5 },
        size: { x: 11, y: 5 },
        delta: { x: 0.2, y: 0.2 },
        scale: { x: 1, y: 2 },
        anchor: { x: 0, y: 0.5 },
        axis: { x: "x (m)", y: "N (kN)" },
        title: "Normal Force",
        visible: () => {
          return this.state === 3 && valCheck("diagram_n", "on")();
        },
        func: ps => {
          return valCheck("beam_type", "C")() ? comp.c_NA(ps) : comp.s_NA(ps);
        },
        color: "red",
        outlines: true
      }
    };

    // Conversion formulas for graph coordinates
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

    //bR.create("point", convXY(1, 0.5, graphs.large));

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
        drawZero: true,
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
        drawZero: true,
        fixed: true,
        scale: g.size.y / g.scale.y,
        visible: g.visible,
        minorTicks: 3
      });

      if (g.outlines) {
        bR.create("line", [convXY(0, 0, g), convXY(1, 0, g)], {
          straightFirst: false,
          straightLast: false,
          strokeWidth: 1,
          fixed: true,
          strokeColor: "black",
          visible: g.visible
        });

        bR.create(
          "line",
          [
            () => {
              return convXY(sliders.s_pos.Value(), g.scale.y / 2, g);
            },
            () => {
              return convXY(sliders.s_pos.Value(), -g.scale.y / 2, g);
            }
          ],
          {
            straightFirst: false,
            straightLast: false,
            strokeWidth: 2,
            fixed: true,
            strokeColor: "black",
            dash: 2,
            visible: g.visible
          }
        );
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
            1
          ],
          { strokeColor: g.color, visible: g.visible, strokeWidth: 2, doAdvancedPlot: true, recursionDepthHigh: 13 }
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

    // All points and lines are stored like the sliders
    let points = {};
    // let lines = {};
    const BOX_HEIGHT = 0.05;

    let hidden = { fixed: true, visible: false };

    let i_force_drop = slider => {
      return slider.Value() >= sliders.s_pos.Value() && valCheck("i_force", "on")() && this.state >= 2 ? -1 : 0;
    };

    this.textToUpdate.loadFBD = {
      object: bR.create("text", [convX(0.5, graphs.large), convY(0.6, graphs.large), ""], {
        fontSize: 18,
        anchorX: "middle",
        anchorY: "middle",
        fixed: true
      }),
      formula: () => {
        if (this.state >= 1) {
          if (valCheck("reactive", "on")()) return "<b>Free Body Diagram</b>";
          else return "<b>Load Diagram</b>";
        } else return "";
      }
    };
    this.textToUpdate.warning = {
      object: bR.create("text", [convX(0.5, graphs.large), convY(0.55, graphs.large), ""], {
        fontSize: 14,
        anchorX: "middle",
        anchorY: "top",
        fixed: true,
        strokeColor: "red"
      }),
      formula: () => {
        if (valCheck("beam_type", "S")() && comp.sBy() < 0 && this.state >= 1) {
          return "Warning: negative B_y value indicates liftoff, system is";
        } else return "";
      }
    };
    this.textToUpdate.warning2 = {
      object: bR.create("text", [convX(0.5, graphs.large), convY(0.45, graphs.large), ""], {
        fontSize: 14,
        anchorX: "middle",
        anchorY: "top",
        fixed: true,
        strokeColor: "red"
      }),
      formula: () => {
        if (valCheck("beam_type", "S")() && comp.sBy() < 0 && this.state >= 1) {
          return "not in equilibrium, change force & momentum input values";
        } else return "";
      }
    };

    points.force = bR.create(
      "point",
      [
        () => {
          return convX(sliders.f_pos.Value(), graphs.large);
        },
        () => {
          return convY(i_force_drop(sliders.f_pos), graphs.large);
        }
      ],
      { name: "", size: 2, fillColor: "blue", fixed: true, strokeWidth: 0, visible: stateValCheck([1], "reactive", "off") }
    );

    points.moment = bR.create(
      "point",
      [
        () => {
          return convX(sliders.m_pos.Value(), graphs.large);
        },
        () => {
          return convY(i_force_drop(sliders.m_pos), graphs.large);
        }
      ],
      { name: "", size: 2, fixed: true, fillColor: "green", strokeWidth: 0, visible: stateCheck([1, 2, 3]) }
    );

    // Coordinates
    bR.create("line", [convXY(-0.3, 0.55, graphs.large), convXY(-0.3, 0.75, graphs.large)], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      fixed: true,
      strokeColor: "black"
    });
    bR.create("line", [convXY(-0.3, 0.55, graphs.large), convXY(-0.1, 0.55, graphs.large)], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      fixed: true,
      strokeColor: "black"
    });

    // Force line
    bR.create(
      "line",
      [
        points.force,
        bR.create(
          "point",
          [
            () => {
              return convX(sliders.f_pos.Value() + sliders.f_mag.Value() * Math.cos(comp.alfa()), graphs.large);
            },
            () => {
              return convY(i_force_drop(sliders.f_pos) + sliders.f_mag.Value() * Math.sin(comp.alfa()), graphs.large);
            }
          ],
          { ...hidden, name: "F", label: { visible: stateValCheck([1], "reactive", "off"), strokeColor: "blue" } }
        )
      ],
      {
        straightFirst: false,
        straightLast: false,
        fixed: true,
        firstArrow: true,
        strokeColor: "blue",
        visible: stateValCheck([1], "reactive", "off")
      }
    );

    // ForceX Line
    bR.create(
      "line",
      [
        points.force,
        bR.create(
          "point",
          [
            () => {
              return convX(sliders.f_pos.Value() + sliders.f_mag.Value() * Math.cos(comp.alfa()), graphs.large);
            },
            () => {
              return convY(i_force_drop(sliders.f_pos), graphs.large);
            }
          ],
          { ...hidden, name: "F_x", label: { visible: stateValCheck([1, 2, 3], "reactive", "on"), offset: [-10, 20], strokeColor: "blue" } }
        )
      ],
      {
        straightFirst: false,
        straightLast: false,
        fixed: true,
        firstArrow: true,
        strokeColor: "blue",
        visible: stateValCheck([1, 2, 3], "reactive", "on")
      }
    );

    // ForceY line
    bR.create(
      "line",
      [
        points.force,
        bR.create(
          "point",
          [
            () => {
              return convX(sliders.f_pos.Value(), graphs.large);
            },
            () => {
              return convY(i_force_drop(sliders.f_pos) - comp.fy(), graphs.large);
            }
          ],
          { ...hidden, name: "F_y", label: { visible: stateValCheck([1, 2, 3], "reactive", "on"), offset: [5, 5], strokeColor: "blue" } }
        )
      ],
      {
        straightFirst: false,
        straightLast: false,
        fixed: true,
        firstArrow: true,
        strokeColor: "blue",
        visible: stateValCheck([1, 2, 3], "reactive", "on")
      }
    );

    // valCheck("beam_type", "C")() ? 0 : -0.1
    points.reaction = bR.create(
      "point",
      [
        convX(0, graphs.large),
        () => {
          return convY(valCheck("beam_type", "C")() ? 0 : -BOX_HEIGHT, graphs.large);
        }
      ],
      { ...hidden }
    );

    points.Ax = bR.create(
      "point",
      [
        () => {
          return convX(-1 * Math.abs(comp.cAx()), graphs.large);
        },
        () => {
          return convY(valCheck("beam_type", "C")() ? 0 : -BOX_HEIGHT, graphs.large);
        }
      ],
      { ...hidden, name: "A_x", label: { visible: stateValCheck([1, 2, 3], "reactive", "on"), offset: [-10, 20], strokeColor: "red" } }
    );

    points.Ay = bR.create(
      "point",
      [
        () => {
          return convX(0, graphs.large);
        },
        () => {
          return valCheck("beam_type", "C")() ? -1 * Math.abs(comp.cAy()) : -1 * Math.abs(comp.sAy()) - BOX_HEIGHT;
          //return convY(-1 * Math.abs(comp.cAy()) + (valCheck("beam_type", "C")() ? 0 : -BOX_HEIGHT), graphs.large);
        }
      ],
      { ...hidden, name: "A_y", label: { visible: stateValCheck([1, 2, 3], "reactive", "on"), offset: [5, 5], strokeColor: "red" } }
    );

    points.By = bR.create(
      "point",
      [
        convX(1, graphs.large),
        () => {
          return convY(-1 * Math.abs(comp.sBy()) - BOX_HEIGHT + i_force_drop(sliders.s_pos), graphs.large);
        }
      ],
      {
        ...hidden,
        name: "B_y",
        label: {
          visible: () => {
            return stateValCheck([1, 2, 3], "reactive", "on")() && valCheck("beam_type", "S")();
          },
          offset: [5, 5],
          strokeColor: "red"
        }
      }
    );

    // Ax line
    bR.create("line", [points.reaction, points.Ax], {
      straightFirst: false,
      straightLast: false,
      fixed: true,
      // firstArrow: () => {
      //   return comp.cAx() >= 0;
      // },
      // lastArrow: () => {
      //   return comp.cAx() < 0;
      // },
      firstArrow: true,
      lastArrow: false,
      strokeColor: "red",
      visible: stateValCheck([1, 2, 3], "reactive", "on")
    });

    // Ay line
    bR.create("line", [points.reaction, points.Ay], {
      straightFirst: false,
      straightLast: false,
      fixed: true,
      // firstArrow: () => {
      //   return (valCheck("beam_type", "C")() ? comp.cAy() : comp.sAy()) >= 0;
      // },
      // lastArrow: () => {
      //   return (valCheck("beam_type", "C")() ? comp.cAy() : comp.sAy()) < 0;
      // },
      firstArrow: true,
      lastArrow: false,
      strokeColor: "red",
      visible: stateValCheck([1, 2, 3], "reactive", "on")
    });

    // By line
    bR.create(
      "line",
      [
        bR.create(
          "point",
          [
            convX(1, graphs.large),
            () => {
              return convY(-BOX_HEIGHT + i_force_drop(sliders.s_pos), graphs.large);
            }
          ],
          { ...hidden }
        ),
        points.By
      ],
      {
        straightFirst: false,
        straightLast: false,
        fixed: true,
        // firstArrow: () => {
        //   return comp.sBy() >= 0;
        // },
        // lastArrow: () => {
        //   return comp.sBy() < 0;
        // },
        firstArrow: true,
        lastArrow: false,
        strokeColor: "red",
        visible: () => {
          return stateValCheck([1, 2, 3], "reactive", "on")() && valCheck("beam_type", "S")();
        }
      }
    );

    // moment curve
    // 0.5 magnitude = from -pi/2 to pi/2
    const MOMENT_RADIUS = 0.125;
    bR.create(
      "arc",
      [
        //Center point
        points.moment,
        // CW point
        bR.create(
          "point",
          [
            () => {
              return convX(MOMENT_RADIUS * Math.cos(-1 * sliders.m_mag.Value() * Math.PI) + sliders.m_pos.Value(), graphs.large);
            },
            () => {
              return convY(MOMENT_RADIUS * Math.sin(-1 * sliders.m_mag.Value() * Math.PI) + i_force_drop(sliders.m_pos), graphs.large);
            }
          ],
          { name: "M", fixed: true, visible: stateValCheck([1, 2, 3], "m_dir", "CW"), size: 0, label: { offset: [10, 0], strokeColor: "green" } }
        ),
        // CCW point
        bR.create(
          "point",
          [
            () => {
              return convX(MOMENT_RADIUS * Math.cos(1 * sliders.m_mag.Value() * Math.PI) + sliders.m_pos.Value(), graphs.large);
            },
            () => {
              return convY(MOMENT_RADIUS * Math.sin(1 * sliders.m_mag.Value() * Math.PI) + i_force_drop(sliders.m_pos), graphs.large);
            }
          ],
          { name: "M", fixed: true, visible: stateValCheck([1, 2, 3], "m_dir", "CCW"), size: 0, label: { offset: [10, 10], strokeColor: "green" } }
        )
      ],
      {
        strokeWidth: 2,
        strokeColor: "green",
        firstArrow: valCheck("m_dir", "CW"),
        lastArrow: valCheck("m_dir", "CCW"),
        fixed: true,
        visible: stateCheck([1, 2, 3])
      }
    );

    // Reaction moment
    bR.create(
      "arc",
      [
        //Center point
        points.Ax,
        // CW point
        bR.create(
          "point",
          [
            () => {
              let t = (1 + -1 * Math.abs(comp.cMA())) * Math.PI;
              return convX(MOMENT_RADIUS * Math.cos(t) - Math.abs(comp.cAx()), graphs.large);
            },
            () => {
              let t = (1 + -1 * Math.abs(comp.cMA())) * Math.PI;
              return convY(MOMENT_RADIUS * Math.sin(t), graphs.large);
            }
          ],
          {
            name: "M_A",
            fixed: true,
            // visible: () => {
            //   return stateValCheck([1, 2, 3], "reactive", "on")() && valCheck("beam_type", "C")() && comp.cMAn() >= 0 === false;
            // },
            visible: false,
            strokeColor: "red",
            size: 0,
            label: { offset: [-15, 20], strokeColor: "red" }
          }
        ),
        // CWW point
        bR.create(
          "point",
          [
            () => {
              let t = (1 + 1 * Math.abs(comp.cMA())) * Math.PI;
              return convX(MOMENT_RADIUS * Math.cos(t) - Math.abs(comp.cAx()), graphs.large);
            },
            () => {
              let t = (1 + 1 * Math.abs(comp.cMA())) * Math.PI;
              return convY(MOMENT_RADIUS * Math.sin(t), graphs.large);
            }
          ],
          {
            name: "M_A",
            fixed: true,
            visible: () => {
              return stateValCheck([1, 2, 3], "reactive", "on")() && valCheck("beam_type", "C")();
            },
            //visible: true,
            strokeColor: "red",
            size: 0,
            label: { offset: [12, 12], strokeColor: "red" }
          }
        )
      ],
      {
        strokeWidth: 2,
        strokeColor: "red",
        // firstArrow: () => {
        //   return comp.cMAn() < 0;
        // },
        // lastArrow: () => {
        //   return comp.cMAn() >= 0;
        // },
        firstArrow: false,
        lastArrow: true,
        fixed: true,
        visible: () => {
          return stateValCheck([1, 2, 3], "reactive", "on")() && valCheck("beam_type", "C")();
        }
      }
    );

    // Blue box part 1

    bR.create(
      "polygon",
      [
        convXY(0, -BOX_HEIGHT, graphs.large),
        //[convX(0, graphs.large), convY(-BOX_HEIGHT, graphs.large)],
        convXY(0, BOX_HEIGHT, graphs.large),
        () => {
          return convXY(sliders.s_pos.Value(), BOX_HEIGHT, graphs.large);
        },
        () => {
          return convXY(sliders.s_pos.Value(), -BOX_HEIGHT, graphs.large);
        }
      ],
      { vertices: { visible: false }, fixed: true, withLines: false, fillColor: "blue" }
    );

    bR.create(
      "polygon",
      [
        () => {
          const offset = valCheck("i_force", "on")() ? -1 : 0;
          return convXY(sliders.s_pos.Value(), -BOX_HEIGHT + offset, graphs.large);
        },
        () => {
          const offset = valCheck("i_force", "on")() ? -1 : 0;
          return convXY(sliders.s_pos.Value(), BOX_HEIGHT + offset, graphs.large);
        },
        () => {
          const offset = valCheck("i_force", "on")() ? -1 : 0;
          return convXY(1, BOX_HEIGHT + offset, graphs.large);
        },
        () => {
          const offset = valCheck("i_force", "on")() ? -1 : 0;
          return convXY(1, -BOX_HEIGHT + offset, graphs.large);
        }
      ],
      { vertices: { visible: false }, fixed: true, withLines: false, fillColor: "blue" }
    );

    // Dotted line
    bR.create("line", [convXY(0, 0, graphs.large), convXY(1, 0, graphs.large)], {
      straightFirst: false,
      straightLast: false,
      fixed: true,
      strokeWidth: 2,
      strokeColor: "black",
      dash: 3,
      visible: stateValCheck([1], "reactive", "off")
    });

    // Cantilever
    bR.create("line", [convXY(0, -0.1, graphs.large), convXY(0, 0.1, graphs.large)], {
      straightFirst: false,
      straightLast: false,
      fixed: true,
      strokeWidth: 2,
      strokeColor: "black",
      visible: () => {
        return valCheck("beam_type", "C")() && stateValCheck([1], "reactive", "off")();
      }
    });
    bR.create("comb", [convXY(0, -0.1, graphs.large), convXY(0, 0.1, graphs.large)], {
      reverse: true,
      curve: {
        fixed: true,
        visible: () => {
          return valCheck("beam_type", "C")() && stateValCheck([1], "reactive", "off")();
        }
      }
    });

    // Simple Support
    const TRIANGLE_LENGTH = 0.1;
    const TRIANGLE_HEIGHT = 0.5 * TRIANGLE_LENGTH * Math.sqrt(3);
    const CIRCLE_RADIUS = Math.abs(TRIANGLE_HEIGHT - BOX_HEIGHT) / 2;
    const CIRCLE_RADIUS_ADJUSTED = (CIRCLE_RADIUS / graphs.large.scale.x) * graphs.large.size.x;

    // console.log(TRIANGLE_HEIGHT);
    bR.create(
      "polygon",
      [
        convXY(0, 0, graphs.large),
        convXY(-TRIANGLE_LENGTH * 0.5, -TRIANGLE_HEIGHT, graphs.large),
        convXY(TRIANGLE_LENGTH * 0.5, -TRIANGLE_HEIGHT, graphs.large)
      ],
      {
        vertices: { visible: false },
        withLines: false,
        fillColor: "green",
        fixed: true,
        fillOpacity: 1,
        visible: () => {
          return valCheck("beam_type", "S")() && stateValCheck([1], "reactive", "off")();
        }
      }
    );
    bR.create("line", [convXY(-0.1, -TRIANGLE_HEIGHT, graphs.large), convXY(0.1, -TRIANGLE_HEIGHT, graphs.large)], {
      straightFirst: false,
      straightLast: false,
      strokeWidth: 2,
      strokeColor: "green",
      fixed: true,
      visible: () => {
        return valCheck("beam_type", "S")() && stateValCheck([1], "reactive", "off")();
      }
    });
    bR.create("comb", [convXY(0.1, -TRIANGLE_HEIGHT, graphs.large), convXY(-0.1, -TRIANGLE_HEIGHT, graphs.large)], {
      reverse: false,
      curve: {
        strokeColor: "green",
        fixed: true,
        visible: () => {
          return valCheck("beam_type", "S")() && stateValCheck([1], "reactive", "off")();
        }
      }
    });
    bR.create("line", [convXY(1.1, -TRIANGLE_HEIGHT, graphs.large), convXY(0.9, -TRIANGLE_HEIGHT, graphs.large)], {
      straightFirst: false,
      straightLast: false,
      strokeWidth: 2,
      strokeColor: "green",
      fixed: true,
      visible: () => {
        return valCheck("beam_type", "S")() && stateValCheck([1], "reactive", "off")();
      }
    });
    bR.create("comb", [convXY(1.1, -TRIANGLE_HEIGHT, graphs.large), convXY(0.9, -TRIANGLE_HEIGHT, graphs.large)], {
      reverse: false,
      curve: {
        strokeColor: "green",
        fixed: true,
        visible: () => {
          return valCheck("beam_type", "S")() && stateValCheck([1], "reactive", "off")();
        }
      }
    });
    bR.create("circle", [bR.create("point", convXY(0, 0, graphs.large), { fixed: true, visible: false }), CIRCLE_RADIUS_ADJUSTED], {
      strokeColor: "green",
      fixed: true,
      visible: () => {
        return valCheck("beam_type", "S")() && stateValCheck([1], "reactive", "off")();
      },
      fillColor: "green"
    });
    bR.create(
      "circle",
      [bR.create("point", convXY(1, -BOX_HEIGHT - CIRCLE_RADIUS, graphs.large), { fixed: true, visible: false }), CIRCLE_RADIUS_ADJUSTED],
      {
        strokeColor: "green",
        fixed: true,
        strokeWidth: 1,
        visible: () => {
          return valCheck("beam_type", "S")() && stateValCheck([1], "reactive", "off")();
        }
      }
    );

    // State 2 Pieces
    // Section divider
    bR.create(
      "line",
      [
        bR.create(
          "point",
          [
            () => {
              return convX(sliders.s_pos.Value(), graphs.large);
            },
            convY(0.2, graphs.large)
          ],
          {
            size: 0,
            name: "a",
            fixed: true,
            label: {
              offset: [-5, 15],
              visible: () => {
                return this.state >= 2;
              }
            }
          }
        ),
        bR.create(
          "point",
          [
            () => {
              return convX(sliders.s_pos.Value(), graphs.large);
            },
            convY(-0.2, graphs.large)
          ],
          {
            size: 0,
            name: "a",
            fixed: true,
            label: {
              offset: [-5, 0],
              visible: () => {
                return this.state >= 2;
              }
            }
          }
        )
      ],
      {
        straightFirst: false,
        straightLast: false,
        strokeWidth: 2,
        strokeColor: "black",
        dash: 2,
        visible: stateCheck([2, 3])
      }
    );

    bR.create(
      "line",
      [
        bR.create(
          "point",
          [
            () => {
              return convX(sliders.s_pos.Value(), graphs.large);
            },
            convY(0.2 - 1, graphs.large)
          ],
          {
            name: "a",
            ...hidden,
            label: {
              offset: [-5, 15],
              visible: stateValCheck([2, 3], "i_force", "on")
            }
          }
        ),
        bR.create(
          "point",
          [
            () => {
              return convX(sliders.s_pos.Value(), graphs.large);
            },
            convY(-0.2 - 1, graphs.large)
          ],
          {
            name: "a",
            ...hidden,
            label: {
              offset: [-5, 0],
              visible: stateValCheck([2, 3], "i_force", "on")
            }
          }
        )
      ],
      {
        straightFirst: false,
        straightLast: false,
        strokeWidth: 2,
        strokeColor: "black",
        dash: 2,
        visible: stateValCheck([2, 3], "i_force", "on")
      }
    );

    points.NA1 = bR.create(
      "point",
      [
        () => {
          return convX(sliders.s_pos.Value(), graphs.large);
        },
        convY(0, graphs.large)
      ],
      {
        ...hidden
      }
    );

    points.MA1 = bR.create(
      "point",
      [
        () => {
          const x = valCheck("beam_type", "C")() ? comp.c_NA() : comp.s_NA();
          const y = sliders.f_pos.Value() > sliders.s_pos.Value() ? Math.abs(x) : 0.05;
          return convX(sliders.s_pos.Value() + y, graphs.large);
        },
        convY(0, graphs.large)
      ],
      {
        size: 1,
        fixed: true,
        name: "N_a",
        visible: () => {
          return stateValCheck([2, 3], "i_force", "on")() && sliders.f_pos.Value() <= sliders.s_pos.Value();
        },
        label: {
          visible: () => {
            return stateValCheck([2, 3], "i_force", "on")() && sliders.f_pos.Value() > sliders.s_pos.Value();
          },
          offset: [2, 5],
          strokeColor: "purple"
        },
        strokeColor: "black",
        fillColor: "black"
      }
    );

    points.NA2 = bR.create(
      "point",
      [
        () => {
          return convX(sliders.s_pos.Value(), graphs.large);
        },
        convY(-1, graphs.large)
      ],
      {
        ...hidden
      }
    );

    points.MA2 = bR.create(
      "point",
      [
        () => {
          const x = valCheck("beam_type", "C")() ? comp.c_NA() : comp.s_NA();
          const y = sliders.f_pos.Value() > sliders.s_pos.Value() ? Math.abs(x) : 0.05;
          return convX(sliders.s_pos.Value() - y, graphs.large);
        },
        convY(-1, graphs.large)
      ],
      {
        size: 1,
        fixed: true,
        name: "N_a",
        visible: () => {
          return stateValCheck([2, 3], "i_force", "on")() && sliders.f_pos.Value() <= sliders.s_pos.Value();
        },
        label: {
          visible: () => {
            return stateValCheck([2, 3], "i_force", "on")() && sliders.f_pos.Value() > sliders.s_pos.Value();
          },
          offset: [-15, 5],
          strokeColor: "purple"
        },
        strokeColor: "black",
        fillColor: "black"
      }
    );

    // Upper NA line
    bR.create("line", [points.NA1, points.MA1], {
      straightFirst: false,
      straightLast: false,
      firstArrow: false,
      lastArrow: true,
      visible: () => {
        return stateValCheck([2, 3], "i_force", "on")() && sliders.f_pos.Value() > sliders.s_pos.Value();
      },
      strokeColor: "purple"
    });

    // Lower NA line
    bR.create("line", [points.NA2, points.MA2], {
      straightFirst: false,
      straightLast: false,
      firstArrow: false,
      lastArrow: true,
      visible: () => {
        return stateValCheck([2, 3], "i_force", "on")() && sliders.f_pos.Value() > sliders.s_pos.Value();
      },
      strokeColor: "purple"
    });

    points.VA1u = bR.create(
      "point",
      [
        () => {
          return convX(sliders.s_pos.Value() + 0.05, graphs.large);
        },
        () => {
          const x = valCheck("beam_type", "C")() ? comp.c_VA() : comp.s_VA();
          return convY(0.5 * Math.abs(x), graphs.large);
        }
      ],
      { ...hidden }
    );

    points.VA1l = bR.create(
      "point",
      [
        () => {
          return convX(sliders.s_pos.Value() + 0.05, graphs.large);
        },
        () => {
          const x = valCheck("beam_type", "C")() ? comp.c_VA() : comp.s_VA();
          return convY(-0.5 * Math.abs(x), graphs.large);
        }
      ],
      {
        ...hidden,
        name: "V_a",
        label: {
          visible: () => {
            return stateValCheck([2, 3], "i_force", "on")() && sliders.f_pos.Value() > sliders.s_pos.Value();
          },
          offset: [-5, -5],
          strokeColor: "purple"
        }
      }
    );

    // Upper VA1 line
    bR.create("line", [points.VA1u, points.VA1l], {
      straightFirst: false,
      straightLast: false,
      firstArrow: false,
      lastArrow: true,
      visible: () => {
        return stateValCheck([2, 3], "i_force", "on")() && sliders.f_pos.Value() > sliders.s_pos.Value();
      },
      strokeColor: "purple"
    });

    points.VA2l = bR.create(
      "point",
      [
        () => {
          return convX(sliders.s_pos.Value() - 0.05, graphs.large);
        },
        () => {
          const x = valCheck("beam_type", "C")() ? comp.c_VA() : comp.s_VA();
          return convY(-1 - 0.5 * Math.abs(x), graphs.large);
        }
      ],
      { ...hidden }
    );

    points.VA2u = bR.create(
      "point",
      [
        () => {
          return convX(sliders.s_pos.Value() - 0.05, graphs.large);
        },
        () => {
          const x = valCheck("beam_type", "C")() ? comp.c_VA() : comp.s_VA();
          return convY(-1 + 0.5 * Math.abs(x), graphs.large);
        }
      ],
      {
        ...hidden,
        name: "V_a",
        label: {
          visible: () => {
            return stateValCheck([2, 3], "i_force", "on")() && sliders.f_pos.Value() > sliders.s_pos.Value();
          },
          offset: [-3, 10],
          strokeColor: "purple"
        }
      }
    );

    // Lower VA line
    bR.create("line", [points.VA2u, points.VA2l], {
      straightFirst: false,
      straightLast: false,
      firstArrow: true,
      lastArrow: false,
      visible: () => {
        return stateValCheck([2, 3], "i_force", "on")() && sliders.f_pos.Value() > sliders.s_pos.Value();
      },
      strokeColor: "purple"
    });

    // Top right reaction moment
    bR.create(
      "arc",
      [
        //Center point
        points.MA1,
        // CW point
        bR.create(
          "point",
          [
            () => {
              const ps = sliders.s_pos.Value();
              const x = valCheck("beam_type", "C")() ? comp.c_NA(ps) : comp.s_NA(ps);
              const y = sliders.f_pos.Value() > sliders.s_pos.Value() ? Math.abs(x) : 0.05;
              const t = Math.abs(valCheck("beam_type", "C")() ? comp.c_MA(ps) : comp.s_MA(ps)) * Math.PI;
              return convX(MOMENT_RADIUS * Math.cos(-t) + sliders.s_pos.Value() + y, graphs.large);
            },
            () => {
              const ps = sliders.s_pos.Value();
              const t = Math.abs(valCheck("beam_type", "C")() ? comp.c_MA(ps) : comp.s_MA(ps)) * Math.PI;
              return convY(0 + MOMENT_RADIUS * Math.sin(-t), graphs.large);
            }
          ],
          {
            name: "M_a",
            fixed: true,
            // visible: () => {
            //   const ps = sliders.s_pos.Value();
            //   const z = valCheck("beam_type", "C")() ? comp.c_MA(ps) : comp.s_MA(ps);
            //   return stateValCheck([2, 3], "i_force", "on")() && sliders.f_pos.Value() > sliders.s_pos.Value() && z < 0;
            // },
            visible: false,
            strokeColor: "purple",
            size: 0,
            label: { offset: [8, -5], strokeColor: "purple" }
          }
        ),
        // CCW point
        bR.create(
          "point",
          [
            () => {
              const ps = sliders.s_pos.Value();
              const x = valCheck("beam_type", "C")() ? comp.c_NA(ps) : comp.s_NA(ps);
              const y = sliders.f_pos.Value() > sliders.s_pos.Value() ? Math.abs(x) : 0.05;
              const t = Math.abs(valCheck("beam_type", "C")() ? comp.c_MA(ps) : comp.s_MA(ps)) * Math.PI;
              return convX(MOMENT_RADIUS * Math.cos(t) + sliders.s_pos.Value() + y, graphs.large);
            },
            () => {
              const ps = sliders.s_pos.Value();
              const t = Math.abs(valCheck("beam_type", "C")() ? comp.c_MA(ps) : comp.s_MA(ps)) * Math.PI;
              return convY(0 + MOMENT_RADIUS * Math.sin(t), graphs.large);
            }
          ],
          {
            name: "M_a",
            fixed: true,
            visible: () => {
              // const ps = sliders.s_pos.Value();
              //const z = valCheck("beam_type", "C")() ? comp.c_MA(ps) : comp.s_MA(ps);
              return stateValCheck([2, 3], "i_force", "on")() && sliders.f_pos.Value() > sliders.s_pos.Value();
            },
            //visible: true,
            strokeColor: "purple",
            size: 0,
            label: { offset: [-20, 25], strokeColor: "purple" }
          }
        )
      ],
      {
        strokeWidth: 2,
        strokeColor: "purple",
        // firstArrow: () => {
        //   return (valCheck("beam_type", "C")() ? comp.c_MA(sliders.s_pos.Value()) : comp.s_MA(sliders.s_pos.Value())) < 0;
        // },
        // lastArrow: () => {
        //   return (valCheck("beam_type", "C")() ? comp.c_MA(sliders.s_pos.Value()) : comp.s_MA(sliders.s_pos.Value())) >= 0;
        // },
        firstArrow: false,
        lastArrow: true,
        fixed: true,
        visible: () => {
          return stateValCheck([2, 3], "i_force", "on")() && sliders.f_pos.Value() > sliders.s_pos.Value();
        }
      }
    );

    // Bottom left
    bR.create(
      "arc",
      [
        //Center point
        points.MA2,
        // CW point
        bR.create(
          "point",
          [
            () => {
              const ps = sliders.s_pos.Value();
              const x = valCheck("beam_type", "C")() ? comp.c_NA(ps) : comp.s_NA(ps);
              const y = sliders.f_pos.Value() > sliders.s_pos.Value() ? Math.abs(x) : 0.05;
              const t = (1 - Math.abs(valCheck("beam_type", "C")() ? comp.c_MA(ps) : comp.s_MA(ps))) * Math.PI;
              return convX(MOMENT_RADIUS * Math.cos(t) + sliders.s_pos.Value() - y, graphs.large);
            },
            () => {
              const ps = sliders.s_pos.Value();
              const t = (1 - Math.abs(valCheck("beam_type", "C")() ? comp.c_MA(ps) : comp.s_MA(ps))) * Math.PI;
              return convY(-1 + MOMENT_RADIUS * Math.sin(t), graphs.large);
            }
          ],
          {
            name: "M_a",
            fixed: true,
            visible: () => {
              // const ps = sliders.s_pos.Value();
              //const z = valCheck("beam_type", "C")() ? comp.c_MA(ps) : comp.s_MA(ps);
              return stateValCheck([2, 3], "i_force", "on")() && sliders.f_pos.Value() > sliders.s_pos.Value();
            },
            // visible: true,
            strokeColor: "purple",
            size: 0,
            label: { offset: [-20, 25], strokeColor: "purple" }
          }
        ),
        // CCW point
        bR.create(
          "point",
          [
            () => {
              const ps = sliders.s_pos.Value();
              const x = valCheck("beam_type", "C")() ? comp.c_NA(ps) : comp.s_NA(ps);
              const y = sliders.f_pos.Value() > sliders.s_pos.Value() ? Math.abs(x) : 0.05;
              const t = (1 + Math.abs(valCheck("beam_type", "C")() ? comp.c_MA(ps) : comp.s_MA(ps))) * Math.PI;
              return convX(MOMENT_RADIUS * Math.cos(t) + sliders.s_pos.Value() - y, graphs.large);
            },
            () => {
              const ps = sliders.s_pos.Value();
              const t = (1 + Math.abs(valCheck("beam_type", "C")() ? comp.c_MA(ps) : comp.s_MA(ps))) * Math.PI;
              return convY(-1 + MOMENT_RADIUS * Math.sin(t), graphs.large);
            }
          ],
          {
            name: "M_a",
            fixed: true,
            // visible: () => {
            //   const ps = sliders.s_pos.Value();
            //   const z = valCheck("beam_type", "C")() ? comp.c_MA(ps) : comp.s_MA(ps);
            //   return stateValCheck([2, 3], "i_force", "on")() && sliders.f_pos.Value() > sliders.s_pos.Value() && z <= 0;
            // },
            visible: false,
            strokeColor: "purple",
            size: 0,
            label: { offset: [-20, -5], strokeColor: "purple" }
          }
        )
      ],
      {
        strokeWidth: 2,
        strokeColor: "purple",
        // firstArrow: () => {
        //   return (valCheck("beam_type", "C")() ? comp.c_MA(sliders.s_pos.Value()) : comp.s_MA(sliders.s_pos.Value())) >= 0;
        // },
        // lastArrow: () => {
        //   return (valCheck("beam_type", "C")() ? comp.c_MA(sliders.s_pos.Value()) : comp.s_MA(sliders.s_pos.Value())) < 0;
        // },
        firstArrow: true,
        lastArrow: false,
        fixed: true,
        visible: () => {
          return stateValCheck([2, 3], "i_force", "on")() && sliders.f_pos.Value() > sliders.s_pos.Value();
        }
      }
    );

    // Connecting the two boards together
    bL.addChild(bR);
    bR.addChild(bL);
    this.bL = bL;
    this.bR = bR;
    //this.changeState(3);
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
      this.toggleButtons();
      this.bL.fullUpdate();
      //this.bR.fullUpdate();
    },
    fixTextAlignment() {
      for (const lbl of Object.keys(this.textToUpdate)) {
        this.textToUpdate[lbl].object.setText("");
        this.textToUpdate[lbl].object.setText(this.textToUpdate[lbl].formula);
      }
      // Also does enable/distables
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
export const meta = {
  title: "Internal Forces 1",
  description: "IF1"
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
