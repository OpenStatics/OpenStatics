<template>
  <div>
    For 2D case, a force vector can be represented as
    <vue-mathjax :formula="eq1" />
    Note that <vue-mathjax :formula="eq2" />, <vue-mathjax :formula="eq3" />, where <vue-mathjax formula="(\\\alpha\\)" /> is the angle 
    between the vector and x-axis, <vue-mathjax formula="(\\\beta\\)" /> is the angle between the vector and y-axis. 
    Thus we have
    <vue-mathjax :formula="eq4" />
    Where <vue-mathjax :formula="eq5" /> is the unit vector.
  </div>
</template>

<script>
export default { 
  data() {
    return {
      eq1: `\\begin{equation} 
                  \\vec{F} =
                  F_x\\vec{i}+F_y\\vec{j}=
                  \\sqrt{F_x^2+F_y^2}(\\frac{F_x}{\\sqrt{F_x^2+F_y^2}}\\vec{i}+\\frac{F_y}{\\sqrt{F_x^2+F_y^2}}\\vec{j})=
                  ||\\vec{F}||(\\frac{F_x}{||\\vec{F}||}\\vec{i}+\\frac{F_y}{||\\vec{F}||}\\vec{j})
            \\end{equation}`,
      eq2: `$\\cos(\\alpha) =\\frac{F_x}{||\\vec{F}||} $`,
      eq3: `$\\cos(\\beta) =\\frac{F_y}{||\\vec{F}||}$`,
      eq4: `\\begin{equation}
              \\vec{F}=||\\vec{F}||(\\cos(\\alpha) \\; \\vec{i} +\\cos(\\beta) \\; \\vec{j})=||\\vec{F}||\\vec{u}
            \\end{equation}`,
      eq5: `$\\vec{u}=(\\cos(\\alpha) \\; \\vec{i} + \\cos(\\beta) \\; \\vec{j}) $`
    };
  }
};
</script>
