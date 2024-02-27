// FOR ADMIN PAGE ROUTE
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
    path: '/admin/list-leave',
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
    path: '/admin/special-leave',
    component: () => import('pages/admin/SpecialLeavePage.vue'),
    meta: {
      title: 'Special Leave',
      protected: true,
    },
  },
  {
    path: '/admin/role',
    component: () => import('pages/admin/RolePage.vue'),
    meta: {
      title: 'Role',
      protected: true,
    },
  },
  {
    path: '/admin/email',
    component: () => import('pages/admin/EmailPage.vue'),
    meta: {
      title: 'Email',
      protected: true,
    },
  },
  {
    path: '/admin/settings',
    component: () => import('pages/admin/SettingPage.vue'),
    meta: {
      title: 'Setting',
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
