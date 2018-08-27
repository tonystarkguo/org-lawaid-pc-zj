import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

//采用无状态stateless的方式定义react component
const AidInfo = ({location, dispatch, aidInfo, loading}) => {
  //预处理传入的数据
  const {list, pagination, currentItem, modalVisible, modalType, isMotion, role, caseStatus} = aidInfo
  const {pageSize} = pagination

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['aidInfo/update'],//这个是干啥的？
    title: `${modalType === 'create' ? '创建' : '更新'}`,
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
        dispatch({
            type: 'aidInfo/hideModal',
            payload: data,
        })
    },
    onCancel() {
        dispatch({
            type: 'aidInfo/hideModal',
        })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['aidInfo/query'],
    pagination,
    location,
    onChange(page) {
        const {query, pathname} = location
        dispatch(routerRedux.push({
            pathname,
            query: {
                ...query,
                pageNum: page.current,
                pageSize: page.pageSize,
            },
        }))
    },
    onDeleteItem(id) {
        dispatch({
            type: 'aidInfo/delete',
            payload: id,
        })
    },
    onEditItem(item) {
        dispatch({
            type: 'aidInfo/showModal',
            payload: {
                modalType: 'update',
                currentItem: item,
            },
        })
    },
    onAssignTask(id) {
        dispatch({
            type: 'aidInfo/showAssignTaskModal',
            payload: id
        })
    },
    onUpdateItem(item, t){
        dispatch({
            type: 'aidInfo/updateItem',
            payload: {
                currentItem: item,
                updateType: t
            }
        })
    },
    role,
    caseStatus
  }

  const filterProps = {
    isMotion,
    filter: {
        ...location.query,
    },
    onFilterChange(value) {
        dispatch(routerRedux.push({
            pathname: location.pathname,
            query: {
                ...value,
                page: 1,
                pageSize,
            },
        }))
    },
    onSearch(fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
          pathname: '/aidInfo',
          query: {
              field: fieldsValue.field,
              keyword: fieldsValue.keyword,
          },
      })) : dispatch(routerRedux.push({
          pathname: '/aidInfo',
      }))
    },
    onAdd() {
        dispatch({
            type: 'aidInfo/showModal',
            payload: {
                modalType: 'create',
            },
        })
    },
    switchIsMotion() {
        dispatch({
            type: 'aidInfo/switchIsMotion'
        })
    },
  }

  //渲染组件并返回供其他组件调用
  return (
    <div className="content-inner">
  		<Filter {...filterProps} />
  		<List {...listProps} />
  		{modalVisible && <Modal {...modalProps} />}
	 </div>
  )
}

AidInfo.propTypes = {
  aidInfo: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ aidInfo, loading }) => ({ aidInfo, loading }))(AidInfo)
