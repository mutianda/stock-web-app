<template>
	<div class="page-view">
		<div class="btn-box">
			<div class="btn-item" v-for="(item,index) in btnList" :key="index">
				<el-button
						type="danger"
						:plain="currentType != item.value"
						@click="toGetNewList(item.value)"
						v-loading="beReady && currentType == item.value"
				>{{item.name}}</el-button
				>
			</div>
		</div>
		<div class="wrapper" ref="scroll">
			<ul class="content">
				<li v-if="refreshing" style="color: #888">Loading...</li>
				<li
						class="card-item"
						v-for="(item, index) in shareList"
						@click="lookDetail(index)"
				>
					<el-card
							class="card-box"
							:class="item.last.risePrecent > 0 ? 'card-red' : 'card-green'"
							@click="lookDetail(index)"
					>
						<div slot="header" class="clearfix card-header">
            <span class="card-title"
            >{{ item.name }} {{ item.last.risePrecent }}%</span
            >
							<i class="el-icon-data-line echart-icon"></i>
							<div>{{ item.code }}</div>
						</div>
						<div class="info-box">
							<div class="text item">开盘：{{ item.last.open }}</div>
							<div class="text item">收盘：{{ item.last.close }}</div>
							<div class="text item">最低： {{ item.last.low }}</div>
							<div class="text item">最高：{{ item.last.high }}</div>
							<div class="text item">量能： {{ item.last.volumes }}</div>
							<div class="text item">换手率：{{ item.last.turnover }}%</div>
							<div class="text item">成交额：{{ item.last.moneyString }}</div>
						</div>

					</el-card>
				</li>
				<li v-if="loadMore" style="color: #888">Loading more...</li>
				<li v-if="noMore" style="color: #888">No more...</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import BetterScroll from 'better-scroll'
	export default {
		name: "index",
		data() {
			return {
				axios: this.$_api,
				macd: "",
				btnList:[
					{name:'全部',value:'all'},
					{name:'初底背离',value:'chudbl'},
					{name:'超背离',value:'chaodbl'},
					{name:'底背离连扳',value:'dbllianban-'},
					{name:'底背离',value:'dbl'},
					{name:'所有连扳',value:'alllianban-'},
				],
				lineList: [],
				macdList: [],
				dblList: [],
				beReady: false,
				searchForm: {
					pageSize: 10,
					pageNum: 1,
					total: 0
				},
				currentType: "dbl",
				lianbanLength: 3,
				loadMore: false,
				noMore:false,
				refreshing:false,
				bscroll:null,

			};
		},
		mounted() {
			this.getAllKLine()
		},

		computed: {
			disabled () {
				return this.loading || this.noMore
			},
			shareList() {
				const arr = this.dblList

				.map(item => {
					item.last.moneyString =
						item.last.money / 100000000 > 1
							? Math.floor(item.last.money / 100000000, 2) + "亿"
							: Math.floor(item.last.money / 10000, 2) + "万";

					return item;
				});

				return arr;
			}
		},
		methods: {

			toGetNewList(val){
				this.searchForm.pageNum = 1
				this.refreshing  = false
				this.noMore = false
				this.loadMore = false
				this.getAllKLine(val)
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
							click: true,
							mouseWheel:true,
							pullDownRefresh: {
								threshold: 10,
								stop: 10
							},
							pullUpLoad: !this.noMore
						})
						this.bscroll.on('pullingUp', () => {
							console.log('处理上拉加载操作')
							if(this.noMore||this.loadMore) return
							this.loadMore = true
							this.searchForm.pageNum++
							this.getAllKLine(this.currentType)

						})
						this.bscroll.on('pullingDown', () => {
							console.log('处理下拉刷新操作')
							if(this.refreshing) return
							this.refreshing = true
							this.searchForm.pageNum = 1
							this.getAllKLine(this.currentType)

						})

						this.bscroll.refresh()
					})
				}else {
					this.bscroll.refresh()
				}

			},
			getAllKLine(type='dbl') {
				if (this.beReady) return;
				this.currentType = type;
				if(type.indexOf('lianban')>-1){
					type = type+3
				}
				this.beReady = true;
				// this.beReady= false
				this.axios.common
				.getAllKLine({
					type,
					pageSize: this.searchForm.pageSize,
					pageNum: this.searchForm.pageNum
				})
				.then(res => {
					if (res.data) {
						const dblList = res.data.list.map(item => {
							item.qs = true;
							item.dbqd = false;
							item.tpzs = false;
							item.jiasu = false;
							item.kaishi = false;
							return item;
						});
						this.searchForm.pageNum = res.data.pageNum;
						this.searchForm.pageSize = res.data.pageSize;
						this.searchForm.total = res.data.total;
						if(!dblList.length){
							this.noMore = true
							this.searchForm.pageNum--
						}else {
							this.noMore = false
						}
						if(this.searchForm.pageNum==1){
							this.dblList = [...dblList]
						}else {
							this.dblList = [...this.dblList,...dblList]
						}
						if(this.refreshing){
							this.refreshing = false
							this.bscroll.finishPullDown()
						}
						if(this.loadMore){
							this.loadMore = false
							this.bscroll.finishPullUp()
						}
						this.initScroll()
						console.log("计算完成");
					}


				})
				.finally(() => {
					this.beReady = false;
				});
			},

			// ["2021-02-09,54.66,53.11,55.40,52.12,90405,482797616.00,6.09,-1.45,-0.78,13.82"]
			// computKline(kline, name, code) {
			//   const input = kline.map(item => {
			//     const k = item.split(",");
			//     const close = {
			//       open: k[1],
			//       close: k[2],
			//       low: k[4],
			//       high: k[3],
			//       time: k[0],
			//       volumes: k[5],
			//       turnover: k[10],
			//       risePrecent: k[8],
			//       money: k[6]
			//     };
			//     return close;
			//   });
			//   this.computeMacd(input, name, code);
			// },
			// computeMacd(data, name, code) {
			//   var input, macd;
			//   input = data;
			//   var calcEMA, calcDIF, calcDEA, calcMACD;
			//
			//   calcEMA = function(n, data, field) {
			//     var i, l, ema, a;
			//     a = 2 / (n + 1);
			//     if (field) {
			//       //二维数组
			//       ema = [data[0][field]];
			//       for (i = 1, l = data.length; i < l; i++) {
			//         ema.push(a * data[i][field] + (1 - a) * ema[i - 1]);
			//       }
			//     } else {
			//       //普通一维数组
			//       ema = [data[0]];
			//       for (i = 1, l = data.length; i < l; i++) {
			//         ema.push(a * data[i] + (1 - a) * ema[i - 1]);
			//       }
			//     }
			//     return ema;
			//   };
			//
			//   /*
			//    * 计算DIF快线，用于MACD
			//    * @param {number} short 快速EMA时间窗口
			//    * @param {number} long 慢速EMA时间窗口
			//    * @param {array} data 输入数据
			//    * @param {string} field 计算字段配置
			//    */
			//   calcDIF = function(short, long, data, field) {
			//     var i, l, dif, emaShort, emaLong;
			//     dif = [];
			//     emaShort = calcEMA(short, data, field);
			//     emaLong = calcEMA(long, data, field);
			//     for (i = 0, l = data.length; i < l; i++) {
			//       dif.push(emaShort[i] - emaLong[i]);
			//     }
			//     return dif;
			//   };
			//
			//   /*
			//    * 计算DEA慢线，用于MACD
			//    * @param {number} mid 对dif的时间窗口
			//    * @param {array} dif 输入数据
			//    */
			//   calcDEA = function(mid, dif) {
			//     return calcEMA(mid, dif);
			//   };
			//
			//   /*
			//    * 计算MACD
			//    * @param {number} short 快速EMA时间窗口
			//    * @param {number} long 慢速EMA时间窗口
			//    * @param {number} mid dea时间窗口
			//    * @param {array} data 输入数据
			//    * @param {string} field 计算字段配置
			//    */
			//   calcMACD = function(short, long, mid, data, field) {
			//     var i, l, dif, dea, macd, result;
			//     result = {};
			//     macd = [];
			//     dif = calcDIF(short, long, data, field);
			//     dea = calcDEA(mid, dif);
			//     for (i = 0, l = data.length; i < l; i++) {
			//       macd.push((dif[i] - dea[i]) * 2);
			//     }
			//     result.dif = dif;
			//     result.dea = dea;
			//     result.macd = macd;
			//     result.code = code;
			//     result.name = name;
			//     result.kline = input;
			//     result.last = input[input.length - 1];
			//     return result;
			//   };
			//
			//   macd = calcMACD(12, 26, 9, input, "close");
			//   this.macdList.push(macd);
			// },
			// getDbl() {
			//   this.dblList = [];
			//   const dblList = [];
			//   this.macdList.forEach(item => {
			//     const dbl = this.computeDbl(item.macd);
			//     const noStAndKc = this.noStAndKc(item);
			//     const rise = this.beRised(item);
			//     if (dbl && noStAndKc && rise) {
			//       dblList.push(item);
			//     }
			//   });
			//   this.dblList = [];
			//   console.log(
			//     this.dblList.map(item => item.name).length,
			//     this.dblList.map(item => item.name).join("、")
			//   );
			// },
			// beRised(item) {
			//   const l = item.macd.length - 1;
			//   if (
			//     item.macd[l] >= item.macd[l - 1] &&
			//     item.macd[l - 1] >= item.macd[l - 2] &&
			//     item.macd[l - 1] > 0
			//   ) {
			//     return true;
			//   } else {
			//     return false;
			//   }
			// },
			// noStAndKc(item) {
			//   if (
			//     item.code[0] != 3 &&
			//     !item.name.includes("st") &&
			//     !item.name.includes("ST")
			//   ) {
			//     return true;
			//   } else {
			//     return false;
			//   }
			// },
			// computeDbl(macd) {
			//   const dmacd = [...macd].reverse();
			//   const acd = [0];
			//   let flag = 1;
			//   dmacd.forEach(item => {
			//     if (item != 0) {
			//       if (item * flag > 0) {
			//         acd[acd.length - 1] += item;
			//       } else {
			//         acd[acd.length] = item;
			//       }
			//       flag = item;
			//     }
			//   });
			//   if (acd.length > 3 && acd[0] > 0 && acd[1] > acd[3]) {
			//     return true;
			//   } else {
			//     return false;
			//   }
			// }
		}
	};
</script>

<style scoped lang="less">
	.btn-box{
		display: flex;
		flex-wrap: wrap;
		.btn-item{
			width: 27%;
			padding:  5px 10px;
			.el-button{
				width: 100%;
			}
		}
	}



	.wrapper {

		height: calc(100% - 110px);
		padding: 5px 0;
		overflow: hidden;
		background-color: #efefef ;
		.content{
			height: auto;
			padding: 0;

			.card-item {
				color: #ffffff;
				padding: 5px;
				display: inline-block;
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
					.info-box{
						display: flex;
						flex-wrap: wrap;
						.item{
							width: 50%;
							margin-bottom: 10px;
							text-align: left;
						}
					}
				}
			}
		}

	}

</style>
