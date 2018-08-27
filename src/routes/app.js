import React from 'react'
import PropTypes from 'prop-types'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import {Layout} from '../components'
import {classnames, config} from '../utils'
import {Helmet} from 'react-helmet'
import '../themes/index.less'
import './app.less'
import NProgress from 'nprogress'
import Login from './login/index.js'
const { prefix } = config

const { Header, Footer, Sider, styles, Modal } = Layout

const App = ({ children, location, dispatch, app, loading }) => {
  const {
    user,
    siderFold,
    darkTheme,
    isNavbar,
    isFileModify,
    menuPopoverVisible,
    modalVisible,
    navOpenKeys,
    menu,
  } = app
  NProgress.start()
  !loading.global && NProgress.done()

  const headerProps = {
    menu,
    user,
    siderFold,
    location,
    isNavbar,
    menuPopoverVisible,
    navOpenKeys,
    switchMenuPopover() {
      dispatch({type: 'app/switchMenuPopver'})
    },
    logout() {
      dispatch({type: 'app/logout'})
    },
    showModal() {
      dispatch({type: 'app/showModal'})
    },
    toPersonMsg() {
      dispatch({type: 'app/toPersonMsg'})
    },
    switchSider() {
      dispatch({type: 'app/switchSider'})
    },
    changeOpenKeys(openKeys) {
      dispatch({
        type: 'app/handleNavOpenKeys',
        payload: {
          navOpenKeys: openKeys
        }
      })
    },
    doGlobleSearch(keywords) {
      dispatch(routerRedux.push('/lawcases?type=20&acceptIDCardLike=' + keywords))
    }
  }

  const siderProps = {
    menu,
    siderFold,
    darkTheme,
    location,
    navOpenKeys,
    changeTheme() {
      dispatch({type: 'app/switchTheme'})
    },
    changeOpenKeys(openKeys) {
      localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys))
      dispatch({
        type: 'app/handleNavOpenKeys',
        payload: {
          navOpenKeys: openKeys
        }
      })
    }
  }

  const modalProps = {
    user,
    visible: modalVisible,
    maskClosable: false,
    title: '修改机构动态口令',
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
          type: 'app/modifyPwd',
          payload: data,
      })
    },
    onCancel() {
      dispatch({
          type: 'app/hideModal',
      })
    }
  }

  if (config.openPages && config.openPages.indexOf(location.pathname) > -1) {
    return <div>{children}</div>
  }

  const {iconFontJS, iconFontCSS } = config

  const isLogin = !!localStorage.getItem('token')
    ? true
    : false
  return (isLogin
    ? (
      <div>
        <Helmet>
          <title>浙江法律援助-机构端</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <link rel="icon" href={config.logoSrc} type="image/x-icon"/> {iconFontJS && <script src={iconFontJS}></script>}
          {iconFontCSS && <link rel="stylesheet" href={iconFontCSS}/>}
        </Helmet>
        <div
          className={classnames(styles.layout, {
          [styles.fold]: isNavbar || isFileModify
            ? false
            : siderFold
        }, {
          [styles.withnavbar]: isNavbar || isFileModify
        })}>
          {!isNavbar && !isFileModify
            ? <aside
                className={classnames(styles.sider, {
                [styles.light]: !darkTheme
              })}>
                <Sider {...siderProps} />
              </aside>
            : ''}
          <div id="main-container" className={styles.main}>
            {!isFileModify && <Header {...headerProps} />}
            <div className={!isFileModify ? styles.container : ''}>
              <div className={styles.content} id="scroll-area">
                {children}
              </div>
            </div>
            {!isFileModify && <Footer />}
          </div>

          {modalVisible && <Modal {...modalProps} />}
        </div>
      </div>
    )
    : <Login />)
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object
}

export default connect(({app, loading}) => ({app, loading}))(App) //容器组件绑定，将props交由redux管理