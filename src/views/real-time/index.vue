<template>
  <div class="page-view">
    <div class="wrapper" ref="scroll"  >
      <div class="content">
        <list-header :list="headerList" class="list-head"></list-header>
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
        headerList:[
          {value: 'desc',label:'B/S',},
          {value: 'close',label:'现价',},
          {value: 'risePrecent',label:'涨幅',tis:'%'},
          {value: 'price_rise',label:'突破价',},
          {value: 'price_down',label:'跌破价',},
          {value: 'open',label:'开盘',},
          {value: 'high',label:'最高',},
          {value: 'low',label:'最低',},
          {value: 'turnover',label:'换手',tis:'%'},
          {value: 'moneyString',label:'成交量',}
        ],

      };
    },


    computed: {
      dblList(){
        const table =  this.$store.state.common.realTimeTable
        console.log(table);
        return table
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

    watch:{
      shareList(val){
        this.initScroll()
      }
    },

    mounted() {
      this.initScroll()
    },
    activated() {
      this.getRealTimeList()
    },
    methods: {
      getRealTimeList(){
        this.$_api.realTime.getRealTimeList({email:this.user.email}).then(res=>{
        })
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
              scrollX:true,
              click: true,
              mouseWheel:true,
              pullDownRefresh: true

            })
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
    height: calc(100% - 2px);
    padding: 0px;
    overflow: hidden;
    background-color: #efefef ;
    .content{
      height: auto;
      padding: 0;
      width: 160%;
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
