import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'
import AddModal from './AddModal'
import { message } from 'antd'

const ExpLib = ({location, dispatch, expLib, loading}) => {

  const { list, currentItem, importModalVisible, addModalVisible, pagination, 
  modalType, addModalType, modalList, allConfig, fileData, imgUrl, showDetail, searchKeys } = expLib
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
    // confirmLoading: loading.effects['expLib/update'],
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      console.log(data)
      if(data.mobile == '' || data.mobile == null){
        message.error('请选择一个法律援助人员！')
        return
      }
      dispatch({
          type: `expLib/${modalType}`,
          payload: data,
      })
    },
    onCancel() {
      dispatch({
          type: 'expLib/hideImportModal',
      })
    },
    onChange(page) {
      dispatch({
          type: 'expLib/import',
          payload: {
            pageNum: page.current,
            pageSize: page.pageSize
          },
      })
    },
    onFilterChange(value) {
      dispatch({
          type: 'expLib/import',
          payload: {
            ...value,
            pageNum: 1,
            pageSize: 5
          },
      })
    },
    onChoose(){
      dispatch({
        type: 'expLib/changeState',
      })
    }
  }

  const addModalProps = {
    allConfig,
    imgUrl,
    fileData,
    addModalType,
    item: addModalType === 'add' ? {} : currentItem,
    visible: addModalVisible,
    maskClosable: false,
    // confirmLoading: loading.effects['expLib/update'],
    title: `${addModalType === 'add' ? '新增人员' : '编辑人员'}`,
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      console.log(addModalType)
      dispatch({
          type: `expLib/${addModalType}`,
          payload: data,
      })
    },
    onCancel() {
      dispatch({
          type: 'expLib/hideAddModal',
      })
    },
    onUpdateFile(file) {
      dispatch({
          type: 'expLib/updateFile',
          payload: {file, fileData}
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['expLib/query'],
    pagination,
    location,
    onChange(page) {
      dispatch({
        type: 'expLib/query', 
        payload: {
          pageNum: page.current, 
          pageSize: page.pageSize
        }
      })
    },
    onDeleteItem(item) {
      dispatch({
          type: 'expLib/remove',
          payload: item,
      })
    },
    onBackItem(item) {
      dispatch({
          type: 'expLib/back',
          payload: item,
      })
    },
    onEditItem(item) {
      dispatch({
          type: 'expLib/showAddModal',
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
        type: 'expLib/query', 
        payload: {
          pageNum: 1, 
          pageSize: 10
        }
      })
    },
    onSearch(fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
          pathname: '/expLib',
          query: {
              field: fieldsValue.field,
              keyword: fieldsValue.keyword,
          },
      })) : dispatch(routerRedux.push({
          pathname: '/expLib',
      }))
    },
    onImport() {
      dispatch({
          type: 'expLib/import',
          payload: {
              modalType: 'create',
          },
      })
    },
    onAdd() {
      dispatch({
          type: 'expLib/showAddModal',
          payload: {
              addModalType: 'add',
          },
      })
    },
    onFieldsChange(fields){
      dispatch({
        type: 'expLib/updateFilterFields',
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

ExpLib.propTypes = {
  expLib: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ expLib, loading }) => ({ expLib, loading }))(ExpLib)