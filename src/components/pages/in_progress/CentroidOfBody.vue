<template>
  <div>
    <h1 class="text-danger text-center my-4">Centroid of a Body</h1>
    <div class="row">
      <div id="Centroid" class="jsx-graph col-xl mx-2"></div>
      <div id="Centroid2" class="jsx-graph col-xl mx-2"></div>

      <div class="col-xl mx-2">
        Text
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Centoid",
  data() {
    return {};
  },
  mounted() {
    const board = JXG.JSXGraph.initBoard("Centroid", {
      boundingbox: [-15, 15, 15, -15],
      axis: true,
      keepAspectRatio: true,
      showCopyright: false
    });
    const board2 = JXG.JSXGraph.initBoard("Centroid2", {
      boundingbox: [-15, 15, 15, -15],
      axis: true,
      keepAspectRatio: true,
      showCopyright: false
    });
    const a = board.create("slider", [[-13, 12], [-2, 12], [0, 0.2, 1]], { name: "a" });
    const b = board.create("slider", [[-13, 10], [-2, 10], [0, 0.3, 1]], { name: "b" });
    const c = board.create("slider", [[-13, 8], [-2, 8], [15, 45, 60]], { name: "c" });
    const x1 = board.create("slider", [[-13, 6], [-2, 6], [1, 1, 10]], { name: "x_1" });
    const x2 = board.create("slider", [[-13, 4], [-2, 4], [0, 1, 10]], { name: "x_2" });
    const x = board.create("slider", [[-13, 2], [-2, 2], [0, 1, 10]], { name: "x" });
    const xy = board.create("slider", [[-13, 0], [-2, 0], [0, 1, 10]], { name: "y" });
  }
};
export const meta = {
  title: "Centroid of a Body",
  description: "Non sense"
};
</script>
