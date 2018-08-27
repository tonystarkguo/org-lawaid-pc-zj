import React from 'react'
import { Table, Modal } from 'antd'
import moment from 'moment'
import { jsUtil,config } from '../../utils'
import styles from './index.less'
const List = ({ location, ...listProps, selectedRowKeys, update }) => {
    // 列.
    const columns = [{
        title: '案件号',
        dataIndex: 'caseNo',
        key: 'caseNo',
         render: (text,record) => {
          	return  <div className={styles.qun}>
          		{record.involveCountCode == 'M' && <img src={config.qun}></img>}{text}
          	</div>
          }
    }, {
        title: '受援人姓名',
        dataIndex: 'rpName',
        key: 'rpName'
    }, {
        title: '案件类型',
        dataIndex: 'caseTypeName',
        key: 'caseTypeName'
    }, {
        title: '案由',
        dataIndex: 'reasonName',
        key: 'reasonName',
        render: (text) => {
          return jsUtil.setCaseReason(text)
        },
    }, {
        title: '申请时间',
        dataIndex: 'applyTime',
        key: 'applyTime',
        render : (text, record, index)=>{
            let tm = moment.unix(text/1000).format('YYYY-MM-DD HH:mm:ss');
            return (
                <span>{tm}</span>
            );
        }
    }, {
        title: '结案时间',
        dataIndex: 'endCaseTime',
        key: 'endCaseTime',
        render : (text, record, index)=>{
            let tm = moment.unix(text/1000).format('YYYY-MM-DD HH:mm:ss');
            return (
                <span>{tm}</span>
            );
        }
    }];
    // 行选择.
    const rowSelection = {
        selectedRowKeys : selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            update({
                selectedRows : selectedRows||[],
                selectedRowKeys : selectedRowKeys||[]
            });
        }
    };
    // DOM.
    return (
        <div>
            <Table
                {...listProps}
                bordered
                scroll={{ x: 700 }}
                rowSelection={rowSelection}
                columns={columns}
                simple
                rowKey={record => record.id}
            />
        </div>
    );
};

export default List;
