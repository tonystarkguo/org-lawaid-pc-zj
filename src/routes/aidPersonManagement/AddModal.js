import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Radio, Modal, Row, Col, DatePicker, Select, Button, Upload, TreeSelect, Icon } from 'antd'
import moment from 'moment'
import styles from './List.less'
import { createDicNodes, jsUtil } from '../../utils'
import PreSearch from '../../controls/PreSearch'

const FormItem = Form.Item
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { TextArea } = Input;
const { createRadio, createSelectOption } = createDicNodes

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 13,
  },
}

const modal = ({
  onOk,
  onUpdateFile,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
  },
  ...addModalProps
}) => {

  const { item, allConfig, fileData, imgUrl, addModalType } = addModalProps
  if(item.goodFieldsId){
    var tagGoodFields = item.goodFieldsId.split(',')
    }
  const { dictData } = allConfig
  const { dic_business_expertise_one = [], dic_business_expertise_two = [] } = dictData
  let businessEexpertise = jsUtil.getDictDataByKey('dic_business_expertise_one')
  let business_expertise_two = jsUtil.getDictDataByKey('dic_business_expertise_two')
  if(businessEexpertise[0]) {
    businessEexpertise.forEach(item => {
      item.label = item.name
      item.value = item.code
    })
    const legalAdviser = business_expertise_two.splice(0,3)
    legalAdviser.forEach(item => {
      item.label = item.name
      item.value = item.code
    })
    businessEexpertise[0].children = legalAdviser
  }
  if(businessEexpertise[1]) {
    const civilService = business_expertise_two.splice(0,8)
    civilService.forEach(item => {
      item.label = item.name
      item.value = item.code
    })
    businessEexpertise[1].children = civilService
  }
  if(businessEexpertise[2]) {
    const companyService = business_expertise_two.splice(0,5)
    companyService.forEach(item => {
      item.label = item.name
      item.value = item.code
    })
    businessEexpertise[2].children = companyService
  }
  if(businessEexpertise[3]) {
    const economicCorrelation = business_expertise_two.splice(0,10)
    economicCorrelation.forEach(item => {
      item.label = item.name
      item.value = item.code
    })
    businessEexpertise[3].children = economicCorrelation
  }
  if(businessEexpertise[4]) {
    const criminalBusiness = business_expertise_two.splice(0,1)
    criminalBusiness.forEach(item => {
      item.label = item.name
      item.value = item.code
    })
    businessEexpertise[4].children = criminalBusiness
  }
  if(businessEexpertise[5]) {
    const administration = business_expertise_two.splice(0,1)
    administration.forEach(item => {
      item.label = item.name
      item.value = item.code
    })
    businessEexpertise[5].children = administration
  }
  if(businessEexpertise[6]) {
    const foreignBusiness =  business_expertise_two.splice(0,8)
    foreignBusiness.forEach(item => {
      item.label = item.name
      item.value = item.code
    })
    businessEexpertise[6].children = foreignBusiness
  }
  businessEexpertise.forEach(item => {
    item.label = item.name,
    item.value = item.code
  })
  let treeDefaultExpandedKeys = []
    if(businessEexpertise && businessEexpertise.length && businessEexpertise[0].children.length){
    treeDefaultExpandedKeys.push(businessEexpertise[0].value)
  }
  const treeProps = {
    treeData:businessEexpertise,
    multiple:true,
    size: "large",
    placeholder: "",
    treeNodeFilterProp: 'label',
    treeCheckStrictly: true,
    treeDefaultExpandedKeys,
    onSelect: (value, node, extra) => {
      let tagGoodField = getFieldValue('goodFieldsId')
      if(node.props.children){
        setTimeout(()=>{
          tagGoodField = _.reject(tagGoodField, (item)=> item === value)
          setFieldsValue({goodFieldsId: tagGoodField})
        }, 10)
      }
    },
    getPopupContainer: () => document.getElementById('scroll-area')
  }
  const handleOk = () => {
    validateFields((errors) => {
      if(errors){
        return
      };
      const data = {
        ...getFieldsValue(),
        headPic: imgUrl,
      }
      if(data.goodFieldsId==undefined||data.goodFieldsId==null){
        data.goodFieldsId= null;
      }
      data.goodFieldsId = data.goodFieldsId && data.goodFieldsId.toString();
      
      onOk(data)
    })
  }

  const modalOpts = {
    ...addModalProps,
    onOk: handleOk,
    width: 1200
  }

  const uploadProps = {
    action: '/uploadtopub',
    showUploadList: false,
    data: (file) => {
      const dt = new Date().format('yyyyMMdd')
      const lg = new Date().getTime()
      let h = fileData
      h.key = 'orm/' + dt + '/' + lg + '_'+ '${filename}'
      return h
    },
    onChange({file = {}, fileList=[]}) {
      if (file.status === 'done') {
        onUpdateFile(file)
      }
    },
  }

  const extList = [{ id: item.lawfirmId, name: item.lawfirmName }]

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">

        <Row>
          <Col span={12}>
            <FormItem label="姓名" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: item.name,
                rules: [
                  {
                    required: true,
                    message: '请输入姓名'
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label="性别" hasFeedback {...formItemLayout}>
              {getFieldDecorator('dicGender', {
                initialValue: item.dicGender,
                rules: [
                  {
                    required: true,
                    message: '请选择性别'
                  },
                ],
              })(
                <RadioGroup>
                  <Radio value={'1'}>男</Radio>
                  <Radio value={'2'}>女</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          {
            addModalType === 'add' ?
            <Col span={12}>
              <FormItem label="证件类型" hasFeedback {...formItemLayout}>
                {getFieldDecorator('dicCardType', {
                  initialValue: item.dicCardType,
                  rules: [
                    {
                      required: true,
                      message: '请选择证件类型'
                    },
                  ],
                })(
                  <Select size="large" allowClear >
                    {createSelectOption({list:dictData.dic_credentials_type})}
                  </Select>
                )}
              </FormItem>
            </Col>
            :
            <Col span={12}>
              <FormItem label="证件类型" hasFeedback {...formItemLayout}>
                {getFieldDecorator('dicCardType', {
                  initialValue: item.dicCardType,
                })(
                  <Select size="large" allowClear disabled>
                    {createSelectOption({list:dictData.dic_credentials_type})}
                  </Select>
                )}
              </FormItem>
            </Col>
          }
          
          <Col span={12}>
            <FormItem label="法律援助人员类型" hasFeedback {...formItemLayout}>
              {getFieldDecorator('dicLawyerType', {
                initialValue: item.dicLawyerType,
                rules: [
                  {
                    required: true,
                    message: '请选择法律援助人员类型'
                  },
                ],
              })(
                <Select size="large" allowClear >
                  {createSelectOption({list:dictData.dic_lawyer_type})}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          {
            addModalType === 'add' ?
            <Col span={12}>
              <FormItem label="证件号码" hasFeedback {...formItemLayout}>
                {getFieldDecorator('cardCode', {
                  initialValue: item.cardCode,
                  rules: [
                    {
                      required: true,
                      message: '请输入证件号码'
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            :
            <Col span={12}>
              <FormItem label="证件号码" hasFeedback {...formItemLayout}>
                {getFieldDecorator('cardCode', {
                  initialValue: item.cardCode,
                })(<Input disabled />)}
              </FormItem>
            </Col>
          }

          <Col span={12}>
            <FormItem label="工作单位" hasFeedback {...formItemLayout}>
              {getFieldDecorator('lawfirmId', {
                initialValue: item.lawfirmId ? item.lawfirmId : '',
                rules: [
                  {
                    required: true,
                    message: '请输入工作单位',
                  },
                ],
              })(
                <PreSearch api="getLawfirm" extList={extList} />
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="手机号码" hasFeedback {...formItemLayout}>
              {getFieldDecorator('mobile', {
                initialValue: item.mobile,
                rules: [
                  {
                    required: true,
                    message: '请输入手机号码'
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label="资格证号" hasFeedback {...formItemLayout}>
              {getFieldDecorator('qualcode', {
                initialValue: item.qualcode,
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="执业证号" hasFeedback {...formItemLayout}>
              {getFieldDecorator('lawyerCard', {
                initialValue: item.lawyerCard,
                rules: [
                  {
                    required: true,
                    message: '请输入执业证号'
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="出生日期" hasFeedback {...formItemLayout}>
              {getFieldDecorator('birthdate', {
                initialValue: item.birthdate ? moment(item.birthdate) : undefined
              })(
                <DatePicker className={styles.block} />
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="获得荣誉" hasFeedback {...formItemLayout}>
              {getFieldDecorator('gloryMemo', {
                initialValue: item.gloryMemo ? item.gloryMemo : undefined,
              })(<TextArea rows={4} />)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label="是否获得行政或纪律处分" hasFeedback {...formItemLayout}>
              {getFieldDecorator('punishmentDetail', {
                initialValue: item.punishmentDetail ? item.punishmentDetail : undefined,
              })(<TextArea rows={4} placeholder="是否获得行政或纪律处分" />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="头像" hasFeedback {...formItemLayout}>
              <Upload {...uploadProps}>
                {
                  imgUrl == '' ?
                  <div className="avatar-uploader-trigger">
                    <Icon className="avatar-uploader-icon" type="plus" />
                    {
                      item.headPic == ''|| item.headPic == undefined ?
                      '' : <img src={item.headPic} alt="" className="avatar" />
                    }
                  </div>
                  :
                  <img src={imgUrl} alt="" className="avatar" />
                }
              </Upload>
            </FormItem>
          </Col>
          <Col span={12}>
          <FormItem {...formItemLayout} label="业务专长">
                  {getFieldDecorator('goodFieldsId', {
                initialValue: tagGoodFields,
              })( <TreeSelect  className={styles.block} dropdownStyle={{maxHeight: 200, overflow: 'auto'}} {...treeProps} />)}
                </FormItem>
          </Col>
        </Row>        
      
        {
          /*<Col span={12}>
            <FormItem label="民族" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请选择民族'
                  },
                ],
              })(
                <Select size="large" allowClear >
                  {createSelectOption({list:dictData.dic_ethnic_group})}
                </Select>
              )}
            </FormItem>
          </Col>*/
        }

        {
          /*<Col span={12}>
            <FormItem label="首次执业时间" hasFeedback {...formItemLayout}>
              {getFieldDecorator('time', {
                initialValue: item.time ? moment(item.time) : undefined
              })(
                <DatePicker className={styles.block} />
              )}
            </FormItem>
          </Col>*/
        }

        {
          /*<Col span={12}>
            <FormItem label="政治面貌" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name')(
                <Select size="large" allowClear >
                  {createSelectOption({list:dictData.dic_dic_political_status})}
                </Select>
              )}
            </FormItem>
          </Col>*/
        }
        
        {
          /*<Col span={12}>
            <FormItem label="职务" hasFeedback {...formItemLayout}>
              {getFieldDecorator('goodFields')(<Input />)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label="文化程度" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name')(
                <Select size="large" allowClear >
                  {createSelectOption({list:dictData.dic_cultural_level})}
                </Select>
              )}
            </FormItem>
          </Col>*/
        }

      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onUpdateFile: PropTypes.func,
}

export default Form.create()(modal)
