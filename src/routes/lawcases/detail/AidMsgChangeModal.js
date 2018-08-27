import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Tag, Icon, Radio, Modal, Upload, Cascader, Select, Button, Card, Row, Col, Checkbox, Table } from 'antd'
import { createDicNodes, jsUtil } from '../../../utils'
import { connect } from 'dva'
import styles from '../../../components/ApproveCom/ApproveCom.less'
const FormItem = Form.Item
const Option = Select.Option
const CheckboxGroup = Checkbox.Group
const { createRadioButton, createSelectOption, createRadio } = createDicNodes

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
const formBaseItemLayout = {
  labelCol: {
    xs: { span: 14 },
    sm: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 14 }, 
    sm: { span: 14 },
  },
}

const AidMsgChangeModal = ({
  onOk,
  onCancel,
  roles,
  lawcaseDetail,
  lawTableProps,
  onchangeContent,
  showUpload,
  dispatch,
  updateUploadType,
  onSearchLawyers,
  handleDocChange,
  handleDocRemove,
  onAddNewLawyer,
  onDeleteAidPeople,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
  },
  ...AidMsgChangModalProps
}) => {
    
  const { fileModal } = AidMsgChangModalProps
  const {allConfig, caseBaseInfoData} = AidMsgChangModalProps.caseDetail
  const {dictData} = allConfig
  const lawyerList = AidMsgChangModalProps.caseDetail.flowDetail.lawyerList || []
  const uploadProps = {
    action: '/uploadtopri',
    onChange: handleDocChange,
    onRemove: handleDocRemove,
    multiple: true,
    data: (file) => {
      const dt = new Date().format('yyyyMMdd')
      const lg = new Date().getTime()
      let h = fileModal.fileData
      h.key = `orm/${dt}/${lg}_\${filename}`
      let o = {}
      o[file.uid] = `orm/${dt}/${lg}_${file.name}`
      dispatch({type: 'lawcaseDetail/updateFileKey', payload: o})
      return h
    },
   
  }  
  const data = {
    ...getFieldsValue(),
  }
  var renderFileList;
  const handleMenuClick = (record) => {
    if(record.key == 'noticeUpload'){
      renderFileList = fileModal.noticeUploadList
    }else if(record.key == 'approveUpload'){
      renderFileList = fileModal.approveUpload
    }
    updateUploadType(record.key)
  }
  const deleteAidPeople = (tag) => {
    let tagId = tag.id
    onDeleteAidPeople(tagId)
  }
  const {
    caseStatus,
    GoodAtDomains = [],
    selectedLawyers = [],
    lawfirmList = [],
  } = AidMsgChangModalProps.caseDetail || {}
  
  const hasSelected = !jsUtil.isNull(selectedLawyers)
  let tempSelectedLawyers = []
  if (hasSelected) {
    tempSelectedLawyers = selectedLawyers
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
  
  const handleSubmit = (e) => {
    e.preventDefault()
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
    // {/*
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
    // */},
  ]
  const changeContent = (e) => {
    let value = e.target.value
    onchangeContent(value)
  }
  const addNewLawyer = () => {
    onAddNewLawyer()
  }
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      let data = {
        selectedLawyers,
        ...getFieldsValue(),
      }
      onOk(data)
    })
  }
  const modalOpts = {
    ...AidMsgChangModalProps,
    width: 900,
    onCancel,
    onOk: handleOk,
    cancelText: "返回",
    title: "请选择法律援助人员",
    maskClosable: false,
  }
 
  return (
    <Modal {...modalOpts}>
      <div>
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
                            {/* <Tag color="blue" onClick={()=> setMainLawyer(tag)} >      
                            {tag.isMain==1?'主承办人':'设为主承办人'}
                            
                            </Tag>
                              {index === 0? <Tag color="blue">主承办人</Tag>:''} */}
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
                </div>
                : ''
                  }
                  {showUpload &&
                  <Row>
                  <Col span={12}>
                  <FormItem {...formBaseItemLayout} label="更换法律援助人员审批表:">
                  {getFieldDecorator('approveUpload', {
                      	rules: [
                        {
                          required: true,
                          message: '请上传文件'
                        },
                      ],
                      })(
               <Upload {...uploadProps}>
                        <Button onClick={() => handleMenuClick({key: 'approveUpload'})}>
                          <Icon type="upload" /> 上传
                        </Button>
              </Upload>
                  )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formBaseItemLayout} label="更换法律援助人员通知书:">
                  {getFieldDecorator('noticeUpload', {
                      	rules: [
                        {
                          required: true,
                          message: '请上传文件'
                        },
                      ],
                      })(
               <Upload {...uploadProps}>
                        <Button onClick={() => handleMenuClick({key: 'noticeUpload'})}>
                          <Icon type="upload" /> 上传
                        </Button>
              </Upload>
                      )}
                  </FormItem>
                </Col>
                </Row>
                  }
            </Form>
    </div>
    </Modal>
  )
}

AidMsgChangeModal.propTypes = {
  form: PropTypes.object.isRequired,
  title: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  allConfig: PropTypes.object,
  onChoose: PropTypes.func,
}

export default connect(({ AidMsgChangeModal }) => ({ AidMsgChangeModal }))(Form.create()(AidMsgChangeModal))