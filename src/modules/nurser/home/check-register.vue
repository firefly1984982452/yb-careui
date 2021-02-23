<template>
  <div class="check-register">
    <!-- <van-tabs v-model="active"> -->
    <!-- <van-tab title="查房巡视"> -->

    <!-- <van-cell title="巡视时间" :value="time" @click="dateShow = true" is-link /> -->
    <!-- <div class="time">
      <van-cell title="巡视时间" :value="time" is-link />
    </div> -->
    <div class="content">
      <van-cell title="查房时段" :value="$route.query.timeName" />
      <div class="elder" v-if="elderId">
        <div class="left">
          <div class="avart">
            <img :src="elderPhoto?elderPhoto:require('@/assets/img/icon-bed-default.png')" alt="">
            <i v-if="isNew">新</i>
          </div>
          <div>
            <p>{{ elderName }}</p>
            <p>护理{{nursingLevel | filterLevel}}级&nbsp;&nbsp;{{roomName}}-{{bedName}}</p>
            <!-- <p>护理{{nursingLevel | filterLevel}}级</p> -->
          </div>
        </div>
        <div class="right">
          <ul class="van-ellipsis">
            <li v-for="tag in selectedTags" :key="tag">{{tag}}</li>
          </ul>
        </div>
        <van-icon name="arrow-down" v-if="show" @click="show=false" />
        <van-icon v-else @click="show=true" name="arrow-up" />
      </div>
      <ul class="reasons" v-if="!show">
        <li v-for="(reason,index) in reasons" :key="index" @click="selectReason(index)" :class="{'active':reason.active}">
          {{ reason.title }}
        </li>
      </ul>
      <div class="report">
        <van-field v-model="description" rows="3" autosize type="textarea" placeholder="请输入巡视报告" show-word-limit maxlength="50" />
        <div class="btn" @click="showModules">
          <span>
            <img src="../../../assets/img/modules.png" alt="">
            模板
          </span>
        </div>
      </div>
    </div>
    <!-- </van-tab> -->
    <!-- <van-tab title="查看记录"> -->
    <!-- <Record></Record> -->
    <!-- </van-tab> -->
    <!-- </van-tabs> -->
    <!-- <DatePicker :dateShow="dateShow" :type="'datetime'" @cancelFn="cancelFn" @confirmFn="confirmFn"></DatePicker> -->
    <div class="bottom">
      <van-button @click="handleCancel">返回</van-button>
      <van-button type="primary" @click="handleSave">保存</van-button>
    </div>
    <van-popup v-model="modulesShow" position="bottom" :style="{height:'3rem'}" closeable round>
      <span style="padding:0.08rem;line-height:0.4rem;height:0.4rem">选择模板</span>
      <van-tabs v-model="active" stricky @click="onTabClick">
        <van-tab v-for="(item,index) in parentModules" :title="item.title" :key="item.id">
          <ul class="module_text">
            <li v-for="(child,i) in childModles" :key="i" @click="selectText(child)">
              {{child.title}}
            </li>
          </ul>
        </van-tab>
      </van-tabs>
      <!-- <ul class="parent">
        <li v-for="(item,index) in parentModules" :key="index">
          {{item.title}}
        </li>
      </ul> -->
    </van-popup>
  </div>
</template>

<script type="text/javascript">
// import Record from "../../checkRoom/records";
// import DatePicker from "@/components/datePicker";
export default {
  name: "CheckRegister",
  props: ["sign"],

  data() {
    return {
      show: true,
      //   dateShow: false,
      isNew: "",
      active: 0,
      description: "", //护理说明
      //   time: "", //巡视时间
      reasons: [
        // {
        //   title: "请假",
        //   active: false,
        // },
        // {
        //   title: "新入",
        //   active: false,
        // },
        // {
        //   title: "转出",
        //   active: false,
        // },
        // {
        //   title: "转入",
        //   active: false,
        // },
        // {
        //   title: "重病",
        //   active: false,
        // },
        // {
        //   title: "住院",
        //   active: false,
        // },
        // {
        //   title: "离院",
        //   active: false,
        // },
        // {
        //   title: "死亡",
        //   active: false,
        // },
      ],
      elderId: "",
      elderName: "",
      roomName: "",
      bedName: "",
      elderPhoto: "",
      isNew: "",
      // 一级模板类别
      parentModules: [],
      //
      childModles: [],
      selectedTags: [], //选中的标签
      modulesShow: false,
    };
  },
  //   components: { Record, DatePicker },
  created() {
    this.getModules(0);
    this.getNurseTags();
  },
  filters: {
    filterLevel: (val) => {
      return ["", "一", "二", "三", "四", "五", "六"][val];
    },
  },
  methods: {
    /**
     *
     * 获取护理巡房标签
     */
    getNurseTags() {
      axios
        .fetch("commonServer", "/dict/getItemViewsByGroup", {
          groups: "护理巡房标签",
        })
        .then((res) => {
          if (res.data.length > 0) {
            console.log(res.data);
            res.data.forEach((item) => {
              const obj = {};
              obj.title = item.itemValue;
              obj.active = false;
              this.reasons.push(obj);
            });
            const id = Number(this.$route.query.id);
            if (id) {
              this.getCheckRecord(id);
            } else {
              this.elderId = this.$route.query.elderId
                ? Number(this.$route.query.elderId)
                : null;
              this.elderName = this.$route.query.elderName;
              this.roomName = this.$route.query.roomName;
              this.bedName = this.$route.query.bedName;
              this.nursingLevel = this.$route.query.nursingLevel;
              this.elderPhoto = this.$route.query.elderPhoto;
              this.isNew = this.$route.query.isNew = "false" ? false : true;
            }
          }
        });
    },
    /**
     * 获取模板内容
     */
    getModules(parentId) {
      axios
        .fetch("commonServer", "/template/list", {
          templateType: 1,
          parentId,
        })
        .then((res) => {
          if (res.code == 200 && res.data) {
            if (parentId == 0) {
              this.parentModules = res.data;
            } else {
              this.childModles = res.data;
            }
            console.log(res.data);
          }
        });
    },
    /**
     * 根据主键ID查看巡视记录
     */
    getCheckRecord(id) {
      axios
        .fetch("careServer", "/carePatrolItem/get/byId", {
          id,
        })
        .then((res) => {
          if (res.data) {
            this.elderId = res.data.elderId;
            this.elderName = res.data.elderName;
            this.nursingLevel = res.data.nursingLevel;
            this.roomName = res.data.roomName;
            this.bedName = res.data.bedName;
            this.elderPhoto = res.data.elderPhoto;
            this.isNew = res.data.isNew;
            this.selectedTags = res.data.tags ? res.data.tags.split(",") : [];
            this.description = res.data.description ? res.data.description : "";
            if (this.selectedTags.length > 0) {
              this.reasons.forEach((reason) => {
                this.selectedTags.forEach((tag) => {
                  if (reason.title == tag) {
                    reason.active = true;
                  }
                });
              });
            }
          }
        });
    },
    // 显示模板
    showModules() {
      this.modulesShow = true;
      this.getModules(this.parentModules[this.active].id);
    },
    // 模板切换
    onTabClick(name, title) {
      console.log(name, title);
      this.getModules(this.parentModules[name].id);
    },
    // 选择标签
    selectReason(index) {
      this.reasons[index].active = this.reasons[index].active ? false : true;
    },
    handleCancel() {
      this.$router.go(-1);
    },
    handleSave() {
      const result = [];
      this.reasons.forEach((item) => {
        if (item.active) {
          result.push(item.title);
        }
      });
      const param = !this.$route.query.id
        ? {
            taskId: Number(this.$route.query.taskId),
            elderId: Number(this.$route.query.elderId),
            description: this.description,
            tags: result.length > 0 ? result.join(",") : "",
          }
        : {
            id: Number(this.$route.query.id),
            description: this.description,
            tags: result.length > 0 ? result.join(",") : "",
          };
      const sigin = this.sign;
      let api = this.sign
        ? "/carePatrolItem/add"
        : this.$route.query.sign && this.$route.query.id
        ? "/carePatrolItem/careLeader/update"
        : "/carePatrolItem/update";
      axios.fetch("careServer", api, param).then((res) => {
        if (res.code == 200) {
          this.$toast.success("保存成功");
          this.$router.go(-1);
        }
      });
    },
    // 选择模板文字
    selectText(child) {
      this.description += child.title + "；";
      this.modulesShow = false;
    },
  },
};
</script>

<style lang="less" scoped>
.check-register {
  height: 100%;
  display: flex;
  flex-direction: column;

  p {
    margin: 0;
  }
  .content {
    margin-top: 0.12rem;
    flex: 1;
    padding: 0 0.12rem;
    .elder {
      height: 0.56rem;
      background-color: #fff;
      display: flex;
      align-items: center;
      padding: 0.12rem 0.08rem;
      .left {
        display: flex;
        align-items: center;
        flex: 1;
        img {
          height: 0.47rem;
          width: 0.47rem;
          border-radius: 50%;
          margin-right: 0.16rem;
        }
        .avart {
          position: relative;
          i {
            border-radius: 50%;
            text-align: center;
            position: absolute;
            top: 0;
            right: 0;
            background-color: #69ca8d;
            // display: inline-block;
            width: 0.18rem;
            height: 0.18rem;
            line-height: 0.18rem;
            font-style: normal;
            color: #fff;
            transform: translate(-50%, -50%);
          }
        }
        > div:nth-child(2) {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          p:nth-child(1) {
            font-size: 0.15rem;
            font-weight: 500;
            font-family: PingFangSC-Medium;
          }
          p:nth-child(2) {
            font-size: 0.12rem;
            color: rgba(0, 0, 0, 0.4);
          }
        }
      }
      .right {
        display: flex;
        align-items: center;
        width: 1rem;
        justify-content: space-between;
        padding-right: 0.08rem;
        > ul {
          align-items: center;
          display: flex;
          color: #ed9c23;
          display: block;
          width: 100%;
          text-align: right;
          li {
            display: inline;
            // float: right;
          }
          li + li {
            margin-left: 0.08rem;
          }
        }
      }
    }
    .reasons {
      display: flex;
      flex-wrap: wrap;
      background-color: #fff;
      li {
        line-height: 0.26rem;
        box-sizing: border-box;
        text-align: center;
        border: 1px solid #e9e9e9;
        height: 0.26rem;
        width: 24%;
        margin: 0.08rem calc(28% / 6);
        border-radius: 0.04rem;
      }
      li.active {
        color: #fff;
        background-color: #45c456;
        border-color: #45c456;
      }
    }
    .report {
      margin-top: 0.12rem;
      .van-cell::after {
        border: none;
      }
      .btn {
        background-color: #fff;
        display: flex;
        justify-content: flex-end;
        padding: 0.08rem 0.12rem 0.12rem 0;
        span {
          color: #5bdc88;
          padding: 0 0.1rem;
          display: flex;
          align-items: center;
          justify-content: space-around;
          border-radius: 0.23rem;
          height: 0.24rem;
          width: 0.56rem;
          border: 1px solid #5bdc88;
          img {
            height: 0.14rem;
            width: 0.14rem;
          }
        }
      }
    }
  }
  .bottom {
    height: 0.56rem;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 0 0.08rem;
    button {
      border-radius: 0.04rem;
    }
    button:nth-child(1) {
      width: 1.2rem;
      margin-right: 0.08rem;
    }
    button:nth-child(2) {
      flex: 1;
    }
  }
  .module_text {
    line-height: 0.32rem;
    padding: 0.08rem 0.12rem;
    li {
      padding: 0.04rem 0.12rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
  }

  /deep/ .van-tabs__line {
    background-color: #5bdc88;
  }
}
</style>
