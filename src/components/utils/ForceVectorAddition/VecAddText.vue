<template>
  <div class="my-3">
    Experimental evidence has shown that a force is a vector quantity since it has a specified magnitude, direction, and sense and it adds according
    to the parallelogram law. Two common problems in statics involve either finding the resultant force, knowing its components, or resolving a known
    force into two components. We will now describe how each of these problems is solved using the parallelogram law.
    <br /><br />

    Given two forces, <i>F</i
    ><span
      style="position: relative;
        bottom: 1.3ex;
        letter-spacing: -2ex;
        right: 1.4ex"
      >&rarr;</span
    ><sub>1</sub> and <i>F</i
    ><span
      style="position: relative;
        bottom: 1.3ex;
        letter-spacing: -2ex;
        right: 1.4ex"
      >&rarr;</span
    ><sub>2</sub>, we know their magnitudes <i>F</i><sub>1</sub>, <i>F</i><sub>2</sub> and directions <i>&Theta;</i><sub>1</sub>, <i>&Theta;</i
    ><sub>2</sub>. The two forces <i>F</i
    ><span
      style="position: relative;
        bottom: 1.3ex;
        letter-spacing: -2ex;
        right: 1.4ex"
      >&rarr;</span
    ><sub>1</sub> and <i>F</i
    ><span
      style="position: relative;
        bottom: 1.3ex;
        letter-spacing: -2ex;
        right: 1.4ex"
      >&rarr;</span
    ><sub>2</sub> can be added together to form the resultant force <i>F</i
    ><span
      style="position: relative;
        bottom: 1.3ex;
        letter-spacing: -2ex;
        right: 1.4ex"
      >&rarr;</span
    ><sub>R</sub> = <i>F</i
    ><span
      style="position: relative;
        bottom: 1.3ex;
        letter-spacing: -2ex;
        right: 1.4ex"
      >&rarr;</span
    ><sub>1</sub> + <i>F</i
    ><span
      style="position: relative;
        bottom: 1.3ex;
        letter-spacing: -2ex;
        right: 1.4ex"
      >&rarr;</span
    ><sub>2</sub>. The adding process is shown below.<br /><br />

    From this construction, we can apply the law of cosines or the law of sines to the triangle in order to obtain the magnitude of the resultant
    force and its direction. We know that |<i>&Theta;</i><sub>1</sub> - <i>&Theta;</i><sub>2</sub>| = &alpha; + &beta; = &pi; - &gamma;, thus we have
    &gamma; = &pi; - |<i>&Theta;</i><sub>1</sub> - <i>&Theta;</i><sub>2</sub>|. Using law of cosines we know the magnitude of resultant force will be
    <br /><br />

    <vue-mathjax :formula="eq1" />
    Thus, we get the magnitude <vue-mathjax formula="(F_R\\)" />. While for direction, we first get the angles <vue-mathjax formula="(\\\alpha\\)" />,
    <vue-mathjax formula="(\\\beta\\)" /> by the law of sines, <br />
    <vue-mathjax :formula="eq2" />

    Once we get <vue-mathjax formula="(\\\alpha\\)" />, <vue-mathjax formula="(\\\beta\\)" />, we can get the magnitude direction
    <vue-mathjax formula="(\\\theta\\)" /> by the geometry:
    <vue-mathjax :formula="eq3" />

    Thus we know the magnitude as well as direction of the resultant force <vue-mathjax formula="(\vec{F_R}\\)" />.
  </div>
</template>

<script>
export default {
  data() {
    return {
      eq1: `\\begin{align}
      \\vec{F}_R &= \\sqrt{F_1^2 +F_2^2-2F_1F_2\\cos\\gamma} \\\\ 
               &= \\sqrt{F_1^2 +F_2^2-2F_1F_2\\cos(\\pi - |\\theta_1 - \\theta_2|)} \\\\
               &= \\sqrt{F_1^2+F_2^2+2F_1F_2\\cos(\\theta_1-\\theta_2)}
           \\end{align}`,
      eq2: `\\begin{equation}
      \\frac{F_1}{\\sin \\alpha} = \\frac{F_2}{\\sin \\beta} = \\frac{F_R}{\\sin \\gamma}
      \\Rightarrow \\alpha = \\sin^{-1}(\\frac{F_1}{F_R}sin\\gamma), \\beta =
      \\sin^{-1}(\\frac{F_2}{F_R}sin\\gamma)
            \\end{equation}`,
      eq3: `\\begin{equation}
      \\theta = \\begin{cases} \\theta_1 + \\beta ,& \\text{if } \\theta_1 \\lt \\theta_2 \\\\ 
      \\theta_2 + \\alpha ,& \\text{if } \\theta_1 \\geq \\theta_2 \\end{cases} 
            \\end{equation}`
    };
  }
};
</script>
