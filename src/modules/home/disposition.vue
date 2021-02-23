<template>
    <div class="page">
    <Back></Back>
        <div class="content-box">
            <div class="title">我的区域</div>
            <div class="people-list">
                <div class="people-box" v-for="(item,index) in myCheckoutVos" :key="index" @click="confirm(item)">
                    <b>{{item.elderName}}</b>
                    <span>{{item.checkoutDate}}</span>
                </div>
            </div>
        </div>
        <div class="content-box">
            <div class="title">其它区域</div>
            <div class="people-list">
                <div class="people-box" v-for="(item,index) in elseCheckoutVos" :key="index" @click="confirm(item)">
                    <b>{{item.elderName}}</b>
                    <span>{{item.checkoutDate}}</span>
                </div>
            </div>
        </div>
        <van-dialog v-model="show" title="离院确认" @confirm="confirmLeave" confirmButtonText="离院确认" show-cancel-button>
            <div class="dialog">
                <div class="list">
                    <span>长者姓名</span>
                    <b>{{choosePeople.elderName}}</b>
                </div>
                <div class="list">
                    <span>离院原因</span>
                    <b>{{choosePeople.checkoutRemark}}</b>
                </div>
                <div class="list">
                    <span>离院时间</span>
                    <b>{{choosePeople.checkoutDate}}</b>
                </div>
                <div class="list">
                    <span>确认事项</span>
                    <div class="other">
                        <b v-for="item in choosePeople.flowRemarkList" :key="item">{{item}}</b>
                    </div>
                </div>

            </div>
        </van-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            show: false,
            elseCheckoutVos:[],
            myCheckoutVos:[],
            choosePeople:{}
        }
    },
    mounted(){
        this.getData();
    },
    methods:{
        getData(){
            axios.fetch("careServer", "/workbench/checkout", {}).then(res => {
                this.elseCheckoutVos = res.data.elseCheckoutVos.map(val => {
                    val.checkoutDate = val.checkoutDate.substr(0,10);
                    val.flowRemarkList = val.flowRemark == null || val.flowRemark == '' ? [] : val.flowRemark.split('；');
                    return val;
                });
                this.myCheckoutVos = res.data.myCheckoutVos.map(val => {
                    val.checkoutDate = val.checkoutDate.substr(0,10);
                    val.flowRemarkList = val.flowRemark == null || val.flowRemark == '' ? [] : val.flowRemark.split('；');
                    return val;
                });
            });
        },
        confirm(item) {
            this.show = true;
            this.choosePeople = item;
        },
        confirmLeave(){
            let data = {
                currentStatus:10,
                elderId:this.choosePeople.elderId,
                checkoutDate:this.choosePeople.checkoutDate
            }
            axios.fetch('elderServer', "/elderCheckout/nurse/check", data).then(res => {
                if(res.code == 200) {
                    this.$toast('离院确认成功！');
                    this.getData();
                } else {
                    this.$toast(res.message)
                }
            })
        }
    }
}
</script>
<style  lang="less" scoped>
    .page{
        width: 100%;
        box-sizing: border-box;
        font-size: .12rem;
        .content-box{
            margin: 0 0 .08rem 0;
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
                padding: 0 0 .16rem .16rem;
                .people-box{
                    // width: .78rem;
                    width: .76rem;
                    height: .66rem;
                    margin: .15rem .1rem 0 0;
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
            }
        }
        .dialog{
            background-color: rgba(0,0,0,0.02);
            padding: .16rem .3rem .01rem;
            .list{
                display: flex;
                min-height: .22rem;
                height: auto;
                line-height: .22rem;
                margin: 0 0 .16rem 0;
                span{
                    font-size: .16rem;
                    color: rgba(0,0,0,0.65);
                    letter-spacing: 0;
                    margin: 0 .12rem 0 0;
                    width: .8rem;
                    display: flex;
                }
                b{ 
                    width: 1rem;
                    height: auto;
                    font-size: .16rem;
                    color: rgba(0,0,0,0.85);
                    letter-spacing: 0;
                    display: block;
                }
                .other {
                    display: flex;
                    flex-direction: column;
                }
            }
        }
    } 
</style>