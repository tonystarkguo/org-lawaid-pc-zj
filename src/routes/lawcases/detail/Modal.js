import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Select } from 'antd'
import { createDicNodes } from '../../../utils'
import styles from './index.less'

const FormItem = Form.Item
const {createRadioButton, createSelectOption, createRadio} = createDicNodes

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  item = {},
  onOk,
  allConfig,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue
  },
  ...modalProps
}) => {
  const {areaData, dictData} = allConfig
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      let data = {
        ...getFieldsValue()
      }
      dictData.dic_gender.forEach((gender) => {
        if(gender.code === data.dicGender) {
          data.dicGenderName = gender.name
        }
      })
      dictData.dic_dic_relation.forEach((relation) => {
        if(relation.code === data.dicRelation) {
          data.dicRelationName = relation.name
        }
      })
      onOk(data)
    })
  }

  const handleChange = (value) => {
    console.log('changed', value);
    let salary = getFieldsValue().salary || 0
    let operatIncome = getFieldsValue().operatIncome || 0
    let otherIncome = getFieldsValue().otherIncome || 0
    let sum =  salary + operatIncome + otherIncome
    setFieldsValue({
      total: sum
    })
  }

  /*setTimeout(function(){
    let salary = getFieldsValue().salary || 0
    let operatIncome = getFieldsValue().operatIncome || 0
    let otherIncome = getFieldsValue().otherIncome || 0
    let sum =  salary + operatIncome + otherIncome
    setFieldsValue({
      total: sum
    })
  }, 500)*/

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="序号" hasFeedback {...formItemLayout} style={{ display:'none' }}>
          {getFieldDecorator('seq', {
            initialValue: item.seq,
          })(<Input />)}
        </FormItem>
        <FormItem label="姓名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [{required: true,message: '请输入姓名'}]
          })(<Input />)}
        </FormItem>
        <FormItem label="年龄" hasFeedback {...formItemLayout}>
          {getFieldDecorator('age', {
            initialValue: item.age,
            rules: [
              {required: true, message: '年龄不能为空'},  
              {type: 'number', message: '年龄必须为数字值'}
            ],
          })(<InputNumber style={{ width:'100%' }} />)}
        </FormItem>
        <FormItem label="性别" hasFeedback {...formItemLayout}>
          {getFieldDecorator('dicGender', {
            initialValue: item.dicGender,
            rules: [{required: true,message: '请输入选择性别'}]
          })(
            <Radio.Group>
              {createRadio({list:dictData.dic_gender})}
            </Radio.Group>
          )}
        </FormItem>
        <FormItem label="关系" hasFeedback {...formItemLayout}>
          {getFieldDecorator('dicRelation', {
            initialValue: item.dicRelation,
            rules: [{required: true,message: '请选择关系'}]
          })(
            <Select>
              {createSelectOption({list:dictData.dic_dic_relation})}
            </Select>
          )}
        </FormItem>
        <FormItem label="工资性收入" hasFeedback {...formItemLayout}>
          {getFieldDecorator('salary', {
            initialValue: item.salary,
            rules: [
              {required: true, message: '工资性收入不能为空'},  
              {type: 'number', message: '工资性收入必须为数字值'}
            ],
          })(<InputNumber style={{ width:284 }} onBlur={handleChange} />)}
        </FormItem>
        <FormItem label="生产经营性收入" hasFeedback {...formItemLayout}>
          {getFieldDecorator('operatIncome', {
            initialValue: item.operatIncome,
            rules: [
              {required: true, message: '生产经营性收入不能为空'},  
              {type: 'number', message: '生产经营性收入必须为数字值'}
            ],
          })(<InputNumber style={{ width:284 }} onBlur={handleChange} />)}
        </FormItem>
        <FormItem label="其他收入" hasFeedback {...formItemLayout}>
          {getFieldDecorator('otherIncome', {
            initialValue: item.otherIncome,
            rules: [
              {required: true, message: '其他收入不能为空'},  
              {type: 'number', message: '其他收入必须为数字值'}
            ],
          })(<InputNumber style={{ width:284 }} onBlur={handleChange} />)}
        </FormItem>
        <FormItem label="合计" hasFeedback {...formItemLayout}>
          {getFieldDecorator('total', {
            initialValue: item.total,
            rules: [
              {required: true, message: '合计不能为空'},  
              {type: 'number', message: '合计必须为数字值'}
            ],
          })(<InputNumber style={{ width:284 }} disabled />)}
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
