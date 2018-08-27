import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'
import AddModal from './AddModal'
import { message } from 'antd'

const AidPersonManagement = ({location, dispatch, aidPersonManagement, loading}) => {

  const { list, currentItem, importModalVisible, addModalVisible, pagination, 
  modalType, addModalType, modalList, allConfig, fileData, imgUrl, showDetail, searchKeys } = aidPersonManagement
  const { layerList, layerPagination } = modalList
  const { pageSize } = pagination

  const importModalProps = {
    showDetail,
    dataSource: layerList,
    pagination: layerPagination,
    // item: modalType === 'create' ? {} : currentItem,
    // title: `${modalType === 'create' ? '导入' : '编辑'}`,
    visible: importModalVisible,
    maskClosable: false,
    // confirmLoading: loading.effects['aidPersonManagement/update'],
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      console.log(data)
      if(data.mobile == '' || data.mobile == null){
        message.error('请选择一个法律援助人员！')
        return
      }
      dispatch({
          type: `aidPersonManagement/${modalType}`,
          payload: data,
      })
    },
    onCancel() {
      dispatch({
          type: 'aidPersonManagement/hideImportModal',
      })
    },
    onChange(page,value) {
      dispatch({
          type: 'aidPersonManagement/import',
          payload: {
            ...value,
            pageNum: page.current,
            pageSize: page.pageSize
          },
      })
    },
    onFilterChange(value) {
      dispatch({
          type: 'aidPersonManagement/import',
          payload: {
            ...value,
            pageNum: 1,
            pageSize: 5
          },
      })
    },
    onChoose(){
      dispatch({
        type: 'aidPersonManagement/changeState',
      })
    },
    onAdd() {
      dispatch({
          type: 'aidPersonManagement/showAddModal',
          payload: {
              addModalType: 'add',
          },
      })
    },
  }

  const addModalProps = {
    allConfig,
    imgUrl,
    fileData,
    addModalType,
    item: addModalType === 'add' ? {} : currentItem,
    visible: addModalVisible,
    maskClosable: false,
    // confirmLoading: loading.effects['aidPersonManagement/update'],
    title: `${addModalType === 'add' ? '新增人员' : '编辑人员'}`,
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      console.log(addModalType)
      dispatch({
          type: `aidPersonManagement/${addModalType}`,
          payload: data,
      })
    },
    onCancel() {
      dispatch({
          type: 'aidPersonManagement/hideAddModal',
      })
    },
    onUpdateFile(file) {
      dispatch({
          type: 'aidPersonManagement/updateFile',
          payload: {file, fileData}
      })
    },
    onShowSizeChange(file) {
      dispatch({
        type: 'aidPersonManagement/updateFile',
        payload: {file, fileData}
    })
    }
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['aidPersonManagement/query'],
    pagination,
    location,
    onChange(page) {
      dispatch({
        type: 'aidPersonManagement/query', 
        payload: {
          pageNum: page.current, 
          pageSize: page.pageSize
        }
      })
    },
    onDeleteItem(item) {
      dispatch({
          type: 'aidPersonManagement/remove',
          payload: item,
      })
    },
    onBackItem(item) {
      dispatch({
          type: 'aidPersonManagement/back',
          payload: item,
      })
    },
    onEditItem(item) {
      dispatch({
          type: 'aidPersonManagement/showAddModal',
          payload: {
              addModalType: 'edit',
              currentItem: item
          },
      })
    }
  }

  const filterProps = {
    searchKeys,
    filter: {
        ...location.query,
    },
    onFilterChange(value) {
      dispatch({
        type: 'aidPersonManagement/query', 
        payload: {
          pageNum: 1, 
          pageSize: 10
        }
      })
    },
    onSearch(fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
          pathname: '/aidPersonManagement',
          query: {
              field: fieldsValue.field,
              keyword: fieldsValue.keyword,
          },
      })) : dispatch(routerRedux.push({
          pathname: '/aidPersonManagement',
      }))
    },
    onImport() {
      dispatch({
          type: 'aidPersonManagement/import',
          payload: {
              modalType: 'create',
          },
      })
    },
    onFieldsChange(fields){
      dispatch({
        type: 'aidPersonManagement/updateFilterFields',
        payload: fields,
      })
    },
  }

  return (
    <div className="content-inner">
      
  		<Filter {...filterProps} />
  		<List {...listProps} />
  		{importModalVisible && <Modal {...importModalProps} />}
      {addModalVisible && <AddModal {...addModalProps} />}
	  </div>
  )
}

AidPersonManagement.propTypes = {
  aidPersonManagement: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ aidPersonManagement, loading }) => ({ aidPersonManagement, loading }))(AidPersonManagement)