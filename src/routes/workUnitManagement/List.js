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
      title: '序号',
      dataIndex: 'seq',
      key: 'seq',
      width: 60,
    }, {
      title: '法律服务机构名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '所属区域',
      dataIndex: 'areaCode',
      key: 'areaCode'
    }, {
      title: '负责人',
      dataIndex: 'peopleid',
      key: 'peopleid'
    }, {
      title: '联系方式',
      dataIndex: 'mobile',
      key: 'mobile'
    }, {
      title: '机构类型',
      dataIndex: 'lawfirmType',
      key: 'lawfirmType'
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
