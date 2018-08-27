import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Modal } from 'antd'
import styles from './List.less'
import dateUtil from '../../utils/dateUtil'

const confirm = Modal.confirm

const List = ({ onEditItem, onDeleteItem, location, receiveSms, ...listProps }) => {

  const userInfo = JSON.parse(localStorage.getItem('user')) || {}
  const isMgr = userInfo.roles[0].isAdmin 
  
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
  const HandleMsgClick = (record) => {
    
    if (!record.isSms) {
      confirm({
        title: `是否确认让“${record.name}”接收短信？`,
        onOk () {
          receiveSms(record)
        },
      })
    } else {
      confirm({
        title: `是否取消“${record.name}”接收短信`,
        onOk () {
          receiveSms(record)
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
      title: '人员编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 80,
    }, {
      title: '性别',
      dataIndex: 'dicGenderName',
      key: 'dicGenderName',
      width: 50,
    }, {
      title: '所属机构',
      dataIndex: 'orgName',
      key: 'orgName',
      width: 120,
    }, {
      title: '法援年限',
      dataIndex: 'workYear',
      key: 'workYear',
      width: 100,
    }, {
      title: '政治面貌',
      dataIndex: 'dicPoliticalStatusName',
      key: 'dicPoliticalStatusName',
      width: 100,
    }, {
      title: '学历',
      dataIndex: 'dicEduLevelName',
      key: 'dicEduLevelName',
      width: 50,
    }, {
      title: '学校和专业',
      dataIndex: 'graduationSchool',
      key: 'graduationSchool',
      width: 120,
    }, {
      title: '民族',
      dataIndex: 'dicNationName',
      key: 'dicNationName',
      width: 50,
    }, {
      title: '任职日期',
      dataIndex: 'takeOfficeDate',
      key: 'takeOfficeDate',
      width: 120,
      render: (text) => {
        return dateUtil.convertToDate(text, 'yyyy-MM-dd')
      }
    }, {
      title: '职位',
      dataIndex: 'duties',
      key: 'duties',
      width: 60,
    }, {
      title: '状态',
      dataIndex: 'isDeleted',
      key: 'isDeleted',
      width: 60,
    }, {
      title: '操作',
      key: 'operation',
      width: 50,
      fixed: 'right',
      render: (text, record) => {
        return (
          <div>
            <Button className={styles.tablebtns} type="primary" onClick={e => handleMenuClick(record, 'edit')}>编辑</Button>
            {/* <Button className={styles.tablebtns} type="primary"  onClick={e => handleMenuClick(record, 'delete')}>删除</Button> */}
            {((!record.roles[0].isAdmin) && isMgr) && <Button type="primary" onClick={e => HandleMsgClick(record)}>{record.isSms ? '取消接收短信' : '接收短信'}</Button>}
         
          </div>
        )
      }
    }
  ]
  
  return (
    <div>
      <Table
        {...listProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1000 }}
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  onEditItem: PropTypes.func,
  onDeleteItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
