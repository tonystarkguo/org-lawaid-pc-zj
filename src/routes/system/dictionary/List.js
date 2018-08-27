import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import { Link } from 'dva/router'

const confirm = Modal.confirm

const List = ({ role, onAddKey, onDeleteItem, onEditItem, isMotion, location, ...tableProps }) => {

  const handleTableClick = (record, text, key) => {
    if(key === 'updata'){
      onEditItem(record)
    }else if(key === 'delete'){
      confirm({
        title: '确定删除吗?',
        onOk () {
          onDeleteItem(text)
        },
      })
    }else if(key === 'addKey'){
      onAddKey(record)
    }
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'seq',
      key: 'seq',
      width: 64,
      render: (text, record, index) => <div width={24}>{index + 1}</div>
    }, {
      title: '键值',
      dataIndex: 'value',
      key: 'value',
    }, {
      title: '标签',
      dataIndex: 'labelName',
      key: 'labelName'
    }, {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    }, {
      title: '描述',
      dataIndex: 'remark',
      key: 'remark',
    }, {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      width: 250,
      render: (text, record, index) => (
        <div>          
          <Button type="primary" size="small" icon="edit" onClick={e => handleTableClick(record, text, 'updata')}>修改</Button>
          <Button type="primary" size="small" icon="delete" style={{ marginLeft: '5px' }} onClick={e => handleTableClick(record, text, 'delete')}>删除</Button>
          <Button type="primary" size="small" icon="file-add" style={{ marginLeft: '5px' }} onClick={e => handleTableClick(record, text,  'addKey')}>添加键值</Button>
        </div>
      )
    }
  ]
  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true, [styles.motion]: isMotion })}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object
}

export default List
