import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'
import { createDicNodes, jsUtil } from '../../../utils'
import moment from 'moment'
import { connect } from 'dva'
import { Steps, Switch, Modal, message, Card, Table, Cascader, Tabs, Form, Input, Select, Button, Row, Col, Radio, Timeline, Icon, Spin, DatePicker, TreeSelect } from 'antd'
const TabPane = Tabs.TabPane
const Step = Steps.Step
const FormItem = Form.Item
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const SelectOption = Select.Option
const confirm = Modal.confirm
const { createRadioButton, createSelectOption } = createDicNodes

const formItemLayout = {
  labelCol: {
    xs: { span: 10 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 14 },
    sm: { span: 14 },
  },
}

const formItemLayoutWidth = {
  labelCol: {
    xs: { span: 5 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 17 },
    sm: { span: 18 },
  },
}

const formItemLayoutSmall = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 12 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 12 },
  },
}

const CaseBaseInfo = ({
    changeUpdata,
    lawcaseDetail,
    handleCaseBaseInfoEdit,
    handleCaseBaseInfoSave,
    handleCaseBaseInfoCancel,
    role,
    isTodoList,
    dispatch,
  	form: {
      setFieldsValue,
    	getFieldDecorator,
    	validateFields,
    	getFieldsValue,
      getFieldValue,
      resetFields,
  	} }) => {
  	const { caseBaseInfoData, isCaseBaseInfoEditing, tabLoading, allConfig, caseStatus, caseReason, new_dic_standing, case_orign_type, specified_reason, new_org_aid_type, subPersonListCase, subPersonModal = {} } = lawcaseDetail
  	console.log(caseBaseInfoData)
  	const { areaData, dictData, organizationTypeData } = allConfig
  let { dic_case_orign_type = [], dic_case_orign_type_notice = [], dic_case_orign__type_request = [], dic_case_orign_type_business = [] } = dictData
  if (dic_case_orign_type[0]) {
    dic_case_orign_type.forEach(item => {
      item.label = item.name
      item.value = item.code
    })
    dic_case_orign_type_notice.forEach(item => {
      item.label = item.name
      item.value = item.code
    })
    dic_case_orign_type[0].children = dic_case_orign_type_notice
  }
  if (dic_case_orign_type[1]) {
    dic_case_orign__type_request.forEach(item => {
      item.label = item.name
      item.value = item.code
    })
    dic_case_orign_type[1].children = dic_case_orign__type_request
  }
  if (dic_case_orign_type[2]) {
    dic_case_orign_type_business.forEach(item => {
      item.label = item.name
      item.value = item.code
    })
    dic_case_orign_type[2].children = dic_case_orign_type_business
  }
  const changeVal = (e) => {
    let val = e.target.value
    let length = val.length
    if (length > 250) {
       	message.warning('案件概況最多输入250字！')
    }
  }
    // 法律援助类型
  caseBaseInfoData.lawAidType = [caseBaseInfoData.dicOrignChannelType, caseBaseInfoData.dicOrignChannel]
    // 法律状态及地位
  if (caseBaseInfoData.caseStepCode) {
    const standingCodeList = caseBaseInfoData.standingCode.split('_')
    if (caseBaseInfoData.standingCode === '' || !caseBaseInfoData.standingCode) {
      caseBaseInfoData.standingCodeArray = [caseBaseInfoData.caseStepCode]
    } else {
      caseBaseInfoData.standingCodeArray = [`${standingCodeList[0]}_${standingCodeList[1]}`, caseBaseInfoData.standingCode]
    }
  }
    // 援助方式
  if (caseBaseInfoData.caseAidWayCode) {
    caseBaseInfoData.caseAidWayCodeArray = [caseBaseInfoData.caseAidWayCode]
  }
  	// 点击保存按钮
  	const handleSaveCaseCaseBaseInfo = (e) => {
	    validateFields((errors) => {
	      	if (errors) {
	        	return
	      	}
	      	let data = {
	        	...getFieldsValue(),
	      	}
          // 来源渠道类型
      data.dicOrignChannelType = data.lawAidType[0] || ''
          // 法律援助类型
      data.dicOrignChannel = data.lawAidType[1] || ''
          // 法律状态
      data.caseStepCode = data.standingCodeArray[0] || ''
          // 法律地位
      data.standingCode = data.standingCodeArray[1] || ''
          // 援助方式
      data.caseAidWayCode = data.caseAidWayCodeArray[0] || ''
          // 案由
          // data.caseReasonId = data.caseReasonId.map(item => item.value)
	      	handleCaseBaseInfoSave(data)
	    })
  	}

  const handleDeleteSubPersonCase = (item) => {
    confirm({
      title: '删除',
      content: `是否删除确定 “${item.rpName}”？`,
      onOk () {
        dispatch({
          type: 'lawcaseDetail/deleteSubPersonCase',
          payload: item,
        })
      },
    })
  }
//			console.log(caseBaseInfoData)
  const rtFileds = (e) => {
    resetFields()
    handleCaseBaseInfoCancel()
  }

  	const handleEditBaseInfo = (e) => {
  		handleCaseBaseInfoEdit()
  	}

  const handleCaseTypeChange = (value) => {
      // 清除案由，援助方式，地位
    setFieldsValue({
      caseReasonId: [],
    })
    dispatch({
      type: 'lawcaseDetail/handleCaseTypeChange',
      value,
    })
  }

  const handleAddSubPerson = (e) => {
    dispatch({
      type: 'lawcaseDetail/showSubPersonModal',
    })
  }

  const handleAidTypeChange = (value) => {
    if (getFieldValue('noticeReason')) {
      setFieldsValue({
        noticeReason: '',
      })
    }
    dispatch({ type: 'lawcaseDetail/handleNoticeReasonChange', value })
  }

  const treeProps = {
    treeData: caseReason,
    multiple: true,
      // treeCheckable: true,
    size: 'large',
    placeholder: '',
    treeNodeFilterProp: 'label',
    disabled: !isCaseBaseInfoEditing,
    onSelect: (value, node, extra) => {
      let caseRea = getFieldValue('caseReasonId')
      if (!node.props.isChild) {
        setTimeout(() => {
          caseRea = _.reject(caseRea, (item) => item === value)
          setFieldsValue({ caseReasonId: caseRea })
        }, 0)
      }
    },
      // treeCheckStrictly: true,
    getPopupContainer: () => document.getElementById('scroll-area'),
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'is',
      key: 'is',
      width: 64,
      render: (text, record, index) => <div width={24}>{index + 1}</div>,
    }, {
      title: '姓名',
      dataIndex: 'rpName',
      key: 'rpName',
    }, {
      title: '性别',
      dataIndex: 'dicGenderName',
      key: 'dicGenderName',
    }, {
      title: '证件类型',
      dataIndex: 'dicCardTypeName',
      key: 'dicCardTypeName',
    }, {
      title: '证件号',
      dataIndex: 'cardCode',
      key: 'cardCode',
    }, {
      title: '联系电话',
      dataIndex: 'mobile',
      key: 'mobile',
    }, {
      title: '类别',
      dataIndex: 'rpUserTagsName',
      key: 'rpUserTagsName',
    }, {
      title: '操作',
      dataIndex: 'tRpUserId',
      key: 'tRpUserId',
      render: (text, record) => (
          <div>
            <Button className={styles.csBtn} type="primary" disabled={!isCaseBaseInfoEditing} onClick={e => handleDeleteSubPersonCase(record)} >删除</Button>
          </div>
        ),
    }]

  	const editBtn = (<Row type="flex" justify="end" className={styles.pannelhr} gutter={16}>
      {isTodoList && Number(caseStatus) < 12 ?
        <Button type="primary" size="large" onClick={handleEditBaseInfo}>
          编辑
        </Button>
       : ''}
    	</Row>
    )

  	const editingBtns = (
        <Row type="flex" justify="end" className={styles.pannelhr} gutter={16}>
          	<Button className={styles.csBtn} type="primary" size="large" onClick={handleSaveCaseCaseBaseInfo}>
            	保存
          	</Button>
          	<Button type="primary" size="large" onClick={rtFileds}>
              	取消
            </Button>
        </Row>
    )

//  console.log(caseBaseInfoData)

  	return (
  		<Spin spinning={tabLoading} >
	        <Form layout="horizontal" className="login-form">
          	{isCaseBaseInfoEditing ? editingBtns : editBtn}
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="法律援助类型">
                  {getFieldDecorator('lawAidType', {
                    initialValue: caseBaseInfoData.lawAidType,
                    rules: [{ required: true, message: '请选择法律援助类型' }],
                  })(
                    <Cascader size="large" options={dic_case_orign_type} placeholder="请选择法律援助类型" disabled={!isCaseBaseInfoEditing} onChange={handleAidTypeChange} />
                    )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="是否典型案件">
                  {getFieldDecorator('isTypical', {
                    initialValue: caseBaseInfoData.isTypical,
                    rules: [{ required: true, message: '请选择是否典型案件' }],
                  })(
                  <RadioGroup disabled={!isCaseBaseInfoEditing}>
                    <RadioButton value>是</RadioButton>
                    <RadioButton value={false}>否</RadioButton>
                  </RadioGroup>)}
                </FormItem>
              </Col>
            </Row>

            <Row>
              {getFieldValue('lawAidType') && (getFieldValue('lawAidType')[0] === '1' || getFieldValue('lawAidType')[0] === '3') &&
                <Row>
                  <Row gutter={16}>
                    <Col span={24}>
                      <FormItem {...formItemLayoutWidth} label={getFieldValue('lawAidType')[0] === '1' ? '通知原因' : '商请原因'}>
                        {getFieldDecorator('noticeReason', {
                          initialValue: caseBaseInfoData.noticeReason,
                          rules: [
                            {
                              required: true,
                              message: getFieldValue('lawAidType')[0] === '1' ? '请输入通知原因' : '请输入商请原因',
                            },
                          ],
                        })(
                          <Select allowClear size="large" placeholder={getFieldValue('lawAidType')[0] === '1' ? '请选择通知原因' : '请选择商请原因'} disabled={!isCaseBaseInfoEditing}>
                            {createSelectOption({ list: specified_reason })}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <FormItem {...formItemLayout} label={getFieldValue('lawAidType')[0] === '1' ? '通知机关名称' : '商请机关名称'}>
                        {getFieldDecorator('noticeOrgName', {
                          initialValue: caseBaseInfoData.noticeOrgName,
                          rules: [
                            {
                              required: true,
                              message: getFieldValue('lawAidType')[0] === '1' ? '请输入通知机关名称' : '请输入商请机关名称',
                            },
                          ],
                        })(<Input size="large" placeholder={getFieldValue('lawAidType')[0] === '1' ? '请输入通知机关名称' : '请输入商请机关名称'} disabled={!isCaseBaseInfoEditing} />)}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem {...formItemLayout} label={getFieldValue('lawAidType')[0] === '1' ? '通知函号' : '商请函号'}>
                        {getFieldDecorator('noticeBoxNumber', {
                          initialValue: caseBaseInfoData.noticeBoxNumber,
                          rules: [
                            {
                              required: true,
                              message: getFieldValue('lawAidType')[0] === '1' ? '请输入通知函号' : '请输入商请函号',
                            },
                          ],
                        })(<Input size="large" placeholder={getFieldValue('lawAidType')[0] === '1' ? '请输入通知函号' : '请输入商请函号'} disabled={!isCaseBaseInfoEditing} />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    {/* <Col span={12}>
                      <FormItem {...formItemLayout} label="" label={getFieldValue('lawAidType')[0] === '1' ? '通知原因' : '商请原因'}>
                        {getFieldDecorator('noticeReason', {
                          initialValue: caseBaseInfoData.noticeReason,
                          rules: [
                            {
                              required: true,
                              message: getFieldValue('lawAidType')[0] === '1' ? '请输入通知原因' : '请输入商请原因',
                            }
                          ]
                        })(<Input size="large" placeholder={getFieldValue('lawAidType')[0] === '1' ? '请输入通知原因' : '请输入商请原因'} disabled={!isCaseBaseInfoEditing} />)}
                      </FormItem>
                    </Col>*/}
                    <Col span={12}>
                      <FormItem {...formItemLayout} label="办案人员姓名">
                        {getFieldDecorator('undertakeJudge', {
                          initialValue: caseBaseInfoData.undertakeJudge,
                        })(<Input size="large" disabled={!isCaseBaseInfoEditing} placeholder="请输入办案人员姓名" />)}
                      </FormItem>
                     </Col>
                     <Col span={12}>
                      <FormItem {...formItemLayout} label="办案人员联系电话">
                        {getFieldDecorator('judgeMobile', {
                          initialValue: caseBaseInfoData.judgeMobile,
                        })(<Input size="large" disabled={!isCaseBaseInfoEditing} placeholder="请输入办案人员联系电话" />)}
                      </FormItem>
                    </Col>
                  </Row>

                </Row>
              }
              {getFieldValue('lawAidType') && getFieldValue('lawAidType')[0] === '2' && getFieldValue('lawAidType')[1] === '3' &&
              <Row gutter={16}>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="转交机关类型">
                    {getFieldDecorator('dicTransferOrgType', {
                      initialValue: caseBaseInfoData.dicTransferOrgType,
                      rules: [{ required: true, message: '请选择转交机关类型' }],
                    })(
                        <Select allowClear size="large" placeholder="请选择转交机关类型" disabled={!isCaseBaseInfoEditing}>
                          {createSelectOption({ list: dictData.dic_case_orign_request_notice })}
                        </Select>)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="转交机关名称">
                    {getFieldDecorator('transferOrgName', {
                      initialValue: caseBaseInfoData.transferOrgName,
                      rules: [{ required: true, message: '请输入转交机关名称' }],
                    })(<Input size="large" placeholder="请输入转交机关名称" disabled={!isCaseBaseInfoEditing} />)}
                  </FormItem>
                </Col>
              </Row>
              }
            </Row>

            <Row className={styles.pannelhr}>
              <Col span={24}>
                <FormItem {...formItemLayoutWidth} label="案件类别">
                  {getFieldDecorator('caseTypeCode', {
                    initialValue: caseBaseInfoData.caseTypeCode,
                    rules: [{ required: true, message: '请选择案件类别' }],
                  })(
                    <Select allowClear size="large" onChange={handleCaseTypeChange} disabled={!isCaseBaseInfoEditing}>
                      {createSelectOption({ list: dictData.dic_case_type })}
                    </Select>)}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem {...formItemLayoutWidth} label="案由">
                  {getFieldDecorator('caseReasonId', {
                    initialValue: caseBaseInfoData.caseReasonId,
                    rules: [{ required: true, message: '请选择案由' }],
                  })(
                    <TreeSelect dropdownStyle={{ maxHeight: 200, overflow: 'auto' }} {...treeProps} disabled={!isCaseBaseInfoEditing} />
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem {...formItemLayoutWidth} label="案情概况" >
                  {getFieldDecorator('caseDetail', {
                    initialValue: caseBaseInfoData.caseDetail,
                    rules: [{ required: true, message: '请输入案情概况' }],
                  })(
                    <Input type="textarea" rows={4} maxLength={'251'} onChange={changeVal} disabled={!isCaseBaseInfoEditing} />
                  )}
                 </FormItem>
              </Col>
            </Row>

            <Row>
              {getFieldValue('caseTypeCode') === '01' &&
              <Col span={12}>
                <FormItem {...formItemLayout} label="羁押状态">
                  {getFieldDecorator('dicRemandStatus', {
                    initialValue: caseBaseInfoData.dicRemandStatus || '2',
                    rules: [{ required: true, message: '请选择羁押状态' }],
                  })(
                    <Select allowClear size="large" placeholder="请选择羁押状态" disabled={!isCaseBaseInfoEditing}>
                      {createSelectOption({ list: dictData.dic_dic_remand_status })}
                    </Select>)}
                </FormItem>
              </Col>
              }
              {getFieldValue('dicRemandStatus') === '1' && <Col span={12}>
                <FormItem {...formItemLayout} label="羁押地">
                  {getFieldDecorator('remandTypeName', {
                    initialValue: caseBaseInfoData.remandTypeName || undefined,
                    rules: [{ required: true, message: '请输入羁押地' }],
                  })(
                      <Select showSearch size="large" notFoundContent="" defaultActiveFirstOption={false}
                        showArrow filterOption={false} placeholder="输入关键字可模糊查找"
                        disabled={!isCaseBaseInfoEditing}
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        {createSelectOption({ list: organizationTypeData.organization_type_10 })}
                      </Select>)}
                </FormItem>
              </Col>}
              {getFieldValue('dicRemandStatus') === '3' && <Col span={12}>
                <FormItem {...formItemLayout} label="服刑地">
                  {getFieldDecorator('sentenceAddress', {
                    initialValue: caseBaseInfoData.sentenceAddress || undefined,
                    rules: [{ required: true, message: '请输入服刑地' }],
                  })(
                      <Select showSearch size="large" notFoundContent="" defaultActiveFirstOption={false}
                        showArrow filterOption={false} placeholder="输入关键字可模糊查找"
                        disabled={!isCaseBaseInfoEditing}
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        {createSelectOption({ list: organizationTypeData.organization_type_9 })}
                      </Select>)}
                </FormItem>
              </Col>}
            </Row>

            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} label="法律状态及地位">
                  {getFieldDecorator('standingCodeArray', {
                    initialValue: caseBaseInfoData.standingCodeArray,
                    rules: [{ required: true, message: '请输入法律状态及地位' }],
                  })(<Cascader disabled={!isCaseBaseInfoEditing} options={new_dic_standing} placeholder="请选择法律状态及地位" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="援助方式">
                  {getFieldDecorator('caseAidWayCodeArray', {
                    initialValue: caseBaseInfoData.caseAidWayCodeArray,
                    rules: [{ required: true, message: '请选择援助方式' }],
                  })(<Cascader disabled={!isCaseBaseInfoEditing} options={new_org_aid_type} placeholder="请选择援助方式" />)}
                </FormItem>
              </Col>
            </Row>

          	<Row className={styles.pannelhr} gutter={16}>
              {/* <Row>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="开庭时间">
                    {getFieldDecorator('courtStartTime', {
                      initialValue: moment(caseBaseInfoData.courtStartTime) || undefined
                    })(
                      <DatePicker format="YYYY-MM-DD HH:mm:ss"  disabled={!isCaseBaseInfoEditing}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="开庭地点">
                    {getFieldDecorator('courtAddress', {
                      initialValue: caseBaseInfoData.courtAddress
                    })(
                      <Input size="large" disabled={!isCaseBaseInfoEditing}/>
                    )}
                  </FormItem>
                </Col>
              </Row>*/}
            <Row>
                {/* <Col span={12}>
                  <FormItem {...formItemLayout} label="审理机关">
                    {getFieldDecorator('hearOrg', {
                      initialValue: caseBaseInfoData.hearOrg
                    })(
                      <Input size="large" disabled={!isCaseBaseInfoEditing}/>
                    )}
                  </FormItem>
                </Col> */}
                <Col span={12}>
                  <FormItem {...formItemLayout} label="案件涉及人数">
                    {getFieldDecorator('involveCountCode', {
                      initialValue: caseBaseInfoData.involveCountCode,
                      rules: [{ required: true, message: '请选择案件涉及人数' }],
                    })(
                      <RadioGroup disabled={!isCaseBaseInfoEditing}>
                        {createRadioButton({ list: dictData.dic_case_type_multi })}
                      </RadioGroup>)}
                  </FormItem>
                </Col>
            </Row>
          </Row>

</Form>
        {getFieldValue('involveCountCode') === 'M' &&
          <Card title="从案人员" style={{ marginTop: '20px' }}>
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <Button type="primary" size="large" disabled={!isCaseBaseInfoEditing} onClick={handleAddSubPerson} style={{ display: 'inline-block' }}>新 增</Button>
            </div>
            <Table pagination={false} dataSource={subPersonListCase} columns={columns} rowKey="flag" />
          </Card>
          }
  </Spin>
  )
}

CaseBaseInfo.propTypes = {
  	lawcaseDetail: PropTypes.object,
  	handleCaseBaseInfoEdit: PropTypes.func,
  	handleCaseBaseInfoSave: PropTypes.func,
  	handleCaseBaseInfoCancel: PropTypes.func,
  	loading: PropTypes.bool,
  	form: PropTypes.object.isRequired,
}

export default connect(({ dispatch }) => ({ dispatch }))(Form.create()(CaseBaseInfo))
