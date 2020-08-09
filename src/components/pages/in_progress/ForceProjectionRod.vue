<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Force Vector Projection</h1>
    <p>
      Upper text
      <vue-mathjax formula="$F_{AC}$" />
    </p>
    <div class="text-center">
      <p><vue-mathjax formula="$F_{AB}$" />middle text</p>
    </div>
    <fp />
  </div>
</template>
<script>
import force_projection from "../../utils/ForceProj/force_proj_rod.vue";

export default {
  data() {
    return {};
  },
  components: {
    fp: force_projection
  }
};
export const meta = {
  title: "Force Vector Projection",
  description: "",
  number: 6
};
</script>

<style>
p {
  font-size: 16;
}
</style>
