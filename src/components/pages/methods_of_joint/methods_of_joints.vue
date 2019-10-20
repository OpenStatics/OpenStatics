<template>
  <div>
    <div id="box1" class="jsx-graph2 my-2"></div>
    <div id="box2" class="jsx-graph my-2 text-center"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    const b1 = JXG.JSXGraph.initBoard("box1", { boundingbox: [-10, 10, 10, -10] });
    const b2 = JXG.JSXGraph.initBoard("box2", { boundingbox: [-15, 15, 15, -15], keepAspectRatio: true });
    b1.addChild(b2);

    const force = b1.create("slider", [[-3, 0], [3, 0], [1, 1, 2]], { name: "Load F_C" });
    const angle = b1.create("slider", [[-3, -2], [3, -2], [0, 90, 180]], { name: "Angle(&Phi;)" });

    // get RA_x value
    b2.create(
      "text",
      [
        -2,
        -4,
        function() {
          const R_Ax = Math.cos((angle.Value() / 180) * Math.PI) * force.Value();
          if (Math.abs(R_Ax) < Math.pow(10, -7)) return "Sum of the x forces:" + 0;
          return "Sum of the x forces:" + R_Ax;
        }
      ],
      { fixed: true }
    );

    // get RE value
    b2.create("text", [
      -2,
      -6,
      function() {
        const x = Math.sin((angle.Value() / 180) * Math.PI);
        const lengthRE = 2;
        const lengthF = 1;
        const r_e = (force.Value() * x * lengthF) / lengthRE;
        if (Math.abs(r_e) < Math.pow(10, -7)) return "R_E: " + 0;
        return "R_E: " + r_e;
      }
    ]);

    // get RA_y value
    b2.create("text", [
      -2,
      -8,
      function() {
        const x = Math.sin((angle.Value() / 180) * Math.PI);

        const lengthRE = 2;
        const lengthF = 1;
        const r_e = (force.Value() * x * lengthF) / lengthRE;

        const r_ay = force.Value() * x - r_e;

        if (Math.abs(r_ay) < Math.pow(10, -7)) return "R_Ay: " + 0;

        return "R_Ay: " + r_ay;
      }
    ]);

    // add points
    const a = b2.create("point", [0, 0], { name: "a", fixed: true });
    const b = b2.create("point", [-10, 0], { name: "b", fixed: true });
    const c = b2.create("point", [10, 0], { name: "c", fixed: true });
    const d = b2.create("point", [5, 5 * Math.sqrt(3)], { name: "d", fixed: true });
    const e = b2.create("point", [-5, 5 * Math.sqrt(3)], { name: "e", fixed: true });
    
    
    const F_C = b2.create(
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

    // connect points
    b2.create("line", [a, e], { name: "lala", straightFirst: false, straightLast: false });
    b2.create("line", [a, d], { straightFirst: false, straightLast: false });
    b2.create("line", [e, d], { straightFirst: false, straightLast: false });
    b2.create("line", [a, b], { straightFirst: false, straightLast: false });
    b2.create("line", [a, c], { straightFirst: false, straightLast: false });
    b2.create("line", [b, e], { straightFirst: false, straightLast: false });
    b2.create("line", [c, d], { straightFirst: false, straightLast: false });

    // add force vectors
    b2.create("line", [a, F_C], { straightFirst: false, straightLast: false, touchFirstPoint: true, lastArrow: true });
    b2.create("line", [b, [-10, -3]], { straightFirst: false, straightLast: false, firstArrow: true, touchFirstPoint: true });
    b2.create("line", [b, [-13, 0]], { straightFirst: false, straightLast: false, firstArrow: true, touchFirstPoint: true });
    b2.create("line", [c, [10, -3]], { straightFirst: false, straightLast: false, touchFirstPoint: true, firstArrow: true });
  }
};
export const meta = {
  title: "methods of joint demo",
  description: "joint"
};
</script>