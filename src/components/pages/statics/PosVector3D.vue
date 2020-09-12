<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Position Vector 3D</h1>
    <p>
      A position vector <vue-mathjax formula="$\vec{r}$" /> is defined as a fixed vector which locates a point in space relative to another point.
    </p>
    <p>
      If we know the coordinates of a point, say A, as <vue-mathjax formula="${x_A, y_A, z_A}$" />, then the position vector from the origin point to
      A will be
    </p>
    <div class="text-center">
      <p><vue-mathjax formula="$\vec{r_A} = x_A \vec{i} + y_A \vec{j} + z_A \vec{k}$" /></p>
    </div>
    <p>Similarly, for point B with coordinates <vue-mathjax formula="${x_B, y_B, z_B}$" />, the position vector from the origin point to B will be</p>
    <div class="text-center">
      <p><vue-mathjax formula="$\vec{r_B} = x_B \vec{i} + y_B \vec{j} + z_B \vec{k}$" /></p>
    </div>
    <p>Thus, the position vector from point A to point B will be</p>
    <div class="text-center">
      <p><vue-mathjax formula="$\vec{r} = \vec{r_B} - \vec{r_A} = (x_B-x_A) \vec{i} + (y_B-y_A) \vec{j} + (z_B - z_A) \vec{k}$" /></p>
    </div>
    <pv />
  </div>
</template>
<script>
import position_vector_3D from "../../utils/PosVec3D/pos_vec_3D.vue";

export default {
  data() {
    return {};
  },
  components: {
    pv: position_vector_3D
  }
};
export const meta = {
  title: "Position Vector 3D",
  description: "",
  number: 4
};
</script>

<style>
p {
  font-size: 16;
}
</style>
