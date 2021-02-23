<template>
    <div class="page">
        <Back :bgc="1" :path="`/orderly/scan-result?roomId=${roomId}`"></Back>
        <div class="header">
            <div class="title">
                <img src="../../../assets/img/icon-from-white@2x.png" alt="" srcset="">
                <div>{{roomName}}</div>
            </div>
            <div class="fr">
                <span>
                <van-image width="32" height="32" @click="goToCheckRoom" round :src="require('@/assets/img/ico-canfangxunshi-white@2x.png')" />
                </span>
                <span>
                <van-image width="32" height="32" @click="goToElderCare" round :src="require('@/assets/img/icon-zhangzhezhaohu-white@2x.png')" />
                </span>
            </div>
        </div>
        <div class="page-content">
            <div class="nav">
                <div 
                    v-for="(item,index) in navList" 
                    :key="index"
                    :class="currentNavIndex == index ? 'active' : ''"
                    @click="navClick(index)">{{item.name}}</div>
            </div>
            <div class="task">
                <div v-if="dataList.length > 0">
                    <div class="line" v-for="(item,index) in dataList" :key="index" @click="clickItem(index)">
                        <img v-if="item.imageUrl !== null" :src="item.imageUrl" />
                        <img v-else :src="defaultImg2" alt="" srcset="">
                        <div class="info">
                            <div class="title">
                                <span class="name">{{item.itemTitle}}</span>
                                <span class="value">
                                    <i class="done">{{item.doneCount}}</i><i>/{{item.itemCount}}</i>
                                </span>
                                <span style="color:red;font-size:0.14rem" v-if="currentNavIndex == 1 && (Number(item.itemCount) - Number(item.doneCount) > 0)">
                                    （缺{{ Number(item.itemCount) - Number(item.doneCount) }}次）
                                </span>
                            </div>
                            <span class="text">
                                <i :class="item.isTimeOut ? 'red' : 'green'"></i>
                                {{item.scheduleStartText}} ~ {{item.scheduleEndText}}
                                {{item.scheduleType | filterTimeType}}
                                {{item.scheduleCount}}次
                            </span>
                        </div>
                        <div class="check-box"  v-if="currentNavIndex == 0">
                            <img v-if="!item.checked" class="check" src="../../../assets/img/yuan@2x.png">
                            <img v-else class="checked" src="../../../assets/img/icon-flish@2x.png">
                        </div>
                        <van-icon v-else name="arrow" />
                    </div>
                </div>
                <van-empty v-else description="暂无数据">
                </van-empty>
            </div>
        </div>
        <div class="footer" v-show="currentNavIndex == 0">
            <van-button block @click="cancel">取消</van-button>
            <van-button type="primary" block @click="submit">提交</van-button>
        </div>
        <ProjectSettings :show="show" :optionInfo="optionInfo" :param="param" @success="closePage" @close="close"></ProjectSettings>
    </div>
</template>

<script>
var that = this;
import ProjectSettings from './components/ProjectSettings';
export default {
    data(){
        return {
            show:false,
            navList:[{
                name:'待处理'
            },{
                name:'已处理'
            }],
            currentNavIndex: 0,
            optionsPlanType:[],
            dataList:[],
			defaultImg2: require("../../../assets/img/default.png"),
            roomName:'',
            roomId:'',
            nowTime:'',
            optionInfo:[],
            param:{},
            currentClickIndex:''
        }
    },
    components: {ProjectSettings},
    mounted(){
        this.currentNavIndex = localStorage.getItem('task-resource') == 'detail' ? 1 : 0;
		localStorage.removeItem('task-resource');
        this.nowTime = this.$moment().format("YYYY-MM-DD HH:mm:ss");
        this.optionsPlanType = this.$constant.optionsPlanType;
        this.roomName = this.$route.query.roomName;
        this.roomId = this.$route.query.roomId;
        this.getDate();
    },
    methods:{
        getDate(){
            let param = {
                roomId: this.roomId,
                status: this.currentNavIndex
            }
            axios.fetch("careServer", '/careTask/todayTask/room',param).then((res) => {
                if (res.code == 200) {
                    this.dataList = res.data.map(val => {
                        val.checked = false;
                        val.isTimeOut = this.nowTime > val.scheduleEnd;
                        switch (val.scheduleType) {
                            // 0无，3每天，4每周，5每月
                            case 0:
                                break;
                            case 3:
                                val.scheduleStartText = val.scheduleStart.substr(11,5);
                                val.scheduleEndText = val.scheduleEnd.substr(11,5);
                                break;
                            case 4:
                            case 5:
                                val.scheduleStartText = val.scheduleStart.substr(5,5);
                                val.scheduleEndText = val.scheduleEnd.substr(5,5);
                                break;
                        
                            default:
                                break;
                        }
                        return val;
                    });
                }
            });
        },
        closePage(val){
            this.dataList[this.currentClickIndex].checked = val === '' ? false : true;
            this.show = false;
            this.dataList[this.currentClickIndex].taskDetailList = val;
            this.$forceUpdate();
        },
        close(){
            this.show = false;
        },
        cancel(){
            this.$router.back();
        },
        navClick(index) {
            this.dataList = [];
            this.currentNavIndex = index;
            this.getDate();
        },
        // 点击单项
        clickItem(index){
            switch (this.currentNavIndex) {
                case 0:
                    this.currentClickIndex = index;
                    if (this.dataList[this.currentClickIndex].checked) {
                        this.dataList[this.currentClickIndex].checked = false;
                        this.$forceUpdate();
                    } else {
                        this.param = {
                            taskId:this.dataList[index].id,
                            serviceId: this.dataList[index].serviceId
                        }
                        this.optionInfo = [];
                        this.getOption(index);
                    }
                    break;
                case 1:
                    this.$router.push({
                        path:'taskDetail',
                        query:{
                            taskId:this.dataList[index].id
                        }
                    })
                    break;
                default:
                    break;
            }
        },
        // 获取配置
        getOption(index){
            let param = {
                serviceId: this.dataList[index].serviceId
            }
            axios.fetch("careServer", '/nursingOption/get/serviceId', param).then((res) => {
                if (res.code == 200) {
                    this.optionInfo = res.data.map(val => {
                        val.inputTextList = val.inputText.split(',');
                        switch (val.inputType) {
                            case 1:
                                val.optionValue = '';
                                break;
                            case 2:
                                val.optionValue = [];
                                break;
                            case 3:
                                val.optionValue = '';
                                break;
                            case 4:
                                val.optionValue = this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                                break;
                            case 5:
                                val.optionValue = '';
                                break;
                            default:
                                break;
                        }
                        return val;
                    })
                    if(this.optionInfo.length == 0) {
                        this.dataList[this.currentClickIndex].checked = !this.dataList[this.currentClickIndex].checked;
                    } else {
                        this.show = true;
                    }
                }
            });
        },
        submit(){
            let list = this.dataList.filter(val => {return val.checked == true});
            if(list.length == 0) {
                return this.$toast('请至少选择1项任务！')
            }
            let param = list.map(val => {
                let item = {
                    taskId: val.id,
                    serviceId: val.serviceId,
                    operateTime: this.$moment().format("YYYY-MM-DD HH:mm:ss"),
                    taskDetailList: val.taskDetailList
                }
                return item;
            })
            axios.fetch("careServer", '/careTaskItem/addList',param,'json').then((res) => {
                if (res.code == 200) {
                    this.$toast(res.data);
                    this.getDate();
                }
            });
        },
        goToCheckRoom() {
            const taskId = this.$route.query.taskId;
            const areaId = this.$route.query.areaId;
            if(taskId){

                const taskType = Number(this.$route.query.taskType);
                if (taskType === 1) {
                    this.$router.push({
                    path: "check-room",
                    query: this.$route.query,
                    });
                } else if (taskType === 0) {
                    this.addTask(taskId, areaId);
                }
            } else {
                this.$toast('暂无房间任务')
            }
        },
        

        // 新增护理查房子任务信息
        addTask(taskId, areaId) {
        axios
            .fetch("careServer", "/carePatrolSubtask/add", {
            taskId,
            areaId,
            })
            .then((res) => {
            this.$router.push({
                path: "check-room",
                query: this.$route.query,
            });
            });
        },
        goToElderCare() {
        this.$router.push({
            path: "today-care",
            query: this.$route.query,
        });
        },
    },
    beforeCreate(){
        that = this;
    },
    filters:{
        filterTimeType:val=>{
            let index = that.optionsPlanType.findIndex(item => item.value == val);
            if (index !== -1) {
                return that.optionsPlanType[index].label;
            }
        },
    }
}
</script>
<style  lang="less" scoped>
    .page{
        position: relative;
        height: 100%;
        .header{
            width: 100%;
            height: 1rem;
            background-color: #69CA8D;
            color: #fff;
            padding: .23rem 0 0 0;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            .title{
                display: flex;
                flex-direction: row;
                img{
                    width: .24rem;
                    height: .3rem;
                    margin: 0 .08rem 0 .12rem;
                }
                div{
                    font-size: .24rem;
                }
            }
            
            .fr {
            margin-right: 0.12rem;
            span + span {
                margin-left: 0.08rem;
            }
            }
        }
        .page-content{
            width: 100%;
            display: flex;
            flex-direction: column;
            flex: 1;
            background-image: linear-gradient(180deg, #FFFFFF 0%, #F8F8F8 100%);
            border-radius: .18rem .18rem 0 0;
            position: absolute;
            top: 1.14rem;
            overflow: scroll;
            height: calc(100% - 1.64rem);
            .nav{
                height: .88rem;
                display: flex;
                justify-content: space-around;
                align-items: center;
                div{
                    width: .6rem;
                    text-align: center;
                    font-size: .18rem;
                    color: rgba(0,0,0,0.50);
                    height: .25rem;
                }
                div.active{
                    color: #222;
                    border-bottom: .04rem solid #69CA8D;
                }
            }
            .task{
                // height: calc(100% - 1.5rem);
                // margin: 0 0 .6rem 0;
                overflow: scroll;
                flex: 1;
                .line{
                    width: 3.5rem;
                    height: .88rem;
                    background: #FFFFFF;
                    box-shadow: 0 .04rem .05rem .06rem #F5F4F9;
                    border-radius: 4px;
                    margin: .04rem auto ;
                    padding: .18rem .2rem .18rem .14rem;
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    position: relative;
                    img{
                        width: .5rem;
                        height: .5rem;
                        border-radius: 50%;
                    }
                    .info{
                        display: flex;
                        flex-direction: column;
                        margin: 0 0 0 .16rem;
                        .title{
                            font-size: .16rem;
                            color: #222;
                            .name{

                            }
                            .value{
                                font-size: .15rem;
                                color: #999999;
                                margin: 0 0 0 .05rem;
                                i{
                                    font-style: normal;
                                }
                                .done{
                                    font-size: .15rem;
                                    color: #69CA8D;
                                }
                            }
                        }
                        .text{
                            font-size: .15rem;
                            color: #999;
                            i{
                                width: .1rem;
                                height: .1rem;
                                display: inline-block;
                                border-radius: 50%;
                            }
                            .green{
                                background-color: #69CA8D;
                            }
                            .red{
                                background-color: #f00;
                            }
                        }
                    }
                    .check-box{
                        display: flex;
                        width: .36rem;
                        height: .36rem;
                        position: absolute;
                        right: .2rem;
                        justify-content: center;
                        align-items: center;
                        .check{
                            width: .28rem;
                            height: .28rem;
                        }
                        .checked{
                            width: .36rem;
                            height: .36rem;
                        }
                    }
                    .van-icon{
                        position: absolute;
                        right: .2rem;
                    }
                }
            }
        }
        .footer{
            display: flex;
            position: absolute;
            bottom: 0;
            flex: 1;
            width: 100%;
            height: .5rem;
            button{
                height: 100%;
            }
        }
    } 
</style>