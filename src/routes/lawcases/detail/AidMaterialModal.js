import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Modal, Row, Col, Form, Upload, Button, Icon } from 'antd'
import styles from './index.less'

const FormItem = Form.Item
const AidMaterialModal = ({
  ...aidMaterialModalProps,
  onCancel,
  handleDocChange,
  handleDocRemove,
  updateUploadType,
  dispatch,
}) => {
 const { fileModal } = aidMaterialModalProps
 const chengbanItem = localStorage.getItem('chengbanItem') && JSON.parse(localStorage.getItem('chengbanItem'))
 const userInfo = JSON.parse(localStorage.getItem('user'))
 let action
 if(chengbanItem && chengbanItem.orgId == userInfo.tOrgId){
   action = false
 }else{
   action = true
 }
 const uploadProps = {
  action: '/uploadtopri',
  onChange: handleDocChange,
  onRemove: handleDocRemove,
  multiple: true,
  showUploadList: {
    showRemoveIcon: action ?  false : true 
  },
  data: (file) => {
    const dt = new Date().format('yyyyMMdd')
    const lg = new Date().getTime()
    let h = fileModal.fileData
    h.key = `orm/${dt}/${lg}_\${filename}`
    let o = {}
    o[file.uid] = `orm/${dt}/${lg}_${file.name}`
    dispatch({type: 'lawcaseDetail/updateFileKey', payload: o})
    return h
  },
 
}

const handleMenuClick = (record) => {
  updateUploadType(record.key)
}

const layout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 14 },
    sm: { span: 15 },
  },
}

  const props = {
    ...aidMaterialModalProps,
    title: '变更材料',
    width: 600,
    footer:null,
    onCancel,
   
  }
 
  return (
    <Modal {...props} >
    <Form>
      <FormItem {...layout} label="更换法律援助人员通知书">
              <Upload {...uploadProps} fileList={fileModal.noticeUploadList}>
                  <Button onClick={() => handleMenuClick({key: 'noticeUpload'})} disabled={action}>
                    <Icon type="upload" /> 上传
                  </Button>
                </Upload>
            </FormItem>
            <FormItem {...layout} label="更换法律援助人员审批表">
              <Upload {...uploadProps} fileList={fileModal.approveUploadList}>
                  <Button onClick={() => handleMenuClick({key: 'approveUpload'})} disabled={action}>
                    <Icon type="upload" /> 上传
                  </Button>
                </Upload>
            </FormItem>
    </Form>        
    </Modal>
  )
}

export default connect(({ dispatch }) => ({ dispatch }))(Form.create()(AidMaterialModal))

