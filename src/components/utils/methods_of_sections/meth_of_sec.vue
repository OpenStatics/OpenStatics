<template>
  <div>
    <div id="box1" class="box1" style="width:700px; height:600px;"></div>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => {
    return {
      state: 0,
      scale: 3,
      a: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      f: 0,
      g: 0,
      bc: 0,
      gc: 0,
      gf: 0,
      Fbc: 0,
      Fgc: 0,
      Fgf: 0,
      T1: 0,
      T2: 0,
      R1: 0,
      triangle: 0,
      triangle_borders: 0,
      roller: 0,
      comb_top: 0,
      comb_bottom: 0,
      line_size_1: 0,
      line_size_2: 0,
      line_size_3: 0,
      line_size_4: 0,
      pointF: 0,
      line_angle: 0,
      line_a_b: 0,
      line_a_g: 0,
      line_b_g: 0,
      line_b_c: 0,
      line_c_d: 0,
      line_c_f: 0,
      line_c_g: 0,
      line_d_e: 0,
      line_d_f: 0,
      line_e_f: 0,
      line_f_g: 0,
      line_b_bc: 0,
      line_g_gc: 0,
      line_g_gf: 0,
      line_Fbc_c: 0,
      line_Fgc_c: 0,
      line_Fgf_f: 0,
      line_a_pointF: 0,
      line_bc_Fbc: 0,
      line_gf_Fgf: 0,
      line_gc_Fgc: 0,
      text_F: 0,
      text_Fbc: 0,
      text_Fgc: 0,
      text_Fgf: 0,
      options_top_text: [
        "If only the forces in several members are desired, method of section gives us a quick and direct way",
        "Suppose forces in the members BC, GD, and GF are desired, so we choose a section passes these members",
        "\u03a3 M_G = 0 = F_{BC}*L_{BG} - F*L_{AG}*sin(\u03b1)",
        "\u03a3 F_C = 0 = F_{GC}*sin(45^o) - F*sin(\u03b1)",
        "\u03a3 M_C = 0 = F*sin(\u03b1)*L_{AF} - F*cos(\u03b1)*L_{CF} + F_{GF}*L_{CF}"
      ],
      label_top: 0,
      label_middle: 0,
      label_bottom: 0,
      options_middle_text: 0,
      options_bottom_text: 0,
      b2: 0,
      force: 0,
      angle: 0,
      input_force: 0,
      input_angle: 0,
      button_force: 0,
      button_angle: 0
    };
  },
  methods: {
    init() {
      const scale = this.scale;
      this.state = 0;
      this.b2 = JXG.JSXGraph.initBoard("box1", { boundingbox: [-15, 10, 15, -15], keepAspectRatio: true, showCopyright: false });
      this.force = this.b2.create(
        "slider",
        [
          [-6, -9],
          [0, -9],
          [1, 1, 2]
        ],
        { name: "Load F" }
      );
      this.angle = this.b2.create(
        "slider",
        [
          [-6, -10],
          [0, -10],
          [19, 90, 198]
        ],
        { name: "Angle(\u03b1)" }
      );

      this.input_force = this.b2.create("input", [5, -9 + 0.05, "", ""], { cssStyle: "width: 50px" });
      this.input_angle = this.b2.create("input", [5, -10, "", ""], { cssStyle: "width: 50px" });
      this.button_force = this.b2.create(
        "button",
        [
          8,
          -9,
          "Update",
          () => {
            if (!isNan(this.input_force.Value())) {
              let val = Number(this.input_force.Value());
              val = Math.min(this.force._smax, val);
              val = Math.max(this.force._smin, val);
              val = Math.round(val * 100) / 100;
              this.force.setValue(val);
            }
          }
        ],
        {}
      );
      this.button_angle = this.b2.create(
        "button",
        [
          8,
          -10,
          "Update",
          () => {
            if (Number(this.input_angle.Value())) {
              let val = Number(this.input_angle.Value());
              val = Math.min(this.angle._smax, val);
              val = Math.max(this.angle._smin, val);
              val = Math.round(val * 100) / 100;
              this.angle.setValue(val);
            }
          }
        ],
        {}
      );

      const pointFill = "red";
      const pointStroke = "red";
      const pointLabel = "black";
      const offsetFactor = 11;

      // create points
      const genericPointProperties = { fixed: true, fillColor: pointFill, strokeColor: pointStroke, visible: true };
      const genericPointLabelProperties = { strokeColor: pointLabel };
      const overviewProperties = {
        visible: () => {
          return this.state == 0;
        }
      };
      const nonOverviewProperties = {
        visible: () => {
          return this.state != 0;
        }
      };

      this.a = this.b2.create("point", [-3 * scale, 0], {
        ...genericPointProperties,
        name: "A",
        label: { ...genericPointLabelProperties, offset: [-offsetFactor, -offsetFactor] }
      });
      this.b = this.b2.create("point", [-1 * scale, 2 * scale], {
        ...genericPointProperties,
        name: "B",
        label: { ...genericPointLabelProperties, offset: [offsetFactor, offsetFactor] }
      });
      this.c = this.b2.create("point", [1 * scale, 2 * scale], {
        ...genericPointProperties,
        name: "C",
        label: { ...genericPointLabelProperties, offset: [offsetFactor, offsetFactor] }
      });
      this.d = this.b2.create("point", [3 * scale, 2 * scale], {
        ...genericPointProperties,
        name: "D",
        visible: () => {
          return this.state == 0;
        },
        label: { ...genericPointLabelProperties, offset: [(-offsetFactor * 3) / 2, offsetFactor] }
      });
      this.e = this.b2.create("point", [3 * scale, 0], {
        ...genericPointProperties,
        name: "E",
        visible: () => {
          return this.state == 0;
        },
        label: { ...genericPointLabelProperties, offset: [(-offsetFactor * 3) / 2, -offsetFactor] }
      });
      this.f = this.b2.create("point", [1 * scale, 0], {
        ...genericPointProperties,
        name: "F",
        label: { ...genericPointLabelProperties, offset: [offsetFactor, -offsetFactor] }
      });
      this.g = this.b2.create("point", [-1 * scale, 0], {
        ...genericPointProperties,
        name: "G",
        label: { ...genericPointLabelProperties, offset: [offsetFactor, -offsetFactor] }
      });

      const hiddenPointProperties = { fixed: true, visible: false };

      this.bc = this.b2.create("point", [0, 2 * scale], { name: "bc", ...hiddenPointProperties });
      this.gc = this.b2.create("point", [0, 1 * scale], { name: "gc", ...hiddenPointProperties });
      this.gf = this.b2.create("point", [0, 0], { name: "gf", ...hiddenPointProperties });

      this.Fbc = this.b2.create("point", [0.5 * scale, 2 * scale], { name: "Fbc", ...hiddenPointProperties });
      this.Fgc = this.b2.create("point", [0.5 * scale, 1.5 * scale], { name: "Fgc", ...hiddenPointProperties });
      this.Fgf = this.b2.create("point", [0.5 * scale, 0], { name: "Fgf", ...hiddenPointProperties });

      this.pointF = this.b2.create(
        "point",
        [
          () => {
            return -1 * scale * this.force.Value() * Math.cos((this.angle.Value() / 180) * Math.PI) - 3 * scale;
          },
          () => {
            return -1 * scale * this.force.Value() * Math.sin((this.angle.Value() / 180) * Math.PI);
          }
        ],
        { ...hiddenPointProperties }
      );

      const triangleScale = 1;

      this.T1 = this.b2.create("point", [3 * scale + triangleScale, 2 * scale + triangleScale], { ...hiddenPointProperties });
      this.T2 = this.b2.create("point", [3 * scale + triangleScale, 2 * scale - triangleScale], { ...hiddenPointProperties });
      this.R1 = this.b2.create("point", [3 * scale + 0.5 * triangleScale, 0], { ...hiddenPointProperties });

      this.triangle = this.b2.create("polygon", [this.d, this.T1, this.T2], {
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
      this.roller = this.b2.create("circle", [this.R1, 0.5 * triangleScale], {
        fillColor: "green",
        strokeColor: "grey",
        visible: () => {
          return this.state == 0;
        },
        fixed: true
      });

      const sizeCoords = [
        [
          [-3 * scale + 0.05, -0.5 * scale],
          [-1 * scale - 0.05, -0.5 * scale],
          [18 * scale, -4 * scale]
        ],
        [
          [-1 * scale + 0.05, -0.5 * scale],
          [1 * scale - 0.05, -0.5 * scale],
          [18 * scale, -4 * scale]
        ],
        [
          [1 * scale + 0.05, -0.5 * scale],
          [3 * scale - 0.05, -0.5 * scale],
          [18 * scale, -4 * scale]
        ],
        [
          [3 * scale + 2.5 * triangleScale, 2 * scale - 0.05],
          [3 * scale + 2.5 * triangleScale, 0 + 0.05],
          [4 * scale, -20 * scale]
        ]
      ];

      for (const coords of sizeCoords) {
        this.b2.create(
          "line",
          [this.b2.create("point", coords[0], { ...hiddenPointProperties }), this.b2.create("point", coords[1], { ...hiddenPointProperties })],
          {
            straightFirst: false,
            straightLast: false,
            visible: () => {
              return this.state == 0;
            },
            lastArrow: true,
            firstArrow: true,
            strokeWidth: 3,
            name: "2 m",
            withLabel: true,
            label: { offset: coords[2] }
          }
        );
      }

      const divideCoords = [
        [
          [-3 * scale, -0.25 * scale],
          [-3 * scale, -0.75 * scale]
        ],
        [
          [-1 * scale, -0.25 * scale],
          [-1 * scale, -0.75 * scale]
        ],
        [
          [1 * scale, -0.25 * scale],
          [1 * scale, -0.75 * scale]
        ],
        [
          [3 * scale, -0.25 * scale],
          [3 * scale, -0.75 * scale]
        ],
        [
          [3 * scale + 2.5 * triangleScale - 0.25 * scale, 2 * scale],
          [3 * scale + 2.5 * triangleScale + 0.25 * scale, 2 * scale]
        ],
        [
          [3 * scale + 2.5 * triangleScale - 0.25 * scale, 0],
          [3 * scale + 2.5 * triangleScale + 0.25 * scale, 0]
        ]
      ];

      for (const coordSet of divideCoords) {
        this.b2.create(
          "line",
          [this.b2.create("point", coordSet[0], { ...hiddenPointProperties }), this.b2.create("point", coordSet[1], { ...hiddenPointProperties })],
          {
            straightFirst: false,
            straightLast: false,
            visible: () => {
              return this.state == 0;
            },
            lastArrow: false,
            firstArrow: false
          }
        );
      }

      // connect points
      const genLineProperties = { straightFirst: false, straightLast: false, strokeWidth: 10 };
      const nonOverviewLineProperties = { ...genLineProperties, ...nonOverviewProperties };

      for (const points of [
        [this.a, this.b],
        [this.a, this.g],
        [this.b, this.g]
      ]) {
        this.b2.create("line", points, { ...genLineProperties, visible: true });
      }

      for (const points of [
        [this.b, this.c],
        [this.c, this.d],
        [this.c, this.f],
        [this.c, this.g],
        [this.d, this.e],
        [this.d, this.f],
        [this.e, this.f],
        [this.f, this.g]
      ]) {
        this.b2.create("line", points, { ...genLineProperties, ...overviewProperties });
      }

      this.line_b_bc = this.b2.create("line", [this.b, this.bc], nonOverviewLineProperties);
      this.line_g_gc = this.b2.create("line", [this.g, this.gc], nonOverviewLineProperties);
      this.line_g_gf = this.b2.create("line", [this.g, this.gf], nonOverviewLineProperties);

      const dottedProperties = { strokeWidth: 2, dash: 2 };
      this.line_Fbc_c = this.b2.create("line", [this.Fbc, this.c], { ...nonOverviewLineProperties, ...dottedProperties });
      this.line_Fgc_c = this.b2.create("line", [this.Fgc, this.c], { ...nonOverviewLineProperties, ...dottedProperties });
      this.line_Fgf_f = this.b2.create("line", [this.Fgf, this.f], { ...nonOverviewLineProperties, ...dottedProperties });

      // create force vectors
      const forceVectorProperties = { straightFirst: false, straightLast: false, touchFirstPoint: true, lastArrow: true, strokeWidth: 4 };
      const redOnState = s => {
        return () => {
          if (this.state == s) return "red";
          else return "blue";
        };
      };
      this.line_a_pointF = this.b2.create("line", [this.a, this.pointF], { ...forceVectorProperties });
      this.line_bc_Fbc = this.b2.create("line", [this.bc, this.Fbc], {
        ...forceVectorProperties,
        strokeColor: redOnState(2),
        ...nonOverviewProperties
      });
      this.line_gf_Fgf = this.b2.create("line", [this.gf, this.Fgf], {
        ...forceVectorProperties,
        strokeColor: redOnState(4),
        ...nonOverviewProperties
      });
      this.line_gc_Fgc = this.b2.create("line", [this.gc, this.Fgc], {
        ...forceVectorProperties,
        strokeColor: redOnState(3),
        ...nonOverviewProperties
      });

      // create text on force vectors
      this.text_F = this.b2.create(
        "text",
        [
          0,
          -0.5,
          () => {
            return "F = " + Math.round(this.force.Value() * 100) / 100 + "N";
          }
        ],
        { anchor: this.pointF, visible: true }
      );

      this.text_Fbc = this.b2.create("text", [0, 1, "F_{BC}"], { anchor: this.Fbc, ...nonOverviewProperties });
      this.text_Fgc = this.b2.create("text", [0, -0.5, "F_{GC}"], { anchor: this.Fgc, ...nonOverviewProperties });
      this.text_Fgf = this.b2.create("text", [0, -0.5, "F_{GF}"], { anchor: this.Fgf, ...nonOverviewProperties });

      this.options_middle_text = [
        "",
        "",
        this.val_computed(this.force, this.angle, "BC"),
        this.val_computed(this.force, this.angle, "GC"),
        this.val_computed(this.force, this.angle, "GF")
      ];

      this.options_bottom_text = [
        "",
        "",
        this.tension_computed(this.force, this.angle, "BC"),
        this.tension_computed(this.force, this.angle, "GC"),
        this.tension_computed(this.force, this.angle, "GF")
      ];

      this.label_top = this.b2.create(
        "text",
        [
          () => {
            if (this.state <= 1) return -12;
            else return -6;
          },
          -6,
          ""
        ],
        { fontSize: 14 }
      );

      this.label_middle = this.b2.create("text", [-6, -7, ""], {
        fontSize: 14,
        visible: () => {
          return this.state >= 2;
        }
      });

      this.label_bottom = this.b2.create("text", [-6, -8, ""], {
        fontSize: 14,
        visible: () => {
          return this.state >= 2;
        }
      });

      this.point_angle = this.b2.create("point", [-4 * scale, 0], { ...hiddenPointProperties });

      this.line_angle = this.b2.create("line", [this.a, this.point_angle], {
        straightFirst: false,
        straightLast: false,
        visible: true,
        strokeWidth: 2,
        dash: 2,
        strokeColor: "grey"
      });

      this.angleF = this.b2.create("angle", [this.point_angle, this.a, this.pointF], {
        orthoType: "sector",
        radius: this.scale * 0.5,
        name: "\u03b1"
      });

      this.point_comb_top_1 = this.b2.create("point", [3 * scale + triangleScale, 2 * scale + triangleScale], { ...hiddenPointProperties });
      this.point_comb_top_2 = this.b2.create("point", [3 * scale + triangleScale, 2 * scale - triangleScale * 1.19], { ...hiddenPointProperties });
      this.comb_top = this.b2.create("comb", [this.point_comb_top_1, this.point_comb_top_2], { curve: { strokeWidth: 1, strokeColor: "green" } });

      this.point_comb_bottom_1 = this.b2.create("point", [3 * scale + triangleScale, triangleScale], { visible: false });
      this.point_comb_bottom_2 = this.b2.create("point", [3 * scale + triangleScale, -triangleScale * 1.19], { visible: false });
      this.comb_bottom_line = this.b2.create("line", [this.point_comb_bottom_1, this.point_comb_bottom_2], {
        straightFirst: false,
        straightLast: false,
        strokeColor: "green",
        strokeWidth: 2,
        ...overviewProperties
      });
      this.comb_bottom = this.b2.create("comb", [this.point_comb_bottom_1, this.point_comb_bottom_2], {
        curve: { strokeWidth: 1, strokeColor: "green" }
      });

      this.b2.fullUpdate();
    },
    change_state(state) {
      this.state = state;

      let val = this.state == 0;
      this.comb_bottom.setAttribute({ visible: val });
      this.comb_top.setAttribute({ visible: val });

      this.label_top.setText(this.options_top_text[state]);
      this.label_middle.setText(this.options_middle_text[state]);
      this.label_bottom.setText(this.options_bottom_text[state]);

      this.b2.fullUpdate();
    },
    val_computed: (force, angle, type) => {
      if (type == "GF")
        return () => {
          let radians = (angle.Value() * Math.PI) / 180;
          let val = 4 * force.Value() * Math.sin(radians) - 2 * force.Value() * Math.cos(radians);
          val /= -2;
          return "F_{GF} = " + Math.round(val * 100) / 100 + " N";
        };
      if (type == "GC")
        return () => {
          let radians = (angle.Value() * Math.PI) / 180;
          let val = (force.Value() / Math.sin(Math.PI / 4)) * Math.sin(radians);
          return "F_{GC} = " + Math.round(val * 100) / 100 + " N";
        };
      if (type == "BC")
        return () => {
          let radians = (angle.Value() * Math.PI) / 180;
          let val = force.Value() * Math.sin(radians);
          return "F_{BC} = " + Math.round(val * 100) / 100 + " N";
        };
      return "Error: val_computed did not receive valid type";
    },
    tension_computed: (force, angle, type) => {
      if (type == "GF")
        return () => {
          let radians = (angle.Value() * Math.PI) / 180;
          let val = 4 * force.Value() * Math.sin(radians) - 2 * force.Value() * Math.cos(radians);
          val /= -2;
          if (val >= 0) return "Member GF is in tension";
          else return "Member GF is in compression";
        };
      if (type == "GC")
        return () => {
          let radians = (angle.Value() * Math.PI) / 180;
          let val = (force.Value() / Math.sin(Math.PI / 4)) * Math.sin(radians);
          if (val >= 0) return "Member GC is in tension";
          else return "Member GC is in compression";
        };
      if (type == "BC")
        return () => {
          let radians = (angle.Value() * Math.PI) / 180;
          let val = force.Value() * Math.sin(radians);
          if (val >= 0) return "Member BC is in tension";
          else return "Member BC is in compression";
        };
      return "Error: tension_computed did not receive valid type";
    }
  },
  mounted() {
    this.init();
    this.change_state(0);
  }
};
export const meta = {
  title: "methods of sections",
  description: "In Progress - WATKINS"
};
</script>
