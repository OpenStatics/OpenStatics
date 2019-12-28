<template>
  <div class="row">
    <div id="ss_moment" class="jsx-graph col-6 mx-2"></div>
    <div class="col-4 mx-2">
      <FBDtext></FBDtext>
      <div>
        <button class="btn btn-primary mx-3" @click="clickOnCant">Cantilever</button>
        <button class="btn btn-warning mx-3">Simple Supported</button>
      </div>
      <div>
        <button class="btn btn-primary mx-3" @click="clickOnForce">Force</button>
        <button class="btn btn-warning mx-3">Moment</button>
      </div>
    </div>
  </div>
</template>
<script>
import FBDtext from "./FBD_text";
export default {
  name: "ss_moment",
  components: {
    FBDtext
  },
  data() {
    return {
      position: undefined,
      magnitude: undefined,
      direction: undefined
    };
  },
  props: {
    globalData: {
      type: Object
    }
  },
  mounted() {
    const fixedDecimal = 4;

    const { posVal, magVal, dirVal } = this.globalData;
    const board = JXG.JSXGraph.initBoard("ss_moment", { boundingbox: [-15, 15, 15, -15], axis: true, keepAspectRatio: true, showCopyright: false });
    const rec_a = board.create("point", [0, -1], { fixed: true, visible: false });
    const rec_b = board.create("point", [0, 1], { fixed: true, visible: false });
    const rec_c = board.create("point", [10, 1], { fixed: true, visible: false });
    const rec_d = board.create("point", [10, -1], { fixed: true, visible: false });
    const rectangle = board.create("polygon", [rec_a, rec_b, rec_c, rec_d]);

    this.magnitude = board.create("slider", [[0, -6], [10, -6], [0, magVal, 2]], { name: "Magnitude of Loading[kN]" });
    this.position = board.create("slider", [[0, -8], [10, -8], [0, posVal, 1]], { name: "Position of Loading (m)" });

    const MA_Curve = board.create(
      "curve",
      [
        function(t) {
          return -2 * Math.sin(t);
        },
        function(t) {
          return -2 * Math.cos(t);
        },
        () => {
          return ((this.magnitude.Value() * 3) / 8 + 0.5) * Math.PI;
        },
        () => {
          return ((-this.magnitude.Value() * 3) / 8 + 0.5) * Math.PI;
        }
      ],
      {
        strokeWidth: 3,
        lastArrow: true
      }
    );

    const MA_Text = board.create("text", [-3, 0.5, "M_A"]);

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
    const F_Curve = board.create(
      "curve",
      [
        function(t) {
          return 2 * Math.sin(t) + F_0.X();
        },
        function(t) {
          return 2 * Math.cos(t);
        },
        () => {
          return ((-this.magnitude.Value() * 3) / 8 + 0.5) * Math.PI;
        },
        () => {
          return ((this.magnitude.Value() * 3) / 8 + 0.5) * Math.PI;
        }
      ],
      {
        strokeWidth: 3,
        strokeColor: "red",
        lastArrow: true
      }
    );

    const F_Curve_Label = board.create("text", [2.5, 0, "M"], { anchor: F_0 });

    const Ax = board.create("text", [-10, -2, "A_x = 0 kN"]);

    const Ay_Line = board.create(
      "line",
      [
        [1, -1],
        [
          1,
          () => {
            let val = -this.magnitude.Value();
            if (Math.abs(val) < Math.pow(10, -7)) val = 0;
            return val - 1;
          }
        ]
      ],
      { straightFirst: false, straightLast: false, lastArrow: true, strokeWidth: 3 }
    );

    const Ay_Line_Label = board.create("text", [1, 0, "A_y"], { anchor: Ay_Line });
    const Ay = board.create("text", [
      -10,
      -4,
      () => {
        let val = -this.magnitude.Value();
        if (Math.abs(val) < Math.pow(10, -7)) val = 0;
        return "A_y = " + parseFloat(val.toFixed(fixedDecimal)) + " kN";
      }
    ]);

    const By_Line = board.create(
      "line",
      [
        [9, -1],
        [
          9,
          () => {
            let val = -this.magnitude.Value();
            if (Math.abs(val) < Math.pow(10, -7)) val = 0;
            return val - 1;
          }
        ]
      ],
      { straightFirst: false, straightLast: false, firstArrow: true, strokeWidth: 3 }
    );

    const By_Line_Label = board.create("text", [1, 0, "B_y"], { anchor: By_Line });
    const By = board.create("text", [
      -10,
      -6,
      () => {
        let val = this.magnitude.Value();
        if (Math.abs(val) < Math.pow(10, -7)) val = 0;
        return "B_y = " + parseFloat(val.toFixed(fixedDecimal)) + " kN";
      }
    ]);
  },
  methods: {
    clickOnCant() {
      const posVal = this.position.Value();
      const magVal = this.magnitude.Value();
      const { dirVal } = this.globalData;
      const cantMode = true;
      const forceMode = false;
      this.$emit("fromChild", { posVal, magVal, dirVal, cantMode, forceMode });
    },
    clickOnForce() {
      const posVal = this.position.Value();
      const magVal = this.magnitude.Value();
      const { dirVal } = this.globalData;
      const cantMode = false;
      const forceMode = true;
      this.$emit("fromChild", { posVal, magVal, dirVal, cantMode, forceMode });
    }
  }
};
</script>
