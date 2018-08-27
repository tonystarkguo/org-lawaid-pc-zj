import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button } from 'antd'
import React, { Component } from 'react'
import { render } from 'react-dom'
import ReactPDF from 'react-pdf'
import styles from './index.less'

let componentRenderCount = 0

class WrappedReactPDF extends ReactPDF {
  componentDidMount () {
    super.componentDidMount()
  }

  componentWillReceiveProps (nextProps) {
    super.componentWillReceiveProps(nextProps)
  }

  componentWillUpdate () {
    componentRenderCount += 1
  }
}

WrappedReactPDF.propTypes = ReactPDF.propTypes

const SearchEvaCasesDetail = ({
  searchEvaCasesDetail,
  dispatch,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
  },
}) => {
  const { file, pageWidth } = searchEvaCasesDetail
  let pageIndex = searchEvaCasesDetail.pageIndex
  let pageNumber = searchEvaCasesDetail.pageNumber
  let pageRenderCount = searchEvaCasesDetail.pageRenderCount
  let total = searchEvaCasesDetail.total


  const onDocumentLoad = ({ total }) => {
    dispatch({
      type: 'searchEvaCasesDetail/changeTotal',
      payload: total,
    })
  }

  const onPageLoad = ({ pageIndex, pageNumber }) => {
    dispatch({
      type: 'searchEvaCasesDetail/changePage',
      payload: {
        pageIndex,
        pageNumber,
      },
    })
  }

  const onPageRender = () => {
    dispatch({
      type: 'searchEvaCasesDetail/changePageCount',
      payload: pageRenderCount++,
    })
  }

  const handlePrevious = (i) => {
    dispatch({
      type: 'searchEvaCasesDetail/handlePrevious',
      payload: pageIndex + i,
    })
  }

  const handleNext = (i) => {
    dispatch({
      type: 'searchEvaCasesDetail/handleNext',
      payload: pageIndex + i,
    })
  }

  return (
    <div className={styles.clearfix}>
      <div className={styles.fl}>
        <WrappedReactPDF
          file={file}
          onDocumentLoad={onDocumentLoad}
          onPageLoad={onPageLoad}
          onPageRender={onPageRender}
          pageIndex={pageIndex}
          width={pageWidth}
        />

        <div className={styles.center}>
          <Button type="primary" disabled={pageNumber <= 1} onClick={e => handlePrevious(-1)}>上一页</Button>
          <span className={styles.margin10}>第 {pageNumber || '--'} 页，共 {total || '--'} 页</span>
          <Button type="primary" disabled={pageNumber >= total} onClick={e => handleNext(1)}>下一页</Button>
        </div>
      </div>
      <div className={styles.fl}></div>
    </div>
  )
}

SearchEvaCasesDetail.propTypes = {
  form: PropTypes.object,
  searchEvaCasesDetail: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ searchEvaCasesDetail }) => ({ searchEvaCasesDetail }))(Form.create()(SearchEvaCasesDetail))

