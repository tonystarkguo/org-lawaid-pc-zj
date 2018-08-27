import React from 'react'
import PropTypes from 'prop-types'
import { Select, Modal, Table, Row, Col } from 'antd'
import city from '../../utils/city'
import _ from 'lodash'

const Option = Select.Option

const AssignTaskModal = ({
  item = {},
  onOk,
  onSearchOpmUsers,
  onGetOpmUserCases,
  selectedOpmUserId,
  ...assignTaskModalProps
}) => {

  const {opmUserList, opmUserCasesInfo} = assignTaskModalProps
  const handleOk = () => {
    onOk({tGlobalId: selectedOpmUserId, updateType: 'fenpai', currentItem: item})
  }

  const handleChange = (tGlobalId) => {
    onGetOpmUserCases(tGlobalId)
  }

  const modalOpts = {
    ...assignTaskModalProps,
    onOk: handleOk,
  }

  let dataSource = opmUserCasesInfo.data || []

  /*dataSource = 
    [
      {
        "labelValue": "1",
        "labelName": "线上检查",
        "signNum": 1,
        "category": null
      },
      {
        "labelValue": "12",
        "labelName": "发起竞价",
        "signNum": 0,
        "category": null
      },
      {
        "labelValue": "14",
        "labelName": "推荐法律援助人员",
        "signNum": 0,
        "category": null
      },
      {
        "labelValue": "18",
        "labelName": "待评价",
        "signNum": 0,
        "category": null
      },
      {
        "labelValue": "19",
        "labelName": "发起归档",
        "signNum": 0,
        "category": null
      }
    ]*/

  dataSource.map((item, index) => {
    item.key = index + 1;
    return item;
  })

  let rebuildDt = _.map(dataSource, 'signNum')
  let total = _.reduce(rebuildDt, function(total, n) {
    return 1*total + 1*n;
  });


  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
    },{
      title: '类目',
      dataIndex: 'labelName',
      key: 'labelName',
    }, {
      title: '数量',
      dataIndex: 'signNum',
      key: 'signNum',
    }
  ];

  /*<Option value="jack">张三</Option>
            <Option value="lucy">李四</Option>
            <Option value="tom">王五</Option>*/

  return (
    <Modal {...modalOpts}>
      <Row>
        <Col span={4}>运营人员</Col>
        <Col span={16}>
          <Select
            defaultValue={opmUserList && opmUserList.length && opmUserList[0].tGlobalId}
            defaultActiveFirstOption={true}
            showSearch
            style={{ width: 400 }}
            placeholder="请搜索运营人员"
            optionFilterProp="children"
            onChange={handleChange}
            filterOption={(input, option) => option.props.fullname.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {
              opmUserList.length ? 
                  opmUserList.map((item, index) => <Option key={item.id} fullname={item.fullName} value={item.tGlobalId} >{item.fullName} </Option>)
                : (<Option value="0" fullname="">请选择</Option>)
            }
          </Select>
        </Col>
      </Row>
      <Row style={{padding: 20}}>
        <Col span={24}>
          <Table pagination = {false} dataSource={dataSource} columns={columns} />
        </Col>
      </Row>
      <Row style={{padding: 20}}>
       他/她的工作共计：{total} 项
      </Row>
    </Modal>
  )
}

AssignTaskModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default AssignTaskModal
