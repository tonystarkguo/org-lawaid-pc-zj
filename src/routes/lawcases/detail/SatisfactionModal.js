import React from 'react'
import PropTypes from 'prop-types'
import { Form, Card } from 'antd'
import styles from './index.less'
import { jsUtil } from '../../../utils/'

const SatisfactionModal = ({ lawcaseDetail }) => {

  let appraiseInfo = lawcaseDetail.appraiseInfo || {}

  return (
    <Card title="受援人满意度评价">
      <div>
        <p className={styles.gutterRow}>承办人服务态度：{appraiseInfo.dicAttitudeName === undefined ? '未评价' : appraiseInfo.dicAttitudeName}</p>
        <p className={styles.gutterRow}>办案过程中沟通交流情况：{appraiseInfo.dicInterflowName === undefined ? '未评价' : appraiseInfo.dicInterflowName}</p>
        <p className={styles.gutterRow}>承办人维护合法权益情况：{appraiseInfo.dicMaintainName === undefined ? '未评价' : appraiseInfo.dicMaintainName}</p>
        <p className={styles.gutterRow}>对案件的结果是否满意：{appraiseInfo.dicResultName === undefined ? '未评价' : appraiseInfo.dicResultName}</p>
        <p className={styles.gutterRow}>总体评价：{appraiseInfo.dicSummaryName === undefined ? '未评价' : appraiseInfo.dicSummaryName}</p>
        <p className={styles.gutterRow}>是否有违规收受财物行为：{appraiseInfo.isIllegal === undefined ? '未评价' : (appraiseInfo.isIllegal?'是':'否')}</p>
      </div>
    </Card>
  )
}

SatisfactionModal.propTypes = {
  lawcaseDetail: PropTypes.object,
}

export default Form.create()(SatisfactionModal)
