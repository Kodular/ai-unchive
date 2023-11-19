import { createApp } from 'vue'
import PrimeVue from 'primevue/config';

import App from './App.vue'

import 'primevue/resources/themes/mdc-dark-deeppurple/theme.css';

declare global {
  const Blockly: any
  const BlocklyWorkspace: any
}

// import { Colors, Chart } from 'chart.js';

// Chart.register(Colors);

let v = createApp(App)
v.use(PrimeVue)
v.mount('#app')
