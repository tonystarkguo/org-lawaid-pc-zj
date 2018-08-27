import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Modal, Row, Col } from 'antd'
import styles from './index.less'

const MenuModal = ({
  menuModalInfo,
  dispatch,
}) => {
  const { menuList, visible, title } = menuModalInfo
  const props = {
    visible,
    title: '',
    footer: null,
    onCancel: () => {
      dispatch({
        type: 'login/hideMenuModal',
      })
    },
  }
  const handleClickMenuItem = (item) => {
    if (item.url) {
      window.open(item.url)
    } else if (item.qrCodeSrc) {
      dispatch({
        type: 'login/handleClickMenuItemShowQrCode',
        payload: item,
      })
    } else {
      dispatch({
        type: 'login/handleClickMenuItem',
        payload: item,
      })
    }
  }
  const itemChild = menuList.map((item, index) => {
    return (
      <li onClick={() => handleClickMenuItem(item)} key={index}>
        <img src={item.logoSrc} alt="" />
        <p>{item.name}</p>
      </li>
    )
  })
  return (
    <Modal {...props} className={styles.menuModal}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.menuList}>
        <ul>
          {itemChild}
        </ul>
      </div>
    </Modal>
  )
}

export default connect(({ menuModal }) => ({ menuModal }))(MenuModal)
