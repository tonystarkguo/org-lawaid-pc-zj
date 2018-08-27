import React from 'react'
import PropTypes from 'prop-types'
import { Tree, Form } from 'antd'
import { createDicNodes } from '../../../utils'
import styles from './index.less'
const TreeNode = Tree.TreeNode

const ChildrenMenu = ({
}) => {
  return (
    <Tree>
      <TreeNode title="parent 1" key="0-0">
        <TreeNode title="parent 1-0" key="0-0-0" >
          <TreeNode title="leaf" key="0-0-0-0"  />
          <TreeNode title="leaf" key="0-0-0-1" />
        </TreeNode>
        <TreeNode title="parent 1-1" key="0-0-1">
          <TreeNode title={<span style={{ color: '#08c' }}>sss</span>} key="0-0-1-0" />
        </TreeNode>
      </TreeNode>
    </Tree>     
  )
}

ChildrenMenu.propTypes = {
}

export default ChildrenMenu