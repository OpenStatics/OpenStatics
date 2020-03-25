<template>
  <div>
    For 2D case, a force vector can be represented as \[\vec{F} =
    F_x\vec{i}+F_y\vec{j}=\sqrt{F_x^2+F_y^2}(\frac{F_x}{\sqrt{F_x^2+F_y^2}\vec{i}}+\frac{F_y}{\sqrt{F_x^2+F_y^2}\vec{j}})\]
    \[=||\vec{F}||(\frac{F_x}{||\vec{F}||\vec{i}}+\frac{F_y}{||\vec{F}||\vec{j}})\] Note that \(cos \alpha =\frac{F_x}{||\vec{F}||}\),\(cos \beta
    =\frac{F_y}{||\vec{F}||}\), where \(\alpha\) is the angle between the vector and x-axis, \(\beta\) is the angle between the vector and y-axis.
    Thus we have \[\vec{F}=||\vec{F}||(cos\alpha \vec{i} +cos\beta \vec{j})=||\vec{F}||\vec{u}\] Where \(\vec{u}=(cos\alpha \vec{i} + cos\beta
    \vec{j})\) is the unite vector.
  </div>
</template>

<script>
export default {
};
</script>
