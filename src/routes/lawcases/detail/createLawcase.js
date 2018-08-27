import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { Steps, Tabs, Form, Input, Select, Button, Row, Col, Radio, Timeline, Icon, Spin, Affix, Modal, Anchor } from 'antd'
import { routerRedux } from 'dva/router'
import { ApproveCom } from '../../../components'
import { CaseBaseInfo, CaseApplyerInfo, CaseIdentityInfo, CaseDocumentInfo, CaseActLogInfo, CaseInfo } from './modules'
import FileModal from './FileModal'
import DataModal from './DataModal'
import SubPersonModal from './SubPersonModal'

const TabPane = Tabs.TabPane
const Step = Steps.Step
const FormItem = Form.Item
const RadioGroup = Radio.Group
const { Link } = Anchor

const CreateLawcase = ({ location, dispatch, loading, lawcaseDetail }) => {
  const { flowDetail, modalVisible, modalType, currentItem, caseDetail,
    remarkDetail, caseStatus, caseId, flowId, subPersonList, subPersonModal = {}, tagList,
    identityMaterialData, allConfig, remarkList, caseBaseInfoData, options, confirmLoading, countModalVisible, containerLoading, fileModal } = lawcaseDetail
  const { remarkModalVisible } = remarkDetail
  const { flowModalVisible, updateReason, selectedId, dataModalVisible, bidingLawyerList, layerDetModalVisible,
    rateModalVisible, selectedApplyer, bidInfo, fileModalVisible, previewVisible } = flowDetail

  const { list, pagination, current, isMotion } = remarkList
  const { pageSize } = pagination

  // 待办处理区域props
  const actProps = {
    caseDetail: { caseStatus: '0' },
    visible: modalVisible,
    maskClosable: false,
    title: `${modalType === 'create' ? '创建' : '更新'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: 'lawcaseDetail/showModal',
        payload: newData,
      })
    },
    onCancel () {
      dispatch({
        type: 'lawcaseDetail/hideModal',
      })
    },
    onShowData () { // 显示补充材料
      dispatch({
        type: 'lawcaseDetail/showDataModal',
      })
    },
    toNextStep (data) { // 线上检查，进入下一环节
      let params = {
        dicConclusion: '1',
        tCaseId: caseId,
        tFlowId: flowId,
        ...data,
      }
      dispatch({
        type: 'lawcaseDetail/toNextStep',
        payload: params,
      })
    },
    toNext () { // 线上检查，进入下一环节
      dispatch({
        type: 'lawcaseDetail/toNext',
      })
    },
  }

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    allConfig,
    maskClosable: false,
    title: `${modalType === 'create' ? '创建' : '更新'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      let newData
      if (`${modalType}` === 'create') {
        data.key = (familyIncomes.length + 1).toString()
        data.seq = (familyIncomes.length + 1).toString()
        familyIncomes.push(data)
        newData = familyIncomes
      } else {
        let dt = familyIncomes.map((item, index) => {
          if (item.seq === data.seq) {
            return { ...item, ...data }
          }
          return item
        })
        newData = dt
      }

      dispatch({
        type: `lawcaseDetail/${modalType}`,
        payload: newData,
      })
    },
    onCancel () {
      dispatch({
        type: 'lawcaseDetail/hideModal',
      })
    },
  }

  const dataModalProps = {
    visible: dataModalVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onOk () {
      dispatch({
        type: 'lawcaseDetail/hideDataModal',
      })
    },
    onCancel () {
      dispatch({
        type: 'lawcaseDetail/hideDataModal',
      })
    },
    toSubmitStep (data) { // 发起归档-提交至受援人补充材料
      dispatch({
        type: 'lawcaseDetail/toSubmitStep',
        payload: data,
      })
    },
    toSubmitother (data) { // 线上检查-提交至受援人补充材料
      dispatch({
        type: 'lawcaseDetail/toSubmitother',
        payload: data,
      })
    },
  }
  const subPersonModalProps = {
    visible: subPersonModal.modalVisible,
    subPersonItem: subPersonModal.subPersonItem,
    roles: subPersonModal.roles,
    type: subPersonModal.type,
    title: subPersonModal.title,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    allConfig,
    tagList,
    caseDetail,
    onOk (data) {
      if (subPersonModal.title === '新增从案人员') {
        dispatch({ type: 'lawcaseDetail/addSubPerson', payload: data })
      } else {
        dispatch({ type: 'lawcaseDetail/editSubPerson', payload: data })
      }
    },
    onCancel () {
      dispatch({
        type: 'lawcaseDetail/hideSubPersonModal',
      })
    },
  }

  const caseTabProps = {
    lawcaseDetail,
    isTodoList: true,
    showFileModal () {
      dispatch({ type: 'lawcaseDetail/showFileModal' })
      dispatch({ type: 'lawcaseDetail/beforeUpload' })
    },
    updateUploadType (uploadType) {
      dispatch({ type: 'lawcaseDetail/updateUploadType', payload: uploadType })
    },
    // 申请主体信息
    handleApplyerInfoEdit () {
      dispatch({ type: 'lawcaseDetail/editApplyerInfo' })
    },

    handleApplyerInfoSave (values) {
      dispatch({ type: 'lawcaseDetail/saveApplyerInfo', payload: values })
    },

    handleFinInfoSave (values) {
      dispatch({ type: 'lawcaseDetail/saveFinInfo', payload: values })
    },

    handleApplyerInfoCancel () {
      dispatch({ type: 'lawcaseDetail/cancelApplyerInfo' })
    },
    // 案件基本信息
    handleCaseBaseInfoEdit () {
      dispatch({ type: 'lawcaseDetail/editCaseBaseInfo' })
    },

    handleCaseBaseInfoSave (values) {
      dispatch({ type: 'lawcaseDetail/saveCaseBaseInfo', payload: values })
    },

    handleCaseBaseInfoCancel () {
      dispatch({ type: 'lawcaseDetail/cancelCaseBaseInfo' })
    },
    changeUpdata (payload) {
      dispatch({ type: 'lawcaseDetail/caseBaseChangeUpdata', payload })
    },

    onDeleteItem (data) {
      let dt = familyIncomes.filter((item) => item.seq !== data.seq)
      dispatch({
        type: 'lawcaseDetail/onDeleteItem',
        payload: dt,
      })
    },
    onAddItem () {
      dispatch({
        type: 'lawcaseDetail/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'lawcaseDetail/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    dataSource: list,
    // loading: loading.effects['lawcaseDetail/getRemarkList'],
    pagination,
    location,
    isMotion,
    onChange (page) {
      dispatch({
        type: 'lawcaseDetail/getRemarkList',
        payload: {
          pageNum: page.current,
          pageSize: page.pageSize,
        },
      })
    },
    handleFileChange ({ file = {}, fileList = [] }) {
      // console.log(file.status)
      // console.log(file.uid)
      if (file.status !== 'removed') {
        dispatch({
          type: 'lawcaseDetail/updateFileList',
          payload: { file, fileList },
        })
      }
    },
    handleFileRemove (file) {
      console.log(file)
      dispatch({
        type: 'lawcaseDetail/removeSingleFile',
        payload: file,
      })
    },
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  const handleChange = (value) => {
  }

  const onChange = (e) => {
  }

  const handleRemarkAdd = (e) => {
    dispatch({ type: 'lawcaseDetail/showRemarkModal' })
  }

  // tabs切换
  const TabsChange = (activeKey) => {
    switch (activeKey) {
      case '4':// 法律援助人员信息
        dispatch({
          type: 'lawcaseDetail/getAidedPersonInfoPorps',
        })
        break
      case '10':// 备注信息
        dispatch({
          type: 'lawcaseDetail/getRemarkList',
          payload: {
            pageNum: 1,
            pageSize: 10,
          },
        })
        break
    }
  }

  const fileModalProps = {
    visible: fileModalVisible,
    maskClosable: true,
    title: '请选择附件',
    test: 'test',
    fileModal,
    onCancel () {
      dispatch({
        type: 'lawcaseDetail/hideFileModal',
      })
    },
    handlePreview (file) {
      dispatch({
        type: 'lawcaseDetail/previewImage',
        payload: file,
      })

      console.log(file)
    },
    handleChange ({ file = {}, fileList = [] }) {
      // updateList
      console.log(file)
      dispatch({
        type: 'lawcaseDetail/updateFileList',
        payload: file,
      })
    },
    handleRemove (file) {
      console.log(file)
    },
    beforeUpload (file, fileList) {
      dispatch({
        type: 'lawcaseDetail/beforeUpload',
      })
    },
  }

  /* {role === '1' && isTodoList && <ApproveCom {...actProps}/>}
  <Anchor>
        <Link href="#components-anchor-demo-basic" title="申请主体基本信息" />
        <Link href="#components-anchor-demo-fixed" title="援助事项信息" />
        <Link href="#API" title="申请材料" />
        <Link href="#Anchor-Props" title="机构文书" />
      </Anchor>*/
  return (

    <div className="content-inner content-container">
      {subPersonModal.modalVisible && <SubPersonModal {...subPersonModalProps} />}
      {dataModalVisible && <DataModal {...dataModalProps} />}
      {fileModalVisible && <FileModal {...fileModalProps} />}
      <Modal visible={previewVisible} footer={null}>
        <img alt="example" style={{ width: '100%' }} />
      </Modal>
      <div className="card-container">
        <CaseInfo {...caseTabProps} />
      </div>
    </div>
  )
}

CreateLawcase.propTypes = {
  lawcaseDetail: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ lawcaseDetail, form, location, dispatch, loading }) => ({ lawcaseDetail, form, location, dispatch, loading }))(CreateLawcase)
