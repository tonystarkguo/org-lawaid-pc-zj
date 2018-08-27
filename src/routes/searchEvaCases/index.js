import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import Form001 from './Form001'
import FormR from './FormR'
import PictureView from './PictureView'
import styles from './index.less'
import { Breadcrumb, Row, Col, Form, Input, Button, Radio, Card } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input
/**
 * 查询评估案件页面.
 * 默认显示列表，若点击了某一个案件，则通过链接参数type切换到单案件页面.
 * 1、待评估状态，“查看”、“复评”：指派给专家律师们
 * 2、待评估状态，“直接评估”、“查看”：指派给工作人员
 * 3、已评估状态，“查看”、“复评”：指派给专家律师们且全部评估完成
 * 4、已评估状态，“查看”：工作人员评估完成
 * 5、已复评状态，“查看”：指派给专家律师们且全部评估完成 & 工作人员复评完成
 * type:1:查看评估，type:2:初评，type:3复评
 */
const SearchEvaCases = ({ location, dispatch, loading, searchEvaCases }) => {
    // 通用数据更新.
  const update = (value) => {
    dispatch({
      type: 'searchEvaCases/update',
      payload: {
        ...value,
      },
    })
  }
    // 渲染成进行评估.
  if (searchEvaCases.search.type == 2 || searchEvaCases.search.type == 3 || searchEvaCases.search.type == 1) {
        // 返回之前搜索页面.
    const back = () => {
      const { query, pathname } = location
      const { search } = searchEvaCases
      search.type = ''
      update({ search })
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...search,
        },
      }))
    }
    const form001Props = {
      dispatch,
      update,
      formdata001: searchEvaCases.formdata001,
      edit_items: searchEvaCases.edit_items,
      dicEvaluationMethod: searchEvaCases.dicEvaluationMethod,
      scoreList: searchEvaCases.scoreList,
            // 评估结果列表.
      evalList: searchEvaCases.evalList,
            // 评估结果映射.
      evalResult: searchEvaCases.evalResult,
            // 当前选中的评估结果映射KEY.
      evalSelectedResultKey: searchEvaCases.evalSelectedResultKey,
      caseId: searchEvaCases.search.id,
      type: searchEvaCases.search.type,
      data:searchEvaCases.data,
      evalSelectedResultKeyFa:searchEvaCases.evalSelectedResultKeyFa,
      orgId:searchEvaCases.orgId,
            // 提交处理分值.
      submitScore (value) {
                // 案件直接评估.或则复评.
        dispatch({
          type: 'searchEvaCases/directEvaluate',
          payload: {
            ...value,
          },
        })
      },
      searchEvaCases,
    }
        // 图片预览模型.
    const pictureViewProps = {
      update,
      pictureView: searchEvaCases.pictureView,
    }
    let nvg_now = ''
    if (searchEvaCases.search.type == 2) {
      nvg_now = '直接评估'
    } else if (searchEvaCases.search.type == 3) {
      nvg_now = '复评'
    } else {
      nvg_now = '详情'
    }
        // DOM
    return (
            <div className="content-inner">
                <Breadcrumb className={styles.split}>
                    <Breadcrumb.Item><a href="javascript:void(0)" onClick={back}>查询评估案件</a></Breadcrumb.Item>
                    <Breadcrumb.Item>{nvg_now}</Breadcrumb.Item>
                </Breadcrumb>
                <Row gutter={24} type="flex">
                    <Col span={12}>
                        <Card>
                            <PictureView {...pictureViewProps} />
                        </Card>
                    </Col>
                    <Col span={12}>
                        {searchEvaCases.search.type == 1 ? (
                            <FormR {...form001Props}></FormR>
                        ) : (
                            <Form001 {...form001Props}></Form001>
                        )}
                    </Col>
                </Row>
            </div>
    )
  }
    // 过滤器模型.
  const filterProps = {
    update,
    filter: searchEvaCases.filter,
    caseTypeList: searchEvaCases.caseTypeList,
    caseReasonList: searchEvaCases.caseReasonList,
    evaluationStatusList: searchEvaCases.evaluationStatusList,
    searchEvaCases: searchEvaCases,
        // 搜索.
    onFilterChange (value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          pageNum: 1,
          pageSize: searchEvaCases.pagination.pageSize,
        },
      }))
    },
    handleCaseTypeChange1(value) {
    dispatch({ type: 'searchEvaCases/handleCaseTypeChange', value })
  }
  }
    // 列表模型.
  const listProps = {
    update,
    search: searchEvaCases.search,
    dataSource: searchEvaCases.list,
    loading: loading.effects['searchEvaCases/refresh_list'],
    pagination: searchEvaCases.pagination,
    dispatch,
    onChange (page, filters, sorter) {
      const { query, pathname } = location
      const { search } = searchEvaCases
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...search,
          pageNum: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
  }

    // DOM
  return (
        <div className="content-inner">
            <Filter {...filterProps} />
            <List {...listProps} />
        </div>
  )
}
export default connect(({ searchEvaCases, loading }) => ({ searchEvaCases, loading }))(SearchEvaCases)
