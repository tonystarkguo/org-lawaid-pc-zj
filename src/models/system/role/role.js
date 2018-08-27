//model中定义state，action和reducer，具体可查看https://github.com/dvajs/dva/blob/master/docs/Concepts_zh-CN.md
import { postDataService, getDataService } from '../../../services/commonService'
import { config } from '../../../utils'
import { parse } from 'qs'

const { api } = config

export default {
	namespace: 'role',// model对应的命名空间，其他比如router容器组件中获取state的时需要带上命名空间
	state: {//model中的状态数据，是不变的，immutable data. 每次都是全新的数据, 这里的数据将会以connect的方式传送到容器组件
		list: [],
		currentItem: {},//在表格中当前操作的是哪一行，创建，更新，删除的时候需要用到
		currentPermissions: [],
		modalVisible: false,//弹出框的显示与隐藏控制flag
		optTree: [],
		modalType: 'create',
		isMotion: localStorage.getItem('antAdminUserIsMotion') === true,//用户根据习惯调整表格的显示方式
		pagination:{//分页信息
			showSizeChanger: true,
			showQuickJumber: true,
			showTotal: total => `共${total} 条`,
			current: 1,
			total: null
		}
	},
	reducers: {
		querySuccess (state, action){
			const {list, pagination} = action.payload
			return {
				...state,
				list,
				pagination: {
					...state.pagination,
					...pagination
				}
			}
		},
		showModal (state, action){
			return {...state, ...action.payload, modalVisible: true}
		},
		showEditModal (state, action) {
			const {currentItem, modalType, currentPermissions} = action
			//currentPermissions 去除非叶节点 to do。。。。
			return { ...state, currentItem, modalType, currentPermissions, modalVisible: true}
		},
		onAssignTaskModal (state, action){
			return {...state, ...action.payload, modalVisible: true}
		},
		hideModal (state, action){
			return {...state, currentPermissions: [], modalVisible: false}
		},
    switchIsMotion (state) {
      localStorage.setItem('antdAdminUserIsMotion', !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },
    updateCurrentItem (state, action){
    	return {...state, currentItem: action.payload}
    },
    setOptTree(state, action) {
    	return {...state, optTree: action.optTree}
    },
    onCheck(state, action) {
    	return {...state, currentPermissions: action.data}
    }
	},
	effects: {
		*query ({payload}, {call, put}){
			payload = parse(location.search.substr(1))
			const data = yield call(getDataService, { url:api.getRoleList }, {...payload, serviceId: 'srvid_getOrdList'})
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
						payload: {
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
		*getOptTree({ payload }, { call, put }) {
			const data = yield call(getDataService, { url:api.getOptTree }, { serviceId: 'getOptTree'})
			if(data.success) {
				yield put({
					type: 'setOptTree',
					optTree: data.data
				})
			}else {
				throw data
			}
		},

    *delete ({ payload }, { call, put }) {
      const data = yield call(postDataService, { url:api.deleteRole }, {serviceId: 'deleteRole', id: payload})
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    *onEditItem ({ payload }, { call, put }) {
    	const { currentItem, modalType} = payload
			const data = yield call(getDataService, { url:api.getOptById }, {serviceId: 'getOptById', roleId: currentItem.id})
			if(true) {
				yield put({ 
					type: 'showEditModal',
					modalType,
					currentItem,
					currentPermissions: data.data
				})
			}
    },
    *onOk ({ payload }, { select, call, put }) {
			const modalType = yield select(({role}) => role.modalType)
			let data = {}
			if(modalType === 'create') {
				data = yield call(postDataService, { url:api.addRole }, {serviceId: 'addRole', ...payload})
			}else {
				data = yield call(postDataService, { url:api.modifyRole }, {serviceId: 'modifyRole', ...payload})
			}
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    }
	},
	subscriptions: {//订阅数据源，成功之后通过dispatch发送action，进行后续操作
		setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/system/role') {
          dispatch({ type: 'query' })
          dispatch({ type: 'getOptTree'})
        }
      })
    }
	}
}