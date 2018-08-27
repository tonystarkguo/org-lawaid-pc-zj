import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { Button, Row, Col, Form, Input, Icon, Tabs, message, Modal } from 'antd'
import { config } from '../../utils'
import GetCodeBtn from '../../components/GetCodeBtn/GetCodeBtn'
const FormItem = Form.Item
const TabPane = Tabs.TabPane

const LoginForm = ({
  loginLoading,
  loginType,
  showLogin,
  dispatch,
  getCodeBtnText,
  getCodeBtnCount,
  getCodeBtnDisable,
  getCodeBtnStop,
  getCodeBtnDisableHp,
  getCodeBtnTextHp,
  getCodeBtnCountHp,
  tabKey,
  form: {
    getFieldDecorator,
    getFieldsValue,
    getFieldValue,
    validateFieldsAndScroll,
  },
}) => {
  function handleOk () {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'login/login', payload: values })
    })
  }

  const handleHpOk = () => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      window.location.href = `${config.hpPcUrl}/login?mobile=${values.hpMobile}&captchaValue=${values.hpCaptchaValue}`
    })
  }
  const handleHideLogin = () => {
    dispatch({
      type: 'login/hideLogin',
    })
  }
  const handleChangeToPhone = () => {
    dispatch({
      type: 'login/changeToPhone',
    })
  }
  const handleChangeToAcc = () => {
    dispatch({
      type: 'login/changeToAcc',
    })
  }

  const handleGetCode = (type) => {
    const mobilePhone = /^(13[0-9]|14[57]|15[012356789]|17[03678]|18[0-9])\d{8}$/
    if ((type === 'rp') ? mobilePhone.test(getFieldValue('mobile')) : mobilePhone.test(getFieldValue('hpMobile'))) {
      const payload = (type === 'rp') ? { getCodeBtnDisable: true } : { getCodeBtnDisableHp: true }
      dispatch({
        type: 'login/setCodeBtn',
        payload,
      })
      const countDown = (typeIn) => {
        if (typeIn === 'rp') {
          setTimeout(() => {
            getCodeBtnCount = getCodeBtnCount - 1
            if (getCodeBtnCount > 0) {
              countDown(typeIn)
              getCodeBtnText = `${getCodeBtnCount}秒后获取`
              dispatch({
                type: 'login/setCodeBtn',
                payload: {
                  getCodeBtnText,
                  getCodeBtnCount,
                },
              })
            } else {
              getCodeBtnDisable = false
              getCodeBtnText = '获取验证码'
              getCodeBtnCount = 60
              dispatch({
                type: 'login/setCodeBtn',
                payload: {
                  getCodeBtnDisable,
                  getCodeBtnText,
                  getCodeBtnCount,
                },
              })
            }
          }, 1000)
        } else {
          setTimeout(() => {
            getCodeBtnCountHp = getCodeBtnCountHp - 1
            if (getCodeBtnCountHp > 0) {
              countDown(typeIn)
              getCodeBtnTextHp = `${getCodeBtnCountHp}秒后获取`
              dispatch({
                type: 'login/setCodeBtn',
                payload: {
                  getCodeBtnTextHp,
                  getCodeBtnCountHp,
                },
              })
            } else {
              getCodeBtnDisableHp = false
              getCodeBtnTextHp = '获取验证码'
              getCodeBtnCountHp = 60
              dispatch({
                type: 'login/setCodeBtn',
                payload: {
                  getCodeBtnDisableHp,
                  getCodeBtnTextHp,
                  getCodeBtnCountHp,
                },
              })
            }
          }, 1000)
        }
      }
      countDown(type)
      dispatch({
        type: 'login/getCode',
        payload: {
          mobile: (type === 'rp') ? getFieldValue('mobile') : getFieldValue('hpMobile'),
          type,
        },
      })
    } else {
      message.warning('请输入正确的电话号码格式')
    }
  }

  const handleChangeTabs = (key) => {
    dispatch({
      type: 'login/setTabKey',
      payload: key,
    })
  }
  const modalPorps = {
    visible: showLogin,
    width: 350,
    footer: null,
    title: '',
    onCancel: () => {
      dispatch({
        type: 'login/hideLogin',
      })
    },
  }
  return (
    <Modal className={styles.form} {...modalPorps}>
      <Tabs ativeKey={tabKey} onChange={handleChangeTabs}>
        <TabPane tab="机构工作人员" key="1">
          {tabKey === '1' &&
            <div>
              <form>
                {loginType ?
                  <div>
                    <FormItem hasFeedback>
                      {getFieldDecorator('userName', {
                        rules: [{ required: true, message: '请输入用户名！' }],
                      })(<Input size="large" onPressEnter={handleOk} placeholder="请输入用户名" />)}
                    </FormItem>
                    <FormItem hasFeedback>
                      {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码！' }],
                      })(<Input size="large" type="password" onPressEnter={handleOk} placeholder="请输入密码" />)}
                    </FormItem>
                  </div>
                  :
                  <div>
                    <Row gutter={25}>
                      <Col span={14}>
                        <FormItem hasFeedback>
                          {getFieldDecorator('mobile', {
                            rules: [{ required: true, message: '请输入手机号！' }],
                          })(<Input size="large" onPressEnter={handleOk} placeholder="请输入手机号" />)}
                        </FormItem>
                      </Col>
                      <Col span={10}>
                        <Button size="large" onClick={() => handleGetCode('rp')} disabled={getCodeBtnDisable}>{getCodeBtnText}</Button>
                        {/* <GetCodeBtn start={getCodeBtnStop} onClick={() => handleGetCode('rp')} /> */}
                      </Col>
                    </Row>
                    <FormItem hasFeedback>
                      {getFieldDecorator('captchaValue', {
                        rules: [{ required: true, message: '请输入验证码！' }],
                      })(<Input size="large" onPressEnter={handleOk} placeholder="请输入验证码" />)}
                    </FormItem>
                  </div>
                }
                <Row>
                  <Button type="primary" style={{ width: '100%' }} size="large" onClick={handleOk} loading={loginLoading}>登录</Button>
                  <div className={styles.changeBtn}>
                    {loginType ?
                      <p>您还可以使用<span onClick={handleChangeToPhone}> 手机号登录</span></p> :
                      <p>您还可以使用<span onClick={handleChangeToAcc}> 帐号登录</span></p>
                    }
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <span>建议您使用Chrome浏览器</span><br />
                    <a href="http://sw.bos.baidu.com/sw-search-sp/software/98d3b44dd8f62/ChromeStandalone_54.0.2840.71_Setup.exe" rel="noopener noreferrer" target="_blank">点击下载Windows版Google Chrome</a>
                  </div>
                </Row>
              </form>
            </div>
          }
        </TabPane>
        <TabPane tab="法律援助人员" key="2">
          {tabKey === '2' &&
            <div>
              <Row gutter={25}>
                <Col span={14}>
                  <FormItem hasFeedback>
                    {getFieldDecorator('hpMobile', {
                      rules: [{ required: true, message: '请输入手机号！' }],
                    })(<Input size="large" onPressEnter={handleHpOk} placeholder="请输入手机号" />)}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <Button size="large" onClick={() => handleGetCode('hp')} disabled={getCodeBtnDisableHp}>{getCodeBtnTextHp}</Button>
                  {/* <GetCodeBtn start={getCodeBtnStop} onClick={() => handleGetCode('hp')} /> */}
                </Col>
              </Row>
              <FormItem hasFeedback>
                {getFieldDecorator('hpCaptchaValue', {
                  rules: [{ required: true, message: '请输入验证码！' }],
                })(<Input size="large" onPressEnter={handleHpOk} placeholder="请输入验证码" />)}
              </FormItem>
              <Button type="primary" style={{ width: '100%' }} size="large" onClick={handleHpOk} loading={loginLoading}>登录</Button>
              <div style={{ marginTop: 10 }}>
                <span>建议您使用Chrome浏览器</span><br />
                <a href="http://sw.bos.baidu.com/sw-search-sp/software/98d3b44dd8f62/ChromeStandalone_54.0.2840.71_Setup.exe" rel="noopener noreferrer" target="_blank">点击下载Windows版Google Chrome</a>
              </div>
            </div>
          }
        </TabPane>
      </Tabs>
    </Modal>
  )
}

export default connect(({ loginForm }) => ({ loginForm }))(Form.create()(LoginForm))
