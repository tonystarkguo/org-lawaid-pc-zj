import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const OrgPersonManagement = ({location, dispatch, orgPersonManagement, loading}) => {

  const { list, currentItem, modalVisible, pagination, modalType, roles, info, searchKeys } = orgPersonManagement
  const { pageSize } = pagination

  const modalProps = {
    info,
    roles,
    modalType,
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['orgPersonManagement/update'],
    title: `${modalType === 'create' ? '新增' : '编辑'}`,
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
          type: `orgPersonManagement/${modalType}`,
          payload: data,
      })
    },
    onCancel() {
      dispatch({
          type: 'orgPersonManagement/hideModal',
      })
    }
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['orgPersonManagement/query'],
    pagination,
    location,
    onChange(page) {
      dispatch({
        type: 'orgPersonManagement/query', 
        payload: {
          pageNum: page.current, 
          pageSize: page.pageSize,
        }
      })
    },
    receiveSms(item) {
      dispatch({
          type: 'orgPersonManagement/receiveSms',
          payload:{
            tOrmUserId:item.tOrmUserId,
            status:item.isSms,
          }
      })
    },
    onDeleteItem(item) {
      dispatch({
          type: 'orgPersonManagement/remove',
          payload: item.tOrmUserId,
      })
    },
    onEditItem(item) {
      dispatch({
          type: 'orgPersonManagement/getMsg',
          payload: {
              modalType: 'update',
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
        type: 'orgPersonManagement/query', 
        payload: {
          pageNum: 1, 
          pageSize: 10
        }
      })
    },
    onSearch(fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
          pathname: '/orgPersonManagement',
          query: {
              field: fieldsValue.field,
              keyword: fieldsValue.keyword,
          },
      })) : dispatch(routerRedux.push({
          pathname: '/orgPersonManagement',
      }))
    },
    onAdd() {
      dispatch({
          type: 'orgPersonManagement/showModal',
          payload: {
              modalType: 'create',
          },
      })
    },
    onFieldsChange(fields){
      dispatch({
        type: 'orgPersonManagement/updateFilterFields',
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

OrgPersonManagement.propTypes = {
  orgPersonManagement: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ orgPersonManagement, loading }) => ({ orgPersonManagement, loading }))(OrgPersonManagement)