import { getDataService, postDataService } from '../services/commonService'
import { routerRedux } from 'dva/router'
import { config } from '../utils'
import { parse } from 'qs'
import { message } from 'antd';
import moment from 'moment'
/**
 * 设置评估标准.
 * 先接口判断是否需要进行初始设置.
 * 如果设置过后则展示一个列表，可以进行条目的控制.
 */
const { api } = config

export default {
    namespace: 'setEvaStandard',
    state: {},
    // 订阅.
    subscriptions: {
        setup ({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/setEvaStandard') {
                    // 数据初始化.
                    dispatch({type: 'init', payload : {...location.query}});
                    // 先判断是否已经设置标准.
                    dispatch({type: 'getIsEvalStand', payload : {...location.query}});
                }
            });
        }
    },
    // 异步.
    effects: {
        // 获取当前设置的标准状态.可能是5分制也可能是100分制.
        * getIsEvalStand ({payload}, {call, put}) {
            let tOrgId = JSON.parse(localStorage.getItem('user')).tOrgId;
            const res = yield call(
                getDataService,
                {url:api.getIsEvalStand},
                {
                    tOrgId : tOrgId
                }
            );
            if(res.code == 1){
                let dicEvaluationMethod = res.data.dicEvaluationMethod||0;
                if(res.data.isEvalStand && (dicEvaluationMethod != 1 && dicEvaluationMethod != 2) ){
                    return message.error("分制获取异常");
                }
                yield put({
                    type : "update",
                    payload : {
                        // 列表展示.
                        showType : res.data.isEvalStand !=true ? 0 : 1,
                        // 分制.
                        dicEvaluationMethod : dicEvaluationMethod,
                        dicEvaluateType : res.data.dicEvaluateType
                    }
                });
                // 列表数据请求.
                yield put({type: 'refresh_list_criminal', payload: {...location.query}});
                yield put({type: 'refresh_list_civil', payload: {...location.query}});
            }
        },
        // 列表数据请求.
        * refresh_list_criminal ({ payload }, {select, call, put }) {
            let setEvaStandard = yield select(({setEvaStandard}) => setEvaStandard);
            let {search} = setEvaStandard;
            //let tOrgId = JSON.parse(localStorage.getItem('user')).tOrgId;
            // 根据分制调接口.
            let {dicEvaluationMethod} = setEvaStandard;

            const res = yield call(
                getDataService,
                {url:api.getEvaluateItemsWithPage},
                {
                    ...search,
                    //tOrgId : tOrgId,
                    item_type : dicEvaluationMethod,
                    ...payload,
                    project_type: '1'
                }
            );
            if (res.code == 1) {
                let resData = (res && res.data&& res.data.list) || []
                let pageNum = res.data?res.data.pageNum || 1:1;
                let pageSize = res.data?res.data.pageSize||10:10;
                yield put({
                    type: 'refresh_list_criminal_success',
                    payload: {
                        listCriminal: resData,
                        pagination: {
                            current: Number(pageNum) || 1,
                            pageSize : Number(pageSize) || 10,
                            total: res.data.total
                        }
                    }
                });
            }
        },
        * refresh_list_civil ({ payload }, {select, call, put }) {
        let setEvaStandard = yield select(({setEvaStandard}) => setEvaStandard);
        let {search} = setEvaStandard;
        //let tOrgId = JSON.parse(localStorage.getItem('user')).tOrgId;
        // 根据分制调接口.
        let {dicEvaluationMethod} = setEvaStandard;

        const res = yield call(
            getDataService,
            {url:api.getEvaluateItemsWithPage},
            {
                ...search,
                //tOrgId : tOrgId,
                item_type : dicEvaluationMethod,
                ...payload,
                project_type: '2'
            }
        );
        if (res.code == 1) {
            let resData = (res && res.data&& res.data.list) || []
            let pageNum = res.data?res.data.pageNum || 1:1;
            let pageSize = res.data?res.data.pageSize||10:10;
            yield put({
                type: 'refresh_list_civil_success',
                payload: {
                    listCivil: resData,
                    pagination: {
                        current: Number(pageNum) || 1,
                        pageSize : Number(pageSize) || 10,
                        total: res.data.total
                    }
                }
            });
        }
    },
        // 一次获取所有列表数据.
        * refresh_list_all_criminal ({ payload }, {select, call, put }) {
            let setEvaStandard = yield select(({setEvaStandard}) => setEvaStandard);
            //let tOrgId = JSON.parse(localStorage.getItem('user')).tOrgId;
            // 根据分制调接口.
            let {dicEvaluationMethod} = setEvaStandard;

            const res = yield call(
                getDataService,
                {url:api.getEvaluateItems},
                {
                    //tOrgId : tOrgId,
                    item_type : dicEvaluationMethod,
                    project_type: '1'
                }
            );
            if (res.code==1) {
                let items = res.data || [];
                let list = [];
                items.map((item, index)=>{
                    list.push({
                        ...item,
                        // 评估名称
                        projectName : {value:item.projectName},
                        // 项目分数
                        projectFraction : {value:item.projectFraction},
                        // 项目标准
                        projectStandard : {value:item.projectStandard},
                        // 是否可用
                        isDeleted : {value:item.isDeleted?'0':'1'},
                        // 条目的ID
                        id : item.id?item.id:undefined,
                        // 是否为总得分，总得分条目需要特殊处理.
                        isTotalEval : item.isTotalEval
                    });
                });
                yield put({
                    type: 'update',
                    payload: {
                        edit_items : {
                            list : list
                        }
                    }
                });
            }
        },
        * refresh_list_all_civil ({ payload }, {select, call, put }) {
        let setEvaStandard = yield select(({setEvaStandard}) => setEvaStandard);
        //let tOrgId = JSON.parse(localStorage.getItem('user')).tOrgId;
        // 根据分制调接口.
        let {dicEvaluationMethod} = setEvaStandard;

        const res = yield call(
            getDataService,
            {url:api.getEvaluateItems},
            {
                //tOrgId : tOrgId,
                item_type : dicEvaluationMethod,
                project_type: '2' 
            }
        );
        if (res.code==1) {
            let items = res.data || [];
            let list = [];
            items.map((item, index)=>{
                list.push({
                    ...item,
                    // 评估名称
                    projectName : {value:item.projectName},
                    // 项目分数
                    projectFraction : {value:item.projectFraction},
                    // 项目标准
                    projectStandard : {value:item.projectStandard},
                    // 是否可用
                    isDeleted : {value:item.isDeleted?'0':'1'},
                    // 条目的ID
                    id : item.id?item.id:undefined,
                    // 是否为总得分，总得分条目需要特殊处理.
                    isTotalEval : item.isTotalEval
                });
            });
            yield put({
                type: 'update',
                payload: {
                    edit_items : {
                        list : list
                    }
                }
            });
        }
    },
        // 更新评估项.
        * update_standard_criminal ({payload}, {select, call, put}) {
            let setEvaStandard = yield select(({setEvaStandard}) => setEvaStandard);
            let {dicEvaluationMethod,dicEvaluateType} = setEvaStandard;
            let {itemList} = payload;
            itemList.map((item,index)=>{
                item.dicEvaluationMethod = dicEvaluationMethod;
                item.dicEvaluateType = dicEvaluateType;
                item.projectType = '1';
                if(dicEvaluationMethod==1){
                    item.projectFraction = 5;
                }
            });
            const res = yield call(
                postDataService,
                {url:api.postEvaluateItemUpdate},
                {
                    itemList
                }
            );
            if (res.code == 1) {
                // 更新成功后刷新整个页面.
                message.success("更新成功");
                // 数据初始化.
                yield put({type: 'init', payload : {...location.query}});
                // 先判断是否已经设置标准.
                yield put({type: 'getIsEvalStand', payload : {...location.query}});
            }
            else{
                // message.error(res.message);
            }
        },
        * update_standard_civil ({payload}, {select, call, put}) {
        let setEvaStandard = yield select(({setEvaStandard}) => setEvaStandard);
        let {dicEvaluationMethod,dicEvaluateType} = setEvaStandard;
        let {itemList} = payload;
        itemList.map((item,index)=>{
            item.dicEvaluationMethod = dicEvaluationMethod;
            item.dicEvaluateType = dicEvaluateType;
            item.projectType = '2';
            if(dicEvaluationMethod==1){
                item.projectFraction = 5;
            }
        });
        const res = yield call(
            postDataService,
            {url:api.postEvaluateItemUpdate},
            {
                itemList
            }
        );
        if (res.code == 1) {
            // 更新成功后刷新整个页面.
            message.success("更新成功");
            // 数据初始化.
            yield put({type: 'init', payload : {...location.query}});
            // 先判断是否已经设置标准.
            yield put({type: 'getIsEvalStand', payload : {...location.query}});
        }
        else{
            // message.error(res.message);
        }
    },
        // 设置评估方式.
        * postOrgEvalStand ({payload}, {call, put}) {
            const res = yield call(
                postDataService,
                {url:api.postOrgEvalStand},
                {
                    ...payload
                }
            );
            if (res.code == 1) {
                // 更新成功后刷新整个页面.
                message.success("更新成功");
                // 数据初始化.
                yield put({type: 'init', payload : {...location.query}});
                // 先判断是否已经设置标准.
                yield put({type: 'getIsEvalStand', payload : {...location.query}});
            }
            else{
                //message.error(res.message);
            }
        },
       *resetStandard({payload},{call, put, select}){
            let setEvaStandard = yield select(({setEvaStandard}) => setEvaStandard);
            const {listCivil, listCriminal} = setEvaStandard
            const list = listCivil.concat(listCriminal)
            const itemList = []
            for(let i =0;i<list.length;i++) {
                itemList.push({id:list[i].id})
            }
            const res = yield call(postDataService, {url: api.resetEvaluateItems},{itemList})
            if (res.code == 1) {
               
                yield put({
                    type : "update",
                    payload:{
                        showType: 0
                    }
                });
            }
            else{
                //message.error(res.message);
            }
        }
    },
    // 聚合.
    reducers: {
        // 初始化数据.
        init (state, action){
            const query = action.payload;
            return {
                // 拉去列表数据的时候需要的列表参数.
                search : {
                    pageSize : 10,
                    pageNum : 1,
                    ...query
                },
                list: [],
                // 列表信息.
                pagination:{
                    showSizeChanger: true,
                    showQuickJumber: true,
                    showTotal: total => `共${total}条`,
                    current: 1,
                    total: null
                },
                // 当前要显示的视图，0表示初始化评估方式，1表示显示列表，2表示显示编辑.
                showType : -1,
                // 评估方式.1为5分制，2为100分制.
                dicEvaluationMethod : 0,
                dicEvaluateType : 0,
                // 初始化分制表单.
                initForm : {
                    // 评估的卷宗.1承办卷，2二卷.
                    dicEvaluationMethod : undefined,
                    // 评估方式.1为5分制，2为100分制.
                    dicEvaluateType : undefined
                },
                // 编辑表单初始值.
                edit_items : {
                    list :[]
                }
            }
        },
        // 刷新数据.
        update(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        // 加载数据成功.
        refresh_list_criminal_success (state, action){
            const { listCriminal, pagination } = action.payload;
            return {
                ...state,
                listCriminal,
                paginationCriminal: {
                    ...state.pagination,
                    ...pagination
                }
            };
        },
        refresh_list_civil_success (state, action){
            const { listCivil, pagination } = action.payload;
            return {
                ...state,
                listCivil,
                paginationCivil: {
                    ...state.pagination,
                    ...pagination
                }
            };
        },
    }
}