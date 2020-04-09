<template>
  <div style="margin:20px">
    <h1 class="text-danger text-center my-4">Friction on a slope</h1>
    <SlopeText></SlopeText>
    <div class="row">
      <div class="col-xl-6 mx-2">
        <div class="ml-5 my-4">
          <strong
            >Increase <vue-mathjax formula="(\theta_0)" />: <span class="mx-4">{{ parseFloat(this.angle.toFixed(1)) }} &deg;</span></strong
          >
        </div>
        <div class="ml-5 my-4">
          <button class="btn" @click="playAnimation">
            <i v-if="!animeOn" class="fas fa-play"></i>
            <i v-if="animeOn" class="fas fa-pause"></i>
          </button>
          <button class="btn" @click="resetAnimation"><i class="fas fa-redo"> </i></button>
        </div>
        <div class="ml-5 my-4">
          <strong>Show FBD: </strong>
          <input type="radio" class="mx-3" @click="toggleFBD(true)" name="FBD" />on
          <input type="radio" class="mx-3" name="FBD" @click="toggleFBD(false)" checked />off
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
      board: undefined,
      mu: undefined,
      m: undefined,
      angle: 0,
      slide_percentage: 0.7,
      animeOn: false,
      polygon_color: "red",
      showFBD: false
    };
  },

  components: { SlopeText },

  mounted() {
    // initial values
    const multiplier = 4;
    const fixedDecimal = 1;
    const fontSize = 20;
    const strokeWidth = 3;
    const dash = 3;
    const fixed = true;
    const withLabel = false;

    // module specific values
    const origin_pos = [-7, -2];
    const ground_line_length = 15;
    const end_pos = [-7 + ground_line_length, -2];

    // create board
    this.board = JXG.JSXGraph.initBoard("friction", { boundingbox: [-15, 15, 15, -15], keepAspectRatio: true, showCopyright: false, axis: false });
    const board_control = JXG.JSXGraph.initBoard("control", {
      boundingbox: [0, 15, 15, 0],
      showCopyright: false
    });
    board_control.addChild(this.board);

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

    // stop on slider changes
    this.m.on("drag", () => {
      this.resetAnimation();
    });
    this.mu.on("drag", () => {
      this.resetAnimation();
    });

    // fixed ground line
    const origin = this.board.create("point", origin_pos, { visible: false, fixed });
    const end = this.board.create("point", end_pos, { visible: false, fixed });
    const ground_line = this.board.create("line", [origin, end], {
      straightFirst: false,
      straightLast: false,
      strokeWidth,
      fixed
    });
    this.board.create("comb", [end_pos, origin_pos]);

    // moving elevating line
    const rot_trans = this.board.create(
      "transform",
      [
        () => {
          return (this.angle / 180) * Math.PI;
        },
        origin
      ],
      { type: "rotate" }
    );
    const elevate_line = this.board.create("line", [ground_line, rot_trans], { straightFirst: false, straightLast: false, strokeWidth });

    // make box
    const horizon_trans = this.board.create(
      "transform",
      [
        () => {
          return 1 + this.m.Value() / 5;
        },
        0
      ],
      { type: "translate" }
    );
    const vert_trans = this.board.create(
      "transform",
      [
        0,
        () => {
          return 1 + this.m.Value() / 5;
        }
      ],
      { type: "translate" }
    );

    const left_bot_point = this.board.create(
      "point",
      [
        () => {
          return Math.cos((this.angle / 180) * Math.PI) * ground_line_length * this.slide_percentage + origin_pos[0];
        },
        () => {
          return Math.sin((this.angle / 180) * Math.PI) * ground_line_length * this.slide_percentage + origin_pos[1];
        }
      ],
      { visible: false, fixed }
    );

    const rot_trans_box = this.board.create(
      "transform",
      [
        () => {
          return (this.angle / 180) * Math.PI;
        },
        left_bot_point
      ],
      { type: "rotate" }
    );

    const right_bot_point = this.board.create("point", [left_bot_point, [horizon_trans, rot_trans_box]], { visible: false, fixed });
    const right_top_point = this.board.create("point", [left_bot_point, [horizon_trans, vert_trans, rot_trans_box]], { visible: false, fixed });
    const left_top_point = this.board.create("point", [left_bot_point, [vert_trans, rot_trans_box]], { visible: false, fixed });
    this.board.create("polygon", [left_bot_point, right_bot_point, right_top_point, left_top_point], {
      fillColor: () => {
        return this.polygon_color;
      }
    });

    // make angle
    this.board.create("angle", [end, origin, left_bot_point], {
      radius: 5,
      name: () => {
        if (this.angle == 0) return "";
        return "\u03B8";
      },
      fillColor: () => {
        return this.polygon_color;
      }
    });

    // Show FBD
    this.board.create(
      "text",
      [
        -13,
        11,
        () => {
          const value = this.m.Value() * 9.8;

          return "mg: " + parseFloat(value.toFixed(fixedDecimal)) + "N";
        }
      ],
      {
        visible: () => {
          return this.showFBD;
        },
        fontSize,
        fixed,
        cssStyle: "font-weight: bold"
      }
    );
    this.board.create(
      "text",
      [
        -13,
        10,
        () => {
          // need to find current theta
          const angle = 0;
          const value = this.m.Value() * 9.8 * Math.sin((angle * Math.PI) / 180);

          return "mgsin(\u03B8): " + parseFloat(value.toFixed(fixedDecimal)) + "N";
        }
      ],
      {
        visible: () => {
          return this.showFBD;
        },
        fontSize,
        fixed,
        cssStyle: "font-weight: bold"
      }
    );
    this.board.create(
      "text",
      [
        -13,
        9,
        () => {
          // need to find current theta
          const angle = 1;
          const value = this.m.Value() * 9.8 * Math.sin((angle * Math.PI) / 180);

          return "mgcos(\u03B8): " + parseFloat(value.toFixed(fixedDecimal)) + "N";
        }
      ],
      {
        visible: () => {
          return this.showFBD;
        },
        fontSize,
        fixed,
        cssStyle: "font-weight: bold"
      }
    );
    this.board.create(
      "text",
      [
        -13,
        8,
        () => {
          // need to find friction
          const value = 1;

          return "f: " + parseFloat(value.toFixed(fixedDecimal)) + "N";
        }
      ],
      {
        visible: () => {
          return this.showFBD;
        },
        fontSize,
        fixed,
        cssStyle: "font-weight: bold"
      }
    );
    this.board.create(
      "text",
      [
        -13,
        7,
        () => {
          // need to find normal force
          const value = 1;

          return "N: " + parseFloat(value.toFixed(fixedDecimal)) + "N";
        }
      ],
      {
        visible: () => {
          return this.showFBD;
        },
        fontSize,
        fixed,
        cssStyle: "font-weight: bold"
      }
    );
    this.board.create(
      "text",
      [
        -13,
        6,
        () => {
          const value = this.findAngle();

          return "\u03B8_0: " + parseFloat(value.toFixed(fixedDecimal)) + "\u00B0";
        }
      ],
      {
        visible: () => {
          return this.showFBD;
        },
        fontSize,
        fixed,
        cssStyle: "font-weight: bold"
      }
    );
  },
  methods: {
    async playAnimation() {
      // only on once
      if (this.animeOn) {
        this.animeOn = false;
        return;
      }

      this.polygon_color = "red";
      const equilibrium = this.findAngle();
      this.animeOn = true;

      // last run was finished
      if (this.slide_percentage <= 0.1) {
        this.polygon_color = "red";
        this.slide_percentage = 0.7;
        this.angle = 0;
        this.board.fullUpdate();
      }

      // elevating
      while (this.angle < equilibrium && this.animeOn) {
        this.angle += 0.5;
        this.board.fullUpdate();
        await this.sleep(30);
      }
      if (!this.animeOn) {
        return;
      }
      this.angle = equilibrium;
      this.board.fullUpdate();
      this.polygon_color = "green";

      // change from static friction to dynamic friction, the friction constant decreases. Making it 0.95 less
      const friction = 0.95 * this.mu.Value() * Math.cos((this.angle * Math.PI) / 180) * this.m.Value() * 9.8;
      const down_force = Math.sin((this.angle * Math.PI) / 180) * this.m.Value() * 9.8;
      const force = down_force - friction;
      const acceleration = force / this.m.Value(); // range from 0 - 0.408
      let velocity = 0;

      // sliding down
      let timeout = 0; // control timeout
      while (this.slide_percentage > 0.1 && this.animeOn && timeout <= 200) {
        // need to calculate acceleration here
        this.slide_percentage -= velocity;
        velocity += acceleration / 700;
        this.board.fullUpdate();
        await this.sleep(50);
        timeout += 1;
      }
      this.animeOn = false;
    },
    async resetAnimation() {
      this.animeOn = false;
      await this.sleep(50);
      this.polygon_color = "red";
      this.slide_percentage = 0.7;
      this.angle = 0;
      this.board.fullUpdate();
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    findAngle() {
      return (Math.atan(this.mu.Value()) * 180) / Math.PI;
    },
    toggleFBD(toggleShow) {
      this.showFBD = toggleShow ? true : false;
      this.board.fullUpdate();
    }
  }
};
export const meta = {
  title: "Friction on a slope",
  description: "joint"
};
</script>
