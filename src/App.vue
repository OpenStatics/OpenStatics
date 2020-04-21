<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" :href="'/'">Open Statics</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#nav-content">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="nav-content">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" :href="'/'">
              Home
            </a>
          </li>
          <li v-for="(items, category) in pages" :key="category" class="nav-item dropdown" style="cursor: pointer">
            <a class="nav-link dropdown-toggle" role="button" data-toggle="dropdown">{{ category }}</a>
            <div class="dropdown-menu">
              <a
                class="dropdown-item"
                v-for="item in items"
                :key="item.name"
                :title="item.description"
                @click="updateRoute(`/${category}/${item.name}`)"
                >{{ item.title }}
              </a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
    <div class="mx-2 my-2">
      <template v-if="current">
        <component :is="current"></component>
      </template>
      <template v-else>
        <home :modulesInfo="pages" @fromChild="updateRoute" />
      </template>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import home from "./components/home/home";

// register all pages components
const meta = {};
const files = require.context("./components/pages", true, /\.vue$/i);

files.keys().map(key => {
  const comps = key.split("/").splice(1);

  const filename = comps.pop();
  const dirname = comps.pop();

  let f = meta;

  for (const comp of comps) f[comp] = f[comp] || {};
  f[dirname] = f[dirname] || [];
  const component = files(key);
  f[dirname].push(component.meta);
  return Vue.component((component.meta.name = filename.split(".")[0]), component.default);
});

export default Vue.extend({
  name: "app",
  components: {
    home
  },
  data() {
    return {
      pages: meta,
      current: ""
    };
  },
  mounted() {
    // parse the url and get the last two index for redirection
    const urls = window.location.href.split("/");
    const path = urls.slice(urls.length - 2, urls.length);
    this.updateRoute("/" + path.join("/"));
  },
  methods: {
    /**
     * @param {string} path
     */
    updateRoute(path) {
      const [, cat, name] = path.split("/");
      if (cat && name) {
        this.current = name;
        window.history.pushState({}, "", path);
      }
    }
  }
});
</script>

<style></style>
