<template>
  <div class="check-room layout">
    <Back></Back>
    <div class="top">
      <van-search class="left" @focus="handleFocus" v-model="value" shape="round" placeholder="请输入老人姓名/房间号" />
      <div class="right" @click="$router.push({
        path:'record',
        query:{
          sign:'护理班长'
        }
      })">
        <!-- <img src="../../assets/img/records.png" alt=""> -->
        巡视记录
      </div>
    </div>
    <div class="content">
      <Elders :type="'l_records'"></Elders>
    </div>
  </div>
</template>

<script type="text/javascript">
import Elders from "@/components/test";
export default {
  name: "CheckRoom",
  data() {
    return {};
  },
  created() {},
  components: { Elders },
  methods: {
    handleFocus() {
      this.$router.push("search");
    },
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
@import "../../assets/styles/common.less";
.check-room {
  height: 100%;
  background-color: #fff;
  .top {
    .right {
      padding-top: 0;
      display: flex;
      align-items: center;
      width: 0.6rem;
      color: #69CA8D;
      // img {
      //   width: 0.2rem;
      //   height: 0.2rem;
      // }
    }
  }
  a {
    text-decoration: none;
  }
  .content {
    // top: 0.48rem;
    top: 1.04rem;
    bottom: 0;
    display: flex;
    overflow: auto;
  }
}
</style>
