<template>
  <div class="info">
    <div class="content">
      <div class="card card_1">
        <van-cell title="区域" is-link @click="areaShow = true" :value="area" />
        <van-cell title="日期" is-link :value="date" @click="dateShow = true" />
        <van-cell title="班次" is-link :value="turn" @click="turnShow = true" />
      </div>
      <div class="card card_2">
        <p>
          交班人
        </p>
        <van-divider />
        <ul class="nursers">
          <li v-for="(jiaobaner,index) in jiaobaners" :key="index">
            {{jiaobaner.name}}
            <img @click="deleteMember(index,1)" src="../../assets/img/delete.png">
          </li>
          <li @click="handleNurserShow(0)">+</li>
        </ul>
      </div>
      <div class="card card_3">
        <p>
          接班人
        </p>
        <van-divider />
        <ul class="nursers">
          <li v-for="(jiebaner,index) in jiebaners" :key="index">
            {{jiebaner.name}}
            <img @click="deleteMember(index,2)" src="../../assets/img/delete.png">
          </li>
          <li @click="handleNurserShow(1)">+</li>
        </ul>
      </div>
    </div>
    <div class="bottom">
      <van-button style="width:40%" @click="back">返回</van-button>
      <van-button block type="primary" @click="next">下一步</van-button>
    </div>
    <van-popup v-model="areaShow" position="bottom">
      <van-picker title="" show-toolbar :columns="areas" @confirm="onConfirm" @cancel="onCancel" />
    </van-popup>
    <van-popup v-model="dateShow" position="bottom">
      <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" @confirm="onDateConfirm" @cancel="onDateCancel" />
    </van-popup>
    <van-popup v-model="turnShow" position="bottom">
      <van-picker title="" show-toolbar :columns="turns" @confirm="onTurnConfirm" @cancel="onTurnCancel" />
    </van-popup>
    <van-popup v-model="nursersShow" class="nursers" position="bottom" :style="{ height: '3rem' }">
      <div class="btn">
        <van-button size="small" @click="handleCancel">取消</van-button>
        <van-button size="small" type="info" @click="handleConfirm">确认</van-button>
      </div>
      <ul>

        <li @click="selectNurser(index)" v-for="(nurser,index) in nursers" :key="index" :class="{'active':nurser.active}">
          {{nurser.name}}
        </li>
      </ul>
    </van-popup>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "Info",
  data() {
    return {
      /**
       * 区域
       */
      areaShow: false,
      area: "",
      areaId: "",
      areas: [],
      /**
       * 日期
       */
      dateShow: false,
      date: this.$moment().format("YYYY-MM-DD"),
      currentDate: new Date(),
      /**
       * 班次
       */
      turn: "",
      turnId: "",
      turnShow: false,
      turns: [],
      /**
       * 护工人员
       */
      nursersShow: false,
      nursers: [],
      jiaobaners: [],
      jiebaners: [],
      currentType: 0, // 当前是交班人还是接班人
      detailID: null,
    };
  },
  components: {},
  mounted() {
    this.detailID = localStorage.getItem("addInfo");
    if (this.detailID !== null) {
      this.getDetail();
    }
    this.getEaras();
    this.getWorkTime(this.areaId);
  },
  // watch: {
  //   areaId(newValue) {
  //     this.turn = '';
  //     this.turnId="";
  //     this.getWorkTime(newValue)
  //   }
  // },
  methods: {
    // 获取已经存在的交班人
    getPatrolReportNext() {
      axios
        .fetch("careServer", "/carePatrolReport/next", {
          areaId: this.areaId,
        })
        .then((res) => {
          if (res.data.length > 0) {
            this.jiaobaners = res.data.map((val) => {
              let item = {
                name: val,
              };
              return item;
            });
          } else {
            this.jiaobaners = [];
          }
        });
    },
    // 获取区域
    getEaras() {
      axios.fetch("careServer", "/carePatrolReport/parentArea").then((res) => {
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
    // 获取所有班次
    getWorkTime(areaId) {
      if (areaId) {
        this.turns = [];
        axios
          .fetch("careServer", "/carePatrolReport/workTime", { areaId })
          .then((res) => {
            res.data.forEach((item) => {
              const obj = {};
              obj.text = item.timeName;
              obj.value = item.timeId;
              this.turns.push(obj);
            });
          });
      } else {
        this.turns = [];
      }
    },
    getDetail() {
      let val = JSON.parse(this.detailID);
      console.log(val);
      this.areaId = val.areaId;
      this.area = val.areaName;
      this.turnId = val.workTimeId;
      this.turn = val.workTimeName;
      this.date = val.reportDate;
      this.jiaobaners = val.currentCarers.split(",").map((val) => {
        let item = {
          name: val,
          active: false,
        };
        return item;
      });
      this.jiebaners = val.nextCarers.split(",").map((val) => {
        let item = {
          name: val,
          active: false,
        };
        return item;
      });
      this.$forceUpdate();
    },
    /**
     * 区域选择
     */
    onConfirm(value, index) {
      //   this.$toast(`当前值：${value.text}, 当前索引：${index}`);
      if (this.areaId !== value.value) {
        this.turn = "";
        this.turnId = "";
        this.getWorkTime(value.value);
      }
      this.area = value.text;
      this.areaId = value.value;
      this.areaShow = false;
      this.getPatrolReportNext();
    },
    onCancel() {
      this.areaShow = false;
    },
    /**
     * 日期选择
     */
    onDateConfirm(date) {
      this.date = this.$moment(date).format("YYYY-MM-DD");
      this.dateShow = false;
    },
    onDateCancel() {
      this.currentDate = new Date();
      this.dateShow = false;
    },
    back() {
      this.$router.back();
    },

    /**
     * 班次选择
     */
    onTurnConfirm(value) {
      console.log(value);
      this.turn = value.text;
      this.turnId = value.value;
      this.turnShow = false;
    },
    onTurnCancel() {
      this.turnShow = false;
    },
    /**
     * 交班人
     */
    handleNurserShow(type) {
      this.currentType = type;
      this.nursersShow = true;
      axios
        .fetch("careServer", "/carePatrolReport/bingEmployee")
        .then((res) => {
          if (res.data.length > 0) {
            this.nursers = res.data.map((val) => {
              let item = {
                name: val,
                active: false,
              };
              return item;
            });
          }
        });
    },
    deleteMember(index, member) {
      if (member == 1) {
        this.jiaobaners.splice(index, 1);
      } else {
        this.jiebaners.splice(index, 1);
      }
    },
    // 选择交班/接班人
    selectNurser(index) {
      this.nursers[index].active = this.nursers[index].active ? false : true;
    },
    handleConfirm() {
      let list = this.nursers.filter((item) => {
        return item.active;
      });
      if (this.currentType == 0) {
        this.jiaobaners = this.jiaobaners.concat(list);
        let currentList = [...new Set(this.jiaobaners.map((val) => val.name))];
        this.jiaobaners = currentList.map((val) => {
          let item = {
            name: val,
          };
          return item;
        });
      } else {
        this.jiebaners = this.jiebaners.concat(list);
        let currentList = [...new Set(this.jiebaners.map((val) => val.name))];
        this.jiebaners = currentList.map((val) => {
          let item = {
            name: val,
          };
          return item;
        });
      }
      this.nursersShow = false;
    },
    handleCancel() {
      this.nursersShow = false;
    },
    // 下一步
    next() {
      if (this.areaId == "") {
        return this.$toast.fail("请先选择区域！");
      }
      if (this.turnId == "") {
        return this.$toast.fail("请先选择班次！");
      }
      let currentCarers = this.jiaobaners.map((val) => {
        return val.name;
      });
      let nextCarers = this.jiebaners.map((val) => {
        return val.name;
      });
      if (currentCarers.length == 0) {
        return this.$toast.fail("请至少选择一个交班人！");
      }
      if (nextCarers.length == 0) {
        return this.$toast.fail("请至少选择一个接班人！");
      }
      let param = {
        areaId: this.areaId,
        areaName: this.area,
        workTimeId: this.turnId,
        workTimeName: this.turn,
        reportDate: this.date,
        currentCarers: currentCarers.join(","),
        nextCarers: nextCarers.join(","),
      };
      axios
        .fetch("careServer", "/carePatrolReport/isTask", {
          reportDate: param.reportDate,
          workTimeId: param.workTimeId,
          areaId: param.areaId,
        })
        .then((res) => {
          if (!res.data) {
            // 要添加的交班信息
            localStorage.setItem("addInfo", JSON.stringify(param));
            localStorage.setItem("in-type", "info");
            this.$emit("changePage", 1);
          } else {
            this.$dialog
              .confirm({
                title: "提示",
                message:
                  "此班次内的查房任务未全部完成,强制交班将自动终止未完成的查房任务",
              })
              .then(() => {
                // 要添加的交班信息
                localStorage.setItem("addInfo", JSON.stringify(param));
                localStorage.setItem("in-type", "info");
                this.$emit("changePage", 1);
              })
              .catch(() => {
                // on cancel
                this.$router.go(-1);
              });
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.info {
  height: 100%;
  display: flex;
  flex-direction: column;
  .content {
    .van-cell {
      font-size: 0.14rem;
    }
    padding: 0.12rem 0.06rem;
    flex: 1;
    overflow: auto;
    .card {
      background-color: #fff;
      padding: 0 0.04rem;
      border-radius: 0.08rem;
      margin-top: 0.12rem;
      > p {
        margin: 0;
        height: 0.32rem;
        line-height: 0.32rem;
        font-size: 0.14rem;
        font-weight: 600;
      }
      .van-divider {
        margin: 0;
      }
      .nursers {
        min-height: 1.5rem;
        // display: flex;
        li {
          width: 20%;
          display: inline-block;
          margin: 0.08rem 2.5%;
          //   float: left;
          height: 0.3rem;
          line-height: 0.3rem;
          text-align: center;
          border: 1px solid rgba(0, 0, 0, 0.4);
          border-radius: 0.04rem;
          position: relative;
          box-sizing: border-box;
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
      }
    }
  }
  .bottom {
    margin-top: 0.12rem;
    padding: 0 0.08rem;
    background-color: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 0.56rem;
    button {
      border-radius: 0.08rem;
    }
    button + button {
      margin-left: 0.08rem;
    }
  }
  .nursers.van-popup {
    padding-top: 0.08rem;
    width: 100%;
    height: 3rem;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .btn {
      height: 0.32rem;
      display: flex;
      justify-content: space-between;
      padding: 0 0.12rem;
      margin-bottom: 0.12rem;
      button {
        border-radius: 0.08rem;
      }
    }
    ul {
      flex: 1;
      overflow: auto;
    }
    li {
      display: inline-block;
      height: 0.3rem;
      line-height: 0.3rem;
      text-align: center;
      width: 25%;
      margin: 0.08rem calc(25% / 6);
      box-sizing: border-box;
      color: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 0.04rem;
    }
    li.active {
      color: #3e8ef7;
      border-color: #3e8ef7;
    }
  }
}
</style>
