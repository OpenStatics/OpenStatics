<template>
  <div class="container">
    <div class="row">
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
      button_play: undefined,
      point_main: undefined,
      point_1: undefined,
      line_1: undefined,
      point_2: undefined,
      line_2: undefined,
      point_3: undefined,
      line_3: undefined,
      line_dotted: undefined,
      interval: undefined,
      animation_state: {
        play: false,
        direction: 1,
        speed: 1
      }
    };
  },
  methods: {},

  mounted() {
    this.box_sliders = JXG.JSXGraph.initBoard("box_vector_sliders", {
      boundingbox: [-15, 15, 15, -15],
      keepAspectRatio: true,
      showCopyright: false
    });

    const incr = 5;
    const start = 5;
    const left = -13;
    const right = -2;

    this.sliders.time = this.box_sliders.create(
      "slider",
      [
        [left, start + incr],
        [right, start + incr],
        [0, 0, 15]
      ],
      { name: "Time (s)", label: { size: 16 } }
    );
    this.sliders.f1_force = this.box_sliders.create(
      "slider",
      [
        [left, start - incr * 2],
        [right, start - incr * 2],
        [0, 0, 10]
      ],
      {
        name: "F_1 (N)",
        label: { color: "red" }
      }
    );
    this.sliders.f1_angle = this.box_sliders.create(
      "slider",
      [
        [left, start - incr * 3],
        [right, start - incr * 3],
        [0, 0, 360]
      ],
      {
        name: "\u03B8_1 (\u00B0)",
        label: { color: "red" }
      }
    );
    this.sliders.f2_force = this.box_sliders.create(
      "slider",
      [
        [left, start - incr * 4],
        [right, start - incr * 4],
        [0, 0, 10]
      ],
      {
        name: "F_2 (N)",
        label: { color: "blue" }
      }
    );
    this.sliders.f2_angle = this.box_sliders.create(
      "slider",
      [
        [left, start - incr * 5],
        [right, start - incr * 5],
        [0, 0, 360]
      ],
      {
        name: "\u03B8_2 (\u00B0)",
        label: { color: "blue" }
      }
    );
    this.sliders.f3_force = this.box_sliders.create(
      "slider",
      [
        [left, start - incr * 6],
        [right, start - incr * 6],
        [0, 0, 10]
      ],
      {
        name: "F_3 (N)",
        label: { color: "green" }
      }
    );
    this.sliders.f3_angle = this.box_sliders.create(
      "slider",
      [
        [left, start - incr * 7],
        [right, start - incr * 7],
        [0, 0, 360]
      ],
      {
        name: "\u03B8_3 (\u00B0)",
        label: { color: "green" }
      }
    );
    this.sliders.mass = this.box_sliders.create(
      "slider",
      [
        [left, start - incr * 8],
        [right, start - incr * 8],
        [1, 1, 3]
      ],
      { name: "Mass (kg)" }
    );

    let x = () => {
      let t = (() => {
        return 0.1 * this.animation_state.speed * this.animation_state.direction;
      })();
      t = (t + this.sliders.time.Value() + 15) % 15;
      this.sliders.time.setValue(t);
      this.box_simulator.fullUpdate();
      this.box_sliders.fullUpdate();
    };

    this.button_play = this.box_sliders.create("button", [
      left,
      start + incr * 0,
      "Play/Pause",
      () => {
        this.animation_state.play = !this.animation_state.play;
        if (this.animation_state.play) {
          this.interval = setInterval(x, 50);
        } else {
          clearInterval(this.interval);
        }
      }
    ]);

    this.box_sliders.create("button", [
      left + incr * 2,
      start + incr * 0,
      "Reverse",
      () => {
        this.animation_state.direction *= -1;
      }
    ]);

    this.box_sliders.create("button", [
      left + incr * 0,
      start + incr * -1,
      "x0.25",
      () => {
        this.animation_state.speed = 0.25;
        //y();
      }
    ]);

    this.box_sliders.create("button", [
      left + incr * 1,
      start + incr * -1,
      "x0.50",
      () => {
        this.animation_state.speed = 0.5;
        //y();
      }
    ]);

    this.box_sliders.create("button", [
      left + incr * 2,
      start + incr * -1,
      "x1.00",
      () => {
        this.animation_state.speed = 1;
        //y();
      }
    ]);

    this.box_sliders.create("button", [
      left + incr * 3,
      start + incr * -1,
      "x1.50",
      () => {
        this.animation_state.speed = 1.5;
        //y();
      }
    ]);
    this.box_sliders.create("button", [
      left + incr * 4,
      start + incr * -1,
      "x2.00",
      () => {
        this.animation_state.speed = 1.5;
        //y();
      }
    ]);

    this.sliders.f1_force.on("drag", () => {
      this.animation_state.play = false;
      clearInterval(this.interval);
      this.sliders.time.setValue(0);
    });
    this.sliders.f1_angle.on("drag", () => {
      this.animation_state.play = false;
      clearInterval(this.interval);
      this.sliders.time.setValue(0);
    });
    this.sliders.f2_force.on("drag", () => {
      this.animation_state.play = false;
      clearInterval(this.interval);
      this.sliders.time.setValue(0);
    });
    this.sliders.f2_angle.on("drag", () => {
      this.animation_state.play = false;
      clearInterval(this.interval);
      this.sliders.time.setValue(0);
    });
    this.sliders.f3_force.on("drag", () => {
      this.animation_state.play = false;
      clearInterval(this.interval);
      this.sliders.time.setValue(0);
    });
    this.sliders.f3_angle.on("drag", () => {
      this.animation_state.play = false;
      clearInterval(this.interval);
      this.sliders.time.setValue(0);
    });
    this.sliders.mass.on("drag", () => {
      this.animation_state.play = false;
      clearInterval(this.interval);
      this.sliders.time.setValue(0);
    });

    this.box_sliders.fullUpdate();

    const boundingSize = 200;
    this.box_simulator = JXG.JSXGraph.initBoard("box_particle_simulator", {
      boundingbox: [-boundingSize, boundingSize, boundingSize, -boundingSize],
      keepAspectRatio: true,
      showCopyright: false,
      axis: true
    });

    this.box_sliders.addChild(this.box_simulator);
    this.box_simulator.addChild(this.box_sliders);

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
          return (0.5 * totalForce(sliders)().x * sliders.time.Value() * sliders.time.Value()) / sliders.mass.Value();
        };
      else if (code == "y")
        return function() {
          return (0.5 * totalForce(sliders)().y * sliders.time.Value() * sliders.time.Value()) / sliders.mass.Value();
        };
    }
    function offsetLocation(sliders, code) {
      if (code == "x1")
        return function() {
          return mainLocation(sliders, "x")() + sliders.f1_force.Value() * Math.cos((sliders.f1_angle.Value() * Math.PI) / 180) * scale;
        };
      else if (code == "y1")
        return function() {
          return mainLocation(sliders, "y")() + sliders.f1_force.Value() * Math.sin((sliders.f1_angle.Value() * Math.PI) / 180) * scale;
        };
      else if (code == "x2")
        return function() {
          return mainLocation(sliders, "x")() + sliders.f2_force.Value() * Math.cos((sliders.f2_angle.Value() * Math.PI) / 180) * scale;
        };
      else if (code == "y2")
        return function() {
          return mainLocation(sliders, "y")() + sliders.f2_force.Value() * Math.sin((sliders.f2_angle.Value() * Math.PI) / 180) * scale;
        };
      else if (code == "x3")
        return function() {
          return mainLocation(sliders, "x")() + sliders.f3_force.Value() * Math.cos((sliders.f3_angle.Value() * Math.PI) / 180) * scale;
        };
      else if (code == "y3")
        return function() {
          return mainLocation(sliders, "y")() + sliders.f3_force.Value() * Math.sin((sliders.f3_angle.Value() * Math.PI) / 180) * scale;
        };
    }

    this.point_main = this.box_simulator.create("point", [mainLocation(this.sliders, "x"), mainLocation(this.sliders, "y")], { visible: false });

    this.point_1 = this.box_simulator.create("point", [offsetLocation(this.sliders, "x1"), offsetLocation(this.sliders, "y1")], { visible: false });
    this.point_2 = this.box_simulator.create("point", [offsetLocation(this.sliders, "x2"), offsetLocation(this.sliders, "y2")], { visible: false });
    this.point_3 = this.box_simulator.create("point", [offsetLocation(this.sliders, "x3"), offsetLocation(this.sliders, "y3")], { visible: false });

    this.line_1 = this.box_simulator.create("line", [this.point_main, this.point_1], {
      firstArrow: false,
      lastArrow: true,
      straightFirst: false,
      straightLast: false,
      strokeColor: "red",
      strokeWidth: 4
    });
    this.line_2 = this.box_simulator.create("line", [this.point_main, this.point_2], {
      firstArrow: false,
      lastArrow: true,
      straightFirst: false,
      straightLast: false,
      strokeColor: "blue",
      strokeWidth: 4
    });
    this.line_3 = this.box_simulator.create("line", [this.point_main, this.point_3], {
      firstArrow: false,
      lastArrow: true,
      straightFirst: false,
      straightLast: false,
      strokeColor: "green",
      strokeWidth: 4
    });

    this.line_dotted = this.box_simulator.create("line", [this.box_simulator.create("point", [0, 0], { visible: false }), this.point_main], {
      straightFirst: false,
      straightLast: false,
      visible: true,
      strokeWidth: 2,
      dash: 2,
      strokeColor: "black"
    });

    this.circle_mass = this.box_simulator.create(
      "circle",
      [
        this.point_main,
        () => {
          return (this.sliders.mass.Value() / 4) * scale;
        }
      ],
      {
        fillColor: "black",
        strokeColor: "black"
      }
    );

    const edge = boundingSize;

    const q1 = this.box_simulator.create("point", [edge, edge], { visible: false });
    const q2 = this.box_simulator.create("point", [-edge, edge], { visible: false });
    const q3 = this.box_simulator.create("point", [-edge, -edge], { visible: false });
    const q4 = this.box_simulator.create("point", [edge, -edge], { visible: false });

    this.box_simulator.create("line", [q1, q2], { strokeColor: "black", strokeWidth: 4 });
    this.box_simulator.create("line", [q2, q3], { strokeColor: "black", strokeWidth: 4 });
    this.box_simulator.create("line", [q3, q4], { strokeColor: "black", strokeWidth: 4 });
    this.box_simulator.create("line", [q4, q1], { strokeColor: "black", strokeWidth: 4 });

    this.box_simulator.fullUpdate();
  }
};
export const meta = {
  title: "Particle Equilibrium",
  description: "In Progress - WATKINS"
};
</script>
