<template>
  <div class="tips">
    <van-icon name="warning" size="0.8rem" color="#F56C6C" />
    <div>403 无权限访问！</div>
    <van-button class="button" :to="{name:'PassportLogout'}" plain type="primary">切换账号</van-button>
    <div class="user" v-if="currentUser">当前登录用户：{{ currentUser.displayName }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      currentUser: null
    }
  },
  created() {
    let user = axios.getCurrentUser();
    if(user && user.userId > 0) {
      this.currentUser = user;
    }
  }
}
</script>

<style lang="less" scoped>
.tips {
  padding-top: 0.2rem;
  text-align: center;
  font-size: 0.15rem;
  .button {
    width: 50%;
    margin-top: 0.5rem;
    background-color: transparent;
  }
  .user {
    font-size: 0.1rem;
    margin-top: 0.1rem;
    color: gray;
  }
}
</style>