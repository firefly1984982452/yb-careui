const routes = [
  {
    path: "/orderly",
    component: () => import("./orderly-index.vue"),
    name: "HomeIndex",
    redirect: "/orderly/index",
    children: [
      {
        path: "index",
        //meta: { allow: "uban.carerui.carerhome" },
        component: () => import("./home/index.vue"),
        name: "护理员首页"
      },
      {
        path: "unnormal-task",
        //meta: { allow: "uban.carerui.carerhome" },
        component: () => import("./home/unnormal-task.vue"),
        name: "异常任务列表"
      },
      {
        name: "巡视记录",
        component: () => import("./home/check-records.vue"),
        path: "check-records"
      },
      {
        name: "交班",
        component: () => import("./elder/shift.vue"),
        path: "shift"
      },
      {
        path: "elder-index",
        component: () => import("./elder/index.vue"),
        name: "长者首页"
      },
      {
        name: "我的老人",
        component: () => import("./elder/index.vue"),
        path: "elders-index"
      },
      {
        path: "study-index",
        component: () => import("./study/index.vue"),
        name: "学习首页"
      },
      {
        path: "food-sum",
        component: () => import("./food/statics.vue"),
        name: "订餐汇总"
      },
      {
        path: "mine-index",
        component: () => import("./mine/index.vue"),
        name: "我的首页"
      }
    ]
  },
  {
    name: "扫码结果",
    // component: () => import("./home/turns.vue"),
    component: () => import("./home/scan-result.vue"),
    // path: "/orderly/turns"
    path: "/orderly/scan-result"
  },
  {
    name: "查询班次",
    component: () => import("./home/turns.vue"),
    // component: () => import("./home/scan-result.vue"),
    path: "/orderly/turns"
    // path: "/orderly/scan-result"
  },
  {
    name: "今日照护",
    // component: () => import("./home/turns.vue"),
    component: () => import("./elder/today-care.vue"),
    // path: "/orderly/turns"
    path: "/orderly/today-care"
  },
  {
    name: "查房巡视",
    component: () => import("./home/check-room.vue"),
    path: "/orderly/check-room"
    // path: "/orderly/scan-result"
  },
  {
    name: "查房巡视",
    component: () => import("./home/check-register.vue"),
    path: "/orderly/check-register"
  },
  {
    name: "巡视结束",
    component: () => import("./home/success.vue"),
    path: "/orderly/success"
  },
  {
    name: "已巡视老人",
    component: () => import("./elder/elders.vue"),
    path: "/orderly/elders"
  },
  {
    name: "老人项目",
    component: () => import("./elder/projects.vue"),
    path: "/orderly/projects"
  },
  {
    name: "护理记录",
    component: () => import("./elder/project-detail.vue"),
    path: "/orderly/project-detail"
  },
  {
    path: "/orderly/task",
    component: () => import("./elder/task.vue"),
    name: "今日任务"
  },
  {
    path: "/orderly/taskDetail",
    component: () => import("./elder/task-detail.vue"),
    name: "任务详情"
  },
  {
    path: "/orderly/taskElder",
    component: () => import("./elder/task-elder.vue"),
    name: "今日护理",
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/orderly/food-ordered",
    component: () => import("./food/index.vue"),
    name: "本周菜单"
  },
  {
    path: "/orderly/leave",
    component: () => import("./elder/leave.vue"),
    name: "长者请假登记"
  },
  {
    path: "/orderly/back-confirm",
    component: () => import("./elder/back-confirm.vue"),
    name: "长者请假管理"
  }
];
export default routes;
