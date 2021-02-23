<template>
  <!-- 巡视提交成功的页面 -->
  <div class="success">
    <div class="content">
      <img src="../../assets/img/success.png" alt="">
      <p>保存成功</p>
      <div class="btn">
        <van-button @click="checkRecord" round>查看记录</van-button>
        <van-button type="primary" @click="$router.go(-1)" round>返回({{time}})</van-button>
      </div>
    </div>
    <bottom></bottom>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "Success",
  data() {
    return {
      time: 5
    };
  },
  components: {},
  created() {
    this.setTime();
  },
  methods: {
    // 查看记录
    checkRecord() {},
    // 设置倒计时
    setTime() {
        const timer = setInterval(() => {
          this.time--;
          if (this.time == 0) {
            clearInterval(timer);
            this.$router.go(-1);
          }
        }, 1000);
    }
  }
};
</script>

<style lang="less" scoped>
.success {
  text-align: center;
  height: 100%;
  background-color: #fff;
  margin-bottom: 0.6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  .content {
      padding-top: 1.2rem;
    img {
      width: 0.48rem;
      height: 0.48rem;
      margin-bottom: 0.24rem;
    }
    p {
      font-size: 16px;
      color: #333333;
      font-weight: 600;
    }
    .btn {
      margin-top: 0.48rem;
      .van-button {
        width: 1.08rem;
        height: 0.42rem;
      }
      .van-button+.van-button {
          margin-left: 0.24rem;
      }
    }
  }
}
</style>
