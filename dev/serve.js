import Vue from 'vue';
import VueRouter from 'vue-router'
import Dev from './serve.vue';

import Installation from './components/Installation.vue'
import BasicUsage from './components/BasicUsage.vue'
import Props from './components/Props.vue'
import Events from './components/Events.vue'
import Styling from './components/Styling.vue'

Vue.config.productionTip = false;
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
      path: '/',
      name: 'Installation',
      component: Installation
    },
    {
      path: '/basic-usage',
      name: 'BasicUsage',
      component: BasicUsage
    },
    {
      path: '/props',
      name: 'Props',
      component: Props
    },
    {
      path: '/events',
      name: 'Events',
      component: Events
    },
    {
      path: '/styling',
      name: 'Styling',
      component: Styling
    }
  ]
})

new Vue({
  router,
  render: (h) => h(Dev),
}).$mount('#app');