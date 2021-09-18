
const map = localStorage.getItem('likeMap')
const likeMap = map?JSON.parse(map):{}
export default {
	// 是否时被其它页面调用
	namespaced: true,

	state: {
		routerList:[],
		likeMap,
		realTimeTable:[]
	},


	getters: {
	},

	mutations: {
		saveRouter(state,routerList) {
			state.routerList = routerList
		},
		saveLikeMap(state,obj) {
			const map = localStorage.getItem('likeMap')
			const likeMap = map?JSON.parse(map):{}
			likeMap[obj.code] = obj.data
			state.likeMap = likeMap
			localStorage.setItem('likeMap',JSON.stringify(likeMap))
		},
		saveRealTimeList(state,list){
			state.realTimeTable = list
		},


	},

	actions: {

	},
}