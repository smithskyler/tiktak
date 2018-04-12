import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import Games from '@/components/Games'
import Play from '@/components/Play'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing
    },
    {
      path: '/games',
      name: 'Games',
      component: Games
    },
    {
      path: '/play/:gameID',
      name: 'Play',
      component: Play
    },
  ]
})
