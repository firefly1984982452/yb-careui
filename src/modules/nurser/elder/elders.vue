<template>
  <div class="check-room layout">
    <div class="content">
      <Elders :taskId="taskId"></Elders>
    </div>
  </div>
</template>

<script type="text/javascript">
import Elders from "@/components/test";
export default {
  name: "CheckRoom",
  data() {
    return {
      taskId: "",
    };
  },
  components: { Elders },
  created() {
    this.taskId = Number(this.$route.query.taskId);
  },
  methods: {},
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
@import "../../../assets/styles/common.less";
.check-room {
  height: 100%;
  background-color: #fff;
  .top {
    .right {
      padding-top: 0;
      display: flex;
      align-items: center;
      img {
        width: 0.2rem;
        height: 0.2rem;
      }
    }
  }
  a {
    text-decoration: none;
  }
  .content {
    top: 0;
    bottom: 0;
    display: flex;
    overflow: auto;
  }
}
</style>
