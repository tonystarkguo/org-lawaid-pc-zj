import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Radio, Modal, message, Row, Col, DatePicker, Select, Cascader } from 'antd'
import moment from 'moment'
import city from '../../utils/city'
import styles from './List.less'
import { constants, jsUtil } from '../../utils'
import _ from 'lodash'

const FormItem = Form.Item
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { CITY_CASADER_DATA } = constants

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

  let { title, info, roles, modalType } = modalProps
  let personType = info.roles || []
  let roleNames = []
  let roleIds = []
  personType.map(d => {
    roleNames.push(d.name)
    roleIds.push(d.id.toString())
  })
// console.log(personType)
  if(modalType == 'create'){
    roles = _.filter(roles, item => !item.isAdmin)
  }else if(modalType == 'update'){
    roles = _.some(personType, {isAdmin: true}) ?  roles : _.filter(roles, item => !item.isAdmin)
  }

  let area = undefined
  if (info.tBirthProvinceId && info.tBirthCityId && info.tBirthAreaId) {
    area = [info.tBirthProvinceId.toString(), info.tBirthCityId.toString(), info.tBirthAreaId.toString()] || undefined
  }

  const handleOk = () => {
    let baseInfo = {}
    validateFields((errors) => {
      if (errors) return
      if(getFieldValue('area')){
        baseInfo.tBirthProvinceId = getFieldValue('area')[0] || ''
        baseInfo.tBirthCityId = getFieldValue('area')[1] || ''
        baseInfo.tBirthAreaId = getFieldValue('area')[2] || ''
      }
      if(getFieldValue('roleIds')){
      	const roleIds=getFieldValue('roleIds')
      	baseInfo.roleIds=getFieldValue('roleIds').toString().split(",")
      }
      const data = {
        ...getFieldsValue(),
        tBirthProvinceId: baseInfo.tBirthProvinceId,
        tBirthCityId: baseInfo.tBirthCityId,
        tBirthAreaId: baseInfo.tBirthAreaId,
        roleIds:baseInfo.roleIds
      }
      onOk(data)
    })
  }

  const handleChange = (e) => {
    // console.log('radio checked', e.target.value);
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
    width: 900
  }
  
//console.log(info)
  
  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <Row>
        {modalType === 'update' && (info.roles[0].id==3 || info.roles[0].id == 36) ?
          <Col span={12}>
            <FormItem {...formItemLayout} label="系统用户名" hasFeedback>
              {getFieldDecorator('userName', {
                initialValue: info.userName,
                rules: [{
                  required: true,
                  message: '请输入系统用户名',
                }]
              })(<Input disabled/>)}
            </FormItem>
          </Col>  :    <Col span={12}>
            <FormItem {...formItemLayout} label="系统用户名" hasFeedback>
              {getFieldDecorator('userName', {
                initialValue: info.userName,
                rules: [{
                  required: true,
                  message: '请输入系统用户名',
                }]
              })(<Input/>)}
            </FormItem>
          </Col>  }

          {
            modalType === 'create' ?
            <Col span={12}>
              <FormItem {...formItemLayout} label="密码" hasFeedback>
                {getFieldDecorator('password', {
                  initialValue: info.password,
                  rules: [{
                    required: true,
                    message: '请输入密码',
                  }]
                })(<Input/>)}
              </FormItem>
            </Col> : ''
          }
        </Row>

        <Row>
        
           <Col span={12}>
            <FormItem {...formItemLayout} label="姓名" hasFeedback>
              {getFieldDecorator('name', {
                initialValue: info.name,
                rules: [{
                  required: true,
                  message: '请输入姓名',
                }]
              })(<Input />)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem {...formItemLayout} label="联系电话" hasFeedback>
              {getFieldDecorator('mobile', {
                initialValue: info.mobile,
                rules: [{
                  required: true,
                  message: '请输入联系电话',
                },{
                  pattern: /^1[34578]\d{9}$/,
                  message: '请输入正确的手机号!',
                },]
              })(<Input/>)}
            </FormItem>
          </Col>
        </Row>

        <Row>
        {modalType === 'update' ?
          <Col span={12}>
            <FormItem {...formItemLayout} label="人员身份" hasFeedback>
              {getFieldDecorator('roleIds', {
                initialValue: roleIds == '' ? undefined : roleIds,
                rules: [{
                  required: true,
                  message: '请选择人员类别',
                }]
              })(
                <Select
                  disabled={_.some(personType, {id:35}) ? false:true}
                  placeholder="请选择"
                  onChange={handleChange}
                  className={styles.block}
                >
                  {roles.map(d => <Option key={d.id}>{d.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>  :  <Col span={12}>
            <FormItem {...formItemLayout} label="人员身份" hasFeedback>
              {getFieldDecorator('roleIds', {
                initialValue: roleIds == '' ? undefined : roleIds,
                rules: [{
                  required: true,
                  message: '请选择人员类别',
                }]
              })(
                <Select
                  disabled={false}
                  placeholder="请选择"
                  onChange={handleChange}
                  className={styles.block}
                >
                  {roles.map(d => <Option key={d.id}>{d.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>}

          <Col span={12}>
            <FormItem {...formItemLayout} label="工作单位" hasFeedback>
              {getFieldDecorator('workUnit', {
                initialValue: info.workUnit,
                rules: [{
                  required: true,
                  message: '请输入工作单位',
                }]
              })(<Input/>)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="文化程度" hasFeedback>
              {getFieldDecorator('dicEduLevel', {
                initialValue: info.dicEduLevel
              })(
                <Select
                  showSearch
                  className={styles.block}
                  optionFilterProp="children"
                  onChange={handleChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {jsUtil.getDictDataByKey('dic_cultural_level').map(d=> <Option key={d.code}>{d.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem {...formItemLayout} label="执业资格" hasFeedback>
              {getFieldDecorator('dicVocationalQualification', {
                initialValue: info.dicVocationalQualification
              })(
                <Select
                  showSearch
                  className={styles.block}
                  optionFilterProp="children"
                  onChange={handleChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {jsUtil.getDictDataByKey('dic_practicing_qualification').map(d=> <Option key={d.code}>{d.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="证件类型" hasFeedback>
              {getFieldDecorator('dicCardType', {
                initialValue: info.dicCardType
              })(
                <Select
                  showSearch
                  className={styles.block}
                  optionFilterProp="children"
                  onChange={handleChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {jsUtil.getDictDataByKey('dic_credentials_type').map(d=> <Option key={d.code}>{d.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem {...formItemLayout} label="证件号码" hasFeedback>
              {getFieldDecorator('cardCode', {
                initialValue: info.cardCode
              })(<Input/>)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="办公电话" hasFeedback>
              {getFieldDecorator('workMobile', {
                initialValue: info.workMobile,
              })(<Input/>)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem {...formItemLayout} label="民族" hasFeedback>
              {getFieldDecorator('dicNation', {
                initialValue: info.dicNation,
              })(
                <Select
                  showSearch
                  className={styles.block}
                  optionFilterProp="children"
                  onChange={handleChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {jsUtil.getDictDataByKey('dic_ethnic_group').map(d=> <Option key={d.code}>{d.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="政治面貌" hasFeedback>
              {getFieldDecorator('dicPoliticalStatus', {
                initialValue: info.dicPoliticalStatus
              })(
                <Select
                  showSearch
                  className={styles.block}
                  optionFilterProp="children"
                  onChange={handleChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {jsUtil.getDictDataByKey('dic_dic_political_status').map(d=> <Option key={d.code}>{d.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label="从事法援工作时间" hasFeedback {...formItemLayout}>
              {getFieldDecorator('beginWorkingDate', {
                initialValue: info.beginWorkingDate ? moment(info.beginWorkingDate) : undefined
              })(<DatePicker format="YYYY-MM-DD" />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem hasFeedback {...formItemLayout} label="毕业院校及专业">
              {getFieldDecorator('graduationSchool', {
                initialValue: info.graduationSchool
              })(<Input/>)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem hasFeedback {...formItemLayout} label="出生日期">
              {getFieldDecorator('birthdate', {
                initialValue: info.birthdate ? moment(info.birthdate) : undefined
              })(<DatePicker format="YYYY-MM-DD" />)}
            </FormItem> 
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem hasFeedback {...formItemLayout} label="执业证号">
              {getFieldDecorator('vocationalNumber', {
                initialValue: info.vocationalNumber
              })(<Input/>)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem hasFeedback {...formItemLayout} label="任职日期">
              {getFieldDecorator('takeOfficeDate', {
                initialValue: info.takeOfficeDate ? moment(info.takeOfficeDate) : undefined
              })(<DatePicker format="YYYY-MM-DD" />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem hasFeedback {...formItemLayout} label="在职教育及专业">
              {getFieldDecorator('inServiceEducation', {
                initialValue: info.inServiceEducation
              })(<Input placeholder="无则不填写" />)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem hasFeedback {...formItemLayout} label="性别">
              {getFieldDecorator('dicGender', {
                initialValue: info.dicGender,
              })(
                <RadioGroup>
                  <Radio value={'1'}>男</Radio>
                  <Radio value={'2'}>女</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem hasFeedback {...formItemLayout} label="职务">
              {getFieldDecorator('duties', {
                initialValue: info.duties,
              })(<Input/>)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem hasFeedback {...formItemLayout} label="籍贯">
              {getFieldDecorator('area', {
                initialValue: area,
              })(
                <Cascader size="large" showSearch options={CITY_CASADER_DATA} placeholder="请选择籍贯（可搜索）"/>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem hasFeedback {...formItemLayout} label="用户状态">
              {getFieldDecorator('userStatus', {
                initialValue: info.userStatus,
              })(
                <Select
                  showSearch
                  className={styles.block}
                  optionFilterProp="children"
                  onChange={handleChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {jsUtil.getDictDataByKey('dic_user_status').map(d=> <Option key={d.code}>{d.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

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
