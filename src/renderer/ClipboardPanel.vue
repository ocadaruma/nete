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
const { clipboard } = window;

@Component
export default class ClipboardPanel extends Vue {
  text = ""

  async created() {
    const formats = await clipboard.availableFormats();
    const format = formats.some(format => format == 'text/html') ?
        'text/html' : 'text/plain';

    let text: string;
    switch (format) {
      case 'text/html':
        text = await clipboard.readHTML();
        break;
      case 'text/plain':
        const clipboardText = await clipboard.readText();
        text =`
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
    const doc = parser.parseFromString(text, 'text/html');

    const styleElement = doc.createElement('style');
    styleElement.setAttribute('type', 'text/css');
    styleElement.append('pre { margin: 0; white-space: pre-wrap; }');
    doc.head.append(styleElement);
    doc.body.contentEditable = 'true';

    this.text = doc.documentElement.outerHTML;
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
