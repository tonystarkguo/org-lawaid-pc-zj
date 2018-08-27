import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Switch } from 'antd'
import styles from './Layout.less'
import { config } from '../../utils'
import Menus from './Menu'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'

const Sider = ({ siderFold, darkTheme, location, changeTheme, navOpenKeys, changeOpenKeys, menu, dispatch }) => {
  const menusProps = {
    menu,
    siderFold,
    darkTheme,
    location,
    navOpenKeys,
    changeOpenKeys,
  }
  const handleGoHome = () => {
    dispatch(routerRedux.push('/home'))
  }
  return (
    <div>
      <div className={styles.logo} onClick={handleGoHome}>
        <img alt={'logo'} src={config.logo} />
      </div>
      <div className={styles.logo} onClick={handleGoHome}>
        {siderFold ? '' : <span>{config.name}</span>}
      </div>
      <Menus {...menusProps} />
      {!siderFold ? <div className={styles.switchtheme}>
        <span><Icon type="bulb" />切换主题</span>
        <Switch onChange={changeTheme} defaultChecked={darkTheme} checkedChildren="银灰" unCheckedChildren="淡白" />
      </div> : ''}
    </div>
  )
}

Sider.propTypes = {
  menu: PropTypes.array,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  location: PropTypes.object,
  changeTheme: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
  dispatch: PropTypes.func,
}

export default connect(({ sider }) => ({ sider }))(Sider)
