import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Checkbox } from 'antd'
import city from '../../utils/city'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['工作人员', '管理人员', '系统管理人员'];

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
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="姓名：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
                message: '请输入姓名！'
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="电话号码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('phone', {
            initialValue: item.phone,
            rules: [
              {
                required: true,
                pattern: /^1[34578]\d{9}$/,
                message: '这不是一个合法的电话号码！',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="角色：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('role', {
            initialValue: item.role,
            rules: [
              {
                required: true,
                message: '请选择角色！'
              },
            ],
          })(
            <CheckboxGroup options={plainOptions} />
          )}
        </FormItem>
        <FormItem label="系统用户名：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('systemUser', {
            initialValue: item.systemUser,
            rules: [
              {
                required: true,
                message: '请输入系统用户名！'
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="登录密码：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('password', {
            initialValue: item.password,
            rules: [
              {
                required: true,
                message: '请输入登录密码！'
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
