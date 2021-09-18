<template>
	<div class="info-box" style="color: red">
		<div class="text item" v-for="item in list">{{item}}</div>
	</div>
</template>

<script>
	export default {
		name: "index",
		props:{
			list:{
				type:Array,
				default(){
					return ['开盘','最高','最低','收盘','换手','成交']
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