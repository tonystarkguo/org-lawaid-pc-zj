import { request, errorMessage } from '../utils'
import { message } from 'antd'
export async function getDataService (config, params) {
  const res = await request({
    url: config.url,
    method: 'get',
    data: { ...params, random: new Date().getTime() }
  })
  const code = res.code
  if (code !== '1') {
    if (code !== '9999') {
      res.success = false
      if (errorMessage[code]) {
        message.warning(errorMessage[code], 5)
      } else if (errorMessage[code] === null){

      } else {
        message.warning('系统错误', 5)
      }
    }
  }
  if (code === '40000') {
		// 处理token过期，清除storage中的user对象，token
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location = '/login'
  } else if (code === '-1') {
    return res
  } else {
    return res
  }
}

export async function postDataService (config, params) {
  const res = await request({
    url: config.url,
    method: 'post',
    data: params,
  })
  const code = res.code
  if (code !== '1') {
    if (code !== '9999') {
      res.success = false
      if (errorMessage[code]) {
        message.warning(errorMessage[code], 5)
      } else if (errorMessage[code] === null){

      } else {
        message.warning('系统错误', 5)
      }
    }
  }
  if (code === '40000') {
		// 处理token过期，清除storage中的user对象，token
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location = '/login'
  } else if (code === '-1') { // 后台返回错误代码
    return res
  } else if (code === 500 || code === '40140') {
    // message.warning(`系统繁忙，请联系系统管理员, code:${code}`)
    res.success = false
    return res
  } else {
    return res
  }
}
