<template>
  <div class="container preference">
    <div class="has-text-centered app-icon">
      <img src="images/icon_512.png" class="image is-64x64 is-inline">
    </div>
    <div class="columns is-mobile is-vcentered">
      <div class="column is-4 has-text-right">
        HotKey
      </div>
      <div class="column">
        <div class="field has-addons has-addons-right">
          <p class="control">
            <input class="input is-small" type="text" disabled>
          </p>
          <p class="control">
            <a class="button is-small">
              <span class="icon">
                <i class="far fa-trash-alt"></i>
              </span>
            </a>
          </p>
        </div>
      </div>
    </div>
    <div class="columns is-mobile is-vcentered">
      <div class="column is-4 has-text-right">
        Show/Hide
      </div>
      <div class="column">
        <div class="field has-addons has-addons-right">
          <p class="control">
            <input class="input is-small" type="text" disabled>
          </p>
          <p class="control">
            <a class="button is-small">
              <span class="icon">
                <i class="far fa-trash-alt"></i>
              </span>
            </a>
          </p>
        </div>
      </div>
    </div>
    <div class="has-text-centered">
      <b-button class="is-success" @click="save()" disabled>Save</b-button>
    </div>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";

@Component
export default class About extends Vue {
  save() {
    this.$buefy.toast.open('saved');
  }
}
</script>

<style scoped>
.preference {
  margin: 1.2em;
}
.app-icon {
  margin-bottom: 1.2em;
}
</style>
