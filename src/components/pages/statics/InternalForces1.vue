<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Internal Forces of Beam 1</h1>
    <p>
      To design a structural or mechanical member it is necessary to know the loading acting within the member in order to be sure the material can
      resist this loading. Internal loadings can be determined by using the method of sections. To illustrate this method, this module will show you
      how to determine the internal loadings.
    </p>
    <p><b>Normal force</b>: The force component that acts perpendicular to the cross section.</p>
    <p><b>Shear force</b>: The force component that is tangent to the cross section.</p>
    <p><b>Bending moment</b>: The couple moment within the section.</p>
    <p>
      The force components prevent the relative translation between the two segments, and the couple moment prevents the relative rotation. According
      to Newton's third law, these loadings must act in opposite directions on each segment.
    </p>
    <intforc ref="foo" />
  </div>
</template>

<script>
import int_forc from "../../utils/Internal_Forces/internal_forces_1.vue";

export default {
  data() {
    return { currentSelection: 0 };
  },
  components: {
    intforc: int_forc
  }
};
export const meta = {
  title: "Internal Forces in a Beam 1",
  description: "",
  number: 24
};
</script>

<style>
p {
  font-size: 16;
}
</style>
