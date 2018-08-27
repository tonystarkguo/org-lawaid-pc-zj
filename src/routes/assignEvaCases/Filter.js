import React from 'react'
import moment from 'moment'
import { FilterItem } from '../../components'
import { Form, Button, Row, Col, TreeSelect, DatePicker, Input, Switch, Cascader, FormItem, Select } from 'antd'
import styles from './index.less'
import { createDicNodes, jsUtil } from '../../utils'
import PreSearch from '../../controls/PreSearch'
const { createSelectOption } = createDicNodes
const createTreeBydics = jsUtil.createTreeBydics
const createCurrentList = jsUtil.createCurrentList
const filterArrName = jsUtil.filterArrName
const getCurrentDics = (caseTypeCode, dics) => {
  switch (caseTypeCode) {
    case '01':
      return dics[1].children || []
    case '02':
      return dics[0].children || []
    case '03':
      return dics[2].children || []
    default:
      return []
  }
}
// 过滤器
const Filter = ({
    filter,
    caseType_list,
    caseReason_list,
    onFilterChange,
    assignEvaCases,
    handleCaseTypeChange1,
    form: {
        getFieldDecorator,
        getFieldsValue,
        setFieldsValue,
        getFieldValue,
    },
}) => {
  const allConfig = JSON.parse(localStorage.getItem('allConfig')) || {}
  const { dictData } = allConfig || {}
  const {
    dic_org_case_stage,
    dic_case_type,
    dic_legal_status,
    dic_dic_closing_method,
    dic_dic_closing_method_to,
    dic_dic_case_effect,
    dic_dic_case_effect_to,
    dic_civil_closing_doc, // 民事
    dic_criminal_closing_doc, // 刑事
    dic_administration_closing_doc, // 行政
  } = dictData || {}

  let dic_closing_method = jsUtil.getDictDataByKey('dic_dic_closing_method') // 结案方式一级
  let dic_closing_method_to = jsUtil.getDictDataByKey('dic_dic_closing_method_to') // 结案方式二级
  let dicClosingMethod = createTreeBydics(dic_dic_closing_method, dic_dic_closing_method_to) || []// 结案方式1
  dicClosingMethod = createCurrentList(dicClosingMethod) || []
  const extList = [{name:"",id:""}];//工作区域的数据结构  
    // 列
  const ColProps = {
      span: 8,
      style: {
          marginBottom: 16,
        },
    }
    // 案件类型.
    const caseTypeProps = {
      multiple: true,
      treeCheckable: true,
      size: 'default',
      treeNodeFilterProp: 'label',
      treeCheckStrictly: true,
      placeholder: '请选择案件类型',
    }
	if(getFieldValue('caseType') == undefined){
			localStorage.removeItem('new_dic_standing')
		}
	const handleCaseTypeChange = (value) => {
  if (getFieldValue('dicStep')) {
		 setFieldsValue({
   dicStep: [],
 })
}
  handleCaseTypeChange1(value)
}
    // 案由
  const caseReasonProps = {
      multiple: true,
      treeCheckable: true,
      size: 'default',
      treeNodeFilterProp: 'label',
      treeCheckStrictly: true,
      placeholder: '请选择案由',
    }
    // 时间适配.
    const handleTime = (fields) => {
      const { docTime } = fields
        if (docTime && docTime.length) {
          fields.archiveStart = docTime[0] ? docTime[0].format('YYYY-MM-DD'):'';
          fields.archiveEnd = docTime[1] ? docTime[1].format('YYYY-MM-DD'):'';
        }
      delete fields.docTime
        return fields
    };
    // 格式转换.
  const handleArrayV = (items) => {
      let vs = []
        let vsnm = []
        for (let i in items) {
          vs.push(items[i].value)
            vsnm.push(items[i].label)
        }
      return [vs.join(','), vsnm.join(',')]
    };
    // 搜索.
  const handleSubmit = () => {
      let fields = getFieldsValue()
        if (fields.dicClosingMethod) {
          fields.dicClosingMethodTo = fields.dicClosingMethod[1] || ''
        }
      fields = handleTime(fields);
      [fields.reasons, fields.reasons_nm] = handleArrayV(fields.reasons)
        onFilterChange(fields)
    };
  const new_dic_standing = localStorage.getItem('new_dic_standing') && JSON.parse(localStorage.getItem('new_dic_standing')) || []
  caseTypeProps.treeData = caseType_list
    caseReasonProps.treeData = caseReason_list

    // DOM
    return (
        <Row gutter={24}>
            <Col {...ColProps}>
                <FilterItem label="案件类型">
                {getFieldDecorator('caseType')(
                    <Select allowClear placeholder="选择案件类型" className={styles.block} onChange={handleCaseTypeChange}>
                        {createSelectOption({ list: caseTypeProps.treeData })}
                    </Select>
                )}
                </FilterItem>
            </Col>

            <Col {...ColProps}>
                <FilterItem label="案由">
                {getFieldDecorator('reasons')(
                    <TreeSelect className={styles.block} {...caseReasonProps} />
                )}
                </FilterItem>
            </Col>

            <Col {...ColProps}>
                <FilterItem label="援助人员所在工作单位">
                {getFieldDecorator('workUnit')(
                    <Input />
                )}
                </FilterItem>
            </Col>

            <Col {...ColProps}>
                <FilterItem label="归档日期">
                {getFieldDecorator('docTime')(
                    <DatePicker.RangePicker className={styles.block} />
                )}
                </FilterItem>
            </Col>
         		<Col {...ColProps}>
              <FilterItem label="结案方式">
                {getFieldDecorator('dicClosingMethod')(
                  <Cascader size="large" options={dicClosingMethod} placeholder="请选择结案方式" />
                )}
              </FilterItem>
            </Col>
              <Col {...ColProps}>
                <FilterItem label="法律状态">
                 	{getFieldDecorator('dicStep')(
                 		<Select allowclear placerholder="请选择法律状态" className={styles.block}>
                 		{createSelectOption({ list: new_dic_standing })}
                 	</Select>)}
                </FilterItem>
              </Col>
              <Col {...ColProps} >
                <FilterItem label="援助人员工作区域">
                  {getFieldDecorator('areaCode')(
                      <PreSearch api="getHpBelongArea" paramsKey="area"  className={styles.block}/>
                      )}
                </FilterItem>
              </Col>
            <Col {...ColProps}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <Button type="primary" className="margin-right" onClick={handleSubmit}>搜索</Button>
                    </div>
                </div>
            </Col>
        </Row>
    )
};

export default Form.create({
  mapPropsToFields (props) {
      let filter = props.filter
        return {
          ...filter,
        }
    },
  onFieldsChange (props, fields) {
     let flds = fields
     if (flds.caseType) {
  flds.dicStep = { name: 'dicStep', value: '' }
}
     props.update({
  filter: {
  ...props.filter,
  ...flds,
},
})
   },
})(Filter)
