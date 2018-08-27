/** 
* 外部参数
* const props = {
*   disabled: !isEditing,               是否禁用
*   area: {"district":110101,"province":110000,"city":110100} 格式
* }
*/
import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import FilterItem from '../FilterItem/FilterItem'
import {  Select, Form } from 'antd'
import { getDataService, postDataService } from '../../services/commonService'
import { request, config, jsUtil } from '../../utils'

const Option = Select.Option

class AreaController extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      provinceList: [],
      cityList: [],
      districtList: [],
      currentProvince: '',
      currentCity: '',
      currentDistrict: '',
      area: {},
      areaData: {}
    }
  }
  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value
      this.getAllProvinceList(value)
      this.setState({
        value
      })       
    }
  }

  componentDidMount() {   
    const value = this.props.value
    this.getAllProvinceList(value)
    this.setState({
      value
    })      
  }

  //获取省数据
  
  getAllProvinceList = (value) => {  
    const allConfig = JSON.parse(localStorage.getItem('allConfig'))
    if(jsUtil.isNull(allConfig)) {
      return
    }
    const { areaData } = allConfig
    let provinceList = []
    for(let key in areaData) {
      if(key.indexOf("area_PROVINCE_") > -1) {
        provinceList.push(areaData[key])
      }
    }
    this.setState ({
      provinceList: provinceList[0],
      areaData
    }, () => {      
      //写入外部数据
      if(jsUtil.isNull(value)) return
      const valueObject = JSON.parse(value) || {}
      if(valueObject.province) {
        const currentProvince = valueObject.province.toString()
        const provinceKey = "area_CITY_" + currentProvince
        const cityList = areaData[provinceKey]
        this.setState ({
          cityList,
          currentProvince
        }, () => {
          if(valueObject.city) {
            const currentCity = valueObject.city.toString()
            const cityKey = "area_DISTRICT_" + currentCity
            const districtList = areaData[cityKey]
            this.setState ({
              districtList,
              currentCity
            }, () => {                              
              if(valueObject.district) {
                const currentDistrict = valueObject.district.toString()
                this.setState({
                  currentDistrict
                })
              }
            })  
          }
        })  
      }
    })  


  }
  //获取市数据
  handleProvinceChange = (province) => {
    const key = "area_CITY_" + province
    const cityList = this.state.areaData[key] || []
    this.setState ({
      cityList,
      districtList: [],
      currentProvince: province,
      currentCity: '',
      currentDistrict: ''
    })  
    this.triggerChange({ province , city: '', district: ''})
  }

  //获取区数据
  handleCityChange = (city) => {
    //获取district
    const key = "area_DISTRICT_" + city
    const districtList = this.state.areaData[key] || []
    this.setState ({
      districtList,
      currentCity: city,
      currentDistrict: ''
    })  
    this.triggerChange({ province: this.state.currentProvince, city , district: ''})
  }

  //区操作
  handleDistrictChange = (district) => {
    this.setState ({
      currentDistrict: district
    })
   //数据绑定
    if (!('value' in this.props)) {
      this.setState({ district })
    }
    this.triggerChange({ province: this.state.currentProvince, city: this.state.currentCity, district })    
  }

  triggerChange = (changedValue) => {
    const onChange = this.props.onChange
    if (onChange) {
      this.setState({
        area:Object.assign(this.state.area, changedValue)
      })
      let fields = JSON.stringify(this.state.area)
      onChange(fields)
    }
  }
  render () {
    const { noProvince, noCity, noDistrict, disabled=false, size = 'default'} = this.props    
    const { provinceList, cityList, districtList, currentProvince, currentCity, currentDistrict} = this.state
    const { getFieldDecorator } = this.props.form
    const  selectProps = {
      disabled,
      size,
      showSearch: true,
      optionFilterProp: "children",
      allowClear: true
    }   
    const provinceOptions = provinceList.map(province => <Option key={province.code} value={province.code}>{province.name}</Option>)

    const cityOptions = cityList.map(city => <Option key={city.code} value={city.code}>{city.name}</Option>)

    const districtOptions = districtList.map(district => <Option key={district.code} value={district.code}>{district.name}</Option>)
    return (
        <FilterItem label="">
          <div>       
            {!noProvince && 
              <Select 
              {...selectProps}
              style={{ width: "32%", marginRight: "2%"}}
              placeholder="选择省/直辖市"
              value={currentProvince}
              onChange={this.handleProvinceChange}>
                {provinceOptions}
              </Select>    
            }     
            {!noCity &&
              <Select 
              {...selectProps}
              style={{ width: "32%", marginRight: "2%"}}   
              placeholder="选择市"     
              value={currentCity}     
              onChange={this.handleCityChange}>
                {cityOptions}       
              </Select>    
            }     
            {!noDistrict && 
              <Select 
              {...selectProps}
              style={{ width: "32%"}}      
              placeholder="选择区" 
              value={currentDistrict}       
              onChange={this.handleDistrictChange}>
                {districtOptions}
              </Select>    
            }             
          </div>   
        </FilterItem>
    )
  }
}

AreaController = Form.create({})(AreaController);
AreaController.propTypes = {
    
}

export default AreaController
