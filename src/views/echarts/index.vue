<template>
  <div class="echarts-box">

    <coolModal :show.sync="showModal" title="操作" width="300px">
      <div v-if="shareList.length">
        <el-button
          @click="preOne"
          :disabled="shareList.length < 1 || computeIndex == 0"
          size="mini"
          type="success"
          >上一个</el-button
        >
        <el-button
          @click="nextOne"
          :disabled="
            shareList.length < 1 || computeIndex == shareList.length - 1
          "
          size="mini"
          type="success"
          >下一个</el-button
        >
        <el-button @click="autoPlay" size="mini" type="primary">{{
          playing ? "播放开启" : "播放暂定"
        }}</el-button>
        <el-slider v-model="timeLength" show-input> </el-slider>
        <el-button type="success" size="mini" @click="addRealTime"
          >定制推送</el-button
        >

        <el-button
          type="success"
          size="mini"
          @click="changeKline()"
          >刷新</el-button
        >


        <el-button
          @click="markTxt"
          size="mini"
          style="margin-left: 20px"
          type="warning"
          >生成txt</el-button
        >
        <div style="color: #111;padding:10px 10px">
          <span style="padding: 0 5px 0 30px">
            趋势中
          </span>
          <el-switch v-model="shareList[computeIndex].qs"> </el-switch>
          <span style="padding: 0 5px 0 30px">
            底部启动
          </span>
          <el-switch v-model="shareList[computeIndex].dbqd"> </el-switch>
          <span style="padding: 0 5px 0 30px">
            突破中枢
          </span>
          <el-switch v-model="shareList[computeIndex].tpzd"> </el-switch>
          <span style="padding: 0 5px 0 30px">
            加速中
          </span>
          <el-switch v-model="shareList[computeIndex].jiasu"> </el-switch>
          <span style="padding: 0 5px 0 30px">
            背离开始
          </span>
          <el-switch v-model="shareList[computeIndex].kaishi"> </el-switch>
        </div>

        <span
          v-if="shareList.length"
          style="float: left;color: #111;line-height: 50px;"
          >总共：{{ shareList.length }} 当前：{{ computeIndex + 1 }} 代码：{{
            currentShare.code
          }}
          名称：{{ currentShare.name }}</span
        >
        连扳时间
        <span
          v-for="item in currentShare.lianban"
          :key="item.time"
          >{{ item.time }}</span
        >
      </div>
    </coolModal>


    <div class="info-box">
      <div class="info-item" v-for="(item,index) in headerList" :key="index" :style="{color:item.value== 'risePrecent'&&currentShare[item.value]<0?'green':'',...item.style}" >
        <div class="info-label">{{item.label}}</div>
        <div class="info-value" >{{currentShare[item.value]}}{{item.tis}}</div>
      </div>
    </div>
    <div class="article-box">
      <div class="info-item info-item1" ref="articleBox" v-if="articleList[currentArticleIndex]" :style="articleStyle">
        <span class="info-label">{{articleList[currentArticleIndex].user_nickname}}:</span>
        <span class="info-value">{{articleList[currentArticleIndex].post_title}}</span>
      </div>
    </div>
    <div id="chart" class="echart"></div>

    <div id="chart2" class="echart2"></div>
    <div class="time-box">

      <div class="btn-item" v-for="item in klineTypeList">

        <el-button type="text" size="mini"
                   :style="{color:item.value!=currentType?'green':'red'}"
                   :key="item.value" @click="changeKline(item.value)" :disabled="buttonLoading">{{item.label}}</el-button>
      </div>

    </div>
    <real-time-modal ref="realTime"></real-time-modal>

    <div class="btn-box" v-if="shareList.length">
      <div class="btn-item">
        <el-button @click="goBack" size="mini" type="text">Back</el-button>
      </div>
      <div class="btn-item">
        <el-button
                @click="nextOne"
                :disabled="shareList.length < 1 || computeIndex == shareList.length - 1"
                size="mini"
                type="success"
        >next</el-button
        >
      </div>
      <div class="btn-item">
        <el-button @click="autoPlay" size="mini" type="primary">{{
          playing ? "start" : "stop"
          }}</el-button>
      </div>
      <div class="btn-item">
        <el-button
                @click="preOne"
                :disabled="shareList.length < 1 || computeIndex == 0"
                size="mini"
                type="success"
        >pre</el-button
        >
      </div>


      <div class="btn-item">
        <el-button @click="showModal = true" size="mini" type="primary">Open</el-button>
      </div>
      <i @click.stop="doLike(currentShare)" class="el-icon-star-on" style="font-size: 22px;padding:5px 4px;flex: 0.5" :style="{color:likeMap[currentShare.code]?'#e08214':'#999'}"></i>

    </div>
  </div>
</template>

<script>
import realTimeModal from "@v/components/real-time-modal";
const upColor = "#ec0000";
const downColor = "#00da3c";
export default {
  name: "index",
  components: { realTimeModal },
  data() {
    return {
      echart: null,
      shareList: [],
      computeIndex: 0,
      echart2: null,
      playing: true,
      time: null,
      showModal: false,
      timeLength: 15,
      klineType: "kline",
      klineTypeList: [
        { label: "日线图", value: "kline" },
        { label: "30分钟", value: "kline_30m" },
        { label: "60分钟", value: "kline_60m" },
        { label: "周线图", value: "kline_week" }
      ],
      currentType:'kline',
      buttonLoading:false,
      currentShare:{},
      headerList:[
        {value: 'close',label:'现价',},
        {value: 'risePrecent',label:'涨幅',tis:'%'},
        {value: 'open',label:'开盘',},
        {value: 'high',label:'最高',},
        {value: 'low',label:'最低',},
        {value: 'turnover',label:'换手',tis:'%'},
        {value: 'moneyString',label:'成交量',style:{flex:2}}
      ],
      articleList:[],
      currentArticleIndex:0,
      articleStyle: {transform:'',right:'-100%'},
      timer:null
    };
  },
  computed: {},
  methods: {
    addRealTime() {
      const data = {
        share_code: this.currentShare.code,
        share_name: this.currentShare.name,
        user_id: 1
      };
      this.$refs.realTime.openModal(data, false);
    },
    goBack() {
      this.$router.go(-1);
    },
    splitData(rawData) {
      var categoryData = [];
      var values = [];
      var volumes = [];
      const turnOver = [];
      for (var i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i].splice(0, 1)[0]);
        values.push(rawData[i]);
        volumes.push([
          i,
          rawData[i][4],
          rawData[i][0] > rawData[i][1] ? 1 : -1
        ]);
        turnOver.push([
          i,
          rawData[i][6],
          rawData[i][0] > rawData[i][1] ? 1 : -1
        ]);
      }
      return {
        categoryData: categoryData,
        values: values,
        volumes: volumes,
        turnOver
      };
    },

    calculateMA(dayCount, data) {
      var result = [];
      for (var i = 0, len = data.values.length; i < len; i++) {
        if (i < dayCount) {
          result.push("-");
          continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
          sum += data.values[i - j][1];
        }
        result.push(+(sum / dayCount).toFixed(3));
      }
      return result;
    },
    getData(rawData, name, macd) {
      const data = this.splitData(rawData);

      this.echart.setOption(
        {
          animation: false,
          title: {
            text: name + macd.code,

          },
          legend: {
            top: 25,
            left: "center",
            data: ["当日信息", "5均线", "10均线", "20均线", "30均线"]
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross"
            },
            formatter: params => {
              let dom = ``;
              dom += `<div>日期:${params[0].axisValue}</div>`;
              params.forEach((item, index) => {
                if (item.componentSubType == "candlestick") {
                  dom += `<div style="text-align: left">开盘:${item.data[1]} </div>`;
                  dom += `<div  style="text-align: left">收盘:${item.data[2]} </div>`;
                  dom += `<div  style="text-align: left">最低:${item.data[3]} </div>`;
                  dom += `<div  style="text-align: left">最高:${item.data[4]} </div>`;
                  dom += `<div style="text-align: left; ${
                    item.data[8] > 0 ? "color:red" : "color:green"
                  }">成交量:${item.data[5]} </div>`;
                  dom += `<div  style="text-align: left">成交额:${item.data[6]} </div>`;
                  dom += `<div style="text-align: left; ${
                    item.data[8] > 0 ? "color:red" : "color:green"
                  }">换手率:${item.data[7]} %</div>`;
                  dom += `<div style=" text-align: left;${
                    item.data[8] > 0 ? "color:red" : "color:green"
                  }">涨幅:${item.data[8]}% </div>`;
                }
              });
              return dom;
            },
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            textStyle: {
              color: "#000"
            },
            position: function(pos, params, el, elRect, size) {
              var obj = { top: 10 };
              obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 30;
              return obj;
            }
            // extraCssText: 'width: 170px'
          },
          axisPointer: {
            link: { xAxisIndex: "all" },
            label: {
              backgroundColor: "#777"
            }
          },
          toolbox: {
            feature: {
              dataZoom: {
                yAxisIndex: false
              },
              brush: {
                type: ["lineX", "clear"]
              }
            }
          },
          brush: {
            xAxisIndex: "all",
            brushLink: "all",
            outOfBrush: {
              colorAlpha: 0.1
            }
          },
          visualMap: {
            show: false,
            seriesIndex: 5,
            dimension: 2,
            pieces: [
              {
                value: 1,
                color: downColor
              },
              {
                value: -1,
                color: upColor
              }
            ]
          },
          grid: [
            {
              left: "8%",
              right: "5%",
              height: "45%"
            },
            {
              left: "8%",
              right: "5%",
              top: "65%",
              height: "16%"
            }
          ],
          xAxis: [
            {
              type: "category",
              data: data.categoryData,
              scale: true,
              boundaryGap: false,
              axisLine: { onZero: false },
              splitLine: { show: false },
              splitNumber: 20,
              min: "dataMin",
              max: "dataMax",
              axisPointer: {
                z: 100
              }
            },
            {
              type: "category",
              gridIndex: 1,
              data: data.categoryData,
              scale: true,
              boundaryGap: false,
              axisLine: { onZero: false },
              axisTick: { show: false },
              splitLine: { show: false },
              axisLabel: { show: false },
              splitNumber: 20,
              min: "dataMin",
              max: "dataMax"
            }
          ],
          yAxis: [
            {
              scale: true,
              splitArea: {
                show: true
              }
            },
            {
              scale: true,
              gridIndex: 1,
              splitNumber: 2,
              axisLabel: { show: false },
              axisLine: { show: false },
              axisTick: { show: false },
              splitLine: { show: false }
            },
            {
              type: "value",
              name: "换手率",
              scale: true,
              interval: 5,
              axisLabel: {
                formatter: "{value} °%"
              }
            }
          ],
          dataZoom: [
            {
              type: "inside",
              xAxisIndex: [0, 1],
              start: 0,
              end: 100
            },
            {
              show: true,
              xAxisIndex: [0, 1],
              type: "slider",
              top: "85%",
              start: 0,
              end: 100
            }
          ],
          series: [
            {
              name: "当日信息",
              type: "candlestick",
              data: data.values,
              itemStyle: {
                color: upColor,
                color0: downColor,
                borderColor: null,
                borderColor0: null
              },
              tooltip: {
                formatter: params => {
                  console.log(params);
                  return "sss";
                }
              }
            },
            {
              name: "5均线",
              type: "line",
              data: this.calculateMA(5, data),
              smooth: true,
              symbolSize: 0, //拐点大小
              lineStyle: {
                opacity: 0.5
              }
            },
            {
              name: "10均线",
              type: "line",
              data: this.calculateMA(10, data),
              smooth: true,
              symbolSize: 0, //拐点大小
              lineStyle: {
                opacity: 0.5
              }
            },
            {
              name: "20均线",
              type: "line",
              data: this.calculateMA(20, data),
              smooth: true,
              symbolSize: 0, //拐点大小
              lineStyle: {
                opacity: 0.5
              }
            },
            {
              name: "30均线",
              type: "line",
              data: this.calculateMA(30, data),
              smooth: true,
              symbolSize: 0, //拐点大小
              lineStyle: {
                opacity: 0.5
              }
            },
            {
              name: "成交量",
              type: "bar",
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: data.volumes
            },
            {
              name: "换手率",
              type: "line",
              lineStyle: {
                color: "#fff",
                width: 1,
                type: "solid"
              },
              smooth: false,
              symbolSize: 5, //拐点大小
              yAxisIndex: 2,
              data: data.turnOver
            }
          ]
        },
        true
      );
      this.echart2.setOption(
        {
          xAxis: {
            type: "category",
            data: data.categoryData
          },

          yAxis: [
            {
              type: "value",
              axisLabel: { show: false },
            }
          ],
          grid: [
            {
              left: "3%",
              right: "5%",
              height: "66%",
              top:'3%',
              bootm:'3%'
            },
          ],
          series: [
            {
              name: "MACD",
              type: "bar",
              itemStyle: {
                normal: {
                  //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                  color: function(params) {
                    return params.value > 0 ? "#C1232B" : "#20c107";
                  },
                  //以下为是否显示，显示位置和显示格式的设置了
                  label: {
                    show: false,
                    position: "top",
                    //                             formatter: '{c}'
                    formatter: "{b}\n{c}"
                  }
                }
              },
              data: macd.macd
            },
            {
              name: "DIF",
              type: "line",
              symbolSize: 1, //拐点圆的大小
              color: ["rgba(255,242,104,0.56)"], //折线条的颜色
              smooth: true, //关键点，为true是不支持虚线的，实线就用true

              data: macd.dif
            },
            {
              name: "DEA",
              type: "line",
              symbolSize: 1, //拐点圆的大小
              color: ["#aaaaaa"], //折线条的颜色
              smooth: true, //关键点，为true是不支持虚线的，实线就用true
              data: macd.dea
            }
          ]
        },
        true
      );

      this.echart.on("brushEnd", params => {
        console.log(params, "brushEnd"); // 用某种方式输出统计值。

        if (
          !params.areas[0].coordRange ||
          !params.areas[0].coordRange[0] ||
          !params.areas[0].coordRange[1]
        )
          return;
        const start = Math.max(params.areas[0].coordRange[0], 0);
        const end = Math.min(
          params.areas[0].coordRange[1],
          this.currentShare.kline.length - 1
        );

        this.openAddRealTimePush(start, end);
        // var sum = 0; // 统计选中项的数据值的和
        //
        // for (var sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
        //   // 对于每个 series：
        //   var dataIndices = brushComponent.selected[sIdx].dataIndex;
        //
        //   for (var i = 0; i < dataIndices.length; i++) {
        //     var dataIndex = dataIndices[i];
        //     sum += dataBySeries[sIdx][dataIndex];
        //   }
        // }
      });
      this.buttonLoading = false
    },
    openAddRealTimePush(start = 0, end = 1) {
      let price_rise = 0;
      let price_down = 0;
      for (let i = start; i < end + 1; i++) {
        const item = this.currentShare.kline[i];

        if (!price_down || item.low < price_down) {
          price_down = item.low;
        }
        if (!price_rise || item.high > price_rise) {
          price_rise = item.high;
        }
      }
      const data = {
        share_code: this.currentShare.code,
        share_name: this.currentShare.name,
        price_rise,
        price_down,
        email: this.user.email,
      };
      this.$refs.realTime.openModal(data, false);
    },
    preOne() {
      this.computeIndex--;
      // console.log(kline);
      this.changeKline('kline')

    },
    nextOne() {
      this.computeIndex++;
      this.changeKline('kline')
    },
    autoPlay() {
      this.playing = !this.playing;
      if (!this.playing) {
        this.time = setInterval(() => {
          this.nextOne();
        }, this.timeLength * 1000);
      } else {
        clearInterval(this.time);
        this.time = null;
      }
    },

    computedEchart(item) {
      if (!item) return;
      // it.money,it.turnover,it.risePrecent
      let data = item.kline.map(it => {
        const info = [
          it.time,
          it.open - 0,
          it.close - 0,
          it.low - 0,
          it.high - 0,
          it.volumes - 0,
          it.money - 0,
          it.turnover - 0,
          it.risePrecent - 0
        ];
        return info;
      });
      this.getData(data, item.name, item);
    },
    markTxt() {
      const data = {
        qs: [],
        dbqd: [],
        tpzs: [],
        kaishi: [],
        jiasu: []
      };

      this.shareList.forEach(item => {
        if (item.qs) {
          data.qs.push(item.code);
        }
        if (item.qs && item.dbqd) {
          data.dbqd.push(item.code);
        }
        if (item.qs && item.tpzd) {
          data.tpzs.push(item.code);
        }
        if (item.qs && item.kaishi) {
          data.kaishi.push(item.code);
        }
        if (item.qs && item.jiasu) {
          data.jiasu.push(item.code);
        }
      });
      this.$_api.common.makeTxt(data).then(res => {
        this.$message.success(res.data);
      });
    },
    changeKline(type='kline') {
      this.currentType = type
      this.buttonLoading = true
      const shareCode = this.shareList[this.computeIndex].share_code;
      this.$_api.common.getKline({ type,shareCode }).then(res => {
        if (res.data) {
          this.getShareArticles( this.currentShare)
          this.currentShare = {...res.data,...res.data.last, moneyString:res.data.last.money / 100000000 > 1
                    ? (res.data.last.money / 100000000).toFixed(2) + "亿"
                    : (res.data.last.money / 10000).toFixed(2)+ "万"}
          this.getShareArticles()
          this.computedEchart(res.data);
        } else {
          this.$message.error("暂无");
        }
      });

    },
    getShareArticles(){
      this.$_api.common.getShareArticles(this.currentShare).then(res=>{
        console.log(res)
        if(res.code==200){
          this.articleList= res.data.re
        }else {
          this.articleList = []
        }
      })
    },
    doLike(item){
      console.log(item);

      if(this.likeMap[item.code]){
        const data ={
          id:this.likeMap[item.code].id
        }
        this.$_api.shareLike.deleteLike(data).then(res=>{
          if(res.code==200){
            this.$store.dispatch('common/getLikeList')
          }
        })
      }else {
        const {last,share_code,name} = item
        const data ={
          code:share_code,name,
          price:last.close,
          email:this.user.email,
          time:(new Date()).getTime()
        }
        this.$_api.shareLike.addLike(data).then(res=>{
          if(res.code==200){
            this.$store.dispatch('common/getLikeList')
          }
        })
      }


    },
  },
  deactivated() {
    clearInterval(this.timer)
    this.timer = null

  },
  activated() {
    this.echart = this.$echarts.init(document.getElementById("chart"), "dark");
    this.echart2 = this.$echarts.init(
      document.getElementById("chart2"),
      "dark"
    );
    this.buttonLoading=false
    const shareList = this.$route.params.shareList;
    const index = this.$route.params.index || 0;
    if (shareList) {
      this.shareList = shareList.map(item => {
        item.qs = true;
        item.dbqd = false;
        item.tpzs = false;
        item.jiasu = false;
        item.kaishi = false;
        return item;
      });
      this.computeIndex = index;
      // console.log(kline);
      this.changeKline('kline')
      window.addEventListener("resize", () => {
        this.echart.resize();
        this.echart2.resize();
      });
      this.timer = setInterval(()=>{
        if(this.articleList.length){
          this.currentArticleIndex = Math.min(this.currentArticleIndex+1,this.articleList.length)
          const screenW = document.body.clientWidth
          this.$nextTick(()=>{
            const w = this.$refs.articleBox.offsetWidth
            const time = Math.min(w/30,8)
            this.articleStyle = {transform:'',right:-w+'px'}
            setTimeout(()=>{
              this.articleStyle = {transform:`translateX( -${screenW+2*w}px)`, transition:'transform +'+time+'s linear',right:-w+'px'}
            },100)
          })
        }
      },8100)
    }
  },
  mounted() {}
};
</script>

<style scoped lang="less">


/deep/.el-switch__label {
  color: #fff !important;
}
/deep/.el-switch__label.is-active {
  color: green !important;
}
.echarts-box {
  width: 100%;
  background-color: black;
  position: relative;
  .btn-box{
    position: absolute;
    bottom: 0;
    height: 40px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .btn-item{
      width: 15%;
      padding:  5px 1px;
      .el-button{
        width: 100%;
      }
    }
  }
  .echart {

    width: 100%;
    height: calc(100% - 260px);
  }
  .echart2 {

    width: 100%;
    height: 100px;
  }
  .time-box{
    height: 30px;
    width: 100%;
    display: flex;
    flex-direction: row;
    .btn-item{
      flex: 1;
      .el-button{
        width: 100%;
      }
    }
  }
  .info-box{
    height: 35px;
    padding: 2px;
    display: flex;
    font-size: 10px;
    color: #dc2929;
    .info-item{
      flex: 1;
    }
  }
  .article-box{
    height: 35px;
    padding: 2px;
    font-size: 14px;
    position:relative ;
    .info-item{
      position: absolute;
      &.info-item1 {
        top:2px
      }
      &.info-item2 {
        top:32px
      }
      .info-value{
        color: #fff;
      }
      .info-label{
        color: #a00202;
      }
    }
  }
}

</style>
