import React from 'react'
import { Table, Modal, Button } from 'antd'

const ModalList1 = ({ ...ModalList1Props, update, current_do_items}) => {
    // 选择一个条目.
    const selectItem = (item) => {
        // 先看是否已选择过，已选择过则不能再添加.
        let bfind = false;
        current_do_items.map((itemi,index)=>{
            if(itemi.id == item.id){
                bfind = true;
            }
        });
        if(bfind){
            return;
        }
        current_do_items.push(item);
        update({
            current_do_items : current_do_items
        });
    };
    // 列.
    const columns = [{
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
    }, {
        title: '证件号码',
        dataIndex: 'cardCode',
        key: 'cardCode'
    }, {
        title: '工作单位',
        dataIndex: 'lawfirmName',
        key: 'lawfirmName'
    }, {
        title: '联系电话',
        dataIndex: 'mobile',
        key: 'mobile'
    }, {
        title: '执业年限',
        dataIndex: 'workingYears',
        key: 'workingYears'
    }, {
        title: '业务专长',
        dataIndex: 'goodFields',
        key: 'goodFields'
    }, {
        title: '奖惩信息',
        dataIndex: 'gloryMemo',
        key: 'gloryMemo'
    }, {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (text, record) => <Button type="primary" onClick={selectItem.bind(this,record)}>选择</Button>
    }];
    const addP = ()=>{
        location.href="/expLib";
    };
    if(ModalList1Props.dataSource.length == 0){
        return (
            <Button key="submit" type="primary" size="large" onClick={addP}>添加质量评估专家</Button>
        );
    }
    // DOM.
    return (
        <div>
            <Table
                {...ModalList1Props}
                bordered
                scroll={{ x: 700 }}
                columns={columns}
                simple
                rowKey={record => record.id}
            />
        </div>
    );
};

export default ModalList1;
