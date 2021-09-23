import request from '@/utils/axios'
export default {

  addRealTimePush(data) {

    return request({
      url: 'addRealTimePush', // 假地址 自行替换
      method: 'post',
      data
    })
  },
  editRealTimePush(data) {

    return request({
      url: 'editRealTimePush', // 假地址 自行替换
      method: 'post',
      data
    })
  },
  getRealTimePush(data) {

    return request({
      url: 'getRealTimePush', // 假地址 自行替换
      method: 'post',
      data
    })
  },
  removeRealTimePush(data) {
    return request({
      url: 'removeRealTimePush', // 假地址 自行替换
      method: 'post',
      data
    })
  },
  getRealTimeList(data) {
    return request({
      url: 'getRealTimeList', // 假地址 自行替换
      method: 'post',
      data
    })
  },

}
