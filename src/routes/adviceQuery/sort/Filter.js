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

const Filter = ({
  onFilterChange,
  onFieldsChange,
  searchKeys,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {

  const handleSubmit = () => {
    let fields = getFieldsValue()
    onFilterChange(fields)
  }

  return (
    <Row gutter={16}>

      <Col {...ColProps} span={6}>
        <FilterItem label="咨询ID">
          {getFieldDecorator('consultNumber')(
            <Search onSearch={handleSubmit} />
          )}
        </FilterItem>
      </Col>

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
      consultNumber: searchKeys.consultNumber,
    };
  },
  onFieldsChange(props, fields) {
    props.onFieldsChange(fields)
  },
})(Filter)
