const routes = [
  {
    name: "交班报告记录",
    path: "/home/shift-reports",
    component: () => import("./index.vue")
  },
  {
    name: "护理交班",
    path: "/home/add-report",
    component: () => import("./add-report.vue")
  }
];
export default routes;
