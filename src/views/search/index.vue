<template>
	<div class="page-view">
		<div class="btn-box">
			<el-input v-model="searchForm.keyword" prefix-icon="el-icon-search" placeholder="请输入内容" @input="searchShare" size="small"></el-input>
			<list-header></list-header>

		</div>
		<div class="wrapper" ref="scroll"  v-loading="showLoading">
			<div class="content">
				<div v-if="refreshing" style="color: #888">Loading...</div>
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
				showLoading:false

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
							? Math.floor(item.last.money / 100000000, 2) + "亿"
							: Math.floor(item.last.money / 10000, 2) + "万";

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
							click: true,
							mouseWheel:true,
							pullDownRefresh: false

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

						if(this.refreshing){
							this.refreshing = false
							this.bscroll.finishPullDown()
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
		padding:  10px 10px 5px 10px;
	}

	.wrapper {
		height: calc(100% - 86px);
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
