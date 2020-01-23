<template>
  <div>
    <h1 class="text-danger text-center my-4">Moving downward or upward</h1>
    <div class="row">
      <div id="fixFix" class="jsx-graph col-xl mx-2"></div>
      <div class="col-xl mx-2">Text Here</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Moving",
  data() {
    return { test: 10 };
  },
  mounted() {
    const board = JXG.JSXGraph.initBoard("fixFix", { boundingbox: [-15, 15, 15, -15], axis: true, keepAspectRatio: true, showCopyright: false });

    // create sliders
    const u1 = board.create("slider", [[-13, 12], [-2, 12], [0, 0.2, 1]], { name: "&mu;_1" });
    const u2 = board.create("slider", [[-13, 10], [-2, 10], [0, 0.3, 1]], { name: "&mu;_2" });
    const theta = board.create("slider", [[-13, 8], [-2, 8], [15, 45, 60]], { name: "&Theta;" });
    const M = board.create("slider", [[-13, 6], [-2, 6], [1, 1, 10]], { name: "M" });
    const W = board.create("slider", [[-13, 4], [-2, 4], [0, 1, 10]], { name: "W" });

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

    // create box
    const box1 = [];
    box1[0] = board.create("point", [
      () => {
        return x(this.test);
      },
      () => {
        return y(this.test);
      }
    ]);

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

    box1[1] = board.create("point", [box1[0], right]);
    box1[2] = board.create("point", [box1[0], [right, up]]);
    box1[3] = board.create("point", [box1[0], up]);
    const box1Poly = board.create("polygon", box1, { fillColor: "red" });
    rot.bindTo(box1.slice(1));
    board.update();

    const button = board.create("button", [
      1,
      2,
      "aaa",
      () => {
        setInterval(()=>{
          this.test -= 0.1
          board.update();
        },100)
      }
    ]);
  }
};
export const meta = {
  title: "Moving downward or upward",
  description: "Non sense"
};
</script>
