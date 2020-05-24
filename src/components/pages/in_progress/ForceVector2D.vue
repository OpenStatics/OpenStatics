<template>
  <div class="container-fluid">
    <h1 class="text-danger text-center my-4">Force Vector Representation in 2D</h1>
    <h5 class="text-center mb-4">Creator: Zichao Hu, Zhelong He, Marek-Jerzy Pindera</h5>
    <h5 class="text-center mb-4">University of Virginia, 2020-05-03</h5>

    <ForceText></ForceText>
    <div class="row my-3">
      <div class="col-xl-6 border">
        <table class="table table-borderless table-sm">
          <tbody>
            <tr>
              <td>F Visibility:</td>
              <td>
                <input type="radio" class="mx-3" name="F_Visible" checked @click="ToggleVisibility(0)" />on
                <input type="radio" class="mx-3" name="F_Visible" @click="ToggleVisibility(1)" />off
              </td>
            </tr>
            <tr>
              <td>Projection of F on x:</td>
              <td>
                <input type="radio" class="mx-3" name="Project_F_X" @click="ToggleVisibility(2)" />on
                <input type="radio" class="mx-3" name="Project_F_X" checked @click="ToggleVisibility(3)" />off
              </td>
            </tr>
            <tr>
              <td>Projection of F on y:</td>
              <td>
                <input type="radio" class="mx-3" name="Project_F_y" @click="ToggleVisibility(4)" />on
                <input type="radio" class="mx-3" name="Project_F_y" checked @click="ToggleVisibility(5)" />off
              </td>
            </tr>
            <tr v-show="visible_components[3]">
              <td>Add Force Components</td>
              <td>
                <button class="btn" @click="y_animation">
                  <i v-if="!y_animeOn" class="fas fa-play"></i>
                  <i v-if="y_animeOn" class="fas fa-pause"></i>
                </button>
                <button class="btn" @click="y_reset"><i class="fas fa-redo"> </i></button>
              </td>
            </tr>
            <tr>
              <td>u Visibility:</td>
              <td>
                <input type="radio" class="mx-3" name="u_Visibility" @click="ToggleVisibility(8)" />on
                <input type="radio" class="mx-3" name="u_Visibility" checked @click="ToggleVisibility(9)" />off
              </td>
            </tr>
            <tr>
              <td>Projection of u on x:</td>
              <td>
                <input type="radio" class="mx-3" name="Project_u_x" @click="ToggleVisibility(10)" />on
                <input type="radio" class="mx-3" name="Project_u_x" checked @click="ToggleVisibility(11)" />off
              </td>
            </tr>
            <tr>
              <td>Projection of u on y:</td>
              <td>
                <input type="radio" class="mx-3" name="Project_u_y" @click="ToggleVisibility(12)" />on
                <input type="radio" class="mx-3" name="Project_u_y" checked @click="ToggleVisibility(13)" />off
              </td>
            </tr>
            <tr v-show="visible_components[7]">
              <td>Scale u</td>
              <td>
                <button class="btn" @click="u_animation">
                  <i v-if="!u_animeOn" class="fas fa-play"></i>
                  <i v-if="u_animeOn" class="fas fa-pause"></i>
                </button>
                <button class="btn" @click="u_reset"><i class="fas fa-redo"> </i></button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="d-flex justify-content-center row">
          <div id="control" class="col" style="width:400px; height:200px;"></div>
          <div class="col">
            <h5>Analysis</h5>
            <div v-if="visible_components[1]">F<sub>x</sub>: {{ parseFloat(this.findXVal().toFixed(2)) }} N</div>
            <div v-if="visible_components[1]">{{ "&alpha;: " + parseFloat(this.angle.Value().toFixed(2)) + "\u00B0" }}</div>
            <div v-if="visible_components[2]">F<sub>y</sub>: {{ parseFloat(this.findYVal().toFixed(2)) }} N</div>
            <div v-if="visible_components[2]">{{ "&beta;: " + parseFloat((90 - this.angle.Value()).toFixed(2)) + "\u00B0" }}</div>
          </div>
        </div>
      </div>
      <div class="col-xl-6 d-flex justify-content-center">
        <div id="ForceVec2D" style="width:500px; height:500px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import ForceText from "../../utils/ForceVec2D/ForceText";
export default {
  components: {
    ForceText
  },
  data() {
    // visibile_components: [Proj_F_x, Proj_F_y, Resolut_F_comp, u_Visibility, Proj_u_x, Proj_u_y, Proj_u_comp]
    return {
      board: undefined,
      angle: undefined,
      force: undefined,
      multiplier: 5,
      visible_components: [true, false, false, false, false, false, false, false],
      y_trans: 0,
      y_animeOn: false,
      u_trans: 1,
      u_animeOn: false
    };
  },
  mounted() {
    // initial values
    const multiplier = 5;
    const fixedDecimal = 2;
    const fontSize = 20;
    const strokeWidth = 3;
    const dash = 3;
    const fixed = true;
    const inputFont = 15;

    // module related variables:
    const comp_visible = index_list => {
      for (let i of index_list) {
        if (this.visible_components[i]) {
          return true;
        }
      }
      return false;
    };

    // create board board
    this.board = JXG.JSXGraph.initBoard("ForceVec2D", { boundingbox: [-15, 15, 15, -15], keepAspectRatio: true, showCopyright: false, axis: true });
    const board_control = JXG.JSXGraph.initBoard("control", {
      boundingbox: [0, 15, 15, 0],
      showCopyright: false,
      pan: { enabled: false },
      zoom: { enabled: false },
      showNavigation: false,
      showZoom: false
    });
    board_control.addChild(this.board);

    // set slider for force and angle
    const force = board_control.create(
      "slider",
      [
        [2, 10],
        [12, 10],
        [0, 2, 3]
      ],
      { withLabel: false }
    );
    board_control.create(
      "text",
      [
        3,
        12,
        () => {
          const value = parseFloat(force.Value().toFixed(fixedDecimal));
          return "F: " + value + "N";
        }
      ],
      { fontSize, fixed }
    );
    const input_force = board_control.create("input", [7, 12, "", ""], { cssStyle: "width: 50px", fontSize: inputFont });
    board_control.create(
      "button",
      [
        10,
        12,
        "Update",
        () => {
          const val = Number(input_force.Value());
          if (val) {
            force.setValue(Number(input_force.Value()));
            input_force.rendNodeInput.value = "";
            input_force.update();
          }
        }
      ],
      { fontSize: inputFont }
    );

    const angle = board_control.create(
      "slider",
      [
        [2, 5],
        [12, 5],
        [0, 30, 360]
      ],
      { withLabel: false }
    );
    board_control.create(
      "text",
      [
        3,
        8,
        () => {
          const value = parseFloat(angle.Value().toFixed(fixedDecimal));
          return "a: " + value + "\u00B0";
        }
      ],
      { fontSize, fixed }
    );
    const input_angle = board_control.create("input", [7, 8, "", ""], { cssStyle: "width: 50px", fontSize: inputFont });
    board_control.create(
      "button",
      [
        10,
        8,
        "Update",
        () => {
          const val = Number(input_angle.Value());
          if (val) {
            angle.setValue(Number(input_angle.Value()));
            input_angle.rendNodeInput.value = "";
            input_angle.update();
          }
        }
      ],
      { fontSize: inputFont }
    );

    this.angle = angle;
    this.force = force;

    // create border
    const left_border_point = this.board.create("point", [-15, 0], { fixed, visible: false });
    const right_border_point = this.board.create("point", [15, 0], { fixed, visible: false });
    const top_border_point = this.board.create("point", [0, 15], { fixed, visible: false });
    const bottom_border_point = this.board.create("point", [0, -15], { fixed, visible: false });

    // create two points for reference
    const origin_point = this.board.create("point", [0, 0], { fixed, visible: false });
    const end_point = this.board.create("point", [this.findXVal, this.findYVal], { fixed, visible: false });

    // create the main vector
    const vector = this.board.create("line", [origin_point, end_point], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      strokeWidth,
      visible: () => {
        return comp_visible([0]);
      }
    });

    // create angles from x-axis and y-axis
    const angle_x = this.board.create("angle", [right_border_point, origin_point, end_point], {
      radius: () => {
        return force.Value() * 1.5;
      },
      orthoType: "sector",
      withLabel: false,
      strokeWidth,
      visible: () => {
        return comp_visible([1]);
      }
    });

    const angle_y_below_90 = this.board.create("angle", [end_point, origin_point, top_border_point], {
      radius: () => {
        return force.Value() * 2;
      },
      orthoType: "sector",
      withLabel: false,
      strokeWidth,
      visible: () => {
        return angle.Value() < 90 && comp_visible([2]);
      }
    });
    const angle_y_over_90 = this.board.create("angle", [top_border_point, origin_point, end_point], {
      radius: () => {
        return force.Value() * 2;
      },
      orthoType: "sector",
      withLabel: false,
      strokeWidth,
      visible: () => {
        return angle.Value() >= 90 && comp_visible([2]);
      }
    });

    // projection of F on x
    const proj_F_on_x = this.board.create("line", [origin_point, [this.findXVal, 0]], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      dash,
      strokeWidth: 5,
      visible: () => {
        return comp_visible([1, 3]);
      }
    });

    // Projection of F on y
    const proj_F_on_y = this.board.create("line", [origin_point, [0, this.findYVal]], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      dash,
      strokeWidth: 5,
      visible: () => {
        return comp_visible([2]) && !comp_visible([3]);
      }
    });

    // move y animation
    const y_translation = this.board.create(
      "transform",
      [
        () => {
          return this.y_trans * this.findXVal();
        },
        0
      ],
      { type: "translate" }
    );

    const y_line_trans = this.board.create("line", [proj_F_on_y, y_translation], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      dash,
      strokeWidth: 5,
      visible: () => {
        return comp_visible([3]);
      }
    });

    // u visibility
    const u_end_point = this.board.create(
      "point",
      [
        () => {
          return this.findXVal(true);
        },
        () => {
          return this.findYVal(true);
        }
      ],
      { fixed, visible: false }
    );

    const u_line = this.board.create("line", [origin_point, u_end_point], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      strokeWidth: 5,
      strokeColor: "red",
      visible: () => {
        return comp_visible([4]);
      }
    });

    // projection of u on x
    const proj_u_on_x = this.board.create(
      "line",
      [
        origin_point,
        [
          function() {
            return Math.cos((angle.Value() / 180) * Math.PI) * multiplier;
          },
          0
        ]
      ],
      {
        straightFirst: false,
        straightLast: false,
        lastArrow: true,
        strokeColor: "red",
        dash,
        strokeWidth: 5,
        visible: () => {
          return comp_visible([5]);
        }
      }
    );

    // Projection of u on y
    const proj_u_on_y = this.board.create(
      "line",
      [
        origin_point,
        [
          0,
          function() {
            return Math.sin((angle.Value() / 180) * Math.PI) * multiplier;
          }
        ]
      ],
      {
        straightFirst: false,
        straightLast: false,
        lastArrow: true,
        strokeColor: "red",
        dash,
        strokeWidth: 5,
        visible: () => {
          return comp_visible([6]);
        }
      }
    );

    // u anime
    const u_translation = this.board.create(
      "transform",
      [
        () => {
          return this.u_trans;
        },
        () => {
          return this.u_trans;
        }
      ],
      { type: "scale" }
    );
    const u_line_scale = this.board.create("line", [u_line, u_translation], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      strokeWidth: 5,
      strokeColor: "red",
      visible: () => {
        return comp_visible([7]);
      }
    });
    const u_x_scale = this.board.create("line", [proj_u_on_x, u_translation], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      dash,
      strokeWidth: 5,
      strokeColor: "red",
      visible: () => {
        return comp_visible([7]);
      }
    });
    const u_y_scale = this.board.create("line", [proj_u_on_y, u_translation], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      dash,
      strokeWidth: 5,
      strokeColor: "red",
      visible: () => {
        return comp_visible([7]);
      }
    });
  },
  methods: {
    findXVal(isUnitVec = false) {
      if (isUnitVec) return Math.cos((this.angle.Value() / 180) * Math.PI) * this.multiplier;
      return Math.cos((this.angle.Value() / 180) * Math.PI) * this.force.Value() * this.multiplier;
    },
    findYVal(isUnitVec = false) {
      if (isUnitVec) return Math.sin((this.angle.Value() / 180) * Math.PI) * this.multiplier;
      return Math.sin((this.angle.Value() / 180) * Math.PI) * this.force.Value() * this.multiplier;
    },
    ToggleVisibility(index) {
      const new_index = Math.floor(index / 2);
      if (index % 2 === 0) {
        this.$set(this.visible_components, new_index, true);
      } else {
        this.$set(this.visible_components, new_index, false);
      }

      // make y animation visible
      if (this.visible_components[1] && this.visible_components[2]) {
        this.$set(this.visible_components, 3, true);
      } else {
        this.$set(this.visible_components, 3, false);
        this.y_reset();
      }

      if (this.visible_components[4] && this.visible_components[5] && this.visible_components[6]) {
        this.$set(this.visible_components, 7, true);
      } else {
        this.$set(this.visible_components, 7, false);
        this.u_reset();
      }
      this.board.fullUpdate();
    },
    async y_animation() {
      // only on once
      if (this.y_animeOn) {
        this.y_animeOn = false;
        return;
      }

      this.y_animeOn = true;

      this.y_trans = 0;

      while (this.y_trans < 0.99 && this.y_animeOn) {
        this.y_trans += 0.05;
        this.board.fullUpdate();
        await this.sleep(100);
      }
      if (!this.y_animeOn) {
        return;
      }

      this.y_trans = 1;
      this.board.fullUpdate();
      this.y_animeOn = false;
    },
    async y_reset() {
      this.y_animeOn = false;
      await this.sleep(50);
      this.y_trans = 0;
      this.board.fullUpdate();
    },
    async u_animation() {
      // only on once
      if (this.u_animeOn) {
        this.u_animeOn = false;
        return;
      }
      this.u_animeOn = true;

      this.u_trans = 1;

      while (this.u_trans < this.force.Value() && this.u_animeOn) {
        this.u_trans += 0.05;
        this.board.fullUpdate();
        await this.sleep(100);
      }
      if (!this.u_animeOn) {
        return;
      }

      this.u_trans = this.force.Value();
      this.board.fullUpdate();
      this.u_animeOn = false;
    },
    async u_reset() {
      this.u_animeOn = false;
      await this.sleep(50);
      this.u_trans = 1;
      this.board.fullUpdate();
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
};
export const meta = {
  title: "Force Vector (2D)",
  description: "from JSX graph",
  number: 1
};
</script>

<style>
.jsx-graph {
  width: 800px !important;
  height: 800px !important;
}
.jsx-graph2 {
  width: 100% !important;
  height: 30vh !important;
}
</style>
