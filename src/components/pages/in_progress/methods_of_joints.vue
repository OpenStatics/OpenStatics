<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Method of Joints</h1>
    <div class="row">
      <div class="col">
        <jointText />
      </div>
      <div class="col">
        <div class="row align-items-center">
          <div class="col">
            <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 0 }" @click="() => changeSelection(0)">
              Truss
            </button>
          </div>
          <div class="col">
            <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 1 }" @click="() => changeSelection(1)">
              FBD
            </button>
          </div>
          <div class="col">
            <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 2 }" @click="() => changeSelection(2)">
              &Sigma;M<sub>A</sub>=0
            </button>
          </div>
          <div class="col">
            <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 3 }" @click="() => changeSelection(3)">
              &Sigma;F<sub>x</sub>=0
            </button>
          </div>
          <div class="col">
            <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 4 }" @click="() => changeSelection(4)">
              &Sigma;F<sub>y</sub>=0
            </button>
          </div>
          <div class="col">
            <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 5 }" @click="() => changeSelection(5)">
              Solved
            </button>
          </div>
        </div>
        <div class="row">
          <loadedTruss ref="foo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loadedTrussVue from "../../utils/methods_of_joint/loadedTruss";
import joint_text from "../../utils/methods_of_joint/joint_text";
export default {
  data() {
    return { currentSelection: 0 };
  },
  components: {
    loadedTruss: loadedTrussVue,
    jointText: joint_text
  },
  methods: {
    changeSelection(nextState) {
      this.currentSelection = nextState;
      this.$refs.foo.changeState(nextState);
      console.log(this.currentSelection);
    }
  },
  mounted() {}
};
export const meta = {
  title: "methods of joint",
  description: "joint",
  number: 21
};
</script>
