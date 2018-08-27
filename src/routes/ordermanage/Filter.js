import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from '../../components'
import { Form, Button, Row, Col, DatePicker, Input, Switch, Select } from 'antd'
import city from '../../utils/city'

const Search = Input.Search
const { RangePicker } = DatePicker
const Option = Select.Option
const FormItem = Form.Item

const ColProps = {
  span: 5,
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
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {
  const handleFields = (fields) => {
    const { createTime } = fields
    if (createTime.length) {
      fields.startDate = createTime[0].format('YYYY-MM-DD')
      fields.endDate = createTime[1].format('YYYY-MM-DD')
    }
    delete fields.createTime
    return fields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    // console.log(fields)
    onFilterChange(fields)
  }

  /*const handleReset = () => {
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
  }*/

  const handleChange = (key, values) => {
    /*let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    onFilterChange(fields)*/
  }

  const { name, address } = filter

  let initialCreateTime = []
  if (filter.createTime && filter.createTime[0]) {
    initialCreateTime[0] = moment(filter.createTime[0])
  }
  if (filter.createTime && filter.createTime[1]) {
    initialCreateTime[1] = moment(filter.createTime[1])
  }

  return (
    <Row gutter={16}>

      <Col {...ColProps} span="4">
        <FilterItem label="预约号：">
          {getFieldDecorator('resvNum')(<Search size="large" onSearch={handleSubmit} />)}
        </FilterItem>
      </Col>

      <Col {...ColProps} span="6">
        <FilterItem label="援助机构名称：">
          {getFieldDecorator('orgName')(<Search size="large" onSearch={handleSubmit} />)}
        </FilterItem>
      </Col>

      <Col {...ColProps} span="8">
        <FilterItem label="预约时间：" >
          {getFieldDecorator('createTime', { initialValue: initialCreateTime })(
            <RangePicker style={{ width: '100%' }} size="large" onChange={handleChange.bind(null, 'createTime')} />
          )}
        </FilterItem>
      </Col>
      
      <Col {...ColProps} span="4">
        <FilterItem label="联系电话：">
          {getFieldDecorator('contactMobile')(     
            <Search size="large" onSearch={handleSubmit} />
          )}
        </FilterItem>
      </Col>

      <Col {...ColProps} span="2">
        <Button type="primary" size="large" className="margin-right" onClick={handleSubmit}>搜索</Button>
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

export default Form.create()(Filter)
