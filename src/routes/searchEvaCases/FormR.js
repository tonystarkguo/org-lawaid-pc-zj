import React from 'react'
import styles from './index.less'
import { createDicNodes } from '../../utils'
import FormR_one from './FormR_one'
import { routerRedux } from 'dva/router'

const { createSelectOption } = createDicNodes
import { Breadcrumb, Row, Col, Form, Input, Button, Radio, Card, Select } from 'antd'
const Option = Select.Option
const FormItem = Form.Item
const { TextArea } = Input
/**
 * 质量评估表单.只读.
 */
const FormR = ({
    edit_items,
    formdata001,
    submitScore,
    dicEvaluationMethod,
    update,
    // 评估结果列表.
    evalList,
    // 评估结果映射.
    evalResult,
    // 当前选中的评估结果映射KEY.
    evalSelectedResultKey,

    evalSelectedResultKeyFa,
    caseId,
    //省级选择ID
    orgId,
    type,
    searchEvaCases,
    data,
    dispatch,
}) => {
    // 如果没评估结果.
    //编辑之后不可强制刷新init问题
  if (data==undefined||data.length == 0 || dicEvaluationMethod == 0) {
    return (
            <Card title={(
                <div className={styles.scoreTitle}>质量评估结果：</div>
            )}>
                尚未进行案件质量评估
            </Card>
    )
  }
    // 下拉选项.
  let psList = [];
  if(evalList){
    evalList.map((item, index) => {
      psList.push({ label: item, value: item })
    });
  }
  
  let psListFa = [];
  if(data){
    data.map((item, index) => {
      if(item.orgName!=""&&item.orgName!='(null)null'){
        psListFa.push({ label: item, value: index })
      }
      
    });
  }
  
  const onItemChange = (value) => {
    if(value){
      let arry;
      data.map((item,index)=>{
        if(item.orgId===orgId){
          arry= item.map.evalResult
        }
      });
      localStorage.setItem('selectedKey', value)
      console.log(arry,orgId)
    const selectedItem = arry[value].appoint;
    update({
      evalSelectedResultKey: value || '',
      userType: selectedItem.dicUserType,
      evalResult: arry,
    })
    }else{
      update({
        evalSelectedResultKey: '',
      })
      
    }
    
  }
  const onItemChangeFa = (value)=>{
    if(value==undefined){
      update({
        evalSelectedResultKey:"",
        evalList:[],
        evalResult:{},
        orgId:"",
      });
      return;
    }
    dispatch({type:"searchEvaCases/getIsEvalStand",payload:orgId});
    update({
      evalSelectedResultKey:"",
      evalSelectedResultKeyFa:psListFa[value].label.orgName,
      evalList:data[value].map.evalList,
      orgId:data[value].orgId
    })
  }
  const  Userid=JSON.parse(localStorage.user).ormOrgIdDto.tOrgId;
  let cSelectItems = (<Select allowClear defaultValue={evalSelectedResultKey} placeholder="请选择" className={styles.selectItem}
    onChange={onItemChange}
  >
        {psList.map((item, index) => {
          return <Option key={index} value={item.value}>{item.label}</Option>
        })
        }
    </Select>)
    //省县级区域选择
  let orignCSelectItems=(<Select allowClear defaultValue={evalSelectedResultKeyFa} placeholder="请选择" className={styles.selectItem}
  onChange={onItemChangeFa}
>
      {psListFa.map((item, index) => {
        return <Option  key={index} value={item.value}>{item.label.orgName}</Option>
      })
      }
  </Select>)
  const linkJump = (record, type) => {
    dispatch(routerRedux.push({
      pathname: '/searchEvaCases',
      query: {
        ...searchEvaCases.search,
        type: 2,
        editFlag: 1,
      },
    }))
  }
  if (evalSelectedResultKey == '') {
    return (
            <Card title={(
                <div className={styles.scoreTitle}>质量评估结果：{orignCSelectItems}</div>
            )}>
                <div></div>
                {cSelectItems}
            </Card>
    )
  }
    // 有条目选中的情况，先获取列表.
  let evalResulti = evalResult[evalSelectedResultKey]
  if (!evalResulti) {
    return (
            <Card title={(
                <div className={styles.scoreTitle}>质量评估结果：{orignCSelectItems}</div>
            )}>
                {cSelectItems}
                <br /><br />
                无数据，请刷新重试
            </Card>
    )
  }
  let scoreList = evalResulti.score
  let score = ''

    // 当前总分.
  let totalNum = 0
    // 遍历条目的模型.
  let form001_one_oneProps = []
  let indexi = 0
  scoreList.map((item, index) => {
    if (!item.isDeleted) {
      form001_one_oneProps.push({
        dicEvaluationMethod,
        item,
        index: indexi,
      })
      indexi++
            // 如果是5分制，则总分使用总评估得分.
      if (dicEvaluationMethod == 1) {
        if (item.isTotalEval) {
          totalNum = item.projectScore
        }
      } else {
        totalNum += item.projectScore ? (parseInt(item.projectScore) || 0) : 0
      }
    } else {
      form001_one_oneProps.push({
        dicEvaluationMethod,
        item,
        index: -1,
      })
    }
  })
    // 如果是5分制，当前总分进行调整文案.
  if (dicEvaluationMethod == 1) {
    if (totalNum < 3) {
      score = '不合格'
    } else if (totalNum == 3) {
      score = '合格'
    } else if (totalNum == 4) {
      score = '良好'
    } else if (totalNum == 5) {
      score = '优秀'
    }
  } else {
    score = totalNum
  }
  let isF = evalSelectedResultKey.indexOf('复评') > -1
    // DOM
  return (
        <Card title={(
                <div className={styles.scoreTitle}>质量评估结果：{orignCSelectItems}</div>
            )}
          extra={(<div>
                {(searchEvaCases.userType == 2&&Userid==orgId) && <Button type="primary" onClick={() => linkJump()}>
                    编辑
                </Button>}</div>
            )}
        >
         
            {cSelectItems}
            <br /><br />
            {scoreList.map((item, index) => {
              if (item.isDeleted) {
                return <div key={index}></div>
              }
              return (
                    <div key={index}>
                        <FormR_one {...form001_one_oneProps[index]} />
                    </div>
              )
            })}
            <Row gutter={24} type="flex">
                <Col width="20px">{indexi + 1}、</Col>
                <Col span={18}>
                    案件质量评价：
                    <Row gutter={24} type="flex" align="middle">
                        <Col span={18}>
                            <textarea cols={46} rows={8} readOnly="readonly" value={evalResulti.appoint.evaluationQuality || ''}></textarea>
                            <br /><br />
                        </Col>
                    </Row>
                </Col>
            </Row>
            {evalResulti.appoint.reviewMembers && evalResulti.appoint.reviewMembers.length > 0 ? (
                <Row gutter={24} type="flex">
                    <Col width="20px">{indexi + 2}、</Col>
                    <Col span={18}>
                        {!isF ? '评估小组成员：' : '复评小组成员：'}
                        <Row gutter={24} type="flex" align="middle">
                            <Col span={18}>
                                <textarea cols={46} rows={8} readOnly="readonly" value={evalResulti.appoint.reviewMembers || ''}></textarea>
                                <br /><br />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            ) : ('')}
        </Card>
  )
}

export default FormR
