<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Method of Joints</h1>
    <div class="row">
      <div class="col">
        <jointText />
      </div>
      <div class="col">
        <!-- Top two buttons -->
        <div class="row align-items-center">
          <div class="col">
            <button
              class="btn btn-primary mx-3"
              :class="{
                'btn-warning': index === 0
              }"
              @click="() => changeSelection(0)"
            >
              Loaded Truss
            </button>
          </div>
          <div class="col">
            <button
              class="btn btn-primary mx-3"
              :class="{
                'btn-warning': index === 1
              }"
              @click="() => changeSelection(10)"
            >
              Balances at Joints
            </button>
          </div>
        </div>

        <!-- Loaded Truss Buttons -->
        <div class="row align-items-center" v-if="index === 0">
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

        <!-- Balances of Joints buttons -->
        <div class="row align-items-center" v-if="index === 1">
          <div class="col">
            <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 10 }" @click="() => changeSelection(10)">
              Joints
            </button>
          </div>
          <div class="col">
            <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 11 }" @click="() => changeSelection(11)">
              A
            </button>
          </div>
          <div class="col">
            <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 12 }" @click="() => changeSelection(12)">
              B
            </button>
          </div>
          <div class="col">
            <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 13 }" @click="() => changeSelection(13)">
              C
            </button>
          </div>
          <div class="col">
            <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 14 }" @click="() => changeSelection(14)">
              D
            </button>
          </div>
          <div class="col">
            <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 15 }" @click="() => changeSelection(15)">
              Solved
            </button>
          </div>
        </div>

        <!-- The JSXGraph component -->
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
    return { currentSelection: 0, lastUsed: [0, 10], index: 0 };
  },
  components: {
    loadedTruss: loadedTrussVue,
    jointText: joint_text
  },
  methods: {
    changeSelection(nextState) {
      let currVal = this.intDiv(this.currentSelection, 10);
      let nextVal = this.intDiv(nextState, 10);
      if (currVal != nextVal) {
        this.index = (this.index + 1) % 2;
        nextState = this.lastUsed[this.index];
      }
      this.lastUsed[currVal] = this.currentSelection;
      this.lastUsed[nextVal] = nextState;

      this.currentSelection = nextState;
      this.$refs.foo.changeState(nextState);
      // console.log(this.currentSelection);
      // console.log(this.lastUsed);
    },
    intDiv(val, div) {
      return Math.floor(val / div);
    },
    matches(val, div, target) {
      return this.intDiv(val, div) === target;
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
