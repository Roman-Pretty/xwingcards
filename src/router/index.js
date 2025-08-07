import { createRouter, createWebHistory } from 'vue-router'
import { usePilotStore } from '../stores/PilotStore'
import Landing from '../views/Landing.vue'
import CreatePilot from '../views/CreatePilot.vue'
import Dashboard from '../views/Dashboard.vue'
import Settings from '../views/Settings.vue'

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
    path: '/settings',
    name: 'Settings',
    component: Settings
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
