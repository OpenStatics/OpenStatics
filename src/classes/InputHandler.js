export class InputHandler {
  TOP_Y;
  LEFT_X;
  INTERVAL;
  RIGHT_X;
  LABEL_SIZE;
  textToUpdate = {
    /* arbitrary name: {
        object: reference to object
        formula: function that returns text (string)
    }*/
  };
  objectsToEnable = {
    /* arbitrary name: {
        object: reference to object
        component: component to enable/disable
        formula: function that returns true for disable
    }
    */
  };
  buttonsToToggle = {
    /* key from values: {
        possible value: corresponding button
    }
    */
  };
  values;
  state = 0;
  jsxbox;
  callback;

  constructor(jsxbox, INTERVAL, TOP_Y, LEFT_X, RIGHT_X, LABEL_SIZE, values, state, callback = null) {
    this.jsxbox = jsxbox;
    this.INTERVAL = INTERVAL;
    this.TOP_Y = TOP_Y;
    this.LEFT_X = LEFT_X;
    this.RIGHT_X = RIGHT_X;
    this.LABEL_SIZE = LABEL_SIZE;
    this.values = values;
    this.state = state;
    this.callback = callback;
    return this;
  }

  updateState(newState) {
    this.state = newState;

    // Align text and enable/disable components
    this.fixTextAlignment();
    this.toggleButtons();
    this.jsxbox.fullUpdate();
  }

  generate(data, sliders) {
    /* [key value,
          label name,
          y position,
          true: slider + update button | false: on/off,
          [min, start, max] (if true) | [lbl1, val1, lbl2, val2] (if false),
          [allowed states],
          color ]*/
    /* For just text: [false, label name, y position, mathJax] */
    const key = data[0],
      labelName = data[1],
      y_offset = data[2],
      option = data[3];

    this.jsxbox.create("text", [-15, this.TOP_Y + y_offset, labelName + (key != false ? ":" : "")], {
      fontSize: this.LABEL_SIZE,
      color: "black",
      fixed: true,
      useMathJax: key !== false ? false : option
    });

    // Just label
    if (key === false) return;

    const params = data[4],
      states = data[5];

    const disableFormula = () => {
      return !this.stateCheck(states)();
    };

    if (option) {
      // True case
      const sliderColor = data[6];

      sliders[key] = this.jsxbox.create("slider", [[this.LEFT_X, this.TOP_Y + y_offset], [9, this.TOP_Y + y_offset], params], {
        name: "",
        withTicks: false,
        strokeColor: sliderColor,
        fillColor: "white",
        highline: { color: sliderColor },
        baseline: { color: sliderColor },
        label: {
          color: "black",
          fontSize: this.LABEL_SIZE,
          visible: this.stateCheck(states)
        },
        snapWidth: 0.01,
        visible: this.stateCheck(states)
      });
      let textbox = this.jsxbox.create("input", [this.LEFT_X, this.TOP_Y + y_offset - 1.5, "", ""], {
        cssStyle: "width: 58px",
        fixed: true
      });
      let button = this.jsxbox.create("button", [this.RIGHT_X, this.TOP_Y + y_offset - 1.5, "Update", this.buttonClick(textbox, sliders[key])], {
        fixed: true
      });

      textbox.rendNodeInput.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
          // Trigger the button element with a click
          button.rendNodeButton.click();
        }
      });

      this.objectsToEnable[key + "1"] = {
        object: textbox,
        component: "rendNodeInput",
        formula: disableFormula
      };
      this.objectsToEnable[key + "2"] = {
        object: button,
        component: "rendNodeButton",
        formula: disableFormula
      };
    } else {
      // False case
      const lbl1 = params[0],
        val1 = params[1],
        lbl2 = params[2],
        val2 = params[3];

      // Left button (usually "on")
      this.objectsToEnable[key + "1"] = {
        object: this.jsxbox.create(
          "button",
          [
            this.LEFT_X,
            this.TOP_Y + y_offset,
            lbl1,
            () => {
              this.values[key] = val1;
              this.fixTextAlignment();
              this.toggleButtons();
            }
          ],
          {
            fixed: true
          }
        ),
        formula: disableFormula,
        component: "rendNodeButton"
      };

      // Right button (usually "off")
      this.objectsToEnable[key + "2"] = {
        object: this.jsxbox.create(
          "button",
          [
            this.RIGHT_X,
            this.TOP_Y + y_offset,
            lbl2,
            () => {
              this.values[key] = val2;
              this.fixTextAlignment();
              this.toggleButtons();
            }
          ],
          { fixed: true }
        ),
        formula: disableFormula,
        component: "rendNodeButton"
      };

      // Make buttons blue
      this.objectsToEnable[key + "1"].object.rendNodeButton.classList.add("btn-primary");
      this.objectsToEnable[key + "2"].object.rendNodeButton.classList.add("btn-primary");

      // Setup yellow button system for this value
      this.buttonsToToggle[key] = {};
      this.buttonsToToggle[key][val1] = this.objectsToEnable[key + "1"].object;
      this.buttonsToToggle[key][val2] = this.objectsToEnable[key + "2"].object;
    }
  }

  valCheck = (value, target) => {
    return () => {
      return this.values[value] === target;
    };
  };

  stateCheck = states => {
    return () => {
      return states.includes(this.state);
    };
  };

  stateValCheck = (states, value, target) => {
    return () => {
      return this.stateCheck(states)() && this.valCheck(value, target)();
      //return states.includes(this.state) && this.valCheck(value, target)();
    };
  };

  // Function that returns a function that updates a slider value to that inside the textbox
  buttonClick = (textbox, slider) => {
    return () => {
      if (textbox.Value() === "") return;
      if (!isNaN(textbox.Value())) {
        let val = Number(textbox.Value());
        val = Math.min(slider._smax, val);
        val = Math.max(slider._smin, val);
        val = Math.round(val * 100) / 100;
        slider.setValue(val);
        textbox.rendNodeInput.value = "";
        textbox.update();
        slider.update();
        this.fixTextAlignment();
      }
    };
  };

  fixTextAlignment() {
    for (const lbl of Object.keys(this.textToUpdate)) {
      this.textToUpdate[lbl].object.setText("");
      this.textToUpdate[lbl].object.setText(this.textToUpdate[lbl].formula);
    }
    // Also does buttons
    for (const lbl of Object.keys(this.objectsToEnable)) {
      this.objectsToEnable[lbl].object[this.objectsToEnable[lbl].component].disabled = this.objectsToEnable[lbl].formula();
    }

    // Callback
    if (this.callback instanceof Function) {
      this.callback();
    }
  }

  toggleButtons() {
    for (const lbl of Object.keys(this.values)) {
      const currVal = this.values[lbl];
      for (const option of Object.keys(this.buttonsToToggle[lbl])) {
        if (currVal === option) {
          if (!this.buttonsToToggle[lbl][option].rendNodeButton.classList.contains("btn-warning"))
            this.buttonsToToggle[lbl][option].rendNodeButton.classList.add("btn-warning");
        } else {
          if (this.buttonsToToggle[lbl][option].rendNodeButton.classList.contains("btn-warning"))
            this.buttonsToToggle[lbl][option].rendNodeButton.classList.remove("btn-warning");
        }
      }
    }
  }
}
