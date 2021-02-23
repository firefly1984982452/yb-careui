<template>
	<div class="projects">
		<!-- 长者所拥有的项目 -->
    <Back></Back>
		<div class="elder_info">
			<div class="avartor">
				<img v-if="detailInfo.elderPhoto !== null" :src="detailInfo.elderPhoto" />
				<img v-else :src="defaultImg" alt="" srcset="">
                <i v-show="detailInfo.isNew">新</i>
			</div>
			<div class="detail">
				<span class="name">
					{{ detailInfo.elderName }}
					<span>{{detailInfo.age}}周岁</span>
				</span>
				<p class="info">
					<span>护理{{detailInfo.nursingLevel | filterLevel}}级</span>
					<span>{{detailInfo.roomName}}-{{detailInfo.bedName}}</span>
				</p>
			</div>
		</div>
		<div class="elder_projects">
			<div class="detail" v-for="(project, index) in allList" :key="index">
				<span><i></i>{{ project.name }}</span>
				<div
				v-for="(child, i) in project.list"
				:key="i"
				class="child"
				@click="handleClick(child)"
				>
				<span class="name">{{ child.itemTitle }}</span>
				<span class="time" v-if="child.timeType!==0">{{child.timeType | filterTimeType}}{{child.frequency}}次</span>
				</div>
			</div>
		</div>
		<!-- <bottom></bottom> -->
	</div>
</template>

<script type="text/javascript">
var that;
export default {
	name: "Projects",
	data() {
		return {
			optionsPlanType:[],
			detailInfo:{},
			allList:[],
			elderId: "",
			defaultImg: require("@/assets/img/icon-bed-default.png"),
			currentItem:{}
		};
	},
	mounted() {
        this.optionsPlanType = this.$constant.optionsPlanType;
		this.elderId = Number(this.$route.query.elderId);
		this.getElderProjects(this.elderId);
	},
	components: {},
	methods: {
		getElderProjects(elderId) {
            let param = {
                elderId: elderId
            }
            axios.fetch("careServer", '/careTask/serviceItem',param).then((res) => {
                if (res.code == 200) {
					this.allList = [];
					this.detailInfo = res.data;
					let list = JSON.parse(JSON.stringify(this.detailInfo.elderServiceItems));
					this.currentItem = {
						name: list[0].category,
						id: list[0].categoryId,
						list:[]
					}
					
					list.forEach(val => {
						if(val.categoryId == this.currentItem.id) {
							this.currentItem.list.push(val);
						} else {
							this.allList.push(this.currentItem);
							this.currentItem = {
								name: val.category,
								id: val.categoryId,
								list:[val]
							}
						}
					});
					this.allList.push(this.currentItem);
                }
            });
		},
		handleClick(data) {
			console.log(data);
			this.$router.push({
				path: "project-detail",
				query: {
					type:'all',
					id:data.serviceId,
					itemId:data.itemId
				}
			});
		}
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
        filterLevel: val => {
            return ['','一','二','三','四','五','六'][val]
        },
	}
};
</script>

<style lang="less" scoped>
.projects {
	.elder_info {
		width: 3.5rem;
		height: 0.88rem;
		margin: 0.08rem auto 0;
		background-color: #fff;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		padding: 0.18rem 0.14rem;
		position: relative;
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
			margin: 0 0 0 0.16rem;
			.name {
				font-size: 0.16rem;
				color: #222;
				span {
				font-size: 0.13rem;
				color: rgba(0, 0, 0, 0.4);
				}
			}
			.info {
				font-size: 0.15rem;
				color: rgba(0, 0, 0, 0.4);
				margin: 0;
			}
		}
	}
	.elder_projects {
		width: 3.5rem;
		margin: 0 auto .1rem auto;
		.detail {
		> span {
			font-size: 0.18rem;
			color: #333333;
			display: inline-block;
			padding: 0.2rem 0 0.08rem 0.15rem;
			position: relative;
			i {
			position: absolute;
			left: 0;
			top: 0.25rem;
			display: inline-block;
			background: #69ca8d;
			border-radius: 0.04rem;
			width: 0.05rem;
			height: 0.14rem;
			}
		}
		.child {
			width: 100%;
			height: 0.5rem;
			background-color: #fff;
			margin: 0 auto;
			border-bottom: 0.01rem solid #f6f6f6;
			padding: 0 0.14rem;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.name {
			font-size: 0.16rem;
			color: #000000;
			}
			.time {
			font-size: 0.15rem;
			color: #69ca8d;
			}
		}
		}
	}
}
</style>
