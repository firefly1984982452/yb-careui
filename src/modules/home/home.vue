<template>
    <div class="page">
        <div class="bg">
            <div class="banner">
                <img class="header-img" src="../../assets/img/banner.png" alt="">
            </div>
            <div class="today">
                <div class="main-container">
                    <ul class="main-top">
                        <li>
                            <div class="value"><i style="color:#FF6F6C">{{base.leave}}</i>/{{base.elder}}</div>
                            <div class="title">请假外出</div>
                        </li>
                        <li>
                            <div class="value"><i style="color:#45C456">{{base.visit}}</i>/{{base.book}}</div>
                            <div class="title">探视预约</div>
                        </li>
                    </ul>
                    <ul class="main-bottom">
                        <li>
                            <div class="value">{{base.checkin}}</div>
                            <div class="title">入院</div>
                        </li>
                        <li>
                            <div class="value">{{base.checkout}}</div>
                            <div class="title">离院</div>
                        </li>
                        <li>
                            <div class="value">{{base.goIn}}</div>
                            <div class="title">转入</div>
                        </li>
                        <li>
                            <div class="value">{{base.goOut}}</div>
                            <div class="title">转出</div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="menu">
                <ub-menu-ctrl :exclude="['uban.carerui.me','uban.carerui.home']"></ub-menu-ctrl>
            </div>
        </div>
    </div>
</template>
<script>
import ubMenuCtrl from '@/components/menuctrl';

export default {
    components: { ubMenuCtrl },
    data(){
        return {
            base:{
                book: 0,
                checkin: 0,
                checkout: 0,
                elder: 0,
                goIn: 0,
                goOut: 0,
                leave: 0,
                visit: 0
            }
        }
    },
    mounted(){
        this.getData();
    },
    methods:{
        getData(){
            axios.fetch("careServer", "/workbench/statistics", {}).then(res => {
                if(res.code == 200) {
                    this.base = res.data;
                }
            });
        },
        navLink(index){
            let url = '/home/';
            switch (index) {
                case 0:
                case 1:
                case 2:
                case 5:
                    this.$toast('开发中');
                    break;
                case 3:
                    url = 'service';
                    this.$router.push({path:url});
                    break;
                case 4:
                    url = 'visit';
                    this.$router.push({
                        path:url
                    });
                    break;
            
                default:
                    break;
            }
        }
    }
}
</script>

<style>
.van-grid-item__content{
    padding:.1rem .08rem
}
</style>

<style lang="less" scoped>
    p {
        margin: 0;
    }
    .page{
        overflow: auto;
        height: 100%;
        background-color: #f8f8f8;
        box-sizing: border-box;
        position: relative;
        .bg{
            background-color: #fff;
            height: calc(100% - 1.2rem);
            .banner {
                background-color: #fff;
                text-align: center;
                .header-img{
                    width: 100%;
                    height: 1.99rem;
                }
            }
            .menu{
                width: 100%;
                position: absolute;
                top: 3rem;
                background-color: #fff;
                padding: .1rem 0;
                img{
                    width: .42rem;
                    height: .42rem;
                }
            }
            .today {
                position: absolute;
                top: 1.49rem;
                width: 3.27rem;
                height: 1.33rem;
                // margin: 0 .24rem;
                left: 50%;
                transform: translateX(-50%);
                background: #FFFFFF;
                border-radius: 6px;
                box-sizing: border-box;
                box-shadow: 0 .02rem .1rem 0 rgba(0,0,0,0.06);
                padding: .16rem;
                .main-container {
                    height: 100%;
                    background-color: #fff;
                    border-radius: 6px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .main-top{
                        height: .47rem;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-around;
                        li{
                            width: .61rem;
                            text-align: center;
                            .value{
                                height: .28rem;
                                line-height: .28rem;
                                font-size: .18rem;
                                color: rgba(0,0,0,0.45);
                                i{
                                    font-style: normal;
                                    font-size: .2rem;
                                }
                            }
                            .title{
                                color: rgba(0,0,0,0.25);
                                font-size: .12rem;
                            }
                        }
                        
                    }
                    .main-bottom{
                        height: .48rem;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        li{
                            width: .61rem;
                            text-align: center;
                            .value{
                                font-size: .16rem;
                                color: #222;
                                height: .22rem;
                                line-height: .22rem;
                            }
                            .title{
                                color: #999;
                                font-size: .2rem;
                                transform: scale(.5);
                            }
                        }
                    }
                }
            }

        }
    } 
</style>