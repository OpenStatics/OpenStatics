<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Moment of a Force 2D</h1>
    <p>
      The moment of a force <vue-mathjax formula="$\vec{F}$" /> about point O, or actually about the moment axis passing through O and perpendicular
      to the plane containing O and <vue-mathjax formula="$\vec{F}$" />, can be expressed using the vector cross product, namely
      <vue-mathjax formula="$\vec{M}_O = \vec{r} \times \vec{F}$" />. Here <vue-mathjax formula="$\vec{r}$" /> represents a position vector directed
      from O to any point on the line of action of <vue-mathjax formula="$\vec{F}$" />.
    </p>
    <p>
      For a beam with unbalanced moment <vue-mathjax formula="$\vec{M}_O$" />, the equation of motion is described by
      <vue-mathjax formula="$\vec{M}_O = I_O \vec{\ddot{\theta}}$" />, where <vue-mathjax formula="$\vec{\ddot{\theta}}$" /> is the angular
      acceleration, <vue-mathjax formula="$\vec{I_O}$" /> is the moment of inertia with respect to O. If the beam is constrained to be rotate within
      certain plane, the equation of motion is simplified as <vue-mathjax formula="$M_O = I_0 \ddot{\theta}$" />. So we see, in order to keep the beam
      in static, we need to make the <vue-mathjax formula="$M_O$" /> to zero.
    </p>
    <p>
      For the following problem, we have two forces <vue-mathjax formula="$\vec{F}_1$" />,<vue-mathjax formula="$\vec{F}_2$" />, with their
      magnitudes, directions and acting positions to be set. Both of them produce the moment with respect to hinge, and the resultant may cause the
      moment to rotate with respect to hinge. We can see the rotation once we set unbalanced moment of these two forces. Also, we can see that the
      beam will keep in static once the resultant moment is zero.
    </p>

    <!-- <div class="text-center">
      <p><vue-mathjax formula="$\vec{r}$" /></p>
    </div> -->
    <mf />
  </div>
</template>
<script>
import moment_of_force from "../../utils/MomentOfForce/moment_of_force_2D.vue";

export default {
  data() {
    return {};
  },
  components: {
    mf: moment_of_force
  }
};
export const meta = {
  title: "Moment of Force 2D",
  description: "",
  number: 9
};
</script>

<style>
p {
  font-size: 16;
}
</style>
