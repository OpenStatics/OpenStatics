<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Force Vector 3D</h1>
    <p>
      For the 3D case, a force vector can be represented as
    </p>
    <div class="text-center">
      <p>
        <vue-mathjax
          formula="$\vec{F} = F_x \vec{i} + F_y \vec{j} + F_z \vec{k} = \sqrt{F_x^2 + F_y^2 + F_z^2} 
      \left( \frac{F_x}{\sqrt{F_x^2 + F_y^2 + F_z^2}} \vec{i} + \frac{F_y}{\sqrt{F_x^2 + F_y^2 + F_z^2}} \vec{j} + \frac{F_z}{\sqrt{F_x^2 + F_y^2 + F_z^2}} \vec{k}  \right)
      = || \vec{F} || \left( \frac{\vec{F_x}}{|| \vec{F} ||} \vec{i} + \frac{\vec{F_y}}{|| \vec{F} ||} \vec{j} + \frac{\vec{F_z}}{|| \vec{F} ||} \vec{k} \right)$"
        />
      </p>
    </div>
    <p>
      Note that <vue-mathjax formula="$\cos \alpha = \frac{F_x}{||\vec{F}||}$" />, <vue-mathjax formula="$\cos \beta = \frac{F_y}{||\vec{F}||}$" />,
      <vue-mathjax formula="$\cos \gamma = \frac{F_z}{||\vec{F}||}$" />, where <vue-mathjax formula="$\alpha$" /> is the angle between the vector and
      x-axis, <vue-mathjax formula="$\beta$" /> is the angle between the vector and y-axis, <vue-mathjax formula="$\gamma$" /> is the angle between
      the vector and z-axis, they satisfy the relations <vue-mathjax formula="$\cos^2 \alpha + \cos^2 \beta + \cos^2 \gamma = 1$" />. Then we have
    </p>
    <div class="text-center">
      <p>
        <vue-mathjax
          formula="$\vec{F} = ||\vec{F}|| \left( \cos \alpha \ \vec{i} + \cos \beta \ \vec{j} + \cos \gamma \ \vec{k} \right) = ||\vec{F}||\vec{u}$"
        />
      </p>
    </div>
    <p>
      Where <vue-mathjax formula="$\vec{u} = \left( \cos \alpha \ \vec{i} + \cos \beta \ \vec{j} + \cos \gamma \ \vec{k} \right)$" /> is the unit
      vector.
    </p>
    <p>By changing magnitudes, we can get different <vue-mathjax formula="$\vec{F}$" />.</p>
    <p>Alternatively, we can use the components to control <vue-mathjax formula="$\vec{F}$" />. Since we have</p>
    <div class="text-center">
      <p>
        <vue-mathjax formula="$\vec{F} = F_x \vec{i} + F_y \vec{j} + F_z \vec{k}$" />
      </p>
    </div>
    <p>
      By changing the components directly <vue-mathjax formula="$F_x, F_y, F_z$" /> direcly, we can get different <vue-mathjax formula="$\vec{F}$" />.
    </p>
    <fv1 />
  </div>
</template>
<script>
import force_vector_3D_1 from "../../utils/ForceVec3D/force_vec_3D_1";

export default {
  data() {
    return {};
  },
  components: {
    fv1: force_vector_3D_1
  }
};
export const meta = {
  title: "Force Vector 3D",
  description: "Non sense",
  number: 2
};
</script>

<style>
p {
  font-size: 16;
}
</style>
