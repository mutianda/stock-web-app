

export default {
	// 是否时被其它页面调用
	namespaced: true,

	state: {
		routerList:[]
	},

	getters: {
	},

	mutations: {
		saveRouter(state,routerList) {
			state.routerList = routerList
		}

	},

	actions: {

	},
}