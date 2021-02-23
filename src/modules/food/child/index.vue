<template>
  <div class="child_index">
    <div class="content">
      <div class="left">
        <van-sidebar v-model="activeKey" @change="onChange">
          <van-sidebar-item v-for="(day,index) in days" :badge="day.isLeave?'假':''" :title="day.title" :key="index" />
        </van-sidebar>
      </div>
      <div class="right" v-if="days[activeKey].dietMenuTwoVoList">
        <section v-if="days[activeKey].dietMenuTwoVoList.length > 0" v-for="(menu,index) in days[activeKey].dietMenuTwoVoList" :key="index">
          <p>
            <span class="categoryTitle">
              {{menu.categoryTitle}}
              <!-- <i v-if="menu.isLeave">假</i> -->
            </span>
          </p>
          <ul class="main">
            <li v-for="(food,i) in menu.dietMenuVoList" @click="periodStatus==2?handleSelect(food):''" :key="i" :class=" {'selected': food.isDraw,'van-ellipsis':true}">{{ food.foodTitle }}</li>
            <!-- <li v-for="(food,i) in menu.dietMenuVoList" @click="handleSelect(food)" :key="i" :class=" {'selected': food.isDraw,'van-ellipsis':true}">{{ food.foodTitle }}</li> -->
          </ul>
        </section>
      </div>
      <van-empty v-else description="暂无菜单" />
    </div>
    <div class="bottom" v-if="periodStatus==2">
      <!-- <div class="bottom"> -->
      <van-button v-if="isOrderMeal" @click="handleSubmit" block type="primary">
        修改预订
      </van-button>
      <van-button v-if="!isOrderMeal" @click="handleSubmit" block type="primary">
        提交预订
      </van-button>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "ChildIndex",
  props: {
    tabActive: {
      type: Number,
      default: 0,
    },
    periodStatus: {
      type: Number,
      default: null,
    },
    periodId: {
      type: Number,
      default: null,
    },
    startDate: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      nowWeekDate: "", // 本周开始日期
      nextWeekDate: "", // 下周开始日期
      activeKey: 0,
      isOrderMeal: "",
      days: [
        {
          dietMenuTwoVoList: [],
        },
      ],
    };
  },
  components: {},
  created() {
    this.isOrderMeal = JSON.parse(this.$route.query.isOrderMeal);
    this.queryFoodSeleced(this.periodId, this.$moment(this.startDate));
  },
  watch: {
    tabActive() {
      this.activeKey = 0;
    },
    activeKey(val) {
      // console.log(val);
    },
  },
  methods: {
    // // 获取周数数据
    // getWeekData() {
    //   axios.fetch("dietServer", "/dietPeriod/careLeader/get").then((res) => {
    //     this.nowWeekDate = res.data[1].startDate;
    //     const nowId = res.data[1].id;
    //     this.nextWeekDate = res.data[0].startDate;
    //     const nextId = res.data[0].id;
    //     // 组成侧边需要的星期格式
    //     this.days.forEach((day, index) => {
    //       day.periodDate = this.$moment(
    //         this.tabActive === 0 ? this.nextWeekDate : this.nowWeekDate
    //       )
    //         .add(index, "days")
    //         .format("YYYY-MM-DD");
    //     });
    //     console.log(this.days);
    //     const id = this.tabActive === 0 ? nextId : nowId;
    //     const date =
    //       this.tabActive === 0 ? this.nextWeekDate : this.nowWeekDate;
    //     this.queryFoodSeleced(id, this.$moment(date).format("YYYY-MM-DD"));
    //   });
    // },
    queryFoodSeleced(periodId, date) {
      axios
        .fetch("dietServer", "/dietMenu/careLeader/get", {
          elderId: this.$route.query.elderId,
          periodId,
          forType: 10, // 长者菜单
        })
        .then((res) => {
          this.days = res.data.map((item, index) => {
            switch (index) {
              case 0:
                item.title = "星期一";
                break;
              case 1:
                item.title = "星期二";
                break;
              case 2:
                item.title = "星期三";
                break;
              case 3:
                item.title = "星期四";
                break;
              case 4:
                item.title = "星期五";
                break;
              case 5:
                item.title = "星期六";
                break;
              case 6:
                item.title = "星期日";
                break;
              default:
                break;
            }
            return item;
          });
        });
    },
    handleSelect(data) {
      // console.log(data);
      data.isDraw = !data.isDraw;
    },
    // onChange(index) {
    //   // console.log(this.days[index].periodDate);
    //   const arr = this.allWeekMenus.filter(
    //     (item) => item.periodDate == this.days[index].periodDate
    //   )[0].dietMenuTwoVoList;
    //   this.menus = arr ? arr : [];
    //   // console.log(this.menus);
    // },
    handleSubmit() {
      // console.log(this.days);
      // console.log(this.menus);
      axios
        .fetch("dietServer", "/dietElder/careLeader/submit", this.days, "json")
        .then((res) => {
          this.$toast.success("预定成功");
          this.$router.go(-1);
        });
    },
  },
};
</script>

<style lang="less" scoped>
p {
  padding: 0;
  margin: 0;
}
.child_index {
  height: 100%;
  display: flex;
  flex-direction: column;
  .content {
    display: flex;
    // flex: 1;
    height: calc(100% - 0.5rem);
    .left {
      width: 0.85rem !important;
      /deep/ .van-sidebar {
        height: 100%;
        width: 100%;
        a {
          font-size: 0.15rem;
          box-sizing: border-box;
          text-align: center;
          height: 0.5rem;
          padding: 0.18rem 0;
          .van-info {
            right: -0.08rem;
            background-color: #ff6f6c;
            width: 0.22rem;
            height: 0.22rem;
            line-height: 0.22rem;
            border-radius: 50%;
            font-size: 0.12rem;
          }
        }
        .van-sidebar-item--select {
          color: #69ca8d;
        }
        .van-sidebar-item--select::before {
          background-color: #69ca8d;
        }
      }
    }
    .right {
      flex: 1;
      background-color: #fff;
      padding: 0 0.12rem;
      overflow: auto;
      section {
        p {
          line-height: 0.44rem;
          font-size: 0.16rem;
          color: #222222;
          font-weight: 600;
          .categoryTitle {
            position: relative;
            i {
              position: absolute;
              right: -0.11rem;
              top: -50%;
              color: #fff;
              background-color: #ff6f6c;
              width: 0.16rem;
              height: 0.16rem;
              display: inline-block;
              border-radius: 50%;
              text-align: center;
              line-height: 0.16rem;
              font-size: 0.12rem;
            }
          }
        }
        ul {
          display: flex;
          flex-wrap: wrap;
          li {
            box-sizing: border-box;
            height: 0.44rem;
            margin: 2.5%;
            line-height: 0.44rem;
            text-align: center;
            width: 45%;
            background: #f5f6fa;
            color: #999999;
            border-radius: 0.04rem;
            font-size: 0.16rem;
            padding: 0 0.05rem;
          }
          li.selected {
            background: #eef9f6;
            color: #69ca8d;
            box-shadow: 1px 1px 1px 1px;
          }
        }
      }
    }
    .van-empty {
      flex: 1;
      background-color: #fff;
    }
  }
  .bottom {
    border-top: 1px solid #f8f8f8;
    height: 0.5rem;
    background-color: #fff;
    box-sizing: border-box;
    .van-button {
      height: 100%;
      width: 1.5rem;
      float: right;
    }
  }
}
</style>
