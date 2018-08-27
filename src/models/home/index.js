import { getDataService, postDataService } from '../../services/commonService'
import { config, caseStatusConverter, createDicNodes, jsUtil } from '../../utils'
import { message } from 'antd'
const { api } = config

export default {
  namespace: 'home',
  state: {
    modalViewInfo: {
      visible: false,
      content: '',
    },
    fileModal:{
      fileData: {},
      fileList: [],
      finishedUpload: true,
    },
    modalAddInfo: {
      visible: false,
      content: '',
    },
    caseCount: {},
    list: [],
    StatisticsData: {},
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/home') {
          dispatch({ type: 'getData' })
           dispatch({ type: 'beforeUpload'})
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
      let fileModal = yield select(({home}) => home.fileModal)
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

    *getData ({ payload }, { call, put }) {
      const caseCount = yield call(getDataService, { url: api.getCaseAndConsultCount })
      const list = yield call(getDataService, { url: api.getListSysAnnouncements }, { pageNum: 1, pageSize: 100 })
      const StatisticsData = yield call(getDataService, { url: api.getStatisticsYearAndMonth })
      if (caseCount.success && list.success && StatisticsData.success) {
        yield put({
          type: 'setData',
          payload: {
            list: list.data.list,
            caseCount: caseCount.data,
            StatisticsData: StatisticsData.data,
          },
        })
      } else {
        throw caseCount
      }
    },
    *createAnnouncement ({ payload }, {select, call, put }) {
      let files = yield select(({ home }) => home.fileModal.fileList)
      files = files.filter(item => item.status === 'done')
      const params = {
          ...payload,
          fileStorageCtoList: files
      }
      const res = yield call(postDataService, { url: api.createAnnouncement }, {...params})
      if (res.success) {
        const list = yield call(getDataService, { url: api.getListSysAnnouncements }, { pageNum: 1, pageSize: 100 })
        if (list.success) {
          yield put({
            type: 'setList',
            payload: list.data.list,
          })
        } else {
          throw list
        }
      } else {
        throw res
      }
    },
    *handleShowModalView ({ payload }, { call, put }) {
      const res = yield call(getDataService, { url: api.getNoticeListDetail }, { id: payload })
      if (res.success) {
        yield put({
          type: 'showModalView',
          payload: res.data,
        })
      }
    },
    *handleShowModalAdd ({ payload }, { call, put }) {
      yield put({
        type: 'showModalAdd',
      })
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
  	setFileData(state, action) {
      const dt = new Date().format('yyyyMMdd')
      const lg = new Date().getTime()
      const fileData = {
        endPoint: action.payload.endPoint,
        OSSAccessKeyId: action.payload.accessid,
        policy: action.payload.policy,
        Signature: action.payload.signature,
        key: 'orm/' + dt + '/' + lg + '_'+ '${filename}',
        // key: 'doc/${filename}'
      }

      return {...state, fileModal: {fileList:[], fileData: fileData,finishedUpload:true}}
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
        },
      }
    },
    removeFile(state, action) {
      let uid = action.payload.uid
      let buildList = _.filter(state.fileModal.fileList, (itm) => itm.uid !== uid)
      return {...state, fileModal: {...state.fileModal, fileList: buildList}}
    },
    setList (state, action) {
      return { ...state, modalAddInfo: { ...state.modalAddInfo, visible: false }, list: action.payload }
    },
    setData (state, action) {
      return { ...state, ...action.payload }
    },
    showModalView (state, action) {
      return { ...state, modalViewInfo: { ...state.modalViewInfo, visible: true, content: action.payload }}
    },
    hideModalView (state, action) {
      return { ...state, modalViewInfo: { ...state.modalViewInfo, visible: false }}
    },  
    showModalAdd (state, action) {
      return { ...state, modalAddInfo: { ...state.modalAddInfo, visible: true },fileModal:{...state.fileModal,fileList:[]}}
    },
    hideModalAdd (state, action) {
      return { ...state, modalAddInfo: { ...state.modalAddInfo, visible: false },fileModal:{...state.fileModal,fileList:[]}}
    },
  },
}