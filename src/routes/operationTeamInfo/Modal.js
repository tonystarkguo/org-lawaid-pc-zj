import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Radio, Modal, message } from 'antd'
import city from '../../utils/city'

const FormItem = Form.Item
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
}

const modal = ({
  // item = {},
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {

  const { title, allRole, item } = modalProps

  const options = allRole.map(d => <Radio key={d.id} value={d.id}>{d.name}</Radio>);
  
  let role = ''
  let isUpdate
  if(title == "创建"){
    isUpdate = false
  }else{
    isUpdate = true
    role = item.roles[0].id
    if(role === 3){
      role = 'admin'
    }
  }

  const handleOk = () => {
    validateFields((errors) => {
      let roleId = getFieldsValue().roleId
      let password = getFieldsValue().password
      let newPassword = getFieldsValue().newPassword
      if (errors) {
        return
      }
      if(password !== newPassword){
        message.error('输入密码不一致！')
        return
      }
      const data = {
        ...getFieldsValue(),
        roleIds: roleId.toString().split(',')
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
  }
  
  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="姓名：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('fullName', {
            initialValue: item.fullName,
            rules: [
              {
                required: true,
                message: '请输入姓名'
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="电话号码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('mobile', {
            initialValue: item.mobile,
            rules: [
              {
                required: true,
                pattern: /^1[34578]\d{9}$/,
                message: '这不是一个合法的电话号码',
              },
            ],
          })(<Input />)}
        </FormItem>

        { isUpdate ?

          <div>
              { role === 'admin' ?
                  <FormItem label="角色：" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('roleId', {
                      initialValue: item.roles[0].id,
                      rules: [
                        {
                          required: true,
                          message: '请选择角色'
                        },
                      ],
                    })(
                      <RadioGroup disabled onChange={handleChange}>{options}</RadioGroup>
                    )}
                  </FormItem>

                  :

                  <FormItem label="角色：" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('roleId', {
                      initialValue: item.roles[0].id,
                      rules: [
                        {
                          required: true,
                          message: '请选择角色'
                        },
                      ],
                    })(
                      <RadioGroup onChange={handleChange}>{options}</RadioGroup>
                    )}
                  </FormItem>
              }
          </div>
          
          :

          <FormItem label="角色：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('roleId', {
              rules: [
                {
                  required: true,
                  message: '请选择角色'
                },
              ],
            })(
              <RadioGroup onChange={handleChange}>{options}</RadioGroup>
            )}
          </FormItem>

        }

        
        <FormItem label="系统用户名：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('userName', {
            initialValue: item.userName,
            rules: [
              {
                required: true,
                message: '请输入系统用户名'
              },
            ],
          })(<Input disabled={isUpdate} />)}
        </FormItem>
        <FormItem label="登录密码：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('password', {
            rules: [
              {
                required: !isUpdate,
                message: '请输入登录密码'
              },
              { 
                pattern: /^$|[u4E00-u9FA5]/,
                message: "密码不支持中文和空格" 
              }
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="确认登录密码：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('newPassword', {
            rules: [
              {
                required: !isUpdate,
                message: "请输入确定登录密码"
              },
              { 
                pattern: /^$|[u4E00-u9FA5]/,
                message: "密码不支持中文和空格" 
              }
            ],
          })(<Input />)}
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
