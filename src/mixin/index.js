let MIXIN = {
	data() {
		return {

		}
	},
	computed:{
		user(){
			return this.$store.state.common.user
		},
		likeMap(){
			return this.$store.getters["common/likeMap"]
		},
		realTimeMap(){
			return this.$store.getters["common/realTimeMap"]
		}


	},
	created() {

	},

	mounted() {},
	methods: {
		getLikeList(){
			this.$store.dispatch('common/getLikeList')
		},
		getRealTimeList(){
			this.$store.dispatch('common/getRealTimePush')
		},
	}
};
export default MIXIN;