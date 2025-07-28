import { createRouter, createWebHistory } from 'vue-router'
import { usePilotStore } from '../stores/pilotStore'
import CreatePilot from '../views/CreatePilot.vue'
import Dashboard from '../views/Dashboard.vue'

const routes = [
  {
    path: '/',
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
