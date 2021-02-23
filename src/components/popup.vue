<template>
  <div class="care-popup">
    <van-popup v-model="show" @click-overlay='clickOverlay' :closeable="closeable" :position="position" :style="{ height: height }">
      <slot class="tmpl" name="datePicker"></slot>
    </van-popup>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "CarePopup",
  props: {
    height: {
      type: String,
      default: ""
    },
    position: {
      type: String,
      default: "bottom"
    },
    show: {
      type: Boolean,
      default: false
    },
    closeable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    clickOverlay() {
      this.$emit("cancelFn");
    }
  }
};
</script>

<style lang="less" scoped>
</style>
