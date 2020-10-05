<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Free Body Diagram of Beam</h1>
    <FBDtext></FBDtext>
    <div class="row my-3">
      <div class="col-xl-6 container">
        <div class="mt-3 row">
          <div class="col">Types of Beam</div>
          <div class="col"><input type="radio" class="mx-3" name="isCantilever" checked @click="handleBeam(0)" /> Cantilever</div>
          <div class="col"><input type="radio" class="mx-3" name="isCantilever" @click="handleBeam(1)" /> Simple Supported</div>
        </div>
        <div class="mt-3 row">
          <div class="col">Types of Loading</div>
          <div class="col"><input type="radio" class="mx-3" name="isForce" checked @click="handleLoading(0)" /> Force</div>
          <div class="col"><input type="radio" class="mx-3" name="isForce" @click="handleLoading(1)" /> Moment</div>
        </div>
        <div id="control" class="" style="height:180px"></div>
      </div>
      <div id="FBD_BEAM" class="jsx-graph col-xl-6"></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import FBDtext from "../../utils/FBD_Beam/FBD_text";

export default {
  name: "cant_force",
  components: {
    FBDtext
  },
  data() {
    return {
      position: undefined,
      magnitude: undefined,
      direction: undefined,
      board: undefined,
      board_control: undefined,
      showReactive: true,
      beam_types: [
        { fix_line: undefined, fix_comb: undefined },
        {
          pin_circ: undefined,
          pin_body: undefined,
          pin_comb: undefined,
          roller_circ: undefined,
          roller_line: undefined,
          roller_comb: undefined
        }
      ],
      isForce: true,
      isCantilever: true
    };
  },
  mounted() {
    // create style and global parameters
    const fixedDecimal = 3;
    const x_shift = -5;
    const y_shift = 10;
    const y_react_shift = -10;
    const moment_radius = 1.5;
    const fontSize = 16;
    const strokeColor = "red";
    const dash = 3;

    const react_visible = () => {
      return this.showReactive;
    };

    const multiplier = 3;

    // create board
    this.board = JXG.JSXGraph.initBoard("FBD_BEAM", { boundingbox: [-15, 15, 15, -15], keepAspectRatio: true, showCopyright: false });
    this.board_control = JXG.JSXGraph.initBoard("control", {
      boundingbox: [0, 15, 15, 10],
      showCopyright: false,
      pan: { enabled: false },
      zoom: { enabled: false },
      showNavigation: false,
      showZoom: false
    });
    this.board_control.addChild(this.board);

    // create inputs
    this.position = this.board_control.create(
      "slider",
      [
        [5, 14],
        [10, 14],
        [0, 0.5, 1]
      ],
      { withLabel: false }
    );
    this.board_control.create(
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

    this.magnitude = this.board_control.create(
      "slider",
      [
        [5, 13],
        [10, 13],
        [0, 1, 2]
      ],
      { withLabel: false }
    );
    this.board_control.create(
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

    this.direction = this.board_control.create(
      "slider",
      [
        [5, 12],
        [10, 12],
        [0, 90, 180]
      ],
      { withLabel: false }
    );
    this.board_control.create(
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

    const showReactive = this.board_control.create("button", [
      0,
      11,
      "Show Reactive",
      () => {
        this.showReactive = this.showReactive ? false : true;
      }
    ]);

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
    const cantilever = this.beam_types[0];
    const fix_p1_left = this.board.create("point", [0 + x_shift, 1.5 + y_shift], { fixed: true, visible: false });
    const fix_p2_left = this.board.create("point", [0 + x_shift, -1.5 + y_shift], { fixed: true, visible: false });
    cantilever.fix_line = this.board.create("line", [fix_p1_left, fix_p2_left], { straightFirst: false, straightLast: false, strokeColor: "black" });
    cantilever.fix_comb = this.board.create("comb", [fix_p2_left, fix_p1_left], { strokeColor: "black" });

    const simple_supported = this.beam_types[1];
    const pin_p1_left = this.board.create("point", [-0.3 + x_shift, 0 + y_shift], { fixed: true, visible: false });
    const pin_p2_left = this.board.create("point", [0.3 + x_shift, 0 + y_shift], { fixed: true, visible: false });
    const pin_p3_left = this.board.create("point", [1 + x_shift, -1.5 + y_shift], { fixed: true, visible: false });
    const pin_p4_left = this.board.create("point", [-1 + x_shift, -1.5 + y_shift], { fixed: true, visible: false });
    simple_supported.pin_circ = this.board.create("circle", [[0 + x_shift, 0 + y_shift], 0.3], {
      fillColor: "red",
      fixed: true,
      strokeColor: "black"
    });
    simple_supported.pin_body = this.board.create("polygon", [pin_p1_left, pin_p2_left, pin_p3_left, pin_p4_left], {
      fillColor: "red",
      strokeColor: "black"
    });
    simple_supported.pin_comb = this.board.create("comb", [pin_p3_left, pin_p4_left]);

    // create base fixed on the right side
    const roller_p1 = this.board.create("point", [9.4 + x_shift, -1.6 + y_shift], { fixed: true, visible: false });
    const roller_p2 = this.board.create("point", [10.6 + x_shift, -1.6 + y_shift], { fixed: true, visible: false });
    simple_supported.roller_circ = this.board.create("circle", [[10 + x_shift, -1.3 + y_shift], 0.3], {
      fillColor: "red",
      fixed: true,
      strokeColor: "#ffffff"
    });
    simple_supported.roller_line = this.board.create("line", [roller_p1, roller_p2], {
      straightFirst: false,
      straightLast: false,
      strokeColor: "black"
    });
    simple_supported.roller_comb = this.board.create("comb", [roller_p2, roller_p1]);
    this.handleBeam(0);

    // create quator line
    this.board.create(
      "line",
      [
        [x_shift, y_shift],
        [x_shift + 10, y_shift]
      ],
      { dash, straightFirst: false, straightLast: false }
    );

    // create force
    const F_0 = this.board.create(
      "point",
      [
        () => {
          return this.position.Value() * 10 + x_shift;
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
      straightFirst: false,
      straightLast: false,
      firstArrow: true,
      strokeWidth: 3,
      visible: () => {
        return this.isForce === true;
      }
    });
    const forceLineLabel = this.board.create("text", [1, 1, "F"], {
      anchor: forceLine,
      visible: () => {
        return this.isForce === true;
      }
    });

    // create moment
    const F_Curve = this.board.create(
      "curve",
      [
        function(t) {
          return 2 * Math.sin(t) + F_0.X();
        },
        function(t) {
          return 2 * Math.cos(t) + y_shift;
        },
        () => {
          return ((-this.magnitude.Value() * 3) / 8 + 0.5) * Math.PI;
        },
        () => {
          return ((this.magnitude.Value() * 3) / 8 + 0.5) * Math.PI;
        }
      ],
      {
        strokeWidth: 3,
        lastArrow: true,
        visible: () => {
          return this.isForce === false;
        }
      }
    );
    const F_Curve_Label = this.board.create("text", [3, 0, "M"], {
      anchor: F_0,
      visible: () => {
        return this.isForce === false;
      }
    });

    // reactive forces
    // translating variables

    const react_F_0 = this.board.create("line", [forceLine, react_trans], {
      straightFirst: false,
      straightLast: false,
      firstArrow: true,
      strokeWidth: 3,
      visible: () => {
        return react_visible() && this.isForce === true;
      }
    });
    const react_Moment_0 = this.board.create("curve", [F_Curve, react_trans], {
      strokeWidth: 3,
      lastArrow: true,

      visible: () => {
        return react_visible() && this.isForce === false;
      }
    });

    // create MA curve from cant force
    const get_MA_Val = () => {
      let val = 0;
      if (this.isCantilever) {
        if (this.isForce) {
          val = -this.position.Value() * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
        } else {
          val = -this.magnitude.Value();
        }
      }
      return val;
    };
    const MA_Curve = this.board.create(
      "curve",
      [
        function(t) {
          return -2 * Math.sin(t) + x_shift;
        },
        function(t) {
          return -2 * Math.cos(t) + y_shift + y_react_shift;
        },
        () => {
          let val = get_MA_Val();
          return ((val * 3) / 8 + 0.5) * Math.PI;
        },
        () => {
          let val = -get_MA_Val();
          return ((val * 3) / 8 + 0.5) * Math.PI;
        }
      ],
      {
        strokeWidth: 3,
        firstArrow: true,
        strokeColor: "red",
        visible: () => {
          return react_visible() && this.isCantilever;
        }
      }
    );

    const MA_Text = this.board.create("text", [-3 + x_shift, 0.5 + y_shift + y_react_shift, "M_A"], {
      visible: () => {
        return react_visible() && this.isCantilever;
      }
    });

    // create ax line from cant force
    const get_Ax_Val = () => {
      let val = 0;
      if (this.isCantilever) {
        if (this.isForce) {
          val = this.magnitude.Value() * Math.cos((this.direction.Value() / 180) * Math.PI);
        } else {
          val = 0;
        }
      } else {
        if (this.isForce) {
          val = this.magnitude.Value() * Math.cos((this.direction.Value() / 180) * Math.PI);
        } else {
          val = 0;
        }
      }
      return val;
    };
    const Ax_Line = this.board.create(
      "line",
      [
        [
          () => {
            let val = get_Ax_Val() * multiplier;
            if (Math.abs(val) < Math.pow(10, -7)) val = 0;
            return -Math.abs(val) + x_shift - 1;
          },
          y_shift + y_react_shift
        ],
        [-0.5 + x_shift, y_shift + y_react_shift]
      ],
      {
        straightFirst: false,
        straightLast: false,
        lastArrow: true,
        strokeWidth: 3,
        strokeColor: "red",
        visible: react_visible
      }
    );

    const Ax_Line_Label = this.board.create("text", [1, 0, "A_x"], {
      anchor: Ax_Line,
      visible: react_visible
    });

    // create ay line from cant force
    const get_Ay_Val = () => {
      let val = 0;
      if (this.isCantilever) {
        if (this.isForce) {
          val = this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
        } else {
          val = 0;
        }
      } else {
        if (this.isForce) {
          val = (1 - this.position.Value()) * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
        } else {
          val = -this.magnitude.Value();
        }
      }
      return val;
    };

    const Ay_Line = this.board.create(
      "line",
      [
        [x_shift, -1.25 + y_shift + y_react_shift],
        [
          x_shift,
          () => {
            let val = get_Ay_Val() * multiplier;
            if (Math.abs(val) < Math.pow(10, -7)) val = 0;
            if (val > 0) {
              return -val - 1.5 + y_shift + y_react_shift;
            } else {
              return val - 1.5 + y_shift + y_react_shift;
            }
          }
        ]
      ],
      {
        straightFirst: false,
        straightLast: false,
        firstArrow: true,
        strokeWidth: 3,
        strokeColor: "red",
        visible: react_visible
      }
    );

    const Ay_Line_Label = this.board.create("text", [1, 0, "A_y"], { anchor: Ay_Line, visible: react_visible });

    // create by line from ss force
    const get_By_Val = () => {
      let val = 0;
      if (!this.isCantilever) {
        if (this.isForce) {
          val = this.position.Value() * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
        } else {
          val = this.magnitude.Value();
        }
      }
      return val;
    };
    const By_Line = this.board.create(
      "line",
      [
        [10 + x_shift, -1.25 + y_shift + y_react_shift],
        [
          10 + x_shift,
          () => {
            let val = get_By_Val() * multiplier;
            if (Math.abs(val) < Math.pow(10, -7)) val = 0;
            return -val - 1.25 + y_shift + y_react_shift;
          }
        ]
      ],
      {
        straightFirst: false,
        straightLast: false,
        firstArrow: true,
        strokeWidth: 3,
        strokeColor: "red",
        visible: () => {
          return react_visible() && !this.isCantilever;
        }
      }
    );

    const By_Line_Label = this.board.create("text", [1, 0, "B_y"], {
      anchor: By_Line,
      visible: () => {
        return react_visible() && !this.isCantilever;
      }
    });

    // text
    const MA = this.board_control.create(
      "text",
      [
        2,
        11,
        () => {
          if (!this.isCantilever) return "";

          let val = get_MA_Val();
          if (this.isForce) {
            val = -val;
          }
          if (Math.abs(val) < Math.pow(10, -7)) val = 0;
          return "M_A = " + parseFloat(val.toFixed(fixedDecimal)) + "kNm";
        }
      ],
      {
        visible: () => {
          return react_visible() && this.isCantilever;
        },
        fontSize
      }
    );

    const Ax = this.board_control.create(
      "text",
      [
        4,
        11,
        () => {
          let val = get_Ax_Val();
          if (Math.abs(val) < Math.pow(10, -7)) val = 0;
          return "A_x = " + parseFloat(val.toFixed(fixedDecimal)) + "kN";
        }
      ],
      { visible: react_visible, fontSize }
    );
    const Ay = this.board_control.create(
      "text",
      [
        6,
        11,
        () => {
          let val = get_Ay_Val();
          if (Math.abs(val) < Math.pow(10, -7)) val = 0;
          return "A_y = " + parseFloat(val.toFixed(fixedDecimal)) + "kN";
        }
      ],
      {
        visible: react_visible,
        fontSize
      }
    );
    const By = this.board_control.create(
      "text",
      [
        8,
        11,
        () => {
          if (this.isCantilever) return "";

          let val = get_By_Val();
          if (Math.abs(val) < Math.pow(10, -7)) val = 0;
          return "B_y = " + parseFloat(val.toFixed(fixedDecimal)) + "kN";
        }
      ],
      {
        visible: () => {
          return react_visible() && !this.isCantilever;
        },
        fontSize
      }
    );
    this.showReactive = false;
    this.board.fullUpdate();
    this.board_control.fullUpdate();
  },
  methods: {
    handleBeam(toBeExcluded) {
      this.isCantilever = toBeExcluded === 0 ? true : false;

      for (let i in this.beam_types) {
        if (Number(i) === toBeExcluded) {
          for (let j in this.beam_types[i]) {
            this.beam_types[i][j].setAttribute({ visible: true });
          }
          continue;
        }
        for (let j in this.beam_types[i]) {
          this.beam_types[i][j].setAttribute({ visible: false });
        }
      }
      this.board_control.fullUpdate();
    },
    handleLoading(index) {
      this.isForce = index == 0 ? true : false;
      this.board.fullUpdate();
      this.board_control.fullUpdate();
    }
  }
};

export const meta = {
  title: "Free Body Diagram of Beam",
  description: "FBD",
  number: 18
};
</script>
