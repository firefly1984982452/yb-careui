const routes = [
  {
    path: "food-sum",
    component: () => import("../nurser/food/statics.vue"),
    name: "订餐汇总"
  },
  {
    path: "food",
    component: () => import("./index.vue"),
    name: "我的老人"
  },
  {
    path: "order-food",
    component: () => import("./order-food.vue"),
    name: "点餐"
  }
];

export default routes;
