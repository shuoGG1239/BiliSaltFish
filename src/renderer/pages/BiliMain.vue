<template>
    <div>
        <webview class="main" src="http://bilibili.com"
                 useragent="Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko"
                 disablewebsecurity autosize="on"></webview>
    </div>
</template>

<script>
    export default {
        name: "BiliMain"
    }
</script>

<style lang="scss" scoped>
    .main {
        background-color: #25a4bb;
    }

</style>