import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'
import {Upload, Table, Form, Input, Select, Button, message, Row, Col, Spin, Switch, Icon} from 'antd'
import FileModal from './FileModal'
const FormItem = Form.Item

const CaseIdentityInfo = ({ 
  lawcaseDetail,
  showFileModal,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  }}) => {

  const {tabLoading, CaseMaterialFile, SuppMaterial, caseStatus} = lawcaseDetail

  const identityFile = CaseMaterialFile["1"] || {}//身份证明材料
  const identityMaterial = SuppMaterial["1"] || {}//身份证明材料

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
      <Button onClick={showFileModal}>btn</Button>
      <FileModal ></FileModal>
			{caseStatus == '1' ?
				<Spin spinning={tabLoading} >
					<Row style={{padding: 20}}>
			        <Col span={24}>
			          <Table pagination = {false} rowKey={record => record.tSysFileStorageId} dataSource={identityMaterial} columns={columns} />
			        </Col>
			    </Row>
		    </Spin>
		    :
    		<Spin spinning={tabLoading} >
    			<Row style={{padding: 20}}>
    	        <Col span={24}>
    	          <Table pagination = {false} rowKey={record => record.tSysFileStorageId} dataSource={identityFile} columns={columns} />
    	        </Col>
    	    </Row>
        </Spin>
			}
  	</div>
  )

}

CaseIdentityInfo.propTypes = {
  lawcaseDetail: PropTypes.object,
  loading: PropTypes.bool,
  form: PropTypes.object.isRequired
}

export default Form.create()(CaseIdentityInfo)
