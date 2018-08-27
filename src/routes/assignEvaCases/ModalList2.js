import React from 'react'
import { Table, Modal, Button } from 'antd'

const ModalList2 = ({ ...ModalList2Props, update, current_do_items}) => {
    // 选择一个条目.
    const selectItem = (item) => {
        current_do_items.splice(0,current_do_items.length,item);
        update({
            current_do_items : current_do_items
        });
    };
    // 列.
    const columns = [{
        title: '人员编号',
        dataIndex: 'id',
        key: 'id'
    }, {
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
    }, {
        title: '性别',
        dataIndex: 'dicGenderName',
        key: 'dicGenderName'
    }, {
        title: '所属机构',
        dataIndex: 'orgName',
        key: 'orgName'
    }, {
        title: '法源年限',
        dataIndex: 'workYear',
        key: 'workYear'
    }, {
        title: '政治面貌',
        dataIndex: 'dicPoliticalStatusName',
        key: 'dicPoliticalStatusName'
    }, {
        title: '学历',
        dataIndex: 'dicEduLevelName',
        key: 'dicEduLevelName'
    }, {
        title: '学校和专业',
        dataIndex: 'graduationSchool',
        key: 'graduationSchool'
    }, {
        title: '民族',
        dataIndex: 'dicNationName',
        key: 'dicNationName'
    }, {
        title: '任职日期',
        dataIndex: 'takeOfficeDate',
        key: 'takeOfficeDate'
    }, {
        title: '职位',
        dataIndex: 'duties',
        key: 'duties'
    }, {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (text, record) => <Button type="primary" onClick={selectItem.bind(this,record)}>选择</Button>
    }];
    const addP = ()=>{
        location.href="/orgPersonManagement";
    };
    if(ModalList2Props.dataSource.length == 0){
        return (
            <Button key="submit" type="primary" size="large" onClick={addP}>添加中心工作人员</Button>
        );
    }
    // DOM.
    return (
        <div>
            <Table
                {...ModalList2Props}
                bordered
                scroll={{ x: 700 }}
                columns={columns}
                simple
                rowKey={record => record.id}
            />
        </div>
    );
};

export default ModalList2;
