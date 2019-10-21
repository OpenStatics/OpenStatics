<template>
  <div>
    <div id="box2" class="jsx-graph "></div>
  </div>
</template>

<script>
export default {
  mounted() {
    const fixedDecimal = 4;

    const board = JXG.JSXGraph.initBoard("box2", { boundingbox: [-15, 15, 15, -15], keepAspectRatio: true, showCopyright: false });

    const force = board.create("slider", [[-3, -10], [3, -10], [1, 1, 2]], { name: "Load F_C" });
    const angle = board.create("slider", [[-3, -12], [3, -12], [0, 90, 180]], { name: "Angle(&Phi;)" });
  }
};
</script>