import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Modal, Select, Input, Form } from 'antd'
import { createDicNodes } from '../../utils'
const FormItem = Form.Item
const { createSelectOption } = createDicNodes
const VisitModal = ({
  dispatch,
  dictData,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  visible,
}) => {
  // const { dictData } = allConfig
  const formItemLayout = {

  }
  const props = {
    visible,
    title: '终止法律援助',
    onOk: () => {
      validateFields((error) => {
        if (error) {
          return
        }
        dispatch({
          type: 'monitor/sendStop',
          payload: getFieldsValue(),
        })
      })
    },
    onCancel: () => {
      dispatch({
        type: 'monitor/hideStopModal',
      })
    },
  }
  return (
    <Modal {...props}>
      <Form layout="horizontal">
        <FormItem label="终止法援原因：" {...formItemLayout}>
          {getFieldDecorator('dicTerminationReason', {
            rules: [{ required: true, message: '请选择终止法援原因' }],
          })(
            <Select allowClear size="large" placeholder="请选择终止法援原因">
              {createSelectOption({ list: dictData.dic_dic_termination_reason })}
            </Select>
            )}
        </FormItem>
        <FormItem label="原因备注：" {...formItemLayout}>
          {getFieldDecorator('endCaseRemarks',{
            rules: [{
                        max: 500,
                        message: '最多输入500个字!',
                      }]
          })(<Input rows={6} size="large" type="textarea" />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default connect(({ visitModal }) => ({ visitModal }))(Form.create()(VisitModal))
