<template>
  <div class="manage-elders layout">
    <Back></Back>
    <div class="title-box top">
      <div class="name">{{employeeName}}</div>
      <div class="info">{{bindNum}}/{{num}}</div>
    </div>
    <div class="content">
      <ul v-if="myElderBed&&myElderBed.length>0" class="members my">
        <li v-for="(member,index) in myElderBed" :key="index">
          <span v-if="member.elderId">{{member.elderName}}</span>
          <span v-else-if="member.bedId">{{member.bedName}}号床</span>
          <img @click="deleteMember(index,member)" src="../../assets/img/delete.png">
        </li>
      </ul>
      <p v-else class="members">
        <span class="tip">
          暂无管理的床位
        </span>

      </p>
      <div class="add">
        <p>点击添加床位</p>
        <ul v-if="elseElderBed&&elseElderBed.length>0" class="members">
          <li @click="addMember(index,member)" v-for="(member,index) in elseElderBed" :key="index">
            <span v-if="member.elderId">{{member.elderName}}</span>
            <span v-else-if="member.bedId">{{member.bedName}}号床</span>
          </li>
        </ul>
        <p v-else class="members">
          <span class="tip">
            暂无可以添加的长者
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
      roomId: null,
      num: 0,
      bindNum: 0,
      myElderBed: [],
      elseElderBed: [],
    };
  },
  components: {},
  created() {
    this.employeeName = this.$route.query.employeeName;
    this.roomId = Number(this.$route.query.roomId);
    this.getElders();
  },
  methods: {
    // 删除成员
    deleteMember(index, data) {
      // this.elseElderBed.push(this.myElderBed[index]);
      // this.myElderBed.splice(index, 1);
      this.bingInfo(2, data.bedId, data.buildingId);
    },
    // 添加成员
    addMember(i, data) {
      // this.myElderBed.push(this.elseElderBed[i]);
      // this.elseElderBed.splice(i, 1);
      this.bingInfo(1, data.bedId, data.buildingId);
    },
    // 搜索成员
    onSearch(val) {},
    // 查询员工绑定信息
    getElders() {
      axios
        .fetch("oaServer", "/employee/elderBed", {
          employeeId: this.$route.query.employeeId,
          roomId: this.roomId,
        })
        .then((res) => {
          this.bindNum = res.data.bindNum;
          this.num = res.data.num;
          this.myElderBed = res.data.myElderBed ? res.data.myElderBed : [];
          this.elseElderBed = res.data.elseElderBed
            ? res.data.elseElderBed
            : [];
        });
    },
    // boss绑定员工
    bingInfo(bingType, bedId, buildingId) {
      let param = [{
        employeeId: Number(this.$route.query.employeeId),
        bingType,
        bedId,
        buildingId,
      }];
      axios
        .fetch("oaServer", "/employee/elderBed/bind", param, "json")
        .then((res) => {
          if (res.code == 200) {
            // this.$toast("操作成功");
            // this.$router.back();
            this.getElders();
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
@import "../../assets/styles/common.less";
.manage-elders {
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
