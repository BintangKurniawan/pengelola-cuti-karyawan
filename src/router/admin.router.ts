const admin_routes = [
  {
    path: '/admin/dashboard',
    component: () => import('pages/admin/DashboardPage.vue'),
    meta: {
      title: 'Dashboard',
      protected: true,
    },
  },
  {
    path: '/admin/list',
    component: () => import('pages/admin/ListPage.vue'),
    meta: {
      title: 'List of Leave',
      protected: true,
    },
  },
  {
    path: '/admin/history',
    component: () => import('pages/admin/HistoryPage.vue'),
    meta: {
      title: 'History',
      protected: true,
    },
  },
  {
    path: '/admin/detail',
    component: () => import('pages/admin/DetailPage.vue'),
    meta: {
      title: 'Detail',
      protected: true,
    },
  },
  {
    path: '/admin/detail/edit',
    component: () => import('pages/admin/EditPage.vue'),
    meta: {
      title: 'Edit',
      protected: true,
    },
  },
];

export default admin_routes;
