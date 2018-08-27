import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import { Link } from 'dva/router'
import dateUtil from '../../utils/dateUtil'

const confirm = Modal.confirm

const List = ({ isMotion, location, ...tableProps }) => {

  const handleCancel = (record) => {
    console.log(record)
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'seq',
      key: 'seq',
      width: 64
    }, {
      title: '援助机构',
      dataIndex: 'orgName',
      key: 'orgName'
    }, {
      title: '预约号',
      dataIndex: 'resvNum',
      key: 'resvNum'
    }, {
      title: '预约人',
      dataIndex: 'contactName',
      key: 'contactName'
    }, {
      title: '电话',
      dataIndex: 'contactMobile',
      key: 'contactMobile'
    }, {
      title: '预约时间',
      dataIndex: 'resvTime',
      key: 'resvTime',
      render: (text) => {
        return dateUtil.convertToDate(text, 'yyyy-MM-dd hh:mm:ss')
      }
    }, {
      title: '预约状态',
      dataIndex: 'dicStatusName',
      key: 'dicStatusName',
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return <div>
                {
                  record.dicStatusName === '正常' ?
                  <Button type="primary"  onClick={handleCancel(record)} >撤销</Button>
                  :
                  <Button type="primary"  disabled>撤销</Button>
                }
              </div>
      }
    }
  ]

  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true, [styles.motion]: isMotion })}
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
