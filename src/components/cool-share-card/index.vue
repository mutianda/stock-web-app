<template>
	<el-card
			class="card-box"

	>
		<div class="info-box"  :style="{color: share.last.risePrecent > 0 ? 'red' : 'green'}" >

			<div   style="width: 100px;padding: 4px 5px;text-align: center">
				<i @click.stop="removeListen(share)"   class="el-icon-message-solid" style=";font-size: 17px;float: left" :style="{color:realTimeMap[share.code]?'#e08214':'#999'}">
				</i>
				<span>{{ share.name }}</span>
				<i @click.stop="doLike(share)" class="el-icon-star-on" style="font-size: 22px;padding:0 4px;float: right" :style="{color:likeMap[share.code]?'#e08214':'#999'}"></i>

			</div>
			<div class="text item" v-for="it in list" :key="it.code">
				{{ stock[it.value] }}{{it.tis||''}}
			</div>
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
			},
			list:{
				type:Array,
				default(){
					return [
						{value: 'desc',label:'B/S',},
						{value: 'close',label:'现价',},
						{value: 'risePrecent',label:'涨幅',tis:'%'},
						{value: 'like_rise',label:'关注价',},
						{value: 'price_rise',label:'突破价',},
						{value: 'price_down',label:'跌破价',},
						{value: 'open',label:'开盘',},
						{value: 'high',label:'最高',},
						{value: 'low',label:'最低',},
						{value: 'turnover',label:'换手',tis:'%'},
						{value: 'moneyString',label:'成交量',}
					]
				}
			}
		},

		data(){
			return {

			}
		},
		computed:{
			stock(){
				return {
					...this.share,
					...this.share.last
				}
			}
		},
		methods:{
			removeListen(item){
				if(this.realTimeMap[item.code]){
					const data ={
						id:this.realTimeMap[item.code].id
					}
					this.$_api.realTime
					.removeRealTimePush(data)
					.then(res => {
						this.$store.dispatch('common/getRealTimePush')
					});
				}

			},
			doLike(item){
				if(this.likeMap[item.code]){
					const data ={
						id:this.likeMap[item.code].id
					}
					this.$_api.shareLike.deleteLike(data).then(res=>{
						if(res.code==200){
							this.$store.dispatch('common/getLikeList')
						}
					})
				}else {
					const {last,share_code,name} = item
					const data ={
						code:share_code,name,
						price:last.close,
						email:this.user.email,
						time:(new Date()).getTime()
					}
					this.$_api.shareLike.addLike(data).then(res=>{
						if(res.code==200){
							this.$store.dispatch('common/getLikeList')
						}
					})
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
		align-items: center;
		justify-items: center;
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