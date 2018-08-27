import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import { Link } from 'dva/router'

const confirm = Modal.confirm

const List = ({ role, caseStatus, isMotion, location, ...tableProps }) => {


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
      key: 'mobile'
    }, {
      title: '所属单位',
      dataIndex: 'workUnit',
      key: 'workUnit',
    }, {
      title: '是否实名认证',
      dataIndex: 'isAuthenticationString',
      key: 'isAuthenticationString',
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
