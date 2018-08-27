/**
* 外部参数
  api: PropTypes.string, // 接口api
  placeholder: PropTypes.string, // placeholder
  params: PropTypes.object, // 接口参数
  paramsKey: PropTypes.string, // 接口参数中ID的字段
  extList: PropTypes.array, // 回填用list
*/
import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { Select } from 'antd'
import { getDataService } from '../services/commonService'
import { request, config, jsUtil } from '../utils'
const { api } = config
const Option = Select.Option

class PreSearch extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      resultList: props.extList || [],
      value: props.value ? props.value.toString() : '',
      status: true,
    }
  }

  componentWillReceiveProps (nextProps) {
    if ('value' in nextProps && nextProps.value) {
      const value = nextProps.value.toString()
      this.setState({
        value,
      })
    }
    if ('extList' in nextProps && nextProps.extList && this.state.status) {
      const extList = nextProps.extList
      this.setState({
        resultList: extList,
      })
    }
  }
  componentWillUnmount () {
    this.setState({
      status: true,
    })
  }
  async getResultList (value) {
    let params = {}

    /*if (jsUtil.isNull(this.props.params)) {
      params = { type: '5' }
    } else {
      params = this.props.params
    }*/

    if (jsUtil.isNull(this.props.paramsKey)) {
      params.name = value
    } else {
      params[this.props.paramsKey] = value
    }

    const res = await getDataService({ url: api[this.props.api] }, params)
    if (!jsUtil.isNull(res) && res.success) {
        //数据结构问题做一次判断
        let Data=res.data.list||res.data;
      this.setState({
        resultList: Data.concat(this.props.extList || []),
        value: '',
      })
    }
  }
  handleSelectChange = (value) => {
    if (jsUtil.isNull(value)) {
      this.setState({
        resultList: [],
      })
    }
    this.setState({
      value: value && value.toString(),
    })
    const onChange = this.props.onChange
    if (onChange) {
      onChange(value)
    }
  }
  // 节流
  time = {}
  throttle = (value) => {
    clearTimeout(this.time)
    this.time = setTimeout(() => {
      this.getResultList(value)
    }, 300)
  }
  handleSearch = (value) => {
    if (!jsUtil.isNull(value)) {
      this.throttle(value)
    }
  }


  handleBlur = () => {
    if (jsUtil.isNull(this.state.value)) {
      this.setState({
        resultList: [],
      })
    }
  }
  handleFocus = () => {
    this.setState({
      status: false,
    })
  }
  render () {
    const options = this.state.resultList.map(d => <Option value={d.id && d.id.toString()} key={d.id || d.name}>{d.name}</Option>)
    const placeholder = () => {
      if (this.props.placeholder === false) {
        return undefined
      }
      if (this.props.placeholder === undefined) {
        return '输入关键字可模糊查找'
      }
      return this.props.placeholder
    }
    return (
      <Select
        value={this.state.value}
        showSearch
        showArrow
        allowClear
        size="large"
        className={this.props.className ? this.props.className : ''}
        notFoundContent=""
        defaultActiveFirstOption={false}
        filterOption={false}
        onFocus={this.handleFocus}
        onChange={this.handleSelectChange}
        onSearch={this.handleSearch}
        onBlur={this.handleBlur}
        placeholder={placeholder()}
      >
        {options}
      </Select>
    )
  }
}
PreSearch.propTypes = {
  api: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  params: PropTypes.object,
  paramsKey: PropTypes.string,
  defaultValue: PropTypes.string,
  extList: PropTypes.array,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
}
export default PreSearch
