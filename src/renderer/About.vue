<template>
  <div>
    <section class="hero">
      <div class="hero-body">
        <div class="container has-text-centered">
          <img src="images/icon_512.png" class="image is-128x128 is-inline">
          <h1 class="title">
            {{ appName }}
          </h1>
          <h2 class="subtitle">
            {{ appVersion }}
          </h2>
        </div>
      </div>
    </section>
    <div class="container has-text-centered">
      <h2>
        <a href="#" @click="openWithBrowser('https://raw.githubusercontent.com/ocadaruma/nete/master/LICENSE')">
          LICENSE
        </a>
      </h2>
      <h2>
        <a href="#" @click="openWithBrowser('https://raw.githubusercontent.com/ocadaruma/nete/master/NOTICE')">
          3rd Party NOTICE
        </a>
      </h2>
    </div>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";

const { appInfo, shell } = window;

@Component
export default class About extends Vue {
  appName = "";
  appVersion = "";

  async created() {
    this.appName = await appInfo.name();
    this.appVersion = await appInfo.version();
  }

  openWithBrowser(url: string) {
    shell.openExternal(url);
  }
}
</script>
