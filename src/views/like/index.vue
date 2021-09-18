<template>
	<div class="page-view">
		<div class="btn-box">
			<list-header :list="headerList"></list-header>
		</div>
		<div class="wrapper" ref="scroll"  >
			<div class="content">
				<div
						class="card-item"
						v-for="(item, index) in shareList"
						@click="lookDetail(index)"
				>
					<cool-share-card :share="item"></cool-share-card>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import BetterScroll from 'better-scroll'
	import ListHeader from '../components/list-header'
	export default {
		name: "index",
		components:{
			ListHeader
		},
		data() {
			return {
				axios: this.$_api,
				bscroll:null,
				timer:null,
				headerList:['B/S','现价','涨幅','突破价','跌破价','换手']

			};
		},


		computed: {
			dblList(){
				const table =  this.$store.state.common.likeMap
				const list = Object.values(table).filter(item=>item)
				console.log(table);
				return list
			},

			shareList() {
				const arr = this.dblList

				// .map(item => {
				//   item.last.moneyString =
				//           item.last.money / 100000000 > 1
				//                   ? Math.floor(item.last.money / 100000000, 2) + "亿"
				//                   : Math.floor(item.last.money / 10000, 2) + "万";
				//
				//   return item;
				// });

				return arr;
			}
		},

		watch:{
			dblList(val){
				this.initScroll()
			}
		},
		mounted() {
			this.initScroll()
		},
		methods: {
			lookDetail(index) {
				this.$router.push({
					name: "echarts",
					params: {
						shareList: this.dblList,
						index
					}
				});
			},
			initScroll(){
				if(!this.bscroll){
					this.$nextTick(()=>{
						this.bscroll = new BetterScroll('.wrapper',{
							scrollY: true,
							click: true,
							mouseWheel:true,
							pullDownRefresh: false

						})

						this.bscroll.refresh()
					})
				}else {
					this.$nextTick(()=> {
						this.bscroll.scrollTo(0, 0);
						this.bscroll.refresh()
					})
				}

			},
		}
	};
</script>

<style scoped lang="less">
	.btn-box{
		padding:  5px 10px;
	}

	.wrapper {
		height: calc(100% - 36px);
		padding: 5px;
		overflow: hidden;
		background-color: #efefef ;
		.content{
			height: auto;
			padding: 0;
			width: 100%;
			.card-item {
				width: 100%;
				color: #ffffff;
				padding: 3px 0;
				display: inline-block;

			}
		}

	}

</style>
