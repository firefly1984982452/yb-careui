const routes = [
  {
    name: "PassportLogin",
    path: "/console/login",
    meta: { title: "登录", allow: "*" },
    component: () => import("./login.vue")
  }, {
    path: "/console/403",
    name: "403",
    meta: { allow: "*" },
    component: () => import("./403.vue")
  }, {
    path: "/console/404",
    name: "404",
    meta: { allow: "*" },
    component: () => import("./404.vue")
  }, {
    path: "/console/message",
    name: "Message",
    meta: { allow: "*" },
    component: () => import("./message.vue")
  }, {
    path: "/console/logout",
    name: "PassportLogout",
    meta: { allow: "*" },
    component: () => import("./logout.vue")
  }
]

export default routes;
