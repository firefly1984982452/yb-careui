// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import https from "./utils/https";
import remConfig from "./config/rem-config"; // 配置rem
import moment from "moment";
import permission from "./utils/permission";
import tenant from "@/components/_tenant";

Vue.use(permission);

// 按需引入vant组件
import {
  Overlay,
  Loading,
  Empty,
  Field,
  SwipeCell,
  DropdownMenu,
  DropdownItem,
  Button,
  Toast,
  Collapse,
  CollapseItem,
  DatetimePicker,
  Popup,
  Swipe,
  SwipeItem,
  Dialog,
  Stepper,
  Calendar,
  Tab,
  Tabs,
  TreeSelect,
  Cell,
  Icon,
  Picker,
  Form,
  Lazyload,
  Grid,
  GridItem,
  Switch,
  RadioGroup,
  CheckboxGroup,
  Radio,
  NumberKeyboard,
  Image,
  Tag,
  Sidebar,
  SidebarItem,
  IndexBar,
  IndexAnchor,
  List,
  Search,
  Tabbar,
  TabbarItem,
  Progress,
  Divider,
  Checkbox,
  Circle,
  ActionSheet
} from "vant";
const Vants = {
  Overlay,
  Loading,
  Cell,
  Field,
  SwipeCell,
  DropdownMenu,
  DropdownItem,
  Button,
  Toast,
  Collapse,
  CollapseItem,
  DatetimePicker,
  Popup,
  Swipe,
  SwipeItem,
  Dialog,
  Stepper,
  Tab,
  Tabs,
  TreeSelect,
  Calendar,
  Icon,
  Picker,
  Form,
  Lazyload,
  Grid,
  GridItem,
  Switch,
  RadioGroup,
  CheckboxGroup,
  Radio,
  NumberKeyboard,
  Image,
  Tag,
  Sidebar,
  SidebarItem,
  IndexBar,
  IndexAnchor,
  List,
  Empty,
  Search,
  Tabbar,
  TabbarItem,
  Progress,
  Divider,
  Checkbox,
  Circle,
  ActionSheet
};

Object.values(Vants).forEach(item => Vue.use(item));

Vue.config.productionTip = false;
remConfig(); // 执行rem

// 引入bottom公用组件
import bottom from './components/bottom'; 
import menu from "./components/menu.vue"; 
import back from "./components/BackCom.vue"; 
Vue.component('bottom', bottom);
Vue.component("Menu", menu);
Vue.component("Back", back);

import nullMessage from './components/null-message'; 
Vue.component('nullMessage', nullMessage);

import constant from './utils/constant';
Vue.prototype.$constant = constant;

// 调试
// import Vconsole from 'vconsole'
// const vConsole = new Vconsole()
// export default vConsole

Vue.prototype.$moment = moment;
/* eslint-disable no-new */
(async () => {
  // 获取当前用户信息
  await https.fetchCurrentUser();
  // 初始化当前租户信息
  await tenant.initTenant();

  new Vue({
    el: "#app",
    router,
    store,
    components: { App },
    template: "<App/>"
  });
})();
