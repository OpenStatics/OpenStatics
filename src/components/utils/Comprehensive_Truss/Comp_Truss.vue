<template>
  <div>
    <div id="boxLeft" class="jsx-graph my-2 text-center"></div>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => {
    return {
      state: 0,
      textToUpdate: {}
    };
  },
  mounted() {
    // Scale determines the size of the whole structure
    const scale = 4.5;
    const bgColor = window.getComputedStyle(document.getElementById("app"), null).getPropertyValue("background-color");
    // let lodash = require("lodash");

    // Setup the board
    const bL = JXG.JSXGraph.initBoard("boxLeft", {
      boundingbox: [-15, 10, 15, -15],
      keepAspectRatio: true,
      showCopyright: false,
      pan: { enabled: false },
      zoom: { wheel: false },
      showNavigation: false,
      showZoom: false
    });
    // bL.canvasHeight = 600;

    this.bL = bL;
    this.changeState(0);
  },
  methods: {
    changeState(newState) {
      this.state = newState;
      this.b2.fullUpdate();

      for (const lbl of Object.keys(this.textToUpdate)) {
        this.textToUpdate[lbl].object.setText("");
        this.textToUpdate[lbl].object.setText(this.textToUpdate[lbl].formula);
      }
    }
  }
};
export const meta = {
  title: "Comprehensive Truss Problem",
  description: "truss"
};
</script>
