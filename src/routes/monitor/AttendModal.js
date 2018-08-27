import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Modal, DatePicker, Input, Form } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input

const AttendModal = ({
  dispatch,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  visible,
}) => {
  const formItemLayout = {

  }
  const props = {
    visible,
    title: '庭审旁听',
    onOk: () => {
      validateFields((error) => {
        if (error) {
          return
        }
        dispatch({
          type: 'monitor/sendAttend',
          payload: getFieldsValue(),
        })
      })
    },
    onCancel: () => {
      dispatch({
        type: 'monitor/hideAttendModal',
      })
    },
  }
  return (
    <Modal {...props}>
      <Form layout="horizontal">
        <FormItem label="旁听日期：" {...formItemLayout}>
          {getFieldDecorator('remarkDate', {
            rules: [{ required: true, message: '请选择旁听日期' }],
          })(<DatePicker placeholder="请选择旁听日期" />)}
        </FormItem>
        <FormItem label="旁听记录：" {...formItemLayout}>
          {getFieldDecorator('remark', {
            rules: [{ required: true, message: '请输入旁听记录' }],
          })(<TextArea placeholder="请输入旁听记录" autosize={{ minRows: 4, maxRows: 6 }} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default connect(({ attendModal }) => ({ attendModal }))(Form.create()(AttendModal))
