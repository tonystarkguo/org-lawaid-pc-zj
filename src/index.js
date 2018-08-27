// import './index.html'
import 'babel-polyfill'
import dva from 'dva'
import createLoading from 'dva-loading'
import { browserHistory } from 'dva/router'
import { message } from 'antd'
// start刷新的时候清除获取后台接口的serviceid，避免不发起请求到后台
const ls = localStorage
for (let v in ls) {
  if (v.indexOf('srvid_') > -1) {
    localStorage.removeItem(v)
  }
}
// end
// 1. Initialize
const app = dva({
  ...createLoading({
    effects: true,
  }),
  history: browserHistory,
  onError (error) {
    // message.error(error.message)//全局的错误提示
    // console.error(error.message)
  },
})

// 2. Model
app.model(require('./models/app')) // 整个app model注册

app.model(require('./models/login.js')) // 注册登录 model

// 3. Router
app.router(require('./router')) // 注册整个app中用的的路由，一个路由对应一个model

// 4. Start 启动应用
app.start('#root')
