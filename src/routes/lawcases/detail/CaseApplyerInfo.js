import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'
import moment from 'moment'
import AreaController from '../../../components/AreaController/AreaController'
import { connect } from 'dva'
import { createDicNodes, constants, jsUtil } from '../../../utils'
import { Steps, Switch, Modal, Tabs, message, Card, Table, Cascader, Form, Input, Select, Button, Row, Col, Radio, Timeline, Icon, Spin, Checkbox, TreeSelect, DatePicker } from 'antd'
const TabPane = Tabs.TabPane
const Step = Steps.Step
const FormItem = Form.Item
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const ChenkboxGroup = Checkbox.Group
const SelectOption = Select.Option
const { CITY_CASADER_DATA } = constants
const { createRadioButton, createSelectOption, createRadio, createCheckbox } = createDicNodes

const CaseApplyerInfo = ({ lawcaseDetail, handleApplyerInfoEdit, handleApplyerInfoSave, handleApplyerInfoCancel, role, isTodoList, dispatch, handleCaseBaseInfoEdit,
    handleCaseBaseInfoSave,
    handleCaseBaseInfoCancel,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    resetFields,
  } }) => {
  const { caseApplyerInfoData, caseBaseInfoData, isCaseBaseInfoEditing, isApplyerInfoEditing, caseReason, new_dic_standing, case_orign_type, specified_reason, new_org_aid_type, subPersonListCase, subPersonModal = {}, tabLoading, allConfig, caseStatus, tagList } = lawcaseDetail
  const { areaData = {}, dictData = {}, organizationTypeData } = allConfig
  const confirm = Modal.confirm
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
  const handleAidTypeChange = (value) => {
    if (getFieldValue('noticeReason')) {
      setFieldsValue({
        noticeReason: '',
      })
    }
    dispatch({ type: 'lawcaseDetail/handleNoticeReasonChange', value })
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

  // 点击保存按钮
  const handleSaveCaseApplyerInfo = (e) => {
    // e.preventDefault();
    validateFields((errors) => {
      if (errors) {
        return
      }
      const params = {
        ...getFieldsValue(),
        dicConsultantCategoryList: getFieldsValue().dicConsultantCategoryList.map(item => {
          return { value: item }
        }),
      }
      handleApplyerInfoSave(params)
      let data = {
	        	...getFieldsValue(),
	        	 dicConsultantCategoryList: getFieldsValue().dicConsultantCategoryList.map(item => {
           return { value: item }
         }),
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
  const handleEditSubPerson = (item) => {
    dispatch({
      type: 'lawcaseDetail/setSubPersonItem',
      payload: item,
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
  const handleEditApplyerInfo = (e) => {
  	handleApplyerInfoEdit()
  }


  const handleChange = (value) => {
    // console.log(`selected ${value}`);
  }
  const handleCancel = () => {
    resetFields()
    handleApplyerInfoCancel()
  }
  const onChange = (e) => {
    // console.log('radio checked', e.target.value);
  }

	 const metData = [
   {
     key: 1,
     name: '有效身份证明',
     meterials: [
       {
         url: 'http://baidu.com',
       },
     ],
     remark: '身份证、军官证、护照、港澳台身份证、户口本、临时身份证、武警警官证、士兵证；代理则需要代理人身份证明，关系证明或申请人授权委托书。',
   }, {
     key: 5,
     name: '经济困难证明材料',
     meterials: [
       {
         url: 'http://baidu.com',
       },
     ],
     remark: '乡镇街道政府有关政府部门（人民团体）出具的生活困难证明，或者下岗职工执业证、低保户家庭证、低保边缘家庭证等。',
   }, {
     key: 6,
     name: '申请事项相关材料',
     meterials: [
       {
         url: 'http://baidu.com',
       },
     ],
     remark: '与所申请法律援助事项有关证据证明材料。',
   },
 ]

  const noticeData = [
    {
      key: 1,
      name: '文书',
      meterials: [
        {
          url: 'http://baidu.com',
        },
      ],
      remark: '身份证、军官证、护照、港澳台身份证、户口本、临时身份证、武警警官证、士兵证；代理则需要代理人身份证明，关系证明或申请人授权委托书。',
    }, {
      key: 5,
      name: '相关材料',
      meterials: [
        {
          url: 'http://baidu.com',
        },
      ],
      remark: '乡镇街道政府有关政府部门（人民团体）出具的生活困难证明，或者下岗职工执业证、低保户家庭证、低保边缘家庭证等。',
    },
  ]

  const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  }
  const formBaseItemLayout = {
    labelCol: {
      xs: { span: 10 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 14 },
      sm: { span: 14 },
    },
  }

  const leftFormItemLayout = {
    labelCol: {
      xs: { span: 10 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 14 },
      sm: { span: 14 },
    },
  }

  const rightFormItemLayout = {
    labelCol: {
      xs: { span: 10 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 14 },
      sm: { span: 8 },
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

  const columns = [
    {
      title: '序号',
      dataIndex: 'is',
      key: 'is',
      width: 64,
      render: (text, record, index) => <div width={24}>{index + 1}</div>,
    }, {
      title: '案号',
      dataIndex: 'caseNum',
      key: 'caseNum',
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
          <Button className={styles.csBtn} type="primary" disabled={!isApplyerInfoEditing} onClick={(e) => handleEditSubPerson(record)}>编辑</Button>
          <Button className={styles.csBtn} type="primary" disabled={!isApplyerInfoEditing} onClick={e => handleDeleteSubPersonCase(record)} >删除</Button>
        </div>
      ),
    }]
  const editBtn = (<Row type="flex" justify="end" gutter={16}>
	    <Button type="primary" size="large" onClick={handleEditApplyerInfo}>
	      编辑
	    </Button>
		</Row>
	)

  const editingBtns = (
            <Row type="flex" justify="end" gutter={16}>
              <Button className={styles.csBtn} type="primary" size="large" onClick={handleSaveCaseApplyerInfo}>
                保存
              </Button>
              <Button type="primary" size="large" onClick={handleCancel}>
	              取消
	            </Button>
            </Row>
           )
  return (
  			 <div>

  			 <Form layout="horizontal" className="login-form">
  			 {isApplyerInfoEditing ? editingBtns : editBtn}
      	<Card title="案件性质及来源">
          <Spin spinning={tabLoading}>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formBaseItemLayout} label="法律援助类型">
                  {getFieldDecorator('lawAidType', {
                  	initialValue: caseBaseInfoData.lawAidType,
                    rules: [
                      {
                        required: true,
                        message: '请选择法律援助类型',
                      },
                    ],
                  })(<Cascader size="large" options={dic_case_orign_type} placeholder="请选择法律援助类型" disabled onChange={handleAidTypeChange} />)}
                </FormItem>
              </Col>
            </Row>

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
                          message: getFieldValue('lawAidType')[0] === '1' ? '请选择通知原因' : '请选择商请原因',
                        },
                      ],
                      })(
                      <Select allowClear size="large" placeholder={getFieldValue('lawAidType')[0] === '1' ? '请选择通知原因' : '请选择商请原因'} disabled={!isApplyerInfoEditing}>
                        {createSelectOption({ list: specified_reason })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <FormItem {...formBaseItemLayout} label={getFieldValue('lawAidType')[0] === '1' ? '通知机关名称' : '商请机关名称'}>
                      {getFieldDecorator('noticeOrgName', {
                      	initialValue: caseBaseInfoData.noticeOrgName,
                        rules: [
                          {
                            required: true,
                            message: getFieldValue('lawAidType')[0] === '1' ? '请输入通知机关名称' : '请输入商请机关名称',
                          },
                        ],
                      })(<Input size="large" placeholder={getFieldValue('lawAidType')[0] === '1' ? '请输入通知机关名称' : '请输入商请机关名称'} disabled={!isApplyerInfoEditing} />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formBaseItemLayout} label={getFieldValue('lawAidType')[0] === '1' ? '通知函号' : '商请函号'}>
                      {getFieldDecorator('noticeBoxNumber', {
                      	initialValue: caseBaseInfoData.noticeBoxNumber,
                        rules: [
                          {
                            required: true,
                            message: getFieldValue('lawAidType')[0] === '1' ? '请输入通知函号' : '请输入商请函号',
                          },
                        ],
                      })(<Input size="large" placeholder={getFieldValue('lawAidType')[0] === '1' ? '请输入通知函号' : '请输入商请函号'} disabled={!isApplyerInfoEditing} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={16}>
                  {/* <Col span={12}>
                    <FormItem {...formItemLayout} label="" label={getFieldValue('case_lawAidType')[0] === '1' ? '通知原因' : '商请原因'}>
                      {getFieldDecorator('case_noticeReason', {
                        rules: [
                          {
                            required: true,
                            message: getFieldValue('case_lawAidType')[0] === '1' ? '请输入通知原因' : '请输入商请原因',
                          }
                        ]
                      })(<Input size="large" placeholder={getFieldValue('case_lawAidType')[0] === '1' ? '请输入通知原因' : '请输入商请原因'} />)}
                    </FormItem>
                  </Col>*/}
                  <Col span={12}>
                    <FormItem {...formBaseItemLayout} label="办案人员姓名">
                      {getFieldDecorator('undertakeJudge', {
                      	 initialValue: caseBaseInfoData.undertakeJudge,
                      })(<Input size="large" disabled={!isApplyerInfoEditing} placeholder="请输入办案人员姓名" />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formBaseItemLayout} label="办案人员联系电话">
                      {getFieldDecorator('judgeMobile', {
                      	 initialValue: caseBaseInfoData.judgeMobile,
                      })(<Input size="large" disabled={!isApplyerInfoEditing} placeholder="请输入办案人员联系电话" />)}
                    </FormItem>
                  </Col>
                </Row>
              </Row>
            }

            {getFieldValue('lawAidType') && getFieldValue('lawAidType')[0] === '2' && getFieldValue('lawAidType')[1] === '3' && <Row className={styles.pannelhr} gutter={16}>
              <Col span={12}>
                <FormItem {...formBaseItemLayout} label="转交机关类型">
                  {getFieldDecorator('dicTransferOrgType', {
                  	initialValue: caseBaseInfoData.dicTransferOrgType,
                    rules: [
                      {
                        required: true,
                        message: '请选择转交机关类型',
                      },
                    ],
                  })(
                    <Select allowClear size="large" placeholder="请选择转交机关类型" disabled={!isApplyerInfoEditing}>
                      {createSelectOption({ list: dictData.dic_case_orign_request_notice })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formBaseItemLayout} label="转交机关名称">
                  {getFieldDecorator('case_transferOrgName', {
                  	 initialValue: caseBaseInfoData.transferOrgName,
                  })(<Input size="large" placeholder="请输入转交机关名称" disabled={!isApplyerInfoEditing} />)}
                </FormItem>
              </Col>
            </Row>}

            <Row className={styles.pannelhr}>
              <Col span={24}>
                <FormItem {...formItemLayoutWidth} label="案件类别">
                  {getFieldDecorator('caseTypeCode', {
                  	 initialValue: caseBaseInfoData.caseTypeCode,
                    rules: [
                      {
                        required: true,
                        message: '请选择案件类别',
                      },
                    ],
                  })(
                    <Select allowClear size="large" onChange={handleCaseTypeChange} disabled>
                      {createSelectOption({ list: dictData.dic_case_type })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              </Row>
              </Spin>
              </Card>
        <Card title={getFieldValue('lawAidType') && getFieldValue('lawAidType')[0] === '2' ? '申请人信息' : '受援人信息'} id="components-anchor-demo-basic" style={{ marginTop: '20px' }}>
          <Spin spinning={tabLoading}>
            <Row className={styles.pannelhr} gutter={16}>
              <Col className="gutter-row" span={12}>
                <div className="gutter-box">
                  <FormItem {...leftFormItemLayout} label={getFieldValue('lawAidType') && getFieldValue('lawAidType')[0] === '2' ? '申请人姓名' : '受援人姓名'}>
                    {getFieldDecorator('name', {
                    	 initialValue: caseApplyerInfoData.name,
                      rules: [
                        {
                          required: true,
                          message: '请输入申请人姓名',
                        },
                      ],
                    })(<Input size="large" placeholder="请输入申请人姓名" disabled={!isApplyerInfoEditing} />)}
                  </FormItem>

                  <FormItem {...leftFormItemLayout} label="证件类型">
                    {getFieldDecorator('dicCardType', {
                    	initialValue: caseApplyerInfoData.dicCardType,
                    })(
                      <Select allowClear size="large" placeholder="请选择证件类型" initialValue="1" disabled>
                        {createSelectOption({ list: dictData.dic_credentials_type })}
                      </Select>
                    )}
                  </FormItem>

                  <FormItem {...leftFormItemLayout} label="证件号码">
                        {getFieldDecorator('cardCode', {
                        	initialValue: caseApplyerInfoData.cardCode,
                        })(<Input size="large" maxLength={'18'} placeholder="请输入证件号码" disabled />)}
                  </FormItem>

                  <FormItem {...leftFormItemLayout} label="联系电话">
                    {getFieldDecorator('mobile', {
                      initialValue: caseApplyerInfoData.mobile,
                    })(<Input size="large" placeholder="请输入联系电话" disabled={!isApplyerInfoEditing} />)}
                  </FormItem>

                  <FormItem {...leftFormItemLayout} label="证件地址">
                    {getFieldDecorator('regis', {
                    	initialValue: caseApplyerInfoData.regis,
                    })(<Input size="large" placeholder="请输入证件地址" disabled={!isApplyerInfoEditing} />)}
                  </FormItem>

                  <FormItem {...leftFormItemLayout} label="经常居住地址">
                    {getFieldDecorator('usualAddr', {
                    	initialValue: caseApplyerInfoData.usualAddr,
                    })(<Input size="large" placeholder="请输入经常居住地址" disabled={!isApplyerInfoEditing} />)}
                  </FormItem>

                  <FormItem {...leftFormItemLayout} label="通讯地址">
                    {getFieldDecorator('legalInstAddr', {
                    	 initialValue: caseApplyerInfoData.legalInstAddr,
                      rules: [
                        {
                          required: getFieldValue('base_dicLegalInstWay') === 'YJ',
                          message: '请输入通讯地址',
                        },
                      ],
                    })(<Input size="large" placeholder="请输入通讯地址" disabled={!isApplyerInfoEditing} />)}
                  </FormItem>

                  <FormItem {...leftFormItemLayout} label="人群类别">
                    {getFieldDecorator('dicConsultantCategoryList', {
                    	initialValue: caseApplyerInfoData.dicConsultantCategoryList ? caseApplyerInfoData.dicConsultantCategoryList.map(item => item ? item.value.toString() : '') : undefined,
                      rules: [
                        {
                          required: true,
                          message: '请选择人群类别',
                        },
                      ],
                    })(
                       <Select allowClear size="large" mode="multiple" disabled={!isApplyerInfoEditing}>
                        {createSelectOption({ list: dictData.dic_dic_occupatio })}
                      </Select>
                    )}
                  </FormItem>
                </div>
              </Col>
              <Col className="gutter-row" span={12}>
                <div className="gutter-box">

                  <FormItem {...leftFormItemLayout} label="性别">
	                  	{getFieldDecorator('dicGender', {
						            initialValue: caseApplyerInfoData.dicGender,
						            rules: [{ required: true, message: '请选择性别' }],
						          })(
						          	<RadioGroup disabled={!isApplyerInfoEditing}>
						          		{createRadio({ list: dictData.dic_gender })}
			                  </RadioGroup>)}
	                  </FormItem>

                 <FormItem {...leftFormItemLayout} label="出生日期">
                      {getFieldDecorator('birthdate', {
                        initialValue: caseApplyerInfoData.birthdate ? moment(Number(caseApplyerInfoData.birthdate)) : undefined,
                      })(
                        <DatePicker format="YYYY-MM-DD" disabled={!isApplyerInfoEditing} />
                      )}
                    </FormItem>

                 <FormItem label="国籍" {...leftFormItemLayout}>
	              		{getFieldDecorator('dicNationality', {
	              			initialValue: caseApplyerInfoData.dicNationality,
						          })(
						          <Select allowClear size="large" disabled={!isApplyerInfoEditing}>
	                      {createSelectOption({ list: dictData.dic_nationality })}
		                  </Select>)}
					        </FormItem>

                 <FormItem {...leftFormItemLayout} label="籍贯">
		                  {getFieldDecorator('area', {
		                  	initialValue: caseApplyerInfoData.area,
		                  })(
	                    	<Cascader size="large" showSearch options={CITY_CASADER_DATA} placeholder="请选择籍贯（可搜索）" disabled={!isApplyerInfoEditing} />
	                    )}
	                  </FormItem>
                 <FormItem {...leftFormItemLayout} label="民族">
	                  	{getFieldDecorator('dicNation', {
	                  		initialValue: caseApplyerInfoData.dicNation,
	                  	})(
	                    <Select allowClear size="large" initialValue="1" disabled={!isApplyerInfoEditing}>
												{createSelectOption({ list: dictData.dic_ethnic_group })}
	                    </Select>)}
	                  </FormItem>

                  <FormItem {...leftFormItemLayout} label="文化程度">
											{getFieldDecorator('dicEduLevel', {
  initialValue: caseApplyerInfoData.dicEduLevel,
})(
	                    <Select allowClear size="large" initialValue="1" disabled={!isApplyerInfoEditing}>
												{createSelectOption({ list: dictData.dic_cultural_level })}
	                    </Select>)}
	                  </FormItem>

                  <FormItem {...leftFormItemLayout} label="工作单位">
											{getFieldDecorator('workUnit', {
  initialValue: caseApplyerInfoData.workUnit,
})(
												<Input size="large" placeholder="请输入工作单位" disabled={!isApplyerInfoEditing} />
											)}
	                  </FormItem>

                  <FormItem {...leftFormItemLayout} label="文书送达方式">
											{getFieldDecorator('dicLegalInstWay', {
  initialValue: caseApplyerInfoData.dicLegalInstWay,
})(
	                    <Select allowClear size="large" placeholder="请选择文书送达方式" disabled={!isApplyerInfoEditing}>
	                      {createSelectOption({ list: dictData.dic_file_mailing })}
	                    </Select>)}
	                  </FormItem>

                </div>
              </Col>
            </Row>

            <div className={styles.pannelhr}>
              <Row>
                <Col span={12}>
                  <FormItem {...formItemLayoutSmall} label="是否曾经申请过法律援助">
                    {getFieldDecorator('isApply', {
                      initialValue: caseApplyerInfoData.isApply,
                    })(
                        <RadioGroup disabled={!isApplyerInfoEditing}>
                          <RadioButton value>是</RadioButton>
                          <RadioButton value={false}>否</RadioButton>
                        </RadioGroup>)}
                  </FormItem>
                </Col>
              </Row>
              <div>
                {getFieldValue('isApply') &&
                  <Row gutter={16}>
                    <Col span={12}>
                      <FormItem {...leftFormItemLayout} label="前次申请地点">
                        {getFieldDecorator('applyAddress', {
                          initialValue: caseApplyerInfoData.applyAddress,
                          rules: [{ required: true, message: '请输入前次申请地点' }],
                        })(<Input size="large" placeholder="请输入前次申请地点" disabled={!isApplyerInfoEditing} />)}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem {...leftFormItemLayout} label="前次申请日期">
                        {getFieldDecorator('applyDate', {
                          initialValue: caseApplyerInfoData.applyDate && (moment(caseApplyerInfoData.applyDate) || undefined),
                          rules: [{ required: true, message: '请选择前次申请日期' }],
                        })(
                          <DatePicker disabled={!isApplyerInfoEditing} showTime format="YYYY-MM-DD" style={{ width: '100%!important' }} placeholder="请选择前次申请日期" />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                }
              </div>
            </div>

             <Row>
                <Col span={12}>
                  <FormItem {...formItemLayoutSmall} label="是否代理申请">
                    {getFieldDecorator('isProxy', {
                      initialValue: caseApplyerInfoData.isProxy,
                    })(<Switch defaultChecked={caseApplyerInfoData.isProxy} disabled={!isApplyerInfoEditing} />)}
                  </FormItem>
                </Col>
              </Row>
            <Row>
              {getFieldValue('isProxy') && <Col span={12}>
                <FormItem {...formItemLayout} label="代理人姓名">
                  {getFieldDecorator('proxyName', {
                  	initialValue: caseApplyerInfoData.proxyName,
                    rules: [
                      {
                        required: true,
                        message: '请输入代理人姓名',
                      },
                    ],
                  })(<Input size="large" placeholder="请输入代理人姓名" disabled={!isApplyerInfoEditing} />)}
                </FormItem>
              </Col>}
              {getFieldValue('isProxy') && <Col span={12}>
                <FormItem {...formItemLayout} label="代理人联系电话">
                  {getFieldDecorator('proxyMobile', {
                  	 initialValue: caseApplyerInfoData.proxyMobile,
                    rules: [
                      {
                        required: true,
                        message: '请输入代理人联系电话',
                      },
                    ],
                  })(<Input size="large" placeholder="请输入代理人联系电话" disabled={!isApplyerInfoEditing} />)}
                </FormItem>
              </Col>}
            </Row>
            <Row>
              {getFieldValue('isProxy') && <Col span={12}>
                <FormItem {...formItemLayout} label="代理人身份证号码">
                  {getFieldDecorator('proxyCardCode', {
                  	 initialValue: caseApplyerInfoData.proxyCardCode,
                    rules: [
                      {
                        required: true,
                        message: '请输入代理人身份证号码',
                      },
                    ],
                  })(<Input size="large" placeholder="请输入代理人身份证号码" disabled={!isApplyerInfoEditing} />)}
                </FormItem>
              </Col>}
              {getFieldValue('isProxy') && <Col span={12}>
                <FormItem {...formItemLayout} label="代理人类别">
                  {getFieldDecorator('dicProxyType', {
                  	 initialValue: caseApplyerInfoData.dicProxyType,
                    rules: [
                      {
                        required: true,
                        message: '请输入代理人类别',
                      },
                    ],
                  })(
                    <Select allowClear size="large" placeholder="请输入代理人类别" disabled={!isApplyerInfoEditing}>
                      {createSelectOption({ list: dictData.dic_dic_case_proxy_type })}
                    </Select>
                  )}
                </FormItem>
              </Col>}
            </Row>

          </Spin>
        </Card>

        <Card title="案件信息" style={{ marginTop: '20px' }}>
          <Spin spinning={tabLoading}>
           <Row className={styles.pannelhr}>
              <Col span={24}>
                <FormItem {...formItemLayoutWidth} label="案由">
                  {getFieldDecorator('caseReasonId', {
                  	initialValue: caseBaseInfoData.caseReasonId,
                    rules: [
                      {
                        required: true,
                        message: '请选择案由',
                      },
                    ],
                  })(<TreeSelect dropdownStyle={{ maxHeight: 200, overflow: 'auto' }} {...treeProps} disabled={!isApplyerInfoEditing} />)}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem {...formItemLayoutWidth} label="案情概况">
                  {getFieldDecorator('caseDetail', {
                  	initialValue: caseBaseInfoData.caseDetail,
                    rules: [
                      {
                        required: true,
                        message: '请输入案情概况',
                      },
                    ],
                  })(<Input type="textarea" rows={4} maxLength={'251'} onChange={changeVal} disabled={!isApplyerInfoEditing} />)}
                </FormItem>
              </Col>
            </Row>

            <Row>
              {getFieldValue('caseTypeCode') === '01' && <Col span={12}>
                <FormItem {...formBaseItemLayout} label="羁押状态">
                  {getFieldDecorator('dicRemandStatus', {
                  	 initialValue: caseBaseInfoData.dicRemandStatus || '2',
                    rules: [
                      {
                        required: true,
                        message: '请选择羁押状态',
                      },
                    ],
                  })(
                    <Select allowClear size="large" placeholder="请选择羁押状态" disabled={!isApplyerInfoEditing}>
                      {createSelectOption({ list: dictData.dic_dic_remand_status })}
                    </Select>
                  )}
                </FormItem>
              </Col>}
              {getFieldValue('caseTypeCode') === '01' && getFieldValue('dicRemandStatus') === '1' && <Col span={12}>
                <FormItem {...formBaseItemLayout} label="羁押地">
                  {getFieldDecorator('remandTypeName', {
                  	 initialValue: caseBaseInfoData.remandTypeName || undefined,
                    rules: [
                      {
                        required: true,
                        message: '请选择羁押地',
                      },
                    ],
                  })(
                     <Select showSearch size="large" notFoundContent="" defaultActiveFirstOption={false}
                       showArrow filterOption={false} placeholder="输入关键字可模糊查找"
                       disabled={!isApplyerInfoEditing}
                       filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                     >
                        {createSelectOption({ list: organizationTypeData.organization_type_10 })}
                      </Select>
                  )}
                </FormItem>
              </Col>}
              {getFieldValue('caseTypeCode') === '01' && getFieldValue('dicRemandStatus') === '3' && <Col span={12}>
                <FormItem {...formBaseItemLayout} label="服刑地">
                  {getFieldDecorator('sentenceAddress', {
                  	 initialValue: caseBaseInfoData.sentenceAddress || undefined,
                    rules: [
                      {
                        required: true,
                        message: '请输入服刑地',
                      },
                    ],
                  })(
                    <Select showSearch size="large" notFoundContent="" defaultActiveFirstOption={false}
                      showArrow filterOption={false} placeholder="输入关键字可模糊查找"
                      disabled={!isApplyerInfoEditing}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        {createSelectOption({ list: organizationTypeData.organization_type_9 })}
                      </Select>
                  )}
                </FormItem>
              </Col>}
            </Row>

            <Row>
              <Col span={12}>
                <FormItem {...formBaseItemLayout} label="法律状态及地位">
                  {getFieldDecorator('standingCodeArray', {
                    initialValue: caseBaseInfoData.standingCodeArray,
                    rules: [{ required: true, message: '请输入法律状态及地位' }],
                  })(<Cascader disabled={!isApplyerInfoEditing} options={new_dic_standing} placeholder="请选择法律状态及地位" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                 <FormItem {...formBaseItemLayout} label="援助方式">
                  {getFieldDecorator('caseAidWayCodeArray', {
                    initialValue: caseBaseInfoData.caseAidWayCodeArray,
                    rules: [{ required: true, message: '请选择援助方式' }],
                  })(<Cascader disabled={!isApplyerInfoEditing} options={new_org_aid_type} placeholder="请选择援助方式" />)}
                </FormItem>
              </Col>
            </Row>

            <Row className={styles.pannelhr} gutter={16}>
              <Row>
                <Col span={12}>
                  <FormItem {...formBaseItemLayout} label="案件涉及人数">
                    {getFieldDecorator('involveCountCode', {
                    	 initialValue: caseBaseInfoData.involveCountCode,
                      rules: [
                        {
                          required: true,
                          message: '请选择案件涉及人数',
                        },
                      ],
                    })(
                      <RadioGroup disabled={!isApplyerInfoEditing}>
                        {createRadioButton({ list: dictData.dic_case_type_multi })}
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                <FormItem {...formBaseItemLayout} label="是否典型案件">
                  {getFieldDecorator('isTypical', {
                    initialValue: caseBaseInfoData.isTypical,
                    rules: [
                      {
                        required: true,
                        message: '请选择是否典型案件',
                      },
                    ],
                  })(
                    <RadioGroup disabled={!isApplyerInfoEditing}>
                      <RadioButton value>是</RadioButton>
                      <RadioButton value={false}>否</RadioButton>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
              </Row>
            </Row>
          </Spin>
        </Card>

        {getFieldValue('involveCountCode') === 'M' &&
          <Card title="从案人员" style={{ marginTop: '20px' }}>
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <Button type="primary" size="large" disabled={!isApplyerInfoEditing} onClick={handleAddSubPerson} style={{ display: 'inline-block' }}>新 增</Button>
            </div>
            <Table pagination={false} dataSource={subPersonListCase} columns={columns} rowKey="flag" />
          </Card>
          }

        {/* <Card title={getFieldValue('lawAidType') && getFieldValue('lawAidType')[0] === '2' ? '申请材料' : '通知文书及相关材料'} style={{
          marginTop: '20px',
          }}>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="免提交困难材料">
                {getFieldDecorator('isFreeHardMaterials', {})(<Switch />)}
              </FormItem>
            </Col>
            {getFieldValue('isFreeHardMaterials') && <Col span={12}>
              <FormItem {...formItemLayout} label="原因">
                {getFieldDecorator('freeHardMaterialsReason', {})(
                  <Select size="large" placeholder="请选择免困难材料原因">
                    {createSelectOption({list: dictData.dic_dic_free_hard_materials_reason})}
                  </Select>
                )}
              </FormItem>
            </Col>
            }
          </Row>
          <Row style={{
            padding: 20,
          }}>
            <Col span={24}>
              <Table
                bordered
                pagination={false}
                rowKey={record => record.key}
                dataSource={getFieldValue('lawAidType') && getFieldValue('lawAidType')[0] === '2' ? metData : noticeData}
                columns={metCols}
              />
            </Col>
          </Row>
        </Card>*/}
      </Form>
        </div>
  )
}

CaseApplyerInfo.propTypes = {
  lawcaseDetail: PropTypes.object,
  handleApplyerInfoEdit: PropTypes.func,
  handleApplyerInfoSave: PropTypes.func,
  handleCaseBaseInfoSave: PropTypes.func,
  handleApplyerInfoCancel: PropTypes.func,
  loading: PropTypes.bool,
  form: PropTypes.object.isRequired,
}

export default connect(({ dispatch }) => ({ dispatch }))(Form.create()(CaseApplyerInfo))
