<template>
	<div class="echart-time" >
		<el-tree
				ref="tree"
				:data="data"
				show-checkbox
				:render-after-expand="false"
				@check-change="checkChange"
				@check="checkNode"
				node-key="id"
				:default-expanded-keys="[2, 3]"
				:default-checked-keys="[5]"
				:props="defaultProps">
		</el-tree>
	</div>
</template>

<script>
	export default {
		name: "test",
		data(){
			return {
				data: [{
					id: 1,
					label: '一级 1',
					children: [{
						id: 4,
						label: '二级 1-1',
						children: [{
							id: 9,
							label: '三级 1-1-1'
						}, {
							id: 10,
							label: '三级 1-1-2'
						}]
					}]
				}, {
					id: 2,
					label: '一级 2',
					children: [{
						id: 5,
						label: '二级 2-1'
					}, {
						id: 6,
						label: '二级 2-2'
					}]
				}, {
					id: 3,
					label: '一级 3',
					children: [{
						id: 7,
						label: '二级 3-1',
						children: [{
							id: 71,
							label: '二级 3-1-1'
						}, {
							id: 72,
							label: '二级 3-1-2'
						}]
					}, {
						id: 8,
						label: '二级 3-2'
					}]
				}],
				defaultProps: {
					children: 'children',
					label: 'label'
				}

			}
		},
		activated() {

		},
		methods:{
			checkChange(val,val2,val3){

				const node = this.$refs.tree.getNode(val.id)
				console.log(node);
				this.$nextTick(()=>{
					if(val2){
						node.expanded= true
					}
				})

			},
			checkNode(data,val){

			}

		}
	}
</script>

<style scoped>

</style>