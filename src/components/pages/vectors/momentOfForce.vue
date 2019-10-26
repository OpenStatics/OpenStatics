<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col">
          <div id="box" class="jxgbox" style="width:700px; height:500px; margin: auto auto"></div>
        </div>
        <div class="col-3">
          <button class="btn btn-primary mb-3" @click="rotate()">Start Animation</button><br />
          <button class="btn btn-primary" @click="resetLine()">Reset Line</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      hingePos: undefined,
      line: undefined,
      f1: undefined,
      f2: undefined,
      angularAcc: undefined,
      leftPoint: undefined,
      rightPoint: undefined
    };
  },
  methods: {
    rotate() {
      let angularVel = 0;
      let ang = Math.atan(this.leftPoint.Y() / this.leftPoint.X());
      const step = 60;
      for (let i = 0; i < 8000; i += step) {
        ang += angularVel * (step / 1000);
        angularVel += this.angularAcc() * (step / 1000);
        const rx = (5 - this.hingePos()) * Math.cos(ang) + this.hingePos();
        const ry = (5 - this.hingePos()) * Math.sin(ang);
        const lx = (5 + this.hingePos()) * Math.cos(Math.PI + ang) + this.hingePos();
        const ly = (5 + this.hingePos()) * Math.sin(Math.PI + ang);
        console.log(ang);
        setTimeout(() => {
          this.leftPoint.moveTo([lx, ly], 17);
          this.rightPoint.moveTo([rx, ry], 17);
        }, i);
      }
    },
    resetLine() {
      this.leftPoint.moveTo([-5, 0], 17);
      this.rightPoint.moveTo([5, 0], 17);
    }
  },
  mounted() {
    const board = JXG.JSXGraph.initBoard("box", { boundingbox: [-10, 10, 10, -10], axis: true, keepAspectRatio: true });

    const hingePosSlider = board.create("slider", [[6, 9], [11, 9], [-5, 0, 5]], { name: "Hinge Position (m)" });
    const hingePos = () => {
      return hingePosSlider.Value();
    };

    this.hingePos = hingePos;

    const hinge = board.create("point", [hingePos, 0]);

    // f1
    const f1MagSlider = board.create("slider", [[6, 7], [11, 7], [-3, 1, 3]], { name: "F1 Magnitude (N)" });
    const f1Mag = () => f1MagSlider.Value();
    const f1AngleSlicer = board.create("slider", [[6, 6], [11, 6], [0, 90, 360]], { name: "F1 Angle (deg)" });
    const f1Ang = () => f1AngleSlicer.Value();
    const f1PosSlider = board.create("slider", [[6, 5], [11, 5], [-5, -5, 5]], { name: "F1 Position (m)" });

    const f1StartX = () => f1PosSlider.Value();
    const f1StartY = () => 0;
    const f1EndX = () => {
      return f1Mag() * Math.cos((f1Ang() / 180) * Math.PI) + f1StartX();
    };
    const f1EndY = () => {
      return f1Mag() * Math.sin((f1Ang() / 180) * Math.PI) + f1StartY();
    };

    const f1 = board.create("line", [[f1StartX, 0], [f1EndX, f1EndY]], {
      straightFirst: false,
      straightLast: false,
      strokeWidth: 2,
      strokeColor: "black",
      lastArrow: true,
      fixed: true
    });

    // f2
    const f2MagSlider = board.create("slider", [[6, 3], [11, 3], [-3, 1, 3]], { name: "F2 Magnitude (N)" });
    const f2Mag = () => f2MagSlider.Value();
    const f2AngleSlicer = board.create("slider", [[6, 2], [11, 2], [0, 90, 360]], { name: "F2 Angle (deg)" });
    const f2Ang = () => f2AngleSlicer.Value();
    const f2PosSlider = board.create("slider", [[6, 1], [11, 1], [-5, 5, 5]], { name: "F2 Position (m)" });
    const f2StartX = () => f2PosSlider.Value();

    const f2StartY = () => 0;
    const f2EndX = () => {
      return f2Mag() * Math.cos((f2Ang() / 180) * Math.PI) + f2StartX();
    };
    const f2EndY = () => {
      return f2Mag() * Math.sin((f2Ang() / 180) * Math.PI) + f2StartY();
    };

    const f2 = board.create("line", [[f2StartX, 0], [f2EndX, f2EndY]], {
      straightFirst: false,
      straightLast: false,
      strokeWidth: 2,
      strokeColor: "black",
      lastArrow: true,
      fixed: true
    });

    const angularAcceleration = () => {
      const torque =
        f1Mag() * (f1StartX() - hingePos()) * Math.sin((f1Ang() / 180) * Math.PI) +
        f2Mag() * (f2StartX() - hingePos()) * Math.sin((f2Ang() / 180) * Math.PI);
      const inertia = (1 / 12) * 25 + hingePos() ** 2;
      return torque / inertia;
    };

    this.leftPoint = board.create("point", [-5, 0]);
    this.rightPoint = board.create("point", [5, 0]);

    const lineLX = () => {
      return this.leftPoint.X();
    };

    const lineLY = () => {
      return this.leftPoint.Y();
    };

    const lineRX = () => {
      return this.rightPoint.X();
    };

    const lineRY = () => {
      return this.rightPoint.Y();
    };

    this.line = board.create("line", [[lineLX, lineLY], [lineRX, lineRY]], {
      straightFirst: false,
      straightLast: false,
      strokeWidth: 2
    });

    this.angularAcc = angularAcceleration;
  }
};
export const meta = {
  title: "Moment of force",
  description: "moment of force"
};
</script>
