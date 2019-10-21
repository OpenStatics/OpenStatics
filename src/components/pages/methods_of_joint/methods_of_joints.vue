<template>
  <div>
    <div id="box2" class="jsx-graph my-2 text-center"></div>
    <button>Analysis on A</button>
    <button>Analysis on B</button>
    <button>Analysis on C</button>
    <button>Analysis on D</button>
    <button>Analysis on E</button>
  </div>
</template>

<script>
export default {
  components: {
  },
  mounted() {
    const fixedDecimal = 4;

    const b2 = JXG.JSXGraph.initBoard("box2", { boundingbox: [-15, 15, 15, -15], keepAspectRatio: true, showCopyright: false });

    const force = b2.create("slider", [[-3, -10], [3, -10], [1, 1, 2]], { name: "Load F_C" });
    const angle = b2.create("slider", [[-3, -12], [3, -12], [0, 90, 180]], { name: "Angle(&Phi;)" });

    // get RA_x value
    const getR_Ax = function() {
      const R_Ax = Math.cos((angle.Value() / 180) * Math.PI) * force.Value();
      if (Math.abs(R_Ax) < Math.pow(10, -7)) return 0;
      return parseFloat(R_Ax.toFixed(fixedDecimal));
    };

    // get RA_y value
    const getR_Ay = function() {
      const x = Math.sin((angle.Value() / 180) * Math.PI);

      const R_Ay = force.Value() * x - getRE();

      if (Math.abs(R_Ay) < Math.pow(10, -7)) return 0;

      return parseFloat(R_Ay.toFixed(fixedDecimal));
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

    // create R_Ax text
    b2.create(
      "text",
      [
        -2,
        -4,
        function() {
          return "Sum of the x forces:" + getR_Ax();
        }
      ],
      { fixed: true }
    );

    // create R_Ay text
    b2.create("text", [
      -2,
      -8,
      function() {
        return "R_Ay: " + getR_Ay();
      }
    ]);

    // create RE text
    b2.create("text", [
      -2,
      -6,
      function() {
        return "R_E: " + getRE();
      }
    ]);

    // add points
    const a = b2.create("point", [0, 0], { name: "a", fixed: true });
    const b = b2.create("point", [-10, 0], { name: "b", fixed: true });
    const c = b2.create("point", [10, 0], { name: "c", fixed: true });
    const d = b2.create("point", [5, 5 * Math.sqrt(3)], { name: "d", fixed: true });
    const e = b2.create("point", [-5, 5 * Math.sqrt(3)], { name: "e", fixed: true });

    // create FC point
    const pointFC = b2.create(
      "point",
      [
        function() {
          const x = Math.cos((angle.Value() / 180) * Math.PI);
          if (Math.abs(x) < Math.pow(10, -7)) return 0;
          return -3 * x;
        },
        function() {
          const y = Math.sin((angle.Value() / 180) * Math.PI);
          if (Math.abs(y) < Math.pow(10, -7)) return 0;
          return -3 * force.Value() * y;
        }
      ],
      { fixed: true, face: "", name: `F_C = ${force.Value()} N` }
    );

    // create R_Ax point
    const pointR_Ax = b2.create(
      "point",
      [
        function() {
          return -3 * Math.abs(getR_Ax()) - 10;
        },
        0
      ],
      {
        fixed: true,
        face: "",
        name: function() {
          return "R_{A,x} =" + getR_Ax() + "N";
        },
        offsetX: 10
      }
    );

    // create R_Ay point
    const pointR_Ay = b2.create(
      "point",
      [
        -10,
        function() {
          return -3 * Math.abs(getR_Ay());
        }
      ],
      {
        fixed: true,
        face: "",
        name: function() {
          return "R_{A,y} =" + getR_Ay() + "N";
        }
      }
    );

    // create RE point
    const pointRE = b2.create(
      "point",
      [
        10,
        function() {
          return -3 * Math.abs(getRE());
        }
      ],
      {
        fixed: true,
        face: "",
        name: function() {
          return "R_{E} =" + getRE() + "N";
        }
      }
    );

    // connect points
    b2.create("line", [a, e], { name: "lala", straightFirst: false, straightLast: false });
    b2.create("line", [a, d], { straightFirst: false, straightLast: false });
    b2.create("line", [e, d], { straightFirst: false, straightLast: false });
    b2.create("line", [a, b], { straightFirst: false, straightLast: false });
    b2.create("line", [a, c], { straightFirst: false, straightLast: false });
    b2.create("line", [b, e], { straightFirst: false, straightLast: false });
    b2.create("line", [c, d], { straightFirst: false, straightLast: false });

    // add force vectors
    b2.create("line", [a, pointFC], { straightFirst: false, straightLast: false, touchFirstPoint: true, lastArrow: true });
    b2.create("line", [b, pointR_Ay], { straightFirst: false, straightLast: false, firstArrow: true, touchFirstPoint: true });
    b2.create("line", [b, pointR_Ax], {
      straightFirst: false,
      straightLast: false,
      firstArrow: function() {
        return getR_Ax() > 0;
      },
      lastArrow: function() {
        return getR_Ax() < 0;
      },
      touchFirstPoint: true
    });
    b2.create("line", [c, pointRE], { straightFirst: false, straightLast: false, touchFirstPoint: true, firstArrow: true });

    // need joint analysis
  }
};
export const meta = {
  title: "methods of joint demo",
  description: "joint"
};
</script>