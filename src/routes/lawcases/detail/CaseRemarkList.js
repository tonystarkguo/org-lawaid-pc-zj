import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button } from 'antd'
import styles from './index.less'
import classnames from 'classnames'
import dateUtil from '../../../utils/dateUtil'

const confirm = Modal.confirm

const CaseRemarkList = ({ isMotion, location, ...tableProps }) => {
  
    const columns = [{
      title: '序号',
      dataIndex: 'seq',
      key: 'seq',
      width: '60px'
    }, {
      title: '备注人',
      dataIndex: 'fullName',
      key: 'fullName',
      width: '120px'
    }, {
      title: '备注时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: '200px',
      render: (text) => {
        return dateUtil.convertToDate(text, 'yyyy-MM-dd hh:mm:ss')
      }
    }, {
      title: '备注内容',
      dataIndex: 'remark',
      key: 'remark',
    }
  ];

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

CaseRemarkList.propTypes = {
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default CaseRemarkList

