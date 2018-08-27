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
    if(fields.search_dicGender){
      fields.dicGender = fields.search_dicGender
      delete fields.search_dicGender
    }
    if(fields.search_dicLawyerType){
      fields.dicLawyerType = fields.search_dicLawyerType
      delete fields.search_dicLawyerType
    }
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
          <FilterItem label="法律援助人员类型">
            {getFieldDecorator('search_dicLawyerType')(
              <Select
                showSearch
                className={styles.block}
                optionFilterProp="children"
                onChange={handleChange}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {jsUtil.getDictDataByKey('dic_lawyer_type').map(d=> <Option key={d.code}>{d.name}</Option>)}
              </Select>
            )}
          </FilterItem>
        </Col>

        <Col {...ColProps} span={4}>
          <FilterItem label="性别">
            {getFieldDecorator('search_dicGender')(
              <Select
                showSearch
                className={styles.block}
                optionFilterProp="children"
                onChange={handleChange}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {jsUtil.getDictDataByKey('dic_gender').map(d=> <Option key={d.code}>{d.name}</Option>)}
              </Select>
            )}
          </FilterItem>
        </Col>

        <Col {...ColProps} span={6}>
          <FilterItem label="工作区域">
            {getFieldDecorator('areaCode')(
              <Search onSearch={handleSubmit} />
            )}
          </FilterItem>
        </Col>

        <Col {...ColProps} span={6}>
          <FilterItem label="姓名">
            {getFieldDecorator('name')(
              <Input/>
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
            {/*<Button type="primary" onClick={onAdd}>新增人员</Button>*/}
            <Button type="primary" onClick={onImport} style={{ marginLeft:16 }}>添加人员</Button>
          </Row>
        </Col>
      </Row>

    </div>
  )
}

Filter.propTypes = {
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
      isDeleted: searchKeys.isDeleted,
      dicLawyerType: searchKeys.dicLawyerType,
      areaCode: searchKeys.areaCode,
      dicGender: searchKeys.dicGender,
    };
  },
  onFieldsChange(props, fields) {
    props.onFieldsChange(fields)
  },
})(Filter)
