import axios from "axios";
import qs from "qs";
import _ from "lodash";
import store from "../store";
import router from "../router";
import settings from "../settings";
import types from "../store/types";
import { handleError } from "./index";

const deps = {
  store, router, settings
};

let count = 0;

axios.interceptors.request.use(
  function (config) {
    if (count === 0) {
      deps.store.commit(types.SetLoadingStatus, {
        isLoading: true
      });
    }
    count++;
    return config;
  },
  function (error) {
    count = 0;
    deps.store.commit(types.SetLoadingStatus, {
      isLoading: false
    });
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    count--;
    if (count <= 0) {
      count = 0;
      deps.store.commit(types.SetLoadingStatus, {
        isLoading: false
      });
    }
    //处理未登录
    if (response.data.code === 401 && !response.config.ignoreCurrent) {
      deps.router.push({
        name: "PassportLogin",
        query: {
          redirect: window.location.href
        }
      });
    }
    return response;
  },
  function (error) {
    count = 0;
    deps.store.commit(types.SetLoadingStatus, {
      isLoading: false
    });
    return Promise.reject(error);
  }
);

function rejectHandle(reject, error, throwError) {
  if (throwError) {
    reject(error);
  } else {
    handleError(error, true);
  }
}

async function fetchCurrentUser() {
  let url = deps.settings.getServer("userServer") + "/user/current";
  let response;
  try {
    response = await axios.post(
      url,
      "withResources=true&group=carerui", {
        ignoreCurrent: true,
        withCredentials: true,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
  } catch (error) {
    console.info(error);
  }
  if (response && response.data && response.data.data) {
    deps.store.commit(types.SetCurrentUser, {
      user: response.data.data
    });
  }
}

async function fetch(serverName, path, params, dataType = "form", method = "POST", throwError = false, codeHandlers = null) {
  let url = deps.settings.getServer(serverName) + path;
  return new Promise((resolve, reject) => {
    let currentUser = deps.store.getters[types.GetCurrentUser];
    let sessionToken = "";
    if (currentUser) {
      sessionToken = currentUser.id;
    }
    let m = method || "POST";
    let options = {
      headers: {
        "authToken": sessionToken || ""
      },
      withCredentials: true,
      url: url,
      method: m
    };
    if (m.toUpperCase() === "GET") {
      options = _.merge(options, { params: params || {} });
    } else {
      if (typeof params === 'FormData') {
        options = _.merge(options, {
          data: params || {},
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else if (dataType === "form") {
        if (typeof params !== "string") {
          params = qs.stringify(params || {});
        }
        options = _.merge(options, {
          data: params,
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
      } else {
        options = _.merge(options, { data: params || {} });
      }
    }
    axios(options).then(
      response => {
        let data = response.data;
        let code = data.code;
        if (code === 200) {
          resolve(data);
        } else if (code === 401) {
          deps.router.push({
            name: "PassportLogin",
            query: { redirect: window.location.href }
          });
        } else {
          let handled = false;
          if (codeHandlers != null) {
            let handler = codeHandlers;
            if (typeof codeHandlers === 'object') {
              handler = codeHandlers[code];
            }
            if (typeof handler === "function") {
              handled = true;
              handler(data, code);
            }
          }
          if (!handled) {
            rejectHandle(reject, data, throwError);
          }
        }
      },
      error => {
        let message = "无法连接到服务器，请检查您的网络";
        if (error.response) {
          message += "[" + error.response.status + "]";
        }
        error.code = 500;
        error.message = message;
        error.data = null;
        rejectHandle(reject, error, throwError);
      }
    );
  });
}

const getCurrentUser = function () {
  let currentUser = deps.store.getters[types.GetCurrentUser];
  return currentUser;
}

const getCurrentMenus = function () {
  let currentUser = getCurrentUser();
  if (!currentUser) {
    return;
  }
  let menus = currentUser.menus;
  if (menus) {
    return menus;
  }
  currentUser.menus = menus = {};
  let resources = currentUser.resources;
  if (!resources || resources.length <= 0) {
    return;
  }
  let dict = {};
  resources.forEach(item => {
    dict[item.resourceId] = item;
    menus[item.resourceNo] = item;
  });
  resources.forEach(item => {
    if (item.parentId && dict[item.parentId]) {
      let parent = dict[item.parentId];
      if (!parent.children) {
        parent.children = [];
      }
      item.parent = parent;
      parent.children.push(item);
    }
  });
  return menus;
}

axios.getCurrentUser = getCurrentUser;
axios.fetchCurrentUser = fetchCurrentUser;
axios.getCurrentMenus = getCurrentMenus;
axios.fetch = fetch;

export default axios;