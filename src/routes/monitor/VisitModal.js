import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Modal, DatePicker, Input, Form } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input
const VisitModal = ({
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
    title: '受援人回访',
    onOk: () => {
      validateFields((error) => {
        if (error) {
          return
        }
        dispatch({
          type: 'monitor/sendVisit',
          payload: getFieldsValue(),
        })
      })
    },
    onCancel: () => {
      dispatch({
        type: 'monitor/hideVisitModal',
      })
    },
  }
  return (
    <Modal {...props}>
      <Form layout="horizontal">
        <FormItem label="回访日期：" {...formItemLayout}>
          {getFieldDecorator('remarkDate', {
            rules: [{ required: true, message: '请选择回访日期' }],
          })(<DatePicker placeholder="请选择回访日期" />)}
        </FormItem>
        <FormItem label="回访记录：" {...formItemLayout}>
          {getFieldDecorator('remark', {
            rules: [{ required: true, message: '请输入回访记录' }],
          })(<TextArea placeholder="请输入回访记录" autosize={{ minRows: 4, maxRows: 6 }} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default connect(({ visitModal }) => ({ visitModal }))(Form.create()(VisitModal))
