import Vue from 'vue'
import Router from 'vue-router'
import rank from '../components/rank/rank.vue'
import singer from '../components/singer/singer.vue'
import search from '../components/search/search.vue'
import recommend from '../components/recommend/recommend.vue'
import singerDetail from '../components/singer-detail/singerDetail.vue'
import TopList from '../components/topList/topList.vue'
import desc from '../components/desc/desc.vue'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      redirect: './recommend'
    },
    {
      path: '/singer',
      component: singer,
      children: [
        {path: ':id', component: singerDetail}
      ]
    },
    {
      path: '/rank',
      component: rank,
      children: [
        {path: ':id', component: TopList}
      ]
    },
    {
      path: '/recommend',
      component: recommend,
      children: [
        {path: ':id', component: desc}
      ]
    },
    {
      path: '/search',
      component: search,
      children: [
        {path: ':id', component: singerDetail}
      ]
    }
  ]
})
