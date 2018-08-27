import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import { Link } from 'dva/router'
import dateUtil from '../../utils/dateUtil'
import { jsUtil } from '../../utils/index'

const confirm = Modal.confirm

const List = ({ location, ...listProps }) => {

  const handleCancel = (record) => {
    console.log(record)
  }

  const columns = [
    {
      title: '咨询ID',
      dataIndex: 'seq',
      key: 'seq',
      width: 64
    }, {
      title: '咨询人姓名',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex'
    }, {
      title: '手机号码',
      dataIndex: 'phone',
      key: 'phone'
    }, {
      title: '咨询日期',
      dataIndex: 'date',
      key: 'date',
      render: (text) => {
        return dateUtil.convertToDate(text, 'yyyy-MM-dd hh:mm:ss')
      }
    }, {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
    }, {
      title: '案由',
      dataIndex: 'brief',
      key: 'brief',
      render: (text) => {
        return jsUtil.setCaseReason(text)
      },
    }, {
      title: '解答人',
      dataIndex: 'respondent',
      key: 'respondent',
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return <div>
                <Button type="primary"  className={styles.tablebtns} onClick={e => handleCancel(record)} >公开</Button>
                <Button type="primary"  className={styles.tablebtns} onClick={e => handleCancel(record)} >不公开</Button>
              </div>
      }
    }
  ]

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
