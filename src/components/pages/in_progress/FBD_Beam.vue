<template>
  <div>
    <h1 class="text-danger text-center my-4">Free Body Diagram of Beam</h1>
    <cantForce :globalData="storeData" @fromChild="updateGlobal" v-if="storeData.cantMode && storeData.forceMode"></cantForce>
    <cantMoment :globalData="storeData" @fromChild="updateGlobal" v-if="storeData.cantMode && !storeData.forceMode"></cantMoment>
    <ssForce :globalData="storeData" @fromChild="updateGlobal" v-if="!storeData.cantMode && storeData.forceMode"></ssForce>
    <ssMoment :globalData="storeData" @fromChild="updateGlobal" v-if="!storeData.cantMode && !storeData.forceMode"></ssMoment>
  </div>
</template>

<script>
import cantForce from "../../utils/FBD_Beam/cant_force";
import cantMoment from "../../utils/FBD_Beam/cant_moment";
import ssForce from "../../utils/FBD_Beam/ss_foce";
import ssMoment from "../../utils/FBD_Beam/ss_moment";

export default {
  components: { cantForce, ssForce, cantMoment, ssMoment },
  data() {
    return {
      storeData: {
        posVal: 0.5,
        magVal: 1,
        dirVal: 90,
        cantMode: true,
        forceMode: true
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
  title: "Free Body Diagram of Beam",
  description: "FBD",
  number: 18
};
</script>
