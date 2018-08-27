import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import { Link } from 'dva/router'
import { dateUtil, jsUtil } from '../../utils'

const confirm = Modal.confirm

const List = ({ location, ...listProps, onViewDetails, onSign, onReply, onBack }) => {

  let tGlobalId = JSON.parse(localStorage.getItem('user')).tGlobalId
  let tOrgId = JSON.parse(localStorage.getItem('user')).tOrgId

  const handleTableClick = (record, key) => {
    if(key === 'tuidan'){
      confirm({
        title: '确定退单吗?',
        onOk () {
          onBack(record)
        },
      })
    }else if(key === 'qianshou'){
      confirm({
        title: '确定签收吗?',
        onOk () {
          onSign(record)
        },
      })
    }else if(key === 'viewDetail'){
      onViewDetails(record)
    }else if(key === 'reply'){
      onReply(record)
    }
  }

  const columns = [{
    title: '咨询ID',
    dataIndex: 'consultNumber',
    key: 'consultNumber',
  }, {
    title: '咨询人姓名',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '性别',
    dataIndex: 'dicGenderValue',
    key: 'dicGenderValue'
  }, {
    title: '手机号码',
    dataIndex: 'mobile',
    key: 'mobile'
  }, {
    title: '咨询日期',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 90,
    render: (text) => {
      return dateUtil.convertToDate(text, 'yyyy-MM-dd hh:mm:ss')
    }
  }, {
    title: '来源',
    dataIndex: 'dicSourceValue',
    key: 'dicSourceValue',
  }, {
    title: '所属中心',
    dataIndex: 'orgName',
    key: 'orgName',
    width: 100,
  }, {
    title: '解答人',
    dataIndex: 'answerGlobalName',
    key: 'answerGlobalName',
  }, {
    title: '签收人',
    dataIndex: 'signName',
    key: 'signName',
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  }, {
    title: '操作',
    key: 'operation',
    render: (text, record) => {

      return <div>
              {
                record.tOrgId == tOrgId ?
                <div>
                  {
                     record.sign.dicStatus == '1'  ?
                    <Button type="primary" onClick={e => handleTableClick(record, 'qianshou')}>签收</Button> : ''
                  }
                  {
                    record.sign.dicStatus == '2' && record.isSubmit == false && record.sign.signGlobalId == tGlobalId ?
                    <div>
                      <Button type="primary" className={styles.tablebtns} onClick={e => handleTableClick(record, 'reply')}>回复</Button>
                      <Button type="primary" className={styles.tablebtns} onClick={e => handleTableClick(record, 'tuidan')}>退单</Button>
                    </div> : ''
                  }
                  {
                    record.sign.dicStatus == '2' && record.isSubmit == true && record.sign.signGlobalId == tGlobalId ?
                    <Button type="primary" onClick={e => handleTableClick(record, 'viewDetail')}>查看</Button> : ''
                  }
                  {
                    record.sign.dicStatus == '2' && record.isSubmit == false && record.sign.signGlobalId != tGlobalId ?
                    <Button type="primary" onClick={e => handleTableClick(record, 'viewDetail')}>查看</Button> : ''
                  }
                  {
                    record.sign.dicStatus == '2' && record.isSubmit == true && record.sign.signGlobalId != tGlobalId ?
                    <Button type="primary" onClick={e => handleTableClick(record, 'viewDetail')}>查看</Button> : ''
                  }
                </div>
                :
                <Button type="primary" onClick={e => handleTableClick(record, 'viewDetail')}>查看</Button>
              }
            </div>
    }
  }]

  return (
    <div>
      <Table
        {...listProps}
        bordered
        scroll={{ x: 700 }}
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
