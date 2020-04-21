<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Method of Sections</h1>
    <div class="row">
      <div class="col">
        <p>
          When we need to find the force in only a few members of a truss, we can analyze the truss using the method of sections. It is based on the
          principle that if the truss is in equilibrium then any segment of the truss is also in equilibrium. Since we only have three independent
          equilibrium equations, i.e. 2 force components equilibrium + 1 moment equilibrium, or 1 force components equilibrium + 2 moment equilibrium,
          we should try to choose section passes that cut through no more than 3 members. Always assume that the unknown member forces at the cut
          section are tensile forces, i.e., "pulling" on the member. By doing this, the numerical solution of the equilibrium equations will yield
          positive scalars for members in tension and negative scalars for members in compression.
        </p>
        <p>
          We pick an example from Chapter 6.4 of Hibbler's Mechanics of Materials, 10th edition to show the process in detail. During the solution, we
          should carefully consider ways of writing the equations so as to yield a direct solution for each of the unknowns, rather than having to
          solve simultaneous equations. So, in this example, we first sum moments about G to yield a direct solution for F<sub>BC</sub>, since F<sub
            >GC</sub
          >
          and F<sub>GF</sub> create zero moment about G. Then F<sub>GC</sub> can be found directly by the force summation in y direction since F<sub
            >BC</sub
          >
          and F<sub>GF</sub> have no components in y direction. Finally, by summing moments about C we get F<sub>GF</sub> directly since F<sub
            >BC</sub
          >
          and F<sub>GC</sub>
          create zero moment about C.
        </p>
        <p>
          Such Method of Sections is very quick. As a comparison, if the method of joints were used to determine, say, the force in member GC, it
          would be necessary to analyze joints A, B, and G in sequence, which is more tedious.
        </p>
      </div>
      <div class="col">
        <div class="row align-items-center">
          <div class="col">
            <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 0 }" @click="() => changeSelection(0)">
              Overview
            </button>
          </div>
          <div class="col">
            <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 1 }" @click="() => changeSelection(1)">Section</button>
          </div>
          <div class="col">
            <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 2 }" @click="() => changeSelection(2)">
              F<sub>BC</sub>
            </button>
          </div>
          <div class="col">
            <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 3 }" @click="() => changeSelection(3)">
              F<sub>GC</sub>
            </button>
          </div>
          <div class="col">
            <button class="btn btn-primary mx-3" :class="{ 'btn-warning': currentSelection === 4 }" @click="() => changeSelection(4)">
              F<sub>GF</sub>
            </button>
          </div>
        </div>
        <div class="row">
          <methOfSec ref="foo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import truss from "../../utils/methods_of_sections/truss";
//import cutSections from "../../utils/methods_of_sections/cutSections";
//import Fbc from "../../utils/methods_of_sections/Fbc";
//import Fgc from "../../utils/methods_of_sections/Fgc";
//import Fgf from "../../utils/methods_of_sections/Fgf";
import meth_of_sec from "../../utils/methods_of_sections/meth_of_sec";

export default {
  data() {
    return { currentSelection: 0 };
  },
  components: {
    methOfSec: meth_of_sec
    //truss: truss,
    //cutSections: cutSections,
    //Fbc: Fbc,
    //Fgc: Fgc,
    //Fgf: Fgf
  },
  methods: {
    changeSelection(nextState) {
      this.currentSelection = nextState;
      this.$refs.foo.change_state(nextState);
      console.log(nextState);
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
  title: "methods of sections",
  description: "IN PROGRESS - WATKINS"
};
</script>

<style>
p {
  font-size: 16;
}
</style>
