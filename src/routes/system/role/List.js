import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import { Link } from 'dva/router'
import dateUtil from '../../../utils/dateUtil'

const confirm = Modal.confirm

const List = ({ isMotion, location, onEditItem, onDeleteItem, ...tableProps }) => {

  const handleModify = (item) => {
    onEditItem(item)
  }

  const handleDelete = (item) => {
    confirm({
      title: '删除',
      content: `是否确认删除角色 “${item.name}”？`,
      onOk() {
        onDeleteItem(item.id)
      },
      onCancel() {
        return
      },
    })
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'seq',
      key: 'seq',
      width: 64
    }, {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '描述',
      dataIndex: 'remark',
      key: 'remark'
    }, {
      title: '操作',
      key: 'operation',
      width: 300,
      render: (text, record) => {
        return <div>
                <Button type="primary" onClick={(e) => handleModify(record)}>修改</Button>
                <Button type="primary" onClick={(e) => handleDelete(record)} style={{marginLeft:'20px'}}>删除</Button>
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
