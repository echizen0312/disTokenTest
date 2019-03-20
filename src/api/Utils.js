/**
 * Created by Kc on 2019/02/21.
 */
export default class myUtils {
  /**
   * 删除重复对象
   * @param Array
   * @returns Array
  */
  static DelObject(list){
    let unique = {};
    list.forEach(function(a){ unique[ JSON.stringify(a) ] = 1 });
    list= Object.keys(unique).map(function(u){ return JSON.parse(u) });
    return list
  }

  /**
   * 倒计时
   * @param String
   * @returns String
  */
  static formatDuring(mss){
    const days = parseInt(mss / (1000 * 60 * 60 * 24));
    const hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = parseInt((mss % (1000 * 60)) / 1000);
    if(days==0 && hours!=0){
      return `${hours}时${minutes}分${seconds}秒`;
    }
    else if(days==0 && hours==0 && minutes!=0){
      return `${minutes}分${seconds}秒`;
    }
    else if(days==0 && hours==0 && minutes==0 && seconds!=0){
      return `${seconds}秒`
    }else if(days==0 && hours==0 && minutes==0 && seconds==0){
      return 0;
    }else{
      return `${days}天${hours}时${minutes}分${seconds}秒`;
    }
  }

  /**
   * 把时间转换成文字(刚刚 几分钟前 几小时前 几天前 几个月前)
   * @param Date
   * @returns String
  */
  static timeago(dateTimeStamp){
    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    //let halfamonth = day * 15;
    let month = day * 30;
    let result = '';
    if(dateTimeStamp==undefined){
      return;
    }else{
      let sTime = dateTimeStamp;
      let now = new Date().getTime();
      let diffValue = now - sTime;
      if(diffValue < 0){
        return;
      }
      let monthC =diffValue/month;
      let weekC =diffValue/(7*day);
      let dayC =diffValue/day;
      let hourC =diffValue/hour;
      let minC =diffValue/minute;
      if(monthC>=1){
        result = parseInt(monthC) + '个月前';
      }
      else if(weekC>=1){
        result = parseInt(weekC) + '周前';
      }
      else if(dayC>=1){
        result = parseInt(dayC) +'天前';
      }
      else if(hourC>=1){
        result = parseInt(hourC) +'小时前';
      }
      else if(minC>=1){
        result = parseInt(minC) +'分钟前';
      }else if(minC<1){
        result = '刚刚';
      }else{
        let datetime = new Date();
        datetime.setTime(dateTimeStamp);
        let Nyear = datetime.getFullYear();
        let Nmonth = datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        let Ndate = datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate();
        let Nhour = datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours();
        let Nminute = datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes();
        let Nsecond = datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds();
        result = `${Nyear}-${Nmonth}-${Ndate} ${Nhour}:${Nminute}:${Nsecond}`;
      }
    }
    return result;
  }

  /**
   * 日期格式化
   * @param Date|String
   * @returns Date
  */
  static format(d, fmt){
    let date = new Date(d);
    let o = {
      'M+': date.getMonth() + 1, //月份
      'd+': date.getDate(), //日
      'h+': date.getHours(), //小时
      'm+': date.getMinutes(), //分
      's+': date.getSeconds(), //秒
      'q+': Math.floor((date.getMonth() + 3) / 3), //季度
      'S': date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    for(let k in o){
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
      return fmt;
    }
  }

  /**
   * 去掉年份和秒数
   * @param Date
   * @returns Date
  */
  static NewDates(d){
    d=d.replace(new RegExp(/-/gm) ,'/');
    let nowd = new Date(d).getFullYear();
    let Newd = new Date().getFullYear();
    return nowd==Newd?d.substring(5,16):d;
  }
  /**
   * 数组随机排序
   * @param Array
   * @returns Array
  */
  static shuffle(arr){
    let len = arr.length;
    for(let i = 0; i < len - 1; i++){
      let idx = Math.floor(Math.random() * (len - i));
      let temp = arr[idx];
      arr[idx] = arr[len - i - 1];
      arr[len - i -1] = temp;
    }
    return arr;
  }
  /**
   * 获取URL中'?'后的字符串
   * @param
   * @returns String
  */
  static getLocationArgs(){
    let url = decodeURI(location.search); //获取url中"?"符后的字串
    let theRequest = Object.create(null);
    if (url.indexOf('?') != -1) {
      let str = url.substr(1);
      let strs = str.split('&');
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = (strs[i].split('=')[1]);
      }
    }
    return theRequest;
  }
}