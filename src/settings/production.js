module.exports = {
  basePath: '/carerui/', // 项目部署的目录
  servers: {
    // 服务器地址列表
    commonServer: "/common-api", //公共服务
    userServer: "/user-api", //用户服务
    statServer: "/stat-api", //统计服务
    oaServer: "/oa-api", //办公服务
    attendanceServer: "/attendance-api", //考勤排班服务
    medicalServer: "/medical-api", //医护服务
    fireServer: "/fire-api", //消防服务
    elderServer: "/elder-api", //老人服务
    mediaServer: "/media-api", //媒体服务，比如上传文件等
    financeServer: "/finance-api", //结算服务
    familyServer: "/family-api", //家属服务
    datasyncServer: "/datasync-api", // 区网同步服务
    careServer: "/care-api", //护理服务
    dietServer: "/diet-api", //点餐服务
    activityServer: "/activity-api", //活动服务（开心养老）
  }
};
