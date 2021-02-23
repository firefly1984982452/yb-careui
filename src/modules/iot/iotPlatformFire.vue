<template>
  <div>
  </div>
</template>
<script>
// import { axios } from "youban-utils";
import qs from "qs";
export default {
  data() {
    return { loading: true };
  },
  computed: {},
  created() {
    let user = axios.getCurrentUser();
    // /iot/iotPlatformFire 的长度
    let hostname = window.location.href;
    hostname = hostname.substring(0,hostname.length - 20);
    let data = {
      loginUrl: hostname + "/console/login?redirect=/iot/iotPlatformFire",
      photoUrl: null,
    };
    axios
      .fetch(
        "commonServer",
        "/tenant/iot-platform-url",
        qs.stringify(data),
        null
      )
      .then((res) => {
        window.location.href = res.data;
      });
  },
  mounted() {},
  methods: {},
};
</script>