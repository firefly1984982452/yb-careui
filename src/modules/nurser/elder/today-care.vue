<template>
  <div class="today_care">
    <Back :bgc="1" :path="`/orderly/scan-result?roomId=${roomId}`"></Back>
    <!-- 今日照护 -->
    <div class="header">
      <div class="title">
        <!-- <img src="../../../assets/img/icon-from-white@2x.png" alt="" srcset=""> -->
        <van-image width="24" height="32" :src="require('@/assets/img/icon-from-white@2x.png')" />
        <div>{{ roomName }}</div>
      </div>
      <div class="fr">
        <span>
          <van-image width="32" height="32" @click="goToCheckRoom" round :src="require('@/assets/img/ico-canfangxunshi-white@2x.png')" />
        </span>
        <span>
          <van-image width="32" height="32" @click="goToRoomTask" round :src="require('@/assets/img/icon-fangjianqingli-white@2x.png')" />
        </span>
      </div>
    </div>
    <div class="content" v-if="elders.length>0">
      <van-cell is-link @click="handleClick(item)" v-for="(item,index) in elders" :key="index">
        <!-- 使用 title 插槽来自定义标题 -->
        <!-- https://image.youbankeji.com/20191127/201911271574828802604.jpg -->
        <template #title>
          <!-- <van-tag type="danger">标签</van-tag> -->
          <span class="avart">
            <van-image width="0.48rem" round height="0.48rem" fit="fill" :src="item.elderPhoto?item.elderPhoto:require('@/assets/img/icon-bed-default.png')" />
            <i v-if="item.isNew">新</i>
          </span>
          <span class="custom-title">
            <p>{{ item.elderName }}</p>
            <p>护理{{item.nursingLevel | filterLevel}}级&nbsp;&nbsp;{{item.roomName}}-{{item.bedName}}</p>
            <!-- <p>{{item.roomName}}-{{item.bedName}}床</p> -->
            <p v-if="item.tags">
              <van-tag type="success" v-for="(tag,i) in item.tags.split(',')" :key="i">{{tag}}</van-tag>
            </p>
          </span>
        </template>
        <template #right-icon>
          <i class="remark" v-if="item.num>0">{{item.num}}</i>
          <span v-else>已完成</span>
          <van-icon name="arrow" />
        </template>
      </van-cell>
    </div>
    <van-empty v-else description="暂无数据">
    </van-empty>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "TodayCare",
  data() {
    return {
      roomName: "",
      roomId: "",
      elders: [],
      taskType: "",
      sign: "",
      areaId: "",
      taskId: "",
    };
  },
  created() {
    this.roomId = Number(this.$route.query.roomId);
    this.roomName = this.$route.query.roomName;
    this.taskType = this.$route.query.taskType;
    this.sign = this.$route.query.sign;
    this.areaId = this.$route.query.areaId;
    this.taskId = this.$route.query.taskId;
    this.queryTasks();
  },
  filters: {
    filterLevel: (val) => {
      return ["", "一", "二", "三", "四", "五", "六"][val];
    },
  },
  methods: {
    // 查询今日任务
    queryTasks() {
      axios
        .fetch("careServer", "/careTask/todayTask/elder", {
          roomId: this.roomId,
        })
        .then((res) => {
          //   console.log(res);
          this.elders = res.data ? res.data : [];
        });
    },
    // 快捷方式去房间任务
    goToRoomTask() {
      this.$router.push({
        path: "task",
        query: this.$route.query,
      });
    },
    //
    goToCheckRoom() {
      if (this.taskId) {
        if (Number(this.taskType) === 1) {
          this.$router.push({
            path: "check-room",
            query: this.$route.query,
          });
        } else if (Number(this.taskType) === 0) {
          this.addTask(this.taskId, this.areaId);
        }
      } else {
        this.$toast("暂无房间任务");
      }
    },

    // 新增护理查房子任务信息
    addTask(taskId, areaId) {
      axios
        .fetch("careServer", "/carePatrolSubtask/add", {
          taskId,
          areaId,
        })
        .then((res) => {
          this.$router.push({
            path: "check-room",
            query: this.$route.query,
          });
        });
    },
    handleClick(elder) {
      this.$router.push({
        path: "taskElder",
        query: {
          roomId: this.roomId,
          elderId: elder.elderId,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
p {
  margin: 0;
}
.today_care {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .header {
    width: 100%;
    height: 1.38rem;
    background-color: #69ca8d;
    color: #fff;
    padding: 0.23rem 0 0 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    // align-items: center;
    .title {
      display: flex;
      flex-direction: row;
      .van-image {
        margin: 0 0.08rem 0 0.12rem;
      }
      div {
        font-size: 0.24rem;
      }
    }
    .fr {
      margin-right: 0.12rem;
      span + span {
        margin-left: 0.08rem;
      }
    }
  }
  .content {
    box-sizing: border-box;
    width: 100%;
    padding: 0 0.12rem;
    overflow: auto;
    margin-top: -0.6rem;
    flex: 1;
    flex-direction: column;
    @{deep} .van-cell {
      border-radius: 0.08rem;
      align-items: center;
      min-height: 0.88rem;
      // height: 0.66rem;
      .avart {
        position: relative;
        i {
          text-align: center;
          position: absolute;
          top: 0;
          right: 0;
          font-style: normal;
          background-color: #69ca8d;
          display: inline-block;
          width: 0.18rem;
          height: 0.18rem;
          line-height: 0.18rem;
          color: #fff;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .van-cell__title {
        display: flex;
        align-items: center;
        .van-image {
          margin-right: 0.08rem;
        }
        p:nth-child(1) {
          font-weight: 600;
        }
        p:nth-child(2) {
          color: rgba(0, 0, 0, 0.4);
        }
      }
      .remark {
        text-align: center;
        font-style: normal;
        display: inline-block;
        width: 0.2rem;
        height: 0.2rem;
        line-height: 0.2rem;
        border-radius: 50%;
        background-color: #ff6f6c;
        color: #fff;
      }
      .van-tag {
        margin-right: 0.04rem;
      }
    }
    .van-cell + .van-cell {
      margin-top: 0.12rem;
    }
  }
}
</style>
