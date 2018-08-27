import { Component, PropTypes } from 'react';
import { Map, Marker } from 'react-amap';
import { connect } from 'dva'
import { Select } from 'antd';
import jsUtil from '../../utils/jsUtil'
import styles from './index.less'
const Option = Select.Option;


class Address extends Component {
  constructor() {
    super();
    this.infoWindow = null;
    const _this = this;
    this.map = null;
    this.amapEvents = {
      created: (mapInstance) => {
        _this.map = mapInstance
      }
    };
    this.markerEvents = {
      created: (markerInstance) => {
        
      },
      click: (MapsOption, marker) => {
        _this.infoWindow.open(_this.map, [MapsOption.lnglat.lng, MapsOption.lnglat.lat]);
        // _this.infoWindow.open(_this.map, [113.27192, 23.12877]);

      }
    }
    this.markerPosition = { longitude: 120, latitude: 30 };
    this.createInfoWin = (targitObj) => {
      let content=[];
      content.push(`<div style="padding: 5px; font-size: 14px; font-weight: bold; width: 300px">${targitObj.name}</div>`)
      content.push(`<div style="padding: 2px">地址: ${targitObj.address}</div>`)
      content.push(`<div style="padding-bottom: 5px">电话: ${targitObj.telephone}</div>`)

      let addInfoWin
      AMap.plugin('AMap.AdvancedInfoWindow', function () {
        addInfoWin = new AMap.AdvancedInfoWindow({
          // panel: 'panel',
          placeSearch: false,
          asOrigin: false,
          asDestination: false,
          content: content.join(""),
          offset: new AMap.Pixel(1, -30)
        });
        _this.infoWindow = addInfoWin
      });
    }
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    address: PropTypes.object
  }

  state = {
    data: [],
    value: '',
  }

  search = (value) => {
    const { dispatch } = this.props;
    if(value !== ''){
      dispatch({
          type: 'address/orgChange',
          payload: `${value}`
      })
    }
  }

  throttle = (value) =>{
    clearTimeout(this.search.tId)
    this.search.tId = setTimeout(() => {
      this.search(value)
    }, 300)
  }

  handleSearch = (value) => {
    this.throttle(value)
  }
  


  handleSelectChange = (value) => {
    this.infoWindow && this.infoWindow.close()//先关闭
    let targitObj = jsUtil.getObjByValFromArr(this.props.address.org, 'id', value)
    this.markerPosition = { longitude: targitObj.longitude, latitude: targitObj.latitude };
    this.createInfoWin(targitObj)

    const { dispatch } = this.props;
    dispatch({
        type: 'address/updateOrgId',
        payload: {orgId: value, longitude: targitObj.longitude, latitude: targitObj.latitude, address: targitObj.address, telephone: targitObj.telephone, name: targitObj.name }
    })

    this.infoWindow.open(this.map, [targitObj.longitude, targitObj.latitude]);
  }


  render() {

    // const {org} = this.props.address
    const options = this.props.address.org.map(d => <Option key={d.id}>{d.name}</Option>)

    return <div className="content-inner">
      请选择法援局：
        <Select
          showSearch
          size="large"
          notFoundContent="无结果"
          defaultActiveFirstOption={false}
          showArrow={true}
          filterOption={false}
          onChange={this.handleSelectChange}
          onSearch={this.handleSearch}
          placeholder="输入关键字"
          style={{ width: '30%' }}
        >
          {options}
        </Select>
        <div style={{ width: '60%', height: '400px', padding: '20px 0'}}>
          <Map events={this.amapEvents} zoom={12}>
            <Marker position={this.markerPosition} events={this.markerEvents} />
          </Map>
        </div>
     </div>
  }
}


export default connect((state) => {return {address: state.address}})(Address)