<template>
  <div class="manage-members layout">
    <Back></Back>
    <div class="title-box top">
      <div class="name">{{employeeName}}</div>
      <div class="info">{{elderNum}}人/{{roomNum}}间</div>
    </div>
    <div class="content">

      <ul v-if="myBingRoomVos&&myBingRoomVos.length>0" class="members my">
        <li v-for="(member,index) in myBingRoomVos" :key="index">
          {{member.roomName}}
          <img @click="deleteMember(index,member)" src="../../assets/img/delete.png">
        </li>
      </ul>
      <p v-else class="members">
        <span class="tip">
          暂无管理的房间
        </span>
      </p>
      <div class="add">
        <p>点击添加房间</p>
        <ul v-if="elseBingRoomVos&&elseBingRoomVos.length>0" class="members">
          <li @click="addMember(index,member)" v-for="(member,index) in elseBingRoomVos" :key="index">
            {{member.roomName}}
          </li>
        </ul>
        <p v-else class="members">
          <span class="tip">
            暂无可添加的房间
          </span>
        </p>
      </div>
    </div>
    <!-- <div class="bottom-btn">
      <van-button type="primary" block @click="bingInfo">确定</van-button>
    </div> -->
    <bottom></bottom>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "ManageMembers",
  data() {
    return {
      employeeName: "",
      roomNum: 0,
      elderNum: 0,
      myBingRoomVos: [],
      elseBingRoomVos: []
    };
  },
  components: {},
  created() {
    this.employeeName = this.$route.query.employeeName;
    this.getEmployeeInfo();
  },
  methods: {
    // 删除成员
    deleteMember(index, data) {
      // this.elseBingRoomVos.push(this.myBingRoomVos[index]);
      // this.myBingRoomVos.splice(index, 1);
      this.bingInfo(2, data.roomId, data.buildingId);
    },
    // 添加成员
    addMember(i, data) {
      // this.myBingRoomVos.push(this.elseBingRoomVos[i]);
      // this.elseBingRoomVos.splice(i, 1);
      this.bingInfo(1, data.roomId, data.buildingId);
    },
    // 搜索成员
    onSearch(val) {},
    // 查询员工绑定信息
    getEmployeeInfo() {
      axios
        .fetch("oaServer", "/employee/roomInfo", {
          employeeId: this.$route.query.employeeId
        })
        .then(res => {
          this.elderNum = res.data.elderNum;
          this.roomNum = res.data.roomNum;
          this.myBingRoomVos = res.data.myBingRoomVos
            ? res.data.myBingRoomVos
            : [];
          this.elseBingRoomVos = res.data.elseBingRoomVos
            ? res.data.elseBingRoomVos
            : [];
        });
    },
    // boss绑定员工
    bingInfo(bingType, roomId, buildingId) {
      let param = {
        employeeId: this.$route.query.employeeId,
        bingType,
        roomId,
        buildingId
      };
      axios
        .fetch("oaServer", "/employee/bingRoom", param, "json")
        .then(res => {
          if (res.code == 200) {
            // this.$toast("操作成功");
            // this.$router.back();
            this.getEmployeeInfo();
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
@import "../../assets/styles/common.less";
.manage-members {
  p {
    margin: 0;
  }
  height: calc(100% - 0.5rem);
  margin-bottom: 0.5rem;
  .title-box {
    height: 0.5rem;
    background-color: #fff;
    padding: 0.12rem 0.16rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    .name {
      font-size: 0.18rem;
      color: #333333;
      font-weight: bold;
    }
    .info {
      font-size: 0.12rem;
      color: #999999;
      line-height: 0.26rem;
    }
  }
  .members {
    background-color: #fff;
    padding: 0.1rem 0.12rem;
    // height: 3.2rem;
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
      color: #333333ff;
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
    margin: 0;
    .tip {
      width: 100%;
      text-align: center;
      display: block;
      line-height: 0.56rem;
      color: rgba(0, 0, 0, 0.4);
      font-size: 0.12rem;
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
