<template>
  <div class="container-fluid">
    <!-- <div class="row justify-content-center">
      <button class="btn btn-primary mx-3" :class="{ 'btn-warning': state === 0 }" @click="() => changeState(0)">
        Clear
      </button>
      <button class="btn btn-primary mx-3" :class="{ 'btn-warning': state === 1 }" @click="() => changeState(1)">
        Step 1: External loadings on the beam
      </button>
      <button class="btn btn-primary mx-3" :class="{ 'btn-warning': state === 2 }" @click="() => changeState(2)">
        Step 2: Internal forces in the beam
      </button>
      <button class="btn btn-primary mx-3" :class="{ 'btn-warning': state === 3 }" @click="() => changeState(3)">
        Step 3: Internal force diagrams of the beam
      </button>
    </div> -->
    <div class="row my-3 justify-content-center">
      <div id="boxLeft" class="boxLeft my-2" style="width:425px; height:800px;"></div>

      <div id="boxRight" class="boxRight my-2" style="width:900px; height:800px;"></div>
    </div>
  </div>
</template>

<script>
import { CircleSlider } from "../../../classes/CircleSlider.js";
import { InputHandler } from "../../../classes/InputHandler.js";

export default {
  components: {},
  data: () => {
    return {
      IH: undefined,
      bL: undefined,
      bR: undefined
    };
  },
  mounted() {
    // Setup the two boards
    // The lefthand board (sliders and text)
    const bL = JXG.JSXGraph.initBoard("boxLeft", {
      boundingbox: [-15, 15, 15, -15],
      keepAspectRatio: true,
      showCopyright: false,
      pan: { enabled: false },
      zoom: { wheel: false },
      showNavigation: false,
      showZoom: false,
      axis: false
    });
    // The size of the container (matches explicit css style in html)
    bL.resizeContainer(425, 700);

    const bR = JXG.JSXGraph.initBoard("boxRight", {
      boundingbox: [-10, 10, 10, -10],
      keepAspectRatio: true,
      showCopyright: false,
      pan: { enabled: false },
      zoom: { wheel: false },
      showNavigation: false,
      showZoom: false,
      axis: false
    });
    // The size of the container (matches explicit css style in html)
    bR.resizeContainer(700, 700);

    // All sliders are stored in these objects
    // They can be accessed with brackets sliders["force"] or dot notation sliders.force
    this.bL = bL;
    this.bR = bR;

    let sliders = {};
    const LABEL_SIZE = 18;

    const INTERVAL = -4.5;
    // Generate sliders, along with their related components
    // Can either have textbox + update button, or on/off system
    const TOP_Y = 11;
    const LEFT_X = -1;
    const RIGHT_X = 5;

    const INITIAL_VALUES = { rotation: "off", f_comps: "on", f_vis: "off", sum: "off", alpha: "off", beta: "off", gamma: "off" };
    let IH = new InputHandler(bL, INTERVAL, TOP_Y, LEFT_X, RIGHT_X, LABEL_SIZE, INITIAL_VALUES, 0);
    this.IH = IH;

    for (let data of [
      ["rotation", "Rotate Axes", INTERVAL * -0.5, false, ["On", "on", "Off", "off"], [0]],
      ["fx", "F_x", INTERVAL * 0, true, [-5, 0, 5], [0], "blue"],
      ["fy", "F_y", INTERVAL * 1, true, [-5, 0, 5], [0], "blue"],
      ["fz", "F_z", INTERVAL * 2, true, [-5, 0, 5], [0], "blue"],
      ["f_comps", "Components of F", INTERVAL * 3, false, ["On", "on", "Off", "off"], [0]],
      ["f_vis", "F Visibility", INTERVAL * 4, false, ["On", "on", "Off", "off"], [0]],
      ["sum", "Sum of Components", INTERVAL * 5, false, ["On", "on", "Off", "off"], [0]],
      ["alpha", "Show \u03b1", INTERVAL * 6, false, ["On", "on", "Off", "off"], [0]],
      ["beta", "Show \u03b2", INTERVAL * 7, false, ["On", "on", "Off", "off"], [0]],
      ["gamma", "Show \u03b3", INTERVAL * 8, false, ["On", "on", "Off", "off"], [0]]
    ]) {
      IH.generate(data, sliders);
    }

    // Handles circle gliders
    let CSProps = {};
    for (let key of ["circle", "glider", "textLabel"]) CSProps[key] = { visible: IH.valCheck("rotation", "on") };
    let circleSlides = {};
    for (let data of [
      ["tx", 8, -8, 0.8, 250, "\u03b8_x"],
      ["ty", 5, -8, 0.8, 180, "\u03b8_y"],
      ["tz", 2, -8, 0.8, 150, "\u03b8_z"]
    ]) {
      circleSlides[data[0]] = new CircleSlider(bR, data[0], data[1], data[2], data[3], data[4], data[5], IH.textToUpdate, CSProps);
    }

    const glideVal = root => {
      return circleSlides[root].glideVal();
    };

    // Handles all calculations
    let comp = {};
    comp.zero = () => {
      return 0;
    };
    comp.radians = deg => {
      return (deg * Math.PI) / 180;
    };
    comp.degrees = rad => {
      return (rad * 180) / Math.PI;
    };
    comp.x = (a, b, c) => {
      return (a * Math.cos(glideVal("tz")) - b * Math.sin(glideVal("tz"))) * Math.cos(glideVal("ty")) - c * Math.sin(glideVal("ty"));
    };
    comp.y = (a, b, c) => {
      return (b * Math.cos(glideVal("tz")) + a * Math.sin(glideVal("tz"))) * Math.cos(glideVal("tx")) - c * Math.sin(glideVal("tx"));
    };
    comp.xy = (a, b, c) => {
      return [comp.x(a, b, c), comp.y(a, b, c)];
    };
    comp.f_mag = () => {
      return Math.sqrt(Math.pow(sliders.fx.Value(), 2) + Math.pow(sliders.fy.Value(), 2) + Math.pow(sliders.fz.Value(), 2));
    };
    comp.alpha = () => {
      let val = comp.degrees(Math.acos(sliders.fx.Value() / comp.f_mag()));
      return Math.min(val, 180 - val);
    };
    comp.beta = () => {
      let val = comp.degrees(Math.acos(sliders.fy.Value() / comp.f_mag()));
      return Math.min(val, 180 - val);
    };
    comp.gamma = () => {
      let val = comp.degrees(Math.acos(sliders.fz.Value() / comp.f_mag()));
      return Math.min(val, 180 - val);
    };

    const hiddenProps = { fixed: true, visible: false };
    const hiddenLabelProps = { fixed: true, visible: true, withLabel: true, size: 0 };
    const lineSegProps = { straightFirst: false, straightLast: false };

    // axes (x, y, z)
    const axisLength = 10;
    const axisProps = { strokeColor: "black", strokeWidth: 3, ...lineSegProps, lastArrow: true };
    for (let data of [
      [axisLength, 0, 0, "x"],
      [0, axisLength, 0, "y"],
      [0, 0, axisLength, "z"]
    ]) {
      bR.create(
        "line",
        [
          () => {
            return comp.xy(-data[0], -data[1], -data[2]);
          },
          () => {
            return comp.xy(data[0], data[1], data[2]);
          }
        ],
        { ...axisProps, point2: { ...hiddenLabelProps, name: data[3], label: { fontSize: 14 } } }
      );
    }

    let points = {};
    points.origin = bR.create(
      "point",
      [
        () => {
          return comp.x(0, 0, 0);
        },
        () => {
          return comp.y(0, 0, 0);
        }
      ],
      { ...hiddenProps }
    );
    const componentColor = "blue";

    for (let data of [
      ["fx", "F_x", [1, 0, 0], "fx2", "F_x", [1, 0, 0], "origin"],
      ["fy", "F_y", [0, 1, 0], "fy2", "F_y", [1, 1, 0], "fx2"],
      ["fz", "F_z", [0, 0, 1], "fz2", "F_z", [1, 1, 1], "fy2"]
    ]) {
      let vis1 = () => {
        return IH.valCheck("f_comps", "on")() && IH.valCheck("sum", "off")();
      };
      points[data[0]] = bR.create(
        "point",
        [
          () => {
            let val = sliders[data[0]].Value();
            return comp.x(val * data[2][0], val * data[2][1], val * data[2][2]);
          },
          () => {
            let val = sliders[data[0]].Value();
            return comp.y(val * data[2][0], val * data[2][1], val * data[2][2]);
          }
        ],
        {
          name: "<b>" + data[1] + "</b>",
          ...hiddenLabelProps,
          label: { visible: vis1, fontSize: 14, strokeColor: componentColor }
        }
      );
      bR.create("line", [points.origin, points[data[0]]], {
        visible: vis1,
        ...lineSegProps,
        strokeColor: componentColor,
        strokeWidth: 5,
        lastArrow: true
      });

      points[data[3]] = bR.create(
        "point",
        [
          () => {
            return comp.x(sliders.fx.Value() * data[5][0], sliders.fy.Value() * data[5][1], sliders.fz.Value() * data[5][2]);
          },
          () => {
            return comp.y(sliders.fx.Value() * data[5][0], sliders.fy.Value() * data[5][1], sliders.fz.Value() * data[5][2]);
          }
        ],
        {
          name: "<b>" + data[4] + "</b>",
          ...hiddenLabelProps,
          label: { visible: IH.valCheck("sum", "on"), fontSize: 14, strokeColor: componentColor }
        }
      );
      bR.create("line", [points[data[6]], points[data[3]]], {
        visible: IH.valCheck("sum", "on"),
        ...lineSegProps,
        strokeColor: componentColor,
        strokeWidth: 5,
        lastArrow: true
      });
    }

    points.f = bR.create(
      "point",
      [
        () => {
          return comp.x(sliders.fx.Value(), sliders.fy.Value(), sliders.fz.Value());
        },
        () => {
          return comp.y(sliders.fx.Value(), sliders.fy.Value(), sliders.fz.Value());
        }
      ],
      { name: "<b>" + "F" + "</b>", ...hiddenLabelProps, label: { visible: IH.valCheck("f_vis", "on"), fontSize: 14, strokeColor: "red" } }
    );

    bR.create("line", [points.origin, points.f], {
      ...lineSegProps,
      strokeColor: "red",
      lastArrow: true,
      strokeWidth: 5,
      visible: IH.valCheck("f_vis", "on")
    });

    for (let data of [
      ["fx", "alpha", "orange", "\u03b1"],
      ["fy", "beta", "green", "\u03b2"],
      ["fz", "gamma", "purple", "\u03b3"]
    ]) {
      bR.create("polygon", [points.origin, points[data[0]], points.f], { withLines: false, fillColor: data[2], visible: IH.valCheck(data[1], "on") });
      bR.create("line", [points[data[0]], points.f], {
        ...lineSegProps,
        dash: 2,
        strokeWidth: 5,
        strokeColor: "black",
        visible: IH.valCheck(data[1], "on")
      });
      let angle = bR.create("angle", [points[data[0]], points.origin, points.f], { name: data[3], label: { strokeColor: data[2] } });
      angle.setAttribute({
        visible: () => {
          return IH.valCheck(data[1], "on")() && angle.Value() < Math.PI;
        }
      });
      let angle2 = bR.create("angle", [points.f, points.origin, points[data[0]]], { name: data[3], label: { strokeColor: data[2] } });
      angle2.setAttribute({
        visible: () => {
          return IH.valCheck(data[1], "on")() && angle2.Value() <= Math.PI;
        }
      });
    }

    for (let data of [
      [0, INTERVAL * 9, ["\u03b1", comp.alpha, "\u00B0"], "alpha", "on", "orange"],
      [10, INTERVAL * 9, ["\u03b2", comp.beta, "\u00B0"], "beta", "on", "green"],
      [20, INTERVAL * 9, ["\u03b3", comp.gamma, "\u00B0"], "gamma", "on", "purple"]
    ]) {
      bL.create(
        "text",
        [
          -15 + data[0],
          TOP_Y + data[1],
          () => {
            let x = data[2][1]();
            return (
              "<span style='color:" +
              data[5] +
              "'><i>" +
              data[2][0] +
              "</i> = </span>" +
              Math.round(x * 1000, 3) / 1000 +
              " <span style='color:" +
              data[5] +
              "'><b>" +
              data[2][2] +
              "</b></span>"
            );
          }
        ],
        { fontSize: LABEL_SIZE, fixed: true, visible: IH.valCheck(data[3], data[4]), anchorX: "left", anchorY: "top" }
      );
    }

    bL.addChild(bR);
    bR.addChild(bL);

    this.changeState(0);
  },
  methods: {
    changeState(newState) {
      this.IH.updateState(newState);
    }
  }
};
</script>

<style>
button:disabled {
  opacity: 0.5;
  /* visibility: hidden; */
}
input:disabled {
  opacity: 0.7;
  /* visibility: hidden; */
}
</style>
