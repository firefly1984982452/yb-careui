<template>
  <div class="record">
    <div class="elder" v-if="elderId">
      <div class="avart">
        <img :src="elderPhoto?elderPhoto:require('@/assets/img/icon-bed-default.png')" alt="">
        <i v-if="isNew">新</i>
      </div>
      <div>
        <p>{{ elderName }}</p>
        <p>护理{{nursingLevel | filterLevel}}级&nbsp;&nbsp;{{roomName}}-{{bedName}}</p>
      </div>
    </div>
    <div v-if="records.length>0" class="content" v-for="(record,index) in records" :key="index">
      <p>
        <span>{{record.operateTime}}</span>
        <span>{{record.operatorName}}</span>
      </p>
      <p>
        {{record.description|descriptionFilter}}
      </p>
      <div>
        <div class="tags van-ellipsis">
          <span v-for="(tag,i) in record.tags?record.tags.split(','):[]" :key="i">
            #{{tag}}
          </span>
        </div>
        <div class="handle_btn">
          <i @click="edit(record)" class="iconfont iconcaozuotubiao-bianji"></i>
          <span @click="edit(record)">修改</span>
          <i class="iconfont icontubiao-jichutubiao-shanchu-mianxing3x"></i>
          <span @click="handleDelete(record)">删除</span>
        </div>
      </div>
    </div>
    <van-empty v-else description="暂无巡视记录" />
    <!-- <bottom></bottom> -->
  </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "Record",
  data() {
    return {
      records: [],
      elderId: "",
      elderName: "",
      roomName: "",
      bedName: "",
      elderPhoto: "",
      timeName: "",
      isNew: "",
    };
  },
  components: {},
  created() {
    this.elderId = this.$route.query.elderId
      ? Number(this.$route.query.elderId)
      : null;
    this.elderName = this.$route.query.elderName;
    this.roomName = this.$route.query.roomName;
    this.bedName = this.$route.query.bedName;
    this.elderPhoto = this.$route.query.elderPhoto;
    this.timeName = this.$route.query.timeName;
    this.nursingLevel = this.$route.query.nursingLevel;
    this.isNew = this.$route.query.isNew = "false" ? false : true;
    this.getCheckRecord(this.elderId);
  },
  filters: {
    descriptionFilter: function (value) {
      return value ? value : "无";
    },
  },
  filters: {
    filterLevel: (val) => {
      return ["", "一", "二", "三", "四", "五", "六"][val];
    },
  },
  methods: {
    edit(record) {
      this.$router.push({
        path: "/orderly/check-register",
        query: {
          id: record.id,
          timeName: this.timeName,
          sign: "护理班长",
        },
      });
    },

    // handle delete
    handleDelete(record) {
      this.$dialog
        .confirm({
          title: "删除记录",
          message: "是否要删除该巡视记录?",
        })
        .then(() => {
          // on confirm
          const id = record.id;
          axios
            .fetch("careServer", "/carePatrolItem/delete", {
              id: id,
            })
            .then((res) => {
              this.$toast(res.data);
              this.getCheckRecord(this.elderId);
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    /**
     * 根据老人ID查看巡视记录
     */
    getCheckRecord(elderId) {
      axios
        .fetch("careServer", "/carePatrolItem/careLeader/get/byElderId", {
          elderId,
        })
        .then((res) => {
          if (res.data && res.data.length > 0) {
            this.records = res.data;
          } else {
            this.records = [];
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.record {
  box-sizing: border-box;
  height: 100%;
  p {
    margin: 0;
  }
  padding: 0.12rem 0.12rem 0 0.12rem;
  .elder {
    height: 0.63rem;
    display: flex;
    align-items: center;
    background-color: #fff;
    padding-left: 0.12rem;
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
  .content {
    background-color: #fff;
    margin-top: 0.12rem;
    color: rgba(0, 0, 0, 0.4);
    font-size: 0.14rem;
    p {
      padding: 0 0.12rem;
    }
    p:nth-child(1) {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      line-height: 0.44rem;
      display: flex;
      justify-content: space-between;
    }
    p:nth-child(2) {
      line-height: 0.26rem;
    }
    > div {
      //   float: right;
      display: flex;
      // justify-content: space-between;
      line-height: 0.44rem;
      height: 0.44rem;
      .tags {
        flex: 1;
        padding-left: 0.12rem;
        color: #69ca8d;
      }
      .handle_btn {
        width: 1.5rem;
        text-align: right;
        color: #666666;
        padding-right: 0.12rem;
        i:nth-child(3) {
          margin-left: 0.08rem;
        }
      }
    }
  }
}
</style>
