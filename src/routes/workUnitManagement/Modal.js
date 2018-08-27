import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Modal, message, Checkbox, DatePicker, Cascader } from 'antd'
import moment from 'moment';
import styles from './List.less'
import { jsUtil, createDicNodes, constants } from '../../utils/'

const { createSelectOption } = createDicNodes
const { CITY_CASADER_DATA } = constants
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
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
  },
  ...modalProps
}) => {

  const { title, item, modalType, allConfig } = modalProps
  const { dictData } = allConfig

  let area = undefined
  if (item.tBirthProvinceId && item.tBirthCityId && item.tBirthAreaId) {
    area = [item.tBirthProvinceId.toString(), item.tBirthCityId.toString(), item.tBirthAreaId.toString()] || undefined
  }

  const handleOk = () => {
    let baseInfo = {}
    validateFields((errors) => {
      if(errors) return
      if(getFieldValue('area')){
        baseInfo.tBirthProvinceId = getFieldValue('area')[0] || ''
        baseInfo.tBirthCityId = getFieldValue('area')[1] || ''
        baseInfo.tBirthAreaId = getFieldValue('area')[2] || ''
      }
      const data = {
        ...getFieldsValue(),
        tBirthProvinceId: baseInfo.tBirthProvinceId,
        tBirthCityId: baseInfo.tBirthCityId,
        tBirthAreaId: baseInfo.tBirthAreaId,
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }
  
  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="法律服务机构名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
                message: '请输入法律服务机构名称',
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem label="机构编码（执业证号）" hasFeedback {...formItemLayout}>
          {getFieldDecorator('firmCode', {
            initialValue: item.firmCode,
            rules: [
              {
                required: true,
                message: '请输入机构编码（执业证号）',
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem label="所属区域" hasFeedback {...formItemLayout}>
          {getFieldDecorator('area', {
            initialValue: area,
            rules: [
              {
                required: true,
                message: '请选择所属区域',
              },
            ],
          })(
            <Cascader size="large" showSearch options={CITY_CASADER_DATA} placeholder="请选择所属区域（可搜索）"/>
          )}
        </FormItem>

        <FormItem label="地址" hasFeedback {...formItemLayout}>
          {getFieldDecorator('address', {
            initialValue: item.address,
          })(<Input />)}
        </FormItem>

        <FormItem label="成立时间" hasFeedback {...formItemLayout}>
          {getFieldDecorator('establishDate', {
            initialValue: item.establishDate ? moment(item.establishDate) : undefined,
          })(
            <DatePicker
              showTime
              format="YYYY-MM-DD"
              style={{width:'100%'}}
            />
          )}
        </FormItem>

        <FormItem label="负责人" hasFeedback {...formItemLayout}>
          {getFieldDecorator('peopleid', {
            initialValue: item.peopleid,
            rules: [
              {
                required: true,
                message: '请输入负责人姓名',
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem label="联系方式" hasFeedback {...formItemLayout}>
          {getFieldDecorator('mobile', {
            initialValue: item.mobile,
          })(<Input />)}
        </FormItem>

        <FormItem label="业务范围" hasFeedback {...formItemLayout}>
          {getFieldDecorator('businessScope', {
            initialValue: item.businessScope,
          })(<Input />)}
        </FormItem>

        <FormItem label="机构类型" hasFeedback {...formItemLayout}>
          {getFieldDecorator('lawfirmType', {
            initialValue: item.lawfirmType,
            rules: [
              {
                required: true,
                message: '请选择机构类型',
              },
            ],
          })(
            <Select size="large" allowClear >
              {createSelectOption({list:dictData.dic_lawfirm_type})}
            </Select>
          )}
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
