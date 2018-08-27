import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Tree, Icon  } from 'antd'
import { arrayToTree, queryArray } from '../../../utils'

const FormItem = Form.Item
const TreeNode = Tree.TreeNode;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  role = {},
  item = {},
  onOk,
  onCancel,
  onCheck,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  let { optTree = [] , currentPermissions = []} = role
  const defaultCheckedKeys = currentPermissions.map(item => {
    if( typeof item === 'string' ) {
      return item
    }else {
      if(typeof item.id !== undefined) {      
        return item.id.toString()
      }
    }
  })  

  const optTreeData = arrayToTree(optTree.filter(_ => _.parentId !== -1), 'id', 'parentId')
  
  // 递归生成树
  const loop = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode key={item.id} title={item.name}>
          {loop(item.children)}
        </TreeNode>
      )
    }
    return <TreeNode key={item.id} title={item.name}/>;
  });

  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...item,
        ...getFieldsValue(),
        permissions: currentPermissions
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onCancel: () => onCancel(),
    onOk: handleOk,
  }

  const handleCheck = (keys, event) => {
    const currentPermissionsList = [...keys, ...event.halfCheckedKeys]
    const currentPermissions = optTree.filter((item) => {
      return currentPermissionsList.indexOf(item.id.toString()) > -1
    })
    onCheck(currentPermissions)
  }

  const treeProps = {
    checkable: true,
    onCheck: handleCheck,
    defaultCheckedKeys,
  }
  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="角色名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [{required: true, message: '请输入角色名称'}]
          })(<Input />)}
        </FormItem>
        <FormItem label="描述" hasFeedback {...formItemLayout}>
          {getFieldDecorator('remark', {
            initialValue: item.remark
          })(<Input />)}
        </FormItem>
        <FormItem label="角色权限" hasFeedback {...formItemLayout}>
          {optTreeData.length ? 
          <Tree {...treeProps} >
              {loop(optTreeData)}
            </Tree> : "loading..."}
        </FormItem>
      </Form>

    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
