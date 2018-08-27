import { postDataService, getDataService } from '../../../services/commonService.js'
import { parse } from 'qs'
import { config } from '../../../utils'
const { api } = config
export default {
	namespace: 'menu',// model对应的命名空间，其他比如router容器组件中获取state的时需要带上命名空间
	state: {//model中的状态数据，是不变的，immutable data. 每次都是全新的数据, 这里的数据将会以connect的方式传送到容器组件
		
	},
	reducers: {
		showModal (state, action){
			return {...state, ...action.payload, modalVisible: true}
		}
	},
	effects: {
	},
	subscriptions: {//订阅数据源，成功之后通过dispatch发送action，进行后续操作
		setup ({ dispatch, history }) {
			history.listen(location => {

	      })
		}
	}
}