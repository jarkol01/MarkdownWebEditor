import './assets/css/main.css'

import { createApp } from 'vue'
import router from '@/router.js'
import App from '@/App.vue'
import store from '@/store/index.js'

createApp(App)
  .use(router)
  .use(store)
  .mount('#app')


// Register service worker for PWA support
window.onload = () => {
  'use strict'
  if ('serviceWorker' in navigator) {
    navigator
      .serviceWorker
      .register('../service-worker.js')
      .then(() => console.log('Service worker registered'))
  }
}
