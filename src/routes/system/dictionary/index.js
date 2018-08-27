import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'
//采用无状态stateless的方式定义react component
const Dictionary = ({location, dispatch, dictionary, loading}) => {
    //预处理传入的数据
    const {list, pagination, currentItem, modalVisible, modalType, isMotion, role, caseStatus} = dictionary
    const {pageSize} = pagination
    const modalProps = {
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      maskClosable: false,
        confirmLoading: loading.effects['dictionary/update'],//这个是干啥的？
        title: `${modalType === 'update' ? '修改' : '创建'}`,
        wrapClassName: 'vertical-center-modal',
        onOk(data) {
          if((modalType === 'create') || (modalType === 'addKey')) {
            dispatch({
              type: 'dictionary/create',
              payload: data,
            })            
          }else {
            dispatch({
              type: 'dictionary/update',
              payload: data,
            }) 
          }
        },
        onCancel() {
          dispatch({
            type: 'dictionary/hideModal',
          })
        },
      }

      const listProps = {
        dataSource: list,
        loading: loading.effects['dictionary/query'],
        pagination,
        location,
        isMotion,
        onChange(page) {
          const {query, pathname} = location
          dispatch(routerRedux.push({
            pathname,
            query: {
              ...query,
              page: page.current,
              pageSize: page.pageSize,
            },
          }))
          dispatch({
            type: 'dictionary/query',
            payload: {
              pageNum: page.current,
              pageSize: page.pageSize,              
            }
          })
        },
        onDeleteItem(id) {
          dispatch({
            type: 'dictionary/delete',
            payload: id,
          })
        },
        onEditItem(item) {
          dispatch({
            type: 'dictionary/showModal',
            payload: {
              modalType: 'update',
              currentItem: item,
            },
          })
        },
        onAddKey(item) {
          const addKeyItem = {
            labelName: item.labelName,
            type: item.type
          }
          dispatch({
            type: 'dictionary/showModal',
            payload: {
              modalType: 'addKey',
              currentItem: addKeyItem,
            },
          })
        },
        onAssignTask(id) {
          dispatch({
            type: 'dictionary/showAssignTaskModal',
            payload: id
          })
        },
        onUpdateItem(item, t){
          dispatch({
            type: 'dictionary/updateItem',
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
            pathname: '/dictionary',
            query: {
              field: fieldsValue.field,
              keyword: fieldsValue.keyword,
            },
          })) : dispatch(routerRedux.push({
            pathname: '/dictionary',
          }))
        },
        onAdd() {
          dispatch({
            type: 'dictionary/showModal',
            payload: {
              modalType: 'create',
            },
          })
        },
        switchIsMotion() {
          dispatch({
            type: 'dictionary/switchIsMotion'
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
Dictionary.propTypes = {
  dictionary: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ dictionary, loading }) => ({ dictionary, loading }))(Dictionary) //用户表格容器