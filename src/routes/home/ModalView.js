import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Modal, Row, Col, Button } from 'antd'
import styles from './index.less'
import { config } from '../../utils'
const { api } = config
const ModalView = ({
  modalViewInfo,
  fileModal,
  dispatch,
}) => {
  
  const { content = {} } = modalViewInfo
  const files = content.fileStorageCtoList && content.fileStorageCtoList.map((d,index) => <div style={{marginBottom: 10}} key={index}><a style={{margin: 10}} target="_blank" key={index} href={d.addr}>{d.name}</a><a href={`${api.baseURL}${api.downloadFiles}?objectKey=${d.objectKey}&fileName=${d.name}`} style={{marginBottom: 20}}><Button className={styles.tablebtns} type="primary">下载</Button></a></div>)
  const props = {
    ...modalViewInfo,
    ...fileModal,
    title: '',
    footer: null,
    onOk: () => {
      dispatch({
        type: 'home/hideModalView',
      })
    },
    onCancel: () => {
      dispatch({
        type: 'home/hideModalView',
      })
    },
  }
  return (
    <Modal {...props} className={styles.view}>
      <h3>{content.title}</h3>
      <p>{content.content}</p>
      附件: {files}
    </Modal>
  )
}

export default connect(({ modalView }) => ({ modalView }))(ModalView)
