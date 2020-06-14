<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Free Body Diagram of Beam</h1>
    <FBDtext></FBDtext>
    <div class="row my-3">
      <div class="col-xl-6">
        <div class="my-3">
          <button class="btn btn-warning mx-3" @click="handleBeam(0)">Cantilever</button>
          <button class="btn btn-primary mx-3" @click="handleBeam(1)">Simple Supported</button>
        </div>
        <div>
          <button class="btn btn-warning mx-3">Force</button>
          <button class="btn btn-primary mx-3">Moment</button>
        </div>
        <div id="control" class="jsx-graph"></div>
      </div>
      <div id="FBD_BEAM" class="jsx-graph col-xl-6"></div>
    </div>
  </div>
</template>

<script>
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
      showReactive: false,
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
      ]
    };
  },
  mounted() {
    // create style and global parameters
    const fixedDecimal = 3;
    const x_shift = -5;
    const y_shift = 6;
    const y_react_shift = -12;
    const moment_radius = 1.5;
    const fontSize = 20;
    const strokeColor = "red";

    const react_visible = () => {
      return this.showReactive;
    };

    // create board
    this.board = JXG.JSXGraph.initBoard("FBD_BEAM", { boundingbox: [-15, 15, 15, -15], keepAspectRatio: true, showCopyright: false, axis: true });
    const board_control = JXG.JSXGraph.initBoard("control", {
      boundingbox: [0, 15, 15, 0],
      showCopyright: false,
      pan: { enabled: false },
      zoom: { enabled: false },
      showNavigation: false,
      showZoom: false,
      axis: true
    });
    board_control.addChild(this.board);

    // create inputs
    this.position = board_control.create(
      "slider",
      [
        [2, 13],
        [12, 13],
        [0, 0.5, 1]
      ],
      { withLabel: false }
    );
    board_control.create("text", [
      3,
      14,
      () => {
        const value = parseFloat(this.position.Value().toFixed(fixedDecimal));
        return "Position of Loading (m):" + value;
      }
    ]);

    this.magnitude = board_control.create(
      "slider",
      [
        [2, 11],
        [12, 11],
        [0, 1, 2]
      ],
      { withLabel: false }
    );
    board_control.create("text", [
      3,
      12,
      () => {
        const value = parseFloat(this.magnitude.Value().toFixed(fixedDecimal));
        return "Magnitude of Loading [kN]:" + value;
      }
    ]);

    this.direction = board_control.create(
      "slider",
      [
        [2, 9],
        [12, 9],
        [0, 90, 360]
      ],
      { withLabel: false }
    );
    board_control.create("text", [
      3,
      10,
      () => {
        const value = parseFloat(this.direction.Value().toFixed(fixedDecimal));
        return "Direction of Force [degree]:" + value;
      }
    ]);

    const showReactive = this.board.create("button", [
      8,
      4,
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
    const rectangle = this.board.create("polygon", [rec_a, rec_b, rec_c, rec_d]);

    // reactive force and moment base
    const react_trans = this.board.create("transform", [0, y_react_shift], { type: "translate" });
    const reactive_rec = this.board.create("polygon", [rectangle, react_trans], { vertices: { visible: false }, visible: react_visible });

    // create the base fixed on the left side
    const cantilever = this.beam_types[0];
    const fix_p1_left = this.board.create("point", [0 + x_shift, 1.5 + y_shift], { fixed: true, visible: false });
    const fix_p2_left = this.board.create("point", [0 + x_shift, -1.5 + y_shift], { fixed: true, visible: false });
    cantilever.fix_line = this.board.create("line", [fix_p1_left, fix_p2_left], { straightFirst: false, straightLast: false });
    cantilever.fix_comb = this.board.create("comb", [fix_p2_left, fix_p1_left]);

    const simple_supported = this.beam_types[1];
    const pin_p1_left = this.board.create("point", [-0.3 + x_shift, 0 + y_shift], { fixed: true, visible: false });
    const pin_p2_left = this.board.create("point", [0.3 + x_shift, 0 + y_shift], { fixed: true, visible: false });
    const pin_p3_left = this.board.create("point", [1 + x_shift, -1.5 + y_shift], { fixed: true, visible: false });
    const pin_p4_left = this.board.create("point", [-1 + x_shift, -1.5 + y_shift], { fixed: true, visible: false });
    simple_supported.pin_circ = this.board.create("circle", [[0 + x_shift, 0 + y_shift], 0.3], {
      fillColor: "red",
      fixed: true
    });
    simple_supported.pin_body = this.board.create("polygon", [pin_p1_left, pin_p2_left, pin_p3_left, pin_p4_left], {
      fillColor: "red"
    });
    simple_supported.pin_comb = this.board.create("comb", [pin_p3_left, pin_p4_left]);

    // create base fixed on the right side
    const roller_p1 = this.board.create("point", [9.4 + x_shift, -1.6 + y_shift], { fixed: true, visible: false });
    const roller_p2 = this.board.create("point", [10.6 + x_shift, -1.6 + y_shift], { fixed: true, visible: false });
    simple_supported.roller_circ = this.board.create("circle", [[10 + x_shift, -1.3 + y_shift], 0.3], { fillColor: "red", fixed: true });
    simple_supported.roller_line = this.board.create("line", [roller_p1, roller_p2], { straightFirst: false, straightLast: false });
    simple_supported.roller_comb = this.board.create("comb", [roller_p2, roller_p1]);
    this.handleBeam(0);
    

    // //
    // const F_0 = this.board.create(
    //   "point",
    //   [
    //     () => {
    //       return this.position.Value() * 10;
    //     },
    //     0
    //   ],
    //   { visible: false }
    // );
    // const F_1 = this.board.create(
    //   "point",
    //   [
    //     () => {
    //       return this.magnitude.Value() * Math.cos((this.direction.Value() / 180) * Math.PI) * 2 + F_0.X();
    //     },
    //     () => {
    //       return this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI) * 2 + F_0.Y();
    //     }
    //   ],
    //   {
    //     visible: false
    //   }
    // );
    // const forceLine = this.board.create("line", [F_0, F_1], { straightFirst: false, straightLast: false, firstArrow: true, strokeWidth: 3 });
    // const forceLineLabel = this.board.create("text", [1, 0, "F"], { anchor: forceLine });

    // const MA_Curve = this.board.create(
    //   "curve",
    //   [
    //     function(t) {
    //       return -2 * Math.sin(t);
    //     },
    //     function(t) {
    //       return -2 * Math.cos(t);
    //     },
    //     () => {
    //       let val = this.position.Value() * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
    //       return ((val * 3) / 8 + 0.5) * Math.PI;
    //     },
    //     () => {
    //       let val = -this.position.Value() * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
    //       return ((val * 3) / 8 + 0.5) * Math.PI;
    //     }
    //   ],
    //   {
    //     strokeWidth: 3,
    //     firstArrow: true
    //   }
    // );

    // const MA_Text = this.board.create("text", [-3, 0.5, "M_A"]);
    // const MA = this.board.create("text", [
    //   -10,
    //   -2,
    //   () => {
    //     let val = -this.position.Value() * this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
    //     if (Math.abs(val) < Math.pow(10, -7)) val = 0;
    //     return "M_A = " + parseFloat(val.toFixed(fixedDecimal)) + "kNm";
    //   }
    // ]);

    // const Ax_Line = this.board.create(
    //   "line",
    //   [
    //     [
    //       () => {
    //         let val = this.magnitude.Value() * Math.cos((this.direction.Value() / 180) * Math.PI);
    //         if (Math.abs(val) < Math.pow(10, -7)) val = 0;
    //         return -2 * Math.abs(val);
    //       },
    //       0
    //     ],
    //     [0, 0]
    //   ],
    //   {
    //     straightFirst: false,
    //     straightLast: false,
    //     firstArrow: () => {
    //       let val = this.magnitude.Value() * Math.cos((this.direction.Value() / 180) * Math.PI);
    //       if (Math.abs(val) < Math.pow(10, -7)) val = 0;
    //       return val < 0;
    //     },
    //     lastArrow: () => {
    //       let val = this.magnitude.Value() * Math.cos((this.direction.Value() / 180) * Math.PI);
    //       if (Math.abs(val) < Math.pow(10, -7)) val = 0;
    //       return val > 0;
    //     },
    //     strokeWidth: 3
    //   }
    // );

    // const Ax_Line_Label = this.board.create("text", [-1, -0.5, "A_x"]);

    // const Ax = this.board.create("text", [
    //   -10,
    //   -4,
    //   () => {
    //     let val = this.magnitude.Value() * Math.cos((this.direction.Value() / 180) * Math.PI);
    //     if (Math.abs(val) < Math.pow(10, -7)) val = 0;
    //     return "A_x = " + parseFloat(val.toFixed(fixedDecimal)) + "kN";
    //   }
    // ]);

    // const Ay_Line = this.board.create(
    //   "line",
    //   [
    //     [1, -1],
    //     [
    //       1,
    //       () => {
    //         let val = this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
    //         if (Math.abs(val) < Math.pow(10, -7)) val = 0;
    //         return -val - 1;
    //       }
    //     ]
    //   ],
    //   { straightFirst: false, straightLast: false, firstArrow: true, strokeWidth: 3 }
    // );

    // const Ay_Line_Label = this.board.create("text", [1, 0, "A_y"], { anchor: Ay_Line });
    // const Ay = this.board.create("text", [
    //   -10,
    //   -6,
    //   () => {
    //     let val = this.magnitude.Value() * Math.sin((this.direction.Value() / 180) * Math.PI);
    //     if (Math.abs(val) < Math.pow(10, -7)) val = 0;
    //     return "A_y = " + parseFloat(val.toFixed(fixedDecimal)) + "kN";
    //   }
    // ]);
  },
  methods: {
    handleBeam(toBeExcluded) {
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
    }
  }
};

export const meta = {
  title: "Free Body Diagram of Beam",
  description: "FBD",
  number: 18
};
</script>
