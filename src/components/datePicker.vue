<template>
  <div class="datePick">
    <!-- <van-popup v-model="dateShow" position="bottom" @click-overlay='clickOverlay' :style="{ height }">
      <van-datetime-picker v-model="date" :type="type" @confirm="confirmFn()" @cancel="cancelFn()" />
    </van-popup> -->
    <Popup :show="dateShow" v-bind="$attrs" v-on="$listeners" :position="'bottom'">
      <template slot="datePicker">
        <van-datetime-picker v-model="date" :type="type" @confirm="confirmFn()" @cancel="cancelFn()" />
      </template>
    </Popup>
  </div>
</template>

<script type="text/javascript">
import Popup from "./popup";
export default {
  name: "DatePick",
  props: {
    /**
     * 时间类型，
     * 可选值为
     * date
     * time
     * year-month
     * month-day
     */
    type: {
      type: String,
      default: "date"
    },
    dateShow: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: ""
    }
  },
  created () {
    // console.log(this.$attrs,'=====attrs');
    // console.log(this.$listeners,'=====listeners');
    ;
  },
  data() {
    return {
      date: new Date() // 事件选择器当前时间
    };
  },
  components: { Popup },
  inheritAttrs: false, // 可以关闭自动挂载到组件根元素上的没有在props声明的属性
  methods: {
    /** 时间选择事件 */
    confirmFn(val) {
      // 确定按钮
      this.$emit("confirmFn", this.date);
    },
    cancelFn() {
      this.$emit("cancelFn");
    }
    /** END */
  }
};
</script>

<style lang="less" scoped>
</style>
