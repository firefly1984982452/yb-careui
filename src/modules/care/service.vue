<template>
    <div class="page">
        <div class="menu">
            <van-grid :gutter="10"  :column-num="4" :border="false">
                <van-grid-item 
                    v-for="(value,index) in navList" 
                    :key="index" 
                    @click="navLink(index)">
                    <img :src="value.image" alt="" srcset="">
                    <p style="margin:.08rem 0 0 0">{{value.text}}</p>
                </van-grid-item>
            </van-grid>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            navList: [{
                text:'消费登记',
                image:require('../../assets/img/icon-service-01.png')
            },{
                text:'请假登记',
                image:require('../../assets/img/icon-service-02.png')
            },{
                text:'事故登记',
                image:require('../../assets/img/icon-service-03.png')
            },{
                text:'物品发放',
                image:require('../../assets/img/icon-service-04.png')
            },{
                text:'代订代购',
                image:require('../../assets/img/icon-service-05.png')
            },{
                text:'营养膳食',
                image:require('../../assets/img/icon-service-06.png')
            },{
                text:'离院确认',
                image:require('../../assets/img/icon-service-07.png')
            }]
        }
    },
    methods:{
        navLink(index){
            let url = '/';
            switch (index) {
                case 0:
                    url = 'index';
                    this.$router.push({path:url});
                    break;
                case 1:
                    url = 'leave';
                    this.$router.push({path:url});
                    break;
                case 2:
                    this.$toast('开发中');
                    break;
                case 3:
                    url = 'send-goods';
                    this.$router.push({path:url});
                    break;
                case 4:
                    url = 'order';
                    this.$router.push({path:url});
                    break;
                case 5:
                    // this.$toast('开发中');
                     url = 'food';
                    this.$router.push({path:url});
                    break;
                case 6:
                    url = 'disposition';
                    this.$router.push({path:url});
                    break;
            
                default:
                    break;
            }
        }
    }
}
</script>
<style  lang="less" scoped>
    .page{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        background-color: #fff;
        .menu{
            padding: .2rem 0;
            img {
                width: .4rem;
                height: .4rem;
            }
        }
    } 
</style>