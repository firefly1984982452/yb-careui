<template>
  <div class="unnormal_task">
    <div class="header">
      <van-icon name="delete"></van-icon>
      <span @click="allClear">一键清除</span>
    </div>
    <van-list
      v-if="listData.length > 0"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="queryUnnormalTask"
    >
      <van-cell v-for="(item, index) in listData" :key="index">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #title>
          <span class="van-ellipsis">
            {{ item.title }}
          </span>
        </template>
        <template #label>
          <div class="cell_m">时段：&nbsp;&nbsp;{{ item.description }}</div>
          <div class="cell_m" v-if="item.remark">
            对象：&nbsp;&nbsp;{{ item.remark }}
          </div>
          <div class="btn">
            <span class="tip">
              <van-icon name="warning" />
              <!-- 异常类型：{{ item.messageType }} -->
              异常类型：任务超时
            </span>
            <van-button
              @click="clearTip(item, index)"
              plain
              round
              type="primary"
              >清除提醒</van-button
            >
          </div>
        </template>
      </van-cell>
    </van-list>
    <van-empty v-else description="暂无异常任务" />
  </div>
</template>

<script type="text/javascript">
export default {
  name: "UnnormalTask",
  data() {
    return {
      listData: [],
      finished: false,
      loading: false,
      pageIndex: 1,
      pageSize: 10
    };
  },
  components: {},
  created() {
    this.queryUnnormalTask();
  },
  methods: {
    // unnormal task query
    queryUnnormalTask() {
      // console.log(this.pageIndex);
      axios
        .fetch("oaServer", "/oaMessage/get/byTypeReceiverId", {
          pageIndex: this.pageIndex++,
          pageSize: this.pageSize
        })
        .then(res => {
          this.loading = false;
          console.log(this.pageIndex);
          this.listData = this.listData.concat(res.data);
          console.log(this.listData.length, "======", res.total);
          if (this.listData.length === res.total) {
            this.finished = true;
          } else {
            this.finished = false;
          }
        });
    },
    // 一键清除
    allClear() {
      this.$dialog
        .confirm({
          title: "",
          message: "是否一键清除异常?"
        })
        .then(() => {
          // on confirm
          axios
            .fetch("oaServer", "/oaMessage/keyRemove/careRemind")
            .then(res => {
              // this.pageIndex = 1;
              // this.queryUnnormalTask();
              this.$toast("清除成功");
              this.$router.go(-1);
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    // clear tip
    clearTip(target, index) {
      axios
        .fetch("oaServer", "/oaMessage/update/isCurrent", {
          messageId: target.messageId
        })
        .then(res => {
          this.$toast(res.data);
          this.pageIndex = 1;
          // this.loading = true;
          this.listData = [];
          this.queryUnnormalTask();
        });
    }
  }
};
</script>

<style lang="less" scoped>
.unnormal_task {
  height: 100%;
  overflow: auto;
  padding: 0 0.12rem 0.08rem 0.12rem;
  .header {
    height: 0.4rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .van-icon {
      padding: 0.05rem;
      // border: 1px solid #ff9a4b;
      // border-radius: 50%;
      font-size: 0.16rem;
      color: #ff9a4b;
    }
    span {
      color: #ff9a4b;
    }
    .van-icon-delete::before {
      content: "\F044";
    }
  }
  .van-cell + .van-cell {
    margin-top: 0.08rem;
  }
  .van-cell {
    padding: 0.08rem;
    border-radius: 0.03rem;
    .van-cell__title {
      > span {
        display: inline-block;
        border-bottom: 1px solid #f6f6f6;
        width: 100%;
        line-height: 0.44rem;
        height: 0.44rem;
        font-size: 0.16rem;
        color: #333333;
      }
      .van-cell__label {
        .cell_m {
          line-height: 0.32rem;
          font-size: 0.14rem;
          color: rgba(0, 0, 0, 0.85);
        }
        .btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          line-height: 0.44rem;
          font-size: 0.14rem;
          .tip {
            display: flex;
            align-items: center;
            color: #ff9a4b;
            .van-icon {
              font-size: 0.18rem;
              margin-right: 0.05rem;
              //   background-color: #ff9a4b;
            }
          }
          .van-button {
            width: 0.98rem;
            height: 0.32rem;
            border-color: #69ca8d;
            .van-button__content {
              color: #69ca8d;
            }
          }
        }
      }
    }
  }
}
</style>
