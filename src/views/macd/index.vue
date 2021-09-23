<template>
  <div class="page-view">
    <div class="btn-box">
      <div class="btn-item" v-for="(item,index) in btnList" :key="index">
        <el-button
                type="danger"
                size="mini"
                :plain="currentType != item.value"
                @click="toGetNewList(item.value)"
                v-loading="beReady && currentType == item.value"
        >{{item.name}}</el-button
        >
      </div>
    </div>
    <div class="wrapper" ref="scroll">
      <div class="content">
        <div v-if="refreshing" style="color: #FFF;text-align: left">Loading...</div>
        <list-header :list="headerList" class="list-head"></list-header>
        <div class="card-list">

          <div
                  class="card-item"
                  v-for="(item, index) in shareList"
                  @click="lookDetail(index)"
          >
            <cool-share-card :share="item" :list="headerList"></cool-share-card>
          </div>
          <div v-if="loadMore" style="color: #FFF;text-align: left">Loading more...</div>
          <div v-if="noMore" style="color: #FFF;text-align: left">No more...</div>
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
        pageSize: 100,
        pageNum: 1,
        total: 0
      },
      currentType: "chudbl",
      lianbanLength: 3,
      loadMore: false,
      noMore:false,
      refreshing:false,
      bscroll:null,
      headerList:[
        {value: 'close',label:'现价',},
        {value: 'risePrecent',label:'涨幅',tis:'%'},
        {value: 'open',label:'开盘',},
        {value: 'high',label:'最高',},
        {value: 'low',label:'最低',},
        {value: 'turnover',label:'换手',tis:'%'},
        {value: 'moneyString',label:'成交量',}
      ],

    };
  },
  activated() {
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
    lookDetail(index) {
      this.$router.push({
        name: "echarts",
        params: {
          shareList: this.shareList,
          index
        }
      });
    },
    toGetNewList(val){
      this.searchForm.pageNum = 1
      this.refreshing  = false
      this.noMore = false
      this.loadMore = false
      if(this.bscroll){
        this.bscroll.scrollTo(0, 0);
      }
      this.getAllKLine(val)
    },

    initScroll(){
      if(!this.bscroll){
        this.$nextTick(()=>{
          this.bscroll = new BetterScroll('.wrapper',{
            scrollY: true,
            scrollX : true,
            click: true,
            mouseWheel:true,
            pullDownRefresh: {
              threshold: 10,
              stop: 10
            },
            pullUpLoad: {
              threshold: 10,
              stop: 10
            },
          })
          // this.bscroll.on('pullingUp', () => {
          //   console.log('处理上拉加载操作')
          //   if(this.noMore||this.loadMore) return
          //   this.loadMore = true
          //   this.searchForm.pageNum++
          //   this.getAllKLine(this.currentType)
          //
          // })
          // this.bscroll.on('pullingDown', () => {
          //   console.log('处理下拉刷新操作')
          //   if(this.refreshing) return
          //   this.refreshing = true
          //   this.searchForm.pageNum = 1
          //   this.getAllKLine(this.currentType)
          //
          // })
          this.bscroll.on('scroll',(pos)=> {
            if(pos.y>100){
              if(this.refreshing) return
              console.log('处理下拉刷新操作')
              this.refreshing = true
              this.searchForm.pageNum = 1
              this.getAllKLine(this.currentType)
            }
            if(pos.y<= this.bscroll.maxScrollY + 50){
                if(this.noMore||this.loadMore) return
              console.log('处理上拉加载操作')
                this.loadMore = true
                this.searchForm.pageNum++
                this.getAllKLine(this.currentType)
            }
          })
          this.bscroll.refresh()
        })
      }else {
        this.$nextTick(()=>{
          this.bscroll.refresh()
          // this.bscroll.scrollTo(0, 0);

        })
      }

    },
    getAllKLine(type='chudbl') {
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
            if(this.searchForm.pageNum==1){
              this.dblList = [...dblList]

            }else {
              this.dblList = [...this.dblList,...dblList]
            }
            if(!dblList.length){
              this.noMore = true
              this.searchForm.pageNum--
            }else {
              this.noMore = false
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
    height: 78px;
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
  height: calc(100% - 80px);
  overflow: hidden;
  background-color: #111 ;
  .content{
    height: auto;
    padding: 0;
    width: 150%;
    .list-head{
      /*position: fixed;*/
      top:0;
      height: 36px;
      line-height: 36px;
      background-color: #111111;
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
