<template>
  <div class="food_sum">
    <div class="header">
      <span style="text-align:center;line-height:0.48rem" @click="show = true">
        <!-- .van-dropdown-menu__title--active -->
        <span :class="{'van-dropdown-menu__title':true,'van-dropdown-menu__title--active':show,'van-dropdown-menu__title--down':show}">
          {{moment(purchaseDate).format('MM/DD')}}
        </span>
      </span>
      <van-dropdown-menu>
        <van-dropdown-item v-model="categoryId" :options="statusOption" @change="handleStatusChange" />
      </van-dropdown-menu>
      <van-dropdown-menu>
        <van-dropdown-item v-model="areaId" :options="areas" @change="handleStatusChange" />
      </van-dropdown-menu>
    </div>
    <div class="content">
      <!-- <van-cell-group>
        <van-cell>
          <template #title>
            <span class="custom-title">菜品</span>
            <span class="custom-title">份数</span>
            <span class="custom-title">长者</span>
          </template>
        </van-cell>
        <template v-if="sums.length > 0">
          <van-cell v-for="(item,index) in sums" :key="index">
            <template #title>
              <span class="custom-title van-ellipsis">{{ item.foodTitle }}</span>
              <span class="custom-title van-ellipsis">{{ item.foodNum }}</span>
              <span class="custom-title">{{ item.elderNames }}</span>
            </template>
          </van-cell>
        </template>
        <van-empty v-else description="暂无菜品" />
      </van-cell-group> -->
      <van-collapse v-if="sums.length > 0" v-model="activeNames">
        <van-collapse-item v-for="(sum,index) in sums" :key="index" :title="`${sum.foodTitle}(${sum.foodNum}份)`" :name="sum.foodId">
          <template v-if="sum.dietElderCollectDetailVos&&sum.dietElderCollectDetailVos.length > 0">
            <van-cell v-for="(elder,i) in sum.dietElderCollectDetailVos" :key="i" :title="elder.roomName" :value="elder.elderNames" />
            <!-- <span v-for="(elder,i) in sum.dietElderCollectDetailVos" :key="i">
              <b>{{elder.roomName}}</b>({{elder.elderNames}})；&nbsp;
            </span> -->
          </template>
        </van-collapse-item>

      </van-collapse>
      <van-empty v-else description="暂无菜品" />
    </div>
    <van-calendar :min-date="minDate" v-model="show" :show-confirm="false" @confirm="onConfirm" />

  </div>
</template>

<script type="text/javascript">
import moment from "moment";
export default {
  name: "FoodSum",
  data() {
    return {
      show: false,
      purchaseDate: new Date(),
      minDate: new Date(2010, 0, 1),
      categoryId: 0,
      statusOption: [],
      sums: [],
      areaId: "",
      areas: [
        {
          text: "全部区域",
          value: "",
        },
      ],
      activeNames: []
    };
  },
  components: {},
  created() {
    this.getTypes();
    this.getEaras();
  },
  methods: {
    moment,
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
    handleStatusChange() {
      this.getFoodSum();
    },
    onConfirm(date) {
      this.purchaseDate = this.$moment(date).format("YYYY-MM-DD");
      this.show = false;
      this.getFoodSum();
    },
    // 获取膳食类别
    getTypes() {
      axios
        .fetch("dietServer", "/dietCategory/query", {
          type: 1,
          forType: 10,
        })
        .then((res) => {
          this.statusOption = res.data.map((item) => {
            (item.text = item.title), (item.value = item.id);
            return item;
          });
          // this.getFoodSum();
          const currentDate = this.$moment().format("YYYY-MM-DD");
          // 早上零点
          let zeroDate = this.$moment(`${currentDate} 00:00:00`);
          // 早上九点半
          let nineHalfClock = this.$moment(`${currentDate} 09:30:00`);
          // 下午两点半
          let fourteenHalfClock = this.$moment(`${currentDate} 14:30:00`);
          // 二十四点
          let overTime = currentDate + " 23:59:59";
          if (this.$moment() >= zeroDate && this.$moment() <= nineHalfClock) {
            this.categoryId = this.statusOption[0].value;
          } else if (
            this.$moment() > nineHalfClock &&
            this.$moment() <= fourteenHalfClock
          ) {
            this.categoryId = this.statusOption[1].value;
          } else {
            this.categoryId = this.statusOption[2].value;
          }
          this.getFoodSum();
        });
    },
    getFoodSum() {
      axios
        .fetch("dietServer", "/dietElder/collect", {
          periodDate: this.$moment(this.purchaseDate).format("YYYY-MM-DD"),
          // periodDate: "2020-10-18",
          categoryId: this.categoryId,
          areaId: this.areaId,
        })
        .then((res) => {
          console.log(res);
          this.sums = res.data;
          // if (this.sums.length > 0) {
          //   for (let index = 0; index < 8; index++) {
          //     this.sums.push(this.sums[0]);
          //   }
          // }
          // if (this.sums[0].dietElderCollectDetailVos.length > 0) {
          //   for (let index = 0; index < 8; index++) {
          //     this.sums[1].dietElderCollectDetailVos.push(this.sums[1].dietElderCollectDetailVos[0])
          //   }
          // }
          this.activeNames = this.sums.map(item => item.foodId);
        });
    },
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.food_sum {
  height: 100%;
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
      }
    }
  }
  .content {
    margin-top: 0.12rem;
    flex: 1 0 0;
    overflow: auto;
    @{deep} van-cell-group {
      .van-cell {
        .van-cell__title {
          display: flex;
          span {
            flex: 1;
            text-align: center;
          }
        }
      }
      .van-cell:nth-child(1) {
        .van-cell__title {
          // font-size: 0.16rem;
          font-weight: 600;
        }
      }
    }
    @{deep} .van-collapse {
      .van-collapse-item + .van-collapse-item {
        margin-top: 0.12rem;
      }
      .van-collapse-item__title {
        .van-cell__title {
          text-align: center;
          font-size: 0.16rem;
          font-weight: 600;
        }
      }
      .van-collapse-item__wrapper {
        .van-collapse-item__content {
          .van-cell__title {
            width: 0.6rem;
            flex: none;
          }
        }
      }
    }
  }
}
</style>
