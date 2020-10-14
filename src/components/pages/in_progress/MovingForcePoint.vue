<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Moving a Force to a Point</h1>
    <p>
      Sometimes it is convenient to reduce a system of forces and couple moments acting on a body to a simpler form by replacing it with an equivalent
      system, consisting of a single resultant force acting at a specific point and a resultant couple moment. A system is equivalent if the external
      effects it produces on a body are the same as those caused by the original force and couple moment system. In this context, the external effects
      of a system refer to the translating and rotating motion of the body if the body is free to move, or it refers to the reactive forces at the
      supports if the body is held fixed.
    </p>
    <p>
      The key point of such reduction is how to move a force to a given point equivalently. The following case shows the procedure of such moving.
      <vue-mathjax formula="$\vec{F}_A$" /> is applied at point A, and we want to move it to point B without disturbing the overall equilibrium. So,
      we add two forces at point B, they are both parallel with <vue-mathjax formula="$\vec{F}_A$" /> but have the same magnitude of
      <vue-mathjax formula="$\vec{F}_A$" />, but one has the same direction as <vue-mathjax formula="$\vec{F}_A$" /> and the other has the opposite
      direction as <vue-mathjax formula="$\vec{F}_A$" />. Here, we denote them as <vue-mathjax formula="$\vec{F}_{B+}$" /> and
      <vue-mathjax formula="$\vec{F}_{B-}$" /> separately. Now, since <vue-mathjax formula="$\vec{F}_A$" /> and
      <vue-mathjax formula="$\vec{F}_{B-}$" /> make up a couple moment <vue-mathjax formula="$\vec{M}$" />, they can be replaced with
      <vue-mathjax formula="$\vec{F}_M$" />. Thus, the system can be replaced by a force acting at B which is
      <vue-mathjax formula="$\vec{F}_{B+}$" />, together with a couple moment <vue-mathjax formula="$\vec{M}$" /> which is a free vector.
      <vue-mathjax formula="$\vec{F}_{B+}$" /> and <vue-mathjax formula="$\vec{M}$" /> are determined by
    </p>

    <div class="text-center">
      <p><vue-mathjax formula="$\vec{F}_{B+} = \vec{F}_A, \vec{M} = (\vec{r}_A - \vec{r}_B) \times \vec{F}_A$" /></p>
    </div>
    <p>
      By doing this, we can move a force to any given point without disturbing the overall equilibrium since the total force and the total moment
      produced by the force about any point remain the same. Suppose we have several forces acting on several points, we can use same process to move
      these forces to an given point equivalently, and then get one resultant force and one resultant couple moment for all the forces acting at this
      point as well as those couple moments, thus simplifying the system.
    </p>
    <moving />
  </div>
</template>
<script>
import moving_force from "../../utils/MovingForcePoint/moving_force_point.vue";

export default {
  data() {
    return {};
  },
  components: {
    moving: moving_force
  }
};
export const meta = {
  title: "Moving a Force to a Point",
  description: "",
  number: 13
};
</script>

<style>
p {
  font-size: 16;
}
</style>
