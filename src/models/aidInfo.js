//model中定义state，action和reducer，具体可查看https://github.com/dvajs/dva/blob/master/docs/Concepts_zh-CN.md
import { postDataService, getDataService } from '../services/commonService'
import { config } from '../utils'
import { parse } from 'qs'

const { api } = config

export default {
	namespace: 'aidInfo',// model对应的命名空间，其他比如router容器组件中获取state的时需要带上命名空间
	state: {//model中的状态数据，是不变的，immutable data. 每次都是全新的数据, 这里的数据将会以connect的方式传送到容器组件
		list: [],//aidInfo list, from database
		listType: '1',//案件列表的类型，用于显示不同的表格头部，1. 在线检查
		currentItem: {},//在表格中当前操作的是哪一行，创建，更新，删除的时候需要用到
		modalVisible: false,//弹出框的显示与隐藏控制flag
		isMotion: localStorage.getItem('antAdminUserIsMotion') === true,//用户根据习惯调整表格的显示方式
		role: 'manager', 
		caseStatus: '1',
		pagination:{//表格援助事项列表的分页信息
			showSizeChanger: true,
			showQuickJumber: true,
			showTotal: total => `共${total} 条`,
			current: 1,
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
    switchIsMotion (state) {
      localStorage.setItem('antdAdminUserIsMotion', !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },
	},
	effects: {//异步操作，使用redux-sagas做异步流程控制，采用的generator 同步写法
		*query ({payload}, {call, put}){
			payload = parse(location.search.substr(1))
			payload.pageNum = payload.pageNum && Number(payload.pageNum) || 1
			payload.pageSize = payload.pageSize && Number(payload.pageSize) || 10

			const data = yield call(getDataService, { url:api.aidInfoList }, {...payload, serviceId: 'srvid_orgList' })
			let list = data.data.list
			let hpIdentitysString
			list.map((val, i) => {
				if(val.hpIdentitys.length){
					val.hpIdentitys.map((val, i) => {
						hpIdentitysString = val.dicHpIdentityName
					})
				}else{
					hpIdentitysString = null
				}
				list[i].hpIdentitysString = hpIdentitysString
			})
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
		}
	},
	subscriptions: {
		setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/aidInfo') {
          dispatch({ type: 'query' })
        }
      })
    }
	}
}