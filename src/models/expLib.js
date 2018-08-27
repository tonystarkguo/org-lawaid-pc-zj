import { getDataService, postDataService } from '../services/commonService'
import { config, jsUtil } from '../utils'
import { parse } from 'qs'
import { message } from 'antd'

const { api } = config
const { getLabelByValue, createTreeBydics, createCurrentList } = jsUtil

export default {
  namespace: 'expLib',
  state: {
    list: [],
    currentItem: {},
    importModalVisible: false,
    addModalVisible: false,
    modalType: 'create',
    addModalType: 'add',
    pagination:{
      showSizeChanger: true,
      showQuickJumber: true,
      showTotal: total => `共${total} 条`,
      current: 1,
      total: null
    },
    modalList: {
      layerList: [],
      layerPagination:{
        showSizeChanger: true,
        showQuickJumber: true,
        pageSizeOptions: ['5', '10'],
        showTotal: total => `共${total} 条`,
        current: 1,
        total: null
      },
    },
    allConfig: {},
    imgUrl: '',
    fileData: {},
    showDetail: false,
    searchKeys: {
      name: {value: ''},
      mobile: {value: ''},
      workUnit: {value: ''},
      isDeleted: {value: ''},
    },//列表表头搜索关键字列表
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/expLib') {
          dispatch({type: 'initPage'})
          dispatch({type: 'query', payload: {...location.query}})
          dispatch({type: 'setAllConfig'}) //获取所有字典
          dispatch({ type: 'beforeUpload' })//获取阿里云授权
        }
      })
    }
  },
  effects: {

    * query ({ payload = {} }, { select, call, put }) {
      const searchKeys = yield select(({ expLib }) => expLib.searchKeys)
      let criterias = _.mapValues(searchKeys, (item, index) => {
        return item.value
      })
      criterias = _.pickBy(criterias, (item) => {
        return !jsUtil.isNull(item)
      })

      let reqParams = {}
      reqParams.pageNum = payload.pageNum && Number(payload.pageNum) || 1
      reqParams.pageSize = payload.pageSize && Number(payload.pageSize) || 10
      reqParams.serviceId = 'srvid_queryExpertList'

      const res = yield call(getDataService, {url: api.queryExpertList}, {...reqParams, ...criterias})

      if (res.success) {
        let resData = res && res.data && res.data.list || []
        let pageNum = pageNum || 1
        let pageSize = 10
        let startSeq = (pageNum == 1 ? 1 : (2*Number(pageSize) + 1))

        resData = resData.map((item, index) => {
          let newItem = item;
          if(newItem.isDeleted === true){
            newItem.isDeleted = '删除'
          }else if(newItem.isDeleted === false){
            newItem.isDeleted = '未删除'
          }else{
            newItem.isDeleted = ''
          }
          newItem.seq = startSeq++
          return newItem
        })

        yield put({
          type: 'querySuccess',
          payload: {
            list: resData,
            pagination: {
              current: Number(payload.pageNum) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: res.data.total
            }
          }
        })
        
      }
    },

    * import ({ payload }, { call, put }) {
      const res = yield call(getDataService, {url:api.ExpertList}, { ...payload ,serviceId: 'srvid_ExpertList'})
      if (res.success) {
        let resData = res && res.data && res.data.list || []
        let pageNum = pageNum || 1
        let pageSize = 5
        let startSeq = (pageNum == 1 ? 1 : (2*Number(pageSize) + 1))

        resData = resData.map((item, index) => {
          let newItem = item;
          if(newItem.isDeleted === true){
            newItem.isDeleted = '删除'
          }else if(newItem.isDeleted === false){
            newItem.isDeleted = '未删除'
          }else{
            newItem.isDeleted = ''
          }
          newItem.seq = startSeq++
          return newItem
        })

        yield put({ type: 'showImportModal' })
        yield put({
          type: 'importSuccess',
          payload: {
            layerList: resData,
            layerPagination: {
              current: Number(payload.pageNum) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total: res.data.total
            }
          }
        })
        
      }
    },

    * create ({ payload }, { call, put }) {
      const res = yield call(postDataService, {url:api.addExpertsToMyOrg}, [payload])
      if (res.success) {
        yield put({ type: 'hideImportModal' })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    /** add ({ payload }, { select, call, put }) {
      const res = yield call(postDataService, {url:api.addExpertsToMyOrg}, {...payload, serviceId: 'srvid_addExpertsToMyOrg'})
      if(res.code === '40015'){
        message.error('援助人员已经存在！')
        return
      } else if(res.code === '1'){
        yield put({ type: 'hideAddModal' })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },*/

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ expLib }) => expLib.currentItem.id)
      const params = { ...payload, id }
      const res = yield call(postDataService, {url:api.modifyExpertInfo}, {...params, serviceId: 'srvid_modifyExpertInfo'})
      if (res.success) {
        yield put({ type: 'hideAddModal' })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    * back ({ payload }, { select, call, put }) {
      let params = {
        isDeleted: false,
        id: payload.id
      }
      const res = yield call(postDataService, {url:api.operationExpert}, {...params, serviceId: 'srvid_operationExpert'})
      if (res.success) {
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    * remove ({ payload }, { select, call, put }) {
      let params = {
        isDeleted: true,
        id: payload.id
      }
      const res = yield call(postDataService, {url:api.operationExpert}, {...params, serviceId: 'srvid_operationExpert'})
      if (res.success) {
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    * beforeUpload ({payload}, {select, call, put}) {
      let res = yield call(getDataService, {url: api.ossGetPolicy}, {serviceId: 'srvid_ossGetPolicy' })
      if(res.success) {
        console.log(res)
        yield put({ type:'setFileData', payload: res.data})
      }else {
        console.log(res)
      }
    },

    * updateFileList ({payload}, {select, call, put}){
      let fileData = yield select(({ expLib }) => expLib.fileData)
      let newFileUrl = fileData.key.split("_")[0] + '_' + payload.name
      console.log(newFileUrl)
      const params = { key: newFileUrl }
      const res = yield call(getDataService, { url: api.getUrl }, {...params, serviceId: 'srvid_getUrl'})
      if(res.success){
        console.log(res.data.url)
        yield put({ type:'getUrlSuc', payload: res.data.url })
      }
    },

  },
  reducers: {
    initPage(state, action) {
      return {
        ...state, 
        searchKeys: {
          name: {value: ''},
          mobile: {value: ''},
          workUnit: {value: ''},
          isDeleted: {value: ''},
        }
      }
    },
    querySuccess (state, action){
      const { list, pagination } = action.payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination
        },
      }
    },
    importSuccess (state, action){
      const { layerList, layerPagination } = action.payload
      return {
        ...state,
        modalList: {
          layerList,
          layerPagination: {
            ...state.modalList.layerPagination,
            ...layerPagination
          }
        }
      }
    },
    showImportModal (state, action){
      return {...state, importModalVisible: true, showDetail: false}
    },
    hideImportModal (state, action){
      return {...state, importModalVisible: false}
    },
    showAddModal (state, action){
      return {...state, ...action.payload, addModalVisible: true}
    },
    hideAddModal (state, action){
      return {...state, imgUrl: '', addModalVisible: false}
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
    updateFile(state, action) {
      let url = 'http://public-content-zj.oss-cn-hangzhou.aliyuncs.com'
      let fileData = action.payload.fileData
      url = url + '/' + fileData.key.split("_")[0] + '_' + action.payload.file.name
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
    changeState(state){
      return {...state, showDetail: true}
    },
    updateFilterFields (state, action){
      return {...state, searchKeys: {...state.searchKeys, ...action.payload}}
    },
  }
}