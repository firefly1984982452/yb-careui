<template>
  <!-- 回院确认 -->
  <div class="back_confirm">
    <!-- <div class="header">
      <van-icon @click="$router.go(-1)" name="arrow-left" />
      <span>{{$route.query.elderName}}</span>
      (<span>{{$route.query.roomName}}-{{$route.query.bedName}}</span>)
    </div> -->
    <Back style="margin-bottom:0.12rem" :backWording="`${$route.query.elderName}(${$route.query.roomName}-${$route.query.bedName})`" :showTitle="false"></Back>
    <van-cell-group>
      <van-cell title="请假单号" :value="leaveInfoObj.leaveNo" />
      <van-cell title="请假事由" :value="leaveInfoObj.reason" />
      <van-cell title="请假计划" :value="`${leaveInfoObj.startDate}${leaveInfoObj.startDiet?'(餐)':''}`" />
      <van-cell title="请假说明" :value="leaveInfoObj.remark" />
      <van-cell title="创建人" :value="leaveInfoObj.creatorName" />
      <van-cell title="审核人" :value="leaveInfoObj.handlerName" />
      <!-- <van-cell title="审核说明" :value="leaveInfoObj.leaveNo" /> -->
      <van-cell title="外出时间" :value="leaveInfoObj.leaveTime" />
      <van-cell title="请假状态" :value="leaveInfoObj.status | statusFilter" />
    </van-cell-group>
    <!-- <div class="handle_btn" v-if="leaveInfoObj.status===1"> -->
    <div class="handle_btn">
      <van-button type="danger" block icon="delete" @click="cancelLeave" v-if="leaveInfoObj.leaveStatus===0">作废</van-button>
      <van-button type="primary" block icon="completed" v-if="moment().format('YYYY-MM-DD') >= moment(leaveInfoObj.startDate).format('YYYY-MM-DD')" @click="backConfirm">确认回院</van-button>
    </div>
    <!-- <div v-else-if="leaveInfoObj.status===0" style="margin: 16px">
      <van-button block type="primary" @click="leaveCheck">
        审核
      </van-button>
    </div> -->
    <van-popup v-model="show" position="top" :style="{ height: '100%' }">
      <van-form>
        <h2 style="text-align:center">填写回院信息</h2>
        <van-field name="radio" label="回院时间">
          <template #input>
            <van-radio-group v-model="radio">
              <div class="timeRadio">
                <van-radio name="1">当前时间</van-radio>
                <van-cell class="pickTime" v-if="radio==1" :value="nowDate" />
              </div>
              <div class="timeRadio">
                <van-radio name="2">其他时间</van-radio>
                <van-cell class="pickTime" @click="dateShow=true" v-if="radio==2" is-link :value="otherDate" />
              </div>
            </van-radio-group>
          </template>

        </van-field>
        <van-popup v-model="dateShow" position="bottom" :close-on-click-overlay="false">
          <van-datetime-picker v-model="currentDate" type="datetime" title="选择时间" @confirm="onTimeConfirm" @cancel="dateShow = false"  :min-date="minDate" :max-date="maxDate" />
        </van-popup>
        <van-field name="radio" label="是否就餐">
          <template #input>
            <van-radio-group v-model="radio1" direction="horizontal">
              <van-radio :name="1">是</van-radio>
              <van-radio :name="0">否</van-radio>
            </van-radio-group>

          </template>
        </van-field>
        <van-field v-model="returnRemark" rows="2" autosize label="回院备注" type="textarea" maxlength="50" placeholder="请输入备注" show-word-limit />
        <div style="margin: 16px;display:flex;justify-content:space-between">
          <van-button block type="primary" style="width:45%" @click="show = false">
            取消
          </van-button>
          <van-button block type="info" @click="returnTimeConfirm" style="width:45%">
            确认
          </van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>

<script type="text/javascript">
import moment from "moment";
export default {
  name: "BackConfirm",
  data() {
    return {
      elderId: "",
      leaveInfoObj: {}, // 请假单信息
      show: false, // 填写回院信息的弹框
      dateShow: false, // 回院时间的选择弹框
      otherDate: "", // 回院的其他时间
      nowDate: "", // 当前时间
      radio: "1", // 当前/其他时间的选择
      radio1: 1, // 是否就餐的选择
      returnRemark: "", //回院备注
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(),
    };
  },
  components: {},
  watch: {
    radio(newValue, oldValue) {
      if (newValue == 2) {
        this.otherDate = this.$moment().format("YYYY/MM/DD HH:mm");
        this.currentDate = new Date();
        // this.dateShow = true;
      }
    },
  },
  created() {
    this.elderId = this.$route.query.elderId;
    this.leaveInfo(this.elderId);
  },
  filters: {
    statusFilter: function (value) {
      // return value;
      switch (value) {
        case 0:
          return "待审核";
          break;
        case 1:
          return "已审核";
          break;
        case 2:
          return "已作废";
          break;

        default:
          break;
      }
    },
  },
  methods: {
    moment,
    // 获取请假单信息
    leaveInfo(elderId) {
      axios
        .fetch("elderServer", "/elderLeave/get/isLeaveFlow", {
          elderId,
        })
        .then((res) => {
          this.leaveInfoObj = res.data;
        });
    },
    // 点击回院确认按钮事件
    backConfirm() {
      this.show = true;
      this.nowDate = this.$moment().format("YYYY/MM/DD HH:mm");
      this.otherDate = this.$moment().format("YYYY/MM/DD HH:mm");
      this.radio = "1";
      this.radio1 = 1;
      this.returnRemark = "";
    },
    // 选择其他时间的确认事件
    onTimeConfirm(value) {
      this.otherDate = this.$moment(value).format("YYYY/MM/DD HH:mm");
      this.dateShow = false;
    },
    // 选择其他时间的取消事件
    handleCancel() {
      this.dateShow = false;
    },
    // 回院信息的提交
    returnTimeConfirm() {
      const param = {
        leaveId: this.leaveInfoObj.leaveId,
        endDiet: this.radio1,
        returnTime:
          this.radio == 1
            ? this.$moment(this.nowDate).format("YYYY-MM-DD HH:mm:ss")
            : this.$moment(this.otherDate).format("YYYY-MM-DD HH:mm:ss"),
        returnRemark: this.returnRemark,
      };
      // if (
      //   this.$moment(returnTime.returnTime) <
      //   this.$moment(this.leaveInfoObj.handleTime)
      // ) {
      //   this.$toast.warning("自定义时间不能早于审核时间");
      //   return;
      // }
      console.log(param);
      axios
        .fetch("elderServer", "/elderLeave/update/returnConfirm", param)
        .then((res) => {
          this.$toast("操作成功");
          this.$router.go(-1);
        });
    },
    // 请假单的审核事件
    leaveCheck() {
      this.$dialog
        .confirm({
          title: "请假单审核",
          message: "是否确定通过该请假单的审核?",
        })
        .then(() => {
          // on confirm
          axios
            .fetch("elderServer", "/elderLeave/mobile/check", {
              leaveId: this.leaveInfoObj.leaveId,
            })
            .then((res) => {
              this.$toast("操作成功");
              this.$router.go(-1);
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    // 请假单的作废
    cancelLeave() {
      this.$dialog
        .confirm({
          title: "作废",
          message: "是否作废该请假单?",
        })
        .then(() => {
          // on confirm
          axios
            .fetch("elderServer", "/elderLeave/invalid", {
              leaveId: this.leaveInfoObj.leaveId,
            })
            .then((res) => {
              this.$toast("操作成功");
              this.$router.go(-1);
            });
        })
        .catch(() => {
          // on cancel
          this.$toast("作废取消");
        });
    },
  },
};
</script>

<style lang="less" scoped>
.back_confirm {
  .header {
    height: 0.44rem;
    font-size: 0.16rem;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    display: flex;
    align-items: center;
    background-color: #fff;
    border-bottom: 1px solid #f8f8f8;
    margin-bottom: 0.12rem;
    i {
      font-size: 0.22rem;
      margin-right: 0.08rem;
    }
  }
  .handle_btn {
    display: flex;
    margin-top: 0.24rem;
    align-items: center;
    padding: 0 0.12rem;
    justify-content: space-between;
    .van-button {
      // width: 45%;
      flex: 1;
    }
    .van-button + .van-button {
      margin-left: 0.08rem;
    }
  }
  /deep/ .van-popup {
    .van-cell {
      .van-field__body {
        .van-radio-group {
          width: 100%;
          .van-radio__icon {
            margin-right: 8px;
          }
          .timeRadio {
            display: flex;
            justify-content: space-between;
          }
          .timeRadio + .timeRadio {
            margin-top: 0.08rem;
          }
        }
      }
      .pickTime {
        padding: 0px;
        width: auto;
        .van-cell__value {
          text-align: right;
        }
      }
    }
  }
}
</style>
