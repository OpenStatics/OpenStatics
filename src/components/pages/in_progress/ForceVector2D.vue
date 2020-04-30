<template>
  <div class="container">
    <h1 class="text-danger text-center my-4">Force Vector Representation in 2D</h1>
    <ForceText></ForceText>
    <div class="row">
      <div class="col-md-6">
        <div>F Visibility: <input type="radio" class="mx-3" name="F_Visibility" />on <input type="radio" class="mx-3" name="F_Visibility" checked />off</div>
        <div>Projection of F on x: <input type="radio" class="mx-3" name="Project_F_X" />on <input type="radio" class="mx-3" name="Project_F_X" checked />off</div>
        <div>Projection of F on y: <input type="radio" class="mx-3" name="Project_F_y" />on <input type="radio" class="mx-3" name="Project_F_y" checked />off</div>
        <div>Resolution of F into components: <input type="radio" class="mx-3" name="Resolution_F" />on <input type="radio" class="mx-3" name="Resolution_F" checked />off</div>
        <div>u Visibility: <input type="radio" class="mx-3" name="u_Visibility" />on <input type="radio" class="mx-3" name="u_Visibility" checked />off</div>
        <div>Projection of u on x: <input type="radio" class="mx-3" name="Project_u_x" />on <input type="radio" class="mx-3" name="Project_u_x" checked />off</div>
        <div>Projection of u on y: <input type="radio" class="mx-3" name="Project_u_y" />on <input type="radio" class="mx-3" name="Project_u_y" checked />off</div>
        <div>Projection of u into components: <input type="radio" class="mx-3" name="Project_u_comp" />on <input type="radio" class="mx-3" name="ok" checked />off</div>
        <div id="control" class="jxgbox" style="width:100%; height:100px; margin: auto auto"></div>
      </div>
      <div id="ForceVec2D" class="jxgbox col-md-6" style="width:100%; height:500px; margin: auto auto"></div>
    </div>
  </div>
</template>

<script>
import ForceText from "../../utils/ForceVec2D/ForceText";
export default {
  components: {
    ForceText
  },
  mounted() {
    // initial values
    const multiplier = 3;
    const fixedDecimal = 2;
    const fontSize = 20;
    const strokeWidth = 3;
    const dash = 3;
    const fixed = true;
    const inputFont = 15;

    // create board board
    const board = JXG.JSXGraph.initBoard("ForceVec2D", { boundingbox: [-15, 15, 15, -15], axis: true, keepAspectRatio: true });
    const board_control = JXG.JSXGraph.initBoard("control", {
      boundingbox: [0, 15, 15, 0],
      showCopyright: false
    });
    board_control.addChild(board);

    // set slider for force and angle
    const force = board_control.create(
      "slider",
      [
        [2, 10],
        [12, 10],
        [0, 1, 5]
      ],
      { name: "F (N)" }
    );
    const angle = board_control.create(
      "slider",
      [
        [2, 5],
        [12, 5],
        [0, 30, 360]
      ],
      { name: "a (\u00B0)" }
    );

    // create two points for reference
    const origin_point = board.create("point", [0, 0], { fixed, visible: false });
    const end_point = board.create(
      "point",
      [
        function() {
          return Math.cos((angle.Value() / 180) * Math.PI) * force.Value() * multiplier;
        },
        function() {
          return Math.sin((angle.Value() / 180) * Math.PI) * force.Value() * multiplier;
        }
      ],
      { fixed, visible: false }
    );

    // // create the main vector
    const vector = board.create("line", [origin_point, end_point], { straightFirst: false, straightLast: false, lastArrow: true });

    // // projection of F on x
    // const proj_F_on_x = board.create(
    //   "line",
    //   [
    //     origin_point,
    //     [
    //       function() {
    //         return Math.cos((angle.Value() / 180) * Math.PI) * force.Value() * multiplier;
    //       },
    //       0
    //     ]
    //   ],
    //   {
    //     straightFirst: false,
    //     straightLast: false,
    //     lastArrow: true,
    //     visible: function() {
    //       return check_prof_F_on_x.Value();
    //     }
    //   }
    // );

    // // Projection of F on y
    // const proj_F_on_y = board.create(
    //   "line",
    //   [
    //     origin_point,
    //     [
    //       0,
    //       function() {
    //         return Math.sin((angle.Value() / 180) * Math.PI) * force.Value() * multiplier;
    //       }
    //     ]
    //   ],
    //   {
    //     straightFirst: false,
    //     straightLast: false,
    //     lastArrow: true,
    //     visible: function() {
    //       return check_prof_F_on_y.Value();
    //     }
    //   }
    // );

    // // Resolution of F into components
    // const res_F_y = board.create(
    //   "line",
    //   [
    //     [
    //       0,
    //       function() {
    //         return Math.sin((angle.Value() / 180) * Math.PI) * force.Value() * multiplier;
    //       }
    //     ],
    //     end_point
    //   ],
    //   {
    //     straightFirst: false,
    //     straightLast: false,
    //     lastArrow: true,
    //     visible: function() {
    //       return check_res_F.Value() * multiplier;
    //     },
    //     dash: 2
    //   }
    // );
    // const res_F_x = board.create(
    //   "line",
    //   [
    //     [
    //       function() {
    //         return Math.cos((angle.Value() / 180) * Math.PI) * force.Value() * multiplier;
    //       },
    //       0
    //     ],
    //     end_point
    //   ],
    //   {
    //     straightFirst: false,
    //     straightLast: false,
    //     lastArrow: true,
    //     visible: function() {
    //       return check_res_F.Value();
    //     },
    //     dash: 2
    //   }
    // );
  }
};
export const meta = {
  title: "Force Vector (2D)",
  description: "from JSX graph",
  number: 1
};
</script>

<style>
.jsx-graph {
  width: 800px !important;
  height: 800px !important;
}
.jsx-graph2 {
  width: 100% !important;
  height: 30vh !important;
}
</style>
