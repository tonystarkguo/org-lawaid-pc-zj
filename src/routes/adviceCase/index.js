import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const AdviceCase = ({ location, dispatch, loading, adviceCase }) => {

  const { list, currentItem, modalVisible, pagination, modalType } = adviceCase
  const { pageSize } = pagination

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['adviceCase/update'],
    title: `${modalType === 'create' ? '新增' : '编辑'}`,
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
          type: `adviceCase/${modalType}`,
          payload: data,
      })
    },
    onCancel() {
      dispatch({
          type: 'adviceCase/hideModal',
      })
    }
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['adviceCase/query'],
    pagination,
    location,
    onChange(page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
          pathname,
          query: {
              ...query,
              pageNum: page.current,
              pageSize: page.pageSize,
          },
      }))
    },
  }

  const filterProps = {
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
          pathname: '/adviceCase',
          query: {
              field: fieldsValue.field,
              keyword: fieldsValue.keyword,
          },
      })) : dispatch(routerRedux.push({
          pathname: '/adviceCase',
      }))
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

AdviceCase.propTypes = {
  adviceCase: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ adviceCase, loading }) => ({ adviceCase, loading }))(AdviceCase)