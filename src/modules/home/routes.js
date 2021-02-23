const routes = [
  {
    path: "select",
    component: () => import("./select.vue"),
    name: "智慧护理"
  },
  {
    path: "home",
    meta: { allow: "uban.carerui.home" },
    component: () => import("./home.vue"),
    name: "智慧护理工作台"
  },
  {
    path: "visit",
    component: () => import("./visit.vue"),
    name: "预约探视"
  },
  {
    path: "disposition",
    component: () => import("./disposition.vue"),
    name: "离院确认"
  },
  {
    path: "leave",
    component: () => import("./leave.vue"),
    name: "请假登记"
  }, {
    path: "menulist",
    name: "菜单列表",
    component: () => import("./menulist.vue")
  }, {
    path: "leave-manage",
    name: "请假管理",
    component: () => import("./leave-manage.vue")
  },
];

export default routes;
