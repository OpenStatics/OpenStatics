export class CircleSlider {
  center;
  circle;
  glider;
  textLabel;
  baseAttributes;

  constructor(jsxbox, name, x, y, radius, startAngle, label, textToUpdate, attributes) {
    //["tz", 2, -8, 1, 150, "\u03b8_z"]
    this.baseAttributes = {
      center: { fixed: true, visible: false, showInfobox: false },
      circle: { fixed: true, visible: true, strokeColor: "black" },
      glider: { name: "", showInfobox: false, visible: true, strokeColor: "purple", fillColor: "purple", label: { strokeColor: "purple" } },
      textLabel: { digits: 0, fontSize: 12, fixed: true, anchorX: "middle", anchorY: "middle", visible: true, strokeColor: "purple" }
    };

    for (let key of Object.keys(this.baseAttributes)) {
      if (Object.keys(attributes).includes(key)) {
        //console.log(key);
        this.baseAttributes[key] = { ...this.baseAttributes[key], ...attributes[key] };
      }
    }

    this.createCenter(jsxbox, x, y);
    this.createCircle(jsxbox, radius);
    this.createGlider(jsxbox, x, y, radius, startAngle);
    this.createTextLabel(jsxbox, x, y, textToUpdate, name);
    jsxbox.create("text", [x - 0.05, y + radius * 1.2, label], { strokeColor: "purple", visible: this.baseAttributes.textLabel.visible, anchorY: "bottom", anchorX: "middle" });

    return this;
  }

  createCenter(jsxbox, x, y) {
    this.center = jsxbox.create("point", [x, y], this.baseAttributes.center);
  }

  createCircle(jsxbox, radius) {
    this.circle = jsxbox.create("circle", [this.center, radius], this.baseAttributes.circle);
  }

  createGlider(jsxbox, x, y, radius, startAngle) {
    this.glider = jsxbox.create(
      "glider",
      [radius * Math.cos((startAngle * Math.PI) / 180) + x, radius * Math.sin((startAngle * Math.PI) / 180) + y, this.circle],
      this.baseAttributes.glider
    );
  }

  createTextLabel(jsxbox, x, y, textToUpdate, name) {
    const form = () => {
      return Math.round((this.glideVal() * 180) / Math.PI);
    };
    this.textLabel = jsxbox.create("text", [x, y, form], this.baseAttributes.textLabel);

    if (textToUpdate !== null) {
      textToUpdate[name + "_label"] = {
        object: this.textLabel,
        formula: form
      };
    }
  }

  glideVal = () => {
    // convert position on circle to angle in radians
    let angleRad = Math.acos((this.glider.X() - this.center.X()) / this.circle.Radius());
    angleRad = this.glider.Y() - this.center.Y() >= 0 ? angleRad : Math.PI * 2 - angleRad;
    return (Math.round((angleRad * 180) / Math.PI) * Math.PI) / 180;
  };

  //Completely functional, can't find a usage
  setGlideVal = deg => {
    let radius = this.circle.Radius();
    this.glider.setPositionDirectly(JXG.COORDS_BY_USER, [
      radius * Math.cos((deg * Math.PI) / 180) + this.center.X(),
      radius * Math.sin((deg * Math.PI) / 180) + this.center.Y()
    ]);
  };
}
