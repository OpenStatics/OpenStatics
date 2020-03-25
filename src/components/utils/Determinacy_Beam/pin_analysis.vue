<template>
    <div class="col-lg-4 text-center">
            <div>
              <p>
                <span>&Sigma;</span>
                M = F<sub>y</sub> &#215; L<sub>f</sub> + <span style="color:red">B<sub>y</sub></span> &#215; L + M = 0
              </p>
              <p>
                <span>&Sigma;</span>
                F<sub>x</sub> = <span style="color:red">A<sub>x</sub></span> +
                <span v-if="currentSelection === 4"
                  ><span style="color:red">B<sub>x</sub></span> +</span
                >
                F<sub>x</sub> = 0
              </p>
              <p>
                <span>&Sigma;</span>
                F<sub>y</sub> = <span style="color:red">A<sub>y</sub></span> + <span style="color:red">B<sub>y</sub></span> + F<sub>y</sub> = 0
              </p>
            </div>
            <ul>
              <li>Reactive forces/moments: {{ 8 - currentSelection }}</li>
              <li>
                Equations of Equilibrium: 3
              </li>
              <li>
                Status: Statically <span v-if="currentSelection === 4">indeterminate</span> <span v-if="currentSelection === 5">determinate</span>
              </li>
            </ul>
          </div>
</template>
<script>
export default {
  name: "pin_analysis",
  props: {
    currentSelection: { type: Number }
  }
};
</script>