const user_routes = [
  {
    path: '/',
    component: () => import('pages/IndexPage.vue'),
    meta: {
      title: 'Dashboard - WGS',
    },
  },
  {
    path: '/mandatory',
    component: () => import('pages/user/MandatoryPage.vue'),
    meta: {
      title: 'Mandatory Leave - WGS',
    },
  },
  {
    path: '/optional',
    component: () => import('pages/user/OptionalPage.vue'),
    meta: {
      title: 'Optional Leave - WGS',
    },
  },
];

export default user_routes;
