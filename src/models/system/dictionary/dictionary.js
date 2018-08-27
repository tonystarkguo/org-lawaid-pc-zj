//model中定义state，action和reducer，具体可查看https://github.com/dvajs/dva/blob/master/docs/Concepts_zh-CN.md
import { create, remove, update, updateLawcase } from '../../../services/dictionary'
import { postDataService, getDataService } from '../../../services/commonService.js'
import { parse } from 'qs'
import { config } from '../../../utils'
const { api } = config
export default {
	namespace: 'dictionary',// model对应的命名空间，其他比如router容器组件中获取state的时需要带上命名空间
	state: {//model中的状态数据，是不变的，immutable data. 每次都是全新的数据, 这里的数据将会以connect的方式传送到容器组件
		list: [],//recipientInfo list, from database
		listType: '1',//案件列表的类型，用于显示不同的表格头部，1. 在线检查
		currentItem: {},//在表格中当前操作的是哪一行，创建，更新，删除的时候需要用到
		modalVisible: false,//弹出框的显示与隐藏控制flag
		caseStatus: '1',
		pagination:{//表格援助事项列表的分页信息
			showSizeChanger: true,
			showQuickJumber: true,
			showTotal: total => `共${total} 条`,
			pageNum: 1,
			pageSize: 10,
			total: null
		}
	},
	reducers: {//同步操作，通过model当前的state和传入的action产生新的state
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
		onAssignTaskModal (state, action){
			return {...state, ...action.payload, modalVisible: true}
		},
		hideModal (state, action){
			return {...state, modalVisible: false}
		},
		updateCurrentItem (state, action){
			return {...state, currentItem: action.payload}
		}
	},
	effects: {//异步操作，使用redux-sagas做异步流程控制，采用的generator 同步写法
		*query ({payload}, {select, call, put}){
			const dictionary = yield select(({ dictionary }) => dictionary) 
			let params
			if(payload) {
				params = {
					pageNum: payload.pageNum,
					pageSize: payload.pageSize
				}
			}else {
				params = {
					pageNum: dictionary.pagination.pageNum,
					pageSize: dictionary.pagination.pageSize
				}				
			}
			const response = yield call(getDataService, {url: api.getDictionaryList}, {...params, serviceId: 'srvid_getDictionaryList'})
			if(response){
				yield put(
				{
					type: 'querySuccess',
					payload: {
						list: response.data.list,
						pagination: {
							total: response.data.total,
							...params
						}
					}
				}
				)
			}
		},

		*delete ({ payload }, { call, put }) {
			const params = {
				dictIds: [payload]
			}
			const data = yield call(postDataService, {url:`${api.deleteDictionary}?dictIds=${payload}`}, {})
			if (data.success) {
				yield put({ type: 'query' })
			} else {
				throw data
			}
		},

		*create ({ payload }, { call, put }) {
			const data = yield call(postDataService, {url:api.addDictionary}, {...payload, serviceId: 'srvid_addDictionary'})
			if (data.success) {
				yield put({ type: 'hideModal' })
				yield put({ type: 'query' })
			} else {
				throw data
			}
		},

		*update ({ payload }, { select, call, put }) {
			const id = yield select(({ dictionary }) => dictionary.currentItem.id)
			const newUser = { ...payload, id }
			const data = yield call(postDataService, {url:api.updataDictionary}, {...newUser, serviceId: 'srvid_updataDictionary'} )
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
				if (location.pathname === '/system/dictionary') {
	          // let listType = location.type || '1'
	          dispatch({
	          	type: 'query'
	          })
	        }
	        /*else{
	        	dispatch({ type: 'query' })
	        }*/
	      })
		}
	}
}