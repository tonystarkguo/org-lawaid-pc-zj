import { getDataService } from '../../../services/commonService'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Col, Form, Input, Select, Radio, DatePicker, Card, Checkbox, Progress, message, Cascader, Upload, Icon, TreeSelect,Modal } from 'antd'
import { config, jsUtil, createDicNodes } from '../../../utils'
import styles from './index.less'
import moment from 'moment'

const { api } = config
const { createRadio, createSelectOption } = createDicNodes

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

const Telephone = ({
  telephone,
  dispatch,
  onFieldsChange,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
  }
}) => {

  const { bol, caseReason, fileModal, allConfig, formData, curTotalFileList=[] } = telephone
  const { dictData } = allConfig
  const consultHistory = telephone.consultHistory || []
  const hasContent = consultHistory.length > 0
  const occupatio = jsUtil.getDictDataByKey('dic_dic_occupatio')//获取咨询人类型字典
  const options = occupatio.map(d => <Col span={6} key={d.code}><Checkbox value={d.code}>{d.name}</Checkbox></Col>)

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  }

  const onChange = (e) => {
    console.log('radio checked', e.target.value);
  }
  let doneFileList = fileModal.fileList.filter(item => item.status === 'done')
  let haveUploadedFileList = curTotalFileList && curTotalFileList.filter((item, index) => item.status === 'done')

  let ischangeFileList = fileModal.fileList.filter(item => item.isChange === true)
  let notchangeFileList = fileModal.fileList.filter(item => item.status !== 'done')
  const modalProps = {
    visible :  
      curTotalFileList.length == haveUploadedFileList.length ? false : true,
      footer: null, 
      closable: false,
  }
 
  const uploadProps = {
    action: '/uploadtopri',
    multiple: true,
    beforeUpload: (file, fileList) => {
      dispatch({
        type: 'telephone/updateProgress',
        payload: fileList,
      })
    },
    onChange({file = {}, fileList = []}) {
      dispatch({
        type: 'telephone/updateFileList',
        payload: {file, fileList},
      })
    },
    onRemove(file) {
      dispatch({
        type: 'telephone/removeFile',
        payload: file,
      })
    },
    data: fileModal.fileData,
    fileList: fileModal.fileList,
  }
  let treeDefaultExpandedKeys = []
    if(caseReason && caseReason.length && caseReason[0].children.length){
    treeDefaultExpandedKeys.push(caseReason[0].value)
  }
  const treeProps = {
    treeData:caseReason,
    multiple:true,
    // treeCheckable: true,
    size: "large",
    placeholder: "",
    treeNodeFilterProp: 'label',
    treeDefaultExpandedKeys,
    // treeCheckStrictly: true,
    onSelect: (value, node, extra) => {
      let caseRea = getFieldValue('caseReasons')
      if(!node.props.isChild){
        setTimeout(()=>{
          caseRea = _.reject(caseRea, (item)=> item === value)
          setFieldsValue({caseReasons: caseRea})
        }, 10)
      }
    },
    getPopupContainer: () => document.getElementById('scroll-area')
  }

  // 获取咨询历史记录
  const handleToggle = (e) => {
    const cardCode = getFieldValue('cardCode')
    if(cardCode === '' || typeof cardCode === 'undefined'){
      message.error('请输入证件号码！')
    }else{
      dispatch({
          type: 'telephone/showHistory',
          payload: cardCode
      })
    }
  }

  // 提交
  const handleSubmit = (e) => {
    let newcaseReasons = []
    if (getFieldValue('caseReasons') && getFieldValue('caseReasons').length) {
      getFieldValue('caseReasons').forEach(d => {
        newcaseReasons.push({ id: d })
      })
    }
    validateFields((errors) => {
      if (errors) {
        return
      }
      let data = {
        ...getFieldsValue(),
        dicSource: 'telephone',
        dicConsultType: 'telephone_lineCommon',
        caseReasons: newcaseReasons
      }
      dispatch({
        type: 'telephone/submit',
        payload: data
      })
    })
  }

  return (
    <div>
      <Form className={styles.content}>

        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="咨询人姓名">
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请输入咨询人姓名'
                }],
              })(<Input />)}
            </FormItem>
          </Col>
          
          <Col span={12}>
            <FormItem {...formItemLayout} label="咨询时间">
              {getFieldDecorator('createTime', {
              	initialValue: moment(new Date()),
                rules: [{
                  required: true,
                  message: '请选择咨询时间'
                }],
              })(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="输入格式（2017-01-01 00:00:00）"
                  style={{width:250}}
                />
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="联系电话">
              {getFieldDecorator('mobile')(<Input/>)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem {...formItemLayout} label="咨询人性别">
              {getFieldDecorator('dicGender')(
                <RadioGroup onChange={onChange}>
                  <Radio value={'1'}>男</Radio>
                  <Radio value={'2'}>女</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <FormItem {...rowItemLayout} label="咨询人类别">
              {getFieldDecorator('consultantCategoryKeys')(
                <Checkbox.Group>
                  <Row>
                    {options}
                  </Row>
                </Checkbox.Group>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="咨询标题">
              {getFieldDecorator('consultTitle', {
                rules: [{
                  required: true,
                  message: '请输入咨询标题'
                }],
              })(<Input/>)}
            </FormItem>
          </Col>
          
          <Col span={12}>
            <FormItem {...formItemLayout} label="咨询案由">
              {getFieldDecorator('caseReasons', {
                rules: [{
                  required: true,
                  message: '请选择咨询案由'
                }],
              })(
                <TreeSelect dropdownStyle={{maxHeight: 200, overflow: 'auto'}} {...treeProps} />
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <FormItem {...rowItemLayout} label="咨询内容">
              {getFieldDecorator('consultContent', {
                rules: [{
                  required: true,
                  message: '请输入咨询内容'
                }],
              })(
                <TextArea rows={4} />
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="处理方式">
              {getFieldDecorator('dicTreatmentMode', {
                rules: [{
                  required: true,
                  message: '请选择处理方式'
                }],
              })(
                <Select size="large" allowClear >
                  {createSelectOption({list:dictData.dic_consult_treatment_mode})}
                </Select>
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem {...formItemLayout} label="答复时间">
              {getFieldDecorator('submitTime',{
              	initialValue: moment(new Date()),
              })(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="输入格式（2017-01-01 00:00:00）"
                  style={{width:250}}
                />
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <FormItem {...rowItemLayout} label="答复意见">
              {getFieldDecorator('answerSuggestion', {
                rules: [{
                  required: true,
                  message: '请输入答复意见'
                }],
              })(
                <TextArea rows={4} />
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="是否公开到互联网">
              {getFieldDecorator('isOpen', {
                initialValue: false,
                rules: [{
                  required: true,
                  message: '请选择是否公开到互联网'
                }],
              })(
                <RadioGroup onChange={onChange}>
                  <Radio value={true}>公开</Radio>
                  <Radio value={false}>不公开</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem {...formItemLayout} label="附件">
              <Upload {...uploadProps}>
                  <Button disabled={!fileModal.finishedUpload}>
                    <Icon type="upload" /> 上传
                  </Button>
                </Upload>
            </FormItem>
          </Col>
        </Row>
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

        <Col span={12} style={{display:'none'}}>
          <FormItem {...formItemLayout} label="咨询人ID">
            {getFieldDecorator('tRpUserId')(
              <Input/>
            )}
          </FormItem>
        </Col>

        <Row type="flex" justify="center">
          <Col span={4}>
            <Button type="primary" size="large" onClick={handleSubmit}>提交答复意见</Button>
          </Col>
        </Row>
      </Form>

      <div>
        {/*<Row type="flex" justify="left" className={styles.marginBottom}>
                  <Button type="primary" size="large" onClick={handleToggle}>同一申请人</Button>
                </Row>*/}


        {
          hasContent ?
          consultHistory.map((item, index) => {
              const history = (
                  <Row gutter={16} style={{marginBottom:20}} key={item.id}>
                    <Col span={12}>
                      <Card>
                        <h3 className={styles.mb10}>{item.consultTitle}</h3>
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
        
      </div>
    </div>
  )
}

Telephone.propTypes = {
  form: PropTypes.object,
  telephone: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ telephone }) => ({ telephone }))(Form.create()(Telephone)) 
