<template>
  <div class="home-tab">
    <div class="top" v-show="show">
      <div
        v-for="(item, i) in tabs"
        :key="i"
        :class="{ cur: iscur == i }"
        @click="tabChange(item.name,i)">
        <img :src="iscur == i ? item.imageActive : item.image" alt="" srcset="">
        <span>{{ item.text }}</span>
      </div>
    </div>
    <div class="home-content">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive">
            </router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive">
            <router-view /> 
        </router-view>
    </div>
  </div>
</template>

<script>
import { wxconfig } from '@/utils/wechat';

let that;
export default {
  name: "rules",
  filters: {
  },
  created() {
    let data = window.location.pathname
    switch (data) {
      case "/home/home":
        this.tabView = 'page1';
        this.iscur = 0;
        break;
      case "/home/elder":
        this.tabView = 'page2';
        this.iscur = 1;
        break;
      case "/home/setting":
        this.tabView = 'page3';
        this.iscur = 2;
        break;
      default:
        break;
    }
  },
  data() {
    return {
      show: false,
      tabView: "page1",
      iscur: 0,
      tabs: [
        {
          text: "首页",
          name: "page1",
          image:require('../assets/img/icon-home-menu-01.png'),
          imageActive:require('../assets/img/icon-home-menu-active-01.png'),
        },
        {
          text: "长者",
          name: "page2",
          image:require('../assets/img/icon-home-menu-02.png'),
          imageActive:require('../assets/img/icon-home-menu-active-02.png'),
        },
        {
          text: "我的",
          name: "page3",
          image:require('../assets/img/icon-home-menu-03.png'),
          imageActive:require('../assets/img/icon-home-menu-active-03.png'),
        },
      ]
    };
  },
  watch: {
    $route(newValue, oldValue) {
      console.log(newValue,'=====newValue');
      if(newValue.name == '智慧护理工作台' || newValue.name == '住养服务' || newValue.name == '菜单列表') {
        this.$nextTick(()=>{
          this.show = true;
        })
      }else {
        this.$nextTick(()=>{
          this.show = false;
        })
      }
      console.log(this.show);
      if(newValue.path=="/home/home"){
        this.iscur = 0;
      } else if(newValue.path=="/home/setting"){
        this.iscur = 2;
      }else if(newValue.path=="/home/elder-index"){
          this.iscur = 1;
        }else {
        this.iscur = null;
      }
    }
  },
  beforeCreate(){
    that = this;
  },
  beforeRouteEnter(to, from, next) {
    if(to.name == '智慧护理工作台' || to.name == '住养服务' || to.name == '菜单列表') {
      next(vm=>{
        if(to.path=="/home/home"){
          vm.iscur = 0;
        } else if(to.path=="/home/setting"){
          vm.iscur = 2;
        }else if(to.path=="/home/elder-index"){
          vm.iscur = 1;
        }else {
          vm.iscur = null;
        }
        vm.show=true;
      })
    } else {
      next(vm=>{
        vm.show=false;
      })
    }
  },
  methods: {
    tabChange: function(tab,index) {
      let url = '/home/';
        switch (tab) {
          case 'page1':
                this.iscur = index;
                url += 'home';
                this.$router.push({path:url})
                break;
            case 'page2':
              this.iscur = index;
                url += 'elder-index';
                // this.wechatInvoke();
                // this.$toast('开发中')
                this.$router.push({path:url})
                break;
            case 'page3':
                this.iscur = index;
                url += 'setting';
                this.$router.push({path:url})
                break;
            default:
                break;
        }
        // this.$router.push({path:url})
    },
    wechatInvoke() { // 调用微信JSSDK
      wxconfig(['scanQRCode', 'chooseImage'], true).ready(() => {
        /* wx.scanQRCode({
          needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            console.log(res.resultStr); // 当needResult 为 1 时，扫码返回的结果
          }
        }) */
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有'album', 'camera'
          success: function (res) {
            let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            that.$toast.success(localIds[0]);
          }
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.home-tab {
  position: relative;
  flex:1;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .top {
    border-top: 1px solid #eee;
    position: fixed;
    width: 100%;
    bottom: 0;
    z-index: 3;
    padding: .05rem .35rem;
    box-sizing: border-box;
    background-color: #fefefe;
    display: flex;
    height: .50rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    div {
      box-sizing: border-box;
      width: .4rem;
      height: 100%;
      text-align: center;
      font-size: .14rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      img {
        width: .24rem;
        line-height: .24rem;
      }
      span {
        width: .4rem;
      }
    }
    div.cur {
      color: #45C456;
    }
  }
  .home-content {
    // padding-bottom: 0.12rem;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    // margin-bottom: .5rem;
    flex: 1;
  }
}
</style>
