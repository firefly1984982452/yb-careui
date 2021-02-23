import consoleRoutes from "./console/routes";
// import careRoutes from './care/routes'
// 首页
import homeRoutes from "./home/routes";
// 老人模块
import elderRoutes from "./elder/routes";
// 我的 模块
import mineRoutes from "./mine/routes";
// 住养服务功能
import careRoutes from "./care/routes";
// 巡视查房
import checkRoomRoutes from "./checkRoom/routes";
// 护理班长交班
import shiftRoutes from "./shift/routes";
// 护理员查房巡视路由
import orderlyRoutes from "./nurser/routes";
// 护理班长点餐
import foodRoutes from "./food/routes";
const routes = [
  {
    // 配置默认首页
    path: "/",
    redirect: "/home"
  },
  // 这里添加子模块的路由
  // ...careRoutes,
  ...consoleRoutes,
  {
    name: "首页",
    path: "/home",
    redirect: "/home/select",
    component: () => import("./homeIndex.vue"),
    children: [
      ...homeRoutes,
      ...elderRoutes,
      ...mineRoutes,
      ...careRoutes,
      ...checkRoomRoutes,
      ...foodRoutes
    ]
  },
  ...shiftRoutes,
  ...orderlyRoutes,
  {
    path: "/iot/iotPlatformFire",
    component: () => import("./iot/iotPlatformFire"),
    name: "智慧消防"
  }
];

export default routes;
