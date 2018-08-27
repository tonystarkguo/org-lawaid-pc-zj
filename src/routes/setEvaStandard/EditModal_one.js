import React from 'react'
import { FilterItem } from '../../components'
import { Form, Button, Row, Col, Modal, Radio, Input, Select, Card, InputNumber } from 'antd'
import styles from './index.less'
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

// 弹出框.
const EditModal_one = ({
    update,
    item,
    edit_items,
    dicEvaluationMethod,
    index,
    handleSubmit,
    form : {
        getFieldDecorator,
        getFieldsValue,
        setFieldsValue,
        validateFieldsAndScroll
    }
}) => {
    // 提交更新评估项目.
    handleSubmit.checkAndGetData = (fcb)=> {
        // 校验.
        validateFieldsAndScroll((err, values) => {
            if(!err) {
                let fields = getFieldsValue();
                let new_item;
                // 总分的话使用原来的.
                if(item.isTotalEval){
                    new_item = {
                        ...item,
                        isDeleted : false,
                        projectName : item.projectName.valuse,
                        projectFraction : item.projectFraction.value,
                        projectStandard : item.projectStandard.value
                    }
                }
                else{
                    new_item = {
                        ...item,
                        isDeleted : fields.isDeleted == 1?false:true,
                        projectName : fields.projectName,
                        projectFraction : fields.projectFraction,
                        projectStandard : fields.projectStandard
                    }
                }
                return fcb(null, new_item);
            }
            fcb(err);
        });
    };
    if(item.isTotalEval){
        return (<div></div>);
    }
    // 格式化.
    const formItemLayout = {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 }
    };
    return (
        <Card bordered={false}>
            <Row>
                <Col span={2}>
                    <span className={styles.editModalIndex}>{index+1}、</span>
                    {false&&edit_items.list.length>2?(
                        <Button type="danger" size="small" onClick={handleDelItem.bind(this,item,index)}>删除</Button>
                    ):""}
                </Col>
                <Col span={11}>
                    <FormItem {...formItemLayout} label="评估项目名称">
                        {getFieldDecorator("projectName", {rules: [{
                            required: true, message: '请填写',
                        }]
                        })(
                        <Input placeholder="" />
                        )}
                    </FormItem>
                </Col>
                <Col span={11}>
                    {dicEvaluationMethod==1?(
                        <FormItem {...formItemLayout} label="项目分数">
                            <span>1、2、3、C、N/A</span>
                        </FormItem>
                    ):(
                        <FormItem {...formItemLayout} label="项目分数">
                            {getFieldDecorator("projectFraction", {rules: [{
                                required: true, message: '请填写',
                            }]
                            })(
                            <InputNumber min={1} max={100} placeholder="" className={styles.block}  />
                            )}
                        </FormItem>
                    )}
                </Col>
            </Row>
            <Row className={styles.editModalCardC}>
                <Col span={2}>
                    &nbsp;
                </Col>
                <Col span={11}>
                    <FormItem {...formItemLayout} label="项目标准">
                        {getFieldDecorator("projectStandard", {rules: [{
                            required: true, message: '请填写',
                        }]
                        })(
                        <TextArea rows={4} />
                        )}
                    </FormItem>
                </Col>
                <Col span={11}>
                    <FormItem {...formItemLayout} label="是否可用">
                        {getFieldDecorator("isDeleted", {rules: [{
                            required: true, message: '请选择',
                        }]
                        })(
                        <Select className={styles.block} placeholder="请选择">
                            <Option value="1">可用</Option>
                            <Option value="0">不可用</Option>
                        </Select>
                        )}
                    </FormItem>
                </Col>
            </Row>
        </Card>
    );
};

export default Form.create({
    mapPropsToFields(props) {
        let item = props.item;
        return {
            ...item
        };
    },
    onFieldsChange(props, fields) {
        let edit_items = props.edit_items;
        edit_items.list[props.index] = {
            ...props.item,
            ...fields
        }
        props.update({
            edit_items : edit_items
        });
    }
})(EditModal_one);
