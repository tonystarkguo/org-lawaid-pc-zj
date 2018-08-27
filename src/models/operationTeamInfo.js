//model中定义state，action和reducer，具体可查看https://github.com/dvajs/dva/blob/master/docs/Concepts_zh-CN.md
// import { create, remove, update, updateLawcase } from '../services/operationTeamInfo'
import { getDataService, postDataService } from '../services/commonService'
import { config } from '../utils'
import { parse } from 'qs'

const { api } = config

export default {
	namespace: 'operationTeamInfo',// model对应的命名空间，其他比如router容器组件中获取state的时需要带上命名空间
	state: {//model中的状态数据，是不变的，immutable data. 每次都是全新的数据, 这里的数据将会以connect的方式传送到容器组件
		list: [],//operationTeamInfo list, from database
		listType: '1',//案件列表的类型，用于显示不同的表格头部，1. 在线检查
		currentItem: {},//在表格中当前操作的是哪一行，创建，更新，删除的时候需要用到
		modalVisible: false,//弹出框的显示与隐藏控制flag
		isMotion: localStorage.getItem('antAdminUserIsMotion') === true,//用户根据习惯调整表格的显示方式
		caseStatus: '1',
		pagination:{//表格援助事项列表的分页信息
			showSizeChanger: true,
			showQuickJumber: true,
			showTotal: total => `共${total} 条`,
			current: 1,
			total: null
		},
		allRole: []
	},
	reducers: {//同步操作，通过model当前的state和传入的action产生新的state
		querySuccess (state, action){
			const {list, pagination, listType} = action.payload
			return {
				...state,
				list,
				listType,
				pagination: {
					...state.pagination,
					...pagination
				}
			}
		},
		showModal (state, action){
			return {...state, ...action.payload, modalVisible: true}
		},
		onAssignTaskModal (state, action){
			return {...state, ...action.payload, modalVisible: true}
		},
		hideModal (state, action){
			return {...state, modalVisible: false}
		},
    switchIsMotion (state) {
      localStorage.setItem('antdAdminUserIsMotion', !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },
    updateCurrentItem (state, action){
    	return {...state, currentItem: action.payload}
    },
    updateAllrole (state, action){
    	return {...state, allRole: action.payload}
    },
	},
	effects: {//异步操作，使用redux-sagas做异步流程控制，采用的generator 同步写法
		*query ({payload}, {call, put}){
			payload = parse(location.search.substr(1))//这是要干什么呢？
			payload.pageNum = payload.pageNum && Number(payload.pageNum) || 1
			payload.pageSize = payload.pageSize && Number(payload.pageSize) || 10
			payload.isDeleted = payload.isDeleted == null ? false : payload.isDeleted
			const data = yield call(getDataService, { url:api.operationList }, {...payload, serviceId: 'srvid_operationList'})
			if(data){
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
						listType: payload.listType,
						payload: {
							// list: data.data.list,
							list: resData,
							pagination: {
								current: Number(payload.pageNum) || 1,
								pageSize: Number(payload.pageSize) || 10,
								total: data.data.total
							}
						}
					}
				)
			}
		},

		*getAllrole ({ payload }, { call, put }) {
      const data = yield call(getDataService, { url:api.getAllrole, serviceId: 'srvid_getAllrole' })
      if (data.success) {
        yield put({type: 'updateAllrole', payload:data.data})
      } else {
        throw data
      }
    },
    *delete ({ payload }, { call, put }) {
      const data = yield call(postDataService, { url:api.operationDelete }, {id:payload,serviceId: 'srvid_operationDelete'})
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    *create ({ payload }, { call, put }) {
      const data = yield call(postDataService, { url:api.operationCreate } , {...payload, serviceId: 'srvid_operationCreate'})
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    *update ({ payload }, { select, call, put }) {
      const tId = yield select(({ operationTeamInfo }) => operationTeamInfo.currentItem.id)
      const tGlobalId = yield select(({ operationTeamInfo }) => operationTeamInfo.currentItem.tGlobalId)
      const newOperationTeamInfo = { ...payload, id:tId , tGlobalId }
      const data = yield call(postDataService, { url:api.operationUpdate }, {...newOperationTeamInfo, serviceId: 'srvid_operationUpdate'})
      if (data.success) {
      	const userObj = JSON.parse(localStorage.getItem('user'))
      	let roles = []
      	let newRole = {}
      	let newUserObj = {}
      	if(userObj.tGlobalId === tGlobalId){
      		if(newOperationTeamInfo.roleId === 1){
      			newRole = {
      				id: 1,
      				name: '工作人员',
      				remark: userObj.roles[0].remark
      			}
      			roles.push(newRole)
      			newUserObj = {
      				dicGlobalType: userObj.dicGlobalType,
      				hpIdentity: userObj.hpIdentity,
      				mobile: userObj.mobile,
      				name: userObj.name,
      				roles: roles,
      				rongCloudToken: userObj.rongCloudToken,
      				tGlobalId: userObj.tGlobalId,
      				token: userObj.token,
      				userId: userObj.userId
      			}
      			localStorage.setItem('user', JSON.stringify(newUserObj))
      		}else{
      			newRole = {
      				id: 3,
      				name: '管理员',
      				remark: userObj.roles[0].remark
      			}
      			roles.push(newRole)
      			newUserObj = {
      				dicGlobalType: userObj.dicGlobalType,
      				hpIdentity: userObj.hpIdentity,
      				mobile: userObj.mobile,
      				name: userObj.name,
      				roles: roles,
      				rongCloudToken: userObj.rongCloudToken,
      				tGlobalId: userObj.tGlobalId,
      				token: userObj.token,
      				userId: userObj.userId
      			}
      			localStorage.setItem('user', JSON.stringify(newUserObj))
      		}
      	}
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
	},
	subscriptions: {//订阅数据源，成功之后通过dispatch发送action，进行后续操作
		setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/operationTeamInfo') {
          let listType = location.type || '1'
          dispatch({type: 'query', payload: {...location.query}})
          dispatch({type: 'getAllrole'})
        }
      })
    }
	}
}