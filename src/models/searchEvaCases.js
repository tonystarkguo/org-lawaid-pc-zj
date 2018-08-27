import { getDataService, postDataService } from '../services/commonService'
import { routerRedux } from 'dva/router'
import { config, createDicNodes, jsUtil } from '../utils'
import { parse } from 'qs'
import { message } from 'antd'
import moment from 'moment'
/**
 * 查询评估案件页面.
 * 默认显示列表，若点击了某一个案件，则通过链接参数type切换到单案件页面.
 * 1、待评估状态，“查看”、“复评”：指派给专家律师们
 * 2、待评估状态，“直接评估”、“查看”：指派给工作人员
 * 3、已评估状态，“查看”、“复评”：指派给专家律师们且全部评估完成
 * 4、已评估状态，“查看”：工作人员评估完成
 * 5、已复评状态，“查看”：指派给专家律师们且全部评估完成 & 工作人员复评完成
 * type:1:查看评估，type:2:初评，type:3复评
 */

const {createSelectOption} = createDicNodes
const createTreeBydics = jsUtil.createTreeBydics
const createCurrentList = jsUtil.createCurrentList
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
const allConfig = JSON.parse(localStorage.getItem('allConfig')) || {}
    const {dictData} = allConfig || {}
    const { 
    dic_org_case_stage,
    dic_case_type,
    dic_legal_status,
    dic_dic_closing_method,
    dic_dic_closing_method_to,
    dic_dic_case_effect,
    dic_dic_case_effect_to,
    dic_civil_closing_doc,//民事
    dic_criminal_closing_doc,//刑事
    dic_administration_closing_doc,//行政
  } = dictData || {}
	 const dic_standing = createTreeBydics(dic_case_type, dic_legal_status) || []
	 const total_dic_standing = createCurrentList(dic_standing) || []
const { api } = config

const getItemValue = (id, evalSelectedResultKey, evalResult) => {
  let result = {}
  let targetItem = evalResult[evalSelectedResultKey] || []
  result.appoint = targetItem.appoint || {}
  let scoreList = targetItem.score || []
  result.score = _.find(scoreList, { tProjId: id })
  return result
}

export default {
  namespace: 'searchEvaCases',
  state: {
      new_dic_standing: [],
  },
    // 订阅.
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/searchEvaCases') {
                    // 数据初始化.
          dispatch({ type: 'init', payload: { ...location.query } })
                    // 列表数据请求.
          dispatch({ type: 'refresh_list', payload: { ...location.query } })
                    // 搜索参数更新.
          dispatch({ type: 'refresh_filter', payload: { ...location.query } })
        }
      })
    },
  },
    // 异步.
  effects: {
        // 列表数据请求.
    * refresh_list ({ payload }, { select, call, put }) {
      let searchEvaCases = yield select(({ searchEvaCases }) => searchEvaCases)
      let { search } = searchEvaCases
      let search_new = payload
      if (search_new.reasons) {
        search_new.reasons = `[${search_new.reasons}]`
      }
      if (search_new.assesStart) {
        search_new.assesStart = new Date(search_new.assesStart).getTime()
      }
      if (search_new.assesEnd) {
        search_new.assesEnd = new Date(search_new.assesEnd).getTime()
      }
      const res = yield call(
                getDataService,
                { url: api.getAssesmentCaseAssesmentList },
        {
          ...search,
          ...search_new,
        }
            )
      if (res.code == 1) {
        let resData = res && res.data && res.data.list || []
        let pageNum = pageNum || 1
        let pageSize = 10
        yield put({
          type: 'refresh_list_success',
          payload: {
            list: resData,
            pagination: {
              current: Number(payload.pageNum) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: res.data.total,
            },
          },
        })
                // 如果是评估页面，那需要拉取更多信息.
        if (searchEvaCases.search.id && searchEvaCases.search.type) {
          if (search.type == 1 || ((search.type == 2 || search.type == 3) && search.editFlag == 1)) {
            yield put({
              type: 'evaluateDetail',
              payload: {
                id: searchEvaCases.search.id,
              },
            })
          }
          yield put({
            type: 'getPreviewPNG',
            payload: {
              id: searchEvaCases.search.id,
            },
          })
                    // 如果是初评.
          if (search.type == 2 || search.type == 3) {
                        // 获取当前评估方式并拉取评估模版.
                        // 获取分制度.
            yield put({
              type: 'getIsEvalStand',
              payload: {},
            })
          }
        }
      }
    },
        // 查询案件评估详情.
    * evaluateDetail ({ payload }, { select, call, put }) {
      const res = yield call(
                getDataService,
                { url: api.evaluateDetail },
        {
          case_id: payload.id,
        }
            )
      if (res.code == 1) {
                // 评估详情信息更新.
        yield put({
          type: 'update',
          payload: {
                        // 评估结果列表.
            // evalList: [],
                        // 评估结果映射.
            // evalResult:  {},
            /**/
            data:res.data||"",

            // evalSelectedResultKeyFa:"",

            // orgId:"",//评价的省级区级id
                        // 当前选中的评估结果映射KEY.
            // evalSelectedResultKey: '',
          },
        })
                // 获取分制度.
        yield put({
          type: 'getIsEvalStand',
          payload: {},
        })
      }
    },
        // 预览卷宗的图片.
    * getPreviewPNG ({ payload }, { select, call, put }) {
      const res = yield call(
                getDataService,
                { url: api.getPreviewPNG },
        {
          tCaseId: payload.id,
        }
            )
      if (res.code == 1) {
        yield put({
          type: 'update',
          payload: {
            pictureView: {
                            // 当前预览的位置.
              current: 0,
                            // 提供预览的图片列表.
              picArr: res.data || [],
            },
          },
        })
      }
    },
        // 获取当前设置的标准状态.可能是5分制也可能是100分制.
    * getIsEvalStand ({ payload }, { select, call, put }) {
      let searchEvaCases = yield select(({ searchEvaCases }) => searchEvaCases)
      let { search } = searchEvaCases
      let tOrgId = payload.tOrgId||JSON.parse(localStorage.getItem('user')).tOrgId
      const res = yield call(
                getDataService,
                { url: api.getHistoryIsEvalStand },
        { caseId:searchEvaCases.search.id,
          tOrgId,
        }
            )
      if (res.code == 1) {
        let dicEvaluationMethod = res.data.dicEvaluationMethod || 0
        if (res.data.isEvalStand && (dicEvaluationMethod != 1 && dicEvaluationMethod != 2)) {
          return message.error('分制获取异常')
        }
        yield put({
          type: 'update',
          payload: {
                        // 分制.
            dicEvaluationMethod,
          },
        })
                // 如果是评估页.
        if (search.type == 2 || search.type == 3) {
                    // 根据分制获取模版.
          yield put({
            type: 'refresh_list_all',
            payload: {
            },
          })
        }
      }
    },
        // 一次获取所有配置.
    * refresh_list_all ({ payload }, { select, call, put }) {
      let searchEvaCases = yield select(({ searchEvaCases }) => searchEvaCases)
            // let tOrgId = JSON.parse(localStorage.getItem('user')).tOrgId;
            // 根据分制调接口.
      let { dicEvaluationMethod, evalResult, evalSelectedResultKey, search } = searchEvaCases
      const { editFlag } = search
      const {caseId}=search
      const res = yield call(
                getDataService,
                { url: api.getHistoryEvaluateItems },
        {
                    // tOrgId : tOrgId,
                    caseId:caseId,
          item_type: dicEvaluationMethod,
          caseId: search.id
        }
            )
      const firstFormData = getItemValue('', evalSelectedResultKey, evalResult).appoint || {}
      if (res.code == 1) {
        let items = res.data || []
        let list = []
        items.map((item, index) => {
          const itemResult = getItemValue(item.id, evalSelectedResultKey, evalResult).score || {}
          item.value = itemResult.projectScore && `${itemResult.projectScore}` || ''
          list.push({
            ...item,
                        // 评估名称
            projectName: item.projectName,
                        // 项目分数
            projectFraction: item.projectFraction,
                        // 项目标准
            projectStandard: item.projectStandard,
                        // 是否可用
            isDeleted: item.isDeleted,
                        // 条目的ID
            // id: item.id ? item.id : undefined,
            id: editFlag === '1' ? itemResult.id : (item.id && item.id || undefined),
                        // 得分
            // projectScore: { value: item.projectScore },
            projectScore: { value: editFlag === '1' ? (itemResult.projectScore && `${itemResult.projectScore}` || '') : item.projectScore },
                        // 是否为总得分，总得分条目需要特殊处理.
            isTotalEval: item.isTotalEval,
          })
        })
        yield put({
          type: 'update',
          payload: {
            appointId: firstFormData.id,
            userType: firstFormData.dicUserType, // 用户类型：1，工作人员，2：援助人员
            edit_items: {
              list,
            },
            formdata001: {
              case_comment: { value: firstFormData.evaluationQuality },
              evaluators: { value: firstFormData.reviewMembers },
            },
          },
        })
      }
    },
        // 直接评估.
    * directEvaluate ({ payload }, { select, call, put }) {
      let searchEvaCases = yield select(({ searchEvaCases }) => searchEvaCases)
      let { search } = searchEvaCases
      let res
      if (search.type == 2) {
        res = yield call(
                    postDataService,
                    { url: api.directEvaluate },
          {
            ...payload,
          }
                )
      } else {
        res = yield call(
                    postDataService,
                    { url: api.reEvaluate },
          {
            ...payload,
          }
                )
      }
      if (res.code == 1) {
                // 更新成功后刷新整个页面.
        message.success('评估成功')
                // 数据初始化.
        yield put({ type: 'init', payload: { ...location.query } })
                // 列表数据请求.
        yield put({ type: 'refresh_list', payload: { ...location.query } })
                // 搜索参数更新.
        yield put({ type: 'refresh_filter', payload: { ...location.query } })
      } else {
                // message.error(res.message);
      }
    },
    * saveEditData ({ payload }, { select, call, put }) {
      console.log(payload)
      let res = yield call(postDataService, { url: api.updateEvaluate }, { ...payload })
      if (res.code == 1) {
        // 更新成功后刷新整个页面.
        message.success('修改成功')
        yield put(routerRedux.push('/searchEvaCases'))
      }
    },
  },
    // 聚合.
  reducers: {
        // 初始化数据.
    init (state, action) {
      const query = action.payload
      return {
        search: {
                    // 案件类型.
          caseType: '',
                    // 案由.
          reasons: '',
                    // 专家姓名.
          name: '',
                    // 评估日期-开始.
          assesStart: '',
                    // 评估日期-结束.
          assesEnd: '',
                    // 援助人员所在工作单位.
          workUnit: '',
                    // 评估状态.1、未评估 2、已评估
          dicStatus: '',
                    // 当前模块显示的页面类型.
          type: '',
                    // 当前进行操作的案件的ID.
          id: '',
                    // 每页数.
          pageSize: 10,
                    // 当前请求第几页.
          pageNum: 1,
          ...query,
        },
                // 存放双向绑定的转换后的搜索表单数据.根据search参数转换.
        filter: {
        	
        	new_dic_standing: [],
        },
                // 案件类型.
        caseTypeList: JSON.parse(localStorage.getItem('allConfig')).dictData.dic_case_type,
                // 案由.
        caseReasonList: JSON.parse(localStorage.getItem('caseReasonList')),
                // TODO.
        evaluationStatusList: JSON.parse(localStorage.getItem('allConfig')).dictData.dic_dic_assessment_appoint_status,
        list: [],
                // 列表信息.
        pagination: {
          showSizeChanger: true,
          showQuickJumber: true,
          showTotal: (total) => {
            if (total > -1) { return <span>共{total}条</span> }
            return ''
          },
          current: 1,
          total: null,
        },
                // 当前卷宗预览数组
        previewPNG: [],
                // 当前业务配置的分制.
        dicEvaluationMethod: 0,
                // 当前分制下的配置.
        edit_items: {
          list: [],
        },
                // 质量评估得分.
        formdata001: {
                    // 案件质量评价.
          case_comment: { value: '' },
                    // 评估小组成员.
          evaluators: { value: '' },
        },
                // 评估结果列表.
        evalList:(query.editFlag == '1' || query.editFlag == '0') ? state.evalList :[],
                // 评估结果映射.
        evalResult: (query.editFlag == '1' || query.editFlag == '0') ? state.evalResult :{},
        /* 质量评估父级数据 */
        data: state.data||[],
        orgId:(query.editFlag == '1' || query.editFlag == '0') ? state.orgId:"", 
        evalSelectedResultKeyFa:(query.editFlag == '1' || query.editFlag == '0') ? state.evalSelectedResultKeyFa :[],
                // 当前选中的评估结果映射KEY.
        evalSelectedResultKey: (query.editFlag == '1' || query.editFlag == '0') ? state.evalSelectedResultKey : '',
        // evalSelectedResultKey: localStorage.getItem('selectedKey') || '',
                // 预览
        pictureView: {
                    // 当前预览的位置.
          current: 0,
                    // 提供预览的图片列表.
          picArr: [],
        },
        appointId: '',
        userType: (query.editFlag == '1' || query.editFlag == '0') ? state.userType : '',
      }
    },
     handleCaseTypeChange (state, action) {
      const new_dic_standing = getCurrentDics(action.value, total_dic_standing)
      localStorage.setItem('new_dic_standing',JSON.stringify(new_dic_standing))
      return {
        ...state,
        new_dic_standing,
      }
    },
        // 刷新数据.
    update (state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
        // 刷新搜索参数.这里根据表单的需要的格式进行了格式转换.
    refresh_filter (state, action) {
      const search = JSON.parse(JSON.stringify(action.payload))
      delete search.id
      delete search.type
      let filter = {}
            // 数据适配.
      filter.valuationTime = { value: [
        search.assesStart ? moment(search.assesStart, 'YYYY-MM-DD') : undefined,
        search.assesEnd ? moment(search.assesEnd, 'YYYY-MM-DD') : undefined,
      ] }
      let reasons = []
      if (search.reasons && typeof search.reasons === 'string') {
        let caseReasons = search.reasons.split(',')
        let caseReasons_nm = search.reasons_nm.split(',')
        for (let i in caseReasons) {
          reasons.push({
            label: caseReasons_nm[i],
            value: caseReasons[i],
          })
        }
      }
      filter.reasons = { value: reasons }
      for (let i in search) {
        if (i != 'reasons') {
          filter[i] = { value: search[i] }
        }
      }
            // 搜索参数变更.
      return {
        ...state,
        filter,
      }
    },
        // 加载数据成功.
    refresh_list_success (state, action) {
      const { list, pagination } = action.payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },
  },
}
