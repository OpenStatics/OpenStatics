<template>
  <div class="row">
    <div id="startFBD" class="jsx-graph col-xl mx-2"></div>
    <div class="col-xl mx-2">
      <IntroFBDText></IntroFBDText>
      <div class="my-3">
        <span>Reactive Force at Equilibrium</span>
        <button class="btn btn-primary mx-3" @click="clickOnRF">On</button>
        <button class="btn btn-warning mx-3">Off</button>
      </div>
      <div>
        <span>Remove Roller</span>
        <button class="btn btn-primary mx-3" @click="clickOnRR">Yes</button>
        <button class="btn btn-warning mx-3">No</button>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
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

    // retrieve data
    const { posVal, magVal, dirVal } = this.globalData;

    const board = JXG.JSXGraph.initBoard("startFBD", { boundingbox: [-15, 15, 15, -15], axis: true, keepAspectRatio: true, showCopyright: false });
    const rec_a = board.create("point", [0, -1], { fixed: true, visible: false });
    const rec_b = board.create("point", [0, 1], { fixed: true, visible: false });
    const rec_c = board.create("point", [10, 1], { fixed: true, visible: false });
    const rec_d = board.create("point", [10, -1], { fixed: true, visible: false });
    const rectangle = board.create("polygon", [rec_a, rec_b, rec_c, rec_d]);

    const base_p1 = board.create("point", [-0.3, 0], { fixed: true, visible: false });
    const base_p2 = board.create("point", [0.3, 0], { fixed: true, visible: false });
    const base_p3 = board.create("point", [1, -1.5], { fixed: true, visible: false });
    const base_p4 = board.create("point", [-1, -1.5], { fixed: true, visible: false });
    const base_circ = board.create("circle", [[0, 0], 0.3], { fillColor: "red", fixed: true });
    const base = board.create("polygon", [base_p1, base_p2, base_p3, base_p4], { fillColor: "red" });
    const base_comb = board.create("comb", [base_p3, base_p4]);

    const roller_circ = board.create("circle", [[10, -1.3], 0.3], { fillColor: "red", fixed: true });
    const roller_p1 = board.create("point", [9.4, -1.6], { fixed: true, visible: false });
    const roller_p2 = board.create("point", [10.6, -1.6], { fixed: true, visible: false });
    const roller_line = board.create("line", [roller_p1, roller_p2], { straightFirst: false, straightLast: false });
    const roller_comb = board.create("comb", [roller_p2, roller_p1]);

    this.magnitude = board.create(
      "slider",
      [
        [0, -6],
        [10, -6],
        [0, magVal, 4]
      ],
      { name: "Magnitude of Loading[kN]" }
    );
    this.position = board.create(
      "slider",
      [
        [0, -8],
        [10, -8],
        [0, posVal, 4]
      ],
      { name: "Position of Loading (m)" }
    );
    this.direction = board.create(
      "slider",
      [
        [0, -10],
        [10, -10],
        [0, dirVal, 180]
      ],
      { name: "Direction of Force [degree]" }
    );

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
  },
  methods: {
    clickOnRF() {
      const posVal = this.position.Value();
      const magVal = this.magnitude.Value();
      const dirVal = this.direction.Value();
      const RFMode = true;
      const RRMode = false;
      this.$emit("fromChild", { posVal, magVal, dirVal, RFMode, RRMode });
    },
    clickOnRR() {
      const posVal = this.position.Value();
      const magVal = this.magnitude.Value();
      const dirVal = this.direction.Value();
      const RFMode = false;
      const RRMode = true;
      this.$emit("fromChild", { posVal, magVal, dirVal, RFMode, RRMode });
    }
  }
};
</script>
