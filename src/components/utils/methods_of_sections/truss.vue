<template>
  <div>
    <div id="box1" class="jsx-graph my-2 text-center"></div>
  </div>
</template>

<script>
export default {
  components: {},
  mounted() {
    const scale = 3;

    const b2 = JXG.JSXGraph.initBoard("box1", { boundingbox: [-20, 20, 20, -20], keepAspectRatio: true, showCopyright: false });

    const force = b2.create("slider", [[-3, -10], [3, -10], [1, 1, 2]], { name: "Load F_C" });
    const angle = b2.create("slider", [[-3, -12], [3, -12], [19, 90, 198]], { name: "Angle(&Phi;)" });

    /*
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
    */

    // create R_Ax text
    // b2.create(
    //   "text",
    //   [
    //     -2,
    //     -4,
    //     function() {
    //       return "Sum of the x forces:" + getR_Ax();
    //     }
    //   ],
    //   { fixed: true }
    // );

    // create R_Ay text
    // b2.create("text", [
    //   -2,
    //   -8,
    //   function() {
    //     return "R_Ay: " + getR_Ay();
    //   }
    // ]);

    // // create RE text
    // b2.create("text", [
    //   -2,
    //   -6,
    //   function() {
    //     return "R_E: " + getRE();
    //   }
    // ]);

    // create points
    const a = b2.create("point", [-3 * scale, 0], { name: "A", fixed: true, fillColor: "blue", strokeColor: "blue" });
    const b = b2.create("point", [-1 * scale, 2 * scale], { name: "B", fixed: true, fillColor: "blue", strokeColor: "blue" });
    const c = b2.create("point", [1 * scale, 2 * scale], { name: "C", fixed: true, fillColor: "blue", strokeColor: "blue" });
    const d = b2.create("point", [3 * scale, 2 * scale], { name: "D", fixed: true, fillColor: "blue", strokeColor: "blue" });
    const e = b2.create("point", [3 * scale, 0], { name: "E", fixed: true, fillColor: "blue", strokeColor: "blue" });
    const f = b2.create("point", [1 * scale, 0], { name: "F", fixed: true, fillColor: "blue", strokeColor: "blue" });
    const g = b2.create("point", [-1 * scale, 0], { name: "G", fixed: true, fillColor: "blue", strokeColor: "blue" });

    const pointF = b2.create(
      "point",
      [
        function() {
          const x = Math.cos((angle.Value() / 180) * Math.PI);
          if (Math.abs(x) < Math.pow(10, -7)) return x - 10;
          return -1 * scale * force.Value() * x - 3 * scale;
        },
        function() {
          const y = Math.sin((angle.Value() / 180) * Math.PI);
          if (Math.abs(y) < Math.pow(10, -7)) return 0;
          return -1 * scale * force.Value() * y;
        }
      ],
      { visible: false }
    );
    /*
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
      { visible: false }
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
        visible: false
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
        visible: false
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
        visible: false
      }
    );
    */

    // connect points
    b2.create("line", [a, b], { straightFirst: false, straightLast: false });
    b2.create("line", [a, g], { straightFirst: false, straightLast: false });
    b2.create("line", [b, c], { straightFirst: false, straightLast: false });
    b2.create("line", [b, g], { straightFirst: false, straightLast: false });
    b2.create("line", [c, d], { straightFirst: false, straightLast: false });
    b2.create("line", [c, f], { straightFirst: false, straightLast: false });
    b2.create("line", [c, g], { straightFirst: false, straightLast: false });
    b2.create("line", [d, e], { straightFirst: false, straightLast: false });
    b2.create("line", [d, f], { straightFirst: false, straightLast: false });
    b2.create("line", [e, f], { straightFirst: false, straightLast: false });
    b2.create("line", [f, g], { straightFirst: false, straightLast: false });

    // create force vectors
    // const line_cfc = b2.create("line", [c, pointFC], { straightFirst: false, straightLast: false, touchFirstPoint: true, lastArrow: true });
    // const line_aray = b2.create("line", [a, pointR_Ay], { straightFirst: false, straightLast: false, firstArrow: true, touchFirstPoint: true });
    // const line_arax = b2.create("line", [a, pointR_Ax], { straightFirst: false, straightLast: false, firstArrow: true, touchFirstPoint: true });
    // const line_ere = b2.create("line", [e, pointRE], { straightFirst: false, straightLast: false, touchFirstPoint: true, firstArrow: true });
    const line_af = b2.create("line", [a, pointF], { straightFirst: false, straightLast: false, touchFirstPoint: true, lastArrow: true });

    // create text on force vector FC
    b2.create(
      "text",
      [
        0,
        -0.5,
        function() {
          return "F = " + force.Value() + "N";
        }
      ],
      { anchor: pointF }
    );

    const label1 = b2.create("text", [
      -5,
      -8,
      "If only the forces in several members are desired, method of section gives us a quick and direct way"
    ]);
    /*
    b2.create(
      "text",
      [
        0,
        -0.5,
        function() {
          return "F_C =" + force.Value() + "N";
        }
      ],
      { anchor: pointFC }
    );
    // create text on force vectors RAx
    b2.create(
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
    b2.create(
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

    // create text on force vectors RE
    b2.create(
      "text",
      [
        0,
        -0.5,
        function() {
          return "R_{E} =" + getRE() + "N";
        }
      ],
      { anchor: pointRE }
    );
    */
  }
};
export const meta = {
  title: "methods of sections",
  description: "In Progress - WATKINS"
};
</script>
