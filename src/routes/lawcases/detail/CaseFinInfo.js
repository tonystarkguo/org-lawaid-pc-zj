import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'
import {Table, Form, Input, Select, Button, Row, Col, Spin, Radio, Switch, Modal, Checkbox, InputNumber} from 'antd'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const confirm = Modal.confirm
const CheckboxGroup  = Checkbox.Group 

const CaseFinInfo = ({ lawcaseDetail, handleFinEdit, handleFinCancel, onDeleteItem, onAddItem, onEditItem, handleFinInfoSave, role, isTodoList,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }}) => {

  const { caseFinacialData, isCaseFinEditing, tabLoading, caseStatus } = lawcaseDetail
  const { familyIncomes } = caseFinacialData
  //点击保存按钮
  const handleFinSave = (e) => {
    // e.preventDefault();
    validateFields((errors) => {
      if (errors) {
        return
      }
      //获取表格中的信息
      const data = {
        ...getFieldsValue(),
        familyIncomes,
      }
      handleFinInfoSave(data)
    })
  }

  const handleEditFinInfo = (e) => {
  	handleFinEdit()
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 10 },
      sm: { span: 10 },
    },
    wrapperCol: {
      xs: { span: 10 },
      sm: { span: 10 },
    },
  };

  const handleMenuClick = (record, key) => {
    if (key === 'edit') {
      onEditItem(record)
    } else if (key === 'delete') {
      confirm({
        title: '确定删除吗?',
        onOk () {
          onDeleteItem(record)
        },
      })
    }
  }

  const handleCancel = () => {
    resetFields()
    handleFinCancel()
  }

  const columns = [{
      title: '序号',
      dataIndex: 'seq',
      key: 'seq',
      width: 64,
      render: (text, record, index) => <div width={24}>{index + 1}</div>
  }, {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  }, {
    title: '性别',
    dataIndex: 'dicGenderName',
    key: 'dicGenderName'
  }, {
    title: '关系',
    dataIndex: 'dicRelationName',
    key: 'dicRelationName',
  }, {
    title: '工资性收入',
    dataIndex: 'salary',
    key: 'salary',
  }, {
    title: '生产经营性收入',
    dataIndex: 'operatIncome',
    key: 'operatIncome',
  }, {
    title: '其他收入',
    dataIndex: 'otherIncome',
    key: 'otherIncome',
  }, {
    title: '合计',
    dataIndex: 'total',
    key: 'total',
  }, {
  	title: '操作',
  	dataIndex: 'tRpUserId',
  	key: 'tRpUserId',
  	render: (text, record) => (
      <div>
        <Button className={styles.csBtn} type="primary"  onClick={e => handleMenuClick(record, 'edit')} disabled={!isCaseFinEditing}>修改</Button>
        <Button className={styles.csBtn} type="primary"  onClick={e => handleMenuClick(record, 'delete')} disabled={!isCaseFinEditing}>删除</Button>
      </div>
  	)
  }];

  const editBtn = (<Row type="flex" justify="end" className={styles.pannelhr} gutter={16}>
    {role == '1' && isTodoList && caseStatus === '1' ? 
      <Button type="primary" size="large" onClick={handleEditFinInfo}>
        编辑
      </Button>
     : ''}
    </Row>
  )
  // const editBtn = (<Row type="flex" justify="end" className={styles.pannelhr} gutter={16}>
  //     <Button type="primary" size="large" onClick={handleEditFinInfo}>
  //       编辑
  //     </Button>
  //   </Row>
  // )  
  const editingBtns = (
    <Row type="flex" justify="end" className={styles.pannelhr} gutter={16}>
      <Button className={styles.csBtn} type="primary" size="large" onClick={handleFinSave}>保存</Button>
      <Button type="primary" size="large" onClick={handleCancel}>取消</Button>
    </Row>
  )

  return (
		<Spin spinning={tabLoading} >
  		{isCaseFinEditing ? editingBtns : editBtn}
  		<Row style={{padding: 20}}>家庭情况：</Row>
  		<Row style={{padding: 20}}>
        <Col span={24}>
          <Table pagination = {false} dataSource={familyIncomes} columns={columns}  rowKey="seq"/>
        </Col>
        <Col span={24} style={{ marginTop: 16 }}><Button type="primary" size="large" disabled={!isCaseFinEditing} onClick={onAddItem}>新增</Button></Col>
      </Row>
      <Form layout="horizontal" className="login-form">
        <Row style={{padding: 20}}>资产信息：</Row>
        <Row gutter={16}>
          <Col className="gutter-row" span={12}>
            <div className="gutter-box">

              <FormItem {...formItemLayout} label="家庭年总收入（元）">
                {getFieldDecorator('familyIncome', {
                  initialValue: caseFinacialData.familyIncome
                  })(
                  <InputNumber size="large" placeholder="请输入家庭年总收入" disabled={!isCaseFinEditing} />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="家庭人数">
                {getFieldDecorator('familySize', {
                  initialValue: caseFinacialData.familySize
                  })(
                  <InputNumber size="large" placeholder="请输入家庭人数" disabled={!isCaseFinEditing} />
                )}
              </FormItem>
              
              <FormItem {...formItemLayout} label="人均月收入（元）">
                {getFieldDecorator('perMonthlyIncome', {
                  initialValue: caseFinacialData.perMonthlyIncome
                  })(
                  <InputNumber size="large" placeholder="请输入人均月收入" disabled={!isCaseFinEditing} />
                )}
              </FormItem>
              
            	<FormItem {...formItemLayout} label="人均月开支（元）">
              	{getFieldDecorator('perMonthlyOutcome', {
				          initialValue: caseFinacialData.perMonthlyOutcome
				          })(
                  <InputNumber size="large" placeholder="请输入人均月开支" disabled={!isCaseFinEditing} />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="资产总价值（元）">
                {getFieldDecorator('assetTotalValue', {
                  initialValue: caseFinacialData.assetTotalValue  
                  })(
                  <InputNumber size="large" placeholder="请输入资产总价值" disabled={!isCaseFinEditing} />
                )}
              </FormItem>
            </div>
          </Col>
          <Col className="gutter-row" span={12}>
            <div className="gutter-box">
              <p style={{paddingBottom:"35px",paddingTop: "5px"}}>是否有房产及其他资产（价值千元以上）：</p>
              <FormItem {...formItemLayout} label="现金、储蓄、证券、收藏品等其他资产">
                  {getFieldDecorator('isOtherAssets', {
                    })(
                    <Switch defaultChecked={caseFinacialData.isOtherAssets} checkedChildren={'有'} unCheckedChildren={'无'} disabled={!isCaseFinEditing}/>
                  )}
              </FormItem>

              <FormItem {...formItemLayout} label="城镇房产">
                  {getFieldDecorator('isProperty', {
                    })(
                    <Switch defaultChecked={caseFinacialData.isProperty } checkedChildren={'有'} unCheckedChildren={'无'} disabled={!isCaseFinEditing}/>
                  )}
              </FormItem>

              <FormItem {...formItemLayout} label="别墅，高档住宅">
                  {getFieldDecorator('isVilla', {
                    })(
                    <Switch defaultChecked={caseFinacialData.isVilla} checkedChildren={'有'} unCheckedChildren={'无'} disabled={!isCaseFinEditing}/>
                  )}
              </FormItem>
            </div>
          </Col>
        </Row>
      </Form>
  	</Spin>
  )
}

CaseFinInfo.propTypes = {
  // onAddItem: PropTypes.func,
  lawcaseDetail: PropTypes.object,
  handleFinEdit: PropTypes.func,
  handleFinSave: PropTypes.func,
  handleFinCancel: PropTypes.func,
  loading: PropTypes.bool,
  form: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
}

export default Form.create()(CaseFinInfo)
