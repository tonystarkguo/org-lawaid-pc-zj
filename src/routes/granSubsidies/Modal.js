import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Radio, Modal, message, Row, Col, DatePicker, Select, Tooltip } from 'antd'
import styles from './List.less'
import { NumericInput } from '../../components'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  item = {},
  onOk,
  standardBack,
  subsidyFeeBack,
  interpretationFeeBack,
  otherFeeBack,
  lessFeeBack,
  onStandardChange,
  onSubsidyFeeChange,
  onInterpretationFeeChange,
  onOtherFeeChange,
  onLessFeeChange,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
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
        caseId: item.id
      }
      console.log(data)
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    width: 840,
    onOk: handleOk,
  }

  const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/

  // 补贴标准
  const standardChange = (value) => {
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      onStandardChange(value)
    }
  }

  // 异地补贴费
  const subsidyFeeChange = (value) => {
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      onSubsidyFeeChange(value)
    }
  }

  // 翻译费
  const interpretationFeeChange = (value) => {
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      onInterpretationFeeChange(value)
    }
  }

  // 其他费用
  const otherFeeChange = (value) => {
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      onOtherFeeChange(value)
    }
  }

  // 减发
  const lessFeeChange = (value) => {
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      onLessFeeChange(value)
    }
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <Row>

          <p className={styles.caseNum}>{item.caseNum}</p>

          <Col span={12}>
            <FormItem {...formItemLayout} label="受援人" >
              <p>{item.rpName}</p>
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem {...formItemLayout} label="受援人联系电话" >
              <p>{item.rpMobile}</p>
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem {...formItemLayout} label="援助人" >
              <p>{item.hpNames}</p>
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem {...formItemLayout} label="援助人联系电话" >
              <p>{item.hpMobs}</p>
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem {...formItemLayout} label="补贴标准" >
              {getFieldDecorator('standard', {
                initialValue: item.standard,
              })(
                <NumericInput onChange={standardChange} />
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem  {...formItemLayout} label="异地补贴费">
              {getFieldDecorator('subsidyFee', {
                initialValue: item.subsidyFee,
              })(
                <NumericInput onChange={subsidyFeeChange} />
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem  {...formItemLayout} label="翻译费">
              {getFieldDecorator('interpretationFee', {
                initialValue: item.interpretationFee,
              })(
                <NumericInput onChange={interpretationFeeChange} />
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem  {...formItemLayout} label="其他费用">
              {getFieldDecorator('otherFee', {
                initialValue: item.otherFee,
              })(
                <NumericInput onChange={otherFeeChange} />
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem  {...formItemLayout} label="减发">
              {getFieldDecorator('lessFee', {
                initialValue: item.lessFee,
              })(
                <NumericInput onChange={lessFeeChange} />
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem  {...formItemLayout} label="其他费用理由">
              {getFieldDecorator('otherFeeReason', {
                initialValue: item.otherFeeReason,
              })(<Input/>)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem  {...formItemLayout} label="减发理由">
              {getFieldDecorator('lessFeeReason', {
                initialValue: item.lessFeeReason,
              })(<Input/>)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem  {...formItemLayout} label="实际补贴金额">
              {getFieldDecorator('settlePrice', {
                initialValue: Number(standardBack) + Number(subsidyFeeBack) + Number(interpretationFeeBack) + Number(otherFeeBack) - Number(lessFeeBack),
              })(<Input/>)}
            </FormItem>
          </Col>
          
        </Row>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
