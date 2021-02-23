const routes = [
  {
    path: "check-room",
    component: () => import("./index.vue"),
    name: "我的老人"
  },
  {
    path: "check-register",
    component: () => import("./check-register.vue"),
    name: "查房巡视"
  },
  {
    path: "record",
    component: () => import("./record.vue"),
    name: "巡视记录"
  },
  {
    path: "search",
    component: () => import("./search.vue"),
    name: "搜索"
  },
  {
    path: "success",
    component: () => import("./success.vue"),
    name: "提示"
  }
];

export default routes;
