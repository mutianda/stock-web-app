const userInfo = localStorage.getItem('user')
const user = userInfo?JSON.parse(userInfo):{}
import api from '@/api'

export default {
	// 是否时被其它页面调用
	namespaced: true,

	state: {
		routerList:[],
		likeList:[],
		realTimeList:[],
		realTimeTable:[],
		user:user
	},


	getters: {
		likeMap(state){
			const map = {}
			state.likeList.forEach(item=>{
				map[item.share_code] = item
			})

			return map
		},
		realTimeMap(state){
			const map = {}
			state.realTimeList.forEach(item=>{
				map[item.share_code] = item
			})

			return map
		}
	},

	mutations: {
		saveRouter(state,routerList) {
			state.routerList = routerList
		},
		saveLikeList(state,likeList) {
			state.likeList=likeList
		},

		saveRealTimeTable(state,list){
			state.realTimeTable = list
		},
		saveRealTimeList(state,list){
			state.realTimeList = list
		},


	},

	actions: {
		getLikeList({ commit ,state}){

			api.shareLike.getLikeList({email: state.user.email}).then(res=>{
				if(res.code==200){
					commit('saveLikeList',res.data)

				}else {
					commit('saveLikeList',[])
				}
			})
		},
		getRealTimePush({ commit ,state}){
			api.realTime.getRealTimePush({email: state.user.email}).then(res=>{
				if(res.code==200){
					commit('saveRealTimeList',res.data)

				}else {
					commit('saveRealTimeList',[])
				}
			})
		}

	},
}