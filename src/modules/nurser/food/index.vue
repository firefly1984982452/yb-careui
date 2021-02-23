<template>
  <!-- 护理员点餐查看详情页面 -->
  <div class="food_ordered">
    <!-- <div class="header">
      <van-icon @click="$router.go(-1)" name="arrow-left" />
      <span>{{$route.query.elderName}}</span>
      （<span style="max-width:30%" class="van-ellipsis">{{$route.query.dietAvoid}}</span>）
      <van-tag type="success" size="large" round>{{$route.query.roomName}}-{{$route.query.bedName}}</van-tag>
    </div> -->
    <!-- <Back></Back> -->
    <Back class="header" :backWording="`${$route.query.elderName}(${$route.query.dietAvoid})`" :showTitle="false">
      &nbsp;&nbsp;<van-tag type="success" size="large" round>{{$route.query.roomName}}-{{$route.query.bedName}}</van-tag>
    </Back>
    <div class="content">
      <div class="left">
        <van-sidebar v-model="activeKey" @change="onChange">
          <van-sidebar-item v-for="(day,index) in days" :badge="day.isLeave?'假':''" :title="day.title" :key="index" />
        </van-sidebar>
      </div>
      <div class="right" v-if="days[activeKey].dietElderTwoVoList">
        <template v-if="days[activeKey].dietElderTwoVoList.length > 0">
          <section v-for="(menu,index) in days[activeKey].dietElderTwoVoList" :key="index">
            <p>
              <span class="categoryTitle">
                {{menu.categoryTitle}}
                <!-- <i v-if="menu.isLeave">假</i> -->
              </span>
            </p>
            <ul class="main">
              <li v-for="(food,i) in menu.dietElderVoList" :key="i" class="van-ellipsis">{{ food.foodTitle }}</li>
            </ul>
          </section>
        </template>
      </div>
      <van-empty v-else description="暂无菜单" />
      <!-- <p v-else>2555</p> -->
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "FoodOrdered",
  data() {
    return {
      days: [
        {
          dietElderTwoVoList: [],
        },
      ],
      activeKey: 0,
      elderId: "",
    };
  },
  components: {},
  created() {
    this.elderId = Number(this.$route.query.elderId);
    this.getDetails(this.elderId);
  },
  methods: {
    getDetails(elderId) {
      axios
        .fetch("dietServer", "/dietElder/carer/get", { elderId })
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
  },
};
</script>

<style lang="less" scoped>
p {
  padding: 0;
  margin: 0;
}
.food_ordered {
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    // height: 0.44rem;
    // font-size: 0.16rem;
    // font-weight: 500;
    // color: rgba(0, 0, 0, 1);
    // display: flex;
    // align-items: center;
    // background-color: #fff;
    // border-bottom: 1px solid #f8f8f8;
    // i {
    //   font-size: 0.22rem;
    //   margin-right: 0.08rem;
    // }
  }
  .content {
    display: flex;
    flex: 1;
    overflow: auto;
    .left {
      width: 0.85rem !important;
      /deep/ .van-sidebar {
        height: 100%;
        width: 100%;
        a {
          font-size: 0.14rem;
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
            height: 0.44rem;
            margin: 2.5%;
            line-height: 0.44rem;
            text-align: center;
            width: 45%;
            background: #eef9f6;
            color: #69ca8d;
            border-radius: 0.04rem;
          }
        }
      }
    }
    .van-empty {
      flex: 1;
      background-color: #fff;
    }
  }
}
</style>
