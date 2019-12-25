<template>
  <div>
    <div id="friction" class="jsx-graph"></div>
  </div>
</template>

<script>
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
  mounted() {
    const board = JXG.JSXGraph.initBoard("friction", { boundingbox: [-15, 15, 15, -15], keepAspectRatio: true, showCopyright: false });
    this.mu = board.create("slider", [[-5, 10], [0, 10], [0, 1, 1.5]], { name: "&mu;" });
    this.m = board.create("slider", [[-5, 8], [0, 8], [1, 1, 10]], { name: "m" });
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
