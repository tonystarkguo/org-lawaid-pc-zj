import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import moment from 'moment'
import { Row, Col, Input, Form, Icon, Button, Modal, Tabs, message } from 'antd'
import styles from './index.less'
import { SortableContainer, SortableElement, arrayMove, SortableHandle } from 'react-sortable-hoc'
import ModalView from './ModalView'
import ModalCover from './ModelCover'
import ClassEditModal from './ClassEditModal'
import Upload from '../common/Uploader'
const confirm = Modal.confirm
const TabPane = Tabs.TabPane
const FileModify = ({
  dispatch,
  fileModify
}) => {
  
  const { modalViewInfo, classEditModalInfo, modalCoverInfo, files, caseSmallDetail = {}, tCaseId, fileType, dicCategory, coverUrl, submitBtnLoading, submitBtnText, imgWidth } = fileModify
  files.map((item,index) => {
    item.ocadList.map((item,index) => {
      item.current = index
    })
  })
  localStorage.setItem('fileModify',JSON.stringify(fileModify))
  const handleDelete = (value) => {
    confirm({
      title: '删除',
      content: '是否确定删除此文件？',
      onOk () {
        dispatch({
          type: 'fileModify/deleteFile',
          payload: value,
        })
      },
    })
  }
  const update = (value) => {
    dispatch({
      type: 'fileModify/update',
      payload: {
        ...value,
      },
    })
  }
  const handleView = (value) => {
    dispatch({
      type: 'fileModify/showModalView',
      payload: value,
    })
  }
  const rotating=(value)=>{
    dispatch({
      type: 'fileModify/rotateImage',
      payload: value,
    })
  }
  const imgOnload = (element) => {
    const img = element.target
    const loop = () => {
      setTimeout(() => {
        if (img.complete) {
          if (imgWidth === 0 && img.offsetWidth !== 0) {
            dispatch({
              type: 'fileModify/setImgWidth',
              payload: img.offsetWidth,
            })
          }
        } else {
          loop()
        }
      }, 100)
    }  
    loop()
  }
  const imgStyle = {
    height: imgWidth * 297 / 210,

  }
  const DragHandle = SortableHandle(({ value }) =>
    <img src={value.addrUrl} className={styles.dragHandle} alt="图片" onLoad={imgOnload} style={imgStyle}  id={value.objectKey}/>
  )
  const SortableItem = SortableElement(({ value }) =>
    <div className={styles.item}>
        {caseSmallDetail.isArchiv === '0' &&
        <Icon type="delete" className={styles.icon} style={{ left: '15px' }} onClick={() => handleDelete(value)} />
      } 
      <Icon type="reload" className={styles.icon} style={{ left: '50%',top:'15px'}} onClick={() => rotating(value)} />
      <Icon type="eye" className={styles.icon} style={{ right: '15px' }} onClick={() => handleView(value)} />      
      <DragHandle value={value} />
    </div>
  )
  const SortableList = SortableContainer(({ items }) => {
    return (
      <div className={styles.list}>
        {items.map((value, index) => (
          <SortableItem key={`item-${index}`} index={index} value={value} disabled={caseSmallDetail.isArchiv !== '0'} />
        ))}
      </div>
    )
  })
  const handelOnSortEnd = (file, oldIndex, newIndex) => {
    if (oldIndex === newIndex) {
      return
    }
    dispatch({
      type: 'fileModify/setSortItem',
      payload: arrayMove(file.ocadList, oldIndex, newIndex),
    })
  }
  const modalViewProps = {
    current: modalViewInfo.present,
    url: modalViewInfo.url,
    visible: modalViewInfo.visible,
    fileModify,
    update,
    pictureView: fileModify.pictureView
  }
  const classEditModalProps = {
    ...classEditModalInfo,
    files,
  }
  const modalCoverProps = {
    coverUrl: coverUrl || caseSmallDetail.coverUrl,
    visible: modalCoverInfo.visible,
  }
  const handleTabChange = (key) => {
    dispatch({
      type: 'fileModify/setTabKey',
      payload: key,
    })
  }
  const tabPaneChild = files.map((file) => {
    const tabNode = <p>{file.dicCategory} {file.dicCategory !== '据已结案的相关文书（即承办卷）' && <span>（{file.ocadList.length}）</span>}</p>
    return (
      <TabPane tab={tabNode} key={file.dicCategory} disabled={file.dicCategory === '据已结案的相关文书（即承办卷）'} className={styles.tabPane}>
        <SortableList
          items={file.ocadList}
          onSortEnd={({ oldIndex, newIndex }) => handelOnSortEnd(file, oldIndex, newIndex)}
          axis="xy"
          useDragHandle
        />
      </TabPane>
    )
  })
  const handleCompleteModify = () => {
    dispatch({
      type: 'fileModify/completeModify',
    })
  }
  const handleToExamination = () => {
    dispatch(routerRedux.push(`/fileModify/${tCaseId}?fileType=examination`))
  }
  const handleToUndertake = () => {
    dispatch(routerRedux.push(`/fileModify/${tCaseId}?fileType=undertake`))
  }
  const handleFileChange = ({ file }) => {
    dispatch({
      type: 'fileModify/addFile',
      payload: file,
    })
  }
  const handleFileUpdatekey = ( file ) => {
    dispatch({
      type: 'fileModify/updateFileKey',
      payload: file,
    })
  }
  const handleSetCover = ({ file }) => {
    dispatch({
      type: 'fileModify/addCover',
      payload: file,
    })
  }
  const handleSubmitFile = () => {
    // if (!(coverUrl || caseSmallDetail.coverUrl)) {
    //   message.warning('请上传封面')
    //   return
    // }
    confirm({
      title: '确认归档',
      content: '请确认审批卷及承办卷已经完成编排。',
      onOk () {
        dispatch({
          type: 'fileModify/submitFile',
        })
      },
    })
  }
  const handleClassEdit = () => {
    dispatch({
      type: 'fileModify/showClassEditModal',
    })
  }
  const handleViewCover = () => {
    dispatch({
      type: 'fileModify/showModalCover',
    })
  }

  const handleDownExamination = () => {
    window.open(caseSmallDetail.examinationUrl)
  }

  const handleDownUndertake = () => {
    window.open(caseSmallDetail.undertakeUrl)
  }

  const handleDownAll = () => {
    window.open(caseSmallDetail.twoRollsInOneUrl)
  }
  const beforeUpload = (file, fileList) => {
    dispatch({
      type: 'fileModify/setCurrentTabKey',
    })
  }
  return (
    <div>
      <Row>
        <Col className={styles.cover} span={4}>
          <div className={styles.btns}>
            <div className={fileType === 'examination' ? styles.check : undefined} onClick={handleToExamination}>审批卷</div>
            <div className={fileType === 'undertake' ? styles.check : undefined} onClick={handleToUndertake}>承办卷</div>
          </div>
          <div className={styles.caseInfo}>
            <div className={styles.caseInfoTitle}>
              <p>{caseSmallDetail && caseSmallDetail.caseArea}</p>
              <p>{caseSmallDetail && caseSmallDetail.caseTitle}</p>
              <div className={styles.line}></div>
              <p className={styles.num}>{caseSmallDetail && caseSmallDetail.caseNumber}</p>
            </div>
            <div className={styles.caseInfoPerson}>
              <p>受援人：<span>{caseSmallDetail && caseSmallDetail.tRpUserName}</span></p>
              <p>承办单位：<span>{caseSmallDetail && caseSmallDetail.tHpUndertakeWorkUnit}</span></p>
              <p>承办律师：<span>{caseSmallDetail && caseSmallDetail.tHpUserName}</span></p>
            </div>
            <div className={styles.line}></div>
            <p className={styles.date}>制作日期：<span>{moment(caseSmallDetail && caseSmallDetail.makeDate).format('YYYY-MM-DD')}</span></p>
          </div>
        </Col>
        <Col span={20} className={styles.content}>
          <Tabs activeKey={dicCategory} type="card" tabPosition="left" onChange={handleTabChange} className={styles.tabs}>
            {tabPaneChild}
          </Tabs>
          {caseSmallDetail.isArchiv === '0' &&
            <div className={styles.btns}>
              <div style={{ margin: '0 5px' }}>
                <Upload handleFileChange={handleFileChange} handleFileUpdatekey={handleFileUpdatekey} beforeUpload={beforeUpload} disabled={submitBtnLoading} showUploadList={false} />
              </div>
              {/* {(caseSmallDetail && caseSmallDetail.isCover === '0') ?
                <div style={{ margin: '0 5px' }}><Upload handleFileChange={handleSetCover} showUploadList={false} text="上传封面" /></div> :
                <Button type="primary" onClick={handleViewCover}>查看封面</Button>
              } */}
              <Button type="primary" onClick={handleClassEdit} disabled={submitBtnLoading}>类别编辑</Button>
              <Button type="primary" onClick={handleCompleteModify} disabled={submitBtnLoading}>保存当前排版</Button>
              {caseSmallDetail.dicCaseStatus === '19' &&
                <Button type="primary" onClick={handleSubmitFile} loading={submitBtnLoading}>{submitBtnText}</Button>
              }
            </div>
          }
          {caseSmallDetail.isArchiv === '1' &&
            <div className={styles.btns}>
              <Button type="primary" onClick={handleDownExamination}>下载审批卷</Button>
              <Button type="primary" onClick={handleDownUndertake}>下载承办卷</Button>
              <Button type="primary" onClick={handleDownAll}>下载二卷合一</Button>
            </div>
          }
        </Col>
      </Row>
      {modalViewProps.visible && <ModalView {...modalViewProps} />}
      {classEditModalInfo.visible && <ClassEditModal {...classEditModalProps} />}
      {modalCoverProps.visible && <ModalCover {...modalCoverProps} />}
    </div>
  )
}

export default connect(({ fileModify }) => ({ fileModify }))(FileModify)
