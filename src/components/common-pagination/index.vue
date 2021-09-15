<template>
	<div class="common-pagination">
		<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="pagination.pageNum"
				:page-sizes="[100, 200, 300, 400]"
				:page-size="pagination.pageSize"
				layout="prev, pager, next, jumper, total"
				:total="pagination.total">
		</el-pagination>
	</div>
</template>
//el-pagination 分页页数改变 和页码改变是两个事件  我们想通过一个事件来解决  无论谁变 都重新调接口
<script>
	export default {
		name: "index",
		props:{
			pageObj:{
				type:Object,
				default(){
					return {
						pageSize:10,
						pageNum:1,
						total:0
					}
				}
			}
		},
		computed:{
			pagination(){
				const obj = {
					pageSize:10,
					pageNum:1,
					total:0
				}
				//这里是保证传的pageObj如果参数不全  给予默认值
				return {...obj,...this.pageObj}
			}
		},
		methods:{
			//这样是不是无论谁改变 都会触发page-change的事件  是的

			handleSizeChange(pageSize){
				this.$emit('page-change',pageSize,this.pagination.pageNum)
			},
			handleCurrentChange(pageNum){
				this.$emit('page-change',this.pagination.pageSize,pageNum)
			}
		}
	}
</script>

<style scoped>

</style>