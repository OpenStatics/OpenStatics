<template>
  <div>
    <h1 class="text-danger text-center my-4">Force Vector Representation in 2D</h1>
    <ForceText></ForceText>
    <div class="row">
      <div id="control" style="height:500px;width:100%" class="mx-2 col"></div>
      <div id="ForceVec2D" class="jsx-graph col-xl mx-2"></div>
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
    board_control.addChild(this.board);

    // set slider for force and angle
    const force = board_control.create(
      "slider",
    [
        [2, 13],
        [12, 13],
        [0, 1, 5]
      ],
      { name: "F(N)" }
    );
    const angle = board_control.create(
      "slider",
      [
        [2, 11],
        [12, 11],
        [0, 30, 360]
      ],
      { name: "a(degree)" }
    );
    
    // create two points for reference
    const origin_point = board.create("point", [0, 0], { fixed: true }, { name: "O" });
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
      { name: "v" }
    );

    // create the main vector
    const vector = board.create("line", [origin_point, end_point], { straightFirst: false, straightLast: false, lastArrow: true });

    // projection of F on x
    const proj_F_on_x = board.create(
      "line",
      [
        origin_point,
        [
          function() {
            return Math.cos((angle.Value() / 180) * Math.PI) * force.Value() * multiplier;
          },
          0
        ]
      ],
      {
        straightFirst: false,
        straightLast: false,
        lastArrow: true,
        visible: function() {
          return check_prof_F_on_x.Value();
        }
      }
    );

    // Projection of F on y
    const proj_F_on_y = board.create(
      "line",
      [
        origin_point,
        [
          0,
          function() {
            return Math.sin((angle.Value() / 180) * Math.PI) * force.Value() * multiplier;
          }
        ]
      ],
      {
        straightFirst: false,
        straightLast: false,
        lastArrow: true,
        visible: function() {
          return check_prof_F_on_y.Value();
        }
      }
    );

    // Resolution of F into components
    const res_F_y = board.create(
      "line",
      [
        [
          0,
          function() {
            return Math.sin((angle.Value() / 180) * Math.PI) * force.Value() * multiplier;
          }
        ],
        end_point
      ],
      {
        straightFirst: false,
        straightLast: false,
        lastArrow: true,
        visible: function() {
          return check_res_F.Value() * multiplier;
        },
        dash: 2
      }
    );
    const res_F_x = board.create(
      "line",
      [
        [
          function() {
            return Math.cos((angle.Value() / 180) * Math.PI) * force.Value() * multiplier;
          },
          0
        ],
        end_point
      ],
      {
        straightFirst: false,
        straightLast: false,
        lastArrow: true,
        visible: function() {
          return check_res_F.Value();
        },
        dash: 2
      }
    );
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
