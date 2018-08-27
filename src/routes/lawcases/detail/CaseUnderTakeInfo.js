import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'
import {Upload, Table, Form, Input, Select, Button, message, Row, Col, Spin, Switch, Icon} from 'antd'
const FormItem = Form.Item

const CaseUnderTakeInfo = ({ lawcaseDetail,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  }}) => {

  const {tabLoading, CaseMaterialFile, SuppMaterial, caseStatus } = lawcaseDetail

  // 发起归档
  const undertakeFile = CaseMaterialFile["4"]//承办材料

  let arr = []

  for(let i in undertakeFile){
    let obj = {}
    let addrUrls = []
    if(undertakeFile[i].length == 1){
      obj = {
        name: undertakeFile[i][0].name,
        createTime: undertakeFile[i][0].createTime,
        addrUrl: undertakeFile[i][0].addrUrl.split(","),
        creatorGolbalId: undertakeFile[i][0].creatorGolbalId,
        modifierGolbalId: undertakeFile[i][0].modifierGolbalId,
        tCaseId: undertakeFile[i][0].tCaseId,
        tCaseMaterialStorageId: undertakeFile[i][0].tCaseMaterialStorageId,
        tFlowId: undertakeFile[i][0].tFlowId,
        tFromStorageId: undertakeFile[i][0].tFromStorageId,
        tSysFileStorageId: undertakeFile[i][0].tSysFileStorageId,
      }
      arr.push(obj)
    }else{
      undertakeFile[i].map(val => {
        addrUrls.push(val.addrUrl)
        obj = {
          name: val.name,
          createTime: val.createTime,
          addrUrl: addrUrls,
          creatorGolbalId: val.creatorGolbalId,
          modifierGolbalId: val.modifierGolbalId,
          tCaseId: val.tCaseId,
          tCaseMaterialStorageId: val.tCaseMaterialStorageId,
          tFlowId: val.tFlowId,
          tFromStorageId: val.tFromStorageId,
          tSysFileStorageId: val.tSysFileStorageId,
        }
      })
      arr.push(obj)
    }
  }

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
        return text.length == 1 ? <a target="_blank" href={text}>{item.name}</a> : (text.map((d,index) => <div key={index}><a target="_blank" href={d}>{item.name}</a></div>))
      }
    }
  ];

  return (
  	<div>
			{caseStatus == '1' ?
				<Spin spinning={tabLoading} >
					<Row style={{padding: 20}}>
			        <Col span={24}>
			          <Table pagination = {false} rowKey={record => record.tSysFileStorageId} dataSource={null} columns={columns} />
			        </Col>
			    </Row>
		    </Spin>
		    :
    		<Spin spinning={tabLoading} >
    			<Row style={{padding: 20}}>
    	        <Col span={24}>
    	          <Table pagination = {false} rowKey={record => record.tSysFileStorageId} dataSource={arr} columns={columns} />
    	        </Col>
    	    </Row>
        </Spin>
			}
  	</div>
  )

}

CaseUnderTakeInfo.propTypes = {
  lawcaseDetail: PropTypes.object,
  loading: PropTypes.bool,
  form: PropTypes.object.isRequired
}

export default Form.create()(CaseUnderTakeInfo)
