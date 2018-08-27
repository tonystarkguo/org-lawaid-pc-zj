import React from 'react'
import PropTypes from 'prop-types'
import styles from './Logcard.less'
import { Card, Row, Col, Form } from 'antd'

const FormItem = Form.Item

const Logcard = (lastLog) => {

  const leftFormItemLayout = {
    labelCol: {
      xs: { span: 10 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 14 },
      sm: { span: 14 },
    },
  };


  return (
    <div style={{paddingBottom:'20px'}}>
      <Card bordered={true}>
        <Row type="flex" align="middle">
            <Col xs={{ span: 3, offset: 1 }} lg={{ span: 3, offset: 3 }}>
              <Card style={{ width: 100 }} bodyStyle={{ padding: 0 }}>
                <div className={styles.customimage}>
                  <img className={styles.cycleImg} alt="头像" width="100%" src={lastLog.headPic} />
                </div>
                <div className={styles.customimage}>
                  <h4>{lastLog.name}</h4>
                </div>
              </Card>
            </Col>
            <Col span={12}><div>{lastLog.logTitle}</div><div>{lastLog.createTime}</div></Col>
        </Row>
      </Card>
    </div>
  )
}

Logcard.propTypes = {
  logs: PropTypes.object
}

export default Logcard