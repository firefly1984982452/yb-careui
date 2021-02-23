const routes = [
  {
    name: "消费登记",
    path: "index",
    component: () => import("./index.vue")
  },
  {
    name: "添加消费",
    path: "purchase",
    component: () => import("./purchase.vue")
  },
  {
    name: "物品发放",
    path: "send-goods",
    component: () => import("./send-goods.vue")
  },
  {
    name: "代订代购",
    path: "order",
    component: () => import("./order.vue")
  },
  {
    path: "service",
    component: () => import("./service.vue"),
    name: "住养服务"
  }
];

export default routes;
