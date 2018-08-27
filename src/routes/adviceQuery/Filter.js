import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from '../../components'
import { Form, Button, Row, Col, DatePicker, Input, Switch, Select, Cascader } from 'antd'
import city from '../../utils/city'
import styles from './List.less'
import { jsUtil,createDicNodes} from '../../utils/'

const Search = Input.Search
const { RangePicker } = DatePicker
const Option = Select.Option
const {createSelectOption} = createDicNodes
const allConfig = JSON.parse(localStorage.getItem('allConfig')) || {}
const {dictData} = allConfig || {}
const {dic_region} = dictData
const dic_dic_region =[...dic_region]
dic_region.splice(1,1)
const user = JSON.parse(localStorage.getItem('user')) || {}
const ColProps = {
  span: 6,
  style: {
    marginBottom: 16,
  },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

const selectProps = {
  mode: "tags", 
  optionFilterProp: "children"
}

const Filter = ({
  onAdd,
  isMotion,
  switchIsMotion,
  onFilterChange,
  onFieldsChange,
  filter,
  allArea,
  searchKeys,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
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
  const handleFields = (fields) => {
    const { createTime } = fields
    if (createTime && createTime.length) {
      fields.consultStartTime = createTime[0].format('YYYY-MM-DD')
      fields.consultEndTime = createTime[1].format('YYYY-MM-DD')
    }
    delete fields.createTime
    return fields
  }
  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  const handleChange = (key, values) => {
    /*let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    onFilterChange(fields)*/
  }

  let initialCreateTime = []
  if (filter.createTime && filter.createTime[0]) {
    initialCreateTime[0] = moment(filter.createTime[0])
  }
  if (filter.createTime && filter.createTime[1]) {
    initialCreateTime[1] = moment(filter.createTime[1])
  }

  return (
    <Row gutter={16}>

      <Col {...ColProps} span={6}>
        <FilterItem label="姓名">
          {getFieldDecorator('name')(
            <Search onSearch={handleSubmit} />
          )}
        </FilterItem>
      </Col>

      <Col {...ColProps} span={6}>
        <FilterItem label="电话">
          {getFieldDecorator('mobile')(
            <Search onSearch={handleSubmit} />
          )}
        </FilterItem>
      </Col>

      <Col {...ColProps} span={6}>
        <FilterItem label="法律咨询类型">
          {getFieldDecorator('dicConsultSource')(     
            <Select
              showSearch
              className={styles.block}
              optionFilterProp="children"
              onChange={handleChange}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {jsUtil.getDictDataByKey('dic_consult_source').map(d=> <Option key={d.code}>{d.name}</Option>)}
            </Select>
          )}
        </FilterItem>
      </Col>

      <Col {...ColProps} span={6}>
        <FilterItem label="处理方式">
          {getFieldDecorator('dicConsultTreatmentMode')(     
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
        </FilterItem>
      </Col>

      <Col {...ColProps} span={6}>
        <FilterItem label="解答人">
          {getFieldDecorator('answerGlobalName')( 
            <Search onSearch={handleSubmit} />
          )}
        </FilterItem>
      </Col>

      <Col {...ColProps} span={8}>
        <FilterItem label="咨询时间">
          {getFieldDecorator('createTime')(
            <RangePicker style={{ width: '100%' }} onChange={handleChange.bind(null, 'createTime')} />
          )}
        </FilterItem>
      </Col>

      <Col {...ColProps} span={4}>
        <FilterItem label="性别">
          {getFieldDecorator('dicGender')(     
            <Select
              showSearch
              className={styles.block}
              optionFilterProp="children"
              onChange={handleChange}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {jsUtil.getDictDataByKey('dic_gender').map(d=> <Option key={d.code}>{d.name}</Option>)}
            </Select>
          )}
        </FilterItem>
      </Col>

      <Col {...ColProps} span={4}>
        <FilterItem label="状态">
          {getFieldDecorator('dicConsultStatus')(     
            <Select
              showSearch
              className={styles.block}
              optionFilterProp="children"
              onChange={handleChange}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {jsUtil.getDictDataByKey('dic_consult_status').map(d=> <Option key={d.code}>{d.name}</Option>)}
            </Select>
          )}
        </FilterItem>
      </Col>
			
			<Col {...ColProps} span={8}>
      <FilterItem  label="区域">
                  {getFieldDecorator('areaId')(<Cascader options={allArea} placeholder="请选择区域" onChange={(v) => console.log(v)} />)}
                </FilterItem>
      </Col>
      <Col {...TwoColProps} span="1">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div >
            <Button type="primary" className="margin-right" onClick={handleSubmit}>搜索</Button>
          </div>
        </div>
      </Col>

    </Row>
  )
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  isMotion: PropTypes.bool,
  switchIsMotion: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Form.create({
  mapPropsToFields(props) {
    let searchKeys = props.searchKeys
    return {
      name: searchKeys.name,
      mobile: searchKeys.mobile,
      dicConsultSource: searchKeys.dicConsultSource,
      dicConsultTreatmentMode: searchKeys.dicConsultTreatmentMode,
      answerGlobalName: searchKeys.answerGlobalName,
      createTime: searchKeys.createTime,
      dicGender: searchKeys.dicGender,
      dicConsultStatus: searchKeys.dicConsultStatus,
      areaId: searchKeys.areaId,
    };
  },
  onFieldsChange(props, fields) {
    props.onFieldsChange(fields)
  },
})(Filter)
