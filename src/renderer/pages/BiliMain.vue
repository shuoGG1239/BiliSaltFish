<template>
    <div class="main">
        <div class="header">
            <div class="btn-history-group">
                <button :disabled="this.backStack.length === 0" class="btn-history" @click="handleBack"><</button>
                <button :disabled="this.forwardStack.length === 0" class="btn-history" @click="handleForward">></button>
            </div>
            <div class="btn-window-group">
                <button class="btn-window" @click="handleWindowConfig">+</button>
                <button class="btn-window" @click="handleWindowMinimize">-</button>
                <button class="btn-window" @click="handleWindowClose">×</button>
            </div>
        </div>
        <webview ref="wb" class="wb" src="http://bilibili.com" disablewebsecurity autosize allowpopups :preload="preload"></webview>
    </div>
</template>

<script>
    import {webFrame} from "electron";
    import Mousetrap from "mousetrap";

    export default {
        name: "BiliMain",
        data() {
            return {
                backStack: [],
                forwardStack: [],
                webview: null,
                preload: `file:${require('path').resolve(__dirname, './preload.js')}`
            };
        },
        methods: {
            handleBack() {
                if (this.backStack.length === 0) return;
                let url = this.backStack.pop();
                this.forwardStack.push(this.webview.src);
                this.webview.loadURL(url);
            },
            handleForward() {
                if (this.forwardStack.length === 0) return;
                let url = this.forwardStack.pop();
                this.backStack.push(this.webview.src);
                this.webview.loadURL(url);
            },
            handleWindowClose() {
                require('electron').ipcRenderer.send('window-close')
            },
            handleWindowMinimize() {
                require('electron').ipcRenderer.send('window-min')
            },
            handleWindowConfig() {
            },
        },
        mounted() {
            this.webview = this.$refs.wb;
            this.webview.addEventListener("new-window", e => {
                var protocol = require("url").parse(e.url).protocol;
                if (protocol === "http:" || protocol === "https:") {
                    this.backStack.push(this.webview.src);
                    this.forwardStack = [];
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
            background-color: rgb(244, 90, 141);
            -webkit-app-region: drag;

            .btn-history-group {
                height: 0.3rem;
                display: inline-block;
                -webkit-app-region: no-drag;

                .btn-history {
                    font-size: 0.15rem;
                    height: 0.3rem;
                    line-height: 0.3rem;
                    width: 0.6rem;
                    color: white;
                    background-color: rgb(244, 90, 141);
                    border-radius: 0.05rem;
                }

                .btn-history:hover {
                    background-color: rgb(251, 114, 153);
                }

                .btn-history:disabled {
                    background-color: rgb(244, 90, 141);
                }
            }
            .btn-window-group {
                height: 0.3rem;
                display: inline-block;
                float: right;
                -webkit-app-region: no-drag;

                .btn-window {
                    font-size: 0.2rem;
                    height: 0.3rem;
                    line-height: 0.3rem;
                    width: 0.3rem;
                    color: white;
                    background-color: rgb(244, 90, 141);
                    border-radius: 0.05rem;
                }

                .btn-window:hover {
                    background-color: rgb(251, 114, 153);
                }

                .btn-window:disabled {
                    background-color: rgb(244, 90, 141);
                }
            }
        }

        .wb {
            height: 100%;
            border-radius: .1rem;
            margin-top: 0.08rem;
            ::-webkit-scrollbar {
                width: 0.15rem;
                height: 0.15rem;
            }

            ::-webkit-scrollbar-thumb {
                background-color: #3EB94E;
                border-radius: 0.15rem;
            }

            ::-webkit-scrollbar-thumb:hover {
                background-color: #8fb989;
            }

            ::-webkit-scrollbar-track {
                background-color: transparent;
                border-radius: 0.15rem;
            }

            ::-webkit-scrollbar-button {
                height: 0.05rem;
                width: 0.05rem;
                border-radius: 0.07rem;
            }
        }
    }
</style>