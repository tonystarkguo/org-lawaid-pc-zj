import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Col, Form, Input, Tree } from 'antd'
import styles from './index.less'
import MenuTree from './MenuTree.js'
import CurrentMenu from './CurrentMenu.js'
import ChildrenMenu from './ChildrenMenu.js'
import CommonAction from './CommonAction.js'
const FormItem = Form.Item
const TreeNode = Tree.TreeNode

const Menu = ({
  menu,
  dispatch,
}) => {
  return (
    <Row gutter={16}>
      <Col span={6}>  
        <MenuTree></MenuTree>
      </Col>
      <Col span={18}>
        <CurrentMenu></CurrentMenu>
        <ChildrenMenu></ChildrenMenu>
        <CommonAction></CommonAction>
      </Col>
    </Row>
  )
}

Menu.propTypes = {
  menu: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ menu }) => ({ menu }))(Menu)
