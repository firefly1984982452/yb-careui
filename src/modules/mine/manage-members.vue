<template>
  <!-- <div :class="{'manage-members':true, 'layout':true,'change':!isOriginHei}"> -->
  <div :class="{'manage-members':true, 'layout':true }">
    <Back></Back>
    <van-search class="top" v-model="value" @search="onSearch" @clear="onClear" shape="round" placeholder="请输入姓名或工号" />
    <div class="content">
      <div class="add">
        <p>我的团队成员</p>
        <ul v-if="myEmployeeVos&&myEmployeeVos.length>0" class="members my">
          <li v-for="(member,index) in myEmployeeVos" :key="index">
            {{member.employeeName}}
            <img @click="deleteMember(index,member)" src="../../assets/img/delete.png">
          </li>
        </ul>
        <p v-else class="members">
          <span class="tip">
            我的团队暂没有成员
          </span>
        </p>
      </div>
      <div class="add else">
        <p>点击添加团队成员</p>
        <ul v-if="elseEmployeeVos&&elseEmployeeVos.length>0" class="members else">
          <li @click="addMember(index,member)" v-for="(member,index) in elseEmployeeVos" :key="index">
            {{member.employeeName}}
          </li>
        </ul>
        <p v-else class="members">
          <span class="tip">
            没有可添加的成员
          </span>
        </p>
      </div>
    </div>
    <!-- <div class="bottom-btn" v-show="isOriginHei">
      <van-button type="primary" block @click="bingInfo">确定</van-button>
    </div> -->
    <!-- <bottom v-show="isOriginHei"></bottom> -->
    <bottom></bottom>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "ManageMembers",
  data() {
    return {
      // isOriginHei: true,
      // screenHeight:
      //   window.innnerHeight ||
      //   document.documentElement.clientHeight ||
      //   document.body.clientHeight,
      // originHeight:
      //   window.innnerHeight ||
      //   document.documentElement.clientHeight ||
      //   document.body.clientHeight,
      value: "",
      myEmployeeVos: [],
      elseEmployeeVos: [
        {
          employeeId: 1,
          employeeName: "杨蔚"
        }
      ]
    };
  },
  components: {},
  created() {
    this.getEmployeeInfo();
  },
  watch: {
    // screenHeight(val) {
    //   if (this.originHeight > val + 100) {
    //     this.isOriginHei = false;
    //   } else {
    //     this.isOriginHei = true;
    //   }
    // }
  },
  mounted() {
    // let self = this;
    // window.onresize = function() {
    //   return (function() {
    //     self.screenHeight =
    //       window.innnerHeight ||
    //       document.documentElement.clientHeight ||
    //       document.body.clientHeight;
    //   })();
    // };
  },
  methods: {
    // 删除成员
    deleteMember(index, member) {
      // this.elseEmployeeVos.push(this.myEmployeeVos[index]);
      this.myEmployeeVos.splice(index, 1);
      this.bingInfo(member.employeeId, 2);
    },
    // 添加成员
    addMember(i, member) {
      this.myEmployeeVos.push(this.elseEmployeeVos[i]);
      this.elseEmployeeVos.splice(i, 1);
      this.bingInfo(member.employeeId, 1);
    },
    // 搜索成员
    onSearch(val) {
      this.searchFn(val);
    },
    // 清空搜索内容
    onClear() {
      this.searchFn();
    },
    // 查询员工绑定信息
    getEmployeeInfo() {
      axios.fetch("oaServer", "/employee/bing").then(res => {
        this.myEmployeeVos = res.data.myEmployeeVos
          ? res.data.myEmployeeVos
          : [];
        this.elseEmployeeVos = res.data.elseEmployeeVos
          ? res.data.elseEmployeeVos
          : [];
      });
    },
    // boss绑定员工
    bingInfo(sonEmployeeId, bingType) {
      const param = {
        sonEmployeeId,
        bingType
      };
      axios.fetch("oaServer", "/employee/bingInfo", param, "json").then(res => {
        if (res.code == 200) {
          if (bingType == 2) {
            this.searchFn();
          }
        }
      });
    },
    // 所有需要添加的员工
    searchFn(val) {
      axios.fetch("oaServer", "/employee/bing", { param: val }).then(res => {
        this.elseEmployeeVos = res.data.elseEmployeeVos
          ? res.data.elseEmployeeVos
          : [];
      });
    }
  }
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
@import "../../assets/styles/common.less";
.manage-members {
  position: relative;
  height: 100%;
  .members {
    background-color: #fff;
    padding: 0.1rem 0.12rem;
    // height: 3.5rem;
    overflow: scroll;
    li {
      border-radius: 0.03rem;
      box-sizing: border-box;
      border: 0.01rem solid rgba(204, 204, 204, 1);
      text-align: center;
      display: inline-block;
      //   float: left;
      width: 20%;
      margin: 1.5% 2.5%;
      height: 0.3rem;
      line-height: 0.3rem;
      position: relative;
      color: #333333;
      img {
        width: 0.16rem;
        height: 0.16rem;
        border-radius: 50%;
        background-color: #ff8000;
        color: #fff;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
      }
    }
  }
  .add {
    > p {
      font-size: 0.12rem;
      color: #999999ff;
      margin: 0;
      padding: 0 0.12rem;
      // height: 0.3rem;
      line-height: 0.3rem;
    }
    // max-height: 3.2rem;
    overflow: auto;
    .tip {
      width: 100%;
      text-align: center;
      display: block;
      line-height: 0.56rem;
    }
  }
  .bottom-btn {
    box-sizing: border-box;
    position: fixed;
    bottom: 0.47rem;
    width: 100%;
    // background-color: #fff;
    padding: 0.1rem 0.12rem;
  }
}
</style>
