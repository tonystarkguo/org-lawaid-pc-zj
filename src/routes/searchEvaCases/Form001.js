import React from 'react'
import styles from './index.less'
import { createDicNodes } from '../../utils'
import Form001_one from './Form001_one'
import { routerRedux } from 'dva/router'
const { createSelectOption } = createDicNodes
import { Breadcrumb, Row, Col, Form, Input, Button, Radio, Card, Select } from 'antd'
const Option = Select.Option
const FormItem = Form.Item
const { TextArea } = Input
/**
 * 质量评估表单.
 */

const Form001 = ({
    dispatch,
    edit_items,
    formdata001,
    submitScore,
    dicEvaluationMethod,
    update,
    caseId,
    form: {
        getFieldDecorator,
        getFieldsValue,
        setFieldsValue,
        validateFields,
    },
    searchEvaCases,
}) => {
  let score = ''

  const { search, appointId } = searchEvaCases
  const { editFlag } = search
    // 当前总分.
  let totalNum = 0
    // 遍历条目的模型.
  let form001_one_oneProps = []
  let indexi = 0
  edit_items.list.map((item, index) => {
    if (!item.isDeleted) {
      form001_one_oneProps.push({
        update,
        edit_items,
        dicEvaluationMethod,
        item,
        index: indexi,
        pos: index,
        handleSubmit: {},

      })
      indexi++
            // 如果是5分制，则总分使用总评估得分.
      if (dicEvaluationMethod == 1) {
        if (item.isTotalEval) {
          totalNum = item.projectScore.value
        }
      } else {
        totalNum += item.projectScore ? (parseInt(item.projectScore.value) || 0) : 0
      }
    } else {
      form001_one_oneProps.push({
        update,
        edit_items,
        dicEvaluationMethod,
        item,
        index: -1,
        pos: index,
        handleSubmit: {},
      })
    }
  })

    // 提交质量评估.
  const handleSubmit = (e) => {
    e.preventDefault()
    let hasErr = false
    let datas = []
    for (let i = 0, j = form001_one_oneProps.length; i < j; ++i) {
      let form001_one = form001_one_oneProps[i]
      if (form001_one.item.isDeleted) {
        continue
      }
      let obj = form001_one.handleSubmit.checkAndGetData((err, data) => {
        if (err) {
          hasErr = true
        } else {
          datas.push({
            ...data,
            dicEvaluationType: form001_one.item.dicEvaluationType,
            dicStatus: form001_one.item.dicStatus,
            projectFraction: form001_one.item.projectFraction,
            projectName: form001_one.item.projectName,
            projectStandard: form001_one.item.projectStandard,
            tCaseId: caseId,
          })
        }
      })
    }
    validateFields((err, values) => {
      if (hasErr) {
        return
      }
      if (!err) {
        let fields = getFieldsValue()
        submitScore({
          caseComment: fields.case_comment,
          caseId,
          evaluators: fields.evaluators,
          scoreList: datas,
        })
      }
    })
  }
  // 编辑保存质量评估.
  const saveForm = (e) => {
    e.preventDefault()
    let hasErr = false
    let datas = []
    for (let i = 0, j = form001_one_oneProps.length; i < j; ++i) {
      let form001_one = form001_one_oneProps[i]
      if (form001_one.item.isDeleted) {
        continue
      }
      let obj = form001_one.handleSubmit.checkAndGetData((err, data) => {
        if (err) {
          hasErr = true
        } else {
          datas.push({
            ...data,
            dicEvaluationType: form001_one.item.dicEvaluationType,
            dicStatus: form001_one.item.dicStatus,
            projectFraction: form001_one.item.projectFraction,
            projectName: form001_one.item.projectName,
            projectStandard: form001_one.item.projectStandard,
            tCaseId: caseId,
          })
        }
      })
    }
    validateFields((err, values) => {
      if (hasErr) {
        return
      }
      if (!err) {
        let fields = getFieldsValue()
        dispatch({
          type: 'searchEvaCases/saveEditData',
          payload: {
            appointId,
            caseComment: fields.case_comment,
            caseId,
            evaluators: fields.evaluators,
            scoreList: datas,
          },
        })
        // submitScore()
      }
    })
  }
  // 取消操作.
  const cancelAct = (e) => {
    e.preventDefault()
    dispatch(routerRedux.push({
      pathname: '/searchEvaCases',
      query: {
        ...search,
        type: '1',
        editFlag: '0',
      },
    }))
  }
    // 如果是5分制，当前总分进行调整文案.
  if (dicEvaluationMethod == 1) {
    if (totalNum < 3) {
      score = '不合格'
    } else if (totalNum == 3) {
      score = '合格'
    } else if (totalNum == 4) {
      score = '良好'
    } else if (totalNum == 5) {
      score = '优秀'
    }
  } else {
    score = totalNum
  }
    // DOM
  return (
        <Card title={(
                <div className={styles.scoreTitle}>质量评估得分：{score}</div>
            )}
          extra={(
                <div>
                    {editFlag !== '1' ? <Button type="primary" onClick={handleSubmit}>
                        提交质量评估
                    </Button> : <div>
                    <Button type="primary" style={{ marginRight: 5 }} onClick={saveForm}>
                        保存
                    </Button>
                    <Button type="primary" onClick={cancelAct}>
                        取消
                    </Button></div>}
                </div>
            )}
        >
            {edit_items.list.map((item, index) => {
              if (item.isDeleted) {
                return <div key={index}></div>
              }
              return (
                    <div key={index}>
                        <Form001_one {...form001_one_oneProps[index]} />
                    </div>
              )
            })}
            <Row gutter={24} type="flex">
                <Col width="20px">{indexi + 1}、</Col>
                <Col span={18}>
                    案件质量评价：
                    <Row gutter={24} type="flex" align="middle">
                        <Col span={18}>
                            <FormItem>
                                {getFieldDecorator('case_comment', { rules: [{
                                  required: true, message: '请填写案件质量评价',
                                }],
                                })(
                                <TextArea rows={4} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row gutter={24} type="flex">
                <Col width="20px">{indexi + 2}、</Col>
                <Col span={18}>
                    评估小组成员：
                    <Row gutter={24} type="flex" align="middle">
                        <Col span={18}>
                            <FormItem>
                                {getFieldDecorator('evaluators', { rules: [{
                                  required: true, message: '请填写评估小组成员',
                                }],
                                })(
                                <TextArea rows={4} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Card>
  )
}

export default Form.create({
  mapPropsToFields (props) {
    let formdata001 = props.formdata001
    return {
      ...formdata001,
    }
  },
  onFieldsChange (props, fields) {
    props.update({
      formdata001: {
        ...props.formdata001,
        ...fields,
      },
    })
  },
})(Form001)
