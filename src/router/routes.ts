import { RouteRecordRaw } from 'vue-router';
import admin_routes from './admin.router';
import user_routes from './user.router';
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/UserLayout.vue'),
    children: user_routes,
  },

  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: admin_routes,
  },
  {
    path: '/login',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/blank/LoginPage.vue'),
        meta: {
          title: 'Login',
          protected: true,
        },
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
  {
    path: '/forbidden',
    component: () => import('pages/ForbiddenPage.vue'),
  },
];

export default routes;
