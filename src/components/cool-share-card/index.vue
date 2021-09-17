<template>
	<el-card
			class="card-box"
			:class="share.desc == 'B' ? 'card-red' : 'card-green'"
	>
		<div slot="header" class="clearfix card-header">
			<i @click.stop="removeListen(share)" v-if="share.lastPrice"  class="el-icon-message-solid" style="padding-right:30px;font-size: 17px" :style="{color:'#e08214'}"></i>
            <span class="card-title"
            >{{ share.name }} {{ share.lastRise }}%</span
            >
			<i class="el-icon-data-line echart-icon"></i>
			<span class="card-title">
				{{ share.code }}
				<i @click.stop="doLike(share)" class="el-icon-star-on" style="padding-left:30px;font-size: 22px" :style="{color:likeMap[share.code]?'#e08214':'#999'}"></i></span>
		</div>
		<div class="info-box" v-if="!share.lastPrice">

			<div class="text item">{{ share.last.open }}元</div>
			<div class="text item">{{ share.last.high }}元</div>
			<div class="text item">{{ share.last.low }}元</div>
			<div class="text item">{{ share.last.close }}元</div>
			<div class="text item">{{ share.last.turnover }}%</div>
			<div class="text item">{{ share.last.moneyString }}</div>

		</div>
		<div class="info-box" v-else>
			<div class="text item" style="font-size: 15px">{{share.desc}}</div>
			<div class="text item" :style="{color: share.f170 > 0 ? 'red' : 'green'}">{{ share.lastPrice }}元</div>
			<div class="text item" :style="{color: share.f170 > 0 ? 'red' : 'green'}">{{ share.lastRise }}%</div>
			<div class="text item">{{share.price_rise}}元</div>
			<div class="text item">{{share.price_down}}元</div>
			<div class="text item">{{share.f168}}%</div>
		</div>

	</el-card>
</template>

<script>
	export default {
		name: "index",
		props:{
			share:{
				type:Object,
				default(){
					return {}
				}
			}
		},
		data(){
			return {

			}
		},
		computed:{
			likeMap(){
				const likemap = this.$store.state.common.likeMap
				return  likemap
			},
		},
		methods:{
			removeListen(item){
				this.$_api.realTime
				.removeRealTimePush({ share_code: item.share_code })
				.then(res => {

				});
			},
			doLike(item){
				if(this.likeMap[item.code]){
					this.$store.commit("common/saveLikeMap", {code:item.code,data:null});
				}else {
					this.$store.commit("common/saveLikeMap", {code:item.code,data:{code:item.code,name:item.name,last:item.last}});

				}
			},

		}
	}
</script>

<style scoped lang="less">
	/deep/.el-card__body{
		padding: 10px 0;
	}
	/deep/.el-card__header{
		padding: 5px 10px;

	}
	.info-box{
		width: 100%;
		font-size: 10px;
		overflow-x: scroll;
		display: flex;
		flex-wrap: wrap;
		.item{
			flex: 1;
			padding: 4px 5px;
		}

	}
	.card-box {
		width: 100%;
		color: #fff;
		cursor: pointer;
		&.card-green {
			color: green;
		}
		&.card-red {
			color: red;
		}
		.card-header {
			text-align: right;
			.echart-icon {
				font-size: 20px;
			}
		}

	}
</style>