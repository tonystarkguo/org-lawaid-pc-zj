import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from '../../../components'
import { Form, Button, Row, Col, DatePicker, Input, Switch, Select } from 'antd'

const Search = Input.Search
const { RangePicker } = DatePicker
const Option = Select.Option
const FormItem = Form.Item

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
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {

  const handleSearch = () => {
    let fields = getFieldsValue()
    onFilterChange(fields)
  }

  const handleAdd = () => {
    onAdd()
  }


  return (
    <Row gutter={16}>

      <Col {...ColProps}>
        <FilterItem label="角色名称：">
          {getFieldDecorator('name')(<Input />)}
        </FilterItem>
      </Col>

      <Col {...ColProps}>
        <FilterItem label="描述：">
          {getFieldDecorator('remark')(<Input />)}
        </FilterItem>
      </Col>

      <Col {...ColProps} span="2">
        <Button type="primary" className="margin-right" onClick={handleSearch}>搜索</Button>
      </Col>

      <Col {...ColProps} span="10">
        <Button type="primary" className="margin-right" onClick={handleAdd} style={{float: 'right'}}>添加角色</Button>
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
