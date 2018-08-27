import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Radio, Modal, message, Row, Col, DatePicker, Select, Button, Table } from 'antd'
import { FilterItem } from '../../components'
import city from '../../utils/city'
import styles from './List.less'

const FormItem = Form.Item
const RadioGroup = Radio.Group;
const Option = Select.Option;

const ColProps = {
  span: 6,
  style: {
    marginBottom: 16,
  },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const modal = ({
  onOk,
  onChoose,
  onFilterChange,
  showDetail,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
  },
  ...importModalProps
}) => {

  const handleSubmit = () => {
    let fields = {
      name: getFieldValue('name'),
      cardCode: getFieldValue('cardCode'),
    }
    console.log(fields)
    onFilterChange(fields)
  }

  const handleOk = () => {
    validateFields((errors) => {
      if(errors){
        return
      }
      const data = {
        ...getFieldsValue(),
        mobile: getFieldValue('mobile'),
      }
      onOk(data)
    })
  }

  const handleChoose = (record) => {
    onChoose()
    setTimeout(function(){
      setFieldsValue({
        name: record.name,
        cardCode: record.cardCode,
        workUnit: record.workUnit,
        mobile: record.mobile,
        workingYears: record.workingYears,
        goodFields: record.goodFields,
        gloryMemo: record.gloryMemo,
        id: record.id,
        hpUserInfoId: record.hpUserInfoId,
        orgIdentityId: record.orgIdentityId,
      })
    }, 200)
  }

  const handleChange = (e) => {
    console.log('radio checked', e.target.value);
  }

  const modalOpts = {
    ...importModalProps,
    onOk: handleOk,
    width: 1000
  }

  const columns = [{
    title: '姓名',
    dataIndex: 'name',
  }, {
    title: '证件号码',
    dataIndex: 'cardCode',
  }, {
    title: '工作单位',
    dataIndex: 'workUnit',
  }, {
    title: '联系电话',
    dataIndex: 'mobile',
  }, {
    title: '执业年限',
    dataIndex: 'workingYears',
  }, {
    title: '业务专长',
    dataIndex: 'goodFields',
  }, {
    title: '奖惩信息',
    dataIndex: 'gloryMemo',
  }, {
    title: '操作',
    key: 'operation',
    render: (text, record) => {
      return <div>
              <Button className={styles.tablebtns} type="primary" onClick={e => handleChoose(record)}>选择</Button>
            </div>
    }
  }]
  
  return (
    <Modal {...modalOpts}>

      <Row gutter={16}>
        <Col {...ColProps} span={6}>
          <FilterItem label="姓名">
            {getFieldDecorator('name')(<Input />)}
          </FilterItem>
        </Col>

        <Col {...ColProps} span={10}>
          <FilterItem label="身份证号码">
            {getFieldDecorator('cardCode')(<Input />)}
          </FilterItem>
        </Col>

        <Col {...TwoColProps} span="1">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div >
              <Button type="primary" onClick={handleSubmit}>搜索</Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row style={{marginBottom:20}}>
        <Table 
          {...importModalProps}
          bordered 
          columns={columns} 
          simple
          rowKey={record => record.seq}
        ></Table>
      </Row>

      {
        showDetail ?
        <div>
          <Form layout="horizontal">
            
            <Row>
              <Col span={6}>
                <FormItem {...formItemLayout} label="姓名">
                  {getFieldDecorator('name')(<Input disabled />)}
                </FormItem>
              </Col>

              <Col span={6}>
                <FormItem {...formItemLayout} label="证件号码">
                  {getFieldDecorator('cardCode')(<Input disabled />)}
                </FormItem>
              </Col>

              <Col span={6}>
                <FormItem {...formItemLayout} label="工作单位">
                  {getFieldDecorator('workUnit')(<Input disabled />)}
                </FormItem>
              </Col>

              <Col span={6}>
                <FormItem {...formItemLayout} label="联系电话">
                  {getFieldDecorator('mobile', {
                    rules: [{
                      required: true,
                      message: '请输入联系电话'
                    }]
                  })(<Input />)}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                <FormItem {...formItemLayout} label="执业年限">
                  {getFieldDecorator('workingYears')(<Input disabled />)}
                </FormItem>
              </Col>

              <Col span={6}>
                <FormItem {...formItemLayout} label="业务专长">
                  {getFieldDecorator('goodFields')(<Input disabled />)}
                </FormItem>
              </Col>

              <Col span={6}>
                <FormItem {...formItemLayout} label="奖惩信息">
                  {getFieldDecorator('gloryMemo')(<Input disabled />)}
                </FormItem>
              </Col>
            </Row>

            <Row style={{display:'none'}}>
              <Col span={6}>
                <FormItem {...formItemLayout} label="法律援助人员ID">
                  {getFieldDecorator('id')(<Input />)}
                </FormItem>
              </Col>

              <Col span={6}>
                <FormItem {...formItemLayout} label="法律援助人员详细信息ID">
                  {getFieldDecorator('hpUserInfoId')(<Input />)}
                </FormItem>
              </Col>

              <Col span={6}>
                <FormItem {...formItemLayout} label="法律援助人员与机构ID">
                  {getFieldDecorator('orgIdentityId')(<Input />)}
                </FormItem>
              </Col>
            </Row>
            
          </Form>
        </div> : ''
      }
      

    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onChoose: PropTypes.func,
}

export default Form.create()(modal)
