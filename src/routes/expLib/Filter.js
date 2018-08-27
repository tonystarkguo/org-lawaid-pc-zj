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
  onImport,
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

        <Col {...ColProps} span={6}>
          <FilterItem label="专家姓名">
            {getFieldDecorator('name')(
              <Search onSearch={handleSubmit} />
            )}
          </FilterItem>
        </Col>

        <Col {...ColProps} span={6}>
          <FilterItem label="工作单位">
            {getFieldDecorator('workUnit')(
              <Search onSearch={handleSubmit} />
            )}
          </FilterItem>
        </Col>

        <Col {...ColProps} span={6}>
          <FilterItem label="手机号码">
            {getFieldDecorator('mobile')(
              <Search onSearch={handleSubmit} />
            )}
          </FilterItem>
        </Col>

        <Col {...ColProps} span={6}>
          <FilterItem label="状态">
            {getFieldDecorator('isDeleted')(
              <Select className={styles.block}>
                <Option value="true">删除</Option>
                <Option value="false">未删除</Option>
              </Select>
            )}
          </FilterItem>
        </Col>

      </Row>

      <Row gutter={16} style={{ marginBottom:16 }}>
        <Col span={8}>
          <Button type="primary" onClick={handleSubmit}>搜索</Button>
        </Col>
        <Col span={8} offset={8}>
          <Row type="flex" justify="end">
            <Button type="primary" onClick={onImport} style={{ marginLeft:16 }}>添加质量评估专家</Button>
          </Row>
        </Col>
      </Row>

    </div>
  )
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  onImport: PropTypes.func,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
  form: PropTypes.object,
}

export default Form.create({
  mapPropsToFields(props) {
    let searchKeys = props.searchKeys
    return {
      name: searchKeys.name,
      mobile: searchKeys.mobile,
      workUnit: searchKeys.workUnit,
      isDeleted: searchKeys.isDeleted,
    };
  },
  onFieldsChange(props, fields) {
    props.onFieldsChange(fields)
  },
})(Filter)

/*<Col {...ColProps} span={6}>
  <FilterItem label="工作区域">
    {getFieldDecorator('areaCode')(
      <Search onSearch={handleSubmit} />
    )}
  </FilterItem>
</Col>*/
