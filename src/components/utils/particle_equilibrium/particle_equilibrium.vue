<template>
  <div class="container">
    <div class="row">
      <!-- <div id="box_totalPE" class="box_particle_simulator" style="width:800px; height:800px;"></div> -->
      <div class="col-auto">
        <div id="box_vector_sliders" class="box_vector_sliders" style="width:300px; height:600px;"></div>
      </div>
      <div class="col-auto">
        <div id="box_particle_simulator" class="box_particle_simulator" style="width:600px; height:600px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => {
    return {
      box_sliders: undefined,
      box_simulator: undefined,
      box_total: undefined,
      sliders: {
        f1_force: undefined,
        f1_angle: undefined,
        f2_force: undefined,
        f2_angle: undefined,
        f3_force: undefined,
        f3_angle: undefined,
        mass: undefined,
        time: undefined
      },
      point_main: undefined,
      point_1: undefined,
      line_1: undefined,
      point_2: undefined,
      line_2: undefined,
      point_3: undefined,
      line_3: undefined,
      line_dotted: undefined
    };
  },
  methods: {
    init() {
      this.box_sliders = JXG.JSXGraph.initBoard("box_vector_sliders", {
        boundingbox: [-15, 15, 15, -15],
        keepAspectRatio: true,
        showCopyright: false
      });

      const incr = 5;
      const start = 0;
      const left = -13;
      const right = -2;

      this.sliders.f1_force = this.box_sliders.create("slider", [[left, start - incr * 0], [right, start - incr * 0], [0, 0, 10]], {
        name: "F_1 (N)",
        label: { color: "red" }
      });
      this.sliders.f1_angle = this.box_sliders.create("slider", [[left, start - incr * 1], [right, start - incr * 1], [0, 0, 360]], {
        name: "\u03B8_1 (\u00B0)",
        label: { color: "red" }
      });
      this.sliders.f2_force = this.box_sliders.create("slider", [[left, start - incr * 2], [right, start - incr * 2], [0, 0, 10]], {
        name: "F_2 (N)",
        label: { color: "blue" }
      });
      this.sliders.f2_angle = this.box_sliders.create("slider", [[left, start - incr * 3], [right, start - incr * 3], [0, 0, 360]], {
        name: "\u03B8_2 (\u00B0)",
        label: { color: "blue" }
      });
      this.sliders.f3_force = this.box_sliders.create("slider", [[left, start - incr * 4], [right, start - incr * 4], [0, 0, 10]], {
        name: "F_3 (N)",
        label: { color: "green" }
      });
      this.sliders.f3_angle = this.box_sliders.create("slider", [[left, start - incr * 5], [right, start - incr * 5], [0, 0, 360]], {
        name: "\u03B8_3 (\u00B0)",
        label: { color: "green" }
      });
      this.sliders.mass = this.box_sliders.create("slider", [[left, start - incr * 6], [right, start - incr * 6], [1, 1, 3]], { name: "Mass (kg)" });
      this.sliders.time = this.box_sliders.create("slider", [[left, start - incr * 7], [right, start - incr * 7], [0, 0, 15]], { name: "Time (s)" });

      this.box_sliders.fullUpdate();

      this.box_simulator = JXG.JSXGraph.initBoard("box_particle_simulator", {
        boundingbox: [-15, 15, 15, -15],
        keepAspectRatio: true,
        showCopyright: false
      });

      this.box_sliders.addChild(this.box_simulator);
      this.box_simulator.addChild(this.box_sliders);

      //   this.sliders.time = this.box_simulator.create("slider", [[-5, 5], [5, 5], [0, 0, 10]], {
      //     name: "Time (s)"
      //   });

      function totalForce(sliders) {
        return function() {
          const x1 = sliders.f1_force.Value() * Math.cos((sliders.f1_angle.Value() * Math.PI) / 180);
          const x2 = sliders.f2_force.Value() * Math.cos((sliders.f2_angle.Value() * Math.PI) / 180);
          const x3 = sliders.f3_force.Value() * Math.cos((sliders.f3_angle.Value() * Math.PI) / 180);
          const y1 = sliders.f1_force.Value() * Math.sin((sliders.f1_angle.Value() * Math.PI) / 180);
          const y2 = sliders.f2_force.Value() * Math.sin((sliders.f2_angle.Value() * Math.PI) / 180);
          const y3 = sliders.f3_force.Value() * Math.sin((sliders.f3_angle.Value() * Math.PI) / 180);
          return { x: x1 + x2 + x3, y: y1 + y2 + y3 };
        };
      }

      const scale = 13.5;

      function mainLocation(sliders, code) {
        if (code == "x")
          return function() {
            return (0.5 * totalForce(sliders)().x * sliders.time.Value() * sliders.time.Value()) / sliders.mass.Value() / scale;
          };
        else if (code == "y")
          return function() {
            return (0.5 * totalForce(sliders)().y * sliders.time.Value() * sliders.time.Value()) / sliders.mass.Value() / scale;
          };
      }
      function offsetLocation(sliders, code) {
        if (code == "x1")
          return function() {
            return mainLocation(sliders, "x")() + sliders.f1_force.Value() * Math.cos((sliders.f1_angle.Value() * Math.PI) / 180);
          };
        else if (code == "y1")
          return function() {
            return mainLocation(sliders, "y")() + sliders.f1_force.Value() * Math.sin((sliders.f1_angle.Value() * Math.PI) / 180);
          };
        else if (code == "x2")
          return function() {
            return mainLocation(sliders, "x")() + sliders.f2_force.Value() * Math.cos((sliders.f2_angle.Value() * Math.PI) / 180);
          };
        else if (code == "y2")
          return function() {
            return mainLocation(sliders, "y")() + sliders.f2_force.Value() * Math.sin((sliders.f2_angle.Value() * Math.PI) / 180);
          };
        else if (code == "x3")
          return function() {
            return mainLocation(sliders, "x")() + sliders.f3_force.Value() * Math.cos((sliders.f3_angle.Value() * Math.PI) / 180);
          };
        else if (code == "y3")
          return function() {
            return mainLocation(sliders, "y")() + sliders.f3_force.Value() * Math.sin((sliders.f3_angle.Value() * Math.PI) / 180);
          };
      }

      this.point_main = this.box_simulator.create("point", [mainLocation(this.sliders, "x"), mainLocation(this.sliders, "y")], { visible: false });

      //   this.point_1 = this.box_simulator.create(
      //     "point",
      //     [
      //       () => {
      //         return mainLocation(this.sliders, "x") + this.sliders.f1_force.Value() * Math.cos((this.sliders.f1_angle.Value() * Math.PI) / 180);
      //       },
      //       () => {
      //         return mainLocation(this.sliders, "y") + this.sliders.f1_force.Value() * Math.sin((this.sliders.f1_angle.Value() * Math.PI) / 180);
      //       }
      //     ],
      //     { visible: true }
      //   );
      //console.log(offsetLocation(this.sliders, "x1")());
      this.point_1 = this.box_simulator.create("point", [offsetLocation(this.sliders, "x1"), offsetLocation(this.sliders, "y1")], { visible: false });
      this.point_2 = this.box_simulator.create("point", [offsetLocation(this.sliders, "x2"), offsetLocation(this.sliders, "y2")], { visible: false });
      this.point_3 = this.box_simulator.create("point", [offsetLocation(this.sliders, "x3"), offsetLocation(this.sliders, "y3")], { visible: false });

      this.line_1 = this.box_simulator.create("line", [this.point_main, this.point_1], {
        firstArrow: false,
        lastArrow: true,
        straightFirst: false,
        straightLast: false,
        strokeColor: "red"
      });
      this.line_2 = this.box_simulator.create("line", [this.point_main, this.point_2], {
        firstArrow: false,
        lastArrow: true,
        straightFirst: false,
        straightLast: false,
        strokeColor: "blue"
      });
      this.line_3 = this.box_simulator.create("line", [this.point_main, this.point_3], {
        firstArrow: false,
        lastArrow: true,
        straightFirst: false,
        straightLast: false,
        strokeColor: "green"
      });

      this.circle_mass = this.box_simulator.create(
        "circle",
        [
          this.point_main,
          () => {
            return this.sliders.mass.Value() / 5;
          }
        ],
        {
          fillColor: "black",
          strokeColor: "black"
        }
      );

      this.box_simulator.fullUpdate();
    }
  },

  mounted() {
    this.init();
  }
};
export const meta = {
  title: "Particle Equilibrium",
  description: "In Progress - WATKINS"
};
</script>
