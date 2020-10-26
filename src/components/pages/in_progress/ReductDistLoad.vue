<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Reduction of a Distributed Loading</h1>
    <p>
      A body subjected to loading distributed over its surface can be simplified to one point force, <vue-mathjax formula="$F_R$" /> The magnitude of
      <vue-mathjax formula="$F_R$" /> is equivalent to the sum of all forces in the system. Integration is used to determine the differential area
      <vue-mathjax formula="$dA$" /> under the loading curve for the entire length L.
    </p>
    <div class="text-center">
      <p><vue-mathjax formula="$F_R = \int_{x_1}^{x_2} w(x) dx$" /></p>
    </div>
    <p>
      The location x-bar of the line of action of <vue-mathjax formula="$F_R$" /> can be determined by equating the moments of the force resultant and
      the parallel force distribution about point O \(the y axis\)
    </p>
    <p>
      Therefore, x-bar = <vue-mathjax formula="$\int_{x_1}^{x_2} x w(x) dx / \int_{x_1}^{x_2} w(x) dx$" />. This coordinate locates the geometric
      center or centroid of the area under the distributed load.
    </p>
    <rdl />
  </div>
</template>
<script>
import reduction_dist_load from "../../utils/ReductionDistLoad/reduction_dist_load.vue";

export default {
  data() {
    return {};
  },
  components: {
    rdl: reduction_dist_load
  }
};
export const meta = {
  title: "Reduction of a Distributed Loading",
  description: "",
  number: 15
};
</script>

<style>
p {
  font-size: 16;
}
</style>
