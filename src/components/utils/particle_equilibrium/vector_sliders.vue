<template>
  <div>
    <div id="box_vector_sliders" class="box_vector_sliders" style="width:300px; height:800px;"></div>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => {
    return {
      b2: 0,
      sliders: {
        f1_force: 0,
        f1_angle: 0,
        f2_force: 0,
        f2_angle: 0,
        f3_force: 0,
        f3_angle: 0,
        mass: 0,
        time: 0
      }
    };
  },
  methods: {
    init() {
      this.b2 = JXG.JSXGraph.initBoard("box_vector_sliders", { boundingbox: [-15, 15, 5, -15], keepAspectRatio: true, showCopyright: false });

      var incr = 5;
      var start = 0;
      var left = -13;
      var right = -2;

      this.sliders.f1_force = this.b2.create("slider", [[left, start - incr * 0], [right, start - incr * 0], [0, 0, 10]], { name: "F_1 (N)" });
      this.sliders.f1_angle = this.b2.create("slider", [[left, start - incr * 1], [right, start - incr * 1], [0, 0, 360]], { name: "A_1 (d)" });
      this.sliders.f2_force = this.b2.create("slider", [[left, start - incr * 2], [right, start - incr * 2], [0, 0, 10]], { name: "F_2 (N)" });
      this.sliders.f2_angle = this.b2.create("slider", [[left, start - incr * 3], [right, start - incr * 3], [0, 0, 360]], { name: "A_2 (d)" });
      this.sliders.f3_force = this.b2.create("slider", [[left, start - incr * 4], [right, start - incr * 4], [0, 0, 10]], { name: "F_3 (N)" });
      this.sliders.f3_angle = this.b2.create("slider", [[left, start - incr * 5], [right, start - incr * 5], [0, 0, 360]], { name: "A_3 (d)" });
      this.sliders.mass = this.b2.create("slider", [[left, start - incr * 6], [right, start - incr * 6], [1, 1, 10]], { name: "Mass (kg)" });
      this.sliders.time = this.b2.create("slider", [[left, start - incr * 7], [right, start - incr * 7], [0, 0, 10]], { name: "Time (s)" });

      this.b2.fullUpdate();
      console.log(this.sliders);
      this.$emit("fromSliders", this.sliders);
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
