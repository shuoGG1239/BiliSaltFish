<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    import BiliMain from "@/pages/BiliMain";

    export default {
        name: "bilisaltfish",
        components: {
            BiliMain
        }
    };
</script>

<style lang="scss">
    #app {
        height: 100%;
        background-color: rgb(244, 90, 141);
        overflow: hidden;
    }
</style>
