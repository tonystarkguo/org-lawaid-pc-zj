import { getDataService } from '../../../services/commonService'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import moment from 'moment'
import { Button, Row, Col, Form, Input, Select, Radio, DatePicker, Card, Checkbox, message, Cascader, Upload, Icon, TreeSelect } from 'antd'
import { config, jsUtil } from '../../../utils'
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

const AdviceEdit = ({
  adviceEdit,
  dispatch,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
  }
}) => {

  const { isShow, bol, treeCaseReason } = adviceEdit
  console.log(treeCaseReason)
  const consultHistory = adviceEdit.consultHistory || []
  const hasContent = consultHistory.length > 0

  let item = adviceEdit.item || {}

  const options = jsUtil.getDictDataByKey('dic_dic_occupatio').map(d => <Col span={6} key={d.code}><Checkbox value={d.code}>{d.name}</Checkbox></Col>);

  const files = item.files && item.files.map(d => <a target="_blank" key={d.id} href={d.addrUrl}>{d.name}</a>)

  /*let list = item.caseReasons && item.caseReasons.filter(item => {
    return !item.isChild
  })*/

  let caseReasons = item.caseReasons && item.caseReasons.map(item => {
    return item.id.toString()
  })

  let personType = item.dicConsultantCategory
  personType = personType && personType.split('、')

  console.log(personType)

  let consult_source = jsUtil.getDictDataByKey('dic_consult_source')
  let consult_type = jsUtil.getDictDataByKey('dic_consult_type')
  consult_source.splice(0,1);

  if(consult_source){

    let online = []
    let telephone = []
    let letter = []
    let visit = []

    consult_source.map((item, i) => {
      item.label = item.name
      item.value = item.code
    })

    consult_type.map((item, i) => {
      /*if(consult_type[i].code.includes('online')){
        item.label = item.name
        item.value = item.code
        online.push(item)
      }*/
      if(item.code.includes('telephone')){
        item.label = item.name
        item.value = item.code
        telephone.push(item)
      }
      if(item.code.includes('letter')){
        item.label = item.name
        item.value = item.code
        letter.push(item)
      }
      if(item.code.includes('visit')){
        item.label = item.name
        item.value = item.code
        visit.push(item)
      }
    })

    // consult_source[0].children = online
    consult_source[0].children = telephone
    consult_source[1].children = letter
    consult_source[2].children = visit
  }

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  }

  const onChange = (e) => {
    console.log('radio checked', e.target.value);
  }

  const sourceChange = (value) => {
    console.log(`selected ${value}`);
    if(value[0] === 'visit'){
      dispatch({
          type: 'adviceEdit/showConsultNumber',
      })
    }else{
      dispatch({
          type: 'adviceEdit/hideConsultNumber',
      })
    }
  }

  const handleToggle = (e) => {
    const cardCode = getFieldValue('cardCode')
    const id = item.id
    if(cardCode === '' || typeof cardCode === 'undefined'){
      message.error('请输入证件号码！')
    }else{
      dispatch({
          type: 'adviceEdit/showHistory',
          payload: {
            cardCode: cardCode,
            id: id
          }
      })
    }
  }
  
  const handleSave = (e) => {
    let newcaseReasons = []
    validateFields((errors) => {
      if (errors) {
        return
      }
      if(getFieldValue('caseReasons').length){
        getFieldValue('caseReasons').map(d => {
          newcaseReasons.push({id:d.value})
        })
      }
      const data = {
        ...getFieldsValue(),
        dicSource: getFieldValue('dicSource')[0],
        dicConsultType: getFieldValue('dicSource')[1],
        caseReasons: newcaseReasons,
        files: item.files,
        id: item.id,
      }
      dispatch({
        type: 'adviceEdit/save',
        payload: data
      })
    })
  }

  const handleSubmit = (e) => {
    let newcaseReasons = []
    validateFields((errors) => {
      if (errors) {
        return
      }
      if(getFieldValue('caseReasons').length){
        getFieldValue('caseReasons').map(d => {
          newcaseReasons.push({id:d})
        })
      }
      const data = {
        ...getFieldsValue(),
        // dicSource: getFieldValue('dicSource')[0],
        // dicConsultType: getFieldValue('dicSource')[1],
        caseReasons: newcaseReasons,
        // files: item.files,
        id: item.id,
      }
      dispatch({
        type: 'adviceEdit/submit',
        payload: data
      })
    })
  }

  // 根据证件类型和证件号码获取个人信息
  const searchApplyerByIdCard = async ()=> {
    const dicCardType = getFieldValue('dicCardType')
    const cardCode = getFieldValue('cardCode')
    if (cardCode === '' || typeof cardCode === 'undefined' || dicCardType === '' || typeof dicCardType === 'undefined') {
      message.warn('请输入证件类型及证件号码！')
    } else{
      const userInfo = await getDataService({
        url: api.searchInfoById,
      }, {cardCode, dicCardType, serviceId: 'searchInfoById'})
      if (userInfo && userInfo.data) {
        const data = userInfo.data || {}
        console.log(data)
        let setValue = {}
        const getValue = getFieldsValue()
        for (let key in data) {
          const baseKey = `${key}`
          if (getValue.hasOwnProperty(baseKey)) {
            setValue[`${key}`] = data[key]
          }
        }
        setValue.birthdate = data.birthdate ? moment(data.birthdate) : undefined
        setValue.createTime = data.applyDate ? moment(data.applyDate) : undefined
        setValue.consultantCategoryKeys =
          data.dicConsultantCategoryList ?
          data.dicConsultantCategoryList
          .map(item => item.value && item.value.toString()) || [] : []
        setFieldsValue({
          ...setValue,
        })
      } else {
        message.warn('此证件号尚未输入系统！')
      }
    }
  }

  const props = {
    name: 'file',
    action: '//jsonplaceholder.typicode.com/posts/',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const treeProps = {
    treeData: treeCaseReason,
    multiple:true,
    // treeCheckable: true,
    size: "large",
    placeholder: "",
    treeNodeFilterProp: 'label',
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

  const turnBack = (e) => {
    dispatch(routerRedux.push('/adviceSort'))
  }

  return (
    <div>
        <Form className={styles.content}>

          <Row className={styles.mb10}>
            <h2 className={styles.hover} onClick={turnBack}><Icon type="left" />返回待办网上留言咨询</h2>
          </Row>

          <Row>
            {
              /*<Col span={12}>
                <FormItem {...formItemLayout} label="咨询类型来源">
                  {getFieldDecorator('dicSource', {
                    initialValue: [item.dicSource, item.dicConsultType],
                    rules: [{
                        required: true,
                        message: '请选择来源'
                      },
                    ],
                  })(
                    <Cascader size="large" options={consult_source} onChange={sourceChange} placeholder="请选择来源渠道" />
                  )}
                </FormItem>
              </Col>*/
            }
          </Row>

          <Row>

            <Col span={12}>
              <FormItem {...formItemLayout} label="咨询人姓名">
                {getFieldDecorator('name', {
                  initialValue: item.name,
                  rules: [
                    {
                      required: true,
                      message: '请输入咨询人姓名'
                    },
                  ],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem {...formItemLayout} label="咨询时间">
                {getFieldDecorator('createTime', {
                  initialValue: item.createTime ? moment(item.createTime) : undefined,
                  rules: [{
                      required: true,
                      message: '请选择咨询时间'
                    },
                  ],
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="输入格式（2017-01-01 00:00:00）"
                    style={{width:230}}
                  />
                )}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem {...formItemLayout} label="联系电话">
                {getFieldDecorator('mobile', {
                  initialValue: item.mobile,
                  rules: [
                    {
                      required: true,
                      message: '请输入正确的联系电话'
                    },
                  ],
                })(
                  <Input/>
                )}
              </FormItem>
            </Col>

            {
              item.dicSource == 'telephone' ?
              ''
              :
              <Col span={12}>
                <FormItem {...formItemLayout} label="证件类型">
                  {getFieldDecorator('dicCardType', {
                    initialValue: item.dicCardType,
                    rules: [
                      {
                        required: true,
                        message: '请选择证件类型'
                      },
                    ],
                  })(
                    <Select
                      showSearch
                      className={styles.block}
                      optionFilterProp="children"
                      onChange={handleChange}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {jsUtil.getDictDataByKey('dic_credentials_type').map(d=> <Option key={d.code}>{d.name}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
            }
            
            <Col span={12}>
              <FormItem {...formItemLayout} label="咨询人性别">
                {getFieldDecorator('dicGender', {
                  initialValue: item.dicGender,
                })(
                  <RadioGroup onChange={onChange}>
                    <Radio value={'1'}>男</Radio>
                    <Radio value={'2'}>女</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>

            {
              item.dicSource == 'telephone' ?
              ''
              :
              <Col span={12}>
                <FormItem {...formItemLayout} label="证件号码">
                  <Row gutter={8}>
                    <Col span={18}>
                    {getFieldDecorator('cardCode', {
                      initialValue: item.cardCode,
                    })(
                      <Input size="large" />
                    )}
                    </Col>
                    <Col span={2}>
                      <Button onClick={searchApplyerByIdCard} size="large">查询</Button>
                    </Col>
                  </Row>
                </FormItem>
              </Col>
            }

            {
              item.dicSource == 'visit' ?
              <Col span={12}>
                <FormItem {...formItemLayout} label="同来人数">
                  {getFieldDecorator('arrivals', {
                    initialValue: item.arrivals
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col> : ''
            }

            {
              item.dicSource == 'telephone' ?
              ''
              :
              <Col span={12}>
                <FormItem {...formItemLayout} label="出生日期">
                  {getFieldDecorator('birthdate', {
                    initialValue: item.birthdate ? moment(item.birthdate) : undefined,
                  })(
                    <DatePicker/>
                  )}
                </FormItem>
              </Col>
            }
            
            {
              item.dicSource == 'telephone' ?
              ''
              :
              <Col span={12}>
                <FormItem {...formItemLayout} label="国家和地区">
                  {getFieldDecorator('dicNationality', {
                    initialValue: item.dicNationality,
                  })(
                    <Select
                      showSearch
                      className={styles.block}
                      optionFilterProp="children"
                      onChange={handleChange}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {jsUtil.getDictDataByKey('dic_nationality').map(d=> <Option key={d.code}>{d.name}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
            }
            
            {
              item.dicSource == 'telephone' ?
              ''
              :
              <Col span={12}>
                <FormItem {...formItemLayout} label="户籍地">
                  {getFieldDecorator('regis', {
                    initialValue: item.regis,
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            }

            {
              item.dicSource == 'telephone' ?
              ''
              :
              <Col span={12}>
                <FormItem {...formItemLayout} label="民族">
                  {getFieldDecorator('dicNation', {
                    initialValue: item.dicNation,
                  })(
                    <Select
                      showSearch
                      className={styles.block}
                      optionFilterProp="children"
                      onChange={handleChange}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {jsUtil.getDictDataByKey('dic_ethnic_group').map(d=> <Option key={d.code}>{d.name}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
            }

            {
              item.dicSource == 'telephone' ?
              ''
              :
              <Col span={12}>
                <FormItem {...formItemLayout} label="通讯地址">
                  {getFieldDecorator('legalInstAddr', {
                    initialValue: item.legalInstAddr,
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            }

            {
              item.dicSource == 'telephone' ?
              ''
              :
              <Col span={12}>
                <FormItem {...formItemLayout} label="文化程度">
                  {getFieldDecorator('dicEduLevel', {
                    initialValue: item.dicEduLevel,
                  })(
                    <Select
                      showSearch
                      className={styles.block}
                      optionFilterProp="children"
                      onChange={handleChange}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {jsUtil.getDictDataByKey('dic_cultural_level').map(d=> <Option key={d.code}>{d.name}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
            }
            
            <Col span={24}>
              <FormItem {...rowItemLayout} label="咨询人类别">
                {getFieldDecorator('consultantCategoryKeys', {
                  initialValue: personType,
                  rules: [
                    {
                      required: true,
                      message: '请选择咨询者类型'
                    },
                  ],
                })(
                  <Checkbox.Group>
                    <Row>
                      {options}
                    </Row>
                  </Checkbox.Group>
                )}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem {...formItemLayout} label="咨询标题">
                {getFieldDecorator('consultTitle', {
                  initialValue: item.consultTitle,
                  rules: [
                    {
                      required: true,
                      message: '请输入咨询标题'
                    },
                  ],
                })(
                  <Input/>
                )}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem {...formItemLayout} label="咨询案由">
                {getFieldDecorator('caseReasons', {
                  initialValue: caseReasons,
                  rules: [
                    {
                      required: true,
                      message: '请输入咨询案由'
                    },
                  ],
                })(
                  <TreeSelect dropdownStyle={{maxHeight: 200, overflow: 'auto'}} {...treeProps} />
                )}
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem {...rowItemLayout} label="咨询内容">
                {getFieldDecorator('consultContent', {
                  initialValue: item.consultContent ? item.consultContent : undefined,
                  rules: [
                    {
                      required: true,
                      message: '请输入咨询内容'
                    },
                  ],
                })(
                  <TextArea rows={4} />
                )}
              </FormItem>
            </Col> 

            <Col span={12}>
              <FormItem {...formItemLayout} label="处理方式">
                {getFieldDecorator('dicTreatmentMode', {
                  initialValue: item.dicTreatmentMode,
                  rules: [
                    {
                      required: true,
                      message: '请选择处理方式'
                    },
                  ],
                })(
                  <Select
                    showSearch
                    className={styles.block}
                    optionFilterProp="children"
                    onChange={handleChange}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {jsUtil.getDictDataByKey('dic_consult_treatment_mode').map(d=> <Option key={d.code}>{d.name}</Option>)}
                  </Select>
                )}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem {...formItemLayout} label="答复时间">
                {getFieldDecorator('submitTime', {
                  initialValue: item.submitTime ? moment(item.submitTime) : undefined,
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="输入格式（2017-01-01 00:00:00）"
                    style={{width:230}}
                  />
                )}
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem {...rowItemLayout} label="答复意见">
                {getFieldDecorator('answerSuggestion', {
                  initialValue: item.answerSuggestion ? item.answerSuggestion : undefined,
                  rules: [
                    {
                      required: true,
                      message: '请输入答复意见'
                    },
                  ],
                })(
                  <TextArea rows={4} />
                )}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem {...formItemLayout} label="是否公开到互联网">
                {getFieldDecorator('isOpen', {
                  initialValue: item.isOpen,
                  rules: [
                    {
                      required: true,
                      message: '请选择是否公开到互联网'
                    },
                  ],
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
                <p>{files}</p>
              </FormItem>
            </Col>

            <Col span={12} style={{display:'none'}}>
              <FormItem {...formItemLayout} label="咨询人ID">
                {getFieldDecorator('tRpUserId')(
                  <Input/>
                )}
              </FormItem>
            </Col>

          </Row>

          <Row type="flex" justify="center">
            <Col span={4}>
              <Button type="primary" size="large" onClick={handleSubmit}>提交</Button>
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
            
        </div>
    </div>
  )
}

AdviceEdit.propTypes = {
  form: PropTypes.object,
  adviceEdit: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ adviceEdit }) => ({ adviceEdit }))(Form.create()(AdviceEdit)) 
