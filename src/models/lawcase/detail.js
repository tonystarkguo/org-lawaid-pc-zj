import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { getDataService, postDataService } from '../../services/commonService'
import { config, jsUtil, caseStatusConverter } from '../../utils'
import { message } from 'antd'
import _ from 'lodash'
const { api } = config
const { getLabelByValue, createTreeBydics, createCurrentList, getValueByLabel } = jsUtil
const caseReasonList = JSON.parse(localStorage.getItem('caseReasonList')) || {}
const allConfig = JSON.parse(localStorage.getItem('allConfig')) || {}
const { dictData } = allConfig || {}
const { dic_case_type, dic_legal_position, dic_legal_status, dic_org_aid_type, dic_case_orign_type, dic_specified_reason } = dictData || {}
const dic_standing = createTreeBydics(dic_case_type, dic_legal_status, dic_legal_position) || []
const dic_notice_reason = createTreeBydics(dic_case_orign_type, dic_specified_reason) || []
const total_dic_standing = createCurrentList(dic_standing) || []
const org_aid_type = createTreeBydics(dic_case_type, dic_org_aid_type) || []
const total_org_aid_type = createCurrentList(org_aid_type) || []
const total_specified_reason = createCurrentList(dic_notice_reason) || []
const userObj = JSON.parse(localStorage.getItem('user')) || {}

const getCurrentDics = (caseTypeCode, dics) => {
  switch (caseTypeCode) {
    case '01':
      return dics[1].children || []
    case '02':
      return dics[0].children || []
    case '03':
      return dics[2].children || []
    default:
      return []
  }
}
const getCurrentNoticeReason = (caseTypeCode, dics) => {
  switch (caseTypeCode) {
    case '1':
      return dics[0].children || []
    case '3':
      return dics[2].children || []
    default:
      return []
  }
}
export default {
  namespace: 'lawcaseDetail',
  state: {
    uploadType: 1, // 上传附件的类型：1，上传身份材料，2，上传家庭情况材料，3，上传其他相关材料
    containerLoading: false,
    data: {},
    modalVisible: false, // 弹出框的显示与隐藏控制flag
    countModalVisible: false,
    cityData: [],
    requestObj: '',
    aiderNum: '',
    aidedPersonInfoPorps: {},
    flowDetail: {
      selectedId: '',
      flowModalVisible: false,
      dataModalVisible: false,
      layerDetModalVisible: false,
      rateModalVisible: false,
      fileModalVisible: false,
      previewVisible: false,
      selectedApplyer: [], // 推荐律师阶段，已经选择的律师，或者是已经推荐过的律师列表
      hasSign: [], // 被代签
      updateReason: [], // 更换原因
      bidInfo: {}, // 竞价的信息
      bidingLawyerList: [],
      rpLawyerList: [], // 待受援人点员律师列表
      starsInfo: {}, // 四方评价的信息
      meterialInfo: {}, // 补充材料的信息
      underTakeInfo: {}, // 承办阶段信息
      recLawyerInfo: {}, // 已推荐的律师列表
      aidFeesInfo: {}, // 案件费用结算信息
      lawyerInfo: {}, // 法律援助人员信息
      toConfLawyerList: [], // 带选择律师
      lawyerList: [],
      layerPagination: {
        showSizeChanger: true,
        showQuickJumber: true,
        showTotal: total => `共${total} 条`,
        current: 1,
        total: null,
      },
    }, // 流程信息展示
    remarkDetail: {
      remarkModalVisible: false,
      item: {},
    },
    fileModal: {
      fileData: {
      	keys: [],
      },
      zptzsFileList: [],//指派通知书
      wtxyFileList: [],//委托协议
      sqwtsFileList: [],//授权委托书
      xwblFileList: [],//询问笔录
      hjzyzmFileList: [],//会见专用证明
      hjblFileList: [],//会见笔录
      yjclFileList: [],// 阅卷材料
      dcxqFileList: [],//证据材料
      dlcFileList: [],//代理词
      tsblFileList: [],//庭审笔录
      cpwsFileList: [],//裁判文书
      msqszFileList: [],//民事起诉状或答辩状、上诉状
      hjxyFileList: [],//和解协议书
      rmtjsFileList: [],//人民调解书
      fytjsFileList: [],//法援调解书
      shsFileList: [],//申诉书或再审申请书
      ldzcszsFileList: [],//劳动仲裁申请书
      xsdlyjsFileList: [],//刑事辩护（代理）意见书
      xsfdmsszFileList: [],//刑事附带民事诉状
      othersFileList: [],//其他材料
      fileList: [],
      homeFinFileList: [],
      caseRelatedFileList: [],
      finishedUpload: true,
    },
    subPersonModal: {
      modalVisible: false,
      roles: [],
      subPersonItem: {},
      title: '新增从案人员',
      caseDetail: '',
    },
    aidMsgModal: {
      modalVisible: false,
    },
    aidMaterialModal: {
      modalVisible: false
    },
    aidMsgChangeModal: {
      modalVisible: false,
      showUpload: false,
    },
    selectPrintModal: {
    	modalVisible: false,
    },
    todoData: {}, // 案件详情中待办操作区（初审，发起竞价，推荐法律援助人员，评价，归档）区域的数据
    selectedLawyers: [{ id: 111 }], // 推荐的律师
    caseApplyerInfoData: {},
    caseFinacialData: {}, // 家庭情况信息
    caseBaseInfoData: {}, // 案件详情
    caseMeteiralData: {}, // 案件材料信息
    caseLogData: {}, // 日志信息
    updaterLogData: {}, // 最新日志更新者的头像，姓名信息
    subPersonList: [], // 从案人员
    subPersonListCase: [], // 从案人员
    caseStatus: '', // 案件状态
    caseId: '', // 案件id
    isAppraise: 0, // 运营端是否评价
    flowId: '', // 流程id
    new_dic_standing: [], // 法律状态及地位 字典
    new_org_aid_type: [], // 援助方式 字典
    case_orign_type: [],  // 法律援助类型字典
    specified_reason: [], // 通知原因字典
    isApplyerInfoEditing: false,
    isCaseFinEditing: false,
    isMeterialInfoEditing: false,
    isCaseBaseInfoEditing: false,
    isCaseTakeInfoEditing: false,
    currentNodeNum: 1,
    tabLoading: false,
    allConfig: {}, // 字典
    tagList: [],
    flowNodes: [
      { key: 1, nodeName: '申请' },
      { key: 3, nodeName: '初审' },
      { key: 4, nodeName: '审查' },
      { key: 5, nodeName: '审批' },
      { key: 6, nodeName: '指派' },
      { key: 7, nodeName: '承办' },
      { key: 8, nodeName: '结案审核' },
      { key: 9, nodeName: '卷宗归档' },
      { key: 10, nodeName: '案件办结' },
    ],
    flowNodesForNet: [
      { key: 1, nodeName: '申请' },
      { key: 2, nodeName: '预审' },
      { key: 3, nodeName: '初审' },
      { key: 4, nodeName: '审查' },
      { key: 5, nodeName: '审批' },
      { key: 6, nodeName: '指派' },
      { key: 7, nodeName: '承办' },
      { key: 8, nodeName: '结案审核' },
      { key: 9, nodeName: '卷宗归档' },
      { key: 10, nodeName: '案件办结' },
    ],
    CaseMaterialFile: {},
    SuppMaterial: {},
    GoodAtDomains: [],
    caseStepFileData: [],
    undertakeFileData: [],
    identityFileData: [],
    caseReason: [], // 案由
    caseStepMaterialData: [],
    homeFinMaterialData: [],
    identityMaterialData: [],
    remarkList: {
      list: [],
      current: {},
      isMotion: localStorage.getItem('antAdminUserIsMotion') === true, // 用户根据习惯调整表格的显示方式
      pagination: { // 表格援助事项列表的分页信息
        showSizeChanger: true,
        showQuickJumber: true,
        showTotal: total => `共${total} 条`,
        current: 1,
        total: null,
      },
    },
    opinion: '没有内容',
    confirmLoading: false,
    formData: {
      opinion: {
        value: '',
      },
      comment: {
        value: '',
      },
      dicConclusion: {
        value: '1',
      },
      dicCensorConclusion: {
        value: '1',
      },
      dicReauditConclusion: {
        value: '1',
      },
      name: {
        value: '',
      },
      lawfirmName: {
        value: '',
      },
      smsToRp: {
        value: '【浙江法律援助】尊敬的{}，您在{}申请的法律援助案件（案件号：{} ），现已指派{浙江浙杭律师事务所}的{}为您服务，请三个工作日内联系援助人到{}签署委托协议，如需协助，请拨打12348咨询。',
      },
      smsToHp: {
        value: '【浙江法律援助】尊敬的{}，{}受理的法律援助案件（案件号：{}）将由您办理，请您在三个工作日内联系受援人到{}签署委托协议，并办理文件交接手续，如需协助，请拨打12348咨询。',
      },
      hpSendState: {
        value: '1',
      },
      sms: { value: '' },
      sendState: { value: 1 },
      rpSendState: {
        value: '1',
      },
      status: { value: '' },
      unthroughReason: { value: '' },
      caseYear: { value: '' },
      caseNo: { value: '' },
      number: { value: '' },
    },
    docsList: [],
    emptydocsList: [],
    appraiseInfo: {},
    judgeOpinion: {},
    recipientVisit: [],
    courtHearing: [],
    caseHandleResult: {},
    aidMsg: [],
    selectedRowKeys: [],
    storedTempStr: '',
    caseDetail: '',
    extDatePickers: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      dispatch({ type: 'setAllConfig' })
      // dispatch({type: 'setCaseReason'})
      dispatch({ type: 'getRoles' })
      dispatch({ type: 'getTagList' })
      history.listen(() => {
        const match = pathToRegexp('/lawcase/:id').exec(location.pathname)
//      console.log(match)
        if (match) {
          dispatch({ type: 'initEditStatus' }) // 初始化
          dispatch({ type: 'getDocs', payload: match[1] })
          dispatch({ type: 'getEmptyDocsUrl'})
          dispatch({ type: 'beforeUpload' })
          dispatch({
            type: 'getCaseDetail',
            payload: {
              caseId: match[1],
            },
          })
          dispatch({
            type: 'getApplyerDetail',
            payload: {
              tCaseId: match[1],
            },
          })
          dispatch({
            type: 'getSubPersonCaseList',
            payload: {
              tCaseId: match[1],
            },
          })
        } else if (location.pathname === '/createLawcase') {
          dispatch({ type: 'initEditStatus' }) // 初始化
          dispatch({ type: 'beforeUpload' })
        }
      })
    },
  },
  effects: {
    *exportHpApplyHtml ({ payload }, { select, call, put }) {
      localStorage.removeItem('printHtml')// 先删除locastorage中的数据
      const res = yield call(postDataService, { url: api.exportHpApplyHtml }, { ...payload, serviceId: 'srvid_exportHpApplyHtml' })
      if (res.code === '1') {
        localStorage.setItem('printHtml', res.data)
        // let form = document.createElement('form');
        // form.action = `${api.baseURL}/print/printView.html?from=fromLocalStorage`;
        // form.target = '_blank';

        // form.method = 'POST';

        // document.body.appendChild(form);
        // form.submit();
        let tempwindow = window.open('about:blank')
        tempwindow.location = `${api.baseURL}/print/printView.html?from=fromLocalStorage`
        // jsUtil.openwin(`${api.baseURL}/print/printView.html?from=fromLocalStorage`)
        // window.open(`${api.baseURL}/print/printView.html?defaultFileAddr=法律援助申请表.doc`);
      } else if (res.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw res
      }
    },

    *getCaseResult ({ payload }, { select, call, put }) {
      let caseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
      const res = yield call(getDataService, { url: api.getCaseHandlingResult }, { caseId, serviceId: 'srvid_getCaseHandlingResult' })
      const dicStatus = localStorage.setItem('dicStatus', res.data.dicStatus)
      if (res.success) {
        yield put({ type: 'setCaseResult', payload: res.data })
      } else if (res.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw res
      }
    },

    *getRecipientVisit ({ payload }, { select, call, put }) {
      const res = yield call(getDataService, { url: api.getRemarkListUrl }, { ...payload, remarktype: 1, serviceId: 'srvid_getRemarkListUrl' })
      if (res.success) {
        yield put({ type: 'setRecipientVisit', payload: res.data })
      } else if (res.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw res
      }
    },

    *saveRecipientVisit ({ payload }, { select, call, put }) {
      let caseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
      let params = {
        ...payload,
        tCaseId: caseId,
        dicRemarkType: 1,
      }
      const res = yield call(postDataService, { url: api.commitRemarkUrl }, { ...params, serviceId: 'srvid_commitRemarkUrl' })
      if (res.success) {
        message.success('保存成功')
        yield put({ type: 'getRecipientVisit', payload: { tCaseId: caseId } })
      } else if (res.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw res
      }
    },

    *getCourtHearing ({ payload }, { select, call, put }) {
      const res = yield call(getDataService, { url: api.getRemarkListUrl }, { ...payload, remarktype: 2, serviceId: 'srvid_getRemarkListUrl' })
      if (res.success) {
        yield put({ type: 'setCourtHearing', payload: res.data })
      } else if (res.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw res
      }
    },

    *saveCourtHearing ({ payload }, { select, call, put }) {
      let caseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
      let params = {
        ...payload,
        tCaseId: caseId,
        dicRemarkType: 2,
      }
      const res = yield call(postDataService, { url: api.commitRemarkUrl }, { ...params, serviceId: 'srvid_commitRemarkUrl' })
      if (res.success) {
        message.success('保存成功')
        yield put({ type: 'getCourtHearing', payload: { tCaseId: caseId } })
      } else if (res.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw res
      }
    },

    *stopAid ({ payload }, { select, call, put }) {
      let caseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
      const res = yield call(postDataService, { url: api.endAidUrl }, { caseId, ...payload, serviceId: 'srvid_endAidUrl' })
      if (res.success) {
        yield put(routerRedux.push('/granSubsidies'))
      } else if (res.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw res
      }
    },

    *addAidPersonManagement ({ payload }, { select, call, put}) {
      
        let tCaseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
        let selectedLawyers = yield select(({ lawcaseDetail }) => lawcaseDetail.selectedLawyers)
        const params = {
        tCaseId: tCaseId,
        tHpUserIds: _.map(selectedLawyers, 'id'),
      }
        const res = yield call(postDataService, { url: api.addUndertakeUser }, {...params})
        if(res.success) {
          yield put ({ type: 'hideAidMsgChangeModal'})
          yield put ({ type: 'setAddPersonManagement', payload: selectedLawyers})
        } else if (res.code === '9999'){

        } else {
          throw res
        }
    },

    *changeAidPerson ({ payload }, { select, call, put }) {
      let changedPerson = JSON.parse(localStorage.getItem('changedPerson'))
      payload.approveUpload.fileList.map(item => {
        
        item.addUrl = item.url
        item.fileName = item.name
        item.dicFileType = item.type
        item.subCategory = '更换法律援助人员审批表'
        item.objectKey = item.objectKey
        
      })
      payload.noticeUpload.fileList.map(item => {
       
        item.addUrl = item.url
        item.fileName = item.name
        item.dicFileType = item.type
        item.subCategory = '更换法律援助人员通知书'
        item.objectKey = item.objectKey
        
      })
     
        const resources = payload.approveUpload.fileList.concat( payload.noticeUpload.fileList)
        let tCaseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
        let selectedLawyers = yield select(({ lawcaseDetail }) => lawcaseDetail.selectedLawyers)
        const changed = {
            id:  Number(changedPerson.tHpUserIds[changedPerson.tHpUserIds.length-1].toString()),
            isChange: 1
        }
        const change = {
          id:  Number(_.map(selectedLawyers, 'id').toString()),
          isChange: 0
        }
        const thpUserIn = [change,changed]
        const params = {
          tCaseId: tCaseId,
          thpUserIn,
          resources,
        }
        if(!changedPerson){
          message.warning("请选择要更换的承办人")
        }else if(changedPerson.tHpUserIds.length>1){
          message.warning("一次只能更换一个承办人")
        }else{
        const res = yield call(postDataService, { url: api.replaceUndertakeUser }, {...params})
        if(res.success) {
          yield put ({ type: 'setChangeAidPerson', payload: payload})
          yield put ({ type: 'hideAidMsgChangeModal'})
        } else if (res.code === '9999'){
  
        } else {
          throw res
        }
      }
      },
    *editAidMainLawyer ({ payload }, { select, call, put }) {
          yield put ({ type: 'showSaveLoading' })
          let tCaseId = yield select(( { lawcaseDetail }) => lawcaseDetail.caseId)
          const res = yield call (postDataService, { url: api.updateMainUndertake }, {tCaseId,...payload})
          if(res.success) {
            yield put ({ type: 'setAidMainLawyer', payload: payload})
          } else if(res.code === '9999'){

          } else {
            throw res
          }
    },

    *delAidPerson ({ payload }, { select, call, put }){
      // yield put({ type: 'showSaveLoading' })
      let tCaseId = yield select(( {lawcaseDetail }) => lawcaseDetail.caseId)
      if(!payload.tHpUserIds || payload.tHpUserIds.length == 0){
        message.warning('请选择要删除的承办人')
      }else{
      const delId = payload.tHpUserIds[payload.tHpUserIds.length-1]
      const tHpUserId = [delId]
      const res = yield call(postDataService, {url:api.delUndertakeUser}, {tCaseId,...payload})
      if (res.success) {
          yield put ({ type: 'setDelAidPerson', payload: payload})
      } else if (res.code === '9999') {

      } else {
        throw res
      }
    }
  
    },

    *getTagList ({
      payload,
    }, { call, put }) {
      const data = yield call(getDataService, {
        url: api.getTagList,
      }, { serviceId: 'srvid_getTagList' })
      if (data.success) {
        const tagList = data
          .data
          .map(item => {
            return {
              name: item
                .tagName
                .toString(),
              code: item
                .id
                .toString(),
            }
          })
        yield put({ type: 'setTagList', payload: tagList })
      } else if (data.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw data
      }
    },
    *getRoles ({
      payload,
    }, { call, put }) {
      const data = yield call(getDataService, {
        url: api.getAllrole,
      }, { serviceId: 'srvid_getAllrole' })
      if (data.success) {
        yield put({ type: 'getRolesSuccess', payload: data.data })
      } else if (data.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw data
      }
    },
    *saveInfo ({
      payload,
    }, { select, call, put }) {
      let fileModal = yield select(({ lawcaseDetail }) => lawcaseDetail.fileModal)
      let baseInfo = yield call(postDataService, {
        url: api.addBaseInfo,
      }, {
        serviceId: 'srvid_addBaseInfo',
        ...payload.baseInfo,
      })
      if (baseInfo.success) {
        // const tRpUserId = baseInfo.data.tRpUserId
        // payload.caseInfo.tRpUserId = tRpUserId
        payload.caseInfo.rpUserInfoCheckDto = baseInfo.data
        let identifyFileList = fileModal.identifyFileList.filter(item => item.status === 'done')
        identifyFileList = identifyFileList.map(item => {
          let o = {}
          o.addr = item.url
          o.name = item.name
          o.materialType = item.materialType
          o.objectKey = item.objectKey
          o.dicCategory = '申请人身份证明材料'
          o.fileType = jsUtil.getFileExt(item.name)
          return o
        })
        let homeFinFileList = fileModal.homeFinFileList.filter(item => item.status === 'done')
        homeFinFileList = homeFinFileList.map(item => {
          let o = {}
          o.addr = item.url
          o.materialType = item.materialType
          o.name = item.name
          o.dicCategory = '经济困难证明、证明材料'
          o.objectKey = item.objectKey
          o.fileType = jsUtil.getFileExt(item.name)
          return o
        })
        let caseRelatedFileList = fileModal.caseRelatedFileList.filter(item => item.status === 'done')
        caseRelatedFileList = caseRelatedFileList.map(item => {
          let o = {}
          o.addr = item.url
          o.name = item.name
          o.materialType = item.materialType
          o.dicCategory = '申请事项证明材料复印件'
          o.objectKey = item.objectKey
          o.fileType = jsUtil.getFileExt(item.name)
          return o
        })
        let pFileList = identifyFileList.concat(homeFinFileList).concat(caseRelatedFileList)
        payload.caseInfo.fileStorageCtoList = pFileList // fileModal.fileList //受理案件的材料

        let caseInfo = yield call(postDataService, {
          url: api.saveCaseInfo,
        }, {
          serviceId: 'srvid_saveCaseInfo',
          ...payload.caseInfo,
          ...payload.baseInfo,
        })
        if (caseInfo.success) {
          if (baseInfo.data.isAdd === 'true') {
            message.success('保存成功')
          } else {
            message.success('保存成功')
          }
          if (payload.caseInfo.saveFlag === 5) {
            yield put(routerRedux.push('/lawcases?type=0'))
          } else {
            yield put(routerRedux.push('/lawcases?type=0'))
          }
        } else {
          throw caseInfo
        }
      } else if (caseInfo.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw baseInfo
      }
    },
    *beforeUpload ({
      payload,
    }, { select, call, put }) {
      let response = yield call(getDataService, {
        url: api.ossGetPolicy,
      }, { serviceId: 'srvid_ossGetPolicy' })
      if (response.success) {
        yield put({ type: 'setFileData', fileData: response.data })
      } else if (response.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw response
      }
    },
    *getApplyerDetail ({
      payload,
    }, { select, call, put }) {
      let response = yield call(getDataService, {
        url: api.getApplyerDetailUrl,
      }, {
        ...payload,
        serviceId: 'srvid_getApplyerDetail',
      })
      if (response.success) {
        if (response.data && response.data.tSmsProvince && response.data.tSmsCity && response.data.tSmsArea) {
          response.data.area = [
            response
              .data
              .tSmsProvince
              .toString(),
            response
              .data
              .tSmsCity
              .toString(),
            response
              .data
              .tSmsArea
              .toString(),
          ]
        }
        yield put({ type: 'setApplyerDetail', response })
      } else if (response.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw response
      }
    },
    *getCaseFinacialData ({
      payload,
    }, { select, call, put }) {
      const response = yield call(getDataService, {
        url: api.getCaseFinacialDataUrl,
      }, {
        ...payload,
        serviceId: 'srvid_getCaseFinancialData',
      })
      if (response.success) {
        response
          .data
          .familyIncomes
          .forEach((familyIncome, index) => {
            familyIncome.seq = index
          })
        yield put({ type: 'setCaseFinacialData', response })
      } else if (response.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw response
      }
    },
    *query ({
      payload,
    }, { call, put }) {
      // 获取流程轨迹图的节点数据 获取审核意见 点员后，获取承办律师信息 - 待签收 推荐多个律师，获取律师列表 - 待签收
      // 竞价中，竞价结束时，获取竞价律师列表，分页 已推荐的律师列表信息 更换律师信息 put({type: 'initEditStatus'})//初始化
      const data = yield call(getDataService, {
        url: api.lawcase,
      }, {
        ...payload,
        serviceId: 'srvid_lawcase',
      })
      const {
        success,
        message,
        status,
        ...other
      } = data
      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            data: other,
          },
        })
      } else if (data.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw data
      }
    },

    *handleAidMaterial ({ payload },{ call, put, select}) {
      let tCaseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
      const tHpUserId =Number(payload.tHpUserId)
      const params = {
        tCaseId,
        tHpUserId,
      }
      const res = yield call (getDataService, { url: api.getChangeFile }, { ...params})
      if (res.code === '1') {
        yield put ({ type: 'showAidMaterialModal'})
        yield put({ type: 'setAidMaterial', payload: res.data })
      } else if (res.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw res
      }
    },

    *searchLawyers ({
      payload,
    }, { call, put, select }) {
      const data = yield call(getDataService, {
        url: api.queryLawyerListBelongMyOrgForAssigned,
      }, {
        ...payload,
        serviceId: 'srvid_getLawyers',
      })
      const {
        success,
        message,
        status,
        ...other
      } = data
      if (success) {
        yield put({ type: 'updateLawyerList', payload: data.data })
      } else if (data.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw data
      }
    },

    *handleAidMaterial ({ payload },{ call, put, select}) {
      let tCaseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
      const tHpUserId =Number(payload.tHpUserId)
      const params = {
        tCaseId,
        tHpUserId,
      }
      const res = yield call (getDataService, { url: api.getChangeFile }, { ...params})
      if (res.code === '1') {
        yield put ({ type: 'showAidMaterialModal',payload: payload.tHpUserId})
        yield put({ type: 'setAidMaterial', payload: res.data })
      } else if (res.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw res
      }
    },
    *getCaseDetail ({
      payload,
    }, { call, put, select }) {
      // 获取流程轨迹图的节点数据 获取审核意见 点员后，获取承办律师信息 - 待签收 推荐多个律师，获取律师列表 - 待签收
      // 竞价中，竞价结束时，获取竞价律师列表，分页 已推荐的律师列表信息 更换律师信息
      put({ type: 'initEditStatus' }) // 初始化
      /* const data = yield call(query, payload)*/

      let caseDetailData = {}
      let caseLogData = []
      let CaseMaterialFile = {} // 线上检查-材料
      let SuppMaterial = {} // 发起规定-材料

      let lt = localStorage.getItem('listType')
      let params = payload

      const data = yield call(getDataService, {
        url: api.getCaseDetailUrl,
      }, {
        ...params,
        serviceId: 'srvid_getCaseDetailFirst',
      })
      if (data.success) {
        caseDetailData = data.data || {}
      } else if (data.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw data
      }

      let caseStatus = caseDetailData.caseStatusCode || ''
      // let caseId = caseDetailData.caseId || ''
      let caseId = params.caseId || ''
      const logData = yield call(getDataService, {
        url: api.getcaseOperLogUrl,
      }, {
        ...payload,
        serviceId: 'srvid_getCaseOperlog',
      })
      caseLogData = logData.data || []

      let updaterLogData = {}
      if (caseLogData.length) {
        const logUpdaterData = yield call(getDataService, {
          url: api.getLogUpdater,
        }, {
          tGlobalId: caseLogData[0].currentGlobalId,
          serviceId: 'srvid_getLogUpdater',
        })
        updaterLogData = logUpdaterData.data || {}
        updaterLogData = {
          ...updaterLogData,
          ...caseLogData[0],
        }
      }

      const SuppMaterialData = yield call(getDataService, {
        url: api.getSuppMaterial,
      }, {
        tCaseId: caseId,
        serviceId: 'srvid_getSuppMaterial',
      })
      if (SuppMaterialData.success) {
        SuppMaterial = SuppMaterialData.data
      }

      // 根据案件状态调用对应的接口获取需要展示的信息 1, 发起竞价-获取竞价范围信息 2，推荐法律援助人员, 竞价中-获取竞价者列表信息 3，评价中-评价详情
      // 4，发起归档，待签订委托协议，事项监督，评价中，待填写结算金额-法律援助人员信息 5，待补充材料-需补充材料信息（不显示发起机构）
      // 6，待指派，待法律援助人员确定，竞价中，待确定法律援助人员，事项监督-援助类型 7，待法律援助人员确定-已推荐法律援助人员信息列表
      // 9，待归档完成-结算金额信息

      let bidInfo = {}
      let bidingLawyerList = []
      let rpLawyerList = []
      let starsInfo = {}
      let meterialInfo = {} // 补充材料的信息
      let underTakeInfo = {} // 承办阶段信息
      let recLawyerInfo = []
      let aidFeesInfo = {}
      let lawyerInfo = {} // 法律援助人员信息
      let toConfLawyerList = [] // 待受援人选择的律师列表
      let GoodAtDomains = [] // 擅长领域
      let lawyerList = []
      let appraiseInfo = {}// 受援人满意度评价
      let judgeOpinion = {}// 法官意见征询
      let recipientVisit = []// 受援人回访
      let courtHearing = []// 庭审旁听
      let aidMsg = []// 援助人信息

      if (caseStatus === '12') { // 待指派援助人员
        let lawyerListData = yield call(getDataService, {
          url: api.queryLawyerListBelongMyOrgForAssigned,
        }, { serviceId: 'srvid_getBidInfo' })
        // lawyerList = lawyerListData.data && lawyerListData.data.list || {}
        lawyerList = lawyerListData.data || {}
      } else if (caseStatus === '15') { // 承办中
        let lawyerInfoData = yield call(getDataService, {
          url: api.getLawyerInfo,
        }, {
          tCaseId: caseId,
          serviceId: 'srvid_getLawyerInfo',
        })
        lawyerInfo = lawyerInfoData.data && lawyerInfoData.data.length && lawyerInfoData.data[0] || []
      } else if (caseStatus > 13) {
        let lawyerListData = yield call(getDataService, {
          url: api.queryLawyerListBelongMyOrgForAssigned,
        }, { serviceId: 'srvid_getBidInfo' })
        lawyerList = lawyerListData.data || {}
        // 援助人信息
        let aidMsgData = yield call(getDataService, {
          url: api.AssistanceUndertakeList,
        }, {
          tCaseId: caseId,
          serviceId: 'srvid_AssistanceUndertakeList',
        })
        aidMsg = aidMsgData.data || []
        // 受援人满意度评价
        let appraiseInfoData = yield call(getDataService, {
          url: api.appraiseInfoUrl,
        }, {
          tCaseId: caseId,
          serviceId: 'srvid_appraiseInfoUrl',
        })
        appraiseInfo = appraiseInfoData.data || {}
        // 法官意见征询
        let judgeOpinionData = yield call(getDataService, {
          url: api.getJudgeOpinionUrl,
        }, {
          caseId,
          serviceId: 'srvid_getJudgeOpinionUrl',
        })
        judgeOpinion = judgeOpinionData.data || {}
        // 获取受援人回访记录
        let recipientVisitData = yield call(getDataService, {
          url: api.getRemarkListUrl,
        }, {
          tCaseId: caseId,
          remarktype: 1,
          serviceId: 'srvid_getRemarkListUrl',
        })
        recipientVisit = recipientVisitData.data || []
        // 获取庭审旁听记录
        let courtHearingData = yield call(getDataService, {
          url: api.getRemarkListUrl,
        }, {
          tCaseId: caseId,
          remarktype: 2,
          serviceId: 'srvid_getRemarkListUrl',
        })
        courtHearing = courtHearingData.data || []
      }

      let tempData = ''
      if (caseDetailData.caseStatusCode == '1') {
        // 获取预审短信模板
        tempData = yield call(getDataService, {
          url: api.getPreAppTempUrl,
        }, {})
      } else if (caseDetailData.caseStatusCode == '10' || caseDetailData.caseStatusCode == '11') {
        // 获取审批短信模板
        tempData = yield call(getDataService, {
          url: api.getAppTempUrl,
        }, {})
      }


      let tmpStr = tempData.data && tempData.data.message || ''
      let storedTempStr = tmpStr
      let rpName = caseDetailData.rpName
      let orgName = caseDetailData.orgName
      let orgTel = caseDetailData.orgTelephone
      let caseNum = caseDetailData.caseNum


      tmpStr = tmpStr.replace('{rpName}', rpName)
      tmpStr = tmpStr.replace(/{orgName}/g, orgName)
      tmpStr = tmpStr.replace('{orgTelephone}', orgTel)
      tmpStr = tmpStr.replace('{caseNum}', caseNum)


      const caseReason = getCurrentDics(caseDetailData.caseTypeCode, caseReasonList) || []
      const new_dic_standing = getCurrentDics(caseDetailData.caseTypeCode, total_dic_standing) || []
      const new_org_aid_type = getCurrentDics(caseDetailData.caseTypeCode, total_org_aid_type) || []

      yield put({
        type: 'querySuccess',
        payload: {
          caseReason,
          new_dic_standing,
          new_org_aid_type,
          caseDetailData,
          caseLogData,
          CaseMaterialFile,
          SuppMaterial,
          updaterLogData, // 最新日志更新人员的姓名和头像
          GoodAtDomains,
          caseId: caseDetailData.tCaseId,
          appraiseInfo,
          judgeOpinion,
          recipientVisit,
          courtHearing,
          aidMsg,
          tmpStr,
          storedTempStr,
          flowDetail: {
            bidInfo, // 竞价的信息
            bidingLawyerList, // 参与竞价法律援助人员列表
            toConfLawyerList,
            rpLawyerList,
            starsInfo, // 四方评价的信息
            meterialInfo, // 补充材料的信息
            underTakeInfo, // 承办阶段信息
            recLawyerInfo, // 已推荐的律师列表
            aidFeesInfo, // 案件费用结算信息
            lawyerInfo, // 法律援助人员信息
            lawyerList: lawyerList.list, // 待指派法律援助人员 律师列表
            layerPagination: {
              current: Number(lawyerList.pageNum) || 1,
              pageSize: 5,
              total: lawyerList.total,
              pageSizeOptions: [
                '5', '10',
              ],
              showSizeChanger: true,
              showQuickJumber: true,
              showTotal: total => `共${lawyerList.total} 条`,
            },
          },
        },
      })
      yield put({
        type: 'handleNoticeReasonChange',
        value: [caseDetailData.dicOrignChannelType],
      })
    },
    *getSingleCaseDetail ({
      payload,
    }, { call, put, select }) {
      let caseDetailData = {}
      const caseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
      const data = yield call(getDataService, {
        url: api.getCaseDetailUrl,
      }, {
        caseId,
        serviceId: 'srvid_getCaseDetail',
      })
      if (data.success) {
        caseDetailData = data.data || {}
      } else if (data.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw data
      }
      yield put({ type: 'queryCaseDetailSuccess', payload: {
        caseDetailData,
      } })
    },
    *saveApplyerInfo ({
      payload,
    }, { select, put, call }) {
      yield put({ type: 'showSaveLoading' })
      const id = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
      // 此处payload中带的信息是登录表单中的所有字段信息
      let params = {}
      if (payload.area) {
        params = {
          ...payload,
          tCaseId: id,
          tSmsProvince: payload.area[0] || null,
          tSmsCity: payload.area[1] || null,
          tSmsArea: payload.area[2] || null,
        }
      } else {
        params = {
          ...payload,
          tCaseId: id,
        }
      }
      //  params = {   tCaseId:id,   tRpUserId: payload.tRpUserId,   name:
      // payload.name,   birthdate: payload.birthdate,   dicGender: payload.dicGender,
      //   dicNation: payload.dicNation,   dicEduLevel: payload.dicEduLevel,
      // workUnit: payload.workUnit,   popCates: payload.popCates,   dicNationality:
      // payload.dicNationality,   dicCardType: payload.dicCardType,   dicOccupation:
      // payload.dicOccupation,   cardCode: payload.cardCode,   mobile:
      // payload.mobile,   remark: payload.remark,   regis: payload.regis,
      // usualAddr: payload.usualAddr,   dicLegalInstWay: payload.dicLegalInstWay,
      // isApply: payload.isApply,   legalInstAddr: payload.legalInstAddr,   zipCode:
      // payload.zipCode,   applyAddress: payload.applyAddress,   applyDate:
      // payload.applyDate,   tSmsProvince: payload.area[0] || null,   tSmsCity:
      // payload.area[1] || null,   tSmsArea: payload.area[2] || null }
      const data = yield call(postDataService, {
        url: api.saveApplyerInfoUrl,
      }, {
        ...params,
        serviceId: 'srvid_saveApplyerInfoUrl',
      })
      yield put({ type: 'hideSaveLoading' })

      if (data.success) {
        yield put({ type: 'saveApplyerInfoSuc' })
        yield put({
          type: 'getApplyerDetail',
          payload: {
            tCaseId: id,
          },
        })
      } else if (data.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw data
      }
    },
    // 保存家庭财务状况信息
    *saveFinInfo ({
      payload,
    }, { select, put, call }) {
      yield put({ type: 'showSaveLoading' })
      const tCaseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
      const params = {
        tCaseId,
        ...payload,
      }
      const response = yield call(postDataService, {
        url: api.updataCaseFinacialDataUrl,
      }, {
        ...params,
        serviceId: 'srvid_updataCaseFinacialDataUrl',
      })
      yield put({ type: 'hideSaveLoading' })

      if (response.success) {
        yield put({ type: 'saveFinInfoSuc' })
      } else if (response.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw response
      }
    },
    // 援助事项基本信息
    *saveCaseBaseInfo ({
      payload,
    }, { select, put, call }) {
      yield put({ type: 'showSaveLoading' })
      const tCaseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
      const params = {
        tCaseId,
        ...payload,
      }
      const response = yield call(postDataService, {
        url: api.updataCaseBaseDataUrl,
      }, {
        ...params,
        serviceId: 'srvid_updataCaseBaseDataUrl',
      })
      yield put({ type: 'hideSaveLoading' })

      if (response.success) {
        yield put({ type: 'saveCaseBaseInfoSuc' })
        yield put({ type: 'getSingleCaseDetail' })
      } else if (response.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw response
      }
    },
    // 保存案件办理结果
    *saveCaseTakeInfo ({
      payload,
    }, { select, put, call }) {
      
      yield put({ type: 'showSaveLoading' })
      const tCaseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
      const dicStatus = localStorage.getItem('dicStatus')
      let params = {}
       params = {
        tCaseId,
        dicStatus,
        ...payload,
      }
      const { otherObj, pureList } = jsUtil.filterFormData(params, 'evi_')
      otherObj.evidenceTime = pureList.join(',')
      params = otherObj
      // 获取附件信息
      const lawcaseDetail = yield select(({lawcaseDetail}) => lawcaseDetail)
      let fileModal = yield select(({ lawcaseDetail }) => lawcaseDetail.fileModal)
      let resources = [
        {
          dicCategory: '指派通知书',
          undertakeResources: jsUtil.filterFileTypes(fileModal.zptzsFileList)
        },
        {
          dicCategory: '委托协议',
          undertakeResources: jsUtil.filterFileTypes(fileModal.wtxyFileList)
        },
        {
          dicCategory: '授权委托书',
          undertakeResources: jsUtil.filterFileTypes(fileModal.sqwtsFileList)
        },
        {
          dicCategory: '询问笔录',
          undertakeResources: jsUtil.filterFileTypes(fileModal.xwblFileList)
        },
        {
          dicCategory: '会见专用证明',
          undertakeResources: jsUtil.filterFileTypes(fileModal.hjzyzmFileList)
        },
        {
          dicCategory: '会见笔录',
          undertakeResources: jsUtil.filterFileTypes(fileModal.hjblFileList)
        },
        {
          dicCategory: '阅卷材料',
          undertakeResources: jsUtil.filterFileTypes(fileModal.yjclFileList)
        },
        {
          dicCategory: '证据材料',
          undertakeResources: jsUtil.filterFileTypes(fileModal.dcxqFileList)
        },
        {
          dicCategory: (lawcaseDetail.caseBaseInfoData.dicAidWay == '01_02' || lawcaseDetail.caseBaseInfoData.dicAidWay == '01_03') || lawcaseDetail.caseBaseInfoData.dicCaseType !== '01' ?  '代理词' : '辩护词' ,
          undertakeResources: jsUtil.filterFileTypes(fileModal.dlcFileList)
        },
        {
          dicCategory: '庭审笔录',
          undertakeResources: jsUtil.filterFileTypes(fileModal.tsblFileList)
        },
        {
          dicCategory: '裁判文书',
          undertakeResources: jsUtil.filterFileTypes(fileModal.cpwsFileList)
        },
        {
          dicCategory: '民事起诉状或答辩状、上诉状',
          undertakeResources: jsUtil.filterFileTypes(fileModal.msqszFileList)
        },
        {
          dicCategory: '和解协议书',
          undertakeResources: jsUtil.filterFileTypes(fileModal.hjxyFileList)
        },
        {
          dicCategory: '人民调解书',
          undertakeResources: jsUtil.filterFileTypes(fileModal.rmtjsFileList)
        },
        // {
        //   dicCategory: '法援调解书',
        //   undertakeResources: jsUtil.filterFileTypes(fileModal.fytjsFileList)
        // },
        {
          dicCategory: '申诉书或再审申请书',
          undertakeResources: jsUtil.filterFileTypes(fileModal.shsFileList)
        },
        {
          dicCategory: '劳动仲裁申请书',
          undertakeResources: jsUtil.filterFileTypes(fileModal.ldzcszsFileList)
        },
        {
          dicCategory: '刑事辩护（代理）意见书',
          undertakeResources: jsUtil.filterFileTypes(fileModal.xsdlyjsFileList)
        },
        {
          dicCategory: '刑事附带民事诉状',
          undertakeResources: jsUtil.filterFileTypes(fileModal.xsfdmsszFileList)
        },
        {
          dicCategory: '其他材料',
          undertakeResources: jsUtil.filterFileTypes(fileModal.othersFileList)
        },
      ]
      const response = yield call(postDataService, {
        url: api.updateCaseHandlingResult,
      }, {
        ...params,
        resources: resources,
        serviceId: 'srvid_updateCaseHandlingResult',
      })
      yield put({ type: 'hideSaveLoading' })
      if (response.success) {
        message.success('保存成功')
        yield put({ type: 'saveCaseTakeInfoSuc' })
        yield put({ type: 'getSingleCaseDetail' })
      } else if (response.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw response
      }
    },
    // 提交结案
    *saveCommitcaseInfo ({
      payload,
    }, { select, put, call }) {
      yield put({ type: 'showSaveLoading' })
      const tCaseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
      const params = {
        tCaseId,
        dicStatus: '2',
        ...payload,
      }
      const lawcaseDetail = yield select(({lawcaseDetail}) => lawcaseDetail)
      let fileModal = yield select(({ lawcaseDetail }) => lawcaseDetail.fileModal)
      let resources = [
        {
          dicCategory: '指派通知书',
          undertakeResources: jsUtil.filterFileTypes(fileModal.zptzsFileList)
        },
        {
          dicCategory: '委托协议',
          undertakeResources: jsUtil.filterFileTypes(fileModal.wtxyFileList)
        },
        {
          dicCategory: '授权委托书',
          undertakeResources: jsUtil.filterFileTypes(fileModal.sqwtsFileList)
        },
        {
          dicCategory: '询问笔录',
          undertakeResources: jsUtil.filterFileTypes(fileModal.xwblFileList)
        },
        {
          dicCategory: '会见专用证明',
          undertakeResources: jsUtil.filterFileTypes(fileModal.hjzyzmFileList)
        },
        {
          dicCategory: '会见笔录',
          undertakeResources: jsUtil.filterFileTypes(fileModal.hjblFileList)
        },
        {
          dicCategory: '阅卷材料',
          undertakeResources: jsUtil.filterFileTypes(fileModal.yjclFileList)
        },
        {
          dicCategory: '证据材料',
          undertakeResources: jsUtil.filterFileTypes(fileModal.dcxqFileList)
        },
        {
          dicCategory: (lawcaseDetail.caseBaseInfoData.dicAidWay == '01_02' || lawcaseDetail.caseBaseInfoData.dicAidWay == '01_03') || lawcaseDetail.caseBaseInfoData.dicCaseType !== '01' ?  '代理词' : '辩护词' ,
          undertakeResources: jsUtil.filterFileTypes(fileModal.dlcFileList)
        },
        {
          dicCategory: '庭审笔录',
          undertakeResources: jsUtil.filterFileTypes(fileModal.tsblFileList)
        },
        {
          dicCategory: '裁判文书',
          undertakeResources: jsUtil.filterFileTypes(fileModal.cpwsFileList)
        },
        {
          dicCategory: '民事起诉状或答辩状、上诉状',
          undertakeResources: jsUtil.filterFileTypes(fileModal.msqszFileList)
        },
        {
          dicCategory: '和解协议书',
          undertakeResources: jsUtil.filterFileTypes(fileModal.hjxyFileList)
        },
        {
          dicCategory: '人民调解书',
          undertakeResources: jsUtil.filterFileTypes(fileModal.rmtjsFileList)
        },
        // {
        //   dicCategory: '法援调解书',
        //   undertakeResources: jsUtil.filterFileTypes(fileModal.fytjsFileList)
        // },
        {
          dicCategory: '申诉书或再审申请书',
          undertakeResources: jsUtil.filterFileTypes(fileModal.shsFileList)
        },
        {
          dicCategory: '劳动仲裁申请书',
          undertakeResources: jsUtil.filterFileTypes(fileModal.ldzcszsFileList)
        },
        {
          dicCategory: '刑事辩护（代理）意见书',
          undertakeResources: jsUtil.filterFileTypes(fileModal.xsdlyjsFileList)
        },
        {
          dicCategory: '刑事附带民事诉状',
          undertakeResources: jsUtil.filterFileTypes(fileModal.xsfdmsszFileList)
        },
        {
          dicCategory: '其他材料',
          undertakeResources: jsUtil.filterFileTypes(fileModal.othersFileList)
        },
      ]
      const response = yield call(postDataService, {
        url: api.commitCase,
      }, {
        ...params,
        resources: resources,
        serviceId: 'srvid_updateCaseHandlingResult',
      })
      yield put({ type: 'hideSaveLoading' })
      if (response.success) {
        setTimeout(() => {
          window.location.reload()
        }, 1000)
        message.success('提交成功')
        yield put({ type: 'saveCaseTakeInfoSuc' })
        yield put({ type: 'getSingleCaseDetail' })
      } else if (response.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw response
      }
    },
    // 保存材料信息
    *saveMeteriaInfo ({
      payload,
    }, { put, call }) {
      yield put({ type: 'showSaveLoading' })
      // 此处payload中带的信息是登录表单中的所有字段信息
      const data = yield call(postDataService, {
        url: api.saveMeterialInfoUrl,
      }, {
        ...payload,
        serviceId: 'srvid_saveMeterialInfoUrl',
      })
      yield put({ type: 'hideSaveLoading' })

      if (data.success) {
        yield put({ type: 'saveMeteriaInfoSuc' })
      } else if (data.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw data
      }
    },
    // 发布竞价
    *publishBid ({
      payload,
    }, { put, call }) {
      const res = yield call(getDataService, {
        url: api.publishCount,
      }, {
        ...payload,
        serviceId: 'srvid_publishCount',
      })
      if (res.code === '1') {
        let data = {
          aiderNum: res.data.aiderNum,
          requestObj: payload,
        }
        yield put({ type: 'publishBidSuc', payload: data })
      } else if (res.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw res
      }
    },
    // 确认发布
    *comfirmPublish ({
      payload,
    }, { select, put, call }) {
      const listType = localStorage.getItem('listType') || '1'
      const caseDetail = yield select(({ lawcaseDetail }) => lawcaseDetail)
      const caseId = caseDetail.caseId
      const bidInfo = caseDetail.flowDetail.bidInfo
      const bidId = bidInfo.id || ''
      const res = yield call(postDataService, {
        url: api.publishPrice,
      }, {
        ...payload,
        tCaseId: caseId,
        id: bidId,
      })
      yield put({ type: 'hideCountModal' })
      if (res.code === '1') {
        yield put(routerRedux.push(`/lawcases?type=${payload.tCaseId}`))
      } else if (res.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw res
      }
    },
    // 推荐法律援助人员
    *submitBiders ({
      payload,
    }, { select, put, call }) {
      const listType = localStorage.getItem('listType') || '1'
      const caseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
      const formData = yield select(({ lawcaseDetail }) => lawcaseDetail.formData)
      const selectedLawyers = yield select(({ lawcaseDetail }) => lawcaseDetail.selectedLawyers)

      if (_.some(selectedLawyers, { isMain: 1 })) {
        let params = {
          tCaseId: caseId,
          tHpUserIds: _.map(selectedLawyers, 'id'),
          // recommendAiders: payload
          tHpUserIn: selectedLawyers,
          smsToRp: formData.smsToRp.value,
          smsToHp: formData.smsToHp.value,
          hpSendState: formData.hpSendState.value,
          rpSendState: formData.rpSendState.value,
        }
        const data = yield call(postDataService, {
          url: api.confirmAppoint,
        }, {
          ...params,
          serviceId: 'srvid_confirmAppoint',
        }) // 此处payload中带的信息是登录表单中的所有字段信息
        if (data.success) {
          message.success('指派成功')
          yield put(routerRedux.push(`/lawcases?type=${listType}`))
        } else if (data.code === '9999') {
          // do nothing, it will not update the state and will not re-render the page.
        } else {
          throw data
        }
      } else {
        message.error('请设置主承办人')
      }
    },
    // //推荐法律援助人员
    // *submitBiders({
    //   payload
    // }, {select, put, call}) {
    //   const listType = localStorage.getItem('listType') || '1'
    //   const caseId = yield select(({lawcaseDetail}) => lawcaseDetail.caseId)
    //   const formData = yield select(({lawcaseDetail}) => lawcaseDetail.formData)
    //   const selectedLawyers = yield select(({lawcaseDetail}) => lawcaseDetail.selectedLawyers)

    //   let params = {
    //     tCaseId: caseId,
    //     tHpUserIds: _.map(selectedLawyers, 'id'),
    //     // recommendAiders: payload
    //     smsToRp: formData.smsToRp.value,
    //     smsToHp: formData.smsToHp.value,
    //   }
    //   const data = yield call(postDataService, {
    //     url: api.confirmAppoint
    //   }, {
    //     ...params,
    //     serviceId: 'srvid_confirmAppoint'
    //   }) //此处payload中带的信息是登录表单中的所有字段信息
    //   if (data.success) {
    //     message.success('指派成功')
    //     yield put(routerRedux.push(`/lawcases?type=${listType}`))
    //   } else if (data.code === '9999') {
    //     //do nothing, it will not update the state and will not re-render the page.
    //   } else {
    //     throw data
    //   }
    // },
    // 提交评价
    *addComments ({
      payload,
    }, { select, put, call }) {
      const caseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
      const listType = localStorage.getItem('listType') || '1'
      let params = {
        tCaseId: caseId,
        ...payload,
      }
      const data = yield call(postDataService, {
        url: api.submitAppraise,
      }, {
        ...params,
        serviceId: 'srvid_submitAppraise',
      }) // 此处payload中带的信息是登录表单中的所有字段信息
      if (data.code === '1') {
        yield put(routerRedux.push(`/lawcases?type=${listType}`))
      } else if (data.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw data
      }
    },
    // 查看评价
    *viewAllComments ({
      payload,
    }, { put, call }) {
      // 此处payload中带的信息是登录表单中的所有字段信息
      const data = yield call(postDataService, {
        url: api.viewAllCommentsUrl,
      }, {
        ...payload,
        serviceId: 'srvid_viewAllCommentsUrl',
      })
      if (data.success) {
        yield put({ type: 'viewAllCommentsSuc' })
      } else if (data.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw data
      }
    },
    // 结束评价
    *stopComments ({
      payload,
    }, { put, call }) {
      // 此处payload中带的信息是登录表单中的所有字段信息
      const data = yield call(postDataService, {
        url: api.stopCommentsUrl,
      }, {
        ...payload,
        serviceId: 'srvid_stopCommentsUrl',
      })
      if (data.success) {
        yield put({ type: 'stopCommentsSuc' })
      } else if (data.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw data
      }
    },
    // 发起归档
    *startArch ({
      payload,
    }, { put, call }) {
      const data = yield call(postDataService, {
        url: api.startArchUrl,
      }, {
        ...payload,
        serviceId: 'srvid_startArchUrl',
      })
      if (data.success) {
        yield put({ type: 'startArchSuc' })
      } else if (data.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw data
      }
    },
    // 新增备注
    *addRemark ({
      payload,
    }, { select, put, call }) {
      yield put({ type: 'showConfirmLoading' })
      let tCaseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
      const res = yield call(postDataService, {
        url: api.checkRemark,
      }, {
        ...payload,
        tCaseId,
        serviceId: 'srvid_checkRemark',
      })
      yield put({ type: 'hideConfirmLoading' })
      if (res.success) {
        yield put({ type: 'hideRemarkModal' })
        yield put({
          type: 'getRemarkList',
          payload: {
            pageNum: 1,
            pageSize: 10,
          },
        })
      } else if (res.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw res
      }
    },
    *getTransferReason ({
      payload,
    }, { put, call }) {
      const res = yield call(postDataService, {
        url: api.lawcase,
      }, {
        ...payload,
        serviceId: 'srvid_lawcase',
      })
      if (res.success) {
        put({ type: 'showFlowModal', res })
      } else if (res.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw res
      }
    },
    *getAidedPersonInfoPorps ({
      payload,
    }, { select, put, call }) {
      const tCaseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
      const params = {
        tCaseId,
      }
      const res = yield call(getDataService, {
        url: api.aidedPersonInfo,
      }, {
        ...params,
        serviceId: 'srvid_aidedPersonInfo',
      })
      if (res.success) {
        yield put({ type: 'setAidedPersonInfoPorps', res })
      } else if (res.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw res
      }
    },
    // 预审，进入受理
    *toNextStep ({
      payload,
    }, { select, put, call }) {
      const tCaseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
      const caseStatus = yield select(({ lawcaseDetail }) => lawcaseDetail.caseStatus)
      const storedTempStr = yield select(({ lawcaseDetail }) => lawcaseDetail.storedTempStr)
      const caseDetailData = yield select(({ lawcaseDetail }) => lawcaseDetail.caseBaseInfoData)

      let reqUrl = ''
      if (caseStatus === '1') { // 待预审
        reqUrl = api.suppMaterialSubmit
      } else if (caseStatus === '2' || caseStatus === '5' || caseStatus === '7') { // 受理提交
        reqUrl = api.toNextStepSubmitAcc
      } else if (caseStatus === '3') { // 初审
        reqUrl = api.submitTheTrial
      } else if (caseStatus === '8' || caseStatus === '9') { // 审查
        reqUrl = api.censorSubmit
      } else if (caseStatus === '10' || caseStatus === '11') { // 审批
        reqUrl = api.reauditSubmit
      }

      // 获取用户填入的案件号，重新生成短信
      if (payload.sms && payload.caseNum) { // caseNum如果为undefined， 则表明没有修改过案号， 否则取得修改过后的案号重新组装
        let rpName = caseDetailData.rpName
        let orgName = caseDetailData.orgName
        let orgTel = caseDetailData.orgTelephone
        let caseNum = payload.caseNum
        let tmpStr = storedTempStr.replace('{rpName}', rpName)
        tmpStr = tmpStr.replace(/{orgName}/g, orgName)
        tmpStr = tmpStr.replace('{orgTelephone}', orgTel)
        tmpStr = tmpStr.replace('{caseNum}', caseNum)
        payload.sms = tmpStr
      }
      const listType = localStorage.getItem('listType') || '1'
      const res = yield call(postDataService, {
        url: reqUrl,
      }, {
        ...payload,
        tCaseId,
        serviceId: 'srvid_toNextStepSubmit',
      })
      if (res.success && res.code === '1') {
        let gotoRouter = listType
        if (listType === '1') {
          gotoRouter = '0'
        } else if ((userObj.roles[0].id == 3 || userObj.roles[0].id == 35) && listType === '3') {
          gotoRouter = '0'
        } else if (listType === '4') {
          gotoRouter = '0'
        } else if (listType === '5') {
          gotoRouter = '0'
        }
        yield put(routerRedux.push(`/lawcases?type=${gotoRouter}`))
        // to do...跳转
      } else if (res.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw res
      }
    },
    // 预审，受理，处理，进入下一环节
    *toNext ({
      payload,
    }, { select, put, call }) {
      const listType = localStorage.getItem('listType') || '1'
      const tCaseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
      const caseStatus = yield select(({ lawcaseDetail }) => lawcaseDetail.caseStatus)

      let reqUrl = ''
      if (caseStatus === '1') { // 待预审
        reqUrl = api.toNextSubmit
      } else if (caseStatus === '2' || caseStatus === '3' || caseStatus === '5' || caseStatus === '7') { // 受理提交
        reqUrl = api.toNextStepSubmitAcc
      } else if (caseStatus === '6') { // 初审
        reqUrl = api.submitTheTrial
      }
      let params = {
        tCaseId,
      }
      const res = yield call(postDataService, {
        url: reqUrl,
      }, {
        ...params,
        serviceId: 'srvid_toNextSubmit',
      })
      if (res.success) {
        yield put(routerRedux.push(`/lawcases?type=${listType}`))
      } else if (res.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw res
      }
    },
    // 办结审核状态
    *endCase ({
      payload,
    }, { select, put, call }) {
      const lawcaseDetail = yield select(({ lawcaseDetail }) => lawcaseDetail)
      const tCaseId = lawcaseDetail.caseId
      let params = {
        caseId: tCaseId,
      }
      const res = yield call(postDataService, { url: api.closeCheck }, {
        ...payload,
        caseId: tCaseId,
        serviceId: 'srvid_endCase',
      })
      if (res.success) {
        yield put(routerRedux.push('/monitor?type=15'))
      } else if (res.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw res
      }
    },
    // 发起归档-提交至受援人补充材料
    *toSubmitStep ({
      payload,
    }, { put, call }) {
      const listType = localStorage.getItem('listType') || '1'
      const res = yield call(postDataService, {
        url: api.caseCheckSubmit,
      }, {
        ...payload,
        serviceId: 'srvid_caseCheckSubmit',
      })
      if (res.success) {
        yield put({ type: 'hideDataModal' })
        yield put(routerRedux.push(`/lawcases?type=${listType}`))
      } else if (res.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw res
      }
    },
    // 预审-补充材料
    *toSubmitother ({
      payload,
    }, { select, put, call }) {
      const listType = localStorage.getItem('listType') || '1'
      const caseStatus = yield select(({ lawcaseDetail }) => lawcaseDetail.caseStatus)
      const tCaseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)

      let reqUrl = ''
      if (caseStatus === '1') { // 预审需补充
        reqUrl = api.suppMaterialSubmit
      } else if (caseStatus === '2' || caseStatus === '3' || caseStatus === '5' || caseStatus === '7') { // 受理补充材料
        reqUrl = api.needSuupAcc
      } else if (caseStatus === '6') { // 初审需补充材料
        reqUrl = api.needSuupTheTrial
      }
      const res = yield call(postDataService, {
        url: reqUrl,
      }, {
        ...payload,
        tCaseId,
        serviceId: 'srvid_suppMaterialSubmit',
      })
      if (res.success && res.code === '1') {
        yield put({ type: 'hideDataModal' })
        yield put(routerRedux.push(`/lawcases?type=${listType}`))
      } else if (res.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw res
      }
    },
    // 获取备注信息列表
    *getRemarkList ({
      payload,
    }, { select, call, put }) {
      const tCaseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
      let params = {
        ...payload,
        tCaseId,
      }
      const data = yield call(getDataService, {
        url: api.getRemarkList,
      }, {
        ...params,
        serviceId: 'srvid_getRemarkList',
      })
      if (data) {
        let resData = data && data.data && data.data.list || []
        let pageNum = pageNum || 1
        let pageSize = 10
        let startSeq = (pageNum == 1
          ? 1
          : (2 * Number(pageSize) + 1))

        resData = resData.map((item, index) => {
          let newItem = item
          newItem.seq = startSeq++
          return newItem
        })
        yield put({
          type: 'queryRemarkListSuccess',
          payload: {
            list: resData,
            pagination: {
              current: Number(payload.pageNum) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.data.total,
            },
          },
        })
      }
    },
    // 更新上传的文件列表
    *updateFileList ({ payload }, { select, call, put }) {
      let fileModal = yield select(({ lawcaseDetail }) => lawcaseDetail.fileModal)
      let fileData = fileModal.fileData
      /* fileData = {
        OSSAccessKeyId: action.fileData.accessid,
        policy: action.fileData.policy,
        Signature: action.fileData.signature,
        key: 'opm/' + dt + '/' + lg + '_'+ '${filename}'
      }*/

      let file = payload.file
      let fileList = payload.fileList

      let newFileUrl = `${fileData
        .key
        .split('_')[0]}_${file.name}`

      const params = {
        key: newFileUrl,
      }

      if (file.status === 'done') {
        const data = yield call(getDataService, {
          url: api.getUrl,
        }, {
          ...params,
          serviceId: 'srvid_getUrl',
        })
        if (data.success) {
          yield put({
            type: 'getUrlSuc',
            payload: {
              file: {
                ...payload.file,
                objectKey: newFileUrl,
                url: data.data.url,
              },
              fileList: payload.fileList,
              finishedUpload: true,
            },
          })
        }
      } else if (file.status == 'error' || typeof(file.status) === 'undefined') {
        yield put({
          type: 'getUrlSuc',
          payload: {
            file,
            fileList,
            finishedUpload: true,
          },
        })
      } else {
        yield put({
          type: 'getUrlSuc',
          payload: {
            file,
            fileList,
            finishedUpload: false,
          },
        })
      }
    },
   *updateFileList({ payload }, {select, call, put}) {
      let fileModal = yield select(({lawcaseDetail}) => lawcaseDetail.fileModal)
      let fileData = fileModal.fileData
      let file = payload.file
      let fileList = payload.fileList
      /*fileData = {
        OSSAccessKeyId: action.fileData.accessid,
        policy: action.fileData.policy,
        Signature: action.fileData.signature,
        key: 'opm/' + dt + '/' + lg + '_'+ '${filename}'
      }*/
      if(file.status === 'done'){
        // let newFileUrl = fileData.key.split("_")[0] + '_' + file.name
        const params = { key: fileModal.keys[file.uid] }
        const data = yield call(getDataService, {
          url: api.getUrl
        }, {
          ...params,
          serviceId: 'srvid_getUrl'
        })
        if (data.success) {
          yield put({
            type: 'getUrlSuc',
            payload: {
              file: {
                ...payload.file,
                objectKey: fileModal.keys[file.uid],
                url: data.data.url
              },
              fileList: payload.fileList,
              finishedUpload: true,
            }
          })
        }
      }else if (file.status == 'error' || typeof(file.status) == 'undefined'){
        yield put({
          type: 'getUrlSuc',
          payload: {
            file,
            fileList,
            finishedUpload: true,
          }
        })
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
    *updateFileListEnd({ payload }, {select, call, put}) {
      let fileModal = yield select(({lawcaseDetail}) => lawcaseDetail.fileModal)
      let fileData = fileModal.fileData
      let file = payload.file
      let fileList = payload.fileList
      /*fileData = {
        OSSAccessKeyId: action.fileData.accessid,
        policy: action.fileData.policy,
        Signature: action.fileData.signature,
        key: 'opm/' + dt + '/' + lg + '_'+ '${filename}'
      }*/
      if(file.status === 'done'){
        // let newFileUrl = fileData.key.split("_")[0] + '_' + file.name
        const params = { key: fileModal.keys[file.uid] }
        const data = yield call(getDataService, {
          url: api.getUrl
        }, {
          ...params,
          serviceId: 'srvid_getUrl'
        })
        if (data.success) {
          yield put({
            type: 'getUrlSucEnd',
            payload: {
              file: {
                ...payload.file,
                objectKey: fileModal.keys[file.uid],
                url: data.data.url
              },
              fileList: payload.fileList,
              finishedUpload: true,
            }
          })
        }
      }else if (file.status == 'error' || typeof(file.status) == 'undefined'){
        yield put({
          type: 'getUrlSucEnd',
          payload: {
            file,
            fileList,
            finishedUpload: true,
          }
        })
      }else {
        yield put({
          type: 'getUrlSucEnd',
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

    // 更新已有的文件列表，单个新增
    *updateMeterialList ({ payload }, { select, call, put }) {
      let fileModal = yield select(({ lawcaseDetail }) => lawcaseDetail.fileModal)
      let uploadType = yield select(({ lawcaseDetail }) => lawcaseDetail.uploadType)
      let tCaseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
      let fileList = fileModal.fileList
      let fileData = fileModal.fileData
      let file = payload.file || {}
      let newFileUrl = `${fileData.key.split('_')[0]}_${file.name}`

      const params = {
        addrUrl: `${fileData.endPoint}/${fileData.key.split('_')[0]}_${file.name}`,
        dicFileType: file.name.split('.')[1],
        dicType: uploadType,
        name: file.name,
        objectKey: fileModal.keys[file.uid],
        tCaseId,
      }

      if (file.status === 'done') {
        const data = yield call(postDataService, {
          url: api.suupAcc,
        }, {
          ...params,
        })
        if (data.success) {
          yield put({
            type: 'getUrlSuc',
            payload: {
              file: {
                ...payload.file,
                objectKey: fileModal.keys[file.uid],
                url: data.data.addrUrl,
                tCaseMaterialStorageId: data.data.tCaseMaterialStorageId,
                dicType: data.data.dicType,
                dicFileType: data.data.dicFileType,
              },
              fileList: payload.fileList,
              finishedUpload: true,
            },
          })
        }
      } else if (file.status == 'error' || typeof(file.status) === 'undefined') {
        yield put({
          type: 'getUrlSuc',
          payload: {
            file,
            fileList,
            finishedUpload: true,
          },
        })
      } else {
        yield put({
          type: 'getUrlSuc',
          payload: {
            file: payload.file,
            fileList: payload.fileList,
            finishedUpload: false,
          },
        })
      }
       // 更新当前上传列表中哪些已经上传完成
       yield put({
        type: 'updateCurDoneFileList',
        payload: file,
      })
    },
    *updateBiangengMeterialList ({ payload }, { select, call, put }) {
      let fileModal = yield select(({ lawcaseDetail }) => lawcaseDetail.fileModal)
      let uploadType = yield select(({ lawcaseDetail }) => lawcaseDetail.uploadType)
      let tCaseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
      let fileList = fileModal.fileList
      let fileData = fileModal.fileData
      let file = payload.file || {}
      let newFileUrl = `${fileData.key.split('_')[0]}_${file.name}`
      
      const params = {
        // addrUrl: `${fileData.endPoint}/${fileData.key.split('_')[0]}_${file.name}`,
        // dicFileType: file.name.split('.')[1],
        // dicType: uploadType,
        // name: file.name,
        // objectKey: fileModal.keys[file.uid],
        // tCaseId,
        key: newFileUrl
      }
      if (file.status === 'done') {
        const data = yield call(getDataService, {
          url: api.getUrl,
        }, {
          ...params,
        })
        if (data.success) {
          yield put({
            type: 'getBiangengUrlSuc',
            payload: {
              file: {
                ...payload.file,
                // objectKey: fileModal.keys[file.uid],
                url: data.data.url,
                objectKey: newFileUrl,
                // tCaseMaterialStorageId: data.data.tCaseMaterialStorageId,
                // dicType: data.data.dicType,
                // dicFileType: data.data.dicFileType,
              },
              fileList: payload.fileList,
              finishedUpload: true,
            },
          })
        }
      } else if (file.status == 'error' || typeof(file.status) === 'undefined') {
        yield put({
          type: 'getBiangengUrlSuc',
          payload: {
            file,
            fileList,
            finishedUpload: true,
          },
        })
      } else {
        yield put({
          type: 'getBiangengUrlSuc',
          payload: {
            file: payload.file,
            fileList: payload.fileList,
            finishedUpload: false,
          },
        })
      }
    },
    *updateBgMeterialList ({ payload }, { select, call, put }) {
      let lawcaseDetail = yield select(({ lawcaseDetail }) => lawcaseDetail)
      const aidMsg = lawcaseDetail.aidMsg
      const x = aidMsg.filter((item,index) => {
       return item.tHpUserId === lawcaseDetail.tHpUserId
      })
      let fileModal = yield select(({ lawcaseDetail }) => lawcaseDetail.fileModal)
      let uploadType = yield select(({ lawcaseDetail }) => lawcaseDetail.uploadType)
      let type 
      let dictory
      if(uploadType == 'noticeUpload'){
        type = 'noticeUploadList',
        dictory = '更换法律援助人员通知书'
      }else if(uploadType == 'approveUpload'){
          type = 'approveUploadList',
          dictory = '更换法律援助人员审批表'
      }
      let tCaseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
      let fileList = fileModal.fileList
      let fileData = fileModal.fileData
      let file = payload.file || {}
      let newFileUrl = `${fileData.key.split('_')[0]}_${file.name}`

      const params = {
        resources: [{
        addUrl: `${fileData.endPoint}/${fileData.key.split('_')[0]}_${file.name}`,
        dicFileType: file.name.split('.')[1],
        dicType: uploadType,
        fileName: file.name,
        objectKey: fileModal.keys[file.uid],
        subCategory: dictory
        // tCaseMaterialStorageId: fileModal[type][0].tCaseMaterialStorageId,
        // tUserFileId:fileModal[type][0].tUserFileId
      }],
      tCaseId,
      tHpUserId: Number(x[0].tHpUserId)
      }
      if (file.status === 'done') {
        const data = yield call(postDataService, {
          url: api.submitChangeFile,
        }, {
          ...params,
        })
        if (data.success) {
          yield put({
            type: 'getUrlSuc',
            payload: {
              file: {
                ...payload.file,
                objectKey: fileModal.keys[file.uid],
                url: data.data.resources[0].addUrl,
                tCaseMaterialStorageId: data.data.tCaseMaterialStorageId,
                dicType: data.data.dicType,
                dicFileType: data.data.dicFileType,
              },
              submitData: data.data,
              fileList: payload.fileList,
              finishedUpload: true,
            },
          })
        }
      } else if (file.status == 'error' || typeof(file.status) === 'undefined') {
        yield put({
          type: 'getUrlSuc',
          payload: {
            file,
            fileList,
            finishedUpload: true,
          },
        })
      } else {
        yield put({
          type: 'getUrlSuc',
          payload: {
            file: payload.file,
            fileList: payload.fileList,
            finishedUpload: false,
          },
        })
      }
    },
   * removeBgFile ({ payload }, { select, call, put }) {
   let lawcaseDetail = yield select(({ lawcaseDetail }) => lawcaseDetail)
   let fileModal = yield select(({ lawcaseDetail }) => lawcaseDetail.fileModal)
  //  let uploadType = yield select(({ lawcaseDetail }) => lawcaseDetail.uploadType)
  //  let uid = payload.uid
   const aidMsg = lawcaseDetail.aidMsg
   const x = aidMsg.filter((item,index) => {
    return item.tHpUserId === lawcaseDetail.tHpUserId
   })
   const submitDataId = lawcaseDetail.submitData && lawcaseDetail.submitData.resources && lawcaseDetail.submitData.resources[0].tCaseMaterialStorageId
   const tUserFileId =  lawcaseDetail.submitData && lawcaseDetail.submitData.resources && lawcaseDetail.submitData.resources[0].tUserFileId
  //  let type 
  //  let dictory
  //  if(uploadType == 'noticeUpload'){
  //    type = 'noticeUploadList',
  //    dictory = '更换法律援助人员通知书'
  //  }else if(uploadType == 'approveUpload'){
  //      type = 'approveUploadList',
  //      dictory = '更换法律援助人员审批表'
  //  }
   let tCaseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
   let fileList = fileModal.fileList
   let fileData = fileModal.fileData
   let file = payload.file || {}
   let newFileUrl = `${fileData.key.split('_')[0]}_${file.name}`
  //  let toBeRemoved = _.find(fileModal.fileList, { uid })
   const params = {
    resources: [{
    // addUrl: `${fileData.endPoint}/${fileData.key.split('_')[0]}_${file.name}`,
    // dicFileType: file.name.split('.')[1],
    // dicType: uploadType,
    fileName: payload.name,
    // objectKey: fileModal.keys[file.uid],
    subCategory: payload.subCategory,
    tCaseMaterialStorageId: payload.tCaseMaterialStorageId || submitDataId,
    tUserFileId: payload.tUserFileId || tUserFileId
  }],
  tCaseId,
  tHpUserId: Number(x[0].tHpUserId)
  }
   const data = yield call(postDataService, {
     url: api.submitChangeFile,
   }, {
     ...params,
    //  serviceId: 'srvid_getUrl',
   })
   if (data.success && data.code === '1') {
     yield put({
       type: 'removeBiangengFile',
       payload,
     })
   } else {
     // message.error(data)
   }
 },
    *removeSingleFile ({ payload }, { select, call, put }) {
      let fileModal = yield select(({ lawcaseDetail }) => lawcaseDetail.fileModal)
      let uid = payload.uid
      let toBeRemoved = _.find(fileModal.fileList, { uid })
      let params = toBeRemoved

      const data = yield call(postDataService, {
        url: api.suupAcc,
      }, {
        ...payload,
        serviceId: 'srvid_getUrl',
      })
      if (data.success && data.code === '1') {
        yield put({
          type: 'removeFile',
          payload,
        })
      } else {
        // message.error(data)
      }
    },
    // 更新已有的文书列表，单个新增
    *updateDocList ({ payload }, { select, call, put }) {
      let fileModal = yield select(({ lawcaseDetail }) => lawcaseDetail.fileModal)
      let uploadType = yield select(({ lawcaseDetail }) => lawcaseDetail.uploadType)
      let tCaseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)

      let fileList = fileModal.fileList
      let fileData = fileModal.fileData
      let file = payload.file || {}
      let newFileUrl = `${fileData.key.split('_')[0]}_${file.name}`
      const params = {
        // addrUrl: fileData.endPoint + '/' + fileData.key.split("_")[0] + '_' + file.name,
        // dicFileType: file.name.split('.')[1],
        // "dicType": uploadType,
        name: file.name,
        tCaseMaterialStorageId: uploadType, // file.tCaseMaterialStorageId,
        objectKey: newFileUrl,
        // "tCaseId": tCaseId,
      }

      if (file.status === 'done') {
        const data = yield call(postDataService, { url: api.updatefileStorageMes }, {
          ...params,
          serviceId: 'srvid_getUrl',
        })
        if (data.success) {
          yield put({
            type: 'getDocUrlSuc',
            payload: {
              file: {
                ...payload.file,
                objectKey: newFileUrl,
                url: data.data && data.data.addrUrl,
                tCaseMaterialStorageId: data.data && data.data.tCaseMaterialStorageId,
              },
              fileList: payload.fileList,
              finishedUpload: true,
            },
          })
          yield put({
            type: 'getDocs',
            payload: tCaseId,
          })
        }
      } else if (file.status === 'error' || typeof(file.status) === 'undefined') {
        yield put({
          type: 'getDocUrlSuc',
          payload: {
            file: payload.file,
            fileList: payload.fileList,
            finishedUpload: true,
          },
        })
      } else {
        yield put({
          type: 'getDocUrlSuc',
          payload: {
            file: payload.file,
            fileList: payload.fileList,
            finishedUpload: false,
          },
        })
      }
      // 更新当前上传列表中哪些已经上传完成
      yield put({
        type: 'updateCurDoneFileList',
        payload: file,
      }) 
    },
    *removeSingleDoc ({ payload }, { select, call, put }) {
      let fileModal = yield select(({ lawcaseDetail }) => lawcaseDetail.fileModal)
      let uid = payload.uid
      let toBeRemoved = _.find(fileModal.fileList, { uid })
      let params = toBeRemoved

      const data = yield call(postDataService, { url: api.suupAcc }, {
        ...payload,
        serviceId: 'srvid_getUrl',
      })
      if (data.success && data.code === '1') {
        yield put({
          type: 'removeFile',
          payload,
        })
      } else {
        // message.error(data)
      }
    },
    // 窗口受理登记新增从案人员
    *addSubPerson ({ payload }, { select, call, put }) {
      payload.dicConsultantCategoryList = payload.dicConsultantCategoryList.map(itemValue => {
        return { value: itemValue }
      })
      const data = yield call(postDataService, {
        url: api.addRpUser,
      }, {
        ...payload,
        serviceId: 'addRpUser',
      })
      if (data.success) {
        const tRpUserId = data.data.tRpUserId
        const params = {
          tRpUserId,
          ...payload,
        }
        yield put({ type: 'setSubPerson', data: params, actionType: 'add' })
      }
    },
    // 窗口受理登记编辑从案人员
    *editSubPerson ({ payload }, { select, call, put }) {
      const match = pathToRegexp('/lawcase/:id').exec(location.pathname)
      const tCaseId = payload.id
      delete payload.id
      payload.dicConsultantCategoryList = payload.dicConsultantCategoryList.map(itemValue => {
        return { value: itemValue }
      })
      const data = yield call(postDataService, { url: api.editRpUserCase }, { tCaseId, ...payload, serviceId: 'editRpUserCase' })
      if (data.success) {
        if (window.location.pathname === '/createLawcase') {
          const params = {
            tRpUserId: data.data.tRpUserId,
            ...payload,
          }
          yield put({ type: 'setEditSubPerson', data: params, actionType: 'add' })
        } else {
          yield put({ type: 'getSubPersonCaseList', payload: { tCaseId: match[1] } })
          yield put({ type: 'hideSubPersonModal' })
        }
      }
    },
    // 案件详情新增从案人员
    *addSubPersonCase ({
      payload,
    }, { call, put, select }) {
      const tCaseId = yield select(({ lawcaseDetail }) => lawcaseDetail.caseId)
      payload.dicConsultantCategoryList = payload.dicConsultantCategoryList.map(itemValue => {
        return { value: itemValue }
      })
      const data = yield call(postDataService, {
        url: api.addRpUserCase,
      }, {
        ...payload,
        tCaseId,
        serviceId: 'srvid_addRpUserCase',
      })
      if (data.success) {
        const id = data.data.tRpUserId
        const params = {
          id,
          ...payload,
        }
        yield put({ type: 'setSubPerson', data: params, actionType: 'case' })
      }
    },

    *getLawfirmList ({
      payload,
    }, { call, put, select }) {
      const data = yield call(getDataService, {
        url: api.fuzzyQueryLawfirmByName,
      }, { name: payload })
      if (data.success && data.code === '1') {
        yield put({ type: 'updateLawfirmList', lawfirmList: data.data })
      } else if (data.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      }
    },
    *getSubPersonCaseList ({
      payload,
    }, { call, put, select }) {
      const tCaseId = payload.tCaseId
      const data = yield call(getDataService, {
        url: api.getSubPersonList,
      }, { tCaseId, serviceId: 'srvid_getSubPersonList' })
      if (data.success) {
        yield put({ type: 'setSubPersonCaseList', subPersonListCase: data.data })
      } else if (data.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw data
      }
    },
    *getDocs ({
      payload,
    }, { call, put, select }) {
      const res = yield call(getDataService, { url: api.getDocsUrl }, { tCaseId: payload, serviceId: 'srvid_getDocsUrl' })
      if (res.success) {
        yield put({ type: 'getDocSuccess', payload: res.data })
      } else if (res.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw res
      }
    },
     *getEmptyDocsUrl({ payload }, {call, put, select}) {
      const res = yield call(getDataService, {
        url: api.getEmptyDocsUrl
      }, {serviceId: 'srvid_getDocsUrl'})
      if (res.success) {
        yield put({type: 'getEmptyDocSuccess', payload: res.data})
      } else if (res.code === '9999') {
        //do nothing, it will not update the state and will not re-render the page.
      } else {
        throw res
      }
    },
    *deleteSubPersonCase ({
      payload,
    }, { call, put, select }) {
      const res = yield call(postDataService, {
        url: api.deleteRpUserCase,
      }, {
        ...payload,
        serviceId: 'srvid_deleteRpUserCase',
      })
      if (res.success) {
        yield put({ type: 'deleteSubPersonCaseSet', payload })
      } else if (res.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
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
  	updateFileKey(state, action) {
      let keys = state.fileModal.keys
      Object.assign(keys, action.payload)
      return{
        ...state,
        fileModal: {...state.fileModal, keys,},
      }
    },
    caseDetailChange (state, action) {
      return {
        ...state,
        caseDetail: action.payload,
      }
    },
    updateDatePickerCount(state, action) {
      let extDatePickers = state.extDatePickers
      let currentTime = new Date().getTime()
      extDatePickers.push({
        key: `evi_${currentTime}`,
        value: undefined,
      })
      return{
        ...state,
        extDatePickers,
      }
    },
    remDatePickerCount(state, action) {
      const item = action.item
      let extDatePickers = state.extDatePickers
      extDatePickers = extDatePickers.filter((node, index)=> item.key !== node.key)
      return{
        ...state,
        extDatePickers,
      }
    },
    getCityDataSuc (state, action) {
      return {
        ...state,
        cityData: action.payload,
      }
    },
    handleCaseTypeChange (state, action) {
      const caseReason = getCurrentDics(action.value, caseReasonList)
      const new_dic_standing = getCurrentDics(action.value, total_dic_standing)
      const new_org_aid_type = getCurrentDics(action.value, total_org_aid_type)
      return {
        ...state,
        caseReason,
        new_dic_standing,
        new_org_aid_type,
      }
    },
    handleNoticeReasonChange (state, action) {
      const specified_reason = getCurrentNoticeReason(action.value[0], total_specified_reason)
      return {
        ...state,
        specified_reason,
      }
    },
    setSubPersonCaseList (state, action) {
      const dic_credentials_type = state.allConfig.dictData.dic_credentials_type
      const dic_gender = state.allConfig.dictData.dic_gender
      const tagList = state.tagList
      if (action.subPersonListCase) {
        const subPersonListCase = action
          .subPersonListCase
          .map((item, index) => {
            return {
              ...item,
              dicGenderName: getLabelByValue(dic_gender, item.dicGender),
              dicCardTypeName: getLabelByValue(dic_credentials_type, item.dicCardType),
              // rpUserTagsName: [...item.rpUserTags.map(_ => _.tagName)],
              flag: index,
            }
          })
        return {
          ...state,
          subPersonListCase,
        }
      }
      return {
        ...state,
      }
    },
    setCheck (state, action) {
      // const dic_credentials_type = state.allConfig.dictData.dic_credentials_type
      // const dic_gender = state.allConfig.dictData.dic_gender
      // console.log(state)
      // console.log(action)
      // let str=action.subPersonListCase.message;
      // let caseInfo = state.rpName;
      // let rename= caseInfo
      // str=str.replace('{rpName}',rename )
      // console.log(str)
      // let rpStr = `【浙江法律援助】尊敬的${caseInfo.rpName}，您在${caseInfo.orgName||''}申请的法律援助案件（案件号：${caseInfo.caseNum||''} ），现已指派${hpNames}为您服务，请三个工作日内联系援助人到${caseInfo.orgName||''}签署委托协议，如需协助，请拨打12348咨询。`
      // let hpStr = `【浙江法律援助】尊敬的${hpNamesStr}，${caseInfo.orgName||''}受理的法律援助案件（案件号：${caseInfo.caseNum||''} ）将由您办理，请您在三个工作日内联系受援人到${caseInfo.orgName||''}签署委托协议，并办理文件交接手续，如需协助，请拨打12348咨询。`


      // "data": {
      //   "message": "{rpName}：您申请的法律援助申请已通过网上预审，请您在7日内携带以下材料到{orgName}办理：1、身份证或者其他有效的身份证明，代理申请人还应当提交有代理权的证明；2、经济状况证明；3、与所申请法律援助事项有关的证据、证明材料。{orgName}联系电话：{orgTelephone}",
      //   "wechatMessage": "请您在7日内携带以下材料到{orgName}办理：1、身份证或者其他有效的身份证明，代理申请人还应当提交有代理权的证明；2、经济状况证明；3、与所申请法律援助事项有关的证据、证明材料。\n{orgName}联系电话：{orgTelephone}"
      // }
    },
    setEditSubPerson (state, action) {
      let dic_credentials_type = state.allConfig.dictData.dic_credentials_type
      let dic_gender = state.allConfig.dictData.dic_gender
      let dic_dic_occupatio = state.allConfig.dictData.dic_dic_occupatio
      let tagList = state.tagList
      let subPerson = []
//    action.data.popCates = action.data.dicConsultantCategoryList.map(item => item.value)
      if (action.actionType === 'add') {
        subPerson = state.subPersonList.map(item => {
          if (item.tRpUserId === action.data.tRpUserId) {
            action.data = {
              ...action.data,
              dicGenderName: getLabelByValue(dic_gender, action.data.dicGender),
              credentialsTypeName: getLabelByValue(dic_credentials_type, action.data.dicCardType),
              popCatesName: getLabelByValue(dic_dic_occupatio, action.data.dicConsultantCategoryList),
            }
            return { ...item, ...action.data }
          }
          return item
        })
        return {
          ...state,
          subPersonList: subPerson,
          subPersonModal: {
            ...state.subPersonModal,
            modalVisible: false,
          },
        }
      }
      return { ...state }
    },
    setSubPerson (state, action) {
      let dic_credentials_type = state.allConfig.dictData.dic_credentials_type
      let dic_gender = state.allConfig.dictData.dic_gender
      let dic_dic_occupatio = state.allConfig.dictData.dic_dic_occupatio
      let tagList = state.tagList
      let list = []
      let subPerson = []
//    action.data.popCates = action.data.dicConsultantCategoryList.map(item => item.value)
      if (action.actionType === 'add') {
        list = state.subPersonList.concat(action.data)
        subPerson = list.map((item, index) => {
          return {
            dicGenderName: getLabelByValue(dic_gender, item.dicGender),
            credentialsTypeName: getLabelByValue(dic_credentials_type, item.dicCardType),
            popCatesName: getLabelByValue(dic_dic_occupatio, item.dicConsultantCategoryList),
            flag: index,
            ...item,
          }
        })
        return {
          ...state,
          subPersonList: subPerson,
          subPersonModal: {
            ...state.subPersonModal,
            modalVisible: false,
          },
        }
      }
      list = state.subPersonListCase.concat(action.data)
      subPerson = list.map((item, index) => {
        return {
          rpName: item.name,
          dicGenderName: getLabelByValue(dic_gender, item.dicGender),
          dicCardTypeName: getLabelByValue(dic_credentials_type, item.dicCardType),
            // rpUserTagsName: item.rpUserTagsName || getLabelByValue(dic_dic_occupatio, item.dicConsultantCategoryList.map(_ => _.value)),
          rpUserTagsName: item.rpUserTagsName || getLabelByValue(dic_dic_occupatio, item.dicConsultantCategoryList),
          flag: index,
          ...item,
        }
      })
      return {
        ...state,
        subPersonListCase: subPerson,
        subPersonModal: {
          ...state.subPersonModal,
          modalVisible: false,
        },
      }
    },
    save_fields (state, action) {
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
      }
    },
    updateLawfirmList (state, action) {
      return {
        ...state,
        lawfirmList: action.lawfirmList,
      }
    },
    updateLawyerList (state, action) {
      return {
        ...state,
        flowDetail: {
          ...state.flowDetail,
          lawyerList: action.payload.list,
          layerPagination: {
            current: Number(action.payload.pageNum) || 1,
            pageSize: Number(action.payload.pageSize) || 1,
            total: action.payload.total,
            pageSizeOptions: [
              '5', '10',
            ],
            showSizeChanger: true,
            showQuickJumber: true,
            showTotal: total => `共${action.payload.total} 条`,
          },
        },
      }
    },
    deleteSubPersonCaseSet (state, action) {
      const subPersonListCase = state.subPersonListCase
      let subPerson = subPersonListCase.filter(item => {
        return !(item.dicCardType === action.payload.dicCardType && item.cardCode === action.payload.cardCode)
      })
      return {
        ...state,
        subPersonListCase: subPerson,
      }
    },
    deleteSubPerson (state, action) {
      const subPersonList = state.subPersonList
      let subPerson = subPersonList.filter(item => {
        return !(item.dicCardType === action.item.dicCardType && item.cardCode === action.item.cardCode)
      })
      return {
        ...state,
        subPersonList: subPerson,
      }
    },
    setTagList (state, action) {
      return {
        ...state,
        tagList: action.payload,
      }
    },
    updateUploadType (state, action) {
      return {
        ...state,
        uploadType: action.payload,
      }
    },
    removeFile (state, action) {
      let uid = action.payload.uid
      let materialType = action.payload.materialType
      let targetFileList = {}
      let buildList = _.filter(state.fileModal[materialType], (itm) => itm.uid !== uid)
      targetFileList[materialType] = buildList
      if (materialType == 1) {
        let buildList = _.filter(state.fileModal.identifyFileList, (itm) => itm.uid !== uid)
        targetFileList.identifyFileList = buildList
      } else if (materialType == 5) {
        let buildList = _.filter(state.fileModal.homeFinFileList, (itm) => itm.uid !== uid)
        targetFileList.homeFinFileList = buildList
      } else if (materialType == 6) {
        let buildList = _.filter(state.fileModal.caseRelatedFileList, (itm) => itm.uid !== uid)
        targetFileList.caseRelatedFileList = buildList
      }

      return {
        ...state,
        fileModal: {
          ...state.fileModal,
          ...targetFileList,
        },
      }
    },
    removeBiangengFile (state, action) {
      let uid = action.payload.uid
      let type = action.payload.materialType
      let materialType
      if(type == 'noticeUpload'){
        materialType =  'noticeUploadList'
      }else if(type == 'approveUpload'){
        materialType = 'approveUploadList'
      }

      let targetFileList = {}
      let buildList = _.filter(state.fileModal[materialType], (itm) => itm.uid !== uid)
      targetFileList[materialType] = buildList
      if (materialType == 'noticeUploadList') {
        let buildList = _.filter(state.fileModal.noticeUploadList, (itm) => itm.uid !== uid)
        targetFileList.noticeUploadList = buildList
      } else if (materialType == 'approveUploadList') {
        let buildList = _.filter(state.fileModal.approveUploadList, (itm) => itm.uid !== uid)
        targetFileList.approveUploadList = buildList
      } 

      return {
        ...state,
        fileModal: {
          ...state.fileModal,
          ...targetFileList,
        },
      }
    },
    removeFileEnd(state, action) {
      let uid = action.payload.uid
      let materialType = action.payload.materialType
      let targetFileList = {}
      let buildList = _.filter(state.fileModal[materialType], (itm) => itm.uid !== uid && jsUtil.isNull(itm.storageId))
      buildList = _.map(state.fileModal[materialType], (itm) => {
        if(itm.uid == uid){
          itm.isDelete = 1
        }
        return itm
      })
      // let buildList = _.filter(state.fileModal[materialType], (itm) => itm.uid !== uid)
      targetFileList[materialType] = buildList
      return {
        ...state,
        fileModal: {
          ...state.fileModal,
          ...targetFileList,
        }
      }
    },
    getUrlSuc (state, action) {
      let uploadType = state.uploadType
      let uploadTypeKey
      if (uploadType == 1) {
        uploadTypeKey = 'identifyFileList'
      } else if (uploadType == 5) {
        uploadTypeKey = 'homeFinFileList'
      } else if (uploadType == 6) {
        uploadTypeKey = 'caseRelatedFileList'
      }else if (uploadType == 'noticeUpload'){
        uploadTypeKey = 'noticeUploadList'
      }else if(uploadType == 'approveUpload'){
        uploadTypeKey = 'approveUploadList'
      }
      let existFileList = state.fileModal[uploadTypeKey] || []
      let fileObj = action.payload.file
      let fileList = action.payload.fileList
      let submitData = action.payload.submitData
      // 找到对应的file，加上传参时需要的字段
      fileList = fileList.map((item, index) => {
        if (item.uid === fileObj.uid) {
          item.url = fileObj.url || ''
          item.objectKey = fileObj.objectKey || ''
          item.materialType = uploadType || ''
          item.tCaseMaterialStorageId = fileObj.tCaseMaterialStorageId
          item.dicType = fileObj.dicType
          item.dicFileType = fileObj.dicFileType
        }
        return item
      })
      if (fileObj.status === 'uploading' || fileObj.status === 'done' && !_.some(existFileList, { uid: fileObj.uid })) {
        fileObj.materialType = uploadType
        let findedIndx = _.findIndex(existFileList, { uid: fileObj.uid })
        if (findedIndx > -1) {
          existFileList[findedIndx] = fileObj
        } else {
          existFileList.push(fileObj)
        }
      }

      let targetFileList = {}
      targetFileList[uploadTypeKey] = existFileList
      /*
      if (uploadType == 1) {
        targetFileList.identifyFileList = existFileList
      } else if (uploadType == 5) {
        targetFileList.homeFinFileList = existFileList
      } else if (uploadType == 6) {
        targetFileList.caseRelatedFileList = existFileList
      }*/

      return {
        ...state,
        fileModal: {
          ...state.fileModal,
          ...targetFileList,
          finishedUpload: action.payload.finishedUpload,
        },
        submitData,
      }
    },
    getBiangengUrlSuc (state, action) {
      let uploadType = state.uploadType
      let uploadTypeKey
      if (uploadType == 'noticeUpload') {
        uploadTypeKey = 'noticeUploadList'
      } else if (uploadType == 'approveUpload') {
        uploadTypeKey = 'approveUploadList'
      } 
      let existFileList = state.fileModal[uploadTypeKey] || []
      let fileObj = action.payload.file
      let fileList = action.payload.fileList
      // 找到对应的file，加上传参时需要的字段
      fileList = fileList.map((item, index) => {
        if (item.uid === fileObj.uid) {
          item.url = fileObj.url || ''
          item.objectKey = fileObj.objectKey || ''
          item.materialType = uploadType || ''
          item.tCaseMaterialStorageId = fileObj.tCaseMaterialStorageId
          item.dicType = fileObj.dicType
          item.dicFileType = fileObj.dicFileType
        }
        return item
      })

      if (fileObj.status === 'uploading' || fileObj.status === 'done' && !_.some(existFileList, { uid: fileObj.uid })) {
        fileObj.materialType = uploadType
        let findedIndx = _.findIndex(existFileList, { uid: fileObj.uid })
        if (findedIndx > -1) {
          existFileList[findedIndx] = fileObj
        } else {
          existFileList.push(fileObj)
        }
      }

      let targetFileList = {}
      targetFileList[uploadTypeKey] = existFileList
      let targetFileListcopy = {}
      targetFileListcopy[uploadTypeKey] = existFileList
      /*
      if (uploadType == 1) {
        targetFileList.identifyFileList = existFileList
      } else if (uploadType == 5) {
        targetFileList.homeFinFileList = existFileList
      } else if (uploadType == 6) {
        targetFileList.caseRelatedFileList = existFileList
      }*/
      return {
        ...state,
        fileModal: {
          ...state.fileModal,
          ...targetFileList,
          existFileList,
          finishedUpload: action.payload.finishedUpload,
        },
      }
    },
    getUrlSucEnd(state, action) {
      const uploadType = state.uploadType
      let existFileList = state.fileModal[uploadType] || []
      let fileObj = action.payload.file
      let fileList = action.payload.fileList
      // 找到对应的file，加上传参时需要的字段
      fileList = fileList.map((item, index) => {
        if(item.uid === fileObj.uid) {
          item.url = fileObj.url || ''
          item.objectKey = fileObj.objectKey || ''
          item.materialType = uploadType || ''
          item.storageId = fileObj.storageId
          // item.dicType = fileObj.dicType
          item.dicFileType = fileObj.dicFileType
        }
        return item
      })

      if(fileObj.status === 'uploading' || fileObj.status === 'done' && !_.some(existFileList, {uid: fileObj.uid})){
        fileObj.materialType = uploadType
        let findedIndx = _.findIndex(existFileList, {'uid': fileObj.uid})
        if(findedIndx > -1) {
          existFileList[findedIndx] = fileObj
        }else{
          existFileList.push(fileObj)
        }
      }

      let targetFileList = {}
      targetFileList[uploadType] = existFileList

      return {
        ...state,
        fileModal: {
          ...state.fileModal,
          ...targetFileList,
          finishedUpload: action.payload.finishedUpload
        }
      }
    },
    getDocUrlSuc (state, action) {
      const uploadType = state.uploadType
      let fileObj = action.payload.file
      let fileList = action.payload.fileList
      let existFileList = state.fileModal[uploadType] || []
      // 找到对应的file，加上传参时需要的字段
      fileList = fileList.filter((item) => item.uid === fileObj.uid)
      fileList = fileList.map((item, index) => {
        item.url = fileObj.url || ''
        item.objectKey = fileObj.objectKey || ''
        item.materialType = uploadType || ''
        item.tCaseMaterialStorageId = fileObj.tCaseMaterialStorageId
        item.dicType = fileObj.dicType
        item.dicFileType = fileObj.dicFileType
        return item
      })

      if (fileObj.status === 'uploading' || fileObj.status === 'done' && !_.some(existFileList, { uid: fileObj.uid })) {
        fileObj.materialType = uploadType
        // let findedIndx = _.findIndex(existFileList, {'uid': fileObj.uid})
        existFileList[0] = fileObj
      }

      let targetFileList = {}
      targetFileList[uploadType] = existFileList

      return {
        ...state,
        fileModal: {
          ...state.fileModal,
          ...targetFileList,
          finishedUpload: action.payload.finishedUpload,
        },
      }
    },
    hideSubPersonModal (state, action) {
      return {
        ...state,
        subPersonModal: {
          ...state.subPersonModal,
          modalVisible: false,
          subPersonItem: {},
          type: '',
          title: '',
        },
      }
    },
    hideSelectPrintModal (state, action) {
    	return {
    		...state,
    		selectPrintModal: {
    			...state.selectPrintModal,
    			modalVisible: false,
    		}
    	}
    },
    getRolesSuccess (state, action) {
      return {
        ...state,
        subPersonModal: {
          ...state.subPersonModal,
          roles: action.payload,
        },
      }
    },
    showSubPersonModal (state, action) {
      return {
        ...state,
        subPersonModal: {
//        ...state.subPersonModal,
          modalVisible: true,
          title: '新增从案人员',
        },
      }
    },
    showAidMaterialModal (state, action) {
      return {
        ...state,
      aidMaterialModal: {
        modalVisible: true
      },
      tHpUserId: action.payload
    }
  },
  hideAidMaterialModal (state, action) {
    return {
      ...state,
    aidMaterialModal: {
      modalVisible: false
    }
  }
},
  showAidMsgModal (state, action) {
    return {
      ...state,
      aidMsgModal: {
        modalVisible: true,
      }
    }
  },
  hideAidMsgModal (state, action) {
    return {
      ...state,
      aidMsgModal: {
        modalVisible: false,
      }
    }
  },
  setAidMaterial ( state, action ) {
    const SuppMaterial = action.payload
    let storedFilelist = _.values(SuppMaterial)
    storedFilelist = _.flatten(storedFilelist)
    storedFilelist = _.map(storedFilelist, (item, index) => {
      item.url = item.addUrl
      item.addr = item.addUrl
      item.uid = index
      item.materialType = item.subCategory
      return item
    })
    let approveUploadList = SuppMaterial['更换法律援助人员审批表'] || []
    approveUploadList = _.map(approveUploadList, (item, index) => {
        item.url = item.addUrl
        item.addr = item.addUrl
        item.uid = index
        item.materialType = 'approveUpload'
        item.name = item.fileName
        return item
      })
      let noticeUploadList = SuppMaterial['更换法律援助人员通知书'] || []
      noticeUploadList = _.map(noticeUploadList, (item, index) => {
        item.url = item.addUrl
        item.addr = item.addUrl
        item.uid = index
        item.name = item.fileName
        item.materialType = 'noticeUpload'
        return item
      })
      return {
        ...state,
        fileModal: {...state.fileModal,noticeUploadList,approveUploadList}
      }
  },
  setChangeAidPerson( state, action) {
    let changedPerson = JSON.parse(localStorage.getItem('changedPerson'))
    let aidMsg = state.aidMsg
    action.payload.selectedLawyers.map((item,index) => {
      item.tHpUserId = item.id
    })
    const changedPersonId = changedPerson.tHpUserIds[changedPerson.tHpUserIds.length-1]
    aidMsg.map((item, index) => {
      if(item.tHpUserId == changedPersonId && item.isMain == '1'){
        action.payload.selectedLawyers[0].isMain = '1'
        action.payload.selectedLawyers[0].change = '1'
      }
      action.payload.selectedLawyers[0].change = '1'
    })
    aidMsg = aidMsg.filter( item => item.tHpUserId !== changedPersonId)
    aidMsg = aidMsg.concat(action.payload.selectedLawyers)
    return {
      ...state,
      aidMsg
    }
  },
  setDelAidPerson (state, action) {
      let aidMsg = state.aidMsg
      const tHpUserId = action.payload.tHpUserIds
      tHpUserId.map((value,index) => {
        aidMsg = aidMsg.filter( item => item.tHpUserId !== tHpUserId[index] )
      })
      return {
        ...state,
        aidMsg
      }
  },
  setAddPersonManagement (state, action) {
    action.payload.map((item,index) => {
      item.tHpUserId = item.id
    })
    let aidMsg = state.aidMsg.concat(action.payload)
    return {
      ...state,
      aidMsg
    }
},
showAidMsgChangeModal (state,action) {
  return {
    ...state,
    selectedLawyers: [],
    selectedRowKeys: [],
    selectedRows: [],
    aidMsgChangeModal: {
      modalVisible: true,
      showUpload: false,
    },
  }
},
showAidChangeModal ( state, action) {
  return {
    ...state,
    selectedLawyers: [],
    selectedRowKeys: [],
    selectedRows: [],
    aidMsgChangeModal: {
      modalVisible: true,
      showUpload: true,
    }
  }
},
hideAidMsgChangeModal (state,action) {
  return {
    ...state,
    aidMsgChangeModal: {
      modalVisible: false,
    },
    fileModal:{...state.fileModal,},
  }
},
    showSelectPrintModal (state, action) {
    	return {
    		...state,
    		selectPrintModal: {
    			modalVisible: true,
    		}
    	}
    },
    setFileData (state, action) {
      const dt = new Date().format('yyyyMMdd')
      const lg = new Date().getTime()
      const fileData = {
        endPoint: action.fileData && action.fileData.endPoint || '',
        OSSAccessKeyId: action.fileData && action.fileData.accessid,
        policy: action.fileData && action.fileData.policy,
        Signature: action.fileData && action.fileData.signature,
        key: `orm/${dt}/${lg}_\${filename}`,
        // key: 'doc/${filename}'
        keys: [],
      }

      return {
        ...state,
        fileModal: {
          ...state.fileModal,
          fileData,
        },
      }
    },
    showFileModal (state, action) {
      return {
        ...state,
        flowDetail: {
          ...state.flowDetail,
          fileModalVisible: true,
        },
      }
    },
    hideFileModal (state, action) {
      return {
        ...state,
        flowDetail: {
          ...state.flowDetail,
          fileModalVisible: false,
        },
      }
    },
    caseBaseChangeUpdata (state, action) {
      let caseBaseInfoData = {
        ...state.caseBaseInfoData,
      }
      caseBaseInfoData[action.payload.item] = action.payload.itemValue
      return {
        ...state,
        caseBaseInfoData: {
          ...caseBaseInfoData,
        },
      }
    },
    queryRemarkListSuccess (state, action) {
      const { list, pagination } = action.payload
      return {
        ...state,
        remarkList: {
          ...state.remarkList,
          list,

          pagination: {
            ...state.remarkList.pagination,
            ...pagination,
          },
        },
      }
    },
    setCaseReason (state, { payload }) {
      const caseReasonList = JSON.parse(localStorage.getItem('caseReasonList'))
      return {
        ...state,
        caseReason: caseReasonList,
      }
    },
    setCaseFinacialData (state, { response }) {
      return {
        ...state,
        caseFinacialData: response.data,
      }
    },
    setApplyerDetail (state, { response }) {
      return {
        ...state,
        caseApplyerInfoData: response.data,
      }
    },
    initEditStatus (state, { payload }) {
      return {
        ...state,
        caseId: '',
        caseReason: [],
        selectedLawyers: [],
        selectedRowKeys: [],
        fileModal: {
          keys: [],
          zptzsFileList: [],//指派通知书
          wtxyFileList: [],//委托协议
          sqwtsFileList: [],//授权委托书
          xwblFileList: [],//询问笔录
          hjzyzmFileList: [],//会见专用证明
          hjblFileList: [],//会见笔录
          yjclFileList: [],// 阅卷材料
          dcxqFileList: [],//证据材料
          dlcFileList: [],//代理词
          tsblFileList: [],//庭审笔录
          cpwsFileList: [],//裁判文书
          msqszFileList: [],//民事起诉状或答辩状、上诉状
          hjxyFileList: [],//和解协议书
          rmtjsFileList: [],//人民调解书
          fytjsFileList: [],//法援调解书
          shsFileList: [],//申诉书或再审申请书
          ldzcszsFileList: [],//劳动仲裁申请书
          xsdlyjsFileList: [],//刑事辩护（代理）意见书
          xsfdmsszFileList: [],//刑事附带民事诉状
          othersFileList: [],//其他材料
          fileList: [],
          identifyFileList: [],
          homeFinFileList: [],
          caseRelatedFileList: [],
          fileData: {},
          finishedUpload: true,
        },
        caseDetail: '',
        containerLoading: true,
        subPersonList: [], // 从案人员
        subPersonListCase: [], // 从案人员
        formData: {
          opinion: {
            value: '',
          },
          comment: {
            value: '',
          },
          dicConclusion: {
            value: '1',
          },
          dicCensorConclusion: {
            value: '1',
          },
          dicReauditConclusion: {
            value: '1',
          },
          name: {
            value: '',
          },
          lawfirmName: {
            value: '',
          },
          dicLawyerType: {
            value: '',
          },
          smsToRp: {
            value: '【浙江法律援助】尊敬的{王小111二}，您在{杭州市法律援助中心}申请的法律援助案件（案件号：{杭民援[2017]13号} ），现已指派{浙江浙杭律师事务所}的{王小三}为您服务，请三个工作日内联系援助人到{杭州市法律援助中心}签署委托协议，如需协助，请拨打12348咨询。',
          },
          smsToHp: {
            value: '【浙江法律援助】尊敬的{王小111三}，{杭州市法律援助中心}受理的法律援助案件（案件号：{杭民援[2017]13号}）将由您办理，请您在三个工作日内联系受援人到{杭州市法律援助中心}签署委托协议，并办理文件交接手续，如需协助，请拨打12348咨询。',
          },
          sms: {
            value: '',
          },
          sendState: {
            value: 1,
          },
          hpSendState: {
            value: 1,
          },
          rpSendState: {
            value: 1,
          },
          status: { value: '' },
          unthroughReason: { value: '' },
        },
      }
    },
    querySuccess (state, { payload }) {
      let {
        new_org_aid_type,
        new_dic_standing,
        caseReason,
        caseDetailData,
        caseLogData,
        CaseMaterialFile,
        SuppMaterial,
        GoodAtDomains,
        updaterLogData,
        caseId,
        appraiseInfo,
        judgeOpinion,
        recipientVisit,
        courtHearing,
        aidMsg,
        tmpStr,
        storedTempStr,
      } = payload
      // const curNode = caseStatusConverter.getStageByStatus(caseDetailData.caseStatusCode)
      // //根据案件状态获取案件属于哪一个阶段
      let curNode // (caseDetailData.caseStatusParentCode && Number(caseDetailData.caseStatusParentCode) - 1)
      if (caseDetailData.dicOrignChannel == 4 && caseDetailData.dicOrignChannelType == 2) {
        curNode = caseStatusConverter.getStageByStatus(caseDetailData.caseStatusCode, 'online')
        // curNode = Number(caseDetailData.caseStatusParentCode)
      } else {
        curNode = caseStatusConverter.getStageByStatus(caseDetailData.caseStatusCode, 'offline')
      }
      // if (caseDetailData.caseStatusCode == 24) {
      //   curNode = 6
      // }

      let storedFilelist = _.values(SuppMaterial)
      storedFilelist = _.flatten(storedFilelist)
      storedFilelist = _.map(storedFilelist, (item, index) => {
        item.url = item.addrUrl
        item.addr = item.addrUrl
        item.uid = index
        item.materialType = item.dicType
        return item
      })
      let identifyFileList = SuppMaterial['1'] || []
      identifyFileList = _.map(identifyFileList, (item, index) => {
        item.url = item.addrUrl
        item.addr = item.addrUrl
        item.uid = index
        item.materialType = item.dicType
        return item
      })
      let homeFinFileList = SuppMaterial['5'] || []
      homeFinFileList = _.map(homeFinFileList, (item, index) => {
        item.url = item.addrUrl
        item.addr = item.addrUrl
        item.uid = index
        item.materialType = item.dicType
        return item
      })

      let caseRelatedFileList = SuppMaterial['6'] || []
      caseRelatedFileList = _.map(caseRelatedFileList, (item, index) => {
        item.url = item.addrUrl
        item.addr = item.addrUrl
        item.uid = index
        item.materialType = item.dicType
        return item
      })

      return {
        ...state,
        caseReason,
        new_org_aid_type,
        new_dic_standing,
        containerLoading: false,
        caseStatus: caseDetailData.caseStatusCode,
        caseId,
        isAppraise: caseDetailData.isAppraise,
        flowId: caseDetailData.flowId,
        currentNodeNum: curNode,
        caseLogData,
        updaterLogData, // 最新日志更新人员的姓名和头像
        CaseMaterialFile,
        SuppMaterial,
        GoodAtDomains,
        caseBaseInfoData: caseDetailData,
        isApplyerInfoEditing: false,
        isCaseFinEditing: false,
        isMeterialInfoEditing: false,
        isCaseBaseInfoEditing: false,
        flowDetail: {
          ...state.flowDetail,
          ...payload.flowDetail,
        },
        fileModal: {
          ...state.fileModal,
          identifyFileList,
          homeFinFileList,
          caseRelatedFileList,
        },
        appraiseInfo,
        judgeOpinion,
        recipientVisit,
        courtHearing,
        aidMsg,
        formData: { ...state.formData, sms: { value: tmpStr } },
        storedTempStr,
      }
    },
    showSaveLoading (state) {
      return {
        ...state,
        tabLoading: true,
      }
    },
    hideSaveLoading (state) {
      return {
        ...state,
        tabLoading: false,
      }
    },
    // 申请主体信息
    editApplyerInfo (state, action) {
      return {
        ...state,
        isApplyerInfoEditing: true,
      }
    },
    saveApplyerInfoSuc (state, action) {
      return {
        ...state,
        isApplyerInfoEditing: false,
      }
    },
    cancelApplyerInfo (state, action) {
      return {
        ...state,
        isApplyerInfoEditing: false,
      }
    },
    // 案件基本信息
    editCaseBaseInfo (state, action) {
      return {
        ...state,
        isCaseBaseInfoEditing: true,
      }
    },
    saveCaseBaseInfoSuc (state, action) {
      return {
        ...state,
        isCaseBaseInfoEditing: false,
      }
    },
    cancelCaseBaseInfo (state, action) {
      return {
        ...state,
        isCaseBaseInfoEditing: false,
      }
    },
    // 案件办理结果
    editCaseTakeInfo (state, action) {
      return {
        ...state,
        isCaseTakeInfoEditing: true,
      }
    },
    saveCaseTakeInfoSuc (state, action) {
      return {
        ...state,
        isCaseTakeInfoEditing: false,
      }
    },
    cancelCaseTakeInfo (state, action) {
      return {
        ...state,
        isCaseTakeInfoEditing: false,
      }
    },
    // 材料信息
    editMeterialInfo (state, action) {
      return {
        ...state,
        isMeterialInfoEditing: true,
      }
    },
    saveMeteriaInfoSuc (state, action) {
      return {
        ...state,
        isMeterialInfoEditing: false,
      }
    },
    cancelMeterialInfo (state, action) {
      return {
        ...state,
        isMeterialInfoEditing: false,
      }
    },
    // 家庭财务情况
    editFinInfo (state, action) {
      return {
        ...state,
        isCaseFinEditing: true,
      }
    },
    saveFinInfoSuc (state, action) {
      return {
        ...state,
        isCaseFinEditing: false,
      }
    },
    cancelFinInfo (state, action) {
      return {
        ...state,
        isCaseFinEditing: false,
      }
    },
    publishBidSuc (state, action) {
      return {
        ...state,
        countModalVisible: true,
        aiderNum: action.payload.aiderNum,
        requestObj: action.payload.requestObj,
      }
    },
    updateSelectedRows (state, action) {
      let { selectedRowKeys, selectedRows, toBeRemovedRowId } = action.payload
      let existRows = state.selectedLawyers
      let workingArr = []
      if (!jsUtil.isNull(toBeRemovedRowId)) {
        workingArr = existRows.filter(item => item.id != toBeRemovedRowId)
        selectedRowKeys = state.selectedRowKeys
        selectedRowKeys = selectedRowKeys.filter(id => id != toBeRemovedRowId)
       // existRows=_.filter(existRows,)
      }
      if (selectedRowKeys) {
        if (selectedRowKeys.length) {
          let unionArr = _.unionBy(selectedRows, existRows, 'id') // 超集
          let keyArr = jsUtil.becomeObjArr(selectedRowKeys, 'id')
          workingArr = jsUtil.filterArrByArr(unionArr, keyArr)
        }
      }
      let hpNamesForHp = _.map(workingArr, 'name')
      let hpNamesStr = hpNamesForHp.join(',')
      let caseInfo = state.caseBaseInfoData

      let hpNames = ''
      if (workingArr.length) {
        workingArr.forEach((item, i) => {
          hpNames = `${hpNames + item.lawfirmName}的${item.name}${item.mobile}${i < (workingArr.length - 1) ? ',' : ''}`
        })
      }
      let rpStr = `${caseInfo.rpName || ''}：您在${caseInfo.orgName || ''}申请的法律援助事项${caseInfo.caseNum || ''}已指派${hpNames || ''}承办。请您及时与承办人${hpNamesStr || ''}联系并办理相关手续。您可以关注“浙江法律援助”微信公众号对${hpNamesStr || ''}的服务质量进行满意度评价。`
      // let rpStr = `【浙江法律援助】尊敬的${caseInfo.rpName}，您在${caseInfo.orgName||''}申请的法律援助案件（案件号：${caseInfo.caseNum||''} ），现已指派${hpNames}为您服务，请三个工作日内联系援助人到${caseInfo.orgName||''}签署委托协议，如需协助，请拨打12348咨询。`
      // let hpStr = `【浙江法律援助】尊敬的${hpNamesStr}，${caseInfo.orgName||''}受理的法律援助案件（案件号：${caseInfo.caseNum||''} ）将由您办理，请您在三个工作日内联系受援人到${caseInfo.orgName||''}签署委托协议，并办理文件交接手续，如需协助，请拨打12348咨询。`
      let hpStr = `${hpNamesStr || ''}：${caseInfo.orgName || ''}受理的关于${caseInfo.rpName || ''}(${(caseInfo.rpMobile)||''})${caseInfo.reasonNames || ''}的法律援助案件${caseInfo.caseNum || ''}已指派您承办，请您按照《浙江省法律援助服务规范》的要求承办法律援助案件。在承办过程中，请您及时登录“浙江省法律援助统一服务平台”（平台网址：http://118.178.118.223:8001），或者关注“浙江法律援助”微信公众号，点击“办案助手”子栏目，登录微信工作平台，提交承办进程、上传相关材料。电脑登录和微信登录账号均为您的手机号码。如您有软件操作上的问题，请拨打软件公司技术支持电话: 0571-28887853。您也可以向${caseInfo.orgName || ''}工作人员寻求帮助。`
      // 如果不为空第一个元素增加主承办人的字段
      /* if(workingArr.length){
        workingArr = _.map(workingArr, (item, index) => {
          if(index == 0){
            item.isMain = 1
          }else{
            item.isMain = 0
          }
          return item
        })
      }*/

      return {
        ...state,
        selectedLawyers: workingArr,
        selectedRowKeys,
        formData: {
          ...state.formData,
          smsToRp: { value: rpStr },
          smsToHp: { value: hpStr },
        },
      }
    },
    setMainLawyer (state, action) {
      let selectedLawyers = state.selectedLawyers || []
      let selectedId = action.payload.id
      if (selectedLawyers.length) {
        selectedLawyers = _.map(selectedLawyers, (item, index) => {
          if (selectedId == item.id) {
            item.isMain = 1
          } else {
            item.isMain = 0
          }
          return item
        })
      }
      return {
        ...state,
        selectedLawyers,
      }
    },
    setAidMainLawyer (state, action) {
      let aidMsg = state.aidMsg || []
      let selectedId = action.payload.tHpUserId
      if (aidMsg.length) {
        aidMsg = _.map(aidMsg, (item, index) => {
          if (selectedId == item.tHpUserId) {
            item.isMain = 1
          } else {
            item.isMain = 0
          }
          return item
        })
      }
      return {
        ...state,
        aidMsg,
      }
    },
    updateIdentityFileSelect (state, action) {
      return {
        ...state,
        identityFileData: action.payload,
      }
    },

    updateUndertakeFileSelect (state, action) {
      return {
        ...state,
        undertakeFileData: action.payload,
      }
    },

    updateCaseStepFileSelect (state, action) {
      return {
        ...state,
        caseStepFileData: action.payload,
      }
    },

    updateidentityMaterialSelect (state, action) {
      return {
        ...state,
        identityMaterialData: action.payload,
      }
    },

    updatecaseStepMaterialSelect (state, action) {
      return {
        ...state,
        caseStepMaterialData: action.payload,
      }
    },
    updateHomeFinMaterialSelect (state, action) {
      return {
        ...state,
        homeFinMaterialData: action.payload,
      }
    },

    addCommentsSuc (state, action) {
      return {
        ...state,
      }
    },
    stopCommentsSuc (state, action) {
      return {
        ...state,
      }
    },
    viewAllCommentsSuc (state, action) {
      return {
        ...state,
      }
    },
    startArchSuc (state, action) { // 发起归档成功
      return {
        ...state,
      }
    },
    onDeleteItem (state, action) {
      return {
        ...state,
        caseFinacialData: {
          ...state.caseFinacialData,
          familyIncomes: action.payload,
        },
      }
    },
    create (state, action) {
      return {
        ...state,
        caseFinacialData: {
          ...state.caseFinacialData,
          familyIncomes: action.payload,
        },
        modalVisible: false,
      }
    },
    update (state, action) {
      return {
        ...state,
        caseFinacialData: {
          ...state.caseFinacialData,
          familyIncomes: action.payload,
        },
        modalVisible: false,
      }
    },
    showModal (state, action) {
      return {
        ...state,
        ...action.payload,
        modalVisible: true,
      }
    },
    hideModal (state, action) {
      return {
        ...state,
        modalVisible: false,
      }
    },
    showRemarkModal (state, action) {
      return {
        ...state,
        ...action.payload,
        remarkDetail: {
          ...state.remarkDetail,
          remarkModalVisible: true,
        },
      }
    },
    hideRemarkModal (state, action) {
      return {
        ...state,
        ...action.payload,
        remarkDetail: {
          ...state.remarkDetail,
          remarkModalVisible: false,
        },
      }
    },
    showDataModal (state, action) {
      return {
        ...state,
        ...action.payload,
        flowDetail: {
          ...state.flowDetail,
          dataModalVisible: true,
        },
      }
    },
    hideDataModal (state, action) {
      return {
        ...state,
        ...action.payload,
        flowDetail: {
          ...state.flowDetail,
          dataModalVisible: false,
        },
      }
    },
    showLayerDetModal (state, action) {
      return {
        ...state,
        ...action.payload,
        flowDetail: {
          ...state.flowDetail,
          layerDetModalVisible: true,
          selectedId: action.payload,
        },
      }
    },
    hideLayerDetModal (state, action) {
      return {
        ...state,
        ...action.payload,
        flowDetail: {
          ...state.flowDetail,
          layerDetModalVisible: false,
        },
      }
    },
    showFlowModal (state, action) {
      return {
        ...state,
        ...action.payload,
        flowDetail: {
          ...state.flowDetail,
          flowModalVisible: true,
          selectedId: action.payload,
        },
      }
    },
    hideFlowModal (state, action) {
      return {
        ...state,
        ...action.payload,
        flowDetail: {
          ...state.flowDetail,
          flowModalVisible: false,
        },
      }
    },
    showRateModal (state, action) {
      return {
        ...state,
        ...action.payload,
        flowDetail: {
          ...state.flowDetail,
          rateModalVisible: true,
        },
      }
    },
    hideRateModal (state, action) {
      return {
        ...state,
        ...action.payload,
        flowDetail: {
          ...state.flowDetail,
          rateModalVisible: false,
        },
      }
    },
    onSelectChange (state, action) {
      return {
        ...state,
        selectedLawyers: action.payload,
      }
    },
    setAidedPersonInfoPorps (state, action) {
      let aidedPersonInfoPorps = {}
      if (action.res.data.length === 0) {
        aidedPersonInfoPorps = {
          border: false,
          infos: [
            {
              label: '工作机构：',
              value: '',
            }, {
              label: '法律援助人员名称：',
              value: '',
            }, {
              label: '职业：',
              value: '',
            }, {
              label: '联系方式：',
              value: '',
            }, {
              label: '所属机构：',
              value: '',
            }, {
              label: '工作年限：',
              value: '',
            }, {
              label: '擅长领域：',
              value: '',
            },
          ],
        }
      } else {
        const info = action.res.data[0]
        let tagName = ''
        info
          .goodFields
          .forEach((goodField) => {
            tagName += `${goodField.tagName} `
          })
        aidedPersonInfoPorps = {
          border: false,
          infos: [
            {
              label: '工作机构：',
              value: info.workUnit,
            }, {
              label: '法律援助人员名称：',
              value: info.name,
            }, {
              label: '职业：',
              value: info.dicHpIdentityName,
            }, {
              label: '联系方式：',
              value: info.mobile,
            }, {
              label: '所属机构：',
              value: info.orgName,
            }, {
              label: '工作年限：',
              value: info.workeYears,
            }, {
              label: '擅长领域：',
              value: tagName,
            },
          ],
        }
      }
      return {
        ...state,
        aidedPersonInfoPorps,
      }
    },
    setAllConfig (state, action) {
      return {
        ...state,
        allConfig,
      }
    },
    onchangeContent (state, action) {
      return {
        ...state,
        options: action.payload,
      }
    },

    queryCaseDetailSuccess (state, { payload }) {
      let { caseDetailData } = payload
      return {
        ...state,
        caseBaseInfoData: caseDetailData,
      }
    },

    showConfirmLoading (state) {
      return {
        ...state,
        confirmLoading: true,
      }
    },
    hideConfirmLoading (state) {
      return {
        ...state,
        confirmLoading: false,
      }
    },

    hideCountModal (state) {
      return {
        ...state,
        countModalVisible: false,
      }
    },

    getDocSuccess (state, action) {
      let fileList = action.payload
      let fileObj = {}
      fileList.forEach((item, index) => {
        item.url = item.addrUrl
        item.addr = item.addrUrl
        item.uid = index
        item.materialType = item.dicType
        if (!jsUtil.isNull(item.addrUrl)) {
          fileObj[item.tCaseMaterialStorageId] = [item]
        }
      })
      return {
        ...state,
        fileModal: { ...state.fileModal, ...fileObj },
        docsList: fileList,
      }
    },
		 getEmptyDocSuccess(state, action) {
      return {
        ...state,
        emptydocsList: action.payload
      }
   },
    setCaseResult (state, action) {
      let underTakeData = action.payload
      let atts = jsUtil.getAllAtts(underTakeData)
      let evidenceTime = underTakeData.evidenceTime
      let eviArr=[]
      if(!jsUtil.isNull(evidenceTime)){
        eviArr = evidenceTime.split(',')
      }
      if(eviArr.length){
        eviArr = eviArr.map((item, index)=>{return {key: `evi_${index}`, value:item}})
      }
      return {
        ...state,
        caseHandleResult: action.payload,
        fileModal: {
          ...state.fileModal,
          ...atts,
        },
        extDatePickers: eviArr,
      }
    },

    setRecipientVisit (state, action) {
      return {
        ...state,
        recipientVisit: action.payload,
      }
    },

    setCourtHearing (state, action) {
      return {
        ...state,
        courtHearing: action.payload,
      }
    },
    setSubPersonItem (state, action) {
      if (!action.payload.dicConsultantCategoryList) {
        const dic_dic_occupatio = state.allConfig.dictData.dic_dic_occupatio
        action.payload.dicConsultantCategoryList = getValueByLabel(dic_dic_occupatio, action.payload.rpUserTagsName)
      }
      return {
        ...state,
        subPersonModal: {
          ...state.subPersonModal,
          modalVisible: true,
          subPersonItem: action.payload,
          title: '编辑从案人员',
        },
      }
    },
  },
}
