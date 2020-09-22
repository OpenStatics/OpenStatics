<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Moment of a Force 3D</h1>
    <p>
      The moment of a force <vue-mathjax formula="$\vec{F}$" /> about point O, or actually about the moment axis passing through O and perpendicular
      to the plane containing O and <vue-mathjax formula="$\vec{F}$" />, can be expressed using the vector cross product, namely
      <vue-mathjax formula="$\vec{M}_O = \vec{r} \times \vec{F}$" />. Here <vue-mathjax formula="$\vec{r}$" /> represents a position vector directed
      from O to any point on the line of action of <vue-mathjax formula="$\vec{F}$" />.
    </p>
    <p>
      For a beam with unbalanced moment <vue-mathjax formula="$\vec{M}_O$" />, the equation of motion is described by
      <vue-mathjax formula="$\vec{M}_O = I_O \vec{\ddot{\theta}}$" />, where <vue-mathjax formula="$\vec{\ddot{\theta}}$" /> is the angular
      acceleration, <vue-mathjax formula="$\vec{I_O}$" /> is the moment of inertia with respect to O.
    </p>
    <p>
      For the following problem, we will set the position of O and the position of a sphere with the center at C. We have a force
      <vue-mathjax formula="$\vec{F}$" />, with the magnitude, directions and acting positions at C. The force will produce the moment with respect to
      point O, and the moment may cause the sphere to rotate with respect to O. We can see the rotation once the moment is non-zero. Also, we can see
      that the sphere will keep in static once the moment is zero.
    </p>

    <!-- <div class="text-center">
      <p><vue-mathjax formula="$\vec{r}$" /></p>
    </div> -->
    <mf />
  </div>
</template>
<script>
import moment_of_force from "../../utils/MomentOfForce/moment_of_force_3D.vue";

export default {
  data() {
    return {};
  },
  components: {
    mf: moment_of_force
  }
};
export const meta = {
  title: "Moment of Force 3D",
  description: "",
  number: 10
};
</script>

<style>
p {
  font-size: 16;
}
</style>
