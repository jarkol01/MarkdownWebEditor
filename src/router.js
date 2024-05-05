import { createRouter, createWebHistory } from 'vue-router'

import EditorPage from '@/EditorPage.vue'
import RegistrationPage from '@/RegistrationPage.vue'
import { getCurrentUser } from '@/firebase.js'

const routes = [
  {
    path: '/',
    redirect: '/editor'
  },
  {
    path: '/editor',
    component: EditorPage
  },
  {
    path: '/editor/:noteId',
    component: EditorPage
  },
  {
    path: '/register',
    component: RegistrationPage,
    meta: {
      requiresGuest: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const currentUser = await getCurrentUser() // Check if the user is authenticated

  if (requiresGuest && currentUser) {
    next('/') // If the user is authenticated and the route requires guest, redirect to '/'
  } else {
    next() // Otherwise, proceed to the route
  }
})

export default router
