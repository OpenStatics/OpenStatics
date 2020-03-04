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
      line_divide_1: 0,
      line_divide_2: 0,
      line_divide_3: 0,
      line_divide_4: 0,
      line_divide_5: 0,
      line_divide_6: 0,
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

      this.b2 = JXG.JSXGraph.initBoard("box1", { boundingbox: [-15, 10, 15, -15], keepAspectRatio: true, showCopyright: false });
      this.force = this.b2.create("slider", [[-6, -9], [0, -9], [1, 1, 2]], { name: "Load F" });
      this.angle = this.b2.create("slider", [[-6, -10], [0, -10], [19, 90, 198]], { name: "Angle(\u03b1)" });

      this.input_force = this.b2.create("input", [5, -9 + 0.05, "", ""], { cssStyle: "width: 50px" });
      this.input_angle = this.b2.create("input", [5, -10, "", ""], { cssStyle: "width: 50px" });
      this.button_force = this.b2.create(
        "button",
        [
          8,
          -9,
          "Update",
          () => {
            if (Number(this.input_force.Value())) {
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
      //var input = board.create('input', [0, 1, 'sin(x)*x', 'f(x)='], {cssStyle: 'width: 100px'});

      const pointFill = "red";
      const pointStroke = "red";
      const pointLabel = "black";
      const offsetFactor = 11;

      // create points
      this.a = this.b2.create("point", [-3 * scale, 0], {
        name: "A",
        fixed: true,
        visible: true,
        fillColor: pointFill,
        strokeColor: pointStroke,
        label: { strokeColor: pointLabel, offset: [-offsetFactor, -offsetFactor] }
      });
      this.b = this.b2.create("point", [-1 * scale, 2 * scale], {
        name: "B",
        fixed: true,
        fillColor: pointFill,
        strokeColor: pointStroke,
        label: { strokeColor: pointLabel, offset: [offsetFactor, offsetFactor] }
      });
      this.c = this.b2.create("point", [1 * scale, 2 * scale], {
        name: "C",
        fixed: true,
        visible: true,
        fillColor: pointFill,
        strokeColor: pointStroke,
        label: { strokeColor: pointLabel, offset: [offsetFactor, offsetFactor] }
      });
      this.d = this.b2.create("point", [3 * scale, 2 * scale], {
        name: "D",
        fixed: true,
        visible: true,
        fillColor: pointFill,
        strokeColor: pointStroke,
        label: { strokeColor: pointLabel, offset: [(-offsetFactor * 3) / 2, offsetFactor] }
      });
      this.e = this.b2.create("point", [3 * scale, 0], {
        name: "E",
        fixed: true,
        visible: true,
        fillColor: pointFill,
        strokeColor: pointStroke,
        label: { strokeColor: pointLabel, offset: [(-offsetFactor * 3) / 2, -offsetFactor] }
      });
      this.f = this.b2.create("point", [1 * scale, 0], {
        name: "F",
        fixed: true,
        visible: true,
        fillColor: pointFill,
        strokeColor: pointStroke,
        label: { strokeColor: pointLabel, offset: [offsetFactor, -offsetFactor] }
      });
      this.g = this.b2.create("point", [-1 * scale, 0], {
        name: "G",
        fixed: true,
        fillColor: pointFill,
        strokeColor: pointStroke,
        label: { strokeColor: pointLabel, offset: [offsetFactor, -offsetFactor] }
      });

      this.bc = this.b2.create("point", [0, 2 * scale], { name: "bc", fixed: true, visible: false });
      this.gc = this.b2.create("point", [0, 1 * scale], { name: "gc", fixed: true, visible: false });
      this.gf = this.b2.create("point", [0, 0], { name: "gf", fixed: true, visible: false });

      this.Fbc = this.b2.create("point", [0.5 * scale, 2 * scale], { name: "Fbc", fixed: true, visible: false });
      this.Fgc = this.b2.create("point", [0.5 * scale, 1.5 * scale], { name: "Fgc", fixed: true, visible: false });
      this.Fgf = this.b2.create("point", [0.5 * scale, 0], { name: "Fgf", fixed: true, visible: false });

      this.pointF = this.b2.create("point", [this.f_point(this.force, this.angle, scale, "x"), this.f_point(this.force, this.angle, scale, "y")], {
        visible: false
      });

      const triangleScale = 1;

      this.T1 = this.b2.create("point", [3 * scale + triangleScale, 2 * scale + triangleScale], { visible: false });
      this.T2 = this.b2.create("point", [3 * scale + triangleScale, 2 * scale - triangleScale], { visible: false });
      this.R1 = this.b2.create("point", [3 * scale + 0.5 * triangleScale, 0], { visible: false });

      this.triangle = this.b2.create("polygon", [this.d, this.T1, this.T2], {
        visible: true,
        fillColor: "green",
        borders: {
          strokeColor: "green",
          strokeWidth: 2
        }
      });
      this.roller = this.b2.create("circle", [this.R1, 0.5 * triangleScale], { fillColor: "green", strokeColor: "grey" });

      this.moveRight = this.b2.create(
        "transform",
        [
          function() {
            return 2 * scale;
          },
          "MR"
        ],
        { type: "translate" }
      );

      this.line_size_1 = this.b2.create(
        "line",
        [
          this.b2.create("point", [-3 * scale + 0.05, -0.5 * scale], { visible: false }),
          this.b2.create("point", [-1 * scale - 0.05, -0.5 * scale], { visible: false })
        ],
        {
          straightFirst: false,
          straightLast: false,
          visible: true,
          lastArrow: true,
          firstArrow: true,
          strokeWidth: 3,
          name: "2 m",
          withLabel: true,
          label: { offset: [18 * scale, -4 * scale] }
        }
      );
      this.line_size_2 = this.b2.create(
        "line",
        [
          this.b2.create("point", [-1 * scale + 0.05, -0.5 * scale], { visible: false }),
          this.b2.create("point", [1 * scale - 0.05, -0.5 * scale], { visible: false })
        ],
        {
          straightFirst: false,
          straightLast: false,
          visible: true,
          lastArrow: true,
          firstArrow: true,
          strokeWidth: 3,
          name: "2 m",
          withLabel: true,
          label: { offset: [18 * scale, -4 * scale] }
        }
      );
      this.line_size_3 = this.b2.create(
        "line",
        [
          this.b2.create("point", [1 * scale + 0.05, -0.5 * scale], { visible: false }),
          this.b2.create("point", [3 * scale - 0.05, -0.5 * scale], { visible: false })
        ],
        {
          straightFirst: false,
          straightLast: false,
          visible: true,
          lastArrow: true,
          firstArrow: true,
          strokeWidth: 3,
          name: "2 m",
          withLabel: true,
          label: { offset: [18 * scale, -4 * scale] }
        }
      );
      this.line_size_4 = this.b2.create(
        "line",
        [
          this.b2.create("point", [3 * scale + 2.5 * triangleScale, 2 * scale - 0.05], { visible: false }),
          this.b2.create("point", [3 * scale + 2.5 * triangleScale, 0 + 0.05], { visible: false })
        ],
        {
          straightFirst: false,
          straightLast: false,
          visible: true,
          lastArrow: true,
          firstArrow: true,
          strokeWidth: 3,
          name: "2 m",
          withLabel: true,
          label: { offset: [4 * scale, -20 * scale] }
        }
      );

      this.line_divide_1 = this.b2.create(
        "line",
        [
          this.b2.create("point", [-3 * scale, -0.25 * scale], { visible: false }),
          this.b2.create("point", [-3 * scale, -0.75 * scale], { visible: false })
        ],
        {
          straightFirst: false,
          straightLast: false,
          visible: true,
          lastArrow: false,
          firstArrow: false
        }
      );
      this.line_divide_2 = this.b2.create(
        "line",
        [
          this.b2.create("point", [-1 * scale, -0.25 * scale], { visible: false }),
          this.b2.create("point", [-1 * scale, -0.75 * scale], { visible: false })
        ],
        {
          straightFirst: false,
          straightLast: false,
          visible: true,
          lastArrow: false,
          firstArrow: false
        }
      );
      this.line_divide_3 = this.b2.create(
        "line",
        [
          this.b2.create("point", [1 * scale, -0.25 * scale], { visible: false }),
          this.b2.create("point", [1 * scale, -0.75 * scale], { visible: false })
        ],
        {
          straightFirst: false,
          straightLast: false,
          visible: true,
          lastArrow: false,
          firstArrow: false
        }
      );
      this.line_divide_4 = this.b2.create(
        "line",
        [
          this.b2.create("point", [3 * scale, -0.25 * scale], { visible: false }),
          this.b2.create("point", [3 * scale, -0.75 * scale], { visible: false })
        ],
        {
          straightFirst: false,
          straightLast: false,
          visible: true,
          lastArrow: false,
          firstArrow: false
        }
      );
      this.line_divide_5 = this.b2.create(
        "line",
        [
          this.b2.create("point", [3 * scale + 2.5 * triangleScale - 0.25 * scale, 2 * scale], { visible: false }),
          this.b2.create("point", [3 * scale + 2.5 * triangleScale + 0.25 * scale, 2 * scale], { visible: false })
        ],
        {
          straightFirst: false,
          straightLast: false,
          visible: true,
          lastArrow: false,
          firstArrow: false
        }
      );
      this.line_divide_6 = this.b2.create(
        "line",
        [
          this.b2.create("point", [3 * scale + 2.5 * triangleScale - 0.25 * scale, 0], { visible: false }),
          this.b2.create("point", [3 * scale + 2.5 * triangleScale + 0.25 * scale, 0], { visible: false })
        ],
        {
          straightFirst: false,
          straightLast: false,
          visible: true,
          lastArrow: false,
          firstArrow: false
        }
      );

      // connect points
      this.line_a_b = this.b2.create("line", [this.a, this.b], {
        straightFirst: false,
        straightLast: false,
        visible: true,
        strokeWidth: 10
      });
      this.line_a_g = this.b2.create("line", [this.a, this.g], { straightFirst: false, straightLast: false, visible: true, strokeWidth: 10 });
      this.line_b_g = this.b2.create("line", [this.b, this.g], { straightFirst: false, straightLast: false, visible: true, strokeWidth: 10 });
      this.line_b_c = this.b2.create("line", [this.b, this.c], { straightFirst: false, straightLast: false, visible: true, strokeWidth: 10 });
      this.line_c_d = this.b2.create("line", [this.c, this.d], { straightFirst: false, straightLast: false, visible: true, strokeWidth: 10 });
      this.line_c_f = this.b2.create("line", [this.c, this.f], { straightFirst: false, straightLast: false, visible: true, strokeWidth: 10 });
      this.line_c_g = this.b2.create("line", [this.c, this.g], { straightFirst: false, straightLast: false, visible: true, strokeWidth: 10 });
      this.line_d_e = this.b2.create("line", [this.d, this.e], { straightFirst: false, straightLast: false, visible: true, strokeWidth: 10 });
      this.line_d_f = this.b2.create("line", [this.d, this.f], { straightFirst: false, straightLast: false, visible: true, strokeWidth: 10 });
      this.line_e_f = this.b2.create("line", [this.e, this.f], { straightFirst: false, straightLast: false, visible: true, strokeWidth: 10 });
      this.line_f_g = this.b2.create("line", [this.f, this.g], { straightFirst: false, straightLast: false, visible: true, strokeWidth: 10 });

      this.line_b_bc = this.b2.create("line", [this.b, this.bc], { straightFirst: false, straightLast: false, visible: true, strokeWidth: 10 });
      this.line_g_gc = this.b2.create("line", [this.g, this.gc], { straightFirst: false, straightLast: false, visible: true, strokeWidth: 10 });
      this.line_g_gf = this.b2.create("line", [this.g, this.gf], { straightFirst: false, straightLast: false, visible: true, strokeWidth: 10 });

      this.line_Fbc_c = this.b2.create("line", [this.Fbc, this.c], {
        straightFirst: false,
        straightLast: false,
        visible: true,
        strokeWidth: 2,
        dash: 2
      });
      this.line_Fgc_c = this.b2.create("line", [this.Fgc, this.c], {
        straightFirst: false,
        straightLast: false,
        visible: true,
        strokeWidth: 2,
        dash: 2
      });
      this.line_Fgf_f = this.b2.create("line", [this.Fgf, this.f], {
        straightFirst: false,
        straightLast: false,
        visible: true,
        strokeWidth: 2,
        dash: 2
      });

      // create force vectors
      this.line_a_pointF = this.b2.create("line", [this.a, this.pointF], {
        straightFirst: false,
        straightLast: false,
        touchFirstPoint: true,
        lastArrow: true,
        strokeWidth: 4
      });
      this.line_bc_Fbc = this.b2.create("line", [this.bc, this.Fbc], {
        straightFirst: false,
        straightLast: false,
        touchFirstPoint: true,
        lastArrow: true,
        strokeWidth: 4
      });
      this.line_gf_Fgf = this.b2.create("line", [this.gf, this.Fgf], {
        straightFirst: false,
        straightLast: false,
        touchFirstPoint: true,
        lastArrow: true,
        strokeWidth: 4
      });
      this.line_gc_Fgc = this.b2.create("line", [this.gc, this.Fgc], {
        straightFirst: false,
        straightLast: false,
        touchFirstPoint: true,
        lastArrow: true,
        strokeWidth: 4
      });

      const f_text_func = function(force) {
        return function() {
          return "F = " + Math.round(force.Value() * 100) / 100 + "N";
        };
      };
      // create text on force vectors
      this.text_F = this.b2.create("text", [0, -0.5, f_text_func(this.force)], { anchor: this.pointF, visible: true });
      this.text_Fbc = this.b2.create(
        "text",
        [
          0,
          0.5,
          function() {
            return "F_{BC}";
          }
        ],
        { anchor: this.Fbc, visible: true }
      );
      this.text_Fgc = this.b2.create(
        "text",
        [
          0,
          -0.5,
          function() {
            return "F_{GC}";
          }
        ],
        { anchor: this.Fgc, visible: true }
      );
      this.text_Fgf = this.b2.create(
        "text",
        [
          0,
          -0.5,
          function() {
            return "F_{GF}";
          }
        ],
        { anchor: this.Fgf, visible: true }
      );

      this.label_top = this.b2.create(
        "text",
        [-6, -6, "Suppose forces in the members BC, GD, and GF are desired, so we choose a section passes these members"],
        { fontSize: 14 }
      );

      this.label_middle = this.b2.create(
        "text",
        [
          -6,
          -7,
          () => {
            return "";
          }
        ],
        { fontSize: 14 }
      );

      this.label_bottom = this.b2.create(
        "text",
        [
          -6,
          -8,
          () => {
            return "";
          }
        ],
        { fontSize: 14 }
      );

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

      this.point_angle = this.b2.create("point", [-4 * scale, 0], {
        name: "point_angle",
        fixed: true,
        visible: false
      });

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

      this.point_comb_top_1 = this.b2.create("point", [3 * scale + triangleScale, 2 * scale + triangleScale], { visible: false });
      this.point_comb_top_2 = this.b2.create("point", [3 * scale + triangleScale, 2 * scale - triangleScale * 1.19], { visible: false });
      this.comb_top = this.b2.create("comb", [this.point_comb_top_1, this.point_comb_top_2], { curve: { strokeWidth: 1, strokeColor: "green" } });

      this.point_comb_bottom_1 = this.b2.create("point", [3 * scale + triangleScale, triangleScale], { visible: false });
      this.point_comb_bottom_2 = this.b2.create("point", [3 * scale + triangleScale, -triangleScale * 1.19], { visible: false });
      this.comb_bottom_line = this.b2.create("line", [this.point_comb_bottom_1, this.point_comb_bottom_2], {
        straightFirst: false,
        straightLast: false,
        visible: true,
        strokeColor: "green",
        strokeWidth: 2
      });
      this.comb_bottom = this.b2.create("comb", [this.point_comb_bottom_1, this.point_comb_bottom_2], {
        curve: { strokeWidth: 1, strokeColor: "green" }
      });

      this.b2.fullUpdate();
    },
    change_state(state) {
      let state_0 = {
        visible: [
          this.d,
          this.e,
          this.line_b_c,
          this.line_c_d,
          this.line_c_f,
          this.line_c_g,
          this.line_d_e,
          this.line_d_f,
          this.line_e_f,
          this.line_f_g,
          this.roller,
          this.triangle,
          this.comb_bottom,
          this.comb_bottom_line,
          this.comb_top,
          this.line_size_1,
          this.line_size_2,
          this.line_size_3,
          this.line_size_4,
          this.line_divide_1,
          this.line_divide_2,
          this.line_divide_3,
          this.line_divide_4,
          this.line_divide_5,
          this.line_divide_6
        ],
        invisible: [
          this.line_b_bc,
          this.line_g_gc,
          this.line_g_gf,
          this.line_Fbc_c,
          this.line_Fgc_c,
          this.line_Fgf_f,
          this.line_bc_Fbc,
          this.line_gf_Fgf,
          this.line_gc_Fgc,
          this.text_Fbc,
          this.text_Fgc,
          this.text_Fgf,
          this.label_middle,
          this.label_bottom
        ],
        aspects: [
          [this.line_bc_Fbc, { strokeColor: "blue" }],
          [this.line_gc_Fgc, { strokeColor: "blue" }],

          [this.line_gf_Fgf, { strokeColor: "blue" }]
        ]
      };
      let state_1 = {
        visible: [
          this.line_b_bc,
          this.line_g_gc,
          this.line_g_gf,
          this.line_Fbc_c,
          this.line_Fgc_c,
          this.line_Fgf_f,
          this.line_bc_Fbc,
          this.line_gf_Fgf,
          this.line_gc_Fgc,
          this.text_Fbc,
          this.text_Fgc,
          this.text_Fgf
        ],
        invisible: [
          this.d,
          this.e,
          this.line_b_c,
          this.line_c_d,
          this.line_c_f,
          this.line_c_g,
          this.line_d_e,
          this.line_d_f,
          this.line_e_f,
          this.line_f_g,
          this.label_middle,
          this.label_bottom,
          this.roller,
          this.triangle,
          this.comb_bottom,
          this.comb_bottom_line,
          this.comb_top,
          this.line_size_1,
          this.line_size_2,
          this.line_size_3,
          this.line_size_4,
          this.line_divide_1,
          this.line_divide_2,
          this.line_divide_3,
          this.line_divide_4,
          this.line_divide_5,
          this.line_divide_6
        ],
        aspects: [
          [this.line_bc_Fbc, { strokeColor: "blue" }],
          [this.line_gc_Fgc, { strokeColor: "blue" }],
          [this.line_gf_Fgf, { strokeColor: "blue" }],
          [this.triangle, { borders: { strokeColor: "orange" } }]
        ]
      };

      let state_2 = {
        visible: [
          this.line_b_bc,
          this.line_g_gc,
          this.line_g_gf,
          this.line_Fbc_c,
          this.line_Fgc_c,
          this.line_Fgf_f,
          this.line_bc_Fbc,
          this.line_gf_Fgf,
          this.line_gc_Fgc,
          this.text_Fbc,
          this.text_Fgc,
          this.text_Fgf,
          this.label_middle,
          this.label_bottom
        ],
        invisible: [
          this.d,
          this.e,
          this.line_b_c,
          this.line_c_d,
          this.line_c_f,
          this.line_c_g,
          this.line_d_e,
          this.line_d_f,
          this.line_e_f,
          this.line_f_g,
          this.roller,
          this.triangle,
          this.comb_bottom,
          this.comb_bottom_line,
          this.comb_top,
          this.line_size_1,
          this.line_size_2,
          this.line_size_3,
          this.line_size_4,
          this.line_divide_1,
          this.line_divide_2,
          this.line_divide_3,
          this.line_divide_4,
          this.line_divide_5,
          this.line_divide_6
        ],
        aspects: [
          [this.line_bc_Fbc, { strokeColor: "red" }],
          [this.line_gc_Fgc, { strokeColor: "blue" }],
          [this.line_gf_Fgf, { strokeColor: "blue" }]
        ]
      };

      let state_3 = {
        visible: [
          this.line_b_bc,
          this.line_g_gc,
          this.line_g_gf,
          this.line_Fbc_c,
          this.line_Fgc_c,
          this.line_Fgf_f,
          this.line_bc_Fbc,
          this.line_gf_Fgf,
          this.line_gc_Fgc,
          this.text_Fbc,
          this.text_Fgc,
          this.text_Fgf,
          this.label_middle,
          this.label_bottom
        ],
        invisible: [
          this.d,
          this.e,
          this.line_b_c,
          this.line_c_d,
          this.line_c_f,
          this.line_c_g,
          this.line_d_e,
          this.line_d_f,
          this.line_e_f,
          this.line_f_g,
          this.roller,
          this.triangle,
          this.comb_bottom,
          this.comb_bottom_line,
          this.comb_top,
          this.line_size_1,
          this.line_size_2,
          this.line_size_3,
          this.line_size_4,
          this.line_divide_1,
          this.line_divide_2,
          this.line_divide_3,
          this.line_divide_4,
          this.line_divide_5,
          this.line_divide_6
        ],
        aspects: [
          [this.line_bc_Fbc, { strokeColor: "blue" }],
          [this.line_gc_Fgc, { strokeColor: "red" }],
          [this.line_gf_Fgf, { strokeColor: "blue" }]
        ]
      };

      let state_4 = {
        visible: [
          this.line_b_bc,
          this.line_g_gc,
          this.line_g_gf,
          this.line_Fbc_c,
          this.line_Fgc_c,
          this.line_Fgf_f,
          this.line_bc_Fbc,
          this.line_gf_Fgf,
          this.line_gc_Fgc,
          this.text_Fbc,
          this.text_Fgc,
          this.text_Fgf,
          this.label_middle,
          this.label_bottom
        ],
        invisible: [
          this.d,
          this.e,
          this.line_b_c,
          this.line_c_d,
          this.line_c_f,
          this.line_c_g,
          this.line_d_e,
          this.line_d_f,
          this.line_e_f,
          this.line_f_g,
          this.roller,
          this.triangle,
          this.comb_bottom,
          this.comb_bottom_line,
          this.comb_top,
          this.line_size_1,
          this.line_size_2,
          this.line_size_3,
          this.line_size_4,
          this.line_divide_1,
          this.line_divide_2,
          this.line_divide_3,
          this.line_divide_4,
          this.line_divide_5,
          this.line_divide_6
        ],
        aspects: [
          [this.line_bc_Fbc, { strokeColor: "blue" }],
          [this.line_gc_Fgc, { strokeColor: "blue" }],
          [this.line_gf_Fgf, { strokeColor: "red" }]
        ]
      };

      const what_to_do = [state_0, state_1, state_2, state_3, state_4];

      for (let i = 0; i < what_to_do[state].visible.length; i++) {
        //console.log(i);
        //console.log(what_to_do[state].visible[i]);
        what_to_do[state].visible[i].setAttribute({
          visible: true
        });
      }

      if (state == 0) this.triangle.showElement();
      else this.triangle.hideElement();

      for (let i = 0; i < what_to_do[state].invisible.length; i++) {
        what_to_do[state].invisible[i].setAttribute({
          visible: false
        });
      }

      for (let i = 0; i < what_to_do[state].aspects.length; i++) {
        what_to_do[state].aspects[i][0].setAttribute(what_to_do[state].aspects[i][1]);
      }

      this.label_top.setText(this.options_top_text[state]);
      this.label_middle.setText(this.options_middle_text[state]);
      this.label_bottom.setText(this.options_bottom_text[state]);
      //console.log(this.label_top);

      this.b2.fullUpdate();
    },
    f_point: (force, angle, scale, piece) => {
      if (piece == "x")
        return function() {
          const x = Math.cos((angle.Value() / 180) * Math.PI);
          //if (Math.abs(x) < Math.pow(10, -7)) return x - 10;
          return -1 * scale * force.Value() * x - 3 * scale;
        };

      if (piece == "y")
        return function() {
          const y = Math.sin((angle.Value() / 180) * Math.PI);
          if (Math.abs(y) < Math.pow(10, -7)) return 0;
          return -1 * scale * force.Value() * y;
        };
    },
    val_computed: (force, angle, type) => {
      if (type == "GF")
        return function() {
          let radians = (angle.Value() * Math.PI) / 180;
          let val = 4 * force.Value() * Math.sin(radians) - 2 * force.Value() * Math.cos(radians);
          val /= -2;
          return "F_{GF} = " + Math.round(val * 100) / 100 + " N";
        };
      if (type == "GC")
        return function() {
          let radians = (angle.Value() * Math.PI) / 180;
          let val = force.Value() * Math.sin(Math.PI / 4) * Math.sin(radians);
          return "F_{GC} = " + Math.round(val * 100) / 100 + " N";
        };
      if (type == "BC")
        return function() {
          let radians = (angle.Value() * Math.PI) / 180;
          let val = force.Value() * Math.sin(radians);
          return "F_{BC} = " + Math.round(val * 100) / 100 + " N";
        };
      return "Error: val_computed did not receive valid type";
    },
    tension_computed: (force, angle, type) => {
      if (type == "GF")
        return function() {
          let radians = (angle.Value() * Math.PI) / 180;
          let val = 4 * force.Value() * Math.sin(radians) - 2 * force.Value() * Math.cos(radians);
          val /= -2;
          if (val >= 0) return "Member GF is in tension";
          else return "Member GF is in compression";
        };
      if (type == "GC")
        return function() {
          let radians = (angle.Value() * Math.PI) / 180;
          let val = force.Value() * Math.sin(Math.PI / 4) * Math.sin(radians);
          if (val >= 0) return "Member GC is in tension";
          else return "Member GC is in compression";
        };
      if (type == "BC")
        return function() {
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
