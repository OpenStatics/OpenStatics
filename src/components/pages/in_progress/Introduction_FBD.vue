<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Introduction to Free Body Diagram</h1>
    <IntroFBDText></IntroFBDText>
    <div class="row my-3">
      <div class="col-xl-6 container">
        <div class="mt-3 row">
          <div class="col">Reactive Force at Equilibrium</div>
          <div class="col"><input type="radio" class="mx-3" name="reactiveForce" @click="toggleReactive(1)" /> On</div>
          <div class="col"><input type="radio" class="mx-3" name="reactiveForce" checked @click="toggleReactive(0)" /> Off</div>
        </div>
        <div class="mt-3 row">
          <div class="col">Remove Roller</div>
          <div class="col"><input type="radio" class="mx-3" name="removeRoller" checked /> Yes</div>
          <div class="col"><input type="radio" class="mx-3" name="removeRoller" /> No</div>
        </div>
        <div id="control" class="" style="height:180px"></div>
      </div>
      <div id="introFBD" class="jsx-graph col-xl-6"></div>
    </div>
  </div>
</template>

<script>
import IntroFBDText from "../../utils/Intro_FBD/IntroFBDText";

export default {
  name: "introFBD",
  components: {
    IntroFBDText
  },
  data() {
    return {
      position: undefined,
      magnitude: undefined,
      direction: undefined,
      board: undefined,
      showReactive: false
    };
  },

  mounted() {
    // create style and global parameters
    const fixedDecimal = 1;
    const x_shift = -5;
    const y_shift = 10;
    const y_react_shift = -10;
    const moment_radius = 1.5;
    const fontSize = 16;
    const strokeColor = "red";
    const strokeWidth = 3;
    const dash = 3;
    const straightFirst = false;
    const straightLast = false;
    const firstArrow = true;

    const react_visible = () => {
      return this.showReactive;
    };

    const multiplier = 1.4;

    // create board
    this.board = JXG.JSXGraph.initBoard("introFBD", { boundingbox: [-15, 15, 15, -15], keepAspectRatio: true, showCopyright: false });
    const board_control = JXG.JSXGraph.initBoard("control", {
      boundingbox: [0, 15, 15, 10],
      showCopyright: false,
      pan: { enabled: false },
      zoom: { enabled: false },
      showNavigation: false,
      showZoom: false
    });
    board_control.addChild(this.board);

    // create inputs
    this.position = board_control.create(
      "slider",
      [
        [5, 14],
        [10, 14],
        [0, 2, 4]
      ],
      { withLabel: false }
    );
    board_control.create(
      "text",
      [
        0,
        14,
        () => {
          const value = parseFloat(this.position.Value().toFixed(fixedDecimal));
          return "Position of Loading (m):" + value;
        }
      ],
      { fontSize }
    );
    this.magnitude = board_control.create(
      "slider",
      [
        [5, 13],
        [10, 13],
        [0, 2, 4]
      ],
      { withLabel: false }
    );
    board_control.create(
      "text",
      [
        0,
        13,
        () => {
          const value = parseFloat(this.magnitude.Value().toFixed(fixedDecimal));
          return "Magnitude of Loading [kN]:" + value;
        }
      ],
      { fontSize }
    );
    this.direction = board_control.create(
      "slider",
      [
        [5, 12],
        [10, 12],
        [0, 90, 180]
      ],
      { withLabel: false }
    );
    board_control.create(
      "text",
      [
        0,
        12,
        () => {
          const value = parseFloat(this.direction.Value().toFixed(fixedDecimal));
          return "Direction of Force [degree]:" + value;
        }
      ],
      { fontSize }
    );

    // create rectangle
    const rec_a = this.board.create("point", [0 + x_shift, -1 + y_shift], { fixed: true, visible: false });
    const rec_b = this.board.create("point", [0 + x_shift, 1 + y_shift], { fixed: true, visible: false });
    const rec_c = this.board.create("point", [10 + x_shift, 1 + y_shift], { fixed: true, visible: false });
    const rec_d = this.board.create("point", [10 + x_shift, -1 + y_shift], { fixed: true, visible: false });
    const rectangle = this.board.create("polygon", [rec_a, rec_b, rec_c, rec_d], { strokeColor: "black" });

    // reactive force and moment base
    const react_trans = this.board.create("transform", [0, y_react_shift], { type: "translate" });
    const reactive_rec = this.board.create("polygon", [rectangle, react_trans], { vertices: { visible: false }, visible: react_visible });

    // create the base fixed on the left side
    const pin_p1_left = this.board.create("point", [-0.3 + x_shift, 0 + y_shift], { fixed: true, visible: false });
    const pin_p2_left = this.board.create("point", [0.3 + x_shift, 0 + y_shift], { fixed: true, visible: false });
    const pin_p3_left = this.board.create("point", [1 + x_shift, -1.5 + y_shift], { fixed: true, visible: false });
    const pin_p4_left = this.board.create("point", [-1 + x_shift, -1.5 + y_shift], { fixed: true, visible: false });
    this.board.create("circle", [[0 + x_shift, 0 + y_shift], 0.3], {
      fillColor: "red",
      fixed: true,
      strokeColor: "black"
    });
    this.board.create("polygon", [pin_p1_left, pin_p2_left, pin_p3_left, pin_p4_left], {
      fillColor: "red",
      strokeColor: "black"
    });
    this.board.create("comb", [pin_p3_left, pin_p4_left]);

    // create base fixed on the right side
    const roller_p1 = this.board.create("point", [9.4 + x_shift, -1.6 + y_shift], { fixed: true, visible: false });
    const roller_p2 = this.board.create("point", [10.6 + x_shift, -1.6 + y_shift], { fixed: true, visible: false });
    this.board.create("circle", [[10 + x_shift, -1.3 + y_shift], 0.3], {
      fillColor: "red",
      fixed: true,
      strokeColor: "#ffffff"
    });
    this.board.create("line", [roller_p1, roller_p2], {
      straightFirst,
      straightLast,
      strokeColor: "black"
    });
    this.board.create("comb", [roller_p2, roller_p1]);

    // create quator line
    this.board.create(
      "line",
      [
        [x_shift, y_shift],
        [x_shift + 10, y_shift]
      ],
      { dash, straightFirst, straightLast }
    );

    // create force
    const F_0 = this.board.create(
      "point",
      [
        () => {
          return this.position.Value() * 2.5 + x_shift;
        },
        y_shift
      ],
      { visible: false }
    );
    const F_1 = this.board.create(
      "point",
      [
        () => {
          return this.magnitude.Value() * Math.cos((this.direction.Value() / 180) * Math.PI) * multiplier + F_0.X();
        },
        () => {
          return this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI) * multiplier + F_0.Y();
        }
      ],
      {
        visible: false
      }
    );
    const forceLine = this.board.create("line", [F_0, F_1], {
      straightFirst,
      straightLast,
      firstArrow,
      strokeWidth
    });
    const forceLineLabel = this.board.create("text", [1, 1, "F"], {
      anchor: forceLine
    });

    // reactive forces
    const react_F_0 = this.board.create("line", [forceLine, react_trans], {
      straightFirst,
      straightLast,
      firstArrow,
      strokeWidth,
      visible: react_visible
    });

    // ax
    const Ax_Line = this.board.create(
      "line",
      [
        [
          () => {
            let val = this.magnitude.Value() * Math.cos((this.direction.Value() / 180) * Math.PI);
            if (Math.abs(val) < Math.pow(10, -7)) val = 0;
            return -2 * Math.abs(val) + x_shift;
          },
          y_shift + y_react_shift
        ],
        [0 + x_shift, 0 + y_shift + y_react_shift]
      ],
      {
        straightFirst,
        straightLast,
        firstArrow: () => {
          let val = this.magnitude.Value() * Math.cos((this.direction.Value() / 180) * Math.PI);
          if (Math.abs(val) < Math.pow(10, -7)) val = 0;
          return val < 0;
        },
        lastArrow: () => {
          let val = this.magnitude.Value() * Math.cos((this.direction.Value() / 180) * Math.PI);
          if (Math.abs(val) < Math.pow(10, -7)) val = 0;
          return val > 0;
        },
        strokeWidth,
        strokeColor,
        visible: react_visible
      }
    );

    const Ax_Line_Label = this.board.create("text", [-1, -0.5, "A_x"], { anchor: Ax_Line, visible: react_visible });

    const Ax = this.board.create(
      "text",
      [
        -10,
        -2,
        () => {
          let val = this.magnitude.Value() * Math.cos((this.direction.Value() / 180) * Math.PI);
          if (Math.abs(val) < Math.pow(10, -7)) val = 0;
          return "A_x = " + parseFloat(val.toFixed(fixedDecimal)) + "kNm";
        }
      ],
      { visible: react_visible }
    );

    // ay
    const Ay_Line = this.board.create(
      "line",
      [
        [x_shift, -1 + y_shift + y_react_shift],
        [
          x_shift,
          () => {
            let val = (1 - this.position.Value() / 4) * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
            if (Math.abs(val) < Math.pow(10, -7)) val = 0;
            return -2 * val - 1 + y_shift + y_react_shift;
          }
        ]
      ],
      { straightFirst, straightLast, firstArrow, strokeWidth, strokeColor, visible: react_visible }
    );

    const Ay_Line_Label = this.board.create("text", [1, 0, "A_y"], { anchor: Ay_Line, visible: react_visible });
    const Ay = this.board.create(
      "text",
      [
        -10,
        -4,
        () => {
          let val = (1 - this.position.Value() / 4) * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
          if (Math.abs(val) < Math.pow(10, -7)) val = 0;
          return "A_y = " + parseFloat(val.toFixed(fixedDecimal)) + "kN";
        }
      ],
      { visible: react_visible }
    );

    // by
    const By_Line = this.board.create(
      "line",
      [
        [10 + x_shift, -1 + y_shift + y_react_shift],
        [
          10 + x_shift,
          () => {
            let val = (this.position.Value() / 4) * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
            if (Math.abs(val) < Math.pow(10, -7)) val = 0;
            return -2 * val - 1 + y_shift + y_react_shift;
          }
        ]
      ],
      { straightFirst, straightLast, firstArrow, strokeWidth, strokeColor, visible: react_visible }
    );

    const By_Line_Label = this.board.create("text", [1, 0, "B_y"], { anchor: By_Line, visible: react_visible });
    const By = this.board.create(
      "text",
      [
        -10,
        -6,
        () => {
          let val = (this.position.Value() / 4) * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
          if (Math.abs(val) < Math.pow(10, -7)) val = 0;
          return "B_y = " + parseFloat(val.toFixed(fixedDecimal)) + "kN";
        }
      ],
      { visible: react_visible }
    );
  },
  methods: {
    toggleReactive(index) {
      this.showReactive = index === 0 ? false : true;
      this.board.fullUpdate();
    }
  }
};
export const meta = {
  title: "Introduction to Free Body Diagram",
  description: "ok",
  number: 17
};
</script>
