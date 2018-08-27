import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'
import { connect } from 'dva'
import moment from 'moment';
import { FilterItem } from '../../components'
import { config, jsUtil, caseStatusConverter } from '../../utils'
import { message, Tabs, Row, Col, Select, Form, Button, DatePicker, Cascader, TreeSelect } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
const { RangePicker } = DatePicker
const Option = Select.Option;
const OptGroup = Select.OptGroup;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const CustomizedLabel = React.createClass({
  render() {
    const { x, y, stroke, value } = this.props;
    return <text x={x} y={y - 10} fill={stroke} fontSize={12} textAnchor="middle">{value}</text>
  }
});

const CustomizedAxisTick = React.createClass({
  render() {
    const { x, y, stroke, payload } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-45)" width={15}>{payload.value}</text>
      </g>
    );
  }
});

const RADIAN = Math.PI / 180;
const colors = ['#749F83', '#FFBBFF', '#FFBB28', '#FF8042', '#CD00CD', '#AAAAAA', '#404040', '#666666', '#2E4454', '#1E90FF', '#00EE00', '#8B8B00','#D3D3D3', '#DAA520', '#DB7093', '#EEE8AA', '#F08080', '#483D8B', '#556B2F', '#6A5ACD', '#7CFC00', '#7FFFD4', '#8B008B', '#98FB98', '#B0E0E6',];
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  percent = percent * 100;
  percent = percent.toString();
  if(percent.indexOf('.') != -1){
    percent = percent.split('.');
    percent = percent[0] + '.' + percent[1].substring(0,1)
  }

  return (
    percent != 0 ?
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${percent}%`}
      </text>
      :
      ''
  );
};
const { getLabelByValue, createTreeBydics, createCurrentList, getValueByLabel } = jsUtil

const Analysis = ({
  analysis,
  dispatch,
  form: {
    getFieldDecorator,
    getFieldsValue,
    getFieldValue,
    validateFieldsAndScroll,
    setFieldsValue
  },
}) => {
  const casezhucustomeData = analysis.casezhucustomeData
 const caseCustomeData = analysis.casecustomeData
 const casebingcustomeData = analysis.casebingcustomeData
 const {
   d_x_initialValue,
   ChangeArryX,
   d_y_initialValue,
   ChangeArryY,
   d_bing_initialValue,
   ChangeArryBing,
   ChangeArryYzhu,
   ChangeArryXzhu,
   d_x_zhu_initialValue,
   d_y_zhu_initialValue
  }=analysis
  function tuzhu(data) {
    var arr = {};
    for (var i = 0; i < data.length; i++) {
        var dataJson = data[i];
        for (var key in dataJson) {
            if (key != 'xName' && !arr[key]) {
                arr[key] = 1;
            }
        }
    }

    var newData = [];
    for (var key in arr) {
        newData.push({
            name: key
        })
    }
    return newData
}
 const json_bing = {};
 if(casebingcustomeData){
for(let i=0;i<casebingcustomeData.length;i++){
	let key = casebingcustomeData[i].xName;
	if(!json_bing[key]){
		json_bing[key] = {};
	}
	var num = casebingcustomeData[i]['num'];
	json_bing[key][casebingcustomeData[i].yName] = num;
}
var jsonBing = [];
for(var key in json_bing){
	let obj = {};
	obj = json_bing[key];
	obj.xName = key;
	jsonBing.push(obj);
}
 }
 if(jsonBing){
 for (let i = 0; i < jsonBing.length; i++) {
  jsonBing[i] = {
    name: jsonBing[i].xName,
    num: Number(jsonBing[i].null)
  }
}
 }

 const json1 = {};
 if(caseCustomeData){
for(let i=0;i<caseCustomeData.length;i++){
	let key = caseCustomeData[i].xName;
	if(!json1[key]){
		json1[key] = {};
	}
	var num = caseCustomeData[i]['num'];
	json1[key][caseCustomeData[i].yName] = num;
}

var json2 = [];
for(var key in json1){
	let obj = {};
	obj = json1[key];
  obj.xName = key;
  json2.push(obj);
}
 }
 if(json2){
 var json3 = tuzhu(json2)
 }
 const yData=[];
 json2 && Object.keys(json2[0]).forEach(key => {
       if(key!="xName"){
        yData.push(key);
       }})
  
       const json_zhu = {};
       if(casezhucustomeData){
      for(let i=0;i<casezhucustomeData.length;i++){
        let key = casezhucustomeData[i].xName;
        if(!json_zhu[key]){
          json_zhu[key] = {};
        }
        var num = casezhucustomeData[i]['num'];
        json_zhu[key][casezhucustomeData[i].yName] = num;
      }
      
      
      var jsonzhu = [];
      for(var key in json_zhu){
        let obj = {};
        obj = json_zhu[key];
        obj.xName = key;
        jsonzhu.push(obj);
      }
       }
       if(jsonzhu){
        var zhuxing = tuzhu(jsonzhu)
        }
       const zhuData=[];
       jsonzhu && Object.keys(jsonzhu[0]).forEach(key => {
             if(key!="xName"){
              zhuData.push(key);
             }})  
  const allConfig = JSON.parse(localStorage.getItem('allConfig')) || {}
  const {dictData} = allConfig
  const {dic_dic_occupatio, dic_consult_treatment_mode } = dictData
  dic_dic_occupatio.forEach((item,index) => {
    item.label = item.name
    item.key = index
    item.value = item.code
  })
  dic_consult_treatment_mode.forEach((item,index) => {
    item.label = item.name
    item.key = index
    item.value = item.code
  })
  const { allArea, CustomeArea, caseReason, new_dic_standing, new_org_aid_type,} = analysis   
   var isTrue = true
  if(isTrue && allArea){
  for (var i = 0; i < allArea.length; i++) {
    if (allArea[i].cityName.indexOf('省') != -1) {
      if( allArea[i].cityId.toString().indexOf("_sheng")>0){

      }else{
        allArea[i].cityId += '_sheng';
      }
     
    } else if (allArea[i].cityName.indexOf('市') != -1) {
      if( allArea[i].cityId.toString().indexOf("_shi")>0){

      }else{
        allArea[i].cityId += '_shi';
      }
     
    }
}
isTrue = false
  }
  if (CustomeArea) {
    CustomeArea.forEach((item, index) => {
      CustomeArea[index].children = item['ormOrgRegionDtoList']
    })
  }
  CustomeArea && CustomeArea.map((item,index) => {
    item.label = item.cityName
    item.value = item.cityId
    item.children && item.children.map((item,index) => {
      item.label =item.cityName
      item.value = item.cityId
    })
  })
  CustomeArea && CustomeArea.children && CustomeArea.children.map((item,index) => {
    item.label =item.cityName
    item.label = item.cityId
  })
  if(CustomeArea){
  for (var i = 0; i < CustomeArea.length; i++) {
    if (CustomeArea[i].cityName.indexOf('省') != -1) {
      if(CustomeArea[i].cityId.toString().indexOf("_sheng")>0){

      }else{
        CustomeArea[i].cityId += '_sheng';
      }
      
    } else if (CustomeArea[i].cityName.indexOf('市') != -1) {
      if(CustomeArea[i].cityId.toString().indexOf("_shi")>0){

      }else{
        CustomeArea[i].cityId += '_shi';
      }
      
    }
}
  }
  var handleAllarea = CustomeArea
  // delete handleAllarea[0]
 
//   if(handleAllarea){
//     handleAllarea.slice(1)
//   for(var i =0;i<handleAllarea.length;i++){
//   handleAllarea[i].ormOrgRegionDtoList.forEach((item,index) => {
//       // if(item.cityName == '全省'){
//       //   item.cityId = '2'
//       // }else if(item.cityName == '全市'){
//       //   item.cityId = '1'
//       // }
//   })
// }
// }
// handleAllarea && handleAllarea.slice(1)
  new_dic_standing && new_dic_standing.forEach((item,index) => {
    item.label = item.name
    item.key = index
    item.value = item.code
  })
  let treeSelectData = []
  if(getFieldValue('d_x') == '1'||d_x_initialValue==1){
    treeSelectData = caseReason
  }else if(getFieldValue('d_x') == '0'||d_x_initialValue==0){
    treeSelectData = handleAllarea
  }else if(getFieldValue('d_x') == '2'||d_x_initialValue==2){
    treeSelectData = dic_dic_occupatio
  }else if(getFieldValue('d_x') == '3'||d_x_initialValue==3){
    treeSelectData = new_dic_standing
  }else if(getFieldValue('d_x') == '4'||d_x_initialValue==4){
    treeSelectData = new_org_aid_type
  }else if(getFieldValue('d_x') == '5'||d_x_initialValue==5){
    treeSelectData = dic_consult_treatment_mode
  }
  let treeSelectDatazhu = []
  if(getFieldValue('d_x_zhu') == '1'||d_x_zhu_initialValue==1){
    treeSelectDatazhu = caseReason
  }else if(getFieldValue('d_x_zhu') == '0'||d_x_zhu_initialValue==0){
    treeSelectDatazhu = handleAllarea
  }else if(getFieldValue('d_x_zhu') == '2'||d_x_zhu_initialValue==2){
    treeSelectDatazhu = dic_dic_occupatio
  }else if(getFieldValue('d_x_zhu') == '3'||d_x_zhu_initialValue==3){
    treeSelectDatazhu = new_dic_standing
  }else if(getFieldValue('d_x_zhu') == '4'||d_x_zhu_initialValue==4){
    treeSelectDatazhu = new_org_aid_type
  }else if(getFieldValue('d_x_zhu') == '5'||d_x_zhu_initialValue==5){
    treeSelectDatazhu = dic_consult_treatment_mode
  }
  let treeSelectDataBing = []
  if(getFieldValue('d_x_bing') == '1'||d_bing_initialValue==1){
    treeSelectDataBing = caseReason
  }else if(getFieldValue('d_x_bing') == '0'||d_bing_initialValue==0){
    treeSelectDataBing = handleAllarea
  }else if(getFieldValue('d_x_bing') == '2'||d_bing_initialValue==2){
    treeSelectDataBing = dic_dic_occupatio
  }else if(getFieldValue('d_x_bing') == '3'||d_bing_initialValue==3){
    treeSelectDataBing = new_dic_standing
  }else if(getFieldValue('d_x_bing') == '4'||d_bing_initialValue==4){
    treeSelectDataBing = new_org_aid_type
  }else if(getFieldValue('d_x_bing') == '5'||d_bing_initialValue==15){
    treeSelectDataBing = dic_consult_treatment_mode
  }
  let treeSelectDatay = []
  if(getFieldValue('d_y') == '1'||d_y_initialValue==1){
    treeSelectDatay = caseReason
  }else if(getFieldValue('d_y') == '0'||d_y_initialValue==0){
    treeSelectDatay = handleAllarea
  }else if(getFieldValue('d_y') == '2'||d_y_initialValue==2){
    treeSelectDatay = dic_dic_occupatio
  }else if(getFieldValue('d_y') == '3'||d_y_initialValue==3){
    treeSelectDatay = new_dic_standing
  }else if(getFieldValue('d_y') == '4'||d_y_initialValue==4){
    treeSelectDatay = new_org_aid_type
  }else if(getFieldValue('d_y') == '5'||d_y_initialValue==5){
    treeSelectDatay = dic_consult_treatment_mode
  }
  let treeSelectDatayzhu = []
  if(getFieldValue('d_y_zhu') == '1'||d_y_zhu_initialValue==1){
    treeSelectDatayzhu = caseReason
  }else if(getFieldValue('d_y_zhu') == '0'||d_y_zhu_initialValue==0){
    treeSelectDatayzhu = handleAllarea
  }else if(getFieldValue('d_y_zhu') == '2'||d_y_zhu_initialValue==2){
    treeSelectDatayzhu = dic_dic_occupatio
  }else if(getFieldValue('d_y_zhu') == '3'||d_y_zhu_initialValue==3){
    treeSelectDatayzhu = new_dic_standing
  }else if(getFieldValue('d_y_zhu') == '4'||d_y_zhu_initialValue==4){
    treeSelectDatayzhu = new_org_aid_type
  }else if(getFieldValue('d_y_zhu') == '5'||d_y_zhu_initialValue==5){
    treeSelectDatayzhu = dic_consult_treatment_mode
  }
  for (let key in allArea) {
    for (let i = 0; i < allArea[key].length; i++) {
      allArea[key][i].key = 'allArea' + key + i;
    }
  }
  if (allArea) {
    allArea.forEach((item, index) => {
      allArea[index].children = item['ormOrgRegionDtoList']
    })
  }
  allArea && allArea.map((item,index) => {
    item.label = item.cityName
    item.value = item.cityId
    item.children && item.children.map((item,index) => {
      item.label =item.cityName
      item.value = item.cityId
    })
  })
  allArea && allArea.children && allArea.children.map((item,index) => {
    item.label =item.cityName
    item.label = item.cityId
  })
   dictData.dic_case_type.map(item => {
    item.label = item.name
    item.value = item.code
    item.key = item.code
  })
  let analysType = [...analysis.analysisType]
  if(getFieldValue('d_analyzeSource') == '1'){
    delete analysType[5]
  }else if(getFieldValue('d_analyzeSource') == '0'){
    delete analysType[3]
    delete analysType[4]
  }
  const handleSource = () => {
    if (getFieldValue('d_analyzeSource')) {
      dispatch({type:"analysis/setValueOnChange"})
      setFieldsValue({
       d_x: [],
       d_y: [],
       d_x_content: [],
       d_y_content: [],
       d_x_zhu: [],
       d_x_zhu_content: [],
       d_y_zhu: [],
       d_y_zhu_content: [],
       d_x_bing: [],
       d_x_content_bing: [],
       d_analyzeAreas: [],
      })
    }
  }
  if(getFieldValue('d_x') &&  getFieldValue('d_y') && getFieldValue('d_x') === getFieldValue('d_y')){
    message.warning('横纵轴请选择不同展示的内容')
    // setFieldsValue({
    //   y2: '',
    //   xx: '',
    // })
  }
  const onChangex = (value) => {
    dispatch({type:"analysis/setd_x_initialValue",payload:value})
    if (getFieldValue('d_x')) {
      setFieldsValue({
        d_x_content: [],
      })
    }
  }
   const onChangexzhu = (value) => {
      dispatch({type:"analysis/setd_x_zhu_initialValue",payload:value})
      if (getFieldValue('d_x_zhu')) {
        setFieldsValue({
          d_x_zhu_content: [],
        })
      }
    }
    const onChangeArryXzhu=(value,e)=>{
      dispatch({type:"analysis/setd_x_zhu_initialValuOnChangeArryX",payload:value})
    }
  const onChangeArryX=(value,e)=>{
    dispatch({type:"analysis/setd_x_initialValuOnChangeArryX",payload:value})
  }
  const onChangey = (value) => {
    dispatch({type:"analysis/setd_y_initialValue",payload:value})
    if (getFieldValue('d_y')) {
      setFieldsValue({
        d_y_content: [],
      })
    }
  }
  const onChangeyzhu = (value) => {
    dispatch({type:"analysis/setd_y_zhu_initialValue",payload:value})
    if (getFieldValue('d_y_zhu')) {
      setFieldsValue({
        d_y_zhu_content: [],
      })
    }
  }
  const onChangeArryYzhu=(value,e)=>{
    dispatch({type:"analysis/setd_y_zhu_initialValuOnChangeArryY",payload:value})
  }
  const onChangeArryY=(value,e)=>{
    dispatch({type:"analysis/setd_y_initialValuOnChangeArryY",payload:value})
  }
  const onchangebing = (value) => {
    dispatch({type:"analysis/setd_bing_initialValue",payload:value})
    if (getFieldValue('d_x_bing')) {
      setFieldsValue({
        d_x_content_bing: [],
      })
    }
  }
  const onChangeArryBing=(value)=>{
    dispatch({type:"analysis/setd_bing_initialValuOnChangeArryX",payload:value})
  }
  const handleCaseTypeChange = (value) => {
    const str=getFieldValue('d_analyzeAreas');
    dispatch({ type: 'analysis/setValueOnChange'})
    setFieldsValue({
      d_x: [],
      d_y: [],
      d_x_content: [],
      d_y_content: [],
      d_x_zhu: [],
      d_x_zhu_content: [],
      d_y_zhu: [],
      d_y_zhu_content: [],
      d_x_bing: [],
      d_x_content_bing: [],
      d_analyzeAreas: [],
     })
    setFieldsValue({
      d_x_content: [],
    })
    dispatch({ type: 'analysis/handleCaseTypeChange', value })
  }
  const valueData=[]
  const treeProps = {
    treeData: treeSelectData,
    multiple: true,
    // treeCheckable: true,
    size: 'large',
    placeholder: '',
    treeNodeFilterProp: 'label',
    // onChange: (value,label,extra) =>{
    //  for(var i=0;i<label.length;i++){
    //    if(label[i] == '全省'){
    //      valueData.push[value[i]]
    //    }
    //  }
    // },
    // showCheckedStrategy: TreeSelect.SHOW_ALL,
    // treeDefaultExpandedKeys,
    // treeCheckStrictly: true,
    // onSelect: (value, node, extra) => {
    //   let caseRea = getFieldValue('d_x_content')
    //   if (!node.props.isChild) {
    //     setTimeout(() => {
    //       caseRea = _.reject(caseRea, (item) => item === value)
    //       setFieldsValue({ d_x_content: caseRea })
    //     }, 10)
    //   }
    // },
    getPopupContainer: () => document.getElementById('scroll-area'),
  }
  const treePropsyzhu = {
    treeData: treeSelectDatayzhu,
    multiple: true,
    // treeCheckable: true,
    size: 'large',
    placeholder: '',
    treeNodeFilterProp: 'label',
    // treeDefaultExpandedKeys,
    // treeCheckStrictly: true,
  
    getPopupContainer: () => document.getElementById('scroll-area'),
  }
  // const treePropsy = {
  //   treeData: treeSelectDatay,
  //   multiple: true,
  //   // treeCheckable: true,
  //   size: 'large',
  //   placeholder: '',
  //   treeNodeFilterProp: 'label',
  //   // treeDefaultExpandedKeys,
  //   // treeCheckStrictly: true,
  
  //   getPopupContainer: () => document.getElementById('scroll-area'),
  // }
  const treePropszhu = {
    treeData: treeSelectDatazhu,
    multiple: true,
    // treeCheckable: true,
    size: 'large',
    placeholder: '',
    treeNodeFilterProp: 'label',
    // treeDefaultExpandedKeys,
    // treeCheckStrictly: true,
  
    getPopupContainer: () => document.getElementById('scroll-area'),
  }
  const treePropsy = {
    treeData: treeSelectDatay,
    multiple: true,
    // treeCheckable: true,
    size: 'large',
    placeholder: '',
    treeNodeFilterProp: 'label',
    // treeDefaultExpandedKeys,
    // treeCheckStrictly: true,
  
    getPopupContainer: () => document.getElementById('scroll-area'),
  }
  const treePropsBing = {
    treeData: treeSelectDataBing,
    multiple: true,
    // treeCheckable: true,
    size: 'large',
    placeholder: '',
    treeNodeFilterProp: 'label',
    // treeDefaultExpandedKeys,
    // treeCheckStrictly: true,
  
    getPopupContainer: () => document.getElementById('scroll-area'),
  }

  const cityOption = analysis.cityOptions.map(city => <Option key={city.id}>{city.name}</Option>)
  const sourceOption = analysis.sourceOptions.map(source => <Option key={source.key}>{source.value}</Option>)
  const timeOption = analysis.timeOptions.map(time => <Option key={time.key}>{time.value}</Option>)
  const caseReasonOption = dictData.dic_case_type.map(item => <Option key={item.key} value={item.value}>{item.label}</Option>)
  const analysisType = analysis.analysisType.map(item => <Option key={item.key} value={item.key}>{item.value}</Option>)
   analysType = analysType.map(item => <Option key={item.key} value={item.key}>{item.value}</Option>)
  const messageList = {
    analyzeAreas: '请选择分析地区',
    analyzeSource: '请选择分析来源',
  }
  const yearCountSubmit = () => {
    let fields = getFieldsValue();
    dispatch({
      type: 'analysis/getList',
      payload: fields,
    })
  }
  var sumItem = analysis.targetPopulationData.map((item,index) => {
    var arr = analysis.targetPopulationData
    var sum = 0
    for(var i=0;i<=index;i++){
    sum += arr[i].num
    }
    return sum
  })
  let itemSum = sumItem[sumItem.length-1]
  //当年咨询、案件统计
  const caseOrCounselSubmit = () => {
    validateFieldsAndScroll((errors, values) => {
      if (values.a_analyzeAreas == undefined || values.a_analyzeSource == undefined) {
        return
      }
      let fields = getFieldsValue();
      if(fields.a_analyzeAreas){
      if(fields.a_analyzeAreas.length == 1){
        fields.a_analyzeAreas = fields.a_analyzeAreas[0].toString()
      }else{
        fields.subAreaId = fields.a_analyzeAreas[1].toString()
        fields.a_analyzeAreas = fields.a_analyzeAreas[0].toString()
      }
    }
      let data = {
        areaId: fields.a_analyzeAreas,
        subAreaId: fields.subAreaId,
        anlyzeSource: fields.a_analyzeSource
      }
      dispatch({
        type: 'analysis/getCaseOrCounselList',
        payload: data,
      })
    })
  }

  //案由数据统计
  const caseCauseSubmit = () => {
    validateFieldsAndScroll((errors, values) => {
      if (values.b_timeHorizon == undefined || values.b_analyzeAreas == undefined || values.b_analyzeSource == undefined || values.b_caseSort == undefined) {
        return
      }
      let fields = getFieldsValue();
      if(fields.b_analyzeAreas){
        if(fields.b_analyzeAreas.length == 1){
          fields.b_analyzeAreas = fields.b_analyzeAreas[0].toString()
        }else{
          fields.subAreaId = fields.b_analyzeAreas[1].toString()
          fields.b_analyzeAreas = fields.b_analyzeAreas[0].toString()
        }
      }
      let data = {
        timeHorizon: fields.b_timeHorizon,
        // anlyzeAreas: fields.b_analyzeAreas,
        areaId: fields.b_analyzeAreas,
        subAreaId: fields.subAreaId,
        anlyzeSource: fields.b_analyzeSource,
        caseSource: fields.b_caseSort
      }
      dispatch({
        type: 'analysis/getCaseCause',
        payload: data,
      })
    })
  }

  // //咨询人、申请人数据统计
  const applicantOrCounselorSubmit = () => {
    validateFieldsAndScroll((errors, values) => {
      if (values.c_timeHorizon == undefined || values.c_analyzeAreas == undefined || values.c_analyzeSource == undefined) {
        return
      }
      let fields = getFieldsValue();
      if(fields.c_analyzeAreas){
        if(fields.c_analyzeAreas.length == 1){
          fields.c_analyzeAreas = fields.c_analyzeAreas[0].toString()
        }else{
          fields.subAreaId = fields.c_analyzeAreas[1].toString()
          fields.c_analyzeAreas = fields.c_analyzeAreas[0].toString()
        }
      }
    //   if(fields.c_timeHorizon == 0){
    //   const nowDate = moment().format('YYYY-MM').split('-');
    //   let s = nowDate[1].replace(/^0/, '');
    //   if(s>=3 && s<=5){
    //     fields.c_timeHorizon = nowDate[0]+ '03-'+nowDate[0] + '05'
    //   }else if(s>=6 && s<=8){
    //     fields.c_timeHorizon =  nowDate[0]+ '06-'+nowDate[0] + '08'
    //   }else if(s>=9 && s<=11){
    //     fields.c_timeHorizon =  nowDate[0]+ '09-'+nowDate[0] + '11'
    //   }else{
    //     fields.c_timeHorizon =  nowDate[0]+ '12-'+Number(nowDate[0])+Number(1) + '2'
    //   }
    // }
      let data = {
        timeHorizon: fields.c_timeHorizon,
        // anlyzeAreas: fields.c_analyzeAreas,
        areaId: fields.c_analyzeAreas,
        subAreaId: fields.subAreaId,
        anlyzeSource: fields.c_analyzeSource,
      }
      dispatch({
        type: 'analysis/getApplicantOrCounselor',
        payload: data,
      })
    })
  }
   //  自定义数据统计
   const customSubmit = () => {
    validateFieldsAndScroll((errors, values) => {
      if (values.d_timeHorizon == undefined || values.d_analyzeAreas == undefined || values.d_analyzeSource == undefined || values.d_caseSort == undefined) {
        return
      }else if(values.d_x && values.d_y && values.d_x == values.d_y){
        message.warning('横纵轴请选择不同展示的内容')
        return
      }
      let fields = getFieldsValue();
      var orgList = [];
      if(fields.d_x == 0){
    for(var i=0;i<fields.d_x_content.length;i++){
    	var type = '';
      var orgId = fields.d_x_content[i].toString();
    	orgId = orgId.split('_');
      orgId = orgId[0]
    	if(fields.d_x_content[i].toString().indexOf('_sheng') > 0){
    		type = 2;
    	}else if(fields.d_x_content[i].toString().indexOf('_shi') > 0){
    		type = 1;
    	}else{
    		type = 0;
    	}
    	var obj = {
    		orgId: Number(orgId),
    		type: type.toString()
    	}
    	orgList.push(obj);
    }
  }
    if(fields.d_y == 0){
    for(var i=0;i<fields.d_y_content.length;i++){
    	var type = '';
      var orgId = fields.d_y_content[i].toString();
    	orgId = orgId.split('_');
      orgId = orgId[0]
    	if(fields.d_y_content[i].toString().indexOf('_sheng') > 0){
    		type = 2;
    	}else if(fields.d_y_content[i].toString().indexOf('_shi') > 0){
    		type = 1;
    	}else{
    		type = 0;
    	}
    	var obj = {
    		orgId: Number(orgId),
    		type: type.toString()
    	}
    	orgList.push(obj);
    }
  }
    let data = {
      caseMulti: fields.d_casequn,
        caseSource: fields.d_caseSort,
        startTime: moment(fields.d_timeHorizon[0]).format('YYYY-MM-DD'),
        endTime:  moment(fields.d_timeHorizon[1]).format('YYYY-MM-DD'),
        xName: fields.d_x,
        yName: fields.d_y,
        anlyzeSource: fields.d_analyzeSource,
        city: [],
        other: [],
        province: [],
    };
    if(fields.d_x == 0){
      data.orgList = orgList
    }else{
      data.contentX = fields.d_x_content
    }
    if(fields.d_y == 0){
      data.orgList = orgList
    }else{
      data.contentY = fields.d_y_content
    }
      dispatch({
        type: 'analysis/getCustomeData',
        payload: data,
      })
    })
  }
  const customzhuSubmit = () => {
    validateFieldsAndScroll((errors, values) => {
      if (values.d_timeHorizon == undefined || values.d_analyzeAreas == undefined || values.d_analyzeSource == undefined || values.d_caseSort == undefined) {
        return
      }else if(values.d_x_zhu && values.d_y_zhu && values.d_x_zhu == values.d_y_zhu){
        message.warning('横纵轴请选择不同展示的内容')
        return
      }
      let fields = getFieldsValue();
      var orgList = [];
      if(fields.d_x_zhu == 0){
    for(var i=0;i<fields.d_x_zhu_content.length;i++){
    	var type = '';
      var orgId = fields.d_x_zhu_content[i].toString();
    	orgId = orgId.split('_');
      orgId = orgId[0]
    	if(fields.d_x_zhu_content[i].toString().indexOf('_sheng') > 0){
    		type = 2;
    	}else if(fields.d_x_zhu_content[i].toString().indexOf('_shi') > 0){
    		type = 1;
    	}else{
    		type = 0;
    	}
    	var obj = {
    		orgId: Number(orgId),
    		type: type.toString()
    	}
    	orgList.push(obj);
    }
  }
    if(fields.d_y_zhu == 0){
    for(var i=0;i<fields.d_y_zhu_content.length;i++){
    	var type = '';
      var orgId = fields.d_y_zhu_content[i].toString();
    	orgId = orgId.split('_');
      orgId = orgId[0]
    	if(fields.d_y_zhu_content[i].toString().indexOf('_sheng') > 0){
    		type = 2;
    	}else if(fields.d_y_zhu_content[i].toString().indexOf('_shi') > 0){
    		type = 1;
    	}else{
    		type = 0;
    	}
    	var obj = {
    		orgId: Number(orgId),
    		type: type.toString()
    	}
    	orgList.push(obj);
    }
  }
    let data = {
      caseMulti: fields.d_casequn,
        caseSource: fields.d_caseSort,
        startTime: moment(fields.d_timeHorizon[0]).format('YYYY-MM-DD'),
        endTime:  moment(fields.d_timeHorizon[1]).format('YYYY-MM-DD'),
        xName: fields.d_x_zhu,
        yName: fields.d_y_zhu,
        anlyzeSource: fields.d_analyzeSource,
        city: [],
        other: [],
        province: [],
    };
    if(fields.d_x_zhu == 0){
      data.orgList = orgList
    }else{
      data.contentX = fields.d_x_zhu_content
    }
    if(fields.d_y_zhu == 0){
      data.orgList = orgList
    }else{
      data.contentY = fields.d_y_zhu_content
    }
      dispatch({
        type: 'analysis/getCustomezhuData',
        payload: data,
      })
    })
  }
  const customBingSubmit = () => {
    validateFieldsAndScroll((errors, values) => {
      if (values.d_timeHorizon == undefined || values.d_analyzeAreas == undefined || values.d_analyzeSource == undefined || values.d_caseSort == undefined) {
        return
      }else if(values.d_x && values.d_y && values.d_x == values.d_y){
        message.warning('横纵轴请选择不同展示的内容')
        return
      }
      let fields = getFieldsValue();
      var orgList = [];
    for(var i=0;i<fields.d_x_content_bing.length;i++){
    	var type = '';
      var orgId = fields.d_x_content_bing[i].toString();
    	orgId = orgId.split('_');
      orgId = orgId[0]
    	if(fields.d_x_content_bing[i].toString().indexOf('_sheng') > 0){
    		type = 2;
    	}else if(fields.d_x_content_bing[i].toString().indexOf('_shi') > 0){
    		type = 1;
    	}else{
    		type = 0;
    	}
    	var obj = {
    		orgId: Number(orgId),
    		type: type.toString()
    	}
    	orgList.push(obj);
    }
  
    let data = {
        caseMulti: fields.d_casequn,
        caseSource: fields.d_caseSort,
        startTime: moment(fields.d_timeHorizon[0]).format('YYYY-MM-DD'),
        endTime:  moment(fields.d_timeHorizon[1]).format('YYYY-MM-DD'),
        xName: fields.d_x_bing,
        anlyzeSource: fields.d_analyzeSource,
        city: [],
        other: [],
        province: [],
    };
    if(fields.d_x_bing == 0){
      data.orgList = orgList
    }else{
      data.contentX = fields.d_x_content_bing
    }
      dispatch({
        type: 'analysis/getBingCustomeData',
        payload: data,
      })
    })
  }
  const callback = (key) => {
   
  }

  const formItemLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 16
    },
  }
  const formItemLayoutSmall = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 12 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 12 },
    },
  }
  return (
    <div className={styles.analysis}>
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="当年咨询、案件统计" key="1">
          <Form>
            <Row className={styles.selectRow} gutter={16}>
              <Col span={8}>
                <FormItem {...formItemLayout} label="分析地区:">
                  {getFieldDecorator('a_analyzeAreas', {
                    rules: [{ required: true, message: '请选择分析地区' }],
                  })(
            <Cascader options={allArea} placeholder="请选择分析地区" onChange={(v) => console.log(v)} />
                    )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label="分析来源:">
                  {getFieldDecorator('a_analyzeSource', {
                    rules: [{ required: true, message: '请选择分析来源' }],
                  })(
                    <Select
                      placeholder="请选择来源"
                    >
                      {sourceOption}
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Button type="primary" onClick={caseOrCounselSubmit}>搜索</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
          {analysis.getData.caseOrCounsel.show &&
            <Row className={styles.dataView}>
              <div className={styles.unit}>{analysis.getData.caseOrCounsel.category}数（件）</div>
              <ResponsiveContainer width='100%' aspect={3}>
                <LineChart layout="horizontal" data={analysis.yearCountData}
                  margin={{ top: 20, right: 30, left: 30, bottom: 50 }}>
                  <YAxis type="number" />
                  <XAxis dataKey="month" type="category" />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Line dataKey="数量" stroke="#000" label={<CustomizedLabel />} />
                </LineChart>
              </ResponsiveContainer>
            </Row>
          }
        </TabPane>

        <TabPane tab="案由数据统计" key="2">
          <Form>
            <Row className={styles.selectRow} gutter={16}>
              <Col span={9}>
                <FormItem {...formItemLayout} label="分析时间范围:">
                  {getFieldDecorator('b_timeHorizon', {
                    rules: [{ required: true, message: '请选择分析时间范围' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      placeholder="选择分析时间范围"
                    >
                      {timeOption}
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col span={9}>
                <FormItem {...formItemLayout} label="分析地区:">
                  {getFieldDecorator('b_analyzeAreas', {
                    rules: [{ required: true, message: '请选择分析地区' }],
                  })(
                    <Cascader options={allArea} placeholder="请选择分析地区" onChange={(v) => console.log(v)} />
                    )}
                </FormItem>
              </Col>
              <Col span={9}>
                <FormItem {...formItemLayout} label="分析来源:">
                  {getFieldDecorator('b_analyzeSource', {
                    rules: [{ required: true, message: '请选择分析来源' }],
                  })(
                    <Select
                      placeholder="选择分析来源"
                    >
                      {sourceOption}
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col span={9}>
                <FormItem {...formItemLayout} label="案由类别:">
                  {getFieldDecorator('b_caseSort', {
                    rules: [{ required: true, message: '请选择案由类别' }],
                  })(
                    <Select
                      placeholder="选择案由类别"
                    >
                      {caseReasonOption}
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem>
                  <Button type="primary" onClick={caseCauseSubmit}>搜索</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
          {analysis.getData.caseCause.show &&
            <Row className={styles.dataView}>
              <div className={styles.unit}>{analysis.getData.caseCause.category}数（件）</div>
              <ResponsiveContainer width='100%' aspect={2}>
                <BarChart data={analysis.caseOriginData}
                  margin={{ top: 20, right: 30, left: 30, bottom: 150 }}>
                  <XAxis dataKey="caseName" interval={0} tick={<CustomizedAxisTick />} />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Bar dataKey="数量" fill="#8884d8" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </Row>
          }
        </TabPane>

        <TabPane tab="咨询人、申请人数据统计" key="3">
          <Form>
            <Row className={styles.selectRow} gutter={16}>
              <Col span={8}>
                <FormItem {...formItemLayout} label="分析时间范围:">
                  {getFieldDecorator('c_timeHorizon', {
                    rules: [{ required: true, message: '请选择分析时间范围' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      placeholder="选择分析时间范围"
                    >
                      {timeOption}
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="分析地区:">
                  {getFieldDecorator('c_analyzeAreas', {
                    rules: [{ required: true, message: '请选择分析地区' }],
                  })(
                    <Cascader options={allArea} placeholder="请选择分析地区" onChange={(v) => console.log(v)} />
                    )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="分析来源:">
                  {getFieldDecorator('c_analyzeSource', {
                    rules: [{ required: true, message: '请选择分析来源' }],
                  })(
                    <Select
                      placeholder="请选择来源"
                    >
                      {sourceOption}
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  <Button type="primary" onClick={applicantOrCounselorSubmit}>搜索</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className={styles.colorList}>
            <dl>
              {
                analysis.targetPopulationData.map((item, index) => <dd key={index}><span style={{ background: colors[index] }}></span><b>{item.name}</b><span>({(item.num*100/itemSum).toFixed(1)}<b>%</b></span> <b className={styles.ml}>{item.num}件</b>)</dd>)
              }
            </dl>
          </div>
          {analysis.getData.applicantOrCounselor.show &&
            <Row className={styles.dataView}>
              <ResponsiveContainer width='100%' aspect={2}>
                <PieChart>
                  <Pie
                    data={analysis.targetPopulationData}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    dataKey="num"
                    fill="#8884d8"
                    cx="50%"
                    cy="50%"
                  >
                    {
                      analysis.targetPopulationData.map((entry, index) => <Cell key={index} fill={colors[index % colors.length]} />)
                    }
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Row>
          }
        </TabPane>

        <TabPane tab="自定义数据分析" key="4">
          <Form>
            <Row className={styles.selectRow} gutter={16}>
              <Col span={8}>
                <FormItem {...formItemLayout} label="分析时间范围:">
                  {getFieldDecorator('d_timeHorizon', {
                    rules: [{ required: true, message: '请选择分析时间范围' }],
                  })(
                    <RangePicker style={{ width: '100%' }} />
                    )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label="分析来源:">
                  {getFieldDecorator('d_analyzeSource', {
                    rules: [{ required: true, message: '请选择分析来源' }],
                  })(
                    <Select
                      placeholder="请选择来源"
                      onChange={handleSource}
                    >
                      {sourceOption}
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label="展现方式:">
                  {getFieldDecorator('d_analyzeAreas', {
                    rules: [{ required: true, message: '请选择展现方式' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      placeholder="请选择展现方式"
                    >
                    <OptGroup label="请选择">
                      <Option key="1" value="zhexian">折线图</Option>
                      <Option key="2" value="zhuzhuang">柱状图</Option>
                      <Option key="bing" vlaue="bing">饼图</Option>
                    </OptGroup>
                    </Select>
                    )}
                </FormItem>
              </Col>
              </Row>
             <Row className={styles.pannelhr} gutter={16}>
             <Col span={8}>
             <FormItem {...formItemLayout} label="案由类别:">
                  {getFieldDecorator('d_caseSort', {
                    rules: [{ required: true, message: '请选择案由类别' }],
                  })(
                    <Select
                      placeholder="选择案由类别"
                      onChange={handleCaseTypeChange}
                    >
                      {caseReasonOption}
                    </Select>
                    )}
                </FormItem>
                </Col>
             {getFieldValue('d_analyzeSource') == '1' && <Col span={8}>
                <FormItem {...formItemLayout} label="是否群体性案件:">
                  {getFieldDecorator('d_casequn')(
                    <Select
                      style={{ width: '100%' }}
                      placeholder="请选择是否群体性案件"
                    >
                    <OptGroup label="请选择">
                      <Option key="1" value="M">是</Option>
                      <Option key="2" value="N">否</Option>
                    </OptGroup>
                    </Select>
                    )}
                </FormItem>
              </Col>}
             </Row>
            {getFieldValue('d_analyzeAreas') =='zhexian'  && <div><Row  gutter={16}>
              <Col span={8}>
                <FormItem {...formItemLayoutSmall} label="请选择横轴展示的内容:">
                  {getFieldDecorator('d_x',({initialValue:d_x_initialValue}))(
                    <Select
                      style={{ width: '100%' }}
                      placeholder="请选择横轴展示的内容"
                      onChange={onChangex}
                    >
                    {getFieldValue('d_analyzeSource') && analysType}
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutSmall} label="请选择具体展示项:">
                  {getFieldDecorator('d_x_content',({initialValue:ChangeArryX}))(
                   <TreeSelect onChange={onChangeArryX} dropdownStyle={{ maxHeight: 200, overflow: 'auto' }} {...treeProps} />
                    )}
                </FormItem>
              </Col>
             </Row>
             <Row  gutter={16}>
              <Col span={8}>
                <FormItem {...formItemLayoutSmall} label="请选择纵轴展示的内容:">
                  {getFieldDecorator('d_y',({initialValue:d_y_initialValue}))(
                    <Select
                      style={{ width: '100%' }}
                      placeholder="请选择纵轴展示的内容"
                      onChange={onChangey}
                    >
                    {getFieldValue('d_analyzeSource') && analysType}
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutSmall} label="请选择具体展示项:">
                  {getFieldDecorator('d_y_content',({initialValue:ChangeArryY}))(
                      <TreeSelect  onChange={onChangeArryY} dropdownStyle={{ maxHeight: 200, overflow: 'auto' }} {...treePropsy} />
                    )}
                </FormItem>
              </Col>
              <Col span={8}>
              <FormItem>
                  <Button type="primary" onClick={customSubmit}>开始分析</Button>
                </FormItem>
              </Col>
             </Row></div>}
             { getFieldValue('d_analyzeAreas') =='zhuzhuang'  && <div><Row  gutter={16}>
              <Col span={8}>
                <FormItem {...formItemLayoutSmall} label="请选择横轴展示的内容:">
                  {getFieldDecorator('d_x_zhu',({initialValue:d_x_zhu_initialValue}))(
                    <Select
                      style={{ width: '100%' }}
                      placeholder="请选择横轴展示的内容"
                      onChange={onChangexzhu}
                    >
                    {getFieldValue('d_analyzeSource') && analysType}
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutSmall} label="请选择具体展示项:">
                  {getFieldDecorator('d_x_zhu_content',({initialValue:ChangeArryXzhu}))(
                   <TreeSelect onChange={onChangeArryXzhu} dropdownStyle={{ maxHeight: 200, overflow: 'auto' }} {...treePropszhu} />
                    )}
                </FormItem>
              </Col>
             </Row>
             <Row  gutter={16}>
              <Col span={8}>
                <FormItem {...formItemLayoutSmall} label="请选择纵轴展示的内容:">
                  {getFieldDecorator('d_y_zhu',({initialValue:d_y_zhu_initialValue}))(
                    <Select
                      style={{ width: '100%' }}
                      placeholder="请选择纵轴展示的内容"
                      onChange={onChangeyzhu}
                    >
                    {getFieldValue('d_analyzeSource') && analysType}
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutSmall} label="请选择具体展示项:">
                  {getFieldDecorator('d_y_zhu_content',({initialValue:ChangeArryYzhu}))(
                      <TreeSelect  onChange={onChangeArryYzhu} dropdownStyle={{ maxHeight: 200, overflow: 'auto' }} {...treePropsyzhu} />
                    )}
                </FormItem>
              </Col>
              <Col span={8}>
              <FormItem>
                  <Button type="primary" onClick={customzhuSubmit}>开始分析</Button>
                </FormItem>
              </Col>
             </Row></div>}
             {getFieldValue('d_analyzeAreas') == 'bing'  && <div><Row  gutter={16}>
              <Col span={8}>
                <FormItem {...formItemLayoutSmall} label="请选择要分析的内容:">
                  {getFieldDecorator('d_x_bing',({initialValue:d_bing_initialValue}))(
                    <Select
                      style={{ width: '100%' }}
                      placeholder="请选择要分析的内容"
                      onChange={onchangebing}
                    >
                    {getFieldValue('d_analyzeSource') && analysType}
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutSmall} label="请选择具体展示项:">
                  {getFieldDecorator('d_x_content_bing',({initialValue:ChangeArryBing}))(
                   <TreeSelect onChange={onChangeArryBing} dropdownStyle={{ maxHeight: 200, overflow: 'auto' }} {...treePropsBing} />
                    )}
                </FormItem>
              </Col>
              <Col span={8}>
              <FormItem>
                  <Button type="primary" onClick={customBingSubmit}>开始分析</Button>
                </FormItem>
              </Col>
             </Row></div>}
             <Row>
            </Row>
          </Form>
          {analysis.getData.caseCustome.show && getFieldValue('d_analyzeAreas') == 'zhexian' &&
          <div className={styles.colorList}>
            <dl>
              {
               json3 && json3.map((item, index) => <dd key={index}><span style={{ background: colors[index] }}></span><b>{item.name}</b></dd>)
              }
            </dl>
            <Row className={styles.dataView}>
              <div className={styles.unitzhu}>数量</div>
              <ResponsiveContainer width='100%' aspect={3}>
                <LineChart layout="horizontal" data={json2}
                  margin={{ top: 20, right: 30, left: 150, bottom: 50 }}>
                  <YAxis type="number" />
                  <XAxis dataKey="xName" padding={{left: 30, right: 30}}/>
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  {yData.map((item,index)=>{
                       return(
       		               <Line type="monotone" dataKey={item} stroke={colors[index]} />
                              )
                                })}
                  {/* <Line dataKey='num' stroke="#000" label={<CustomizedLabel />} /> */}
                </LineChart>
              </ResponsiveContainer>
            </Row>
            </div>
          }
           {analysis.getData.casezhuCustome.show && getFieldValue('d_analyzeAreas') == 'zhuzhuang' &&
          <div className={styles.colorList}>
            <dl>
              {
               zhuxing && zhuxing.map((item, index) => <dd key={index}><span style={{ background: colors[index] }}></span><b>{item.name}</b></dd>)
              }
            </dl>
            <Row className={styles.dataView}>
              <div className={styles.unitzhu}>数量</div>
              <ResponsiveContainer width='100%' aspect={2}>
                <BarChart data={jsonzhu}
                  margin={{ top: 20, right: 30, left: 150, bottom: 150 }}>
                  <XAxis dataKey="xName"  />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  {zhuData.map((item,index)=>{
                             return(
                           <Bar  stackId='a' dataKey={item} fill={colors[index]} />)
                          })}
                </BarChart>
              </ResponsiveContainer>
            </Row>
            </div>
          }
          {analysis.getData.caseBingCustome.show && getFieldValue('d_analyzeAreas') == 'bing' &&
          <div className={styles.colorList}>
            <dl>
              {
               jsonBing && jsonBing.map((item, index) => <dd key={index}><span style={{ background: colors[index] }}></span><b>{item.name}</b></dd>)
              }
            </dl>
            <Row className={styles.dataView}>
              <ResponsiveContainer width='100%' aspect={2}>
                <PieChart>
                  <Pie
                    data={jsonBing}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    dataKey="num"
                    fill="#8884d8"
                    cx="50%"
                    cy="50%"  
                  >
                    {
                      jsonBing.map((entry, index) => <Cell key={index} fill={colors[index]} />)
                    }
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Row>
            </div>
          }
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({ analysis }) => ({ analysis }))(Form.create({
  onFieldsChange (props, fields) {
    let flds = fields
    if (flds.d_caseSort || flds.d_analyzeSource) {
 flds.d_x_content = { name: 'd_x_content', value: '' }
}
  }
})(Analysis))
