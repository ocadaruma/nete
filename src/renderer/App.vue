<template>
  <div>
    <h1>Nete</h1>
    We are using node {{ nodeVersion }},
    Chrome {{ chromeVersion }},
    and Electron {{ electronVersion }}.
    Build phase {{ buildPhase }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from "vue-class-component";

@Component
export default class App extends Vue {
  nodeVersion = process.versions.node;
  chromeVersion = process.versions.chrome;
  electronVersion = process.versions.electron;
  buildPhase = process.env.NODE_ENV;
}
</script>
