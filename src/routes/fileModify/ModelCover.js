import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Modal, Button } from 'antd'
import Upload from '../common/Uploader'
const ModalCover = ({
  coverUrl,
  visible,
  dispatch,
}) => {
  const handleChangeCover = ({ file }) => {
    dispatch({
      type: 'fileModify/changeCover',
      payload: file,
    })
  }
  const props = {
    visible,
    title: '查看',
    footer: null,
    width: '600px',
    style: { top: 0 },
    onCancel: () => {
      dispatch({
        type: 'fileModify/hideModalCover',
      })
    },
  }
  return (
    <Modal {...props}>
      <img src={coverUrl} alt="图片" style={{ width: '100%' }} />
      <div style={{ textAlign: 'center', paddingTop: '10px' }}>
        <Upload handleFileChange={handleChangeCover} text="更改封面" showUploadList={false} />
      </div>
    </Modal>
  )
}

export default connect(({ modalCover }) => ({ modalCover }))(ModalCover)
