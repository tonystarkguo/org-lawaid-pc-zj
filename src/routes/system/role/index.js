import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import style from './index.less'
import Filter from './Filter'
import Modal from './Modal'

//采用无状态stateless的方式定义react component
const Role = ({location, dispatch, role, loading}) => {
    //预处理传入的数据
    const {list, pagination, currentItem, modalVisible, modalType, isMotion} = role
    const {pageSize} = pagination

    const modalProps = {
      role,
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      maskClosable: false,
      confirmLoading: loading.effects['role/update'],//这个是干啥的？
      title: `${modalType === 'create' ? '创建' : '更新'}`,
      wrapClassName: 'vertical-center-modal',
      onOk(data) {
        dispatch({
            type: `role/onOk`,
            payload: data,
        })
      },
      onCancel() {
        dispatch({
            type: 'role/hideModal',
        })
      },
      onCheck(data) {
        dispatch({
            type: 'role/onCheck',
            data: data
        })        
      }
    }

    const listProps = {
      dataSource: list,
      loading: loading.effects['role/query'],
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
              type: 'role/delete',
              payload: id,    
          })
      },
      onEditItem(item) {
          dispatch({
              type: 'role/onEditItem',
              payload: {
                  modalType: 'update',
                  currentItem: item,
              },
          })
      },
      onAssignTask(id) {
          dispatch({
              type: 'role/showAssignTaskModal',
              payload: id
          })
      },
      onUpdateItem(item, t){
          dispatch({
              type: 'role/updateItem',
              payload: {
                  currentItem: item,
                  updateType: t
              }
          })
      }
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
      onAdd() {
          dispatch({
              type: 'role/showModal',
              payload: {
                  modalType: 'create',
              },
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
Role.propTypes = {
  role: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ role, loading }) => ({ role, loading }))(Role)