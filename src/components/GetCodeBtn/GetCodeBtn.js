/** 
* 外部参数
* const props = {
*   onClick: function, // 点击事件
*   area: {"district":110101,"province":110000,"city":110100} 格式
* }
*/
import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { Button } from 'antd'

class GetCodeBtn extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '获取验证码',
      count: 60,
      disable: false,
    }
  }

  handleGetCode = (e) => {
    this.props.onClick(e)
    if (this.props.start) {
      return
    }
    this.setState({
      disable: true,
    })
    const countDown = () => {
      setTimeout(() => {
        this.state.count = this.state.count - 1
        if (this.state.count > 0) {
          countDown()
          this.state.text = `${this.state.count}秒后获取`
          this.setState({
            count: this.state.count,
          })
        } else {
          this.state.disable = false
          this.state.text = '获取验证码'
          this.state.count = 60
          this.setState({
            count: 60,
            text: '获取验证码',
            disable: false,
          })
        }
      }, 1000)
    }
    countDown()
  }
  render () {
    return (
      <Button size="large" onClick={this.handleGetCode} disabled={this.state.disable}>{this.state.text}</Button>
    )
  }
}

GetCodeBtn.propTypes = {

}

export default GetCodeBtn
