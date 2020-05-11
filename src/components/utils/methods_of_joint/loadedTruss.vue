<template>
  <div>
    <div id="box1" class="jsx-graph my-2 text-center"></div>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => {
    return {
      state: 0,
      info: {
        top: undefined,
        middle: undefined,
        bottom: undefined,
        q1: undefined,
        q2: undefined,
        q3: undefined,
        q4: undefined
      },
      infoText: {
        top: undefined,
        middle: undefined,
        bottom: undefined,
        q1: undefined,
        q2: undefined,
        q3: undefined,
        q4: undefined
      },
      b2: undefined,
      labelsToUpdate: {},
      labelFormulas: {}
    };
  },
  mounted() {
    // Scale determines the size of the whole structure
    const scale = 4.5;
    const bgColor = window.getComputedStyle(document.getElementById("app"), null).getPropertyValue("background-color");
    // let lodash = require("lodash");

    // Setup the board
    const b2 = JXG.JSXGraph.initBoard("box1", {
      boundingbox: [-15, 10, 15, -15],
      keepAspectRatio: true,
      showCopyright: false,
      pan: { enabled: false },
      zoom: { wheel: false },
      showNavigation: false,
      showZoom: false
    });
    b2.canvasHeight = 600;

    // Slider setup
    const force = b2.create(
      "slider",
      [
        [-6, -9],
        [0, -9],
        [1, 1, 2]
      ],
      { name: "Load F (N)", label: { fontSize: 15 } }
    );
    const angle = b2.create(
      "slider",
      [
        [-6, -10],
        [0, -10],
        [0, 90, 180]
      ],
      { name: "Angle \u03a6 (\u00B0)", label: { fontSize: 15 } }
    );

    // Input boxes for the sliders
    const input_force = b2.create("input", [6, -9 + 0.05, "", ""], { cssStyle: "width: 50px" });
    const input_angle = b2.create("input", [6, -10, "", ""], { cssStyle: "width: 50px" });

    // Update buttons for the sliders
    b2.create(
      "button",
      [
        8,
        -9,
        "Update",
        () => {
          if (!isNaN(input_force.Value())) {
            let val = Number(input_force.Value());
            val = Math.min(force._smax, val);
            val = Math.max(force._smin, val);
            val = Math.round(val * 100) / 100;
            force.setValue(val);
            input_force.rendNodeInput.value = "";
            input_force.update();
          }
        }
      ],
      {}
    );
    b2.create(
      "button",
      [
        8,
        -10,
        "Update",
        () => {
          if (!isNaN(input_angle.Value())) {
            let val = Number(input_angle.Value());
            val = Math.min(angle._smax, val);
            val = Math.max(angle._smin, val);
            val = Math.round(val * 100) / 100;
            angle.setValue(val);
            input_angle.rendNodeInput.value = "";
            input_angle.update();
          }
        }
      ],
      {}
    );

    // values calculated
    let value = {};

    value.cos = () => {
      return Math.cos((angle.Value() / 180) * Math.PI);
    };

    value.sin = () => {
      return Math.sin((angle.Value() / 180) * Math.PI);
    };

    const cos60 = Math.cos((60 / 180) * Math.PI);
    const sin60 = Math.sin((60 / 180) * Math.PI);

    value.F_x = () => {
      return force.Value() * value.cos();
    };

    value.F_y = () => {
      return force.Value() * value.sin();
    };

    value.Rax = () => {
      return value.F_x();
    };

    value.Ray = () => {
      return value.F_y() * 0.5;
    };

    value.Re = () => {
      return value.Ray();
    };

    value.Fab = () => {
      return (-1 * value.Ray()) / sin60;
    };

    value.Fac = () => {
      return -1 * (value.Rax() + value.Fab() * cos60);
    };

    value.Fbc = () => {
      return -1 * value.Fab();
    };

    value.Fbd = () => {
      return (value.Fab() - value.Fbc()) * cos60;
    };

    value.Fcd = () => {
      return value.F_y() / sin60 - value.Fbc();
    };

    value.Fce = () => {
      return value.F_x() + value.Fac() + value.Fbc() * cos60 - value.Fcd() * cos60;
    };

    value.Fde = () => {
      return -1 * value.Fcd();
    };

    // returns a function that determines if the current state matches any of the options
    const forStates = options => {
      return () => {
        return options.includes(this.state);
      };
    };

    // used for the offset of the labels
    const offsetFactor = 11;
    const centerOffset = [-offsetFactor * 0.3, 0];

    // create points
    const pointProperties = {
      fixed: true,
      fillColor: "white",
      strokeColor: "black",
      size: () => {
        if (forStates([0, 1, 2, 3, 4, 5, 15, 16])()) return 5;
        else return 7;
      },
      visible: forStates([0, 1, 2, 3, 4, 5, 10, 15])
    };
    const labelProperties = { strokeColor: "black" };

    const point_a = b2.create("point", [-2 * scale, 0], {
      ...pointProperties,
      name: "A",
      label: {
        ...labelProperties,
        offset: () => {
          if (this.state < 9) return [-offsetFactor, 1.5 * offsetFactor];
          else return centerOffset;
        },
        visible: forStates([0, 1, 2, 3, 4, 5, 10, 11])
      },
      visible: forStates([0, 1, 2, 3, 4, 5, 10, 11, 15, 16])
    });
    const point_b = b2.create("point", [-1 * scale, Math.sqrt(3) * scale], {
      ...pointProperties,
      name: "B",
      label: {
        ...labelProperties,
        offset: () => {
          if (this.state < 9) return [(-offsetFactor * 3) / 2, offsetFactor];
          else return centerOffset;
        },
        visible: forStates([0, 1, 2, 3, 4, 5, 10, 12])
      },
      visible: forStates([0, 1, 2, 3, 4, 5, 10, 12, 15, 16])
    });
    const point_c = b2.create("point", [0 * scale, 0 * scale], {
      ...pointProperties,
      name: "C",
      label: {
        ...labelProperties,
        offset: () => {
          if (this.state < 9) return [(offsetFactor * -1) / 3, offsetFactor * 2];
          else return centerOffset;
        },
        visible: forStates([0, 1, 2, 3, 4, 5, 10, 13])
      },
      visible: forStates([0, 1, 2, 3, 4, 5, 10, 13, 15, 16])
    });
    const point_d = b2.create("point", [1 * scale, Math.sqrt(3) * scale], {
      ...pointProperties,
      name: "D",
      label: {
        ...labelProperties,
        offset: () => {
          if (this.state < 9) return [(offsetFactor * 1) / 2, offsetFactor];
          else return centerOffset;
        },
        visible: forStates([0, 1, 2, 3, 4, 5, 10, 14])
      },
      visible: forStates([0, 1, 2, 3, 4, 5, 10, 14, 15, 16])
    });
    const point_e = b2.create("point", [2 * scale, 0], {
      ...pointProperties,
      name: "E",
      label: {
        ...labelProperties,
        offset: () => {
          if (this.state < 9) return [(offsetFactor * 1) / 2, 1.5 * offsetFactor];
          else return centerOffset;
        },
        visible: forStates([0, 1, 2, 3, 4, 5, 10])
      },
      visible: forStates([0, 1, 2, 3, 4, 5, 10, 15, 16])
    });

    // create triangle & circle
    const triangleScale = scale / 4;
    const triangleVert = triangleScale / 4;
    const triangleHeight = Math.sqrt(3) * triangleScale;
    const point_T1 = b2.create("point", [-2 * scale + triangleScale, -triangleHeight + triangleVert], {
      fixed: true,
      visible: false
    });
    const point_T2 = b2.create("point", [-2 * scale - triangleScale, -triangleHeight + triangleVert], {
      fixed: true,
      visible: false
    });
    const point_T3 = b2.create("point", [-2 * scale, triangleVert], { fixed: true, visible: false });

    b2.create("polygon", [point_T3, point_T1, point_T2], {
      visible: forStates([0, 2]),
      fillColor: "green",
      borders: {
        strokeColor: "green",
        strokeWidth: 2
      },
      fixed: true
    });

    const circleDiameter = triangleHeight - triangleVert;
    b2.create("circle", [b2.create("point", [2 * scale, -0.5 * circleDiameter], { fixed: true, visible: false }), circleDiameter / 2], {
      fillColor: "green",
      strokeColor: "grey",
      visible: forStates([0]),
      fixed: true
    });

    // comb pieces

    b2.create("comb", [point_T1, point_T2], { curve: { strokeWidth: 1, strokeColor: "green", visible: forStates([0, 2]) } });
    const point_R1 = b2.create("point", [2 * scale + triangleScale, -triangleHeight + triangleVert], {
      fixed: true,
      visible: false
    });
    const point_R2 = b2.create("point", [2 * scale - triangleScale, -triangleHeight + triangleVert], {
      fixed: true,
      visible: false
    });
    b2.create("line", [point_R1, point_R2], { straightFirst: false, straightLast: false, strokeColor: "green", visible: forStates([0]) });
    b2.create("comb", [point_R1, point_R2], { curve: { strokeWidth: 1, strokeColor: "green", visible: forStates([0]) } });

    // create the lines
    const lineProperties = {
      straightFirst: false,
      straightLast: false,
      strokeWidth: () => {
        if ([0].includes(this.state)) return 10;
        else return 4;
      },
      strokeColor: "green",
      visible: forStates([0, 1, 2, 3, 4, 5, 10, 15])
    };
    for (const p of [
      [point_a, point_b, value.Fab],
      [point_a, point_c, value.Fac],
      [point_b, point_c, value.Fbc],
      [point_b, point_d, value.Fbd],
      [point_c, point_d, value.Fcd],
      [point_c, point_e, value.Fce],
      [point_d, point_e, value.Fde]
    ]) {
      b2.create("line", [p[0], p[1]], {
        ...lineProperties,
        strokeColor: () => {
          if (forStates([15, 16])()) {
            if (p[2]() < 0) return "purple";
            else return "green";
          } else return "green";
        }
      });
    }

    // create the force vectors
    const vectorScale = scale * 0.4;
    const point_F = b2.create(
      "point",
      [
        () => {
          return -vectorScale * value.F_x();
        },
        () => {
          return -vectorScale * value.F_y();
        }
      ],
      { visible: false, fixed: true }
    );

    const point_Rax = b2.create(
      "point",
      [
        () => {
          if (forStates([5, 15, 16])()) return -1 * vectorScale * Math.abs(value.F_x()) - scale * 2;
          else return -(vectorScale + scale * 2);
        },
        0
      ],
      { visible: false, fixed: true }
    );

    const point_Ray = b2.create(
      "point",
      [
        -scale * 2,
        () => {
          if (forStates([5, 15, 16])()) return -vectorScale * value.Ray();
          else return -vectorScale;
        }
      ],
      { visible: false, fixed: true }
    );

    const point_Re = b2.create(
      "point",
      [
        scale * 2,
        () => {
          if (forStates([5, 15, 16])()) return -vectorScale * value.Re();
          else return -vectorScale;
        }
      ],
      { visible: false, fixed: true }
    );

    const forceVectorProperties = { straightFirst: false, straightLast: false, touchFirstPoint: true, lastArrow: true, strokeWidth: 4 };

    b2.create("line", [point_c, point_F], {
      ...forceVectorProperties,
      strokeColor: "blue",
      visible: forStates([0, 1, 2, 3, 4, 5, 13, 15, 16])
    });
    b2.create("line", [point_Rax, point_a], {
      ...forceVectorProperties,
      strokeColor: "red",
      visible: forStates([1, 3, 4, 5, 11, 15, 16])
    });
    b2.create("line", [point_Ray, point_a], {
      ...forceVectorProperties,
      strokeColor: "red",
      visible: forStates([1, 3, 4, 5, 11, 15, 16])
    });
    b2.create("line", [point_Re, point_e], {
      ...forceVectorProperties,
      strokeColor: "red",
      visible: forStates([1, 2, 3, 4, 5, 15, 16])
    });

    b2.create("angle", [point_a, point_c, point_F], {
      orthoType: "sector",
      radius: vectorScale * 0.5,
      name: "\u03a6",
      visible: forStates([0, 1, 2, 3, 4, 5, 13, 15, 16]),
      strokeColor: "black",
      fillColor: bgColor,
      dash: 1
    });

    // joint vector lines
    const jointScale = 0.425;

    for (const line of [
      [point_a, scale * (-2 + jointScale), scale * jointScale * Math.sqrt(3), 11, value.Fab],
      [point_a, scale * (-2 + 2 * jointScale), 0, 11, value.Fac],
      [point_b, scale * (-1 - jointScale), scale * (1 - jointScale) * Math.sqrt(3), 12, value.Fab],
      [point_b, scale * (-1 + jointScale), scale * (1 - jointScale) * Math.sqrt(3), 12, value.Fbc],
      [point_b, scale * (-1 + 2 * jointScale), scale * Math.sqrt(3), 12, value.Fbd],
      [point_c, scale * 2 * jointScale, 0, 13, value.Fce],
      [point_c, scale * jointScale, scale * jointScale * Math.sqrt(3), 13, value.Fcd],
      [point_c, scale * -1 * jointScale, scale * jointScale * Math.sqrt(3), 13, value.Fbc],
      [point_c, scale * -2 * jointScale, 0, 13, value.Fac],
      [point_d, scale * (1 - 2 * jointScale), scale * Math.sqrt(3), 14, value.Fbd],
      [point_d, scale * (1 - jointScale), scale * (1 - jointScale) * Math.sqrt(3), 14, value.Fcd],
      [point_d, scale * (1 + jointScale), scale * (1 - jointScale) * Math.sqrt(3), 14, value.Fde],
      [point_e, scale * (2 - 2 * jointScale), 0, 16, value.Fce],
      [point_e, scale * (2 - jointScale), scale * jointScale * Math.sqrt(3), 16, value.Fde]
    ]) {
      const p = b2.create("point", [line[1], line[2]], { visible: false, fixed: true });
      b2.create("line", [line[0], p], {
        straightFirst: false,
        straightLast: false,
        strokeColor: () => {
          if (forStates([16])() && line[4]() < 0) return "purple";
          else return "green";
        },
        strokeWidth: 4,
        visible: forStates([line[3], 16]),
        firstArrow: () => {
          return forStates([16])() && line[4]() < 0;
        },
        lastArrow: () => {
          return !(forStates([16])() && line[4]() < 0);
        }
      });
    }

    // force vector label text

    this.labelsToUpdate["F_C"] = b2.create("text", [0, 0, ""], {
      anchor: point_F,
      anchorX: "middle",
      strokeColor: "blue",
      offset: [offsetFactor * 0.5, -offsetFactor * 0.75],
      isLabel: true,
      fontSize: 16,
      fixed: true
    });
    this.labelFormulas["F_C"] = () => {
      if (forStates([0, 1, 2, 3, 4, 5, 13, 15, 16])()) return "F_C = " + String(Math.round(force.Value() * 100) / 100) + " kN";
      else return "";
    };

    this.labelsToUpdate["R_Ax"] = b2.create("text", [0, 0, ""], {
      anchor: point_Rax,
      anchorX: "right",
      strokeColor: "red",
      offset: [-offsetFactor * 1, offsetFactor * 0],
      isLabel: true,
      fontSize: 14,
      fixed: true
    });
    this.labelFormulas["R_Ax"] = () => {
      if (forStates([1, 3, 4, 11])()) return "R_{A,x}";
      else if (forStates([5, 15, 16])()) return "R_{A,x} = " + String(Math.round(value.Rax() * 100) / 100) + " kN";
      else return "";
    };

    this.labelsToUpdate["R_Ay"] = b2.create("text", [0, 0, ""], {
      anchor: point_Ray,
      anchorX: "middle",
      strokeColor: "red",
      offset: [-offsetFactor * 0, -offsetFactor * 0.75],
      isLabel: true,
      fontSize: 14,
      fixed: true
    });
    this.labelFormulas["R_Ay"] = () => {
      if (forStates([1, 3, 4, 11])()) return "R_{A,y}";
      else if (forStates([5, 15, 16])()) return "R_{A,y} = " + String(Math.round(value.Ray() * 100) / 100) + " kN";
      else return "";
    };

    this.labelsToUpdate["R_E"] = b2.create("text", [0, 0, ""], {
      anchor: point_Re,
      anchorX: "middle",
      strokeColor: "red",
      offset: [offsetFactor * 0.5, -offsetFactor * 0.75],
      isLabel: true,
      fontSize: 14,
      fixed: true
    });
    this.labelFormulas["R_E"] = () => {
      if (forStates([1, 2])()) return "R_E";
      else if (forStates([3, 4, 5, 15, 16])()) return "R_E = " + String(Math.round(value.Re() * 100) / 100) + " kN";
      else return "";
    };

    // Joint vector labels
    for (const p of [
      [["F_{AB}", "F_AB"], -1.5 * scale, 0.5 * Math.sqrt(3) * scale, value.Fab, [10, 11], [12, 15, 16], []],
      [["F_{AC}", "F_AC"], -1 * scale, 0, value.Fac, [10, 11], [13, 15, 16], [13]],
      [["F_{BC}", "F_BC"], -0.5 * scale, 0.5 * Math.sqrt(3) * scale, value.Fbc, [10, 12], [13, 15, 16], []],
      [["F_{BD}", "F_BD"], 0, Math.sqrt(3) * scale, value.Fbd, [10, 12], [14, 15, 16], [14]],
      [["F_{CD}", "F_CD"], 0.5 * scale, 0.5 * Math.sqrt(3) * scale, value.Fcd, [10, 13], [14, 15, 16], []],
      [["F_{CE}", "F_CE"], 1 * scale, 0, value.Fce, [10, 13], [15, 16], []],
      [["F_{DE}", "F_DE"], 1.5 * scale, 0.5 * Math.sqrt(3) * scale, value.Fde, [10, 14], [15, 16], []]
    ]) {
      this.labelsToUpdate[p[0][1]] = b2.create("text", [p[1], p[2], ""], {
        anchorX: () => {
          if (forStates(p[6])()) return "right";
          else return "middle";
        },
        strokeColor: () => {
          if (forStates([15])()) {
            if (p[3]() < 0) return "purple";
            else return "green";
          } else return "black";
        },
        cssStyle: "background-color:" + bgColor,
        fontSize: 14,
        fixed: true
      });
      this.labelFormulas[p[0][1]] = () => {
        if (forStates(p[4])()) return p[0][0];
        else if (forStates(p[5])()) return "" + p[0][0] + " = " + String(Math.round(p[3]() * 100) / 100) + " kN";
        else return "";
      };
    }
    // this.labelsToUpdate["F_BD"].setAttribute({});
    // large text at bottom

    this.infoText = {
      top: [
        "",
        "",
        'sum of the moments about A: \u03a3 M_A = 0 = w<span style="color:blue">F_C</span> \\sin(\u03a6) - 2w<span style="color:red">R_E</span>',
        'sum of the x forces: \u03a3 F_x = <span style="color:blue">F_C</span> \\cos(\u03a6) = <span style="color:red">R_{A,x}</span>',
        'sum of the y forces: \u03a3 F_y = 0 = <span style="color:red">R_{A,y}</span> - <span style="color:blue">F_C</span> \\sin(\u03a6) + <span style="color:red">R_E</span>',
        ""
      ].concat(new Array(10).fill("")),
      middle: [
        "Every member has an equal length of w",
        "",
        'reaction force E: <span style="color:red">R_E</span> = 0.5*<span style="color:blue">F_C</span> \\sin(\u03a6)',
        () => {
          return 'x component of reaction force A: <span style="color:red">R_{A,x} = ' + String(Math.round(value.Rax() * 100) / 100) + " kN</span>";
        },
        'y component of reaction force A: <span style="color:red">R_{A,y}</span> = <span style="color:blue">F_C</span> \\sin (\u03a6) - <span style="color:red">R_E</span>',
        ""
      ].concat(new Array(10).fill("")),
      bottom: [
        "",
        "",
        () => {
          return '<span style="color:red">R_E = ' + String(Math.round(value.Re() * 100) / 100) + " kN</span>";
        },
        "",
        () => {
          return '<span style="color:red">R_{A,y} = ' + String(Math.round(value.Ray() * 100) / 100) + " kN</span>";
        },
        ""
      ].concat(new Array(10).fill("")),
      q1: new Array(10)
        .fill("")
        .concat([
          "",
          '\u03A3 F_x = 0 = <span style="color:red">R_{A,x}</span> + F_{AB} cos(\u03B8) + F_{AC}',
          "\u03A3 F_x = 0 = -F_{AB} cos(\u03B8) + F_{BC} cos(\u03B8) + F_{BD}",
          "\u03A3 F_x = -F_C cos(\u03a6) - F_{AC} - F_{BC} cos(\u03B8) + F_{CD} cos(\u03B8) + F_{CE}",
          "\u03A3 F_y = 0 = -F_{CD} sin(\u03B8) - F_{DE} sin(\u03B8) ",
          ""
        ]),
      q2: new Array(10)
        .fill("")
        .concat([
          "",
          '\u03A3 F_y = 0 = <span style="color:red">R_{A,y}</span> + F_{AB} sin(\u03B8)',
          "\u03A3 F_y = 0 = -F_{AB} sin(\u03B8) - F_{BC} sin(\u03B8)",
          "\u03A3 F_y = -F_C sin(\u03a6) + F_{BC} sin(\u03B8) + F_{CD} sin(\u03B8)",
          "",
          ""
        ]),
      q3: new Array(10).fill("").concat([
        "",
        () => {
          return "F_{AB} = " + String(Math.round((value.Fab() * 100) / 100)) + " kN";
        },
        () => {
          return "F_{BC} = " + String(Math.round((value.Fbc() * 100) / 100)) + " kN";
        },
        () => {
          return "F_{CD} = " + String(Math.round((value.Fcd() * 100) / 100)) + " kN";
        },
        "",
        ""
      ]),
      q4: new Array(10).fill("").concat([
        "",
        () => {
          return "F_{AC} = " + String(Math.round((value.Fac() * 100) / 100)) + " kN";
        },
        () => {
          return "F_{BD} = " + String(Math.round((value.Fbd() * 100) / 100)) + " kN";
        },
        () => {
          return "F_{CE} = " + String(Math.round((value.Fce() * 100) / 100)) + " kN";
        },
        () => {
          return "F_{DE} = " + String(Math.round((value.Fde() * 100) / 100)) + " kN";
        },
        ""
      ])
    };

    const infoProperties = { fontSize: 15, fixed: true, useMathJax: false };

    this.info.top = b2.create("text", [-6, -6, ""], {
      ...infoProperties,
      visible: forStates([2, 3, 4])
    });

    this.info.middle = b2.create("text", [-6, -7, ""], {
      ...infoProperties,
      visible: forStates([0, 2, 3, 4])
    });
    this.info.bottom = b2.create("text", [-6, -8, ""], {
      ...infoProperties,
      visible: forStates([2, 4])
    });
    this.info.q1 = b2.create("text", [1, -6, ""], {
      ...infoProperties,
      visible: forStates([11, 12, 13, 14])
    });
    this.info.q4 = b2.create("text", [1, -7, ""], {
      ...infoProperties,
      visible: forStates([11, 12, 13, 14])
    });
    this.info.q2 = b2.create("text", [-10, -6, ""], {
      ...infoProperties,
      visible: forStates([11, 12, 13])
    });
    this.info.q3 = b2.create("text", [-10, -7, ""], {
      ...infoProperties,
      visible: forStates([11, 12, 13])
    });

    // final stuff
    this.b2 = b2;
    this.changeState(0);
  },
  methods: {
    changeState(newState) {
      //console.log(newState);
      for (const key of ["top", "middle", "bottom", "q1", "q2", "q3", "q4"]) {
        this.info[key].setText("");
        this.info[key].setText(this.infoText[key][newState]);
      }
      // this.info.top.setText(this.infoText.top[newState]);
      // this.info.middle.setText(this.infoText.middle[newState]);
      // this.info.bottom.setText(this.infoText.bottom[newState]);
      // this.info.q1.setText(this.infoText.q1[newState]);
      // this.info.q2.setText(this.infoText.q2[newState]);
      // this.info.q3.setText(this.infoText.q3[newState]);
      // this.info.q4.setText(this.infoText.q4[newState]);

      // const val1 = this.state == 0 || this.state == 2;
      // const val2 = this.state == 0;

      this.state = newState;
      this.b2.fullUpdate();
      // console.log(this.infoText["middle"][newState]);
      for (const lbl of Object.keys(this.labelsToUpdate)) {
        this.labelsToUpdate[lbl].setText("");
        this.labelsToUpdate[lbl].setText(this.labelFormulas[lbl]);
      }

      // console.log(window.getComputedStyle(document.getElementById("app"), null).getPropertyValue("background-color"));

      //console.log(this.infoText.bottom[newState]);
    }
  }
};
export const meta = {
  title: "methods of joint demo",
  description: "joint"
};
</script>
