<template>
  <van-grid v-bind="$attrs" :gutter="10" :column-num="4" :border="false">
    <van-grid-item v-for="item in menuList" :key="item.resourceId" @click="itemClick(item)">
      <div slot="icon" :class="item.icon"></div>
      <div slot="text" class="text">{{ item.title }}</div>
    </van-grid-item>
  </van-grid>
</template>

<script>
import axios from 'axios';
import _ from 'lodash';

export default {
  name: "ubMenuCtrl",
  props: {
    resourceNo: {
      type: String,
      default: 'uban.carerui'
    },
    exclude: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      menuList: []
    }
  },
  created() {
    this.updateList(this.resourceNo);
  },
  methods: {
    updateList(resNo) {
      let menus = axios.getCurrentMenus();
      if(menus) {
        let current = menus[resNo];
        if(current && current.children && current.children.length) {
          let list = current.children;
          if(this.exclude && this.exclude.length) {
            list = _.differenceWith(list, this.exclude, (item, value) => item.resourceNo == value);
          }
          _.remove(list, item => {
            return !item.viewable;
          });
          this.menuList = list;
        }
      }
    },
    itemClick(item) {
      let url = item.url;
      if(!url) {
        this.$toast("功能暂未开放");
        return;
      }
      this.$router.push(url);
    }
  }
}
</script>

<style scoped>
.text {
  font-size: 0.12rem;
  color: #000;
}
</style>