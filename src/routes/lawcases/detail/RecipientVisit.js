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

const RecipientVisit = ({ 
	lawcaseDetail,
	saveRecipientVisit,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
  }}) => {

	const { recipientVisit } = lawcaseDetail

  const handleSave = (e) => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      console.log(getFieldsValue())
      saveRecipientVisit(getFieldsValue())
    })
  }

  return (
		<Form layout="horizontal">

			<Row gutter={16} className={styles.pannelhr}>
				<Col span={8}>
					<FormItem {...formItemLayout} label="回访日期">
						{getFieldDecorator('remarkDate', {
							rules: [{
                required: true,
                message: '请选择回访日期',
              }]
						})(
							<DatePicker format={format}/>
						)}
					</FormItem>
				</Col>

				<Col span={12}>
					<FormItem label="回访记录" {...formItemLayout}>
						{getFieldDecorator('remark', {
							rules: [{
                required: true,
                message: '请输入回访记录',
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
				recipientVisit.map((item) => {
					return (
						<Row gutter={16} className={styles.topbar} key={item.id}>
							<Col span={10}>
								<div>回访日期：{dateUtil.convertToDate(item.remarkDate, 'yyyy-MM-dd')}</div>
							</Col>

							<Col span={14} style={{ wordWrap: 'break-word' }}>
								<div style={{ wordWrap: 'break-word' }}>回访记录：{item.remark}</div>
							</Col>
						</Row>
					)
				})
			}
			
		</Form>
	)
}

RecipientVisit.propTypes = {
  lawcaseDetail: PropTypes.object,
  form: PropTypes.object.isRequired
}

export default Form.create()(RecipientVisit)
