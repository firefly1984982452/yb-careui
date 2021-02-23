import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import types from '../store/types'
import settings from '../settings'
import moduleRoutes from '../modules/routes'
import permission from '../utils/permission'
import { tenantView } from '../components/_tenant'
  
const routes = [
  ...moduleRoutes,
  { // 多租户入口页面
    path: "/tenant/:id",
    name: "tenant",
    meta: { allow: "*" },
    component: tenantView
  },
  { // 配置不存在的地址提示信息
    path: "*",
    redirect: to => {
      return {
        name: "404",
        query: {
          url: to.fullPath,
          from: window.location.href
        }
      };
    }
  }
]

const beforeEach = function (store, settings, to, from, next) {
  store.commit(types.SetLoadingStatus, {
    isLoading: true
  });
  if (to.matched && to.matched.length > 0) { //已匹配到路径了
    let allow = to.meta ? to.meta.allow : undefined;
    if (!allow && settings) {
      allow = settings.defaultAllow;
    }
    let currentUser = store.getters[types.GetCurrentUser];
    if (allow && allow !== "*") {
      if (!currentUser || currentUser.userId <= 0) { // 用户未登录，则跳转到登录页
        next({
          name: "PassportLogin",
          query: {
            redirect: window.location.href
          }
        });
        return;
      } else if (allow !== "?" && !permission.hasPermission(allow)) { // 判断是否有无访问
        // 无权限访问
        next({ name: "403" });
        return;
      }
    }
  }
  next();
};

const afterEach = function (store, settings, to) {
  store.commit(types.SetLoadingStatus, {
    isLoading: false
  });

  let t = to.meta ? to.meta.title : null;
  if (!t) {
    t = to.name;
  }
  let title = settings ? settings.title : null;
  if (t) {
    if (title) {
      t = t + " - " + title;
    }
  } else {
    t = title;
  }
  if (t) {
    window.document.title = t;
  }
};

Vue.use(Router)
const router = new Router({
  base: settings.basePath,
  mode: 'history',
  routes
})
router.beforeEach(function (to, from, next) {
  beforeEach(store, settings, to, from, next);
});
router.afterEach(function (to) {
  afterEach(store, settings, to);
});

export default router
