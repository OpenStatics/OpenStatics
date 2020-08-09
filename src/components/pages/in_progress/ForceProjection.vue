<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Force Projection onto a Line</h1>
    <p>
      Upper text
    </p>
    <div class="text-center">
      <p>Centered text</p>
    </div>
    <fp />
  </div>
</template>
<script>
import force_projection from "../../utils/ForceProj/force_proj.vue";

export default {
  data() {
    return {};
  },
  components: {
    fp: force_projection
  }
};
export const meta = {
  title: "Force Projection onto a Line",
  description: "",
  number: 5
};
</script>

<style>
p {
  font-size: 16;
}
</style>
