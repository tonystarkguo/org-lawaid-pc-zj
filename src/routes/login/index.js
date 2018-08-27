import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Col, Form, Input } from 'antd'
import { config } from '../../utils'
import styles from './index.less'
import LoginForm from './LoginForm'
import MenuModal from './menuModal'
import QrCodeModal from './qrCodeModal'

const FormItem = Form.Item

const Login = ({
  login,
  dispatch,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  const { loginLoading, showLogin, loginType, menuModalInfo, qrCodeModalInfo } = login
  const handleShowLogin = () => {
    dispatch({
      type: 'login/showLogin',
    })
  }
  const loginProps = {
    ...login,
  }
  const showMenuMadal = (key) => {
    dispatch({
      type: 'login/showMenuMadal',
      payload: key,
    })
  }
  return (
    <div className={styles.bg}>
      <img src={config.bg} alt="" />
      <div className={styles.topbar}>
        <div className={styles.title}>
          <div className={styles.logobg}>
            <img alt={'logo'} src={config.logo} />
          </div>
          <span>{config.name}</span>
        </div>
        <div className={styles.loginBtn} onClick={handleShowLogin}>
          <img src='./login.png' alt="" />
          <span>登录</span>
        </div>
      </div>
      {qrCodeModalInfo.visible && <QrCodeModal qrCodeModalInfo={qrCodeModalInfo} />}
      {menuModalInfo.visible && <MenuModal menuModalInfo={menuModalInfo} />}
      {showLogin && <LoginForm {...loginProps} />}
      <div className={styles.bottombar}>
        <div>
          <img src="./zhgl.jpg" alt="" onClick={() => showMenuMadal(1)} />
        </div>
        <div>
          <img src="./zlpj.jpg" alt="" onClick={() => showMenuMadal(2)} />
        </div>
        <div>
          <img src="./bmfw.jpg" alt="" onClick={() => showMenuMadal(3)} />
        </div>
      </div>
      <div className={styles.copyRight}>
        <p>{config.footerText}</p>
      </div>
    </div>
  )
}

Login.propTypes = {
  form: PropTypes.object,
  login: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ login }) => ({ login }))(Form.create()(Login)) //加上From.create 后，props中会多出form这个属性！！！！坑了我好久啊。
