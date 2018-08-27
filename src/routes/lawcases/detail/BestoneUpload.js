import React from 'react'
import PropTypes from 'prop-types'
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
import {createDicNodes, config} from '../../../utils'
import _ from 'lodash'
const {api} = config
const FormItem = Form.Item
const BestoneUpload = ({
  lawcaseDetail,
  handleFileChange,
  dispatch,
  handleUpadateFileKey,
  updateuploadProgress,
  handleFileRemove,
  updateUploadType,
  onBeforeUpload,
  form: {
    getFieldDecorator,
  },
}) => {
  const {allConfig, fileModal, caseBaseInfoData, curTotalFileList=[]} = lawcaseDetail
  const {dictData} = allConfig
  const {createSelectOption} = createDicNodes
  let haveUploadedFileList = curTotalFileList && curTotalFileList.filter((item, index) => item.status === 'done')
  const handleMenuClick = (record) => {
    updateUploadType(record.key)
  }

  const getFileListByType = (t) => {
    return _.filter(fileModal.fileList, item => {
      return item.materialType == t
    })
  }
  const modalProps = {
    visible :  
      curTotalFileList.length == haveUploadedFileList.length ? false : true,
      footer: null, 
      closable: false,
  }

  const uploadProps = {
    action: '/uploadtopri',
    onChange: handleFileChange,
    onRemove: handleFileRemove,
    multiple: true,
    beforeUpload: (file,fileList) => {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png')
      if (!isJPG) {
        message.error('只能上传jpeg，png格式的图片!');
      }
      updateuploadProgress(fileList)
      return isJPG
    },
    data: (file) => {
      const dt = new Date().format('yyyyMMdd')
      const lg = new Date().getTime()
      let h = fileModal.fileData
      h.key = 'orm/' + dt + '/' + lg + '_${filename}'
       let o = {}
      o[file.uid] = `orm/${dt}/${lg}_${file.name}`
      handleUpadateFileKey(o)
      return h
    },
    // fileList: getFileListByType(1),//fileModal.fileList, disabled: true
  }
  const token = localStorage.getItem('token') || ''
  const metCols = [
    {
      title: '材料名称',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      render: (text, record) => {
        let t = record.key
        let renderText
        if (t === 1 && caseBaseInfoData.lawAidType && caseBaseInfoData.lawAidType[0] === '2') {
          renderText = <div><Button type="primary" size="small">
              <a target="_blank" href={`${api.baseURL}/print/printView.html?defaultFileAddr=法律援助申请表.doc`}>
                <Icon type="printer" />打印申请表模板
              </a>
            </Button> 
            <div>{text}</div>
            </div>
        } else {
          renderText = text
        }
        return renderText
      },
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 200,
    }, {
      title: '材料文件',
      dataIndex: 'meterials',
      key: 'meterials',
      width: 200,
      render: (text, record) => {
        let t = record.key
        let renderFileList = []
        if (t === 1) {
          renderFileList = fileModal.identifyFileList
        } else if (t === 5) {
          renderFileList = fileModal.homeFinFileList
        } else if (t === 6) {
          renderFileList = fileModal.caseRelatedFileList
        }
        return (
          <div>
            <Upload {...uploadProps} fileList={renderFileList}>
              <Button key={record.key} onClick={() => handleMenuClick(record)} disabled={!fileModal.finishedUpload}>
                <Icon type="upload" />
                上传
              </Button>
            </Upload>
          </div>
        )
      },
    },
  ]

  const metData = [
    {
      key: 1,
      name: '有效身份证明',
      meterials: [
        {
          url: 'http://baidu.com',
        },
      ],
      remark: '身份证、军官证、护照、港澳台身份证、户口本、临时身份证、武警警官证、士兵证；代理则需要代理人身份证明，关系证明或申请人授权委托书。',
    }, {
      key: 5,
      name: '经济困难证明材料',
      meterials: [
        {
          url: 'http://baidu.com',
        },
      ],
      remark: '乡镇街道政府有关政府部门（人民团体）出具的生活困难证明，或者下岗职工执业证、低保户家庭证、低保边缘家庭证等。',
    }, {
      key: 6,
      name: '申请事项相关材料',
      meterials: [
        {
          url: 'http://baidu.com',
        },
      ],
      remark: '与所申请法律援助事项有关证据证明材料。',
    },
  ]
  const noticeData = [
    {
      key: 1,
      name: '文书',
      meterials: [
        {
          url: 'http://baidu.com',
        },
      ],
      remark: '公安、 检察院 、 法院等开具的要求法律援助的相关文书。',
    }, {
      key: 5,
      name: '相关材料',
      meterials: [
        {
          url: 'http://baidu.com',
        },
      ],
      remark: '与法律援助事项有关的材料。',
    },
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
      <Form layout="horizontal" className="login-form">
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="免提交困难材料">
              {getFieldDecorator('isFreeHardMaterials', {initialValue: caseBaseInfoData.isFreeHardMaterials})(<Switch defaultChecked={caseBaseInfoData.isFreeHardMaterials} disabled />)}
            </FormItem>
          </Col>
          {caseBaseInfoData.isFreeHardMaterials
            ? <Col span={12}>
                <FormItem {...formItemLayout} label="原因">
                  {getFieldDecorator('freeHardMaterialsReason', {initialValue: caseBaseInfoData.freeHardMaterialsReason})(
                    <Select disabled size="large" placeholder="请选择免困难材料原因">
                      {createSelectOption({list: dictData.dic_dic_free_hard_materials_reason})}
                    </Select>
                  )}
                </FormItem>
              </Col>
            : <Col span={12}></Col>}

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
        <Row style={{
          padding: 20,
        }}>
          <Col span={24}>
            <Table
              bordered
              pagination={false}
              rowKey={record => record.key}
              dataSource={caseBaseInfoData.lawAidType && caseBaseInfoData.lawAidType[0] === '2' ? metData : noticeData}
              columns={metCols}
            />
          </Col>
        </Row>
      </Form>
    </div>
  )
}

BestoneUpload.propTypes = {
  form: PropTypes.object.isRequired,
  lawcaseDetail: PropTypes.object,
  handleFileChange: PropTypes.func,
  handleFileRemove: PropTypes.func,
  handleUpadateFileKey: PropTypes.func,
  updateUploadType: PropTypes.func,
  onBeforeUpload: PropTypes.func,
}

export default Form.create()(BestoneUpload)
