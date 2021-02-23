<template>
  <div></div>
</template>

<script>
import axios from 'axios';
import store from "@/store";
import types from "@/store/types";

export default {
  created() {
    this.logout();
  },
  methods: {
    // 登出
    logout() {
      let that = this;
      axios.fetch("userServer", "/user/logout", {}).then(res => {
        if (res.code == 200) {
          that.$toast.success("登出成功");
          that.$router.push({
            name: "PassportLogin",
            query: that.$route.query
          });
          store.commit(types.SetCurrentUser, {
            user: { } // 空对象为了保存其他信息，比如租户信息
          });
        }
      });
    },
  }
}
</script>