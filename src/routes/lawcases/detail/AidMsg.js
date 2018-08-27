import React from 'react'
import PropTypes from 'prop-types'
import { Form, Card, Row, Col, Button } from 'antd'
import { connect } from 'dva'
import styles from './index.less'

const AidMsg = ({ lawcaseDetail, dispatch }) => {

  const aidMsg = lawcaseDetail.aidMsg || []
  const { caseStatus } = lawcaseDetail
  const userInfo = JSON.parse(localStorage.getItem('user'))
  const listType = JSON.parse(localStorage.getItem('listType'))
  const aidMsgChange = () => {
    dispatch({
      type: 'lawcaseDetail/showAidMsgModal',
    })
  } 
  const aidMaterialChange = (item) => {
    dispatch({
      type: 'lawcaseDetail/handleAidMaterial',
      payload: item
    })
  }
  return (
    <div>
      {listType !== 10 && (caseStatus >= 14 && caseStatus < 18) && userInfo.roles[0].id === 3  && 
      <Row type="flex" justify="end" gutter={16}>
	            <Button type="primary" size="large" onClick={aidMsgChange}>
	               修改承办人员
	            </Button>
		        </Row>}
      {
        aidMsg.map(item => {
          return (
            <div className={styles.pb20} key={item.tHpUserId}>
              <Card>
              <Row type="flex" justify="end" gutter={16}>
	           {item.change == '1' && <Button type="primary" size="large" onClick={() => aidMaterialChange(item)}>
	               变更材料
	            </Button>}
		        </Row>
                <Row gutter={16}>
                  <Col span={4}>
                    <div className={styles.aidHeadWrap}>
                      <img className={styles.aidHead} src={item.hpHeadpic} alt="援助人头像" />
                    </div>
                  </Col>
                  <Col span={20}>
                    <Col className="gutter-row" span={12}>
                      <div>援助人员姓名：{item.name}</div>
                    </Col>
                    <Col className="gutter-row" span={12}>
                      <div>法律援助人员类型：{item.dicHpIdentity || item.dicLawyerTypeValue}</div>
                    </Col>
                </Col>
                <Col span={20}>
                    <Col className="gutter-row" span={12}>
                      <div>联系电话：{item.mobile}</div>
                    </Col>
                    <Col className="gutter-row" span={12}>
                      <div>工作区域：{item.areaCode}</div>
                    </Col>
                    <Col span={24} className="gutter-row">
                      <div>业务专长：{item.tTagGoodField || item.goodFields}</div>
                    </Col>
                    <Col  span={24}>
                      <div>工作单位：{item.tWorkUnit || item.lawfirmName}</div>
                    </Col>
                  </Col>
                </Row>
              </Card>
            </div>
          )
        })
      }
    </div>
  )
}

AidMsg.propTypes = {
  lawcaseDetail: PropTypes.object,
}

export default connect(({ dispatch }) => ({ dispatch }))(Form.create()(AidMsg))

