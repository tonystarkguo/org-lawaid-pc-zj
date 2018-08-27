import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Modal } from 'antd'
import styles from './List.less'

const confirm = Modal.confirm

const List = ({ onBackItem, onDeleteItem, onEditItem, location, ...listProps }) => {

  const handleMenuClick = (record, key) => {
    if (key === 'huifu') {
      onBackItem(record)
    }else if(key === 'edit'){
      onEditItem(record)
    }else if (key === 'delete') {
      confirm({
        title: '确定删除吗?',
        onOk () {
          onDeleteItem(record)
        },
      })
    }
  }

  const columns = [{
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width:100
    },{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100
    }, {
      title: '性别',
      dataIndex: 'dicGenderValue',
      key: 'dicGenderValue'
    }, {
      title: '手机号码',
      dataIndex: 'mobile',
      key: 'mobile',
      width: 105
    }, {
      title: '出生地',
      dataIndex: 'bitrhArea',
      key: 'bitrhArea' ,
      width: 100
    },{
    	title: '工作单位',
    	dataIndex: 'lawfirmName',
    	key: 'lawfirmName',
    	width: 100
    },{
      title: '工作区域',
      dataIndex: 'areaCode',
      key: 'areaCode' ,
      width: 100
    }, {
      title: '业务专长',
      dataIndex: 'goodFields',
      key: 'goodFields',
      width: 100,
    }, {
      title: '执业年限',
      dataIndex: 'workingYears',
      key: 'workingYears'
    }, {
      title: '身份',
      dataIndex: 'dicLawyerTypeValue',
      key: 'dicLawyerTypeValue'
    }, {
      title: '语种',
      dataIndex: 'goodLanguages',
      key: 'goodLanguages',
      width: 50
    }, {
      title: '获得荣誉',
      dataIndex: 'gloryMemo',
      key: 'gloryMemo',
      width: 200
    }, {
      title: '是否获得行政或纪律处分',
      dataIndex: 'punishmentDetail',
      key: 'punishmentDetail'
    }, {
      title: '状态',
      dataIndex: 'isDeleted',
      key: 'isDeleted'
    }, {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 50,
      render: (text, record) => {
        return <div>
                  {
                    record.isDeleted === '未删除' ?
                    <div>
                      <Button className={styles.tablebtns} type="primary"  onClick={e => handleMenuClick(record, 'edit')}>编辑</Button>
                      {/* <Button className={styles.tablebtns} type="primary"  onClick={e => handleMenuClick(record, 'delete')}>删除</Button> */}
                    </div>
                    :
                    <Button className={styles.tablebtns} type="primary"  onClick={e => handleMenuClick(record, 'huifu')}>恢复</Button>
                  }
                </div>
      }
    }]
  
  return (
    <div>
      <Table
        {...listProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1500 }}
        rowKey={record => record.seq}
      />
    </div>
  )
}

List.propTypes = {
  onBackItem: PropTypes.func,
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
