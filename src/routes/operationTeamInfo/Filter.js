import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Button, Row, Col, Input, Cascader, Switch, Radio } from 'antd'
import city from '../../utils/city'

const Search = Input.Search
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

const ColProps = {
  xs: 24,
  sm: 12,
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
  isMotion,
  isAdmin,
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

  const handleChange = (e) => {
    // console.log(e.target.value)
    onFilterChange({ isDeleted:e.target.value })
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    }
  }

  /*<Col span={12}>
    <FormItem {...formItemLayout} label="状态">
      {getFieldDecorator('isDeleted', {
        initialValue: false
      })(
        <RadioGroup onChange={handleChange}>
          <Radio value={false}>正常</Radio>
          <Radio value={true}>已删除</Radio>
        </RadioGroup>
      )}
    </FormItem>
  </Col>*/

  return (
    <div>
      <Row>
        <Col span={8}>
          <FormItem {...formItemLayout} label="运营人员">
            {getFieldDecorator('searchContent')(
              <Search placeholder="姓名/电话" size="large" onSearch={handleSubmit} />
            )}
          </FormItem>
        </Col>
        <Col span={4} offset={1}>
          <Button type="primary" size="large" className="margin-right" onClick={handleSubmit}>搜索</Button>
        </Col>
      </Row>
      <Row style={{ marginBottom:16 }}>
        <Button type="primary" size="large" onClick={onAdd} disabled={!isAdmin}>新增人员</Button>
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
