<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Internal Forces of Beam 2</h1>
    <p class="text-center">
      Based on the problem 7-7 of R. C. Hibbeler's Statics, 13th edition
    </p>
    <img src="../../../assets/IF2_clean.png" class="mx-auto d-block" />
    <br />
    <intforc ref="foo" />
  </div>
</template>

<script>
import int_forc from "../../utils/Internal_Forces/internal_forces_2.vue";

export default {
  data() {
    return { currentSelection: 0 };
  },
  components: {
    intforc: int_forc
  }
};
export const meta = {
  title: "Internal Forces in a Beam 2",
  description: "",
  number: 25
};
</script>

<style>
p {
  font-size: 16;
}
</style>
