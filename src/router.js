import React from 'react'
import PropTypes from 'prop-types'
import { Router } from 'dva/router'
import App from './routes/app'
import Info from './routes/mobile/info/index'

const registerModel = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model)
  }
}

const Routers = function ({
  history,
  app,
}) {
  const routes = [{
    path: '/mobile',
    component: Info, // 程序的路口
    getIndexRoute (nextState, cb) { // 登录进来之后默认显示的路由（如果没有指定路由的话）
      require.ensure([], require => {
        registerModel(app, require('./models/mobile/info/info'))
        cb(null, {
          component: require('./routes/mobile/info/'),
        })
      }, 'mobile-info')
    },
    childRoutes: [{
      path: 'mobile/info',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/mobile/info/info'))
          cb(null, require('./routes/mobile/info/'))
        }, 'mobile-info')
      },
    }],
  }, {
    path: '/',
    component: App, // 程序的路口
    getIndexRoute (nextState, cb) { // 登录进来之后默认显示的路由（如果没有指定路由的话）
      require.ensure([], require => {
        registerModel(app, require('./models/home'))
        cb(null, {
          component: require('./routes/home/'),
        })
      }, 'home')
    },
    childRoutes: [{
      path: 'home',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/home'))
          cb(null, require('./routes/home/'))
        }, 'home')
      },
    }, {
      path: 'docLib',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/docLib'))
          cb(null, require('./routes/docLib/'))
        }, 'home')
      },
    }, {
      path: 'lawcases',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/lawcases'))
          cb(null, require('./routes/lawcases/'))
        }, 'lawcases')
      },
    }, {
      path: 'ordermanage', // 预约管理
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/ordermanage'))
          cb(null, require('./routes/ordermanage/'))
        }, 'ordermanage')
      },
    }, {
      path: 'neworder', // 新增预约
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/neworder'))
          cb(null, require('./routes/neworder/'))
        }, 'neworder')
      },
    }, {
      path: 'recipientInfo', // 受援人信息
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/recipientInfo'))
          cb(null, require('./routes/recipientInfo/'))
        }, 'recipientInfo')
      },
    }, {
      path: 'aidInfo', // 法律援助人信息
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/aidInfo'))
          cb(null, require('./routes/aidInfo/'))
        }, 'aidInfo')
      },
    }, {
      path: 'operationTeamInfo', // 运营人员信息
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/operationTeamInfo'))
          cb(null, require('./routes/operationTeamInfo/'))
        }, 'operationTeamInfo')
      },
    }, {
      path: 'orgManagement', // 机构管理
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/orgManagement'))
          cb(null, require('./routes/orgManagement/'))
        }, 'orgManagement')
      },
    }, {
      path: 'orgPersonManagement', // 机构人员管理
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/orgPersonManagement'))
          cb(null, require('./routes/orgPersonManagement/'))
        }, 'orgPersonManagement')
      },
    }, {
      path: 'aidPersonManagement', // 法律援助人员管理
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/aidPersonManagement'))
          cb(null, require('./routes/aidPersonManagement/'))
        }, 'aidPersonManagement')
      },
    }, {
      path: 'workUnitManagement', // 法律援助人员工作单位管理
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/workUnitManagement'))
          cb(null, require('./routes/workUnitManagement/'))
        }, 'workUnitManagement')
      },
    }, {
      path: 'personalMsg', // 个人资料
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/personalMsg'))
          cb(null, require('./routes/personalMsg/'))
        }, 'personalMsg')
      },
    }, {
      path: 'addAdvice/telephone12348', // 12348来电咨询
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/addAdvice/telephone12348'))
          cb(null, require('./routes/addAdvice/telephone12348/'))
        }, 'telephone12348')
      },
    }, {
      path: 'addAdvice/telephone', // 来电咨询登记
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/addAdvice/telephone'))
          cb(null, require('./routes/addAdvice/telephone/'))
        }, 'telephone')
      },
    }, {
      path: 'addAdvice/visit', // 来访咨询登记
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/addAdvice/visit'))
          cb(null, require('./routes/addAdvice/visit/'))
        }, 'visit')
      },
    }, {
      path: 'addAdvice/letter', // 来信咨询登记
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/addAdvice/letter'))
          cb(null, require('./routes/addAdvice/letter/'))
        }, 'letter')
      },
    }, {
      path: 'adviceQuery', // 咨询查询
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/adviceQuery'))
          cb(null, require('./routes/adviceQuery/'))
        }, 'adviceQuery')
      },
    }, {
      path: 'adviceSort', // 咨询分类
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/adviceQuery/sort'))
          cb(null, require('./routes/adviceQuery/sort/'))
        }, 'adviceSort')
      },
    }, {
      path: 'adviceDet/:id', // 咨询详情
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/adviceQuery/detail'))
          cb(null, require('./routes/adviceQuery/detail/'))
        }, 'adviceDet')
      },
    }, {
      path: 'adviceEdit/:id', // 咨询编辑
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/adviceQuery/edit'))
          cb(null, require('./routes/adviceQuery/edit/'))
        }, 'adviceEdit')
      },
    }, {
      path: 'adviceCase', // 咨询案件入库
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/adviceCase'))
          cb(null, require('./routes/adviceCase/'))
        }, 'adviceCase')
      },
    }, {
      path: 'address', // 地址指引
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/address'))
          cb(null, require('./routes/address/'))
        }, 'address')
      },
    }, {
      path: 'lawcase/:id',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/lawcase/detail'))
          cb(null, require('./routes/lawcases/detail/'))
        }, 'lawcase-detail')
      },
    }, {
      path: 'login',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/login'))
          cb(null, require('./routes/login/'))
        }, 'login')
      },
    }, {
      path: 'system/dictionary',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/system/dictionary/dictionary'))
          cb(null, require('./routes/system/dictionary/'))
        }, 'system-dictionary')
      },
    }, {
      path: 'system/menu',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/system/menu/menu'))
          cb(null, require('./routes/system/menu/'))
        }, 'system-menu')
      },
    }, {
      path: 'system/role',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/system/role/role'))
          cb(null, require('./routes/system/role/'))
        }, 'system-role')
      },
    }, {
      path: 'createLawcase', // 案件登记
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/lawcase/detail'))
          cb(null, require('./routes/lawcases/detail/createLawcase'))
        }, 'createLawcase')
      },
    }, {
      path: 'granSubsidies', // 案件补贴发放
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/granSubsidies'))
          cb(null, require('./routes/granSubsidies'))
        }, 'granSubsidies')
      },
    }, {
      path: 'searchEvaCasesDetail/:id', // pdf
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/searchEvaCasesDetail'))
          cb(null, require('./routes/searchEvaCasesDetail'))
        }, 'searchEvaCasesDetail')
      },
    }, {
      path: 'pictureView/:id', // pic
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/pictureView'))
          cb(null, require('./routes/pictureView'))
        }, 'pictureView')
      },
    }, {
      path: 'monitor', // 案件监控
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/monitor'))
          cb(null, require('./routes/monitor'))
        }, 'monitor')
      },
    }, {
      path: 'assignEvaCases', // 指派评估案件
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/assignEvaCases'))
          cb(null, require('./routes/assignEvaCases'))
        }, 'assignEvaCases')
      },
    }, {
      path: 'searchEvaCases', // 查询评估案件
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/searchEvaCases'))
          cb(null, require('./routes/searchEvaCases'))
        }, 'searchEvaCases')
      },
    }, {
      path: 'setEvaStandard', // 设置评估标准
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/setEvaStandard'))
          cb(null, require('./routes/setEvaStandard'))
        }, 'setEvaStandard')
      },
    }, {
      path: 'expLib', // 查询评估案件
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/expLib'))
          cb(null, require('./routes/expLib'))
        }, 'expLib')
      },
    }, {
      path: 'fileModify/:id', // 文档修改
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/fileModify'))
          cb(null, require('./routes/fileModify'))
        }, 'monitor')
      },
    }, {
      path: 'reportForm', // 定期报表
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/reportForm/index'))
          cb(null, require('./routes/reportForm/index'))
        }, 'reportForm')
      },
    }, {
      path: 'daily', // 统计日报
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/daily/index'))
          cb(null, require('./routes/daily/index'))
        }, 'daily')
      },
    }, {
      path: 'analysis', // 数据分析
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/analysis/index'))
          cb(null, require('./routes/analysis/index'))
        }, 'analysis')
      },
    }, {
      path: '*',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          cb(null, require('./routes/error/'))
        }, 'error')
      },
    }],
  }]

  return (
    <Router history={
      history
    }
      routes={
      routes
    }
    />
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
