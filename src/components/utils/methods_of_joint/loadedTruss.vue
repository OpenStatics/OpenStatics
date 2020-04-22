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
        bottom: undefined
      },
      infoText: {
        top: undefined,
        middle: undefined,
        bottom: undefined
      },
      b2: undefined
    };
  },
  mounted() {
    const scale = 4;
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
    const force = b2.create(
      "slider",
      [
        [-6, -9],
        [0, -9],
        [1, 1, 2]
      ],
      { name: "Load F (N)" }
    );
    const angle = b2.create(
      "slider",
      [
        [-6, -10],
        [0, -10],
        [0, 90, 180]
      ],
      { name: "Angle" }
    );

    const input_force = b2.create("input", [5, -9 + 0.05, "", ""], { cssStyle: "width: 50px" });
    const input_angle = b2.create("input", [5, -10, "", ""], { cssStyle: "width: 50px" });

    const button_force = b2.create(
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
    const button_angle = b2.create(
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

    const forStates = options => {
      return () => {
        options.includes(this.state);
      };
    };

    const offsetFactor = 11;

    // create points
    const pointProperties = { fixed: true, fillColor: "white", strokeColor: "black", visible: true };
    const labelProperties = { strokeColor: "black" };

    const point_a = b2.create("point", [-2 * scale, 0], {
      ...pointProperties,
      name: "A",
      label: { ...labelProperties, offset: [-offsetFactor, -offsetFactor] }
    });
    const point_b = b2.create("point", [-1 * scale, Math.sqrt(3) * scale], {
      ...pointProperties,
      name: "B",
      label: { ...labelProperties, offset: [(-offsetFactor * 3) / 2, offsetFactor] }
    });
    const point_c = b2.create("point", [0 * scale, 0 * scale], {
      ...pointProperties,
      name: "C",
      label: { ...labelProperties, offset: [(offsetFactor * -1) / 3, offsetFactor * 2] }
    });
    const point_d = b2.create("point", [1 * scale, Math.sqrt(3) * scale], {
      ...pointProperties,
      name: "D",
      label: { ...labelProperties, offset: [(offsetFactor * 1) / 2, offsetFactor] }
    });
    const point_e = b2.create("point", [2 * scale, 0], {
      ...pointProperties,
      name: "E",
      label: { ...labelProperties, offset: [(offsetFactor * 1) / 2, -offsetFactor] }
    });

    const triangleScale = scale / 4;
    const triangleVert = triangleScale / 4;
    const point_T1 = b2.create("point", [-2 * scale + triangleScale, -1 * Math.sqrt(3) * triangleScale + triangleVert], {
      fixed: true,
      visible: false
    });
    const point_T2 = b2.create("point", [-2 * scale - triangleScale, -1 * Math.sqrt(3) * triangleScale + triangleVert], {
      fixed: true,
      visible: false
    });
    const point_T3 = b2.create("point", [-2 * scale, triangleVert], { fixed: true, visible: false });

    b2.create("polygon", [point_T3, point_T1, point_T2], {
      visible: () => {
        return this.state == 0;
      },
      fillColor: "green",
      borders: {
        strokeColor: "green",
        strokeWidth: 2
      },
      fixed: true
    });

    b2.create(
      "circle",
      [
        b2.create("point", [2 * scale, -0.5 * Math.sqrt(3) * triangleScale], { fixed: true, visible: false }),
        0.5 * Math.sqrt(3) * triangleScale - triangleVert * 0.5
      ],
      {
        fillColor: "green",
        strokeColor: "grey",
        visible: () => {
          return this.state == 0;
        },
        fixed: true
      }
    );

    const lineProperties = {
      straightFirst: false,
      straightLast: false,
      strokeWidth: () => {
        if ([1, 2, 3, 4, 5].includes(this.state)) return 4;
        else return 10;
      },
      strokeColor: "green"
    };
    for (const points of [
      [point_a, point_b],
      [point_a, point_c],
      [point_b, point_c],
      [point_b, point_d],
      [point_c, point_d],
      [point_c, point_e],
      [point_d, point_e]
    ]) {
      b2.create("line", points, { ...lineProperties, visible: true });
    }

    const vectorScale = scale * 0.4;
    const point_F = b2.create(
      "point",
      [
        () => {
          return -vectorScale * force.Value() * Math.cos((angle.Value() / 180) * Math.PI);
        },
        () => {
          return -vectorScale * force.Value() * Math.sin((angle.Value() / 180) * Math.PI);
        }
      ],
      { visible: false, fixed: true }
    );

    const point_Rax = b2.create(
      "point",
      [
        () => {
          if ([5].includes(this.state)) return -1 * Math.abs(vectorScale * force.Value() * Math.cos((angle.Value() / 180) * Math.PI)) - scale * 2;
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
          if ([5].includes(this.state)) return -vectorScale * 0.5 * force.Value() * Math.sin((angle.Value() / 180) * Math.PI);
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
          if ([5].includes(this.state)) return -vectorScale * 0.5 * force.Value() * Math.sin((angle.Value() / 180) * Math.PI);
          else return -vectorScale;
        }
      ],
      { visible: false, fixed: true }
    );

    const forceVectorProperties = { straightFirst: false, straightLast: false, touchFirstPoint: true, lastArrow: true, strokeWidth: 4 };

    b2.create("line", [point_c, point_F], {
      ...forceVectorProperties,
      strokeColor: "blue",
      visible: () => {
        return [0, 1, 2, 3, 4, 5].includes(this.state);
      }
    });
    b2.create("line", [point_Rax, point_a], {
      ...forceVectorProperties,
      strokeColor: "red",
      visible: () => {
        return [1, 3, 4, 5].includes(this.state);
      }
    });
    b2.create("line", [point_Ray, point_a], {
      ...forceVectorProperties,
      strokeColor: "red",
      visible: () => {
        return [1, 3, 4, 5].includes(this.state);
      }
    });
    b2.create("line", [point_Re, point_e], {
      ...forceVectorProperties,
      strokeColor: "red",
      visible: () => {
        return [1, 2, 3, 4, 5].includes(this.state);
      }
    });

    b2.create(
      "text",
      [
        0,
        0,
        () => {
          if ([1, 3, 4].includes(this.state)) return "R_{A,x}";
          else if ([5].includes(this.state))
            return "R_{A,x} = " + String(Math.round(force.Value() * Math.cos((angle.Value() / 180) * Math.PI) * 100) / 100) + " kN";
          else return "";
        }
      ],
      {
        anchor: point_Rax,
        anchorX: "right",
        strokeColor: "red",
        offset: [-offsetFactor * 1, offsetFactor * 0],
        isLabel: true,
        fontSize: 14,
        fixed: true
      }
    );

    b2.create(
      "text",
      [
        0,
        0,
        () => {
          if ([1, 3, 4].includes(this.state)) return "R_{A,y}";
          else if ([5].includes(this.state))
            return "R_{A,y} = " + String(Math.round(0.5 * force.Value() * Math.sin((angle.Value() / 180) * Math.PI) * 100) / 100) + " kN";
          else return "";
        }
      ],
      {
        anchor: point_Ray,
        anchorX: "middle",
        strokeColor: "red",
        offset: [-offsetFactor * 0, -offsetFactor * 0.75],
        isLabel: true,
        fontSize: 14,
        fixed: true
      }
    );

    b2.create(
      "text",
      [
        0,
        0,
        () => {
          if ([1, 2].includes(this.state)) return "R_E";
          else if ([3, 4, 5].includes(this.state))
            return "R_E = " + String(Math.round(0.5 * force.Value() * Math.sin((angle.Value() / 180) * Math.PI) * 100) / 100) + " kN";
          else return "";
        }
      ],
      {
        anchor: point_Re,
        anchorX: "middle",
        strokeColor: "red",
        offset: [offsetFactor * 0.5, -offsetFactor * 0.75],
        isLabel: true,
        fontSize: 14,
        fixed: true
      }
    );

    this.infoText = {
      top: [
        "",
        "",
        "sum of the moments about A: \u03a3 M_A = 0 = wF_C \\sin (\u03a6) - 2wR_E",
        "sum of the x forces: \u03a3 F_x = F_C \\cos (\u03a6) = R_{A,x}",
        "sum of the y forces: \u03a3 F_y = 0 = R_{A,y} - F_C \\sin (\u03a6) + R_E",
        ""
      ],
      middle: [
        "Every member has an equal length of w",
        "",
        "reaction force E: R_E = 0.5*F_C \\sin \u03a6",
        () => {
          return (
            "x component of reaction force A: R_{A,x} = " +
            String(Math.round(force.Value() * Math.cos((angle.Value() / 180) * Math.PI) * 100) / 100) +
            " kN"
          );
        },
        "y component of reaction force A: R_{A,y} = F_C \\sin (\u03a6) - R_E",
        ""
      ],
      bottom: [
        "",
        "",
        () => {
          return "R_E = " + String(Math.round(0.5 * force.Value() * Math.sin((angle.Value() / 180) * Math.PI) * 100) / 100) + " kN";
        },
        "",
        () => {
          return "R_{A,y} = " + String(Math.round(0.5 * force.Value() * Math.sin((angle.Value() / 180) * Math.PI) * 100) / 100) + " kN";
        },
        ""
      ]
    };

    const infoProperties = { fontSize: 14, fixed: true, useMathJax: false };

    this.info.top = b2.create("text", [-6, -6, ""], {
      ...infoProperties,
      visible: () => {
        return [2, 3, 4].includes(this.state);
      }
    });

    this.info.middle = b2.create("text", [-6, -7, ""], {
      ...infoProperties,
      visible: () => {
        return [0, 2, 3, 4].includes(this.state);
      }
    });

    this.info.bottom = b2.create("text", [-6, -8, ""], {
      ...infoProperties,
      visible: () => {
        return [2, 4].includes(this.state);
      }
    });
    this.b2 = b2;
    this.changeState(0);
  },
  methods: {
    changeState(newState) {
      //console.log(newState);
      this.info.top.setText(this.infoText.top[newState]);
      this.info.middle.setText(this.infoText.middle[newState]);
      this.info.bottom.setText(this.infoText.bottom[newState]);

      this.state = newState;
      this.b2.fullUpdate();
      //console.log(this.infoText.bottom[newState]);
    }
  }
};
export const meta = {
  title: "methods of joint demo",
  description: "joint"
};
</script>
