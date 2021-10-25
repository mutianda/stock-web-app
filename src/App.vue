<template>
  <div
    class="page"
    id="app"
    @mousedown="mousedown"
    @mouseup="mouseup"
    @touchstart="mousedown"
    @touchend="mouseup"
    :style="{opacity: env?'1':'.1' }"
  >

    <div class="update-icon" :class="{'show-update':showUpdate}">
      <img src="./assets/img/update.png">
    </div>
    <main-bar class="main-bar" v-model="showMenu"  @touchend="mouseup"> </main-bar>
    <main-view class="main-view" :class="{'has-menu':showMenu}"></main-view>


  </div>
</template>

<script>
import MainBar from "./main/main-bar";
import MainView from "./main/main-view";
import { menuRouter } from "./router/router";


export default {
  name: "index",
  components: { MainView, MainBar,  },
  data() {
    return {
      showWsModal: false,
      tableData: [],

      mouse: {
        begin: 0,
        end: 0
      },
      showUpdate:false
      // imgUrl:require("./assets/img/update.png")
    };
  },
  computed:{
    showMenu(){
      return this.$route.name=='macd'||this.$route.name=='search'||this.$route.name=='real-time'||this.$route.name=='like'

    },
    env(){
      return process.env.NODE_ENV == 'production'
    }
  },
  mounted() {
    window.closeApp = () => {
      this.$message.error('退出')
      this.$socket.emit("disconnect", { id:this.$socket.id,email: this.user.email});
    }
    window.openApp = () => {
      this.$message.success('打开')
      this.$socket.emit("login", { id:this.$socket.id,email: this.user.email});
    }
    this.saveMenuRouter();
    if(!this.user||!this.user.email){
      this.$router.push({name:'login'})
      return
    }
    this.getLikeList()
    this.getRealTimeList()
  },
  sockets: {
    connect() {
      this.$socket.emit("login", { id:this.$socket.id,email: this.user.email});
      // 监听connect事件
    },

    realTimeStock(data) {
      const tableData = data.sort((a, b) => b.f170 - a.f170);
      this.$store.commit("common/saveRealTimeTable",tableData )
      this.showUpdate = true
      setTimeout(()=>{
        this.showUpdate = false
      },1010)

      console.log("推送");
    },
    message(data) {
      // 监听message事件，方法是后台定义和提供的
      console.warn(data,'message');
      this.$message.info(data);
    }
  },
  methods: {
    saveMenuRouter() {
      const list = menuRouter.map(item => {
        return {
          // 供有三级路由的页面读取
          children: item.children || [],
          ...item
        };
      });
      this.$router.addRoutes(list);
      this.$store.commit("common/saveRouter", list);
      this.$router.push({
        name: "macd"
      });
    },

    mousedown(e) {
      if (e.type == "touchstart") {
        const ev = e.changedTouches[0];
        this.mouse.begin = ev.screenX;
      }
      if (e.type == "mousedown") {
        this.mouse.begin = e.clientX;
      }
    },
    mouseup(e) {
      if (e.type == "touchend") {
        const ev = e.changedTouches[0];
        this.mouse.end = ev.screenX;
        if (this.mouse.end - this.mouse.begin > 100) {
          // location.reload()
        }
      }
      if (e.type == "mouseup") {
        if (e.clientY > 200) return;
        this.mouse.end = e.clientX;
        if (this.mouse.end - this.mouse.begin > 100) {
          // location.reload()
        }
      }
    },
  }
};
</script>

<style>
body {
  margin: 0;
  height: 100vh;
}
#app {
  height: 100%;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  background-color: #111111;
}
</style>
<style lang="less" scoped>
.page {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  .main-view {
    flex: 1;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    &.has-menu{
      height: calc(100% - 50px);
    }
  }
  .main-bar{
    width: 100%;

    position: absolute;
    bottom: 0;
    height: 50px;
    background-color: #111111;
  }
  .update-icon{
    width: 40px;
    text-align: right;
    position: absolute;
    right: 0;
    bottom: -45px;
    z-index: 9;
    &.show-update{
      transform: translateY(-1000px);
      transition: all 2s;
    }

  }
}
</style>
