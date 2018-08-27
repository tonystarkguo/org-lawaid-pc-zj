import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

//采用无状态stateless的方式定义react component
const OperationTeamInfo = ({location, dispatch, operationTeamInfo, loading}) => {
  //预处理传入的数据
  const {list, pagination, currentItem, modalVisible, modalType, isMotion, caseStatus, allRole } = operationTeamInfo
  const { pageSize } = pagination

  const userObj = JSON.parse(localStorage.getItem('user'))
  const roles = userObj && userObj.roles
  const isAdmin = roles[0] && roles[0].id === 3 ? true : false

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    allRole,
    confirmLoading: loading.effects['operationTeamInfo/update'],//这个是干啥的？
    title: `${modalType === 'create' ? '创建' : '更新'}`,
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
          type: `operationTeamInfo/${modalType}`,
          payload: data,
      })
    },
    onCancel() {
      dispatch({
          type: 'operationTeamInfo/hideModal',
      })
    }
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['operationTeamInfo/query'],
    pagination,
    location,
    isMotion,
    isAdmin,
    caseStatus,
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
          type: 'operationTeamInfo/delete',
          payload: id,
      })
    },
    onEditItem(item) {
      dispatch({
          type: 'operationTeamInfo/showModal',
          payload: {
              modalType: 'update',
              currentItem: item
          },
      })
    }
  }

  const filterProps = {
    isMotion,
    isAdmin,
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
          pathname: '/operationTeamInfo',
          query: {
              field: fieldsValue.field,
              keyword: fieldsValue.keyword,
          },
      })) : dispatch(routerRedux.push({
          pathname: '/operationTeamInfo',
      }))
    },
    switchIsMotion() {
      dispatch({
          type: 'operationTeamInfo/switchIsMotion'
      })
    },
    onAdd() {
      dispatch({
          type: 'operationTeamInfo/showModal',
          payload: {
              modalType: 'create',
          },
      })
    }
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

/*对组件的输入参数类型进行限制，增加程序稳定性*/
OperationTeamInfo.propTypes = {
  operationTeamInfo: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

/*导出组件，这里用到了dva封装redux 的connect, 在dva中一般将路由组件当做容器组件*/
export default connect(({ operationTeamInfo, loading }) => ({ operationTeamInfo, loading }))(OperationTeamInfo)