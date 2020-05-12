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
            <!-- <tr>
              <td>Resolution of F into components:</td>
              <td>
                <input type="radio" class="mx-3" name="Resolution_F" @click="ToggleVisibility(6)" />on
                <input type="radio" class="mx-3" name="Resolution_F" checked @click="ToggleVisibility(7)" />off
              </td>
            </tr> -->
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
            <!-- <tr>
              <td>Projection of u into components:</td>
              <td>
                <input type="radio" class="mx-3" name="Project_u_comp" @click="ToggleVisibility(14)" />on
                <input type="radio" class="mx-3" name="Project_u_comp" checked @click="ToggleVisibility(15)" />off
              </td>
            </tr> -->
          </tbody>
        </table>
        <div class="d-flex justify-content-center">
          <div id="control" style="width:400px; height:200px;"></div>
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
      visible_components: [true, false, false, false, false, false, false, false]
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
    this.board = JXG.JSXGraph.initBoard("ForceVec2D", { boundingbox: [-15, 15, 15, -15], keepAspectRatio: true, showCopyright: false });
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

    // create border
    const left_border_point = this.board.create("point", [-15, 0], { fixed, visible: false });
    const right_border_point = this.board.create("point", [15, 0], { fixed, visible: false });
    const top_border_point = this.board.create("point", [0, 15], { fixed, visible: false });
    const bottom_border_point = this.board.create("point", [0, -15], { fixed, visible: false });

    const x_axis = this.board.create("line", [left_border_point, right_border_point], {
      strokeWidth,
      lastArrow: true,
      firstArrow: true,
      strokeColor: "black"
    });
    const y_axis = this.board.create("line", [bottom_border_point, top_border_point], {
      strokeWidth,
      lastArrow: true,
      firstArrow: true,
      strokeColor: "black"
    });

    // create two points for reference
    const origin_point = this.board.create("point", [0, 0], { fixed, visible: false });
    const end_point = this.board.create(
      "point",
      [
        function() {
          return Math.cos((angle.Value() / 180) * Math.PI) * force.Value() * multiplier;
        },
        function() {
          return Math.sin((angle.Value() / 180) * Math.PI) * force.Value() * multiplier;
        }
      ],
      { fixed, visible: false }
    );

    // create the main vector
    const vector = this.board.create("line", [origin_point, end_point], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      strokeWidth,
      visible: () => {
        return comp_visible([0, 1, 2, 3]);
      }
    });

    // create angles from x-axis and y-axis
    const angle_x = this.board.create("angle", [right_border_point, origin_point, end_point], {
      radius: () => {
        return force.Value() * 1.5;
      },
      orthoType: "sector",
      withLabel: false,
      fillOpacity: 0,
      strokeColor: "orange",
      strokeWidth,
      visible: () => {
        return comp_visible([1, 3, 5, 7]);
      }
    });

    const angle_y_below_90 = this.board.create("angle", [end_point, origin_point, top_border_point], {
      radius: () => {
        return force.Value() * 2;
      },
      orthoType: "sector",
      withLabel: false,
      fillOpacity: 0,
      strokeColor: "red",
      strokeWidth,
      visible: () => {
        return angle.Value() < 90 && comp_visible([2, 3, 6, 7]);
      }
    });
    const angle_y_over_90 = this.board.create("angle", [top_border_point, origin_point, end_point], {
      radius: () => {
        return force.Value() * 2;
      },
      orthoType: "sector",
      withLabel: false,
      fillOpacity: 0,
      strokeColor: "red",
      strokeWidth,
      visible: () => {
        return angle.Value() >= 90 && comp_visible([2, 3, 6, 7]);
      }
    });

    // projection of F on x
    const proj_F_on_x = this.board.create(
      "line",
      [
        origin_point,
        [
          function() {
            return Math.cos((angle.Value() / 180) * Math.PI) * force.Value() * multiplier;
          },
          0
        ]
      ],
      {
        straightFirst: false,
        straightLast: false,
        lastArrow: true,
        strokeColor: "orange",
        strokeWidth: () => {
          if (comp_visible([3])) return 5;
          else return 3;
        },
        visible: () => {
          return comp_visible([1, 3]);
        }
      }
    );
    const proj_F_on_x_dash = this.board.create(
      "line",
      [
        [
          function() {
            return Math.cos((angle.Value() / 180) * Math.PI) * force.Value() * multiplier;
          },
          0
        ],
        end_point
      ],
      {
        straightFirst: false,
        straightLast: false,
        strokeColor: "orange",
        strokeWidth,
        dash,
        visible: () => {
          return comp_visible([1]);
        }
      }
    );

    // Projection of F on y
    const proj_F_on_y = this.board.create(
      "line",
      [
        origin_point,
        [
          0,
          function() {
            return Math.sin((angle.Value() / 180) * Math.PI) * force.Value() * multiplier;
          }
        ]
      ],
      {
        straightFirst: false,
        straightLast: false,
        lastArrow: true,
        strokeColor: "red",
        strokeWidth: () => {
          if (comp_visible([3])) return 5;
          else return 3;
        },
        visible: () => {
          return comp_visible([2, 3]);
        }
      }
    );
    const proj_F_on_y_dash = this.board.create(
      "line",
      [
        [
          0,
          function() {
            return Math.sin((angle.Value() / 180) * Math.PI) * force.Value() * multiplier;
          }
        ],
        end_point
      ],
      {
        straightFirst: false,
        straightLast: false,
        strokeColor: "red",
        strokeWidth,
        dash,
        visible: () => {
          return comp_visible([2]);
        }
      }
    );

    // u visibility
    const u_end_point = this.board.create(
      "point",
      [
        function() {
          return Math.cos((angle.Value() / 180) * Math.PI) * multiplier;
        },
        function() {
          return Math.sin((angle.Value() / 180) * Math.PI) * multiplier;
        }
      ],
      { fixed, visible: false }
    );

    const u_line = this.board.create("line", [origin_point, u_end_point], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      strokeWidth,
      strokeColor: "green",
      visible: () => {
        return comp_visible([4, 5, 6, 7]);
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
        strokeColor: "orange",
        strokeWidth: () => {
          if (comp_visible([7])) return 5;
          else return 3;
        },
        visible: () => {
          return comp_visible([5, 7]);
        }
      }
    );
    const proj_u_on_x_dash = this.board.create(
      "line",
      [
        [
          function() {
            return Math.cos((angle.Value() / 180) * Math.PI) * multiplier;
          },
          0
        ],
        u_end_point
      ],
      {
        straightFirst: false,
        straightLast: false,
        strokeColor: "orange",
        strokeWidth,
        dash,
        visible: () => {
          return comp_visible([5]);
        }
      }
    );

    // Projection of F on y
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
        strokeWidth: () => {
          if (comp_visible([7])) return 5;
          else return 3;
        },
        visible: () => {
          return comp_visible([6, 7]);
        }
      }
    );
    const proj_u_on_y_dash = this.board.create(
      "line",
      [
        [
          0,
          function() {
            return Math.sin((angle.Value() / 180) * Math.PI) * multiplier;
          }
        ],
        u_end_point
      ],
      {
        straightFirst: false,
        straightLast: false,
        strokeColor: "red",
        strokeWidth,
        dash,
        visible: () => {
          return comp_visible([6]);
        }
      }
    );
    // Text
    this.board.create(
      "text",
      [
        -10,
        12,
        () => {
          const value = parseFloat(angle.Value().toFixed(fixedDecimal));
          return "&alpha;: " + value + "\u00B0";
        }
      ],
      {
        visible: () => {
          return comp_visible([1, 3, 5, 7]);
        },
        fontSize,
        strokeColor: "orange"
      }
    );
    this.board.create(
      "text",
      [
        -10,
        10,
        () => {
          const value = parseFloat((90 - angle.Value()).toFixed(fixedDecimal));
          return "&beta;: " + value + "\u00B0";
        }
      ],
      {
        visible: () => {
          return comp_visible([2, 3, 6, 7]);
        },
        fontSize,
        strokeColor: "red"
      }
    );
    this.board.create(
      "text",
      [
        -10,
        8,
        () => {
          const value = parseFloat(Math.cos((angle.Value() / 180) * Math.PI) * force.Value() * multiplier).toFixed(fixedDecimal);
          return "F_x: " + value + "N";
        }
      ],
      {
        visible: () => {
          return comp_visible([1]);
        },
        fontSize,
        strokeColor: "orange"
      }
    );
    this.board.create(
      "text",
      [
        -10,
        6,
        () => {
          const value = parseFloat(Math.sin((angle.Value() / 180) * Math.PI) * force.Value() * multiplier).toFixed(fixedDecimal);
          return "F_y: " + value + "N";
        }
      ],
      {
        visible: () => {
          return comp_visible([2]);
        },
        fontSize,
        strokeColor: "red"
      }
    );
  },
  methods: {
    ToggleVisibility(index) {
      if (index % 2 === 0) {
        this.visible_components[Math.floor(index / 2)] = true;
      } else {
        this.visible_components[Math.floor(index / 2)] = false;
      }
      this.board.fullUpdate();
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
