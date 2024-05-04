import './assets/main.css'

import { createApp } from 'vue'
import router from '@/router.js'
import App from '@/App.vue'
import store from '@/store/index.js'

createApp(App)
  .use(router)
  .use(store)
  .mount('#app')
