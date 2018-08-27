import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Col, Form, Input, Select, DatePicker, message} from 'antd'
import { config } from '../../utils'
import styles from './index.less'
import CalendarModal from './CalendarModal'
import TimeModal from './TimeModal'
import moment from 'moment'
const { api } = config

import { getDataService } from '../../services/commonService'

const Option = Select.Option;
const FormItem = Form.Item;

const Neworder = ({
  neworder,
  dispatch,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
    getFieldValue
  }
}) => {

  const { calendarModalVisible, ResvData, timeModalVisible, dayResvData, loadDayResvData, 
    dayResvCurrentDate, currentValue, isIdCard, org, existUserInfo } = neworder
  
  //提交
  const handleSubmit = (e) => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        dicCardType: 'SF'
      }
      data.tOrgId = getFieldValue('tOrgId').key
      dispatch({
          type: 'neworder/save',
          payload: data
      })
    })
  }

  //打开日历
  const handleChooseTime = () => {
    const now = moment()
    dispatch({
      type: 'neworder/showCalendarModal'
    })
    dispatch({
      type: 'neworder/getResvData',
      payload: now
    })
  }

  //日历props
  const calendarModalProps = {
    visible: calendarModalVisible,
    maskClosable: true,
    title: '选择日期',
    ResvData,
    currentValue,
    footer:null,
    onCancel() {
      dispatch({
          type: 'neworder/hideCalendarModal',
      })
    },
    onPanelChange(currentDate) {
      dispatch({
        type: 'neworder/getResvData',
        payload: currentDate
      })
    },
    handleClickDate(currentDate) {          
      dispatch({
        type: 'neworder/getDayResvData',
        payload: currentDate
      })       
    }
  }

  //时间段props
  const timeModalProps = {
    visible: timeModalVisible,
    maskClosable: true,
    title: '选择当日时间段',
    dayResvData,
    dayResvCurrentDate,
    footer:null,
    onCancel() {
      dispatch({
          type: 'neworder/hideDayResvModal',
      })
    },
    handleChangeValue(value, id) {
      setFieldsValue({
        tOrgConfigValue: value,
        tOrgConfigId: id,
      })    
    },
    handleClickRadio() {
      dispatch({
          type: 'neworder/hideDayResvModal',
      })
      dispatch({
          type: 'neworder/hideCalendarModal',
      })      
    }
  }

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

  const handleChange = (value) => {
    if(`${value}` === '身份证'){
      dispatch({
          type: 'neworder/showBtn'
      })
    }else{
      dispatch({
          type: 'neworder/hideBtn'
      })
    }
  }

  let timeout;
  const handleSearch = (value) => {
    if(value !== ''){
      dispatch({
          type: 'neworder/orgChange',
          payload: `${value}`
      })
    }
  }

  const handleSelectChange = (value) => {
    dispatch({
        type: 'neworder/updateOrgId',
        payload: value
    })
  }

  const searchApplyerByIdCard = async ()=> {
    const inputVal = getFieldValue('cardCode')
    if(inputVal === '' || typeof inputVal === 'undefined'){
      message.warn('请输入身份证号码！')
    }else{
      const userInfo = await getDataService({url: api.recipientInfoList}, {cardCode: inputVal, serviceId: 'recipientInfoList'})
      if(userInfo && userInfo.data && userInfo.data.list && userInfo.data.list.length){
        setFieldsValue({
          contactName: userInfo.data.list[0].name,
          contactMobile: userInfo.data.list[0].mobile,
        })
      }
      /*dispatch({
          type: 'neworder/searchApplyerById',
          payload: inputVal
      })*/
    }
  }

  const options = org.map(d => <Option key={d.id}>{d.name}</Option>);

  return (
    <Form className={styles.content}>
      <Row>
        <Col span={12}>
          <FormItem {...formItemLayout} label="证件类型">身份证</FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem {...formItemLayout} label="证件号码">
            <Row gutter={8}>
              <Col span={17}>
              {getFieldDecorator('cardCode', {
                rules: [{ required: true, pattern: /(^\d{15}$)|(^\d{17}(\d|X)$)/, message: "请输入正确的身份证号码" }]
              })(
                <Input size="large" />
              )}
              </Col>
              <Col span={7}>
                <Button onClick={searchApplyerByIdCard} size="large">查找</Button>
              </Col>
            </Row>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem {...formItemLayout} label="申请法援者姓名">
            {getFieldDecorator('contactName', {
              initialValue: existUserInfo.name,
              rules: [{ required: true, message: '请输入申请法援者姓名' }]
            })(
              <Input />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formItemLayout} label="手机号码">
            {getFieldDecorator('contactMobile', {
              initialValue: existUserInfo.mobile,
              rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: "这不是一个合法的手机号码" }]
            })(
              <Input />
            )}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem {...formItemLayout} label="选择机构名称">
            <Row gutter={8}>
              <Col span={24}>
                {getFieldDecorator('tOrgId', {
                  rules: [{ required: true, message: '请选择机构名称' }],
                })(
                  <Select
                    labelInValue
                    showSearch
                    size="large"
                    notFoundContent=""
                    defaultActiveFirstOption={false}
                    showArrow={true}
                    filterOption={false}
                    onChange={handleSelectChange}
                    onSearch={handleSearch}
                    placeholder="输入关键字可模糊查找"
                  >
                    {options}
                  </Select>
                )}
              </Col>
            </Row>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formItemLayout} label="选择预约时间">    
            <div> 
              <Row gutter={8}>
                <Col span={17}>
                  {getFieldDecorator('tOrgConfigValue', {
                    rules: [{ required: true, message: '请选择时间' }],
                  })(
                    <Input size="large" disabled/>
                  )}
                </Col>
                <Col span={7}>
                  <Button size="large" onClick={handleChooseTime}>选择时间</Button>
                </Col>
              </Row>
              <CalendarModal {...calendarModalProps}></CalendarModal>
              <TimeModal {...timeModalProps}></TimeModal>
            </div>  
          </FormItem>
          <FormItem style={{display:'none'}}>
            {getFieldDecorator('tOrgConfigId')(
              <Input  disabled/>
            )}     
          </FormItem>
        </Col>
      </Row>
      <Row type="flex" justify="center">
        <Col span={4}>
          <Button type="primary" size="large" onClick={handleSubmit}>提交</Button>
        </Col>
      </Row>
    </Form>
  )
}

Neworder.propTypes = {
  form: PropTypes.object,
  neworder: PropTypes.object,
  dispatch: PropTypes.func,
}

//加上From.create 后，props中会多出form这个属性！！！！坑了我好久啊。
export default connect(({ neworder }) => ({ neworder }))(Form.create()(Neworder))
