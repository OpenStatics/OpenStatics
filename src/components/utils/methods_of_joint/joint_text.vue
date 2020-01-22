<template>
  <div>
    This Demonstration solves a truss using the method of joints, which involves doing force balances around one joint at a time. 1. Select "reaction
    forces" to see how the reaction forces Subscript[R, A] and Subscript[R, E] are calculated. 2. Then, under the drop-down menu, select "calculate
    moment" to see the moment balance around joint A and calculate the reaction force at joint E. Move the mouse over the equations to see an
    explanation of the moment balance. 3. Next, select "x-force balance" to do a force balance in the x-direction at joint A. Note that joint A is
    fixed but joint E can move in the x-direction. 4. Select "y-force balance" to determine the reaction force at joint A. 5. Select "balances at
    joints" and select joint A. Check "focus on joint" to zoom in on the members around the joint and display the force balances. Note that the
    direction of the arrows are drawn in "focus on joint" because we know the correct direction. If the arrows were drawn assuming all members were
    under tension, then a negative force would result, indicating the direction should be reversed. 6. Repeat step 5 for the other joints. 7. When
    "solved" is selected from the joints, the compression (green) and tension (red) forces are shown on the full diagram. Arrows that point outward
    represent the member's response to compression forces, which act to shorten the member. Arrows that point inward represent the member's response
    to tension forces, which act to lengthen the member. When doing balances around the joints, the signs on all of the forces are positive because we
    assume we can determine which members are under tension and which are under compression before solving the truss. This is done by starting at
    joint A, seeing that the reaction force points upward and knowing that the member force must point downward for the truss to remain stationary.
  </div>
</template>

<script>
export default {
  name: "methods of joint text"
};
</script>
