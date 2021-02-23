<template>
  <div class="tips">
    <van-icon :name="messageType" size="0.8rem" :color="messageColor" />
    <div>{{ message }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messageType: 'warning',
      messageColor: '#F56C6C',
      message: '有错误发生'
    }
  },
  created() {
    let params = this.$route.params;
    if(Object.keys(params).length === 0) { // 无参数，则从存储中获取
      let ps = sessionStorage.getItem('ui-message-temp');
      if(ps) {
        let params1 = JSON.parse(ps);
        if(params1) {
          params = params1;
        }
      }
    }
    let success = params.success;
    if(success) {
      this.messageType = "checked";
      this.messageColor = "#67C23A";
      this.message = "操作成功";
    }
    let msg = params.message;
    if(msg) {
      this.message = msg;
    }
    // 保存下，以防刷新
    sessionStorage.setItem('ui-message-temp', JSON.stringify(params));
  }
}
</script>

<style lang="less" scoped>
.tips {
  padding-top: 0.2rem;
  text-align: center;
  font-size: 0.15rem;
}
</style>