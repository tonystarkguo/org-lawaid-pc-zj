import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { config, jsUtil } from '../../../utils'
import {
  Tabs,
  Row,
  Col,
  Spin,
  Button,
} from 'antd'
import { routerRedux } from 'dva/router'
import _ from 'lodash'
import {
  Flowcharts,
  ApproveCom,
  FlowDetail,
} from '../../../components'
import {
  BestoneUpload,
  CaseApplyerInfo,
  CaseDocumentInfo,
  CaseActLogInfo,
  FlowModal,
  DataModal,
  RemarkModal,
  LayerDetModal,
  FileModal,
  CountModal,
  SubPersonModal,
  SatisfactionModal,
  SelectPrintModal,
  SuggestModal,
  RecipientVisit,
  CourtHearing,
  StopLegalAid,
  CaseResult,
  Modal,
  DocMaterials,
  AidMsg,
  AidMsgModal,
  AidMsgChangeModal,
  AidMaterialModal,
  UndertakeForm,
} from './modules'

const getObjByValFromArr = jsUtil.getObjByValFromArr
const getJoinedValFromArr = jsUtil.getJoinedValFromArr
const TabPane = Tabs.TabPane
const { api } = config
const Detail = ({ location, dispatch, lawcaseDetail }) => {
  const {
    data,
    flowNodes,
    currentNodeNum,
    caseFinacialData,
    modalVisible,
    flowDetail,
    modalType,
    currentItem,
    tagList,
    remarkDetail,
    caseStatus,
    caseId,
    CaseMaterialFile,
    subPersonModal = {},
    selectPrintModal = {},
    SuppMaterial,
    caseStepFileData,
    undertakeFileData,
    identityFileData,
    caseStepMaterialData,
    homeFinMaterialData,
    identityMaterialData,
    allConfig,
    remarkList,
    caseBaseInfoData,
    options,
    confirmLoading,
    countModalVisible,
    aiderNum,
    requestObj,
    containerLoading,
    fileModal,
    flowNodesForNet,
    selectedRowKeys,
    aidMsgModal,
    aidMsgChangeModal,
    aidMaterialModal,
    docsList,
    emptydocsList,
  } = lawcaseDetail
  
  const nodeInfo = {
    flowNodes,
    flowNodesForNet,
    currentNodeNum,
    caseBaseInfoData,
  }
  const { dataSource, familyIncomes } = caseFinacialData
  const { remarkModalVisible } = remarkDetail
  const {
    fileModalVisible,
    flowModalVisible,
    updateReason,
    selectedId,
    dataModalVisible,
    bidingLawyerList,
    layerDetModalVisible,
    selectedApplyer,
    layerPagination,
  } = flowDetail

  const { list, pagination, isMotion } = remarkList
  // 根据入口判断是否有编辑功能
  let listType = localStorage.getItem('listType')
  let isTodoList = true
  if (listType === '0' || listType === '1' || listType === '2' || listType === '3' || listType === '4' || listType === '5' || listType === '6' || listType === '15') {
    isTodoList = true
  } else {
    isTodoList = false
  }

  const userObj = JSON.parse(localStorage.getItem('user'))
  const roles = userObj && userObj.roles
  const role = roles.length && roles[0].id || '1' // 1, 工作人员, 3, 管理员

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRowKeys)
      console.log('---------------------')
      console.log(selectedRows)
      dispatch({ type: 'lawcaseDetail/updateSelectedRows', payload: { selectedRowKeys, selectedRows } })
    },
  }

  const aidMaterialModalProps = {
    visible: aidMaterialModal.modalVisible,
    caseDetail: lawcaseDetail,
    fileModal,
    handleDocChange ({
      file = {},
      fileList = [],
    }) {
      if (file.status !== 'removed') {
        dispatch({
          type: 'lawcaseDetail/updateBgMeterialList',
          payload: { file, fileList },
        })
      }
    },
    onCancel(){
      dispatch({
            type: 'lawcaseDetail/hideAidMaterialModal',
          })
    },
    handleDocRemove (file) {
      dispatch({ type: 'lawcaseDetail/removeBgFile', payload: file })
    },
    updateUploadType (uploadType) {
      dispatch({ type: 'lawcaseDetail/updateUploadType', payload: uploadType })
    },
  }

  // 待办处理区域props
  const actProps = {
    caseDetail: lawcaseDetail,
    visible: modalVisible,
    maskClosable: false,
    selectedApplyer,
    title: `${modalType === 'create'
      ? '创建'
      : '更新'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (dt) {
      dispatch({ type: 'lawcaseDetail/showModal', payload: dt })
    },
    onCancel () {
      dispatch({ type: 'lawcaseDetail/hideModal' })
    },
    onPublishBid (formDt) { // 发布竞价
      dispatch({ type: 'lawcaseDetail/publishBid', payload: formDt })
    },
    onDeleteAidPeople (tagid) {
      dispatch({ type: 'lawcaseDetail/updateSelectedRows', payload: { toBeRemovedRowId: tagid } })
    },
    onsetMainLawyer (tagid) {
      dispatch({ type: 'lawcaseDetail/setMainLawyer', payload: { id: tagid } })
    },
    onSelectChange (selectedRows) {
      // selectedApplyer.push(selectedRows) console.log(selectedApplyer)
      dispatch({ type: 'lawcaseDetail/updateSelectedRows', payload: selectedRows })
      // this.setState({ selectedRowKeys });
    },
    onSubmitRecBiders (selectedLawyers) { // 推荐法律援助人员
      dispatch({ type: 'lawcaseDetail/submitBiders', payload: selectedLawyers })
    },
    onAddNewLawyer () { // 跳转至添加援助人员页面
      dispatch(routerRedux.push('/aidPersonManagement'))
    },
    onAddComments (biders) { // 提交评价
      dispatch({ type: 'lawcaseDetail/addComments', payload: biders })
    },
    onViewAllComments () { // 查看评价
      dispatch({ type: 'lawcaseDetail/showRateModal' })
    },
    onStopComments (biders) { // 结束评价
      dispatch({ type: 'lawcaseDetail/stopComments', payload: biders })
    },
    onViewDetail (item) { // 查看详情
      dispatch({
        type: 'lawcaseDetail/showLayerDetModal',
        payload: (item.key - 1),
      })
    },
    onShowData () { // 显示补充材料
      dispatch({ type: 'lawcaseDetail/showDataModal' })
    },
    toNextStep (dt) { // 预审，提交（除了需补充材料）
      let params = {
        tCaseId: caseId,
        // tFlowId: flowId,
        ...dt,
      }
      dispatch({ type: 'lawcaseDetail/toNextStep', payload: params })
    },
    toNext () { // 线上检查，进入下一环节
      dispatch({ type: 'lawcaseDetail/toNext' })
    },
    onSubmitToEndCase (value) { // 结案审核
      dispatch({ type: 'lawcaseDetail/endCase', payload: value })
    },
    onchangeContent (value) {
      dispatch({ type: 'lawcaseDetail/onchangeContent', payload: value })
    },
    onSearchLawyers (searchParams) {
      dispatch({ type: 'lawcaseDetail/searchLawyers', payload: searchParams })
    },
    handleSearch (value) {
      if (value !== '') {
        dispatch({ type: 'lawcaseDetail/getLawfirmList', payload: `${value}` })
      }
    },
    lawTableProps: {
      pagination: layerPagination,
      onChange (page) {
        dispatch({
          type: 'lawcaseDetail/searchLawyers',
          payload: {
            pageNum: page.current,
            pageSize: page.pageSize,
          },
        })
      },
      rowSelection,
    },
    onFieldsChange (fields) {
      dispatch({ type: 'lawcaseDetail/save_fields', payload: fields })
    },
  }
  const subPersonModalProps = {
    visible: subPersonModal.modalVisible,
    subPersonItem: subPersonModal.subPersonItem,
    caseBaseInfoData: caseBaseInfoData,
    title: subPersonModal.title,
    roles: subPersonModal.roles,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    type: 'edit',
    allConfig,
    tagList,
    onOk (dt) {
      if (subPersonModal.title === '新增从案人员') {
        dispatch({ type: 'lawcaseDetail/addSubPersonCase', payload: dt })
      } else {
        dispatch({ type: 'lawcaseDetail/editSubPerson', payload: dt })
      }
    },
    onCancel () {
      dispatch({ type: 'lawcaseDetail/hideSubPersonModal' })
    },
  }
  const aidMsgModalProps = {
    visible: aidMsgModal.modalVisible,
    caseDetail: lawcaseDetail,
    confirmLoading,
    onCancel () {
      dispatch({ type: 'lawcaseDetail/hideAidMsgModal' })
    },
    onsetMainLawyer (tagid) {
      dispatch({ type: 'lawcaseDetail/editAidMainLawyer', payload: {  tHpUserId: tagid } })
    },
    handleAddPerson() {
      dispatch({ type: 'lawcaseDetail/showAidMsgChangeModal'})
    },
    handleDelAidPerson(data) {
      dispatch({ type: 'lawcaseDetail/delAidPerson', payload: data})
    },
    handleChangeAidPerson () {
      dispatch({ type: 'lawcaseDetail/showAidChangeModal'})
    }
  }
  const aidMsgChangeModalProps = {
    visible: aidMsgChangeModal.modalVisible,
    caseDetail: lawcaseDetail,
    showUpload: aidMsgChangeModal.showUpload,
    fileModal,
    onOk (data) {
      if(aidMsgChangeModal.showUpload){
        dispatch({ type: 'lawcaseDetail/changeAidPerson', payload: data})
      }else{
        dispatch({ type: 'lawcaseDetail/addAidPersonManagement', payload: data})

      }
    },
    handleDocChange ({
      file = {},
      fileList = [],
    }) {
      if (file.status !== 'removed') {
        dispatch({
          type: 'lawcaseDetail/updateBiangengMeterialList',
          payload: { file, fileList },
        })
      }
    },
    handleDocRemove (file) {
      dispatch({ type: 'lawcaseDetail/removeBiangengFile', payload: file })
    },
    onCancel () {
      dispatch({ type: 'lawcaseDetail/hideAidMsgChangeModal'})
    },
    onAddNewLawyer () { // 跳转至添加援助人员页面
      dispatch(routerRedux.push('/aidPersonManagement'))
    },
    onchangeContent (value) {
      dispatch({ type: 'lawcaseDetail/onchangeContent', payload: value })
    },
    onSearchLawyers (searchParams) {
      dispatch({ type: 'lawcaseDetail/searchLawyers', payload: searchParams })
    },
    lawTableProps: {
      pagination: layerPagination,
      onChange (page) {
        dispatch({
          type: 'lawcaseDetail/searchLawyers',
          payload: {
            pageNum: page.current,
            pageSize: page.pageSize,
          },
        })
      },
      rowSelection,
    },
    updateUploadType (uploadType) {
      dispatch({ type: 'lawcaseDetail/updateUploadType', payload: uploadType })
    },
    onChoose (record) {
      dispatch({ 
        type: 'lawcaseDetail/changeState',
        payload: record
      })
    },
    onDeleteAidPeople (tagid) {
      dispatch({ type: 'lawcaseDetail/updateSelectedRows', payload: { toBeRemovedRowId: tagid } })
    },
  }
		const selectPrintModalProps = {
    visible: selectPrintModal.modalVisible,
    title: '选择要打印的文书',
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    type: 'edit',
    allConfig,
    tagList,
    docsList,
    emptydocsList,
    onOk (dt) {
    	 dispatch({ type: 'lawcaseDetail/hideSelectPrintModal' })
    	 let defaultFileAddrName = getJoinedValFromArr(dt.dicEmptyWordName)
    	 let tCaseMaterialStorageId = getJoinedValFromArr(dt.dicWordName)
    	 window.open(`${api.baseURL}/print/printView.html?defaultFileAddr=${defaultFileAddrName}&tCaseMaterialStorageId=${tCaseMaterialStorageId}`)
    },
    onCancel () {
      dispatch({ type: 'lawcaseDetail/hideSelectPrintModal' })
    },
  }
  const modalProps = {
    item: modalType === 'create'
      ? {}
      : currentItem,
    visible: modalVisible,
    allConfig,
    maskClosable: false,
    title: `${modalType === 'create'
      ? '创建'
      : '更新'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (dta) {
      let newData
      if (`${modalType}` === 'create') {
        data.key = (familyIncomes.length + 1).toString()
        data.seq = (familyIncomes.length + 1).toString()
        familyIncomes.push(data)
        newData = familyIncomes
      } else {
        let dt = familyIncomes.map((item) => {
          let result = item
          if (item.seq === data.seq) {
            result = {
              ...item,
              ...dta,
            }
          }
          return result
        })
        newData = dt
      }
      dispatch({ type: `lawcaseDetail/${modalType}`, payload: newData })
    },
    onCancel () {
      dispatch({ type: 'lawcaseDetail/hideModal' })
    },
  }

  const flowProps = {
    caseDetail: lawcaseDetail,
    updateReason,
    updateItem (id) {
      dispatch({ type: 'lawcaseDetail/showFlowModal', payload: id })
    },
  }

  const flowModalProps = {
    visible: flowModalVisible,
    maskClosable: false,
    selectedId,
    updateReason,
    wrapClassName: 'vertical-center-modal',
    onOk () {
      dispatch({ type: 'lawcaseDetail/hideFlowModal' })
    },
    onCancel () {
      dispatch({ type: 'lawcaseDetail/hideFlowModal' })
    },
  }

  const layerDetModalProps = {
    visible: layerDetModalVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    bidingLawyerList,
    selectedId,
    onOk () {
      dispatch({ type: 'lawcaseDetail/hideLayerDetModal' })
    },
    onCancel () {
      dispatch({ type: 'lawcaseDetail/hideLayerDetModal' })
    },
  }

  const countModalProps = {
    visible: countModalVisible,
    aiderNum,
    requestObj,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onOk (reqObj) {
      dispatch({ type: 'lawcaseDetail/comfirmPublish', payload: reqObj })
    },
    onCancel () {
      dispatch({ type: 'lawcaseDetail/hideCountModal' })
    },
  }

  const dataModalProps = {
    options,
    caseStatus,
    CaseMaterialFile,
    SuppMaterial,
    caseStepFileData,
    undertakeFileData,
    identityFileData,
    caseStepMaterialData,
    homeFinMaterialData,
    identityMaterialData,
    visible: dataModalVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onOk () {
      dispatch({ type: 'lawcaseDetail/hideDataModal' })
    },
    onCancel () {
      dispatch({ type: 'lawcaseDetail/hideDataModal' })
    },
    toSubmitStep (dt) { // 发起归档-提交至受援人补充材料
      dispatch({ type: 'lawcaseDetail/toSubmitStep', payload: dt })
    },
    toSubmitother (dt) { // 线上检查-提交至受援人补充材料
      dispatch({ type: 'lawcaseDetail/toSubmitother', payload: dt })
    },
    caseStepFileSelect (selectedRowKeys, selectedRows) {
      dispatch({ type: 'lawcaseDetail/updateCaseStepFileSelect', payload: selectedRows })
    },
    homeFinMaterialSelect (selectedRowKeys, selectedRows) {
      dispatch({ type: 'lawcaseDetail/updateHomeFinMaterialSelect', payload: selectedRows })
    },

    undertakeFileSelect (selectedRowKeys, selectedRows) {
      dispatch({ type: 'lawcaseDetail/updateUndertakeFileSelect', payload: selectedRows })
    },
    identityFileSelect (selectedRowKeys, selectedRows) {
      dispatch({ type: 'lawcaseDetail/updateIdentityFileSelect', payload: selectedRows })
    },
    identityMaterialSelect (selectedRowKeys, selectedRows) {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ',
      // selectedRows);
      dispatch({ type: 'lawcaseDetail/updateidentityMaterialSelect', payload: selectedRows })
    },
    caseStepMaterialSelect (selectedRowKeys, selectedRows) {
      dispatch({ type: 'lawcaseDetail/updatecaseStepMaterialSelect', payload: selectedRows })
    },
  }

  const remarkModalProps = {
    caseBaseInfoData,
    visible: remarkModalVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    confirmLoading,
    onOk (reason) {
      dispatch({ type: 'lawcaseDetail/addRemark', payload: reason })
    },
    onCancel () {
      dispatch({ type: 'lawcaseDetail/hideRemarkModal' })
    },
  }

  const caseTabProps = {
    lawcaseDetail,
    role,
    isTodoList,
    showFileModal () {
      dispatch({ type: 'lawcaseDetail/showFileModal' })
      dispatch({ type: 'lawcaseDetail/beforeUpload' })
    },
    // 申请主体信息
    handleApplyerInfoEdit () {
      dispatch({ type: 'lawcaseDetail/editApplyerInfo' })
    },
    updateuploadProgress(fileList){
      dispatch({
        type: 'lawcaseDetail/updateProgress',
        payload: fileList,
      })
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
    // 案件办理结果
    handleCaseTakeInfoEdit () {
      dispatch({ type: 'lawcaseDetail/editCaseTakeInfo' })
    },
    handleCaseTakeInfoSave (values) {
      dispatch({ type: 'lawcaseDetail/saveCaseTakeInfo', payload: values })
    },
    handleSave(formData){
      dispatch({type: 'lawcaseDetail/saveUndertakeData', payload: formData})
    },
    handleCaseTakeInfoCancel () {
      dispatch({ type: 'lawcaseDetail/cancelCaseTakeInfo' })
    },
    //
    changeUpdata (payload) {
      dispatch({ type: 'lawcaseDetail/caseBaseChangeUpdata', payload })
    },
    // 提交结案
    handleCommitcaseInfoSave (values) {
    	dispatch({ type: 'lawcaseDetail/saveCommitcaseInfo', payload: values })
    },
    // 家庭财务信息
    handleFinEdit () {
      dispatch({ type: 'lawcaseDetail/editFinInfo' })
    },
    handleFinSave () {
      dispatch({ type: 'lawcaseDetail/saveFinInfo', payload: dataSource })
    },
    handleFinCancel () {
      dispatch({
        type: 'lawcaseDetail/getCaseFinacialData',
        payload: {
          tCaseId: caseId,
        },
      })
      dispatch({ type: 'lawcaseDetail/cancelFinInfo' })
    },
    onDeleteItem (dta) {
      let dt = familyIncomes.filter((item) => item.seq !== dta.seq)
      dispatch({ type: 'lawcaseDetail/onDeleteItem', payload: dt })
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
    onBeforeUpload ({
      file,
      fileList,
    }) {
      dispatch({ type: 'lawcaseDetail/beforeUpload', payload: file })
    },
    handleFileChangeEnd({ file = {}, fileList = [], }) {
      if (file.status !== 'removed') {
        dispatch({
          type: 'lawcaseDetail/updateFileListEnd',
          payload: {file, fileList},
        })
      }
    },
    handleFileRemoveEnd(file) {
      dispatch({type: 'lawcaseDetail/removeFileEnd', payload: file})
    },
    handleFileChange ({
      file = {},
      fileList = [],
    }) {
      if (file.status !== 'removed') {
        dispatch({
          type: 'lawcaseDetail/updateMeterialList',
          payload: { file, fileList },
        })
      }
      /* if (file.status === 'done') {
        console.log('uploaded.')
        const existFileList = fileModal.fileList
        // 因为上传的时候有可能调用两次，所以先判断是否存在uid是每次上次文件的lastupdatetime
        if (!_.some(existFileList, {uid: file.uid})) {
          dispatch({type: 'lawcaseDetail/updateMeterialList', payload: file})
        }
      } */
    },
     handleUpadateFileKey (file) {
      dispatch({ type: 'lawcaseDetail/updateFileKey', payload: file })
    },
    handleFileRemove (file) {
      dispatch({ type: 'lawcaseDetail/removeSingleFile', payload: file })
    },
    handleDocChange ({
      file = {},
      fileList = [],
    }) {
      if (file.status !== 'removed') {
        dispatch({
          type: 'lawcaseDetail/updateDocList',
          payload: { file, fileList },
        })
      }
    },
    handleDocRemove (file) {
      dispatch({ type: 'lawcaseDetail/removeSingleDoc', payload: file })
    },

    updateUploadType (uploadType) {
      dispatch({ type: 'lawcaseDetail/updateUploadType', payload: uploadType })
    },
    saveRecipientVisit (data) {
      dispatch({ type: 'lawcaseDetail/saveRecipientVisit', payload: data })
    },
    saveCourtHearing (data) {
      dispatch({ type: 'lawcaseDetail/saveCourtHearing', payload: data })
    },
    stopAid (data) {
      dispatch({ type: 'lawcaseDetail/stopAid', payload: data })
    },
  }

  const content = []
  for (let key in data) {
    if ({}.hasOwnProperty.call(data, key)) {
      content.push(
        <div key={key} className={styles.item}>
          <div>{key}</div>
          <div>{String(data[key])}</div>
        </div>
      )
    }
  }
  // tabs切换
  const TabsChange = (activeKey) => {
    switch (activeKey) {
      case '7':
        dispatch({
          type: 'lawcaseDetail/getCaseResult',
        })
        break
      case '8':
        window.open(`${window.location.origin}/fileModify/${caseId}?fileType=undertake`)
        break
      case '10': // 备注信息
        dispatch({
          type: 'lawcaseDetail/getRemarkList',
          payload: {
            pageNum: 1,
            pageSize: 10,
          },
        })
        break
      default: break
    }
  }

  const toFileModify = () => {
    window.open(`${window.location.origin}/fileModify/${caseId}?fileType=undertake`)
    // dispatch(routerRedux.push(`/fileModify/${caseId}?fileType=undertake`))
  }

  const fileModalProps = {
    visible: fileModalVisible,
    maskClosable: true,
    title: '选择当日时间段',
    test: 'test',
    fileModal,
    onCancel () {
      dispatch({ type: 'lawcaseDetail/hideFileModal' })
    },
    handlePreview (file) {
    },
    handleChange (file) {
    },
    handleRemove (file) {
    },
    beforeUpload () {
      dispatch({ type: 'lawcaseDetail/beforeUpload' })
    },
  }

  return (
    <Spin spinning={containerLoading}>

      <div className="content-inner content-container">
        <Row className={styles.pb20}>
          <Col span="24">
            <Flowcharts {...nodeInfo} />
          </Col>
        </Row>

        {
          caseStatus === '19' ?
          <Row className={styles.pb20}><Button type="primary" size="large" onClick={toFileModify}>案卷归档</Button></Row> : ''
        }

        {<FlowDetail {...flowProps} />}
        {isTodoList && <ApproveCom {...actProps} />}
        {subPersonModal.modalVisible && <SubPersonModal {...subPersonModalProps} />}
        {selectPrintModal.modalVisible && <SelectPrintModal {...selectPrintModalProps} />}
        {modalVisible && <Modal {...modalProps} />}
        {flowModalVisible && <FlowModal {...flowModalProps} />}
        {remarkModalVisible && <RemarkModal {...remarkModalProps} />}
        {layerDetModalVisible && <LayerDetModal {...layerDetModalProps} />}
        {dataModalVisible && <DataModal {...dataModalProps} />}
        {countModalVisible && <CountModal {...countModalProps} />}
        {fileModalVisible && <FileModal {...fileModalProps} />}

        {
          caseStatus > 13 ?
          <div>
            <AidMsg {...caseTabProps} />
            <AidMsgModal {...aidMsgModalProps} />
            <AidMsgChangeModal {...aidMsgChangeModalProps}/>
            {<AidMaterialModal {...aidMaterialModalProps} />}
            <Row className={styles.pb20}><SatisfactionModal {...caseTabProps} /></Row>
            <Row className={styles.pb20}><SuggestModal {...caseTabProps} /></Row>
            <Row className={styles.pb20}>
              <div className="card-container">
                <Tabs type="card">
                  {
                    caseStatus > 13 && caseStatus < 20 ?
                    <TabPane className="tabpanel" tab="受援人回访" key="1">
                      <RecipientVisit {...caseTabProps} />
                    </TabPane> : ''
                  }
                  {
                    caseStatus > 13 && caseStatus < 20 ?
                    <TabPane className="tabpanel" tab="庭审旁听" key="2">
                      <CourtHearing {...caseTabProps} />
                    </TabPane> : ''
                  }
                  {
                    caseStatus > 13 && caseStatus < 18 ?
                    <TabPane className="tabpanel" tab="终止法援" key="3">
                      <StopLegalAid {...caseTabProps} />
                    </TabPane> : ''
                  }
                </Tabs>
              </div>
            </Row>
          </div> : ''
        }

        <div className="card-container">
          <Tabs type="card" onTabClick={TabsChange}>
            <TabPane className="tabpanel" tab="案件信息" key="1">
              <CaseApplyerInfo {...caseTabProps} />
            </TabPane>
            <TabPane className="tabpanel" tab={caseBaseInfoData.lawAidType && caseBaseInfoData.lawAidType[0] === '2' ? '申请材料' : '通知文书及相关材料'} key="4">
              <BestoneUpload {...caseTabProps} />
            </TabPane>
            <TabPane className="tabpanel" tab="文书类材料" key="5">
              <DocMaterials {...caseTabProps} />
            </TabPane>
            <TabPane className="tabpanel" tab="事项日志" key="6">
              <CaseActLogInfo {...caseTabProps} />
            </TabPane>
            {
              caseStatus > 13 ?
              <TabPane className="tabpanel" tab="案件办理结果" key="7">
                 <UndertakeForm {...caseTabProps}/>
              </TabPane> : ''
            }
            {
              caseStatus > 13 ?
              <TabPane className="tabpanel" tab="查看案卷" key="8"></TabPane> : ''
            }
          </Tabs>
        </div>
      </div>
    </Spin>
  )
}

Detail.propTypes = {
  lawcaseDetail: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ lawcaseDetail, form, location, dispatch, loading }) => ({ lawcaseDetail, form, location, dispatch, loading }))(Detail)
