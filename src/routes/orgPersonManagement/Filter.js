import React from 'react'
import PropTypes from 'prop-types'
import styles from './List.less'
import { Form, Button, Row, Col, Input, Select, Radio } from 'antd'
import { FilterItem } from '../../components'
import jsUtil from '../../utils/jsUtil'

const Search = Input.Search;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

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
  onAdd,
  filter,
  onFilterChange,
  onFieldsChange,
  searchKeys,
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

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  }

  return (
    <div>
      <Row gutter={16}>
        <Col {...ColProps} span={8}>
          <FilterItem label="姓名">
            {getFieldDecorator('name')(
              <Search onSearch={handleSubmit} />
            )}
          </FilterItem>
        </Col>

        <Col {...TwoColProps} span="8">
          <Button type="primary" className="margin-right" onClick={handleSubmit}>搜索</Button>
          <Button type="primary" className="margin-right" onClick={onAdd}>新增人员</Button>
        </Col>
      </Row>
    </div>
  )
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
  form: PropTypes.object,
}

export default Form.create({
  mapPropsToFields(props) {
    let searchKeys = props.searchKeys
    return {
      name: searchKeys.name,
    };
  },
  onFieldsChange(props, fields) {
    props.onFieldsChange(fields)
  },
})(Filter)
