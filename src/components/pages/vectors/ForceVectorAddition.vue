<template>
  <div>
    <h1 class="text-danger text-center my-4">Vector Addition of Forces</h1>
    <div class="row">
      <div id="vecaddition" class="jsx-graph col-xl mx-2"></div>
      <div class="col-xl mx-2">
        <VecAddText></VecAddText>
      </div>
    </div>
  </div>
</template>

<script>
import VecAddText from "../../utils/ForceVectorAddition/VecAddText";
export default {
  components: { VecAddText },
  data() {
    return {
      board: null,
      lol: 10
    };
  },
  mounted() {
    const multiplier = 2.5;

    const board = JXG.JSXGraph.initBoard("vecaddition", { boundingbox: [-15, 15, 15, -15], axis: true, keepAspectRatio: true, showCopyright: false });

    // set slider for force and angle
    const force_a = board.create("slider", [[-12, -6], [-6, -6], [0, 1, 5]], { name: "Force 1" });
    const inputA = board.create("input", [-12, -4, "", "F1(N): "], { cssStyle: "width: 100px" });
    const buttonA = board.create("button", [
      -6,
      -4,
      "Update",
      () => {
        if (Number(inputA.Value())) force_a.setValue(Number(inputA.Value()));
      }
    ]);

    const angle_a = board.create("slider", [[-12, -10], [-6, -10], [0, 60, 360]], { name: "Angle 1" });
    const inputAA = board.create("input", [-12, -8, "", "&Theta;1 (degree): "], { cssStyle: "width: 100px" });
    const buttonAA = board.create("button", [
      -6,
      -8,
      "Update",
      () => {
        if (Number(inputAA.Value())) angle_a.setValue(Number(inputAA.Value()));
      }
    ]);

    const force_b = board.create("slider", [[1, -6], [7, -6], [0, 1, 5]], { name: "Force 2" });
    const inputB = board.create("input", [1, -4, "", "F2 (N): "], { cssStyle: "width: 100px" });
    const buttonB = board.create("button", [
      8,
      -4,
      "Update",
      () => {
        if (Number(inputB.Value())) angle_a.setValue(Number(inputB.Value()));
      }
    ]);

    const angle_b = board.create("slider", [[1, -10], [6, -10], [0, 0, 360]], { name: "Angle 2" });
    const inputBB = board.create("input", [1, -8, "", "&Theta;2 (degree): "], { cssStyle: "width: 100px" });
    const buttonBB = board.create("button", [
      8,
      -8,
      "Update",
      () => {
        if (Number(inputBB.Value())) angle_a.setValue(Number(inputBB.Value()));
      }
    ]);

    // create two points for reference
    const origin_point = board.create("point", [0, 0], { fixed: true, name: "O" });
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
    const vector_a = board.create("line", [origin_point, end_point_a], { straightFirst: false, straightLast: false, lastArrow: true });
    const vector_b = board.create("line", [origin_point, end_point_b], { straightFirst: false, straightLast: false, lastArrow: true });
    const vector_r = board.create("line", [origin_point, end_point_r], { straightFirst: false, straightLast: false, lastArrow: true });
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
  }
};
export const meta = {
  title: "Force Vector Addition",
  description: "from JSX graph"
};
</script>
