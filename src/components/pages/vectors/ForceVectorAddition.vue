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
    // create three boards: b1 is the control and b2, b3 are the display
    const b1 = JXG.JSXGraph.initBoard("box1", { boundingbox: [-10, 10, 10, -10] });
    const b2 = JXG.JSXGraph.initBoard("box2", { boundingbox: [-15, 15, 15, -15], axis: true, keepAspectRatio: true });
    // const b3 = JXG.JSXGraph.initBoard("box3", { boundingbox: [-5, 5, 5, -5] });
    b1.addChild(b2);

    // set slider for force and angle
    const force_a = b1.create("slider", [[1, -2], [6, -2], [0, 1, 5]], { name: "Force A" });
    const angle_a = b1.create("slider", [[1, -4], [6, -4], [0, 0, 360]], { name: "Angle A" });
    const force_b = b1.create("slider", [[1, -6], [6, -6], [0, 1, 5]], { name: "Force B" });
    const angle_b = b1.create("slider", [[1, -8], [6, -8], [0, 0, 360]], { name: "Angle B" });

    // create two points for reference
    const origin_point = b2.create("point", [0, 0], { fixed: true }, { name: "O" });
    const end_point_a = b2.create(
      "point",
      [
        function() {
          return Math.cos((angle_a.Value() / 180) * Math.PI) * force_a.Value();
        },
        function() {
          return Math.sin((angle_a.Value() / 180) * Math.PI) * force_a.Value();
        }
      ],
      { name: "F1" }
    );
    const end_point_b = b2.create(
      "point",
      [
        function() {
          return Math.cos((angle_b.Value() / 180) * Math.PI) * force_b.Value();
        },
        function() {
          return Math.sin((angle_b.Value() / 180) * Math.PI) * force_b.Value();
        }
      ],
      { name: "F2" }
    );

    const end_point_r = b2.create(
      "point",
      [
        function() {
          var a_x = Math.cos((angle_a.Value() / 180) * Math.PI) * force_a.Value();
          var b_x = Math.cos((angle_b.Value() / 180) * Math.PI) * force_b.Value();
          var angle = (angle_a.Value() + angle_b.Value()) / 2;
          return a_x + b_x;
        },
        function() {
          var a_y = Math.sin((angle_a.Value() / 180) * Math.PI) * force_a.Value();
          var b_y = Math.sin((angle_b.Value() / 180) * Math.PI) * force_b.Value();
          var angle = (angle_a.Value() + angle_b.Value()) / 2;
          return a_y + b_y;
        }
      ],
      { name: "FR" }
    );

    // create vectors
    const vector_a = b2.create("line", [origin_point, end_point_a], { straightFirst: false, straightLast: false, lastArrow: true });
    const vector_b = b2.create("line", [origin_point, end_point_b], { straightFirst: false, straightLast: false, lastArrow: true });
    const vector_r = b2.create("line", [origin_point, end_point_r], { straightFirst: false, straightLast: false, lastArrow: true });
    var show_parallolegram = b1.create("checkbox", [8, -2, "Show Parallolegram"], {});
    const line_a = b2.create("line", [end_point_a, end_point_r], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      visible: function() {
        return show_parallolegram.Value();
      }
    });
    const line_b = b2.create("line", [end_point_b, end_point_r], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      visible: function() {
        return show_parallolegram.Value();
      }
    });
  }
};
export const meta = {
  title: "Force Vector Addition",
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
