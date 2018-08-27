import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Select, Row, Col, Icon, Upload, Input, DatePicker, Tabs, Modal, Progress, Cascader, message } from 'antd'
import {createDicNodes, jsUtil} from '../../../utils'
import { connect } from 'dva'
import { CaseTerminateForm, CaseResult } from './modules'
import _ from 'lodash'
import styles from './index.less'
import moment from 'moment'
const TabPane = Tabs.TabPane
const FormItem = Form.Item
const { TextArea } = Input;
const Option = Select.Option
const createTreeBydics = jsUtil.createTreeBydics
const createCurrentList = jsUtil.createCurrentList
const formItemLayout = {
  labelCol: { xs: { span: 10, }, sm: { span: 6, },},
  wrapperCol: { xs: { span: 14, }, sm: { span: 14, }, },
}
const formResultLayout = {
  labelCol: {
      xs: { span: 10 },
      sm: { span: 8 },
  },
  wrapperCol: {
      xs: { span: 14 },
      sm: { span: 14 },
  },
}
const fullItemLayout = {
  labelCol: {
      xs: { span: 5 },
      sm: { span: 4 },
  },
  wrapperCol: {
      xs: { span: 18 },
      sm: { span: 19 },
  },
}
const UndertakeForm = ({
  lawcaseDetail,
  handleFileChangeEnd,
  handleCaseTakeInfoEdit,
  handleCommitcaseInfoSave,
  handleCaseTakeInfoSave,
  handleCaseTakeInfoCancel,
  updateuploadProgress,
  handleFileRemoveEnd,
  updateUploadType,
  onBeforeUpload,
  handleSave,
  handleSubmit,
  backToList,  
  dispatch,
  form: {
    getFieldDecorator,
    validateFields,
    validateFieldsAndScroll,
    getFieldsValue,
    getFieldValue,
    resetFields,
  },
}) => {
  const {allConfig, fileModal, caseBaseInfoData, caseHandleResult, undertakeDetail, isCaseTakeInfoEditing, extDatePickers = [], curTotalFileList=[]} = lawcaseDetail
  let haveUploadedFileList = curTotalFileList && curTotalFileList.filter((item, index) => item.status === 'done')
  const {dictData} = allConfig
  const modalProps = {
    visible :  
      curTotalFileList.length == haveUploadedFileList.length ? false : true,
      footer: null, 
      closable: false,
  }
  const {createSelectOption} = createDicNodes
  const { dicOrignChannel, dicOrignChannelType, dicCaseType, dicLawStatus,dicCaseStatus, caseTypeCode, caseStatusCode, caseStepCode } = caseBaseInfoData //来源渠道，案件类型，法律状态
  const isReadModel = (caseStatusCode == '14' || caseStatusCode == '15' || caseStatusCode == '16' || caseStatusCode == '17' && caseStatusCode === '1' || caseStatusCode === '3')? true : false
  let finishedUpload = fileModal.finishedUpload
  if(!isCaseTakeInfoEditing){
    finishedUpload = false
  }
  let otherFileOptions = []
  let otherFileInitValue

  if(caseTypeCode === '02'){//民事案件，刑事案件-申请，刑事案件-通知类
    if(caseStepCode === '02_01'){//劳动仲裁
      otherFileOptions = [
        {code: 'ldzcszsFileList', name: '劳动仲裁申请书'},
        {code: 'othersFileList', name: '其他材料'},
      ]
      otherFileInitValue = 'ldzcszsFileList'
    }else{
      otherFileOptions = [
        {code: 'msqszFileList', name: '民事起诉状或答辩状、上诉状'},
        {code: 'hjxyFileList', name: '和解协议书'},
        {code: 'rmtjsFileList', name: '人民调解书'},
        // {code: 'fytjsFileList', name: '法援调解书'},
        {code: 'shsFileList', name: '申诉书或再审申请书'},
        {code: 'othersFileList', name: '其他材料'},
      ]
      otherFileInitValue = 'msqszFileList'
    }
  }else if(caseTypeCode === '03'){//行政案件
    otherFileOptions = [
      {code: 'othersFileList', name: '其他材料'},
    ]
    otherFileInitValue = 'othersFileList'
  }else if(caseTypeCode === '01'){//刑事案件
    otherFileOptions = [
      {code: 'xsdlyjsFileList', name: '刑事辩护（代理）意见书'},
      {code: 'xsfdmsszFileList', name: '刑事附带民事诉状'},
      {code: 'othersFileList', name: '其他材料'},
    ]
    otherFileInitValue = 'xsdlyjsFileList'
  }
  let dic_closing_method = jsUtil.getDictDataByKey('dic_dic_closing_method') // 结案方式一级
  let dic_closing_method_to = jsUtil.getDictDataByKey('dic_dic_closing_method_to') // 结案方式二级
  let dic_case_effect = jsUtil.getDictDataByKey('dic_dic_case_effect') // 案件效果一级
  let dic_case_effect_to = jsUtil.getDictDataByKey('dic_dic_case_effect_to') // 案件效果二级

  const {
    dic_dic_closing_method,
    dic_dic_closing_method_to,
    dic_dic_case_effect,
    dic_dic_case_effect_to,
    dic_civil_closing_doc,//民事
    dic_criminal_closing_doc,//刑事
    dic_administration_closing_doc,//行政
  } = dictData

  let dicClosingMethod = createTreeBydics(dic_dic_closing_method, dic_dic_closing_method_to) || []//结案方式1
  dicClosingMethod = createCurrentList(dicClosingMethod) || [] 
  let dicCaseEffect = createTreeBydics(dic_dic_case_effect, dic_dic_case_effect_to) || []
  dicCaseEffect = createCurrentList(dicCaseEffect) || [] 

  const getDocOptionsByCaseType = () => {
    let docOptions
    if(caseTypeCode === '01'){//刑事
      docOptions = createCurrentList(dic_criminal_closing_doc) || []
    }else if(caseTypeCode === '02'){//民事
      docOptions = createCurrentList(dic_civil_closing_doc) || []
    }else if(caseTypeCode === '03'){//行政
      docOptions = createCurrentList(dic_administration_closing_doc) || []
    }
    return docOptions
  }

  // 结案方式字典拼接
  if(dic_closing_method){
    let [arr0, arr1, arr2] = [[], [], []]
    dic_closing_method.map((item, i) => {
      item.label = item.name
      item.value = item.code
    })
    dic_closing_method_to.map((item, i) => {
      item.label = item.name
      item.value = item.code
      if(item.value.includes('01')){
        arr0.push(item)
      }
      if(item.value.includes('02')){
        arr1.push(item)
      }
      if(item.value.includes('03')){
        arr2.push(item)
      }
    })
    if(dic_closing_method.length){
      dic_closing_method[0].children = arr0
      dic_closing_method[1].children = arr1
      dic_closing_method[2].children = arr2
    }
  }

  // 案件效果字典拼接
  if(dic_case_effect){
    let [arr0, arr1, arr2] = [[], [], []]
    dic_case_effect.map((item, i) => {
      item.label = item.name
      item.value = item.code
    })
    dic_case_effect_to.map((item, i) => {
      item.label = item.name
      item.value = item.code
      if(item.value.includes('01')){
        arr0.push(item)
      }
      if(item.value.includes('02')){
        arr1.push(item)
      }
      if(item.value.includes('03')){
        arr2.push(item)
      }
    })
    if(dic_case_effect.length){
      dic_case_effect[0].children = arr0
      dic_case_effect[1].children = arr1
      dic_case_effect[2].children = arr2
    }
  }
  const getCaseTypeName = () => {//获取案件类型名称
    let result
    if(caseTypeCode === '02'){//民事案件，刑事案件-申请，刑事案件-通知类
      if(caseStepCode === '02_01'){//劳动仲裁
        result = '劳动仲裁案件'
      }else{
        result = '民事案件'
      }
    }else if(caseTypeCode === '03'){//行政案件
      result = '行政案件'
    }else if(caseTypeCode === '01'){//刑事案件
      if(dicOrignChannelType === '1'){
        result = '刑事-通知类案件'
      }else if(dicOrignChannelType === '2'){
        result = '刑事-申请类案件'
      }else{
        result = '刑事-商请类案件'
      }
    }
    return result
  }
 

  const handleMenuClick = (record) => {
    updateUploadType(record.key)
  }
  const rtFileds = (e) => {
    resetFields()
    handleCaseTakeInfoCancel()
  }
  const handleSaveCaseTakeInfo = (e) => {
    
    let data = {
      ...getFieldsValue()
    }
    if(parseInt(data.saveLosses).toString().length > 6) {
      message.warn('挽回经济损失不能超过六位数字')
    } else if(parseInt(data.pleasePay).toString().length > 6) {
      message.warn('为农民工讨薪不能超过六位数字')
    } else {
      //结案方式一级
      data.dicClosingMethod = data.dicClosingMethod && data.dicClosingMethod[0] || ''
      //结案方式二级
      data.dicClosingMethodTo = data.dicClosingMethod && data.dicClosingMethod[1] || ''
      //案件效果一级
      data.dicCaseEffect =  data.dicCaseEffect && data.dicCaseEffect[0] || ''
      //案件效果二级
      data.dicCaseEffectTo = data.dicCaseEffect && data.dicCaseEffect[1] || ''
      //挽回经济损失
      data.saveLosses = Number(data.saveLosses)
      //为农民工讨薪
      data.pleasePay = Number(data.pleasePay)
      
      handleCaseTakeInfoSave(data)
    }
}
const handleEditBaseInfo = (e) => {
  handleCaseTakeInfoEdit()
}
  const getRenderFileList = (t) => {
    let f = fileModal[t] || []
    return f.filter((itm) => itm.isDelete !== 1)
  }
  const uploadProps = {
    action: '/uploadtopri',
    multiple: true,
    onChange: handleFileChangeEnd,
    onRemove: handleFileRemoveEnd,
    beforeUpload: (file,fileList) => {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png')
      if (!isJPG) {
        message.error('只能上传jpeg，png格式的图片!');
      }
      updateuploadProgress(fileList)
      return isJPG
    },
    // showUploadList: {
    //   showRemoveIcon: isReadModel?false:true
    // },
    data: (file) => {
      const dt = new Date().format('yyyyMMdd')
      const lg = new Date().getTime()
      let h = fileModal.fileData
      h.key = 'orm/' + dt + '/' + lg + '_${filename}'
      let o = {}
      o[file.uid] = `orm/${dt}/${lg}_${file.name}`
      dispatch({type: 'lawcaseDetail/updateFileKey', payload: o})
      return h
    },
    // fileList: getFileListByType(1),//fileModal.fileList, disabled: true
  }

 
  const handleCommitcase = (e) => {
    validateFields((errors) => {
        if (errors) {
          return
        } 
        let data = {
          ...getFieldsValue()
        }
        if(parseInt(data.saveLosses).toString().length > 6) {
          message.warn('挽回经济损失不能超过六位数字')
        } else if(parseInt(data.pleasePay).toString().length > 6) {
          message.warn('为农民工讨薪不能超过六位数字')
        } else {
          //结案方式一级
      data.dicClosingMethod = data.dicClosingMethod && data.dicClosingMethod[0] || ''
      //结案方式二级
      data.dicClosingMethodTo = data.dicClosingMethod && data.dicClosingMethod[1] || ''
      //案件效果一级
      data.dicCaseEffect =  data.dicCaseEffect && data.dicCaseEffect[0] || ''
      //案件效果二级
      data.dicCaseEffectTo = data.dicCaseEffect && data.dicCaseEffect[1] || ''
      //挽回经济损失
      data.saveLosses = Number(data.saveLosses)
      //为农民工讨薪
      data.pleasePay = Number(data.pleasePay)
          handleCommitcaseInfoSave(data)
        }
    })
  }
  
  const addExtDatePicker = ()=>{
    dispatch({type: 'lawcaseDetail/updateDatePickerCount'})
  }

  const remExtDatePicker = (item)=>{
    dispatch({type: 'lawcaseDetail/remDatePickerCount', item})
  }
  const editBtn = (
    <Row type="flex" justify="end" className={styles.pannelhr} gutter={16}>
      <Button type="primary" size="large" onClick={handleEditBaseInfo}>
        编辑
      </Button>
      {/*isTodoList && Number(caseStatus) < 12? 
        <Button type="primary" size="large" onClick={handleEditBaseInfo}>
          编辑
        </Button>
       : ''*/}
    </Row>
  )   

  const editingBtns = (
      <Row type="flex" justify="end" className={styles.pannelhr} gutter={16}>
          <Button className={styles.csBtn} type="primary" size="large" onClick={handleSaveCaseTakeInfo}>
            保存
          </Button>
          <Button type="primary" size="large" onClick={rtFileds}>
              取消
          </Button>
      </Row>
  )

  return (
      <Form layout="horizontal" className="login-form">
       {isCaseTakeInfoEditing ? editingBtns : editBtn}
        {
          caseBaseInfoData.caseStatusCode === '3'?<Row>
          <Col span={24} >
            <h4 style={{color: 'red', marginBottom: 10, }}>注意：经中心工作人员审查，您的结案审核不通过，原因为：
          {undertakeDetail.unthroughReason}，
          请尽快处理，谢谢！</h4>
          </Col>
        </Row>:''
        }
        {/*<Row>
          <Col span={24} >
            <h2 style={{color: '#108ee9', marginBottom: 10, fontWeight: 'bold'}}>*（{getCaseTypeName()}）*</h2>
          </Col>
        </Row>*/}
        <Tabs type="card" tabPosition="left">
          <TabPane tab="办理手续" key="1">
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label="办理情况">
                  {getFieldDecorator('dicHandle', {
                    initialValue: caseHandleResult.dicHandle || undefined
                    // rules: [{required: true, message: '请选择办理情况' }]
                  })(
                      <Select disabled={!isCaseTakeInfoEditing} allowClear size="large" placeholder="请选择办理情况">
                        <Option value="1">已办理</Option>
                        <Option value="2">未办理</Option>
                      </Select>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label={getFieldValue('dicHandle') === '1'?'办理时间：':'未办理原因：'}>
                  {
                    getFieldValue('dicHandle') == '1' ?<div>
                    {getFieldDecorator('handledTime', {
                    initialValue: caseHandleResult.handledTime&&moment(caseHandleResult.handledTime) || undefined
                      // rules: [{required: true, message: '请选择办理时间' }]
                    })(<DatePicker disabled={!isCaseTakeInfoEditing} format="YYYY-MM-DD"/>)}</div>
                    :<div>
                    {getFieldDecorator('unhandledReason', {
                    initialValue: caseHandleResult.unhandledReason,
                      // rules: [{required: true, message: '请输入未办理原因' }]
                    })(<Input disabled={!isCaseTakeInfoEditing} size="large" placeholder="请输入未办理原因" />)}</div>
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label="指派通知书">
                    <Upload {...uploadProps} fileList={getRenderFileList('zptzsFileList')}>
                      <Button onClick={() => handleMenuClick({key: 'zptzsFileList'})} disabled={!finishedUpload}>
                        <Icon type="upload" />
                        上传
                      </Button>
                    </Upload>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label="委托协议">
                    <Upload {...uploadProps} fileList={getRenderFileList('wtxyFileList')}>
                      <Button onClick={() => handleMenuClick({key: 'wtxyFileList'})} disabled={!finishedUpload}>
                        <Icon type="upload" />
                        上传
                      </Button>
                    </Upload>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label="授权委托书">
                    <Upload {...uploadProps} fileList={getRenderFileList('sqwtsFileList')}>
                      <Button onClick={() => handleMenuClick({key: 'sqwtsFileList'})} disabled={!finishedUpload}>
                        <Icon type="upload" />
                        上传
                      </Button>
                    </Upload>
                </FormItem>
              </Col>
            </Row>
          </TabPane>
          {
            !(caseTypeCode == '01' && dicOrignChannelType == '1' || dicOrignChannelType == '3')?<TabPane tab="询问笔录" key="2">
                      <Row>
                        <Col span={24}>
                          <FormItem {...formItemLayout} label="承办情况">
                            {getFieldDecorator("dicTranscript", {
                              initialValue: caseHandleResult.dicTranscript || undefined
                             
                            })(
                                <Select disabled={!isCaseTakeInfoEditing} allowClear size="large" placeholder="请选择承办情况">
                                  <Option value="1">已制作</Option>
                                  <Option value="2">未制作</Option>
                                </Select>)}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <FormItem {...formItemLayout} label={getFieldValue('dicTranscript') === '1'?'制作时间：':'未制作原因：'}>
                            {
                              getFieldValue('dicTranscript') == '1' ?<div>
                              {getFieldDecorator('transcriptTime', {
                              initialValue: caseHandleResult.transcriptTime&&moment(caseHandleResult.transcriptTime)|| undefined
                                                  })(<DatePicker disabled={!isCaseTakeInfoEditing} format="YYYY-MM-DD"/>)}</div>
                              :<div>
                              {getFieldDecorator('untranscriptReason', {
                              initialValue: caseHandleResult.untranscriptReason
                                                  })(<Input disabled={!isCaseTakeInfoEditing} size="large" placeholder="请输入未制作原因" />)}</div>
                            }
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <FormItem {...formItemLayout} label="询问笔录">
                              <Upload {...uploadProps} fileList={getRenderFileList('xwblFileList')}>
                                <Button onClick={() => handleMenuClick({key: 'xwblFileList'})} disabled={!finishedUpload}>
                                  <Icon type="upload" />
                                  上传
                                </Button>
                              </Upload>
                          </FormItem>
                        </Col>
                      </Row>
                    </TabPane>:''}
          {//民事-劳动仲裁没有阅卷
            !(caseTypeCode == '02' && caseStepCode == '02_01') ? <TabPane tab="阅卷" key="3">
                      <Row>
                        <Col span={24}>
                          <FormItem {...formItemLayout} label="承办情况">
                            {getFieldDecorator("dicMarking", {
                    initialValue: caseHandleResult.dicMarking || undefined
                              // rules: [{required: true, message: '请选择承办情况' }]
                            })(
                                <Select disabled={!isCaseTakeInfoEditing} allowClear size="large" placeholder="请选择承办情况">
                                  <Option value="1">已阅</Option>
                                  <Option value="2">未阅</Option>
                                </Select>)}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <FormItem {...formItemLayout} label={getFieldValue('dicMarking') === '1'?'阅卷时间：':'未阅卷原因：'}>
                            {
                              getFieldValue('dicMarking') == '1' ?<div>
                              {getFieldDecorator('markingTime', {
                    initialValue: caseHandleResult.markingTime&&moment(caseHandleResult.markingTime)|| undefined
                                                    // rules: [{required: true, message: '请选择阅卷时间' }]
                                                  })(<DatePicker disabled={!isCaseTakeInfoEditing} format="YYYY-MM-DD"/>)}</div>
                              :<div>
                              {getFieldDecorator('unmarkingReason', {
                    initialValue: caseHandleResult.unmarkingReason
                                                    // rules: [{required: true, message: '请输入未阅卷原因' }]
                                                  })(<Input disabled={!isCaseTakeInfoEditing} size="large" placeholder="请输入未阅卷原因" />)}</div>
                            }
                          </FormItem>
                        </Col>
                      </Row>
                      {
                        caseTypeCode == '01' ? <Row>
                        <Col span={24}>
                          <FormItem {...formItemLayout} label="阅卷材料">
                              <Upload {...uploadProps} fileList={getRenderFileList('yjclFileList')}>
                                <Button onClick={() => handleMenuClick({key: 'yjclFileList'})} disabled={!finishedUpload}>
                                  <Icon type="upload" />
                                  上传
                                </Button>
                              </Upload>
                          </FormItem>
                        </Col>
                      </Row>: ''
                      }
                    </TabPane>:''}
          {
            caseTypeCode == '01' ? <TabPane tab="会见" key="8">
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label="承办情况">
                  {getFieldDecorator("dicMeet", {
                    initialValue: caseHandleResult.dicMeet|| undefined
                   
                  })(
                      <Select disabled={!isCaseTakeInfoEditing} allowClear size="large" placeholder="请选择承办情况">
                        <Option value="1">已会见</Option>
                        <Option value="2">未会见</Option>
                      </Select>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label={getFieldValue('dicMeet') === '1'?'会见时间：':'未会见原因：'}>
                  {
                    getFieldValue('dicMeet') == '1' ?<div>
                    {getFieldDecorator('meetTime', {
                    initialValue: caseHandleResult.meetTime&&moment(caseHandleResult.meetTime)|| undefined
                                        })(<DatePicker disabled={!isCaseTakeInfoEditing} format="YYYY-MM-DD"/>)}</div>
                    :<div>
                    {getFieldDecorator('unmeetReason', {
                    initialValue: caseHandleResult.unmeetReason
                                        })(<Input disabled={!isCaseTakeInfoEditing} size="large" placeholder="请输入未会见原因" />)}</div>
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label="会见专用证明">
                    <Upload {...uploadProps} fileList={getRenderFileList('hjzyzmFileList')}>
                      <Button onClick={() => handleMenuClick({key: 'hjzyzmFileList'})} disabled={!finishedUpload}>
                        <Icon type="upload" />
                        上传
                      </Button>
                    </Upload>
                </FormItem>
              </Col>
            </Row>
          </TabPane>:''}

          {
            caseTypeCode == '01' ? <TabPane tab="会见笔录" key="9">
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label="承办情况">
                  {getFieldDecorator("dicMeetRecord", {
                    initialValue: caseHandleResult.dicMeet|| undefined
                   
                  })(
                      <Select disabled={!isCaseTakeInfoEditing} allowClear size="large" placeholder="请选择承办情况">
                        <Option value="1">已制作</Option>
                        <Option value="2">未制作</Option>
                      </Select>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label={getFieldValue('dicMeetRecord') === '1'?'制作时间：':'未制作原因：'}>
                  {
                    getFieldValue('dicMeetRecord') == '1' ?<div>
                    {getFieldDecorator('meetRecordTime', {
                    initialValue: caseHandleResult.meetRecordTime&&moment(caseHandleResult.meetRecordTime)|| undefined
                                        })(<DatePicker disabled={!isCaseTakeInfoEditing} format="YYYY-MM-DD"/>)}</div>
                    :<div>
                    {getFieldDecorator('unmeetRecordReason', {
                    initialValue: caseHandleResult.unmeetRecordReason
                                        })(<Input disabled={!isCaseTakeInfoEditing} size="large" placeholder="请输入未制作原因" />)}</div>
                  }
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label="会见笔录">
                    <Upload {...uploadProps} fileList={getRenderFileList('hjblFileList')}>
                      <Button onClick={() => handleMenuClick({key: 'hjblFileList'})} disabled={!finishedUpload}>
                        <Icon type="upload" />
                        上传
                      </Button>
                    </Upload>
                </FormItem>
              </Col>
            </Row>
          </TabPane>:''}
          
          <TabPane tab="调查取证" key="4">
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label="承办情况">
                  {getFieldDecorator("dicEvidence", {
                    initialValue: caseHandleResult.dicEvidence || undefined
                    // rules: [{required: true, message: '请选择承办情况' }]
                  })(
                      <Select disabled={!isCaseTakeInfoEditing} allowClear size="large" placeholder="请选择承办情况">
                        <Option value="1">已取证</Option>
                        <Option value="2">未取证</Option>
                      </Select>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label={getFieldValue('dicEvidence') === '1'?'取证时间：':'未取证原因：'}>
                  {
                    getFieldValue('dicEvidence') == '1' ?
                    <div>
                    {getFieldDecorator('evi_0', {
                        initialValue: extDatePickers.length&& extDatePickers[0]&& extDatePickers[0].value&&moment(extDatePickers[0].value) || undefined
                      })(<DatePicker style={{width: '80%', marginRight: 10}} disabled={!isCaseTakeInfoEditing} format="YYYY-MM-DD"/>)}
                    <Button disabled={!isCaseTakeInfoEditing} onClick={addExtDatePicker}>+</Button>
                    </div>
                    :<div>
                    {getFieldDecorator('unevidenceReason', {
                        initialValue: caseHandleResult.unevidenceReason
                      })(<Input disabled={!isCaseTakeInfoEditing} size="large" placeholder="请输入未取证原因" />)}</div>
                  }
                </FormItem>
              </Col>
            </Row>
            {
              extDatePickers.length?
              extDatePickers.map((item, index) => {
                if(index>0){
                  return <Row key={index}>
                  <Col>
                    <FormItem {...formItemLayout} label="取证时间：">
                     <div>
                      {getFieldDecorator(item.key, {
                          initialValue: item.value && moment(item.value) || undefined
                        })(<DatePicker style={{width: '80%', marginRight: 10}} disabled={!isCaseTakeInfoEditing} format="YYYY-MM-DD"/>)}
                        <Button disabled={!isCaseTakeInfoEditing} onClick={()=>remExtDatePicker(item)}>-</Button>
                      </div>
                    </FormItem>
                  </Col>
                </Row> 
                }else{
                  return ''
                }
              })
              :''
            }
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label="证据材料">
                    <Upload {...uploadProps} fileList={getRenderFileList('dcxqFileList')}>
                      <Button onClick={() => handleMenuClick({key: 'dcxqFileList'})} disabled={!finishedUpload}>
                        <Icon type="upload" />
                        上传
                      </Button>
                    </Upload>
                </FormItem>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="开庭" key="5">
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label="承办情况">
                  {getFieldDecorator("dicSession", {
                    initialValue: caseHandleResult.dicSession|| undefined
                    // rules: [{required: true, message: '请选择承办情况' }]
                  })(
                      <Select disabled={!isCaseTakeInfoEditing} allowClear size="large" placeholder="请选择承办情况">
                        <Option value="1">已开庭</Option>
                        <Option value="2">未开庭</Option>
                      </Select>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label={getFieldValue('dicSession') === '1'?'开庭时间：':'未开庭原因：'}>
                  {
                    getFieldValue('dicSession') == '1' ?<div>
                    {getFieldDecorator('sessionTime', {
                    initialValue: caseHandleResult.sessionTime&&moment(caseHandleResult.sessionTime) || undefined
                                          // rules: [{required: true, message: '请选择开庭时间' }]
                                        })(<DatePicker disabled={!isCaseTakeInfoEditing} format="YYYY-MM-DD"/>)}</div>
                    :<div>
                    {getFieldDecorator('unsessionReason', {
                    initialValue: caseHandleResult.unsessionReason
                                          // rules: [{required: true, message: '请输入未开庭原因' }]
                                        })(<Input disabled={!isCaseTakeInfoEditing} size="large" placeholder="请输入未开庭原因" />)}</div>
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label={(caseBaseInfoData.dicAidWay == '01_02' || caseBaseInfoData.dicAidWay == '01_03') || caseBaseInfoData.caseTypeCode !== '01' ? '代理词' : '辩护词'}>
                    <Upload {...uploadProps} fileList={getRenderFileList('dlcFileList')}>
                      <Button onClick={() => handleMenuClick({key: 'dlcFileList'})} disabled={!finishedUpload}>
                        <Icon type="upload" />
                        上传
                      </Button>
                    </Upload>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label="庭审笔录">
                    <Upload {...uploadProps} fileList={getRenderFileList('tsblFileList')}>
                      <Button onClick={() => handleMenuClick({key: 'tsblFileList'})} disabled={!finishedUpload}>
                        <Icon type="upload" />
                        上传
                      </Button>
                    </Upload>
                </FormItem>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="结案通报" key="6">
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label="承办情况">
                  {getFieldDecorator("dicBanjie", {
                    initialValue: caseHandleResult.dicBanjie || undefined
                    // rules: [{required: true, message: '请选择承办情况' }]
                  })(
                      <Select disabled={!isCaseTakeInfoEditing} allowClear size="large" placeholder="请选择承办情况">
                        
                        <Option value="1">已通报</Option>
                        <Option value="2">未通报</Option>
                      </Select>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label={getFieldValue('dicBanjie') === '1'?'通报时间：':'未通报原因：'}>
                  {
                    getFieldValue('dicBanjie') == '1' ?<div>
                    {getFieldDecorator('banjieTime', {
                    initialValue: caseHandleResult.banjieTime&&moment(caseHandleResult.banjieTime)|| undefined
                                          // rules: [{required: true, message: '请选择通报时间' }]
                                        })(<DatePicker disabled={!isCaseTakeInfoEditing} format="YYYY-MM-DD"/>)}</div>
                    :<div>
                    {getFieldDecorator('unbanjieReason', {
                    initialValue: caseHandleResult.unbanjieReason
                                          // rules: [{required: true, message: '请输入未通报原因' }]
                                        })(<Input disabled={!isCaseTakeInfoEditing} size="large" placeholder="请输入未通报原因" />)}</div>
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label="裁判文书">
                    <Upload {...uploadProps} fileList={getRenderFileList('cpwsFileList')}>
                      <Button onClick={() => handleMenuClick({key: 'cpwsFileList'})} disabled={!finishedUpload}>
                        <Icon type="upload" />
                        上传
                      </Button>
                    </Upload>
                </FormItem>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="其他承办材料" key="7">
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label="材料类型">
                  {getFieldDecorator("materialType", {
                    initialValue: otherFileInitValue || undefined
                  })(
                      <Select disabled={!isCaseTakeInfoEditing} allowClear size="large" placeholder="请选择材料类型">
                        {createSelectOption({list:otherFileOptions})}
                      </Select>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label="上传材料">
                    <Upload {...uploadProps} fileList={getRenderFileList(getFieldValue('materialType'))}>
                      <Button onClick={() => handleMenuClick({key: getFieldValue('materialType')})} disabled={!finishedUpload}>
                        <Icon type="upload" />
                        上传
                      </Button>
                    </Upload>
                </FormItem>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
        {curTotalFileList.length !== 0 && <Modal
         {...modalProps}
        >
          <div>
            {/* <div>共{curTotalFileList.length}项,已经上传{haveUploadedFileList.length}项</div> */}
            {curTotalFileList.map((item, index) => {
              return (
                <div key={index}>
                  <div>{item.fileName}: <Progress percent={item.percent} /> </div>
                  </div>
              )
            })} 
          </div>
        </Modal>}
        <Row></Row>
        <Row type="flex" justify="end" className={styles.pannelhr} gutter={16}></Row>
        <Row gutter={16}>
            <Col span={12}>
              <FormItem {...formResultLayout} label="办案机关">
                {getFieldDecorator('handlingOrg', {
                  initialValue: caseHandleResult.handlingOrg,
                })(
                  <Input size="large" disabled={!isCaseTakeInfoEditing}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem {...formResultLayout} label="结案文书">
                {getFieldDecorator('dicClosingDoc', {
                  initialValue: caseHandleResult.dicClosingDoc,
                })(
                  <Select allowClear size="large" placeholder="请选择结案文书"  disabled={!isCaseTakeInfoEditing}>
                    {createSelectOption({list: getDocOptionsByCaseType()})}
                  </Select>
                )}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem {...formResultLayout} label="文号">
                {getFieldDecorator('docNumber', {
                  initialValue: caseHandleResult.docNumber,
                })(
                  <Input size="large" disabled={!isCaseTakeInfoEditing}/>
                )}
              </FormItem>
            </Col>
          </Row>


          <Row gutter={16}>
            <Col span={12}>
              <FormItem {...formResultLayout} label="结案方式">
                {getFieldDecorator('dicClosingMethod', {
                  initialValue: [caseHandleResult.dicClosingMethod, caseHandleResult.dicClosingMethodTo]//caseHandleResult.dicClosingDocName,
                })(
                  <Cascader size="large" options={dicClosingMethod} placeholder="请选择结案方式" disabled={!isCaseTakeInfoEditing} />
                )}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem {...formResultLayout} label="案件效果">
                {getFieldDecorator('dicCaseEffect', {
                  initialValue: [caseHandleResult.dicCaseEffect, caseHandleResult.dicCaseEffectTo]//caseHandleResult.dicCaseEffectName,
                })(
                  <Cascader size="large" options={dicCaseEffect} placeholder="请选择案件效果" disabled={!isCaseTakeInfoEditing} />
                )}
              </FormItem>
            </Col>
          </Row>


          <Row gutter={16}>
            <Col span={12}>
              <FormItem {...formResultLayout} label="上诉情况">
                {getFieldDecorator('dicAppeal', {
                  initialValue: caseHandleResult.dicAppeal,
                })(
                  <Select allowClear size="large" placeholder="请选择上诉情况"  disabled={!isCaseTakeInfoEditing}>
                    {createSelectOption({list: dictData.dic_dic_appeal})}
                  </Select>
                )}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem {...formResultLayout} label="代写上诉状">
                {getFieldDecorator('dicAppealForm', {
                  initialValue: caseHandleResult.dicAppealForm,
                })(
                  <Select allowClear size="large" placeholder="请选择代写上诉状"  disabled={!isCaseTakeInfoEditing}>
                    {createSelectOption({list: dictData.dic_dic_appeal_form})}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>

           {
             caseTypeCode === "02" || caseTypeCode === "03" ?
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formResultLayout} label="挽回经济损失">
                  {getFieldDecorator('saveLosses', {
                    initialValue: caseHandleResult.saveLosses,
                  })(
                  <Input type="number" size="large" addonAfter={<span>元</span>} disabled={!isCaseTakeInfoEditing} placeholder="输入不能超过六位数字" />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formResultLayout} label="为农民工讨薪">
                  {getFieldDecorator('pleasePay', {
                    initialValue: caseHandleResult.pleasePay,
                  })(
                    <Input type="number" size="large" addonAfter={<span>元</span>} disabled={!isCaseTakeInfoEditing} placeholder="输入不能超过六位数字" />
                  )}
                </FormItem>
              </Col>
            </Row> : ''
          }

          <Row>
            <Col span={24}>
              <FormItem {...fullItemLayout} label="办案小结">
                {getFieldDecorator('summary', {
                  initialValue: caseHandleResult.summary || '',
                  rules: [
                      {
                        required: true,
                        message: '请输入办案小结' },
                      {
                        min: 50,
                        message: '请输入50-1000个字!',
                      },
                      {
                        max: 1000,
                        message: '请输入50-1000个字!',
                      },]
                })(
                  <TextArea rows={4} disabled={!isCaseTakeInfoEditing}/>
                )}
              </FormItem>
            </Col>
          </Row>
          {(caseStatusCode>=14 && caseStatusCode<=17) && isCaseTakeInfoEditing && <Row
              type="flex"
              justify="center"
              style={{
              marginBottom: 20,
            }}>
              <Button
                type="primary"
                size="large"
                className={styles.envBtns}
                onClick={handleCommitcase}
                >提交结案</Button>
            </Row>}
        {/* <Row>
          <Col span={24} style={{textAlign: 'center'}}>
            {isReadModel?'':<Button type="primary" onClick={saveCaseInfo} style={{marginLeft: 15}}>保存</Button>}
            <Button type="cancel" onClick={backToList} style={{marginLeft: 15}}>返回</Button>
            {isReadModel?'':<Button type="primary" onClick={submitCaseInfo} style={{marginLeft: 15}}>提交结案</Button>}
          </Col>
        </Row> */}
      </Form>
  )
}

UndertakeForm.propTypes = {
  form: PropTypes.object.isRequired,
  lawcaseDetail: PropTypes.object,
  handleFileChangeEnd: PropTypes.func,
  handleFileRemoveEnd: PropTypes.func,
  updateUploadType: PropTypes.func,
  onBeforeUpload: PropTypes.func,
}

export default  connect(({ dispatch }) => ({ dispatch }))( Form.create()(UndertakeForm))

