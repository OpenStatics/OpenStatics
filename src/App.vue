<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">Open Statics</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="#">
              Home
              <span class="sr-only">(current)</span>
            </a>
          </li>
          <li v-for="(items, category) in pages" :key="category" class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >{{ category }}</a>
            <div
              class="dropdown-menu"
              v-for="item in items"
              :key="item.name"
              :title="item.description"
            >
              <a class="dropdown-item" @click="current = item.name">{{ item.title }}</a>
            </div>
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0">
          <input
            class="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
      </div>
    </nav>
    <div class='mx-2 my-2'>
      <template v-if="current">
        <component :is="current"></component>
      </template>
      <template v-else>Home page</template>
    </div>
    <!-- <div class="row justify-content-center">
      <div class="col">&nbsp;</div>
      <div class="col col-10">
        <template v-if="current">
          <component :is="current"></component>
        </template>
        <template v-else>Home page</template>
      </div>
      <div class="col">&nbsp;</div>
    </div> -->
  </div>
</template>

<script>
import Vue from "vue";

// register all pages components
const meta = {};
const files = require.context("./components/pages", true, /\.vue$/i);

files.keys().map(key => {
  const comps = key.split("/");

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
  data() {
    return {
      pages: meta,
      current: ""
    };
  }
});
</script>

<style></style>
