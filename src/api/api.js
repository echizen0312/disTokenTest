/**
 * Created by Kc on 2018/06/04.
 */
import axios from 'axios';
const qs = require('qs');
const service = axios.create({
  //设置默认请求头
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'content-type': 'application/x-www-form-urlencoded'
  },
  validateStatus: status => {
    /* if (status==401 || status == 504){
      location.href='#/Login';
    } */
    return status >= 200 && status < 300;
  },
  withCredentials: true // 允许携带cookie
})
export default new class requestApi {
  constructor() {
    this.base = process.env.NODE_ENV === 'development'?'/wap/':'/expo/sys/';
  }
  getSession = (parmas) => {
    return service.get(`${this.base}getSession`, parmas).then(res => res)
  }
}