import React from 'react'
import PropTypes from 'prop-types'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import List from './List'
import Filter from './Filter'
import Uploader from '../common/Uploader.js'

// 采用无状态stateless的方式定义react component
const Lawcases = ({location, dispatch, lawcases, loading}) => {
  // 预处理传入的数据
  const {
    list,
    signedLawcases,
    pagination,
    extPagination,
    role,
    caseStatus,
    listType,
    allConfig,
    searchKeys,
    allArea,
  } = lawcases
  const {pageSize} = pagination

  const listProps = {
    dataSource: list,
    loading: loading.effects['lawcases/getCaseList'],
    pagination,
    location,
    onChange(page) {
      dispatch({type: 'lawcases/changePageWithCriterial', payload: {pageNum: page.current, pageSize: page.pageSize}})
    },
    onUpdateItem(item, t) {
      dispatch({
        type: 'lawcases/updateItem',
        payload: {
          currentItem: item,
          updateType: t,
        },
      })
    },
    onViewDetails(item) {
      dispatch(routerRedux.push(`/lawcase/${item.caseId}`))
      localStorage.setItem('chengbanItem',JSON.stringify(item))
    },
    onDelete(item) {
      dispatch({
        type: 'lawcases/delete',
        payload: item.caseId,
      })
    },
    role,
    caseStatus,
  }

  const extListProps = {
    ...listProps,
    pagination: extPagination,
    dataSource: signedLawcases,
    onChange(page){
      dispatch({type: 'lawcases/changePageOnly', payload: {pageNum: page.current, pageSize: page.pageSize}})
    }
  }

  const filterProps = {
    searchKeys,
    allConfig,
    allArea,
    filter: {
      ...location.query,
    },
    onFilterChange(value) {
      dispatch({type: 'lawcases/changePageWithCriterial', payload: {pageNum: 1, pageSize: 5}})
    },

    onSearch(fieldsValue) {
      fieldsValue.keyword.length
        ? dispatch(routerRedux.push({
          pathname: '/lawcases',
          query: {
            field: fieldsValue.field,
            keyword: fieldsValue.keyword,
          },
        }))
        : dispatch(routerRedux.push({pathname: '/lawcases'}))
    },
    onFieldsChange(fields) {
      dispatch({type: 'lawcases/save_fields', payload: fields})
    },
  }
/*  const uploaderProps = {
    handleFileChange: ({file, fileList}) => {
      console.log(fileList)
    },
    handleFileRemove:({file}) => {
      console.log(file)
    },
  }
  <Uploader {...uploaderProps}/>

  */
  // 渲染组件并返回供其他组件调用
  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...listProps} />
      {
        listType !== '10' ? <div><div style={{height: 0, border: "1px solid #c7c2c2", marginTop: 20, marginBottom: 30}} />
      <List {...extListProps} /></div>: ''
      }
      

    </div>
  )
}
// 对组件的输入参数类型进行限制，增加程序稳定性 Lawcases.propTypes = {     lawcases: PropTypes.object,
//     location: PropTypes.object,     dispatch: PropTypes.func,     loading:
// PropTypes.Object } 导出组件，这里用到了dva封装redux 的connect, 在dva中一般将路由组件当做容器组件
Lawcases.propTypes = {
  lawcases: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({lawcases, loading}) => ({lawcases, loading}))(Lawcases) // 用户表格容器
