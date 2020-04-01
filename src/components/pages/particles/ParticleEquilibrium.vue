<template>
  <div>
    <h1 class="text-danger text-center my-4">Particle Equilibrium</h1>
    <particleEquilibrium />
  </div>
</template>

<script>
import particule_equilibrium from "../../utils/particle_equilibrium/particle_equilibrium";

export default {
  components: {
    particleEquilibrium: particule_equilibrium
  }
};

export const meta = {
  title: "Particle Equilibrium",
  description: "In Progress - Watkins"
};
</script>

<style></style>
