<template>
  <div
    class="page"
    id="app"
    @mousedown="mousedown"
    @mouseup="mouseup"
    @touchstart="mousedown"
    @touchend="mouseup"
  >
    <main-bar class="main-bar" v-model="showMenu"> </main-bar>
    <main-view class="main-view"></main-view>

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
      showMenu: true,
      mouse: {
        begin: 0,
        end: 0
      }
    };
  },
  mounted() {
    this.saveMenuRouter();
  },
  sockets: {
    connect() {
      this.id = this.$socket.id;

      this.$socket.emit("login", { userid: "111", username: "ssssss" });
      // 监听connect事件
    },

    realTimeStock(data) {
      this.tableData = data.sort((a, b) => b.f170 - a.f170);
      console.log(this.tableData, "table");
      this.showWsModal = true;
      const timer = setTimeout(() => {
        this.showWsModal = false;
        clearTimeout(timer);
      }, 20000);
      console.log("推送");
    },
    message(data) {
      // 监听message事件，方法是后台定义和提供的

      this.$message.info(data.content);
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
        if (e.clientY > 200) return;
        this.mouse.begin = e.clientX;
      }
    },
    mouseup(e) {
      if (e.type == "touchend") {
        const ev = e.changedTouches[0];
        if (!ev || ev.screenY > 200) return;
        this.mouse.end = ev.screenX;
        if (this.mouse.end - this.mouse.begin > 100) {
          this.showMenu = true;
        }
      }
      if (e.type == "mouseup") {
        if (e.clientY > 200) return;
        this.mouse.end = e.clientX;
        if (this.mouse.end - this.mouse.begin > 100) {
          this.showMenu = true;
        }
      }
    },
    closeModal() {
      this.showWsModal = !this.showWsModal;
    }
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
}
</style>
<style lang="less" scoped>
.page {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  .main-view {
    flex-grow: 1;
    padding: 10px;
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 50px);
    overflow-y: auto;
  }
  .main-bar{
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 50px;
    background-color: #eee;
  }
}
</style>
