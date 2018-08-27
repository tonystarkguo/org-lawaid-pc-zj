import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { createDicNodes,constants } from '../../utils'
import { FilterItem } from '../../components'
import { Form, Button, Row, Col, DatePicker, Input, Select, TreeSelect, Cascader } from 'antd'
import _ from 'lodash'
const { RangePicker } = DatePicker
const Option = Select.Option
const {createSelectOption} = createDicNodes
const FormItem = Form.Item
const {dic_caseStatus,dic_dic_caseStatus} = constants
dic_caseStatus[0].name="终止法援待补贴"
const user = JSON.parse(localStorage.getItem('user')) || {}
const dic_work_caseStatus=[...dic_dic_caseStatus]
dic_work_caseStatus.splice(2)

const ColProps = {
  span: 8,
  style: {
    marginBottom: 15,
  },
}

const TwoColProps = {
  span: 16,
  style: {
    marginBottom: 15,
  }
}
const selectProps = {
  showSearch: true,
  optionFilterProp: "children"
}

const caseR = JSON.parse(localStorage.getItem('caseReasonList'))



const Filter = ({
  onFilterChange,
  filter,
  allConfig,
  searchKeys,
  allArea,
  onFieldsChange,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
    getFieldValue,
  },
}) => {
for (let key in allArea) {
    for (let i = 0; i < allArea[key].length; i++) {
      allArea[key][i].key = 'allArea' + key + i;
    }
  }
  if (allArea) {
    allArea.forEach((item, index) => {
      allArea[index].children = item['ormOrgRegionDtoList']
    })
  }
  allArea && allArea.map((item,index) => {
    item.label = item.cityName
    item.value = item.cityId
    item.children && item.children.map((item,index) => {
      item.label =item.cityName
      item.value = item.cityId
    })
  })
  allArea && allArea.children && allArea.children.map((item,index) => {
    item.label =item.cityName
    item.label = item.cityId
  })
  
  const {dictData = {}} = (allConfig || {})
  
  const isSearch = filter.type === '10'
  const caseStatusVisible = filter.type === '0'
  const treeProps = {
    treeData: caseR,
    multiple:true,
    // treeCheckable: true,
    size: "default",
    placeholder: "",
    treeNodeFilterProp: 'label',
    // treeCheckStrictly: true,
    onSelect: (value, node, extra) => {
      let caseRea = getFieldValue('caseReason')
      if(!node.props.isChild){
        setTimeout(()=>{
          caseRea = _.reject(caseRea, (item)=> item === value)
          setFieldsValue({caseReason: caseRea})
        }, 10)
      }
    },
    placeholder:'请选择案由',
    dropdownMatchSelectWidth: false,
  }
  const handleFields = (fields) => {
    /*const { createTime } = fields
    if (createTime.length) {
      fields.createTime = [createTime[0].format('YYYY-MM-DD'), createTime[1].format('YYYY-MM-DD')]
    }*/

    let hdFields = fields
    let caseReasonStr = ''
    if(hdFields.caseReason && hdFields.caseReason.length){
      let caseReasonArr = hdFields.caseReason
//    caseReasonArr = _.map(caseReasonArr, 'value')
      caseReasonStr = caseReasonArr.join(',')
    }
    hdFields.caseReason = caseReasonStr
    hdFields.searchFlag = 1

    if(hdFields.caseReasonStr === ''){
      delete hdFields.caseReasonStr
    }

    if(hdFields.caseType === ''){
      delete hdFields.caseType
    }

    if(hdFields.rpName === ''){
      delete hdFields.rpName
    }

    if(hdFields.undertakeName === ''){
      delete hdFields.undertakeName
    }


    return hdFields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    handleSubmit()
  }

  const handleChange = (key, values) => {

  }
  const { name, address } = filter

  let initialCreateTime = []
  if (filter.createTime && filter.createTime[0]) {
    initialCreateTime[0] = moment(filter.createTime[0])
  }
  if (filter.createTime && filter.createTime[1]) {
    initialCreateTime[1] = moment(filter.createTime[1])
  }

  const searchInfo = JSON.parse(localStorage.getItem('searchInfo'))
  return (<div>
    {isSearch ? (<Form className="ant-advanced-search-form">
          <Row gutter={16}>
            {isSearch &&  <Col {...ColProps}>
              <FilterItem label="案件类型:">
                {getFieldDecorator('caseType')(
                  <Select allowClear placeholder="选择案件类型">
                    {createSelectOption({list:dictData.dic_case_type})}
                  </Select>
                )}
              </FilterItem>
            </Col>}
            {isSearch &&  <Col {...ColProps}>
              <FilterItem label="案号:">
                {getFieldDecorator('caseNum')(
                  <Input placeholder="输入案号"/>
                )}
              </FilterItem>
            </Col>}
    
            <Col {...ColProps}>
              <FilterItem label="受援人姓名：">
                {getFieldDecorator('rpName')(              
                  <Input placeholder="输入受援人姓名"/>
                )}
              </FilterItem>
            </Col>
            {!isSearch &&  <Col {...ColProps}>
              <FilterItem label="电话：">
                {getFieldDecorator('rpUserMobile')(              
                  <Input placeholder="输入电话"/>
                )}
              </FilterItem>
            </Col>}
          </Row>
          <Row gutter={16}>
            {isSearch &&  <Col {...ColProps}>
              <FilterItem label="案由:">
              {getFieldDecorator('caseReason')(
                  <TreeSelect {...treeProps} />
                )}
              </FilterItem>
            </Col>}
    
            {isSearch &&  <Col {...ColProps}>
              <FilterItem label="承办单位:">
              {getFieldDecorator('undertakeOrgName')(              
                  <Input placeholder="输入承办单位"/>
                )}
              </FilterItem>
            </Col>}
            {isSearch &&  <Col {...ColProps}>
              <FilterItem label="承办人姓名:">
              {getFieldDecorator('undertakeName')(              
                  <Input placeholder="输入承办人姓名"/>
                )}
              </FilterItem>
            </Col>}
          </Row>
          <Row gutter={16}>
            {isSearch &&  <Col {...ColProps}>
              <FilterItem label="办案人员:">
              {getFieldDecorator('undertakeJudge')(              
                  <Input placeholder="输入办案人员"/>
                )}
              </FilterItem>
            </Col>}
    
            {isSearch &&  <Col {...ColProps}>
              <FilterItem label="通知函号:">
              {getFieldDecorator('noticeBoxNumber')(              
                  <Input placeholder="输入通知函号"/>
                )}
              </FilterItem>
            </Col>}
    					{isSearch &&  <Col {...ColProps}>
              <FilterItem label="案件状态:">
              {getFieldDecorator('caseStatus')(              
                  <Select allowClear placeholder="请选择案件状态">
                    {createSelectOption({list:dic_caseStatus})}
                  </Select>
                )}
              </FilterItem>
            </Col>}
            
          </Row>
    
          <Row gutter={16}>
          {isSearch &&  <Col {...ColProps}>
              <FilterItem label="指派评估日期:">
              {getFieldDecorator('assignDate')(              
                  <RangePicker style={{ width: '100%' }} />
                )}
              </FilterItem>
            </Col>}
            {isSearch &&  <Col {...ColProps}>
              <FilterItem label="审批操作日期:">
              {getFieldDecorator('completeDate')(              
                  <RangePicker style={{ width: '100%' }} />
                )}
              </FilterItem>
            </Col>}
            {isSearch &&  <Col {...ColProps}>
                <FilterItem  label="区域">
                  {getFieldDecorator('areaId')(<Cascader options={allArea} placeholder="请选择区域" onChange={(v) => console.log(v)} />)}
                </FilterItem>
                </Col>}
            <Col {...TwoColProps}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button type="primary" className="margin-right" onClick={handleSubmit}>搜索</Button>
              </div>
            </Col>
          </Row>
        </Form>) : (<Form>
          <Row gutter={16}>
            <Col {...ColProps}>
              <FilterItem label="受援人姓名：">
                {getFieldDecorator('rpName')(              
                  <Input placeholder="输入受援人姓名"/>
                )}
              </FilterItem>
            </Col>
            <Col {...ColProps}>
              <FilterItem label="电话：">
                {getFieldDecorator('rpUserMobile')(              
                  <Input placeholder="输入电话"/>
                )}
              </FilterItem>
            </Col>
             {caseStatusVisible && <Col {...ColProps}>
              <FilterItem label="案件状态:">
                 {getFieldDecorator('caseStatus')(              
                   <Select allowClear placeholder="请选择案件状态">
                     {user.roles[0].id =='36' ? createSelectOption({list:dic_work_caseStatus}) : 
                     	createSelectOption({list:dic_dic_caseStatus})}
	
                   </Select>
                 )}
               </FilterItem>
             </Col>}
              <Col {...ColProps}>
            <FilterItem label="案件类型:">
                {getFieldDecorator('caseType')(              
                  <Select allowClear placeholder="选择案件类型">
                    {createSelectOption({list:dictData.dic_case_type})}
                  </Select>
                )}
              </FilterItem>
              </Col>
            <Col span={2} style={{marginBottom:15}}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button type="primary" className="margin-right" onClick={handleSubmit}>搜索</Button>
              </div>
            </Col>
          </Row>
        </Form>)}
    </div>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Form.create({
  mapPropsToFields(props) {
    // console.log('mapPropsToFields', props);
    let searchKeys = props.searchKeys
    return {
      rpName: searchKeys.rpName,
      rpUserMobile: searchKeys.rpUserMobile,
      undertakeName: searchKeys.undertakeName,
      caseReason: searchKeys.caseReason,
      orgIds: searchKeys.orgIds,
      caseStatus: searchKeys.caseStatus,
      caseType: searchKeys.caseType,
      assignDate: searchKeys.assignDate,
      completeDate: searchKeys.completeDate,
      caseNum: searchKeys.caseNum,
      noticeBoxNumber: searchKeys.noticeBoxNumber,
      undertakeJudge: searchKeys.undertakeJudge,
      undertakeOrgName: searchKeys.undertakeOrgName,
    };
  },
  onFieldsChange(props, fields) {
    props.onFieldsChange(fields)
  },
})(Filter)
