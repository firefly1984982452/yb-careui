<template>
  <div class="elder layout">
    <div class="content">
      <Elders :type="'l_elders'" :roomId="roomId" :roomName="roomName" :isShowActionSheet="true"></Elders>
    </div>
  </div>
</template>

<script>
import Elders from "@/components/test";
export default {
  data() {
    return {};
  },
  beforeRouteEnter(to, from, next) {
    console.log(from, "======");
    next((vm) => {
      // if (from.path == "/home/order-food") {
      vm.roomName = from.query.roomName ? from.query.roomName : null;
      vm.roomId = from.query.roomId ? from.query.roomId : null;
      // }
    });
  },
  mounted() {},
  components: { Elders },
  methods: {},
};
</script>
<style lang="less" scoped>
@deep: ~">>>";
@import "../../assets/styles/common.less";
.elder {
  height: calc(100% - 0.6rem);
  background-color: #fff;
  .content {
    top: 0;
    bottom: 0;
    // display: flex;
    overflow: auto;
  }
}
</style>
