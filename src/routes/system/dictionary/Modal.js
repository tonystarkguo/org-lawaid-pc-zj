import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
}

const modal = ({
  item = {},
  onOk,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      const data = {
        ...values
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
    maskClosable: true
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="键值:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('value', {
            initialValue: item.value,
            rules: [
              {
                required: true,
                message: '请输入键值！'
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="标签:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('labelName', {
            initialValue: item.labelName,
            rules: [
              {
                required: true,
                message: '请输入标签！'
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="类型:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('type', {
            initialValue: item.type,
            rules: [
              {
                required: true,
                message: '请输入类型！'
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="描述:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('remark', {
            initialValue: item.remark,
            rules: [
              {
                required: true,
                message: '请输入描述！'
              },
            ],
          })(<Input />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
