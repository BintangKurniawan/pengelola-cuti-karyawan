// FOR USER PAGE ROUTE

const user_routes = [
  {
    path: '/',
    component: () => import('pages/IndexPage.vue'),
    meta: {
      title: 'Dashboard',
      protected: true,
    },
  },
  {
    path: '/mandatory',
    component: () => import('pages/user/MandatoryPage.vue'),
    meta: {
      title: 'Mandatory Leave',
      protected: true,
    },
  },
  {
    path: '/optional',
    component: () => import('pages/user/OptionalPage.vue'),
    meta: {
      title: 'Optional Leave',
      protected: true,
    },
  },
  {
    path: '/special',
    component: () => import('pages/user/SpecialPage.vue'),
    meta: {
      title: 'Special Leave',
      protected: true,
    },
  },
];

export default user_routes;
