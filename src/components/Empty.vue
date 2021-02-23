<template>
  <div class="empty">
    <img :src="imgUrl" alt="">
    <p>{{ description }}</p>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "Empty",
  props: {
    imgUrl: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: "暂无内容"
    }
  },
  data() {
    return {
    };
  },
  components: {}
};
</script>

<style lang="less" scoped>
.empty {
    // padding-top: 0.48rem;
    // height: 100%;
    img {
        margin-top: 1.2rem;
    }
    p {
        margin-top: -80px;
        text-align: center;
        font-size: 0.12rem;
        color: rgba(0, 0, 0, .4);
    }
}
</style>
