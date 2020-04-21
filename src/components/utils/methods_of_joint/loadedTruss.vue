<template>
  <div>
    <div id="box1" class="jsx-graph my-2 text-center"></div>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => {
    return {
      state: 0
    };
  },
  mounted() {
    const scale = 3;
    const b2 = JXG.JSXGraph.initBoard("box1", { boundingbox: [-15, 15, 15, -15], keepAspectRatio: true, showCopyright: false });

    const force = b2.create(
      "slider",
      [
        [-6, -9],
        [0, -9],
        [1, 1, 2]
      ],
      { name: "Load F" }
    );
    const angle = b2.create(
      "slider",
      [
        [-6, -10],
        [0, -10],
        [0, 90, 180]
      ],
      { name: "Angle(\u03b1)" }
    );

    const input_force = b2.create("input", [5, -9 + 0.05, "", ""], { cssStyle: "width: 50px" });
    const input_angle = b2.create("input", [5, -10, "", ""], { cssStyle: "width: 50px" });

    const button_force = b2.create(
      "button",
      [
        8,
        -9,
        "Update",
        () => {
          if (!isNaN(input_force.Value())) {
            let val = Number(input_force.Value());
            val = Math.min(force._smax, val);
            val = Math.max(force._smin, val);
            val = Math.round(val * 100) / 100;
            force.setValue(val);
            input_force.rendNodeInput.value = "";
            input_force.update();
          }
        }
      ],
      {}
    );
    const button_angle = b2.create(
      "button",
      [
        8,
        -10,
        "Update",
        () => {
          if (!isNaN(input_angle.Value())) {
            let val = Number(input_angle.Value());
            val = Math.min(angle._smax, val);
            val = Math.max(angle._smin, val);
            val = Math.round(val * 100) / 100;
            angle.setValue(val);
            input_angle.rendNodeInput.value = "";
            input_angle.update();
          }
        }
      ],
      {}
    );

    const offsetFactor = 11;

    // create points
    const pointProperties = { fixed: true, fillColor: "white", strokeColor: "black", visible: true };
    const labelProperties = { strokeColor: "black" };

    const point_a = b2.create("point", [-2 * scale, 0], {
      ...pointProperties,
      name: "A",
      label: { ...labelProperties, offset: [-offsetFactor, -offsetFactor] }
    });
    const point_b = b2.create("point", [-1 * scale, Math.sqrt(3) * scale], {
      ...pointProperties,
      name: "B",
      label: { ...labelProperties, offset: [(-offsetFactor * 3) / 2, offsetFactor] }
    });
    const point_c = b2.create("point", [0 * scale, 0 * scale], {
      ...pointProperties,
      name: "C",
      label: { ...labelProperties, offset: [(offsetFactor * -1) / 3, offsetFactor * 2] }
    });
    const point_d = b2.create("point", [1 * scale, Math.sqrt(3) * scale], {
      ...pointProperties,
      name: "D",
      label: { ...labelProperties, offset: [(offsetFactor * 1) / 2, offsetFactor] }
    });
    const point_e = b2.create("point", [2 * scale, 0], {
      ...pointProperties,
      name: "E",
      label: { ...labelProperties, offset: [(offsetFactor * 1) / 2, -offsetFactor] }
    });

    const lineProperties = { straightFirst: false, straightLast: false, strokeWidth: 10 };
    for (const points of [
      [point_a, point_b],
      [point_a, point_c],
      [point_b, point_c],
      [point_b, point_d],
      [point_c, point_d],
      [point_c, point_e],
      [point_d, point_e]
    ]) {
      b2.create("line", points, { ...lineProperties, visible: true });
    }

    const label_top = b2.create("text", [-6, -6, ""], {
      fontSize: 14,
      visible: () => {
        return [2, 3, 4].includes(this.state);
      }
    });

    const label_middle = b2.create("text", [-6, -7, ""], {
      fontSize: 14,
      visible: () => {
        return [0, 2, 3, 4].includes(this.state);
      }
    });

    const label_bottom = b2.create("text", [-6, -8, ""], {
      fontSize: 14,
      visible: () => {
        return [2, 4].includes(this.state);
      }
    });
  }
};
export const meta = {
  title: "methods of joint demo",
  description: "joint"
};
</script>
