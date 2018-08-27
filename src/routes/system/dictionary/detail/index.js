import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import {Steps, Tabs, Form, Input, Select, Button, Row, Col, Radio, Timeline, Icon} from 'antd'
import { Filter } from '../../../components'
import Flowcharts from '../../../components/Flowcharts/Flowcharts.js'
import ApproveCom from '../../../components/ApproveCom/ApproveCom.js'
import FlowDetail from '../../../components/FlowDetail/FlowDetail.js'
const TabPane = Tabs.TabPane;
const Step = Steps.Step
const FormItem = Form.Item
const RadioGroup = Radio.Group;

const Detail = ({ lawcaseDetail }) => {
  const { data, flowNodes, currentNodeNum } = lawcaseDetail
  const nodeInfo = {flowNodes, currentNodeNum}
  const content = []
  for (let key in data) {
    if ({}.hasOwnProperty.call(data, key)) {
      content.push(<div key={key} className={styles.item}>
        <div>{key}</div>
        <div>{String(data[key])}</div>
      </div>)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const handleChange = (value) => {
    // console.log(`selected ${value}`);
  }

  const onChange = (e) => {
    // this.setState({
    //   value: e.target.value,
    // });
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const leftFormItemLayout = {
    labelCol: {
      xs: { span: 10 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 14 },
      sm: { span: 14 },
    },
  };

  const rightFormItemLayout = {
    labelCol: {
      xs: { span: 10 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 14 },
      sm: { span: 8 },
    },
  };



  return (

  <div className="content-inner content-container">

    <Flowcharts {...nodeInfo} />
    <FlowDetail />
    <ApproveCom />
    
    <div className="card-container">
      <Tabs type="card">
        <TabPane className="tabpanel" tab="申请主体基本信息" key="1">
          <Form layout="horizontal" onSubmit={handleSubmit} className="login-form">
            <Row className={styles.pannelhr} gutter={16}>
              <Col className="gutter-row" span={12}>
                <div className="gutter-box">
                  <FormItem {...leftFormItemLayout} label="受援主体">
                      <Select size="large" defaultValue="1" style={{ width: 200 }} onChange={handleChange}>
                        <Select.Option value="1">中国公民</Select.Option>
                        <Select.Option value="2">港澳同胞</Select.Option>
                        <Select.Option value="3">台湾同胞</Select.Option>
                      </Select>
                  </FormItem>
                </div>
              </Col>
              <Col className="gutter-row" span={12}>
                <div className="gutter-box">
                    <FormItem {...leftFormItemLayout} label="来源渠道">
                      <Input size="large" placeholder="请输入来源渠道" />
                    </FormItem>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={12}>
                <div className="gutter-box">
                    <FormItem {...leftFormItemLayout} label="申请主体">
                      <Input size="large" placeholder="请输入申请主体" />
                    </FormItem>
                    <FormItem {...leftFormItemLayout} label="性别">
                      <RadioGroup onChange={onChange} value={2}>
                        <Radio value={1}>男</Radio>
                        <Radio value={2}>女</Radio>
                      </RadioGroup>
                    </FormItem>
                    <FormItem {...leftFormItemLayout} label="国籍/地区">
                      <Select size="large" defaultValue="1" style={{ width: 200 }} onChange={handleChange}>
                        <Select.Option value="1">中国</Select.Option>
                        <Select.Option value="2">美国</Select.Option>
                        <Select.Option value="3">澳大利亚</Select.Option>
                      </Select>
                      <Select size="large" defaultValue="1" style={{ width: 200 }} onChange={handleChange}>
                        <Select.Option value="1">广东省</Select.Option>
                        <Select.Option value="2">上海</Select.Option>
                        <Select.Option value="3">北京</Select.Option>
                      </Select>
                    </FormItem>
                    <FormItem {...leftFormItemLayout} label="民族">
                      <Select size="large" defaultValue="1" style={{ width: 200 }} onChange={handleChange}>
                        <Select.Option value="1">汉族</Select.Option>
                        <Select.Option value="2">回族</Select.Option>
                        <Select.Option value="3">藏族</Select.Option>
                      </Select>
                    </FormItem>
                    <FormItem {...leftFormItemLayout} label="文化程度">
                       <Input size="large" placeholder="请输入文化程度" />
                    </FormItem>
                    <FormItem {...leftFormItemLayout} label="单位">
                       <Input size="large" placeholder="请输入单位" />
                    </FormItem>
                    <FormItem {...leftFormItemLayout} label="职业">
                       <Input size="large" placeholder="请输入职业" />
                    </FormItem>
                    <FormItem {...leftFormItemLayout} label="申请主体标签">
                       <Input size="large" placeholder="申请主体标签" />
                    </FormItem>
                    <FormItem {...leftFormItemLayout} label="备注">
                       <Input type="textArea" rows={4} placeholder="备注" />
                    </FormItem>

                </div>
              </Col>
              <Col className="gutter-row" span={12}>
                <div className="gutter-box">
                    <FormItem {...leftFormItemLayout} label="证件类型">
                      <Select size="large" defaultValue="1" style={{ width: 200 }} onChange={handleChange}>
                        <Select.Option value="1">身份证</Select.Option>
                        <Select.Option value="2">护照</Select.Option>
                        <Select.Option value="3">台胞证</Select.Option>
                      </Select>
                    </FormItem>
                    <FormItem {...leftFormItemLayout} label="证件号">
                       <Input size="large" placeholder="请输入证件号" />
                    </FormItem>
                    <FormItem {...leftFormItemLayout} label="联系电话">
                       <Input size="large" placeholder="请输入电话" />
                    </FormItem>
                    <FormItem {...leftFormItemLayout} label="户籍所在地">
                       <Input size="large" placeholder="请输入户籍" />
                    </FormItem>
                    <FormItem {...leftFormItemLayout} label="常驻地">
                       <Input size="large" placeholder="请输入常驻地" />
                    </FormItem>
                    <FormItem {...leftFormItemLayout} label="文书送达方式">
                      <Select size="large" defaultValue="1" style={{ width: 200 }} onChange={handleChange}>
                        <Select.Option value="1">邮寄</Select.Option>
                        <Select.Option value="2">自取</Select.Option>
                      </Select>
                    </FormItem>
                    <FormItem {...leftFormItemLayout} label="文书邮寄地址">
                       <Input size="large" placeholder="请输入文书邮寄地址" />
                    </FormItem>
                    <FormItem {...leftFormItemLayout} label="邮编">
                       <Input size="large" placeholder="请输入邮编" />
                    </FormItem>
                </div>
              </Col>
            </Row>
          </Form>
        </TabPane>
        <TabPane className="tabpanel" tab="经济情况" key="2">
          {content}
        </TabPane>
        <TabPane className="tabpanel" tab="援助事项信息" key="3">
          {content}
        </TabPane>
        <TabPane className="tabpanel" tab="文件材料" key="4">
          {content}
        </TabPane>
        <TabPane className="tabpanel" tab="操作日志" key="5">
          <Timeline>
            <Timeline.Item>
              <p>完成申请 2015-09-01</p>
              <p>穗粤法申行(2017)302号</p>
              <p>线上申请</p>
            </Timeline.Item>
            <Timeline.Item>
              <p>完成申请 2015-09-01</p>
              <p>穗粤法申行(2017)302号</p>
              <p>线上申请</p>
            </Timeline.Item>
            <Timeline.Item dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />} color="red">
              <p>完成申请 2015-09-01</p>
              <p>穗粤法申行(2017)302号</p>
              <p>线上申请</p>
            </Timeline.Item>
            <Timeline.Item>
              <p>完成申请 2015-09-01</p>
              <p>穗粤法申行(2017)302号</p>
              <p>线上申请</p>
            </Timeline.Item>
          </Timeline>
        </TabPane>
      </Tabs>
    </div>
  </div>)
}

Detail.propTypes = {
  lawcaseDetail: PropTypes.object,
  loading: PropTypes.bool,
  form: PropTypes.object
}

export default connect(({ lawcaseDetail, loading, form }) => ({ lawcaseDetail, form, loading: loading.models.lawcaseDetail }))(Detail)
