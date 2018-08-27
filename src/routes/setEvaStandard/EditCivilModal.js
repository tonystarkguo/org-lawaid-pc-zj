import React from 'react'
import { FilterItem } from '../../components'
import EditModal_one from './EditModal_one'
import { Form, Button, Row, Col, Modal, Radio, Input, Select, Card, message } from 'antd'
import styles from './index.less'
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

// 弹出框.
const EditCivilModal = ({
    update,
    visible,
    handleOk,
    handleCancel,
    loading,
    edit_items,
    dicEvaluationMethod,
    form : {
        getFieldDecorator,
        getFieldsValue,
        setFieldsValue,
        validateFieldsAndScroll
    }
}) => {

    // 临时添加条目.
    const handleAddItem = ()=> {
        edit_items.list.push({
            projectName : undefined,
            projectFraction : undefined,
            projectStandard : undefined,
            isDeleted : undefined,
            id : undefined,
            dicEvaluationMethod : dicEvaluationMethod
        })
        update({
            edit_items
        });
    }
    // 当前总分.
    let totalNum = 0;
    // 遍历条目的模型.
    let editModal_oneProps = [];
    edit_items.list.map( (item, index)=>{
        editModal_oneProps.push({
            update,
            edit_items : edit_items,
            dicEvaluationMethod : dicEvaluationMethod,
            item : item,
            index : index,
            handleSubmit : {}
        });
        if(item.isDeleted&&item.isDeleted.value == "1"){
            totalNum += item.projectFraction?(parseInt(item.projectFraction.value)||0):0;
        }
    } );
    // 如果是5分制，当前总分直接显示5分.
    if(dicEvaluationMethod == 1){
        totalNum = 5;
    }

    // 提交更新评估项目.
    const handleSubmit = (e)=> {
        e.preventDefault();
        let hasErr = false;
        let datas = [];
        for(let i in editModal_oneProps){
            let obj = editModal_oneProps[i].handleSubmit.checkAndGetData((err, data)=>{
                if(err){
                    hasErr = true;
                }
                else{
                    datas.push(data);
                }
            });
        }
        // 100分制的要计算下总分是否为100
        if(dicEvaluationMethod=="2"){
            let total = 0;
            datas.map((item,index)=>{
                if(!item.isDeleted){
                    total += item.projectFraction?(parseInt(item.projectFraction)||0):0;
                }
            });
            if(total!=100){
                hasErr = true;
                message.error("总分必须为100分");
            }
        }

        if(hasErr){
            return;
        }
        handleOk(datas);
    };
    // 格式化.
    const formItemLayout = {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 }
    };
    return (
        <div>
            <Modal
                className={styles.editModal}
                title={
                    <span>当前总分：<i className={totalNum>100?styles.red:styles.ok}>{totalNum}</i>分</span>
                }
                visible={visible}
                onOk={handleSubmit}
                onCancel={handleCancel}
                footer={[
                    <Button key="submit" type="primary" size="large" onClick={handleSubmit}>保存</Button>,
                    <Button key="back" size="large" onClick={handleCancel}>取消</Button>
                ]}
            >
                {edit_items.list.map((item, index)=>{
                    return (
                        <div key={index}>
                            <EditModal_one {...editModal_oneProps[index]} />
                        </div>
                    );
                })}
                <div className={styles.editModalAddItemC}>
                    <Button key="add" type="primary" size="large" onClick={handleAddItem}>添加项目</Button>
                </div>
                {dicEvaluationMethod==1?(
                    <Card bordered={false}>
                        <Row>
                            <Col span={2}>
                                &nbsp;
                            </Col>
                            <Col span={11}>
                                <FormItem {...formItemLayout} label="评估项目名称">
                                    <span>总评估得分</span>
                                </FormItem>
                            </Col>
                            <Col span={11}>
                                <FormItem {...formItemLayout} label="项目分数">
                                    <span>1、2、3、4、5</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className={styles.editModalCardC}>
                            <Col span={2}>
                                &nbsp;
                            </Col>
                            <Col span={11}>
                                <FormItem {...formItemLayout} label="项目标准">
                                    <span>评估实际得分</span>
                                </FormItem>
                            </Col>
                            <Col span={11}>
                                <FormItem {...formItemLayout} label="是否可用">
                                    <span>可用</span>
                                </FormItem>
                            </Col>
                        </Row>
                    </Card>
                ):''}
            </Modal>
        </div>
    );
};

export default Form.create({
    mapPropsToFields(props) {
        let edit_items = props.edit_items;
        return {
            ...edit_items
        };
    },
    onFieldsChange(props, fields) {
        props.update({
            edit_items : {
                ...props.edit_items,
                ...fields
            }
        });
    }
})(EditCivilModal);
