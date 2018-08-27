import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const AdviceQuery = ({ location, dispatch, loading, adviceQuery }) => {

  const { list, currentItem, modalVisible, pagination, modalType, searchKeys,allArea=[] } = adviceQuery
  const { pageSize } = pagination

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['adviceQuery/update'],
    title: `${modalType === 'create' ? '新增' : '编辑'}`,
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
          type: `adviceQuery/${modalType}`,
          payload: data,
      })
    },
    onCancel() {
      dispatch({
          type: 'adviceQuery/hideModal',
      })
    }
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['adviceQuery/query'],
    pagination,
    location,
    onChange(page) {
      dispatch({
        type: 'adviceQuery/query', 
        payload: {
          pageNum: page.current, 
          pageSize: page.pageSize
        }
      })
    },
    onViewDetails(item){
      dispatch(routerRedux.push(`/adviceDet/${item.id}`))
    },
    
    onReply(item){
      dispatch(routerRedux.push(`/adviceEdit/${item.id}`))
    },
    onSign(item){
      dispatch({
        type: 'adviceQuery/sign',
        payload: item
      })
    },
    onBack(item){
      dispatch({
        type: 'adviceQuery/back',
        payload: item
      })
    }
  }

  const filterProps = {
    searchKeys,
    allArea,
    filter: {
        ...location.query,
    },
    onFilterChange(value) {
      dispatch({
        type: 'adviceQuery/query', 
        payload: {
          pageNum: 1, 
          pageSize: 10
        }
      })
    },
    onSearch(fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
          pathname: '/adviceQuery',
          query: {
              field: fieldsValue.field,
              keyword: fieldsValue.keyword,
          },
      })) : dispatch(routerRedux.push({
          pathname: '/adviceQuery',
      }))
    },
    onFieldsChange(fields){
      dispatch({
        type: 'adviceQuery/updateFilterFields',
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

AdviceQuery.propTypes = {
  adviceQuery: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ adviceQuery, loading }) => ({ adviceQuery, loading }))(AdviceQuery)