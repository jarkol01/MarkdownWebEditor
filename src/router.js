import { createRouter, createWebHistory } from 'vue-router'

import App from '@/HomePage.vue'
import ExamplePage from '@/ExamplePage.vue'

const routes = [
  { path: '/', component: App },
  { path: '/example', component: ExamplePage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
