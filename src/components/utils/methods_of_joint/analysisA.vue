<template>
  <div>
    <div id="box2" class="jsx-graph"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    const fixedDecimal = 4;

    const board = JXG.JSXGraph.initBoard("box2", { boundingbox: [-15, 15, 15, -15], keepAspectRatio: true, showCopyright: false });

    const force = board.create("slider", [[-3, -10], [3, -10], [1, 1, 2]], { name: "Load F_C" });
    const angle = board.create("slider", [[-3, -12], [3, -12], [0, 90, 180]], { name: "Angle(&Phi;)" });

    // create points
    const a = board.create("point", [0, 0], { name: "a", fixed: true });
    const b = board.create("point", [-10, 0], { name: "b", fixed: true, visible: false });
    const c = board.create("point", [10, 0], { name: "c", fixed: true, visible: false });
    const d = board.create("point", [5, 5 * Math.sqrt(3)], { name: "d", fixed: true, visible: false });
    const e = board.create("point", [-5, 5 * Math.sqrt(3)], { name: "e", fixed: true, visible: false });

    // connect points
    const line_ae = board.create("line", [a, e], { name: "lala", straightFirst: false, straightLast: false, lastArrow: true });
    const line_ad = board.create("line", [a, d], { straightFirst: false, straightLast: false, lastArrow: true });
    const line_ab = board.create("line", [a, b], { straightFirst: false, straightLast: false, lastArrow: true });
    const line_ac = board.create("line", [a, c], { straightFirst: false, straightLast: false, lastArrow: true });

     // create FC point
    const pointFC = b2.create(
      "point",
      [
        function() {
          const x = Math.cos((angle.Value() / 180) * Math.PI);
          if (Math.abs(x) < Math.pow(10, -7)) return 0;
          return -3 * x;
        },
        function() {
          const y = Math.sin((angle.Value() / 180) * Math.PI);
          if (Math.abs(y) < Math.pow(10, -7)) return 0;
          return -3 * force.Value() * y;
        }
      ],
      { visible: false }
    );

    // create force vector 
    const line_afc = b2.create("line", [a, pointFC], { straightFirst: false, straightLast: false, touchFirstPoint: true, lastArrow: true });

    // create text
    board.create("text", [0, -1, "azvdfvgdafgafdg"], { anchor: line_ad });
  }
};
</script>