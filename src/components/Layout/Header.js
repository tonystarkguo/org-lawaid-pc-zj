import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Popover, Input } from 'antd'
import styles from './Header.less'
import Menus from './Menu'
import classnames from 'classnames'

const SubMenu = Menu.SubMenu

const Header = ({ user, logout, toPersonMsg, switchSider, siderFold, isNavbar, menuPopoverVisible, 
  location, switchMenuPopover, navOpenKeys, changeOpenKeys, menu, doGlobleSearch, showModal }) => {

  const dynamicKey = JSON.parse(localStorage.getItem('dynamicKey'))

  let editVisible = false
  let roles = user.roles || []
  roles.map(item => {
    if(item.id === 35){
      editVisible = true
    }else if(item.id === 36){
      editVisible = false
    }
  })

  const handleClickMenu = (e) => {
    if(e.key === 'logout'){//点击退出事件
      logout()
    }else if(e.key === 'personalMsg'){
      toPersonMsg()
    }
  }

  const onShow = (e) => {
    showModal()
  }

  let doSearch = e => doGlobleSearch(e.target.value) //头部的搜索按钮,调到手援事项查询页面，并且将关键字带过去做一次搜索
  
  const menusProps = {
    menu,
    siderFold: false,
    darkTheme: false,
    isNavbar,
    handleClickNavMenu: switchMenuPopover,
    location,
    navOpenKeys,
    changeOpenKeys,
  }

  const searchInputClass = classnames('keyinput', 'ant-row-flex-middle', 'search-input-wrapper')

  /*<div className={searchInputClass}>
    <Input prefix={<Icon type="search" />} className={styles.searchinput} onPressEnter={doSearch} placeholder="受理号/身份证号" />
  </div>*/

  return (
    <div className={styles.header}>
      {isNavbar ? 
        <Popover placement="bottomLeft" onVisibleChange={switchMenuPopover} visible={menuPopoverVisible} overlayClassName={styles.popovermenu} trigger="click" content={<Menus {...menusProps} />}>
          <div className={styles.button}>
            <Icon type="bars" />
          </div>
        </Popover>
        : 
        <div className={styles.leftWarpper}>
          <div className={styles.button} onClick={switchSider}>
            <Icon type={siderFold ? 'menu-unfold' : 'menu-fold'} />
          </div>
        </div>
      }
      
      <div className={styles.rightWarpper}>
        <div className={styles.dynamicKey}> 
          {user.isMgr ? <Icon type="edit" className={styles.editBtn} onClick={onShow} /> : ''}
          
          动态口令：{dynamicKey}
        </div>

        <Menu mode="horizontal" onClick={handleClickMenu}>
          <SubMenu style={{ float: 'right'}} title={< span > <Icon type="user" />{user.name} < /span>}>
            <Menu.Item key="personalMsg">个人资料</Menu.Item>
            <Menu.Item key="logout">退出</Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    </div>
  )
}

Header.propTypes = {
  menu: PropTypes.array,
  user: PropTypes.object,
  logout: PropTypes.func,
  showModal: PropTypes.func,
  switchSider: PropTypes.func,
  siderFold: PropTypes.bool,
  isNavbar: PropTypes.bool,
  menuPopoverVisible: PropTypes.bool,
  location: PropTypes.object,
  switchMenuPopover: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Header
