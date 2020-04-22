<template>
  <div>
    <div style="margin:20px">
      <h1 class="text-danger text-center my-4">Particle Equilibrium</h1>
      <p>The movement of a dot can be described by Newton's Second Law,</p>
      <vue-mathjax :formula="eq1" />
      <p>In Cartesian coordinate system x-y, it can be written as</p>
      <vue-mathjax :formula="eq2" />
      <p>or separately as</p>
      <vue-mathjax :formula="eq3" />
      <p>
        where <i>F<sub>k</sub></i> is the magnitude of the k-th force, <i>&theta;<sub>k</sub></i> is the angle between the direction of the k-th force
        and coordinate axis, say, x axis, m is the mass of the dot and <i>a<sub>x</sub></i
        >, <i>a<sub>y</sub></i> is the acceleration projection in x, y direction.
      </p>
      <p>
        In the following example, we have three forces, <i>F<sub>1</sub></i
        >, <i>F<sub>2</sub></i
        >, <i>F<sub>3</sub></i
        >. Thus we have
      </p>
      <vue-mathjax :formula="eq4" />
      <p>By setting the magnitude and direction of each forces, we can see the movement of the dot.</p>
      <p>If forces are set properly, the dot can remain in static equilibrium and thus will not move.</p>
    </div>
    <particleEquilibrium />
  </div>
</template>

<script>
import particule_equilibrium from "../../utils/particle_equilibrium/particle_equilibrium";

export default {
  components: {
    particleEquilibrium: particule_equilibrium
  },
  data() {
    return {
      eq1: "\\begin{align} \\sum _{k=1}^n\\vec{F_k}=m\\vec{a} \\end{align}",
      eq2: "\\begin{align} \\sum _{k=1}^nF_k\\cos \\theta _k\\vec{i}+F_k\\sin \\theta _k\\vec{j}=ma_x\\vec{i}+ma_y\\vec{j} \\end{align}",
      eq3: "\\begin{align} \\sum _{k=1}^n F_k\\cos \\theta _k = ma_x, \\sum _{k=1}^n F_k\\sin \\theta _k=ma_y \\end{align}",
      eq4: `\\begin{align}
      F_1 \\cos \\theta _1 + F_2 \\cos \\theta _2 + F_3 \\cos \\theta _3 = ma_x,\\\\
      F_1 \\sin \\theta _1 + F_2 \\sin \\theta _2 + F_3 \\sin \\theta _3 = ma_y,\\\\
      \\end{align}`
    };
  }
};

export const meta = {
  title: "Particle Equilibrium",
  description: "In Progress - Watkins",
  number: 7
};
</script>

<style>
p {
  font-size: 16;
}
</style>
