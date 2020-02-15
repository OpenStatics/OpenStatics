<template>
  <div style="margin:20px">
    <!-- needs to figure out the moment A value -->
    <DeterminacyText></DeterminacyText>

    <div class="row">
      <div class="col-xl-6 mx-2">
        <div class="row">
          <div class="col-lg-8">
            <div class="my-3">
              <span>Constraints at the left end of beam</span> <br />
              <button class="btn btn-warning mx-3">Fixed</button>
              <button class="btn btn-primary mx-3" @click="clickOnPin">Smooth pin</button>
              <button class="btn btn-primary mx-3" @click="clickOnRoller">Roller</button>
            </div>
            <div>
              <span>Constraints at the right end of beam</span> <br />
              <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 0 }" @click="fixed">Fixed</button>
              <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 1 }" @click="smooth">Smooth pin</button>
              <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 2 }" @click="roller">Roller</button>
              <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 3 }" @click="none">None</button>
            </div>
          </div>
          <div class="col-lg-4 text-center">
            <div>
              <p>
                <span>&Sigma;</span>
                M = <span style="color:red">M<sub>A</sub></span> +
                <span v-if="currentSelection === 0"
                  ><span style="color:red">M<sub>B</sub></span> + </span
                >F<sub>y</sub> &#215; L<sub>f</sub> +
                <span v-if="currentSelection <= 1"
                  ><span style="color:red">B<sub>y</sub></span> &#215; L +</span
                >
                M = 0
              </p>
              <p>
                <span>&Sigma;</span>
                F<sub>x</sub> = <span style="color:red">A<sub>x</sub></span> +
                <span v-if="currentSelection <= 1"
                  ><span style="color:red">B<sub>x</sub></span> +</span
                >
                F<sub>x</sub> = 0
              </p>
              <p>
                <span>&Sigma;</span>
                F<sub>y</sub> = <span style="color:red">A<sub>y</sub></span> +
                <span v-if="currentSelection <= 2"
                  ><span style="color:red">B<sub>y</sub></span> +</span
                >
                F<sub>y</sub> = 0
              </p>
            </div>
            <ul>
              <li>Reactive forces/moments: {{ 6 - currentSelection }}</li>
              <li>
                Equations of Equilibrium: 3
              </li>
              <li>
                Status: Statically <span v-if="currentSelection <= 2">indeterminate</span> <span v-if="currentSelection === 3">determinate</span>
              </li>
            </ul>
          </div>
        </div>
        <div v-show="currentSelection === 3" id="control" style="height:500px;width:100%" class=" mx-2"></div>
      </div>
      <div id="fixFix" class="jsx-graph col-xl mx-2"></div>
    </div>
  </div>
</template>

<script>
import DeterminacyText from "./determinacy_text";

export default {
  name: "fixFix",
  components: {
    DeterminacyText
  },
  data() {
    return {
      currentSelection: 0,
      constraintObj: [
        { fix_line: undefined, fix_comb: undefined },
        { pin_circ: undefined, pin_body: undefined, pin_comb: undefined },
        { roller_circ: undefined, roller_line: undefined, roller_comb: undefined }
      ],
      position: undefined,
      magnitude: undefined,
      direction: undefined,
      momentPos: undefined,
      momentMag: undefined
    };
  },
  props: {
    globalData: {
      type: Object
    }
  },
  mounted() {
    const fixedDecimal = 3;
    const x_shift = -5;
    const y_shift = 6;
    const y_react_shift = -12;
    const moment_radius = 1.5;
    const fontSize = 20;
    const strokeColor = "red";

    // retrieve data
    const { posVal, magVal, dirVal, posMoment, magMoment, dirMoment } = this.globalData;
    const board = JXG.JSXGraph.initBoard("fixFix", {
      boundingbox: [-15, 15, 15, -15],
      axis: true,
      keepAspectRatio: true,
      showCopyright: false,
      showNavigation: false
    });
    const board_control = JXG.JSXGraph.initBoard("control", {
      boundingbox: [0, 15, 15, 0],
      showCopyright: false
    });
    board_control.addChild(board);
    // board_control.resizeContainer(500,500)

    // create base
    const rec_a = board.create("point", [0 + x_shift, -1 + y_shift], { fixed: true, visible: false });
    const rec_b = board.create("point", [0 + x_shift, 1 + y_shift], { fixed: true, visible: false });
    const rec_c = board.create("point", [10 + x_shift, 1 + y_shift], { fixed: true, visible: false });
    const rec_d = board.create("point", [10 + x_shift, -1 + y_shift], { fixed: true, visible: false });
    const rectangle = board.create("polygon", [rec_a, rec_b, rec_c, rec_d]);

    const fix_left = this.constraintObj[0];
    const fix_p1_left = board.create("point", [0 + x_shift, 1.5 + y_shift], { fixed: true, visible: false });
    const fix_p2_left = board.create("point", [0 + x_shift, -1.5 + y_shift], { fixed: true, visible: false });
    const fix_line_left = board.create("line", [fix_p1_left, fix_p2_left], { straightFirst: false, straightLast: false });
    const fix_comb_left = board.create("comb", [fix_p2_left, fix_p1_left]);

    const fix = this.constraintObj[0];
    const fix_p1 = board.create("point", [10 + x_shift, 1.5 + y_shift], { fixed: true, visible: false });
    const fix_p2 = board.create("point", [10 + x_shift, -1.5 + y_shift], { fixed: true, visible: false });
    fix.fix_line = board.create("line", [fix_p1, fix_p2], { straightFirst: false, straightLast: false });
    fix.fix_comb = board.create("comb", [fix_p1, fix_p2]);

    const pin = this.constraintObj[1];
    const pin_p1 = board.create("point", [9.7 + x_shift, 0 + y_shift], { fixed: true, visible: false });
    const pin_p2 = board.create("point", [10.3 + x_shift, 0 + y_shift], { fixed: true, visible: false });
    const pin_p3 = board.create("point", [11 + x_shift, -1.5 + y_shift], { fixed: true, visible: false });
    const pin_p4 = board.create("point", [9 + x_shift, -1.5 + y_shift], { fixed: true, visible: false });
    pin.pin_circ = board.create("circle", [[10 + x_shift, 0 + y_shift], 0.3], { fillColor: "red", fixed: true });
    pin.pin_body = board.create("polygon", [pin_p1, pin_p2, pin_p3, pin_p4], { fillColor: "red" });
    pin.pin_comb = board.create("comb", [pin_p3, pin_p4]);

    const roller = this.constraintObj[2];
    const roller_p1 = board.create("point", [9.4 + x_shift, -1.6 + y_shift], { fixed: true, visible: false });
    const roller_p2 = board.create("point", [10.6 + x_shift, -1.6 + y_shift], { fixed: true, visible: false });
    roller.roller_circ = board.create("circle", [[10 + x_shift, -1.3 + y_shift], 0.3], { fillColor: "red", fixed: true });
    roller.roller_line = board.create("line", [roller_p1, roller_p2], { straightFirst: false, straightLast: false });
    roller.roller_comb = board.create("comb", [roller_p2, roller_p1]);
    this.setAllInvis(0);

    // reactive force and moment base
    const react_trans = board.create("transform", [0, y_react_shift], { type: "translate" });
    const reactive_rec = board.create("polygon", [rectangle, react_trans], { vertices: { visible: false } });

    // controller
    this.magnitude = board_control.create("slider", [[2, 14], [12, 14], [0, magVal, 2]], { withLabel: false });
    board_control.create("text", [
      3,
      13,
      () => {
        const value = parseFloat(this.magnitude.Value().toFixed(fixedDecimal));
        return "Magnitude of Loading [kN]:" + value;
      }
    ]);

    this.position = board_control.create("slider", [[2, 12], [12, 12], [0, posVal, 1]], { withLabel: false });
    board_control.create("text", [
      3,
      11,
      () => {
        const value = parseFloat(this.position.Value().toFixed(fixedDecimal));
        return "Position of Loading (m):" + value;
      }
    ]);

    this.direction = board_control.create("slider", [[2, 10], [12, 10], [0, dirVal, 360]], { withLabel: false });
    board_control.create("text", [
      3,
      9,
      () => {
        const value = parseFloat(this.direction.Value().toFixed(fixedDecimal));
        return "Direction of Force [degree]:" + value;
      }
    ]);

    this.momentMag = board_control.create("slider", [[2, 8], [12, 8], [0, magMoment, 2]], { withLabel: false });
    board_control.create("text", [
      3,
      7,
      () => {
        const value = parseFloat(this.momentMag.Value().toFixed(fixedDecimal));
        return "Magnitude of Moment[kN*m]:" + value;
      }
    ]);

    this.momentPos = board_control.create("slider", [[2, 6], [12, 6], [0, posMoment, 1]], { withLabel: false });
    board_control.create("text", [
      3,
      5,
      () => {
        const value = parseFloat(this.momentPos.Value().toFixed(fixedDecimal));
        return "Position of Moment (m):" + value;
      }
    ]);

    const CCW = board_control.create("button", [
      3.5,
      4,
      "CCW",
      () => {
        this.globalData.dirMoment = true;
      }
    ]);
    const CW = board_control.create("button", [
      6.5,
      4,
      "CW",
      () => {
        this.globalData.dirMoment = false;
      }
    ]);

    const inputMag = board_control.create("input", [7, 13, "", ""], { cssStyle: "width: 50px" });
    const buttonMag = board_control.create("button", [
      8,
      13,
      "Update",
      () => {
        if (Number(inputMag.Value())) this.magnitude.setValue(Number(inputMag.Value()));
      }
    ]);
    const inputPos = board_control.create("input", [7, 11, "", ""], { cssStyle: "width: 50px" });
    const buttonPos = board_control.create("button", [
      8,
      11,
      "Update",
      () => {
        if (Number(inputPos.Value())) this.position.setValue(Number(inputPos.Value()));
      }
    ]);
    const inputDir = board_control.create("input", [7, 9, "", ""], { cssStyle: "width: 50px" });
    const buttonDir = board_control.create("button", [
      8,
      9,
      "Update",
      () => {
        if (Number(inputDir.Value())) this.direction.setValue(Number(inputDir.Value()));
      }
    ]);
    const inputMagMoment = board_control.create("input", [7, 7, "", ""], { cssStyle: "width: 50px" });
    const buttonMagMoment = board_control.create("button", [
      8,
      7,
      "Update",
      () => {
        if (Number(inputMagMoment.Value())) this.momentMag.setValue(Number(inputMagMoment.Value()));
      }
    ]);
    const inputPosMoment = board_control.create("input", [7, 5, "", ""], { cssStyle: "width: 50px" });
    const buttonPosMoment = board_control.create("button", [
      8,
      5,
      "Update",
      () => {
        if (Number(inputPosMoment.Value())) this.momentPos.setValue(Number(inputPosMoment.Value()));
      }
    ]);

    // variables
    const F_0 = board.create(
      "point",
      [
        () => {
          return this.position.Value() * 10 + x_shift;
        },
        y_shift
      ],
      { visible: false }
    );
    const F_1 = board.create(
      "point",
      [
        () => {
          return this.magnitude.Value() * Math.cos((this.direction.Value() / 180) * Math.PI) * 4 + F_0.X();
        },
        () => {
          return this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI) * 4 + F_0.Y();
        }
      ],
      {
        visible: false
      }
    );
    const forceLine = board.create("line", [F_0, F_1], { straightFirst: false, straightLast: false, firstArrow: true, strokeWidth: 3 });
    const forceLineLabel = board.create("text", [1, 1, "F"], { anchor: forceLine });

    const Moment_0_Curve = board.create(
      "curve",
      [
        t => {
          return moment_radius * Math.sin(t) + this.momentPos.Value() * 10 + x_shift;
        },
        t => {
          return moment_radius * Math.cos(t) + y_shift;
        },
        () => {
          return ((this.momentMag.Value() * 3) / 8 + 0.5) * Math.PI;
        },
        () => {
          return ((-this.momentMag.Value() * 3) / 8 + 0.5) * Math.PI;
        }
      ],
      {
        strokeWidth: 3,
        lastArrow: () => {
          return this.globalData.dirMoment;
        },
        firstArrow: () => {
          return !this.globalData.dirMoment;
        }
      }
    );

    const Moment_0_Curve_Label = board.create("text", [
      () => {
        return this.momentPos.Value() * 10 + 3 + x_shift;
      },
      y_shift,
      "M"
    ]);

    // reactive forces
    // translating variables
    const react_F_0 = board.create("line", [forceLine, react_trans], { straightFirst: false, straightLast: false, firstArrow: true, strokeWidth: 3 });
    const react_Moment_0 = board.create("curve", [Moment_0_Curve, react_trans], {
      strokeWidth: 3,
      lastArrow: () => {
        return this.globalData.dirMoment;
      },
      firstArrow: () => {
        return !this.globalData.dirMoment;
      }
    });

    // creating sub forces
    const Fx = board.create(
      "point",
      [
        () => {
          return this.magnitude.Value() * Math.cos((this.direction.Value() / 180) * Math.PI) * 4 + react_F_0.point1.X();
        },
        () => {
          return y_shift + y_react_shift;
        }
      ],
      {
        visible: false
      }
    );
    const Fx_Line = board.create("line", [Fx, react_F_0.point1], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      strokeWidth: 3,
      dash: true
    });
    const Fx_line_Label = board.create("text", [-0.5, 0.5, "F_x"], { anchor: Fx_Line, fixed: true });

    const Fy = board.create(
      "point",
      [
        () => {
          return react_F_0.point1.X();
        },
        () => {
          return react_F_0.point2.Y();
        }
      ],
      {
        visible: false
      }
    );
    const Fy_Line = board.create("line", [Fy, react_F_0.point1], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      strokeWidth: 3,
      dash: true
    });
    const Fy_line_Label = board.create("text", [1, 0, "F_y"], { anchor: Fy_Line, fixed: true });

    // create moment force on the left
    const MA_Curve = board.create(
      "curve",
      [
        function(t) {
          return -moment_radius * Math.sin(t) + x_shift - 1;
        },
        function(t) {
          return -moment_radius * Math.cos(t) + y_shift + y_react_shift;
        },
        () => {
          if (this.currentSelection !== 3) return ((-1 * 3) / 8 + 0.5) * Math.PI;
          let val = this.position.Value() * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
          if (this.globalData.dirMoment === true) val = val - this.momentMag.Value();
          else val = val + this.momentMag.Value();
          return ((val * 3) / 8 + 0.5) * Math.PI;
        },
        () => {
          if (this.currentSelection !== 3) return ((1 * 3) / 8 + 0.5) * Math.PI;
          let val = -this.position.Value() * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
          if (this.globalData.dirMoment === true) val = val + this.momentMag.Value();
          else val = val - this.momentMag.Value();
          return ((val * 3) / 8 + 0.5) * Math.PI;
        }
      ],
      {
        strokeWidth: 3,
        lastArrow: true,
        strokeColor: "red"
      }
    );

    const MA_Text = board.create("text", [-3 + x_shift, 0 + y_shift + y_react_shift, "M_A"], { fixed: true });

    // make moment force on the right
    const MB_Curve = board.create(
      "curve",
      [
        function(t) {
          return moment_radius * Math.sin(t) + 11 + x_shift;
        },
        function(t) {
          return moment_radius * Math.cos(t) + y_shift + y_react_shift;
        },
        () => {
          return ((1 * 3) / 8 + 0.5) * Math.PI;
        },
        () => {
          return ((-1 * 3) / 8 + 0.5) * Math.PI;
        }
      ],
      {
        strokeWidth: 3,
        lastArrow: true,
        strokeColor: "red",
        visible: () => {
          return this.currentSelection === 0;
        }
      }
    );

    const MB_Text = board.create("text", [13.5 + x_shift, 0.5 + y_shift + y_react_shift, "M_B"], {
      visible: () => {
        return this.currentSelection === 0;
      },
      fixed: true
    });

    // make reactive force in x direction on the left
    const Ax_Line = board.create(
      "line",
      [
        [
          () => {
            if (this.currentSelection !== 3) return -1.25 + x_shift;
            let val = this.magnitude.Value() * Math.cos((this.direction.Value() / 180) * Math.PI);
            if (Math.abs(val) < Math.pow(10, -7)) val = 0;
            return -2 * Math.abs(val) + x_shift - 1.25;
          },
          y_shift + y_react_shift
        ],
        [-0.5 + x_shift, y_shift + y_react_shift]
      ],
      {
        straightFirst: false,
        straightLast: false,
        firstArrow: () => {
          let val = this.magnitude.Value() * Math.cos((this.direction.Value() / 180) * Math.PI);
          if (Math.abs(val) < Math.pow(10, -7)) val = 0;
          return val < 0;
        },
        lastArrow: () => {
          let val = this.magnitude.Value() * Math.cos((this.direction.Value() / 180) * Math.PI);
          if (Math.abs(val) < Math.pow(10, -7)) val = 0;
          return val >= 0;
        },
        strokeWidth: 3,
        strokeColor: "red"
      }
    );

    const Ax_Line_Label = board.create("text", [-0.5 + x_shift, -0.5 + y_react_shift + y_shift, "A_x"], { fixed: true });

    // make reactive force in x direction on the right
    const Bx_Line = board.create("line", [[10.5 + x_shift, 0 + y_shift + y_react_shift], [11.25 + x_shift, 0 + y_shift + y_react_shift]], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      strokeWidth: 3,
      strokeColor: "red",
      visible: () => {
        return this.currentSelection <= 1;
      },
      fixed: true
    });

    const Bx_Line_Label = board.create("text", [11.25 + x_shift, -0.5 + y_shift + y_react_shift, "B_x"], {
      visible: () => {
        return this.currentSelection <= 1;
      },
      fixed: true
    });

    // make reactive force in y direction on the left
    const Ay_Line = board.create(
      "line",
      [
        [0 + x_shift, -1.25 + y_shift + y_react_shift],
        [
          0 + x_shift,
          () => {
            if (this.currentSelection !== 3) return -2.25 + y_react_shift + y_shift;
            let val = this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
            if (Math.abs(val) < Math.pow(10, -7)) val = 0;
            return -val - 1.25 + y_shift + y_react_shift;
          }
        ]
      ],
      { straightFirst: false, straightLast: false, firstArrow: true, strokeWidth: 3, strokeColor: "red" }
    );

    const Ay_Line_Label = board.create("text", [1, 0, "A_y"], { anchor: Ay_Line });

    // make reactive force in y direction on the right
    const By_Line = board.create("line", [[10 + x_shift, -1.25 + y_shift + y_react_shift], [10 + x_shift, -2.25 + y_react_shift + y_shift]], {
      straightFirst: false,
      straightLast: false,
      firstArrow: true,
      strokeWidth: 3,
      strokeColor: "red",
      visible: () => {
        return this.currentSelection <= 2;
      }
    });

    const By_Line_Label = board.create("text", [-0.5, 0, "B_y"], {
      anchor: By_Line,
      visible: () => {
        return this.currentSelection <= 2;
      },
      fixed: true
    });

    const L = board.create("line", [[0 + x_shift, 4.5 + y_shift + y_react_shift], [10 + x_shift, 4.5 + y_shift + y_react_shift]], {
      straightFirst: false,
      straightLast: false,
      firstArrow: true,
      lastArrow: true,
      strokeWidth: 3,
      strokeColor: "red",
      visible: () => {
        return this.currentSelection <= 1;
      },
      fixed: true
    });
    const L_Line_Label = board.create("text", [0, 0.5, "L"], {
      anchor: L,
      visible: () => {
        return this.currentSelection <= 1;
      }
    });

    const Lf = board.create(
      "line",
      [
        [0 + x_shift, 4 + y_shift + y_react_shift],
        [
          () => {
            return this.position.Value() * 10 + x_shift;
          },
          4 + y_shift + y_react_shift
        ]
      ],
      {
        straightFirst: false,
        straightLast: false,
        firstArrow: true,
        lastArrow: true,
        strokeWidth: 3,
        strokeColor: "red"
      }
    );
    const Lf_Line_Label = board.create("text", [0, -0.5, "L_f"], {
      anchor: Lf,
      fixed: true
    });

    // reactive force analysis
    const Ax = board.create(
      "text",
      [
        -10,
        6,
        () => {
          if (this.currentSelection !== 3) return "";
          let val = this.magnitude.Value() * Math.cos((this.direction.Value() / 180) * Math.PI);
          if (Math.abs(val) < Math.pow(10, -7)) val = 0;
          return "A_x = " + parseFloat(val.toFixed(fixedDecimal)) + "kN";
        }
      ],
      {
        fontSize,
        strokeColor,
        fixed: true
      }
    );
    const Ay = board.create(
      "text",
      [
        -10,
        5,
        () => {
          if (this.currentSelection !== 3) return "";
          let val = this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
          if (Math.abs(val) < Math.pow(10, -7)) val = 0;
          return "A_y = " + parseFloat(val.toFixed(fixedDecimal)) + "kN";
        }
      ],
      {
        fontSize,
        strokeColor,
        fixed: true
      }
    );
    const MA = board.create(
      "text",
      [
        -10,
        4,
        () => {
          if (this.currentSelection !== 3) return "";
          let val = -this.position.Value() * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
          if (this.globalData.dirMoment === true) val = val + this.momentMag.Value();
          else val = val - this.momentMag.Value();
          return "M_A = " + parseFloat(val.toFixed(fixedDecimal)) + "kN*m";
        }
      ],
      { fixed: true, fontSize, strokeColor }
    );
  },
  methods: {
    fixed() {
      this.currentSelection = 0;
      this.setVis(0);
      this.setAllInvis(0);
    },
    smooth() {
      this.currentSelection = 1;
      this.setVis(1);
      this.setAllInvis(1);
    },
    roller() {
      this.currentSelection = 2;
      this.setVis(2);
      this.setAllInvis(2);
    },
    none() {
      this.currentSelection = 3;
      this.setAllInvis(-1);
    },
    setAllInvis(toBeExcluded) {
      for (let i in this.constraintObj) {
        if (Number(i) === toBeExcluded) {
          continue;
        }
        for (let j in this.constraintObj[i]) {
          this.constraintObj[i][j].setAttribute({ visible: false });
        }
      }
    },
    setVis(toBeSet) {
      for (let j in this.constraintObj[toBeSet]) {
        this.constraintObj[toBeSet][j].setAttribute({ visible: true });
      }
    },
    clickOnPin() {
      const posVal = this.position.Value();
      const magVal = this.magnitude.Value();
      const dirVal = this.direction.Value();
      const magMoment = this.momentMag.Value();
      const posMoment = this.momentPos.Value();
      const dirMoment = this.globalData.dirMoment;
      const fix = false;
      const pin = true;
      const roller = false;
      const obj = { posVal, magVal, dirVal, magMoment, posMoment, dirMoment, fix, pin, roller };
      this.$emit("fromChild", obj);
    },
    clickOnRoller() {
      const posVal = this.position.Value();
      const magVal = this.magnitude.Value();
      const dirVal = this.direction.Value();
      const magMoment = this.momentMag.Value();
      const posMoment = this.momentPos.Value();
      const dirMoment = this.globalData.dirMoment;
      const fix = false;
      const pin = false;
      const roller = true;
      const obj = { posVal, magVal, dirVal, magMoment, posMoment, dirMoment, fix, pin, roller };
      this.$emit("fromChild", obj);
    }
  }
};
</script>
