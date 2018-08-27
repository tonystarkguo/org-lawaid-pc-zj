import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'
//采用无状态stateless的方式定义react component
const RecipientInfo = ({location, dispatch, recipientInfo, loading}) => {
    //预处理传入的数据
    const {list, pagination, currentItem, modalVisible, modalType, isMotion, role, caseStatus} = recipientInfo
    const {pageSize} = pagination

    const modalProps = {
        item: modalType === 'create' ? {} : currentItem,
        visible: modalVisible,
        maskClosable: false,
        confirmLoading: loading.effects['recipientInfo/update'],//这个是干啥的？
        title: `${modalType === 'create' ? '创建' : '更新'}`,
        wrapClassName: 'vertical-center-modal',
        onOk(data) {
            dispatch({
                type: 'recipientInfo/hideModal',
                payload: data,
            })
        },
        onCancel() {
            dispatch({
                type: 'recipientInfo/hideModal',
            })
        },
    }

    const listProps = {
        dataSource: list,
        loading: loading.effects['recipientInfo/query'],
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
                type: 'recipientInfo/delete',
                payload: id,
            })
        },
        onEditItem(item) {
            dispatch({
                type: 'recipientInfo/showModal',
                payload: {
                    modalType: 'update',
                    currentItem: item,
                },
            })
        },
        onAssignTask(id) {
            dispatch({
                type: 'recipientInfo/showAssignTaskModal',
                payload: id
            })
        },

        onUpdateItem(item, t){
            dispatch({
                type: 'recipientInfo/updateItem',
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
                    pageNum: 1,
                    pageSize,
                },
            }))
        },
        onSearch(fieldsValue) {
            fieldsValue.keyword.length ? dispatch(routerRedux.push({
                pathname: '/recipientInfo',
                query: {
                    field: fieldsValue.field,
                    keyword: fieldsValue.keyword,
                },
            })) : dispatch(routerRedux.push({
                pathname: '/recipientInfo',
            }))
        },
        onAdd() {
            dispatch({
                type: 'recipientInfo/showModal',
                payload: {
                    modalType: 'create',
                },
            })
        },
        switchIsMotion() {
            dispatch({
                type: 'recipientInfo/switchIsMotion'
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
//对组件的输入参数类型进行限制，增加程序稳定性
// RecipientInfo.propTypes = {
//     recipientInfo: PropTypes.object,
//     location: PropTypes.object,
//     dispatch: PropTypes.func,
//     loading: PropTypes.Object
// }
//导出组件，这里用到了dva封装redux 的connect, 在dva中一般将路由组件当做容器组件
RecipientInfo.propTypes = {
  recipientInfo: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ recipientInfo, loading }) => ({ recipientInfo, loading }))(RecipientInfo) //用户表格容器

// const mapStateToProps = ({recipientInfo, loading}) => ({
//     recipientInfo,
//     loading
// })
// export default connect(mapStateToProps)(RecipientInfo)