/*
本component是处理案件详情中审批操作用的，根据案件的状态有以下操作
1，线上审查
2，发起竞价
3，推荐法律援助人员
4，评价
5，发起归档
 */
import React from 'react'
import PropTypes from 'prop-types'
import styles from './ApproveCom.less'
import {createDicNodes, jsUtil} from '../../utils'
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Table,
  Tooltip,
  Card,
  message,
  Icon,
  Tag,
  Radio
} from 'antd'
const FormItem = Form.Item
const Option = Select.Option
const {createSelectOption} = createDicNodes
const RadioGroup = Radio.Group;
const ApproveCom = ({
  caseDetail,
  onSelectChange,
  onSubmitRecBiders,
  onDeleteAidPeople,
  onsetMainLawyer,
  onShowData,
  toNextStep,
  onchangeContent,
  onSearchLawyers,
  handleSearch,
  lawTableProps,
  onAddNewLawyer,
  onSubmitToEndCase,
  form: {
    getFieldDecorator,
    setFieldsValue,
    validateFields,
    getFieldsValue,
    getFieldValue,					
  },
}) => {
  // const labelArray = label.split('') 案件状态
  const {
    caseStatus,
    GoodAtDomains = [],
    selectedLawyers = [],
    lawfirmList = [],
  } = caseDetail || {}
  const lawyerList = caseDetail.flowDetail.lawyerList || []

  let goodAtDomains = []

  GoodAtDomains.map(value => {
    value
      .tags
      .map(d => {
        goodAtDomains.push(d)
        return d
      })
    return value
  })

  const {allConfig, caseBaseInfoData, caseApplyerInfoData } = caseDetail
  const {dictData} = allConfig
  const initNumber = caseBaseInfoData.number
  const initCaseYear = caseBaseInfoData.caseYear

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 12,
      },
      sm: {
        span: 4,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  }
  const RadioformItemLayout = {
    labelCol: {
      xs: {
        span: 10,
      },
      sm: {
        span: 12,
      },
    },
    // wrapperCol: {
    //   xs: {
    //     span: 24,
    //   },
    //   sm: {
    //     span: 16,
    //   },
    // },
  }
  const leftFormItemLayout = {
    labelCol: {
      xs: {
        span: 18,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 14,
      },
      sm: {
        span: 14,
      },
    },
  }
  const otherFormItemLayout = {
    labelCol: {
      xs: {
        span: 16,
      },
      sm: {
        span: 16,
      },
    },
    wrapperCol: {
      xs: {
        span: 8,
      },
      sm: {
        span: 8,
      },
    },
  }

  let result = ''

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  const changeContent = (e) => {
    let value = e.target.value
    onchangeContent(value)
  }

  const provideRecBiders = () => {
    onSubmitRecBiders(selectedLawyers)
  }

  const addNewLawyer = () => {
    onAddNewLawyer()
  }

  const dataHandle = () => {
    onShowData()
  }

  // 预审状态-提交至受理
  const onNextStep = () => {
    validateFields((errors) => {
      if(caseBaseInfoData.caseReasonId.length == 0){
        message.warning('请填写案由')
        return
      }else if(caseBaseInfoData.caseAidWayCode == null){
        message.warning('请填写援助方式')
        return
      }else if(caseBaseInfoData.caseStepCode == null){
        message.warning('请填写法律状态及地位')
        return
      }else if(caseApplyerInfoData.dicConsultantCategory == null){
        message.warning('请填写人群类别')
        return
      } else if (errors) {
        return
      }
      let appResult = getFieldValue('dicConclusion')
      if (appResult === '2') {
        // 选择的需补充材料
        onShowData()
      } else {
        /* if(caseReasonId.length === 0){
          message.error('请选择事项申请信息中的案由！')
          return
        }*/
       let caseNum = ''
        let data = {}
        if(getFieldValue('caseNo') && getFieldValue('caseYear') && getFieldValue('number')){
          caseNum = getFieldValue('caseNo')+'['+getFieldValue('caseYear')+']'+getFieldValue('number')+'号'
        }
        // console.log(getFieldValue('number') === initNumber && getFieldValue('caseYear') === initCaseYear)
        if(getFieldValue('number') === initNumber && getFieldValue('caseYear') === initCaseYear){
          data = {
            ...getFieldsValue(),
          }
        }else{
          data = {
            ...getFieldsValue(),
            caseNum: caseNum,
          }
        }
        toNextStep(data)
      }
    })
  }

  // 审批 —— 审批通过
  const onPass = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      let appResult = getFieldValue('dicConclusion')
      if (appResult === '2') {
        // 选择的需补充材料
        onShowData()
      } else {
        /* if(caseReasonId.length === 0){
          message.error('请选择事项申请信息中的案由！')
          return
        }*/
        let caseNum = ''
        let data = {}
        if(getFieldValue('dic_caseNo') && getFieldValue('dic_caseYear') && getFieldValue('dic_number')){
          caseNum = getFieldValue('dic_caseNo')+'['+getFieldValue('dic_caseYear')+']'+getFieldValue('dic_number')+'号'
        }
        // console.log(getFieldValue('number') === initNumber && getFieldValue('caseYear') === initCaseYear)
        if(getFieldValue('dic_number') === initNumber && getFieldValue('dic_caseYear') === initCaseYear){
          data = {
            ...getFieldsValue(),
          }
        }else{
          data = {
            ...getFieldsValue(),
            caseNum: caseNum,
          }
        }
        // console.log(data)
        toNextStep(data)
      }
    })
  }

  // 点击删除选择援助人功能
  const deleteAidPeople = (tag) => {
    let tagId = tag.id
    onDeleteAidPeople(tagId)
  }

    // 点击选择主承办人
    const setMainLawyer = (tag) => {
      let tagId = tag.id
      onsetMainLawyer(tagId)
    }

  const sumitEndCase = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      onSubmitToEndCase(data)
    })
  }

  const searchLawyers = () => {
    const data = {
      ...getFieldsValue(),
    }
    if (data.name === '' && data.cardCode === '') {
      message.warning('请输入关键字')
    } else {
      onSearchLawyers(data)
    }
  }

  const selectHp = (hp) => {
    onSelectChange(hp)
  }

  // 推荐法律援助人员相关
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
    }, {
      title: '证件号码',
      dataIndex: 'cardCode',
    }, {
      title: '工作单位',
      dataIndex: 'lawfirmName',
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
    }, 
    // {
    //   title: '操作',
    //   key: 'operation',
    //   render: (text, record) => {
    //     return (<div>
    //       <Button
    //         className={styles.tablebtns}
    //         type="primary"
    //         onClick={() => selectHp(record)}
    //       >
    //         选择
    //       </Button>
    //     </div>)
    //   },
    // },
  ]
  const hasSelected = !jsUtil.isNull(selectedLawyers)
  let tempSelectedLawyers = []
  if (hasSelected) {
    tempSelectedLawyers = selectedLawyers
  }
  const options = lawfirmList.map(d => <Option key={d.id}>{d.name}</Option>)
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };
  switch (caseStatus) {
    case '1'://网上申请待预审
      result = (
        <div className={styles.appSec}>
          <Form onSubmit={handleSubmit} className="login-form">
            <FormItem {...formItemLayout} label="预审意见">
              {getFieldDecorator('comment', {
                rules: [
                  {
                    required: false,
                    message: '请输入预审意见',
                  },
                ],
              })(<Input type="textarea" placeholder="请输入" rows={4} onChange={changeContent} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="预审结论">
              {getFieldDecorator('dicConclusion', {
                rules: [
                  {
                    required: false,
                    message: '请选择预审结论',
                  },
                ],
              })(
                <Select placeholder="选择">
                  {createSelectOption({list: dictData.dic_dicPreConcl})}
                  {/*<Option value="1">同意法援</Option>
                                    <Option value="2">需补充材料</Option>
                                    <Option value="3">不同意，不属于本法律援助中心管辖</Option>
                                    <Option value="4">不同意，不属于法律援助事项范围</Option>
                                    <Option value="5">不同意，不符合经济困难条件</Option>*/}
                </Select>
              )}

            </FormItem>
            {getFieldValue('dicConclusion') == 1 ?
              <Row gutter={24}>
                <Col span={16} >
                  <FormItem {...formItemLayout} label="受援人短信">
                    {getFieldDecorator('sms', {
                    })(<Input type="textarea" rows={3} onChange={changeContent} />)}
                  </FormItem>
                </Col>
                <Col span={8} >
                  <FormItem
                    {...RadioformItemLayout}
                    label="是否发送给受援人"
                  >
                    {getFieldDecorator('sendState', {
                      rules: [{
                        required: true,
                        message: '是否发送给受援人'
                      }],
                    })(
                      <RadioGroup>
                        <Radio style={radioStyle} value={1}>发送</Radio>
                        <Radio style={radioStyle} value={0}>不发送</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
              </Row> : null
            }
            <Row
              type="flex"
              justify="center"
              style={{
              marginBottom: 20,
            }}>
              <Button
                type="primary"
                size="large"
                className={styles.envBtns}
                onClick={onNextStep}>提交</Button>
            </Row>
          </Form>
        </div>
      )
      break
    case '2': // 预审-需补充材料（受援人端展示）
      result = (
        <div>
          <Form onSubmit={handleSubmit} className="login-form">
            <Row
              type="flex"
              justify="center"
              style={{
              marginBottom: 20,
            }}>
              <Button
                type="primary"
                size="large"
                className={styles.envBtns}
                onClick={dataHandle}>需补充材料</Button>
              <Button
                type="primary"
                size="large"
                className={styles.envBtns}
                onClick={onNextStep}>确认受理，提交初审</Button>
            </Row>
          </Form>
        </div>
      )
      break
    case '7': // 初审不通过-需补充材料
      result = (
        <div>
          <Form onSubmit={handleSubmit} className="login-form">
            <Row
              type="flex"
              justify="center"
              style={{
              marginBottom: 20,
            }}>
              <Button
                type="primary"
                size="large"
                className={styles.envBtns}
                onClick={dataHandle}>需补充材料</Button>
              <Button
                type="primary"
                size="large"
                className={styles.envBtns}
                onClick={onNextStep}>确认受理，提交初审</Button>
            </Row>
          </Form>
        </div>
      )
      break

    case '3': // 待初审
      result = (
        <div className={styles.appSec}>
          <Form onSubmit={handleSubmit} className="login-form">
            <FormItem {...formItemLayout} label="处理意见">
              {getFieldDecorator('comment', {
                rules: [
                  {
                    required: false,
                    message: '请输入处理意见',
                  },
                ],
              })(<Input type="textarea" placeholder="请输入" rows={4} onChange={changeContent} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="初审结论">
              {getFieldDecorator('dicConclusion', {
                initialValue: '1',
                rules: [
                  {
                    required: false,
                    message: '请选择初审结论',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {createSelectOption({list: dictData.dic_dic_first_conclusion})}
                  {/*<Option value="1">同意法援</Option>
                                    <Option value="3">不同意，不属于本法律援助中心管辖</Option>
                                    <Option value="4">不同意，不属于法律援助事项范围</Option>
                                    <Option value="5">不同意，不符合经济困难条件</Option>*/}
                </Select>
              )}
            </FormItem>

            <Row
              type="flex"
              justify="center"
              style={{
              marginBottom: 20,
            }}>
              <Button
                type="primary"
                size="large"
                className={styles.envBtns}
                onClick={onNextStep}>提交</Button>
            </Row>
          </Form>
        </div>
      )
      break
    case '8': // 待审查-通过
      result = (
        <div className={styles.appSec}>
          <Form onSubmit={handleSubmit} className="login-form">
            <FormItem {...formItemLayout} label="处理意见">
              {getFieldDecorator('opinion', {
                rules: [
                  {
                    required: false,
                    message: '请输入处理意见',
                  },
                ],
              })(<Input type="textarea" placeholder="请输入" rows={4} onChange={changeContent} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="审查结论">
              {getFieldDecorator('dicCensorConclusion', {
                initialValue: '1',
                rules: [
                  {
                    required: true,
                    message: '请选择结论',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {createSelectOption({list: dictData.dic_dic_investigate_conclusion})}
                  {/*<Option value="1">同意法援</Option>
                                    <Option value="3">不同意，不属于本法律援助中心管辖</Option>
                                    <Option value="4">不同意，不属于法律援助事项范围</Option>
                                    <Option value="5">不同意，不符合经济困难条件</Option>*/}
                </Select>
              )}
            </FormItem>
            <Row>
              <FormItem {...otherFormItemLayout} label="案件编号" style={{display:'inline-block', width:170}}>
                {getFieldDecorator('caseNo', {
                  initialValue: caseBaseInfoData.caseNo,
                })(
                  <Input size="large" style={{border:'none',outline:'none'}} />
                )}
              </FormItem>
              <FormItem style={{display:'inline-block', width:5}}>
                <span>[</span>
              </FormItem>
              <FormItem style={{display:'inline-block', width:80}}>
                {getFieldDecorator('caseYear', {
                  initialValue: caseBaseInfoData.caseYear,
                  rules: [{ 
                    pattern: /^[0-9]{1,4}$/, 
                    message: "最多只能输入4位数字" 
                  }],
                })(
                  <Input size="large" />
                )}
              </FormItem>
              <FormItem style={{display:'inline-block', width:5}}>
                <span>]</span>
              </FormItem>
              <FormItem style={{display:'inline-block', width:80}}>
                {getFieldDecorator('number', {
                  initialValue: caseBaseInfoData.number,
                  rules: [{ 
                    pattern: /^[0-9]{1,4}$/,
                    message: "最多只能输入4位数字" 
                  }],
                })(
                  <Input size="large" />
                )}
              </FormItem>
              <FormItem style={{display:'inline-block', width:5}}>
                <span>号</span>
              </FormItem>
            </Row>
            <Row
              type="flex"
              justify="center"
              style={{
              marginBottom: 20,
            }}>
              <Button
                type="primary"
                size="large"
                className={styles.envBtns}
                onClick={onNextStep}>提交</Button>
            </Row>
          </Form>
        </div>
      )
      break

    case '9': // 待审查-初审不通过
      result = (
        <div className={styles.appSec}>
          <Form onSubmit={handleSubmit} className="login-form">
            <FormItem {...formItemLayout} label="处理意见">
              {getFieldDecorator('opinion', {
                rules: [
                  {
                    required: false,
                    message: '请输入处理意见',
                  },
                ],
              })(<Input type="textarea" placeholder="请输入" rows={4} onChange={changeContent} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="审查结论">
              {getFieldDecorator('dicCensorConclusion', {
                rules: [
                  {
                    required: true,
                    message: '请选择审查结论',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {createSelectOption({list: dictData.dic_dic_investigate_conclusion})}
                  {/*<Option value="1">同意法援</Option>
                                    <Option value="3">不同意，不属于本法律援助中心管辖</Option>
                                    <Option value="4">不同意，不属于法律援助事项范围</Option>
                                    <Option value="5">不同意，不符合经济困难条件</Option>*/}
                </Select>
              )}
            </FormItem>
            <Row
              type="flex"
              justify="center"
              style={{
              marginBottom: 20,
            }}>
              <Button
                type="primary"
                size="large"
                className={styles.envBtns}
                onClick={onNextStep}>提交</Button>
            </Row>
          </Form>
        </div>
      )
      break

    case '10': // 待审批-审查通过
      result = (
        <div className={styles.appSec}>
          <Form onSubmit={handleSubmit} className="login-form">
            <FormItem {...formItemLayout} label="处理意见">
              {getFieldDecorator('opinion'/*, {
                rules: [
                  {
                    required: true,
                    message: '请输入处理意见',
                  },
                ],
              }*/)(<Input type="textarea" placeholder="请输入" rows={4} onChange={changeContent} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="审批结论">
              {getFieldDecorator('dicReauditConclusion', {
                rules: [
                  {
                    required: true,
                    message: '请选择审批结论',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {createSelectOption({list: dictData.dic_dic_reaudit_conclusion})}
                  {/*<Option value="1">同意法援</Option>
                  <Option value="3">不同意，不属于本法律援助中心管辖</Option>
                  <Option value="4">不同意，不属于法律援助事项范围</Option>
                  <Option value="5">不同意，不符合经济困难条件</Option>*/}
                  
                </Select>
              )}
            </FormItem>
            {getFieldValue('dicReauditConclusion') == 1 ?
                <Row gutter={24}>
                   <Col span={16} >
                     <FormItem {...formItemLayout} label="受援人短信">
                       {getFieldDecorator('sms', {
                       })(<Input type="textarea" rows={4} onChange={changeContent} />)}
                     </FormItem>
                   </Col>
                   <Col span={8} >
                          <FormItem
                            {...RadioformItemLayout}
                            label="是否发送给受援人"
                          >
                            {getFieldDecorator('sendState', {
                              rules: [{
                                required: true,
                                message: '是否发送给受援人'
                              }],
                            })(
                              <RadioGroup>
                                <Radio style={radioStyle} value={1}>发送</Radio>
                                <Radio style={radioStyle} value={0}>不发送</Radio>
                              </RadioGroup>
                              )}
                          </FormItem>
                   </Col>
              </Row> : null     
            }
            <Row>
              <FormItem {...otherFormItemLayout} label="案件编号" style={{display:'inline-block', width:170}}>
                {getFieldDecorator('dic_caseNo', {
                  initialValue: caseBaseInfoData.caseNo,
                })(
                  <Input size="large" style={{border:'none',outline:'none'}} />
                )}
              </FormItem>
              <FormItem style={{display:'inline-block', width:5}}>
                <span>[</span>
              </FormItem>
              <FormItem style={{display:'inline-block', width:80}}>
                {getFieldDecorator('dic_caseYear', {
                  initialValue: caseBaseInfoData.caseYear,
                  rules: [{ 
                    pattern: /^[0-9]{1,4}$/, 
                    message: "最多只能输入4位数字" 
                  }],
                })(
                  <Input size="large" />
                )}
              </FormItem>
              <FormItem style={{display:'inline-block', width:5}}>
                <span>]</span>
              </FormItem>
              <FormItem style={{display:'inline-block', width:80}}>
                {getFieldDecorator('dic_number', {
                  initialValue: caseBaseInfoData.number,
                  rules: [{ 
                    pattern: /^[0-9]{1,4}$/,
                    message: "最多只能输入4位数字" 
                  }],
                })(
                  <Input size="large" />
                )}
              </FormItem>
              <FormItem style={{display:'inline-block', width:5}}>
                <span>号</span>
              </FormItem>
            </Row>
            <Row
              type="flex"
              justify="center"
              style={{
              marginBottom: 20,
            }}>
              <Button
                type="primary"
                size="large"
                className={styles.envBtns}
                onClick={onPass}>提交</Button>
            </Row>
          </Form>
        </div>
      )
      break

    case '11': // 待审批-审查不通过
      result = (
        <div className={styles.appSec}>
          <Form onSubmit={handleSubmit} className="login-form">
            <FormItem {...formItemLayout} label="处理意见">
              {getFieldDecorator('opinion'/*, {
                rules: [
                  {
                    required: true,
                    message: '请输入处理意见',
                  },
                ],
              }*/)(<Input type="textarea" placeholder="请输入" rows={4} onChange={changeContent} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="审批结论">
              {getFieldDecorator('dicReauditConclusion', {
                rules: [
                  {
                    required: true,
                    message: '请选择审批结论',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {createSelectOption({list: dictData.dic_dic_reaudit_conclusion})}
                  {/*<Option value="1">同意法援</Option>
                                    <Option value="3">不同意，不属于本法律援助中心管辖</Option>
                                    <Option value="4">不同意，不属于法律援助事项范围</Option>
                                    <Option value="5">不同意，不符合经济困难条件</Option>*/}
                </Select>
              )}
            </FormItem>
            {getFieldValue('dicReauditConclusion') == 1 ?
                <Row gutter={24}>
                   <Col span={16} >
                     <FormItem {...formItemLayout} label="受援人短信">
                       {getFieldDecorator('sms', {
                       })(<Input type="textarea" rows={4} onChange={changeContent} />)}
                     </FormItem>
                   </Col>
                   <Col span={8} >
                          <FormItem
                            {...RadioformItemLayout}
                            label="是否发送给受援人"
                          >
                            {getFieldDecorator('sendState', {
                              rules: [{
                                required: true,
                                message: '是否发送给受援人'
                              }],
                            })(
                              <RadioGroup>
                                <Radio style={radioStyle} value={1}>发送</Radio>
                                <Radio style={radioStyle} value={0}>不发送</Radio>
                              </RadioGroup>
                              )}
                          </FormItem>
                   </Col>
              </Row> : null     
            }
            <Row
              type="flex"
              justify="center"
              style={{
              marginBottom: 20,
            }}>
              <Button
                type="primary"
                size="large"
                className={styles.envBtns}
                onClick={onNextStep}>提交</Button>
            </Row>
          </Form>
        </div>
      )
      break

    case '12': // 待指派
      result = (
        <div className={styles.appSec}>
          <Card title="请选择法律援助人员" bordered={false}>
            <Form onSubmit={handleSubmit} className="login-form">
              <Row gutter={24}>
                <Col span={12}>
                  <FormItem {...leftFormItemLayout} label="姓名">
                    {getFieldDecorator('name')(<Input size="large" />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...leftFormItemLayout} label="法律服务机构">
                    {getFieldDecorator('lawfirmName')(
                     <Input onChange={changeContent} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <FormItem {...leftFormItemLayout} label="法律援助人员类型">
                    {getFieldDecorator('dicLawyerType')(
                      <Select size="large" allowClear>
                        {createSelectOption({list: dictData.dic_lawyer_type})}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row
                type="flex"
                justify="center"
                style={{
                marginBottom: '10px',
              }}>
                <Button type="primary" onClick={searchLawyers}>搜索</Button>
              </Row>

              <Table
                bordered
                rowKey={record => record.id}
                {...lawTableProps}
                columns={columns}
                dataSource={lawyerList}></Table>
               
              {lawyerList.length === 0
                ? <div>
                    <Row
                      type="flex"
                      justify="center"
                      style={{
                      marginTop: 20,
                    }}>
                      <Button type="primary" onClick={addNewLawyer}>添加新的法律援助人员</Button>
                    </Row>
                  </div>
                : <div></div>
              }
              {hasSelected
                ? <div>
                  <Row type="flex" justify="left" className={styles.recbiderRow}>
                    
                    {tempSelectedLawyers.map((tag, index) => {
                      let tagKey = tag.key || ''
                      let tagName = tag.name || ''
                      let tagUnit = tag.workUnit || ''
                      let tagImg = tag.headPic || ''
                      const isLongTag = (tagName.length > 20)
                      const tagElem = (
                        <div key={index} className={styles.grid}>
                          <Row>
                            <Col span={20}>
                            <Tag color="blue" onClick={()=> setMainLawyer(tag)} >      
                            {tag.isMain==1?'主承办人':'设为主承办人'}
                            
                            </Tag>
                              {/* {index === 0? <Tag color="blue">主承办人</Tag>:''} */}
                              <div className={styles.cell}>
                                <div className={styles.customimage}>
                                  <img className={styles.cycleImg} alt="头像" src={tagImg}></img>
                                </div>
                              </div>
                              <div className={styles.cell}>
                                {isLongTag
                                  ? `${tagName.slice(0, 20)}...`
                                  : tagName}
                              </div>
                              <div className={styles.cell}>
                                {isLongTag
                                  ? `${tagUnit.slice(0, 20)}...`
                                  : tagUnit}
                              </div>
                            </Col>
                            <Col span={4}>
                              <Icon type="close" onClick={()=> deleteAidPeople(tag)}  key={index} />
                            </Col>
                          </Row>

                        </div>
                      )
                      return isLongTag
                        ? <Tooltip>{tagElem}</Tooltip>
                        : tagElem
                    })}
                  </Row>
                  <Row gutter={24}>
                    <Col span={16} >
                      <FormItem {...formItemLayout} label="受援人短信">
                        {getFieldDecorator('smsToRp', {
                        })(<Input type="textarea" rows={4} onChange={changeContent} />)}
                      </FormItem>
                    </Col>
                    <Col span={8} >
                      <FormItem
                        {...RadioformItemLayout}
                        label="是否发送给受援人"
                      >
                        {getFieldDecorator('rpSendState', {
                          rules: [{
                            required: true,
                            message: '是否发送给受援人'
                          }],
                        })(
                          <RadioGroup>
                            <Radio style={radioStyle} value={1}>发送</Radio>
                            <Radio style={radioStyle} value={0}>不发送</Radio>
                          </RadioGroup>
                          )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={16} >
                      <FormItem {...formItemLayout} label="援助人短信">
                        {getFieldDecorator('smsToHp', {
                        })(<Input type="textarea" rows={4} onChange={changeContent} />)}
                      </FormItem>
                    </Col>
                    <Col span={8} >
                      <FormItem
                        {...RadioformItemLayout}
                        label="是否发送给援助人"
                      >
                        {getFieldDecorator('hpSendState', {
                          rules: [{
                            required: true,
                            message: '是否发送给援助人'
                          }],
                        })(
                          <RadioGroup>
                            <Radio style={radioStyle} value={1}>发送</Radio>
                            <Radio style={radioStyle} value={0}>不发送</Radio>
                          </RadioGroup>
                          )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row type="flex" justify="center">
                    <Button type="primary" onClick={provideRecBiders}>确认指派</Button>
                  </Row>
                </div>
                : ''
              }
            </Form>
          </Card>
        </div>
      )
      break
      
    case '16': // 待结案审核
      result = (
        <div className={styles.appSec}>
          <Card title="结案审核" bordered={false}>
            <Form onSubmit={handleSubmit} className="login-form">
              <FormItem {...formItemLayout} label="结案审核结论">
                {getFieldDecorator('status', {
                  initialValue: '1',
                  rules: [
                    {
                      required: true,
                      message: '请选择结案审核结论',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    <Option value="1">通过</Option>
                    <Option value="0">不通过</Option>
                  </Select>
                )}
              </FormItem>
              {
                getFieldValue('status') === '0'?<FormItem {...formItemLayout} label="不通过原因">
                {getFieldDecorator('unthroughReason', {
                  rules: [
                    {
                      required: true,
                      message: '请输入不通过原因',
                    },
                  ],
                })(<Input type="textarea" placeholder="请输入不通过原因" rows={4} onChange={changeContent} />)}
              </FormItem>:''
              }
              
              <Row
                type="flex"
                justify="center"
                style={{
                marginBottom: 20,
              }}>
                <Button
                  type="primary"
                  size="large"
                  className={styles.envBtns}
                  onClick={sumitEndCase}>提交</Button>
              </Row>
            </Form>
          </Card>
        </div>
      )
      break;
    default:
      result = (
        <div className={styles.content}></div>
      )
  }

  return (
    <div>{result}</div>
  )
}

// export default ApproveCom
ApproveCom.propTypes = {
  form: PropTypes.object,
  actProps: PropTypes.object,
  caseDetail: PropTypes.object,
  onSelectChange: PropTypes.func,
  onSubmitRecBiders: PropTypes.func,
  onShowData: PropTypes.func,
  toNextStep: PropTypes.func,
  onchangeContent: PropTypes.func,
  onSearchLawyers: PropTypes.func,
  handleSearch: PropTypes.func,
  lawTableProps: PropTypes.object,
  onAddNewLawyer: PropTypes.func,
  onSubmitToEndCase: PropTypes.func,
}

// export default connect(({ form }) => ({ form }))(Form.create()(ApproveCom))

export default Form.create({
  mapPropsToFields(props) {
    // console.log('mapPropsToFields', props);
    let formData = props.caseDetail.formData
    return {
      opinion: formData.opinion,
      comment: formData.comment,
      dicConclusion: formData.dicConclusion,
      dicReauditConclusion: formData.dicReauditConclusion,
      dicCensorConclusion: formData.dicCensorConclusion,
      name: formData.name,
      lawfirmName: formData.lawfirmName,
      dicLawyerType: formData.dicLawyerType,
      smsToHp: formData.smsToHp,
      smsToRp: formData.smsToRp,
      sms: formData.sms,
      sendState: formData.sendState,
      hpSendState: formData.hpSendState,
      rpSendState: formData.rpSendState,
      status: formData.status,
      unthroughReason: formData.unthroughReason,
      caseYear: formData.caseYear,
      caseNo: formData.caseNo,
      number: formData.number,
    }
  },
  onFieldsChange(props, fields) {
    props.onFieldsChange(fields)
  },
})(ApproveCom)
