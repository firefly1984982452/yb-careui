<template>
	<div class="project_detail">
    <Back></Back>
		<!-- <div class="elder"> -->
			<van-cell class="time_slect" :title="'请选择日期'" :value="today" is-link  @click="dateShow2 = true"/>
			<div class="elder_info">
				<div class="avartor">
					<img v-if="detailInfo.elderPhoto !== null" :src="detailInfo.elderPhoto" />
					<img v-else :src="defaultImg" alt="" srcset="">
					<i v-show="detailInfo.isNew">新</i>
				</div>
				<div class="detail">
					<span class="name">
						{{detailInfo.elderName}}
						<span>{{detailInfo.age}}周岁</span>
					</span>
					<p class="info">
						<span>护理{{detailInfo.nursingLevel | filterLevel}}级</span>
						<span>{{detailInfo.roomName}}-{{detailInfo.bedName}}</span>
					</p>
				</div>
				<!-- <span class="date" @click="setDate">{{today}}</span> -->
				<!-- <van-icon name="arrow" /> -->
			</div>
		<!-- </div> -->
		<div class="name-title"><i></i>{{detailInfo.itemTitle}}</div>
		<div class="page-content">
			<div v-if="detailInfo.careTaskDetailVos.length > 0">
				<div class="info" v-for="(data,index) in detailInfo.careTaskDetailVos" :key="index">
					<div class="operate">
						<span class="time">{{data.operatorName}}</span>
						<span class="date">{{data.operateTime.substr(0,16)}}</span>
					</div>
					<div class="more" v-if="data.taskDetailList.length>0">
						<div class="item" v-for="item in data.taskDetailList" :key="item.id">
							<div class="name">{{item.optionName || '-'}}：</div>
							<div class="value">{{item.optionValue || '-'}}</div>
						</div>
					</div>
					<div v-else class="more">
						<div class="item">--</div>
					</div>
				</div>
			</div>
			<van-empty v-else description="暂无数据">
			</van-empty>
		</div>
		<bottom></bottom>
		<van-datetime-picker
			v-show="dateShow1"
			v-model="currentDate1"
			@confirm="selectTime1"
			@cancel="dateShow1 = false"
			:formatter="formatter"
			type="date"
			title="选择年月日" />
		<van-calendar v-model="dateShow2" :min-date="minDate" type="range" @confirm="selectTime2" allow-same-day :default-date="defaultDate"/>
		<van-datetime-picker
			v-show="dateShow3"
			v-model="currentDate3"
			@confirm="selectTime3"
			@cancel="dateShow3 = false"
			type="year-month"
			title="选择年月"
			:formatter="formatter" />

	</div>
</template>

<script type="text/javascript">
export default {
	name: "ProjectDetail",
	data() {
		return {
			detailInfo:{
				careTaskDetailVos:[],
				scheduleType:''
			},
			defaultImg: require("@/assets/img/icon-bed-default.png"),
            today:'',
			currentDate1: new Date(),
			currentDate2: new Date(),
			currentDate3: new Date(),
			dateShow1:false,
			dateShow2: false,
			dateShow3: false,
			defaultDate:[],
			minDate:new Date('2000-01-01')
		};
  	},
	mounted() {
		const startDate = this.$moment().format("YYYY-MM-DD");
		const endDate = this.$moment().format("YYYY-MM-DD");
		this.defaultDate = [new Date(),new Date()];
		if(startDate === endDate){
			this.today = startDate;
		} else {
			this.today = `${startDate} - ${endDate}`;
		}
		// this.getDetail(startDate,endDate).then(() => {
		// 	this.getDate();
		// });
		this.getDetail(startDate,endDate);
	},
	methods:{
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
		formatDate(date) {
			return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
		},
		selectTime1(date) {
			this.today = this.$moment(date).format("YYYY-MM-DD");
            this.dateShow1 = false;
            this.getDetail(this.today,'');
		},
		selectTime2(date) {
      const [start, end] = date;
			console.log(start,end)
			// const current = this.$moment().format('YYYY-MM-DD');
			if(this.formatDate(start) === this.formatDate(end)){
				this.today = this.formatDate(start);
			} else {
				this.today = `${this.formatDate(start)} - ${this.formatDate(end)}`;
			}
			this.dateShow2 = false;
			this.getDetail(`${this.formatDate(start)}`,`${this.formatDate(end)}`);
		},
		selectTime3(date) {
			this.today = this.$moment(date).format("YYYY-MM");
			this.dateShow3 = false;
            this.getDetail(this.$moment(date).format("YYYY-MM-DD"),'');
		},
        getDetail(startTime,endTime){
			switch (this.$route.query.type) {
				case 'elder':
					return new Promise(async(resolve, reject) => {
						let param1 = {
							id: this.$route.query.id,
							startTime: startTime,
							endTime:endTime
						}
						await axios.fetch("careServer", '/careTask/list/date',param1).then((res) => {
							if (res.code == 200) {
								this.detailInfo = res.data;
								resolve();
							}
						});
					})
					break;
					
				case 'all':
					return new Promise(async(resolve, reject) => {
						let param2 = {
							serviceId: this.$route.query.id,
							itemId:this.$route.query.itemId,
							startTime: startTime,
							endTime:endTime
						}
						await axios.fetch("careServer", '/careTask/list/elder',param2).then((res) => {
							if (res.code == 200) {
								this.detailInfo = res.data;
								resolve();
							}
						});
					})
					break;
			
				default:
					break;
			}
		},
		// 点击右上角切换
		setDate(){
			switch (this.detailInfo.scheduleType) {
				// 0无，3每天，4每周，5每月
				case 0:
				case 3:
					this.dateShow1 = true;
					break;
				case 4:
					this.dateShow2 = true;
					break;
				case 5:
					this.dateShow3 = true;
					break;
			
				default:
					break;
			}
		},
		// 进入后分配默认时间
		getDate(){
			switch (this.detailInfo.scheduleType) {
				// 0无，3每天，4每周，5每月
				case 0:
				case 3:
					this.today = this.$moment(new Date()).format("YYYY-MM-DD");
					break;
				case 4:
					// this.today = this.$moment(new Date()).format("YYYY-MM-DD");
					break;
				case 5:
					this.today = this.$moment(new Date()).format("YYYY-MM");
					break;
			
				default:
					break;
			}
		},
	},
	beforeDestroy(){
		localStorage.setItem('task-resource','detail');
	},
	filters:{
        filterLevel: val => {
            return ['','一','二','三','四','五','六'][val]
        },
	}
};
</script>

<style lang="less" scoped>
.project_detail {
	height: 100%;
	display: flex;
	flex-direction: column;
	.time_slect {
    height: 0.44rem;
    margin: 0.08rem auto 0;
    display: flex;
    width: 3.5rem;
		.van-cell__title {
			flex: none;
			font-weight: 600;
		}
	}
	// .elder {
	// 	margin: 0.08rem auto 0;
	// 	width: 3.5rem;
	// }
	.elder_info {
		width: 3.5rem;
		height: 0.88rem;
		// height: auto;
		margin: 0 auto 0;
		background-color: #fff;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		padding: .18rem .14rem;
		.avartor {
			box-sizing: border-box;
			position: relative;
			img {
				border-radius: 50%;
				width: 0.52rem;
				height: 0.52rem;
			}
			i{
				position: absolute;
				right: 0;
				top: 0;
				width: .18rem;
				height: .18rem;
				border-radius: 50%;
				background-color: #69CA8D;
				color: #fff;
				font-style: normal;
				text-align: center;
				line-height: .18rem;
				font-size: .11rem;
			}
		}
		.detail {
			height: 0.52rem;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin: 0 0 0 .16rem;
			.name{
				font-size: .16rem;
				color: #222;
				span{
					font-size: .13rem;
					color: rgba(0, 0, 0, 0.4);
				}
			}
			.info {
				font-size: .15rem;
				color: rgba(0, 0, 0, 0.4);
				margin: 0;
			}
		}
		.date{
			position: absolute;
			right: .4rem;
			font-size: .14rem;
			color: rgba(0,0,0,0.85);
		}
		i.van-icon.van-icon-arrow{
			position: absolute;
			right: .2rem;
		}
	}
	.name-title{
		height: .45rem;
		font-size: .18rem;
		color: #222222;
		line-height: .45rem;
		padding-left: .12rem;
		margin: 0.12rem auto 0;
		width: 3.5rem;
		position: relative;
		padding: 0 0 0 .2rem;
		i {
			position: absolute;
			left: .1rem;
			top: 0.15rem;
			display: inline-block;
			background: #69ca8d;
			border-radius: 0.04rem;
			width: 0.05rem;
			height: 0.14rem;
		}
	}
	.page-content {
		margin-bottom: .5rem;
    overflow: scroll;
    height: calc(100% - 2.63rem);
		.info {
			width: 3.5rem;
			height: auto;
			margin: 0 auto .1rem;
			padding: 0 0.12rem;
			background-color: #fff;
			box-sizing: border-box;
			box-shadow: 0 .04rem .06rem .06rem #F5F4F9;
			border-radius: .04rem;
			display: flex;
			flex-direction: column;
			.operate{
				display: flex;
				justify-content: space-between;
				height: .4rem;
				line-height: .4rem;
				font-size: .16rem;
				color: #000;
			}
			.more{
				display: flex;
				flex-direction: column;
				width: 100%;
				justify-content: space-between;
				border-bottom: .01rem solid #F6F6F6;
				.item{
					width: 100%;
					min-height: .35rem;
					padding: .02rem 0;
					height: auto;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					font-size: .14rem;
					.name{
						color: rgba(0,0,0,0.50);
					}
					.value{
						width: 2.25rem;
						display: flex;
						justify-content: flex-end;
						color: #333333;
					}
				}
			}
		}
	}
}
</style>
