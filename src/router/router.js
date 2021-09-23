const menuRouter = [
  {
    path: "/",
    name: "home",
    title: "home",
    hidePage: true,
    redirect: '/macd',
  },
  {
    path: "/macd",
    name: "macd",
    title: "MACD",
    icon:['statistics','unstatistics',],
    component: () => import("@v/macd")
  },
  {
    path: "/search",
    name: "search",
    title: "搜索",
    icon:['search','unsearch',],
    component: () => import("@v/search")
  },
  {
    path: "/real-time",
    name: "real-time",
    title: "实时",
    icon:['warning','unwarning'],
    component: () => import("@v/real-time")
  },
  {
    path: "/like",
    name: "like",
    title: "关注",
    icon:['like','unlike'],
    component: () => import("@v/like")
  },
  {
    path: "/echarts",
    name: "echarts",
    title: "日线图",
    hidePage: true,
    component: () => import("@v/echarts")
  },



];
const defaultRouter = [  {
  path: "/login",
  name: "login",
  title: "登陆",
  component: () => import("@v/login")
},];
export { menuRouter, defaultRouter };
