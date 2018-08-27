import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Col, Form, Input } from 'antd'
import styles from './index.less'

const FormItem = Form.Item

const Info = ({
  info,
  dispatch,
}) => {
  const { content } = info
  return (
  	<div className={styles.content}>
  		<p>{content}</p>
  	</div>
  )
}

Info.propTypes = {
  info: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ info }) => ({ info }))(Info)
