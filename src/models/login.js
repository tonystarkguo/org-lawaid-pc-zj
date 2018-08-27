import { routerRedux } from 'dva/router'
import moment from 'moment'
import { message } from 'antd'
import { config } from '../utils'
import { postDataService, getDataService } from '../services/commonService'
const { api } = config

export default {
  namespace: 'login',
  state: {
    loginLoading: false,
    showLogin: false,
    loginType: false,
    getCodeBtnText: '获取验证码',
    getCodeBtnCount: 60,
    getCodeBtnDisable: false,
    getCodeBtnTextHp: '获取验证码',
    getCodeBtnCountHp: 60,
    getCodeBtnDisableHp: false,
    getCodeBtnStop: true,
    tabKey: '1',
    menuModalInfo: {
      visible: false,
      menuList: [],
      title: '',
    },
    qrCodeModalInfo: {
      visible: false,
      qrCodeSrc: '',
      title: '',
      width: 0,
    },
  },
  subscriptions: {// 订阅数据源，成功之后通过dispatch发送action，进行后续操作
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/login') {
          dispatch({ type: 'toHome' })
        }
      })
    },
  },
  // 登录是一个异步操作，所以写在effects中
  effects: {
    *login ({ payload }, { select, put, call }) {
      yield put({ type: 'showLoginLoading' })
      const { loginType } = yield select(({ login }) => login)
      if (!loginType) {
        payload.dicLoginAccountType = 3
      }
      const data = yield call(postDataService, { url: api.userLogin }, { ...payload, serviceId: 'srvid_login' }) // 此处payload中带的信息是登录表单中的userName，passworod，验证码
      yield put({ type: 'hideLoginLoading' })
      if (data.code === '1') {
        // token 保存在storage中以便其他的接口调用
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('loginMoment', moment().format('x'))
        // 将user对象存起来，刷新的时候不用再调用用户信息
        localStorage.setItem('user', JSON.stringify(data.data))
        localStorage.setItem('dynamicKey', JSON.stringify(data.data.dynamicKey))
        yield put({ type: 'app/init_main_page', payload: { user: data.data } }) // 跨model调用action
        yield put({ type: 'app/getAllConfig' }) // 跨model调用action
        yield put({ type: 'app/getCaseReason' })
      } else {
        localStorage.clear() // 清除缓存
        throw data
      }
    },
    *getCode ({ payload }, { select, put, call }) {
      let url = ''
      if (payload.type === 'rp') {
        url = api.captchaValue
      } else {
        url = api.captchaHp
      }
      const res = yield call(getDataService, { url }, { mobile: payload.mobile, serviceId: 'srvid_captchaValue' })
      if (res.success) {
        // yield put({
        //   type: 'setGetCodeBtnStop',
        // })
      } else {
        throw res
      }
    },
    *toHome ({ payload }, { select, put, call }) {
      const token = localStorage.getItem('token')
      const loginMoment = localStorage.getItem('loginMoment')
      const user = localStorage.getItem('user')
      const now = moment()
      const time = now - loginMoment < 12 * 60 * 60 * 1000
      if (token && time) {
        yield put({ type: 'app/init_main_page', payload: { user: JSON.parse(user) } })
        return
      }
      if (token && !time) {
        message.warning('登录信息已过期，请重新登录')
      }
    },
  },
  reducers: {
    setGetCodeBtnStop (state) {
      return { ...state, getCodeBtnStop: false }
    },
    setCodeBtn (state, action) {
      return { ...state, ...action.payload }
    },
    showLogin (state) {
      return { ...state, showLogin: true }
    },
    hideLogin (state) {
      return { ...state, showLogin: false, tabKey: '1' }
    },
    showLoginLoading (state) {
      return { ...state, loginLoading: true }
    },
    hideLoginLoading (state) {
      return { ...state, loginLoading: false }
    },
    changeToPhone (state) {
      return { ...state, loginType: false }
    },
    changeToAcc (state) {
      return { ...state, loginType: true }
    },
    setTabKey (state, action) {
      return { ...state, tabKey: action.payload }
    },
    showMenuMadal (state, action) {
      let menuList = []
      let title = ''
      if (action.payload === 1) {
        title = '综合管理'
        menuList = [
          { name: '窗口咨询', logoSrc: './consultation.png', type: '1' },
          { name: '案件审批', logoSrc: './caseApproval.png', type: '1' },
          { name: '案件归档', logoSrc: './caseFile.png', type: '1' },
          { name: '案件查询', logoSrc: './search.png', type: '1' },
          { name: '数据中心', logoSrc: './dataCenter.png', type: '1' },
        ]
      } else if (action.payload === 2) {
        title = '质量评价'
        menuList = [
          { name: '承办流程', logoSrc: './cblc.png', type: '1' },
          { name: '受援人满意度评价', logoSrc: './syrmydpj.png', type: '1' },
          { name: '办案机关意见征询', logoSrc: './bljgyjzx.png', type: '1' },
          { name: '同行评估', logoSrc: './thpg.png', type: '1' },
          { name: '旁听庭审', logoSrc: './ptts.png', type: '1' },
        ]
      } else {
        title = '便民服务'
        menuList = [
          { name: '在线申请', logoSrc: './zxsq.png', type: '1', url: 'http://12348.zjsft.gov.cn/public/transact/index.jsp' },
          { name: '在线咨询', logoSrc: './zxzx.png', type: '1', url: 'http://12348.zjsft.gov.cn/public/consult/index.jsp' },
          { name: '12348咨询', logoSrc: './12348.png', type: '1', url: 'http://12348.zjsft.gov.cn/public/consult/index.jsp' },
          { name: '视频咨询', logoSrc: './spzx.png', type: '1', url: 'http://12348.zjsft.gov.cn/public/consult/index.jsp' },
          { name: '法援地图', logoSrc: './fydt.png', type: '1', url: 'http://12348.zjsft.gov.cn/public/find/index.jsp' },
          { name: '法援宣传', logoSrc: './fyxc.png', type: '1', url: 'http://12348.zjsft.gov.cn/public/learn/index.jsp' },
          // { name: 'APP下载', logoSrc: './appxz.png', type: '1', qrCodeSrc: './appQrCode.png', width: 600 },
          { name: '微信公众号', logoSrc: './wxgzh.png', type: '1', qrCodeSrc: './weChatQrCode.png', width: 400 },
        ]
      }
      return { ...state, menuModalInfo: { ...state.menuModalInfo, visible: true, menuList, title }, showLogin: false }
    },
    hideMenuModal (state) {
      return { ...state, menuModalInfo: { ...state.menuModalInfo, visible: false, menuList: [], title: '' } }
    },
    handleClickMenuItem (state, action) {
      return { ...state, menuModalInfo: { ...state.menuModalInfo, visible: false }, showLogin: true, tabKey: action.payload.type }
    },
    handleClickMenuItemShowQrCode (state, action) {
      const params = {
        visible: true,
        title: action.payload.name,
        qrCodeSrc: action.payload.qrCodeSrc,
        width: action.payload.width,
      }
      return { ...state, menuModalInfo: { ...state.menuModalInfo, visible: false }, qrCodeModalInfo: { ...state.qrCodeModalInfo, ...params } }
    },
    hideQrCodeModal (state) {
      const params = {
        visible: false,
        title: '',
        qrCodeSrc: '',
        width: 0,
      }
      return { ...state, qrCodeModalInfo: { ...state.qrCodeModalInfo, ...params } }
    },
  },
}
