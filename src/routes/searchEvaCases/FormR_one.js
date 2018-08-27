import React from 'react'
import { FilterItem } from '../../components'
import { Form, Button, Row, Col, Modal, Radio, Input, Select, Card, InputNumber } from 'antd'
import styles from './index.less'
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
import { createDicNodes } from '../../utils'
const {createSelectOption} = createDicNodes

// 每行数据.
const FormR_one = ({
    dicEvaluationMethod,
    item,
    index
}) => {
    // 格式化.
    const formItemLayout = {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 }
    };
    let score = item.projectScore;
    // 如果是5分制，当前总分进行调整文案.
    if(dicEvaluationMethod == 1&&!item.isTotalEval){
        if(score == 4){
            score = "C";
        }
        else if(score == 5){
            score = "N/A";
        }
    }
    return (
        <Row gutter={24} type="flex" align="top">
            <Col width="20px"><span>{index+1}、</span></Col>
            <Col span={18}>
                {item.projectName}{item.isTotalEval!=true?(<div>评估标准：{item.projectStandard}</div>):''}
                <span>得分：</span><span>{score}</span>
                <br/><br/>
            </Col>
        </Row>
    );
};
export default FormR_one;