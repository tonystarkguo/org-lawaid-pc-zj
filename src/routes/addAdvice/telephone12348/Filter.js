import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from '../../../components'
import { Form, Button, Row, Col, DatePicker, Input, Switch, Select } from 'antd'
import styles from './List.less'
import { jsUtil } from '../../../utils/'

const Search = Input.Search
const { RangePicker } = DatePicker
const Option = Select.Option

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
  getAnswersList,
  isMotion,
  switchIsMotion,
  onFilterChange,
  onFieldsChange,
  filter,
  searchKeys,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {
  const handleFields = (fields) => {
    const { createTime } = fields
    if (createTime.length) {
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

      <Col {...ColProps} span={8}>
        <FilterItem label="咨询时间">
          {getFieldDecorator('createTime', { initialValue: initialCreateTime })(
            <RangePicker style={{ width: '100%' }} onChange={handleChange.bind(null, 'createTime')} />
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

      <Col {...ColProps} span={6}>
        <FilterItem label="解答人">
          {getFieldDecorator('answerGlobalName')( 
            <Search onSearch={handleSubmit} />
          )}
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
      dicConsultTreatmentMode: searchKeys.dicConsultTreatmentMode,
      answerGlobalName: searchKeys.answerGlobalName,
      createTime: searchKeys.createTime,
      dicGender: searchKeys.dicGender,
      dicConsultStatus: searchKeys.dicConsultStatus,
    };
  },
  onFieldsChange(props, fields) {
    props.onFieldsChange(fields)
  },
})(Filter)
