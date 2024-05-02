import { createRouter, createWebHistory } from 'vue-router'

import App from '@/HomePage.vue'
import ExamplePage from '@/ExamplePage.vue'
import EditorPage from '@/EditorPage.vue'

const routes = [
  { path: '/', component: App },
  { path: '/example', component: ExamplePage },
  { path: '/editor', component: EditorPage },
  { path: '/editor/:noteId', component: EditorPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
