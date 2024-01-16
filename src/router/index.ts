import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import { authStore } from 'src/stores/auth';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

const isAuthenticated = () => {
  const token = authStore().getAccessToken();
  return !!token;
};
const role = localStorage.getItem('role');

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // Router.beforeEach((to, from, next) => {
  //   if (to.meta.protected && !isAuthenticated()) {
  //     next('/login');
  //   } else if (to.path === '/login' && isAuthenticated()) {
  //     next('/');
  //   } else {
  //     next();
  //   }

  //   document.title = (to.meta.title || 'WGS') + '- WGS';
  // });

  // Router.beforeEach((to, from, next) => {
  //   if (!role && to.path != '/login') {
  //     next('/login');
  //   } else {
  //     next();
  //   }

  //   document.title = to.meta.title + ' - WGS';
  // });

  const adminRoles = [1, 2];

  Router.beforeEach((to, from, next) => {
    if (!role && to.path != '/login') {
      next('/login');
    } else if (role === '3' && to.path.includes('/admin')) {
      next('/forbidden');
    } else {
      next();
    }

    document.title = to.meta.title + ' - WGS';
  });
  return Router;
});
