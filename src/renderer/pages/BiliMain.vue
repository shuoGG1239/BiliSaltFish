<template>
    <div class="main">
        <webview class="main" src="http://baidu.com"
                 useragent="Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko" disablewebsecurity
                 autosize></webview>
    </div>
</template>

<script>
    export default {
        name: "BiliMain"
    }
</script>

<style lang="scss" scoped>
    .main {
        height: 100%;
    }
</style>