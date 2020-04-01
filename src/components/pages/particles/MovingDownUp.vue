<template>
  <div style="margin:20px">
    <h1 class="text-danger text-center my-4">Moving downward or upward</h1>
    <MovingText></MovingText>
    <div class="row">
      <div class="col-xl-6 mx-2">
        <div id="control" style="height:500px;width:100%" class="mx-2"></div>
      </div>
      <div id="MovingDownUp" class="jsx-graph col-xl mx-2"></div>
    </div>
  </div>
</template>
<script>
import MovingText from "../../utils/Moving_Down_Up/MovingText";

export default {
  name: "Moving",
  data() {
    return { initBoxPos: 10 };
  },
  components: { MovingText },
  mounted() {
    // initial values
    const multiplier = 4;
    const fixedDecimal = 2;
    const fontSize = 20;
    const strokeWidth = 3;
    const dash = 3;
    const fixed = true;
    const withLabel = false;

    // create board
    const board = JXG.JSXGraph.initBoard("MovingDownUp", {
      boundingbox: [-15, 15, 15, -15],
      axis: true,
      keepAspectRatio: true,
      showCopyright: false
    });
    const board_control = JXG.JSXGraph.initBoard("control", {
      boundingbox: [0, 15, 15, 0],
      showCopyright: false
    });
    board_control.addChild(board);

    // create sliders
    const u1 = board_control.create(
      "slider",
      [
        [2, 13],
        [12, 13],
        [0, 0.2, 1]
      ],
      { withLabel }
    );
    board_control.create(
      "text",
      [
        3,
        14,
        () => {
          const value = parseFloat(u1.Value().toFixed(fixedDecimal));
          return "&mu;_1: " + value;
        }
      ],
      { fontSize, fixed }
    );
    const input1 = board_control.create("input", [7, 14, "", ""], { cssStyle: "width: 50px" });
    board_control.create("button", [
      8,
      14,
      "Update",
      () => {
        if (Number(input1.Value())) force_a.setValue(Number(input1.Value()));
      }
    ]);

    const u2 = board_control.create(
      "slider",
      [
        [2, 11],
        [12, 11],
        [0, 0.3, 1]
      ],
      { withLabel }
    );
    board_control.create(
      "text",
      [
        3,
        12,
        () => {
          const value = parseFloat(u2.Value().toFixed(fixedDecimal));
          return "&mu;_2: " + value;
        }
      ],
      { fontSize, fixed }
    );
    const input2 = board_control.create("input", [7, 12, "", ""], { cssStyle: "width: 50px" });
    board_control.create("button", [
      8,
      12,
      "Update",
      () => {
        if (Number(input2.Value())) u2.setValue(Number(input2.Value()));
      }
    ]);

    const theta = board_control.create(
      "slider",
      [
        [2, 9],
        [12, 9],
        [15, 45, 60]
      ],
      { withLabel }
    );
    board_control.create(
      "text",
      [
        3,
        10,
        () => {
          const value = parseFloat(theta.Value().toFixed(fixedDecimal));
          return "\u03B8: " + value + "\u00B0";
        }
      ],
      { fontSize, fixed }
    );
    const input3 = board_control.create("input", [7, 10, "", ""], { cssStyle: "width: 50px" });
    board_control.create("button", [
      8,
      10,
      "Update",
      () => {
        if (Number(input3.Value())) theta.setValue(Number(input3.Value()));
      }
    ]);

    const M = board_control.create(
      "slider",
      [
        [2, 7],
        [12, 7],
        [1, 1, 10]
      ],
      { withLabel }
    );
    board_control.create(
      "text",
      [
        3,
        8,
        () => {
          const value = parseFloat(M.Value().toFixed(fixedDecimal));
          return "M: " + value;
        }
      ],
      { fontSize, fixed }
    );
    const input4 = board_control.create("input", [7, 8, "", ""], { cssStyle: "width: 50px" });
    board_control.create("button", [
      8,
      8,
      "Update",
      () => {
        if (Number(input4.Value())) M.setValue(Number(input4.Value()));
      }
    ]);

    const W = board_control.create(
      "slider",
      [
        [2, 5],
        [12, 5],
        [0, 1, 10]
      ],
      { withLabel }
    );
    board_control.create(
      "text",
      [
        3,
        6,
        () => {
          const value = parseFloat(W.Value().toFixed(fixedDecimal));
          return "W: " + value;
        }
      ],
      { fontSize, fixed }
    );
    const input5 = board_control.create("input", [7, 6, "", ""], { cssStyle: "width: 50px" });
    board_control.create("button", [
      8,
      6,
      "Update",
      () => {
        if (Number(input5.Value())) W.setValue(Number(input5.Value()));
      }
    ]);

    // create stable part
    const p1 = board.create("point", [-5, -10], { fixed: true, visible: false });
    const p2 = board.create(
      "point",
      [
        () => {
          return Math.cos((theta.Value() * Math.PI) / 180) * 21 - 5;
        },
        -10
      ],
      { fixed: true, visible: false }
    );
    const p3 = board.create(
      "point",
      [
        () => {
          return Math.cos((theta.Value() * Math.PI) / 180) * 21 - 5;
        },
        () => {
          return Math.sin((theta.Value() * Math.PI) / 180) * 21 - 10;
        }
      ],
      { fixed: true, visible: false }
    );

    const line = board.create("line", [p1, p3], { visible: false });
    const triangle = board.create("polygon", [p1, p2, p3]);
    const circle = board.create("circle", [p3, 1], { fillColor: "#0000FF" });
    const angle = board.create("nonreflexangle", [p2, p1, p3], { radius: 3, name: "&Theta;" });
    const u1_text = board.create("text", [0, -1, "&mu;_1"], { anchor: line });
    const u2_text = board.create("text", [0.5, 1.5, "&mu;_2"], { anchor: p3 });

    // calculate the x and y coord given angle
    const x = (mult = 1) => {
      return mult * Math.cos((theta.Value() * Math.PI) / 180) - 5;
    };
    const y = (mult = 1) => {
      return mult * Math.sin((theta.Value() * Math.PI) / 180) - 10;
    };

    // create transform
    const right = board.create("transform", [2, 0], { type: "translate" });
    const up = board.create("transform", [0, 2], { type: "translate" }); // create block

    // create left box
    const box1 = [];
    box1[0] = board.create(
      "point",
      [
        () => {
          return x(this.initBoxPos);
        },
        () => {
          return y(this.initBoxPos);
        }
      ],
      { visible: false }
    );

    const rot = board.create(
      "transform",
      [
        () => {
          return (theta.Value() * Math.PI) / 180;
        },
        box1[0]
      ],
      { type: "rotate" }
    );

    box1[1] = board.create("point", [box1[0], right], { visible: false });
    box1[2] = board.create("point", [box1[0], [right, up]], { visible: false });
    box1[3] = board.create("point", [box1[0], up], { visible: false });

    // create string point
    const top_half = board.create("transform", [0, 1], { type: "translate" });
    const right_half = board.create(
      "transform",
      [
        () => {
          return (p3.X() - box1[0].X()) / Math.cos((theta.Value() * Math.PI) / 180);
        },
        0
      ],
      { type: "translate" }
    );

    box1[4] = board.create("point", [box1[0], [right, top_half]], { visible: false });
    box1[5] = board.create("point", [box1[0], [right_half, top_half]], { visible: false });
    const string_left = board.create("line", [box1[4], box1[5]], { straightFirst: false, straightLast: false });

    // create polygon and apply rotation
    const box1Poly = board.create("polygon", box1.slice(0, 4), { fillColor: "red" });
    rot.bindTo(box1.slice(1));
    board.update();

    // create weight
    const box2 = [];
    box2[0] = board.create(
      "point",
      [
        () => {
          return p3.X() + 0.1;
        },
        () => {
          return p3.Y() - (p3.Y() - p2.Y()) / 2;
        }
      ],
      { visible: false }
    );
    box2[1] = board.create("point", [box2[0], right], { visible: false });
    box2[2] = board.create("point", [box2[0], [right, top_half]], { visible: false });
    box2[3] = board.create("point", [box2[0], top_half], { visible: false });

    // create string for weight
    box2[4] = board.create("point", [box2[0], board.create("transform", [1, 1], { type: "translate" })], { visible: false });
    box2[5] = board.create("point", [p3, board.create("transform", [1, 0], { type: "translate" })], { visible: false });
    const string_right = board.create("line", [box2[4], box2[5]], { straightFirst: false, straightLast: false });

    const box2Poly = board.create("polygon", box2.slice(0, 4), { fillColor: "red" });

    // need to figure out the relation equation?????????????????
    const button = board.create("button", [
      1,
      2,
      "aaa",
      () => {
        setInterval(() => {
          this.initBoxPos -= 0.1;
          board.update();
        }, 100);
      }
    ]);
  }
};
export const meta = {
  title: "Moving downward or upward",
  description: "Non sense"
};
</script>
