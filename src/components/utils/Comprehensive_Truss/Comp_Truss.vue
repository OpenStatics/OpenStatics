<template>
  <div class="container">
    <div class="row">
      <div class="col-auto">
        <div id="boxLeft" class="boxLeft my-2" style="width:400px; height:600px;"></div>
      </div>
      <div class="col-auto">
        <div id="boxRight" class="boxRight my-2" style="width:650px; height:600px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => {
    return {
      state: 0,
      textToUpdate: {},
      bL: undefined,
      bR: undefined
    };
  },
  mounted() {
    // Scale determines the size of the whole structure
    const scale = 3;
    // const bgColor = window.getComputedStyle(document.getElementById("app"), null).getPropertyValue("background-color");
    // let lodash = require("lodash");

    // Setup the board
    const bL = JXG.JSXGraph.initBoard("boxLeft", {
      boundingbox: [-15, 15, 15, -15],
      keepAspectRatio: true,
      showCopyright: false,
      pan: { enabled: false },
      zoom: { wheel: false },
      showNavigation: false,
      showZoom: false
    });
    bL.resizeContainer(400, 600);

    //bL.create("text", [-15, 0, "to be fair, you have to have a high IQ to understand rick and morty"]);

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
    bR.resizeContainer(650, 600);

    let sliders = {};
    let points = {};
    const label_size = 14;

    let buttonClick = (textbox, slider) => {
      return () => {
        if (!isNaN(textbox.Value())) {
          let val = Number(textbox.Value());
          val = Math.min(slider._smax, val);
          val = Math.max(slider._smin, val);
          val = Math.round(val * 100) / 100;
          slider.setValue(val);
          textbox.rendNodeInput.value = "";
          textbox.update();
        }
      };
    };

    for (let data of [
      ["force", "Load (N)", 0, [0, 500, 1000]],
      ["angle", "Direction (\u00B0)", -6, [19, 90, 198]],
      ["width", "Width (m)", -12, [1, 2, 3]]
    ]) {
      sliders[data[0]] = bL.create("slider", [[-14, 12 + data[2]], [-4, 12 + data[2]], data[3]], {
        name: data[1],
        withTicks: false,
        label: { fontSize: label_size }
      });
      let textbox = bL.create("input", [-4, 12 + data[2] - 2.5, "", ""], { cssStyle: "width: 58px", fixed: true });
      bL.create("button", [3, 12 + data[2] - 2.5, "Update", buttonClick(textbox, sliders[data[0]])], {});
    }

    //    bL.fullUpdate();
    const corner = { x: -14, y: 5 };
    const pointProperties = { fixed: true, fillColor: "white", strokeColor: "black", size: 4 };
    const labelProperties = { strokeColor: "black" };
    // const offsetFactor = 11;
    // const centerOffset = [-offsetFactor * 0.3, 0];
    //console.log(sliders["width"].Value());
    const dVal = { topY: -0.15, middleY: -0.25, bottomY: -0.35, leftX: 3.15, middleX: 3.25, rightX: 3.35 };
    for (let data of [
      // Normal points
      ["A", 0, 0, [0, 1]],
      ["B", 1, 0, [0, 1, 2]],
      ["C", 2, 0, [0, 1, 2, 3]],
      ["D", 3, 0, [0, 1, 2, 3]],
      ["I", 0, 1, [0, 1]],
      ["H", 1, 1, [0, 1, 2]],
      ["G", 2, 1, [0, 1, 2, 3]],
      ["E", 3, 1, [0, 1, 2, 3]],

      // Inbetween points
      ["AB", 0.5, 0, []],
      ["BC", 1.5, 0, []],
      ["CD", 2.5, 0, []],
      ["IH", 0.5, 1, []],
      ["HG", 1.5, 1, []],
      ["GE", 2.5, 1, []],
      ["AH", 0.5, 0.5, []],
      ["BG", 1.5, 0.5, []],
      ["CE", 2.5, 0.5, []],

      // Force arrow points
      ["fAB", 0.25, 0, []],
      ["fBC", 1.25, 0, []],
      ["fCD", 2.25, 0, []],
      ["fIH", 0.25, 1, []],
      ["fHG", 1.25, 1, []],
      ["fGE", 2.25, 1, []],
      ["fAH", 0.25, 0.25, []],
      ["fBG", 1.25, 0.25, []],
      ["fCE", 2.25, 0.25, []],

      // Divider points
      ["d_A_u", 0, dVal.topY, []],
      ["d_A_m", 0, dVal.middleY, []],
      ["d_A_b", 0, dVal.bottomY, []],
      ["d_B_u", 1, dVal.topY, []],
      ["d_B_m", 1, dVal.middleY, []],
      ["d_B_b", 1, dVal.bottomY, []],
      ["d_C_u", 2, dVal.topY, []],
      ["d_C_m", 2, dVal.middleY, []],
      ["d_C_b", 2, dVal.bottomY, []],
      ["d_D_u", 3, dVal.topY, []],
      ["d_D_m", 3, dVal.middleY, []],
      ["d_D_b", 3, dVal.bottomY, []],
      ["d_Vu_l", dVal.leftX, 1, []],
      ["d_Vu_m", dVal.middleX, 1, []],
      ["d_Vu_r", dVal.rightX, 1, []],
      ["d_Vb_l", dVal.leftX, 0, []],
      ["d_Vb_m", dVal.middleX, 0, []],
      ["d_Vb_r", dVal.rightX, 0, []],
      ["d_AB", 0.5, dVal.middleY, []],
      ["d_BC", 1.5, dVal.middleY, []],
      ["d_CD", 2.5, dVal.middleY, []],
      ["d_V", dVal.rightX, 0.5, []]
    ]) {
      points[data[0]] = bR.create(
        "point",
        [
          () => {
            return corner.x + data[1] * scale * sliders["width"].Value();
          },
          corner.y + data[2] * scale * 3
        ],
        {
          ...pointProperties,
          name: data[0],
          label: {
            ...labelProperties
            // offset: () => {
            //   if (this.state < 9) return [-offsetFactor, 1.5 * offsetFactor];
            //   else return centerOffset;
            // },
            // visible: forStates([0, 1, 2, 3, 4, 5, 10, 11])
          },
          visible: () => {
            return data[3].includes(this.state);
          }
        }
      );
    }

    const beamProperties = { straightFirst: false, straightLast: false, strokeWidth: 10, strokeColor: "green" };
    const dottedProperties = { straightFirst: false, straightLast: false, dash: 2, strokeWidth: 5, strokeColor: "black" };
    const forceProperties = { lastArrow: true, straightFirst: false, straightLast: false, strokeWidth: 5, strokeColor: "red" };
    const divideProperties = { straightFirst: false, straightLast: false, strokeWidth: 2, strokeColor: "blue" };
    const divideArrowProperties = { ...divideProperties, lastArrow: true, firstArrow: true, strokeWidth: 3 };
    for (let data of [
      // Regular lines
      ["A", "I", [0], beamProperties],
      ["A", "B", [0], beamProperties],
      ["A", "H", [0], beamProperties],
      ["I", "H", [0], beamProperties],
      ["H", "B", [0, 1], beamProperties],
      ["H", "G", [0, 1], beamProperties],
      ["B", "C", [0, 1], beamProperties],
      ["B", "G", [0, 1], beamProperties],
      ["G", "C", [0, 1, 2], beamProperties],
      ["G", "E", [0, 1, 2], beamProperties],
      ["C", "D", [0, 1, 2], beamProperties],
      ["C", "E", [0, 1, 2], beamProperties],
      ["D", "E", [0, 1, 2, 3], beamProperties],

      // Dotted lines
      ["A", "I", [1], dottedProperties],
      ["A", "AB", [1], dottedProperties],
      ["A", "AH", [1], dottedProperties],
      ["I", "IH", [1], dottedProperties],
      ["H", "B", [2], dottedProperties],
      ["H", "HG", [2], dottedProperties],
      ["B", "BC", [2], dottedProperties],
      ["B", "BG", [2], dottedProperties],
      ["G", "C", [3], dottedProperties],
      ["G", "GE", [3], dottedProperties],
      ["C", "CD", [3], dottedProperties],
      ["C", "CE", [3], dottedProperties],

      // Line stubs
      ["AB", "B", [1], beamProperties],
      ["AH", "H", [1], beamProperties],
      ["IH", "H", [1], beamProperties],
      ["HG", "G", [2], beamProperties],
      ["BC", "C", [2], beamProperties],
      ["BG", "G", [2], beamProperties],
      ["GE", "E", [3], beamProperties],
      ["CD", "D", [3], beamProperties],
      ["CE", "E", [3], beamProperties],

      // Force stubs
      ["AB", "fAB", [1], forceProperties],
      ["AH", "fAH", [1], forceProperties],
      ["IH", "fIH", [1], forceProperties],
      ["HG", "fHG", [2], forceProperties],
      ["BC", "fBC", [2], forceProperties],
      ["BG", "fBG", [2], forceProperties],
      ["GE", "fGE", [3], forceProperties],
      ["CD", "fCD", [3], forceProperties],
      ["CE", "fCE", [3], forceProperties],

      // Divide lines
      ["d_A_u", "d_A_b", [0], divideProperties],
      ["d_B_u", "d_B_b", [0], divideProperties],
      ["d_C_u", "d_C_b", [0], divideProperties],
      ["d_D_u", "d_D_b", [0], divideProperties],
      ["d_A_m", "d_B_m", [0], divideArrowProperties],
      ["d_B_m", "d_C_m", [0], divideArrowProperties],
      ["d_C_m", "d_D_m", [0], divideArrowProperties],
      ["d_Vu_l", "d_Vu_r", [0], divideProperties],
      ["d_Vb_l", "d_Vb_r", [0], divideProperties],
      ["d_Vu_m", "d_Vb_m", [0], divideArrowProperties]
    ]) {
      bR.create("line", [points[data[0]], points[data[1]]], {
        ...data[3],
        visible: () => {
          return data[2].includes(this.state);
        }
      });
    }

    for (let data of [
      ["d_AB", "middle", "top"],
      ["d_BC", "middle", "top"],
      ["d_CD", "middle", "top"],
      ["d_V", "left", "middle"]
    ]) {
      bR.create(
        "text",
        [
          0,
          0,
          () => {
            if (this.state != 0) return "";
            return String(Math.round(sliders.width.Value() * 100) / 100) + " m";
          }
        ],
        { anchor: points[data[0]], anchorX: data[1], anchorY: data[2], fontSize: 14 }
      );
    }

    let values = {};
    values.cosA = () => {
      return Math.cos((sliders.angle.Value() * Math.PI) / 180);
    };
    values.sinA = () => {
      return Math.sin((sliders.angle.Value() * Math.PI) / 180);
    };
    values.arctan = () => {
      return Math.atan(3 / sliders.width.Value());
    };
    // console.log(values.sinA());
    values.F_IH = () => {
      let x = sliders.force.Value() * values.sinA() * sliders.width.Value() * 3;
      return x / 3;
    };
    values.F_AH = () => {
      let x = sliders.force.Value() * values.sinA();
      return -x / Math.sin(values.arctan());
    };
    values.F_AB = () => {
      let x = sliders.force.Value() * (values.sinA() * sliders.width.Value() * 2 + values.cosA() * 3);
      return -x / 3;
    };
    values.F_HG = () => {
      let x = sliders.force.Value() * values.sinA() * sliders.width.Value() * 2;
      return x / 3;
    };
    values.F_BG = () => {
      let x = sliders.force.Value() * values.sinA();
      return -x / Math.sin(values.arctan());
    };
    values.F_BC = () => {
      let x = sliders.force.Value() * (values.sinA() * sliders.width.Value() + values.cosA() * 3);
      return -x / 3;
    };
    values.F_GE = () => {
      let x = sliders.force.Value() * values.sinA() * sliders.width.Value() * 1;
      return x / 3;
    };
    values.F_CE = () => {
      let x = sliders.force.Value() * values.sinA();
      return -x / Math.sin(values.arctan());
    };
    values.F_CD = () => {
      let x = sliders.force.Value() * values.cosA() * 3;
      return x / 3;
    };

    const vectorScale = (1 / 1000) * scale;
    points["f"] = bR.create(
      "point",
      [
        () => {
          return corner.x + 3 * scale * sliders.width.Value() - vectorScale * (sliders.force.Value() * values.cosA());
        },
        () => {
          return corner.y - vectorScale * (sliders.force.Value() * values.sinA());
        }
      ],
      { name: "F", visible: false, fixed: true, label: { strokeColor: "blue", visible: true } }
    );
    bR.create("line", [points["D"], points["f"]], {
      strokeColor: "blue",
      strokeWidth: 5,
      lastArrow: true,
      straightFirst: false,
      straightLast: false
    });

    const SIGMA = "\u03a3";
    const ALPHA = "\u03b1";
    const textProperties = { fontSize: 14, fixed: true };

    this.textToUpdate.top = {};
    this.textToUpdate.top.object = bL.create("text", [-15, -10, ""], { ...textProperties });
    this.textToUpdate.top.formula = () => {
      let options = [
        "If only the forces in several members are desired, method of section gives us a quick and direct way",
        "Suppose forces in the members IH, AH, and AB are desired, so we choose a section that passes these members",
        "Suppose forces in the members HG, BG, and BC are desired, so we choose a section that passes these members",
        "Suppose forces in the members GE, CE, and CD are desired, so we choose a section that passes these members"
      ];
      return options[this.state];
    };
    for (let data of [
      [
        "equation1",
        -15,
        -14,
        [
          SIGMA + "M_A = 0 = F_{IH}l_{IA} - F*sin(" + ALPHA + ")l_{AD}, F_{IH} = ",
          SIGMA + "M_B = 0 = F_{HG}l_{HB} - F*sin(" + ALPHA + ")l_{BD}, F_{HG} = ",
          SIGMA + "M_C = 0 = F_{GE}l_{GC} - F*sin(" + ALPHA + ")l_{CD}, F_{GE} = "
        ],
        ["F_IH", "F_HG", "F_GE"]
      ],
      [
        "equation2",
        -15,
        -19,
        [
          SIGMA + "F_Y = 0 = - F_{AH}*sin(arctan(l_{AI}/l_{IH})) - F*sin(" + ALPHA + "), F_{AH} = ",
          SIGMA + "F_Y = 0 = - F_{BG}*sin(arctan(l_{BH}/l_{HG})) - F*sin(" + ALPHA + "), F_{BG} = ",
          SIGMA + "F_Y = 0 = - F_{CE}*sin(arctan(l_{CG}/l_{GE})) - F*sin(" + ALPHA + "), F_{CE} = "
        ],
        ["F_AH", "F_CE", "F_GE"]
      ],
      [
        "equation3",
        -15,
        -24,
        [
          SIGMA + "M_H = 0 = F*sin(" + ALPHA + ")l_{HE} + F*cos(" + ALPHA + ")l_{HB} + F_{AB}l_{HB}, F_{AB} = ",
          SIGMA + "M_G = 0 = F*sin(" + ALPHA + ")l_{GE} + F*cos(" + ALPHA + ")l_{GC} + F_{BC}l_{GC}, F_{BC} = ",
          SIGMA + "M_E = 0 = F*cos(" + ALPHA + ")l_{ED} + F_{CD}l_{ED}, F_{CD} = "
        ],
        ["F_AB", "F_BC", "F_CD"]
      ]
    ]) {
      this.textToUpdate[data[0]] = {};
      this.textToUpdate[data[0]].object = bL.create("text", [data[1], data[2], ""], { ...textProperties });
      this.textToUpdate[data[0]].formula = () => {
        if (this.state === 0) return "";
        else return data[3][this.state - 1] + String(Math.round(values[data[4][this.state - 1]]() * 100) / 100);
      };
    }
    for (let data of [
      ["tension1", -15, -16, ["IH", "HG", "GE"]],
      ["tension2", -15, -21, ["AH", "BG", "CE"]],
      ["tension3", -15, -26, ["AB", "BC", "CD"]]
    ]) {
      this.textToUpdate[data[0]] = {};
      this.textToUpdate[data[0]].object = bL.create("text", [data[1], data[2], ""], { ...textProperties });
      this.textToUpdate[data[0]].formula = () => {
        if (this.state === 0) return "";
        let val = Math.round(100 * values["F_" + data[3][this.state - 1]]()) / 100;
        if (val === 0) return "";
        let stem = "Member " + data[3][this.state - 1] + " is in ";
        if (val < 0) return stem + " compression";
        else return stem + " tension";
      };
    }

    const graphOrigin = { x: -10, y: -10 };
    const graphHeight = 10;
    const graphLength = 20;
    for (let data of [
      ["Q1", graphLength, graphHeight],
      ["Q2", 0, graphHeight],
      ["Q3", 0, 0],
      ["Q4", graphLength, 0]
    ]) {
      points[data[0]] = bR.create("point", [graphOrigin.x + data[1], graphOrigin.y + data[2]], { visible: false, fixed: true });
    }

    let lines = {};
    for (let data of [
      ["top", "Q2", "Q1"],
      ["bottom", "Q3", "Q4"],
      ["left", "Q3", "Q2"],
      ["right", "Q4", "Q1"]
    ]) {
      lines[data[0]] = bR.create("line", [points[data[1]], points[data[2]]], {
        straightFirst: false,
        straightLast: false,
        strokeWidth: 3,
        strokeColor: "black"
      });
    }

    bR.create(
      "line",
      [
        bR.create("point", [graphOrigin.x, graphOrigin.y + graphHeight / 2], { visible: false, fixed: true }),
        bR.create("point", [graphOrigin.x + graphLength, graphOrigin.y + graphHeight / 2], { visible: false, fixed: true })
      ],
      { strokeWidth: 1, strokeColor: "black", straightFirst: false, straightLast: false }
    );

    bR.create("ticks", [lines.bottom, 0.5], {
      anchor: "left",
      includeBoundaries: true,
      drawLabels: true,
      drawZero: true,
      scale: graphLength / 3,
      label: {
        anchorX: "middle",
        anchorY: "top",
        offset: [0, -4]
      }
    });

    bR.create("ticks", [lines.left, 500], {
      anchor: "middle",
      includeBoundaries: true,
      drawLabels: true,
      drawZero: true,
      scale: 1 / 400,
      maxLabelLength: 6,
      precision: 4,
      label: {
        anchorX: "right",
        anchorY: "middle",
        offset: [-6, 0]
      }
    });

    const axisLabelProperties = { fontSize: 14, anchorX: "middle", anchorY: "middle" };
    bR.create("text", [graphOrigin.x + graphLength / 2, graphOrigin.y - 2, "Width (m)"], { ...axisLabelProperties });
    bR.create("text", [graphOrigin.x - 2.5, graphOrigin.y + graphHeight / 2, "Load (F)"], {
      ...axisLabelProperties,
      rotate: 90,
      display: "internal"
    });

    const convertCoords = (x, y) => {
      let xNew = graphOrigin.x + (x / 3) * graphLength;
      let yNew = graphOrigin.y + graphHeight / 2 + (y / 4000) * graphHeight;
      return [xNew, yNew];
    };

    let calc = {};
    calc.F_HG = width => {
      let x = sliders.force.Value() * values.sinA() * width * 2;
      return x / 3;
    };
    calc.F_BG = width => {
      let x = sliders.force.Value() * values.sinA();
      return -x / Math.sin(Math.atan(3 / width));
    };
    calc.F_BC = width => {
      let x = sliders.force.Value() * (values.sinA() * width + values.cosA() * 3);
      return -x / 3;
    };

    for (let data of [
      ["F_HG", "F_{HG}", "skyBlue"],
      ["F_BG", "F_{BG}", "orange"],
      ["F_BC", "F_{BC}", "green"]
    ]) {
      let p1 = bR.create(
        "point",
        [
          () => {
            return convertCoords(0, calc[data[0]](0))[0];
          },
          () => {
            return convertCoords(0, calc[data[0]](0))[1];
          }
        ],
        { visible: false }
      );
      let p2 = bR.create(
        "point",
        [
          () => {
            return convertCoords(3, calc[data[0]](3))[0];
          },
          () => {
            return convertCoords(3, calc[data[0]](3))[1];
          }
        ],
        { visible: false }
      );
      bR.create("line", [p1, p2], { straightFirst: false, straightLast: false, strokeColor: data[2] });
      bR.create(
        "point",
        [
          () => {
            return convertCoords(sliders.width.Value(), calc[data[0]](sliders.width.Value()))[0];
          },
          () => {
            return convertCoords(sliders.width.Value(), calc[data[0]](sliders.width.Value()))[1];
          }
        ],
        { visible: true, name: data[1] }
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
      this.state = newState;

      for (const lbl of Object.keys(this.textToUpdate)) {
        this.textToUpdate[lbl].object.setText("");
        this.textToUpdate[lbl].object.setText(this.textToUpdate[lbl].formula);
        //console.log(this.textToUpdate[lbl].formula());
      }
      this.bL.fullUpdate();
      this.bR.fullUpdate();
    }
  }
};
export const meta = {
  title: "Comprehensive Truss Problem",
  description: "truss"
};
</script>
