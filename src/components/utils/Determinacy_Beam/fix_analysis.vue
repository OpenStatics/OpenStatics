<template>
  <div class="col-lg-4 text-center">
    <div>
      <p>
        <span>&Sigma;</span>
        M = <span style="color:red">M<sub>A</sub></span> +
        <span v-if="currentSelection === 0"
          ><span style="color:red">M<sub>B</sub></span> + </span
        >F<sub>y</sub> &#215; L<sub>f</sub> +
        <span v-if="currentSelection <= 1"
          ><span style="color:red">B<sub>y</sub></span> &#215; L +</span
        >
        M = 0
      </p>
      <p>
        <span>&Sigma;</span>
        F<sub>x</sub> = <span style="color:red">A<sub>x</sub></span> +
        <span v-if="currentSelection <= 1"
          ><span style="color:red">B<sub>x</sub></span> +</span
        >
        F<sub>x</sub> = 0
      </p>
      <p>
        <span>&Sigma;</span>
        F<sub>y</sub> = <span style="color:red">A<sub>y</sub></span> +
        <span v-if="currentSelection <= 2"
          ><span style="color:red">B<sub>y</sub></span> +</span
        >
        F<sub>y</sub> = 0
      </p>
    </div>
    <ul>
      <li>Reactive forces/moments: {{ 6 - currentSelection }}</li>
      <li>
        Equations of Equilibrium: 3
      </li>
      <li>Status: Statically <span v-if="currentSelection <= 2">indeterminate</span> <span v-if="currentSelection === 3">determinate</span></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "fix_analysis",
  props: {
    currentSelection: { type: Number }
  }
};
</script>
