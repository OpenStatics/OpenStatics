<template>
  <div style="margin:20px">
    <h1 class="text-danger text-center my-4">Vector Addition of Forces</h1>
    <VecAddText></VecAddText>
    <div class="row">
      <div class="col-xl-6 mx-2">
        <div class="ml-5 my-4">
          <button class="btn btn-primary mx-2" @click="() => this.Toggle([0])">F1 Visibility</button>
          <button class="btn btn-primary mx-2" @click="() => this.Toggle([1])">F2 Visibility</button>
          <button class="btn btn-primary mx-2" @click="() => this.Toggle([2])">Resultant</button>
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
      // [F1, F2, Result Line, Result Point]
      componentVisibility: [true, true, true],
      board: undefined
    };
  },
  mounted() {
    // initial values
    const multiplier = 5;
    const fixedDecimal = 3;
    const fontSize = 20;
    const strokeWidth = 3;

    // create board
    this.board = JXG.JSXGraph.initBoard("vecaddition", { boundingbox: [-15, 15, 15, -15], axis: true, keepAspectRatio: true, showCopyright: false });
    const board_control = JXG.JSXGraph.initBoard("control", {
      boundingbox: [0, 15, 15, 0],
      showCopyright: false
    });
    board_control.addChild(this.board);

    // controller
    const force_a = board_control.create("slider", [[2, 13], [12, 13], [0, 1.5, 3]], { withLabel: false });
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
          return "&Theta;_1:" + value;
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

    const force_b = board_control.create("slider", [[2, 9], [12, 9], [0, 1, 3]], { withLabel: false });
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
        if (Number(inputB.Value())) force_b.setValue(Number(inputB.Value()));
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
          return "&Theta;_2:" + value;
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
        if (Number(inputBB.Value())) angle_b.setValue(Number(inputBB.Value()));
      }
    ]);

    // create two points for reference
    const origin_point = this.board.create("point", [0, 0], { fixed: true, visible: false });
    const end_point_a = this.board.create(
      "point",
      [
        function() {
          return Math.cos((angle_a.Value() / 180) * Math.PI) * force_a.Value() * multiplier;
        },
        function() {
          return Math.sin((angle_a.Value() / 180) * Math.PI) * force_a.Value() * multiplier;
        }
      ],
      { name: "F1", face: "cross", strokeColor: "green" }
    );
    const end_point_b = this.board.create(
      "point",
      [
        function() {
          return Math.cos((angle_b.Value() / 180) * Math.PI) * force_b.Value() * multiplier;
        },
        function() {
          return Math.sin((angle_b.Value() / 180) * Math.PI) * force_b.Value() * multiplier;
        }
      ],
      { name: "F2", face: "cross", strokeColor: "green" }
    );

    const end_point_r = this.board.create(
      "point",
      [
        function() {
          var a_x = Math.cos((angle_a.Value() / 180) * Math.PI) * force_a.Value();
          var b_x = Math.cos((angle_b.Value() / 180) * Math.PI) * force_b.Value();
          return (a_x + b_x) * multiplier;
        },
        function() {
          var a_y = Math.sin((angle_a.Value() / 180) * Math.PI) * force_a.Value();
          var b_y = Math.sin((angle_b.Value() / 180) * Math.PI) * force_b.Value();
          return (a_y + b_y) * multiplier;
        }
      ],
      {
        name: "FR",
        face: "cross",
        strokeColor: "green",
        visible: () => {
          return this.componentVisibility[2];
        }
      }
    );

    // create curve
    // F1
    this.board.create(
      "curve",
      [
        t => {
          return Math.cos((t / 180) * Math.PI) * force_a.Value() * multiplier;
        },
        t => {
          return Math.sin((t / 180) * Math.PI) * force_a.Value() * multiplier;
        },
        () => {
          return 0;
        },
        () => {
          return angle_a.Value();
        }
      ],
      { strokeColor: "red", strokeWidth }
    );
    this.board.create("text", [
      function() {
        return (Math.cos((angle_a.Value() / 360) * Math.PI) * force_a.Value() * multiplier) / 1.1;
      },
      function() {
        return (Math.sin((angle_a.Value() / 360) * Math.PI) * force_a.Value() * multiplier) / 1.1;
      },
      "&Theta;1"
    ]);

    // F2
    this.board.create(
      "curve",
      [
        t => {
          return Math.cos((t / 180) * Math.PI) * force_b.Value() * multiplier;
        },
        t => {
          return Math.sin((t / 180) * Math.PI) * force_b.Value() * multiplier;
        },
        () => {
          return 0;
        },
        () => {
          return angle_b.Value();
        }
      ],
      { strokeWidth }
    );
    this.board.create("text", [
      function() {
        return (Math.cos((angle_b.Value() / 360) * Math.PI) * force_b.Value() * multiplier) / 1.1;
      },
      function() {
        return (Math.sin((angle_b.Value() / 360) * Math.PI) * force_b.Value() * multiplier) / 1.1;
      },
      "&Theta;2"
    ]);

    // create vectors
    // F1
    this.board.create("line", [origin_point, end_point_a], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      visible: true,
      strokeColor: "red",
      strokeWidth,
      visible: () => {
        return this.componentVisibility[0];
      }
    });

    // F2
    this.board.create("line", [origin_point, end_point_b], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      visible: true,
      strokeWidth,
      visible: () => {
        return this.componentVisibility[1];
      }
    });

    // Result
    this.board.create("line", [origin_point, end_point_r], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      visible: false,
      strokeColor: "orange",
      strokeWidth,
      visible: () => {
        return this.componentVisibility[2];
      }
    });
    var show_parallolegram = this.board.create("checkbox", [-10, 3, "Show Parallolegram"], {});

    // parallolegram
    const line_a = this.board.create("line", [end_point_a, end_point_r], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      visible: function() {
        return show_parallolegram.Value();
      }
    });
    const line_b = this.board.create("line", [end_point_b, end_point_r], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      visible: function() {
        return show_parallolegram.Value();
      }
    });

    // Analysis Text
    this.board.create(
      "text",
      [
        -12,
        14,
        () => {
          const FR = Math.sqrt(
            force_a.Value() ** 2 +
              force_b.Value() ** 2 +
              2 * force_a.Value() * force_b.Value() * Math.cos(((angle_a.Value() - angle_b.Value()) / 180) * Math.PI)
          );
          const value = parseFloat(FR.toFixed(fixedDecimal));
          return "F_R: " + value;
        }
      ],
      {
        fontSize,
        visible: () => {
          return this.componentVisibility[2];
        }
      }
    );
    this.board.create(
      "text",
      [
        -12,
        13,
        () => {
          const FR = Math.sqrt(
            force_a.Value() ** 2 +
              force_b.Value() ** 2 +
              2 * force_a.Value() * force_b.Value() * Math.cos(((angle_a.Value() - angle_b.Value()) / 180) * Math.PI)
          );
          const gamma = Math.PI - Math.abs(((angle_a.Value() - angle_b.Value()) / 180) * Math.PI);
          const alpha = Math.asin((force_a.Value() / FR) * Math.sin(gamma));
          const beta = Math.asin((force_b.Value() / FR) * Math.sin(gamma));
          if (angle_a.Value() > angle_b.Value()) {
            const ans = angle_b.Value() + (alpha * 180) / Math.PI;
            return "&Theta;" + parseFloat(ans.toFixed(fixedDecimal));
          } else {
            const ans = angle_a.Value() + (beta * 180) / Math.PI;
            return "&Theta;" + parseFloat(ans.toFixed(fixedDecimal));
          }
        }
      ],
      {
        fontSize,
        visible: () => {
          return this.componentVisibility[2];
        }
      }
    );

    // rerender the screen
    this.componentVisibility[2] = false;
    this.board.fullUpdate();
  },
  methods: {
    Toggle(index_list) {
      for (let index of index_list) {
        this.componentVisibility[index] = this.componentVisibility[index] ? false : true;
      }
      this.board.fullUpdate();
    }
  }
};
export const meta = {
  title: "Force Vector Addition",
  description: "from JSX graph"
};
</script>
