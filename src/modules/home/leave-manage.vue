<template>
  <div class="leave_manage">
    <Back></Back>
    <div class="header">
      <van-dropdown-menu>
        <van-dropdown-item v-model="areaId" :options="areas" @change="getLeaveList" />
      </van-dropdown-menu>
      <span>
        <b>{{ leavedCount }}</b>/{{ total }}
      </span>
    </div>
    <div class="leave_content">
      <template v-if="leaveList.length > 0">
        <div class="card" v-for="(item,index) in leaveList" :key="index" @click="toDetail(item)">
          <div class="card_header">
            <div class="name">{{ item.elderName }}</div>
            <div class="room">{{ item.roomName }}-{{ item.bedName }}</div>
            <div :class="{ 'tag':true,'leaved': item.leaveStatus > 0}">{{ item.leaveStatus | statusWording }}</div>
          </div>
          <div class="card_body">
            <div class="content">
              <div>
                <span>请假时间：</span>
                <span>{{ item.startDate }}</span>
                <span v-if="item.startDiet === 1" class="diet">餐</span>
              </div>
              <div>
                <span>外出事由：</span>
                <span>{{ item.reason }}</span>
              </div>
            </div>
            <div class="icon">
              <van-icon name="arrow" />
            </div>
          </div>
        </div>
      </template>
      <van-empty v-else description="暂无数据" />
    </div>
    <bottom></bottom>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "LeaveManage",
  data() {
    return {
      areaId: 0,
      areas: [
        {
          text: "全部区域",
          value: null,
        },
        {
          text: "我的区域",
          value: 0,
        },
      ],
      leaveList: [],
      leavedCount: 0,
      total: 0,
    };
  },
  components: {},
  created() {
    this.getEaras();
    this.getLeaveList();
  },
  methods: {
    // 获取区域
    getEaras() {
      axios
        .fetch("careServer", "/carePatrolReport/parentArea/all")
        .then((res) => {
          if (res.data.length > 0) {
            res.data.forEach((item) => {
              const obj = {};
              obj.text = item.area;
              obj.value = item.areaId;
              this.areas.push(obj);
            });
          }
        });
    },
    getLeaveList() {
      axios
        .fetch("elderServer", "/elderLeave/mobile/query", {
          areaId: this.areaId,
        })
        .then((res) => {
          this.leaveList = res.data;
          this.total = res.total;
          this.leavedCount = res.data.filter(
            (item) => item.leaveStatus === 1
          ).length;
        });
    },
    toDetail(data) {
      this.$router.push({
        path: "/orderly/back-confirm",
        query: {
          elderId: data.elderId,
          // roomId: data.roomId,
          elderName: data.elderName,
          // elderPhoto: data.elderPhoto,
          // dietAvoid: data.dietAvoid ? data.dietAvoid : "正常",
          bedName: data.bedName,
          roomName: data.roomName,
          areaId: this.areaId,
          // nursingLevel: data.nursingLevel,
          // isNew: data.isNew,
        },
      });
    },
  },
  filters: {
    statusWording: (value) => {
      switch (value) {
        case 0:
          return "未外出";
          break;
        case 1:
          return "已外出";
          break;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.leave_manage {
  height: calc(100% - 0.5rem);
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    width: 100%;
    height: 0.48rem;
    > span,
    @{deep} .van-dropdown-menu {
      background-color: #fff;
      flex: 1;
      .van-dropdown-menu__bar {
        box-shadow: none;
        .van-dropdown-menu__item {
          padding-left: 0.12rem;
          justify-content: flex-start !important;
        }
      }
    }
    > span {
      line-height: 0.48rem;
      text-align: right;
      padding-right: 0.12rem;
      font-size: 0.16rem;
      b {
        color: red;
      }
    }
  }
  .leave_content {
    flex: 1;
    overflow: auto;
    padding: 0 0.12rem 0 0.12rem;
    .card {
      margin-top: 0.12rem;
      background-color: #fff;
      border-radius: 0.05rem;
      // box-shadow: 0 1px 1px 0;
      box-shadow: 0 0.04rem 0.05rem 0.06rem #F5F4F9;
      .card_header {
        display: flex;
        align-items: center;
        height: 0.5rem;
        padding: 0 0.12rem;
        position: relative;
        border-bottom: 1px solid #f8f8f8;
        .name {
          font-size: 0.18rem;
          font-weight: 600;
          height: 100%;
          line-height: 0.5rem;
        }
        .room {
          font-size: 0.14rem;
          margin-left: 0.05rem;
          height: 100%;
          line-height: 0.5rem;
          color: #666666;
        }
        .tag {
          box-sizing: border-box;
          position: absolute;
          right: 0;
          height: 0.3rem;
          line-height: 0.3rem;
          text-align: right;
          padding-right: 0.08rem;
          width: 0.68rem;
          background-color: #e8e8e8;
          color: #343434;
          border-radius: 0.15rem 0 0 0.15rem;
          // background-image: url('../../assets/img/list_yiwaichu.png');
          // background-size: 100% 100%;
        }
        .tag.leaved {
          background-color: #ff6366;
          color: #fff;
        }
      }
      .card_body {
        padding: 0 0.12rem;
        display: flex;
        height: 0.85rem;
        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          > div {
            line-height: 1.5;
            display: flex;
            > span:nth-child(1) {
              display: inline-block;
              width: 0.75rem;
            }
            > span:nth-child(2) {
              // flex: 1;
              flex-wrap: wrap;
            }
          }
          > div:nth-child(2) {
            > span:nth-child(2) {
              flex: 1;
              flex-wrap: wrap;
            }
          }
          .diet {
            margin-left: 0.05rem;
            text-align: center;
            width: 0.18rem;
            height: 0.18rem;
            border-radius: 0.04rem;
            border: 1px solid #ff6366;
            padding: 0.01rem;
            background-color: #ffeceb;
            color: red;
          }
        }
        .icon {
          width: 0.24rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.2rem;
        }
      }
    }
  }
}
</style>
