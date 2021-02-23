module.exports = {
  // 正式环境
  appNo: "carerui", // 应用编码
  title: "", // 标题
  defaultAllow: "?", // 缺省所有的页面必须登录
  urls: {
    // 地址配置
    login: null, // 登录地址
    wechat: '/userui/wechat/login?from=carerui' // 微信登录地址
  },
  servers: {
    // 服务器地址列表，根据环境而变化
  },
  getServer: function(serverName) {
    if (!serverName) {
      console.error("getServer() required serverName!");
      return "";
    }
    let url = serverName.toLowerCase();
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("//")
    ) {
      return serverName;
    }
    url = this.servers[serverName];
    if (!url) {
      console.error("getServer() server [" + serverName + "] url not defined!");
    }
    return url;
  }
};
