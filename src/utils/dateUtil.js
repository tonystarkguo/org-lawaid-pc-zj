import config from './config'
import lodash from 'lodash'


const dateUtil = {

  /*
    将long类型的时间转换成指定的时间格式
  */
  convertToDate(input, ft){
    if(!input){
      return input
    }
    let dt = new Date(input)
    return dt.format(ft)
  }
}

module.exports = dateUtil
