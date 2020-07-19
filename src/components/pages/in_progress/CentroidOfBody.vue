<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Centroid of Body</h1>
    <p>
      The centroid represents the geometric center of a body. This point coincides with the center of mass, or the center of gravity only if the
      material composing the body is uniform or homogeneous. The formulas used to locate the center of gravity, or the centroid, simply represents a
      balance between the sum of moments of all the parts of the system. In some cases, the centroid is located at a point that is not on the object.
    </p>
    <p>
      A differential element of thickness <vue-mathjax formula="$dx$" /> is created below. The area of the element is:
      <vue-mathjax :formula="eq1" /> and its centroid is located at <vue-mathjax :formula="eq2" />
    </p>
    <div class="text-center">
      <vue-mathjax :formula="eq3" />
      <br />
      <br />
      <vue-mathjax :formula="eq4" />
    </div>
    <centroid ref="foo" />
  </div>
</template>
<script>
import centroid_body from "../../utils/CentroidBody/centroid_body.vue";

export default {
  data() {
    return {
      eq1: "$A = \\int y dx \\implies dA = ydx$",
      eq2: "$P=(\\bar{x}, \\bar{y})$",
      eq3: "$\\bar{x} = \\frac{\\int x dA}{\\int dA} = \\frac{ \\int xy dx}{\\int y dx}$",
      eq4: "$\\bar{y} = \\frac{\\int y dA}{\\int dA} = \\frac{ \\int (y/2)y dx}{\\int y dx}$"
    };
  },
  components: {
    centroid: centroid_body
  }
};
export const meta = {
  title: "Centroid of a Body",
  description: "Non sense",
  number: 28
};
</script>

<style>
p {
  font-size: 16;
}
</style>
