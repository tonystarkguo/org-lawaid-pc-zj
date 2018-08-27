import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const AdviceSort = ({ location, dispatch, loading, adviceSort }) => {

  const { currentItem, modalVisible, modalType, searchKeys } = adviceSort
  const beSignList = adviceSort.beSign.list
  const beReplyList = adviceSort.beReply.list
  const beSignPagination = adviceSort.beSign.pagination
  const beReplyPagination = adviceSort.beReply.pagination

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['adviceSort/update'],
    title: `${modalType === 'create' ? '新增' : '编辑'}`,
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
          type: `adviceSort/${modalType}`,
          payload: data,
      })
    },
    onCancel() {
      dispatch({
          type: 'adviceSort/hideModal',
      })
    }
  }

  const beSignListProps = {
    location,
    pagination: beSignPagination,
    dataSource: beSignList,
    onChange(page) {
      dispatch({
        type: 'adviceSort/beSignQuery', 
        payload: {
          pageNum: page.current, 
          pageSize: page.pageSize,
          dicConsultStatus: 'beSign',
          dicConsultSource: 'online',
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
        type: 'adviceSort/sign',
        payload: {
          item: item,
        }
      })
    },
    onBack(item){
      dispatch({
        type: 'adviceSort/back',
        payload: {
          item: item,
        }
      })
    }
  }

  const beReplyListProps = {
    ...beSignListProps,
    pagination: beReplyPagination,
    dataSource: beReplyList,
    onChange(page){
      dispatch({
        type: 'adviceSort/beReplyQuery', 
        payload: {
          pageNum: page.current, 
          pageSize: page.pageSize,
          dicConsultStatus: 'myBeReply',
          dicConsultSource: 'online',
        }
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
        type: 'adviceSort/beSignQuery', 
        payload: {
          pageNum: 1, 
          pageSize: 10,
          dicConsultStatus: 'beSign',
          dicConsultSource: 'online',
        }
      })
    },
    onSearch(fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
          pathname: '/adviceSort',
          query: {
              field: fieldsValue.field,
              keyword: fieldsValue.keyword,
          },
      })) : dispatch(routerRedux.push({
          pathname: '/adviceSort',
      }))
    },
    onFieldsChange(fields){
      dispatch({
        type: 'adviceSort/updateFilterFields',
        payload: fields,
      })
    },
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...beSignListProps} />
      <List {...beReplyListProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

AdviceSort.propTypes = {
  adviceSort: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ adviceSort, loading }) => ({ adviceSort, loading }))(AdviceSort)