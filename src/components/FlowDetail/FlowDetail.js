/*
本component是处理案件详情中展示流程信息，根据案件状态展示以下内容
1，线上审查 - 不展示任何信息
1.1 线上检查 - 初审现场补充材料，线上补充材料，待补充材料，案件初查通过 - 展示最新的日志
2，案件初审 - 展示最后一条日志 
3，案件复审 - 展示最后一条日志 
4，指派法律援助人员 - 指派人签收，点员-待受援人点员 - 展示最后一条日志
5，指派-推荐多法律援助人员 - 展示推荐法律援助人员的信息，列表展示
6，指派-法律援助人员已承接 - 展示承接律师信息
7，指派-发起竞价-展示最后一条日志（待办中实现）
8, 指派-竞价中-展示竞价法律援助人员列表
9，指派-竞价结束-推荐法律援助人员（待办中实现）
10，待机构确认 - 被推荐法律援助人员列表
11，确认指派 - 展示最后一条日志
12，案情承办 - 展示最后一条日志
13，更换法律援助人员 - 原法律援助人员信息和现法律援助人员信息
14，案件评价 - 法律援助人员信息
15，发起归档 - 展示最后一条日志？
 */
import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import styles from './FlowDetail.less'
import { Row, Col, Card, Form, Button } from 'antd'

import {caseStatusConverter} from '../../utils'
import Logcard from '../Logcard/Logcard.js'
import InfoCard from '../InfoCard/InfoCard'
import StarCard from '../StarCard/StarCard'

import {jsUtil, dateUtil} from '../../utils'
const FormItem = Form.Item;

const FlowDetail = ({ caseDetail, updateItem }) => {

  const selectedApplyer = caseDetail.flowDetail.selectedApplyer || []
  const updateReason = caseDetail.flowDetail.updateReason || []
  const bidInfo = caseDetail.flowDetail.bidInfo || {}//竞价信息
  const recLawyerInfo = caseDetail.flowDetail.recLawyerInfo || []//推荐律师列表
  const bidingLawyerList = caseDetail.flowDetail.bidingLawyerList || []//竞价中的律师列表
  const lawyerInfo = caseDetail.flowDetail.lawyerInfo || {}//法律援助人员信息
  const meterialInfo = caseDetail.flowDetail.meterialInfo || []//补充材料信息
  const aidFeesInfo = caseDetail.flowDetail.aidFeesInfo || {}//案件结算金额信息
  const underTakeInfo = caseDetail.flowDetail.underTakeInfo || {}//承办流程信息
  const toConfLawyerList = caseDetail.flowDetail.toConfLawyerList || {}//待受援人指定+待法律援助人员确定
  const rpLawyerList = caseDetail.flowDetail.rpLawyerList || {}//待受援人指定
  const starsInfo = caseDetail.flowDetail.starsInfo || []
  const {updaterLogData, caseStatus, caseBaseInfoData, isAppraise} = caseDetail

  

  let result = ''

  //案件简要信息
  const caseBrefPorps = {
    title: "案件信息",
    infos: [
      {label: '案件类型：', value: caseBaseInfoData.caseTypeName},
      {label: '援助方式：', value: caseBaseInfoData.caseAidWayName},
      {label: '所属阶段：', value: caseBaseInfoData.caseStepName},
      {label: '申请人地位：', value: caseBaseInfoData.standingName},
      // {label: '竞价范围：', value: caseBaseInfoData., show: false},
      {label: '案件概述：', span: 24, value: caseBaseInfoData.caseDetail}
    ]
  }
  //法律援助人员信息card
  const aidInfoCarfPorps = {
    title: "法律援助人员信息",
    infos: [
      {label: '工作机构：', value: lawyerInfo.workUnit},
      {label: '姓名：', value: lawyerInfo.name},
      {label: '职业：', value: lawyerInfo.dicHpIdentityName},
      {label: '联系方式：', value: lawyerInfo.mobile},
      {label: '所属机构：', value: lawyerInfo.orgName},
      {label: '工作年限：', value: `${lawyerInfo.workeYears || ''}年`},
      {label: '擅长领域：', value: jsUtil.getJoinedValFromArr(lawyerInfo.goodFields, 'tagName', ', ')}      
    ]
  }
  //需补充材料（第一次）card
  const needAddInfoCardPorps = {
    title: "需补充材料",
    infos: [
      {label: '发起时间：', value: meterialInfo && meterialInfo.length && meterialInfo[0].launchTime},
      {span: 24, label: '需补充内容：', value: meterialInfo && meterialInfo.length && meterialInfo[0].remark}
    ]
  }

  //援助类型
  /*const aidTypeCardProps = {
    title: "援助类型",
    infos : [
      {label: '援助类型：', value: '刑事辩护'}
    ],
    steps : {
      current: 1,
      label: "标承办流程：",
      step: [
        {title: "第一步", description: "会见当事人"},
        {title: "第二步", description: "侦查准备"},
        {title: "第三步", description: "侦查准备"}
      ]
    }
  }*/
  const hasProceedArr = _.filter(underTakeInfo, {'flowStatus': 1})

  const aidTypeCardProps = {
    title: "援助类型",
    infos : [
      {label: '援助类型：', value: caseBaseInfoData.caseAidWayName}
    ],
    steps : {
      current: (caseBaseInfoData.caseStatusCode == '17' ? hasProceedArr.length: -1),
      label: "标承办流程：",
      step: _.map(underTakeInfo, (d) => {d.title = d.flowName; return d})
    }
  }
  //援助类型
  const aidFeesProps = {
    title: "结算金额",
    infos : [
      {label: '承办事项补贴：', value: `${aidFeesInfo.settlePrice || ''}元`}
    ]
  }

  let sInf = [
    {
      "id": 1225,
      "oId": null,
      "tCaseId": 10239,
      "score": 2,
      "content": null,
      "dicGlobalType": "1",
      "appraiseGlobalId": "rp_881028108189171712",
      "closeTime": 1499107354000,
      "dicStatus": "1",
      "creatorGlobalId": null,
      "createTime": 1499064154000,
      "modifierGlobalId": null,
      "modifyTime": null,
      "isDeleted": null,
      "dicGlobalTypeName": "受援人"
    },
    {
      "id": 1227,
      "oId": null,
      "tCaseId": 10239,
      "score": 5,
      "content": "",
      "dicGlobalType": "2",
      "appraiseGlobalId": "hp_134694",
      "closeTime": 1499107354000,
      "dicStatus": "1",
      "creatorGlobalId": null,
      "createTime": 1499064154000,
      "modifierGlobalId": null,
      "modifyTime": null,
      "isDeleted": null,
      "dicGlobalTypeName": "法律援助人员"
    },
    {
      "id": 1229,
      "oId": null,
      "tCaseId": 10239,
      "score": 0,
      "content": null,
      "dicGlobalType": "3",
      "appraiseGlobalId": null,
      "closeTime": 1499107354000,
      "dicStatus": null,
      "creatorGlobalId": null,
      "createTime": 1499064154000,
      "modifierGlobalId": null,
      "modifyTime": null,
      "isDeleted": null,
      "dicGlobalTypeName": "机构"
    },
    {
      "id": 1231,
      "oId": null,
      "tCaseId": 10239,
      "score": 3,
      "content": null,
      "dicGlobalType": "4",
      "appraiseGlobalId": "opm_880256085405990912",
      "closeTime": 1499107354000,
      "dicStatus": "1",
      "creatorGlobalId": null,
      "createTime": 1499064154000,
      "modifierGlobalId": null,
      "modifyTime": null,
      "isDeleted": null,
      "dicGlobalTypeName": "运营"
    }
  ]

  const getScore = (v) => {
    let result = {}
    result = _.find(starsInfo, (d) => { return d.dicGlobalType == v})
    return result || {}
  }
  
  
  //评价情况
  const caseRate = {
    title: "评价情况",
    stars: [
      {label: '受援人发起评价：', value: Number(getScore('1').score), content: (getScore('1').score == 0 ? '未评价': dateUtil.convertToDate(getScore('1').modifyTime, 'yyyy-MM-dd hh:mm:ss'))},
      {label: '法律援助人员发起评价：', value: Number(getScore('2').score), content: (getScore('2').score == 0 ? '未评价': dateUtil.convertToDate(getScore('2').modifyTime, 'yyyy-MM-dd hh:mm:ss'))},
      {label: '援助机构发起评价：', value: Number(getScore('3').score), content: (getScore('3').score == 0 ? '未评价': dateUtil.convertToDate(getScore('3').modifyTime, 'yyyy-MM-dd hh:mm:ss'))},
      {label: '运营团队发起评价：', value: Number(getScore('4').score), content: (getScore('4').score == 0 ? '未评价': dateUtil.convertToDate(getScore('4').modifyTime, 'yyyy-MM-dd hh:mm:ss'))},
    ]
  }

  const columns = [
      {
        title: '姓名',
        dataIndex: 'userName',
      },  {
        title: '性别',
        dataIndex: 'dicGenderName',
      }, {
        title: '工作单位',
        dataIndex: 'workUnit',
      }, {
        title: '职业年限',
        dataIndex: 'workeYears',
      },{
        title: '指派方式',
        dataIndex: 'setType',
      }, {
          title: '联系方式',
          dataIndex: 'mobile',
      },{
          title: '截止承办时间',
          dataIndex: 'closeTime',
          render: (text) => {
            return dateUtil.convertToDate(text, 'yyyy-MM-dd hh:mm:ss')
          }
      },{
        title: '擅长领域',
        dataIndex: 'skills'
      }]

  //律师列表+竞价信息
  const bidLawyersWithBidInfo = {
    title: "事项竞价",
    infos : [
      {label: '竞价范围：', value: `${bidInfo.bidMinPrice || ''} - ${bidInfo.bidMaxPrice || ''} 元`},
      {label: '竞价截止时间：', value: dateUtil.convertToDate(bidInfo.closeTime, 'yyyy-MM-dd hh:mm:ss')},
      {label: '参与人数：', value: bidingLawyerList.length}
    ],
    tableProps: {
      columns: [
        {
          title: '姓名',
          dataIndex: 'userName',
        }, {
          title: '性别',
          dataIndex: 'dicGenderName',
        }, {
          title: '工作单位',
          dataIndex: 'workUnit',
        }, {
          title: '职业年限',
          dataIndex: 'workeYears',
        }, {
          title: '联系方式',
          dataIndex: 'mobile',
        }, {
          title: '竞价金额（元）',
          dataIndex: 'price',
        },{
          title: '截止承办时间',
          dataIndex: 'closeTime',
          render: (text) => {
            return dateUtil.convertToDate(text, 'yyyy-MM-dd hh:mm:ss')
          }
        },{
          title: '擅长领域',
          dataIndex: 'skilled'
        }
      ],
      bidingLawyerList: bidingLawyerList
    }
  }
  //律师列表
  const bidLawyers = {
    title: "待法律援助人员确认(受援人指定/援助机构指派)",

    tableProps: {
      columns: columns,
      bidingLawyerList: bidingLawyerList
    }
  }

  const recLawyers = {
    title: "已推荐法律援助人员",
    tableProps: {
      columns: [
        {
          title: '姓名',
          dataIndex: 'userName',
        }, {
          title: '性别',
          dataIndex: 'dicGenderName',
        }, {
          title: '工作单位',
          dataIndex: 'workUnit',
        }, {
          title: '职业年限',
          dataIndex: 'workeYears',
        }, {
          title: '联系方式',
          dataIndex: 'mobile',
        }, {
          title: '竞价金额（元）',
          dataIndex: 'price',
        },{
          title: '擅长领域',
          dataIndex: 'skills',
        }
      ],
      bidingLawyerList: recLawyerInfo
    }
  }

  //法律援助人员待选择律师列表（待受援人指定阶段）
  const toConfLawyers = {
    title: "待法律援助人员确认(受援人指定/援助机构指派)",

    tableProps: {
      columns: columns,
      bidingLawyerList: toConfLawyerList
    }
  }

  //点员律师列表（待受援人指定阶段）
  const rpLawyers = {
    title: "待法律援助人员确认(受援人指定/援助机构指派)",

    tableProps: {
      columns: columns,
      bidingLawyerList: rpLawyerList
    }
  }

  let showType = caseStatusConverter.getShowTypeByStatus(caseStatus)
  
  switch (showType){
      case 1:
          result = (
            <div>
              
            </div>)
          break;
      case 2://待初审, 待复审，不予援助
          result = (<div>
            
          </div>)
          break;
      case 3://待初审，复审-补充材料

          result = (<div>
           {/*<Logcard {...updaterLogData}/>*/}
          </div>)
          break;
      case 4:
          result = (<div>
            
          </div>)
          break;
      case 5://待法律援助人员确定：显示案件信息+援助类型+律师列表
          result = (<div>
           {/* <Logcard {...updaterLogData}/>*/}
          </div>)
          break;
      case 6://竞价中：案件信息+援助类型+竞价事项
          result = (<div>
            
          </div>)
          break;
      case 7://待机构确定法律援助人员：案件信息+援助类型 + 已推荐法律援助人员
          result = (<div>
            {/*<Logcard {...updaterLogData}/>*/}
            <InfoCard {...aidInfoCarfPorps} />
          </div>)
          break;
      case 8://事项监督（承办阶段）：显示案件信息+法律援助人员信息+援助类型
          result = (<div>
            

          </div>)
          break;
      case 9://评价中，评价管理：案件信息+法律援助人员信息+评价情况
          result = (<div>
            
          </div>)
          break;
      case 10://待归档完成：案件信息+法律援助人员信息+结算金额信息
          result = (<div>
            

          </div>)
          break;
      case 15://承办阶段：援助人信息
          result = (<div>
            <InfoCard {...aidInfoCarfPorps} />

          </div>)
          break;
      default: 
          result = (<div></div>)
  }

  return (
    <div className={styles.content}>
      {result}
    </div>
  )
}
/*
<Logcard {...updaterLogData}/>*/

/*ApproveCom.propTypes = {
  label: PropTypes.string,
  children: PropTypes.element.isRequired,
}*/

export default FlowDetail