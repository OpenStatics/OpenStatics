<template>
  <div class="row">
    <div id="fixFix" class="jsx-graph col-6 mx-2"></div>
    <div class="col-5 mx-2">
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
      <div>
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
            Status: Statically indeterminate
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "fixFix",
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
    const fixedDecimal = 4;

    // retrieve data
    const { posVal, magVal, dirVal, posMoment, magMoment, dirMoment } = this.globalData;

    const board = JXG.JSXGraph.initBoard("fixFix", { boundingbox: [-15, 15, 15, -15], axis: true, keepAspectRatio: true, showCopyright: false });
    const rec_a = board.create("point", [0, -1], { fixed: true, visible: false });
    const rec_b = board.create("point", [0, 1], { fixed: true, visible: false });
    const rec_c = board.create("point", [10, 1], { fixed: true, visible: false });
    const rec_d = board.create("point", [10, -1], { fixed: true, visible: false });
    const rectangle = board.create("polygon", [rec_a, rec_b, rec_c, rec_d]);

    const fix_left = this.constraintObj[0];
    const fix_p1_left = board.create("point", [0, 1.5], { fixed: true, visible: false });
    const fix_p2_left = board.create("point", [0, -1.5], { fixed: true, visible: false });
    const fix_line_left = board.create("line", [fix_p1_left, fix_p2_left], { straightFirst: false, straightLast: false });
    const fix_comb_left = board.create("comb", [fix_p2_left, fix_p1_left]);

    const fix = this.constraintObj[0];
    const fix_p1 = board.create("point", [10, 1.5], { fixed: true, visible: false });
    const fix_p2 = board.create("point", [10, -1.5], { fixed: true, visible: false });
    fix.fix_line = board.create("line", [fix_p1, fix_p2], { straightFirst: false, straightLast: false });
    fix.fix_comb = board.create("comb", [fix_p1, fix_p2]);

    const pin = this.constraintObj[1];
    const pin_p1 = board.create("point", [9.7, 0], { fixed: true, visible: false });
    const pin_p2 = board.create("point", [10.3, 0], { fixed: true, visible: false });
    const pin_p3 = board.create("point", [11, -1.5], { fixed: true, visible: false });
    const pin_p4 = board.create("point", [9, -1.5], { fixed: true, visible: false });
    pin.pin_circ = board.create("circle", [[10, 0], 0.3], { fillColor: "red", fixed: true });
    pin.pin_body = board.create("polygon", [pin_p1, pin_p2, pin_p3, pin_p4], { fillColor: "red" });
    pin.pin_comb = board.create("comb", [pin_p3, pin_p4]);

    const roller = this.constraintObj[2];
    const roller_p1 = board.create("point", [9.4, -1.6], { fixed: true, visible: false });
    const roller_p2 = board.create("point", [10.6, -1.6], { fixed: true, visible: false });
    roller.roller_circ = board.create("circle", [[10, -1.3], 0.3], { fillColor: "red", fixed: true });
    roller.roller_line = board.create("line", [roller_p1, roller_p2], { straightFirst: false, straightLast: false });
    roller.roller_comb = board.create("comb", [roller_p2, roller_p1]);
    this.setAllInvis(0);

    this.magnitude = board.create("slider", [[0, -6], [10, -6], [0, magVal, 2]], { name: "Magnitude of Loading[kN]" });
    this.position = board.create("slider", [[0, -8], [10, -8], [0, posVal, 1]], { name: "Position of Loading (m)" });
    this.direction = board.create("slider", [[0, -10], [10, -10], [0, dirVal, 360]], { name: "Direction of Force [degree]" });
    this.momentMag = board.create("slider", [[0, -12], [10, -12], [0, magMoment, 2]], { name: "Magnitude of Moment[kN*m]" });
    this.momentPos = board.create("slider", [[0, -14], [10, -14], [0, posMoment, 1]], { name: "Position of Moment (m)" });
    const CCW = board.create("button", [
      3,
      -15,
      "CCW",
      () => {
        this.globalData.dirMoment = true;
      }
    ]);
    const CW = board.create("button", [
      1,
      -15,
      "CW",
      () => {
        this.globalData.dirMoment = false;
      }
    ]);

    const inputMag = board.create("input", [-12, -6, "", "Magnitude of Loading[kN] "], { cssStyle: "width: 100px" });
    const buttonMag = board.create("button", [
      -4,
      -6,
      "Update",
      () => {
        if (Number(inputMag.Value())) this.magnitude.setValue(Number(inputMag.Value()));
      }
    ]);
    const inputPos = board.create("input", [-12, -8, "", "Position of Loading (m) "], { cssStyle: "width: 100px" });
    const buttonPos = board.create("button", [
      -4,
      -8,
      "Update",
      () => {
        if (Number(inputPos.Value())) this.position.setValue(Number(inputPos.Value()));
      }
    ]);
    const inputDir = board.create("input", [-12, -10, "", "Direction of Force [degree] "], { cssStyle: "width: 100px" });
    const buttonDir = board.create("button", [
      -4,
      -10,
      "Update",
      () => {
        if (Number(inputDir.Value())) this.direction.setValue(Number(inputDir.Value()));
      }
    ]);
    const inputMagMoment = board.create("input", [-12, -12, "", "Magnitude of Moment[kN*m] "], { cssStyle: "width: 80px" });
    const buttonMagMoment = board.create("button", [
      -4,
      -12,
      "Update",
      () => {
        if (Number(inputMagMoment.Value())) this.momentMag.setValue(Number(inputMagMoment.Value()));
      }
    ]);
    const inputPosMoment = board.create("input", [-12, -14, "", "Position of Moment (m) "], { cssStyle: "width: 100px" });
    const buttonPosMoment = board.create("button", [
      -4,
      -14,
      "Update",
      () => {
        if (Number(inputPosMoment.Value())) this.momentPos.setValue(Number(inputPosMoment.Value()));
      }
    ]);

    const F_0 = board.create(
      "point",
      [
        () => {
          return this.position.Value() * 10;
        },
        0
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

    const Fx = board.create(
      "point",
      [
        () => {
          return this.magnitude.Value() * Math.cos((this.direction.Value() / 180) * Math.PI) * 4 + F_0.X();
        },
        () => {
          return 0;
        }
      ],
      {
        visible: false
      }
    );
    const Fx_Line = board.create("line", [Fx, F_0], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      strokeWidth: 3,
      dash: true,
      strokeColor: "red"
    });
    const Fx_line_Label = board.create("text", [-0.5, 0.5, "F_x"], { anchor: Fx_Line });

    const Fy = board.create(
      "point",
      [
        () => {
          return F_0.X();
        },
        () => {
          return this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI) * 4 + F_0.Y();
        }
      ],
      {
        visible: false
      }
    );
    const Fy_Line = board.create("line", [Fy, F_0], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      strokeWidth: 3,
      dash: true,
      strokeColor: "red"
    });
    const Fy_line_Label = board.create("text", [1, 0, "F_y"], { anchor: Fy_Line });

    const Moment_0_Curve = board.create(
      "curve",
      [
        t => {
          return 2 * Math.sin(t) + this.momentPos.Value() * 10;
        },
        t => {
          return 2 * Math.cos(t);
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
        return this.momentPos.Value() * 10 + 3;
      },
      0,
      "M"
    ]);

    // const MA_Curve = board.create(
    //   "curve",
    //   [
    //     function(t) {
    //       return -2 * Math.sin(t);
    //     },
    //     function(t) {
    //       return -2 * Math.cos(t);
    //     },
    //     () => {
    //       return ((this.magnitude.Value() * 3) / 8 + 0.5) * Math.PI;
    //     },
    //     () => {
    //       return ((-this.magnitude.Value() * 3) / 8 + 0.5) * Math.PI;
    //     }
    //   ],
    //   {
    //     strokeWidth: 3,
    //     lastArrow: true,
    //     strokeColor: "red"
    //   }
    // );

    // const MA_Text = board.create("text", [-3, 0.5, "M_A"]);
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
      const pin = true;
      const roller = false;
      const obj = { posVal, magVal, dirVal, magMoment, posMoment, dirMoment, fix, pin, roller };
      this.$emit("fromChild", obj);
    }
  }
});
</script>
