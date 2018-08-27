import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader } from 'antd'

const FormItem = Form.Item

const modal = ({
  ...modalProps,
  onOk
}) => {
  /*const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        // key: item.key,
      }
      // data.address = data.address.join(' ')
      onOk(data)
    })
  }*/

  const { updateReason, selectedId } = modalProps
  const modalOpts = { ...modalProps, onOk }

  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  }

  return (
    <Modal
    {...modalOpts}
    title="被更换原因"
    >
      <p>{updateReason[selectedId].reason}</p>
    </Modal>
  )
}

/*modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}*/

export default Form.create()(modal)
