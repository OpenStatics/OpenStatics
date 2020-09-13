<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Moment of a Force 2D</h1>
    <p>
      The moment of a force Overscript[F, \[RightVector]] about point O, or actually about the moment axis passing through O and perpendicular to the
      plane containing O and Overscript[F, \[RightVector]], can be expressed using the vector cross product, namely Subscript[Overscript[M,
      \[RightVector]], O]=Overscript[r, \[RightVector]]*Overscript[F, \[RightVector]]. Here Overscript[r, \[RightVector]] represents a position vector
      directed from O to any point on the line of action of Overscript[F, \[RightVector]]. For a beam with unbalanced moment Subscript[Overscript[M,
      \[RightVector]], O], the equation of motion is described by Subscript[Overscript[M, \[RightVector]], O]= Subscript[I,
      O]Overscript[Overscript[\[Theta], ¨], \[RightVector]], where Overscript[Overscript[\[Theta], ¨], \[RightVector]] is the angular acceleration,
      Subscript[I, O] is the moment of inertia with respect to O. If the beam is constrained to be rotate within certain plane, the equation of motion
      is simplified as Subscript[M, O]= Subscript[I, O]Overscript[\[Theta], ¨]. So we see, in order to keep the beam in static, we need to make the
      Subscript[M, O] to zero. For the following problem, we have two forces Subscript[Overscript[F, \[RightVector]], 1],Subscript[Overscript[F,
      \[RightVector]], 2], with their magnitudes, directions and acting positions to be set. Both of them produce the moment with respect to hinge,
      and the resultant may cause the moment to rotate with respect to hinge. We can see the rotation once we set unbalanced moment of these two
      forces. Also, we can see that the beam will keep in static once the resultant moment is zero.
    </p>

    <!-- <div class="text-center">
      <p><vue-mathjax formula="$\vec{r}$" /></p>
    </div> -->
    <mf />
  </div>
</template>
<script>
import moment_of_force from "../../utils/MomentOfForce/moment_of_force_2D.vue";

export default {
  data() {
    return {};
  },
  components: {
    mf: moment_of_force
  }
};
export const meta = {
  title: "Moment of Force 2D",
  description: "",
  number: 9
};
</script>

<style>
p {
  font-size: 16;
}
</style>
