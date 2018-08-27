import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

//采用无状态stateless的方式定义react component
const Ordermanage = ({location, dispatch, ordermanage, loading}) => {
    //预处理传入的数据
    const {list, pagination, currentItem, modalVisible, modalType, isMotion, role, caseStatus} = ordermanage
    const {pageSize} = pagination

    const modalProps = {
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      maskClosable: false,
      confirmLoading: loading.effects['ordermanage/update'],//这个是干啥的？
      title: `${modalType === 'create' ? '创建' : '更新'}`,
      wrapClassName: 'vertical-center-modal',
      onOk(data) {
          console.log(data)
          dispatch({
              type: `ordermanage/hideModal`,
              payload: data,
          })
      },
      onCancel() {
          dispatch({
              type: 'ordermanage/hideModal',
          })
      },
    }

    const listProps = {
      dataSource: list,
      loading: loading.effects['ordermanage/query'],
      pagination,
      location,
      isMotion,
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
              type: 'ordermanage/delete',
              payload: id,
          })
      },
      onEditItem(item) {
          dispatch({
              type: 'ordermanage/showModal',
              payload: {
                  modalType: 'update',
                  currentItem: item,
              },
          })
      },
      onAssignTask(id) {
          dispatch({
              type: 'ordermanage/showAssignTaskModal',
              payload: id
          })
      },
      onUpdateItem(item, t){
          dispatch({
              type: 'ordermanage/updateItem',
              payload: {
                  currentItem: item,
                  updateType: t
              }
          })
      },
      role
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
                  pageNum: 1,
                  pageSize,
              },
          }))
      },
      onSearch(fieldsValue) {
          fieldsValue.keyword.length ? dispatch(routerRedux.push({
              pathname: '/ordermanage',
              query: {
                  field: fieldsValue.field,
                  keyword: fieldsValue.keyword,
              },
          })) : dispatch(routerRedux.push({
              pathname: '/ordermanage',
          }))
      },
      onAdd() {
          dispatch({
              type: 'ordermanage/showModal',
              payload: {
                  modalType: 'create',
              },
          })
      },
      switchIsMotion() {
          dispatch({
              type: 'ordermanage/switchIsMotion'
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

/*对组件的输入参数类型进行限制，增加程序稳定性*/
Ordermanage.propTypes = {
  ordermanage: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ ordermanage, loading }) => ({ ordermanage, loading }))(Ordermanage)