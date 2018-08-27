import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Input, Select, Cascader } from 'antd'
import { FilterItem } from '../../components'
import styles from './List.less'
import {jsUtil} from '../../utils'
import constants from '../../utils/constants.js'

const Search = Input.Search;
const Option = Select.Option;

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

  const user = JSON.parse(localStorage.getItem('user'))

  let isToAdd = false
  let roles = user.roles || []
  roles.map(item => {
    if(item.id === 35){
      isToAdd = true
    }else if(item.id === 36){
      isToAdd = false
    }
  })

  const handleSubmit = () => {
    let fields = getFieldsValue()
    onFilterChange(fields)
  }

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  }

  return (
    <Row gutter={16}>
      <Col  {...ColProps} span={8}>
        <FilterItem label="工作站名称">
          {getFieldDecorator('name')(
            <Search onSearch={handleSubmit} />
          )}
        </FilterItem>
      </Col>

      <Col {...TwoColProps} span="8">
        <Button type="primary" className="margin-right" onClick={handleSubmit}>搜索</Button>
        <Button type="primary" className="margin-right" onClick={onAdd} disabled={!user.isCenterPerson}>新增工作站</Button>
      </Col>
    </Row>
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
