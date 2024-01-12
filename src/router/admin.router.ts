const admin_routes = [
  {
    path: '/admin/dashboard',
    component: () => import('pages/admin/DashboardPage.vue'),
    meta: {
      title: 'Dashboard - WGS',
    },
  },
  {
    path: '/admin/list',
    component: () => import('pages/admin/ListPage.vue'),
    meta: {
      title: 'List of Leave - WGS',
    },
  },
  {
    path: '/admin/history',
    component: () => import('pages/admin/HistoryPage.vue'),
    meta: {
      title: 'History - WGS',
    },
  },
  {
    path: '/admin/detail',
    component: () => import('pages/admin/DetailPage.vue'),
    meta: {
      title: 'Detail - WGS',
    },
  },
  {
    path: '/admin/detail/edit',
    component: () => import('pages/admin/EditPage.vue'),
    meta: {
      title: 'Edit - WGS',
    },
  },
];

export default admin_routes;
