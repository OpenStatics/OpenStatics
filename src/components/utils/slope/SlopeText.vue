<template>
  <div class="my-3">
    The module below shows how the friction changes on a slope. 
    <br />
    When a block is statistically placed on a slope with inclined angle <vue-mathjax formula="(\theta)" /> and
    coefficient of friction <vue-mathjax formula="(\mu)" />, the friction provided by the slope is a static frictional force; 
    as <vue-mathjax formula="(\theta)" /> increases gradually and exceeds the critical value, <vue-mathjax formula="(\theta_0 = \arctan(\mu))" />
    , the statistic balance is broken and the block begins to move, with the static frictional force changed to kinetic frictional force. 
    While in the original balance state, changing the mass of the block, m, cannot break the balance.
    <br />
    Module below shows these ideas where <vue-mathjax formula="(\mu)" /> and m are variable and <vue-mathjax formula="(\theta)" /> can be 
    increased automatically to <vue-mathjax formula="(\theta_0)" />. Play with these parameters to see how the FBD and balance change.
  </div>
</template>
<script>
export default {
  name: "Slope_Text"
};
</script>
