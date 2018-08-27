/** 
* 外部参数
* uploaderProps = {
    handleFileChange: ({file, fileList}) => {
      console.log(fileList)
    },
    handleFileRemove:({file}) => {
      console.log(file)
    },
    showUploadList,
    text, // 按钮文字
  }
*/
import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { Upload, Button, Icon, message } from 'antd'
import { getDataService } from '../../services/commonService'
import { request, config, jsUtil } from '../../utils'
const { api } = config

class Uploader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fileData: {},
      loading: false,
    }
  }
  async getPolicy(){
    let response = await getDataService({url: api.ossGetPolicy}, {serviceId: 'srvid_ossGetPolicy'})
    if (response.success) {
      let data = response.data
      this.setState({
        fileData: {
          OSSAccessKeyId: data.accessid,
          policy: data.policy,
          Signature: data.signature,
          // key: 'orm/' + dt + '/' + lg + '_'+ '${filename}'
        }
      })
    } else if (response.code === '9999') {
      //do nothing, it will not update the state and will not re-render the page.
    }
  }
  async getFileUrl ({ file, fileList }) {
    if (file.status === 'error') {
      this.setState({
        loading: false,
      })
    }
    if (file.status === 'done') {
      let fileData = this.state.fileData
      let key = fileData.key
      let newFileUrl = key.split("_")[0] + '_' + file.name
      let response = await getDataService({url: api.getUrl}, {key: newFileUrl, serviceId: 'srvid_ossGetUrl'})
      let fList = this.state.fileList

      if (response.success) {
        let data = response.data
        let newFile = file
        newFile.url = data.url
        newFile.key = newFileUrl
        let newFileList = fileList.map((item, index) => {
          if (item.uid === file.uid) {
            item.url = data.url || ''
            item.objectKey = newFileUrl || ''
          }
          return item
        })
        this.setState({
          file: newFile,
          fileList: newFileList,
          loading: false,
        })
        this.props.handleFileChange({ file: newFile, fileList: newFileList })
      } else if (response.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
        this.setState({
          loading: false,
        })
      }
    } else {
      this.setState({
        fileList,
      })
    }
  }

  componentDidMount() {   
    this.getPolicy()
  }

  handleChange = ({ file, fileList }) => {
    this.getFileUrl({ file, fileList })
  }
  
  handleRemove = ({ file }) => {
    if (this.props.handleFileRemove) {
      this.props.handleFileRemove({ file })
    }
  }
    handleFileUpdatekey = ( file ) => {
    	console.log(file)
   this.props.handleFileUpdatekey(file)
  }
  beforeUpload = (file, fileList) => {
    const isJPG = (['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type.toLowerCase()) > -1)
    if (!isJPG) {
      message.error('只能上传jpeg，png格式的图片!')
    } else {
      this.setState({
        loading: true,
      })
      if (this.props.beforeUpload) {
        this.props.beforeUpload(file, fileList)
      }
    }
    return isJPG
  }
  render () {
    const uploadProps = {
      action: '/uploadtopri',
      onChange: this.handleChange,
      onRemove: this.handleRemove,
      multiple: true,
      beforeUpload: this.beforeUpload,
      fileList: this.state.fileList,
      disabled: this.state.loading,
      showUploadList: this.props.showUploadList === undefined ? true : this.props.showUploadList,
      data: (file) => {
        const dt = new Date().format('yyyyMMdd')
        const lg = new Date().getTime()
        let h = this.state.fileData
        h.key = 'orm/' + dt + '/' + lg + '_${filename}'
         let o = {}
      o[file.uid] = `orm/${dt}/${lg}_${file.name}`
        this.setState({
          fileData: h,
        })
        this.handleFileUpdatekey(o)
        return h
      },
    }
    return (
      <Upload {...uploadProps}>
        <Button loading={this.state.loading} disabled={this.props.disabled}>
          <Icon type="upload" style={{ opacity: this.state.loading ? 0 : 1 }} />
          {this.props.text || '上传'}
        </Button>
      </Upload>
    )
  }
}

export default Uploader
