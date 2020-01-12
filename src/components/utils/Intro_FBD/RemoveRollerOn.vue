<template>
  <div class="row">
    <div id="startFBD" class="jsx-graph col-xl mx-2"></div>
    <div class="col-xl mx-2">
      <IntroFBDText></IntroFBDText>
      <div class='my-3'>
        <span>Reactive Force at Equilibrium</span>
        <button class="btn btn-primary mx-3" @click="clickOnRF">On</button>
        <button class="btn btn-warning mx-3">Off</button>
      </div>
      <div>
        <span>Remove Roller</span>
        <button class="btn btn-warning mx-3">Yes</button>
        <button class="btn btn-primary mx-3" @click="clickOnRR">No</button>
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
    const board = JXG.JSXGraph.initBoard("startFBD", {
      boundingbox: [-15, 15, 15, -15],
      axis: true,
      keepAspectRatio: true,
      showCopyright: false
    });
    const points_list = [];

    const origin = board.create("point", [0, 0], { fixed: true, visible: false });
    const up_trans = board.create("transform", [0, 1], { type: "translate" });
    const down_trans = board.create("transform", [0, -1], { type: "translate" });
    const right_trans = board.create("transform", [10, 0], { type: "translate" });

    points_list.push(board.create("point", [origin, down_trans], { fixed: true, visible: false }));
    points_list.push(board.create("point", [origin, up_trans], { fixed: true, visible: false }));
    points_list.push(board.create("point", [origin, [right_trans, up_trans]], { fixed: true, visible: false }));
    points_list.push(board.create("point", [origin, [right_trans, down_trans]], { fixed: true, visible: false }));
    const rectangle = board.create("polygon", points_list.slice(0, 4));

    const base_p1 = board.create("point", [-0.3, 0], { fixed: true, visible: false });
    const base_p2 = board.create("point", [0.3, 0], { fixed: true, visible: false });
    const base_p3 = board.create("point", [1, -1.5], { fixed: true, visible: false });
    const base_p4 = board.create("point", [-1, -1.5], { fixed: true, visible: false });
    const base_circ = board.create("circle", [[0, 0], 0.3], { fillColor: "red", fixed: true });
    const base = board.create("polygon", [base_p1, base_p2, base_p3, base_p4], { fillColor: "red" });
    const base_comb = board.create("comb", [base_p3, base_p4]);

    this.magnitude = board.create("slider", [[0, -6], [10, -6], [0, magVal, 4]], { name: "Magnitude of Loading[kN]" });
    this.position = board.create("slider", [[0, -8], [10, -8], [0, posVal, 4]], { name: "Position of Loading (m)" });
    this.direction = board.create("slider", [[0, -10], [10, -10], [0, dirVal, 180]], { name: "Direction of Force [degree]" });
    const supportForce = board.create("slider", [[0, -12], [10, -12], [0, 1, 4]], { name: "Change Supporting Force" });

    const F0_trans = board.create(
      "transform",
      [
        () => {
          return this.position.Value() * 2.5;
        },
        0
      ],
      { type: "translate" }
    );
    const F_0 = board.create("point", [origin, F0_trans], { visible: false });
    const F1_trans = board.create(
      "transform",
      [
        () => {
          return this.magnitude.Value() * Math.cos((this.direction.Value() / 180) * Math.PI) + this.position.Value() * 2.5;
        },
        () => {
          return this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
        }
      ],
      { type: "translate" }
    );
    const F_1 = board.create("point", [origin, F1_trans], {
      visible: false
    });
    points_list.push(F_0);
    points_list.push(F_1);

    const forceLine = board.create("line", [F_0, F_1], { straightFirst: false, straightLast: false, firstArrow: true, strokeWidth: 3 });
    const forceLineLabel = board.create("text", [1, 0, "F"], { anchor: forceLine });

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
          let F_val = this.position.Value() * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
          let R_val = 4 * supportForce.Value();
          let val = F_val - R_val;
          return ((Math.abs(val) * 3) / 80 + 0.5) * Math.PI;
        },
        () => {
          let F_val = this.position.Value() * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
          let R_val = 4 * supportForce.Value();
          let val = F_val - R_val;
          return ((-Math.abs(val) * 3) / 80 + 0.5) * Math.PI;
        }
      ],
      {
        strokeWidth: 3,
        firstArrow: true
      }
    );

    const MA_Text = board.create("text", [-3, 0.5, "M_A"]);

    const Ma = board.create("text", [
      -10,
      -2,
      () => {
        let F_val = this.position.Value() * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
        let R_val = 4 * supportForce.Value();
        let val = R_val - F_val;
        if (Math.abs(val) < Math.pow(10, -7)) val = 0;
        return "M_A = " + parseFloat(val.toFixed(fixedDecimal)) + "kN";
      }
    ]);

    const R0_trans = board.create("transform", [10, -1], { type: "translate" });
    const R_0 = board.create("point", [origin, R0_trans], { visible: false });
    const R1_trans = board.create(
      "transform",
      [
        10,
        () => {
          return -supportForce.Value() - 1;
        }
      ],
      { type: "translate" }
    );
    const R_1 = board.create("point", [origin, R1_trans], { visible: false });
    points_list.push(R_0);
    points_list.push(R_1);

    const R = board.create("line", [R_0, R_1], { straightFirst: false, straightLast: false, firstArrow: true, strokeWidth: 3 });
    const R_Label = board.create("text", [1, 0, "R"], { anchor: R });
    const R_text = board.create("text", [
      -10,
      -4,
      () => {
        return "Support Force R = " + parseFloat(supportForce.Value().toFixed(fixedDecimal)) + "kN";
      }
    ]);

    // add animation
    let rot_degree = board.create("transform", [0, origin], { type: "rotate" });

    const play = board.create("button", [
      -10,
      -6,
      "play",
      async () => {
        const F_val = this.position.Value() * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
        const R_val = 4 * supportForce.Value();
        const acc = R_val - F_val;
        let velocity;

        // let the animation run 5s
        for (let t = 1; t < 100; t++) {
          velocity = acc * Math.pow(t / 20, 2) * 0.05;
          rot_degree.setMatrix(board, "rotate", [(velocity / 180) * Math.PI, origin]);
          rot_degree.bindTo(points_list);
          board.update();
          await this.sleep(20);
        }
      }
    ]);
    const reset = board.create("button", [
      -7,
      -6,
      "reset",
      () => {
        rot_degree.setMatrix(board, "rotate", [0, origin]);
        rot_degree.bindTo(points_list);
      }
    ]);
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
      const RRMode = false;
      this.$emit("fromChild", { posVal, magVal, dirVal, RFMode, RRMode });
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
};
</script>
