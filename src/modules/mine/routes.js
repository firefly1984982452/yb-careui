const routes = [
  {
    path: "setting",
    // component: () => import("./index.vue"),
    component: () => import("./setting.vue"),
    name: "智慧护理工作台"
  },
  // {
  //   path: "setting",
  //   component: () => import("./setting.vue"),
  //   name: "智慧护理工作台"
  // },
  {
    path: "team",
    component: () => import("./team.vue"),
    name: "我的团队"
  },
  {
    path: "manage-members",
    component: () => import("./manage-members.vue"),
    name: "我的团队"
  },
  {
    path: "set-room",
    component: () => import("./manage-rooms.vue"),
    name: "我的团队"
  },
  {
    path: "set-elder",
    component: () => import("./manage-elders.vue"),
    name: "我的团队"
  }
];

export default routes;
