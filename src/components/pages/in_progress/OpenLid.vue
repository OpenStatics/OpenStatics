<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Open a Lid</h1>
    <p class="text-center">
      Based on the problem 4-42 of R. C. Hibbeler's Statics, 13th edition
    </p>
    <img src="../../../assets/OpenLid.jpg" class="mx-auto d-block" />
    <br />
    <p>
      The moment of a force <vue-mathjax formula="$\vec{F}$" /> about point O, or actually about the moment axis passing through O and perpendicular
      to the plane containing O and <vue-mathjax formula="$\vec{F}$" />, can be expressed using the vector cross product, namely
      <vue-mathjax formula="$\vec{M}_O = \vec{r} \times \vec{F}$" />. Here <vue-mathjax formula="$\vec{r}$" /> represents a position vector directed
      from O to any point on the line of action of <vue-mathjax formula="$\vec{F}$" />.
    </p>
    <p>
      For a beam with unbalanced moment <vue-mathjax formula="$\vec{M}_O$" />, the equation of motion is described by
      <vue-mathjax formula="$\vec{M}_O = I_O \vec{\ddot{\theta}}$" />, where <vue-mathjax formula="$\vec{\ddot{\theta}}$" /> is the angular
      acceleration, <vue-mathjax formula="$I_O$" /> is the moment of inertia with respect to O.
    </p>
    <p>
      For the following problem, we have a lid that is supported by a force. We have a force <vue-mathjax formula="$\vec{F}$" />, with the magnitude
      fixed, directions and acting positions at B. The force will produce the moment with respect to point O, and the moment may cause the sphere to
      rotate with respect to O.
    </p>
    <!-- <div class="text-center">
      <p><vue-mathjax formula="$\vec{r}$" /></p>
    </div> -->
    <open />
  </div>
</template>
<script>
import open_lid from "../../utils/OpenLid/open_lid.vue";

export default {
  data() {
    return {};
  },
  components: {
    open: open_lid
  }
};
export const meta = {
  title: "Open a Lid",
  description: "",
  number: 16
};
</script>

<style>
p {
  font-size: 16;
}
</style>
