<template>
  <div>
    <div id="boxA" class="jsx-graph"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    const fixedDecimal = 4;

    const board = JXG.JSXGraph.initBoard("boxA", { boundingbox: [-15, 15, 15, -15], keepAspectRatio: true, showCopyright: false });

    const force = board.create("slider", [[-3, -10], [3, -10], [1, 1, 2]], { name: "Load F_C" });
    const angle = board.create("slider", [[-3, -12], [3, -12], [0, 90, 180]], { name: "Angle(&Phi;)" });

    // get RA_x value
    const getR_Ax = function() {
      const R_Ax = Math.cos((angle.Value() / 180) * Math.PI) * force.Value();
      if (Math.abs(R_Ax) < Math.pow(10, -7)) return 0;
      return parseFloat(R_Ax.toFixed(fixedDecimal));
    };

    // get RE value
    const getRE = function() {
      const x = Math.sin((angle.Value() / 180) * Math.PI);
      const lengthRE = 2;
      const lengthF = 1;
      const RE = (force.Value() * x * lengthF) / lengthRE;
      if (Math.abs(RE) < Math.pow(10, -7)) return 0;
      return parseFloat(RE.toFixed(fixedDecimal));
    };

    // get RA_y value
    const getR_Ay = function() {
      const x = Math.sin((angle.Value() / 180) * Math.PI);

      const R_Ay = force.Value() * x - getRE();

      if (Math.abs(R_Ay) < Math.pow(10, -7)) return 0;

      return parseFloat(R_Ay.toFixed(fixedDecimal));
    };

    // create points
    const a = board.create("point", [-10, 0], { name: "a", fixed: true });
    const b = board.create(
      "point",
      [
        function() {
          return -10 + Math.abs(getR_Ay() / Math.sin((angle.Value() / 180) * Math.PI)) * Math.cos(Math.PI / 3) * 10;
        },
        function() {
          return Math.abs(getR_Ay() / Math.sin((angle.Value() / 180) * Math.PI)) * Math.sin(Math.PI / 3) * 10;
        }
      ],
      { visible: false }
    );
    const c = board.create("point", [0, 0], { visible: false });

    // connect points
    const line_ab = board.create("line", [a, b], { name: "lala", straightFirst: false, straightLast: false, lastArrow: true });
    const line_ac = board.create("line", [a, c], { straightFirst: false, straightLast: false, lastArrow: true });

    // create R_Ax point
    const pointR_Ax = board.create(
      "point",
      [
        function() {
          return -3 * Math.abs(getR_Ax()) - 10;
        },
        0
      ],
      {
        fixed: true,
        visible: false
      }
    );
    // create R_Ay point
    const pointR_Ay = board.create(
      "point",
      [
        -10,
        function() {
          return -3 * Math.abs(getR_Ay());
        }
      ],
      {
        fixed: true,
        visible: false
      }
    );

    // create force vectors
    const line_aray = board.create("line", [a, pointR_Ay], { straightFirst: false, straightLast: false, firstArrow: true, touchFirstPoint: true });
    const line_arax = board.create("line", [a, pointR_Ax], { straightFirst: false, straightLast: false, firstArrow: true, touchFirstPoint: true });

    // create text on force vectors RAx
    board.create(
      "text",
      [
        -2,
        1,
        function() {
          return "R_{A,x} =" + getR_Ax() + "N";
        }
      ],
      { anchor: pointR_Ax }
    );

    // create text on force vectors RAy
    board.create(
      "text",
      [
        0,
        -0.5,
        function() {
          return "R_{A,y} =" + getR_Ay() + "N";
        }
      ],
      { anchor: pointR_Ay }
    );
  }
};
</script>