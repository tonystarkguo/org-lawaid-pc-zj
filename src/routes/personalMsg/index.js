import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Col, Form, Input, Select, Radio, DatePicker, Tabs, Checkbox, message, Upload, Icon } from 'antd'
import moment from 'moment'
import { config, jsUtil } from '../../utils'
import styles from './index.less'
const { api } = config

import { getDataService } from '../../services/commonService'

const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const PersonalMsg = ({
  personalMsg,
  dispatch,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
    validateFieldsAndScroll,
  }
}) => {

  const { info, fileData, imgUrl } = personalMsg

  const userInfo = JSON.parse(localStorage.getItem('user')) || {}
  const isMgr = userInfo.isMgr

  let roles = info && info.roles || []
  let roleNames = []
  let roleIds = []
  roles.map(d => {
    roleNames.push(d.name)
    roleIds.push(d.id)
  })

  const msgSubmit = (e) => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      //需要要加上login 的namespace
      const data = {
        ...getFieldsValue(),
        name: info.name,
        dicGender: info.dicGender,
        roleIds: roleIds || [],
      }
      dispatch({
        type: 'personalMsg/updateInfo',
        payload: data
      })
    })

  }

  const headSubmit = (e) => {
    dispatch({
      type: 'personalMsg/updateHead'
    })
  }

  const pwdSubmit = (e) => {
    const sourcePassword = getFieldValue('sourcePassword')
    const password = getFieldValue('password')
    const comfirmPwd = getFieldValue('comfirmPwd')
    if (sourcePassword === '' || sourcePassword === undefined) {
      message.error('请输入原始密码')
      return
    } else if (password === '' || password === undefined) {
      message.error('请输入新密码')
      return
    } else if (comfirmPwd === '' || comfirmPwd === undefined) {
      message.error('请再次输入新密码')
      return
    } else if (password !== comfirmPwd) {
      message.error('新密码输入不一致，请重新输入')
      return
    } else if (sourcePassword === password){
      message.error('新旧密码不能相同，请重新输入')
      return
    } else {
      const data = {
        sourcePassword: sourcePassword,
        password: password,
        comfirmPwd: comfirmPwd,
      }
      dispatch({
        type: 'personalMsg/updatePassword',
        payload: data,
      })
    }
  }

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  }

  const onChange = (e) => {
    console.log('radio checked', e.target.value);
  }

  const uploadProps = {
    action: '/uploadtopub',
    showUploadList: false,
    data: (file) => {
      const dt = new Date().format('yyyyMMdd')
      const lg = new Date().getTime()
      let h = fileData
      h.key = 'orm/' + dt + '/' + lg + '_' + '${filename}'
      return h
    },
    onChange({ file = {}, fileList = [] }) {


      if (file.status === 'done') {
        dispatch({
          type: 'personalMsg/updateFile',
          payload: { file, fileData }
        })
      }

    },
  }

  const headPic = info && info.headPic == null ? config.head : info.headPic

  return (
    <div>
      <img className={styles.head} alt="头像" src={headPic} />
      <Tabs
        defaultActiveKey="1"
        tabPosition="left"
        size="small"
      >
        <TabPane tab="基本资料" key="1">
          <div>

            <FormItem {...formItemLayout} label="姓名">
              <p>{info.name}</p>
            </FormItem>

            <FormItem {...formItemLayout} label="性别">
              <p>{info.dicGenderName}</p>
            </FormItem>

            <FormItem {...formItemLayout} label="出生日期">
              {getFieldDecorator('birthdate', {
                initialValue: info.birthdate ? moment(info.birthdate) : undefined
              })(
                <DatePicker className={styles.block} />
                )}
            </FormItem>

            <FormItem {...formItemLayout} label="证件类型">
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
                  {jsUtil.getDictDataByKey('dic_credentials_type').map(d => <Option key={d.code}>{d.name}</Option>)}
                </Select>
                )}
            </FormItem>

            <FormItem {...formItemLayout} label="证件号码">
              {getFieldDecorator('cardCode', {
                initialValue: info.cardCode
              })(
                <Input className={styles.block} />
                )}
            </FormItem>

            <FormItem {...formItemLayout} label="民族">
              {getFieldDecorator('dicNation', {
                initialValue: info.dicNation
              })(
                <Select
                  showSearch
                  className={styles.block}
                  optionFilterProp="children"
                  onChange={handleChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {jsUtil.getDictDataByKey('dic_ethnic_group').map(d => <Option key={d.code}>{d.name}</Option>)}
                </Select>
                )}
            </FormItem>

            <FormItem {...formItemLayout} label="文化程度">
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
                  {jsUtil.getDictDataByKey('dic_cultural_level').map(d => <Option key={d.code}>{d.name}</Option>)}
                </Select>
                )}
            </FormItem>

            <FormItem {...formItemLayout} label="政治面貌">
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
                  {jsUtil.getDictDataByKey('dic_dic_political_status').map(d => <Option key={d.code}>{d.name}</Option>)}
                </Select>
                )}
            </FormItem>

            <FormItem {...formItemLayout} label="职务">
              {getFieldDecorator('duties', {
                initialValue: info.duties
              })(
                <Input className={styles.block} />
                )}
            </FormItem>


            <FormItem {...formItemLayout} label="从事法援工作时间">
              {getFieldDecorator('beginWorkingDate', {
                initialValue: info.beginWorkingDate ? moment(info.beginWorkingDate) : undefined
              })(
                <DatePicker className={styles.block} />
                )}
            </FormItem>


            <FormItem {...formItemLayout} label="任职日期">
              {getFieldDecorator('takeOfficeDate', {
                initialValue: info.takeOfficeDate ? moment(info.takeOfficeDate) : undefined
              })(
                <DatePicker className={styles.block} />
                )}
            </FormItem>


            <FormItem {...formItemLayout} label="执业资格">
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
                  {jsUtil.getDictDataByKey('dic_career').map(d => <Option key={d.code}>{d.name}</Option>)}
                </Select>
                )}
            </FormItem>

            <FormItem {...formItemLayout} label="执业证号">
              {getFieldDecorator('vocationalNumber', {
                initialValue: info.vocationalNumber
              })(
                <Input className={styles.block} />
                )}
            </FormItem>

            <FormItem {...formItemLayout} label="毕业院校及专业">
              {getFieldDecorator('graduationSchool', {
                initialValue: info.graduationSchool
              })(
                <Input className={styles.block} placeholder="无则不填写" />
                )}
            </FormItem>

            <FormItem {...formItemLayout} label="在职教育及专业">
              {getFieldDecorator('inServiceEducation', {
                initialValue: info.inServiceEducation
              })(
                <Input className={styles.block} placeholder="无则不填写" />
                )}
            </FormItem>

            <FormItem {...formItemLayout} label="人员类别">
              <p>{roleNames.join(',')}</p>
            </FormItem>

            <FormItem {...formItemLayout} label="联系电话">
              {getFieldDecorator('mobile', {
                initialValue: info.mobile,
                rules: [
                  {
                    required: true,
                    message: '请输入手机号码',
                  },{
                    pattern: /^1[34578]\d{9}$/,
                    message: '请输入正确的手机号!',
                  },
                ],
              
              })(
                <Input className={styles.block} />
                )}
            </FormItem>

            <FormItem {...formItemLayout} label="办公电话">
              {getFieldDecorator('workMobile', {
                initialValue: info.workMobile
              })(
                <Input className={styles.block} />
                )}
            </FormItem>
            {isMgr &&
              <FormItem {...formItemLayout} label="中心简介">
                {getFieldDecorator('centerProfile', {
                  initialValue: info.centerProfile,
                  rules: [{ max: 1000, message: '不超过1000字' }],
                })(
                  <TextArea className={styles.block} autosize={{ minRows: 4, maxRows: 12 }} />
                  )}
              </FormItem>
            }

            <div className={styles.textCenter}>
              <Button type="primary" size="large" onClick={msgSubmit}>提交</Button>
            </div>

          </div>
        </TabPane>
        <TabPane tab="修改头像" key="2">
          <div className={styles.textCenter}>

            <Upload {...uploadProps}>
              {
                imgUrl == '' ?
                  <Icon type="plus" className="avatar-uploader-trigger" /> :
                  <img src={imgUrl} alt="" className="avatar" />
              }
            </Upload>

          </div>
          <div className={styles.headSubmit}>
            <Button type="primary" size="large" onClick={headSubmit}>提交</Button>
          </div>
        </TabPane>
        <TabPane tab="修改密码" key="3">
          <div>
            <FormItem {...formItemLayout} label="原始密码">
              {getFieldDecorator('sourcePassword')(
                <Input className={styles.block} />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="新密码">
              {getFieldDecorator('password')(
                <Input className={styles.block} />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="再次输入">
              {getFieldDecorator('comfirmPwd')(
                <Input className={styles.block} />
              )}
            </FormItem>

            <div className={styles.textCenter}>
              <Button type="primary" size="large" onClick={pwdSubmit}>提交</Button>
            </div>

          </div>
        </TabPane>
      </Tabs>
    </div>
  )
}

PersonalMsg.propTypes = {
  form: PropTypes.object,
  personalMsg: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ personalMsg }) => ({ personalMsg }))(Form.create()(PersonalMsg)) 
