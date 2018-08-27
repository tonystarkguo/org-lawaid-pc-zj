import React from 'react'
import PropTypes from 'prop-types'
import { Form, Card, Row, Col } from 'antd'
import styles from './index.less'

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({ lawcaseDetail }) => {

  return (
    <Card title="法律援助人员信息">
      <Row gutter={16}>
        <Col span={12}>
          <p className={styles.gutterRow}>工作机构：</p>
          <p className={styles.gutterRow}>职业：</p>
          <p className={styles.gutterRow}>所属机构：</p>
          <p className={styles.gutterRow}>是否12348律师：</p>
        </Col>
        <Col span={12}>
          <p className={styles.gutterRow}>法律援助人员名称：</p>
          <p className={styles.gutterRow}>联系方式：</p>
          <p className={styles.gutterRow}>工作年限：</p>
          <p className={styles.gutterRow}>擅长领域：</p>
        </Col>
      </Row>
    </Card>
  )
}

modal.propTypes = {
  lawcaseDetail: PropTypes.object,
}

export default Form.create()(modal)
