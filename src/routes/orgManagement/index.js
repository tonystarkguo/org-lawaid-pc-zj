import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const OrgManagement = ({ location, dispatch, orgManagement, loading }) => {

  const { list, currentItem, modalVisible, pagination, modalType,
    timeAmBg, timeAmEd, timePmBg, timePmEd, searchKeys } = orgManagement
  const { pageSize } = pagination

  const modalProps = {
    timeAmBg,
    timeAmEd,
    timePmBg,
    timePmEd,
    modalType,
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['orgManagement/update'],
    title: `${modalType === 'create' ? '新增工作站' : '编辑工作站'}`,
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
        type: `orgManagement/${modalType}`,
        payload: data,
      })
    },
    onCancel() {
      dispatch({
        type: 'orgManagement/hideModal',
      })
    },
    timeAmBgChange(timeString) {
      dispatch({
        type: 'orgManagement/timeAmBgChange',
        payload: timeString
      })
    },
    timeAmEdChange(timeString) {
      dispatch({
        type: 'orgManagement/timeAmEdChange',
        payload: timeString
      })
    },
    timePmBgChange(timeString) {
      dispatch({
        type: 'orgManagement/timePmBgChange',
        payload: timeString
      })
    },
    timePmEdChange(timeString) {
      dispatch({
        type: 'orgManagement/timePmEdChange',
        payload: timeString
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['orgManagement/query'],
    pagination,
    location,
    onChange(page) {
      dispatch({
        type: 'orgManagement/query',
        payload: {
          pageNum: page.current,
          pageSize: page.pageSize
        }
      })
    },
    onEditItem(item) {
      dispatch({
        type: 'orgManagement/showModal',
        payload: {
          modalType: 'update',
          currentItem: item
        },
      })
    },
    onDeleteItem(item) {
      dispatch({
        type: 'orgManagement/remove',
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
        type: 'orgManagement/query',
        payload: {
          pageNum: 1,
          pageSize: 10
        }
      })
    },
    onSearch(fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/orgManagement',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/orgManagement',
      }))
    },
    onAdd() {
      dispatch({
        type: 'orgManagement/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    onFieldsChange(fields) {
      dispatch({
        type: 'orgManagement/updateFilterFields',
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

OrgManagement.propTypes = {
  orgManagement: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ orgManagement, loading }) => ({ orgManagement, loading }))(OrgManagement)