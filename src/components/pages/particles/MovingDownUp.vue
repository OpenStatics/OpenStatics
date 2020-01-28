<template>
  <div>
    <h1 class="text-danger text-center my-4">Moving downward or upward</h1>
    <div class="row">
      <div id="MovingDownUp" class="jsx-graph col-xl mx-2"></div>
      <div class="col-xl mx-2">
        Two blocks, M on the slope and W hanged, are connected by rope crossing through a drum. The slope has an inclination of angle \(\Theta\), the
        coefficient of static friction between M and slope is \(\mu_1\), and that between rope and drum is \(\mu_2\). Try to
        determine the critical values of W which lead to the break of equilibrium under different conditions, and compare with the given solution.
        Note that two critical values of W are involved which cause W move up or move down separately. 
      </div>
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
    const board = JXG.JSXGraph.initBoard("MovingDownUp", {
      boundingbox: [-15, 15, 15, -15],
      axis: true,
      keepAspectRatio: true,
      showCopyright: false
    });

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

    // create left box
    const box1 = [];
    box1[0] = board.create(
      "point",
      [
        () => {
          return x(this.test);
        },
        () => {
          return y(this.test);
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
          this.test -= 0.1;
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
