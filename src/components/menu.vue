<template>
  <div class="menu">
    <span class="icon-menu"><img src="../assets/img/menu.png"></span>
    <van-popup v-model="show" round position="bottom">
      <ub-menu-ctrl></ub-menu-ctrl>
      <van-button block @click="logout">退出登录</van-button>
    </van-popup>
  </div>
</template>

<script>
import ubMenuCtrl from './menuctrl';

export default {
  components: { ubMenuCtrl },
  name: "NavMenu",
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  methods: {
    // 登出
    logout() {
      this.$router.push({name:'PassportLogout'});
    },
  }
};
</script>

<style lang="less" scoped>
.menu {
  z-index: 999;
  position: relative;
  // 右上角菜单
  .icon-menu {
    img {
      display: block;
      width: 0.19rem;
      height: 0.19rem;
    }
  }
  .nav-menu {
    color: #fff;
    width: 80%;
    z-index: 99;
    position: absolute;
    right: 0.08rem;
    top: 0.3rem;
    text-align: center;
    background-color: #666666;
    font-size: 0.14rem;
    // border: 1px solid rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    // box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.3), 0px 0px 20px #fff inset;
    width: 1.2rem;
    padding: 0 0.05rem;
    li {
      line-height: 0.36rem;
      // border-bottom: 1px solid rgba(0, 0, 0, 0.25);
    }
  }
  /deep/ .van-grid {
    background-color: #f8f8f8;
    .van-grid-item {
      margin: 14px 0;
    }
    .van-grid-item__content {
      background-color: #f8f8f8;
      padding: 0;
      img {
        width: 0.4rem;
        height: 0.4rem;
      }
    }
  }
  /deep/ .van-popup {
    padding-top: 0.12rem;
    > p {
      font-size: 0.12rem;
      color: rgba(0, 0, 0, 0.25);
      line-height: 0.32rem;
      text-align: center;
      margin: 0 0 0.12rem 0;
    }
    background-color: #f8f8f8;
  }
  /deep/ .van-button {
    margin-top: 0.12rem;
    height: 0.56rem;
    // color: red;
  }
}
</style>
