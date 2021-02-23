<template>
    <div class="page">
        <Back></Back>
        <div class="header">
            <div class="left">
                <van-dropdown-menu>
                    <van-dropdown-item v-model="area" :options="areas"  @change="handleEreaChange"/>
                </van-dropdown-menu>
            </div>
            <div class="right">
                <!-- <span class="menu" @click.stop="handleMenuShow">
                    <Menu :show="menuShow"></Menu>
                </span> -->
                <span class="number"><i>{{visit}}</i>/{{book}}</span>
                <span class="date" style="font-size:0.14rem;" @click="dateShow = true">{{ $moment(timeParam).format("DD") }}</span>
            </div>
        </div>
        <div class="content-box">
            <div class="people-list" v-if="list.length>0">
                <div 
                    class="people-box" 
                    :class="item.status == 1 ? '' : 'people-over'" 
                    v-for="item in list" 
                    :key="item.scheduleId">
                    <b>{{item.elderName}}</b>
                    <span>{{item.roomName}} | {{item.peopleNum}}人</span>
                </div>
            </div>
            <null-message v-else />
        </div>
        <van-popup v-model="dateShow" position="bottom">
            <van-datetime-picker v-model="currentDate" type="date" @confirm="confirmFn()" @cancel="cancelFn()" />
        </van-popup>
    </div>
</template>

<script>
export default {
    data(){
        return {
            menuShow: false,
            currentDate: new Date(), // 事件选择器当前时间
            timeParam: new Date(), //选中的时间的值
            area: 1,
            dateShow:false,
            // 生活区域
            areas: [
                {
                    text: "全部区域",
                    value: ''
                },
                {
                    text: "我的区域",
                    value: 1
                },
            ],
            list:[],
            visit:0,
            book:0,
        }
    },
    mounted(){
        this.timeParam = this.$moment(this.currentDate).format("YYYY-MM-DD");
        this.getEaras();
        this.getListData();
    },
    methods:{
    // 显示右上角菜单i
    handleMenuShow() {
      this.menuShow = this.menuShow ? false : true;
    },
        // 获取全部区域
        getEaras() {
            axios.fetch("oaServer", "/org/area/list", {groups: "楼宇区域"}).then(res => {
                if (res.data.length > 0) {
                    res.data.forEach(item => {
                    const obj = {};
                    obj.text = item.areaName;
                    obj.value = item.areaName;
                    this.areas.push(obj);
                    });
                }
            });
        },
        /** 区域筛选 */
        handleEreaChange(){
            this.getListData();
        },
        getListData () {
            let data = {
                area: this.area,
                date: this.timeParam
            }
            axios.fetch("familyServer", "/booking/getVisitBookingsTwo", data).then(res => {
                if(res.data.visitBookingViews) {
                    this.list = res.data.visitBookingViews.map(val => {
                        val.peopleNum = val.mateName == "" ? 1 : 2;
                        return val;
                    })
                    this.visit = res.data.visit;
                    this.book = res.data.book;
                }
            })
        },
        /** 时间选择事件 */
        confirmFn() {
            // 确定按钮
            this.timeParam = this.$moment(this.currentDate).format("YYYY-MM-DD");
            this.getListData();
            this.dateShow = false;
        },
        cancelFn() {
            this.dateShow = false;
        },
    }
}
</script>
<style>
.van-dropdown-menu__bar{
    height:.43rem
}
</style>
<style  lang="less" scoped>
    .page{
        width: 100%;
        box-sizing: border-box;
        font-size: .12rem;
        .header {
            background-color: #fff;
            height: 0.44rem;
            display: flex;
            .left {
                height: 100%;
                flex: 4;
                /deep/ .van-dropdown-menu {
                    width: 50%;
                    .van-dropdown-menu__bar {
                    box-shadow: none;
                    }
                }
            }
            .right {
                height: 100%;
                flex: 4;
                box-sizing: border-box;
                padding: 0.12rem 0;
                span {
                    float: right;
                    width: 0.2rem;
                    height: 0.2rem;
                    margin-right: 0.16rem;
                    img {
                    display: block;
                    width: 0.2rem;
                    height: 0.2rem;
                    }
                }
                span.date {
                    line-height: 0.22rem;
                    text-align: center;
                    background: url("../../assets/img/bg.png");
                    background-size: 100% 100%;
                    height: 0.22rem;
                    width: 0.22rem;
                    margin-right: 16px;
                }
                span.number{
                    width: auto;
                    font-size: .16rem;
                    color: #101010;
                    text-align: center;
                    line-height: .22rem;
                    i{
                        color: #45C456;
                        font-style: normal;
                    }
                }
            }
        }
        .content-box{
            margin: .08rem  0;
            .title{
                height: .3rem;
                line-height: .3rem;
                color: #999999;
                padding: 0 0 0 .16rem;
                background: #ffff;
            }
            .people-list{
                background-color: #fff;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                // padding: 0 0 .16rem .16rem;
                padding: 0 0 .16rem 3%;
                .people-box{
                    // width: .79rem;
                    width: 22%;
                    height: .66rem;
                    // margin: .15rem .1rem 0 0;
                    margin: .15rem 3% 0 0;
                    border: .01rem solid #CCCCCC;
                    border-radius: .03rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    padding: .12rem .02rem;
                    box-sizing: border-box;
                    b{
                        font-size: .16rem;
                        color: #333333;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        width: .6rem;
                        text-align: center;
                    }
                    span{
                        font-size: .12rem;
                        height: .17rem;
                        line-height: .17rem;
                        color: #333;;
                    }
                }
                .people-over {
                    background: rgba(0,0,0,0.04);
                    border: none;
                    b,span{
                        color: rgba(0,0,0,0.45);
                    }
                }
            }
        }
    } 
</style>