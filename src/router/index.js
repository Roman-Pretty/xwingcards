import { createRouter, createWebHistory } from 'vue-router'
import { usePilotStore } from '../stores/PilotStore'
import Landing from '../views/Landing.vue'
import CreatePilot from '../views/CreatePilot.vue'
import Dashboard from '../views/Dashboard.vue'
import Menu from '../views/Menu.vue'
import GroupOverview from '../views/GroupOverview.vue'
import PilotOverview from '../views/PilotOverview.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      const store = usePilotStore()
      if (store.pilots.length === 0) {
        next('/create-pilot')
      } else {
        next()
      }
    }
  },
  {
    path: '/create-pilot',
    name: 'CreatePilot',
    component: CreatePilot
  },
  {
    path: '/menu',
    name: 'Menu',
    component: Menu
  },
  {
    path: '/group-overview',
    name: 'GroupOverview',
    component: GroupOverview,
    beforeEnter: (to, from, next) => {
      const store = usePilotStore()
      if (store.pilots.length === 0) {
        next('/create-pilot')
      } else {
        next()
      }
    }
  },
  {
    path: '/pilot-overview',
    name: 'PilotOverview',
    component: PilotOverview,
    beforeEnter: (to, from, next) => {
      const store = usePilotStore()
      if (store.pilots.length === 0) {
        next('/create-pilot')
      } else {
        next()
      }
    }
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
