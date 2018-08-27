import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from '../../components'
import { Form, Button, Row, Col, Modal, Radio } from 'antd'
import styles from './index.less'
import ModalList1 from './ModalList1.js'
import ModalList2 from './ModalList2.js'
import ModalSearch1 from './ModalSearch1.js'
import ModalSearch2 from './ModalSearch2.js'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

// 弹出框.可以指派质量评估专家或者中心工作人员.
const MyModal = ({
    update,
    showAssignCase,
    handleOk,
    handleCancel,
    selectType,
    modal_list1,
    modal_list2,
    loadingData,
    modal_pagination1,
    modal_pagination2,
    modal_search1,
    modal_search2,
    loading,
    current_do_items
}) => {
    // 值改变.
    const changeSelectType = (ev) => {
        update({
            current_do_items : []
        });
        loadingData({
            selectType : ev.target.value,
            pageNum: 1
        });
    };
    const itemsDel = (index) => {
        current_do_items.splice(index,1);
        update({
            current_do_items : current_do_items
        });
    };
    // 列表1模型.
    const ModalList1Props = {
        dataSource: modal_list1,
        loading: loading.effects['assignEvaCases/refresh_modal_list'],
        pagination: modal_pagination1,
        current_do_items : current_do_items,
        update,
        onChange(page, filters, sorter) {
            loadingData({
                selectType : 1,
                pageNum: page.current,
                pageSize : page.pageSize,
                orderKey : sorter.columnKey||"",
                order : sorter.order||""
            });
        }
    };
    // 列表2模型.
    const ModalList2Props = {
        dataSource: modal_list2,
        loading: loading.effects['assignEvaCases/refresh_modal_list'],
        pagination : modal_pagination2,
        current_do_items : current_do_items,
        update,
        onChange(page, filters, sorter) {
            loadingData({
                selectType : 2,
                pageNum: page.current,
                pageSize : page.pageSize,
                orderKey : sorter.columnKey||"",
                order : sorter.order||""
            });
        }
    };
    // 搜索框1模型.
    const Modal_Search1Props ={
        modal_search1 : modal_search1,
        update,
        onFilterChange(modal_search1) {
            loadingData({
                selectType : 1,
                ...modal_search1,
                pageNum: 1
            });
        }
    };
    // 搜索框2模型.
    const Modal_Search2Props = {
        modal_search2 : modal_search2,
        update,
        onFilterChange(modal_search2) {
            loadingData({
                selectType : 2,
                ...modal_search2,
                pageNum: 1
            });
        }
    };
    // DOM.
    const domList = selectType == 1 ? 
    (
        <div>
            <ModalSearch1 {...Modal_Search1Props} />
            <ModalList1 {...ModalList1Props}></ModalList1>
        </div>
    )
     :
    (
        <div>
            <ModalSearch2 {...Modal_Search2Props} />
            <ModalList2 {...ModalList2Props}></ModalList2>
        </div>
    );
    const footer = current_do_items&&current_do_items.length>0 ? 
    (   <Button key="submit" type="primary" size="large" onClick={handleOk}>确认指派</Button>   )
    :
    (   <Button key="submit" type="primary" size="large" disabled>确认指派</Button>     )
    ;
    return (
        <div>
            <Modal
                className={styles.modal}
                title="指派评估案件"
                visible={showAssignCase}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" size="large" onClick={handleCancel}>取消</Button>,
                    footer
                ]}
            >
                <div className={styles.split}>
                    <RadioGroup value={selectType} size="large" onChange={changeSelectType}>
                        <RadioButton value={1}>请选择质量评估专家</RadioButton>
                        <RadioButton value={2}>请选择中心工作人员</RadioButton>
                    </RadioGroup>
                </div>
                {domList}
                <div>
                {current_do_items&&current_do_items.length>0?
                    <div>
                        当前选中的律师信息：<br/>
                        {current_do_items.map((item, index)=>{
                            return (
                                <div key={index} className={styles.selectedItemc} >
                                    {item.headPic?(
                                        <img className={styles.selectedItemImg} src={item.headPic} />
                                    ):(
                                        <div className={styles.selectedItemImgNo}>暂无头像</div>
                                    )}
                                    <div className={styles.selectedItemName}>{item.name}</div>
                                    <div className={styles.selectedItemWorkUnit}>{item.workUnit}</div>
                                    <Button className={styles.selectedItemDel} type="primary" size="small" onClick={itemsDel.bind(this,index)}>取消选择</Button>
                                </div>
                            );
                        })}
                        
                        
                    </div>
                :''}
                </div>
            </Modal>
        </div>
    );
};
export default MyModal;
