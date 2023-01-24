<template>
  <div v-if="format === 'Image'">
    <!-- Need pointer-events: none and user-select: none to make @copy works. Don't know why! -->
    <img :src="image.dataUrl"
         style="max-width: 100%; pointer-events: none; user-select: none; -webkit-app-region: drag"
         @copy="copyImage">
  </div>
  <div v-else
       style="-webkit-app-region: no-drag; padding: 4px; width: 100%; height: 100%;">
    <div style="-webkit-app-region: drag; padding: 12px; width: 100%; height: 100%;">
      <iframe style="-webkit-app-region: no-drag; width: 100%; height: 100%;"
              :srcdoc="html"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {ClipboardFormat, Image} from "@/@types/global";
import Component from "vue-class-component";
const { appWindow, clipboard } = window;

@Component
export default class ClipboardPanel extends Vue {
  format: ClipboardFormat = "Text"
  html = ""
  image: Image = {
    dataUrl: "", height: 0, width: 0
  }

  async created() {
    this.format = await clipboard.clipboardFormat();
    if (this.format === "Image") {
      this.image = await clipboard.readImage();
      await appWindow.resize(this.image.width, this.image.height);
    } else {
      let html: string;
      switch (this.format) {
        case "Html":
          html = await clipboard.readHTML();
          break;
        default:
          const clipboardText = await clipboard.readText();
          html =`
          <html>
          <head>
            <meta http-equiv="content-type" content="text/html; charset=UTF-8">
          </head>
          <body>
            <pre>${clipboardText}</pre>
          </body>
          </html>
          `;
          break;
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const styleElement = doc.createElement('style');
      styleElement.setAttribute('type', 'text/css');
      styleElement.append('pre { margin: 0; white-space: pre-wrap; }');
      doc.head.append(styleElement);
      doc.body.contentEditable = 'true';
      this.html = doc.documentElement.outerHTML;
    }
  }

  async copyImage() {
    await appWindow.copyImage();
  }
}
</script>

<style>
html, body {
  position: fixed;
  top:0; bottom:0; left:0; right:0;
}
</style>
