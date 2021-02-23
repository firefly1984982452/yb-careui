<template>
  <div class="page">
    <div class="menu">
      <ub-menu-ctrl ref="menu" :resourceNo="resourceNo"></ub-menu-ctrl>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ubMenuCtrl from '@/components/menuctrl';

export default {
  components: { ubMenuCtrl },
  data() {
    return {
      resourceNo: null
    }
  },
  created() {
    this.updateMenu();
  },
  beforeRouteUpdate (to, from, next) {
    next();
    this.updateMenu();
    this.$refs['menu'].updateList(this.resourceNo);
  },
  methods: {
    updateMenu() {
      let p = this.$route.query.p;
      if(!p) {
        p = "uban.carerui";
      }
      this.resourceNo = p;
      let menus = axios.getCurrentMenus();
      if(menus) {
        let item = menus[p];
        if(item) {
          window.document.title = item.title;
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: #fff;
  .menu {
    padding: 0.2rem 0;
    img {
      width: 0.4rem;
      height: 0.4rem;
    }
  }
}
</style>