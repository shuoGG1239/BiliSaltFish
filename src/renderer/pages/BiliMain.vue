<template>
    <div class="main">
        <div class="header">
            <div class="btn-control-group">
                <button :disabled="this.backStack.length === 0" class="btn-control" @click="handleBack">
                    <div class="iconfont">&#xe84f;</div>
                </button>
                <button :disabled="this.forwardStack.length === 0" class="btn-control" @click="handleForward">
                    <div class="iconfont">&#xe84e;</div>
                </button>
                <button class="btn-control" @click="handleReload">
                    <div class="iconfont">&#xe831;</div>
                </button>
                <button class="btn-control" @click="handleHome">
                    <div class="iconfont">&#xe88b;</div>

                </button>
            </div>
            <div class="btn-window-group">
                <button class="btn-window" @click="handleWindowConfig">
                    <div class="iconfont">&#xe818;</div>
                </button>
                <button class="btn-window" @click="handleWindowMinimize">
                    <div class="iconfont">&#xe828;</div>
                </button>
                <button class="btn-window" @click="handleWindowClose">
                    <div class="iconfont">&#xe82a;</div>
                </button>
            </div>
        </div>
        <webview ref="wb" class="wb" src="http://bilibili.com" 
        disablewebsecurity autosize allowpopups :preload="preload"></webview>
    </div>
</template>

<script>
    import Mousetrap from "mousetrap";

    export default {
        name: "BiliMain",
        data() {
            return {
                backStack: [],
                forwardStack: [],
                webview: null,
                preload: `file:${require('path').resolve(__static, './preload.js')}`
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
            handleReload() {
                this.webview.reload();
            },
            handleHome() {
                this.webview.loadURL('http://bilibili.com');
                this.backStack = [];
                this.forwardStack = [];
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
                let protocol = require("url").parse(e.url).protocol;
                if (protocol === "http:" || protocol === "https:") {
                    this.backStack.push(this.webview.src);
                    this.forwardStack = [];
                    this.webview.loadURL(e.url);
                }
            });
            Mousetrap.bind("ctrl+0", () => {
                this.webview.setZoomFactor(1.0);
            });
            Mousetrap.bind("ctrl+-", () => {
                this.webview.getZoomLevel((level)=> {
                    this.webview.setZoomLevel(level-1);
                })
            });
            Mousetrap.bind("ctrl+=", () => {
                this.webview.getZoomLevel((level)=> {
                    this.webview.setZoomLevel(level+1);
                })
            });
        }
    };
</script>

<style lang="scss" scoped>
    .main {
        height: 100%;
        padding: 0.05rem;
        display: flex;
        flex-direction: column;

        .header {
            height: 0.3rem;
            background-color: rgb(244, 90, 141);
            -webkit-app-region: drag;

            .btn-control-group {
                height: 0.3rem;
                display: inline-block;
                -webkit-app-region: no-drag;

                .btn-control {
                    font-size: 0.15rem;
                    height: 0.3rem;
                    line-height: 0.3rem;
                    width: 0.6rem;
                    color: white;
                    background-color: rgb(244, 90, 141);
                    border-radius: 0.05rem;
                    .iconfont {
                        font-size: .12rem;
                    }
                }

                .btn-control:hover {
                    background-color: rgb(251, 114, 153);
                }

                .btn-control:disabled {
                    background-color: rgb(244, 90, 141);
                }
            }
            .btn-window-group {
                height: 0.3rem;
                display: block;
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
                    .iconfont {
                        font-size: .12rem;
                    }
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
            flex: 1;
            border-radius: .1rem;
            margin-top: 0.08rem;
        }
    }
</style>