<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Force Vector Projection</h1>
    <p>
      The following module expands upon basics in vector representation, position vectors, and vector projection.
    </p>
    <p>
      As review, projections of a force onto any certain line can be easily found once a force is already represented as a vector. In problem 137, the
      components of <vue-mathjax formula="$\vec{F}$" /> that act along rod AC and perpendicular to it must be found. The Force vector can be found
      using the given magnitude and given information that the force acts in the same direction as a vector from B to D. For the projection of the
      Force vector onto the rod AC, the component can be found using the dot product between the force vector and the unit vector along the desired
      projection direction. Alternatively, cosine may be used if the angle between BD and AC is known.
    </p>
    <div class="text-center">
      <p><vue-mathjax formula="$F_{||} = \vec{F} \cdot \vec{u_{AC}} = |\vec{F}|\cos \theta$" /></p>
    </div>
    <p>The component of the perpendicular force may be found using the following relation</p>
    <div class="text-center">
      <p><vue-mathjax formula="$F^2 = F_{\perp}^2 + F_{||}^2$" /></p>
    </div>
    <fp />
  </div>
</template>
<script>
import force_projection from "../../utils/ForceProj/force_proj_rod.vue";

export default {
  data() {
    return {};
  },
  components: {
    fp: force_projection
  }
};
export const meta = {
  title: "Force Vector Projection",
  description: "",
  number: 6
};
</script>

<style>
p {
  font-size: 16;
}
</style>
