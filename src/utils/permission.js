import axios from 'axios'

const hasPermission = function (resourceNo, permissionValue) {
  let currentUser = axios.getCurrentUser();
  if (!currentUser || !currentUser.userId) {
    return false;
  }
  if (!resourceNo) {
    return false;
  }
  let resources = currentUser.resources;
  if (!resources || resources.length <= 0) {
    return false;
  }
  let resourceDictionary = currentUser.resourceDictionary;
  if (!resourceDictionary) {
    currentUser.resourceDictionary = resourceDictionary = {};
    resources.forEach(item => {
      let no = item.resourceNo;
      let items = resourceDictionary[no];
      if (!items) {
        resourceDictionary[no] = items = [];
      }
      items.push(item);
    });
  }
  let items = resourceDictionary[resourceNo];
  if (!items || items.length <= 0) {
    return false;
  }
  if (!permissionValue) {
    return true;
  }
  let has = items.some(item => {
    return item.permissionValue === permissionValue;
  });
  return has;
}

const install = function (Vue, options) {
  Vue.directive('permission', {
    bind: function (el, binding) {
      var allow = hasPermission(binding.value, binding.arg);
      if (!allow) {
        el.style.display = 'none';
      }
    }
  });
}

export default {
  install,
  hasPermission
}