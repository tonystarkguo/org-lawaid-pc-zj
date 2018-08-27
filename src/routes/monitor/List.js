import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { Table, Button } from 'antd'
import styles from './index.less'
import { connect } from 'dva'
import { jsUtil,config } from '../../utils/index'

const List = ({ location, dispatch, pagination, listData, loading }) => {
  const handleClickAttend = (record) => {
    dispatch({
      type: 'monitor/showAttendModal',
      payload: record,
    })
  }
  const handleClickVisit = (record) => {
    dispatch({
      type: 'monitor/showVisitModal',
      payload: record,
    })
  }
  const handleClickStop = (record) => {
    dispatch({
      type: 'monitor/showStopModal',
      payload: record,
    })
  }
  const handleClickView = (record) => {
    dispatch(routerRedux.push(`/lawcase/${record.caseId}`))
  }
  const listProps = {
    dataSource: listData,
    loading,
    pagination,
    location,
    onChange (page) {
      dispatch({
        type: 'monitor/tabelChange',
        payload: page,
      })
    },
  }
  const columns = [{
    title: '序号',
    dataIndex: 'seq',
    key: 'seq',
    render: (text, record, index) => {
      return index + 1
    },
  }, {
    title: '案号',
    dataIndex: 'caseNum',
    key: 'caseNum',
    width:200,
    render:(text,record) => 	{
    	return  <div className={styles.qun}>
          		{record.involveCountCode == 'M' && <img src={config.qun}></img>}{text}
          	</div>
    }
  }, {
    title: '受援人',
    dataIndex: 'rpUserName',
    key: 'rpUserName',
    width:130,
     render:(text) => {
          	return ( 
          	<div>
         <p>{/[^(\(\d+\))]+/.exec(text)}</p>
        <p>{/\(\d+\)/.exec(text)}</p>
    </div>
				)
          }
  }, {
    title: '案由',
    dataIndex: 'reasonName',
    key: 'reasonName',
    render: (text) => {
      return jsUtil.setCaseReason(text)
    },
  }, {
    title: '承办机构',
    dataIndex: 'hpOrgName',
    key: 'hpOrgName',
  }, {
    title: '承办人',
    dataIndex: 'undertakeName',
    key: 'undertakeName',
    width:130,
     render:(text) => {
          	return ( 
          	<div>
         <p>{/[^(\(\d+\))]+/.exec(text)}</p>
        <p>{/\(\d+\)/.exec(text)}</p>
    </div>
				)
          }
  }, {
    title: '案件来源',
    dataIndex: 'dicOriginChannael',
    key: 'dicOriginChannael',
  }, {
    title: '承办状态',
    dataIndex: 'caseStatusName',
    key: 'caseStatusName',
  }, {
    title: '操作',
    key: 'operation',
    render: (text, record) => {
      return (
        <div className={styles.operation}>
          <div>
            {record.caseStatusName === '承办中' &&
              <Button type="primary" className={styles.tablebtns} onClick={e => handleClickAttend(record)}>庭审旁听</Button>
            }
            <Button type="primary" className={styles.tablebtns} onClick={e => handleClickVisit(record)}>受援人回访</Button>
          </div>
          <div>
            <Button type="primary" className={styles.tablebtns} onClick={e => handleClickStop(record)}>终止法律援助</Button>
            <Button type="primary" className={styles.tablebtns} onClick={e => handleClickView(record)}>查看</Button>
          </div>
        </div>
      )
    },
  }]

  return (
    <div className={styles.list}>
      <Table
        {...listProps}
        bordered
        scroll={{ x: 300 }}
        columns={columns}
        simple
        rowKey={(record, index) => index}
      />
    </div>
  )
}

List.propTypes = {
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default connect(({ list }) => ({ list }))(List)
