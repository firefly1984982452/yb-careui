// 多租户
import axios from '@/utils/https';
import settings from '../settings';

const appNo = settings.appNo;
const tenantAliasName = "ubanTenantAlias";

// 获取当前登录用户所属的机构信息（用户必须登录）
function fetchCurrentTenantFromServer() {
  return axios.fetch('commonServer', '/tenant/current', { withSettings: true, itemGroup: appNo });
}

// 通过url、别名等获取当前访问的机构信息（匿名）
function fetchTenantFromServer() {
  let tenantAlias = localStorage.getItem(tenantAliasName);
  return axios.fetch('commonServer', '/tenant/getTenant', {
    url: window.location.href,
    tenantAlias,
    withSettings: true,
    itemGroup: appNo
  });
}

function fetchedTenant(tenant) {
  if (tenant) {
    localStorage.setItem(tenantAliasName, tenant.tenantId);
  }
}

export function updateFavicon(tenant) {
  let url = getTenantSettingValue('logo_favicon', tenant);
  if (!url) {
    return;
  }
  let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = url;
  document.getElementsByTagName('head')[0].appendChild(link);
}

/**
 * 异步获取当前租户信息
 */
export async function fetchCurrentTenant(reload) {
  return new Promise(resolve => {
    let currentUser = axios.getCurrentUser();
    if (currentUser == null) {
      resolve(null);
      return;
    }
    let currentTenant = currentUser.currentTenant;
    if (currentTenant != null) {
      if (reload) {
        currentTenant = null;
      } else if (currentUser.userId > 0) {
        if (currentTenant.tenantId != currentUser.customerId) {
          currentTenant = null;
        }
      }
    }
    if (currentTenant != null) {
      fetchedTenant(currentTenant);
      resolve(currentTenant);
    } else if(currentUser.userId > 0) {
      fetchCurrentTenantFromServer().then(res => {
        currentTenant = currentUser.currentTenant = res.data;
        if (currentTenant) {
          fetchedTenant(currentTenant);
        }
        resolve(currentTenant);
      });
    } else {
      fetchTenantFromServer().then(res => {
        currentTenant = currentUser.currentTenant = res.data;
        if (currentTenant) {
          fetchedTenant(currentTenant);
        }
        resolve(currentTenant);
      });
    }
  });
}

export function getTenantSetting(name, tenant) {
  if (!tenant) {
    return null;
  }
  let settings = tenant.settings;
  if (!settings || settings.length <= 0) {
    return null;
  }
  let st = settings.find(item => item.itemName == name);
  return st;
}

export function getTenantSettingValue(name, tenant, defaultValue) {
  let setting = getTenantSetting(name, tenant);
  return setting ? setting.itemValue : defaultValue;
}

// 通过url或者_tenant参数来初始化当前访问的机构，提供给应用启动时调用
export async function initTenant (vue) {
  let tenantId;
  let currentUser = axios.getCurrentUser();
  if (currentUser == null || currentUser.userId <= 0) {
    //未登录
    tenantId = vue ? vue.$route.query["_tenant"] : null;
    if (!tenantId) {
      tenantId = getQueryVariable("_tenant")
    }
  } else { //已登录
    tenantId = currentUser.customerId;
  }
  if (tenantId) {
    // 放到本地存储中
    localStorage.setItem(tenantAliasName, tenantId);
  }
  return fetchCurrentTenant();
}

function getQueryVariable(variable) {
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return null;
}

export const tenantView = {
  template: '<center>载入中 ...</center>',
  async created () {
    let tenantId;
    let currentUser = axios.getCurrentUser();
    if (currentUser == null || currentUser.userId <= 0) {
      //未登录
      tenantId = this.$route.params.id;
    } else { //已登录
      tenantId = currentUser.customerId;
    }
    if (tenantId) {
      // 放到本地存储中
      localStorage.setItem(tenantAliasName, tenantId);
    }
    if (currentUser != null && currentUser.currentTenant != null && currentUser.currentTenant.tenantId != tenantId) {
      await fetchCurrentTenant(true);
      // 跳转回指定页
      this.goBack();
    } else {
        // 跳转回指定页
        this.goBack();
    }
  },
  methods: {
    goBack () {
      let redirect = this.$route.query.redirect;
      if (!redirect) {
        redirect = "/";
      }
      redirect = this.$router.resolve(redirect).href;
      window.location.replace(redirect);
    }
  }
}

export default {
  initTenant,
  fetchCurrentTenant,
  getTenantSetting,
  getTenantSettingValue,
  updateFavicon
}