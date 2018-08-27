import { postDataService, getDataService } from '../../services/commonService'
import { routerRedux } from 'dva/router'
import { config, jsUtil } from '../../utils'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import moment from 'moment'

const { api } = config
const { getLabelByValue, createTreeBydics, createCurrentList } = jsUtil

export default {
  namespace: 'telephone',
  state: {
    caseReason: [],//案由
    fileModal:{
      fileData: {},
      fileList: [],
    },
    consultHistory: [],
    allConfig: {},//字典
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/addAdvice/telephone').exec(location.pathname)
        if (match) {
          dispatch({type: 'setAllConfig'}) //获取所有字典
          dispatch({ type: 'setCaseReason' })//获取案由
          dispatch({ type: 'beforeUpload'})//获取阿里云授权
        }
      })
    },
  },
  effects: {

    * beforeUpload ({payload}, {select, call, put}) {
      let res = yield call(getDataService, {url: api.ossGetPolicy}, {serviceId: 'srvid_ossGetPolicy' })
      if(res.success) {
        yield put({ type:'setFileData', payload: res.data})
      }else {
        throw res
      }
    },

    * updateFileList ({payload}, {select, call, put}){
      let fileModal = yield select(({telephone}) => telephone.fileModal)
      // let fileList = fileModal.fileList
      let fileData = fileModal.fileData
      let file = payload.file
      let fileList = payload.fileList
      let newFileUrl = fileData.key.split("_")[0] + '_' + file.name
      const params = {
        key: newFileUrl
      }
      if(file.status === 'done'){
        const data = yield call(getDataService, { url: api.getUrl }, {...params, serviceId: 'srvid_getUrl'})
        if (data.success) {
          yield put({
            type: 'getUrlSuc',
            payload: {
              file: {
                ...file,
                objectKey: newFileUrl,
                url: data.data.url,
              },
              fileList: fileList,
              finishedUpload: true,
            }
          })
        }
      }else {
        yield put({
          type: 'getUrlSuc',
          payload: {
            file,
            fileList,
            finishedUpload: false,
          }
        })
      }
      // 更新当前上传列表中哪些已经上传完成
      yield put({
        type: 'updateCurDoneFileList',
        payload: file,
      })
    },

    /** save({ payload }, { select, put, call }) {
      const files = yield select(({ telephone }) => telephone.fileModal.fileList)
      let user = JSON.parse(localStorage.getItem('user'))
      let params = {
        tOrgId: user.tOrgId,
        abbreviation: user.abbreviation,
        answerGlobalId: user.tGlobalId,
        isSubmit: 0,
        files: files,
        ...payload
      }
      const data = yield call(postDataService, { url:api.saveOrCommitConsultUrl }, { ...params, serviceId: 'srvid_saveOrCommitConsultUrl'})
      if (data.success) {
        yield put(routerRedux.push('/adviceQuery'))
      }else{
        console.log(data)
      }
    },*/

    * submit({ payload }, { select, put, call }) {
      let files = yield select(({ telephone }) => telephone.fileModal.fileList)
      files = files.filter(item => item.status === 'done')
      let user = JSON.parse(localStorage.getItem('user'))
      let params = {
        tOrgId: user.tOrgId,
        abbreviation: user.abbreviation,
        answerGlobalId: user.tGlobalId,
        isSubmit: 1,
        files: files,
        ...payload
      }
      const data = yield call(postDataService, { url:api.saveOrCommitConsultUrl }, { ...params, serviceId: 'srvid_saveOrCommitConsultUrl'})
      if (data.success) {
        yield put(routerRedux.push('/adviceQuery'))
      }else{
        console.log(data)
      }
    },

    * showHistory({ payload }, { put, call }) {
      const res = yield call(getDataService, { url:api.getConsultHistory }, { cardCode: payload, serviceId: 'srvid_getConsultHistory'})
      if (res.success) {
        yield put({ type: 'getHistorySuccess', payload: res.data })
      }else{
        throw res
      }
    },

  },
  reducers: {
    updateProgress(state, action){
      return {...state, curTotalFileList: action.payload}
    },
    updateCurDoneFileList(state, action){
      let uid = action.payload.uid
      let file = action.payload
      let curTotalFileList = state.curTotalFileList
      let percent = file.percent
      percent = 1*percent.toFixed(2)
      curTotalFileList = curTotalFileList.map(item => {
        let result = item
        if (item.uid === uid) {
          item.status = file.status
          item.percent = percent
          item.fileName = file.name
        }
        return item
      })
      return {...state, curTotalFileList: curTotalFileList}
    },
    getHistorySuccess(state, action){
      return {...state, consultHistory: action.payload}
    },
    setCaseReason(state) {
      const caseReasonList = JSON.parse(localStorage.getItem('caseReasonList'))
      return {
        ...state,
        caseReason: caseReasonList
      }
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
      return {...state, fileModal: {fileList:[], fileData: fileData,finishedUpload:true,}}
    },
    getUrlSuc(state, action) {
      let fileObj = action.payload.file
      let fileList = action.payload.fileList
      // 找到对应的file，加上传参时需要的字段
      fileList = fileList.map((item, index) => {
        if(item.uid === fileObj.uid) {
          item.url = fileObj.url || ''
          item.objectKey = fileObj.objectKey || ''
        }
        return item
      })

      return {
        ...state,
        fileModal: {
          ...state.fileModal,
          fileList: fileList,
          finishedUpload: action.payload.finishedUpload,
        }
      }

    },
    removeFile(state, action) {
      let uid = action.payload.uid
      let buildList = _.filter(state.fileModal.fileList, (itm) => itm.uid !== uid)
      return {...state, fileModal: {...state.fileModal, fileList: buildList}}
    },
    setAllConfig(state, action) {
      const allConfig = JSON.parse(localStorage.getItem('allConfig')) || {}
      const {dictData} = allConfig || {}
      const { dic_case_type, dic_legal_position, dic_legal_status, dic_org_aid_type } = dictData || {}
      const dic_standing = createTreeBydics(dic_case_type, dic_legal_status, dic_legal_position) || []
      const new_dic_standing = createCurrentList(dic_standing) || []
      const org_aid_type = createTreeBydics(dic_case_type, dic_org_aid_type) || []
      const new_org_aid_type = createCurrentList(org_aid_type) || []
      return {
        ...state,
        allConfig,
        new_dic_standing,
        new_org_aid_type
      }
    },
  }
}

