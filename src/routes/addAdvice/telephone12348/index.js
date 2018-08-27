import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const Telephone12348 = ({ location, dispatch, loading, telephone12348 }) => {

  const { list, currentItem, modalVisible, pagination, modalType, searchKeys } = telephone12348
  const { pageSize } = pagination

  /*const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['telephone12348/update'],
    title: `${modalType === 'create' ? '新增' : '编辑'}`,
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
          type: `telephone12348/${modalType}`,
          payload: data,
      })
    },
    onCancel() {
      dispatch({
          type: 'telephone12348/hideModal',
      })
    }
  }*/

  const listProps = {
    dataSource: list,
    loading: loading.effects['telephone12348/query'],
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
    onViewDetails(item){
      dispatch(routerRedux.push(`/adviceDet/${item.id}`))
    },
    onReply(item){
      dispatch(routerRedux.push(`/adviceEdit/${item.id}`))
    },
    onSign(item){
      dispatch({
        type: 'telephone12348/sign',
        payload: {
          item: item,
        }
      })
    },
    onBack(item){
      dispatch({
        type: 'telephone12348/back',
        payload: {
          item: item,
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
        type: 'telephone12348/query', 
        payload: {
          pageNum: 1, 
          pageSize: 10
        }
      })
    },
    onSearch(fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
          pathname: '/telephone12348',
          query: {
              field: fieldsValue.field,
              keyword: fieldsValue.keyword,
          },
      })) : dispatch(routerRedux.push({
          pathname: '/telephone12348',
      }))
    },
    onFieldsChange(fields){
      dispatch({
        type: 'telephone12348/updateFilterFields',
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

Telephone12348.propTypes = {
  telephone12348: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ telephone12348, loading }) => ({ telephone12348, loading }))(Telephone12348)