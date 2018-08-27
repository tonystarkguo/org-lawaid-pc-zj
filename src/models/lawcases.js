//model中定义state，action和reducer，具体可查看https://github.com/dvajs/dva/blob/master/docs/Concepts_zh-CN.md
//
import {config, caseStatusConverter, jsUtil} from '../utils'
import { getDataService, postDataService } from '../services/commonService'
import { parse } from 'qs'
import {message} from 'antd'
import moment from 'moment'
const { api } = config

export default {
	namespace: 'lawcases',// model对应的命名空间，其他比如router容器组件中获取state的时需要带上命名空间
	state: {//model中的状态数据，是不变的，immutable data. 每次都是全新的数据, 这里的数据将会以connect的方式传送到容器组件
		searchKeys: {
		  rpUserMobile: {value: ''},
      rpName: {value: ''},
      undertakeName: {value: ''},
      caseType: {value: ''},
      createTime: {value: ''},
      caseReason: {value: []},
      assignDate: { value: [] },
      completeDate: { value: [] },
      caseNum: {value: []},
      noticeBoxNumber: {value: []},
      undertakeJudge: {value: []},
      undertakeOrgName: {value: []},
    },//列表表头搜索关键字列表
		list: [],//lawcases list, from database
		signedLawcases: [], //已签收的案件列表
		listType: '1',//案件列表的类型，用于显示不同的表格头部，1. 在线检查
		currentItem: {},//在表格中当前操作的是哪一行，创建，更新，删除的时候需要用到
		assignTaskModalVisible: false,//弹出框的显示与隐藏控制flag
		isSearch: true,
		roles: [], //当前登陆者的身份角色: 管理员，有分派，查看权限
		caseStatus: '',
		opmUserList: [],//运营人员列表信息
		opmUserCasesInfo: [],//运营人员手上的待处理的案件信息
		allConfig: [],//字典
		selectedOpmUserId: '', //分派时选择的运营人员
		pagination:{//表格援助事项列表的分页信息
			showSizeChanger: true,
			showQuickJumber: true,
			pageSizeOptions: ['5','10'],
			showTotal: total => `共${total} 条`,
			current: 1,
			total: null
		},
		extPagination:{//表格援助事项列表的分页信息
			showSizeChanger: true,
			showQuickJumber: true,
			pageSizeOptions: ['5','10'],
			showTotal: total => `共${total} 条`,
			current: 1,
			total: null
		},
	},
	reducers: {//同步操作，通过model当前的state和传入的action产生新的state
		setAllCity(state,action){
      return {
        ...state,
        allArea: action.payload
      }
    },
		initPage(state, action) {
      if (action.payload) {
        return { ...state, searchKeys: {
          ...action.payload,
          completeDate: action.payload.completeDate.value.length ? {
            name: 'completeDate',
            value: [
              moment(action.payload.completeDate.value[0]),
              moment(action.payload.completeDate.value[1]),
            ],
            touched: true,
            dirty: false
          } : { value: [] },
          assignDate: action.payload.assignDate.value.length ? {
            name: 'assignDate',
            value: [
              moment(action.payload.assignDate.value[0]),
              moment(action.payload.assignDate.value[1]),
            ],
            touched: true,
            dirty: false
          } : { value: [] },
        }
        }
      }
      return {
        ...state, searchKeys: {
          rpUserMobile: { value: '' },
          rpName: { value: '' },
          undertakeName: { value: '' },
          caseType: { value: '' },
          createTime: { value: '' },
          caseReason: { value: [] },
          assignDate: { value: [] },
          completeDate: { value: [] },
          caseNum: { value: [] },
          noticeBoxNumber: { value: [] },
          undertakeJudge: { value: [] },
          undertakeOrgName: { value: [] },
	    }}
	},
	setSysAreas(state, action) {
		return {
			...state,
			allArea: action.payload.data
		}
	},
    save_fields(state, action) {
      return {...state, searchKeys: {...state.searchKeys, ...action.payload}}
    },
		getAllConfig(state, action) {
			const allConfig = JSON.parse(localStorage.getItem('allConfig'))
    	return {
        ...state,
        allConfig
    	}
		},
		querySuccess (state, action){
			const {list, pagination, listType, assignTaskModalVisible} = action.payload
			const userObj = JSON.parse(localStorage.getItem('user'))
			const roles = userObj && userObj.roles
			localStorage.setItem('listType', listType)
			return {
				...state,
				list,
				roles,
				assignTaskModalVisible,
				listType,
				pagination: {
					...state.pagination,
					...pagination
				}
			}
		},
		querySignedLawcasesSuccess (state, action){
			const {signedLawcases, pagination, listType} = action.payload
			localStorage.setItem('listType', listType)
			return {
				...state,
				signedLawcases,
				listType,
				extPagination: {
					...state.pagination,
					...pagination
				}
			}
		},
		showAssignTaskModal (state, action){
			return {...state, ...action.payload, assignTaskModalVisible: true}
		},
		hideAssignTaskModal (state, action){
			return {...state, assignTaskModalVisible: false}
		},
    updateCurrentItem (state, action){
    	return {...state, currentItem: action.payload}
    },
		changeOpmUserCasesInfo(state, action){
    	return {...state, opmUserCasesInfo: action.payload.opmUserCasesInfo, selectedOpmUserId: action.payload.selectedOpmUserId }
    }
	},
	effects: {//异步操作，使用redux-sagas做异步流程控制，采用的generator 同步写法
		* getAllCity({ payload }, { call, put }) {
			const res = yield call(getDataService, { url:api.getAllCity }, {caseSort: 1})
			if (res.success) {
				yield put({ type: 'setAllCity', payload: res.data})
			} else {
				throw res
			}
		},
		*getModalInitData({payload}, {call, put}){
			let opmUserList = []
			let opmUserCasesInfo = []
			const opmUsersData = yield call(getDataService, {url: api.getOpmUsersUrl}, {tRoleId: 1 ,serviceId: 'srvid_getOpmUsersUrl'})
			
			if(opmUsersData && opmUsersData.data && opmUsersData.data.list && opmUsersData.data.list.length){

				const opmCases = yield call(getDataService, {url: api.getSignCase}, {tGlobalId: opmUsersData.data.list[0]['tGlobalId'],serviceId: 'srvid_getSignCase'})

				if(opmCases && opmCases.data){
					opmUserList = opmUsersData.data.list,
					opmUserCasesInfo = opmCases
				}else{
					opmUserList = opmUsersData.data.list,
					opmUserCasesInfo = []
				}
			}else{//如果没有找到运营人员
				opmUserList = [],
				opmUserCasesInfo = []
			}
			yield put(
				{
					type: 'showAssignTaskModal',
					payload: {
						opmUserList: opmUserList,
						opmUserCasesInfo: opmUserCasesInfo,
						currentItem: payload, 
						selectedOpmUserId: opmUserList && opmUserList.length && opmUserList[0]['tGlobalId'] || '' 
					}
				}
			)
		},
		//根据类型，获取案件列表
		*getCaseList ({payload}, {call, put, select}){
			payload = parse(location.search.substr(1))
		  let listType = payload.type || '1'
			let reqUrl = api.getCaseNotBidUndertake
			// if(listType === '10'){
			// 	reqUrl = api.getCaseHasUndertake //查询列表接口url
			// }
			payload.caseStatus = caseStatusConverter.getReqStatusByMenu(listType)

			if(listType === '1' || listType === '2' || listType === '3' || listType === '4' || listType === '5' || listType === '6' || listType === '7'){
				payload.isFilterSign = 1 //待办列表刷选签收案件
			}

			payload.opmGlobalUserId = JSON.parse(localStorage.getItem('user')).tGlobalId || ''
			payload.pageNum = payload.pageNum && Number(payload.pageNum) || 1
			payload.pageSize = payload.pageSize && Number(payload.pageSize) || 10

			payload.serviceId = 'srvid_getLawcaseList' + listType

			const data = yield call(postDataService, {url: reqUrl}, payload)
			if(data.success){
				let resData = data && data.data && data.data.list || []
				let pageNum = pageNum || 1
				let pageSize = 10
				let startSeq = (pageNum == 1 ? 1 : (2*Number(pageSize) + 1))

				resData = resData.map((item, index) => {
					let newItem = item;
					newItem.seq = startSeq++
					return newItem
				})
				yield put(
					{
						type: 'querySuccess',
						payload: {
							listType: listType,
							list: resData,
							// assignTaskModalVisible: visible,
							pagination: {
								current: Number(payload.pageNum) || 1,
								pageSize: Number(payload.pageSize) || 10,
								total: data.data.total
							}
						}
					}
				)
			}else if(data.code === '9999'){
		        //do nothing, it will not update the state and will not re-render the page.
		    }
		},
		//根据类型，获取案件列表，具有搜索功能
    *changePageWithCriterial({ payload }, { call, put, select }) {
      let searchKeys = yield select(({ lawcases }) => lawcases.searchKeys)
      if (payload.searchInfo) {
        searchKeys = payload.searchInfo
      }
	    let criterias = _.mapValues(searchKeys, (item, index) => {
	    	return item.value
      })
	    criterias = _.pickBy(criterias, (item) => {
	    	return !jsUtil.isNull(item)
		})
		if(criterias.areaId && criterias.areaId.length){
			if(criterias.areaId.length == 1){
				criterias.areaId = criterias.areaId[0].toString()
			}else{
			 criterias.subAreaId = criterias.areaId[1].toString()
			 criterias.areaId = criterias.areaId[0].toString()
			}
		}
	    if(criterias.caseReason && criterias.caseReason.length){
	      let caseReasonStr = ''
	      let caseReasonArr = criterias.caseReason
//	      caseReasonArr = _.map(caseReasonArr, 'value')
	      caseReasonStr = caseReasonArr.join(',')
	      criterias.caseReason = caseReasonStr
      }
	    if(criterias.assignDate && criterias.assignDate.length){
	      criterias.caseAppointTimeBegin = moment(criterias.assignDate[0]).format('YYYY-MM-DD')
	      criterias.caseAppointTimeEnd = moment(criterias.assignDate[1]).format('YYYY-MM-DD')
      }
		if(criterias.completeDate && criterias.completeDate.length){
			criterias.caseAcceptanceTimeBegin = moment(criterias.completeDate[0]).format('YYYY-MM-DD')
			criterias.caseAcceptanceTimeEnd = moment(criterias.completeDate[1]).format('YYYY-MM-DD')
      }
		    
			let urlParams = parse(location.search.substr(1))
		  let listType = urlParams.type || '1'
		  let reqUrl
		  if(listType === '0' || listType === '7'){
			   reqUrl = api.getCaseNotBidUndertake // 除了查询列表的其他案件列表
		  }else{
			reqUrl = api.getCaseNotBidCaseByArea
		  }
			let reqParams = {}
			// if(listType === '10'){
			// 	reqUrl = api.getCaseHasUndertake //查询列表接口url
			// }
			reqParams.caseStatus = caseStatusConverter.getReqStatusByMenu(listType)

			if(listType === '0' || listType === '1' || listType === '2' || listType === '3' || listType === '4' || listType === '5' || listType === '6' || listType === '7'){
				reqParams.isFilterSign = 1 //待办列表刷选签收案件
				reqParams.isSign = 0 // 未签收的案件
      }

			reqParams.opmGlobalUserId = JSON.parse(localStorage.getItem('user')).tGlobalId || ''
			reqParams.pageNum = payload.pageNum && Number(payload.pageNum) || 1
			reqParams.pageSize = payload.pageSize && Number(payload.pageSize) || 5

			reqParams.serviceId = 'srvid_getLawcaseList' + listType
			const data = yield call(postDataService, {url: reqUrl}, {...reqParams, ...criterias})
      if (data.success) {
        if (!payload.searchInfo) {
          localStorage.setItem(`searchInfo${window.location.pathname}`, JSON.stringify(searchKeys))
        }
				let resData = data && data.data && data.data.list || []
				let pageNum = pageNum || 1
				let pageSize = 10
				let startSeq = (pageNum == 1 ? 1 : (2*Number(pageSize) + 1))

				resData = resData.map((item, index) => {
					let newItem = item;
					newItem.seq = startSeq++
					return newItem
				})
				yield put(
					{
						type: 'querySuccess',
						payload: {
							listType: listType,
							list: resData,
							// assignTaskModalVisible: visible,
							pagination: {
								current: Number(payload.pageNum) || 1,
								pageSize: Number(payload.pageSize) || 5,
								total: data.data.total
							}
						}
					}
				)
			}else if(data.code === '9999'){
		        //do nothing, it will not update the state and will not re-render the page.
		    }
		},
		//根据类型，获取案件列表
		*changePageOnly ({payload}, {call, put, select}){
			let urlParams = parse(location.search.substr(1))
		    let listType = urlParams.type || '1'
			let reqUrl = api.getCaseNotBidUndertake // 除了查询列表的其他案件列表
			let reqParams = {}
			// if(listType === '10'){
			// 	reqUrl = api.getCaseHasUndertake //查询列表接口url
			// }
			reqParams.caseStatus = caseStatusConverter.getReqStatusByMenu(listType)

			if(listType === '0' || listType === '1' || listType === '2' || listType === '3' || listType === '4' || listType === '5' || listType === '6'){
				reqParams.isFilterSign = 1 //待办列表刷选签收案件
			}
			reqParams.isSign = 1 // 已签收的案件

			reqParams.opmGlobalUserId = JSON.parse(localStorage.getItem('user')).tGlobalId || ''
			reqParams.pageNum = payload.pageNum && Number(payload.pageNum) || 1
			reqParams.pageSize = payload.pageSize && Number(payload.pageSize) || 5

			reqParams.serviceId = 'srvid_getLawcaseListWithoutKey' + listType

			const data = yield call(postDataService, {url: reqUrl}, {...reqParams})
			if(data.success){
				let resData = data && data.data && data.data.list || []
				let pageNum = pageNum || 1
				let pageSize = 10
				let startSeq = (pageNum == 1 ? 1 : (2*Number(pageSize) + 1))

				resData = resData.map((item, index) => {
					let newItem = item;
					newItem.seq = startSeq++
					return newItem
				})
				yield put(
					{
						type: 'querySignedLawcasesSuccess',
						payload: {
							listType: listType,
							signedLawcases: resData,
							pagination: {
								current: Number(payload.pageNum) || 1,
								pageSize: Number(payload.pageSize) || 5,
								total: data.data.total
							}
						}
					}
				)
			}else if(data.code === '9999'){
		        //do nothing, it will not update the state and will not re-render the page.
		    }
		},
    *updateItem ({ payload }, { select, call, put }) {
    	  // const curState = yield select(({ lawcases }) => lawcases)
	      yield put({type: 'updateCurrentItem', 'payload': payload.currentItem})
	      const id = yield select(({ lawcases }) => lawcases.currentItem.id)
	      let url = ''
	      let newLawcase = {...payload.currentItem}
	      let params = {
	      	tCaseId: newLawcase.caseId,
	      	dicCaseStatus: newLawcase.caseStatusValue
	      }

	      if(payload.updateType === 'qianshou'){
	      	url = api.signCaseUrl
	      	params.dicSignType = '1'
	      }else if(payload.updateType === 'tuidan'){
	      	url = api.chargeBackCaseUrl
	      }

	      const data = yield call(postDataService, {url: url, method: 'post'}, {...params, serviceId: 'srvid_getSignCase'})

	      if (data.success) {
	      	if(data.code === '40010'){
	      		message.error('此案件已签收，不能重复签收');
	      	}else if(data.code === '40011'){
	      		message.error('此案件已被他人签收！');
	      	}
	        yield put({type: 'changePageWithCriterial', payload: {updateType: payload.updateType}})
	        yield put({type: 'changePageOnly', payload: {updateType: payload.updateType}})
	      }else if(data.code === '9999'){
	        //do nothing, it will not update the state and will not re-render the page.
	      } else {
	        throw data
	      }
	},
	*getAllarea ({ payload }, { select, call, put }) {
      const data = yield call(getDataService, {url: api.getSysAreas}, {tCaseId:payload, serviceId: 'srvid_getSysAreas'})
      if (data.success) {
      	yield put({ type: 'setSysAreas',payload:data })
      }else if(data.code === '9999'){
        //do nothing, it will not update the state and will not re-render the page.
      } else {
        throw data
      }
    },
    *delete ({ payload }, { select, call, put }) {
      const data = yield call(getDataService, {url: api.deleteCase}, {tCaseId:payload, serviceId: 'srvid_deleteCase'})
      if (data.success) {
      	yield put({ type: 'getCaseList' })
      }else if(data.code === '9999'){
        //do nothing, it will not update the state and will not re-render the page.
      } else {
        throw data
      }
    },
	},
	
	subscriptions: {//订阅数据源，成功之后通过dispatch发送action，进行后续操作
		setup ({ dispatch, history }) {
	    dispatch({type: 'getAllConfig'})
        history.listen(location => {
          if (location.pathname === '/lawcases') {
						dispatch({type: 'getAllCity'})
	          let listType = location.query.type || '1'
            const searchInfo = localStorage.getItem(`searchInfo${window.location.pathname}`) && JSON.parse(localStorage.getItem(`searchInfo${window.location.pathname}`))
            if (location.action === 'POP' && searchInfo) {
              dispatch({ type: 'initPage', payload: searchInfo })
              dispatch({
                type: 'changePageWithCriterial',
                payload: { ...location.query, 'listType': listType, searchInfo },
              })
            } else {
              localStorage.removeItem(`searchInfo${window.location.pathname}`)
              dispatch({ type: 'initPage' })
              dispatch({
                type: 'changePageWithCriterial',
                payload: { ...location.query, 'listType': listType },
              })
            }
	          if(listType !== '10'){
	          	dispatch({
		            type: 'changePageOnly',
		            payload: {...location.query, 'listType': listType},
		        })
	          }
	        }else{
	        }
        })
    	}
		}
	}