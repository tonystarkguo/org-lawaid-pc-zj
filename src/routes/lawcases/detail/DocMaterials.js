import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import {
  Form,
  Table,
  Button,
  Select,
  Row,
  Col,
  Icon,
  Upload,
  Switch,
  Modal,
  Progress,
  message,
} from 'antd'
import {createDicNodes} from '../../../utils'
import _ from 'lodash'
import { config, jsUtil } from '../../../utils'

const { api } = config
const FormItem = Form.Item
const DocMaterials = ({
  lawcaseDetail,
  handleDocChange,
  dispatch,
  handleDocRemove,
  updateuploadProgress,
  updateUploadType,
  onBeforeUpload,
  form: {
    getFieldDecorator,
  },
}) => {
  const {allConfig, fileModal, caseBaseInfoData, caseId, docsList=[], curTotalFileList=[]} = lawcaseDetail
  const {dictData} = allConfig
  const {createSelectOption} = createDicNodes
  const fileModify = JSON.parse(localStorage.getItem('fileModify')) || {}
  const {submitBtnLoading} = fileModify
  const handleMenuClick = (record) => {
    updateUploadType(record.tCaseMaterialStorageId)
  }
  let haveUploadedFileList = curTotalFileList && curTotalFileList.filter((item, index) => item.status === 'done')
	const handlePrintClick = (e) => {
	dispatch({
      type: 'lawcaseDetail/showSelectPrintModal',
    })
  }
  const modalProps = {
    visible :  
      curTotalFileList.length == haveUploadedFileList.length ? false : true,
      footer: null, 
      closable: false,
  }
  const getFileListByType = (t) => {
    return _.filter(fileModal.fileList, item => {
      return item.materialType == t
    })
  }
  const uploadProps = {
    action: '/uploadtopri',
    onChange: handleDocChange,
    onRemove: handleDocRemove,
    beforeUpload: (file,fileList) => {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png')
      if (!isJPG) {
        message.error('只能上传jpeg，png格式的图片!');
      }
      updateuploadProgress(fileList)
      return isJPG
    },
    showUploadList: {
      showRemoveIcon: (Number(caseBaseInfoData.caseStatusCode) > 11 ? false: true) 
    },
    showUploadList: {
      showRemoveIcon: false,
    },
    data: () => {
      const dt = new Date().format('yyyyMMdd')
      const lg = new Date().getTime()
      let h = fileModal.fileData
      h.key = 'orm/' + dt + '/' + lg + '_${filename}'
      return h
    },
    // fileList: getFileListByType(1),//fileModal.fileList, disabled: true
  }

  const getRenderFileList = (record) => {
    return fileModal[record.tCaseMaterialStorageId] || []
  }

  const metCols = [
    {
      title: '材料名称',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },{
      title: '材料文件',
      dataIndex: 'meterials',
      key: 'meterials',
      width: 200,
      render: (text, record) => {
        let t = record.key
        let renderFileList = []
        
        return (
          <Row>
            <Col span={12}>
            <Upload {...uploadProps} fileList={getRenderFileList(record)}>
              <Button key={record.tCaseMaterialStorageId} onClick={() => handleMenuClick(record)} disabled={caseBaseInfoData.caseStatusCode=='20' ? submitBtnLoading : !fileModal.finishedUpload}>
                <Icon type="upload" />
                上传
              </Button>
            </Upload>
            </Col>
            <Col span={12}>
            <a target="_blank" href={`${api.baseURL}/print/printView.html?tCaseMaterialStorageId=${record.tCaseMaterialStorageId}`}><Button type="primary">打印</Button></a>
            </Col>
          </Row>
        )
      },
    },
  ]

  const metData = [
    {
      "tCaseMaterialStorageId": 15523,
      "tCaseId": null,
      "tFlowId": null,
      "tFromStorageId": null,
      "dicType": "3",
      "focusPoint": null,
      "dicMateriaStatus": null,
      "tSysFileStorageId": null,
      "dicFileType": "html",
      "name": "法律援助申请表.html",
      "objectKey": "orm\\html\\4107\\法律援助申请表.html",
      "addrUrl": "http://bestone-lawaid-zhj.oss-cn-shenzhen.aliyuncs.com/orm%5Chtml%5C4107%5C%E6%B3%95%E5%BE%8B%E6%8F%B4%E5%8A%A9%E7%94%B3%E8%AF%B7%E8%A1%A8.html?Expires=1504681330&OSSAccessKeyId=LTAIU1NhFmuggxrI&Signature=tXzejo%2BXOKfdcypGKgUHrwkYNMM%3D",
      "objectMda": "F39149959BACC661D4B14FA37C227EED",
      "remark": null,
      "creatorName": null,
      "creatorGolbalId": null,
      "createTime": "2017-09-06",
      "modifierGolbalId": null,
      "modifyTime": "2017-09-06",
      "categorySort": null,
      "dicCategory": null
    },
    {
      "tCaseMaterialStorageId": 623,
      "tCaseId": null,
      "tFlowId": null,
      "tFromStorageId": null,
      "dicType": "3",
      "focusPoint": null,
      "dicMateriaStatus": null,
      "tSysFileStorageId": null,
      "dicFileType": "3",
      "name": "2二",
      "objectKey": "orm/20170829/1503989410469_bg.jpg",
      "addrUrl": "http://bestone-lawaid-zhj.oss-cn-shenzhen.aliyuncs.com/orm/20170829/1503989410469_bg.jpg?Expires=1504681330&OSSAccessKeyId=LTAIU1NhFmuggxrI&Signature=CzfmSl3Y4fTvvq7bVNiPoun3p2s%3D",
      "objectMda": "4C93EDA5635CF4557224928EFEC31071",
      "remark": "测试备注11111111111111111111111111111",
      "creatorName": null,
      "creatorGolbalId": null,
      "createTime": "2017-06-03",
      "modifierGolbalId": null,
      "modifyTime": "2017-06-26",
      "categorySort": 2,
      "dicCategory": "1"
    },
    {
      "tCaseMaterialStorageId": 625,
      "tCaseId": null,
      "tFlowId": null,
      "tFromStorageId": null,
      "dicType": "3",
      "focusPoint": null,
      "dicMateriaStatus": null,
      "tSysFileStorageId": null,
      "dicFileType": "4",
      "name": "材料",
      "objectKey": "orm/20170828/1503911909396_bg.jpg",
      "addrUrl": "http://bestone-lawaid-zhj.oss-cn-shenzhen.aliyuncs.com/orm/20170828/1503911909396_bg.jpg?Expires=1504681330&OSSAccessKeyId=LTAIU1NhFmuggxrI&Signature=YYiMOY%2Bi4zlXTVbkQkQPpVHg2pc%3D",
      "objectMda": "72FD7C36E585C85190D406FB807C6D60",
      "remark": null,
      "creatorName": null,
      "creatorGolbalId": null,
      "createTime": "2017-06-16",
      "modifierGolbalId": null,
      "modifyTime": "2017-06-26",
      "categorySort": 3,
      "dicCategory": "2"
    }
  ]

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 10,
      },
      sm: {
        span: 6,
      },
    },
    wrapperCol: {
      xs: {
        span: 14,
      },
      sm: {
        span: 14,
      },
    },
  }

  return (
    <div>
    <Row type="flex" justify="end" gutter={16}>
	    <Button type="primary" size="large" onClick={handlePrintClick}>
	      一键打印
	    </Button>
		</Row>
      <Form layout="horizontal" className="login-form">
        <Row style={{
        }}>
          <Col span={24}>
            <Table
              bordered
              pagination={false}
              rowKey={record => record.tCaseMaterialStorageId}
              dataSource={docsList}
              columns={metCols}
            />
          </Col>
        </Row>
        {curTotalFileList.length !== 0 && <Modal
         {...modalProps}
        >
          <div>
            {/* <div>共{curTotalFileList.length}项,已经上传{haveUploadedFileList.length}项</div> */}
            {curTotalFileList.map((item, index) => {
              return (
                <div key={index}>
                  <div>{item.fileName}: <Progress percent={item.percent} /> </div>
                  </div>
              )
            })} 
          </div>
        </Modal>}
        <Row></Row>
      </Form>
    </div>
  )
}

DocMaterials.propTypes = {
  form: PropTypes.object.isRequired,
  lawcaseDetail: PropTypes.object,
  handleFileChange: PropTypes.func,
  handleFileRemove: PropTypes.func,
  updateUploadType: PropTypes.func,
  onBeforeUpload: PropTypes.func,
}

export default connect(({ dispatch }) => ({ dispatch }))(Form.create()(DocMaterials))
   