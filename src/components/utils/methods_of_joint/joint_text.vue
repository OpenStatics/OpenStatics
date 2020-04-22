<template>
  <div>
    <div>
      <p>
        To demonstrate the essence of method of joint, this modules solves a truss problem using the method of joint. Try to solve this problem first
        by using the default settings, then check your process and answers with this module.
      </p>
      <p>
        <ol>
          <li>
          The start point is to solve the reaction forces, i.e. the external forces applied on joint <i>A</i> and <i>E</i>. Choose "Loaded Truss" for the left
          menu, and then go through the five drop down buttons for the right menu, i.e. "Truss", "FBD", "&Sigma;M<sub>A</sub>=0",
          "&Sigma;F<sub>x</sub>=0", "&Sigma;F<sub>y</sub>=0", and "Solved FBD", to see the whole process and results for the
          determination of external forces.
        </li>
        <li>
          Choose "Balances at Joints" for the left menu. Now you will be leaded to focus on the equilibrium of joints of <i>A</i>, <i>B</i>, <i>C</i> and <i>D</i> sequentially,
          by choosing the corresponding button under "Joints" menu.
        </li>
        <li>
          Now, you can check the box for "Joint Analysis" menu and once again, go through the buttons <i>A</i>, <i>B</i>, <i>C</i> and <i>D</i> under the "Joints" menu, to see
          how this module solves these unknown member forces by considering joint equilibrium.
        </li>
        <li>
          Finally, by choosing the "Solved" button under "Joints" menu, all the member forces are listed with their values and colors indicating
          tension (green) or compression (purple). The external reaction forces are indicated by red.
          </li>
      
        </ol>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  title: "methods of joint text",
  description: "joint"
};
</script>
