import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import { setCssVar } from 'quasar';
import dotenv from 'dotenv';
dotenv.config;
console.log(process.env);
import { onMounted, onUnmounted } from 'vue';
import { share } from 'pinia-shared-state';
import { useConfigPortStore } from 'src/stores/configStore';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

// const isAuthenticated = () => {
//   const token = authStore().getAccessToken();
//   return !!token;
// };

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

  // const adminRoles = [1, 2];

  // FOR PROTECT ROUTE
  Router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('role');
    const color = localStorage.getItem('color');
    console.log(process.env.port);

    // const configStore = useConfigPortStore();

    // onMounted(() => {
    //   const { unshare } = share('port', configStore, { initialize: true });

    //   onUnmounted(() => {
    //     unshare();
    //   });
    // });
    // if(to.path !== '/login') {

    // }
    const permissions = JSON.parse(localStorage.getItem('permissions'));

    // const setPort = localStorage.setItem('port', 9000);
    if (color) {
      setCssVar('primary', color);
    }
    // if (!role && to.path != '/login') {
    //   next('/login');
    // } else if (role === '3' && to.path.includes('/admin')) {
    //   next('/forbidden');
    // } else if (role && to.path === '/login') {
    //   next('/');
    // } else if (role === '1' && to.path === '/') {
    //   next('/admin/dashboard');
    // } else {
    //   next();
    // }

    if (!role && to.path != '/login') {
      next('/login');
    } else if (role && to.path === '/login') {
      next('/');
    } else if (
      to.path === '/' &&
      (!permissions.includes('Get Leave History for Current User') ||
        !permissions.includes('View Special Leave History') ||
        !permissions.includes('View Optional Leave') ||
        !permissions.includes('View Mandatory Leave'))
    ) {
      next('/admin/dashboard');
    } else {
      next();
    }

    document.title = to.meta.title + ' - WGS';
  });
  return Router;
});
