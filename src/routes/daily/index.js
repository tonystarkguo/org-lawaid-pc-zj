import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'
import { connect } from 'dva'
import { FilterItem } from '../../components'
import moment from 'moment';
import { message, Tabs, Row, Col, Form, Select, Button, DatePicker, Table } from 'antd';
import { config } from '../../utils'

const Option = Select.Option;
const FormItem = Form.Item
const { api } = config
const TabPane = Tabs.TabPane

const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  },
}

const Daily = ({
  daily,
  dispatch,
  form: {
    getFieldDecorator,
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
    validateFieldsAndScroll,
  },
}) => {
  const { statisticsData, statisticsDataShow, toDoData, toDoDataShow } = daily
  let _caseList = toDoData.caseList || []
  if (_caseList) {
    _caseList.forEach((item, index) => {
      _caseList[index].children = item['list']
    })
  }
  console.log(_caseList)
  const handleTabsChange = (key) => {
    /*dispatch({
      type: 'monitor/tabsChange',
      payload: key,
    })
    dispatch({
      type: 'monitor/getData',
    })*/
    /*dispatch({
      type: 'daily/init',
    })*/
    setFieldsValue({
      startTime: undefined,
    })
  }
  function disabledDate(current) {
    return current && (current.valueOf() > (Date.now() - 1000 * 60 * 60 * 24) || current.valueOf() < 1000 * 60 * 60 * 24 * 365 * (2016 - 1970) + 1000 * 60 * 60 * 24 * 11);
  }

  const token = '&token=' + localStorage.getItem('token');
  const getDailyStatistics = () => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      let fields = getFieldsValue();
      let data = {
        startTime: fields.startTime.format('YYYYMMDD') + '000000',
      }
      dispatch({
        type: 'daily/getDailyStatistics',
        payload: data,
      })
    })
  }
  const downloadDailyStatistics = () => {
    let url = api.baseURL + api.downloadDailyStatistics + '?startTime=' + statisticsData.startTime + '&endTime=' + statisticsData.endTime + token;
    console.log(url)
    window.open(url);
  }
  const getTime = () =>{
    var nowDate = new Date();
    var year = nowDate.getFullYear();
    var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
    var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
    let data = {
      endTime: year + '' + month + '' + day - 1 + '240000'
    }
    return data;
    console.log(data)
  } 
  const getDailyToDo = () => {
    let data = getTime()
    console.log(data)
    dispatch({
      type: 'daily/getDailyToDo',
      payload: data,
    })
  }
  const downloadDailyToDo = () => {
    let data = getTime()
    let url = api.baseURL + api.dowloadTodoDaily + '?endTime=' + data.endTime + token ;
    console.log(url)
    window.open(url);
  }
  
  const columns = [{
    title: '地域',
    dataIndex: 'name',
    key: 'name',
    width: 100,
  }, {
    title: '群众提交网上咨询数（件）',
    dataIndex: 'allCount',
    key: 'allCount',
  }, {
    title: '已答复网上咨询数（件）',
    dataIndex: 'handleCount',
    key: 'handleCount',
  }, {
    title: '未答复网上咨询数（件）',
    dataIndex: 'noHandleCount',
    key: 'noHandleCount',
  }, {
    title: '其中超24小时未答复网上咨询数（件）',
    dataIndex: 'outTimeCount',
    key: 'outTimeCount',
  }];

  const columns2 = [{
    title: '地区',
    dataIndex: 'name',
    key: 'name',
    width: 150,
    render: (text, record, index) => {
      return <div style={record.parent ? { textAlign: 'left' } : { textAlign: 'center' }}>{text}</div>
    }
  }, {
    title: '群众网上提交案件申请数（件）',
    dataIndex: 'allCount',
    key: 'allCount',
  }, {
    title: '已预审案件数（件）',
    dataIndex: 'handleCount',
    key: 'handleCount',
  }, {
    title: '未预审案件数（件）',
    dataIndex: 'noHandleCount',
    key: 'noHandleCount',
  }, {
    title: '其中超24小时未预审案件数（件）',
    dataIndex: 'outTimeCount',
    key: 'outTimeCount',
  }];

  return (
    <Tabs onChange={handleTabsChange}>
      <TabPane tab="咨询、案件日报" key="1">
        <div className={styles.daily}>
          <Form>
            <Row className={styles.selectRow} gutter={16}>
              <Col span={8}>
                <FormItem {...formItemLayout} label="选择日期:">
                  {getFieldDecorator('startTime', {
                    rules: [{ required: true, message: '请选择日期' }],
                  })(
                    <DatePicker
                      disabledDate={disabledDate}
                    />
                    )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem>
                  <Button type="primary" onClick={getDailyStatistics}>开始分析</Button>
                </FormItem>
              </Col>
              <Col span={3}>
                {statisticsDataShow &&
                  <FormItem>
                    <Button type="primary" onClick={downloadDailyStatistics}>下载当前日报</Button>
                  </FormItem>
                }
              </Col>
            </Row>
          </Form>
          <div className={styles.dataView} id='dailyView'></div>
        </div>
      </TabPane>
      <TabPane tab="每日通报" key="2">
        <div className={styles.daily}>
          <Form>
            <Row className={styles.selectRow} gutter={16}>

              <Col span={3}>
                <FormItem>
                  <Button type="primary" onClick={getDailyToDo}>开始分析</Button>
                </FormItem>
              </Col>
              <Col span={3}>
                {toDoDataShow &&
                  <FormItem>
                    <Button type="primary" onClick={downloadDailyToDo}>下载当前日报</Button>
                  </FormItem>
                }
              </Col>
            </Row>
          </Form>
          {
            toDoDataShow &&
            <div>
              <h2 style={{ textAlign: 'center' }}>浙江省全省法律援助待办件统计日报</h2>
              <h3>截止至{toDoData.time}，全省待办网上留言剩余{toDoData.provinceConsultCount}件，各类法律援助待预审申请剩余{toDoData.provinceCaseCount}件。详细情况如下：</h3>
              <Table
                style={{ marginTop: '20px' }}
                bordered
                rowKey={record => record.cityName}
                dataSource={toDoData.consultList} 
                columns={columns} 
                pagination={false}
              />
              <Table
                style={{ marginTop: '20px' }}
                bordered
                rowKey={record => record.name}
                dataSource={_caseList} 
                columns={columns2} 
                pagination={false}
                defaultExpandAllRows={true}
                indentSize={8}
              />
            </div>
          }
        </div>
      </TabPane>
    </Tabs>
  )
}

export default connect(({ daily }) => ({ daily }))(Form.create()(Daily))
