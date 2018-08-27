import React from 'react'
import { FilterItem } from '../../components'
import { Form, Button, Row, Col, Modal, Radio, Input, Select, Card, InputNumber } from 'antd'
import styles from './index.less'
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
import { createDicNodes } from '../../utils'
const { createSelectOption } = createDicNodes

// 每行数据.
const Form001_one = ({
    update,
    item,
    edit_items,
    dicEvaluationMethod,
    index,
    pos,
    handleSubmit,
    form: {
        getFieldDecorator,
        getFieldsValue,
        setFieldsValue,
        validateFields,
    },
}) => {
    // 提交更新评估项目.
  handleSubmit.checkAndGetData = (fcb) => {
        // 校验.
    validateFields((err, values) => {
      if (!err) {
        let fields = getFieldsValue()
        let new_item
        new_item = {
          ...item,
          projectScore: fields.projectScore,
        }
        return fcb(null, new_item)
      }
      fcb(err)
    })
  }
    // 根据分值给一个列表.
  let scoreList = []
  if (dicEvaluationMethod == 2) {
    for (let i = 1, j = parseInt(item.projectFraction); i <= j; ++i) {
      scoreList.push({
        label: `${i}分`,
        value: i.toString(),
      })
    }
  } else {
    scoreList.push({ label: '1分', value: '1' })
    scoreList.push({ label: '2分', value: '2' })
    scoreList.push({ label: '3分', value: '3' })
    if (item.isTotalEval) {
      scoreList.push({ label: '4分', value: '4' })
      scoreList.push({ label: '5分', value: '5' })
    } else {
      scoreList.push({ label: 'C', value: '4' })
      scoreList.push({ label: 'N/A', value: '5' })
    }
  }

    // 格式化.
  const formItemLayout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
  }
  return (
        <Row gutter={24} type="flex" align="top">
            <Col width="20px">{index + 1}、</Col>
            <Col span={18}>
                {item.projectName}<br />{item.isTotalEval != true ? (<span>评估标准：{item.projectStandard}</span>) : ''}
                <Row gutter={24} type="flex" align="top" className={styles.formItemC}>
                    <Col width="20px"><span className={styles.formItemTitle}>得分：</span></Col>
                    <Col span={18}>
                        <FormItem>
                            {getFieldDecorator('projectScore', { rules: [{
                              required: true, message: '请选择分值',
                              initialValue: '2' || '',
                            }],
                            })(
                            <Select allowClear placeholder="请选择" className={styles.selectItem}>
                                {scoreList.map((item, index) => {
                                  return <Option key={item.value} value={item.value}>{item.label}</Option>
                                })
                                }
                            </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Col>
        </Row>
  )
}
export default Form.create({
  mapPropsToFields (props) {
    let item = props.item
    return {
      ...item,
    }
  },
  onFieldsChange (props, fields) {
    let edit_items = props.edit_items
    edit_items.list[props.pos] = {
      ...props.item,
      ...fields,
    }
    props.update({
      edit_items,
    })
  },
})(Form001_one)
