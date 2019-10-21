<template>
  <div>
    <fbd v-if="currentSelection == 0" />
    <analysisA v-if="currentSelection == 1" />
    <!-- <div id="box2" class="jsx-graph my-2 text-center"></div> -->
    <button @click="()=>changeSelection(0)">Overview: Free Body Diagram</button>
    <button @click="()=>changeSelection(1)">Analysis on A</button>
    <button @click="()=>changeSelection(2)">Analysis on B</button>
    <button @click="()=>changeSelection(3)">Analysis on C</button>
    <button @click="()=>changeSelection(4)">Analysis on D</button>
    <button @click="()=>changeSelection(5)">Analysis on E</button>
  </div>
</template>

<script>
import fbd from "../../utils/methods_of_joint/fbd";
import analysisA from "../../utils/methods_of_joint/analysisA";

export default {
  data() {
    return { currentSelection: 0 };
  },
  components: {
    fbd: fbd,
    analysisA: analysisA
  },
  methods: {
    changeSelection(nextState) {
      this.currentSelection = nextState;
      console.log(this.currentSelection);
    }
  },
  mounted() {}
};
export const meta = {
  title: "methods of joint demo",
  description: "joint"
};
</script>