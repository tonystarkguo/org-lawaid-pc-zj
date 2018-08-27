import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Radio, Modal, message, Checkbox, TimePicker  } from 'antd'
import moment from 'moment';
import { jsUtil } from '../../utils/'

const CheckboxGroup = Checkbox.Group
const FormItem = Form.Item
const RadioGroup = Radio.Group
const format = 'HH:mm'

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
}

const modal = ({
  onOk,
  timeAmBgChange,
  timeAmEdChange,
  timePmBgChange,
  timePmEdChange,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldsValue,
    getFieldValue,
  },
  ...modalProps
}) => {

  const { title, item, modalType, timeAmBg, timeAmEd, timePmBg, timePmEd,modaltype } = modalProps

  let week = jsUtil.getDictDataByKey('dic_dic_working_date')
  week = week.map((item) => {
    let newData = item
    newData.label = item.name
    newData.value = item.code
    return newData
  })

  const handleOk = () => {
    validateFieldsAndScroll((errors) => {
      if(errors){
        return
      }else{
        const data = {
          ...getFieldsValue(),
          attendedTimeAmBg: timeAmBg,
          attendedTimeAmEd: timeAmEd,
          attendedTimePmBg: timePmBg,
          attendedTimePmEd: timePmEd,
        }
        console.log(data)
        onOk(data)
      }
    })
  }

  const handleChange = (e) => {
    console.log('radio checked', e.target.value);
  }

  const onChange = (checkedValues) => {
    console.log('checked = ', checkedValues);
  }

  const onTimeAmBgChange = (time, timeString) => {
    console.log(timeString)
    timeAmBgChange(timeString)
  }

  const onTimeAmEdChange = (time, timeString) => {
    console.log(timeString)
    timeAmEdChange(timeString)
  }

  const onTimePmBgChange = (time, timeString) => {
    console.log(timeString)
    timePmBgChange(timeString)
  }

  const onTimePmEdChange = (time, timeString) => {
    console.log(timeString)
    timePmEdChange(timeString)
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }
  
  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="工作站名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
                message: '请输入工作站名称',
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem label="机构性质" hasFeedback {...formItemLayout}>
          工作站
        </FormItem>
				
				{modalType == 'create' && 
				<FormItem label="密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入密码',
              },
            ],
          })(<Input />)}
        </FormItem>}
        
        <FormItem label="详细地址" hasFeedback {...formItemLayout}>
          {getFieldDecorator('address', {
            initialValue: item.address,
            rules: [
              {
                required: true,
                message: '请输入详细地址',
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem label="邮编" hasFeedback {...formItemLayout}>
          {getFieldDecorator('zipCode', {
            initialValue: item.zipCode,
          })(<Input />)}
        </FormItem>

        <FormItem label="联系电话" hasFeedback {...formItemLayout}>
          {getFieldDecorator('telephone', {
            initialValue: item.telephone,
            rules: [
              {
                required: true,
                message: '请输入联系电话',
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem label="负责人" hasFeedback {...formItemLayout}>
          {getFieldDecorator('orgResp', {
            initialValue: item.orgResp
          })(<Input />)}
        </FormItem>

        {/*<FormItem label="负责人手机号" hasFeedback {...formItemLayout}>
          {getFieldDecorator('orgRespPhone', {
            initialValue: item.orgRespPhone
          })(<Input />)}
        </FormItem>*/}

        <FormItem label="办公时间" hasFeedback {...formItemLayout}>
          {getFieldDecorator('dicWorkingDateAry', {
            initialValue: item.dicWorkingDateAry,
            rules: [
              {
                required: true,
                message: '请选择办公时间',
              },
            ],
          })(<CheckboxGroup options={week} onChange={onChange} />)}
        </FormItem>

        {
          modalType === 'create' ?
          <FormItem label="办公时段" hasFeedback {...formItemLayout}>
            <div>
              {getFieldDecorator('attendedTimeAmBg', {
                initialValue: moment(timeAmBg, format),
                rules: [
                  {
                    required: true,
                    message: '请选择办公时段',
                  },
                ],
              })(
                <TimePicker format={format} onChange={onTimeAmBgChange} />
              )}
              <span style={{margin:'0 10px 0 5px'}}>~</span>
              {getFieldDecorator('attendedTimeAmEd', {
                initialValue: moment(timeAmEd, format),
                rules: [
                  {
                    required: true,
                    message: '请选择办公时段',
                  },
                ],
              })(
                <TimePicker format={format} onChange={onTimeAmEdChange} />
              )}
            </div>

            <div>
              {getFieldDecorator('attendedTimePmBg', {
                initialValue: moment(timePmBg, format),
                rules: [
                  {
                    required: true,
                    message: '请选择办公时段',
                  },
                ],
              })(
                <TimePicker format={format} onChange={onTimePmBgChange} />
              )}
              <span style={{margin:'0 10px 0 5px'}}>~</span>
              {getFieldDecorator('attendedTimePmEd', {
                initialValue: moment(timePmEd, format),
                rules: [
                  {
                    required: true,
                    message: '请选择办公时段',
                  },
                ],
              })(
                <TimePicker format={format} onChange={onTimePmEdChange} />
              )}
            </div>
          </FormItem>

          :

          <FormItem label="办公时段" hasFeedback {...formItemLayout}>
            <div>
              {getFieldDecorator('attendedTimeAmBg', {
                initialValue: item.attendedTimeAmBg === null ? undefined : moment(item.attendedTimeAmBg, format),
                rules: [
                  {
                    required: true,
                    message: '请选择办公时段',
                  },
                ],
              })(
                <TimePicker format={format} onChange={onTimeAmBgChange} />
              )}
              <span style={{margin:'0 10px 0 5px'}}>~</span>
              {getFieldDecorator('attendedTimeAmEd', {
                initialValue: item.attendedTimeAmEd === null ? undefined : moment(item.attendedTimeAmEd, format),
                rules: [
                  {
                    required: true,
                    message: '请选择办公时段',
                  },
                ],
              })(
                <TimePicker format={format} onChange={onTimeAmEdChange} />
              )}
            </div>

            <div>
              {getFieldDecorator('attendedTimePmBg', {
                initialValue: item.attendedTimePmBg === null ? undefined : moment(item.attendedTimePmBg, format),
                rules: [
                  {
                    required: true,
                    message: '请选择办公时段',
                  },
                ],
              })(
                <TimePicker format={format} onChange={onTimePmBgChange} />
              )}
              <span style={{margin:'0 10px 0 5px'}}>~</span>
              {getFieldDecorator('attendedTimePmEd', {
                initialValue: item.attendedTimePmEd === null ? undefined : moment(item.attendedTimePmEd, format),
                rules: [
                  {
                    required: true,
                    message: '请选择办公时段',
                  },
                ],
              })(
                <TimePicker format={format} onChange={onTimePmEdChange} />
              )}
            </div>
          </FormItem>
        }

        <div style={{color:'red'}}>注意: 添加工作站后，登录方式为账号登录。</div>
        
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
