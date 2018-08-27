import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import { Link } from 'dva/router'

const confirm = Modal.confirm

const List = ({ role, caseStatus, location, ...tableProps }) => {

  const columns = [
    {
      title: '序号',
      dataIndex: 'seq',
      key: 'seq',
      width: 64,
      render: (text) => <div alt={'seq'} width={24}>{text}</div>
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '联系电话',
      dataIndex: 'mobile',
      key: 'mobile',
    }, {
      title: '所属单位',
      dataIndex: 'workUnit',
      key: 'workUnit',
    }, {
      title: '身份信息',
      dataIndex: 'hpIdentitysString',
      key: 'hpIdentitysString',
    }
  ]

  return (
    <div>
      <Table
        {...tableProps}
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
  location: PropTypes.object,
}

export default List
