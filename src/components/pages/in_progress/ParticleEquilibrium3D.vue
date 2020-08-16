<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Particle Equilibrium 3D</h1>
    <p>
      <vue-mathjax formula="$\vec{r}$" />
    </p>

    <div class="text-center">
      <p><vue-mathjax formula="$\vec{r}$" /></p>
    </div>
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
