import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Select } from 'antd'
import { createDicNodes } from '../../../utils'
import styles from './index.less'

const FormItem = Form.Item
const Option = Select.Option
const { createRadioButton, createSelectOption, createRadio } = createDicNodes

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const SubPersonModal = ({
  caseDetail = '',
  item = {},
  onOk,
  onCancel,
  allConfig = {},
  tagList = [],
  roles,
  title = '',
  subPersonItem = {},
  caseBaseInfoData,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
    getFieldValue
  },
  ...modalProps
}) => {
  console.log(caseBaseInfoData)
  const { areaData = {}, dictData = {} } = allConfig
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      let caseNum = ''
      let data = {}
      if(getFieldValue('caseNum')){
        caseNum =getFieldValue('caseNum')
      }
      if(getFieldValue('caseNum') == subPersonItem.caseNum){
       data = {
        ...subPersonItem,
        ...getFieldsValue(),
      }
      delete data.caseNum
    }else{
         data = {
          ...subPersonItem,
        ...getFieldsValue(),
        caseNum: caseNum,
        }
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
    title,
    onCancel,
  }
  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        {typeof subPersonItem.caseNum !== 'undefined' &&
          <FormItem label="案号" hasFeedback {...formItemLayout}>
            {getFieldDecorator('caseNum', {
              initialValue: subPersonItem.caseNum,
            })(<Input style={{ width: 284 }}  disabled={caseBaseInfoData.caseStatusCode <3 ? true : false}/>)}
          </FormItem>}
        <FormItem label="证件类型" hasFeedback {...formItemLayout}>
          {getFieldDecorator('dicCardType', {
            initialValue: subPersonItem.dicCardType,
            rules: [{ required: true, message: '请选择证件类型' }],
          })(
            <Select placeholder="请选择证件类型" disabled={title === '编辑从案人员'}>
              {createSelectOption({ list: dictData.dic_credentials_type })}
            </Select>
          )}
        </FormItem>
        <FormItem label="证件号" hasFeedback {...formItemLayout}>
          {getFieldDecorator('cardCode', {
            initialValue: subPersonItem.cardCode,
            rules: [{ required: true, message: '请输入证件号' }],
          })(<Input style={{ width: 284 }} placeholder="请输入证件号" disabled={title === '编辑从案人员'} />)}
        </FormItem>
        <FormItem label="姓名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: subPersonItem.name || subPersonItem.rpName,
            rules: [{ required: true, message: '请输入姓名' }],
          })(<Input placeholder="请输入姓名" />)}
        </FormItem>
        <FormItem label="性别" hasFeedback {...formItemLayout}>
          {getFieldDecorator('dicGender', {
            initialValue: subPersonItem.dicGender,
            rules: [{ required: true, message: '请选择性别' }],
          })(
            <Radio.Group>
              {createRadio({ list: dictData.dic_gender })}
            </Radio.Group>
          )}
        </FormItem>
        <FormItem label="联系电话" hasFeedback {...formItemLayout}>
          {getFieldDecorator('mobile', {
            initialValue: subPersonItem.mobile,
            rules: [{ required: true, message: '请输入联系电话' }],
          })(<Input placeholder="请输入联系电话" style={{ width: 284 }} />)}
        </FormItem>
        <FormItem hasFeedback {...formItemLayout} label="人群类别">
          {getFieldDecorator('dicConsultantCategoryList', {
            initialValue: subPersonItem.dicConsultantCategoryList && subPersonItem.dicConsultantCategoryList.map(_ => _.value || _),
            rules: [{ required: true, message: '请选择人群类别' }],
          })(
            <Select
              mode="multiple"
              placeholder="请选择类别"
            >
              {createSelectOption({ list: dictData.dic_dic_occupatio })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="案情概况">
          {getFieldDecorator('caseDetail', {
            initialValue: subPersonItem.caseDetail || caseDetail,
            rules: [{ required: true, message: '请输入案情概况' }],
          })(<Input type="textarea" rows={4} maxLength={'251'} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

SubPersonModal.propTypes = {
  form: PropTypes.object.isRequired,
  title: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  allConfig: PropTypes.object,
}

export default Form.create()(SubPersonModal)
