<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Moving a Force to a Point - Animation</h1>
    <p>
      This modulus shows the animation of "Moving a Force to Another Point", aiming to give a more clear view about how the moment change during the
      moving process.
    </p>
    <p>
      In the following modulus, initially we have a force <vue-mathjax formula="$\vec{F}$" /> acting on point A, thus the moment it produces w.r.t.
      point B will be <vue-mathjax formula="$\vec{M}_{B0}=(\vec{r}_A - \vec{r}_B) \times \vec{F}$" />.
    </p>
    <p>
      When we move <vue-mathjax formula="$\vec{F}$" /> from point A to point B along the line AB, say, we reach a point C located at line AB. Since
      the magnitude of <vue-mathjax formula="$(\vec{r}_C - \vec{r}_B)$" /> is less than that of
      <vue-mathjax formula="$(\vec{r}_A - \vec{r}_B)$" /> while it has the same direction, thus the magnitude of
      <vue-mathjax formula="$\vec{M}_B$" /> decreases while its direction remains the same, we have
      <vue-mathjax formula="$\vec{M}_{B}=(\vec{r}_C - \vec{r}_B) \times \vec{F}$" />. Meanwhile, the couple moment at C increases, from 0 ( at initial
      point A ) to the <vue-mathjax formula="$\vec{M}_{C}=(\vec{r}_A - \vec{r}_C) \times \vec{F}$" /> (at point C), the value of which can be gotten
      through the process in the previous modulus, i.e. "Moving a Force to Another Point". When <vue-mathjax formula="$\vec{F}$" /> reaches point B,
      or we can say C coincides with B, then the couple moment becomes <vue-mathjax formula="$\vec{M}_{C}=(\vec{r}_A - \vec{r}_B) \times \vec{F}$" />,
      which is the same as <vue-mathjax formula="$\vec{M}_{B0}$" />. Through this moving process, we can clearly see how the couple moment
      <vue-mathjax formula="$\vec{M}_C$" /> increases and finally equals
      <vue-mathjax formula="$\vec{M}_{B0}$" />
    </p>
    <moving />
  </div>
</template>
<script>
import moving_force from "../../utils/MovingForcePoint/moving_force_point_anim.vue";

export default {
  data() {
    return {};
  },
  components: {
    moving: moving_force
  }
};
export const meta = {
  title: "Moving a Force to a Point - Animation",
  description: "",
  number: 14
};
</script>

<style>
p {
  font-size: 16;
}
</style>
