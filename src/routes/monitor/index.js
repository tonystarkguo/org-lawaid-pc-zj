import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs } from 'antd'
import List from './List'
import Filter from './Filter'
import AttendModal from './AttendModal'
import StopModal from './StopModal'
import VisitModal from './VisitModal'
const TabPane = Tabs.TabPane

const Monitor = ({
  monitor,
  dispatch,
}) => {
  const { tabsKey, attendModal, stopModal, visitModal, list, pagination, loading, dictData } = monitor
  const handleTabsChange = (key) => {
    dispatch({
      type: 'monitor/tabsChange',
      payload: key,
    })
    dispatch({
      type: 'monitor/getData',
    })
  }
  const listPorps = {
    listData: list,
    pagination,
    loading,
  }
  return (
    <div>
      {attendModal.visible && <AttendModal {...attendModal} />}
      {stopModal.visible && <StopModal {...stopModal} dictData={dictData} />}
      {visitModal.visible && <VisitModal {...visitModal} />}
      <Tabs activeKey={tabsKey} onChange={handleTabsChange}>
        <TabPane tab="承办中的案件" key="1">
          <Filter />
          <List {...listPorps} />
        </TabPane>
        <TabPane tab="承办超时" key="2">
          <List {...listPorps} />
        </TabPane>
        <TabPane tab="受援人满意度异常" key="3">
          <List {...listPorps} />
        </TabPane>
        <TabPane tab="法官意见征询" key="4">
          <List {...listPorps} />
        </TabPane>
        <TabPane tab="承办人特殊情况报告" key="5">
          <List {...listPorps} />
        </TabPane>
        <TabPane tab="待结案审核" key="6">
          <List {...listPorps} />
        </TabPane>
      </Tabs>
    </div>

  )
}

export default connect(({ monitor }) => ({ monitor }))(Monitor)
