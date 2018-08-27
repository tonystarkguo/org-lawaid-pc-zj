import { getDataService, postDataService } from '../services/commonService'
import { routerRedux } from 'dva/router'
import { config, createDicNodes, jsUtil } from '../utils'
import { parse } from 'qs'
import { message } from 'antd'
import moment from 'moment'

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
/**
 * 指派评估案件.
 * 
 */
const { api } = config
export default {
    namespace: 'assignEvaCases',
    state: {
    	new_dic_standing: [],
    },
    // 订阅.
    subscriptions: {
        setup ({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/assignEvaCases') {
                    // 数据初始化.
                    dispatch({type: 'init', payload : {...location.query}});
                    // 列表数据请求.
                    dispatch({type: 'refresh_list', payload: {...location.query}});
                    // 搜索参数更新.
                    dispatch({type: 'refresh_filter', payload: {...location.query}});
                }
            });
        }
    },
    // 异步.
    effects: {
        // 列表数据请求.
        * refresh_list ({ payload }, {select, call, put }) {
            let assignEvaCases = yield select(({assignEvaCases}) => assignEvaCases);
            let {search} = assignEvaCases;
            let search_new = payload;
            if(search_new.reasons){
                search_new.reasons = "["+search_new.reasons+"]";
            }
            if(search_new.archiveStart){
                search_new.archiveStart = new Date(search_new.archiveStart).getTime();
            }
            if(search_new.archiveEnd){
                search_new.archiveEnd = new Date(search_new.archiveEnd).getTime();
            }
            const res = yield call(
                getDataService,
                {url:api.getAssesmentCaseList},
                {
                    ...search,
                    ...search_new
                }
            );
            if (res.code == "1") {
                let resData = res && res.data && res.data.list || []
                let pageNum = pageNum || 1
                let pageSize = 10;
                yield put({
                    type: 'refresh_list_success',
                    payload: {
                        list: resData,
                        pagination: {
                            current: Number(payload.pageNum) || 1,
                            pageSize: Number(payload.pageSize) || 10,
                            total: res.data.total
                        }
                    }
                });
            }
        },
        // 子列表.获取质量评估专家列表或者中心工作人员列表.
        * refresh_modal_list ({ payload }, {select, call, put }) {
            let res;
            let assignEvaCases = yield select(({assignEvaCases}) => assignEvaCases);
            if(payload.selectType == 1){
                res = yield call(
                    getDataService,
                    {url:api.queryExpertListBelongMyOrgForAssigned},
                    {
                        pageSize : assignEvaCases.modal_pagination1.pageSize,
                        ...payload
                    }
                );
            }
            else{
                res = yield call(
                    getDataService,
                    {url:api.ormUserList},
                    {
                        pageSize : assignEvaCases.modal_pagination2.pageSize,
                        ...payload
                    }
                );
            }
            if (res.code == "1") {
                let tGlobalId = JSON.parse(localStorage.getItem('user')).tGlobalId
                let resData = res && res.data && res.data.list || []
                let pageNum = pageNum || 1
                let pageSize = 5;
                yield put({
                    type: 'refresh_list_success_list',
                    payload: {
                        selectType : payload.selectType,
                        list: resData,
                        pagination: {
                            current: Number(payload.pageNum) || 1,
                            pageSize: Number(payload.pageSize) || 5,
                            total: res.data.total
                        }
                    }
                })
            }
        },
        // 提交指派.
        * assesmentAppoint ({ payload }, {select, call, put }) {
            let assignEvaCases = yield select(({assignEvaCases}) => assignEvaCases);

            // 案件列表.
            let assesesmentDtos = assignEvaCases.selectedRows||[];
            // 评估人员集合.
            let assessmentAppoints = [];
            assignEvaCases.current_do_items.map((item,index)=>{
                assessmentAppoints.push({
                    // 机构ID.
                    tOrgId : item.tOrgId,
                    // 人员类型.
                    dicUserType : assignEvaCases.selectType,
                    // 指派人ID.
                    tUserGlobalId :item.tGlobalId,
                    // 姓名.
                    userName :item.name,
                    // 工作单位.
                    workUnit : item.workUnit
                });
            });

            let res = yield call(
                postDataService,
                {url:api.assesmentAppoint},
                {
                    assesesmentDtos : assesesmentDtos,
                    assessmentAppoints : assessmentAppoints
                }
            );
            if (res.code == "1") {
                // 更新成功后刷新整个页面.
                message.success("分配成功");
                // 数据初始化.
                yield put({type: 'init', payload : {...location.query}});
                // 列表数据请求.
                yield put({type: 'refresh_list', payload: {...location.query}});
                // 搜索参数更新.
                yield put({type: 'refresh_filter', payload: {...location.query}});
            }
            else{
                // message.error(res.message);
            }
        }
    },
    // 聚合.
    reducers: {
        // 初始化数据.
        init (state, action){
            const query = action.payload;
            return {
                // 搜索参数.同URI参数协同.
                search : {
                    // 案件类型.
                    caseType : "",
                    // 案由.
                    reasons : "",
                    // 援助人员所在工作单位.
                    workUnit : "",
                    // 归档日期-开始.
                    archiveStart : "",
                    // 归档日期-结束.
                    archiveEnd : "",
                    // 每页数.
                    pageSize : 10,
                    // 当前请求第几页.
                    pageNum : 1,
                    ...query
                },
                // 提供给双向绑定的搜索表单数据源.
                filter : {
                	
                	new_dic_standing: [],
                },
                // 案件类型.
                caseType_list : JSON.parse(localStorage.getItem('allConfig')).dictData.dic_case_type,
                // 案由.
                caseReason_list : JSON.parse(localStorage.getItem('caseReasonList')),
                list: [],
                currentItem: {},
                modalVisible: false,
                modalType: 'create',
                // 列表信息.
                pagination:{
                    showSizeChanger: true,
                    showQuickJumber: true,
                    showTotal: total => {
                        if(total>-1){return <span>共{total}条</span>}
                        return ""
                    },
                    current: 1,
                    total: null
                },
                // 是否显示弹出框.
                showAssignCase : false,
                // 当前弹出框中选择的类型.
                selectType : 1,
                modal_list1 : [],
                modal_list2 : [],
                new_dic_standing: [],
                modal_pagination1 : {
                    showSizeChanger: true,
                    showQuickJumber: true,
                    showTotal: total => {
                        if(total>-1){return <span>共{total}条</span>}
                        return ""
                    },
                    current: 1,
                    total: null,
                    pageSize: 5
                },
                modal_search1 : {
                    name : "",
                    workUnit : ""
                },
                modal_pagination2 : {
                    showSizeChanger: true,
                    showQuickJumber: true,
                    showTotal: total => {
                        if(total>-1){return <span>共{total}条</span>}
                        return ""
                    },
                    current: 1,
                    total: null,
                    pageSize: 5
                },
                modal_search2 : {
                    name : ""
                },
                // 当前选中的进行指派的律师.可以同类型多个.
                current_do_items : [],
                // 当前选中的案件列表.
                selectedRows : [],
                selectedRowKeys : []
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
        update(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        // 刷新搜索参数.
        refresh_filter (state, action){
            const search = action.payload;
            var filter = {};
            // 数据适配.
            filter.docTime = {value:[
                search.archiveStart?moment(search.archiveStart, "YYYY-MM-DD"):undefined,
                search.archiveEnd?moment(search.archiveEnd, "YYYY-MM-DD"):undefined
            ]};
            let reasons = [];
            if(search.reasons && typeof search.reasons == "string"){
                let caseReasons = search.reasons.split(",");
                let caseReasons_nm = search.reasons_nm.split(",");
                for(let i in caseReasons){
                    reasons.push({
                        label : caseReasons_nm[i],
                        value : caseReasons[i]
                    })
                }
            }

            filter.reasons = {value:reasons};
            for(var i in search){
                if(i != "reasons"){
                    filter[i] = {value:search[i]};
                }
            }
            // 搜索参数变更.
            return {
                ...state,
                filter : filter
            }
        },
        // 加载数据成功.
        refresh_list_success (state, action){
            const { list, pagination } = action.payload;
            return {
                ...state,
                list,
                pagination: {
                    ...state.pagination,
                    ...pagination
                }
            };
        },
        refresh_list_success_list (state, action){
            if(action.payload.selectType == 1){
                const { list:modal_list1, pagination:modal_pagination1, selectType, modal_search1 } = action.payload;
                return {
                    ...state,
                    modal_list1,
                    selectType,
                    modal_pagination1:{
                        ...state.modal_pagination1,
                        ...modal_pagination1
                    }
                };
            }
            else{
                const { list:modal_list2, pagination:modal_pagination2, selectType, modal_search2 } = action.payload;
                return {
                    ...state,
                    modal_list2,
                    selectType,
                    modal_pagination2:{
                        ...state.modal_pagination2,
                        ...modal_pagination2
                    }
                };
            }
        }
    }
}