import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Select, Checkbox, Row, Col } from 'antd'
import { createDicNodes } from '../../../utils'
import styles from './index.less'

const CheckboxGroup = Checkbox.Group
const FormItem = Form.Item
const Option = Select.Option
const { createRadioButton, createSelectOption, createRadio } = createDicNodes

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const SelectPrintModal = ({
  item = {},
  onOk,
  onCancel,
  allConfig = {},
  tagList = [],
  roles,
  lawcaseDetail,
  title = '选择要打印的文书',
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
  },
  ...selectPrintModalProps
}) => {
  
  let x = selectPrintModalProps.emptydocsList
  const dicEmptyWordName = x.map((d,index) => <Col span={12} key={index}><Checkbox value={d.materialName}>{d.materialName}</Checkbox></Col>)
  let y = selectPrintModalProps.docsList
 
  const dicWordName = y.map((d,index) => <Col span={12} key={index}><Checkbox value={d.tCaseMaterialStorageId}>{d.htmlName}</Checkbox></Col>)
  let yinitialValue=y.map((d)=>d.tCaseMaterialStorageId);
  const { areaData = {}, dictData = {} } = allConfig
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      let data = {
        ...getFieldsValue(),
      }
      if(data.dicEmptyWordName == undefined){
        data.dicEmptyWordName =""
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...selectPrintModalProps,
    onOk: handleOk,
    title,
    onCancel,
    okText: '打 印',
    cancelText: '取消',
    width: 1000,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
      <FormItem label="文书类材料"  {...formItemLayout}>
						{getFieldDecorator('dicWordName',({initialValue:yinitialValue}))(
                <Checkbox.Group >
                  <Row>
                    {dicWordName}
                  </Row>
                </Checkbox.Group>
              )}      		
        </FormItem>
      	<FormItem label="常用文书模板"  {...formItemLayout}>
						{getFieldDecorator('dicEmptyWordName')(
                <Checkbox.Group >
                  <Row>
                    {dicEmptyWordName}
                  </Row>
                </Checkbox.Group>
              )}      		
        </FormItem>
      </Form>
    </Modal>
  )
}

SelectPrintModal.propTypes = {
  form: PropTypes.object.isRequired,
  title: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  allConfig: PropTypes.object,
}

export default Form.create()(SelectPrintModal)
