<template>
  <div style="margin:20px">
    <h1 class="text-danger text-center my-4">Vector Addition of Forces</h1>
    <VecAddText></VecAddText>
    <div class="row">
      <div class="col-xl-6 mx-2">
        <div class="ml-5 my-4">
          <button class="btn btn-primary mx-2" :class="{ 'btn-warning': this.visibility[0][0] }" @click="() => Toggle(0)">F1 Visibility</button>
          <button class="btn btn-primary mx-2" :class="{ 'btn-warning': this.visibility[1][0] }" @click="() => Toggle(1)">F2 Visibility</button>
          <button class="btn btn-primary mx-2" :class="{ 'btn-warning': this.visibility[2][0] }" @click="() => Toggle(2)">Resultant</button>
        </div>
        <div id="control" style="height:500px;width:100%" class="mx-2"></div>
      </div>
      <div id="vecaddition" class="jsx-graph col-xl mx-2"></div>
    </div>
  </div>
</template>

<script>
import VecAddText from "../../utils/ForceVectorAddition/VecAddText";
export default {
  name: "ForceAddiction",
  components: { VecAddText },
  data() {
    return {
      // [[F1,vec_a],[F2,vec_b],[Res,vec_r]]
      visibility: [[true, undefined], [true, undefined], [false, undefined]],
    };
  },
  mounted() {
    // initial values
    const multiplier = 2.5;
    const fixedDecimal = 3;
    const fontSize = 20;

    // create board
    const board = JXG.JSXGraph.initBoard("vecaddition", { boundingbox: [-15, 15, 15, -15], axis: true, keepAspectRatio: true, showCopyright: false });
    const board_control = JXG.JSXGraph.initBoard("control", {
      boundingbox: [0, 15, 15, 0],
      showCopyright: false
    });
    board_control.addChild(board);

    // controller
    const force_a = board_control.create("slider", [[2, 13], [12, 13], [0, 1.5, 5]], { withLabel: false });
    board_control.create(
      "text",
      [
        3,
        14,
        () => {
          const value = parseFloat(force_a.Value().toFixed(fixedDecimal));
          return "F1:" + value;
        }
      ],
      { fontSize }
    );
    const inputA = board_control.create("input", [7, 14, "", ""], { cssStyle: "width: 50px" });
    const buttonA = board_control.create("button", [
      8,
      14,
      "Update",
      () => {
        if (Number(inputA.Value())) force_a.setValue(Number(inputA.Value()));
      }
    ]);

    const angle_a = board_control.create("slider", [[2, 11], [12, 11], [0, 30, 360]], { withLabel: false });
    board_control.create(
      "text",
      [
        3,
        12,
        () => {
          const value = parseFloat(angle_a.Value().toFixed(fixedDecimal));
          return "&Theta; 1:" + value;
        }
      ],
      { fontSize }
    );
    const inputAA = board_control.create("input", [7, 12, "", ""], { cssStyle: "width: 50px" });
    const buttonAA = board_control.create("button", [
      8,
      12,
      "Update",
      () => {
        if (Number(inputAA.Value())) angle_a.setValue(Number(inputAA.Value()));
      }
    ]);

    const force_b = board_control.create("slider", [[2, 9], [12, 9], [0, 1, 5]], { withLabel: false });
    board_control.create(
      "text",
      [
        3,
        10,
        () => {
          const value = parseFloat(force_b.Value().toFixed(fixedDecimal));
          return "F2:" + value;
        }
      ],
      { fontSize }
    );
    const inputB = board_control.create("input", [7, 10, "", ""], { cssStyle: "width: 50px" });
    const buttonB = board_control.create("button", [
      8,
      10,
      "Update",
      () => {
        if (Number(inputB.Value())) angle_a.setValue(Number(inputB.Value()));
      }
    ]);

    const angle_b = board_control.create("slider", [[2, 7], [12, 7], [0, 120, 360]], { withLabel: false });
    board_control.create(
      "text",
      [
        3,
        8,
        () => {
          const value = parseFloat(angle_b.Value().toFixed(fixedDecimal));
          return "&Theta; 2:" + value;
        }
      ],
      { fontSize }
    );
    const inputBB = board_control.create("input", [7, 8, "", ""], { cssStyle: "width: 50px" });
    const buttonBB = board_control.create("button", [
      8,
      8,
      "Update",
      () => {
        if (Number(inputBB.Value())) angle_a.setValue(Number(inputBB.Value()));
      }
    ]);

    // create two points for reference
    const origin_point = board.create("point", [0, 0], { fixed: true, visible: false });
    const end_point_a = board.create(
      "point",
      [
        function() {
          return Math.cos((angle_a.Value() / 180) * Math.PI) * force_a.Value() * multiplier;
        },
        function() {
          return Math.sin((angle_a.Value() / 180) * Math.PI) * force_a.Value() * multiplier;
        }
      ],
      { name: "F1" }
    );
    const end_point_b = board.create(
      "point",
      [
        function() {
          return Math.cos((angle_b.Value() / 180) * Math.PI) * force_b.Value() * multiplier;
        },
        function() {
          return Math.sin((angle_b.Value() / 180) * Math.PI) * force_b.Value() * multiplier;
        }
      ],
      { name: "F2" }
    );

    const end_point_r = board.create(
      "point",
      [
        function() {
          var a_x = Math.cos((angle_a.Value() / 180) * Math.PI) * force_a.Value();
          var b_x = Math.cos((angle_b.Value() / 180) * Math.PI) * force_b.Value();
          var angle = (angle_a.Value() + angle_b.Value()) / 2;
          return (a_x + b_x) * multiplier;
        },
        function() {
          var a_y = Math.sin((angle_a.Value() / 180) * Math.PI) * force_a.Value();
          var b_y = Math.sin((angle_b.Value() / 180) * Math.PI) * force_b.Value();
          var angle = (angle_a.Value() + angle_b.Value()) / 2;
          return (a_y + b_y) * multiplier;
        }
      ],
      { name: "FR" }
    );

    // create vectors
    this.visibility[0][1] = board.create("line", [origin_point, end_point_a], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      visible: true
    });
    this.visibility[1][1] = board.create("line", [origin_point, end_point_b], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      visible: true
    });
    this.visibility[2][1] = board.create("line", [origin_point, end_point_r], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      visible: false
    });
    var show_parallolegram = board.create("checkbox", [-10, 3, "Show Parallolegram"], {});

    const line_a = board.create("line", [end_point_a, end_point_r], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      visible: function() {
        return show_parallolegram.Value();
      }
    });
    const line_b = board.create("line", [end_point_b, end_point_r], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      visible: function() {
        return show_parallolegram.Value();
      }
    });
  },
  methods: {
    Toggle(index) {
      this.visibility[index][0] = this.visibility[index][0] ? false : true;
      this.visibility[index][1].setAttribute({ visible: this.visibility[index][0] });
    }
  }
};
export const meta = {
  title: "Force Vector Addition",
  description: "from JSX graph"
};
</script>
