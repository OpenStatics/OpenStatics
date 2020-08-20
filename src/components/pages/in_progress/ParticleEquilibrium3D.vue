<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Particle Equilibrium 3D</h1>
    <p>
      In this module we show the particle equilibrium in 3D. Similar to the 2D case, the particle can only be in equilibrium when the resultant force
      is 0, which means the three components of <vue-mathjax formula="$F_R$" /> should all be zero.
    </p>

    <!-- <div class="text-center">
      <p><vue-mathjax formula="$\vec{r}$" /></p>
    </div> -->
    <pe />
  </div>
</template>
<script>
import particle_equilibrium_3D from "../../utils/particle_equilibrium/particle_equilibrium_3D";

export default {
  data() {
    return {};
  },
  components: {
    pe: particle_equilibrium_3D
  }
};
export const meta = {
  title: "Particle Equilibrium 3D",
  description: "",
  number: 8
};
</script>

<style>
p {
  font-size: 16;
}
</style>
