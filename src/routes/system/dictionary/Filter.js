import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Button, Row, Col, Input, Cascader, Switch, Radio, Select } from 'antd'
import city from '../../../utils/city'

const Option = Select.Option
const Search = Input.Search
const RadioGroup = Radio.Group
const FormItem = Form.Item

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

  const handleChange = (key) => {
    let fields = getFieldsValue()
    onFilterChange(fields)
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    }
  }
// 
  return (
    <div>
      <Row>
        <Col span={6}>
          <FormItem {...formItemLayout} label="类型">
            {getFieldDecorator('type')(    
              <Select 
              mode="tags"
              style={{ width: "100%" }}
              onChange={handleChange}              
              optionFilterProp="children" 
              placeholder="选择类型"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                <Option value="1">data_isDelete</Option>
                <Option value="2">data_isDelete</Option>
                <Option value="4">data_isDelete</Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem {...formItemLayout} label="描述">
            {getFieldDecorator('name')(
              <Input placeholder="描述关键字" size="large" />
            )}
          </FormItem>
        </Col>
        <Col span={12} >
          <Button type="primary" size="large" className="margin-right" onClick={handleSubmit} style={{marginLeft: '20px'}}>搜索</Button>
          <Button type="primary" size="large" className="margin-right" onClick={onAdd} style={{marginLeft: '20px', float: 'right'}}>新增字典</Button>
        </Col>
      </Row>
    </div>
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
