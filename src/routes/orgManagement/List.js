import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Modal } from 'antd'
import styles from './List.less'

const confirm = Modal.confirm

const List = ({ onEditItem, onDeleteItem, location, ...listProps }) => {

  const handleMenuClick = (record, key) => {
    if (key === 'edit') {
      onEditItem(record)
    } else if (key === 'delete') {
      confirm({
        title: '确定删除吗?',
        onOk () {
          onDeleteItem(record)
        },
      })
    }
  }

  const columns = [
    {
      title: '机构ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    }, {
      title: '工作站名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '级别',
      dataIndex: 'dicBelongAreaName',
      key: 'dicBelongAreaName'
    }, {
      title: '行政区域',
      dataIndex: 'addr',
      key: 'addr'
    }, {
      title: '地址',
      dataIndex: 'address',
      key: 'address'
    }, {
      title: '电话',
      dataIndex: 'telephone',
      key: 'telephone'
    }, {
      title: '负责人',
      dataIndex: 'orgResp',
      key: 'orgResp'
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return <div>
                  <Button className={styles.tablebtns} type="primary"  onClick={e => handleMenuClick(record, 'edit')}>编辑</Button>
                  {/* <Button className={styles.tablebtns} type="primary"  onClick={e => handleMenuClick(record, 'delete')}>删除</Button> */}
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
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
