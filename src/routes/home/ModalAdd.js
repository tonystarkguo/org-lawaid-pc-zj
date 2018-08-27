import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Modal, Row, Col, Input, Form, Upload, Icon, Button, Progress } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input
const ModalAdd = ({
  modalAddInfo,
  home,
  dispatch,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalAddProps
}) => {
  const {curTotalFileList=[]} = modalAddProps
  let haveUploadedFileList = curTotalFileList && curTotalFileList.filter((item, index) => item.status === 'done')
  const { fileModal } = modalAddProps
  const layout = {
    labelCol: {
      xs: {
        span: 4,
      },
      sm: {
        span: 4,
      },
    },
    wrapperCol: {
      xs: {
        span: 20,
      },
      sm: {
        span: 20,
      },
    },
  }
  const uploadProps = {
    action: '/uploadtopri',
    multiple: true,
    beforeUpload: (file, fileList) => {
      dispatch({
        type: 'home/updateProgress',
        payload: fileList,
      })
    },
    showUploadList: {
    	showPreviewIcon: false,
    },
    onPreview(file) {
    	previewVisible: false
    },
    onChange({file = {}, fileList = []}) {
      dispatch({
        type: 'home/updateFileList',
        payload: {file, fileList},
      })
    },
    onRemove(file) {
      dispatch({
          type: 'home/removeFile',
          payload: file
      })
    },
    data: fileModal.fileData,
    fileList: fileModal.fileList,
  }
  const props = {
    ...modalAddInfo,
    ...modalAddProps,
    title: '新建公告',
    onOk: () => {
      validateFields((error) => {
        if (error) {
          return
        }
        dispatch({
          type: 'home/createAnnouncement',
          payload: getFieldsValue(),
        })
      })
    },
    onCancel: () => {
      dispatch({
        type: 'home/hideModalAdd',
      })
    },
  }
  const modalProps1 = {
    visible :  
      curTotalFileList.length == haveUploadedFileList.length ? false : true,
      footer: null, 
      closable: false,
  }
  return (
    <Modal {...props}>
      <Form layout="horizontal" className="login-form">
        <FormItem {...layout} label="标题">
          {getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: '请输入标题',
              },
            ],
          })(<Input size="large" placeholder="请输入标题" />)}
        </FormItem>
        <FormItem {...layout} label="正文">
          {getFieldDecorator('content', {
            rules: [
              {
                required: true,
                message: '请输入正文',
              },
            ],
          })(<TextArea autosize={{ minRows: 4, maxRows: 8 }} placeholder="请输入正文" />)}
        </FormItem>
        <FormItem {...layout} label="附件">
              <Upload {...uploadProps}>
                  <Button>
                    <Icon type="upload" /> 上传
                  </Button>
                </Upload>
            </FormItem>
      </Form>
      {curTotalFileList.length !== 0 && <Modal
         {...modalProps1}
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
    </Modal>
  )
}

export default connect(({ modalAdd, dispatch }) => ({ modalAdd, dispatch }))(Form.create()(ModalAdd))
