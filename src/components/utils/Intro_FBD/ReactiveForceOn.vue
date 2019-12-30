<template>
  <div class="row">
    <div id="startFBD" class="jsx-graph col-6 mx-2"></div>
    <div class="col-4 mx-2">
      <IntroFBDText></IntroFBDText>
      <div class='my-3'>
        <span>Reactive Force at Equilibrium</span>
        <button class="btn btn-warning mx-3">On</button>
        <button class="btn btn-primary mx-3" @click="clickOnRF">Off</button>
      </div>
    </div>
  </div>
</template>

<script>
import IntroFBDText from "./IntroFBDText";
export default {
  name: "startFBD",
  components: {
    IntroFBDText
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
    const board = JXG.JSXGraph.initBoard("startFBD", { boundingbox: [-15, 15, 15, -15], axis: true, keepAspectRatio: true, showCopyright: false });
    const rec_a = board.create("point", [0, -1], { fixed: true, visible: false });
    const rec_b = board.create("point", [0, 1], { fixed: true, visible: false });
    const rec_c = board.create("point", [10, 1], { fixed: true, visible: false });
    const rec_d = board.create("point", [10, -1], { fixed: true, visible: false });
    const rectangle = board.create("polygon", [rec_a, rec_b, rec_c, rec_d]);

    this.magnitude = board.create("slider", [[0, -6], [10, -6], [0, magVal, 4]], { name: "Magnitude of Loading[kN]" });
    this.position = board.create("slider", [[0, -8], [10, -8], [0, posVal, 4]], { name: "Position of Loading (m)" });
    this.direction = board.create("slider", [[0, -10], [10, -10], [0, dirVal, 180]], { name: "Direction of Force [degree]" });

    const F_0 = board.create(
      "point",
      [
        () => {
          return this.position.Value() * 2.5;
        },
        0
      ],
      { visible: false }
    );
    const F_1 = board.create(
      "point",
      [
        () => {
          return this.magnitude.Value() * Math.cos((this.direction.Value() / 180) * Math.PI) + F_0.X();
        },
        () => {
          return this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI) + F_0.Y();
        }
      ],
      {
        visible: false
      }
    );
    const forceLine = board.create("line", [F_0, F_1], { straightFirst: false, straightLast: false, firstArrow: true, strokeWidth: 3 });
    const forceLineLabel = board.create("text", [1, 0, "F"], { anchor: forceLine });

    const Ax_Line = board.create(
      "line",
      [
        [
          () => {
            let val = this.magnitude.Value() * Math.cos((this.direction.Value() / 180) * Math.PI);
            if (Math.abs(val) < Math.pow(10, -7)) val = 0;
            return -2 * Math.abs(val);
          },
          0
        ],
        [0, 0]
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
          return val > 0;
        },
        strokeWidth: 3
      }
    );

    const Ax_Line_Label = board.create("text", [-1, -0.5, "A_x"]);

    const Ax = board.create("text", [
      -10,
      -2,
      () => {
        let val = this.magnitude.Value() * Math.cos((this.direction.Value() / 180) * Math.PI);
        if (Math.abs(val) < Math.pow(10, -7)) val = 0;
        return "A_x = " + parseFloat(val.toFixed(fixedDecimal)) + "kNm";
      }
    ]);

    const Ay_Line = board.create(
      "line",
      [
        [1, -1],
        [
          1,
          () => {
            let val = (1 - this.position.Value() / 4) * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
            if (Math.abs(val) < Math.pow(10, -7)) val = 0;
            return -2 * val - 1;
          }
        ]
      ],
      { straightFirst: false, straightLast: false, firstArrow: true, strokeWidth: 3 }
    );

    const Ay_Line_Label = board.create("text", [1, 0, "A_y"], { anchor: Ay_Line });
    const Ay = board.create("text", [
      -10,
      -4,
      () => {
        let val = (1 - this.position.Value() / 4) * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
        if (Math.abs(val) < Math.pow(10, -7)) val = 0;
        return "A_y = " + parseFloat(val.toFixed(fixedDecimal)) + "kN";
      }
    ]);

    const By_Line = board.create(
      "line",
      [
        [9, -1],
        [
          9,
          () => {
            let val = (this.position.Value() / 4) * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
            if (Math.abs(val) < Math.pow(10, -7)) val = 0;
            return -2 * val - 1;
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
        let val = (this.position.Value() / 4) * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
        if (Math.abs(val) < Math.pow(10, -7)) val = 0;
        return "B_y = " + parseFloat(val.toFixed(fixedDecimal)) + "kN";
      }
    ]);
  },
  methods: {
    clickOnRF() {
      const posVal = this.position.Value();
      const magVal = this.magnitude.Value();
      const dirVal = this.direction.Value();
      const RFMode = false;
      const RRMode = false;
      this.$emit("fromChild", { posVal, magVal, dirVal, RFMode, RRMode });
    }
  }
};
</script>
