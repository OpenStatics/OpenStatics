<template>
  <div style="margin:20px">
    <h1 class="text-danger text-center my-4">Vector Addition of Forces</h1>
    <VecAddText></VecAddText>
    <div class="row">
      <div class="col-xl-6 mx-2">
        <div class="ml-5 my-4">
          <button class="btn btn-primary mx-2" :class="{ 'btn-dark': !this.componentVisibility[0] }" @click="() => this.Toggle([0])">
            F1 Visibility
          </button>
          <button class="btn btn-primary mx-2" :class="{ 'btn-dark': !this.componentVisibility[1] }" @click="() => this.Toggle([1])">
            F2 Visibility
          </button>
          <button class="btn btn-primary mx-2" :class="{ 'btn-dark': !this.componentVisibility[2] }" @click="() => this.Toggle([2])">
            Resultant
          </button>
        </div>
        <div class="ml-5 my-4" v-if="this.componentVisibility[2]">
          <button class="btn btn-primary mx-2" :class="{ 'btn-dark': !this.isParallolegram }" @click="() => this.ToggleAnimation(0)">
            Parallolegram
          </button>
          <button class="btn btn-primary mx-2" :class="{ 'btn-dark': this.isParallolegram }" @click="() => this.ToggleAnimation(1)">
            Head-to-Tail
          </button>
        </div>
        <div class="ml-5 my-4" v-if="this.isParallolegram && this.componentVisibility[2]">
          Run<button class="btn" @click="runParallolegram"><i class="fas fa-play"></i></button>
        </div>
        <div class="ml-5 my-4" v-else-if="this.componentVisibility[2]">
          Move Force 1
          <button class="btn" @click="() => this.runHeadTail(0)"><i class="fas fa-play"></i></button>
          Reset Force 1
          <button class="btn" @click="() => this.resetHeadTail(0)"><i class="fas fa-redo"></i></button>
          <br />
          Move Force 2
          <button class="btn" @click="() => this.runHeadTail(1)"><i class="fas fa-play"></i></button>
          Reset Force 2
          <button class="btn" @click="() => this.resetHeadTail(1)"><i class="fas fa-redo"></i></button>
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
      // [F1, F2, Result Line]
      componentVisibility: [true, true, true],
      board: undefined,
      isParallolegram: true,
      parallolegram_len: 1,
      head_move: [0, 0],
      terminationFlag: [false, false]
    };
  },
  mounted() {
    // initial values
    const multiplier = 4;
    const fixedDecimal = 2;
    const fontSize = 20;
    const strokeWidth = 3;
    const dash = 3;
    const fixed = true;
    const inputFont = 15;

    // create board
    this.board = JXG.JSXGraph.initBoard("vecaddition", {
      boundingbox: [-15, 15, 15, -15],
      axis: true,
      keepAspectRatio: true,
      showCopyright: false,
      defaultAxes: {
        x: { lastArrow: { type: 1, size: 8 }, firstArrow: { type: 1, size: 8 }, ticks: { label: { fontSize: 14 } } },
        y: { lastArrow: { type: 1, size: 8 }, firstArrow: { type: 1, size: 8 }, ticks: { label: { fontSize: 14 } } }
      }
    });
    const board_control = JXG.JSXGraph.initBoard("control", {
      boundingbox: [0, 15, 15, 0],
      showCopyright: false
    });
    board_control.addChild(this.board);

    // controller
    const force_a = board_control.create(
      "slider",
      [
        [2, 13],
        [12, 13],
        [0, 1.5, 3]
      ],
      { withLabel: false }
    );
    board_control.create(
      "text",
      [
        3,
        14,
        () => {
          const value = parseFloat(force_a.Value().toFixed(fixedDecimal));
          return "F_1: " + value + "N";
        }
      ],
      { fontSize, fixed }
    );
    const inputA = board_control.create("input", [8.5, 14, "", ""], { cssStyle: "width: 80px", fontSize: inputFont });
    board_control.create(
      "button",
      [
        10,
        14,
        "Update",
        () => {
          if (Number(inputA.Value())) force_a.setValue(Number(inputA.Value()));
        }
      ],
      { fontSize: inputFont }
    );

    const angle_a = board_control.create(
      "slider",
      [
        [2, 11],
        [12, 11],
        [0, 30, 360]
      ],
      { withLabel: false }
    );
    board_control.create(
      "text",
      [
        3,
        12,
        () => {
          const value = parseFloat(angle_a.Value().toFixed(fixedDecimal));
          return "\u03B8_1: " + value + "\u00B0";
        }
      ],
      { fontSize, fixed }
    );
    const inputAA = board_control.create("input", [8.5, 12, "", ""], { cssStyle: "width: 80px", fontSize: inputFont });
    board_control.create(
      "button",
      [
        10,
        12,
        "Update",
        () => {
          if (Number(inputAA.Value())) angle_a.setValue(Number(inputAA.Value()));
        }
      ],
      { fontSize: inputFont }
    );

    const force_b = board_control.create(
      "slider",
      [
        [2, 9],
        [12, 9],
        [0, 1, 3]
      ],
      { withLabel: false }
    );
    board_control.create(
      "text",
      [
        3,
        10,
        () => {
          const value = parseFloat(force_b.Value().toFixed(fixedDecimal));
          return "F_2: " + value + "N";
        }
      ],
      { fontSize, fixed }
    );
    const inputB = board_control.create("input", [8.5, 10, "", ""], { cssStyle: "width: 80px", fontSize: inputFont });
    board_control.create(
      "button",
      [
        10,
        10,
        "Update",
        () => {
          if (Number(inputB.Value())) force_b.setValue(Number(inputB.Value()));
        }
      ],
      { fontSize: inputFont }
    );

    const angle_b = board_control.create(
      "slider",
      [
        [2, 7],
        [12, 7],
        [0, 120, 360]
      ],
      { withLabel: false }
    );
    board_control.create(
      "text",
      [
        3,
        8,
        () => {
          const value = parseFloat(angle_b.Value().toFixed(fixedDecimal));
          return "\u03B8_2: " + value + "\u00B0";
        }
      ],
      { fontSize, fixed }
    );
    const inputBB = board_control.create("input", [8.5, 8, "", ""], { cssStyle: "width: 80px", fontSize: inputFont });
    const buttonBB = board_control.create(
      "button",
      [
        10,
        8,
        "Update",
        () => {
          if (Number(inputBB.Value())) angle_b.setValue(Number(inputBB.Value()));
        }
      ],
      { fontSize: inputFont }
    );

    // create fixed endpoints and origin
    const origin_point = this.board.create("point", [0, 0], { fixed: true, visible: false });
    const end_point_a = this.board.create(
      "point",
      [
        () => {
          return Math.cos((angle_a.Value() / 180) * Math.PI) * force_a.Value() * multiplier;
        },
        () => {
          return Math.sin((angle_a.Value() / 180) * Math.PI) * force_a.Value() * multiplier;
        }
      ],
      { name: "F_1", face: "cross", strokeColor: "green" }
    );

    const end_point_b = this.board.create(
      "point",
      [
        () => {
          return Math.cos((angle_b.Value() / 180) * Math.PI) * force_b.Value() * multiplier;
        },
        () => {
          return Math.sin((angle_b.Value() / 180) * Math.PI) * force_b.Value() * multiplier;
        }
      ],
      { name: "F_2", face: "cross", strokeColor: "green" }
    );

    const end_point_r = this.board.create(
      "point",
      [
        () => {
          var a_x = Math.cos((angle_a.Value() / 180) * Math.PI) * force_a.Value();
          var b_x = Math.cos((angle_b.Value() / 180) * Math.PI) * force_b.Value();
          return (a_x + b_x) * multiplier;
        },
        () => {
          var a_y = Math.sin((angle_a.Value() / 180) * Math.PI) * force_a.Value();
          var b_y = Math.sin((angle_b.Value() / 180) * Math.PI) * force_b.Value();
          return (a_y + b_y) * multiplier;
        }
      ],
      {
        name: "F_R",
        face: "cross",
        strokeColor: "green",
        visible: () => {
          return this.componentVisibility[2];
        }
      }
    );

    // create curve
    // line a
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
      () => {
        return (Math.cos((angle_a.Value() / 360) * Math.PI) * force_a.Value() * multiplier) / 1.1;
      },
      () => {
        return (Math.sin((angle_a.Value() / 360) * Math.PI) * force_a.Value() * multiplier) / 1.1;
      },
      "\u03B8_1"
    ]);

    // line b
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
      () => {
        return (Math.cos((angle_b.Value() / 360) * Math.PI) * force_b.Value() * multiplier) / 1.1;
      },
      () => {
        return (Math.sin((angle_b.Value() / 360) * Math.PI) * force_b.Value() * multiplier) / 1.1;
      },
      "\u03B8_2"
    ]);

    // create fixed vectors
    // line a
    const line_a = this.board.create("line", [origin_point, end_point_a], { visible: false });

    // line b
    const line_b = this.board.create("line", [origin_point, end_point_b], { visible: false });

    // Result
    const result = this.board.create("line", [origin_point, end_point_r], { visible: false });

    // parallolegram
    const transformation = trans_type => {
      return [
        1,
        0,
        0,
        () => {
          if (trans_type === 0) return end_point_a.X();
          if (trans_type === 1) return end_point_b.X();
          if (trans_type === 2) return end_point_a.X() * this.head_move[0];
          if (trans_type === 3) return end_point_b.X() * this.head_move[1];
          return 0;
        },
        () => {
          if (trans_type >= 2) return 1;
          return this.parallolegram_len;
        },
        0,
        () => {
          if (trans_type === 0) return end_point_a.Y();
          if (trans_type === 1) return end_point_b.Y();
          if (trans_type === 2) return end_point_a.Y() * this.head_move[0];
          if (trans_type === 3) return end_point_b.Y() * this.head_move[1];
          return 0;
        },
        0,
        () => {
          if (trans_type >= 2) return 1;
          return this.parallolegram_len;
        }
      ];
    };

    // parallolegram a
    const constraint_a = transformation(1);
    const trans_a = this.board.create("transform", constraint_a, { type: "generic" });

    this.board.create("line", [line_a, trans_a], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      visible: () => {
        return this.isParallolegram && this.componentVisibility[2];
      },
      strokeWidth,
      strokeColor: "red",
      dash
    });

    // parallolegram b
    const constraint_b = transformation(0);
    const trans_b = this.board.create("transform", constraint_b, { type: "generic" });

    this.board.create("line", [line_b, trans_b], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      visible: () => {
        return this.isParallolegram && this.componentVisibility[2];
      },
      strokeWidth,
      dash
    });

    // parallolegram r
    const constraint_r = transformation(-1);
    const trans_r = this.board.create("transform", constraint_r, { type: "generic" });

    this.board.create("line", [result, trans_r], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      strokeColor: "orange",
      strokeWidth,
      visible: () => {
        return this.componentVisibility[2];
      }
    });

    // head to tail
    // line a
    const constraint_head_a = transformation(3);
    const trans_head_a = this.board.create("transform", constraint_head_a, { type: "generic" });
    this.board.create("line", [line_a, trans_head_a], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      visible: () => {
        return this.componentVisibility[0];
      },
      strokeWidth,
      strokeColor: "red"
    });

    // line b
    const constraint_head_b = transformation(2);
    const trans_head_b = this.board.create("transform", constraint_head_b, { type: "generic" });
    this.board.create("line", [line_b, trans_head_b], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      visible: () => {
        return this.componentVisibility[1];
      },
      strokeWidth
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
          return "F_R: " + value + "N";
        }
      ],
      {
        fontSize,
        visible: () => {
          return this.componentVisibility[2];
        },
        fixed: true
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
            return "\u03B8_1: " + parseFloat(ans.toFixed(fixedDecimal)) + "\u00B0";
          } else {
            const ans = angle_a.Value() + (beta * 180) / Math.PI;
            return "\u03B8_1: " + parseFloat(ans.toFixed(fixedDecimal)) + "\u00B0";
          }
        }
      ],
      {
        fontSize,
        visible: () => {
          return this.componentVisibility[2];
        },
        fixed: true
      }
    );

    // rerender the screen
    this.$set(this.componentVisibility, 2, false);
    this.board.fullUpdate();
  },
  methods: {
    Toggle(index_list) {
      for (let index of index_list) {
        const bool = this.componentVisibility[index] ? false : true;
        this.$set(this.componentVisibility, index, bool);
      }
      this.board.fullUpdate();
    },
    ToggleAnimation(index) {
      if (index == 0 && this.isParallolegram) return;
      if (index == 1 && !this.isParallolegram) return;

      this.isParallolegram = this.isParallolegram ? false : true;
      this.resetHeadTail(0);
      this.resetHeadTail(1);
    },
    async runParallolegram() {
      this.parallolegram_len = 0;

      while (this.parallolegram_len < 0.99) {
        // needs optimization and fix multiple click problem, melt transformation does not work yet
        this.parallolegram_len += 0.1;
        this.board.fullUpdate();
        await this.sleep(100);
      }
      this.parallolegram_len = 1;
    },
    async runHeadTail(index) {
      this.terminationFlag[index] = false;

      this.head_move[index] = 0;

      while (this.head_move[index] < 0.99 && !this.terminationFlag[index]) {
        this.head_move[index] += 0.1;
        this.board.fullUpdate();
        await this.sleep(100);
      }
      if (!this.terminationFlag[index]) this.head_move[index] = 1;
    },
    resetHeadTail(index) {
      this.terminationFlag[index] = true;
      this.head_move[index] = 0;
      this.board.fullUpdate();
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
};
export const meta = {
  title: "Force Vector Addition",
  description: "from JSX graph"
};
</script>
