import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import { Link } from 'dva/router'
import { dateUtil, jsUtil,config } from '../../utils'

const confirm = Modal.confirm

const List = ({ location, ...listProps, onLook, onOpen, onEdit, handleSelect }) => {

  const handleTableClick = (record, key) => {
    if(key === 'fafang'){
      onOpen(record)
    }else if(key === 'chakan'){
      onLook(record)
    }else if(key === 'edit'){
      onEdit(record)
    }
    
  }

  const columns = [{
    title: '序号',
    dataIndex: 'seq',
    key: 'seq',
  }, {
    title: '案号	',
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
    dataIndex: 'rpNameMob',
    key: 'rpNameMob',
    width:140,
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
    dataIndex: 'resonName',
    key: 'resonName',
    render: (text) => {
      return jsUtil.setCaseReason(text)
    },
    width: 200,
  }, {
    title: '承办机构',
    dataIndex: 'hpWorkUnits',
    key: 'hpWorkUnits'
  }, {
    title: '承办人',
    dataIndex: 'hpNameMobs',
    key: 'hpNameMobs',
    width:140,
     render:(text) => {
          	return ( 
          	<div>
         <p>{/[^(\(\d+\))]+/.exec(text)}</p>
        <p>{/\(\d+\)/.exec(text)}</p>
    </div>
				)
          }
  }, {
    title: '补贴标准',
    dataIndex: 'standard',
    key: 'standard',
  }, {
    title: '异地补贴费',
    dataIndex: 'subsidyFee',
    key: 'subsidyFee',
  }, {
    title: '翻译费',
    dataIndex: 'interpretationFee',
    key: 'interpretationFee',
  }, {
    title: '其他费用',
    dataIndex: 'otherFee',
    key: 'otherFee',
  }, {
    title: '其他费用理由',
    dataIndex: 'otherFeeReason',
    key: 'otherFeeReason',
  }, {
    title: '减发',
    dataIndex: 'lessFee',
    key: 'lessFee',
  }, {
    title: '减发理由',
    dataIndex: 'lessFeeReason',
    key: 'lessFeeReason',
  }, {
    title: '实际补贴金额',
    dataIndex: 'settlePrice',
    key: 'settlePrice',
  }, {
    title: '补贴发放状态',
    dataIndex: 'sub',
    key: 'sub',
  }, {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 100,
    render: (text, record) => {
      return (
        <div>
          {
            record.caseStatus === 18 || record.caseStatus == 0 ?
            <div>
              <Button type="primary" onClick={e => handleTableClick(record, 'fafang')}>发放补贴</Button>
              <Button type="primary" className={styles.tablebtns} onClick={e => handleTableClick(record, 'chakan')}>查看案件</Button>
            </div>
            :
            <div>
             <Button type="primary" onClick={e => handleTableClick(record, 'edit')}>编辑补贴</Button>
            <Button type="primary" className={styles.tablebtns} onClick={e => handleTableClick(record, 'chakan')}>查看案件</Button>
            </div>
          }
        </div>
      )
    }
  }]

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let newItem = []
      selectedRows.map(item => {
        newItem.push({
          tCaseId: item.id
        })
      })
      handleSelect(newItem)
    },
  };

  return (
    <div>
      <Table
        {...listProps}
        rowSelection={rowSelection}
        bordered
        scroll={{ x: 1800 }}
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default List
