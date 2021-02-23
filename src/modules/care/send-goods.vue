<template>
  <div class="send-goods layout">
    <Back></Back>
    <div class="top">
      <div class="left">
        <span style="text-align:center;line-height:0.48rem" @click="show = true" v-if="status == 1">
          {{$moment(purchaseDateRange[0]).format('MM/DD')}}-{{$moment(purchaseDateRange[1]).format('MM/DD')}}
        </span>
        <van-dropdown-menu>
          <van-dropdown-item v-model="status" :options="statusOption" @change="handleStatusChange" />
        </van-dropdown-menu>
        <van-dropdown-menu>
          <van-dropdown-item v-model="categoryId" :options="goodsTypeOption" @change="handleGoodsTypeChange" />
        </van-dropdown-menu>
        <van-dropdown-menu>
          <van-dropdown-item v-model="area" :options="areas" @change="handleEaraChange" />
        </van-dropdown-menu>
      </div>
      <!-- <div class="right">
        <span class="menu" @click.stop="handleMenuShow">
          <Menu :show="menuShow"></Menu>
        </span>
      </div> -->
    </div>
    <div class="content" style="top:1.16rem">
      <div class="empty" v-if="goods.length == 0">
        <div>
          <img src="../../assets/img/none.png" alt="" />
          <p>暂无内容</p>
        </div>
      </div>
      <van-collapse v-else v-model="activeName" accordion>
        <van-collapse-item :name="i" v-for="(item, i) in goods" :key="i">
          <template #title>
            <div>
              <span class="span_1">{{ item.goodsTitle }}</span>
              <span class="span_2">{{ item.elders }}人</span>
              <span class="span_3">{{ item.quantity }}{{ item.priceUnit }}</span>
              <!-- <van-icon name="question-o" /> -->
            </div>
          </template>
          <template>
            <van-swipe-cell v-for="(detail, index) in item.resultDetailItemVos" :key="index" class="detail">
              <template>
                <span>{{ detail.elderName }}{{ detail.roomName }}-{{
                    detail.bedName
                  }}</span>
                <span>￥{{ detail.amount }}</span>
                <span>{{ detail.quantity }}{{ detail.priceUnit }}</span>
                <span class="tag" v-if="detail.isAccounted">结</span>
                <!-- <span class="tag">结</span> -->
                <!-- <span style="visible:hidden;min-width:1em;margin-left:5px;"></span> -->
              </template>
              <template v-if="status == 0" #right>
                <van-button square text="删除" type="danger" class="delete-button"
                  @click="beforeClose(i, index, detail)" />
              </template>
            </van-swipe-cell>
          </template>
        </van-collapse-item>
      </van-collapse>
    </div>
    <div class="bottom" v-if="goods.length > 0 && status == 0">
      <van-button round @click="handleFaFang" type="primary" block>发放</van-button>
    </div>
    <van-calendar :allow-same-day="true" v-if="status == 1" type='range' :min-date="minDate" v-model="show"
      :show-confirm="false" @confirm="onConfirm" />
  </div>
</template>

<script type="text/javascript">
export default {
  name: "SendGoods",
  data() {
    return {
      minDate: new Date(2010, 0, 1),
      menuShow: false,
      status: 0,
      statusOption: [
        { text: "待发放", value: 0 },
        { text: "已发放", value: 1 },
      ],
      categoryId: "",
      goodsTypeOption: [
        {
          text: "全部分类",
          value: "",
        },
      ],
      area: "",
      areas: [
        { text: "全部区域", value: "" },
        { text: "我的区域", value: 1 },
      ],
      activeName: "0",
      goods: [],
      show: false,
      purchaseDateRange: [
        this.$moment().format("YYYY-MM-DD"),
        this.$moment().add(1, "d").format("YYYY-MM-DD"),
      ],
    };
  },
  components: {},
  created() {
    this.getGoosType();
    this.getEaras();
    this.getListData();
  },
  methods: {
    // 显示右上角菜单i
    handleMenuShow() {
      this.menuShow = this.menuShow ? false : true;
    },
    // 获取生活用品下的所有二级分类
    getGoosType() {
      axios
        .fetch("careServer", "/careCategory/goodsType", {
          goodsType: 0,
        })
        .then((res) => {
          console.log(res);
          if (res.data.length > 0) {
            res.data.forEach((item) => {
              const obj = {};
              obj.text = item.categoryTitle;
              obj.value = item.id;
              this.goodsTypeOption.push(obj);
            });
          }
        });
    },
    // 获取全部区域
    getEaras() {
      axios
        .fetch("oaServer", "/org/area/list", {
          groups: "楼宇区域",
        })
        .then((res) => {
          if (res.data.length > 0) {
            res.data.forEach((item) => {
              const obj = {};
              obj.text = item.areaName;
              obj.value = item.areaName;
              this.areas.push(obj);
            });
          }
        });
    },
    // 查询所有明细
    getListData() {
      axios
        .fetch("careServer", "/careOrderDetail/all", {
          goodsType: 0,
          // timeParam: this.$moment().format("YYYY-MM-DD"),
          // timeParam: "2020-06-22",
          startTime: this.status == 0 ? null : this.purchaseDateRange[0],
          endTime: this.status == 0 ? null : this.purchaseDateRange[1],
          status: this.status,
          area: this.area,
          categoryId: this.categoryId,
        })
        .then((res) => {
          if (res.code == 200) {
            this.goods = res.data;
          }
        });
    },
    // 处理状态筛选
    handleStatusChange(val) {
      // console.log(val);
      this.activeName = "0";
      // this.status = val;
      this.getListData();
    },
    //
    handleGoodsTypeChange() {
      this.activeName = "0";
      this.getListData();
    },
    // 处理区域筛选
    handleEaraChange(val) {
      this.activeName = "0";
      // console.log(val);
      this.getListData();
    },
    // 删除事件
    beforeClose(i, index, item) {
      const param = {
        status: -1,
        id: item.id,
        amount: item.amount,
      };
      axios
        .fetch("careServer", "/careOrderDetail/edit", param, "json")
        .then((res) => {
          if (res.code == 200) {
            this.goods[i].resultDetailItemVos.splice(index, 1);
            this.$toast.success("删除成功");
            this.getListData();
          }
        });
    },
    // 发放事件
    handleFaFang() {
      console.log(this.goods);
      let param = [];
      if (this.goods.length > 0) {
        this.goods.forEach((item) => {
          if (item.resultDetailItemVos.length > 0) {
            item.resultDetailItemVos.forEach((o) => {
              param.push(o.id);
            });
          }
        });
      }
      axios
        .fetch("careServer", "/careOrderDetail/appletGrant", param, "josn")
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.$toast.success("操作成功");
            this.getListData();
          }
        });
    },
    // 时间选择
    onConfirm(date) {
      this.show = false;
      this.purchaseDateRange = [
        this.$moment(date[0]).format("YYYY-MM-DD"),
        this.$moment(date[1]).format("YYYY-MM-DD"),
      ];
      this.getListData();
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/styles/common.less";
@deep: ~">>>";
.send-goods {
  height: 100%;
  @{deep} .van-dropdown-menu {
    height: 100%;
    .van-dropdown-menu__bar {
      height: 100%;
    }
  }
  @{deep} .van-swipe-cell.detail {
    .van-swipe-cell__wrapper {
      position: relative;
    }
    .tag {
      position: absolute;
      top: 0.1rem;
      right: 0.12rem;
      // transform: translateY(-50%);
      display: inline-block;
      width: 0.24rem;
      height: 0.24rem;
      border-radius: 50%;
      background-color: #70b603;
      color: #ffffff;
      text-align: center;
      line-height: 0.24rem;
      transform: scale(0.8);
    }
  }
  .bottom {
    @{deep} .van-button {
      height: 0.34rem;
    }
  }
}
</style>
