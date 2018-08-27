import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal } from 'antd'

const model = ({
  onOk,
  ...modalProps
}) => {

  const { aiderNum, requestObj } = modalProps

  const handleOk = () => {
    onOk(requestObj)
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  // 根据您以上确认的筛选条件，符合条件的法律援助人员共计${res.data.aiderNum}名，请确认是否继续发布？

  return (
    <Modal {...modalOpts} title="提示">
      <div>根据您以上确认的筛选条件，符合条件的法律援助人员共计{aiderNum}名，请确认是否继续发布？</div>
    </Modal>
  )
}

model.propTypes = {
  onOk: PropTypes.func,
}

export default Form.create()(model)
