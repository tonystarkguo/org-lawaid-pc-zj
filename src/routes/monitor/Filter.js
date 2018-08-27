import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from '../../components'
import { Form, Button, Row, Col, DatePicker, Input, Switch, Select } from 'antd'
import styles from './index.less'
import { jsUtil } from '../../utils/'
import { connect } from 'dva'

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
  dispatch,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {
  const handleSubmit = () => {
    dispatch({
      type: 'monitor/setSearchData',
      payload: getFieldsValue(),
    })
    dispatch({
      type: 'monitor/getData',
    })
  }
  return (
    <Row gutter={16}>
      <Col {...ColProps} span={5}>
        <FilterItem label="案号">
          {getFieldDecorator('searchCaseNum')(
            <Search onSearch={handleSubmit} />
          )}
        </FilterItem>
      </Col>

      <Col {...ColProps} span={5}>
        <FilterItem label="受援人姓名">
          {getFieldDecorator('searchRpName')(
            <Search onSearch={handleSubmit} />
          )}
        </FilterItem>
      </Col>

      <Col {...ColProps} span={5}>
        <FilterItem label="承办人姓名">
          {getFieldDecorator('searchHpName')(
            <Search onSearch={handleSubmit} />
          )}
        </FilterItem>
      </Col>

      <Col {...ColProps} span={5}>
        <FilterItem label="承办状态">
          {getFieldDecorator('searchCaseStatus')(
            <Select
              showSearch
              allowClear
              style={{ width: '100%' }}
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option key="14,15">承办中</Option>
              <Option key="16">待结案审核</Option>
              <Option key="17">需补充结案材料</Option>
            </Select>
          )}
        </FilterItem>
      </Col>
      <Col {...ColProps} span={5}>
        <FilterItem label="案件类型">
          {getFieldDecorator('searchCaseType')(
            <Select
              showSearch
              allowClear
              style={{ width: '100%' }}
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option key="02">民事案件</Option>
              <Option key="01">刑事案件</Option>
              <Option key="03">行政诉讼</Option>
            </Select>
          )}
        </FilterItem>
      </Col>
			
      <Col {...TwoColProps} span={4}>
        <Button type="primary" onClick={handleSubmit}>搜索</Button>
      </Col>

    </Row>
  )
}

Filter.propTypes = {

}

export default connect(({ filter }) => ({ filter }))(Form.create()(Filter))
