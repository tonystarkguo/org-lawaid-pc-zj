import { postDataService, getDataService } from '../services/commonService'
import { routerRedux } from 'dva/router'
import { config, jsUtil } from '../utils'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'

const { api } = config

export default {
  namespace: 'personalMsg',
  state: {
    info: {},
    imgUrl: '',
    fileData: {},
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/personalMsg').exec(location.pathname)
        if (match) {
          dispatch({ type: 'query' })//获取基本资料
          dispatch({ type: 'beforeUpload' })//获取阿里云授权
        }
      })
    },
  },
  effects: {

    * query ({payload}, {select, call, put}) {
      let res = yield call(getDataService, {url: api.getOrgPersonInfo}, {serviceId: 'srvid_getOrgPersonInfo' })
      if(res.success) {
        yield put({ type:'querySuccess', payload:res.data })
      }else {
        throw res
      }
    },

    * updatePassword ({payload}, {select, call, put}) {
      let res = yield call(postDataService, {url: api.updatePwdUrl}, {...payload, serviceId: 'srvid_updatePwdUrl' })
      if (res.success) {
        message.success('修改成功')
      } else {
        throw res
      }
    },

    * updateInfo ({payload}, {select, call, put}) {
      let tOrmUserId = JSON.parse(localStorage.getItem('user')).userId
      let params = { ...payload, tOrmUserId }
      let res = yield call(postDataService, {url: api.updateOrgPersonInfo}, {...params, serviceId: 'srvid_updateOrgPersonInfo' })
      if(res.success) {
        message.success('提交成功')
        yield put({ type: 'query' })
      }else {
        throw res
      }
    },

    * updateHead ({payload}, {select, call, put}) {
      let user = JSON.parse(localStorage.getItem('user'))
      const imgUrl = yield select(({ personalMsg }) => personalMsg.imgUrl)
      if (imgUrl === '') {
        message.error('请先上传图片')
        return
      }
      let res = yield call(postDataService, {url: api.updateHeadPicUrl}, { headPic: imgUrl, serviceId: 'srvid_updateHeadPicUrl' })
      if(res.success) {
        message.success('提交成功')
        yield put({ type:'query' })
        user.headPic = imgUrl
        localStorage.setItem('user', JSON.stringify(user))
      }else {
        throw res
      }
    },

    * beforeUpload ({payload}, {select, call, put}) {
      let res = yield call(getDataService, {url: api.ossGetPolicy}, {serviceId: 'srvid_ossGetPolicy' })
      if(res.success) {
        console.log(res)
        yield put({ type:'setFileData', payload: res.data})
      }else {
        throw res
      }
    },

    * updateFileList ({payload}, {select, call, put}){
      let fileData = yield select(({ personalMsg }) => personalMsg.fileData)
      let newFileUrl = fileData.key.split('_')[0] + '_' + payload.name
      const params = {
        key: newFileUrl
      }
      const res = yield call(getDataService, { url: api.getUrl }, {...params, serviceId: 'srvid_getUrl'})
      if(res.success){
        yield put({ type:'getUrlSuc', payload: res.data.url })
      }
    },

  },

  reducers: {
    updateFile(state, action) {
      // let url = 'http://public-content-zj.oss-cn-hangzhou.aliyuncs.com'//生产环境
      // let url = 'http://public-content-zhj.oss-cn-shenzhen.aliyuncs.com'//开发环境
      let fileData = action.payload.fileData
      let url = api.publicBuketUrl + '/' + fileData.key.split("_")[0] + '_' + action.payload.file.name
      return {...state, imgUrl: url}
    },
    setFileData(state, action) {
      const dt = new Date().format('yyyyMMdd')
      const lg = new Date().getTime()
      const fileData = {
        endPoint: action.payload.endPoint,
        OSSAccessKeyId: action.payload.accessid,
        policy: action.payload.policy,
        Signature: action.payload.signature,
        key: 'orm/' + dt + '/' + lg + '_'+ '${filename}',
      }

      return {...state, fileData:fileData}
    },
    getUrlSuc(state, action) {
      return {...state, imgUrl: action.payload}
    },
    querySuccess(state, action){
      return {...state, info: action.payload}
    },
    showContent(state){
      return {...state, isShow: true}
    },
    hideContent(state){
      return {...state, isShow: false}
    }
  }
}

