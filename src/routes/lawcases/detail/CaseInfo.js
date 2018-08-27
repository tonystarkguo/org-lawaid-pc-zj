import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'
import { connect } from 'dva'
import { createDicNodes, config, constants } from '../../../utils'
import moment from 'moment'
import _ from 'lodash'
import CaseDocumentInfo from './CaseDocumentInfo'
import { getDataService } from '../../../services/commonService'
import {
  Affix,
  message,
  Modal,
  Switch,
  DatePicker,
  Table,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Radio,
  Icon,
  Spin,
  TreeSelect,
  Card,
  Cascader,
  Progress,
  Upload,
} from 'antd'
const FormItem = Form.Item
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const confirm = Modal.confirm
const { createRadioButton, createSelectOption, createRadio } = createDicNodes
const { api } = config
const { CITY_CASADER_DATA } = constants
const CaseInfo = ({
  lawcaseDetail,
  dispatch,
  handleFileChange,
  handleFileRemove,
  updateUploadType,
  form: {
    getFieldDecorator,
    setFieldsValue,
    getFieldsValue,
    getFieldValue,
    validateFieldsAndScroll,
  },
}) => {
  const {
    tabLoading,
    allConfig,
    caseReason,
    subPersonList,
    fileModal,
    new_dic_standing,
    new_org_aid_type,
    specified_reason = [],
    case_orign_type,
    tagList,
    docsList = [],
    caseId,
    cityData,
    curTotalFileList=[],
  } = lawcaseDetail
  const { dictData, organizationTypeData } = allConfig
  let haveUploadedFileList = curTotalFileList && curTotalFileList.filter((item, index) => item.status === 'done')
  let {
    dic_case_orign_type = [],
    dic_case_orign_type_notice = [],
    dic_case_orign__type_request = [],
    dic_case_orign_type_business = [],
  } = dictData
  if (dic_case_orign_type[0]) {
    dic_case_orign_type.forEach(item => {
      item.label = item.name
      item.value = item.code
    })
    dic_case_orign_type_notice.forEach(item => {
      item.label = item.name
      item.value = item.code
    })
    dic_case_orign_type[0].children = dic_case_orign_type_notice
  }
  if (dic_case_orign_type[1]) {
    dic_case_orign__type_request.forEach(item => {
      item.label = item.name
      item.value = item.code
    })
    const dic_case_orign_type_request_noweb = dic_case_orign__type_request.filter(item => {
      return item.name !== '网上申请'
    })
    dic_case_orign_type[1].children = dic_case_orign_type_request_noweb
  }
  if (dic_case_orign_type[2]) {
    dic_case_orign_type_business.forEach(item => {
      item.label = item.name
      item.value = item.code
    })
    dic_case_orign_type[2].children = dic_case_orign_type_business
  }

  const caseDocumentProps = {
    lawcaseDetail: {
      docsList,
      caseId,
    },
  }

  const handleSaveData = (data, saveFlag) => {
    let caseInfo = {}
    let baseInfo = {}
    for (let key in data) {
      if (key.indexOf('case_') > -1) {
        caseInfo[key.replace('case_', '')] = data[key]
      } else if (key.indexOf('base_') > -1) {
        baseInfo[key.replace('base_', '')] = data[key]
      }
    }
    if (saveFlag) {
      caseInfo.saveFlag = saveFlag
    }
    // caseInfo.caseReasonId = caseInfo.caseReasonId.map(item => item.value)
    caseInfo.dicOrignChannelType = caseInfo.lawAidType[0] || ''
    caseInfo.dicOrignChannel = caseInfo.lawAidType[1] || ''
    if (caseInfo.standingCode.length === 2) {
      caseInfo.standingCode = caseInfo.standingCode[caseInfo.standingCode.length - 1] || ''
      caseInfo.caseStepCode = caseInfo.standingCode.substring(0, caseInfo.standingCode.length - 3) || ''
    } else {
      caseInfo.caseStepCode = caseInfo.standingCode[0]
      caseInfo.standingCode = ''
    }

    caseInfo.caseAidWayCode = caseInfo.caseAidWayCode[0] || ''
    if (data.base_area) {
      baseInfo.tSmsProvince = data.base_area[0] || ''
      baseInfo.tSmsCity = data.base_area[1] || ''
      baseInfo.tSmsArea = data.base_area[2] || ''
    }
    caseInfo.suboRpUser = subPersonList
    // let handledReason = _.map(caseInfo.caseReasonId, 'value')
    // caseInfo.caseReasonId = handledReason
    return { caseInfo, baseInfo }
  }
  // 点击保存按钮
  const handleSave = () => {
    validateFieldsAndScroll((errors) => {
      if (errors) {
        return
      }
      /* else if (fileModal && fileModal.identifyFileList.length === 0 && fileModal.homeFinFileList.length === 0 && fileModal.caseRelatedFileList.length === 0) {
        message.error('请上传材料')
        return
      }*/
      const data = {
        ...getFieldsValue(),
      }
      const saveData = handleSaveData(data, 5)
      const { caseInfo, baseInfo } = saveData
      confirm({
        title: '提示',
        content: '请确认已打印申请表且受援人已签名',
        okText: '已确认签名',
        cancelText: '返回',
        onOk () {
          dispatch({
            type: 'lawcaseDetail/saveInfo',
            payload: {
              caseInfo,
              baseInfo,
            },
          })
        },
        onCancel () {
          // console.log('Cancel');
        },
      })
    })
  }

  // 点击确认受理
  const handleSubmit = () => {
    validateFieldsAndScroll((errors) => {
      if (errors) {
        return
      } /* else if (fileModal && fileModal.identifyFileList.length === 0 && fileModal.homeFinFileList.length === 0 && fileModal.caseRelatedFileList.length === 0) {
        message.error('请上传材料')
        return
      }*/
      const data = {
        ...getFieldsValue(),
      }
      const saveData = handleSaveData(data, 6)
      const { caseInfo, baseInfo } = saveData
      console.log(saveData)
      baseInfo.dicConsultantCategoryList = baseInfo.dicConsultantCategoryList.map(item => {
        return { value: item }
      })
      caseInfo.dicConsultantCategoryList = baseInfo.dicConsultantCategoryList
      dispatch({
        type: 'lawcaseDetail/saveInfo',
        payload: {
          caseInfo,
          baseInfo,
        },
      })
    })
  }

  const handleCaseTypeChange = (value) => {
    // 清除案由，援助方式，地位
    setFieldsValue({
      case_caseReasonId: [],
    })
    dispatch({ type: 'lawcaseDetail/handleCaseTypeChange', value })
  }

  const handleAidTypeChange = (value) => {
    if (getFieldValue('case_noticeReason')) {
      setFieldsValue({
        case_noticeReason: '',
      })
    }
    setFieldsValue({
      case_caseAidWayCode: [],
    })
    dispatch({ type: 'lawcaseDetail/handleNoticeReasonChange', value })
  }

  const handleAddSubPerson = () => {
    dispatch({ type: 'lawcaseDetail/showSubPersonModal' })
  }

  const handleDeleteSubPerson = (item) => {
    confirm({
      title: '删除',
      content: `是否删除确定 “${item.name}”？`,
      onOk () {
        dispatch({ type: 'lawcaseDetail/deleteSubPerson', item })
      },
    })
  }

  const handleEditSubPerson = (item) => {
    dispatch({
      type: 'lawcaseDetail/setSubPersonItem',
      payload: item,
    })
  }

		// 根据证件和证件号填入籍贯、性别、出生年月
  const writeApplerInfoByIdCard = async() => {
    const cardCode = getFieldValue('base_cardCode')
    const dicCardType = getFieldValue('base_dicCardType')
    const birthCardCode = cardCode && cardCode.substring(6, 14)
    const sexCardCode = cardCode && cardCode.substring(16, 17)
    const length = cardCode && cardCode.length
    if (length == 18 && dicCardType === 'SF') {
      const idCardcodeInfo = await getDataService({
    				url: api.writeInfoById,
    			}, { cardCode, dicCardType, serviceId: 'writeInfoById' })
    			if (idCardcodeInfo && idCardcodeInfo.data) {
            const data = idCardcodeInfo.data || {}
            console.log(data)
    				let setValue = {}
            const getValue = getFieldsValue()
            console.log(getValue)
      for (let key in data) {
        const baseKey = `base_${key}`
        if (getValue.hasOwnProperty(baseKey)) {
          	if (key == 'base_area' || key == 'base_birthdate' || key == 'base_dicGender') {
            setValue[`base_${key}`] = data[key]
          }
        }
      }
      if (data.tSmsProvince && data.tSmsCity && data.tSmsArea) {
        setValue.base_area = [
          data
              .tSmsProvince
              .toString(),
          data
              .tSmsCity
              .toString(),
          data
              .tSmsArea
              .toString(),
        ] || undefined
      }
      setValue.base_birthdate = birthCardCode ? moment(birthCardCode) : undefined
      setValue.base_dicGender = sexCardCode % 2 === 0 ? '2' : '1'
      setFieldsValue({
          ...setValue,
      })
    }else{
      const getValue = getFieldsValue()
      getValue.base_birthdate = birthCardCode ? moment(birthCardCode) : undefined
      getValue.base_dicGender = sexCardCode % 2 === 0 ? '2' : '1'
      setFieldsValue({
        ...getValue,
    })
    }
    } else {
      
      
    	//    message.warn('请输入正确的证件类型及证件号码！')

    }
  }

  // 点击自动填入历史信息
  const searchApplyerByIdCard = async() => {
    const cardCode = getFieldValue('base_cardCode')
    const dicCardType = getFieldValue('base_dicCardType')
    if (cardCode === '' || typeof cardCode === 'undefined' || dicCardType === '' || typeof dicCardType === 'undefined') {
      message.warn('请输入证件类型及证件号码！')
    } else {
      const userInfo = await getDataService({
        url: api.searchInfoById,
      }, { cardCode, dicCardType, serviceId: 'searchInfoById' })
      if (userInfo && userInfo.data) {
        const data = userInfo.data || {}
        let setValue = {}
        const getValue = getFieldsValue()
        for (let key in data) {
          const baseKey = `base_${key}`
          if (getValue.hasOwnProperty(baseKey)) {
            setValue[`base_${key}`] = data[key]
          }
        }
        if (data.tSmsProvince && data.tSmsCity && data.tSmsArea) {
          setValue.base_area = [
            data
              .tSmsProvince
              .toString(),
            data
              .tSmsCity
              .toString(),
            data
              .tSmsArea
              .toString(),
          ] || undefined
        }
        setValue.base_birthdate = data.birthdate ? moment(data.birthdate) : undefined
        setValue.base_dicConsultantCategoryList =
          data.dicConsultantCategoryList ?
          data.dicConsultantCategoryList
          .map(item => item.value && item.value.toString()) || [] : []
        setFieldsValue({
          ...setValue,
        })
        console.log(setValue)
      } else {
        message.warn('此证件号尚未输入系统！')
      }
    }
  }

  const changeVal = (e) => {
    const val = e.target.value
    const length = val.length
    if (length > 250) {
      message.warning('案件概况最多输入250字！')
    } else {
      dispatch({
        type: 'lawcaseDetail/caseDetailChange',
        payload: val,
      })
    }
  }

  // 点击读取身份证识别仪信息
  const searchApplyerMsg = () => {
    Modal.info({
      content: '身份证识别仪正在对接开发中，请手动录入申请人信息或查询其身份证历史信息记录',
      okText: '确定',
    })
  }

  let treeDefaultExpandedKeys = []
  if (caseReason && caseReason.length && caseReason[0].children.length) {
    treeDefaultExpandedKeys.push(caseReason[0].value)
  }


  const treeProps = {
    treeData: caseReason,
    multiple: true,
    // treeCheckable: true,
    size: 'large',
    placeholder: '',
    treeNodeFilterProp: 'label',
    treeDefaultExpandedKeys,
    // treeCheckStrictly: true,
    onSelect: (value, node, extra) => {
      let caseRea = getFieldValue('case_caseReasonId')
      if (!node.props.isChild) {
        setTimeout(() => {
          caseRea = _.reject(caseRea, (item) => item === value)
          setFieldsValue({ case_caseReasonId: caseRea })
        }, 10)
      }
    },
    getPopupContainer: () => document.getElementById('scroll-area'),
  }

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 10,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 14,
      },
      sm: {
        span: 15,
      },
    },
  }

  const leftFormItemLayout = {
    labelCol: {
      xs: {
        span: 10,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 14,
      },
      sm: {
        span: 15,
      },
    },
  }

  const formItemLayoutWidth = {
    labelCol: {
      xs: {
        span: 5,
      },
      sm: {
        span: 4,
      },
    },
    wrapperCol: {
      xs: {
        span: 17,
      },
      sm: {
        span: 18,
      },
    },
  }

  const formItemLayoutSmall = {
    labelCol: {
      xs: {
        span: 12,
      },
      sm: {
        span: 12,
      },
    },
    wrapperCol: {
      xs: {
        span: 12,
      },
      sm: {
        span: 12,
      },
    },
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'flag',
      key: 'flag',
      width: 64,
      render: (text, record, index) => <div width={24}>{index + 1}</div>,
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '性别',
      dataIndex: 'dicGenderName',
      key: 'dicGenderName',
    }, {
      title: '证件类型',
      dataIndex: 'credentialsTypeName',
      key: 'credentialsTypeName',
    }, {
      title: '证件号',
      dataIndex: 'cardCode',
      key: 'cardCode',
    }, {
      title: '联系电话',
      dataIndex: 'mobile',
      key: 'mobile',
    }, {
      title: '类别',
      dataIndex: 'popCatesName',
      key: 'popCatesName',
    }, {
      title: '操作',
      dataIndex: 'tRpUserId',
      key: 'tRpUserId',
      render: (text, record) => (
        <div>
         <Button
           className={styles.csBtn}
           type="primary"
           onClick={(e) => handleEditSubPerson(record)}
         >编辑</Button>
          <Button
            className={styles.csBtn}
            type="primary"
            onClick={() => handleDeleteSubPerson(record)}
          >删除</Button>
        </div>
      ),
    },
  ]

  const handleMenuClick = (record) => {
    updateUploadType(record.key)
  }

  const getFileListByType = (t) => {
    let result = []
    if (t === 1) {
      result = fileModal.identifyFileList
    } else if (t === 5) {
      result = fileModal.homeFinFileList
    } else if (t === 6) {
      result = fileModal.caseRelatedFileList
    }
    return result
  }
  const modalProps = {
    visible :  
      curTotalFileList.length == haveUploadedFileList.length ? false : true,
      footer: null, 
      closable: false,
  }
  const uploadProps = {
    action: '/uploadtopri',
    onChange: handleFileChange,
    onRemove: handleFileRemove,
    multiple: true,
    beforeUpload: (file, fileList) => {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png')
      if (!isJPG) {
        message.error('只能上传jpeg，png格式的图片!')
      }
      dispatch({
        type: 'lawcaseDetail/updateProgress',
        payload: fileList,
      })
      return isJPG
    },
    data: (file) => {
      const dt = new Date().format('yyyyMMdd')
      const lg = new Date().getTime()
      let h = fileModal.fileData
      h.key = `orm/${dt}/${lg}_\${filename}`
      let o = {}
      o[file.uid] = `orm/${dt}/${lg}_${file.name}`
      dispatch({type: 'lawcaseDetail/updateFileKey', payload: o})
      return h
    },
    //  fileList: getFileListByType(1),//fileModal.fileList, disabled: true
  }

  const metCols = [
    {
      title: '材料名称',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      render: (text, record) => {
        let t = record.key
        let renderText
        if (t === 1 && getFieldValue('case_lawAidType') && getFieldValue('case_lawAidType')[0] === '2') {
          renderText = (<div><Button type="primary" size="small">
              <a target="_blank" href={`${api.baseURL}/print/printView.html?defaultFileAddr=法律援助申请表.doc`}>
                <Icon type="printer" />打印申请表模板
              </a>
            </Button>
            <div>{text}</div>
            </div>)
        } else {
          renderText = text
        }
        return renderText
      },
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 200,
    }, {
      title: '材料文件',
      dataIndex: 'meterials',
      key: 'meterials',
      width: 200,
      render: (text, record) => {
        let t = record.key
        let renderFileList = []
        if (t === 1) {
          renderFileList = fileModal.identifyFileList
        } else if (t === 5) {
          renderFileList = fileModal.homeFinFileList
        } else if (t === 6) {
          renderFileList = fileModal.caseRelatedFileList
        }
        return (
          <div>
            <Upload {...uploadProps} fileList={renderFileList}>
              <Button key={record.key} onClick={() => handleMenuClick(record)} disabled={!fileModal.finishedUpload}>
                <Icon type="upload" />
                上传
              </Button>
            </Upload>
          </div>
        )
      },
    },
  ]

  const metData = [
    {
      key: 1,
      name: '有效身份证明',
      meterials: [
        {
          url: 'http://baidu.com',
        },
      ],
      remark: '身份证、军官证、护照、港澳台身份证、户口本、临时身份证、武警警官证、士兵证；代理则需要代理人身份证明，关系证明或申请人授权委托书。',
    }, {
      key: 5,
      name: '经济困难证明材料',
      meterials: [
        {
          url: 'http://baidu.com',
        },
      ],
      remark: '乡镇街道政府有关政府部门（人民团体）出具的生活困难证明，或者下岗职工执业证、低保户家庭证、低保边缘家庭证等。',
    }, {
      key: 6,
      name: '申请事项相关材料',
      meterials: [
        {
          url: 'http://baidu.com',
        },
      ],
      remark: '与所申请法律援助事项有关证据证明材料。',
    },
  ]

  const noticeData = [
    {
      key: 1,
      name: '文书',
      meterials: [
        {
          url: 'http://baidu.com',
        },
      ],
      remark: '公安、 检察院 、 法院等开具的要求法律援助的相关文书。',
    }, {
      key: 5,
      name: '相关材料',
      meterials: [
        {
          url: 'http://baidu.com',
        },
      ],
      remark: '与法律援助事项有关的材料。',
    },
  ]

  const token = localStorage.getItem('token') || ''

  const nationChange = (value, selectedOptions) => {
    console.log(selectedOptions)
  }

  // 点击打印申请表
  const printForm = () => {
    const data = {
      caseReasonNames: getFieldValue('case_caseReasonId'),
      name: getFieldValue('base_name'),
      dicGenderName: getFieldValue('base_dicGender') === '1' ? '男' : '女',
      dicNationName: getFieldValue('base_dicNation'),
      tSmsProvinceId: getFieldValue('base_area') && getFieldValue('base_area').length ? getFieldValue('base_area')[0] : '',
      tSmsCityId: getFieldValue('base_area') && getFieldValue('base_area').length ? getFieldValue('base_area')[1] : '',
      tSmsAreaId: getFieldValue('base_area') && getFieldValue('base_area').length ? getFieldValue('base_area')[2] : '',
      dicEduLevelName: getFieldValue('base_dicEduLevel'),
      cardCode: getFieldValue('base_cardCode'),
      cardAddress: getFieldValue('base_regis'),
      usualAddr: getFieldValue('base_usualAddr'),
      legalInstAddr: getFieldValue('base_legalInstAddr'),
      workUnit: getFieldValue('base_workUnit'),
      mobile: getFieldValue('base_mobile'),
      dicConsultantCategory: getFieldValue('base_dicConsultantCategoryList'),
      isApply: getFieldValue('base_isApply') === true ? '是' : '否',
      applyAddress: getFieldValue('base_applyAddress'),
      applyDate: getFieldValue('base_applyDate') && getFieldValue('base_applyDate').format('YYYY-MM-DD'),
      proxyName: getFieldValue('case_proxyName'),
      dicProxyType: getFieldValue('case_dicProxyType'),
      proxyCardCode: getFieldValue('case_proxyCardCode'),
      proxyMobile: getFieldValue('case_proxyMobile'),
      caseDetail: getFieldValue('case_caseDetail'),
    }
    // console.log(data)
    localStorage.setItem('printReqParams', JSON.stringify(data))
    window.open(`${api.baseURL}/print/printView.html?from=fromLocalStorage`)
  }

  return (
    <div>
      <Affix
        style={{
          textAlign: 'right',
        }}
        offsetTop={8}
        target={() => document.getElementById('main-container')}
      >
        <Button.Group>
            <Button type="primary" size="large">
              <a onClick={printForm}>
                <Icon type="printer" />打印申请表
              </a>
            </Button>
          <Button type="primary" size="large" onClick={handleSubmit}>
            <Icon type="upload" />确认受理，提交初审
          </Button>
        </Button.Group>
      </Affix>
      <Form layout="horizontal" className="login-form">
      	<Card title="案件性质及来源">
          <Spin spinning={tabLoading}>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...leftFormItemLayout} label="法律援助类型">
                  {getFieldDecorator('case_lawAidType', {
                    rules: [
                      {
                        required: true,
                        message: '请选择法律援助类型',
                      },
                    ],
                  })(<Cascader size="large" options={dic_case_orign_type} placeholder="请选择法律援助类型" onChange={handleAidTypeChange} />)}
                </FormItem>
              </Col>
            </Row>

            {getFieldValue('case_lawAidType') && (getFieldValue('case_lawAidType')[0] === '1' || getFieldValue('case_lawAidType')[0] === '3') &&
              <Row>
                <Row gutter={16}>
                  <Col span={24}>
                  <FormItem {...formItemLayoutWidth} label={getFieldValue('case_lawAidType')[0] === '1' ? '通知原因' : '商请原因'}>
                      {getFieldDecorator('case_noticeReason', {
                      	rules: [
                        {
                          required: true,
                          message: getFieldValue('case_lawAidType')[0] === '1' ? '请选择通知原因' : '请选择商请原因',
                        },
                      ],
                      })(
                      <Select allowClear size="large" placeholder={getFieldValue('case_lawAidType')[0] === '1' ? '请选择通知原因' : '请选择商请原因'}>
                        {createSelectOption({ list: specified_reason })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label={getFieldValue('case_lawAidType')[0] === '1' ? '通知机关名称' : '商请机关名称'}>
                      {getFieldDecorator('case_noticeOrgName', {
                        rules: [
                          {
                            required: true,
                            message: getFieldValue('case_lawAidType')[0] === '1' ? '请输入通知机关名称' : '请输入商请机关名称',
                          },
                        ],
                      })(<Input size="large" placeholder={getFieldValue('case_lawAidType')[0] === '1' ? '请输入通知机关名称' : '请输入商请机关名称'} />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label={getFieldValue('case_lawAidType')[0] === '1' ? '通知函号' : '商请函号'}>
                      {getFieldDecorator('case_noticeBoxNumber', {
                        rules: [
                          {
                            required: true,
                            message: getFieldValue('case_lawAidType')[0] === '1' ? '请输入通知函号' : '请输入商请函号',
                          },
                        ],
                      })(<Input size="large" placeholder={getFieldValue('case_lawAidType')[0] === '1' ? '请输入通知函号' : '请输入商请函号'} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={16}>
                  {/* <Col span={12}>
                    <FormItem {...formItemLayout} label="" label={getFieldValue('case_lawAidType')[0] === '1' ? '通知原因' : '商请原因'}>
                      {getFieldDecorator('case_noticeReason', {
                        rules: [
                          {
                            required: true,
                            message: getFieldValue('case_lawAidType')[0] === '1' ? '请输入通知原因' : '请输入商请原因',
                          }
                        ]
                      })(<Input size="large" placeholder={getFieldValue('case_lawAidType')[0] === '1' ? '请输入通知原因' : '请输入商请原因'} />)}
                    </FormItem>
                  </Col>*/}
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="办案人员姓名">
                      {getFieldDecorator('case_undertakeJudge')(<Input size="large" placeholder="请输入办案人员姓名" />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="办案人员联系电话">
                      {getFieldDecorator('case_judgeMobile')(<Input size="large" placeholder="请输入办案人员联系电话" />)}
                    </FormItem>
                  </Col>
                </Row>
              </Row>
            }

            {getFieldValue('case_lawAidType') && getFieldValue('case_lawAidType')[0] === '2' && getFieldValue('case_lawAidType')[1] === '3' && <Row className={styles.pannelhr} gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="转交机关类型">
                  {getFieldDecorator('case_dicTransferOrgType', {
                    rules: [
                      {
                        required: true,
                        message: '请选择转交机关类型',
                      },
                    ],
                  })(
                    <Select allowClear size="large" placeholder="请选择转交机关类型">
                      {createSelectOption({ list: dictData.dic_case_orign_request_notice })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="转交机关名称">
                  {getFieldDecorator('case_transferOrgName', {})(<Input size="large" placeholder="请输入转交机关名称" />)}
                </FormItem>
              </Col>
            </Row>}

            <Row className={styles.pannelhr}>
              <Col span={24}>
                <FormItem {...formItemLayoutWidth} label="案件类别">
                  {getFieldDecorator('case_caseTypeCode', {
                    rules: [
                      {
                        required: true,
                        message: '请选择案件类别',
                      },
                    ],
                  })(
                    <Select allowClear size="large" onChange={handleCaseTypeChange}>
                      {createSelectOption({ list: dictData.dic_case_type })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              </Row>
              </Spin>
              </Card>
        <Card title={getFieldValue('case_lawAidType') && getFieldValue('case_lawAidType')[0] === '2' ? '申请人信息' : '受援人信息'} id="components-anchor-demo-basic" style={{ marginTop: '20px' }}>
          <Spin spinning={tabLoading}>
            <Row className={styles.pannelhr} gutter={16}>
              <Col className="gutter-row" span={12}>
                <div className="gutter-box">
                  <FormItem {...leftFormItemLayout} label={getFieldValue('case_lawAidType') && getFieldValue('case_lawAidType')[0] === '2' ? '申请人姓名' : '受援人姓名'}>
                    {getFieldDecorator('base_name', {
                      rules: [
                        {
                          required: true,
                          message: '请输入申请人姓名',
                        },
                      ],
                    })(<Input size="large" placeholder="请输入申请人姓名" />)}
                  </FormItem>

                  <FormItem {...leftFormItemLayout} label="证件类型">
                    {getFieldDecorator('base_dicCardType', {
                    	initialValue: 'SF',
                    })(
                      <Select allowClear size="large" placeholder="请选择证件类型">
                        {createSelectOption({ list: dictData.dic_credentials_type })}
                      </Select>
                    )}
                  </FormItem>

                  <FormItem {...leftFormItemLayout} label="证件号码">
                    <Row gutter={32}>
                      <Col span={24}>
                        {getFieldDecorator('base_cardCode')(<Input size="large" maxLength={'18'} placeholder="请输入证件号码" onBlur={writeApplerInfoByIdCard} />)}
                      </Col>
                      <Col span={6} offset={5} style={{ marginTop: 5 }}>
                        <Button
                          type="primary"
                          icon="search"
                          onClick={searchApplyerByIdCard}
                          size="large"
                          style={{
                            float: 'right',
                            fontSize: '14px',
                          }}
                        >自动填入历史信息</Button>
                      </Col>
                      <Col span={4} offset={9} style={{ marginTop: 5 }}>
                        <Button
                          type="primary"
                          onClick={searchApplyerMsg}
                          size="large"
                          style={{
                            float: 'right',
                            fontSize: '14px',
                          }}
                        >读取身份证识别仪信息</Button>
                      </Col>
                    </Row>
                  </FormItem>

                  <FormItem {...leftFormItemLayout} label="联系电话">
                    {getFieldDecorator('base_mobile')(<Input size="large" placeholder="请输入联系电话" />)}
                  </FormItem>

                  <FormItem {...leftFormItemLayout} label="证件地址">
                    {getFieldDecorator('base_regis', {})(<Input size="large" placeholder="请输入证件地址" />)}
                  </FormItem>

                  <FormItem {...leftFormItemLayout} label="经常居住地址">
                    {getFieldDecorator('base_usualAddr', {})(<Input size="large" placeholder="请输入经常居住地址" />)}
                  </FormItem>

                  <FormItem {...leftFormItemLayout} label="通讯地址">
                    {getFieldDecorator('base_legalInstAddr', {
                      rules: [
                        {
                          required: getFieldValue('base_dicLegalInstWay') === 'YJ',
                          message: '请输入通讯地址',
                        },
                      ],
                    })(<Input size="large" placeholder="请输入通讯地址" />)}
                  </FormItem>

                  <FormItem {...leftFormItemLayout} label="人群类别">
                    {getFieldDecorator('base_dicConsultantCategoryList', {
                      rules: [
                        {
                          required: true,
                          message: '请选择人群类别',
                        },
                      ],
                    })(
                      <Select allowClear size="large" mode="multiple" placeholder="请选择人群类别">
                        {createSelectOption({ list: dictData.dic_dic_occupatio })}
                      </Select>
                    )}
                  </FormItem>
                </div>
              </Col>
              <Col className="gutter-row" span={12}>
                <div className="gutter-box">

                  <FormItem {...leftFormItemLayout} label="性别">
                    {getFieldDecorator('base_dicGender', {
                      initialValue: '1',
                    })(
                      <RadioGroup>
                        {createRadio({ list: dictData.dic_gender })}
                      </RadioGroup>
                    )}
                  </FormItem>

                  <FormItem {...leftFormItemLayout} label="出生日期">
                    {getFieldDecorator('base_birthdate', {})(<DatePicker format="YYYY-MM-DD" placeholder="请选择或输入日期" />)}
                  </FormItem>

                  <FormItem label="国籍" {...leftFormItemLayout}>
                    {getFieldDecorator('base_dicNationality', {
                      initialValue: '1',
                    })(
                      <Select allowClear size="large" placeholder="请选择国籍">
                        {createSelectOption({ list: dictData.dic_nationality })}
                      </Select>
                    )}
                  </FormItem>

                  <FormItem {...leftFormItemLayout} label="籍贯">
                    {getFieldDecorator('base_area', {})(<Cascader
                      size="large"
                      showSearch
                      options={CITY_CASADER_DATA}
                      placeholder="请选择籍贯（可搜索）"
                    />)}
                  </FormItem>

                  <FormItem {...leftFormItemLayout} label="民族">
                    {getFieldDecorator('base_dicNation', { initialValue: '01' })(
                      <Select allowClear size="large" initialValue="1" placeholder="请选择民族" onChange={nationChange}>
                        {createSelectOption({ list: dictData.dic_ethnic_group })}
                      </Select>
                    )}
                  </FormItem>

                  <FormItem {...leftFormItemLayout} label="文化程度">
                    {getFieldDecorator('base_dicEduLevel', {})(
                      <Select allowClear size="large" initialValue="1" placeholder="请选择文化程度">
                        {createSelectOption({ list: dictData.dic_cultural_level })}
                      </Select>
                    )}
                  </FormItem>

                  <FormItem {...leftFormItemLayout} label="工作单位">
                    {getFieldDecorator('base_workUnit', {})(<Input size="large" placeholder="请输入工作单位" />)}
                  </FormItem>

                  <FormItem {...leftFormItemLayout} label="文书送达方式">
                    {getFieldDecorator('base_dicLegalInstWay', {
                      initialValue: 'ZQ',
                    })(
                      <Select allowClear size="large" placeholder="请选择文书送达方式">
                        {createSelectOption({ list: dictData.dic_file_mailing })}
                      </Select>
                    )}
                  </FormItem>

                </div>
              </Col>
            </Row>

            <div className={styles.pannelhr}>
              <Row>
                <Col span={12}>
                  <FormItem {...formItemLayoutSmall} label="是否曾经申请过法律援助">
                    {getFieldDecorator('base_isApply', {})(
                      <RadioGroup>
                        <RadioButton value>是</RadioButton>
                        <RadioButton value={false}>否</RadioButton>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                {getFieldValue('base_isApply') && <Col span={12}>
                  <FormItem {...formItemLayout} label="前次申请地点">
                    {getFieldDecorator('base_applyAddress', {
                      rules: [
                        {
                          required: true,
                          message: '请输入前次申请地点',
                        },
                      ],
                    })(<Input size="large" placeholder="请输入前次申请地点" />)}
                  </FormItem>
                </Col>}
                {getFieldValue('base_isApply') && <Col span={12}>
                  <FormItem {...formItemLayout} label="前次申请日期">
                    {getFieldDecorator('base_applyDate', {
                      rules: [
                        {
                          required: true,
                          message: '请选择前次申请日期',
                        },
                      ],
                    })(<DatePicker
                      format="YYYY-MM-DD"
                      style={{
                        width: '100%!important',
                      }}
                      placeholder="请选择或者输入前次申请日期"
                    />)}
                  </FormItem>
                </Col>}
              </Row>
            </div>

            <Row>
              <Col span={12}>
                <FormItem {...formItemLayoutSmall} label="是否代理申请">
                  {getFieldDecorator('case_isProxy', {})(<Switch />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              {getFieldValue('case_isProxy') && <Col span={12}>
                <FormItem {...formItemLayout} label="代理人姓名">
                  {getFieldDecorator('case_proxyName', {
                    rules: [
                      {
                        required: true,
                        message: '请输入代理人姓名',
                      },
                    ],
                  })(<Input size="large" placeholder="请输入代理人姓名" />)}
                </FormItem>
              </Col>}
              {getFieldValue('case_isProxy') && <Col span={12}>
                <FormItem {...formItemLayout} label="代理人联系电话">
                  {getFieldDecorator('case_proxyMobile', {
                    rules: [
                      {
                        required: true,
                        message: '请输入代理人联系电话',
                      },
                    ],
                  })(<Input size="large" placeholder="请输入代理人联系电话" />)}
                </FormItem>
              </Col>}
            </Row>
            <Row>
              {getFieldValue('case_isProxy') && <Col span={12}>
                <FormItem {...formItemLayout} label="代理人身份证号码">
                  {getFieldDecorator('case_proxyCardCode', {
                    rules: [
                      {
                        required: true,
                        message: '请输入代理人身份证号码',
                      },
                    ],
                  })(<Input size="large" placeholder="请输入代理人身份证号码" />)}
                </FormItem>
              </Col>}
              {getFieldValue('case_isProxy') && <Col span={12}>
                <FormItem {...formItemLayout} label="代理人类别">
                  {getFieldDecorator('case_dicProxyType', {
                    rules: [
                      {
                        required: true,
                        message: '请输入代理人类别',
                      },
                    ],
                  })(
                    <Select allowClear size="large" placeholder="请输入代理人类别">
                      {createSelectOption({ list: dictData.dic_dic_case_proxy_type })}
                    </Select>
                  )}
                </FormItem>
              </Col>}
            </Row>

          </Spin>
        </Card>

        <Card title="案件信息" style={{ marginTop: '20px' }}>
          <Spin spinning={tabLoading}>
           <Row className={styles.pannelhr}>
              <Col span={24}>
                <FormItem {...formItemLayoutWidth} label="案由">
                  {getFieldDecorator('case_caseReasonId', {
                    rules: [
                      {
                        required: true,
                        message: '请选择案由',
                      },
                    ],
                  })(<TreeSelect dropdownStyle={{ maxHeight: 200, overflow: 'auto' }} {...treeProps} />)}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem {...formItemLayoutWidth} label="案情概况">
                  {getFieldDecorator('case_caseDetail', {
                    rules: [
                      {
                        required: true,
                        message: '请输入案情概况',
                      },
                    ],
                  })(<Input type="textarea" rows={4} maxLength={'251'} onChange={changeVal} />)}
                </FormItem>
              </Col>
            </Row>

            <Row>
              {getFieldValue('case_caseTypeCode') === '01' && <Col span={12}>
                <FormItem {...formItemLayout} label="羁押状态">
                  {getFieldDecorator('case_dicRemandStatus', {
                    initialValue: '2',
                    rules: [
                      {
                        required: true,
                        message: '请选择羁押状态',
                      },
                    ],
                  })(
                    <Select allowClear size="large" placeholder="请选择羁押状态">
                      {createSelectOption({ list: dictData.dic_dic_remand_status })}
                    </Select>
                  )}
                </FormItem>
              </Col>}
              {getFieldValue('case_caseTypeCode') === '01' && getFieldValue('case_dicRemandStatus') === '1' && <Col span={12}>
                <FormItem {...formItemLayout} label="羁押地">
                  {getFieldDecorator('case_remandTypeName', {
                    rules: [
                      {
                        required: true,
                        message: '请选择羁押地',
                      },
                    ],
                  })(
                    <Select
                      showSearch
                      size="large"
                      notFoundContent=""
                      defaultActiveFirstOption={false}
                      showArrow
                      filterOption={false}
                      placeholder="输入关键字可模糊查找"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {createSelectOption({ list: organizationTypeData.organization_type_10 })}
                    </Select>
                  )}
                </FormItem>
              </Col>}
              {getFieldValue('case_caseTypeCode') === '01' && getFieldValue('case_dicRemandStatus') === '3' && <Col span={12}>
                <FormItem {...formItemLayout} label="服刑地">
                  {getFieldDecorator('case_sentenceAddress', {
                    rules: [
                      {
                        required: true,
                        message: '请输入服刑地',
                      },
                    ],
                  })(
                    <Select
                      showSearch
                      size="large"
                      notFoundContent=""
                      defaultActiveFirstOption={false}
                      showArrow
                      filterOption={false}
                      placeholder="输入关键字可模糊查找"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {createSelectOption({ list: organizationTypeData.organization_type_9 })}
                    </Select>
                  )}
                </FormItem>
              </Col>}
            </Row>

            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} label="法律状态及地位">
                  {getFieldDecorator('case_standingCode', {
                    rules: [
                      {
                        required: true,
                        message: '请选择法律状态及地位',
                      },
                    ],
                  })(<Cascader options={new_dic_standing} placeholder="请选择法律状态及地位" onChange={(v) => console.log(v)} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="援助方式">
                  {getFieldDecorator('case_caseAidWayCode', {
                    rules: [
                      {
                        required: true,
                        message: '请选择援助方式',
                      },
                    ],
                  })(<Cascader options={new_org_aid_type} placeholder="请选择援助方式" />)}
                </FormItem>
              </Col>
            </Row>

            <Row className={styles.pannelhr} gutter={16}>
              <Row>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="案件涉及人数">
                    {getFieldDecorator('case_involveCountCode', {
                      initialValue: 'N',
                      rules: [
                        {
                          required: true,
                          message: '请选择案件涉及人数',
                        },
                      ],
                    })(
                      <RadioGroup>
                        {createRadioButton({ list: dictData.dic_case_type_multi })}
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                <FormItem {...formItemLayout} label="是否典型案件">
                  {getFieldDecorator('case_isTypical', {
                  	initialValue: false,
                    rules: [
                      {
                        required: true,
                        message: '请选择是否典型案件',
                      },
                    ],
                  })(
                    <RadioGroup>
                      <RadioButton value>是</RadioButton>
                      <RadioButton value={false}>否</RadioButton>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
              </Row>
            </Row>
          </Spin>
        </Card>

        {getFieldValue('case_involveCountCode') === 'M' && <Card title="从案人员" style={{
          marginTop: '20px',
        }}>
          <div
            style={{
              textAlign: 'right',
              marginBottom: '20px',
            }}
          >
            <Button
              type="primary"
              size="large"
              onClick={handleAddSubPerson}
              style={{ display: 'inline-block' }}
            >新 增</Button>
          </div>
          <Table
            pagination={false}
            dataSource={subPersonList}
            columns={columns}
            rowKey={record => record.flag}
          />
        </Card>}

        <Card title={getFieldValue('case_lawAidType') && getFieldValue('case_lawAidType')[0] === '2' ? '申请材料' : '通知文书及相关材料'} style={{
          marginTop: '20px',
        }}>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="免提交困难材料">
                {getFieldDecorator('case_isFreeHardMaterials', {})(<Switch />)}
              </FormItem>
            </Col>
            {getFieldValue('case_isFreeHardMaterials') && <Col span={12}>
              <FormItem {...formItemLayout} label="原因">
                {getFieldDecorator('case_freeHardMaterialsReason', {})(
                  <Select size="large" placeholder="请选择免困难材料原因">
                    {createSelectOption({ list: dictData.dic_dic_free_hard_materials_reason })}
                  </Select>
                )}
              </FormItem>
            </Col>
            }
          </Row>
          {curTotalFileList.length !== 0 && <Modal
         {...modalProps}
        >
          <div>
            {/* <div>共{curTotalFileList.length}项,已经上传{haveUploadedFileList.length}项</div> */}
            {curTotalFileList.map((item, index) => {
              return (
                <div key={index}>
                  <div>{item.fileName}: <Progress percent={item.percent} /> </div>
                  </div>
              )
            })} 
          </div>
        </Modal>}
        <Row></Row>
          <Row style={{
            padding: 20,
          }}>
            <Col span={24}>
              <Table
                bordered
                pagination={false}
                rowKey={record => record.key}
                dataSource={getFieldValue('case_lawAidType') && getFieldValue('case_lawAidType')[0] === '2' ? metData : noticeData}
                columns={metCols}
              />
            </Col>
          </Row>
        </Card>
      </Form>
    </div>
  )
}

CaseInfo.propTypes = {
  lawcaseDetail: PropTypes.object,
  handleFileChange: PropTypes.func,
  handleFileRemove: PropTypes.func,
  updateUploadType: PropTypes.func,
  loading: PropTypes.bool,
  form: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
}

export default connect(({ dispatch }) => ({ dispatch }))(Form.create()(CaseInfo))
