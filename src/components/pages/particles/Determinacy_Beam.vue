<template>
  <div>
    <h1 class="text-danger text-center my-4">Determinacy of Beams</h1>
    <fix :globalData="storeData" @fromChild="updateGlobal" v-if="storeData.fix"></fix>
  </div>
</template>

<script>
import fix from "../../utils/Determinacy_Beam/fix";
export default {
  name: "Determinacy",
  components: { fix },
  data() {
    return {
      storeData: {
        posVal: 0.3,
        magVal: 1,
        dirVal: 90,
        posMoment: 0.6,
        magMoment: 1,
        dirMoment: true,
        fix: true,
        pin: false,
        roller: false
      }
    };
  },
  methods: {
    updateGlobal(payload) {
      this.storeData = payload;
    }
  }
};
export const meta = {
  title: "Determinacy of Beams",
  description: "Determinacy of Beams"
};
</script>
