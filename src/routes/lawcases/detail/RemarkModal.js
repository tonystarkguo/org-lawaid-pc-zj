import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select} from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  caseBaseInfoData,
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...remarkModalProps
}) => {

  const { confirmLoading } =  remarkModalProps

  // console.log(confirmLoading)

  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      onOk(data)
    })
  }
  
  const rpName = `受援人：${caseBaseInfoData.rpName || ''}`
  const hpName = `法律援助人员：${caseBaseInfoData.hpName || ''}`
  const modalOpts = {
    ...remarkModalProps,
    onOk: handleOk,
    confirmLoading: confirmLoading
  }

  let slct
  if(caseBaseInfoData.hpName){
    slct = getFieldDecorator('remarkObj')(<Select 
              style={{ width: "100%" }}        
              optionFilterProp="children" 
              placeholder="选择备注对象">
                <Option value={rpName}>{rpName}</Option>
                <Option value={hpName}>{hpName}</Option>
              </Select>)
  }else{
    slct = getFieldDecorator('remarkObj')(<Select 
              style={{ width: "100%" }}        
              optionFilterProp="children" 
              placeholder="选择备注对象">
                <Option value={rpName}>{rpName}</Option>
              </Select>)
  }

  return (
    <Modal {...modalOpts} title={<p style={{textAlign: 'center'}}>新增备注</p>}>
      <Form layout="horizontal">
        <FormItem label="日志类型" hasFeedback {...formItemLayout}>
          {getFieldDecorator('dicRemarkType', {
            rules: [{required: true,message: '请选择日志类型'}]
          })(<Select 
              style={{ width: "100%" }}        
              optionFilterProp="children" 
              placeholder="选择日志类型">
                <Option value="1">电话日志</Option>
                <Option value="2">备注日志</Option>
              </Select>)}
        </FormItem>
        <FormItem label="备注对象" hasFeedback {...formItemLayout}>
          {slct}
        </FormItem>
        <FormItem label="备注" hasFeedback {...formItemLayout}>
          {getFieldDecorator('remark', {
            rules: [{required: true, message: '请输入备注'}],
          })(<Input type="textarea" rows={6} />)}
        </FormItem>

      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
