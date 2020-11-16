<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Moment Of Inertia</h1>

    <p>
      The centroid represents the geometric center of a body. This point coincides with the center of mass, or the center of gravity only if the
      material composing the body is uniform or homogeneous. The formulas used to locate the center of gravity, or the centroid, simply represents a
      balance between the sum of moments of all the parts of the system. In some cases, the centroid is located at a point that is not on the object.
    </p>
    <!-- <div class="text-center">
      <p><vue-mathjax formula="$\vec{r}$" /></p>
    </div> -->
    <mi />
  </div>
</template>
<script>
import mom_inert from "../../utils/MomentOfInertia/moment_of_inertia.vue";

export default {
  data() {
    return {};
  },
  components: {
    mi: mom_inert
  }
};
export const meta = {
  title: "Moment of Inertia",
  description: "",
  number: 30
};
</script>

<style>
p {
  font-size: 16;
}
</style>
