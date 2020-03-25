<template>
  <div>
    <div id="box_particle_simulator" class="box_particle_simulator" style="width:800px; height:800px;"></div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    sliders: {
      type: Object,
      default: () => {
        return {
          f1_force: 0,
          f1_angle: 0,
          f2_force: 0,
          f2_angle: 0,
          f3_force: 0,
          f3_angle: 0,
          mass: 0,
          time: 0
        };
      }
    }
  },
  data: () => {
    return {
      b2: 0,
      circle_mass: 0,
      point_main: 0
    };
  },
  methods: {
    init() {
      this.b2 = JXG.JSXGraph.initBoard("box_particle_simulator", { boundingbox: [-15, 15, 15, -15], keepAspectRatio: true, showCopyright: false });

      console.log("Cheese");
    },
    realInit() {
      this.point_main = this.b2.create("point", [
        () => {
          return (0.5 * this.totalForce().x * this.sliders.time.value() * this.sliders.time.value()) / this.sliders.mass.value();
        },
        () => {
          return (0.5 * this.totalForce().y * this.sliders.time.value() * this.sliders.time.value()) / this.sliders.mass.value();
        }
      ]);
      this.circle_mass = this.b2.create("circle", [this.point_main, 1], { fillColor: "black" });
      this.b2.create("text", [0, 0], "cheese");
      this.b2.fullUpdate();
      console.log("tomato");
    },
    totalForce: () => {
      const x1 = this.sliders.f1_force.value() * Math.cos((this.sliders.f1_angle.value() * Math.PI) / 180);
      const x2 = this.sliders.f2_force.value() * Math.cos((this.sliders.f2_angle.value() * Math.PI) / 180);
      const x3 = this.sliders.f3_force.value() * Math.cos((this.sliders.f3_angle.value() * Math.PI) / 180);
      const y1 = this.sliders.f1_force.value() * Math.sin((this.sliders.f1_angle.value() * Math.PI) / 180);
      const y2 = this.sliders.f2_force.value() * Math.sin((this.sliders.f2_angle.value() * Math.PI) / 180);
      const y3 = this.sliders.f3_force.value() * Math.sin((this.sliders.f3_angle.value() * Math.PI) / 180);
      return { x: x1 + x2 + x3, y: y1 + y2 + y3 };
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
