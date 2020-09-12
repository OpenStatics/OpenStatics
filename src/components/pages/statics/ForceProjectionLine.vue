<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Force Projection onto a Line</h1>
    <p>
      Once we get a force, including its direction and magnitude, we can know its projection on a certain given line. In the following example, we
      have two lines which passes points A, B and points A, C separately, thus we can define them as line AB and line AC. The direction of force is
      along line AC and starts from point A, also its magnitude can be set. Thus, we can show the projection of force
      <vue-mathjax formula="$F_{AC}$" /> on line AB. The magnitude of projection is given by
    </p>
    <div class="text-center">
      <p><vue-mathjax formula="$F_{AB} = F_{AC} \cos(\theta)$" /></p>
    </div>
    <p>Where <vue-mathjax formula="$\theta$" /> is the angle between line AB and line AC.</p>
    <fp />
  </div>
</template>
<script>
import force_projection from "../../utils/ForceProj/force_proj_line.vue";

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
