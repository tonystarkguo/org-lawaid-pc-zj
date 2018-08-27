import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import { routerRedux } from 'dva/router'
import { Link } from 'dva/router'
import dateUtil from '../../utils/dateUtil'
import jsUtil from '../../utils/jsUtil'
import {config} from '../../utils'

const confirm = Modal.confirm

const List = ({ caseStatus, onDeleteItem, onDelete, onViewDetails, onEditItem, onAssignTask, onUpdateItem, location, ...tableProps }) => {
  const listType = location.query && location.query.type || '1'//url参数,用于处理显示不同的额表头
  let isTodoList = true
  if(listType === '0' || listType === '1' || listType === '2' || listType === '3' || listType === '4' || listType === '5' || listType === '6' || listType === '7'){
    isTodoList = true
  }else {
    isTodoList = false
  }

  const userObj = JSON.parse(localStorage.getItem('user'))

  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: '确定删除吗?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const tip = (
    <div>
      <p style={{color:'red',marginBottom:'10px'}}>若案件信息异常，需要删除本案件，请谨慎操作！</p>
      <p>*若删除本案件，相应的案件编号将被释放，后续案件将会优先使用该编号</p>
    </div>
  )
  const handleTableClick = (record, key) => {
    if(key === 'fenpai'){
      onAssignTask(record)
    }else if(key === 'tuidan'){
      /*confirm({
        title: '确定退单吗?',
        onOk () {
          onUpdateItem(record, 'tuidan')
        },
      })*/
      onUpdateItem(record, 'tuidan')
    }else if(key === 'qianshou'){
      /*confirm({
        title: '确定签收吗?',
        onOk () {
          onUpdateItem(record, 'qianshou')
        },
      })*/
      onUpdateItem(record, 'qianshou')
    }else if(key === 'viewDetail'){
      onViewDetails(record)
    }else if(key === 'delete'){
      confirm({
        title: '警告',
        content: tip,
        okText: '删除本案件',
        okType: 'danger',
        cancelText: '不删除',
        onOk() {
          onDelete(record)
        },
        width: 500,
      });
    }
  }
  const baseCols = [
    {
      title: '序号',
      dataIndex: 'seq',
      key: 'seq',
      className: styles.avatar,
      render: (text) => <div alt={'seq'} width={12}>{text}</div>
    }
  ]

  const caseSeq = {
      title: '案件流水号',
      dataIndex: 'caseAcceptNum',
      key: 'caseAcceptNum'//,
      // render: (text, record) => <Link to={`lawcase/${record.id}`}>{text}</Link>,
  }

  const applyer = {
          title: '受援人姓名',
          dataIndex: 'rpUserName',
          key: 'rpUserName'
        }
   const applyerInfo = {
          title: '受援人',
          dataIndex: 'rpNameMob',
          key: 'rpNameMob',
          render:(text) => {
          	return ( 
          	<div>
         <p>{/[^(\(\d+\))]+/.exec(text)}</p>
        <p>{/\(\d+\)/.exec(text)}</p>
        {/*<p>{/\d+/.exec(text)}</p>*/}
    </div>
				)
          }
       }
   const undertake = {
   	title: '承办机构',
   	dataIndex: 'undertakeCompany',
   	key: 'undertakeCompany',
   	width:100
   }
   const reason={
   	title: '案由',
   	dataIndex: 'reasonName',
   	key: 'reasonName',
   	width:100
   }
   const status = {
   	title: '状态',
   	dataIndex: 'caseStatusName',
   	key: 'caseStatusName',
   }
  const caseNum = {
          title: '案件号',
          dataIndex: 'caseNum',
          key: 'caseNum',
          render: (text,record) => {
          	return  <div className={styles.qun}>
          		{record.involveCountCode == 'M' && <img src={config.qun}></img>}{text}
          	</div>
          }
        }
  const rpMobile = {
          title: '联系电话',
          dataIndex: 'rpUserMobile',
          key: 'rpUserMobile'
        }
  const applyTime = {
    title: '申请时间',
    width: 90,
    dataIndex: 'caseCreateDate',
    key: 'caseCreateDate',
    render: (text) => {
      return dateUtil.convertToDate(text, 'yyyy-MM-dd hh:mm:ss')
    }
  }
  
  const undertakeName = {
    title: '承办人',
    dataIndex: 'undertakeName',
    key: 'undertakeName',
  }
  const caseType = {
          title: '案件类型',
          dataIndex: 'caseTypeName',
          key: 'caseTypeName'
        }
  const comeFrom = {
          title: '法律援助类型',
          dataIndex: 'dicOriginChannael',
          key: 'dicOriginChannael'
        }
  const undertakePeople = {
  	title: '承办人',
  	dataIndex: 'hpNameMobs',
  	key: 'hpNameMobs',
  	 render:(text) => {
          	return ( 
          	<div>
         <p>{/[^(\(\d+\))]+/.exec(text)}</p>
        <p>{/\(\d+\)/.exec(text)}</p>
    </div>
				)
          }
  }
  const lastUpdateTime = {
          title: '最后操作时间',
          dataIndex: 'lastModifyDate',
          key: 'lastModifyDate',
          render: (text) => {
            return dateUtil.convertToDate(text, 'yyyy-MM-dd hh:mm:ss')
          }
        }
  const lawaidType = {
          title: '援助方式',
          dataIndex: 'caseAidWayName',
          key: 'caseAidWay'
        }
  const curUndertakeStage = {
          title: '当前承办阶段',
          dataIndex: 'currentStep',
          key: 'currentStep'
        }
  const archieveTime = {
          title: '归档时间',
          dataIndex: 'archieveTime',
          key: 'archieveTime'
        }
  const caseStatusName = {
          title: '案件状态',
          dataIndex: 'dicCaseStatusParent',
          key: 'dicCaseStatusParent'
        }
  const lastUpdater = {
          title: '最后操作人',
          dataIndex: 'lastModifyBy',
          key: 'lastModifyBy'
        }
  const signName = {
    title: '签收人',
    dataIndex: 'singName',
    key: 'singName'
  }   
  
  const actions = {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return <div>
                {(record.isSign === '0' && isTodoList ? <Button className={styles.tablebtns} type="primary" onClick={e => handleTableClick(record, 'qianshou')}>签收</Button> : '')}
                {(record.isSign === '1' && isTodoList ? <Button className={styles.tablebtns} type="primary" onClick={e => handleTableClick(record, 'tuidan')}>退单</Button> : '')}
                {record.isSign == '1' ? <Button className={styles.tablebtns} type="primary"  onClick={e => handleTableClick(record, 'viewDetail')}>{listType==='7'?'归档': '进入处理'}</Button> : ''}
              </div>
      }
    }

  const viewDetailBtn = {
      title: '操作',
      key: 'operation',
      width: 90,
      render: (text, record) => {
        return <div>
                <Button className={styles.tablebtns} type="primary"  onClick={e => handleTableClick(record, 'viewDetail')}>查看</Button>
                {

                  userObj.roles[0].isAdmin && (record.caseStatusValue >= 13 || record.caseStatusValue == '0') && (record.orgId == userObj.tOrgId || userObj.ormOrgIdDto.childrenIds.indexOf(record.orgId)) ?
                  <Button className={styles.tablebtns} type="danger"  onClick={e => handleTableClick(record, 'delete')}>删除</Button> : ''
                }
              </div>
      }
    }

  let tableHeaders = [];
  switch(listType){
    case '0': //首页进来的待办列表
      tableHeaders = [...baseCols, caseNum, applyer, rpMobile, caseType, comeFrom, applyTime,status, actions];
      break;
    case '1': //线上检查
      tableHeaders = [...baseCols, caseNum, applyer, rpMobile, caseType, comeFrom, applyTime, actions];
      break;
    case '2': //发起竞价
      tableHeaders = [...baseCols,caseNum, applyer, rpMobile, caseType, comeFrom, applyTime, actions];
      break;
    case '3': //推荐法律援助人员
      tableHeaders = [...baseCols,caseNum, applyer, rpMobile, caseType, comeFrom, applyTime, actions];
      break;
    case '4': //评价管理
      tableHeaders = [...baseCols,caseNum, applyer, rpMobile, caseType, comeFrom, applyTime, actions];
      break;
    case '5': //发起归档
      tableHeaders = [...baseCols,caseNum, applyer, rpMobile, caseType, comeFrom, applyTime, actions];
      break;
    case '6': //待初审
      tableHeaders = [...baseCols,caseNum, applyer, rpMobile, caseType, comeFrom, applyTime, actions];
      break;
    case '7': //待复审
      tableHeaders = [...baseCols,caseNum, applyerInfo, comeFrom,reason, undertakePeople,undertake, actions];
      break;
    case '8': //待补充材料
      tableHeaders = [...baseCols,caseNum, applyer, rpMobile, caseType, comeFrom, applyTime, actions];
      break;
    case '9': //待指派
      tableHeaders = [...baseCols,caseNum, applyer, rpMobile, caseType, comeFrom, applyTime, actions];
      break;
    case '10': //案件查询
      tableHeaders = [...baseCols, caseNum, applyerInfo, caseType, reason, applyTime, status, signName, undertake, undertakeName, viewDetailBtn];
      break;
    case '11': //案件监督
      tableHeaders = [...baseCols, caseNum, applyer, rpMobile, caseType, comeFrom, applyTime, viewDetailBtn];
      break;
    default: 
      tableHeaders = [...baseCols, caseNum, applyer, rpMobile, caseType, comeFrom, applyTime, viewDetailBtn];
  }

  // tableHeaders = [...baseCols, applyer, applyOrg, caseType, belongsTo, actions];
  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true, [styles.motion]: false })}
        bordered
        scroll={{ x: 680 }}
        columns={tableHeaders}
        simple
        rowKey={record => record.seq}
      />
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
