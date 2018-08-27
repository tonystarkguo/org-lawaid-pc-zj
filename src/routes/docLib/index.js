import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { Table, Button, Row, Col } from 'antd'
import { config } from '../../utils'
const { api } = config
const DocLib = ({
  docLib,
  dispatch
}) => {
  const { docsList } = docLib
  const columns = [{
      title: '文书模板',
      dataIndex: 'materialName',
      key: 'materialName',
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return <div>
                  <a style={{marginRight: 10}} target="_blank" href={`${api.baseURL}${api.downloadDocsUrl}?defaultFileAddr=${record.defaultFileAddr}&materialName=${record.materialName}`}><Button className={styles.tablebtns} type="primary">下载</Button></a>
                  <a target="_blank" href={`${api.baseURL}/print/printView.html?defaultFileAddr=${record.defaultFileAddr}`}><Button type="primary">打印</Button></a>
                </div>
      }
    }
  ];
  return (
    <div className="content-inner">
      <Table pagination = {false} title={()=> '文书模板列表'} bordered rowKey={record => record.materialName} dataSource={docsList} columns={columns} />
    </div>
  )
}

export default connect(({ docLib }) => ({ docLib }))(DocLib)
