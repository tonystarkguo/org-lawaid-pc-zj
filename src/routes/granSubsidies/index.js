import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const GranSubsidies = ({ location, dispatch, loading, granSubsidies }) => {

  const { list, currentItem, modalVisible, pagination, modalType, exportList, okText,
    standardBack, subsidyFeeBack, interpretationFeeBack, otherFeeBack, lessFeeBack, searchKeys } = granSubsidies
  const { pageSize } = pagination

  const modalProps = {
    standardBack,
    subsidyFeeBack,
    interpretationFeeBack,
    otherFeeBack,
    lessFeeBack,
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['granSubsidies/update'],
    // title: `${modalType === 'create' ? '新增' : '编辑'}`,
    wrapClassName: 'vertical-center-modal',
    okText: okText,
    onOk(data) {
      if(okText == '提交发放'){
      dispatch({
          type: 'granSubsidies/open',
          payload: data,
      })
    }else{
      dispatch({
        type: 'granSubsidies/edit',
        payload: data,
      })
    }
    },
    onCancel() {
      dispatch({
          type: 'granSubsidies/hideModal',
      })
    },
    onStandardChange(value) {
      dispatch({
          type: 'granSubsidies/setStandard',
          payload: value
      })
    },
    onSubsidyFeeChange(value) {
      dispatch({
          type: 'granSubsidies/setSubsidyFee',
          payload: value
      })
    },
    onInterpretationFeeChange(value) {
      dispatch({
          type: 'granSubsidies/setInterpretationFee',
          payload: value
      })
    },
    onOtherFeeChange(value) {
      dispatch({
          type: 'granSubsidies/setOtherFee',
          payload: value
      })
    },
    onLessFeeChange(value) {
      dispatch({
          type: 'granSubsidies/setLessFee',
          payload: value
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['granSubsidies/query'],
    pagination,
    location,
    onChange(page) {
      dispatch({
        type: 'granSubsidies/query', 
        payload: {
          pageNum: page.current, 
          pageSize: page.pageSize
        }
      })
    },
    onLook(item){
      dispatch(routerRedux.push(`/lawcase/${item.id}`))
    },
    onOpen(item){
      dispatch({
        type: 'granSubsidies/showModal',
        payload: {
            modalType: 'update',
            currentItem: item
        },
      })
    },
    onEdit(item){
      dispatch({
        type: 'granSubsidies/showEditModal',
        payload: {
            modalType: 'edit',
            currentItem: item
        },
      })
    },
    handleSelect(item){
      dispatch({
        type: 'granSubsidies/setExportList',
        payload: item
      })
    }
  }

  const filterProps = {
    searchKeys,
    exportList,
    filter: {
        ...location.query,
    },
    onFilterChange(value) {
      dispatch({
        type: 'granSubsidies/query', 
        payload: {
          pageNum: 1, 
          pageSize: 10
        }
      })
    },
    onSearch(fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
          pathname: '/granSubsidies',
          query: {
              field: fieldsValue.field,
              keyword: fieldsValue.keyword,
          },
      })) : dispatch(routerRedux.push({
          pathname: '/granSubsidies',
      }))
    },
    onFieldsChange(fields){
      dispatch({
        type: 'granSubsidies/updateFilterFields',
        payload: fields,
      })
    },
    onExport(){
      dispatch({
        type: 'granSubsidies/export',
        payload: exportList,
      })
    }
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

GranSubsidies.propTypes = {
  granSubsidies: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ granSubsidies, loading }) => ({ granSubsidies, loading }))(GranSubsidies)