import { getDataService, postDataService } from '../../services/commonService'
import pathToRegexp from 'path-to-regexp'
import { config, jsUtil } from '../../utils'
import { message, Modal } from 'antd'
const { api } = config

export default {
  namespace: 'fileModify',
  state: {
    modalViewInfo: {
      url: '',
      visible: false,
    },
   	fileModal:{
   		keys: [],
   	},
    modalCoverInfo: {
      visible: false,
    },
    classEditModalInfo: {
      visible: false,
      addClassText: '',
      showAdd: false,
    },
    submitBtnLoading: false,
    submitBtnText: '完成归档',
    tCaseId: '',
    fileType: '',
    files: [],
    dicCategory: '',
    caseSmallDetail: {
      isCover: '0',
    },
    coverUrl: '',
    imgWidth: 0,
    currentTabKey: '',
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (pathToRegexp('/fileModify/:id').exec(location.pathname)) {
          const tCaseId = pathToRegexp('/fileModify/:id').exec(location.pathname)[1]
          dispatch({
            type: 'getFileData',
            payload: {
              tCaseId,
              fileType: location.query.fileType,
            },
          })
        }
      })
    },
  },
  effects: {
    *changeCover ({ payload }, { select, call, put }) {
      const { caseSmallDetail, tCaseId } = yield select(({ fileModify }) => fileModify)
      const deleteCover = yield call(postDataService, { url: api.arrangeAdd }, { tCaseMaterialStorageId: caseSmallDetail.coverId, addrUrl: caseSmallDetail.coverUrl })
      if (deleteCover.success) {
        const params = {
          tCaseId,
          dicType: '10',
          name: payload.name,
          addrUrl: payload.url,
          objectKey: payload.key,
          dicFileType: payload.name.split('.').pop(),
        }
        const addCover = yield call(postDataService, { url: api.arrangeAdd }, { ...params })
        if (addCover.success) {
          yield put({
            type: 'setChangeCover',
            payload: addCover.data,
          })
        } else {
          throw addCover
        }
      }
    },
    *completeModify ({ payload }, { select, call }) {
      const files = yield select(({ fileModify }) => fileModify.files)
      const res = yield call(postDataService, { url: api.submitMaterialsOrder }, files)
      if (res.success) {
        message.success('编排成功！')
      } else {
        throw res
      }
    },
    *getFileData ({ payload }, { put, call }) {
      const allConfig = JSON.parse(localStorage.getItem('allConfig')) || {}
      const { dictData } = allConfig || {}
      const { tCaseId, fileType } = payload
      const underTakeFiles = yield call(getDataService, { url: api.getUndertakeVolumeMaterials }, { tCaseId })
      const examinationFiles = yield call(getDataService, { url: api.getExaminationMaterials }, { tCaseId })
      const caseSmallDetail = yield call(getDataService, { url: api.getCaseSmallDetail }, { tCaseId })
      let categroLayoutMes = yield call(getDataService, { url: api.getOrmCategroLayoutMes }, { tCaseId, dicCategoryType: fileType === 'undertake' ? '2' : '1' })
      let currentData = []
      let defaultMenu = []
      if (underTakeFiles.success && caseSmallDetail.success && examinationFiles.success && categroLayoutMes.success && caseSmallDetail.data) {
        if (caseSmallDetail.data && caseSmallDetail.data.isCover === '1' && caseSmallDetail.data.isArchiv === '0') {
          jsUtil.preloadimages(caseSmallDetail.data.coverUrl)
        }
        if (fileType === 'undertake') {
          currentData = underTakeFiles.data.filter(item => item.dicCategory)
          jsUtil.preloadimages(jsUtil.getOcadList(currentData), 'addrUrl')
          defaultMenu = dictData[`dic_${caseSmallDetail.data.undertakeVolumeDicValue}`]
    
				if(caseSmallDetail.data.dicCaseType == '01'){
					if(caseSmallDetail.data.dicOriginChannaelType == '2'){
						 (caseSmallDetail.data.caseAidWayCode == '01_02' || caseSmallDetail.data.caseAidWayCode == '01_03')  ? defaultMenu[8].name = '代理词' : defaultMenu[8].name = '辩护词'
					}else{
						(caseSmallDetail.data.caseAidWayCode == '01_02' || caseSmallDetail.data.caseAidWayCode == '01_03')  ? defaultMenu[5].name = '代理词' : defaultMenu[5].name = '辩护词'
					}
				}else{
					
				}
          if (categroLayoutMes.data.length === 0) {
            defaultMenu.forEach(menuItem => {
              if (!jsUtil.isItemInList(menuItem.name, currentData)) {
                currentData.push({
                  dicCategory: menuItem.name,
                  ocadList: [],
                  dicCategoryType: '2',
                  tCaseId,
                })
              }
            })
          } else {
            categroLayoutMes.data.forEach(menuItem => {
              menuItem.dicCategory = menuItem.categoryName
              menuItem.tCaseId = tCaseId
              menuItem.dicCategoryType = '2'
              menuItem.ocadList = []
              currentData.forEach(currentItem => {
                if (currentItem.dicCategory === menuItem.dicCategory) {
                  menuItem.ocadList = currentItem.ocadList
                }
              })
            })
          }
        } else {
          currentData = examinationFiles.data.filter(item => item.dicCategory)
          jsUtil.preloadimages(jsUtil.getOcadList(currentData), 'addrUrl')
          defaultMenu = dictData[`dic_${caseSmallDetail.data.examinationVolumeDicValue}`]
          if (categroLayoutMes.data.length === 0) {
            defaultMenu.forEach(menuItem => {
              if (!jsUtil.isItemInList(menuItem.name, currentData)) {
                currentData.push({
                  dicCategory: menuItem.name,
                  ocadList: [],
                  dicCategoryType: '1',
                  tCaseId,
                })
              }
            })
          } else {
            categroLayoutMes.data.forEach(menuItem => {
              menuItem.dicCategory = menuItem.categoryName
              menuItem.tCaseId = tCaseId
              menuItem.dicCategoryType = '1'
              menuItem.ocadList = []
              currentData.forEach(currentItem => {
                if (currentItem.dicCategory === menuItem.dicCategory) {
                  menuItem.ocadList = currentItem.ocadList
                }
              })
            })
          }
        }
        yield put({
          type: 'setFileData',
          payload: {
            files: (categroLayoutMes.data.length === 0) ? currentData : categroLayoutMes.data,
            caseSmallDetail: caseSmallDetail.data,
            dicCategory: (categroLayoutMes.data.length === 0) ? currentData && currentData[0].dicCategory : categroLayoutMes.data && categroLayoutMes.data[0].dicCategory,
            tCaseId,
            fileType,
          },
        })
        const files = (categroLayoutMes.data.length === 0) ? currentData : categroLayoutMes.data
        files.map(item => {
          item.ocadList.forEach((file,index) => {
            file.current = index
          })
        })
        yield put ({
          type: 'update',
          payload: {
              pictureView: {
                picArr:(categroLayoutMes.data.length === 0) ? currentData : categroLayoutMes.data,
                current: 0,
                // showImg: true,
              }
          },
        })
      } else {
        throw caseSmallDetail
      }
    },
    *addFile ({ payload }, { select, put, call }) {
      const { tCaseId, fileType, dicCategory, currentTabKey } = yield select(({ fileModify }) => fileModify)
       const fileModal = yield select(({ fileModify }) => fileModify.fileModal)
      const dicType = fileType === 'undertake' ? '4' : '6'
      const params = {
        tCaseId,
        dicType,
        dicCategory: currentTabKey,
        name: payload.name,
        addrUrl: payload.url,
        objectKey: fileModal.keys[payload.uid],
        dicFileType: payload.name.split('.').pop(),
      }
      const res = yield call(postDataService, { url: api.arrangeAdd }, { ...params })
      if (res.success) {
        yield put({
          type: 'setAddFile',
          payload: res.data,
        })
      } else {
        throw res
      }
    },
    *addCover ({ payload }, { select, put, call }) {
      const tCaseId = yield select(({ fileModify }) => fileModify.tCaseId)
      const params = {
        tCaseId,
        name: payload.name,
        addrUrl: payload.url,
        objectKey: payload.key,
        dicFileType: payload.name.split('.').pop(),
        dicType: '10',
      }
      const res = yield call(postDataService, { url: api.arrangeAdd }, { ...params })
      if (res.success) {
        yield put({
          type: 'setChangeCover',
          payload: res.data,
        })
      } else {
        throw res
      }
    },
    *deleteFile ({ payload }, { put, call }) {
      const res = yield call(postDataService, { url: api.arrangeAdd }, { ...payload })
      if (res.success) {
        yield put({
          type: 'afterDeleteFile',
          payload,
        })
      } else {
        throw res
      }
    },
    *deleteClass ({ payload }, { put, call }) {
      const res = yield call(postDataService, { url: api.arrangeAdds }, { ocadList: payload.ocadList })
      if (res.code === '1') {
        yield put({
          type: 'afterDeleteClass',
          payload,
        })
      } else if(res.code === '60020'){
        Modal.info({
          title: '注意',
          content: (
            <div>无法删除有材料的类别，请先移除该类别下已上传的材料，再行删除该类别。</div>
          ),
          onOk() {},
          okText: '确定',
        });
      } else {
        throw res
      }
    },
    *submitFile ({ payload }, { select, put, call }) {
      yield put({ type: 'showSubmitBtnLoading' })
      const files = yield select(({ fileModify }) => fileModify.files)
      const id = yield select(({ fileModify }) => fileModify.tCaseId)
      const filesRes = yield call(postDataService, { url: api.submitMaterialsOrder }, files)// 保存编排
      if (filesRes.success) {
        const res = yield call(postDataService, { url: api.caseArchiveAndCreateCasePDF }, { id })
        if (res.success) {
          yield put({
            type: 'toArchiv',
            payload: res.data,
          })
        } else {
          yield put({ type: 'hideSubmitBtnLoading' })
          throw res
        }
      } else {
        yield put({ type: 'hideSubmitBtnLoading' })
        throw filesRes
      }
    },
    *rotateImage({ payload }, { select, put, call }){
      const filesRes = yield call(postDataService, { url: api.rotateImage },{"degree":"90","objectKey":payload.objectKey})// 保存编排      
     let stateDate= yield select(state => state.fileModify)
     
      if(filesRes.code=="1"){
        //获取旋转后图片地址
        const filesResNew = yield call(getDataService, { url: api.getImgUrlForkey },{key:payload.objectKey})
        const objUrl ={url:filesResNew.data.url,key:payload.objectKey}
        yield put({type:"replaceImgUrl",payload:objUrl});      
      }else{

      }
      
    },
  },
  reducers: {
  	updateFileKey(state, action) {
      let keys = state.fileModal.keys
      Object.assign(keys, action.payload)
      return{
        ...state,
        fileModal: {...state.fileModal, keys,},
      }
    },
    update (state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
    showSubmitBtnLoading (state) {
      return { ...state, submitBtnLoading: true, submitBtnText: '归档中...' }
    },
    hideSubmitBtnLoading (state) {
      return { ...state, submitBtnLoading: false, submitBtnText: '完成归档' }
    },
    toArchiv (state, action) {
      return { ...state, caseSmallDetail: {
        ...state.caseSmallDetail,
        isArchiv: '1',
        examinationUrl: action.payload.examinationUrl,
        undertakeUrl: action.payload.undertakeUrl,
        twoRollsInOneUrl: action.payload.twoRollsInOneUrl,
      },
      }
    },
    setChangeCover (state, action) {
      return { ...state, coverUrl: action.payload.addrUrl, caseSmallDetail: { ...state.caseSmallDetail, coverId: action.payload.tCaseMaterialStorageId, isCover: '1' } }
    },
    setAddFile (state, action) {
      const addFile = action.payload
      const { files, currentTabKey } = state
      let currentIndex = 0
      files.forEach((item, index) => {
        if (item.dicCategory === currentTabKey) {
          currentIndex = index
        }
      })
      files[currentIndex].ocadList.push(addFile)
      return { ...state, files, tabPaneDisable: false }
    },
    setTabKey (state, action) {
      return { ...state, dicCategory: action.payload }
    },
    afterDeleteFile (state, action) {
      const { files, dicCategory } = state
      let currentIndex = 0
      files.forEach((item, index) => {
        if (item.dicCategory === dicCategory) {
          currentIndex = index
        }
      })
      const currentFile = action.payload
      const currentFiles = files[currentIndex].ocadList
      files[currentIndex].ocadList = currentFiles.filter(item => {
        return item.tCaseMaterialStorageId !== currentFile.tCaseMaterialStorageId
      })
      return { ...state, files }
    },
    setFileData (state, action) {
      return { ...state, ...action.payload }
    },
    setSortItem (state, action) {
      const files = state.files
      let currentIndex = 0
      files.forEach((item, index) => {
        if (item.dicCategory === state.dicCategory) {
          currentIndex = index
        }
      })
      files[currentIndex].ocadList = action.payload
      return { ...state, files }
    },
    setSortClass (state, action) {
      return { ...state, files: action.payload }
    },
    showModalView (state, action) {
      return { ...state, modalViewInfo: { ...state.modalViewInfo, url: action.payload.addrUrl, present:action.payload.current, visible: true } }
    },
    hideModalView (state) {
      return { ...state, modalViewInfo: { ...state.modalViewInfo, visible: false }, showImg: false }
    },
    showModalCover (state, action) {
      return { ...state, modalCoverInfo: { ...state.modalCoverInfo, url: action.payload, visible: true } }
    },
    hideModalCover (state, action) {
      return { ...state, modalCoverInfo: { ...state.modalCoverInfo, url: action.payload, visible: false } }
    },
    showClassEditModal (state) {
      return { ...state, classEditModalInfo: { ...state.classEditModalInfo, visible: true } }
    },
    hideClassEditModal (state) {
      return { ...state, classEditModalInfo: { ...state.classEditModalInfo, visible: false } }
    },
    changeClassText (state, action) {
      return { ...state, classEditModalInfo: { ...state.classEditModalInfo, addClassText: action.payload } }
    },
    showAddClass (state) {
      return { ...state, classEditModalInfo: { ...state.classEditModalInfo, showAdd: true } }
    },
    handleClassAddSubmit (state) {
      const files = state.files
      const addClassText = state.classEditModalInfo.addClassText
      const isRepeat = files.some(item => {
        return item.dicCategory === addClassText
      })
      if (isRepeat) {
        message.warning(`“${addClassText}”已存在`)
        return { ...state }
      }
      const addFile = {
        categoryName: addClassText,
        dicCategory: addClassText,
        ocadList: [],
        tCaseId: state.tCaseId,
        dicCategoryType: state.fileType === 'undertake' ? '2' : '1',
      }
      files.push(addFile)
      return { ...state, files, classEditModalInfo: { ...state.classEditModalInfo, showAdd: false, addClassText: '' } }
    },
    afterDeleteClass (state, action) {
      const files = state.files
      const currentFiles = files.filter(item => {
        return item.dicCategory !== action.payload.dicCategory
      })
      return { ...state, files: currentFiles }
    },
    setImgWidth (state, action) {
      return { ...state, imgWidth: action.payload }
    },
    setCurrentTabKey (state) {
      return { ...state, currentTabKey: state.dicCategory }
    },
    replaceImgUrl(state,action){
      const { files, dicCategory } = state
      let currentIndex = 0
      files.forEach((item, index) => {
        if (item.dicCategory === dicCategory) {
          currentIndex = index
        }
      })
      const currentFile = action.payload;
      const currentFiles = files[currentIndex].ocadList
      let indexD=0;
      currentFiles.forEach((item,index)=>{
          if(item.objectKey==currentFile.key){
            indexD=index;
          }
      });
      files[currentIndex].ocadList[indexD].addrUrl=currentFile.url;
      return { ...state, files }
    }
  },
}
