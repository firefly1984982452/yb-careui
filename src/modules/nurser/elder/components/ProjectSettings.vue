<template>
	<div class="project_setting">
		<!-- 项目配置 -->
		<van-popup v-model="show" round position="bottom" @close="cancel">
			<div v-if="optionInfo.length > 0">
				<div class="setting" v-for="(setting, index) in optionInfo" :key="index">
					<p>{{ setting.title }}</p>
					<!-- 1单选，2多选，3文本，4时间，5整数 -->
					<van-radio-group
						v-if="setting.inputType == 1"
						v-model="setting.optionValue"
						direction="horizontal" >
						<van-radio
							v-for="(radio, i) in setting.inputTextList"
							:key="i"
							:name="radio" >{{ radio }}
						</van-radio >
					</van-radio-group>
					<van-checkbox-group
						v-if="setting.inputType == 2"
						v-model="setting.optionValue"
						direction="horizontal" >
						<van-checkbox
							shape="square"
							v-for="(check, i) in setting.inputTextList"
							:key="i"
							:name="check"
							>{{ check }}
						</van-checkbox >
					</van-checkbox-group>
					<div v-if="setting.inputType == 3">
						<van-field
							v-model="setting.optionValue"
							rows="1"
							autosize
							show-word-limit
							maxlength="50"
							type="textarea"
							placeholder="请输入留言" />
						<div style="margin: .1rem 0 0 0">
							提示内容：
							<van-tag 
								style="margin: 0 .05rem 0 0"
								type="primary" 
								v-for="tag in setting.inputTextList"
								:key="tag"
								@click="tagDetault(tag,index)">{{tag}}</van-tag>
						</div>
					</div>
					<van-cell
						v-if="setting.inputType == 4"
						title="请选择时间"
						is-link
						@click="showDate(index)"
						:value="setting.optionValue" />
					<van-stepper v-if="setting.inputType == 5" v-model="setting.optionValue" />
				</div>
			</div>
			<van-empty v-else description="暂无数据">
			</van-empty>
			<div class="footer">
				<van-button block @click="cancel">取消</van-button>
				<van-button block type="primary" @click="handleConfirm">确认提交</van-button>
			</div>
		</van-popup>
		<van-datetime-picker
			v-show="dateShow"
			@confirm="selectTime"
			@cancel="dateShow = false"
			:formatter="formatter"
			v-model="currentDate"
			type="datetime"
			title="选择时间" />
	</div>
</template>

<script type="text/javascript">
export default {
	name: "ProjectSettings",
	props: {
		show: {
			type: Boolean,
			default: false
		},
		optionInfo: {
			type: Array,
			default: []
		},
		param: {
			type: Object,
			default: {}
		}
	},
	data() {
		return {
			dateShow: false,
			currentDateIndex:'',
			currentDate: new Date()
		};
	},
	watch:{
		show(val){
			if(!val) {
				this.dateShow = false;
			}
		}
	},
	components: {},
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
		handleConfirm() {
			console.log(this.optionInfo);
            let arr = this.optionInfo.map(val => {
                return {
                    optionName : val.title,
                    optionValue : val.inputType == 2 ? val.optionValue.join(',') : val.optionValue
                }
			});
			for (const val of arr) {
				if(val.optionValue === '') {
					return this.$toast(val.optionName + '不能为空！');
				}
			}
			this.$emit('success',arr);
		},
		cancel(){
			this.$emit('close', '');
		},
		showDate(index) {
			this.dateShow = true;
			this.currentDateIndex = index;
		},
		tagDetault(tag,index){
			this.optionInfo[index].optionValue += tag;
		},
		selectTime(date) {
			this.optionInfo[this.currentDateIndex].optionValue = this.$moment(date).format("YYYY-MM-DD HH:mm");
			this.dateShow = false;
		}
	}
};
</script>

<style lang="less" scoped>
.project_setting {
	width: 100%;
	.none{
		text-align: center;
		margin: .5rem 0;
	}
	p {
		margin: 0;
		// line-height: 0.32rem;
		padding: 0.12rem 0.08rem;
	}
	.van-popup {
		//   position: relative;
		box-sizing: border-box;
		background-color: #f8f8f8;
		padding: 0.08rem;
	}
	.van-radio-group,
	.van-checkbox-group,
	.van-stepper {
		padding: 0 0.08rem;
		min-height: 0.64rem;
		align-items: center;
		display: flex;
		background-color: #fff;
	}
	.van-button {
		margin-top: 0.08rem;
	}
	.van-picker {
		position: absolute;
		width: 100%;
		bottom: 0;
		z-index: 9999999;
		box-shadow: 0 4px 6px 6px #c8c9cc;
		border-radius: 4px;
	}
	.footer{
		display: flex;
		bottom: 0;
		width: 100%;
		height: .5rem;
		button{
			height: 100%;
		}
	}
}
</style>
