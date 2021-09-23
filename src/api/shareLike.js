//
import request from "@/utils/axios";
//

export default {

	getLikeList(data){
		return request({
			url: "getLikeList", // 假地址 自行替换
			method: "post",
			data
		});
	},
	getLikeRealTime(data){
		return request({
			url: "getLikeRealTime", // 假地址 自行替换
			method: "post",
			data
		});
	},
	addLike(data) {
		return request({
			url: "addLike", // 假地址 自行替换
			method: "post",
			data
		});
	},
	deleteLike(data) {
		return request({
			url: "deleteLike", // 假地址 自行替换
			method: "post",
			data
		});
	},


};
