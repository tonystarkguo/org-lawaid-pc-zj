import pathToRegexp from 'path-to-regexp'
import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Button, Row, Col, Form, Input, Select, Radio, DatePicker, Card, Checkbox, Icon } from 'antd'
import { config, dateUtil } from '../../../utils'
import styles from './index.less'
const { api } = config

const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const rowItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const AdviceDet = ({
  adviceDet,
  dispatch,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
  }
}) => {

  let item = adviceDet.item || {}
  const { visible } = adviceDet

  const consultHistory = adviceDet.consultHistory || []
  const tGlobalId = JSON.parse(localStorage.getItem('user')).tGlobalId
  const hasContent = consultHistory.length > 0
  const isOpen = item.isOpen == true ? '公开' : '不公开'
  const files = item.files && item.files.map(d => <a target="_blank" key={d.id} href={d.addrUrl}>{d.name}</a>)

  let caseReasons = []
  item && item.caseReasons && item.caseReasons.map(d => {
    caseReasons.push(d.reasonName)
  })

  const handleToggle = (e) => {
    const cardCode = item.cardCode
    const id = item.id
    dispatch({
        type: 'adviceDet/showHistory',
        payload: {
          cardCode: cardCode,
          id: id
        }
    })
  }
  
  const handleEdit = (e) => {
    const match = pathToRegexp('/adviceDet/:id').exec(location.pathname)
    dispatch(routerRedux.push(`/adviceEdit/${match[1]}`))
  }

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  }

  const onChange = (e) => {
    console.log('radio checked', e.target.value);
  }

  const turnBack = (e) => {
    window.history.back(-1)
  }

  const showAddModal = (e) => {
    dispatch({
      type: 'adviceDet/showAddModal',
    })
  }

  const handleSubmit = (e) => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      console.log(data)
      dispatch({
        type: 'adviceDet/submit',
        payload: data,
      })
    })
  }

  return (
    <div>
        <Form className={styles.content}>

          <Row className={styles.mb10}>
            <h2 className={styles.hover} onClick={turnBack}><Icon type="left" />返回咨询查询</h2>
          </Row>

          <Row>

            <Col span={12}>
              <FormItem {...formItemLayout} label="咨询人姓名">
                <p>{item.name}</p>
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem {...formItemLayout} label="咨询时间">
                <p>{dateUtil.convertToDate(item.createTime, 'yyyy-MM-dd hh:mm:ss')}</p>
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem {...formItemLayout} label="联系电话">
                <p>{item.mobile}</p>
              </FormItem>
            </Col>

            {
              item.dicSource == 'telephone' ?
              ''
              :
              <Col span={12}>
                <FormItem {...formItemLayout} label="证件类型">
                  <p>{item.dicCardTypeValue}</p>
                </FormItem>
              </Col>
            }

            <Col span={12}>
              <FormItem {...formItemLayout} label="咨询人性别">
                <p>{item.dicGenderValue}</p>
              </FormItem>
            </Col>

            {
              item.dicSource == 'telephone' ?
              ''
              :
              <Col span={12}>
                <FormItem {...formItemLayout} label="证件号码">
                  <p>{item.cardCode}</p>
                </FormItem>
              </Col>
            }
            
            {
              item.dicSource == 'visit' ?
              <Col span={12}>
                <FormItem {...formItemLayout} label="同来人数">
                  <p>{item.arrivals}</p>
                </FormItem>
              </Col> : ''
            }

            {
              item.dicSource == 'telephone' ?
              ''
              :
              <Col span={12}>
                <FormItem {...formItemLayout} label="出生日期">
                  <p>{dateUtil.convertToDate(item.birthdate, 'yyyy-MM-dd')}</p>
                </FormItem>
              </Col>
            }
            
            {
              item.dicSource == 'telephone' ?
              ''
              :
              <Col span={12}>
                <FormItem {...formItemLayout} label="国家和地区">
                  <p>{item.dicNationalityValue}</p>
                </FormItem>
              </Col>
            }
            
            {
              item.dicSource == 'telephone' ?
              ''
              :
              <Col span={12}>
                <FormItem {...formItemLayout} label="户籍地">
                  <p>{item.regis}</p>
                </FormItem>
              </Col>
            }
            
            {
              item.dicSource == 'telephone' ?
              ''
              :
              <Col span={12}>
                <FormItem {...formItemLayout} label="民族">
                  <p>{item.dicNationValue}</p>
                </FormItem>
              </Col>
            }
            
            {
              item.dicSource == 'telephone' ?
              ''
              :
              <Col span={12}>
                <FormItem {...formItemLayout} label="通讯地址">
                  <p>{item.legalInstAddr}</p>
                </FormItem>
              </Col>
            }
            
            {
              item.dicSource == 'telephone' ?
              ''
              :
              <Col span={12}>
                <FormItem {...formItemLayout} label="文化程度">
                  <p>{item.dicEduLevelValue}</p>
                </FormItem>
              </Col>
            }
            
            <Col span={24}>
              <FormItem {...rowItemLayout} label="咨询人类别">
                <p>{item.dicConsultantCategoryValue}</p>
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem {...formItemLayout} label="咨询标题">
                <p>{item.consultTitle}</p>
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem {...formItemLayout} label="咨询案由">
                <p>{caseReasons.join(',')}</p>
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem {...rowItemLayout} label="咨询内容">
                <p>{item.consultContent}</p>
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem {...formItemLayout} label="处理方式">
                <p>{item.dicTreatmentModeValue}</p>
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem {...formItemLayout} label="答复时间">
                <p>{dateUtil.convertToDate(item.submitTime, 'yyyy-MM-dd hh:mm:ss')}</p>
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem {...rowItemLayout} label="答复意见">
                <p>{item.answerSuggestion}</p>
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem {...formItemLayout} label="是否公开到互联网">
                <p>{isOpen}</p>
              </FormItem>
            </Col>
      
            <Col span={12}>
              <FormItem {...formItemLayout} label="附件">
                <p>{files}</p>
              </FormItem>
            </Col>

            {
              item.tocaList && item.tocaList.length ?
              <Col span={24}>
                <FormItem {...rowItemLayout} label="追加答复">
                  {
                    item.tocaList.map(d => {
                      return (
                        <p key={d.id}>{d.content}</p>
                      )
                    })
                  }
                </FormItem>
              </Col> : ''
            }

            {
              item.canAdditional ?
              <Col span={24}>
                <Button type="primary" onClick={showAddModal}>追加答复</Button>
              </Col> : ''
            }
            
          </Row>

          {
            item.tocaList && item.tocaList.length === 0 && visible === true ?
              <div>
                <Row>
                  <Col span={24}>
                    <FormItem {...rowItemLayout} label="追加答复">
                      {getFieldDecorator('content', {
                        rules: [
                          {
                            required: true,
                            message: '请输入追加答复',
                          },
                        ],
                      })(
                        <TextArea rows={4} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" justify="center">
                  <Col span={4}>
                    <Button type="primary" size="large" onClick={handleSubmit}>提交</Button>
                  </Col>
                </Row>
              </div> : ''
          }
          
        </Form>
    </div>
  )
}

AdviceDet.propTypes = {
  form: PropTypes.object,
  adviceDet: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ adviceDet }) => ({ adviceDet }))(Form.create()(AdviceDet)) 

/*<div>

  {
    item.isSubmit == false && (item.sign && item.sign.signGlobalId == tGlobalId) ?
    <Row type="flex" justify="center">
      <Col span={4}>
        <Button type="primary" size="large" onClick={handleEdit}>编辑</Button>
      </Col>
    </Row>
    :
    ''
  }

  <Row type="flex" justify="left" className={styles.marginBottom}>
    <Button type="primary" size="large" onClick={handleToggle}>同一申请人</Button>
  </Row>

  {
    hasContent ?
    consultHistory.map((item, index) => {
        const history = (
            <Row gutter={16} style={{marginBottom:20}} key={item.id}>
              <Col span={12}>
                <Card>
                  <h4 className={styles.mb10}>{item.consultTitle}</h4>
                  <div>{item.consultContent}</div>
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Row type="flex" justify="start">
                    <Col span={4}>
                      <div className={styles.textCenter}>
                        <img className={styles.cycleImg} alt="头像" width="100%" src={item.headPic} />
                      </div>
                    </Col>
                    <Col span={19} offset={1}>
                      <div className={styles.textLeft}>
                        <h4>{item.answerGlobalName}</h4>
                        <h4>电话：{item.answerMobile}</h4>
                      </div>
                    </Col>
                  </Row>
                  <Row type="flex" justify="start">
                    <Col span={24}>回复意见: {item.answerSuggestion}</Col>
                  </Row>
                </Card>
              </Col>
            </Row>
        )
        return history
    }) : ''
  }
    
</div>*/