<template>
  <div>
    <h1 class="text-danger text-center my-4">Introduction to Free Body Diagram</h1>
    <startFBD :globalData="storeData" @fromChild="updateGlobal" v-if="!storeData.RFMode && !storeData.RRMode"></startFBD>
    <RRFBD :globalData="storeData" @fromChild="updateGlobal" v-if="!storeData.RFMode && storeData.RRMode"></RRFBD>
    <RFFBD :globalData="storeData" @fromChild="updateGlobal" v-if="storeData.RFMode"></RFFBD>
  </div>
</template>

<script>
import startFBD from "../../utils/Intro_FBD/Start";
import RFFBD from "../../utils/Intro_FBD/ReactiveForceOn";
import RRFBD from "../../utils/Intro_FBD/RemoveRollerOn";

export default {
  data() {
    return {
      storeData: {
        posVal: 2,
        magVal: 2,
        dirVal: 90,
        RFMode: false,
        RRMode: false
      }
    };
  },
  components: {
    startFBD,
    RFFBD,
    RRFBD
  },
  methods: {
    updateGlobal(payload) {
      this.storeData = payload;
    }
  }
};
export const meta = {
  title: "Introduction to Free Body Diagram",
  description: "ok"
};
</script>
