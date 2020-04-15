<template>
  <div>
    <h1 class="text-danger text-center my-4">Force Vector Representation in 2D</h1>
    <div class="row">
      <div id="ForceVec2D" class="jsx-graph col-xl mx-2"></div>
      <div class="col-xl mx-2">
        <ForceText></ForceText>
      </div>
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
    const multiplier = 3;

    // create b2 board
    const b2 = JXG.JSXGraph.initBoard("ForceVec2D", { boundingbox: [-15, 15, 15, -15], axis: true, keepAspectRatio: true });

    // set slider for force and angle
    const force = b2.create(
      "slider",
      [
        [1, -6],
        [6, -6],
        [0, 1, 5]
      ],
      { name: "F(N)" }
    );
    const angle = b2.create(
      "slider",
      [
        [1, -8],
        [6, -8],
        [0, 0, 360]
      ],
      { name: "a(degree)" }
    );
    const check_prof_F_on_x = b2.create("checkbox", [1, -10, "Projection of F on x"], {});
    const check_res_F = b2.create("checkbox", [1, -12, "Resolution of F into components"], {});
    const check_prof_F_on_y = b2.create("checkbox", [1, -14, "Projection of F on y"], {});

    // create two points for reference
    const origin_point = b2.create("point", [0, 0], { fixed: true }, { name: "O" });
    const end_point = b2.create(
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
    const vector = b2.create("line", [origin_point, end_point], { straightFirst: false, straightLast: false, lastArrow: true });

    // projection of F on x
    const proj_F_on_x = b2.create(
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
    const proj_F_on_y = b2.create(
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
    const res_F_y = b2.create(
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
    const res_F_x = b2.create(
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
  description: "from JSX graph"
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
