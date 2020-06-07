<template>
  <div class='container-fluid'>
    <!-- get rid of input/button to optimize -->
    <!-- needs to figure out the moment A value -->
    <!-- need to decide if the dummy value is good or not, and the direction cw and ccw -->
    <DeterminacyText></DeterminacyText>

    <div class="row">
      <div class="col-xl-6 mx-2">
        <div class="row">
          <div class="col-lg-8">
            <div class="my-3">
              <span>Constraints at the left end of beam</span> <br />
              <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection <= 3 }" @click="clickOnFixed">Fixed</button>
              <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 5 || currentSelection === 4 }" @click="clickOnPin">
                Smooth pin
              </button>
              <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 6 }" @click="clickOnRoller">Roller</button>
            </div>
            <div>
              <span>Constraints at the right end of beam</span> <br />
              <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 0 }" v-show="currentSelection <= 3" @click="fixed">
                Fixed
              </button>
              <button
                class="btn btn-primary mx-3"
                :class="{ 'btn-warning': currentSelection === 1 || currentSelection === 4 }"
                v-show="currentSelection <= 5"
                @click="smooth"
              >
                Smooth pin
              </button>
              <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 2 || currentSelection >= 5 }" @click="roller">
                Roller
              </button>
              <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 3 }" v-show="currentSelection <= 3" @click="none">
                None
              </button>
            </div>
          </div>
          <Fix v-if="currentSelection <= 3" :currentSelection="currentSelection"> </Fix>
          <Pin v-if="currentSelection <= 5 && currentSelection > 3" :currentSelection="currentSelection"> </Pin>
          <Roller v-if="currentSelection === 6"> </Roller>
        </div>
        <div v-show="currentSelection === 3 || currentSelection === 5" id="control" style="height:500px;width:100%" class="mx-2"></div>
      </div>
      <div id="fixFix" class="jsx-graph col-xl mx-2"></div>
    </div>
    <div id="fixFix" class="text-center jsx-graph mx-2 col-xl"></div>
  </div>
</template>

<script>
import DeterminacyText from "./determinacy_text";
import Fix from "./fix_analysis";
import Pin from "./pin_analysis";
import Roller from "./roller_analysis";

export default {
  name: "fixFix",
  components: {
    DeterminacyText,
    Fix,
    Pin,
    Roller
  },
  data() {
    return {
      /**
       * 0: Fixed, Fixed
       * 1: Fixed, Smooth pin
       * 2: Fixed, Roller
       * 3: Fixed, None
       * 4: Smooth pin, Smooth pin
       * 5: Smooth pin, Roller
       * 6: Roller, Roller
       */
      currentSelection: 0,
      right_base: [
        { fix_line: undefined, fix_comb: undefined },
        { pin_circ: undefined, pin_body: undefined, pin_comb: undefined },
        { roller_circ: undefined, roller_line: undefined, roller_comb: undefined }
      ],
      left_base: [
        { fix_line_left: undefined, fix_comb_left: undefined },
        { pin_circ_left: undefined, pin_body_left: undefined, pin_comb_left: undefined },
        { roller_circ_left: undefined, roller_line_left: undefined, roller_comb_left: undefined }
      ],
      position: undefined,
      magnitude: undefined,
      direction: undefined,
      momentPos: undefined,
      momentMag: undefined,
      showReactive: false,
      dirMoment: true
    };
  },
  mounted() {
    // create style and global parameters
    const fixedDecimal = 3;
    const x_shift = -5;
    const y_shift = 6;
    const y_react_shift = -12;
    const moment_radius = 1.5;
    const fontSize = 20;
    const strokeColor = "red";

    const component_visible = currentSelectionList => {
      return currentSelectionList.includes(this.currentSelection) && react_visible();
    };
    const react_visible = () => {
      return this.showReactive;
    };

    // initial values
    const posVal = 0.3;
    const magVal = 1;
    const dirVal = 90;
    const posMoment = 0.6;
    const magMoment = 1;

    // create board
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

    const showReactive = board.create("button", [
      8,
      4,
      "Show Reactive",
      () => {
        this.showReactive = this.showReactive ? false : true;
      }
    ]);

    // create base
    // create rectangle
    const rec_a = board.create("point", [0 + x_shift, -1 + y_shift], { fixed: true, visible: false });
    const rec_b = board.create("point", [0 + x_shift, 1 + y_shift], { fixed: true, visible: false });
    const rec_c = board.create("point", [10 + x_shift, 1 + y_shift], { fixed: true, visible: false });
    const rec_d = board.create("point", [10 + x_shift, -1 + y_shift], { fixed: true, visible: false });
    const rectangle = board.create("polygon", [rec_a, rec_b, rec_c, rec_d]);

    // create the base fixed on the left side
    const fixed_object = this.left_base[0];
    const fix_p1_left = board.create("point", [0 + x_shift, 1.5 + y_shift], { fixed: true, visible: false });
    const fix_p2_left = board.create("point", [0 + x_shift, -1.5 + y_shift], { fixed: true, visible: false });
    fixed_object.fix_line_left = board.create("line", [fix_p1_left, fix_p2_left], { straightFirst: false, straightLast: false });
    fixed_object.fix_comb_left = board.create("comb", [fix_p2_left, fix_p1_left]);

    const pin_object = this.left_base[1];
    const pin_p1_left = board.create("point", [-0.3 + x_shift, 0 + y_shift], { fixed: true, visible: false });
    const pin_p2_left = board.create("point", [0.3 + x_shift, 0 + y_shift], { fixed: true, visible: false });
    const pin_p3_left = board.create("point", [1 + x_shift, -1.5 + y_shift], { fixed: true, visible: false });
    const pin_p4_left = board.create("point", [-1 + x_shift, -1.5 + y_shift], { fixed: true, visible: false });
    pin_object.pin_circ_left = board.create("circle", [[0 + x_shift, 0 + y_shift], 0.3], { fillColor: "red", fixed: true });
    pin_object.pin_body_left = board.create("polygon", [pin_p1_left, pin_p2_left, pin_p3_left, pin_p4_left], { fillColor: "red" });
    pin_object.pin_comb_left = board.create("comb", [pin_p3_left, pin_p4_left]);

    const roller_object = this.left_base[2];
    const roller_p1_left = board.create("point", [-0.6 + x_shift, -1.6 + y_shift], { fixed: true, visible: false });
    const roller_p2_left = board.create("point", [0.6 + x_shift, -1.6 + y_shift], { fixed: true, visible: false });
    roller_object.roller_circ_left = board.create("circle", [[0 + x_shift, -1.3 + y_shift], 0.3], { fillColor: "red", fixed: true });
    roller_object.roller_line_left = board.create("line", [roller_p1_left, roller_p2_left], { straightFirst: false, straightLast: false });
    roller_object.roller_comb_left = board.create("comb", [roller_p2_left, roller_p1_left]);
    this.updateVisibility(0, this.left_base);

    // create base fixed on the right side
    const fix = this.right_base[0];
    const fix_p1 = board.create("point", [10 + x_shift, 1.5 + y_shift], { fixed: true, visible: false });
    const fix_p2 = board.create("point", [10 + x_shift, -1.5 + y_shift], { fixed: true, visible: false });
    fix.fix_line = board.create("line", [fix_p1, fix_p2], { straightFirst: false, straightLast: false });
    fix.fix_comb = board.create("comb", [fix_p1, fix_p2]);

    const pin = this.right_base[1];
    const pin_p1 = board.create("point", [9.7 + x_shift, 0 + y_shift], { fixed: true, visible: false });
    const pin_p2 = board.create("point", [10.3 + x_shift, 0 + y_shift], { fixed: true, visible: false });
    const pin_p3 = board.create("point", [11 + x_shift, -1.5 + y_shift], { fixed: true, visible: false });
    const pin_p4 = board.create("point", [9 + x_shift, -1.5 + y_shift], { fixed: true, visible: false });
    pin.pin_circ = board.create("circle", [[10 + x_shift, 0 + y_shift], 0.3], { fillColor: "red", fixed: true });
    pin.pin_body = board.create("polygon", [pin_p1, pin_p2, pin_p3, pin_p4], { fillColor: "red" });
    pin.pin_comb = board.create("comb", [pin_p3, pin_p4]);

    const roller = this.right_base[2];
    const roller_p1 = board.create("point", [9.4 + x_shift, -1.6 + y_shift], { fixed: true, visible: false });
    const roller_p2 = board.create("point", [10.6 + x_shift, -1.6 + y_shift], { fixed: true, visible: false });
    roller.roller_circ = board.create("circle", [[10 + x_shift, -1.3 + y_shift], 0.3], { fillColor: "red", fixed: true });
    roller.roller_line = board.create("line", [roller_p1, roller_p2], { straightFirst: false, straightLast: false });
    roller.roller_comb = board.create("comb", [roller_p2, roller_p1]);
    this.updateVisibility(0, this.right_base);

    // reactive force and moment base
    const react_trans = board.create("transform", [0, y_react_shift], { type: "translate" });
    const reactive_rec = board.create("polygon", [rectangle, react_trans], { vertices: { visible: false }, visible: react_visible });

    // controller
    this.magnitude = board_control.create("slider", [[2, 13], [12, 13], [0, magVal, 2]], { withLabel: false });
    board_control.create("text", [
      3,
      14,
      () => {
        const value = parseFloat(this.magnitude.Value().toFixed(fixedDecimal));
        return "Magnitude of Loading [kN]:" + value;
      }
    ]);

    this.position = board_control.create("slider", [[2, 11], [12, 11], [0, posVal, 1]], { withLabel: false });
    board_control.create("text", [
      3,
      12,
      () => {
        const value = parseFloat(this.position.Value().toFixed(fixedDecimal));
        return "Position of Loading (m):" + value;
      }
    ]);

    this.direction = board_control.create("slider", [[2, 9], [12, 9], [0, dirVal, 360]], { withLabel: false });
    board_control.create("text", [
      3,
      10,
      () => {
        const value = parseFloat(this.direction.Value().toFixed(fixedDecimal));
        return "Direction of Force [degree]:" + value;
      }
    ]);

    this.momentMag = board_control.create("slider", [[2, 7], [12, 7], [0, magMoment, 2]], { withLabel: false });
    board_control.create("text", [
      3,
      8,
      () => {
        const value = parseFloat(this.momentMag.Value().toFixed(fixedDecimal));
        return "Magnitude of Moment[kN*m]:" + value;
      }
    ]);

    this.momentPos = board_control.create("slider", [[2, 5], [12, 5], [0, posMoment, 1]], { withLabel: false });
    board_control.create("text", [
      3,
      6,
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
        this.dirMoment = true;
      }
    ]);
    const CW = board_control.create("button", [
      6.5,
      4,
      "CW",
      () => {
        this.dirMoment = false;
      }
    ]);

    const inputMag = board_control.create("input", [7, 14.25, "", ""], { cssStyle: "width: 50px" });
    const buttonMag = board_control.create("button", [
      8,
      14.25,
      "Update",
      () => {
        if (Number(inputMag.Value())) this.magnitude.setValue(Number(inputMag.Value()));
      }
    ]);
    const inputPos = board_control.create("input", [7, 12.25, "", ""], { cssStyle: "width: 50px" });
    const buttonPos = board_control.create("button", [
      8,
      12.25,
      "Update",
      () => {
        if (Number(inputPos.Value())) this.position.setValue(Number(inputPos.Value()));
      }
    ]);
    const inputDir = board_control.create("input", [7, 10.25, "", ""], { cssStyle: "width: 50px" });
    const buttonDir = board_control.create("button", [
      8,
      10.25,
      "Update",
      () => {
        if (Number(inputDir.Value())) this.direction.setValue(Number(inputDir.Value()));
      }
    ]);
    const inputMagMoment = board_control.create("input", [7, 8.25, "", ""], { cssStyle: "width: 50px" });
    const buttonMagMoment = board_control.create("button", [
      8,
      8.25,
      "Update",
      () => {
        if (Number(inputMagMoment.Value())) this.momentMag.setValue(Number(inputMagMoment.Value()));
      }
    ]);
    const inputPosMoment = board_control.create("input", [7, 6.25, "", ""], { cssStyle: "width: 50px" });
    const buttonPosMoment = board_control.create("button", [
      8,
      6.25,
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
          return this.dirMoment;
        },
        firstArrow: () => {
          return !this.dirMoment;
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

    const react_F_0 = board.create("line", [forceLine, react_trans], {
      straightFirst: false,
      straightLast: false,
      firstArrow: true,
      strokeWidth: 3,
      visible: react_visible
    });
    const react_Moment_0 = board.create("curve", [Moment_0_Curve, react_trans], {
      strokeWidth: 3,
      lastArrow: () => {
        return this.dirMoment;
      },
      firstArrow: () => {
        return !this.dirMoment;
      },
      visible: react_visible
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
      dash: true,
      visible: react_visible
    });
    const Fx_line_Label = board.create("text", [-0.5, 0.5, "F_x"], { anchor: Fx_Line, fixed: true, visible: react_visible });

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
      dash: true,
      visible: react_visible
    });
    const Fy_line_Label = board.create("text", [1, 0, "F_y"], { anchor: Fy_Line, fixed: true, visible: react_visible });

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
          if (this.dirMoment === true) val = val - this.momentMag.Value();
          else val = val + this.momentMag.Value();
          return ((val * 3) / 8 + 0.5) * Math.PI;
        },
        () => {
          if (this.currentSelection !== 3) return ((1 * 3) / 8 + 0.5) * Math.PI;
          let val = -this.position.Value() * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
          if (this.dirMoment === true) val = val + this.momentMag.Value();
          else val = val - this.momentMag.Value();
          return ((val * 3) / 8 + 0.5) * Math.PI;
        }
      ],
      {
        strokeWidth: 3,
        lastArrow: true,
        strokeColor: "red",
        visible: () => {
          return component_visible([0, 1, 2, 3]);
        }
      }
    );

    const MA_Text = board.create("text", [-3 + x_shift, 0 + y_shift + y_react_shift, "M_A"], {
      fixed: true,
      visible: () => {
        return component_visible([0, 1, 2, 3]);
      }
    });

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
          return component_visible([0]);
        }
      }
    );

    const MB_Text = board.create("text", [13.5 + x_shift, 0.5 + y_shift + y_react_shift, "M_B"], {
      visible: () => {
        return component_visible([0]);
      },
      fixed: true
    });

    // make reactive force in x direction on the left
    const Ax_Line = board.create(
      "line",
      [
        [
          () => {
            if (this.currentSelection !== 3 || this.currentSelection !== 5) return -1.25 + x_shift;
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
        strokeColor: "red",
        visible: () => {
          return component_visible([0, 1, 2, 3, 4, 5]);
        }
      }
    );

    const Ax_Line_Label = board.create("text", [-0.5 + x_shift, -0.5 + y_react_shift + y_shift, "A_x"], {
      fixed: true,
      visible: () => {
        return component_visible([0, 1, 2, 3, 4, 5]);
      }
    });

    // make reactive force in x direction on the right
    const Bx_Line = board.create("line", [[10.5 + x_shift, 0 + y_shift + y_react_shift], [11.25 + x_shift, 0 + y_shift + y_react_shift]], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      strokeWidth: 3,
      strokeColor: "red",
      visible: () => {
        return component_visible([0, 1, 4]);
      },
      fixed: true
    });

    const Bx_Line_Label = board.create("text", [11.25 + x_shift, -0.5 + y_shift + y_react_shift, "B_x"], {
      visible: () => {
        return component_visible([0, 1, 4]);
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
            if (this.currentSelection !== 3 || this.currentSelection !== 5) return -2.25 + y_react_shift + y_shift;
            let val = this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
            if (Math.abs(val) < Math.pow(10, -7)) val = 0;
            return -val - 1.25 + y_shift + y_react_shift;
          }
        ]
      ],
      {
        straightFirst: false,
        straightLast: false,
        firstArrow: true,
        strokeWidth: 3,
        strokeColor: "red",
        visible: () => {
          return component_visible([0, 1, 2, 3, 4, 5, 6]);
        }
      }
    );

    const Ay_Line_Label = board.create("text", [1, 0, "A_y"], {
      anchor: Ay_Line,
      visible: () => {
        return component_visible([0, 1, 2, 3, 4, 5, 6]);
      },
      fixed: true
    });

    // make reactive force in y direction on the right
    const By_Line = board.create(
      "line",
      [
        [10 + x_shift, -1.25 + y_shift + y_react_shift],
        [
          10 + x_shift,
          () => {
            if (this.currentSelection !== 5) return -2.25 + y_react_shift + y_shift;
            let val =
              (-this.momentMag.Value() - this.position.Value() * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI)) / 1;
            return val - 1 + y_react_shift + y_shift;
          }
        ]
      ],
      {
        straightFirst: false,
        straightLast: false,
        firstArrow: true,
        strokeWidth: 3,
        strokeColor: "red",
        visible: () => {
          return component_visible([0, 1, 2, 4, 5, 6]);
        }
      }
    );

    const By_Line_Label = board.create("text", [-0.5, 0, "B_y"], {
      anchor: By_Line,
      visible: () => {
        return component_visible([0, 1, 2, 4, 5, 6]);
      },
      fixed: true
    });

    // length
    const L = board.create("line", [[0 + x_shift, 6 + y_shift + y_react_shift], [10 + x_shift, 6 + y_shift + y_react_shift]], {
      straightFirst: false,
      straightLast: false,
      firstArrow: true,
      lastArrow: true,
      strokeWidth: 3,
      strokeColor: "red",
      visible: () => {
        return component_visible([0, 1, 2, 3, 4, 5, 6]);
      },
      fixed: true
    });
    const L_Line_Label = board.create("text", [0, 1.5, "L"], {
      anchor: L,
      visible: () => {
        return component_visible([0, 1, 2, 3, 4, 5, 6]);
      },
      fixed: true,
      fontSize
    });

    const Lf = board.create(
      "line",
      [
        [0 + x_shift, 5 + y_shift + y_react_shift],
        [
          () => {
            return this.position.Value() * 10 + x_shift;
          },
          5 + y_shift + y_react_shift
        ]
      ],
      {
        straightFirst: false,
        straightLast: false,
        firstArrow: true,
        lastArrow: true,
        strokeWidth: 3,
        strokeColor: "red",
        visible: () => {
          return component_visible([0, 1, 2, 3, 4, 5, 6]);
        }
      }
    );
    const Lf_Line_Label = board.create("text", [0, 1, "L_f"], {
      anchor: Lf,
      fixed: true,
      visible: () => {
        return component_visible([0, 1, 2, 3, 4, 5, 6]);
      },
      fontSize
    });

    // reactive force analysis
    const Ax = board.create(
      "text",
      [
        -10,
        6,
        () => {
          if (this.currentSelection !== 3 && this.currentSelection !== 5) return "";
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
          if (this.currentSelection !== 3 && this.currentSelection !== 5) return "";
          let val = this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
          if (this.currentSelection === 5) {
            const By =
              (-this.momentMag.Value() - this.position.Value() * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI)) / 1;
            val = -val - By;
          }
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
          if (this.dirMoment === true) val = val + this.momentMag.Value();
          else val = val - this.momentMag.Value();
          return "M_A = " + parseFloat(val.toFixed(fixedDecimal)) + "kN*m";
        }
      ],
      {
        fixed: true,
        fontSize,
        strokeColor
      }
    );
    const By = board.create(
      "text",
      [
        -10,
        4,
        () => {
          if (this.currentSelection !== 5) return "";
          let val =
            (-this.momentMag.Value() - this.position.Value() * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI)) / 1;
          if (Math.abs(val) < Math.pow(10, -7)) val = 0;
          return "B_y = " + parseFloat(val.toFixed(fixedDecimal)) + "kN";
        }
      ],
      {
        fixed: true,
        fontSize,
        strokeColor
      }
    );
  },
  methods: {
    fixed() {
      this.currentSelection = 0;

      this.updateVisibility(0, this.right_base);
    },
    smooth() {
      if (this.currentSelection <= 3) {
        this.currentSelection = 1;
      } else {
        this.currentSelection = 4;
      }
      this.updateVisibility(1, this.right_base);
    },
    roller() {
      if (this.currentSelection <= 3) {
        this.currentSelection = 2;
      } else if (this.currentSelection <= 5) {
        this.currentSelection = 5;
      } else {
        this.currentSelection = 6;
      }
      this.updateVisibility(2, this.right_base);
    },
    none() {
      this.currentSelection = 3;
      this.updateVisibility(-1, this.right_base);
    },
    updateVisibility(toBeExcluded, base) {
      for (let i in base) {
        if (Number(i) === toBeExcluded) {
          for (let j in base[i]) {
            base[i][j].setAttribute({ visible: true });
          }
          continue;
        }
        for (let j in base[i]) {
          base[i][j].setAttribute({ visible: false });
        }
      }
    },
    clickOnFixed() {
      this.currentSelection = 0;
      this.updateVisibility(0, this.left_base);
      this.updateVisibility(0, this.right_base);
    },
    clickOnPin() {
      this.currentSelection = 4;
      this.updateVisibility(1, this.left_base);
      this.updateVisibility(1, this.right_base);
    },
    clickOnRoller() {
      this.currentSelection = 6;
      this.updateVisibility(2, this.left_base);
      this.updateVisibility(2, this.right_base);
    }
  }
};
</script>
