<template>
  <div class="floating-panel-resize-frame fill-parent">
    <div class="floating-panel-frame fill-parent">
      <iframe class="floating-panel-text fill-parent"
              :srcdoc="text"></iframe>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { clipboard } from 'electron';

@Component
export default class ClipboardPanel extends Vue {
  data() {
    const format = clipboard.availableFormats().some(format => format == 'text/html') ?
        'text/html' : 'text/plain';

    let text: string;
    switch (format) {
      case 'text/html':
        text = clipboard.readHTML();
        break;
      case 'text/plain':
        text =`
        <html>
        <head>
          <meta http-equiv="content-type" content="text/html; charset=UTF-8">
        </head>
        <body>
          <pre>${clipboard.readText()}</pre>
        </body>
        </html>
        `;
        break;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');

    const styleElement = doc.createElement('style');
    styleElement.setAttribute('type', 'text/css');
    styleElement.append('pre { margin: 0; white-space: pre-wrap; }');
    doc.head.append(styleElement);
    doc.body.contentEditable = 'true';

    return {
      format: format,
      text: doc.documentElement.outerHTML,
    }
  }
}
</script>

<style>
.floating-panel-resize-frame {
  -webkit-app-region: no-drag;
  padding: 4px;
}
.floating-panel-frame {
  -webkit-app-region: drag;
  padding: 12px;
}
.floating-panel-text {
  -webkit-app-region: no-drag;
}
</style>
