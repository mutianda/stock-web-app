import Vue from "vue";
import VueRouter from "vue-router";

import { menuRouter, defaultRouter } from "./router";

Vue.use(VueRouter);

// 隐藏vue-router@3.1.0路由报错的bug
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

// // 为addRoutes清除路由列表服务
export const routerCreator = () => {
  return new VueRouter({
    mode: "hash",
    base: process.env.NODE_URL,
    routes: defaultRouter
  });
};

const router = routerCreator();

router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')):{}
  const loginRouteName = 'login'

  if(!user||!user.email){
    if (to.name === loginRouteName) {
      return next()
    }else {
      return next({
      name: 'login'
    })
    }

  }else {
    if (to.name === loginRouteName) {
      return next({name:'macd'})
    }else {
      next()
    }

  }
});

router.afterEach(to => {
  window.scrollTo(0, 0);
});

export default router;
