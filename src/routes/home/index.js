import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { Button, Row, Col } from 'antd'
import ModalView from './ModalView'
import ModalAdd from './ModalAdd'
import Chars from './Char'
import { routerRedux } from 'dva/router'
const Home = ({
  home,
  dispatch
}) => {
  const { modalViewInfo, modalAddInfo, caseCount, list, StatisticsData, fileModal, curTotalFileList } = home
  const modalViewProps = {
    modalViewInfo,
  }
  const modalAddProps = {
    modalAddInfo,
    fileModal,
    curTotalFileList
  }
  const charProps = {
    StatisticsData,
  }
  const showModalView = (id) => {
    dispatch({
      type: 'home/handleShowModalView',
      payload: id,
    })
  }
  const showModalAdd = () => {
    dispatch({
      type: 'home/handleShowModalAdd',
    })
  }
  const listChild = list.map(item => {
    return (
      <a onClick={() => { showModalView(item.id) }} key={item.id}>{item.title}</a>
    )
  })
  const userInfo = JSON.parse(localStorage.getItem('user')) || {}
  const isMgr = userInfo.isMgr
  return (
    <div className={styles.home}>
      <Row gutter={40} className={styles.up}>
        <Col span={12} className={styles.info}>
          <Row gutter={40}>
            <Col span={12} className={styles.img}>
              <img src={userInfo.headPic} alt="头像" />
              <div>
                <p>{userInfo.name}</p>
                <p>{userInfo.dicGenderName} {userInfo.dicGenderName && userInfo.orgName && '|'} {userInfo.orgName}</p>
              </div>
            </Col>
            <Col span={12} className={styles.dynamic}>
              <div>
                <div style={{ backgroundColor: '#517cef' }} onClick={() => dispatch(routerRedux.push('/adviceSort'))}>
                  <div className={styles.sign}>
                    <img src="./reply.png" alt="" />
                  </div>
                  <p>待回复在线咨询</p>
                  <p>（{caseCount.zixCount}）</p>
                </div>
                <div style={{ backgroundColor: '#f37823' }} onClick={() => dispatch(routerRedux.push('/lawcases?type=0'))}>
                  <div className={styles.sign}>
                    <img src="./approval.png" alt="" />
                  </div>
                  <p>待审批案件</p>
                  <p>（{caseCount.shpCount}）</p>
                </div>
              </div>
              <div>
                <div style={{ backgroundColor: '#41cc52' }} onClick={() => dispatch(routerRedux.push('/monitor?type=15'))}>
                  <div className={styles.sign}>
                    <img src="./ing.png" alt="" />
                  </div>
                  <p>承办中案件</p>
                  <p>（{caseCount.chbCount}）</p>
                </div>
                <div style={{ backgroundColor: '#46489b' }} onClick={() => dispatch(routerRedux.push('/searchEvaCases'))}>
                  <div className={styles.sign}>
                    <img src="./assess.png" alt="" />
                  </div>
                  <p>待评估案件</p>
                  <p>（{caseCount.assCount}）</p>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={12} className={styles.notice}>
          <div className={styles.topbar}>
            <h3>通知公告</h3>
            {isMgr && <Button type="primary" onClick={showModalAdd}>发布新公告</Button>}
          </div>
          <div className={styles.list}>
            {listChild}
          </div>
        </Col>
      </Row>
      <div className={styles.chars}>
        <Chars {...charProps} />
      </div>
      {modalViewInfo.visible && <ModalView {...modalViewProps} />}
      {modalAddInfo.visible && <ModalAdd {...modalAddProps} />}
    </div>
  )
}

export default connect(({ home }) => ({ home }))(Home)
