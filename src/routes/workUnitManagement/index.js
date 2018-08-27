import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const WorkUnitManagement = ({ location, dispatch, workUnitManagement, loading }) => {

  const { list, currentItem, modalVisible, pagination, modalType, searchKeys, allConfig } = workUnitManagement
  const { pageSize } = pagination

  const modalProps = {
    allConfig,
    modalType,
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['workUnitManagement/update'],
    title: `${modalType === 'create' ? '新增法律服务机构' : '编辑法律服务机构'}`,
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
        type: `workUnitManagement/${modalType}`,
        payload: data,
      })
    },
    onCancel() {
      dispatch({
        type: 'workUnitManagement/hideModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['workUnitManagement/query'],
    pagination,
    location,
    onChange(page) {
      dispatch({
        type: 'workUnitManagement/query',
        payload: {
          pageNum: page.current,
          pageSize: page.pageSize
        }
      })
    },
    onEditItem(item) {
      dispatch({
        type: 'workUnitManagement/showModal',
        payload: {
          modalType: 'update',
          currentItem: item
        },
      })
    },
    onDeleteItem(item) {
      dispatch({
        type: 'workUnitManagement/remove',
        payload: item.id,
      })
    },
  }

  const filterProps = {
    searchKeys,
    filter: {
      ...location.query,
    },
    onFilterChange(value) {
      dispatch({
        type: 'workUnitManagement/query',
        payload: {
          pageNum: 1,
          pageSize: 10
        }
      })
    },
    onSearch(fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/workUnitManagement',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/workUnitManagement',
      }))
    },
    onAdd() {
      dispatch({
        type: 'workUnitManagement/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    onFieldsChange(fields) {
      dispatch({
        type: 'workUnitManagement/updateFilterFields',
        payload: fields,
      })
    },
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

WorkUnitManagement.propTypes = {
  workUnitManagement: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ workUnitManagement, loading }) => ({ workUnitManagement, loading }))(WorkUnitManagement)