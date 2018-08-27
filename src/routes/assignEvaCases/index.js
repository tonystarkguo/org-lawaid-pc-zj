import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import MyModal from './MyModal'
import { Button } from 'antd';
import styles from './index.less';
/**
 * 指派评估案件.
 */
const AssignEvaCases = ({ location, dispatch, loading, assignEvaCases }) => {
    // 通用数据更新.
    const update = (value)=>{
        dispatch({
            type: 'assignEvaCases/update',
            payload: {
                ...value
            }
        });
    };
    // 指派评估案件.
    const assignCase = (e) => {
        update({
            showAssignCase : true
        });
        // 同时初始化加载数据.
        dispatch({
            type: 'assignEvaCases/refresh_modal_list',
            payload: {
                selectType : 1
            }
        }); 
    };
    // 过滤器模型.
    const filterProps = {
        update : update,
        filter : assignEvaCases.filter,
        caseType_list : assignEvaCases.caseType_list,
        caseReason_list : assignEvaCases.caseReason_list,
        new_dic_standing: assignEvaCases.new_dic_standing,
        assignEvaCases: assignEvaCases,
        // 搜索.
        onFilterChange(value) {
            dispatch(routerRedux.push({
                pathname: location.pathname,
                query: {
                    ...value,
                    pageNum: 1,
                    pageSize: assignEvaCases.pagination.pageSize
                }
            }));
        },
         handleCaseTypeChange1(value) {
    dispatch({ type: 'assignEvaCases/handleCaseTypeChange', value })
  }
    };
    // 列表模型.
    const listProps = {
        update : update,
        dataSource: assignEvaCases.list,
        loading: loading.effects['assignEvaCases/refresh_list'],
        pagination : assignEvaCases.pagination,
        location,
        selectedRowKeys : assignEvaCases.selectedRowKeys||[],
        onChange(page) {
            const { query, pathname } = location
            dispatch(routerRedux.push({
                pathname,
                query: {
                    ...query,
                    pageNum: page.current,
                    pageSize: page.pageSize,
                }
            }))
        },
    };
    // 弹出框模型.
    const myModalProps = {
        update : update,
        loading : loading,
        ...assignEvaCases,
        dispatch : dispatch,
        // 加载数据.
        loadingData(value){
            dispatch({
                type: 'assignEvaCases/refresh_modal_list',
                payload: {
                    ...value
                }
            }); 
        },
        // 取消的时候重置数据.
        handleCancel(){
            update({
                showAssignCase : false,
                selectType : 1,
                current_do_items : []
            });
        },
        // 提交指派.
        handleOk(){
            // 同时初始化加载数据.
            dispatch({
                type: 'assignEvaCases/assesmentAppoint',
                payload: {}
            }); 
        }
    }
    // DOM
    return (
        <div className="content-inner">
            <Filter {...filterProps} />
            <div className={styles.btc}>
            {assignEvaCases.selectedRows&&assignEvaCases.selectedRows.length>0?
                <Button type="primary" onClick={assignCase}>指派评估案件</Button>
                :
                <Button type="primary" disabled>指派评估案件</Button>
            }
            </div>
            <List {...listProps} />
            <MyModal {...myModalProps} />
        </div>
    );
};
export default connect(({ assignEvaCases, loading }) => ({ assignEvaCases, loading }))(AssignEvaCases);