import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Upload, Icon, Button } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const FileModal = ({
  item = {},
  onOk,
  fileModal = {},
  handlePreview,
  handleChange,
  handleRemove,
  beforeUpload,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  let {fileList, fileData} = fileModal
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      data.address = data.address.join(' ')
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">上传文件</div>
    </div>
  )

  const uploadProps = {
    action: '/uploadtopri',//"http://bestone-lawaid.oss-cn-shenzhen.aliyuncs.com",
    // listType: "picture-card",
    // onPreview: handlePreview,
    onChange: handleChange,
    data: fileData,
    // showUploadList: {showPreviewIcon: false},
    fileList
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="材料文件" hasFeedback {...formItemLayout}>

          <Upload {...uploadProps} >
            <Button>
              <Icon type="upload" /> 上传
            </Button>
          </Upload>
        </FormItem>

        <FormItem label="备注" hasFeedback {...formItemLayout}>
          {getFieldDecorator('desc', {
            initialValue: item.desc,
            rules: [{required: true}]
          })(<TextArea autosize={{ minRows: 4, maxRows: 6 }} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

FileModal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(FileModal)
