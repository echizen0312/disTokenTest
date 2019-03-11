/**
 * Created by Kc on 2018/06/04.
 */
import axios from 'axios';
const qs = require('qs');
const service = axios.create({
  //设置默认请求头
  headers: {
    'content-type': 'application/x-www-form-urlencoded'
  },
  validateStatus: status => {
    /* if (status==401 || status == 504){
      location.href='#/Login';
    } */
    return status >= 200 && status < 300;
  }
})
export default new class api {
  constructor() {
    this.base = process.env.NODE_ENV === 'development'?'/wap/':'/expo/sys/';
  }
  getSession = (parmas) => {
    return service.get(`${this.base}getSession`, parmas).then(res => res)
  }
  createAccount = (url,parmas) => {
    return service.post(`${url}`, qs.stringify(parmas)).then(res => res)
  }
/*   getTokenList = (url,parmas) => {
    return service.post(`${url}`, qs.stringify(parmas)).then(res => res)
  } */
}