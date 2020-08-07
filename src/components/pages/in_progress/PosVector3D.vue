<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Position Vector 3D</h1>
    <p>
      Upper text
    </p>
    <div class="text-center">
      <p>Centered text</p>
    </div>
    <pv />
  </div>
</template>
<script>
import position_vector_3D from "../../utils/PosVec3D/pos_vec_3D.vue";

export default {
  data() {
    return {};
  },
  components: {
    pv: position_vector_3D
  }
};
export const meta = {
  title: "Position Vector 3D",
  description: "",
  number: 4
};
</script>

<style>
p {
  font-size: 16;
}
</style>
