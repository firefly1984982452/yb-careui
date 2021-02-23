<template>
  <div class="add_report">
    <Back></Back>
    <!-- 新增交班报告 -->
    <div class="top" v-show="show">
      <span :class="{'active':iscur == 0}">交班信息</span>
      <span>>>></span>
      <span :class="{'active':iscur == 1}">交班内容</span>
    </div>
    <!-- 交班信息 -->
    <info v-if="iscur == 0" @changePage="changePage"></info>
    <!-- 交班内容 -->
    <Content v-if="iscur == 1" @changePage="changePage"></Content>

  </div>
</template>

<script type="text/javascript">
import info from "./info";
import Content from "./content";
export default {
  name: "AddReport",
  data() {
    return {
      iscur: 0,
      show: false,
    };
  },
  mounted(){
    let type = localStorage.getItem('report-type');
    this.iscur = type == 'add' ? 0 : 1;
    // 从首页进入详情页还是从上一步进入详情页
    let type2 = localStorage.getItem('in-type');
    this.show = type2 == 'home' ? false : true;
  },
  components: { info, Content },
  methods: {
    changePage(num) {
      this.iscur = num;
    },
  },
};
</script>

<style lang="less" scoped>
.add_report {
  display: flex;
  flex-direction: column;
  height: 100%;
  .top {
    height: 0.44rem;
    display: flex;
    align-items: center;
    span {
      text-align: center;
      flex: 1;
      position: relative;
      height: 100%;
      line-height: 0.44rem;
    }
    span.active {
      color: #3e8ef7;
      font-weight: 600;
    }
    span.active::after {
      content: "";
      height: 4px;
      width: 20%;
      border-radius: 3px;
      background-color: #3e8ef7;
      position: absolute;
      bottom: 0;
      left: 40%;
    }
  }
}
</style>
