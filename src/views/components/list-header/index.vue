<template>
	<div class="info-box" style="color: red">
		<div   style="width: 100px;padding: 4px 5px;" >名称</div>
		<div class="text item" v-for="item in list">{{item.label}}</div>
	</div>
</template>

<script>
	export default {
		name: "index",
		props:{
			list:{
				type:Array,
				default(){
					return [  {value: 'desc',label:'B/S',},
						{value: 'close',label:'现价',},
						{value: 'risePrecent',label:'涨幅',tis:'%'},
						{value: 'like_rise',label:'关注价',},
						{value: 'price_rise',label:'突破价',},
						{value: 'price_down',label:'跌破价',},
						{value: 'open',label:'开盘',},
						{value: 'high',label:'最高',},
						{value: 'low',label:'最低',},
						{value: 'turnover',label:'换手',tis:'%'},
						{value: 'moneyString',label:'成交量',}]
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.info-box{
		width: 100%;
		font-size: 12px;
		overflow-x: scroll;
		display: flex;
		flex-wrap: wrap;
		.item{
			flex: 1;
			padding: 4px 5px;
		}

	}
</style>