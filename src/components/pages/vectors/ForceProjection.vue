<template>
  <div class="row justify-content-center">
    <div class="col">&nbsp;</div>
    <div class="col-sm-auto">
      <div id="box1" style="width: 60vw; height: 60vh"></div>
    </div>
    <div class="col">&nbsp;</div>
  </div>
</template>

<script>
import * as math from "mathjs";
export default {
  data() {
    return {
      board: null,
      lol: 10
    };
  },
  mounted() {
    // create two boards: b1 is the control and b1 is the display
    const b1 = JXG.JSXGraph.initBoard("box1", { boundingbox: [-10, 10, 10, -10], axis: true, keepAspectRatio: true });

    // create two points for reference
    const pointA = b1.create("point", [0, 0], { fixed: true }, { name: "O", face: "" });
    const pointB = b1.create("point", [2.0, 4.0], { name: "B", face: "" });
    const pointC = b1.create("point", [4.0, 2.0], { name: "C" });

    // create the main vector
    const lineAB = b1.create("line", [pointA, pointB], { straightFirst: false, straightLast: false, lastArrow: true, strokeColor: "green" });
    const lineAC = b1.create("line", [pointA, pointC]);

    function getVec(a, b) {
      return math.subtract(b.coords.usrCoords, a.coords.usrCoords);
    }

    const getBPrime = () => {
      const vecAB = getVec(pointA, pointB);
      const vecAC = getVec(pointA, pointC);

      const unitAC = math.divide(vecAC, math.norm(vecAC));
      const scalarProj = math.dot(vecAB, vecAC) / math.norm(vecAC);
      return math.add(pointA.coords.usrCoords, math.multiply(unitAC, scalarProj));
    };

    const pointBprime = b1.create("point", [() => getBPrime()[1], () => getBPrime()[2]], { name: "B'", face: "", fillColor: "#000" });

    b1.create("line", [pointA, pointBprime], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      strokeColor: "red"
    });
  }
};
export const meta = {
  title: "force projection",
  description: "from JSX graph"
};
</script>

<style></style>
