<template>
  <div>
    <loadedTruss />
  </div>
</template>

<script>
import loadedTrussVue from "../../utils/methods_of_joint/loadedTruss";

export default {
  data() {
    return { currentSelection: 0 };
  },
  components: {
    loadedTruss: loadedTrussVue
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
  title: "methods of joint",
  description: "joint"
};
</script>
