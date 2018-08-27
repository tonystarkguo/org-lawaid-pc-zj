import React from 'react'
import styles from './index.less'
import { createDicNodes } from '../../utils'
const {createSelectOption} = createDicNodes
import { Breadcrumb, Row, Col, Form, Input, Button, Radio, Card, Select } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
/**
 * 质量评估表单.
 */
const InitCard = ({
    initForm,
    submitForm,
    update,
    form : {
        getFieldDecorator,
        getFieldsValue,
        setFieldsValue,
        validateFieldsAndScroll
    }
}) => {
    // 提交质量评估.
    const handleSubmit = (e)=> {
        e.preventDefault();
        // 校验.
        validateFieldsAndScroll((err, values) => {
            if(!err) {
                let fields = getFieldsValue();
                submitForm(fields);
            }
        });
    };
    // DOM
    return (
        <Card className={styles.initCard}>
            <div className={styles.initCardTitle}>请选择本中心的评估方式</div>
            {/* <div className={styles.initCardWarn}>注意：选择后将不能修改</div> */}
            <div className={styles.initCardSplit1}>
                <div className={styles.initCardTitle_Radioc1}>
                    <FormItem>
                        {getFieldDecorator('dicEvaluationMethod', {rules: [{
                            required: true, message: '请选择',
                        }]
                        })(
                        <RadioGroup>
                            <Radio className={styles.initCardTitle_Radio} value={1}>5分制(每项最高5分，最终评价得分满分为5分)</Radio>
                            <Radio className={styles.initCardTitle_Radio} value={2}>100分制(总分为100分)</Radio>
                        </RadioGroup>
                        )}
                    </FormItem>
                </div>
            </div>
            <div className={styles.initCardTitle}>请选择需要评估的卷宗</div>
            <div className={styles.initCardSplit2}>
                <div className={styles.initCardTitle_Radioc2}>
                    <FormItem>
                        {getFieldDecorator('dicEvaluateType', {rules: [{
                            required: true, message: '请选择',
                        }]
                        })(
                        <RadioGroup>
                            <Radio className={styles.initCardTitle_Radio} value={1}>承办卷</Radio>
                            <Radio className={styles.initCardTitle_Radio} value={2}>二卷合一</Radio>
                        </RadioGroup>
                        )}
                    </FormItem>
                </div>
            </div>
            <div className={styles.initCardButtonc}>
                <Button type="primary" onClick={handleSubmit}>
                    确定
                </Button>
            </div>
        </Card>
    );
};

export default Form.create({
    mapPropsToFields(props) {
        let initForm = props.initForm;
        return {
            ...initForm
        };
    },
    onFieldsChange(props, fields) {
        props.update({
            initForm : {
                ...props.initForm,
                ...fields
            }
        });
    }
})(InitCard);
