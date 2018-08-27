import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Row, Col, Rate, Icon } from 'antd'

const FormItem = Form.Item

const centerLayout = {
  labelCol: {
    xs: { span: 10 },
    sm: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 14 },
    sm: { span: 14 },
  },
};

const modal = ({
  item = {},
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        // key: item.key,
      }
      // data.address = data.address.join(' ')
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  // const { bidingLawyerList, selectedId } = modalProps

  // const data = bidingLawyerList[selectedId]

  // console.log(data)

  return (
    <Modal {...modalOpts} title="法律援助事项评价管理">
      <Form>
        <Row gutter={16}>
          <Col span={24}>
            <FormItem {...centerLayout} label="援助事项"><Rate character={<Icon type="heart" />} disabled defaultValue={3} /></FormItem>
            <FormItem {...centerLayout} label="受援人发起评价"><Rate character={<Icon type="heart" />} disabled defaultValue={3} /></FormItem>
            <FormItem {...centerLayout} label="法律援助人员发起评价"><Rate character={<Icon type="heart" />} disabled defaultValue={3} /></FormItem>
            <FormItem {...centerLayout} label="援助机构发起评价"><Rate character={<Icon type="heart" />} disabled defaultValue={3} /></FormItem>
            <FormItem {...centerLayout} label="运营团队发起评价"><Rate character={<Icon type="heart" />} disabled defaultValue={3} /></FormItem>
          </Col>
        </Row>
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
