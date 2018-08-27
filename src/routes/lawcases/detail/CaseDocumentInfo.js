import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'
import {Upload, Table, Form, Input, Select, Button, message, Row, Col, Spin, Switch, Icon} from 'antd'
const FormItem = Form.Item
import { config } from '../../../utils'

const { api } = config

const CaseDocumentInfo = ({ lawcaseDetail,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  }}) => {

  const { docsList, caseId } = lawcaseDetail

  // { caseId &&
  //   record.isGenerative == 1 ?
  //   <a target="_blank" href={`${api.baseURL}${api.createDocsUrl}/${record.generativeFunction}?defaultFileAddr=${record.defaultFileAddr}&materialName=${record.materialName}&tCaseId=${caseId}`}><Button className={styles.tablebtns} type="primary">生成文书下载</Button></a>
  //   : ''
  // }
  // <a target="_blank" href={`${api.baseURL}${api.downloadDocsUrl}?defaultFileAddr=${record.defaultFileAddr}&materialName=${record.materialName}&tCaseId=${caseId}`}><Button className={styles.tablebtns} type="primary">空白模版下载</Button></a>


	const columns = [{
      title: '文书名称',
      dataIndex: 'materialName',
      key: 'materialName',
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return <div>
          { caseId &&
            record.isGenerative == 1 ?
            <a target="_blank" href={`${api.baseURL}/print/printView.html?tCaseMaterialStorageId=${record.tCaseMaterialStorageId}`}><Button className={styles.tablebtns} type="primary">打印</Button></a>
            : ''
          }
          <a target="_blank" href={`${api.baseURL}${api.downloadDocsUrl}?defaultFileAddr=${record.defaultFileAddr}&materialName=${record.materialName}&tCaseId=${caseId}`}><Button className={styles.tablebtns} type="primary">空白模版下载</Button></a>
        </div>
      }
    }
  ];

  return (
    <div>
        <Row style={{padding: 20}}>
            <Col span={24}>
              <Table pagination = {false} rowKey={record => record.materialName} dataSource={docsList} columns={columns} />
            </Col>
        </Row>
    </div>
  )
}

CaseDocumentInfo.propTypes = {
  lawcaseDetail: PropTypes.object,
  loading: PropTypes.bool,
  form: PropTypes.object.isRequired
}

export default Form.create()(CaseDocumentInfo)

