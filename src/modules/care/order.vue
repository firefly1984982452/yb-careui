<template>
  <!-- 代订代购 -->
  <div class="order layout">
    <Back></Back>
    <div class="top">
      <div class="left">
        <span style="text-align:center;line-height:0.48rem" @click="calendarType = 'range',show = true" v-if="status == 1">
          {{$moment(purchaseDateRange[0]).format('MM/DD')}}-{{$moment(purchaseDateRange[1]).format('MM/DD')}}
        </span>
        <van-dropdown-menu>
          <van-dropdown-item v-model="status" :options="statusOption" @change="handleStatusChange" />
        </van-dropdown-menu>
        <van-dropdown-menu v-if="status == 0">
          <van-dropdown-item v-model="categoryId" :options="goodsTypeOption" @change="handleGoodsTypeChange" />
        </van-dropdown-menu>
        <van-dropdown-menu>
          <van-dropdown-item v-model="area" :options="areas" @change="handleEaraChange" />
        </van-dropdown-menu>
        <van-dropdown-menu v-if="status == 1">
          <van-dropdown-item v-model="accountType" :options="accountTypes" @change="handleTypeChange" />
        </van-dropdown-menu>
      </div>
      <!-- <div class="right">
        <span class="menu" @click.stop="handleMenuShow">
          <Menu :show="menuShow"></Menu>
        </span>
      </div> -->
    </div>
    <div class="content">
      <div class="empty" v-if="orders.length == 0">
        <div>
          <img src="../../assets/img/none.png" alt="">
          <p>暂无内容</p>
        </div>
      </div>
      <template v-if="status == 0">
        <van-collapse v-if="orders.length > 0" v-model="activeName" accordion>
          <van-collapse-item :name="i" v-for="(item,i) in orders" :key="i">
            <template #title>
              <div>
                <span class="span_1">{{item.goodsTitle}}</span>
                <span class="span_2">{{item.elders}}人</span>
                <span class="span_3">￥{{item.amounts}}</span>
              </div>
            </template>
            <template>
              <van-swipe-cell v-for="(detail,index) in item.resultDetailItemVos" :key="index" class="detail">
                <template>
                  <span>{{detail.elderName}}{{detail.roomName}}-{{detail.bedName}}</span>
                  <span>{{detail.quantity}}{{detail.priceUnit}}</span>
                  <span>
                    <van-field :ref="'priceInput'+i" type="number" v-model="detail.amount" :value="detail.amount" @keyup="nextFocus($event,index,item.resultDetailItemVos.length,i),handlePriceInput(detail.amount,i,index)" />
                    <p>元</p>
                  </span>
                </template>
                <template #right>
                  <van-button square text="删除" type="danger" class="delete-button" @click="beforeClose(i,index,detail)" />
                </template>
              </van-swipe-cell>
            </template>
          </van-collapse-item>
        </van-collapse>
      </template>
      <!-- 已经购买的老人维度 -->
      <template v-if="status == 1">
        <van-collapse v-if="orders.length > 0" v-model="activeName" accordion>
          <van-collapse-item :name="i" v-for="(item,i) in orders" :key="i">
            <template #title>
              <div>
                <!-- <span class="span_1">{{item.elderName}}{{item.roomName}}-{{item.bedName}}</span> -->
                <span class="span_1">{{item.elderName}}</span>
                <span class="span_2">{{item.num}}种</span>
                <span class="span_3">￥{{item.amounts}}</span>
              </div>
            </template>
            <template>
              <van-swipe-cell v-for="(detail,index) in item.careOrderDetails" :key="index" class="detail">
                <template>
                  <span>{{detail.goodsTitle}}</span>
                  <span>{{detail.quantity}}{{detail.priceUnit}}</span>
                  <span>
                    <van-field :ref="'priceInput'+i" type="number" v-model="detail.amount" :value="detail.amount" @keyup="nextFocus($event,index,item.careOrderDetails.length,i),handlePriceInput(detail.amount,i,index)" />
                    <p>元</p>
                  </span>
                  <span ref="accountType" @click="changFianceType(i,index)">
                    <b v-if="detail.accountType== 0" class="orange">记</b>
                    <b v-else class="green">现</b>
                  </span>
                </template>
                <template #right>
                  <van-button square text="删除" type="danger" class="delete-button" @click="beforeClose(i,index,detail)" />
                </template>
              </van-swipe-cell>
            </template>
          </van-collapse-item>
        </van-collapse>
      </template>
    </div>
    <div class="bottom" v-if="orders.length > 0">
      <div class="left">
        <p>￥{{ total.toFixed(2) }}</p>
      </div>
      <!-- <div class="right" v-if="status==0"> -->
      <div class="right">
        <span v-if="status==0" @click="show = true,calendarType=''">购买时间 {{ $moment(purchaseDate).format('MM月DD日') }}</span>

        <van-button v-if="status == 0" type="primary" @click="onPurchaseConfirm">确认购买</van-button>
        <van-button v-else-if="status == 1" type="primary" @click="onPurchaseConfirm">保存</van-button>
        <van-button v-if="status == 1 && this.accountType == 2" @click="onPurchaseConfirm('确认结算')">确认结算</van-button>
      </div>
    </div>
    <van-calendar v-if="!calendarType" :min-date="minDate" v-model="show" :show-confirm="false" @confirm="onConfirm" />
    <van-calendar v-else :type="calendarType" :min-date="minDate" v-model="show" :allow-same-day="true" :show-confirm="false" @confirm="onConfirm" />
    <van-number-keyboard v-model="amount" @input="onInput" @delete="onDelete" theme="custom" :show="numberShow" extra-key="." close-button-text="完成" @blur="numberShow = false" />

  </div>
</template>

<script type="text/javascript">
import { accMul } from "@/utils";
export default {
  name: "Order",
  data() {
    return {
      calendarType: "",
      menuShow: false,
      minDate: new Date(2010, 0, 1),
      status: 0,
      statusOption: [
        { text: "待购买", value: 0 },
        { text: "已购买", value: 1 },
      ],
      categoryId: "",
      goodsTypeOption: [{ text: "全部分类", value: "" }],
      area: "",
      areas: [
        { text: "全部区域", value: "" },
        { text: "我的区域", value: 1 },
      ],
      accountType: "0",
      accountTypes: [],
      orders: [],
      yijiIndex: 0,
      index: 0,
      activeName: "0",
      show: false,
      numberShow: false,
      amount: "",
      numbers: [],
      purchaseDate: this.$moment().format("YYYY-MM-DD"),
      purchaseDateRange: [
        this.$moment().format("YYYY-MM-DD"),
        this.$moment().add(1, "d").format("YYYY-MM-DD"),
      ],
    };
  },
  components: {},
  watch: {
    yijiIndex(newValue, oldValue) {
      this.numbers = [];
    },
    activeName(newValue, oldValue) {
      console.log(newValue);
      if (newValue !== "" && newValue !== null && newValue !== undefined) {
        this.$nextTick(() => {
          if (this.$refs[`priceInput${newValue}`][0]) {
            this.$refs[`priceInput${newValue}`][0].focus();
          }
          // var currInput = dom[0];
          // currInput.focus();
        });
      }
    },
    index(newValue, oldValue) {
      this.numbers = [];
    },
  },
  computed: {
    total() {
      //
      let total = 0;
      if (this.orders.length > 0) {
        if (this.status == 0) {
          this.orders.forEach((item) => {
            if (
              item.resultDetailItemVos &&
              item.resultDetailItemVos.length > 0
            ) {
              item.resultDetailItemVos.forEach((good) => {
                total += isNaN(good.amount) ? 0 : Number(good.amount);
              });
            }
          });
        } else {
          this.orders.forEach((item) => {
            if (item.careOrderDetails && item.careOrderDetails.length > 0) {
              item.careOrderDetails.forEach((good) => {
                total += isNaN(good.amount) ? 0 : Number(good.amount);
              });
            }
          });
        }
      }
      return total;
    },
  },
  created() {
    this.getGoosType();
    this.getEaras();
    this.getAccountType();
    this.getListData();
  },
  methods: {
    accMul,
    // 显示右上角菜单i
    handleMenuShow() {
      this.menuShow = this.menuShow ? false : true;
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
    // 获取全部区域
    getAccountType() {
      axios
        .fetch("commonServer", "/dict/getItemViewsByGroup", {
          groups: "护理物品结算方式",
        })
        .then((res) => {
          console.log(res);
          if (res.data.length > 0) {
            res.data.forEach((item) => {
              const obj = {};
              obj.text = item.title;
              obj.value = item.itemValue;
              this.accountTypes.push(obj);
            });
          }
        });
    },
    // 获取生活用品下的所有二级分类
    getGoosType() {
      axios
        .fetch("careServer", "/careCategory/goodsType", {
          goodsType: 2,
        })
        .then((res) => {
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
    // 查询所有明细---待购买状态物品信息的请求
    getListData() {
      axios
        .fetch("careServer", "/careOrderDetail/all", {
          goodsType: 2,
          status: this.status,
          area: this.area,
          categoryId: this.categoryId,
        })
        .then((res) => {
          if (res.code == 200) {
            this.orders = res.data;
            this.orders.forEach((item) => {
              if (
                item.resultDetailItemVos &&
                item.resultDetailItemVos.length > 0
              ) {
                item.resultDetailItemVos.forEach((resultDetailItemVo) => {
                  resultDetailItemVo.amount =
                    resultDetailItemVo.amount == 0
                      ? ""
                      : resultDetailItemVo.amount;
                });
              }
            });
          }
        });
    },
    // 查询所有明细---已经购买状态物品信息的请求(老人的维度)
    getInfoByElder() {
      axios
        .fetch("careServer", "/careOrderDetail/yetBuy", {
          startTime: this.purchaseDateRange[0],
          endTime: this.purchaseDateRange[1],
          area: this.area,
          accountType: this.accountType,
        })
        .then((res) => {
          if (res.code == 200) {
            this.orders = res.data;
            this.orders.forEach((item) => {
              if (item.careOrderDetails && item.careOrderDetails.length > 0) {
                item.careOrderDetails.forEach((resultDetailItemVo) => {
                  resultDetailItemVo.amount =
                    resultDetailItemVo.amount == 0
                      ? ""
                      : resultDetailItemVo.amount;
                });
              }
            });
          }
        });
    },
    // 处理状态筛选
    handleStatusChange(val) {
      // console.log(val);
      this.activeName = "0";
      if (val == 1) {
        this.getInfoByElder();
      } else {
        this.getListData();
      }
    },
    //
    handleGoodsTypeChange() {
      this.activeName = "0";
      this.getListData();
    },
    // 处理区域筛选
    handleEaraChange(val) {
      // console.log(val);
      this.activeName = "0";
      if (this.status == 1) {
        this.getInfoByElder();
      } else {
        this.getListData();
      }
    },
    // 处理结算方式变化
    handleTypeChange() {
      this.activeName = "0";
      this.getInfoByElder();
    },
    // 点击切换记账方式
    changFianceType(i, index) {
      if (this.status == 0) {
        console.log(this.orders[i].resultDetailItemVos[index]);
      }
      if (this.status == 1) {
        console.log(this.orders[i].careOrderDetails[index]);
        this.orders[i].careOrderDetails[index].accountType =
          this.orders[i].careOrderDetails[index].accountType == 0 ? 2 : 0;
      }
    },
    // 时间选择
    onConfirm(date) {
      this.show = false;
      if (this.calendarType == "range") {
        //
        console.log(date);
        this.purchaseDateRange = [
          this.$moment(date[0]).format("YYYY-MM-DD"),
          this.$moment(date[1]).format("YYYY-MM-DD"),
        ];
        this.getInfoByElder();
      } else {
        this.purchaseDate = this.$moment(date).format("YYYY-MM-DD");
      }
    },
    /** 数字键盘事件 */
    inputPrice(i, index) {
      console.log(i, index);
      this.yijiIndex = i;
      this.index = index;
      this.amount = "";
      this.numberShow = true;
    },
    onInput(val) {
      this.numbers.push(val);
      this.orders[this.yijiIndex].resultDetailItemVos[
        this.index
      ].amount = this.numbers.join("");
    },
    onDelete() {
      this.numbers.pop();
      this.orders[this.yijiIndex].resultDetailItemVos[
        this.index
      ].amount = this.numbers.join("");
    },
    /** end */
    /*对焦到下一个input框去*/
    nextFocus(el, index, total, i) {
      // console.log(el, index, total, i);
      var dom = this.$refs[`priceInput${i}`];
      var currInput = dom[index];
      var nextInput = dom[index + 1];
      /*这里的keyCode 根据不同的平台或许不同,安卓就是不是8*/
      if (el.keyCode == 13) {
        if (index < total - 1) {
          nextInput.focus();
        } else {
          currInput.blur();
          if (this.activeName < this.orders.length - 1) {
            this.activeName++;
          } else {
            this.activeName = "0";
          }
          // this.nextFocus(el, 0, this.orders[this.activeName].resultDetailItemVos.length, Number(this.activeName))
        }
      }
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
            if (this.status == 0) {
              this.orders[i].resultDetailItemVos.splice(index, 1);
              this.getListData();
            } else {
              this.orders[i].careOrderDetails.splice(index, 1);
              this.getInfoByElder();
            }
            this.$toast.success("删除成功");
          }
        });
    },
    // 确认购买
    onPurchaseConfirm(text) {
      let param = [];
      if (this.orders.length > 0) {
        this.orders.forEach((item) => {
          if (this.status == 0) {
            if (item.resultDetailItemVos.length > 0) {
              item.resultDetailItemVos.forEach((o) => {
                // 代购买状态时 价格为空或者为0时 状态不能变成已购买
                // status 还是为0
                if (o.status == 0) {
                  o.status = o.amount <= 0 ? 0 : 1;
                }
                o.buyTime = this.purchaseDate;
                param.push(o);
              });
            }
          } else {
            if (item.careOrderDetails.length > 0) {
              item.careOrderDetails.forEach((o) => {
                // 代购买状态时 价格为空或者为0时 状态不能变成已购买
                // status 还是为0
                // o.buyTime = this.purchaseDate;
                o.status = 1;
                param.push(o);
              });
            }
          }
        });
      }
      console.log(param, "======");
      if (param.length > 0) {
        if (this.status == 0) {
          // 代购买状态时
          // 只要价格全部为空时提示输入金额
          // 不去请求接口 部分为空继续请求接口
          const flag = param.every((item) => {
            return item.amount == "" || item.amount == "0";
          });
          if (flag) {
            this.$toast("请输入金额");
            return;
          }
        } else {
          // 已经购买的物品 修改价格时
          // 有一个为空都要提示不能为空
          const result = param.some((item) => {
            return item.amount == "" || item.amount == "0";
          });
          if (result) {
            this.$toast("已购买物品金额不能为空且不能为0");
            return;
          }
          if (text == "确认结算") {
            const vaild = param.some((item) => {
              return item.accountType !== 2;
            });
            if (vaild) {
              this.$toast("存在记账方式的账单,请保存后结算!");
              return;
            }
          }
        }
        if (text == "确认结算") {
          this.$dialog
            .confirm({
              // title: "标题",
              message: "确认结算后将不可修改,是否继续?",
            })
            .then(() => {
              console.log(param, "====param");
              param.forEach((item) => {
                item.isAccounted = true;
              });
              // on confirm
              axios
                .fetch("careServer", "/careOrderDetail/buys", param, "josn")
                .then((res) => {
                  if (res.code == 200) {
                    this.$toast.success("结算成功");
                    this.getInfoByElder();
                  }
                });
            })
            .catch(() => {
              // on cancel
              this.$toast("取消结算");
            });
        } else {
          axios
            .fetch("careServer", "/careOrderDetail/buys", param, "josn")
            .then((res) => {
              if (res.code == 200) {
                this.$toast.success("操作成功");
                if (this.status == 0) {
                  this.getListData();
                } else {
                  this.getInfoByElder();
                }
              }
            });
        }
      }
    },
    // 结算方式为现金的确认结算
    onPay() {
      if (this.orders.length > 0) {
        this.orders.forEach((item) => {});
      }
    },
    // 处理金额输入
    handlePriceInput(value, i, index) {
      if (this.status == 0) {
        if (
          this.orders[i].resultDetailItemVos[index].amount &&
          this.orders[i].resultDetailItemVos[index].amount.indexOf(".") == 0
        ) {
          this.orders[i].resultDetailItemVos[index].amount = this.orders[
            i
          ].resultDetailItemVos[index].amount.replace(/\./g, "");
        }
        this.orders[i].resultDetailItemVos[index].amount = this.orders[
          i
        ].resultDetailItemVos[index].amount
          .replace(/^(\-)*(\d+)\.(\d).*$/, "$1$2.$3")
          .replace(/\-/g, "");
      } else {
        if (
          this.orders[i].careOrderDetails[index].amount &&
          this.orders[i].careOrderDetails[index].amount.indexOf(".") == 0
        ) {
          this.orders[i].careOrderDetails[index].amount = this.orders[
            i
          ].careOrderDetails[index].amount.replace(/\./g, "");
        }
        this.orders[i].careOrderDetails[index].amount = this.orders[
          i
        ].careOrderDetails[index].amount
          .replace(/^(\-)*(\d{1+)\.(\d).*$/, "$1$2.$3")
          .replace(/\-/g, "");
      }
    },
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
@import "../../assets/styles/common.less";
.order {
  height: 100%;
  .top {
    background-color: #fff;
    display: flex;
    .left {
      display: flex;
      flex: 1;
      @{deep} .van-dropdown-menu {
        flex: 1;
      }
    }
    .right {
      margin-left: 0.08rem;
      height: 0.48rem;
      box-sizing: border-box;
      width: 0.3rem;
      padding-top: 0.14rem;
      // background-color: #fff;
    }
    @{deep} .van-dropdown-menu {
      height: 100%;
      .van-dropdown-menu__bar {
        height: 100%;
      }
    }
  }
  .content {
    bottom: 0.8rem;
    @{deep} .van-collapse-item__wrapper {
      .van-collapse-item__content {
        .detail {
          .van-swipe-cell__wrapper {
            span:nth-child(3) {
              // width: 1rem;
              flex: 1;
              position: relative;
              padding-right: 30px;
              text-align: center;
              padding: 0.1rem 0.16rem 0.1rem 0.38rem;
              line-height: 0.22rem;
              display: flex;
              .van-field {
                border: 1px solid rgba(0, 0, 0, 0.2);
                width: 55%;
                padding: 0;
                .van-field__control {
                  text-align: center;
                }
              }
              p {
                line-height: 0.44rem;
                right: 32px;
                top: 0;
                position: absolute;
                margin: 0;
              }
            }
            .delete-button {
              display: block;
              height: 0.44rem;
              .van-button__content {
                display: block;
                // position: relative;
                line-height: 0.44rem;
              }
            }
          }
        }
      }
    }
  }
  .bottom {
    height: 0.68rem;
    display: flex;
    > div {
      flex: 2;
      @{deep} .van-button {
        height: 0.44rem;
        border-radius: 0.08rem;
      }
    }
    .left {
      flex: 1;
      p {
        padding-left: 8px;
        line-height: 0.44rem;
        margin: 0;
        font-size: 0.2rem;
        font-weight: 700;
      }
      //   p:nth-child(2) {
      //     font-size: 0.18rem;
      //     font-weight: 700;
      //   }
    }
    .right {
      line-height: 0.44rem;
      display: flex;
      justify-content: flex-end;
      > span {
        font-size: 0.12rem;
        color: rgba(0, 0, 0, 0.65);
      }
      .van-button {
        font-weight: 600;
        font-size: 0.14rem;
        margin-left: 16px;
      }
    }
  }
}
.orange {
  color: orange;
}
.green {
  color: green;
}
</style>
