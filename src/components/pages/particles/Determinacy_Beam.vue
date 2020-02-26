<template>
  <div>
    <h1 class="text-danger text-center my-4">Determinacy of Beams</h1>
    <fix></fix>
  </div>
</template>

<script>
import fix from "../../utils/Determinacy_Beam/fix";

export default {
  name: "Determinacy",
  components: { fix }
};
export const meta = {
  title: "Determinacy of Beams",
  description: "Determinacy of Beams"
};
</script>
