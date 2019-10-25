<template>
  <div>
    <div id="box1" class="jsx-graph2 my-2"></div>
    <div id="box2" class="jsx-graph my-2 text-center"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      board: null,
      lol: 10
    };
  },
  mounted() {
    // create two boards: b1 is the control and b2 is the display
    const b1 = JXG.JSXGraph.initBoard("box1", { boundingbox: [-10, 10, 10, -10] });
    const b2 = JXG.JSXGraph.initBoard("box2", { boundingbox: [-15, 15, 15, -15], axis: true, keepAspectRatio: true });
    b1.addChild(b2);

    // set slider for force and angle
    const force = b1.create("slider", [[1, -2], [6, -2], [0, 1, 5]]);
    const angle = b1.create("slider", [[1, -4], [6, -4], [0, 0, 360]]);

    // create two points for reference
    const origin_point = b2.create("point", [0, 0], { fixed: true }, { name: "O" });
    const end_point = b2.create(
      "point",
      [
        function() {
          return Math.cos((angle.Value() / 180) * Math.PI) * force.Value();
        },
        function() {
          return Math.sin((angle.Value() / 180) * Math.PI) * force.Value();
        }
      ],
      { name: "v" }
    );

    // create the main vector
    const vector = b2.create("line", [origin_point, end_point], { straightFirst: false, straightLast: false, lastArrow: true });

    // projection of F on x
    var check_prof_F_on_x = b1.create("checkbox", [1, -6, "Projection of F on x"], {});
    const proj_F_on_x = b2.create(
      "line",
      [
        origin_point,
        [
          function() {
            return Math.cos((angle.Value() / 180) * Math.PI) * force.Value();
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
    var check_prof_F_on_y = b1.create("checkbox", [1, -8, "Projection of F on y"], {});
    const proj_F_on_y = b2.create(
      "line",
      [
        origin_point,
        [
          0,
          function() {
            return Math.sin((angle.Value() / 180) * Math.PI) * force.Value();
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
    var check_res_F = b1.create("checkbox", [1, -10, "Resolution of F into components"], {});
    const res_F_y = b2.create(
      "line",
      [
        [
          0,
          function() {
            return Math.sin((angle.Value() / 180) * Math.PI) * force.Value();
          }
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
    const res_F_x = b2.create(
      "line",
      [
        [
          function() {
            return Math.cos((angle.Value() / 180) * Math.PI) * force.Value();
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
  title: "force projection",
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
