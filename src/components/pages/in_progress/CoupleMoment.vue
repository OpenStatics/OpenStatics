<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Moment of a Force 2D</h1>
    <p>
      A couple is defined as two parallel forces that have the same magnitude, but opposite directions, and are separated by a perpendicular distance
      d. Since the resultant force is zero, the only effect of a couple is to produce an actual rotation, or if no movement is possible, there is a
      tendency of rotation in a specified direction. The moment produced by a couple is called a couple moment. We can determine its value by finding
      the sum of the moments of both couple forces about any arbitrary point. The magnitude of moment can be defined as
    </p>
    <div class="text-center">
      <vue-mathjax formula="M=Fd" />
    </div>
    <p>
      Where F is the magnitude of one of the forces and d is the perpendicular distance or moment arm between the forces. In the following example, a
      couple act on a gear, in which we can define the acting point of each force, as well as the magnitude and direction of the force, and see the
      effect of such moment on the gear.
    </p>

    <!-- <div class="text-center">
      <p><vue-mathjax formula="$\vec{r}$" /></p>
    </div> -->
    <couple />
  </div>
</template>
<script>
import couple_moment from "../../utils/CoupleMoment/couple_moment.vue";

export default {
  data() {
    return {};
  },
  components: {
    couple: couple_moment
  }
};
export const meta = {
  title: "Couple Moment",
  description: "",
  number: 12
};
</script>

<style>
p {
  font-size: 16;
}
</style>
