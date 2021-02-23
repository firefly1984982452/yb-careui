<template>
  <div id="app">
    <router-view />
    <!--网络请求或其他耗时操作出现遮罩阻止其他操作-->
    <van-overlay class="wrapper" :show="$store.state.fxdata.isLoading">
      <van-loading />
    </van-overlay>
  </div>
</template>

<script>
import store from '@/store';
import types from '@/store/types';

export default {
  name: 'App',
  created() {
    store.commit(types.SetEntryUrl, {
      entryUrl: window.location.href
    });
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
#app {
  height: 100%;
  background-color: #f7f7f7;
}
</style>

<style lang="less">
@import "./assets/styles/image.less";
</style>
