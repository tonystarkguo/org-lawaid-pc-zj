import React from 'react'
import PropTypes from 'prop-types'
import { Form, Card } from 'antd'
import styles from './index.less'

const SuggestModal = ({ lawcaseDetail }) => {

  let judgeOpinion = lawcaseDetail.judgeOpinion || {}

  return (
    <Card title="法官意见征询">
      <p className={styles.gutterRow}>诉讼礼仪（遵守法庭秩序；尊重诉讼参加人；着装得体）：{judgeOpinion.dicEtiquetteName}</p>
      <p className={styles.gutterRow}>专业素养（语言表达准确；办案思路清晰；引用法律适当；应对变化恰当）：{judgeOpinion.dicAccomplishmentName}</p>
      <p className={styles.gutterRow}>职业精神（工作态度认真；办案尽职尽责）：{judgeOpinion.dicDedicationName}</p>
      <p className={styles.gutterRow}>法官意见：{judgeOpinion.suggestion}</p>
    </Card>
  )
}

SuggestModal.propTypes = {
  lawcaseDetail: PropTypes.object,
}

export default Form.create()(SuggestModal)
