<template>
    <div class="main">
        <webview ref="wb" class="main" src="http://bilibili.com"
                 useragent="Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko" disablewebsecurity
                 autosize></webview>
    </div>
</template>

<script>
    import {webFrame} from 'electron'
    import Mousetrap from 'mousetrap'

    export default {
        name: "BiliMain",
        mounted() {
            const webview = this.$refs.wb;
            webview.addEventListener('new-window', function (e) {
                webview.loadURL(e.url);
            });
            Mousetrap.bind('ctrl+shift+k', () => {
                console.log('123');
                webFrame.setZoomFactor(2.0)
            });
        }
    }
</script>

<style lang="scss" scoped>
    .main {
        height: 100%;
    }
</style>