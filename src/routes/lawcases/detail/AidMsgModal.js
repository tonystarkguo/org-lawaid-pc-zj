import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, message, Tag, Select, Button, Card, Row, Col, Checkbox } from 'antd'
import { createDicNodes } from '../../../utils'
import styles from './index.less'

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

const AidMsgModal = ({
  onOk,
  onCancel,
  handleAddPerson,
  handleDelAidPerson,
  handleChangeAidPerson,
  allConfig = {},
  roles,
  onsetMainLawyer,
  lawcaseDetail,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
    resetFields,
  },
  ...aidMsgModalProps
}) => {
  
  const aidMsg = aidMsgModalProps.caseDetail.aidMsg || []
  const onChange = (checkedValues) => {
    console.log('checked =',checkedValues )
  }
  const addAidPerson = () => {
      handleAddPerson()
  }
  const delAidPerson = () => {
    const data = {
      ...getFieldsValue(),
    }
    resetFields()
   handleDelAidPerson(data)
  }
  const changeAidPerson = () => {
    const data = {
      ...getFieldsValue(),
    }
    
    localStorage.setItem('changedPerson',JSON.stringify(data))
    if(data.tHpUserIds == undefined){
      message.warning("请选择要更换的承办人")
    }else if(data.tHpUserIds.length>1){
        message.warning("一次只能更换一个承办人")
    }else{
     handleChangeAidPerson()
     resetFields()
    }
  }
  const setMainLawyer = (tag) => {
    let tagId = tag.tHpUserId
    onsetMainLawyer(tagId)
  }

 const footer = (<Button key="back" size="large" onClick={onCancel}>取消</Button>)
  const modalOpts = {
    ...aidMsgModalProps,
    width: 900,
    footer: footer,
    onCancel,
  }
  
  const options = aidMsg.map((item,index) =>  
  <div>
  <Checkbox value={item.tHpUserId} className={styles.inlineW20} key={item.tHpUserId}></Checkbox>
  <div className={styles.inline}  key={index} >
      <Card className={styles.w865}>
        <Row gutter={16}>
          <Col span={4}>
          <Tag color="blue" onClick={()=> setMainLawyer(item)} >      
                              {item.isMain==1?'主承办人':'设为主承办人'}
                              
                              </Tag>
            <div className={styles.aidHeadWrap}>
              <img className={styles.aidHead} src={item.hpHeadpic} alt="援助人头像" />
            </div>
          </Col>
          <Col span={20}>
            <Col className="gutter-row" span={12}>
              <div>援助人员姓名：{item.name}</div>
            </Col>
            <Col className="gutter-row" span={12}>
              <div>法律援助人员类型：{item.dicHpIdentity || item.dicLawyerTypeValue}</div>
            </Col>
          </Col>
          <Col span={20}>
            <Col className="gutter-row" span={12}>
              <div>联系电话：{item.mobile}</div>
            </Col>
            <Col className="gutter-row" span={12}>
              <div>工作区域：{item.areaCode}</div>
            </Col>
            <Col span={24} className="gutter-row">
              <div>业务专长：{item.tTagGoodField || item.goodFields}</div>
            </Col>
            <Col span={24}>
              <div>工作单位：{item.tWorkUnit || item.lawfirmName}</div>
            </Col>
          </Col>
        </Row>
      </Card>
    </div>
  </div>)

  return (
    <Modal {...modalOpts}>
      <div>
        <Form>
        <FormItem>
          {getFieldDecorator("tHpUserIds")(
           <Checkbox.Group>
           <Row>
             {options}
           </Row>
         </Checkbox.Group>
          )}
        </FormItem>
        </Form>
      <Row type="flex" justify="center" gutter={16}  className={styles.pt20}>
              <Button type="primary" className={styles.mr10} onClick={addAidPerson}>新增承办人员</Button>
              <Button type="primary" className={styles.mr10} onClick={delAidPerson}>删除承办人员</Button>
              <Button type="primary" className={styles.mr10} onClick={changeAidPerson}>更换承办人员</Button>
            </Row>
    </div>
    </Modal>
  )
}

AidMsgModal.propTypes = {
  form: PropTypes.object.isRequired,
  title: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  allConfig: PropTypes.object,
}

export default Form.create()(AidMsgModal)
