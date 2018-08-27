import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'
import moment from 'moment'
import { Form, Row, Col, Spin, Button, Input, Select, Cascader, message } from 'antd'
import { createDicNodes, jsUtil } from '../../../utils'

const {createRadioButton, createSelectOption} = createDicNodes
const SelectOption = Select.Option
const FormItem = Form.Item
const { TextArea } = Input;
const createTreeBydics = jsUtil.createTreeBydics
const createCurrentList = jsUtil.createCurrentList

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

const CaseResult = ({ 
  lawcaseDetail,
  handleCaseTakeInfoEdit,
  handleCaseTakeInfoSave,
  handleCaseTakeInfoCancel,
  handleCommitcaseInfoSave,
  form: {
    setFieldsValue,
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    resetFields
  }
}) => {

  const { caseHandleResult, caseBaseInfoData, isCaseTakeInfoEditing, allConfig,caseStatus } = lawcaseDetail
  const {areaData, dictData, organizationTypeData} = allConfig
  const { caseTypeCode } = caseBaseInfoData

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

  // 点击保存
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
          data.dicClosingMethod = data.dicClosingMethod[0] || ''
          //结案方式二级
          data.dicClosingMethodTo = data.dicClosingMethod[1] || ''
          //案件效果一级
          data.dicCaseEffect = data.dicCaseEffect[0] || ''
          //案件效果二级
          data.dicCaseEffectTo = data.dicCaseEffect[1] || ''
          //挽回经济损失
          data.saveLosses = Number(data.saveLosses)
          //为农民工讨薪
          data.pleasePay = Number(data.pleasePay)
          
          handleCaseTakeInfoSave(data)
        }
  }
  
		//提交结案
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
          data.dicClosingMethod = data.dicClosingMethod[0] || ''
          //结案方式二级
          data.dicClosingMethodTo = data.dicClosingMethod[1] || ''
          //案件效果一级
          data.dicCaseEffect = data.dicCaseEffect[0] || ''
          //案件效果二级
          data.dicCaseEffectTo = data.dicCaseEffect[1] || ''
          //挽回经济损失
          data.saveLosses = Number(data.saveLosses)
          //为农民工讨薪
          data.pleasePay = Number(data.pleasePay)
          console.log(data)
          handleCommitcaseInfoSave(data)
        }
    })
  }
  // 点击编辑
  const handleEditBaseInfo = (e) => {
    handleCaseTakeInfoEdit()
  }

  // 点击取消
  const rtFileds = (e) => {
    resetFields()
    handleCaseTakeInfoCancel()
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
  			<Form layout="horizontal">
          {isCaseTakeInfoEditing ? editingBtns : editBtn}
          <Row gutter={16}>
            <Col span={12}>
              <FormItem {...formItemLayout} label="办案机关">
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
              <FormItem {...formItemLayout} label="结案文书">
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
              <FormItem {...formItemLayout} label="文号">
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
              <FormItem {...formItemLayout} label="结案方式">
                {getFieldDecorator('dicClosingMethod', {
                  initialValue: [caseHandleResult.dicClosingMethod, caseHandleResult.dicClosingMethodTo]//caseHandleResult.dicClosingDocName,
                })(
                  <Cascader size="large" options={dicClosingMethod} placeholder="请选择结案方式" disabled={!isCaseTakeInfoEditing} />
                )}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem {...formItemLayout} label="案件效果">
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
              <FormItem {...formItemLayout} label="上诉情况">
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
              <FormItem {...formItemLayout} label="代写上诉状">
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
                <FormItem {...formItemLayout} label="挽回经济损失">
                  {getFieldDecorator('saveLosses', {
                    initialValue: caseHandleResult.saveLosses,
                  })(
                  <Input type="number" size="large" addonAfter={<span>元</span>} disabled={!isCaseTakeInfoEditing} placeholder="输入不能超过六位数字" />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="为农民工讨薪">
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
          {(caseStatus>=14 && caseStatus<=17) && isCaseTakeInfoEditing && <Row
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
        </Form>
      )
}

CaseResult.propTypes = {
  lawcaseDetail: PropTypes.object,
  handleCaseTakeInfoEdit: PropTypes.func,
  handleCaseTakeInfoSave: PropTypes.func,
  handleCaseTakeInfoCancel: PropTypes.func,
  handleCommitcaseInfoSave: PropTypes.func,
}

export default Form.create()(CaseResult)