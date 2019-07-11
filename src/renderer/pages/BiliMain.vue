<template>
  <div class="main">
    <div class="header">
      <div class="btn-history-group">
        <button :disabled="this.backStack.length === 0" class="btn-history" @click="handleBack"><</button>
        <button :disabled="this.forwardStack.length === 0" class="btn-history" @click="handleForward">></button>
      </div>
    </div>
    <webview ref="wb" class="wb" src="http://bilibili.com" disablewebsecurity autosize allowpopups></webview>
  </div>
</template>

<script>
import { webFrame } from "electron";
import Mousetrap from "mousetrap";

export default {
  name: "BiliMain",
  data() {
    return {
      backStack: [],
      forwardStack: [],
      webview: null
    };
  },
  methods: {
    handleBack() {
        console.log(123)
      if (this.backStack.length === 0) return;
      let url = this.backStack.pop();
      this.forwardStack.push(url);
      this.webview.loadURL(url);
    },
    handleForward() {
      if (this.forwardStack.length === 0) return;
      let url = this.forwardStack.pop();
      this.backStack.push(url);
      this.webview.loadURL(url);
    }
  },
  mounted() {
    this.webview = this.$refs.wb;
    this.webview.addEventListener("new-window", e => {
      var protocol = require("url").parse(e.url).protocol;
      if (protocol === "http:" || protocol === "https:") {
        this.backStack.push(this.webview.src);
        this.webview.loadURL(e.url);
      }
    });
    Mousetrap.bind("ctrl+shift+k", () => {
      this.webFrame.setZoomFactor(2.0);
    });
  }
};
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  padding: 0.05rem;
  .header {
    height: 0.3rem;
    background-color: rgb(255, 118, 182);
    .btn-history-group {
      height: 0.3rem;
      display: inline-block;
      .btn-history {
        font-size: 0.15rem;
        height: 0.3rem;
        line-height: 0.3rem;
        width: 0.6rem;
        color: white;
        background-color: rgb(255, 118, 182);
        border-radius: 0.05rem;
      }
      .btn-history:hover {
        background-color: rgb(253, 95, 169);
      }
      .btn-history:disabled {
        background-color: rgb(255, 118, 182);
      }
    }
  }
  .wb {
    height: 100%;
    border-radius: 0.1rem;
    margin-top: 0.08rem;
  }
}
</style>