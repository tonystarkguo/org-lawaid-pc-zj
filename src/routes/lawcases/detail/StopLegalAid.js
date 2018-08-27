import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'
import moment from 'moment'
import {Form, Button, Row, Col, Select, Input} from 'antd'
import { createDicNodes, constants } from '../../../utils'

const { createRadioButton, createSelectOption, createRadio, createCheckbox } = createDicNodes
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
  },
};

const StopLegalAid = ({ 
	lawcaseDetail,
  stopAid,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
  }}) => {

  const { tabLoading, allConfig } = lawcaseDetail
	const { areaData = {}, dictData = {} } = allConfig

  const handleStop = (e) => {
    validateFields((errors) => {
      if (errors) { 
        return
      }
      console.log(getFieldsValue())
      stopAid(getFieldsValue())
    })
  }

  return (
    <Form layout="horizontal">

      <Row>
        <Col className="gutter-row" span={18}>
          <FormItem label="终止法援原因" {...formItemLayout}>
            {getFieldDecorator('dicTerminationReason')(
              <Select allowClear size="large">
                {createSelectOption({list:dictData.dic_dic_termination_reason})}
              </Select>
            )}
          </FormItem>
        </Col>

        <Col className="gutter-row" span={4} offset={1}>
          <Button type="primary" onClick={handleStop}>确定终止法援</Button>
        </Col>
      </Row>
      <Row>
      		<Col span={18}>
      		<FormItem label="原因备注：" {...formItemLayout}>
          {getFieldDecorator('endCaseRemarks',{
            rules: [{
                        max: 500,
                        message: '最多输入500个字!',
                      }]
          })(<Input rows={6} size="large" type="textarea" />)}
        </FormItem>
          </Col>
      </Row>

    </Form>
	)
}

StopLegalAid.propTypes = {
  lawcaseDetail: PropTypes.object,
  loading: PropTypes.bool,
  form: PropTypes.object.isRequired
}

export default Form.create()(StopLegalAid)
