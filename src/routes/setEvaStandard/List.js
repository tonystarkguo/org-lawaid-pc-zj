import React from 'react'
import { Table, Modal, Button } from 'antd'
import styles from './index.less';
import { routerRedux } from 'dva/router'

const List = ({ ...listProps, update, pagination }) => {
    let {dicEvaluationMethod} = listProps;
    let columns = [];
    // 5分制.
    if(dicEvaluationMethod == 1){
        // 列
        columns = [{
            title: '项目编号',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => <span>{(pagination.pageSize*(pagination.current-1))+index+1}</span>
        }, {
            title: '评分项目',
            dataIndex: 'projectName',
            key: 'projectName',
        }, {
            title: '项目分值',
            dataIndex: 'projectFraction',
            key: 'projectFraction',
            render: (text, record, index) => <span>5</span>
        }, {
            title: '评分标准',
            dataIndex: 'projectStandard',
            key: 'projectStandard',
            width:700
        }, {
            title: '是否可用',
            dataIndex: 'isDeleted',
            key: 'isDeleted',
            render : ((text, record, index)=>{
                return (
                    <span>{record.isDeleted?'不可用':'可用'}</span>
                );
            })
        }];
    }
    // 100分制.
    else{
        // 列.
        columns = [{
            title: '项目编号',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => <span>{(pagination.pageSize*(pagination.current-1))+index+1}</span>
        }, {
            title: '评分项目',
            dataIndex: 'projectName',
            key: 'projectName'
        }, {
            title: '项目分值',
            dataIndex: 'projectFraction',
            key: 'projectFraction'
        }, {
            title: '评分标准',
            dataIndex: 'projectStandard',
            key: 'projectStandard',
            width:700
        }, {
            title: '是否可用',
            dataIndex: 'isDeleted',
            key: 'isDeleted',
            render : ((text, record, index)=>{
                return (
                    <span>{record.isDeleted?'不可用':'可用'}</span>
                );
            })
        }];
    }
    
    // DOM.
    return (
        <div>
            <Table
                {...listProps}
                bordered
                scroll={{ x: 700 }}
                columns={columns}
                simple
                rowKey={record => record.id}
            />
        </div>
    );
};

export default List;
