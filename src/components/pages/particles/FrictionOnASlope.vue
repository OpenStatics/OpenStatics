<template>
  <div style="margin:20px">
    <h1 class="text-danger text-center my-4">Friction on a slope</h1>
    <SlopeText></SlopeText>
    <div class="row">
      <div class="col-xl-6 mx-2">
        <div class="ml-5 my-4">
          <strong>Increase <vue-mathjax formula="(\theta_0)" />: <span class="mx-4">[value here]</span></strong>
        </div>
        <div class="ml-5 my-4">
          <strong>Show FBD: </strong>
          <input type="radio" class="mx-3" />on <input type="radio" class="mx-3" />off
        </div>

        <div id="control" style="height:500px;width:100%" class="mx-2"></div>
      </div>
      <div id="friction" class="jsx-graph col-xl mx-2"></div>
    </div>
  </div>
</template>

<script>
import SlopeText from "../../utils/slope/SlopeText";

export default {
  data() {
    return {
      distance: 10,
      boxLength: 2,
      angle: 0,
      dummy: undefined,
      m: undefined,
      mu: undefined,
      playButton: undefined,
      resetButton: undefined,
      toggle: false
    };
  },

  components: { SlopeText },

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
    const board = JXG.JSXGraph.initBoard("friction", { boundingbox: [-15, 15, 15, -15], keepAspectRatio: true, showCopyright: false });
    const board_control = JXG.JSXGraph.initBoard("control", {
      boundingbox: [0, 15, 15, 0],
      showCopyright: false
    });
    board_control.addChild(board);

    // create sliders
    this.mu = board_control.create(
      "slider",
      [
        [2, 13],
        [12, 13],
        [0, 1, 1.5]
      ],
      { withLabel }
    );
    board_control.create(
      "text",
      [
        3,
        14,
        () => {
          const value = parseFloat(this.mu.Value().toFixed(fixedDecimal));
          return "&mu;: " + value;
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
        if (Number(input1.Value())) this.mu.setValue(Number(input1.Value()));
      }
    ]);

    this.m = board_control.create(
      "slider",
      [
        [2, 11],
        [12, 11],
        [1, 1, 10]
      ],
      { withLabel }
    );
    board_control.create(
      "text",
      [
        3,
        12,
        () => {
          const value = parseFloat(this.m.Value().toFixed(fixedDecimal));
          return "m: " + value;
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
        if (Number(input2.Value())) this.m.setValue(Number(input2.Value()));
      }
    ]);

    // actual content

    this.dummy = board.create("point", [5, 5], { visible: false });

    const x_axis_point = board.create("point", [8, 0], { visible: false });
    const origin = board.create("point", [0, 0], { visible: false });

    const x = (mult = 1) => {
      return mult * Math.cos((this.angle * Math.PI) / 180);
    };
    const y = (mult = 1) => {
      return mult * Math.sin((this.angle * Math.PI) / 180);
    };
    const groundLine = board.create("line", [0, 0, 1], { fixed: true });
    const slopeLine = board.create(
      "line",
      [
        origin,
        [
          () => {
            return x();
          },
          () => {
            return y();
          }
        ]
      ],
      { fixed: true, straightFirst: false }
    );

    const a = board.create(
      "point",
      [
        () => {
          return x(this.distance);
        },
        () => {
          return y(this.distance);
        }
      ],
      { fixed: true }
    );

    const b = board.create(
      "point",
      [
        () => {
          return x(this.distance + this.boxLength);
        },
        () => {
          return y(this.distance + this.boxLength);
        }
      ],
      { fixed: true }
    );

    const c = board.create(
      "point",
      [
        () => {
          return x(this.distance + this.boxLength) - y(this.boxLength);
        },
        () => {
          return y(this.distance + this.boxLength) + x(this.boxLength);
        }
      ],
      { fixed: true }
    );

    const d = board.create(
      "point",
      [
        () => {
          return x(this.distance) - y(this.boxLength);
        },
        () => {
          return y(this.distance) + x(this.boxLength);
        }
      ],
      { fixed: true }
    );
    const box = board.create("polygon", [a, b, c, d]);
    this.playButton = board.create("button", [3, -2, "Play", this.playAnimation]);
    this.resetButton = board.create("button", [-3, -2, "reset", this.resetAnimation]);

    const angle = board.create("angle", [x_axis_point, origin, a], {
      radius: 4,
      name: () => {
        return "&Theta;: " + this.angle;
      }
    });
  },
  methods: {
    async playAnimation() {
      if (this.toggle) return;
      this.toggle = true;
      const equilibrium = this.findAngle();
      while (this.angle < equilibrium) {
        if (!this.toggle) return;
        this.angle += 0.25;
        this.dummy.moveTo([1, 1], 1000);
        await this.sleep(20);
      }
      for (let i = 0; i < this.distance * 10; i++) {
        if (!this.toggle) return;
        this.distance -= 0.1;
        this.dummy.moveTo([2, 2], 1000);
        await this.sleep(50);
      }
    },
    resetAnimation() {
      this.toggle = false;
      this.angle = 0;
      this.dummy.moveTo([5, 5]);
      this.distance = 10;
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    findAngle() {
      return (Math.atan(this.mu.Value()) * 180) / Math.PI;
    }
  }
};
export const meta = {
  title: "Friction on a slope",
  description: "joint"
};
</script>
