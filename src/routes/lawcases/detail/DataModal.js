import React from 'react'
import PropTypes from 'prop-types'
import { Form, Collapse, Modal, Table, Button, Input, Row, message } from 'antd'
import _ from 'lodash'

const Panel = Collapse.Panel;
const FormItem = Form.Item

const modal = ({
  ...dataModalProps,
  onOk,
  toSubmitStep,
  toSubmitother,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    setFieldsValue
  },
}) => {

  const modalOpts = { ...dataModalProps, onOk, toSubmitStep, toSubmitother }
  const { CaseMaterialFile, SuppMaterial, caseStepFileSelect, homeFinMaterialSelect, undertakeFileSelect, identityFileSelect, identityMaterialSelect, 
  caseStepMaterialSelect, caseStepFileData, undertakeFileData, identityFileData, identityMaterialData, caseStepMaterialData, homeFinMaterialData, caseStatus, options } = dataModalProps
  const showHeader = false;
  const state = { pagination: false, showHeader }
  
  /*
    -----------------------------------------
    预审
    -----------------------------------------
   */
  const identityMaterial = SuppMaterial && SuppMaterial["1"]//身份证明材料
  const homeFinMaterial = SuppMaterial && SuppMaterial["5"]//家庭困难证明材料
  const caseStepMaterial = SuppMaterial && SuppMaterial["6"]//援助事项材料

  let identityMaterialTotal = 0
  let caseStepMaterialTotal = 0
  let homeFinMaterialTotal = 0

  if(SuppMaterial["1"] && identityMaterial && identityMaterial.length){
    identityMaterialTotal = identityMaterial.length
  }

  if(SuppMaterial["5"] && homeFinMaterial && homeFinMaterial.length){
    homeFinMaterialTotal = homeFinMaterial.length
  }

  if(SuppMaterial["6"] && caseStepMaterial && caseStepMaterial.length){
    caseStepMaterialTotal = caseStepMaterial.length
  }

  const identityMaterial_Selected = {
    selectedRows: identityMaterial,
    onChange: (selectedRowKeys, selectedRows) => {
      identityMaterialSelect(selectedRowKeys, selectedRows)
      selectedRows.map(d => {
        let old = getFieldValue('remark') == undefined ? '' : getFieldValue('remark') + ','
        console.log(old)
        console.log(d.name)
        setFieldsValue({
          remark: old + d.name,
        })
      })
    },
  }

  const caseStepMaterial_Selected = {
      selectedRows: caseStepMaterial,
      onChange: (selectedRowKeys, selectedRows) => {
        caseStepMaterialSelect(selectedRowKeys, selectedRows)
        selectedRows.map(d => {
          let old = getFieldValue('remark') == undefined ? '' : getFieldValue('remark') + ','
          setFieldsValue({
            remark: old + d.name,
          })
        })
      },
  }

  const homeFinMaterial_Selected = {
      selectedRows: homeFinMaterial,
      onChange: (selectedRowKeys, selectedRows) => {
        homeFinMaterialSelect(selectedRowKeys, selectedRows)
        selectedRows.map(d => {
          let old = getFieldValue('remark') == undefined ? '' : getFieldValue('remark') + ','
          setFieldsValue({
            remark: old + d.name,
          })
        })
      },
  }

  const submitotherHandle = (e) => {

    let cadList = []

    if(identityMaterialData && identityMaterialData.length){
      identityMaterialData.map((val) => {
        cadList.push(val)
      })
    }
    if(caseStepMaterialData && caseStepMaterialData.length){
      caseStepMaterialData.map((val) => {
        cadList.push(val)
      })
    }

    if(homeFinMaterialData && homeFinMaterialData.length){
      homeFinMaterialData.map((val) => {
        cadList.push(val)
      })
    }

    validateFields((errors) => {
      if (errors) {
        return
      }/*else if(cadList.length == 0){
        message.error('至少要选择一个材料信息！')
        return
      }*/
      const data = {
        ...getFieldsValue(),
        // cadList,
        dicConclusion: 2
      }
      toSubmitother(data)
    })
  }

  
  /*
    -----------------------------------------
    发起归档
    -----------------------------------------
   */
  const identityFile = CaseMaterialFile && CaseMaterialFile["1"]//身份证明材料
  const caseStepFile = CaseMaterialFile && CaseMaterialFile["2"]//援助事项材料
  const legalFile = CaseMaterialFile && CaseMaterialFile["3"]//文书材料
  const undertakeFile = CaseMaterialFile && CaseMaterialFile["4"]//承办材料

   /*const undertakeFile  = [
      [
        {
          "tCaseMaterialStorageId": 11423,
          "tCaseId": 10235,
          "tFlowId": 13,
          "tFromStorageId": 661,
          "dicType": "4",
          "focusPoint": null,
          "dicMateriaStatus": "1",
          "tSysFileStorageId": 11425,
          "dicFileType": "4",
          "name": "辩护准备",
          "objectKey": "hp/20170703/magazine-unlock-01-2_1499061882389.jpg",
          "addrUrl": "http://bestone-lawaid.oss-cn-shenzhen.aliyuncs.com/hp/20170703/magazine-unlock-01-2_1499061882389.jpg?Expires=1499065391&OSSAccessKeyId=LTAIU1NhFmuggxrI&Signature=%2B%2F0yy6nxYcpwhUJ3pMo1sj4SEHQ%3D",
          "objectMda": null,
          "remark": null,
          "creatorGolbalId": "14401201710449342",
          "createTime": "2017-07-03",
          "modifierGolbalId": "0",
          "modifyTime": "2017-07-03"
        },
        {
          "tCaseMaterialStorageId": 11425,
          "tCaseId": 10235,
          "tFlowId": 13,
          "tFromStorageId": 661,
          "dicType": "4",
          "focusPoint": null,
          "dicMateriaStatus": "1",
          "tSysFileStorageId": 11427,
          "dicFileType": "4",
          "name": "辩护准备",
          "objectKey": "hp/20170703/magazine-unlock-05-2_1499062022643.jpg",
          "addrUrl": "http://bestone-lawaid.oss-cn-shenzhen.aliyuncs.com/hp/20170703/magazine-unlock-05-2_1499062022643.jpg?Expires=1499065391&OSSAccessKeyId=LTAIU1NhFmuggxrI&Signature=6XJmPofXYyQr%2BhLuQEZKnDPxGEo%3D",
          "objectMda": null,
          "remark": null,
          "creatorGolbalId": "14401201710449342",
          "createTime": "2017-07-03",
          "modifierGolbalId": "0",
          "modifyTime": "2017-07-03"
        }
      ],
      [
        {
          "tCaseMaterialStorageId": 11401,
          "tCaseId": 10235,
          "tFlowId": 27,
          "tFromStorageId": 659,
          "dicType": "4",
          "focusPoint": null,
          "dicMateriaStatus": "1",
          "tSysFileStorageId": 11403,
          "dicFileType": "4",
          "name": "阅卷准备",
          "objectKey": "hp/20170703/1498203940139_1499060949483.jpg",
          "addrUrl": "http://bestone-lawaid.oss-cn-shenzhen.aliyuncs.com/hp/20170703/1498203940139_1499060949483.jpg?Expires=1499065391&OSSAccessKeyId=LTAIU1NhFmuggxrI&Signature=l%2B9jsEhZoPYZLkz4KJD%2FUfIzrRY%3D",
          "objectMda": null,
          "remark": null,
          "creatorGolbalId": "14401201710449342",
          "createTime": "2017-07-03",
          "modifierGolbalId": "0",
          "modifyTime": "2017-07-03"
        },
        {
          "tCaseMaterialStorageId": 11403,
          "tCaseId": 10235,
          "tFlowId": 27,
          "tFromStorageId": 659,
          "dicType": "4",
          "focusPoint": null,
          "dicMateriaStatus": "1",
          "tSysFileStorageId": 11405,
          "dicFileType": "4",
          "name": "阅卷准备",
          "objectKey": "hp/20170703/magazine-unlock-01-2_1499060962786.jpg",
          "addrUrl": "http://bestone-lawaid.oss-cn-shenzhen.aliyuncs.com/hp/20170703/magazine-unlock-01-2_1499060962786.jpg?Expires=1499065391&OSSAccessKeyId=LTAIU1NhFmuggxrI&Signature=Jqnnj5PeHow6Jd5wFDTCADx8ZB0%3D",
          "objectMda": null,
          "remark": null,
          "creatorGolbalId": "14401201710449342",
          "createTime": "2017-07-03",
          "modifierGolbalId": "0",
          "modifyTime": "2017-07-03"
        }
      ],
      [
        {
          "tCaseMaterialStorageId": 11427,
          "tCaseId": 10235,
          "tFlowId": 23,
          "tFromStorageId": 663,
          "dicType": "4",
          "focusPoint": null,
          "dicMateriaStatus": "1",
          "tSysFileStorageId": 11429,
          "dicFileType": "4",
          "name": "事项结束",
          "objectKey": "hp/20170703/magazine-unlock-01-2_1499062512774.jpg",
          "addrUrl": "http://bestone-lawaid.oss-cn-shenzhen.aliyuncs.com/hp/20170703/magazine-unlock-01-2_1499062512774.jpg?Expires=1499065391&OSSAccessKeyId=LTAIU1NhFmuggxrI&Signature=eKX1jOPm%2B58Ao8tiM3qBYwgsoe0%3D",
          "objectMda": null,
          "remark": null,
          "creatorGolbalId": "14401201710449342",
          "createTime": "2017-07-03",
          "modifierGolbalId": "0",
          "modifyTime": "2017-07-03"
        }
      ]
    ]*/

  let rebuildArr =  _.map(undertakeFile, (d, index)=>{
    let o = {}
    if(d.length){
      o = d[0]
      o.list = d
    }
    return o
  })

  rebuildArr = _.flatten(rebuildArr)

  let caseStepFileTotal = 0
  let undertakeFileTotal = 0
  let identityFileTotal = 0

  if(CaseMaterialFile["1"] && identityFile && identityFile.length){
    identityFileTotal = identityFile.length
  }
  
  if(CaseMaterialFile["2"] && caseStepFile && caseStepFile.length){
    caseStepFileTotal = caseStepFile.length
  }

  if(CaseMaterialFile["4"] && rebuildArr && rebuildArr.length){
    undertakeFileTotal = rebuildArr.length
    // undertakeFileTotal = arr.length
  }

  const caseStepFile_Selected = {
      selectedRows: caseStepFile,
      onChange: caseStepFileSelect
  }

  const undertakeFile_Selected = {
      selectedRows: undertakeFile,
      onChange: undertakeFileSelect
  }

  const identityFile_Selected = {
      selectedRows: identityFile,
      onChange: identityFileSelect
  }

  const submitHandle = (e) => {

    let cadList = _.map(undertakeFileData, 'list') || []
    cadList = _.flatten(cadList)
    cadList = _.map(cadList, (d)=>{delete d.list; return d})
    
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        // cadList
      }
      toSubmitStep(data)
    })
  }

  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  }

  const columns = [{
    title: '交通肇事通知书',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '上传人',
    dataIndex: 'creatorName',
    key: 'creatorName',
  }, {
    title: '上传时间',
    dataIndex: 'createTime',
    key: 'createTime',
  }, {
    title: '图片',
    dataIndex: 'addrUrl',
    key: 'addrUrl',
    render: (text, item) => {
      return item.list && item.list.length && item.list.map(d => <a target="_blank" href={d}><img style={{marginRight:5}} width={40} height={40} src={d.addrUrl} /></a>)
      // return text instanceof Array ? 
      // text.map(d => <a target="_blank" href={d}><img style={{marginRight:5}} width={40} height={40} src={d} /></a>) : <a target="_blank" href={text}><img width={40} height={40} src={text} /></a>
    }
  }];

  const onlineCheckCols = [{
    title: '交通肇事通知书',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '上传人',
    dataIndex: 'creatorName',
    key: 'creatorName',
  }, {
    title: '上传时间',
    dataIndex: 'createTime',
    key: 'createTime',
  }, {
    title: '图片',
    dataIndex: 'addrUrl',
    key: 'addrUrl',
    render: (text, item) => {
      return text instanceof Array ? 
      text.map(d => <a target="_blank" href={d}><img style={{marginRight:5}} width={40} height={40} src={d} /></a>) : <a target="_blank" href={text}><img width={40} height={40} src={text} /></a>
    
    }
  }];

  /*console.log(homeFinMaterial)
  console.log(caseStepMaterial)*/

  return (
    <div>
          
            <Modal
            {...modalOpts}
            width="700"
            footer={null}
            title="补充材料"
            >
              <div style={{ margin:20 }}>
                <Collapse accordion defaultActiveKey={['1']} style={{ marginBottom:10 }}>
                  {identityMaterial && identityMaterial.length ?
                    <Panel header={'身份证明材料（共'+identityMaterialTotal+'份，待补充'+identityMaterialData.length+'份）'} key="1">
                      <Table rowKey={record => record.tSysFileStorageId} rowSelection={identityMaterial_Selected} {...state} columns={onlineCheckCols} dataSource={identityMaterial}></Table>
                    </Panel> : ''
                  }

                  {homeFinMaterial && homeFinMaterial.length ?
                    <Panel header={'家庭困难证明材料（共'+homeFinMaterialTotal+'份，待补充'+homeFinMaterialData.length+'份）'} key="2">
                      <Table rowKey={record => record.tSysFileStorageId} rowSelection={homeFinMaterial_Selected} {...state} columns={onlineCheckCols} dataSource={homeFinMaterial}></Table>
                    </Panel> : ''
                  }

                  {
                    caseStepMaterial && caseStepMaterial.length ?
                    <Panel header={'其他事项相关材料（共'+caseStepMaterialTotal+'份，待补充'+caseStepMaterialData.length+'份）'} key="3">
                      <Table rowKey={record => record.tSysFileStorageId} rowSelection={caseStepMaterial_Selected} {...state} columns={onlineCheckCols} dataSource={caseStepMaterial}></Table>
                    </Panel> : ''
                  }
                </Collapse>
                <FormItem>
                  {getFieldDecorator('remark', {
                    initialValue: options,
                    rules: [{
                      required: true,
                      message: '请填写需补充材料说明'
                    }]
                  })(<Input type="textarea" placeholder="需补充材料说明（100字以内）" rows={4} />)}
                </FormItem>
                <Row type="flex" justify="center" style={{ marginTop:20 }}>
                  <Button type="primary" size="large" onClick={submitotherHandle}>提交</Button>
                </Row>
              </div>
            </Modal>
            
    </div>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
