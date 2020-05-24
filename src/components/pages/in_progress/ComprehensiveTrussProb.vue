<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Comprehensive Truss Problem</h1>
    <div class="row align-items-center">
      <div class="col">
        <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 0 }" @click="() => changeSelection(0)">
          Truss
        </button>
      </div>
      <div class="col">
        <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 1 }" @click="() => changeSelection(1)">Cut 1</button>
      </div>
      <div class="col">
        <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 2 }" @click="() => changeSelection(2)">Cut 2</button>
      </div>
      <div class="col">
        <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 3 }" @click="() => changeSelection(3)">Cut 3</button>
      </div>
    </div>
    <div class="row">
      <compTruss ref="foo" />
    </div>
  </div>
</template>

<script>
//import truss from "../../utils/methods_of_sections/truss";
//import cutSections from "../../utils/methods_of_sections/cutSections";
//import Fbc from "../../utils/methods_of_sections/Fbc";
//import Fgc from "../../utils/methods_of_sections/Fgc";
//import Fgf from "../../utils/methods_of_sections/Fgf";
import comp_truss from "../../utils/Comprehensive_Truss/Comp_Truss.vue";

export default {
  data() {
    return { currentSelection: 0 };
  },
  components: {
    compTruss: comp_truss
    //truss: truss,
    //cutSections: cutSections,
    //Fbc: Fbc,
    //Fgc: Fgc,
    //Fgf: Fgf
  },
  methods: {
    changeSelection(nextState) {
      this.currentSelection = nextState;
      this.$refs.foo.changeState(nextState);
      // console.log(nextState);
    }
  },
  mounted() {
    // let c1 = document.querySelector(".column1");
    // let c2 = document.querySelector(".column2");
    // let p = c2.parentElement;
    // c1.clientWidth = p.clientWidth - c2.clientWidth;
  }
};
export const meta = {
  title: "Comprehensive Truss Problem",
  description: "",
  number: 23
};
</script>

<style>
p {
  font-size: 16;
}
</style>
