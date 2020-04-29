<template>
  <div id="home" style="margin:20px">
    <h1 class="category">Open Statics</h1>
    <div class="row">
      <div v-for="(items, category) in modulesInfo" :key="category" class="col">
        <h1 class="category">{{ category }}</h1>
        <div class="my-5" v-for="item in items" :key="item.name" :title="item.description">
          <div class="cardlike">
            <div class="img-container" @click="updateRoute(`/${category}/${item.name}`)">
              <div class="img-container-hover"><i class="fas fa-plus img-container-plus fa-4x"></i></div>
              <img class="img" :src="'https://raw.githubusercontent.com/OpenStatics/images/master/statics_modules/' + item.number + '.jpg'" />
            </div>
            <h2 class="text-center pt-2" style="display:block">{{ item.title }}</h2>
          </div>
        </div>
      </div>
    </div>
    <section style="background:grey">Footer</section>
  </div>
</template>

<script>
export default {
  name: "home",
  props: { modulesInfo: { type: Object } },
  mounted() {
    console.log(this.modulesInfo);
  },
  methods: {
    updateRoute(path) {
      this.$emit("fromChild", path);
    }
  }
};
</script>
<style scoped>
.img {
  max-width: 400px;
  padding-top: 20px;
}
.img-container {
  display: block;
  text-align: center;
  margin: auto;
  height: 450px;
  width: 450px;
  cursor: pointer;
  position: relative;
}

.img-container-hover {
  z-index: 1;
  opacity: 0;
  height: 100%;
  width: 100%;
  position: absolute;
  display: block;
  -webkit-transition: all ease 0.5s;
  -moz-transition: all ease 0.5s;
  transition: all ease 0.5s;
}
.img-container-hover:hover {
  opacity: 0.4;
  background: blue;
}
.img-container-plus {
  top: 50%;
  text-align: center;
  width: 100%;
  display: block;
  position: absolute;
  color: white;
}
.cardlike {
  width: 460px;
  height: 500px;
  margin: auto;
  background: white;
}
.category {
  display: block;
  text-align: center;
}
</style>
