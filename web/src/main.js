import { createApp } from 'vue'
import { createPinia } from 'pinia'
import InstantSearch from 'vue-instantsearch/vue3/es'

import App from './App.vue'
import router from './router'

import './assets/main.scss'

const app = createApp(App)

app.use(InstantSearch)

app.use(createPinia())
app.use(router)

app.mount('#app')
