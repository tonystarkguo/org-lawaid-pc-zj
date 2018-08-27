import { getDataService, postDataService } from '../../services/commonService'
import { config, jsUtil, caseStatusConverter } from '../../utils'
import { message } from 'antd'
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
export default {
  namespace: 'analysis',
  state: {
    //分析地区
    cityOptions: [],
    //横轴，纵轴
    analysisType: [{
      key: '0',
      value: '区域'
    }, {
      key: '1',
      value: '案由'
    }, {
      key: '2',
      value: '人群类别'
    }, {
      key: '3',
      value: '法律状态及地位'
    }, {
      key: '4',
      value: '援助方式'
    }, {
      key: '5',
      value: '处理方式'
    }],
    //分析来源
    sourceOptions: [{
      key: '0',
      value: '咨询'
    }, {
      key: '1',
      value: '案件'
    }],
    //分析时间范围
    timeOptions: [{
      key: '0',
      value: '本年'
    }, {
      key: '1',
      value: '本月'
    }],
    //请求参数、是否显示
    getData: {
      caseOrCounsel: {
        category: '',
        show: false
      },
      caseCause: {
        category: '',
        show: false
      },
      caseCustome: {
        category: '',
        show: false
      },
      casezhuCustome: {
        category: '',
        show: false
      },
      caseBingCustome: {
        category: '',
        show: false
      },
      applicantOrCounselor: {
        category: '',
        show: false
      }
    },
    //案由类别
    caseReasonOptions: caseReasonList,
    //当年咨询、案件统计
    yearCountData: [],
    //案由数据统计
    caseOriginData: [],
    // 咨询人、申请人数据统计
    targetPopulationData: [],
    d_x_initialValue:undefined,
    d_y_initialValue:undefined,
    d_y_zhu_initialValue:undefined,
    d_x_zhu_initialValue:undefined,
    d_bing_initialValue:undefined,
    ChangeArryX:undefined,
    ChangeArryXzhu:undefined,
    ChangeArryY:undefined,
    ChangeArryYzhu:undefined,
    ChangeArryBing:undefined,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/analysis') {
          dispatch({type: 'getAllCity'})
          dispatch({type: 'getCustomeCity'})
          dispatch({ type: 'getData' })
        }
      })
    },
  },
  effects: {
    * getAllCity({ payload }, { call, put }) {
    const res = yield call(getDataService, { url:api.getAllCity }, {caseSort: 1})
    if (res.success) {
      yield put({ type: 'setAllCity', payload: res.data})
    } else {
      throw res
    }
  },
  * getCustomeCity({ payload }, { call, put }) {
  const res = yield call(getDataService, { url:api.getAllCityByCustom })
  if (res.success) {
    yield put({ type: 'setCustomeCity', payload: res.data})
  } else {
    throw res
  }
},
    *getData({ payload }, { call, put }) {
      const cityList = yield call(getDataService, { url: api.getAllCityOfZJ }, {})
      if (cityList.success) {
        yield put({
          type: 'setCity',
          payload: {
            list: cityList.data
          },
        })
      } else {
        throw cityList
      }
    },
    *getCaseOrCounselList({ payload }, { call, put }) {
      const CaseOrCounselList = yield call(getDataService, { url: api.getCaseOrCounsel }, payload)
      if (CaseOrCounselList.success) {
        yield put({
          type: 'setCaseOrCounselList',
          payload: {
            list: CaseOrCounselList.data,
            category: payload.anlyzeSource == '0' ? '咨询' : '案件'
          },
        })
      } else {
        throw CaseOrCounselList
      }
    },
    *getCustomeData({ payload }, { call, put }) {
      const customeList = yield call(postDataService, { url: api.getCustomData }, payload)
      if (customeList.success) {
        yield put({
          type: 'setCustomeDataList',
          payload: {
            list: customeList.data,
          },
        })
      } else {
        throw customeList
      }
    },
    *getCustomezhuData({ payload }, { call, put }) {
      const customeList = yield call(postDataService, { url: api.getCustomData }, payload)
      if (customeList.success) {
        yield put({
          type: 'setzhuCustomeDataList',
          payload: {
            list: customeList.data,
          },
        })
      } else {
        throw customeList
      }
    },
    *getBingCustomeData({ payload }, { call, put }) {
      const customeList = yield call(postDataService, { url: api.customDataOne }, payload)
      if (customeList.success) {
        yield put({
          type: 'setBingCustomeDataList',
          payload: {
            list: customeList.data,
          },
        })
      } else {
        throw customeList
      }
    },
    *getCaseCause({ payload }, { call, put }) {
      // console.log('请求参数：')
      // console.log(payload)
      const getCaseCause = yield call(getDataService, { url: api.getCaseCause }, payload)
      // console.log('响应')
      // console.log(getCaseCause);
      if (getCaseCause.success) {
        // console.log(getCaseCause)
        yield put({
          type: 'setCaseCause',
          payload: {
            list: getCaseCause.data,
            category: payload.anlyzeSource == '0' ? '咨询' : '案件'
          },
        })
      } else {
        throw getCaseCause
      }
    },
    *getApplicantOrCounselor({ payload }, { call, put }) {
      // console.log('请求参数：')
      // console.log(payload)
      const applicantOrCounselor = yield call(getDataService, { url: api.getApplicantOrCounselor }, payload)
      if (applicantOrCounselor.success) {
        // console.log(applicantOrCounselor)
        yield put({
          type: 'setApplicantOrCounselor',
          payload: {
            list: applicantOrCounselor.data,
            category: payload.anlyzeSource == '0' ? '咨询' : '案件'
          },
        })
      } else {
        throw applicantOrCounselor
      }
    },
  },
  reducers: {
    setAllCity(state,action){
      return {
        ...state,
        allArea: action.payload,
        d_x_initialValue:undefined,
        d_y_initialValue:undefined,
        d_y_zhu_initialValue:undefined,
        d_x_zhu_initialValue:undefined,
        d_bing_initialValue:undefined,
        ChangeArryX:undefined,
        ChangeArryXzhu:undefined,
        ChangeArryY:undefined,
        ChangeArryYzhu:undefined,
        ChangeArryBing:undefined,
        getData: {
          caseOrCounsel: {
            category: '',
            show: false
          },
          caseCause: {
            category: '',
            show: false
          },
          caseCustome: {
            category: '',
            show: false
          },
          casezhuCustome: {
            category: '',
            show: false
          },
          caseBingCustome: {
            category: '',
            show: false
          },
          applicantOrCounselor: {
            category: '',
            show: false
          }
        },
      }
    },
    setCustomeCity(state,action){
      return {
        ...state,
        CustomeArea: action.payload
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
    setCity(state, action) {
      const cityOptions = action.payload.list;
      // // console.log(cityOptions);
      // return { ...state, cityOptions }
      return {
        ...state,
        //分析地区
        cityOptions: cityOptions,
        //分析来源
        sourceOptions: [{
          key: '0',
          value: '咨询'
        }, {
          key: '1',
          value: '案件'
        }],
        //分析时间范围
        timeOptions: [{
          key: '0',
          value: '本年'
        }, {
          key: '1',
          value: '本月'
        }, {
          key: '2',
          value: '本季'
        }],
        //请求参数、是否显示
        getData: {
          caseOrCounsel: {
            category: '',
            show: false
          },
          caseCause: {
            category: '',
            show: false
          },
          caseCustome: {
            category: '',
            show: false
          },
          casezhuCustome: {
            category: '',
            show: false
          },
          caseBingCustome: {
            category: '',
            show: false
          },
          applicantOrCounselor: {
            category: '',
            show: false
          }
        },
        //案由类别
        caseReasonOptions: caseReasonList,
        //当年咨询、案件统计
        yearCountData: [],
        //案由数据统计
        caseOriginData: [],
        // 咨询人、申请人数据统计
        targetPopulationData: [],
      }
    },
    setCaseOrCounselList(state, action) {
      const yearCountData = action.payload.list;
      for (let i = 0; i < yearCountData.length; i++) {
        yearCountData[i]['数量'] = Number(yearCountData[i].num);
        yearCountData[i].month = yearCountData[i].month + '月';
      }
      return {
        ...state,
        yearCountData,
        getData: {
          ...state.getData,
          caseOrCounsel: {
            category: action.payload.category,
            show: true
          }
        }
      }
    },
    setCaseCause(state, action) {
      const caseOriginData = action.payload.list;
      for (let i = 0; i < action.payload.list.length; i++) {
        caseOriginData[i]['数量'] = Number(action.payload.list[i].num)
      }
      return {
        ...state,
        caseOriginData,
        getData: {
          ...state.getData,
          caseCause: {
            category: action.payload.category,
            show: true
          }
        }
      }
    },
    setCustomeDataList(state, action) {
      const casecustomeData = action.payload.list;
      return {
        ...state,
        casecustomeData,
        getData: {
          ...state.getData,
          caseCustome: {
            show: true
          }
        }
      }
    },
    setzhuCustomeDataList(state, action) {
      const casezhucustomeData = action.payload.list;
      return {
        ...state,
        casezhucustomeData,
        getData: {
          ...state.getData,
          casezhuCustome: {
            show: true
          }
        }
      }
    },
    setBingCustomeDataList(state, action) {
      const casebingcustomeData = action.payload.list;
      
      return {
        ...state,
        casebingcustomeData,
        getData: {
          ...state.getData,
          caseBingCustome: {
            show: true
          }
        }
      }
    },
    setApplicantOrCounselor(state, action) {
      const targetPopulationData = [];
      for (let i = 0; i < action.payload.list.length; i++) {
        targetPopulationData[i] = {
          name: action.payload.list[i].sortName,
          num: Number(action.payload.list[i].num)
        }
      }
      return {
        ...state,
        targetPopulationData,
        getData: {
          ...state.getData,
          applicantOrCounselor: {
            category: action.payload.category,
            show: true
          }
        }
      }
    },
    setd_x_initialValue(state,action){
      console.log(action.payload)
      return{
        ...state,
        d_x_initialValue:action.payload
      }
    },
    setd_x_zhu_initialValue(state,action){
      console.log(action.payload)
      return{
        ...state,
        d_x_zhu_initialValue:action.payload
      }
    },
    setd_x_initialValuOnChangeArryX(state,action){
      console.log(action.payload)
      return{
        ...state,
        ChangeArryX:action.payload
      }
    },
    setd_x_zhu_initialValuOnChangeArryX(state,action){
      console.log(action.payload)
      return{
        ...state,
        ChangeArryXzhu:action.payload
      }
    },
    setd_y_initialValue(state,action){
      return{
        ...state,
        d_y_initialValue:action.payload
      }
    },
    setd_y_zhu_initialValue(state,action){
      return{
        ...state,
        d_y_zhu_initialValue:action.payload
      }
    },
    setd_y_initialValuOnChangeArryY(state,action){
      return{
        ...state,
        ChangeArryY:action.payload
      }
    },
    setd_y_zhu_initialValuOnChangeArryY(state,action){
      return{
        ...state,
        ChangeArryYzhu:action.payload
      }
    },
    setd_bing_initialValue(state,action){
      return{
        ...state,
        d_bing_initialValue:action.payload
      }
    },
    setd_bing_initialValuOnChangeArryX(state,action){
      return{
        ...state,
        ChangeArryBing:action.payload
      }
    },
    setValueOnChange(state,action){
      return{
        ...state,
        d_x_initialValue:undefined,
        d_y_initialValue:undefined,
        d_y_zhu_initialValue:undefined,
        d_x_zhu_initialValue:undefined,
        d_bing_initialValue:undefined,
        ChangeArryX:undefined,
        ChangeArryXzhu:undefined,
        ChangeArryY:undefined,
        ChangeArryYzhu:undefined,
        ChangeArryBing:undefined,
        getData: {
          caseOrCounsel: {
            category: '',
            show: false
          },
          caseCause: {
            category: '',
            show: false
          },
          caseCustome: {
            category: '',
            show: false
          },
          casezhuCustome: {
            category: '',
            show: false
          },
          caseBingCustome: {
            category: '',
            show: false
          },
          applicantOrCounselor: {
            category: '',
            show: false
          }
        }
      }
    },
    clearZheXian(state,action){
      return{
        ...state,
        d_x_initialValue:undefined,
        d_y_initialValue:undefined,
        ChangeArryX:undefined,
        ChangeArryY:undefined,
      }
    },
    clearZhuZhuang(state,action){
      return{
        ...state,
        d_y_zhu_initialValue:undefined,
        d_x_zhu_initialValue:undefined,
        ChangeArryXzhu:undefined,
        ChangeArryYzhu:undefined,
      }
    },
    clearBing(state,action){
      return{
        ...state,
        d_bing_initialValue:undefined,
        ChangeArryBing:undefined,
      }
    }
  },
}
