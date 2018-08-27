import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'
import {Upload, Table, Form, Input, Select, Button, message, Row, Col, Spin, Switch, Icon} from 'antd'
const FormItem = Form.Item

const CaseMeterialInfo = ({ lawcaseDetail,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  }}) => {

  const {tabLoading, CaseMaterialFile, SuppMaterial, caseStatus} = lawcaseDetail

 	const caseStepFile = CaseMaterialFile["2"]//援助事项材料
  const caseStepMaterial = SuppMaterial["2"]//援助事项材料

	const columns = [{
      title: '应上传材料',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '上传人',
      dataIndex: 'creatorGolbalId',
      key: 'creatorGolbalId',
    }, {
      title: '上传时间',
      dataIndex: 'createTime',
      key: 'createTime',
    }, {
      title: '法律援助人员已上传材料',
      dataIndex: 'addrUrl',
      key: 'addrUrl',
      render: (text, item) => {
      	return <a target="_blank" href={text}>{item.name}</a>
      }
    }
  ];

  return (
  	<div>
			{caseStatus == '1' ?
				<Spin spinning={tabLoading} >
					<Row style={{padding: 20}}>
			        <Col span={24}>
			          <Table pagination = {false} rowKey={record => record.tSysFileStorageId} dataSource={caseStepMaterial} columns={columns} />
			        </Col>
			    </Row>
		    </Spin>
		    :
    		<Spin spinning={tabLoading} >
    			<Row style={{padding: 20}}>
    	        <Col span={24}>
    	          <Table pagination = {false} rowKey={record => record.tSysFileStorageId} dataSource={caseStepFile} columns={columns} />
    	        </Col>
    	    </Row>
        </Spin>
			}
  	</div>
  )
}

CaseMeterialInfo.propTypes = {
  lawcaseDetail: PropTypes.object,
  loading: PropTypes.bool,
  form: PropTypes.object.isRequired
}

export default Form.create()(CaseMeterialInfo)

