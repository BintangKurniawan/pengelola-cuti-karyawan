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
    path: '/admin/positions',
    component: () => import('pages/admin/PositionPage.vue'),
    meta: {
      title: 'List of Position',
      protected: true,
    },
  },
  {
    path: '/admin/history/:id',
    component: () => import('pages/admin/HistoryPage.vue'),
    meta: {
      title: 'History',
      protected: true,
    },
  },
  {
    path: '/admin/detail/:id',
    component: () => import('pages/admin/DetailPage.vue'),
    meta: {
      title: 'Detail',
      protected: true,
    },
  },
  {
    path: '/admin/detail/:id/edit',
    component: () => import('pages/admin/EditPage.vue'),
    meta: {
      title: 'Edit',
      protected: true,
    },
  },
];

export default admin_routes;
