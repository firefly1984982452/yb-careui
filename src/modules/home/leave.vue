<template>
    <div class="page">
        <van-form @submit="onSubmit">
            <div class="Droplist-wrap">
                <div style="height:.45rem">
                    <van-list 
                        style="position: absolute; z-index: 10;width:90%;height:.45rem"
                        v-model="loading"
                        :finished="finish">
                    <van-search 
                        style="height:.45rem;line-height:.45rem"
                        v-model="elder" 
                        shape="round"
                        placeholder="请输入长者姓名或房间号"
                        @click="onchange1"
                        @input="onchange1"
                        :rules="[{ required: true, message: '请输入长者姓名或房间号' }]"
                        />
                    <van-cell 
                        style="border:1px solid #eee;"
                        v-for="item in peopleList"
                        :key="item.elderId"
                        :title="item.elderName+'  '+item.roomName+'-'+item.bedName"
                        v-show="(item.elderName.indexOf(elder)!=-1 || item.roomName.indexOf(elder)!=-1) && showElder && item.status !== 200"
                        @click="clickcell(item)"/>
                    </van-list>
                </div>
                <span class="menu" @click.stop="handleMenuShow">
                    <Menu :show="menuShow"></Menu>
                </span>
            </div>
            <div style="margin: .08rem 0 0 0;">
                <div class="leave-reason">
                    <div class="title">请假事由</div>
                    <div class="radio">
                        <div @click="chooseLeave('回家')" :class="leave == '回家' ? 'active' : ''">回家</div>
                        <div @click="chooseLeave('看病')" :class="leave == '看病' ? 'active' : ''">看病</div>
                        <div @click="chooseLeave('外出')" :class="leave == '外出' ? 'active' : ''">外出</div>
                        <div @click="chooseLeave('其他')" :class="leave == '其他' ? 'active' : ''">其他</div>
                    </div>
                </div>
                <van-field
                    v-model="leaveMessage"
                    rows="2"
                    maxlength="200"
                    show-word-limit
                    autosize
                    label=""
                    type="textarea"
                    placeholder="请输入请假详细说明"
                    />
            </div>
            <div style="margin: .08rem 0 0 0;">
                <van-field
                    class="date"
                    readonly
                    :value="leaveData"
                    label="离院时间"
                    placeholder="点击选择离院时间"
                    :rules="[{ required: true, message: '请选择离院时间' }]"
                    @click="showPickerleaveData = true" />
                <van-popup v-model="showPickerleaveData" position="bottom">
                    <van-datetime-picker
                        v-model="leaveDataTime"
                        type="datetime"
                        :min-date="minDate"
                        :max-date="maxDate"
                        :formatter="formatter"
                        @confirm="confirmleaveData()"
                        @cancel="showPickerleaveData = false" />
                </van-popup>
                <van-field    class="date" name="switch" label="是否就餐">
                    <template #input>
                        <van-switch active-color="#07c160" v-model="switchCheckedLeave" size="28" />
                    </template>
                </van-field>
            </div>
            <div style="margin: .08rem 0 0 0;">
                <van-field
                    class="date"
                    readonly
                    :value="backData"
                    label="回院时间"
                    placeholder="点击选择回院时间"
                    @click="showPickerBackData = true"
                    :rules="[{ required: true, message: '请选择回院时间' }]"
                />
                <van-popup v-model="showPickerBackData" position="bottom">
                <van-datetime-picker
                    v-model="backDataTime"
                    type="datetime"
                    :min-date="minDate"
                    :max-date="maxDate"
                    title="选择完整回院时间"
                    :formatter="formatter"
                    @confirm="confirmBackData()"
                    @cancel="showPickerBackData = false"
                />
                </van-popup>
                <van-field    class="date" name="switch" label="是否就餐">
                    <template #input>
                        <van-switch active-color="#07c160" v-model="switchCheckedBack" size="28" />
                    </template>
                </van-field>
            </div>
            <div style="margin: .64rem .16rem 0;">
                <van-button round block type="primary" native-type="submit">确定</van-button>
            </div>
        </van-form>
    </div>
</template>
<script type="text/javascript">
export default {
    data(){
        return {
            menuShow:false,
            peopleList: [],
            loading: false,
            finish: true,
            showElder:false,
            minDate: new Date(2020, 0, 1),
            maxDate: new Date(2099, 10, 1),
            elder: '', // 选择长者
            elderId: '', // 选择长者
            leave: '回家', // 请假事由
            leaveMessage:'', // 请假说明
            leaveData: '', // 离院时间
            leaveDataTime:new Date(),
            showPickerleaveData: false, // 离院时间选择器是否显示
            switchCheckedLeave:false, // 离院是否就餐
            backData: '',
            backDataTime:new Date(),
            showPickerBackData: false,
            switchCheckedBack:false,
        }
    },
    watch:{
        value:function(val) {
            this.$emit('transferdata',val);
        }//监听并传值给父组件
    },
    mounted(){
        this.getPeople();
    },
    methods: {
        formatter(type, val) {
            if (type === 'year') {
                return `${val}年`;
            } else if (type === 'month') {
                return `${val}月`;
            } else if (type === 'day') {
                return `${val}日`;
            } if (type === 'hour') {
                return `${val}时`;
            } if (type === 'minute') {
                return `${val}分`;
            }
            return val;
        },
        chooseLeave(val){
            this.leave = val;
        },
        // 显示右上角菜单i
        handleMenuShow() {
        this.menuShow = this.menuShow ? false : true;
        },
        getPeople(){
            axios.fetch("elderServer", "/elderInfo/fetch", {}).then(res => {
                this.peopleList = res.data;
            });
        },
        onchange1(){
            console.log(this.elder,"change") ;
            this.showElder = true;
        },
        clickright(){
            this.showElder=!this.showElder;
        },         
        clickcell(item){
            this.elder=item.elderName;
            this.elderId = item.elderId;
            this.showElder=false;
        },
        confirmleaveData() {
            this.leaveData = this.$moment(this.leaveDataTime).format("YYYY-MM-DD HH:mm:ss");
            this.showPickerleaveData = false;
        },
        confirmBackData() {
            this.backData = this.$moment(this.backDataTime).format("YYYY-MM-DD HH:mm:ss");
            this.showPickerBackData = false;
        },
        onSubmit(values) {
            if(this.elderId == '') {
                return this.$toast('请正确选择长者！');
            }
            if(this.backData <= this.leaveData) {
                return this.$toast('回院时间必须大于离院时间！');
            }
            let data = {
                elderId:this.elderId,
                startDate:this.leaveData,
                endDate:this.backData,
                startDiet:Number(this.switchCheckedLeave),
                endDiet:Number(this.switchCheckedBack),
                reason:this.leave,
                remark:this.leaveMessage
            }

            axios.fetch('elderServer','/elderLeave/get/intersection',{
                elderId:this.elderId,
                startDate:this.leaveData,
                endDate:this.backData
            }).then(res=>{
                if(res.code==200){
                    axios.fetch("elderServer", "/elderLeave/update", data).then(res => {
                        if(res.code == 200){
                            this.$toast('请假登记成功！');
                            this.elderId = '';
                            this.elder = '';
                            this.leaveData = '';
                            this.backData = '';
                            this.switchCheckedLeave = false;
                            this.switchCheckedBack = false;
                            this.leave = '回家';
                            this.leaveMessage = '';
                        }
                    });
                }
            });
        },
    }
}
</script>
<style  lang="less" scoped>
    .page{
        width: 100%;
        box-sizing: border-box;
        .leave-reason {
            background-color: #fff;
            width: 100%;
            height: 100%;
            padding: .02rem 0;
            .title{
                font-size: .12rem;
                color: #999999;
                height: .17rem;
                margin: .07rem .16rem;
            }
            .radio{
                display: flex;
                flex-direction: row;
                padding: 0 .17rem;
                justify-content: space-between;
                div{
                    width: .73rem;
                    height: .36rem;
                    border: .01rem solid #CCCCCC;
                    border-radius: .03rem;
                    color: #333;
                    text-align: center;
                    line-height: .36rem;
                }
                div.active{
                    border-color: #07c160;
                    color: #07c160;
                }
            }
        }
        .date{
            height: .48rem;
        }
    } 
    .Droplist-wrap {
        background-color: #fff;
        position: relative;
        /deep/ .van-field {
            padding-right: 0.3rem;
        }
        .menu{
            padding-top: 0.1rem;
            top: 0;
            right: 0;
            position: absolute;
            height: 0.48rem;
            width: 0.3rem;
        }
    }
</style>
<style>
    .van-field__label{
        width: .7rem!important;
    }
    .van-radio__label {
        margin: 0!important;
    }
    .van-radio--horizontal {
        margin: 0 .09rem 0 0!important;
    }
    .date .van-field__control:read-only {
        display: flex;
        justify-content: flex-end;
        text-align: right;
    }
    .date .van-field__value {

    }
    .van-field__error-message{
        display: none;
    }
    .van-search__content{
        height: .3rem;
        line-height: .3rem;
    }
    .van-search .van-cell{
        padding: 0;
    }
</style>