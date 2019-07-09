import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'BiliMain',
            component: require('@/pages/BiliMain').default
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})
