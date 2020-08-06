<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Force Vector 3D</h1>
    <p>
      Upper text
    </p>
    <div class="text-center">
      <p>Centered text</p>
    </div>
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
