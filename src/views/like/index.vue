<template>
	<div class="page-view">

		<div class="wrapper" ref="scroll"  >
			<div class="content">
				<list-header :list="headerList" class="list-head"  :style="{'transform':'translateY('+headerTopHeight+'px)'}" can-sort @changeSort="changeSort1"></list-header>
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
				bscroll:null,
				timer:null,
				dblList:[],
				headerList:[
					{value: 'close',label:'现价',},
					{value: 'updown',label:'关注幅度',tis:'%',style:{flex:1.5}},
					{value: 'risePrecent',label:'涨幅',tis:'%'},
					{value: 'like_price',label:'关注价',},
					{value: 'open',label:'开盘',},
					{value: 'high',label:'最高',},
					{value: 'low',label:'最低',},
					{value: 'turnover',label:'换手',tis:'%'},
					{value: 'moneyString',label:'成交量',style:{flex:1.6}}
					],
				headerTopHeight:0,
				sortBy:'',
				sortType:0


			};
		},


		computed: {
			shareList() {
				const sortBy = this.sortBy ||'risePrecent'
				const sortType = this.sortType||0

				const arr = this.dblList.map(item => {
					const price = item.like_price||item.last.close

					const price2 = (item.desc=='B'?item.price_rise:item.price_down)||item.last.close
				  item.last.moneyString =
					  item.last.money / 100000000 > 1
						  ? (item.last.money / 100000000).toFixed(2) + "亿"
						  : (item.last.money / 10000).toFixed(2)+ "万";

				  return {...item,...item.last,
					  updown:((item.last.close-price)/price*100).toFixed(2),
					  breakZs:((item.last.close-price2)/price*100).toFixed(2),};
				})
				arr.sort((a,b)=>{
					if(sortType==0){
						return b[sortBy]-a[sortBy]
					}else {
						return  a[sortBy]-b[sortBy]
					}

				});

				return arr;
			},
		},

		watch:{
			dblList(val){
				this.initScroll()
			}
		},
		mounted() {

			this.initScroll()
		},
		activated() {
			this.getLikeRealTime()
		},
		methods: {
			changeSort1(sortBy,sortType){
				this.sortBy = sortBy
				this.sortType= sortType
			},
			getLikeRealTime(){
				this.$_api.shareLike.getLikeRealTime({email:this.user.email}).then(res=>{
					if(res.code==200){
						this.dblList = res.data
					}else {
						this.dblList = []
					}
				})
			},
			lookDetail(index) {
				this.$router.push({
					name: "echarts",
					params: {
						shareList: this.shareList,
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
						this.bscroll.refresh()
					})
				}else {
					this.$nextTick(()=> {
						this.bscroll.refresh()
					})
				}

			},
		}
	};
</script>

<style scoped lang="less">


	.wrapper {
		height: calc(100% - 1px);

		overflow: hidden;
		background-color: #efefef ;
		.content{
			height: auto;
			padding: 0;
			width: 180%;
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
