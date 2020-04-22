<template>
  <div id="home">
    <div class="row">
      <div v-for="(items, category) in modulesInfo" :key="category" class="col-6">
        <h1>{{ category }}</h1>
        <div class="list-group" v-for="item in items" :key="item.name" :title="item.description" @click="updateRoute(`/${category}/${item.name}`)">
          <span style="cursor:pointer" class="list-group-item list-group-item-action list-group-item-primary">{{ item.title }}</span>
          <!-- <img class='img img-fluid' :src="'https://raw.githubusercontent.com/OpenStatics/images/master/statics_modules/' + item.number + '.jpg'" /> -->
        </div>
      </div>
    </div>
    <div></div>
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
