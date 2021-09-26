<template>
	<div class="page-view">
		<div class="btn-box">
			<el-input v-model="searchForm.keyword" prefix-icon="el-icon-search" placeholder="请输入内容" @input="searchShare" size="small"></el-input>
		</div>
		<div class="wrapper" ref="scroll"  v-loading="showLoading">
			<div class="content">
				<list-header :list="headerList" class="list-head"  :style="{'transform':'translateY('+headerTopHeight+'px)'}"></list-header>

				<div class="card-list">
					<div
							class="card-item"
							v-for="(item, index) in shareList"
							@click="lookDetail(index)"
					>
						<cool-share-card :share="item" :list="headerList"></cool-share-card>
					</div>
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
				dblList: [],
				beReady: false,
				searchForm: {
					keyword:''
				},
				currentType: "dbl",
				lianbanLength: 3,
				refreshing:false,
				bscroll:null,
				timer:null,
				showLoading:false,
				headerList:[
					{value: 'close',label:'现价',},
					{value: 'risePrecent',label:'涨幅',tis:'%'},
					{value: 'open',label:'开盘',},
					{value: 'high',label:'最高',},
					{value: 'low',label:'最低',},
					{value: 'turnover',label:'换手',tis:'%'},
					{value: 'moneyString',label:'成交量',style:{flex:1.6}}
				],
				headerTopHeight:0,

			};
		},
		mounted() {

		},

		computed: {

			shareList() {
				const arr = this.dblList

				.map(item => {
					item.last.moneyString =
						item.last.money / 100000000 > 1
							? (item.last.money / 100000000).toFixed(2) + "亿"
							: (item.last.money / 10000).toFixed(2)+ "万";

					return item;
				});

				return arr;
			}
		},
		methods: {

			searchShare(){
				if(!this.searchForm.keyword)return
				this.refreshing  = false
				if(this.timer){
					clearTimeout(this.timer)
					this.timer = null
				}
				this.timer = setTimeout(()=>{
					this.getSearchShare()
					clearTimeout(this.timer)
					this.timer = null

				},1000)
			},
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
							scrollX: true,
							click: true,
							mouseWheel:true,
							pullDownRefresh: false

						})
						this.bscroll.on('scrollEnd',(pos)=> {
							this.headerTopHeight = 0-pos.y
						})
						this.bscroll.on('scrollStart',()=> {
							if(this.headerTopHeight>30){
								this.headerTopHeight = 31
							}
						})
						// this.bscroll.on('pullingDown', () => {
						// 	console.log('处理下拉刷新操作')
						// 	if(this.refreshing) return
						// 	this.refreshing = true
						// 	this.getSearchShare()
						//
						// })

						this.bscroll.refresh()
					})
				}else {
					this.$nextTick(()=> {
						this.bscroll.scrollTo(0, 0);
						this.bscroll.refresh()
					})
				}

			},
			getSearchShare() {
				this.showLoading = true
				if(!this.searchForm.keyword)return
				this.axios.common
				.searchShare({

					...this.searchForm

				})
				.then(res => {
					this.showLoading = false
					if (res.data) {
						const dblList = res.data.map(item => {
							item.qs = true;
							item.dbqd = false;
							item.tpzs = false;
							item.jiasu = false;
							item.kaishi = false;
							return item;
						});

						this.dblList = [...dblList]
						this.initScroll()
						console.log("计算完成");
					}


				})
				.finally(() => {
					this.beReady = false;
				});
			},

		}
	};
</script>

<style scoped lang="less">
	.btn-box{
		padding:  10px 10px 5px 10px;
	}

	.wrapper {
		height: calc(100% - 47px);
		padding: 0px;
		overflow: hidden;
		background-color: #efefef ;
		.content{
			height: auto;
			padding: 0;
			width: 150%;
			.list-head{
				height: 36px;
				line-height: 28px;
				background-color: #111111;
				transition: all .2s;
				&.fixed{
					position: absolute;
				}
			}
			.card-list{
				.card-item {
					width: 100%;
					color: #ffffff;
					padding: 3px 0;
					display: inline-block;

				}
			}
		}

	}

</style>
