import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import { Link } from 'dva/router'

const confirm = Modal.confirm

const List = ({ caseStatus, onDeleteItem, onEditItem, isMotion, location, isAdmin, ...tableProps }) => {

  const userObj = JSON.parse(localStorage.getItem('user'))

  const handleMenuClick = (record, key) => {
    if (key === 'edit') {
      onEditItem(record)
    } else if (key === 'delete') {
      confirm({
        title: '确定删除吗?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'seq',
      key: 'seq',
    }, {
      title: '姓名',
      dataIndex: 'fullName',
      key: 'fullName',
    }, {
      title: '联系方式',
      dataIndex: 'mobile',
      key: 'mobile'
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        let sign = userObj.tGlobalId === record.tGlobalId ? 'self' : ''
        return <div>
              {isAdmin === true ?
                <div>
                  {sign === 'self' ?
                    <div>
                      <Button className={styles.tablebtns} type="primary"  onClick={e => handleMenuClick(record, 'edit')} disabled={!isAdmin}>修改</Button>
                      <Button className={styles.tablebtns} type="primary"  onClick={e => handleMenuClick(record, 'delete')} disabled={isAdmin}>删除</Button>
                    </div>
                    :
                    <div>
                      <Button className={styles.tablebtns} type="primary"  onClick={e => handleMenuClick(record, 'edit')} disabled={!isAdmin}>修改</Button>
                      <Button className={styles.tablebtns} type="primary"  onClick={e => handleMenuClick(record, 'delete')} disabled={!isAdmin}>删除</Button>
                    </div>
                  }
                </div>
                :
                <div>
                  <Button className={styles.tablebtns} type="primary"  onClick={e => handleMenuClick(record, 'edit')} disabled={!isAdmin}>修改</Button>
                  <Button className={styles.tablebtns} type="primary"  onClick={e => handleMenuClick(record, 'delete')} disabled={!isAdmin}>删除</Button>
                </div>
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
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default List
