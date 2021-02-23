<template>
  <!-- 护理班长->住养服务->营养膳食界面 -->
  <div class="elder layout">
    <Back></Back>
    <div class="content">
      <Elders :type="'l_food'" :roomId="roomId" :roomName="roomName" :showFoodOrderRemark="true"></Elders>
    </div>
  </div>
</template>

<script>
import Elders from "@/components/test";
export default {
  data() {
    return {
      roomName: "",
    };
  },
  mounted() { },
  beforeRouteEnter(to, from, next) {
    console.log(from, "======");
    next((vm) => {
      if (from.path == "/home/order-food") {
        vm.roomName = from.query.roomName;
        vm.roomId = from.query.roomId;
      }
    });
  },
  components: { Elders },
  methods: {},
};
</script>
<style lang="less" scoped>
@deep: ~">>>";
@import "../../assets/styles/common.less";
.elder {
  height: 100%;
  background-color: #fff;
  .content {
    // top: 0;
    top: 0.56rem;
    bottom: 0;
    // display: flex;
    overflow: auto;
  }
}
</style>
