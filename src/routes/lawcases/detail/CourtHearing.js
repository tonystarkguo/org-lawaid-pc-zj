import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'
import moment from 'moment'
import {Form, Input, Button, Row, Col, DatePicker} from 'antd'
import { dateUtil } from '../../../utils/'

const FormItem = Form.Item
const { TextArea } = Input
const format = "YYYY-MM-DD"

const formItemLayout = {
  labelCol: {
    xs: { span: 10 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 14 },
    sm: { span: 14 },
  },
};

const CourtHearing = ({ 
	lawcaseDetail,
	saveCourtHearing,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
  }}) => {

  const { courtHearing } = lawcaseDetail

  const handleSave = (e) => {
    validateFields((errors) => {
      if (errors) { 
        return
      }
      console.log(getFieldsValue())
      saveCourtHearing(getFieldsValue())
    })
  }

  return (
		<Form layout="horizontal">

			<Row gutter={16} className={styles.pannelhr}>
				<Col span={8}>
					<FormItem {...formItemLayout} label="旁听日期">
						{getFieldDecorator('remarkDate', {
							rules: [{
                required: true,
                message: '请选择旁听日期',
              }]
						})(
							<DatePicker format={format}/>
						)}
					</FormItem>
				</Col>

				<Col span={12}>
					<FormItem label="旁听记录" {...formItemLayout}>
						{getFieldDecorator('remark', {
							rules: [{
                required: true,
                message: '请输入旁听记录',
              }]
						})(
							<TextArea rows={4} />
						)}
					</FormItem>
				</Col>

				<Col span={4}>
					<Button type="primary" onClick={handleSave}>保存</Button>
				</Col>
			</Row>

			{
				courtHearing.map((item) => {
					return (
						<Row gutter={16} className={styles.topbar} key={item.id}>
							<Col span={10}>
								<div>旁听日期：{dateUtil.convertToDate(item.remarkDate, 'yyyy-MM-dd')}</div>
							</Col>

							<Col span={14} style={{ wordWrap: 'break-word' }}>
								<div>旁听记录：{item.remark}</div>
							</Col>
						</Row>
					)
				})
			}

		</Form>
	)
}

CourtHearing.propTypes = {
  lawcaseDetail: PropTypes.object,
  loading: PropTypes.bool,
  form: PropTypes.object.isRequired
}

export default Form.create()(CourtHearing)
