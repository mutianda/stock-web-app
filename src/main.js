// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";

import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// 通用样式类

Vue.use(Element);
Vue.config.productionTip = false;
import VueSocketio from "vue-socket.io";
import socketio from "socket.io-client";

import api from "@/api";
Vue.prototype.$_api = api;
import "echarts/theme/dark.js";
import * as echarts from "echarts";
Vue.prototype.$echarts = echarts;

import "./assets/styles/common.less";
import components from "@c";
Vue.use(components);

Vue.use(
  new VueSocketio({
    debug: true,
    connection: $_BaseConfig[process.env.NODE_ENV].wsUrl,
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    },
    options: {} //Optional options
  })
);
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
