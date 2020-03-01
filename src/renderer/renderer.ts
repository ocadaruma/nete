import About from '@renderer/About.vue';
import ClipboardPanel from '@renderer/./ClipboardPanel.vue';
import Preference from '@renderer/Preference.vue';

import Buefy from 'buefy';
import Vue from 'vue';
import VueRouter from 'vue-router';

import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/regular';
import 'buefy/dist/buefy.css';
import '@/renderer/css/app.scss';

Vue.use(Buefy);
Vue.use(VueRouter);

const routes = [
  {
    path: '/about',
    component: About
  },
  {
    path: '/clipboard',
    component: ClipboardPanel,
  },
  {
    path: '/preference',
    component: Preference,
  },
];

const router = new VueRouter({
  routes,
});

new Vue({
  router
}).$mount('#app');
