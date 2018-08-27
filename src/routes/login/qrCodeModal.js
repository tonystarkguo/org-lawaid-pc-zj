import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Modal, Row, Col } from 'antd'
import styles from './index.less'

const MenuModal = ({
  qrCodeModalInfo,
  dispatch,
}) => {
  const { qrCodeSrc, visible, title, width = 520 } = qrCodeModalInfo
  const props = {
    width,
    visible,
    title: '',
    footer: null,
    onCancel: () => {
      dispatch({
        type: 'login/hideQrCodeModal',
      })
    },
  }

  return (
    <Modal {...props} className={styles.menuModal}>
      {/* <h3 className={styles.title}>{title}</h3> */}
      <div>
        <img src={qrCodeSrc} alt="" style={{ width: '100%' }} />
      </div>
    </Modal>
  )
}

export default connect(({ menuModal }) => ({ menuModal }))(MenuModal)
