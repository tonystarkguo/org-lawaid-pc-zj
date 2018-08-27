import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import _ from 'lodash'
import { FilterItem } from '../../components'
import { Form, Button, Row, Col, DatePicker, Input, Switch, Select } from 'antd'
import styles from './List.less'
import { jsUtil, config } from '../../utils/'

const { api } = config
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
  onAdd,
  getAnswersList,
  isMotion,
  switchIsMotion,
  onFilterChange,
  onFieldsChange,
  filter,
  onExport,
  exportList,
  searchKeys,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {

  let initialCreateTime = []
  if (filter.createTime && filter.createTime[0]) {
    initialCreateTime[0] = moment(filter.createTime[0])
  }
  if (filter.createTime && filter.createTime[1]) {
    initialCreateTime[1] = moment(filter.createTime[1])
  }

  const handleFields = (fields) => {
    const { createTime } = fields
    if (createTime.length) {
      fields.beginTime = createTime[0].format('YYYY-MM-DD')
      fields.endTime = createTime[1].format('YYYY-MM-DD')
    }
    delete fields.createTime
    return fields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    console.log(fields)
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  const handleChange = (key, values) => {
    /*let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    onFilterChange(fields)*/
  }

  const handleExport = () => {
    onExport()
  }

  let exportsIds = exportList.length && _.map(exportList, 'tCaseId') || []
  exportsIds = exportsIds.join(',')

  // console.log(JSON.stringify(exportList))

  return (
    <div>

      <Row gutter={16}>
        <Col {...ColProps} span={8}>
          <FilterItem label="承办单位">
            {getFieldDecorator('hpWorkUnit')(
              <Search onSearch={handleSubmit} />
            )}
          </FilterItem>
        </Col>

        <Col {...ColProps} span={8}>
          <FilterItem label="承办人姓名">
            {getFieldDecorator('hpName')(
              <Search onSearch={handleSubmit} />
            )}
          </FilterItem>
        </Col>

        <Col {...ColProps} span={8}>
          <FilterItem label="补贴发放状态">
            {getFieldDecorator('settleState')(     
              <Select
                showSearch
                className={styles.block}
                optionFilterProp="children"
                onChange={handleChange}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Option key={1}>已发放</Option>
                <Option key={2}>未发放</Option>
              </Select>
            )}
          </FilterItem>
        </Col>

        <Col {...ColProps} span={10}>
          <FilterItem label="结案通过日期">
            {getFieldDecorator('createTime', { initialValue: initialCreateTime })(
              <RangePicker style={{ width: '100%' }} onChange={handleChange.bind(null, 'createTime')} />
            )}
          </FilterItem>
        </Col>

        <Col span={2}>
          <Button type="primary" className="margin-right" onClick={handleSubmit}>搜索</Button>
        </Col>
      </Row>

      <Row className={styles.mb20}>
        <Button disabled={exportList.length?false:true} type="primary"><a target="_blank" href={`${api.baseURL}${api.exportSubsidyRelease}?ids=${exportsIds}`}>导出补贴发放表</a></Button>
      </Row>
    </div>
  )
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  onExport: PropTypes.func,
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
      hpWorkUnit: searchKeys.hpWorkUnit,
      hpName: searchKeys.hpName,
      settleState: searchKeys.settleState,
      createTime: searchKeys.createTime,
    };
  },
  onFieldsChange(props, fields) {
    props.onFieldsChange(fields)
  },
})(Filter)
