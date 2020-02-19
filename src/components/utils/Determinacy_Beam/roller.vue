<template>
  <div style="margin:20px">
    <DeterminacyText></DeterminacyText>

    <div class="row">
      <div class="col-xl-6 mx-2">
        <div class="row">
          <div class="col-lg-8">
            <div class="my-3">
              <span>Constraints at the left end of beam</span> <br />
              <button class="btn btn-primary mx-3" @click="clickOnFix">Fixed</button>
              <button class="btn btn-primary mx-3" @click="clickOnPin">Smooth pin</button>
              <button class="btn btn-warning mx-3">Roller</button>
            </div>
            <div>
              <span>Constraints at the right end of beam</span> <br />
              <button class="btn btn-warning mx-3">Roller</button>
            </div>
          </div>
          <div class="col-lg-4 text-center">
            <div>
              <p>
                <span>&Sigma;</span>
                M = F<sub>y</sub> &#215; L<sub>f</sub> + <span style="color:red">B<sub>y</sub></span> &#215; L + M = 0
              </p>
              <p>
                <span>&Sigma;</span>
                F<sub>x</sub> = F<sub>x</sub> = ma
              </p>
              <p>
                <span>&Sigma;</span>
                F<sub>y</sub> = <span style="color:red">A<sub>y</sub></span> + <span style="color:red">B<sub>y</sub></span> + F<sub>y</sub> = 0
              </p>
            </div>
            <ul>
              <li>Reactive forces/moments: 2</li>
              <li>
                Equations of Equilibrium: 3
              </li>
              <li>Status: Statically unstable</li>
            </ul>
          </div>
        </div>
      </div>
      <div id="roller" class="jsx-graph col-xl mx-2"></div>
    </div>
  </div>
</template>

<script>
import DeterminacyText from "./determinacy_text";

export default {
  name: "pin",
  components: {
    DeterminacyText
  },
  data() {
    return {
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
    const react_visible = () => {
      return this.globalData.showReactive;
    };

    // retrieve data
    const { posVal, magVal, dirVal, posMoment, magMoment, dirMoment } = this.globalData;
    const board = JXG.JSXGraph.initBoard("roller", {
      boundingbox: [-15, 15, 15, -15],
      axis: true,
      keepAspectRatio: true,
      showCopyright: false,
      showNavigation: false
    });

    const showReactive = board.create("button", [
      8,
      4,
      "Show Reactive",
      () => {
        this.globalData.showReactive = this.globalData.showReactive ? false : true;
      }
    ]);

    // create base
    const rec_a = board.create("point", [0 + x_shift, -1 + y_shift], { fixed: true, visible: false });
    const rec_b = board.create("point", [0 + x_shift, 1 + y_shift], { fixed: true, visible: false });
    const rec_c = board.create("point", [10 + x_shift, 1 + y_shift], { fixed: true, visible: false });
    const rec_d = board.create("point", [10 + x_shift, -1 + y_shift], { fixed: true, visible: false });
    const rectangle = board.create("polygon", [rec_a, rec_b, rec_c, rec_d]);

    const roller_p1_left = board.create("point", [-0.6 + x_shift, -1.6 + y_shift], { fixed: true, visible: false });
    const roller_p2_left = board.create("point", [0.6 + x_shift, -1.6 + y_shift], { fixed: true, visible: false });
    const roller_circ_left = board.create("circle", [[0 + x_shift, -1.3 + y_shift], 0.3], { fillColor: "red", fixed: true });
    const roller_line_left = board.create("line", [roller_p1_left, roller_p2_left], { straightFirst: false, straightLast: false });
    const roller_comb_left = board.create("comb", [roller_p2_left, roller_p1_left]);

    const roller_p1 = board.create("point", [9.4 + x_shift, -1.6 + y_shift], { fixed: true, visible: false });
    const roller_p2 = board.create("point", [10.6 + x_shift, -1.6 + y_shift], { fixed: true, visible: false });
    const roller_circ = board.create("circle", [[10 + x_shift, -1.3 + y_shift], 0.3], { fillColor: "red", fixed: true });
    const roller_line = board.create("line", [roller_p1, roller_p2], { straightFirst: false, straightLast: false });
    const roller_comb = board.create("comb", [roller_p2, roller_p1]);

    // reactive force and moment base
    const react_trans = board.create("transform", [0, y_react_shift], { type: "translate" });
    const reactive_rec = board.create("polygon", [rectangle, react_trans], { vertices: { visible: false }, visible: react_visible });

    // variable
    const F_0 = board.create(
      "point",
      [
        () => {
          return posVal * 10 + x_shift;
        },
        0 + y_shift
      ],
      { visible: false }
    );
    const F_1 = board.create(
      "point",
      [
        () => {
          return magVal * Math.cos((dirVal / 180) * Math.PI) * 4 + F_0.X();
        },
        () => {
          return magVal * Math.sin((dirVal / 180) * Math.PI) * 4 + F_0.Y();
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
          return moment_radius * Math.sin(t) + posMoment * 10 + x_shift;
        },
        t => {
          return moment_radius * Math.cos(t) + y_shift;
        },
        () => {
          return ((magMoment * 3) / 8 + 0.5) * Math.PI;
        },
        () => {
          return ((-magMoment * 3) / 8 + 0.5) * Math.PI;
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
        return posMoment * 10 + 3 + x_shift;
      },
      0 + y_shift,
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
        return this.globalData.dirMoment;
      },
      firstArrow: () => {
        return !this.globalData.dirMoment;
      },
      visible: react_visible
    });

    // creating sub forces
    const Fx = board.create(
      "point",
      [
        () => {
          return magVal * Math.cos((dirVal / 180) * Math.PI) * 4 + react_F_0.point1.X();
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

    // make reactive force in y direction on the left
    const Ay_Line = board.create("line", [[0 + x_shift, -1.25 + y_shift + y_react_shift], [0 + x_shift, -2.25 + y_shift + y_react_shift]], {
      straightFirst: false,
      straightLast: false,
      firstArrow: true,
      strokeWidth: 3,
      strokeColor: "red",
      visible: react_visible
    });

    const Ay_Line_Label = board.create("text", [1, 0, "A_y"], { anchor: Ay_Line, visible: react_visible, fixed: true });

    // make reactive force in y direction on the right
    const By_Line = board.create("line", [[10 + x_shift, -1.25 + y_shift + y_react_shift], [10 + x_shift, -2.25 + y_shift + y_react_shift]], {
      straightFirst: false,
      straightLast: false,
      firstArrow: true,
      strokeWidth: 3,
      strokeColor: "red",
      visible: react_visible
    });

    const By_Line_Label = board.create("text", [-0.5, 0, "B_y"], {
      anchor: By_Line,
      visible: react_visible,
      fixed: true
    });

    // length
    const L = board.create("line", [[0 + x_shift, 4.5 + y_shift + y_react_shift], [10 + x_shift, 4.5 + y_shift + y_react_shift]], {
      straightFirst: false,
      straightLast: false,
      firstArrow: true,
      lastArrow: true,
      strokeWidth: 3,
      strokeColor: "red",
      visible: react_visible,
      fixed: true
    });
    const L_Line_Label = board.create("text", [0, 0.5, "L"], {
      anchor: L,
      visible: react_visible,
      fixed: true
    });

    const Lf = board.create(
      "line",
      [
        [0 + x_shift, 4 + y_shift + y_react_shift],
        [
          () => {
            return posVal * 10 + x_shift;
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
        strokeColor: "red",
        visible: react_visible
      }
    );
    const Lf_Line_Label = board.create("text", [0, -0.5, "L_f"], {
      anchor: Lf,
      fixed: true,
      visible: react_visible
    });
  },
  methods: {
    clickOnFix() {
      const { posVal, magVal, dirVal, posMoment, magMoment, dirMoment } = this.globalData;
      const fix = true;
      const pin = false;
      const roller = false;
      const showReactive = this.globalData.showReactive;
      const obj = { posVal, magVal, dirVal, magMoment, posMoment, dirMoment, fix, pin, roller, showReactive };
      this.$emit("fromChild", obj);
    },
    clickOnPin() {
      const { posVal, magVal, dirVal, posMoment, magMoment, dirMoment } = this.globalData;
      const fix = false;
      const pin = true;
      const roller = false;
      const showReactive = this.globalData.showReactive;
      const obj = { posVal, magVal, dirVal, magMoment, posMoment, dirMoment, fix, pin, roller, showReactive };
      this.$emit("fromChild", obj);
    }
  }
};
</script>
