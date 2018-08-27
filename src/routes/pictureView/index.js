import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button } from 'antd'
import React, { Component } from 'react';
import styles from './index.less';

const PictureView = ({
  pictureView,
  dispatch,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
  }
}) => {

  let current = pictureView.current
  let total = pictureView.picArr.length

  const handlePrevious = (i) => {
    dispatch({
      type: 'pictureView/handlePrevious',
      payload: current + i
    })
  }

  const handleNext = (i) => {
    dispatch({
      type: 'pictureView/handleNext',
      payload: current + i
    })
  }

  return (
    <div className={styles.clearfix}>
      <div className={styles.fl}>
          <div className={styles.picWrap}>
            <img src={pictureView.picArr[`${current}`].url} />
          </div>

          <div className={styles.center}>
            <Button type="primary" disabled={current+1 <= 1} onClick={e => handlePrevious(-1)}>上一页</Button>
            <span className={styles.margin10}>第 {current+1 || '--'} 张，共 {total || '--'} 张</span>
            <Button type="primary" disabled={current+1 >= total} onClick={e => handleNext(1)}>下一页</Button>
          </div>
      </div>
      <div className={styles.fl}></div>
    </div>
  )
}

PictureView.propTypes = {
  form: PropTypes.object,
  pictureView: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ pictureView }) => ({ pictureView }))(Form.create()(PictureView)) 

