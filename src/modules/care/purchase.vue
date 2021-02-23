<template>
  <div class="purchase">
    <!-- 头部区域 -->
    <div class="header">
      <div class="top">
        <i @click="goBack" class="iconfont iconjichutubiao-xiangzuojiantou"></i>
        <div class="swipe">
          <span class="last" @click="toLast">{{ last.roomName }}</span>
          <div style="width:20%">
            <van-swipe @change="swipeOnChange" ref="swipe" v-model="curRoom" :show-indicators="false">
              <van-swipe-item v-for="item in rooms" :key="item.roomId">{{item.roomName}}</van-swipe-item>
            </van-swipe>
          </div>
          <span class="next" @click="toNext">{{ next.roomName }}</span>
        </div>
        <i @click="selecRoom" class="iconfont iconjichutubiao-zhongxinyuding"></i>
      </div>
      <ul v-if="elders.length >= 5" class="_elders">
        <li class="van-ellipsis" v-for="(item, index) in elders" :key="index" @click="tabChange(index,item)" :class="{active:index == iscur}">{{ item.elderName }}</li>
      </ul>
      <ul v-if="elders.length < 5 && elders.length > 0" class="elders">
        <li class="van-ellipsis" v-for="(item, index) in elders" :key="index" @click="tabChange(index,item)" :class="{active:index == iscur}">{{ item.elderName }}</li>
      </ul>
    </div>
    <!-- 主要内容区域 -->
    <div class="content">
      <!-- 空内容式样 -->
      <div class="empty" v-if="!hasData">
        <div>
          <img src="../../assets/img/people.png" alt="">
        </div>
      </div>
      <!-- 有数据时 -->
      <div v-else v-for="(item,index) in listData" :key="index" class="list">
        <template v-if="item.data.length > 0">
          <div>
            <p>{{item.categoryType}}</p>
            <div>
              <van-swipe-cell v-for="(data,i) in item.data" :key="i">
                <template>
                  <span>{{data.goodsTitle}}</span>
                  <span v-if="data.goodsType == 0 ">￥{{ accMul(data.price,data.quantity) }}</span>
                  <span v-if="data.goodsType == 0 " class="step">
                    <van-stepper v-model="data.quantity" theme="round" button-size="22" disable-input />
                  </span>
                  <span v-if="data.goodsType == 0 ">{{ data.priceUnit }}</span>
                  <span v-if="data.goodsType == 1 ">￥{{ data.price }}</span>
                  <span v-if="data.goodsType == 1 " class="zhuyang">
                    {{ $moment(data.startTime).format('MM/DD') }}-{{ $moment(data.endTime).format('MM/DD') }}
                  </span>
                  <span v-if="data.goodsType == 2 ">￥{{ accMul(data.price,data.quantity) }}</span>
                  <span v-if="data.goodsType == 2 " class="unit">
                    <van-stepper v-model="data.quantity" theme="round" button-size="22" disable-input />
                  </span>
                  <span v-if="data.goodsType == 2 ">
                    <van-cell is-link :value="data.priceUnit" @click="selectUnit(data)" class="unit_popup" />
                  </span>
                </template>
                <template #right>
                  <van-button v-if="data.goodsType == 1 " type="primary" text="编辑" @click="edit(data)" />
                  <van-button square type="danger" text="删除" @click="beforeClose(index,i)" />
                </template>
              </van-swipe-cell>
            </div>
          </div>
          <!-- <div v-else-if="item.categoryType == '代订代购'">
            <p>{{item.categoryType}}</p>
            <div>
              <van-swipe-cell v-for="(data,i) in item.data" :key="i">
                <template>
                  <span>{{data.goodsTitle}}</span>
                  <span>￥{{ accMul(data.price,data.quantity) }}</span>
                  <span class="unit">
                    <van-stepper v-model="data.quantity" theme="round" button-size="22" disable-input />
                  </span>
                  <span>
                    <van-cell is-link :value="data.priceUnit" @click="selectUnit(data)" class="unit_popup" />
                  </span>
                </template>
                <template #right>
                  <van-button square type="danger" text="删除" @click="beforeClose(index,i)" />
                </template>
              </van-swipe-cell>
            </div>
          </div>
          <div v-else>
            <p>{{item.categoryType}}</p>
            <div>
              <van-swipe-cell v-for="(data,i) in item.data" :key="i">
                <template>
                  <span>{{data.goodsTitle}}</span>
                  <span>￥{{ data.price }}</span>
                  <span class="zhuyang">
                    {{ $moment(data.startTime).format('MM/DD') }}-{{ $moment(data.endTime).format('MM/DD') }}
                  </span>
                </template>
                <template #right>
                  <van-button v-if="item.categoryType=='住养服务'" type="primary" text="编辑" @click="edit(data)" />
                  <van-button square type="danger" text="删除" @click="beforeClose(index,i)" />
                </template>
              </van-swipe-cell>
            </div>
          </div> -->
        </template>
      </div>
    </div>
    <!-- 所有类别 -->
    <van-popup class="careGoods" v-model="selectShow" position="bottom" closeable>
      <van-tabs v-model="active" @click="yijiTypeClick">
        <template v-for="(item,i) in classics">
          <van-tab :title="item.itemValue" v-if="item.itemValue == classicWordings[0]" :key="i">
            <van-tree-select :items="goods" @click-nav="goodTypeClick" @click-item="clikItem" :active-id.sync="activeIds" :main-active-index.sync="activeIndex" />
          </van-tab>
          <van-tab v-else-if="item.itemValue == '代订代购'" :title="classicWordings[1]" :key="i">
            <van-tree-select :items="purchase" @click-nav="purchaseTypeClick" @click-item="purChaseClikItem" :active-id.sync="purchaseActiveIds" :main-active-index.sync="purchaseActiveIndex" />
          </van-tab>
          <van-tab v-else-if="item.itemValue == '个性服务'" :title="classicWordings[2]" :key="i">
            <div class="serviceProject">
              <van-button type="default" round size="small" v-for="(serve,index) in service" :key="index" :disabled="serve.dis" @click="handleServeClcik(serve,index)">{{serve.goodsTitle}}</van-button>
            </div>
            <!-- <van-tree-select :items="purchase" @click-nav="purchaseTypeClick" @click-item="purChaseClikItem" :active-id.sync="purchaseActiveIds" :main-active-index.sync="purchaseActiveIndex" /> -->
          </van-tab>
          <van-tab v-else :title="classicWordings[3]" :key="i">
            <van-tree-select :items="other" @click-nav="otherTypeClick" @click-item="otherItemClick" :active-id.sync="otherActiveIds" :main-active-index.sync="otherActiveIndex" />
          </van-tab>
        </template>
      </van-tabs>
    </van-popup>
    <!-- 房间弹框 -->
    <van-dialog v-model="roomVisible" title="选择房间" :close-on-click-overlay="true" @open="open" @confirm="confirm">
      <ul class="rooms">
        <li v-for="(item,index) in rooms" :key="index" @click="pickRoom(item,index)" :class="{active:index == tempIndex }">{{ item.roomName }}</li>
      </ul>
    </van-dialog>
    <!-- 代订代购选择其他出来的弹层 -->
    <van-popup v-model="otherShow" class="full-popup" position="bottom" :style="{ height: '100%' }">
      <div class="top">
        <i @click="otherBack" class="iconfont iconjichutubiao-xiangzuojiantou"></i>
        <span>{{currentOther.categoryTitle}}</span>
        <span v-if="elders.length > 0 " style="float:right;">{{elders[this.iscur].elderName}}{{curRoom.roomName}}-{{elders[this.iscur].bedName}}</span>
      </div>
      <!-- <van-form @submit="onSubmit"> -->
      <van-field v-model.trim="otherForm.goodsTitle" name="goodsTitle" label="物品名称" placeholder="物品名称" />
      <van-field v-model.trim="otherForm.price" name="price" type="number" label="单价" placeholder="单价" ref="otherPrice" />
      <van-cell title="单位" is-link :value="otherForm.priceUnit" @click="show = true" />
      <van-popup v-model="show" position="bottom">
        <van-picker title="单位" show-toolbar :columns="priceUnits" @confirm="onConfirm" @cancel="onCancel" @change="onChange" />
      </van-popup>
      <div style="margin: 16px;">
        <van-button round block type="info" @click="onSubmit">
          保存
        </van-button>
      </div>
      <!-- </van-form> -->
    </van-popup>
    <!-- 住养服务项目时的弹层 -->
    <van-popup v-model="serviceShow" class="full-popup" position="bottom" :style="{ height: '100%' }">
      <div class="top">
        <i @click="serviceBack" class="iconfont iconjichutubiao-xiangzuojiantou"></i>
        <span>{{currentService.goodsTitle}}</span>
        <span v-if="elders.length > 0" style="float:right;">{{elders[this.iscur].elderName}}{{curRoom.roomName}}-{{elders[this.iscur].bedName}}</span>
      </div>
      <!-- <van-form @submit="serviceSubmit"> -->
      <van-cell title="开始" :value="serviceForm.startTime" @click="seviceDateShow = true" is-link />
      <!-- <van-calendar v-model="seviceDateShow" :show-confirm="false" /> -->
      <van-popup v-model="seviceDateShow" position="bottom">
        <van-datetime-picker v-model="startTime" type="date" title="选择年月日" @confirm="onStartTimeConfirm" @cancel="onStartTimeCancel" />
      </van-popup>
      <van-cell title="结束" :value="serviceForm.endTime" @click="seviceEndDateShow = true" is-link />
      <!-- <van-calendar v-model="seviceDateShow" :show-confirm="false" /> -->
      <van-popup v-model="seviceEndDateShow" position="bottom">
        <van-datetime-picker v-model="endTime" type="date" title="选择年月日" @confirm="onEndTimeConfirm" @cancel="onEndTimeCancel" />
      </van-popup>
      <div class="price">
        <!-- <div class="van-cell van-field">
            <div class="van-cell__title van-field__label"><span>金额</span></div>
            <div class="van-cell__value van-field__value">
              <div class="van-field__body"><input autofocus="autofocus" id="price" type="text" v-model.trim="serviceForm.price" inputmode="decimal" class="van-field__control otherPrice"></div>
            </div>
          </div> -->
        <van-field v-model.trim="serviceForm.price" type="number" name="price" label="金额" ref="otherPrice" />

        <span data-v-7a1bac2e="" class="unit">元</span>
      </div>
      <!-- <div class="price">
          <van-field ref="price_ref" v-model.trim="serviceForm.price" type="number" label="金额" />
          <span class="unit">元</span>
        </div> -->
      <div style="margin: 16px;">
        <van-button round block type="info" @click="serviceSubmit">
          保存
        </van-button>
      </div>
      <!-- </van-form> -->
    </van-popup>
    <van-popup v-model="listSelecShow" position="bottom">
      <van-picker title="单位" show-toolbar :columns="priceUnits" @confirm="onListConfirm" @cancel="onListCancel" />
    </van-popup>
    <!-- 底部区域 -->
    <div class="bottom">
      <span @click="handleShow">
        <i class="iconfont iconjichutubiao-tianjia-huise"></i>
        添加
      </span>
      <!-- <van-button type="default" @click.stop="handleShow" style="float:left;color:black" icon="plus">添加</van-button> -->
      <van-button round type="info" @click.prevent="save" :disabled="elders.length == 0">保存</van-button>
    </div>
  </div>
</template>

<script type="text/javascript">
import axios from "axios";
import { accMul } from "@/utils";
export default {
  name: "Purchase",
  data() {
    return {
      show: false,
      listSelecShow: false,
      /** 老人相关 */
      iscur: 0, // 当前被选中的老人index 默认第一个
      roomIndex: 0, // 默认选择房间弹框中被选中的是第一个
      tempRoom: {}, // 过渡用
      tempIndex: 0,
      curRoom: {}, //当前选中的房间信息
      last: {}, // 上一个房间信息
      next: {}, // 下一个房间信息
      roomVisible: false, //房间选择弹框显示/隐藏
      elders: [], // 对应房号中老人们
      rooms: [], // 该区域内的所有房间
      /** end */
      active: 0, // 一级分类 选中的index
      selectShow: false, //选择分类物品 显示/隐藏
      /** 生活物品 */
      goods: [], // 二级及三级分类
      activeIndex: 0, // 二级分类选中的index
      activeIds: [], // 选中的数据
      /** end */
      /** 住养服务 */
      service: [], // 二级及三级分类---住养服务
      serviceShow: false,
      currentService: {},
      seviceDateShow: false,
      seviceEndDateShow: false,
      serviceForm: {
        startTime: "",
        endTime: "",
        price: ""
      },
      startTime: new Date(),
      endTime: new Date(),
      /** end  */
      /** 代订代购 */
      tempListData: {},
      purchase: [], //二级及三级分类---代订代购
      purchaseActiveIds: [],
      purchaseActiveIndex: 0,
      otherShow: false, //添加其他品类的浮层
      currentOther: {},
      priceUnits: ["件", "只", "个", "斤", "瓶", "包", "箱"],
      otherForm: {
        accountType: 0,
        categoryId: "",
        categoryType: "",
        evidence: "",
        goodsFrom: 0,
        goodsType: 2
      },
      evidenceList:[],
      /** end */
      /** 其他 */
      otherActiveIndex: 0,
      otherActiveIds: [],
      other: [],
      /**end */
      // 列表展示数据以及需要保存的数据
      listData: [],
      classicWordings: [],
      classics: [], //一级分类
      hasPeriod: false, // 默认消费没有周期
      buildingId: ""
    };
  },
  components: {},
  created() {
    this.getOptionData();
    this.yijiTypeClick(0, "生活用品");
    axios.fetch("oaServer", "/org/building/list").then(result => {
      this.buildingId = result.data[0].buildingId;
      // 根据房间号获取房间信息
      const roomName = this.$route.query.roomName;
      // this.roomId = this.$route.query.roomId;
      this.getRoomInfo().then(res => {
        console.log(res);
        this.rooms = res;
        res.forEach(item => {
          // console.log(item);
          // item.buildingRoomVos.forEach(o => {
          // if (item.roomName == roomName) {
          if (item.roomId === Number(this.$route.query.roomId)) {
            console.log(item,'=====');
            // 根据输入的房间号 筛选出当前房间的信息数据
            this.curRoom = item;
            // 查询老人信息
            this.queryInfoByRoom(this.curRoom.roomId);
            // 跳转到输入的房间号
            this.jumpToRoom(this.curRoom);
          }
          // });
          this.roomIndex = this.tempIndex = this.rooms.indexOf(this.curRoom);
        });
        this.queryLastNext(this.rooms.indexOf(this.curRoom));
      });
    });
  },
  computed: {
    // 判断是否有数据
    hasData() {
      return this.listData.some(item => {
        if (item.data) {
          return item.data.length > 0;
        }
      });
    }
  },
  methods: {
    accMul,
    // 从字典获取列表
    getOptionData() {
      let arr = ["收费项目", "护理物品单位",'物品消费凭证'];
      axios
        .fetch("commonServer", "/dict/getItemViewsByGroup", {
          groups: arr.join(",")
        })
        .then(res => {
          let data = res.data;
          this.classics = data.filter(
            item => item.itemGroup == "收费项目" && item.parentNo == "消费项"
          );

          // 根据一级分类初始化列表数据
          this.classics.forEach(item => {
            this.classicWordings.push(item.itemNo);
            this.listData.push({
              categoryType: item.itemNo,
              data: []
            });
          });
          console.log(this.classicWordings, "========");
          const priceUnits = data.filter(
            item => item.itemGroup == "护理物品单位"
          );
          priceUnits.forEach(item => {
            this.priceUnits.push(item.itemValue);
          });
          this.evidenceList = data.filter(
            item => item.itemGroup == "物品消费凭证"
          );
          console.log(this.evidenceList);
          this.otherForm.evidence = this.evidenceList[0].itemValue;
        });
    },
    // 操作展示数据 type: 添加和删除 push splice
    // categoryType: 一级分类的名称
    // data 具体需要操作的数据
    handleListData(type, categoryType, data) {
      this.listData.forEach(item => {
        if (item.categoryType == categoryType) {
          if (type == "push") {
            item.data.push(data);
          } else {
            const o = item.data.filter(obj => {
              return obj.id == data.id;
            });
            item.data.splice(item.data.indexOf(...o), 1);
          }
        }
      });
    },
    // 根据当前房间 查询上一个和下一个
    queryLastNext(index) {
      const lastIndex = index - 1;
      const nextIndex = index + 1;
      if (lastIndex < 0) {
        this.last = this.rooms[this.rooms.length - 1];
      } else {
        this.last = this.rooms[lastIndex];
      }
      this.next =
        nextIndex == this.rooms.length ? this.rooms[0] : this.rooms[nextIndex];
    },
    // 跳转到指定的房间
    jumpToRoom(room) {
      console.log(room);
      // 有数据但没有保存时
      if (this.hasData) {
        this.$dialog
          .confirm({
            title: "",
            message: "是否保存当前输入内容"
          })
          .then(() => {
            // on confirm
            this.save();
            this.$nextTick(function() {
              this.rooms.forEach((item,index)=>{
            if(item.roomId === room.roomId){
              this.$refs.swipe.swipeTo(index);
            }
          })
              // this.$refs.swipe.swipeTo(this.rooms.indexOf(room));
            });
            this.resetListData();
          })
          .catch(() => {
            // on cancel
            this.$nextTick(function() {
              this.rooms.forEach((item,index)=>{
                if(item.roomId === room.roomId){
                  this.$refs.swipe.swipeTo(index);
                }
              })
              // this.$refs.swipe.swipeTo(this.rooms.indexOf(room));
            });
            this.resetListData();
          });
      }
      // 没有数据 随意跳转
      if (!this.hasData) {
        this.$nextTick(function() {
          this.rooms.forEach((item,index)=>{
            if(item.roomId === room.roomId){
              this.$refs.swipe.swipeTo(index);
            }
          })
        });
        this.removeDisabled(null);
      }
    },
    //返回上一级
    goBack() {
      if (!this.hasData) {
        this.$router.go(-1);
      } else {
        this.$dialog
          .confirm({
            title: "",
            message: "是否保存当前添加的内容",
            confirmButtonText: "保存",
            cancelButtonText: "不保存"
          })
          .then(() => {
            // on confirm
            this.save();
          })
          .catch(() => {
            // on cancel
            this.$router.go(-1);
          });
      }
    },
    // 根据房间号查询老人及采购信息
    async queryInfoByRoom(id) {
      const param = {
        roomId: id
      };
      const res = await axios.fetch("elderServer", "/elderInfo/byRoom", param);
      this.elders = res.data;
    },
    // 获取所有房间信息
    async getRoomInfo() {
      let param = {
        // buildingId: this.buildingId,
        pageIndex: 1,
        pageSize: 999
      };
      const res = await axios.fetch("oaServer", "/org/room/list", param);
      return res.data;
    },
    // 切换老人事件
    tabChange(i, data) {
      // 有数据没有保存的情况

      if (this.hasData) {
        this.$dialog
          .confirm({
            title: "",
            message: "是否保存当前输入内容"
          })
          .then(() => {
            // on confirm
            this.save();
            this.iscur = i;
          })
          .catch(() => {
            // on cancel
            this.iscur = i;
            //重置数据
            this.resetListData();
          });
      } else {
        this.iscur = i;
      }
      this.removeDisabled(null);
    },
    // 轮播 房间号变化事件
    swipeOnChange(index) {
      this.iscur = 0;
      this.tempIndex = this.roomIndex = index;
      // this.$toast("当前 Swipe 索引：" + index);
      this.curRoom = this.rooms[index];
      this.queryLastNext(index);
      // 查询老人信息
      this.queryInfoByRoom(this.curRoom.roomId);
    },
    // 点击上一个房间号事件
    toLast() {
      this.jumpToRoom(this.last);
      //   this.$refs.swipe.swipeTo(this.rooms.indexOf(this.last));
    },
    // 点击下一个房间号事件
    toNext() {
      this.jumpToRoom(this.next);
      //   this.$refs.swipe.swipeTo(this.rooms.indexOf(this.next));
    },
    // 点击选择房间按钮
    selecRoom() {
      this.roomVisible = true;
    },
    open() {
      this.tempIndex = this.roomIndex;
    },
    // 选择房间事件
    pickRoom(item, index) {
      this.tempIndex = index;
      // this.roomIndex = index;
      this.tempRoom = item;
    },
    // 房间选好后的确认事件
    confirm() {
      this.curRoom = this.tempRoom;
      if (this.roomIndex != this.tempIndex) {
        this.roomIndex = this.tempIndex;
        this.jumpToRoom(this.curRoom);
      }
      this.roomVisible = false;
    },
    // 获取二级级分类
    async getCategory(categoryType) {
      const res = axios.fetch("careServer", "/careCategory/all", {
        categoryType: categoryType,
        viewLeader: true,
        viewCarer: false
      });
      return res;
    },
    // 获三级物品
    async getGoods(categoryTitle) {
      const res = axios.fetch("careServer", "/careGoods/all", {
        categoryTitle: categoryTitle,
        pageSize: 999,
        pageIndex: 1
      });
      return res;
    },
    // 删除事件
    beforeClose(index, i) {
      // console.log(this.listData[index].data[i]);
      let data;
      console.log(index);

      if (index == 0) {
        // 生活用品
        data = this.goods;
        this.activeIds.splice(i, 1);
      } else if (index == 2) {
        // 住养服务
        data = this.service;
        const goodsId = this.listData[index].data[i].id;
        this.service.forEach(item => {
          if (item.id == goodsId) {
            // 恢复住养服务 消费项目按钮禁用状态
            item.dis = false;
          }
        });
      } else if (index == 1) {
        // 代订代购
        data = this.purchase;
        this.purchaseActiveIds.splice(i, 1);
      } else {
        // 其他
        data = this.other;
        this.otherActiveIds.splice(i, 1);
      }
      // this.removeDisabled(index, this.listData[index].data[i].name, data);
      this.listData[index].data.splice(i, 1);
      this.$toast.success("删除成功");
    },
    // 显示选择物品弹层
    handleShow() {
      if (this.elders.length > 0) {
        this.selectShow = true;
      } else {
        this.$toast("暂无老人");
      }
    },
    // 移除 禁用状态
    removeDisabled(categoryType, goodsTitle, data) {
      if (categoryType !== null) {
        data.forEach(item => {
          if (item.goodsTitle == goodsTitle) {
            item.dis = false;
          }
        });
      } else {
        // this.getConsumes();
      }
    },
    // 一级分类点击事件
    yijiTypeClick(index, title, other) {
      if (title !== this.classicWordings[2]) {
        // 二级分类
        let erjiCate;
        let active_index;
        if (title == this.classicWordings[0]) {
          active_index = this.activeIndex;
        } else if (title == this.classicWordings[1]) {
          active_index = this.purchaseActiveIndex;
        } else {
          active_index = this.otherActiveIndex;
        }

        // if (title == "代订代购") {
        this.getCategory(title).then(res => {
          res.data.forEach((item, i) => {
            item.text = item.categoryTitle;
            item.children = [];
          });
          erjiCate = res.data;
          this.hasPeriod = erjiCate[active_index].dataPeriod ? true : false;
          this.getGoods().then(res => {
            res.data.forEach((item, i) => {
              if (item.categoryTitle == erjiCate[active_index].categoryTitle) {
                item.text = item.goodsTitle;
                erjiCate[active_index].children.push(item);
              }
            });
            if (title == this.classicWordings[0]) {
              this.goods = erjiCate;
            }
            if (title == this.classicWordings[3]) {
              this.other = erjiCate;
            }
            if (title == this.classicWordings[1]) {
              erjiCate[active_index].children.push({
                categoryTitle: erjiCate[active_index].categoryTitle,
                categoryType: title,
                categoryId: erjiCate[active_index].id,
                text: "其他",
                id: active_index + 9999
              });
              this.purchase = erjiCate;
              if (other) {
                other.quantity = 1;
                this.handleListData("push", title, other);
                // this.listData[2].data.push(other);
                this.purchaseActiveIds.push(other.id);
              }
            }
          });
        });
        // }
      } else {
        // 住养服务项目
        this.getGoods().then(res => {
          this.service = res.data.filter(item => {
            return item.categoryType == this.classicWordings[2];
          });
          const serveListData = this.listData.filter(item => {
            return item.categoryType == this.classicWordings[2];
          })[0].data;
          if (serveListData.length > 0) {
            serveListData.forEach(item => {
              for (let index = 0; index < this.service.length; index++) {
                const element = this.service[index];
                if (item.id == element.id) {
                  element.dis = true;
                }
              }
            });
          }
          // console.log(this.service, "***********");
        });
      }
    },
    /** 1.生活物品 */
    // 生活物品二级分类的点击事件
    goodTypeClick(index) {
      this.hasPeriod = this.goods[index].dataPeriod ? true : false;
      this.goods[index].children = [];
      this.getGoods().then(res => {
        res.data.forEach((item, i) => {
          if (item.categoryTitle == this.goods[index].categoryTitle) {
            item.text = item.goodsTitle;
            this.goods[index].children.push(item);
          }
        });
        // this.selectShow = false;
        // this.selectShow = true;
      });
    },
    // 具体物品的点击事件
    clikItem(data) {
      console.log(data, this.activeIds);
      console.log(this.hasPeriod, "===this.hasPeriod");
      if (this.activeIds.includes(data.id)) {
        if (!this.hasPeriod) {
          let tempData = {};
          tempData = Object.assign({}, tempData, data);
          // this.listData[0].data.push(tempData);
          this.handleListData("push", this.classicWordings[0], tempData);
        } else {
          this.activeIds.pop();
          this.handleServeClcik(data);
        }
      } else {
        this.handleListData("splice", this.classicWordings[0], data);
        // this.listData[0].data.splice(this.listData[0].data.indexOf(data), 1);
      }
    },
    /** end */

    /** 2.代订代购 */
    // 二级分类切换
    purchaseTypeClick(index) {
      this.hasPeriod = this.purchase[index].dataPeriod ? true : false;
      this.purchase[index].children = [];
      this.getGoods().then(res => {
        res.data.forEach((item, i) => {
          if (item.categoryTitle == this.purchase[index].categoryTitle) {
            item.text = item.goodsTitle;
            this.purchase[index].children.push(item);
          }
        });
        this.purchase[index].children.push({
          categoryTitle: this.purchase[index].categoryTitle,
          categoryId: this.purchase[index].id,
          categoryType: "代订代购",
          text: "其他",
          id: this.purchaseActiveIndex + 9999
        });
      });
    },
    // 具体项目点击事件
    purChaseClikItem(data) {
      // console.log(data);
      if (this.purchaseActiveIds.includes(data.id)) {
        if (data.category) {
          if (!this.hasPeriod) {
            this.handleListData("push", this.classicWordings[1], data);
          } else {
            this.purchaseActiveIds.pop();
            this.handleServeClcik(data);
          }
        } else {
          this.currentOther = data;
          this.otherForm = {
            accountType: 0,
            categoryId: "",
            categoryType: "",
            evidence: this.evidenceList[0].itemValue,
            goodsFrom: 0,
            goodsType: 2
          };
          this.purchaseActiveIds.pop();
          // this.selectShow = false;
          this.otherShow = true;
          // this.$nextTick(() => {
          //   this.$refs.otherPrice.focus();
          // });
        }
      } else {
        this.handleListData("splice", this.classicWordings[1], data);
      }
    },
    onSubmit(values) {
      if (!this.otherForm.goodsTitle) {
        this.$toast("请输入物品名称");
        return false;
      } else if (!this.otherForm.price) {
        this.$toast("请输入物品单价");
        return false;
      } else if (!this.otherForm.priceUnit) {
        this.$toast("请选择单位");
        return false;
      } else {
        // con sole.log("submit", values, this.otherForm);
        this.otherForm.categoryId = this.currentOther.categoryId;
        this.otherForm.categoryType = this.currentOther.categoryType;
        axios
          .fetch("careServer", "/careGoods/add", this.otherForm, "json")
          .then(res => {
            if (res.code == 200) {
              this.otherShow = false;
              this.selectShow = true;
              this.yijiTypeClick(null, this.otherForm.categoryType, res.data);
            }
          });
      }
    },
    // 选择单位确认事件
    onConfirm(value, index) {
      // console.log(value, index);
      this.otherForm.priceUnit = value;
      this.show = false;
    },
    onChange(picker, value, index) {
      // console.log(picker, value, index);
    },
    otherBack() {
      if (
        this.otherForm.goodsTitle ||
        this.otherForm.price ||
        this.otherForm.priceUnit
      ) {
        this.$dialog
          .confirm({
            title: "",
            message: "是否保存当前输入内容",
            confirmButtonText: "保存",
            cancelButtonText: "不保存"
          })
          .then(() => {
            // on confirm
            this.onSubmit();
          })
          .catch(() => {
            // on cancel
            this.otherForm = {
              accountType: 0,
              categoryId: "",
              categoryType: "",
              evidence: this.evidenceList[0].itemValue,
              goodsFrom: 0,
              goodsType: 2
            };
            this.otherShow = false;
          });
      } else {
        this.otherForm = {
          accountType: 0,
          categoryId: "",
          categoryType: "",
          evidence: this.evidenceList[0].itemValue,
          goodsFrom: 0,
          goodsType: 2
        };
        this.otherShow = false;
      }
    },
    onCancel() {
      this.show = false;
      // console.log(取消);
    },
    /** end */
    /** 3. 住养项目选择事件 */
    handleServeClcik(data, index) {
      // console.log(data, "========");
      this.serviceForm = Object.assign({}, data);
      this.serviceForm.price = this.serviceForm.price
        ? this.serviceForm.price
        : "";
      // 默认当天
      if (data.dataPeriod == 2) {
        this.serviceForm.startTime = this.$moment().format("YYYY-MM-DD");
        this.serviceForm.endTime = this.$moment().format("YYYY-MM-DD");
      }
      // 默认上个月
      if (data.dataPeriod == 3) {
        this.serviceForm.startTime = this.$moment()
          .month(this.$moment().month() - 1)
          .startOf("month")
          .format("YYYY-MM-DD");
        this.startTime = new Date(this.serviceForm.startTime);
        this.serviceForm.endTime = this.$moment()
          .month(this.$moment().month() - 1)
          .endOf("month")
          .format("YYYY-MM-DD");
        this.endTime = new Date(this.serviceForm.endTime);
      }
      // 默认当月
      if (data.dataPeriod == 4) {
        this.serviceForm.startTime = this.$moment()
          .startOf("month")
          .format("YYYY-MM-DD");
        this.serviceForm.endTime = this.$moment()
          .endOf("month")
          .format("YYYY-MM-DD");
        this.startTime = new Date(this.serviceForm.startTime);
        this.endTime = new Date(this.serviceForm.endTime);
      }
      // this.serviceForm.price = data.price == 0 ? "" : data.price;
      this.currentService = data;
      this.serviceShow = true;
      // this.$nextTick(() => {
      //   this.$refs.otherPrice.focus();
      window.scrollTo(0, 0); //页面滚动到顶部
      // });
    },
    onStartTimeConfirm(date) {
      this.serviceForm.startTime = this.$moment(date).format("YYYY-MM-DD");
      this.seviceDateShow = false;
    },
    onStartTimeCancel() {
      this.seviceDateShow = false;
    },
    onEndTimeConfirm(date) {
      this.serviceForm.endTime = this.$moment(date).format("YYYY-MM-DD");
      this.seviceEndDateShow = false;
    },
    onEndTimeCancel() {
      this.seviceEndDateShow = false;
    },
    serviceSubmit() {
      if (!this.serviceForm.startTime) {
        this.$toast("请选择开始时间");
        return;
      } else if (!this.serviceForm.endTime) {
        this.$toast("请选择结束时间");
        return;
      } else if (
        this.$moment(this.serviceForm.startTime).valueOf() >
        this.$moment(this.serviceForm.endTime).valueOf()
      ) {
        this.$toast("开始时间不能大于结束时间");
        return;
      } else if (!this.serviceForm.price) {
        this.$toast("请填写服务金额");
        return;
      } else if (Number(this.serviceForm.price) <= 0) {
        this.$toast("服务金额必须大于0");
        return;
      } else {
        // 添加
        if (!this.serviceForm.isEdit) {
          // this.$toast("添加");
          this.serviceForm = Object.assign(
            {},
            this.currentService,
            this.serviceForm
          );
          console.log(this.currentService);
          /** 1.生活用品*/
          if (this.currentService.categoryType == this.classicWordings[0]) {
            this.activeIds.push(this.currentService.id);
            // this.listData[0].data.push(this.serviceForm);
          } else if (
            this.currentService.categoryType == this.classicWordings[1]
          ) {
            /** 2.代订代购 */
            this.purchaseActiveIds.push(this.currentService.id);
            // this.listData[2].data.push(this.serviceForm);
          } else if (
            this.currentService.categoryType == this.classicWordings[2]
          ) {
            /** 3. 住养服务 */
            const index = this.service.indexOf(this.currentService);
            this.service[index].dis = true;
            // this.listData[1].data.push(this.serviceForm);
          } else {
            // 其他
            this.otherActiveIds.push(this.currentService.id);
          }
          this.handleListData(
            "push",
            this.currentService.categoryType,
            this.serviceForm
          );

          this.serviceShow = false;
          this.selectShow = true;
        } else {
          // 编辑
          this.listData.forEach(item => {
            if (item.categoryType == this.classicWordings[2]) {
              item.data[this.serviceForm.editIndex] = Object.assign(
                {},
                item.data[this.serviceForm.editIndex],
                this.serviceForm
              );
            }
          });
          this.$toast("修改成功");
          this.serviceShow = false;
          this.selectShow = false;
        }
      }
    },
    // 住养服务编辑
    edit(data) {
      console.log(data);
      // if (data.categoryType == "住养服务") {
      this.serviceForm = Object.assign({}, this.serviceForm, data);
      this.listData.forEach(item => {
        if (item.categoryType == this.classicWordings[2]) {
          this.serviceForm.editIndex = item.data.indexOf(data);
        }
      });
      this.serviceForm.isEdit = true;
      console.log(this.serviceForm.editIndex);
      this.serviceShow = true;
      // }
    },
    serviceBack() {
      if (
        this.serviceForm.startTime ||
        this.serviceForm.endTime ||
        this.serviceForm.price
      ) {
        this.$dialog
          .confirm({
            title: "",
            message: "是否保存当前输入内容",
            confirmButtonText: "保存",
            cancelButtonText: "不保存"
          })
          .then(() => {
            // on confirm
            this.serviceSubmit();
          })
          .catch(() => {
            // on cancel
            this.serviceShow = false;
          });
      } else {
        this.serviceShow = false;
      }
    },
    /**end */
    /** 4.其他 */
    otherTypeClick(index) {
      this.other[index].children = [];
      this.getGoods().then(res => {
        res.data.forEach((item, i) => {
          if (item.categoryTitle == this.other[index].categoryTitle) {
            item.text = item.goodsTitle;
            this.other[index].children.push(item);
          }
        });
      });
    },
    otherItemClick(data) {
      // console.log(data, this.activeIds);
      console.log(this.hasPeriod, "===this.hasPeriod");
      if (this.otherActiveIds.includes(data.id)) {
        if (!this.hasPeriod) {
          let tempData = {};
          tempData = Object.assign({}, tempData, data);
          this.handleListData("push", this.classicWordings[3], data);
        } else {
          this.otherActiveIds.pop();
          this.handleServeClcik(data);
        }
      } else {
        this.handleListData("splice", this.classicWordings[3], data);
      }
    },
    /** end */
    // 最后的保存提交事件
    save() {
      this.selectShow = false;
      if (this.hasData) {
        let param = {
          elderId: this.elders[this.iscur].elderId,
          careOrderDetails: []
        };
        this.listData.forEach(item => {
          param.careOrderDetails.push(...item.data);
        });
        param.careOrderDetails.forEach(item => {
          if (item.quantity) {
            item.amount = item.quantity * item.price;
          } else {
            item.amount = item.price;
            item.quantity = 0;
          }
          item.priceUnit = item.priceUnit ? item.priceUnit : "";
          item.status = item.goodsType == 1 ? 1 : 0;
        });
        axios
          .fetch("careServer", "/careOrderDetail/add", param, "json")
          .then(res => {
            // console.log(res);
            if (res.code == 200) {
              this.$toast.success("添加成功");
              this.resetListData();
              // console.log(this.selectShow, "===========");
            }
          });
      } else {
        this.$toast("请添加需要保存的消费项目");
      }
    },
    // 重置list 数据
    resetListData() {
      //重置数据
      this.active = "";
      this.hasPeriod = false;
      this.activeIndex = this.purchaseActiveIndex = this.otherActiveIndex = 0;
      this.activeIds = this.purchaseActiveIds = this.otherActiveIds = [];
      this.listData.forEach(item => {
        item.data = [];
      });
    },
    onListConfirm(value) {
      this.listData.forEach(item => {
        // if (item.categoryType == this.classicWordings[1]) {
        const index = item.data.indexOf(this.tempListData);
        if (index != -1) {
          item.data[index].priceUnit = value;
        }
        // }
      });
      this.listSelecShow = false;
    },
    onListCancel() {
      this.listSelecShow = false;
    },
    // 代订代购选择单位
    selectUnit(data) {
      // console.log(data);
      this.listSelecShow = true;
      this.tempListData = data;
    }
  }
};
</script>

<style>
.careGoods .van-tabs__nav--line .van-tab .van-tab__text--ellipsis {
  font-size: 16px;
  font-weight: 700;
}
.careGoods .van-sidebar-item {
  font-size: 16px;
}
</style>

<style lang="less" scoped>
.purchase {
  height: 100%;
  display: flex;
  background-color: #fff;
  flex-direction: column;
  font-size: 0.16rem;
  .header {
    .top {
      height: 0.44rem;
      padding: 0.04rem 0.1rem;
      display: flex;
      i {
        font-size: 0.2rem;
      }
      .swipe {
        line-height: 0.44rem;
        display: flex;
        flex: 1;
        //   overflow: hidden;
        position: relative;
        > span {
          font-size: 0.18rem;
          text-align: center;
          position: absolute;
          color: rgba(0, 0, 0, 0.4);
          width: 20%;
        }
        .last {
          left: 20%;
          background: linear-gradient(to right, transparent,#999);
          -webkit-background-clip: text;
          color: transparent;
        }
        .next {
          left: 60%;
          background: linear-gradient(to left, transparent,#999);
          -webkit-background-clip: text;
          color: transparent;
        }
        > div {
          font-size: 0.18rem;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          overflow: hidden;
          .van-swipe-item {
            font-weight: 700;
            text-align: center;
          }
        }
      }
      i {
        line-height: 0.44rem;
        display: block;
        width: 0.2rem;
        height: 0.2rem;
      }
      i:nth-child(3) {
        text-align: right;
      }
    }
    .elders {
      overflow-x: auto;
      background-color: #fff;
      display: flex;
      justify-content: space-around;
      padding: 0.06rem 0.12rem;
      li {
        margin-right: 0.08rem;
        height: 0.3rem;
        line-height: 0.3rem;
        color: rgba(0, 0, 0, 0.6);
        // transform: scale(0.8);
        text-align: center;
        padding: 0 0.1rem;
        min-width: 0.6rem;
        border-radius: 0.18rem;
        background-color: #f5f5f5;
      }
      li.active {
        background-color: #00c744;
        color: #fff;
      }
    }
    ._elders {
      overflow-x: auto;
      background-color: #fff;
      display: flex;
      // justify-content: space-around;
      padding: 0.1rem 0.12rem;
      li {
        margin-right: 0.08rem;
        height: 0.24rem;
        line-height: 0.24rem;
        color: rgba(0, 0, 0, 0.6);
        // transform: scale(0.8);
        text-align: center;
        padding: 0 0.08rem;
        min-width: 0.6rem;
        border-radius: 0.18rem;
        background-color: #f5f5f5;
      }
      li.active {
        background-color: #00c744;
        color: #fff;
      }
    }
  }
  .content {
    // margin-bottom: 0.6rem;
    overflow: auto;
    flex: 1;
    position: relative;
    background-color: #f7f7f7;
    .empty {
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: rgba(0, 0, 0, 0.4);
      img {
        width: 1.48rem;
        height: 1.13rem;
      }
    }
    .list {
      > div {
        > p {
          padding-left: 0.12rem;
          line-height: 0.26rem;
        }
        > div {
          min-height: 0.44rem;
          background-color: #fff;
          /deep/ .van-swipe-cell {
            height: 0.44rem;
            line-height: 0.44rem;
            background-color: #fff;
            padding: 0 0 0 0.12rem;
            border: none;
            .van-swipe-cell__wrapper {
              display: flex;
              height: 100%;
              justify-content: space-between;
              span:nth-child(1) {
                width: 30%;
              }
              span:nth-child(2) {
                width: 30%;
                text-align: center;
              }
              span:nth-child(4) {
                text-align: left;
                width: 0.44rem;
              }
              .van-stepper {
                .van-stepper__minus {
                  color: #333333 !important;
                  border: 1px solid #333333;
                }
                .van-stepper__plus {
                  background-color: #333333 !important;
                }
              }
              .step {
                // text-align: center;
                position: relative;
                > span {
                  width: 0.4rem;
                  position: absolute;
                  right: 0;
                  top: 0;
                }
              }
              .unit_popup {
                padding: 0;
                width: 0.44rem;
                line-height: 0.44rem;
                font-size: 0.16rem;
                i {
                  display: block;
                  line-height: 0.44rem;
                }
              }
              .zhuyang {
                text-align: center;
                width: 40%;
                // padding-right: 0.4rem;
              }
              .van-swipe-cell__right {
                height: 0.44rem;
                display: flex;
                .van-button {
                  padding: 0;
                  width: 0.63rem;
                  height: 100%;
                  display: block;
                  border: none !important;
                  .van-button__text {
                    width: 100%;
                    font-size: 0.16rem;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  //   类别浮层
  .careGoods {
    padding: 0.25rem 0.1rem 0.1rem;
    font-size: 0.14rem;
    box-sizing: border-box;
    box-sizing: border-box;
    .van-tabs {
      margin-top: 0.14rem;
      /deep/ .van-tabs__line {
        background-color: rgba(0, 0, 0, 0);
      }
      /deep/ .van-tab.van-tab--active:after {
        content: "";
        border: solid 1px black;
        padding: 0 16px;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      /deep/ .van-tabs__content {
        min-height: 300px;
        // height: 40%;
        .serviceProject {
          display: flex;
          flex-wrap: wrap;
          button {
            width: 23%;
            margin: 1% 1%;
            height: 36px;
          }
          height: 100%;
          padding: 0.1rem;
        }
        .van-tab__pane {
          line-height: 0.4rem !important;
        }
        .van-sidebar-item--select::before {
          background-color: #00c744;
        }
        .van-tree-select__item--active {
          color: #00c744;
        }
      }
    }
    /deep/ .van-icon.van-popup__close-icon {
      top: 0.08rem;
      right: 0.15rem;
      font-size: 0.25rem;
    }
  }
  .bottom {
    width: 100%;
    position: fixed;
    bottom: 0;
    background-color: #fff;
    box-sizing: border-box;
    height: 0.6rem;
    padding: 0.1rem 0.12rem;
    border-top: 1px solid #ccc;
    span {
      line-height: 0.4rem;
      font-size: 0.16rem;
      font-weight: 700;
    }
    button {
      border: 1px solid #00c744;
      background-color: #00c744;
      float: right;
      height: 0.4rem;
      line-height: 0.4rem;
      width: 0.8rem;
      font-weight: 700;
      font-size: 0.16rem;
    }
  }
  //   弹框式样
  .van-dialog {
    height: 4.43rem;
    width: 3.2rem;
    display: flex;
    flex-direction: column;
    /deep/ .van-dialog__content {
      flex: 1;
      overflow: hidden;
    }
    .rooms {
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      overflow: auto;
      height: 100%;
      padding: 0.1rem;
      // justify-content: space-between;
      li {
        margin: 1% 1.5% 1% 1.5%;
        box-sizing: border-box;
        height: 0.3rem;
        line-height: 0.3rem;
        width: 22%;
        color: rgba(0, 0, 0, 0.6);
        // transform: scale(0.8);
        text-align: center;
        padding: 0 0.08rem;
        border-radius: 0.18rem;
        background-color: #f5f5f5;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      li.active {
        background-color: #00c744;
        color: #fff;
      }
    }
  }
  // 全屏浮层式样
  .full-popup {
    .top {
      height: 0.44rem;
      line-height: 0.44rem;
      padding: 0 0.12rem;
      i {
        font-size: 0.2rem;
      }
    }
    .van-button--info {
      background-color: #00c744;
      border: 1px solid #00c744;
    }
    /deep/ .van-cell {
      color: rgba(0, 0, 0);
      font-weight: 600;
      .van-field__body {
        input {
          color: rgba(0, 0, 0, 0.6);
          // padding-right: 21px;
          text-align: right;
        }
      }
    }
    .price {
      display: flex;
      /deep/ .van-cell {
        padding-right: 1px;
        .van-field__body {
          position: relative;
          .van-field__control {
            border: 1px solid #ccc;
            width: 20%;
            position: absolute;
            right: 0;
            top: 0;
            text-align: center;
          }
        }
      }
      .unit {
        line-height: 0.44rem;
        padding-right: 0.16rem;
        width: 0.44rem;
        text-align: center;
        background-color: #fff;
        font-weight: 500;
      }
    }
  }
}
</style>
