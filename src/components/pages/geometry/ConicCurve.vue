<template>
  <div id="ggb-element"></div>
</template>

<script>
var ggbApp = new GGBApplet(
  {
    appName: "graphing",
    material_id: "c4gpsw6j",
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight - 75,
    showToolBar: false,
    showAlgebraInput: false,
    showMenuBar: false,
    autoHeight: false,
    
  },
  true
);
export default {
  mounted() {
    ggbApp.inject("ggb-element");
  }
};
export const meta = {
  title: "Conic Curves and Eccentricity",
  description: "unknown"
};
</script>

<style></style>
