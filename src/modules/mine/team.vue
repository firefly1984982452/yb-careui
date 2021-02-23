<template>
  <!-- 我的团队 -->
  <div class="mine-team">
    <!-- <div class="header">
      <i @click="goBack" class="iconfont iconjichutubiao-xiangzuojiantou"></i>
      <span>我的团队</span>
    </div> -->
    <Back></Back>
    <van-cell class="title" v-if="members.length > 0" :value="loginInfo.num!=null?loginInfo.num+'人':''">
      <template #title>
        <span>团队成员</span>
      </template>
      <template #right-icon>
        <!-- <van-icon name="search" @click="manageMembers" style="line-height: inherit;" /> -->
        <img src="../../assets/img/mngpeople.png" @click="manageMembers" alt="">
      </template>
    </van-cell>
    <div v-if="members.length == 0" class="empty">
      <img src="../../assets/img/empty.png" alt="">
      <span class="text">还没有成员,赶紧添加成员吧~</span>
      <van-button type="primary" @click="manageMembers">添加成员</van-button>
    </div>
    <div v-else class="members">
      <div v-for="( member,index ) in members" :key="index">
        <van-collapse v-if="member.resultRoomElderVos&&member.resultRoomElderVos.length > 0" v-model="activeName" accordion>
          <van-collapse-item :title="member.employeeName" :name="index">
            <template #title>
              <span>{{ member.employeeName }}</span>
            </template>
            <template #value>
              <span>{{ member.elderNum }}床/{{ member.roomNum }}间</span>
            </template>
            <template>
              <van-cell class="detail" v-for="(detail,i) in member.resultRoomElderVos" :key="i">
                <template #title>
                  <div class="left" @click="setRoom(member.employeeName,member.employeeId)">
                    <span>{{ detail.roomName }}</span>
                  </div>
                  <ul class="right" @click="selectElder(detail,member.employeeName,member.employeeId)">
                    <li v-for="(elder,i) in detail.resultElderInfoVos" :key="i">
                      <span v-if="elder.elderId"> {{ elder.elderName }}</span>
                      <span v-else-if="elder.bedId"> {{ elder.bedName }}号床</span>
                    </li>
                  </ul>
                </template>
              </van-cell>
            </template>
          </van-collapse-item>
        </van-collapse>
        <van-cell v-else>
          <template #title>
            <span>{{ member.employeeName }}</span>
            <!-- <span>{{ member.peoples }}人/{{ member.rooms }}间</span> -->
          </template>
          <template #right-icon>
            <!-- <van-icon @click="setRoom(member.employeeName,member.employeeId)" name="search" style="line-height: inherit;" /> -->
            <img src="../../assets/img/bingroom.png" @click="setRoom(member.employeeName,member.employeeId)" alt="">
          </template>
        </van-cell>
      </div>
    </div>
    <bottom></bottom>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "MineTeam",
  components: {},
  data() {
    return {
      loginInfo: {},
      activeName: "",
      members: []
    };
  },
  created() {
    this.getTeamInfo();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // 管理成员
    manageMembers() {
      this.$router.push({
        path: "manage-members",
        query: {
          employeeId: this.loginInfo.employeeId,
          employeeName: this.loginInfo.employeeName
        }
      });
    },
    setRoom(employeeName, employeeId) {
      this.$router.push({
        path: "set-room",
        query: {
          employeeId: employeeId,
          employeeName: employeeName
        }
      });
    },
    // 编辑绑定房间的老人
    selectElder(data, employeeName, employeeId) {
      console.log(data);
      this.$router.push({
        path: "set-elder",
        query: {
          roomId: data.roomId,
          employeeId: employeeId,
          employeeName: employeeName
        }
      });
    },
    // 查询我的员工和子员工绑定信息
    getTeamInfo() {
      axios.fetch("oaServer", "/employee/carer").then(res => {
        console.log(res);
        this.loginInfo = res.data;
        this.members =
          res.data &&
          res.data.resultEmployeeElderVos &&
          res.data.resultEmployeeElderVos.length > 0
            ? res.data.resultEmployeeElderVos
            : [];
      });
    }
  }
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.mine-team {
  height: calc(100% - 0.5rem);
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
  .header {
    padding: 0 0.1rem;
    height: 0.36rem;
    font-size: 0.18rem;
    font-weight: 600;
    line-height: 0.36rem;
    background-color: #fff;
  }
  .empty {
    flex: 1;
    margin-bottom: 0.47rem;
    display: flex;
    flex-direction: column;
    text-align: center;
    img {
      margin-top: 1.57rem;
      width: 90%;
      height: 1.94rem;
      margin-left: 5%;
      // background-color: red;
    }
    .text {
      font-size: 0.12rem;
      color: rgba(0, 0, 0, 0.25);
      line-height: 0.26rem;
      margin-top: 3%;
    }
    .van-button {
      margin-top: 10%;
      width: 30%;
      margin-left: 35%;
      border-radius: 0.08rem;
    }
  }
  .members {
    overflow: auto;
    // flex: 1;
  }
  .detail {
    @{deep} .van-cell__title {
      display: flex;
      .left {
        width: 20%;
      }
      .right {
        flex: 1;
        .van-tag {
          box-sizing: border-box;
          text-align: center;
          font-size: 0.14rem;
          // width: 23%;
          margin: 1% 1%;
        }
        li {
          color: #666666;
          font-size: 0.14rem;
          font-weight: normal;
          display: inline-block;
          min-width: 23%;
          margin: 0 1%;
        }
      }
    }
  }

  @{deep} .van-cell {
    min-height: 0.48rem;
    padding: 0.05rem 0.16rem;
    position: relative;
    .van-cell__title {
      font-size: 0.16rem;
      font-weight: 600;
      padding: 0.02rem 0;
      position: relative;
      line-height: 0.38rem;
      .custom-title,
      .counts {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
      .counts {
        font-size: 0.14rem;
        font-weight: 600;
        left: 0.8rem;
      }
    }
    .van-cell__value {
      padding-right: 0.24rem;
      line-height: 0.38rem;
    }

    img {
      position: absolute;
      top: 50%;
      right: 0.16rem;
      display: inline-block;
      height: 0.16rem;
      width: 0.16rem;
      transform: translateY(-50%);
      // margin-top: 0.11rem;
    }
    .van-icon {
      right: 0.16rem;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  // @{deep} .van-collapse-item__content {
  //   padding-left: 0;
  // }
  .title {
    margin-bottom: 0.06rem;
    // height: 0.48rem;
    // height: 0.3rem;
    // line-height: 0.17rem !important;
    .van-cell__value,
    .van-cell__title {
      font-size: 0.12rem;
      font-weight: 600;
      // line-height: 0.2rem;
      color: rgba(0, 0, 0, 0.25);
    }
  }
}
</style>
