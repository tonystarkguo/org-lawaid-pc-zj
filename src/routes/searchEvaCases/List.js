import React from 'react'
import { Table, Modal, Button } from 'antd'
import styles from './index.less'
import { routerRedux } from 'dva/router'
import moment from 'moment'
import { jsUtil, config } from '../../utils/index'

const List = ({ ...listProps, update, pagination, dispatch, search }) => {
  const linkJump = (record, type) => {
    dispatch(routerRedux.push({
      pathname: '/searchEvaCases',
      query: {
        ...search,
        id: record.id,
        type,
      },
    }))
  }
    // 列.
  const columns = [{
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    render: (text, record, index) => <span>{(pagination.pageSize * (pagination.current - 1)) + index + 1}</span>,
  }, {
    title: '案件号',
    dataIndex: 'caseNo',
    key: 'caseNo',
    render: (text, record) => {
      return (<div className={styles.qun}>
          {record.involveCountCode == 'M' && <img src={config.qun}></img>}{text}
        </div>)
    },
  }, {
    title: '受援人姓名',
    dataIndex: 'rpName',
    key: 'rpName',
  }, {
    title: '案件类型',
    dataIndex: 'caseTypeName',
    key: 'caseTypeName',
  }, {
      title: '案由',
      dataIndex: 'reasonName',
      key: 'reasonName',
      render: (text) => {
        return jsUtil.setCaseReason(text)
      },
    }, {
      title: '结案时间',
      dataIndex: 'endCaseTime',
      key: 'endCaseTime',
      render: (text, record, index) => {
        let tm = moment.unix(text / 1000).format('YYYY-MM-DD HH:mm:ss')
        return (
                <span>{tm}</span>
        )
      },
    }, {
      title: '质量评估专家姓名',
      dataIndex: 'expertName',
      key: 'expertName',
    }, {
      title: '评估状态',
      dataIndex: 'dicStatusName',
      key: 'dicStatusName',
    }, {
      title: '操作',
      key: 'operation',
      width: 240,
        // TODO.条件判断显示按钮.
      render: (text, record, index) => (
        <div>
            {(record.showDirect == 1) ?
              <Button type="primary" size="small" className={styles.splitbt} onClick={linkJump.bind(this, record, 2)}>直接评估</Button>
            : ''}
          <Button type="primary" size="small" className={styles.splitbt} onClick={linkJump.bind(this, record, 1)}>查看</Button>
            {(record.showReAudit == 1) ?
              <Button type="primary" size="small" className={styles.splitbt} onClick={linkJump.bind(this, record, 3)}>复评</Button>
            : ''}
        </div>
      ),
    }]
    // DOM.
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

export default List
