import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'
import { connect } from 'dva'
import { FilterItem } from '../../components'
import moment from 'moment'
// import classnames from 'classnames'
import { config } from '../../utils'
const { api } = config
import { Tabs, Row, Col, Select, Form, Button, Table, DatePicker } from 'antd'
const TabPane = Tabs.TabPane
const Option = Select.Option
const FormItem = Form.Item
const { MonthPicker } = DatePicker
const monthFormat = 'YYYY/MM'

const ReportForm = ({
  reportForm,
  dispatch,
  form: {
    getFieldDecorator,
    validateFields,
    setFields,
    getFieldsValue,
    validateFieldsAndScroll,
    getFieldValue,
  },
}) => {
  const cityOptions = reportForm.cityList.map(city => <Option key={city.key} value={city.key}>{city.value}</Option>)
  const sourceOptions = reportForm.sourceList.map(source => <Option key={source.key} value={source.key}>{source.value}</Option>)
 
  const quarterStatementData = reportForm.quarterStatementData
  const {amiOne,amiTwo,civilOne,civilTwo,criminalOne,criminalTwo,economicOne,economicTwo}=quarterStatementData
  const callback = (key) => {
    // // console.log(key)
  }

  const nowDate = moment().format('YYYY-MM').split('-')
  const yearList = [], 
halfYearList = []


  //年列表
  for (let i = 0, y = Number(nowDate[0]); y > 2015; i++, y--) {
    yearList[i] = y
  }
  const yearOption = yearList.map(item => <Option key={item}>{`${item  }年`}</Option>)
  const f_yearOption = yearList.slice(1).map(item => <Option key={item}>{`${item  }年`}</Option>)

  //季度列表
  var quarterList = [
    { value: '一季度', key: '01' },
    { value: '二季度', key: '04' },
    { value: '三季度', key: '07' },
    { value: '四季度', key: '10' },
    ], 
quarterOption = quarterList.map(item => <Option key={item.key}>{item.value}</Option>)
  //当年季度
  const nowQuarterList = []
  if (parseFloat(nowDate[1]) > 9) {
    nowQuarterList[0] = { value: '一季度', key: '01' }
    nowQuarterList[1] = { value: '二季度', key: '04' }
    nowQuarterList[2] = { value: '三季度', key: '07' }
  } else if (parseFloat(nowDate[1]) > 6) {
    nowQuarterList[0] = { value: '一季度', key: '01' }
    nowQuarterList[1] = { value: '二季度', key: '04' }
  } else if (parseFloat(nowDate[1]) > 3) {
    nowQuarterList[0] = { value: '一季度', key: '01' }
  }

  // 选择年后清空季度列表
  const setValue = () => {
    setFields({ b_quarter: '' })
  }

  // 选择年度后，生成季度列表
  const getSuarterList = (value) => {
    // // console.log(value);
    // setFields('quarter', '')
    if (value == nowDate[0]) {
      return nowQuarterList.map(item => <Option key={item.key}>{item.value}</Option>);
    } else if (value == undefined) {
      return ''
    } 
      return quarterList.map(item => <Option key={item.key}>{item.value}</Option>)
    
  }

  // 半年列表
  for (let i = 0; i < yearList.length; i++) {
    if (i == 0 && parseFloat(nowDate[1]) > 6) {
      let _data = {}
      _data.key = yearList[i] + '12-' + yearList[i] + '05' ;
      _data.value = yearList[i] + '年12月-' + (Number(yearList[i])+Number(1))  + '年5月';
      halfYearList.push(_data);
    } else {
      let _data1 = {}, _data2 = {};
      _data1.key = yearList[i] + '12-' + yearList[i] + '05' ;
      _data1.value =yearList[i] + '年12月-' +  (Number(yearList[i])+Number(1))  + '年5月';

      _data2.key = yearList[i] + '06-' + yearList[i] + '11';
      _data2.value = yearList[i] + '年6月-' + yearList[i] + '年11月';

      halfYearList.push(_data1)
      halfYearList.push(_data2)
    }
  }
  const halfYearOption = halfYearList.map(item => <Option key={item.key}>{item.value}</Option>)

  //表头第一列 第二行开始向下合并
  const setColumns = (value, record, index) => {
    const obj = {
      children: value,
      props: {},
    }

    let num = index + 1//当前行

    //第4行开始的奇数行向下合并
    if (num != 1 && num % 2 === 0) {
      obj.props.rowSpan = 2
    } else if (num % 2 === 1) {
      if (num != 1) {
        obj.props.rowSpan = 0
      }
    }
    return obj
  };
  const setColumns_month = (value, record, index) => {
    const obj = {
      children: value,
      props: {},
    }

    let num = index + 1//当前行

    if (num == 1) {
      obj.props.rowSpan = 3
    } else if (num == 2 || num == 3) {
      obj.props.rowSpan = 0
    }

    if (num > 3 && num % 2 === 0) {
      obj.props.rowSpan = 2
    } else if (num % 2 === 1) {
      if (num != 1) {
        obj.props.rowSpan = 0
      }
    }
    return obj
  };

  // 报表columns
  const columns = {
    // 月报
    monthStatementColumns: [
      {
        title: '地区',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        width: 160,
        // render: setColumns,
      },
     
      {
        title: '1',
        children: [{
          title: '解答法律咨询数',
          dataIndex: 'counselNum',
          key: 'counselNum',
        }],
      },
      {
        title: '2',
        children: [{
          title: '办理法律援助案件数',
          dataIndex: 'caseNum',
          key: 'caseNum',
        }],
      },
      {
        title: <div><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i></div>,
        children: [{
          title: '刑事案件',
          children: [{
            title: '申请类',
            dataIndex: 'panelApplicationNum',
            key: 'panelApplicationNum',
          }, {
            title: '通知类',
            dataIndex: 'panelInformationNum',
            key: 'panelInformationNum',
          }, {
            title: '商请类',
            dataIndex: 'panelBusinessNum',
            key: 'panelBusinessNum',
          }, {
            title: '强制医疗类',
            dataIndex: 'panelCuresNum',
            key: 'panelCuresNum',
          }, {
            title: '合计',
            dataIndex: 'penalcount',
            key: 'penalcount',
          }],
        }],
      },
      {
        title: '8',
        children: [{
          title: '民事诉讼案件',
          dataIndex: 'civilNum',
          key: 'civilNum',
        }],
      },
      {
        title: '9',
        children: [{
          title: '行政诉讼案件',
          dataIndex: 'adminNum',
          key: 'adminNum',
        }],
      },
      {
        title: '10',
        children: [{
          title: '申诉案件',
          dataIndex: 'complainNum',
          key: 'complainNum',
          width: 80,
        }],
      },
      {
        dataIndex: 'gzyz',
        title: '11',
        children: [{
          title: '公证援助案件',
          dataIndex: 'notaryAid',
          key: 'notaryAid',
        }],
      },
      {
        title: '12',
        children: [{
          title: '司法鉴定援助案件',
          dataIndex: 'judicialAid',
          key: 'judicialAid',
        }],
      },
      {
        title: '13',
        children: [{
          title: '其他非诉讼类案件',
          dataIndex: 'noAid',
          key: 'noAid',
        }],
      },
      {
        title: '14',
        children: [{
          title: '挽回经济损失或取得利益（万元）',
          dataIndex: 'redoomLoss',
          key: 'redoomLoss',
        }],
      },
      {
        title: '15',
        children: [{
          title: '受援人数',
          dataIndex: 'supportPeople',
          key: 'supportPeople',
        }],
      },
      {
        title: <div><i>16</i><i>17</i><i>18</i><i>19</i><i>20</i><i>21</i><i>22</i><i>23</i><i>24</i></div>,
        children: [{
          title: '受援人分类',
          children: [{
            title: '女性',
            dataIndex: 'femaleNum',
            key: 'femaleNum',
          }, {
            title: '残疾人',
            dataIndex: 'disability',
            key: 'disability',
          }, {
            title: '农民',
            dataIndex: 'peasant',
            key: 'peasant',
          }, {
            title: '农民工',
            dataIndex: 'peasantWorker',
            key: 'peasantWorker',
          }, {
            title: '未成年人',
            dataIndex: 'nonage',
            key: 'nonage',
          }, {
            title: '老年人',
            dataIndex: 'oldman',
            key: 'oldman',
          }, {
            title: '少数民族',
            dataIndex: 'minority',
            key: 'minority',
          }, {
            title: '军人军属',
            dataIndex: 'soldierFamily',
            key: 'soldierFamily',
          }, {
            title: '外国籍人或无国籍人',
            dataIndex: 'statelessOrForeign',
            key: 'statelessOrForeign',
          }],
        }],
      },
    ],
    // 季报
    quarterStatementColumns: [
      {
        title: '地区',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        width: 160,
        // render: setColumns,
      },
      {
        title: '1',
        children: [{
          title: '咨询总计',
          dataIndex: 'allCounsel',
          key: 'allCounsel',
        }],
      },
      {
        title: <div className={styles.num7}><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i></div>,
        children: [{
          title: '按途径分类统计',
          children: [{
            title: '来电',
            dataIndex: 'incomingCalls',
            key: 'incomingCalls',
          }, {
            title: '其中“12348”专线来电',
            dataIndex: 'specialCalls',
            key: 'specialCalls',
          }, {
            title: '来访',
            dataIndex: 'visit',
            key: 'visit',
          }, {
            title: '来信',
            dataIndex: 'letter',
            key: 'letter',
          }, {
            title: '网络',
            dataIndex: 'online',
            key: 'online',
          }, {
            title: '其他',
            dataIndex: 'otherway',
            key: 'otherway',
          }],
        }],
      },
      {
        title: <div className={styles.num10}><i>8</i><i>9</i><i>10</i><i>11</i><i>12</i><i>13</i><i>14</i><i>15</i><i>16</i><i>17</i></div>,
        children: [{
          title: '按人群分类统计',
          children: [{
            title: '女性',
            dataIndex: 'femaleNum',
            key: 'femaleNum',
          }, {
            title: '残疾人',
            dataIndex: 'disabilityNum',
            key: 'disabilityNum',
          }, {
            title: '农民',
            dataIndex: 'peasant',
            key: 'peasant',
          }, {
            title: '农民工',
            dataIndex: 'peasantWorker',
            key: 'peasantWorker',
          }, {
            title: '军人军属',
            dataIndex: 'soldierFamily',
            key: 'soldierFamily',
          }, {
            title: '未成年人',
            dataIndex: 'nonage',
            key: 'nonage',
          }, {
            title: '老年人',
            dataIndex: 'oldman',
            key: 'oldman',
          }, {
            title: '外国籍人',
            dataIndex: 'statelessOrForeign',
            key: 'statelessOrForeign',
          }, {
            title: '一般贫困者',
            dataIndex: 'poorPeople',
            key: 'poorPeople',
          }, {
            title: '其他人群',
            dataIndex: 'otherPeople',
            key: 'otherPeople',
          }],
        }],
      },
      {
        title: '18',
        children: [{
          title: '刑事类咨询合计',
          dataIndex: 'allPenalCase',
          key: 'allPenalCase',
        }],
      },
      {
        title: <div className={styles.num9}><i>19</i><i>20</i><i>21</i><i>22</i><i>23</i><i>24</i><i>25</i><i>26</i><i>27</i></div>,
        children: [{
          title: '咨询类型',
          children: [{
            title: '故意杀人',
            dataIndex: 'killCase',
            key: 'killCase',
          }, {
            title: '故意伤害',
            dataIndex: 'hurtCase',
            key: 'hurtCase',
          }, {
            title: '抢劫、抢夺',
            dataIndex: 'robbery',
            key: 'robbery',
          }, {
            title: '强奸',
            dataIndex: 'rapeCase',
            key: 'rapeCase',
          }, {
            title: '制造、贩卖、运输毒品',
            dataIndex: 'posionCase',
            key: 'posionCase',
          }, {
            title: '盗窃',
            dataIndex: 'stealCase',
            key: 'stealCase',
          }, {
            title: '诈骗',
            dataIndex: 'fraudCase',
            key: 'fraudCase',
          }, {
            title: '受贿、行贿',
            dataIndex: 'briberyCase',
            key: 'briberyCase',
          }, {
            title: '交通肇事',
            dataIndex: 'wreckerCase',
            key: 'wreckerCase',
          }],
        }],
      },
      {
        title: '28',
        children: [{
          title: '民事类咨询合计',
          dataIndex: 'allCivilCase',
          key: 'allCivilCase',
        }],
      },
      {
        title: <div className={styles.num9}><i>29</i><i>30</i><i>31</i><i>32</i><i>33</i><i>34</i><i>35</i><i>36</i><i>37</i></div>,
        children: [{
          title: '咨询类型',
          children: [{
            title: '请求给付赡养费',
            dataIndex: 'supportCase',
            key: 'supportCase',
          }, {
            title: '请求给付扶养费',
            dataIndex: 'maintenanceCase',
            key: 'maintenanceCase',
          }, {
            title: '请求给付抚养费',
            dataIndex: 'alimonyCase',
            key: 'alimonyCase',
          }, {
            title: '请求支付劳动报酬',
            dataIndex: 'rewardCase',
            key: 'rewardCase',
          }, {
            title: '见义勇为',
            dataIndex: 'helpCase',
            key: 'helpCase',
          }, {
            title: '工伤',
            dataIndex: 'hurtInWorkCase',
            key: 'hurtInWorkCase',
          }, {
            title: '交通事故',
            dataIndex: 'trafficCase',
            key: 'trafficCase',
          }, {
            title: '医疗事故',
            dataIndex: 'treatmentCase',
            key: 'treatmentCase',
          }, {
            title: '婚姻家庭',
            dataIndex: 'marriageCase',
            key: 'marriageCase',
          }],
        }],
      },
      {
        title: '38',
        children: [{
          title: '行政类咨询合计',
          dataIndex: 'alladminCase',
          key: 'alladminCase',
        }],
      },
      {
        title: <div className={styles.num4}><i>39</i><i>40</i><i>41</i><i>42</i></div>,
        children: [{
          title: '咨询类型',
          children: [{
            title: '请求国家赔偿',
            dataIndex: 'statePayCase',
            key: 'statePayCase',
          }, {
            title: '请求社会保险待遇',
            dataIndex: 'insuranceCase',
            key: 'insuranceCase',
          }, {
            title: '请求最低生活保障待遇',
            dataIndex: 'livingSecurityCase',
            key: 'livingSecurityCase',
          }, {
            title: '请求发给抚恤金、救济金',
            dataIndex: 'reliefCase',
            key: 'reliefCase',
          }],
        }],
      },
      {
        title: '43',
        children: [{
          title: '经济类咨询合计',
          dataIndex: 'economicSum',
          key: 'economicSum',
        }],
      },
      {
        title: <div className={styles.num3}><i>44</i><i>45</i><i>46</i></div>,
        children: [{
          title: '咨询类型',
          children: [{
            title: '民间借贷',
            dataIndex: 'lending',
            key: 'lending',
          }, {
            title: '合同纠纷',
            dataIndex: 'contractDispute',
            key: 'contractDispute',
          }, {
            title: '消费者权益',
            dataIndex: 'consumesInterests',
            key: 'consumesInterests',
          }],
        }],
      },
      
      {
        title: <div className={styles.num9}><i>47</i><i>48</i><i>49</i><i>50</i><i>51</i><i>52</i><i>53</i><i>54</i></div>,
        children: [{
          title: '本地典型咨询类型',
          children: [{
            title: '刑事类',
            children: [{
              title: criminalOne || '',
              dataIndex: 'zsl1',
              key: 'zsl1',
            }, {
              title: criminalTwo || '',
              dataIndex: 'zsl2',
              key: 'zsl2',
            }],
          }, {
            title: '民事类',
            children: [{
              title: civilOne || '',
              dataIndex: 'civilOneCount',
              key: 'civilOneCount',
            }, {
              title: civilTwo || '',
              dataIndex: 'civilTwoCount',
              key: 'civilTwoCount',
            }],
          }, {
            title: '行政类',
            children: [{
              title: amiOne || '',
              dataIndex: 'amiOneCount',
              key: 'amiOneCount',
            }, {
              title: amiTwo || '',
              dataIndex: 'amiTwoCount',
              key: 'amiTwoCount',
            }],
          }, {
            title: '经济类',
            children: [{
              title: economicOne || '',
              dataIndex: 'economicOneCount',
              key: 'economicOneCount',
            }, {
              title: economicTwo || '',
              dataIndex: 'economicTwoCount',
              key: 'economicTwoCount',
            }],
          }],
        }],
      },
    ],
    // 半年、年报
    yearStatementColumns: {
      //刑事
      emptyListOne: [
        {
          title: '单位',
          dataIndex: 'city',
          key: 'city',
          fixed: 'left',
          render: setColumns,
        },
        {
          title: '项目',
          dataIndex: 'district',
          key: 'district',
          fixed: 'left',
        },
        {
          title: <div><i>1</i><i>2</i><i>3</i></div>,
          children: [{
            title: '',
            children: [{
                title: <i className={styles.hideLine}>法律援助管理机构数</i>,
                dataIndex: 'institutionsNumber',
                key: 'instiNum',
            }, {
              title: '编制部门批准设立',
              dataIndex: 'departmentEstablishment',
              key: 'daparEst1',
            }, {
              title: '与法律援助机构合署办公的',
              dataIndex: 'Offices',
              key: 'OfficesKey',
            }]
          }],
        },
        {
          title: <div><i>4</i><i>5</i></div>,
          children: [{
            title: '',
            children: [{
                title: <i className={styles.hideLine}>法律援助机构数</i>,
                dataIndex: 'institutionsNumberNext',
                key: 'instiNumNext',
            }, {
              title: '编制部门批准设立',
              dataIndex: 'departmentEstablishmentNext',
              key: 'daparEst',
            }]
          }],
        },
        {
          title: <div><i>6</i><i>7</i><i>8</i><i>9</i></div>,
          children: [{
            title: '法律援助机构性质',
            children: [{
              title: '行政',
              dataIndex: 'administrativeFor',
              key: 'administrativekey',
            }, {
              title: '事业',
              children: [{
                title: '',
                children: [{
                  title: <i className={styles.hideLine}>全额拨款</i>,
                  dataIndex: 'fullFunding',
                  key: 'full',
                }, {
                  title: '参公管理',
                  dataIndex: 'management',
                  key: 'managementKey',
                }]
              }, {
                title: '其他',
                dataIndex: 'otherIndex',
                key: 'otherKey',
              }]
            }]
          }]
        },
        {
          title: <div><i>10</i><i>11</i><i>12</i><i>13</i><i>14</i><i>15</i><i>16</i><i>17</i></div>,
          children: [{
            title: '法律援助机构情况',
            children: [{
              title: '业务经费列入同级财政预算的',
              dataIndex: 'financialbudget',
              key: 'budget',
            }, {
              title: '有法律援助律师的',
              dataIndex: 'lawaid',
              key: 'lawkeyaid',
            }, {
              title: '办公业务用房面积平米数',
              dataIndex: 'areameternumber',
              key: 'areameterkey',
            }, {
              title: '',
              children: [{
                title: <i className={styles.hideLine}>有专门接待场所的</i>,
                dataIndex: 'specialplace',
                key: 'specialplaceKey',
              }, {
                title: '临街一层的',
                dataIndex: 'streetFirst',
                key: 'streetkey',
              }, {
                title: '设置无障碍通道的',
                dataIndex: 'WithoutObstaclesAisle',
                key: 'WithoutObstaclesAislekey',
              }]
            }, {
              title: '办公设备配置齐全',
              dataIndex: 'officeEquipmentComplete',
              key: 'officeEquipmentCompletekey',
            }, {
              title: '基本办公设备配置齐全',
              dataIndex: 'basicOffice',
              key: 'basicOfficeKey',
            }]
          }]
        },
        {
          title: <div><i>18</i><i>19</i><i>20</i><i>21</i></div>,
          children: [{
            title: '信息化建设',
            children: [{
              title: '',
              children: [{
                title:  <i className={styles.hideLine}>使用法律援助信息管理系统</i>,
                dataIndex: 'useLawInfosys',
                key: 'useLawInfosysKey',
              }, {
                title: '实现网上申请受理',
                dataIndex: 'achieveApply',
                key: 'achieveApplykey',
              }]
            }, {
              title: '',
              children: [{
                title: '有12348法律服务热线平台',
                dataIndex: 'hotline',
                key: 'hotlineKey',
              }, {
                title: '12348独立机构',
                dataIndex: 'independentAgency',
                key: 'independentAgencyKey',
              }]
            }]
          }]
        },
        {
          title: <div><i>22</i><i>23</i></div>,
          children: [{
            title: '表彰',
            children: [{
              title: '省部级以上表彰',
              dataIndex: 'ProvincialExalt',
              key: 'ProvincialExaltKey',
            }, {
              title: '地市县级表彰',
              dataIndex: 'countyExalt',
              key: 'countyExaltKey',
            }]
          }]
        },
        {
          title: <div><i>24</i><i>25</i><i>26</i></div>,
          children: [{
            title: '宣传',
            children: [{
              title: '电台电视台播出次数',
              dataIndex: 'TVbroadcastNm',
              key: 'zhangkaiKey',
            }, {
              title: '报纸杂志刊登篇数',
              dataIndex: 'NewpaperNm',
              key: 'NewpaperNmKey',
            }, {
              title: '互联网与新媒体刊登数',
              dataIndex: 'intandmediaNumber',
              key: 'intandmediaNumberkey',
            }]
          }]
        },
        {
          title: <div><i>27</i><i>28</i></div>,
          children: [{
            title: '培训',
            children: [{
              title: '举办培训班数',
              dataIndex: 'TrainingCourseNm',
              key: 'TrainingCourseNmKey',
            }, {
              title: '培训人次',
              dataIndex: 'TrainingManNm',
              key: 'TrainingManNmKey',
            }]
          }]
        },
        {
          title: '29',
          children: [{
            title: '法律援助类民办非企业单位数',
            dataIndex: 'NoenterpriseunitsNm',
            key: 'Noenterpriseunitskey',
          }]
        },
        
    ],
    emptyListTwo: [
      {
        title: '单位',
        dataIndex: 'city',
        key: 'city',
        fixed: 'left',
        render: setColumns,
      },
      {
        title: '项目',
        dataIndex: 'district',
        key: 'district',
        fixed: 'left',
      },
      {
        title: '1',
        children: [{
          title: '编制总数',
          dataIndex: 'editNm',
          key: 'editNmKey',
        }]
      },
      {
        title: '2',
        children: [{
          title: '实有人员总数',
          dataIndex: 'reallyAllNm',
          key: 'reallyAllNmkey',
        }]
      },
      {
        title: '3',
        children: [{
          title: '法律援助管理机构编制数',
          dataIndex: 'laweManagementEditNm',
          key: 'laweManagementEditNmkey',
        }]
      },
      {
        title: <div><i>4</i><i>5</i></div>,
        children: [{
          title: '',
          children: [{
            title:  <i className={styles.hideLine}>法律援助管理机构实有人数</i>,
            dataIndex: 'realAgencyNm',
            key: 'realAgencyNmKey',
          }, {
            title: '其中：妇女',
            dataIndex: 'amongHuman',
            key: 'amongHumanKey',
          }]
        }]
      },
      {
        title: <div><i>6</i><i>7</i><i>8</i></div>,
        children: [{
          title: '学历',
          children: [{
            title: '法律专业',
            dataIndex: 'lawSubject',
            key: '',
          }, {
            title: '研究生以上（含）',
            dataIndex: 'postgraduateAbove',
            key: 'postgraduateAboveKey',
          }, {
            title: '本科',
            dataIndex: 'Undergraduate',
            key: 'Undergraduatekey',
          }]
        }]
      },
      {
        title: '9',
        children: [{
          title: '法律援助机构编制数',
            dataIndex: 'lawAidAgencyNum',
            key: 'lawAidAgencyNumKey',
        }]
      },
      {
        title: <div><i>10</i><i>11</i></div>,
        children: [{
          title: '',
          children: [{
            title:  <i className={styles.hideLine}>法律援助机构实有人数</i>,
            dataIndex: 'lawAidRelNum',
            key: 'lawAidRelNumKey',
          }, {
            title: '其中：妇女',
            dataIndex: 'humanIn',
            key: 'humanInKey',
          }]
        }]
      },
      {
        title: <div><i>12</i><i>13</i><i>14</i></div>,
        children: [{
          title: '学历',
          children: [{
            title: '法律专业',
            dataIndex: 'lawocational',
            key: 'lawocationalKey',
          }, {
            title: '研究生以上（含）',
            dataIndex: 'studyUp',
            key: 'studyUpKey',
          }, {
            title: '本科',
            dataIndex: 'rootBranch',
            key: 'rootBranchKey',
          }]
        }]
      },
      {
        title: <div><i>15</i><i>16</i></div>,
        children: [{
          title: '',
          children: [{
            title:  <i className={styles.hideLine}>具有法律职业资格或律师资格人数</i>,
            dataIndex: 'hasLawerNum',
            key: 'hasLawerNumKey',
          }, {
            title: '法律援助律师数',
            dataIndex: 'lawHelpNum',
            key: 'lawHelpNumKey',
          }]
        }]
      },
      {
        title: <div><i>17</i><i>18</i></div>,
        children: [{
          title: '表彰',
          children: [{
            title: '获得省部级以上表彰人次',
            dataIndex: 'obtainPrUpNm',
            key: 'obtainPrUpNmKey',
          }, {
            title: '获得地市县级表彰人次',
            dataIndex: 'obtainCouUpNm',
            key: 'obtainCouUpNmKey',
          }]
        }]
      },
      {
        title: '19',
        children: [{
          title: '注册法律援助志愿者人数',
            dataIndex: 'lawVolunteerNu',
            key: 'lawVolunteerNuKey',
        }]
      },
      {
        title: '20',
        children: [{
          title: '法律援助类民办非企业单位人员数',
            dataIndex: 'lawNoenterNu',
            key: 'lawNoenterNuKey',
        }]
      }
  ],
  emptyListThree: [
    {
      title: '单位',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: '项目',
      dataIndex: 'district',
      key: 'district',
    },
    {
      title: '1',
     children: [{
       title: '经费投入总额(万元)',
       dataIndex: 'inputMony',
       key: 'inputMonyKey',
     }]
    },
    {
      title: <div><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i></div>,
      children: [{
        title: '财政拨款（万元）',
        children: [{
          title: '总计',
          dataIndex: 'allMony',
          key: 'allMonyKey',
        }, {
          title: '人员经费',
          dataIndex: 'crewMony',
          key: 'crewMonyKey',
        }, {
          title: '基本公用经费',
          dataIndex: 'basicPublicMoney',
          key: 'basicPublicMoneyKey',
        }, {
          title: '法律援助信息化等专项经费',
          dataIndex: 'lawSpecialfunds',
          key: 'lawSpecialfundsKey',
        }, {
          title: '业务经费',
          children: [{
            title: '合计',
            dataIndex: 'businessAllMoney',
            key: 'businessAllMoneyKey',
          }, {
            title: '同级财政拨款',
            dataIndex: 'samelevelMoney',
            key: 'samelevelMoneyKey',
          }, {
            title: '',
            children: [{
              title:  <i className={styles.hideLine}>上级下拨经费</i>,
              dataIndex: 'upDownMoney',
              key: 'upDownMoneyKey',
            }, {
              title: '中央专项彩票公益金法律援助项目资金',
              dataIndex: 'centralLotteryTicket',
              key: 'centralLotteryTicketKey',
            },]
          }]
        }]
      }]
    },
    {
      title: '10',
      children: [{
        title: '社会捐助（万元）',
        dataIndex: 'socialContributionsMoney',
        key: 'socialContributionsMoneyKey',
      }]
    },
    {
      title: '11',
      children: [{
        title: '行业奉献（万元）',
        dataIndex: 'industryDedicationMony',
        key: 'industryDedicationMonyKey',
      }]
    },
],
  emptyListFour: [
    {
      title: '单位',
      dataIndex: 'city',
      key: 'city',
      fixed: 'left',
      render: setColumns,
    },
    {
      title: '项目',
      dataIndex: 'district',
      key: 'district',
      fixed: 'left',
    },
    {
      title: '1',
      children: [{
        title: '合计(万元)',
        dataIndex: 'allPenalAid',
        key: 'allPenalAid',
      }],
    },
    {
      title: '2',
      children: [{
        title: '人员经费（万元）',
        dataIndex: 'statementCase1',
        key: 'statementCase1',
      }],
    },
    {
      title: '3',
      children: [{
        title: '基本公用经费（万元）',
        dataIndex: 'statementCase2',
        key: 'statementCase2',
      }],
    },
    {
      title: <div><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i><i>10</i><i>11</i><i>12</i><i>13</i><i>14</i><i>15</i><i>16</i><i>17</i><i>18</i><i>19</i><i>20</i><i>21</i><i>22</i></div>,
      children: [{
        title: '业务经费（万元）',
        children: [{
          title: '合计',
          dataIndex: 'total',
          key: 'totalKey',
        }, {
          title: '办案补贴及直接费用',
          children: [{
            title: '合计',
            dataIndex: 'apprehendDirectMony',
            key: 'apprehendDirectMonyKey',
          }, {
            title: '按承办人员分',
            children: [{
              title: '法律援助机构人员',
              dataIndex: 'mechanismLawHuman',
              key: 'mechanismLawHumanKey',
            }, {
              title: '社会律师',
              dataIndex: 'societyLawyer',
              key: 'societyLawyerKey',
            }, {
              title: '基层法律服务工作者',
              dataIndex: 'basicLawyerWoeker',
              key: 'basicLawyerWoekerKey',
            }, {
              title: '社会组织人员',
              dataIndex: 'organismLawyerWorker',
              key: 'organismLawyerWorkerKey',
            }, {
              title: '注册法律援助志愿者',
              dataIndex: 'voluntersLawyer',
              key: 'voluntersLawyerKey',
            }]
          }, {
            title: '按案件类别分',
            children: [{
              title: '刑事',
              dataIndex: 'criminal',
              key: 'criminalKey',
            }, {
              title: '民事',
              children: [{
                title: '诉讼',
                dataIndex: 'civilAction',
                key: 'civilActionKey',
              }, {
                title: '非诉讼',
                dataIndex: 'noCivilAction',
                key: 'noCivilActionKey',
              }]
            }, {
              title: '行政',
              children: [{
                title: '诉讼',
                dataIndex: 'administrativeAction',
                key: 'administrativeActionKey',
              }, {
                title: '非诉讼',
                dataIndex: 'noAdministrativeAction',
                key: 'noAdministrativeActionKey',
              }]
            }]
          },]
        },  {
          title: '',
          children: [{
            title:  <i className={styles.hideLine}>咨询补贴</i>,
              dataIndex: 'advisorySubsidy',
              key: 'advisorySubsidyKey',
          }, {
            title: '法院看守所值班律师补贴',
              dataIndex: 'dutyLawyersSubsidies',
              key: 'dutyLawyersSubsidiesKey',
          }]
        }, {
          title: '代书补贴',
          dataIndex: 'bookSubsidy',
          key: 'bookSubsidyKey',
        }, {
          title: '因受援人败诉支出的鉴定费',
          dataIndex: 'IdentificationFee',
          key: 'IdentificationFeeKey',
        }, {
          title: '宣传费用',
          dataIndex: 'promotionCosts',
          key: 'promotionCostsKey',
        }, {
          title: '培训费用',
          dataIndex: 'trainingFees',
          key: 'trainingFeesKey',
        }, {
          title: '其他费用',
          dataIndex: 'otherFee',
          key: 'otherFeeKey',
        }]
      }]
    },
    {
      title: '23',
      children: [{
        title: '法律援助信息化等专项经费（万元）',
        dataIndex: 'InformatizationFee',
        key: 'InformatizationFeeKey',
      }]
    }
  ],
  emptyListEight: [
    {
      title: '地区',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 160,
    },
    {
      title: '1',
     children: [{
       title: '法律援助案件批准总数',
       dataIndex: 'approvedCase',
       key: 'approvedCaseKey',
     }]
    },
    {
      title: '2',
     children: [{
       title: '已结案件总数',
       dataIndex: 'closeCase',
       key: 'closeCaseKey',
     }]
    },
    {
      title: '3',
     children: [{
       title: '挽回损失或取得利益（万元）',
       dataIndex: 'saveLoss',
       key: 'saveLossKey',
     }]
    },
    {
      title: '4',
     children: [{
       title: '未结案件',
       dataIndex: 'uncloseCase',
       key: 'uncloseCaseKey',
     }]
    },
    {
      title: <div><i>5</i><i>6</i></div>,
      children: [{
        title: '',
        children: [{
          title: '妇女',
          dataIndex: 'women',
          key: 'womenKey',
        }, {
          title: '残疾人',
          dataIndex: 'disabled',
          key: 'disabledKey',
        }]
      }]
    },
    {
      title: <div><i>7</i><i>8</i><i>9</i><i>10</i><i>11</i><i>12</i><i>13</i></div>,
      children: [{
        title: '案件分类',
        children: [{
          title: '农民',
          dataIndex: 'farmer',
          key: 'farmerKey',
        }, {
          title: '农民工',
          dataIndex: 'migrant',
          key: 'migrantKey',
        }, {
          title: '老年人',
          dataIndex: 'oldman',
          key: 'oldmanKey',
        }, {
          title: '未成年人',
          dataIndex: 'childrenSS',
          key: 'childrenKey',
        }, {
          title: '军人军属',
          dataIndex: 'soldier',
          key: 'soldierKey',
        }, {
          title: '少数民族',
          dataIndex: 'minority',
          key: 'minorityKey',
        }, {
          title: '外国人或无国籍人',
          dataIndex: 'alienStatelessness',
          key: 'alienStatelessnessKey',
        }]
      }]
    },
],
emptyListNight: [
  {
    title: '地区',
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    width: 160,
  },
  {
    title: <div><i>1</i><i>2</i><i>3</i><i>4</i></div>,
    children: [{
      title: '各类案件受援人（人次）',
      children: [{
        title: '合计',
        dataIndex: 'allPeople',
        key: 'allPeopleKey',
      }, {
        title: '刑事案件受援人',
        dataIndex: 'criminalPeople',
        key: 'criminalPeopleKey',
      }, {
        title: '民事案件受援人',
        dataIndex: 'civilPeople',
        key: 'civilPeopleKey',
      }, {
        title: '行政案件受援人',
        dataIndex: 'amiPeople',
        key: 'amiPeopleKey',
      }]
    }]
  },
  {
    title: <div><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i><i>10</i><i>11</i><i>12</i><i>13</i></div>,
    children: [{
      title: '受援人分类（人次）',
      children: [{
        title: '妇女',
        dataIndex: 'women',
        key: 'womenKey',
      }, {
        title: '残疾人',
        dataIndex: 'disabled',
        key: 'disabledPeopleSupportKey',
      }, {
        title: '农民',
        dataIndex: 'farmer',
        key: 'farmerKey',
      }, {
        title: '农民工',
        dataIndex: 'migrant',
        key: 'migrantKey',
      }, {
        title: '老年人',
        dataIndex: 'oldman',
        key: 'oldmanKey',
      }, {
        title: '未成年人',
        dataIndex: 'childrenSS',
        key: 'childrenKey',
      }, {
        title: '军人军属',
        dataIndex: 'soldier',
        key: 'soldierKey',
      }, {
        title: '少数民族',
        dataIndex: 'minority',
        key: 'minoritykEY',
      }, {
        title: '外国人或无国籍人',
        dataIndex: 'alienStatelessness',
        key: 'alienStatelessnessKey',
      }]
    }]
  },
],
emptyListTwelve: [
{
  title: '单位',
  dataIndex: 'city',
  key: 'city',
  fixed: 'left',
},
{
  title: '项目',
  dataIndex: 'district',
  key: 'district',
  fixed: 'left',
},
{
  title: '1',
  children: [{
    title: '工作站总数',
    dataIndex: 'workstationsNum',
    key: 'workstationsNumKey',
  }]
},
{
  title: <div><i>2</i><i>3</i></div>,
  children: [{
    title: '',
    children: [{
      title:  <i className={styles.hideLine}>依托基层司法所</i>,
      dataIndex: 'basicOffice',
      key: '',
    }, {
      title: '有专门工作人员的',
      dataIndex: 'specializedHum',
      key: 'specializedHumKey',
    }]
  }]
},
{
  title: <div><i>4</i><i>5</i></div>,
  children: [{
    title: '',
    children: [{
      title:  <i className={styles.hideLine}>依托工会</i>,
      dataIndex: 'dependUnion',
      key: 'dependUnionKey',
    }, {
      title: '有专门工作人员的',
      dataIndex: 'specialWorker',
      key: 'specialWorkerKey',
    }]
  }]
},
{
  title: <div><i>6</i><i>7</i></div>,
  children: [{
    title: '',
    children: [{
      title:  <i className={styles.hideLine}>依托共青团</i>,
      dataIndex: 'communistYouthLeague',
      key: 'communistYouthLeagueKey',
    }, {
      title: '有专门工作人员的',
      dataIndex: 'specializedStaff',
      key: 'specializedStaffKey',
    }]
  }]
},
{
  title: <div><i>8</i><i>9</i></div>,
  children: [{
    title: '',
    children: [{
      title:  <i className={styles.hideLine}>依托妇联</i>,
      dataIndex: 'womanUnite',
      key: 'womanUniteKey',
    }, {
      title: '有专门工作人员的',
      dataIndex: 'professionalWorker',
      key: 'professionalWorkerKey',
    }]
  }]
},
{
  title: <div><i>10</i><i>11</i></div>,
  children: [{
    title: '',
    children: [{
      title:  <i className={styles.hideLine}>依托老龄委</i>,
      dataIndex: 'oldAgeCommittee',
      key: 'oldAgeCommitteeKey',
    }, {
      title: '有专门工作人员的',
      dataIndex: 'oldAgeCommitteeSpecialWorker',
      key: 'oldAgeCommitteeSpecialWorkerKey',
    }]
  }]
},
{
  title: <div><i>12</i><i>13</i></div>,
  children: [{
    title: '',
    children: [{
      title:  <i className={styles.hideLine}>依托残联</i>,
      dataIndex: 'relyingonDismemberedcouplets',
      key: 'relyingonDismemberedcoupletsKey',
    }, {
      title: '有专门工作人员的',
      dataIndex: 'dismemberedcoupletsSpecialWorker',
      key: 'dismemberedcoupletsSpecialWorker',
    }]
  }]
},
{
  title: <div><i>14</i><i>15</i></div>,
  children: [{
    title: '',
    children: [{
      title:  <i className={styles.hideLine}>依托信访</i>,
      dataIndex: 'relyonPetitions',
      key: 'relyonPetitionsKey',
    }, {
      title: '有专门工作人员的',
      dataIndex: 'relyonPetitionSpecialWorker',
      key: 'relyonPetitionSpecialWorkerKey',
    }]
  }]
},
{
  title: <div><i>16</i><i>17</i></div>,
  children: [{
    title: '',
    children: [{
      title:  <i className={styles.hideLine}>依托高校</i>,
      dataIndex: 'relyingOnUniversity',
      key: 'relyingOnUniversityKey',
    }, {
      title: '有专门工作人员的',
      dataIndex: 'relyingOnUniversityWorker',
      key: 'relyingOnUniversityWorkerKey',
    }]
  }]
},
{
  title: <div><i>18</i><i>19</i></div>,
  children: [{
    title: '',
    children: [{
      title:  <i className={styles.hideLine}>依托监狱、戒毒所</i>,
      dataIndex: 'relianceOnPrisons',
      key: 'relianceOnPrisonsKey',
    }, {
      title: '有专门工作人员的',
      dataIndex: 'relianceOnPrisonsSpecialWorker',
      key: 'relianceOnPrisonsSpecialWorkerKey',
    }]
  }]
},
{
  title: <div><i>20</i><i>21</i></div>,
  children: [{
    title: '',
    children: [{
      title:  <i className={styles.hideLine}>依托看守所</i>,
      dataIndex: 'relyingOnDetentionCenter',
      key: 'relyingOnDetentionCenterKey',
    }, {
      title: '有专门工作人员的',
      dataIndex: 'relyingOnDetentionCenterWorker',
      key: 'relyingOnDetentionCenterWorkerKey',
    }]
  }]
},
{
  title: <div><i>22</i><i>23</i></div>,
  children: [{
    title: '',
    children: [{
      title:  <i className={styles.hideLine}>依托人民法院</i>,
      dataIndex: 'relyingPeopleCourt',
      key: 'relyingPeopleCourtKey',
    }, {
      title: '有专门工作人员的',
      dataIndex: 'relyingPeopleCourtWorker',
      key: 'relyingPeopleCourtWorkerKey',
    }]
  }]
},
{
  title: <div><i>24</i><i>25</i></div>,
  children: [{
    title: '',
    children: [{
      title:  <i className={styles.hideLine}>依托部队、人武部</i>,
      dataIndex: 'relyingTroops',
      key: '',
    }, {
      title: '有专门工作人员的',
      dataIndex: 'relyingTroopsWoeker',
      key: 'relyingTroopsWoekerKey',
    }]
  }]
},
{
  title: <div><i>26</i><i>27</i></div>,
  children: [{
    title: '',
    children: [{
      title:  <i className={styles.hideLine}>其他</i>,
      dataIndex: 'relyingOther',
      key: 'relyingOtherKey',
    }, {
      title: '有专门工作人员的',
      dataIndex: 'relyingOtherWorker',
      key: 'relyingOtherWorkerKey',
    }]
  }]
},
],
emptyListThirteen: [
{
  title: '单位',
  dataIndex: 'city',
  key: 'city',
},
{
  title: '项目',
  dataIndex: 'district',
  key: 'district',
},
{
  title: '1',
  children: [{
    title: '投诉合计(件)',
    dataIndex: 'complaintsAlothes',
    key: 'complaintsAlothesKey',
  }]
},
{
  title: <div><i>2</i><i>3</i><i>4</i><i>5</i></div>,
  children: [{
    title: '投诉事项分类情况（件）',
    children: [{
      title: '违反规定办理法律援助受理审查事项或者违反规定指派安排法律援助人员',
      dataIndex: 'soLongOne',
      key: 'soLongOneKey',
    }, {
      title: '法律援助人员接受指派或安排后懈怠履行或者擅自停止履行法律援助职责',
      dataIndex: 'soLangTwo',
      key: 'soLangTwoKey',
    }, {
      title: '办理法律援助案件收取财物',
      dataIndex: 'soLangThree',
      key: 'soLangThreeKey',
    }, {
      title: '其他违反法律援助规定的行为',
      dataIndex: 'soLangFour',
      key: 'soLangFourKey',
    }]
  }]
},
{
  title: <div><i>6</i><i>7</i><i>8</i></div>,
  children: [{
    title: '处理决定情况（件）',
    children: [{
      title: '给予行政处罚行业惩戒纪律处分',
      dataIndex: 'dispositionOne',
      key: 'dispositionOneKey',
    }, {
      title: '给予批评教育通报批评责令限期整改',
      dataIndex: 'dispositionTwo',
      key: 'dispositionTwoKey',
    }, {
      title: '投诉事项查证不实或者无法查实，对被投诉人不作处理',
      dataIndex: 'dispositionThree',
      key: 'dispositionThreeKey',
    }]
  }]
},
{
  title: <div><i>9</i><i>10</i><i>11</i></div>,
  children: [{
    title: '不服处理决定情况（件）',
    children: [{
      title: '申请行政复议的',
      dataIndex: 'reconsideration',
      key: 'reconsiderationKey',
    }, {
      title: '提起行政诉讼的',
      dataIndex: 'administrativeLitigation',
      key: 'administrativeLitigationKey',
    }, {
      title: '合计',
      dataIndex: 'refusedToDealWith',
      key: 'refusedToDealWithKey',
    }]
  }]
},
],
      panel: [
        {
          title: '地区',
          dataIndex: 'name',
          key: 'name',
          fixed: 'left',
          width: 160,
        },
       
        {
          title: '1',
          children: [{
            title: '合计',
            dataIndex: 'allPenalAid',
            key: 'allPenalAid',
          }],
        },
        {
          title: '2',
          children: [{
            title: '申诉案件',
            dataIndex: 'statementCase',
            key: 'statementCase',
          }],
        },
        {
          title: <div><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i><i>10</i><i>11</i><i>12</i><i>13</i></div>,
          children: [{
            title: '通知辩护案件',
            children: [{
              title: '阶段',
              children: [{
                title: <i className={styles.hideLine}>侦查</i>,
                dataIndex: 'investigationIF',
                key: 'investigationIF',
              }, {
                title: '审查起诉',
                dataIndex: 'prosecuteIF',
                key: 'prosecuteIF',
              }, {
                title: '审判',
                children: [{
                  title: '一审',
                  dataIndex: 'firstInstanceIF',
                  key: 'firstInstanceIF',
                }, {
                  title: '二审',
                  dataIndex: 'secondInstanceIF',
                  key: 'secondInstanceIF',
                }, {
                  title: '其他',
                  dataIndex: 'otherJudgeIF',
                  key: 'otherJudgeIF',
                }],
              }],
            }, {
              title: '对象',
              children: [{
                title: '未成年人',
                dataIndex: 'nonagePenalIF',
                key: 'nonagePenalIF',
              }, {
                title: '盲聋哑人',
                dataIndex: 'disabilityIF',
                key: 'disabilityIF',
              }, {
                title: '尚未完全丧失辨认或者控制自己行为能力的精神病人',
                dataIndex: 'willphychosisIF',
                key: 'willphychosisIF',
              }, {
                title: '可能判处无期徒刑、死刑的人',
                dataIndex: 'lifePenaltyIF',
                key: 'lifePenaltyIF',
              }, {
                title: '其他',
                dataIndex: 'otherPeopleIF',
                key: 'otherPeopleIF',
              }],
            }, {
              title: '合计',
              dataIndex: 'allInformIF',
              key: 'allInformIF',
            }],
          }],
        },
        {
          title: '14',
          children: [{
            title: '强制医疗通知代理案件',
            dataIndex: 'allTreat',
            key: 'allTreat',
          }],
        },
        {
          title: <div><i>15</i><i>16</i><i>17</i><i>18</i><i>19</i><i>20</i><i>21</i><i>22</i><i>23</i><i>24</i><i>25</i><i>26</i><i>27</i><i>28</i><i>29</i></div>,
          children: [{
            title: '依申请案件',
            children: [{
              title: '转交申请',
              children: [{
                title: '公安机关',
                dataIndex: 'copApply',
                key: 'copApply',
              }, {
                title: '人民检察院',
                dataIndex: 'iPPMApply',
                key: 'iPPMApply',
              }, {
                title: '人民法院',
                dataIndex: 'iPCApply',
                key: 'iPCApply',
              }, {
                title: '其他',
                dataIndex: 'otherApply',
                key: 'otherApply',
              }, {
                title: '合计',
                dataIndex: 'allIndirectApply',
                key: 'allIndirectApply',
              }],
            }, {
              title: '直接申请',
              children: [{
                title: '罪嫌疑人',
                dataIndex: 'suspectApply',
                key: 'suspectApply',
              }, {
                title: '被告人',
                dataIndex: 'defendantApply',
                key: 'defendantApply',
              }, {
                title: '被害人',
                dataIndex: 'victimApply',
                key: 'victimApply',
              }, {
                title: '自诉人',
                dataIndex: 'prosecutorApply',
                key: 'prosecutorApply',
              }, {
                title: '合计',
                dataIndex: 'allDirectApply',
                key: 'allDirectApply',
              }],
            }, {
              title: '批准',
              children: [{
                title: '犯罪嫌疑人',
                dataIndex: 'suspectRatify',
                key: 'suspectRatify',
              }, {
                title: '被告人',
                dataIndex: 'defendantRatify',
                key: 'defendantRatify',
              }, {
                title: '被害人',
                dataIndex: 'victimRatigy',
                key: 'victimRatigy',
              }, {
                title: '自诉人',
                dataIndex: 'prosecutorRatify',
                key: 'prosecutorRatify',
              }, {
                title: '合计',
                dataIndex: 'allRatify',
                key: 'allRatify',
              }],
            }],
          }],
        },
        {
          title: <div><i>30</i><i>31</i><i>32</i><i>33</i><i>34</i><i>35</i><i>36</i><i>37</i><i>38</i><i>39</i></div>,
          children: [{
            title: '受援人分类',
            children: [{
              title: '妇女',
              dataIndex: 'femaleRA',
              key: 'femaleRA',
            }, 
            {
              children:[{
                title: <i className={styles.hideLine}>残疾人</i>,
                dataIndex: 'bindDeafMuteRA',
                key: 'bindDeafMuteRA',
              }, {
                title: '盲聋哑',
                dataIndex: 'besideBDMRA',
                key: 'besideBDMRA',
              }, ],
            },
            {
              title: '农民',
              dataIndex: 'peasantRA',
              key: 'peasantRA',
            }, {
              title: '农民工',
              dataIndex: 'peasantWorkerRA',
              key: 'peasantWorkerRA',
            }, {
              title: '老年人',
              dataIndex: 'oldManRA',
              key: 'oldManRA',
            }, {
              title: '未成年人',
              dataIndex: 'nonageRA',
              key: 'nonageRA',
            }, {
              title: '军人军属',
              dataIndex: 'monitoryRA',
              key: 'monitoryRA',
            }, {
              title: '少数民族',
              dataIndex: 'soldierFamilyRA',
              key: 'soldierFamilyRA',
            }, {
              title: '外国籍人或无国籍人',
              dataIndex: 'statelessOrForeignRA',
              key: 'statelessOrForeignRA',
            }],
          }],
        },
        {
          title: <div><i>40</i><i>41</i><i>42</i><i>43</i><i>44</i><i>45</i></div>,
          children: [{
            title: '已结案件承办情况',
            children: [{
              title: '承办人意见全部采纳',
              dataIndex: 'allAcceptPanel',
              key: 'allAcceptPanel',
            }, {
              title: '承办人意见部分采纳',
              dataIndex: 'partAcceptPanel',
              key: 'partAcceptPanel',
            }, {
              title: '承办人意见未采纳',
              dataIndex: 'noAcceptPanel',
              key: 'noAcceptPanel',
            }, {
              title: '终止提供',
              dataIndex: 'stopSupplyPanel',
              key: 'stopSupplyPanel',
            }, {
              title: '合计',
              dataIndex: 'allClosePanel',
              key: 'allClosePanel',
            }, {
              title: '挽回损失或取得利益(万元)',
              dataIndex: 'redeemClosePanel',
              key: 'redeemClosePanel',
            }],
          }],
        },
        {
          title: '46',
          children: [{
            title: '未结案件',
            dataIndex: 'allUnclosePanel',
            key: 'allUnclosePanel',
          }],
        },
      ],
      // 民事
      civil: [
        {
          title: '单位',
          dataIndex: 'name',
          key: 'name',
          fixed: 'left',
          width: 160,
          //render: setColumns_21,  
        },

        {
          title: '1',
          children: [{
            title: '申请',
            dataIndex: 'allApplyCivil',
            key: 'allApplyCivil',
          }],
        },
        {
          title: <div><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i><i>10</i><i>11</i><i>12</i><i>13</i><i>14</i><i>15</i><i>16</i><i>17</i><i>18</i><i>19</i><i>20</i></div>,
          children: [{
            title: '批准情况',
            children: [{
              title: '合计',
              dataIndex: 'ratifyCivil',
              key: 'ratifyCivil',
            },{
              children:[{
                title:  <i className={styles.hideLine}>请求社会保险待遇 </i>,
                dataIndex: 'societyRC',
                key: 'societyRC',
              }, {
                title: '',
                children: [{
                  title:  <i className={styles.hideLine}>请求工伤保险待遇</i>,
                  dataIndex: 'occupationalInjuryRC',
                  key: 'occupationalInjuryRC',
                }, {
                  title: '涉及民工的',
                  dataIndex: 'societyWorkerRC',
                  key: 'societyWorkerRC',
                }]
              },]
            },
          {
            title: '',
            children: [{
              title:  <i className={styles.hideLine}>婚姻家庭</i>,
              dataIndex: 'marriageRC',
              key: 'marriageRC',
            }, {
              title: '请求给付赡养费、扶养费、抚养费',
              dataIndex: 'supportRC',
              key: 'supportRC',
            }, {
              title: '涉及家庭暴力的',
              dataIndex: 'familyViolenceRC',
              key: 'familyViolenceRC',
            }]
          },
          {
            title: '',
              children: [{
                title: <i className={styles.hideLine}>请求支付劳动报酬</i>,
                dataIndex: 'labourRewardRC',
                key: 'labourRewardRC',
              }, {
                title: '涉及农民工的',
                dataIndex: 'peasantRewardRC',
                key: 'peasantRewardRC',
              }]
          },
          {
            title: '',
              children: [{
                title: <i className={styles.hideLine}>工伤（请求工伤保险待遇之外）</i>,
                dataIndex: 'careerHurtRC',
                key: 'careerHurtRC',
              }, {
                title: '涉及农民工的',
                dataIndex: 'iFMCareerHurtRC',
                key: 'iFMCareerHurtRC'
              }]
          },
           {
            title: '其他劳动纠纷',
            dataIndex: 'otherLaborDisputesRC',
            key: 'otherLaborDisputesRC',
           },
            {
              title: '交通事故',
              dataIndex: 'roadAccidentRC',
              key: 'roadAccidentRC',
            },
            {
              title: '医疗事故',
              dataIndex: 'treatAccidentRC',
              key: 'treatAccidentRC',
            },
            {
              title: '产品质量纠纷',
              dataIndex: 'productQualityDisputeRC',
              key: 'productQualityDisputeRC',
            },
            {
              title: '其他人身伤害赔偿',
              dataIndex: 'otherPersonalInjuryRC',
              key: 'otherPersonalInjuryRC',
            },
             {
              title: '见义勇为',
              dataIndex: 'willingHelpRC',
              key: 'willingHelpRC',
             },
             {
              title: '申诉案件',
              dataIndex: 'statementCaseRC',
              key: 'statementCaseRC',
             },
             {
              title: '其他',
              dataIndex: 'otherRC',
              key: 'otherRC',
             }],
            }]
          },
        {
          title: <div><i>21</i><i>22</i><i>23</i><i>24</i></div>,
          children: [{
            title: '未批准情况',
            children: [{
              title: '合计',
              dataIndex: 'totalNRC',
              key: 'totalNRC',
            }, {
              title: '不属于法律援助事项范围',
              dataIndex: 'notBelongNRC',
              key: 'notBelongNRC',
            }, {
              title: '不符合经济困难标准',
              dataIndex: 'financialDiffcultNRC',
              key: 'financialDiffcultNRC',
            }, {
              title: '其他',
              dataIndex: 'otherNRC',
              key: 'otherNRC',
            }]
          }]
        },
        {
          title: <div><i>25</i><i>26</i><i>27</i><i>28</i><i>29</i><i>30</i><i>31</i><i>32</i></div>,
          children: [{
            title: '受援人分类',
            children: [{
              title: '妇女',
              dataIndex: 'womenRC',
              key: 'womenRC',
            }, {
              title: '残疾人',
              dataIndex: 'disabilityRC',
              key: 'disabilityRC',
            }, {
              title: '农民',
              dataIndex: 'farmerRC',
              key: 'farmerRC',
            }, {
              title: '农民工',
              dataIndex: 'peasantWorkerRC',
              key: 'peasantWorkerRC',
            }, {
              title: '老年人',
              dataIndex: 'oldmanRC',
              key: 'oldmanRC',
            }, {
              title: '未成年人',
              dataIndex: 'nonageRC',
              key: 'nonageRC',
            }, {
              title: '军人军属',
              dataIndex: 'soldierFamilyRC',
              key: 'soldierFamilyRC',
            }, {
              title: '少数民族',
              dataIndex: 'minorityRC',
              key: 'minorityRC',
            }]
          }]
        },
        {
          title: <div><i>33</i><i>34</i><i>35</i><i>36</i><i>37</i><i>38</i><i>39</i><i>40</i><i>41</i><i>42</i><i>43</i><i>44</i><i>45</i><i>46</i></div>,
          children: [{
            title: '已结案件承办情况',
            children: [{
              title: '已结案总数',
              dataIndex: 'allCloseRC',
              key: 'allCloseRC',
            }, {
              title: '诉讼',
              children: [{
                title: '胜诉',
                dataIndex: 'winLawsuitRC',
                key: 'winLawsuitRC',
              }, {
                title: '败诉',
                dataIndex: 'loseLawsuitRC',
                key: 'loseLawsuitRC',
              }, {
                title: '调解',
                dataIndex: 'mediateLawsuitRC',
                key: 'mediateLawsuitRC',
              }, {
                title: '撤诉',
                dataIndex: 'nolleProsequiRC',
                key: 'nolleProsequiRC',
              }, {
                title: '终止提供',
                dataIndex: 'stopSupplyRC',
                key: 'stopSupplyRC',
              }, {
                title: '合计',
                dataIndex: 'litigationSumRC',
                key: 'litigationSumRC',
              }]
            }, {
              title: '非诉讼',
              children: [{
                title: '调解',
                dataIndex: 'mediateNotLRC',
                key: 'mediateNotLRC',
              }, {
                title: '和解',
                dataIndex: 'compromiseNotLRC',
                key: 'compromiseNotLRC',
              }, {
                title: '劳动仲裁',
                dataIndex: 'labourArbitationNLRC',
                key: 'labourArbitationNLRC',
              }, {
                title: '终止提供',
                dataIndex: 'stopSupplyNLRC',
                key: 'stopSupplyNLRC',
              }, {
                title: '合计',
                dataIndex: 'noLitigationSumRC',
                key: 'noLitigationSumRC',
              }]
            }, {
              title: '',
              children: [{
                title: <i className={styles.hideLine}>挽回损失或取得利益（万元）</i>,
                dataIndex: 'rewardRC',
                key: 'rewardRC',
              }, {
                title: '为农民工讨薪（万元）',
                dataIndex: 'farmerRewardRC',
                key: 'farmerRewardRC',
              }]
            }]
          }]
        },
        {
          title: '未结案件',
          dataIndex: 'allUncloseRC',
          key: 'allUncloseRC',
        }
      ],
        
          
          
       
      //行政
      administrative: [
        {
          title: '地区',
          dataIndex: 'name',
          key: 'name',
          fixed: 'left',
          width: 160,
          //render: setColumns_21,  
        },
        {
          title: '1',
          children: [{
            title: '申请',
            dataIndex: 'applyAL',
            key: 'applyAL',
          }],
        },
        {
          title: <div><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i><i>10</i><i>11</i><i>12</i></div>,
          children: [{
            title: '批准情况',
            children: [{
              title: '合计',
              dataIndex: 'ratifyCount',
              key: 'ratifyCount',
            }, {
              title: '请求国家赔偿',
              dataIndex: 'ratifyReqCountryCompensate',
              key: 'ratifyReqCountryCompensate',
            }, {
              title: '',
              children: [{
                title: <i className={styles.hideLine}>请求社会保险待遇</i>,
                dataIndex: 'ratifyReqInsurance',
                key: 'ratifyReqInsurance',
              }, {
                title: '',
                children: [{
                  title: <i className={styles.hideLine}>请求工伤保险待遇</i>,
                  dataIndex: 'ratifyReqInsInjury',
                  key: 'ratifyReqInsInjury',
                }, {
                  title: '涉及农民工的',
                  dataIndex: 'ratifyReqInsInjPeasant',
                  key: 'ratifyReqInsInjPeasant',
                }],
              }],
            }, {
              title: '',
              children: [{
                title: <i className={styles.hideLine}>工伤（请求工伤保险待遇之外）</i>,
                dataIndex: 'ratifyWorkHurt',
                key: 'ratifyWorkHurt',
              }, {
                title: '涉及农民工的',
                dataIndex: 'ratifyWorkHurtPeasanter',
                key: 'ratifyWorkHurtPeasanter',
              }],
            }, {
              title: '请求给予最低社会保障待遇',
              dataIndex: 'ratifyLeastIncome',
              key: 'ratifyLeastIncome',
            }, {
              title: '请求发给抚恤金、救济金',
              dataIndex: 'ratifyHelpFee',
              key: 'ratifyHelpFee',
            }, {
              title: '申诉案件',
              dataIndex: 'statementCaseRC',
              key: 'statementCaseRC',
            }, {
              title: '其他',
              dataIndex: 'ratifyOther',
              key: 'ratifyOther',
            }],
          }],
        },
        {
          title: <div><i>13</i><i>14</i><i>15</i><i>16</i></div>,
          children: [{
            title: '未批准情况',
            children: [{
              title: '合计',
              dataIndex: 'noratifyCount',
              key: 'noratifyCount',
            }, {
              title: '不属于法律援助事项范围',
              dataIndex: 'noratifyNolaw',
              key: 'noratifyNolaw',
            }, {
              title: '不符合经济困难标准',
              dataIndex: 'noratifyNopoor',
              key: 'noratifyNopoor',
            }, {
              title: '其他',
              dataIndex: 'noratifyOther',
              key: 'noratifyOther',
            }]
          }]
        },
        {
          title: <div><i>17</i><i>18</i><i>19</i><i>20</i><i>21</i><i>22</i><i>23</i><i>24</i></div>,
          children: [{
            title: '受援人分类',
            children: [{
              title: '妇女',
              dataIndex: 'rpFemale',
              key: 'rpFemale',
            }, {
              title: '残疾人',
              dataIndex: 'rpDisability',
              key: 'rpDisability',
            }, {
              title: '农民',
              dataIndex: 'rpPeasant',
              key: 'rpPeasant',
            }, {
              title: '农民工',
              dataIndex: 'rpPeasanter',
              key: 'rpPeasanter',
            }, {
              title: '老年人',
              dataIndex: 'rpOlder',
              key: 'rpOlder',
            }, {
              title: '未成年人',
              dataIndex: 'rpJuveniles',
              key: 'rpJuveniles',
            },{
              title: '军人军属',
              dataIndex: 'rpArmyFamily',
              key: 'rpArmyFamily',
            }, {
              title: '少数民族',
              dataIndex: 'rpMinority',
              key: 'rpMinority',
            }, ],
          }],
        },
        {
          title: <div><i>25</i><i>26</i><i>27</i><i>28</i><i>29</i><i>30</i><i>31</i><i>32</i><i>33</i></div>,
          children: [{
            title: '已结案件承办情况',
            children: [{
              title: '诉讼',
              children: [{
                title: '合计',
                dataIndex: 'resLawsuitCount',
                key: 'resLawsuitCount',
              }, {
                title: '胜诉',
                dataIndex: 'resLawsuitSuccess',
                key: 'resLawsuitSuccess',
              }, {
                title: '败诉',
                dataIndex: 'resLawsuitFail',
                key: 'resLawsuitFail',
              }, {
                title: '撤诉',
                dataIndex: 'resLawsuitCancel',
                key: 'resLawsuitCancel',
              }, {
                title: '终止提供',
                dataIndex: 'resLawsuitStop',
                key: 'resLawsuitStop',
              }],
            }, {
              title: '',
              children: [{
                title: <i className={styles.hideLine}>非诉讼</i>,
                dataIndex: 'resNolawsuit',
                key: 'resNolawsuit',
              }, {
                title: '终止提供',
                dataIndex: 'resNolawsuitStop',
                key: 'resNolawsuitStop',
              }],
            }, {
              title: '合计',
              dataIndex: 'resCount',
              key: 'resCount',
            }, {
              title: '挽回损失或取得利益(万元)',
              dataIndex: 'resIncome',
              key: 'resIncome',
            }],
          }],
        },
        {
          title: '34',
          children: [{
            title: '未结案件',
            dataIndex: 'uncloseCase',
            key: 'uncloseCase',
          }],
        },
        // {
        //   title: '34',
        //   children: [{
        //     title: '被投诉案件',
        //     dataIndex: 'beComplaint',
        //     key: 'beComplaint',
        //   }],
        // },
        // {
        //   title: '35',
        //   children: [{
        //     title: '法律援助案件批准总数',
        //     dataIndex: 'allRatifyCount',
        //     key: 'allRatifyCount',
        //   }],
        // },
        // {
        //   title: '36',
        //   children: [{
        //     title: '已结案件总数',
        //     dataIndex: 'allClose',
        //     key: 'allClose',
        //   }],
        // },
        // {
        //   title: '37',
        //   children: [{
        //     title: '挽回损失或取得利益总数',
        //     dataIndex: 'allIncome',
        //     key: 'allIncome',
        //   }],
        // },
        // {
        //   title: '38',
        //   children: [{
        //     title: '未结案件',
        //     dataIndex: 'allUnclose',
        //     key: 'allUnclose',
        //   }],
        // },
        // {
        //   title: '39',
        //   children: [{
        //     title: '被投诉案件',
        //     dataIndex: 'allComplaint',
        //     key: 'allComplaint',
        //   }],
        // },
        // {
        //   title: '40',
        //   children: [{
        //     title: '受援人合计',
        //     dataIndex: 'allRpCount',
        //     key: 'allRpCount',
        //   }],
        // },
        // {
        //   title: <div><i>41</i><i>42</i><i>43</i><i>44</i><i>45</i><i>46</i><i>47</i><i>48</i></div>,
        //   children: [{
        //     title: '受援人分类',
        //     children: [{
        //       title: '女性',
        //       dataIndex: 'allRpFeman',
        //       key: 'allRpFeman',
        //     }, {
        //       title: '残疾人',
        //       dataIndex: 'allRpDisability',
        //       key: 'allRpDisability',
        //     }, {
        //       title: '农民',
        //       dataIndex: 'allRpPeasant',
        //       key: 'allRpPeasant',
        //     }, {
        //       title: '农民工',
        //       dataIndex: 'allRpPeasanter',
        //       key: 'allRpPeasanter',
        //     }, {
        //       title: '老年人',
        //       dataIndex: 'allRpOlder',
        //       key: 'allRpOlder',
        //     }, {
        //       title: '未成年人',
        //       dataIndex: 'allRpJuveniles',
        //       key: 'allRpJuveniles',
        //     }, {
        //       title: '少数民族',
        //       dataIndex: 'allRpMinority',
        //       key: 'allRpMinority',
        //     }, {
        //       title: '军人军属',
        //       dataIndex: 'allRpArmyFamily',
        //       key: 'allRpArmyFamily',
        //     }],
        //   }],
        // },
      ],
      // 服务人员
      hashslinger: [
        {
          title: '地区',
          dataIndex: 'name',
          key: 'name',
          fixed: 'left',
          width: 160,
          //render: setColumns_21,  
        },
        {
          title: <div><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i></div>,
          children: [{
            title: '法律援助机构人员办案数（件）',
            children: [{
              title: '刑事诉讼',
              dataIndex: 'criminalProcedureLA',
              key: 'criminalProcedureLA',
            }, {
              title: '民事',
              children: [{
                title: '诉讼',
                dataIndex: 'civilActionLA',
                key: 'civilActionLA',
              }, {
                title: '非诉讼',
                dataIndex: 'civilActionNLA',
                key: 'civilActionNLA',
              }],
            }, {
              title: '行政',
              children: [{
                title: '诉讼',
                dataIndex: 'adminProceedingLA',
                key: 'adminProceedingLA',
              }, {
                title: '非诉讼',
                dataIndex: 'adminProceedingNLA',
                key: 'adminProceedingNLA',
              }],
            }, {
              title: '合计',
              dataIndex: 'allLA',
              key: 'allLA',
            }],
          }],
        },
        {
          title: <div><i>7</i><i>8</i><i>9</i><i>10</i><i>11</i><i>12</i></div>,
          children: [{
            title: '社会律师办案数（件）',
            children: [{
              title: '刑事诉讼',
              dataIndex: 'criminalProcedureSL',
              key: 'criminalProcedureSL',
            }, {
              title: '民事',
              children: [{
                title: '诉讼',
                dataIndex: 'civilActionSL',
                key: 'civilActionSL',
              }, {
                title: '非诉讼',
                dataIndex: 'civilActionNSL',
                key: 'civilActionNSL',
              }],
            }, {
              title: '行政',
              children: [{
                title: '诉讼',
                dataIndex: 'adminProceedingSL',
                key: 'adminProceedingSL',
              }, {
                title: '非诉讼',
                dataIndex: 'adminProceedingNSL',
                key: 'adminProceedingNSL',
              }],
            }, {
              title: '合计',
              dataIndex: 'allSL',
              key: 'allSL',
            }],
          }],
        },
        {
          title: <div><i>13</i><i>14</i><i>15</i><i>16</i><i>17</i></div>,
          children: [{
            title: '基层法律服务工作者办案数（件）',
            children: [{
              title: '民事',
              children: [{
                title: '诉讼',
                dataIndex: 'civilActionBLW',
                key: 'civilActionBLW',
              }, {
                title: '非诉讼',
                dataIndex: 'civilActionNoBLW',
                key: 'civilActionNoBLW',
              }],
            }, {
              title: '行政',
              children: [{
                title: '诉讼',
                dataIndex: 'adminProceedingBLW',
                key: 'adminProceedingBLW',
              }, {
                title: '非诉讼',
                dataIndex: 'adminProceedingNoBLW',
                key: 'adminProceedingNoBLW',
              }],
            }, {
              title: '合计',
              dataIndex: 'allBLW',
              key: 'allBLW',
            }],
          }],
        },
        {
          title: <div><i>18</i><i>19</i><i>20</i><i>21</i><i>22</i></div>,
          children: [{
            title: '社会组织人员办案数（件）',
            children: [{
              title: '民事',
              children: [{
                title: '诉讼',
                dataIndex: 'civilActionSOP',
                key: 'civilActionSOP',
              }, {
                title: '非诉讼',
                dataIndex: 'civilActionNoSOP',
                key: 'civilActionNoSOP',
              }],
            }, {
              title: '行政',
              children: [{
                title: '诉讼',
                dataIndex: 'adminProceedingSOP',
                key: 'adminProceedingSOP',
              }, {
                title: '非诉讼',
                dataIndex: 'adminProceedingNoSOP',
                key: 'adminProceedingNoSOP',
              }],
            }, {
              title: '合计',
              dataIndex: 'allSOP',
              key: 'allSOP',
            }],
          }],
        },
        {
          title: <div><i>23</i><i>24</i><i>25</i><i>26</i><i>27</i></div>,
          children: [{
            title: '注册法律援助志愿者办案数（件）',
            children: [{
              title: '民事',
              children: [{
                title: '诉讼',
                dataIndex: 'civilActionLAV',
                key: 'civilActionLAV',
              }, {
                title: '非诉讼',
                dataIndex: 'civilActionNoLAV',
                key: 'civilActionNoLAV',
              }],
            }, {
              title: '行政',
              children: [{
                title: '诉讼',
                dataIndex: 'adminProceedingLAV',
                key: 'adminProceedingLAV',
              }, {
                title: '非诉讼',
                dataIndex: 'adminProceedingNoLAV',
                key: 'adminProceedingNoLAV',
              }],
            }, {
              title: '合计',
              dataIndex: 'allLAV',
              key: 'allLAV',
            }],
          }],
        },
      ],
      // 咨询
      counsel: [
        {
          title: '地区',
          dataIndex: 'name',
          key: 'name',
          fixed: 'left',
          width: 160,
          //render: setColumns_21,  
        },
        {
          title: '1',
          children: [{
            title: '咨询总数（人次）',
            dataIndex: 'allConsult',
            key: 'allConsult'
          }]
        },
        {
          title: <div><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i><i>10</i><i>11</i><i>12</i><i>13</i><i>14</i></div>,
          children: [{
            title: '咨询方式',
            children: [{
              title: '来访合计',
              dataIndex: 'visitCount',
              key: 'visitCount',
            }, {
              title: '分类',
              children: [{
                title: '妇女',
                dataIndex: 'femaleCounsel',
                key: 'femaleCounsel',
              }, {
                title: '残疾人',
                dataIndex: 'disabilityCounsel',
                key: 'disabilityCounsel',
              }, {
                title: '农民',
                dataIndex: 'peasantCounsel',
                key: 'peasantCounsel',
              }, {
                title: '农民工',
                dataIndex: 'peasanterCounsel',
                key: 'peasanterCounsel',
              }, {
                title: '老年人',
                dataIndex: 'olderCounsel',
                key: 'olderCounsel',
              }, {
                title: '未成年人',
                dataIndex: 'nonageCounsel',
                key: 'nonageCounsel',
              },{
                title: '军人军属',
                dataIndex: 'armyFamilyCounsel',
                key: 'armyFamilyCounsel',
              }
              , {
                title: '少数民族',
                dataIndex: 'minorityCounsel',
                key: 'minorityCounsel',
              }, ],
            }, {
              title: '来信',
              dataIndex: 'byLetter',
              key: 'byLetter',
            }, {
              title: '',
              children: [{
                title: <i className={styles.hideLine}>来电</i>,
                dataIndex: 'byTel',
                key: 'byTel',
              }, {
                title: '通过12348法律援助专线电话',
                dataIndex: 'bySpecialTel',
                key: 'bySpecialTel',
              }],
            }, {
              title: '网络',
              dataIndex: 'byNet',
              key: 'byNet',
            }],
          }],
        },
        {
          title: <div><i>15</i><i>16</i><i>17</i><i>18</i><i>19</i><i>20</i><i>21</i><i>22</i><i>23</i><i>24</i></div>,
          children: [{
            title: '咨询类型（件）',
            children: [{
              title: '合计',
              dataIndex: 'typeCount',
              key: 'typeCount',
            },{
              title: '刑事',
              dataIndex: 'criminalNum',
              key: 'criminalNum',
            }, {
              title: '请求国家赔偿',
              dataIndex: 'reqCountryCompensate',
              key: 'reqCountryCompensate',
            }, {
              title: '请求社会保险待遇',
              dataIndex: 'reqInsurance',
              key: 'reqInsurance',
            }, {
              title: '请求最低生活保障待遇',
              dataIndex: 'reqLeastIncome',
              key: 'reqLeastIncome',
            }, {
              title: '请求发给抚恤金、救济金',
              dataIndex: 'reqHelpFee',
              key: 'reqHelpFee',
            }, {
              title: '劳动纠纷',
              dataIndex: 'laborDisputes',
              key: 'laborDisputes',
            }, {
              title: '婚姻家庭',
              dataIndex: 'marriage',
              key: 'marriage',
            }, {
              title: '损害赔偿',
              dataIndex: 'damage',
              key: 'damage',
            }, {
              title: '其他',
              dataIndex: 'otherReason',
              key: 'otherReason',
            }],
          }],
        },
        {
          title: <div><i>25</i><i>26</i><i>27</i><i>28</i></div>,
          children: [{
            title: '处理方式',
            children: [{
              title: '代书',
              dataIndex: 'dealAgentDoc',
              key: 'dealAgentDoc',
            }, {
              title: '',
              children: [{
                title: <i className={styles.hideLine}>在咨询中申请法律援助</i> ,
                dataIndex: 'dealAidInConsult',
                key: 'dealAidInConsult',
              }, {
                title: '受理并批准',
                dataIndex: 'dealAcceptAndAgree',
                key: 'dealAcceptAndAgree',
              }],
            }, {
              title: '引导向其他渠道求助',
              dataIndex: 'dealGuideOtherChannel',
              key: 'dealGuideOtherChannel',
            },],
          }],
        },
      ],
    },
  }

  //月报表头
  const monthStatementData = reportForm.monthStatementData
  //月报key
  for (let i = 0; i < monthStatementData.length; i++) {
    monthStatementData[i].key = `monthStatementData${  i}`;
  }
  if (monthStatementData) {
    monthStatementData.forEach((item, index) => {
      monthStatementData[index].children = item['monthResult']
    })
  }
  // 季报
  
  //季报key
  // for (let i = 0; i < quarterStatementData.length; i++) {
  //   quarterStatementData[i].key = `quarterStatementData${  i}`;
  // }
  const quarterCount = quarterStatementData.quarterCount
  if (quarterCount) {
    quarterCount.forEach((item, index) => {
      quarterCount[index].children = item['quarterResult']
    })
  }
 
  
  // 半年报
  const halfYearStatementData = reportForm.halfYearStatementData
  //半年报key
  // for (let key in halfYearStatementData) {
  //   for (let i = 0; i < halfYearStatementData[key].length; i++) {
  //     halfYearStatementData[key][i].key = 'halfYearStatementData' + key + i;
  //   }
  // }

  // 年报
  const yearStatementData = reportForm.yearStatementData
  //年报key
  // for (let key in yearStatementData) {
  //   for (let i = 0; i < yearStatementData[key].length; i++) {
  //     yearStatementData[key][i].key = 'yearStatementData' + key + i;
  //   }
  // }
  let criminalDto =  halfYearStatementData.criminalDto || []
  if (criminalDto) {
    criminalDto.forEach((item, index) => {
      criminalDto[index].children = item['criminalResult']
    })
  }
  let civilDto =  halfYearStatementData.civilDto || []
  if (civilDto) {
    civilDto.forEach((item, index) => {
      civilDto[index].children = item['civilResult']
    })
  }
  let amiDto =  halfYearStatementData.amiDto || []
  if (amiDto) {
    amiDto.forEach((item, index) => {
      amiDto[index].children = item['amiResult']
    })
  }
  let dealStatusDto =  halfYearStatementData.dealStatusDto || []
  if (dealStatusDto) {
    dealStatusDto.forEach((item, index) => {
      dealStatusDto[index].children = item['dealStatusResult']
    })
  }
  let consultDto =  halfYearStatementData.consultDto || []
  if (consultDto) {
    consultDto.forEach((item, index) => {
      consultDto[index].children = item['consultResult']
    })
  }
//报表八
  let rpDto = halfYearStatementData.rpDto || []
  if (rpDto) {
    rpDto.forEach((item, index) => {
      let num=rpDto[index].children
      if(typeof num =='object' ){
        return
      }else{
        rpDto[index].childrenSS= num
      rpDto[index].children = item['rpResult'];
      rpDto[index].children.forEach((items,indexs)=>{
        let numc=items['children']
        items['childrenSS']=numc;
        delete items['children']
      });
      }
      
    })
  }
  
//报表九
  let rpUserDto = halfYearStatementData.rpUserDto||[]
  if (rpUserDto) {
    rpUserDto.forEach((item, index) => {
      let num=rpUserDto[index].children
      if(typeof num =='object' ){
        return
      }else{
        rpUserDto[index].childrenSS= num
      rpUserDto[index].children = item['rpUserResult'];
      rpUserDto[index].children.forEach((items,indexs)=>{
        let numc=items['children']
        items['childrenSS']=numc;
        delete items['children']
      });
      }
      
    })
  }
  //报表八
  let rpDtoY = yearStatementData.rpDto || []
  if (rpDtoY) {
    rpDtoY.forEach((item, index) => {
      let num=rpDtoY[index].children
      if((typeof num )=='object' ){
        return
      }else{
        rpDtoY[index].childrenSS= num
        rpDtoY[index].children = item['rpResult'];
        rpDtoY[index].children.forEach((items,indexs)=>{
          let numc=items['children']
          items['childrenSS']=numc;
          delete items['children']
        });
      }
     
    })
  }
  
//报表九
  let rpUserDtoY = yearStatementData.rpUserDto||[]
  if (rpUserDtoY) {
    rpUserDtoY.forEach((item, index) => {
      let num=rpUserDtoY[index].children
      if((typeof num ) =='object' ){
        return
      }else{
        rpUserDtoY[index].childrenSS= num
        rpUserDtoY[index].children = item['rpUserResult'];
        rpUserDtoY[index].children.forEach((items,indexs)=>{
          let numc=items['children']
          items['childrenSS']=numc;
          delete items['children']
        });
      }
      
    })
  }

  let criminalDtoYear =  yearStatementData.criminalDto || []
  if (criminalDtoYear) {
    criminalDtoYear.forEach((item, index) => {
      criminalDtoYear[index].children = item['criminalResult']
    })
  }
  let civilDtoYear =  yearStatementData.civilDto || []
  if (civilDtoYear) {
    civilDtoYear.forEach((item, index) => {
      civilDtoYear[index].children = item['civilResult']
    })
  }
  let amiDtoYear =  yearStatementData.amiDto || []
  if (amiDtoYear) {
    amiDtoYear.forEach((item, index) => {
      amiDtoYear[index].children = item['amiResult']
    })
  }
  let dealStatusDtoYear =  yearStatementData.dealStatusDto || []
  if (dealStatusDtoYear) {
    dealStatusDtoYear.forEach((item, index) => {
      dealStatusDtoYear[index].children = item['dealStatusResult']
    })
  }
  let consultDtoYear =  yearStatementData.consultDto || []
  if (consultDtoYear) {
    consultDtoYear.forEach((item, index) => {
      consultDtoYear[index].children = item['consultResult']
    })
  }
  const formItemLayout = {
    labelCol: {
      span: 12,
    },
    wrapperCol: {
      span: 12,
    },
  }

  function disabledDate (current) {
    return current && current.valueOf() > (Date.now() - 1000 * 60 * 60 * 24) || current.valueOf() < 1000 * 60 * 60 * 24 * 365 * (2016 - 1970)
  }

  // 获取月报
  const getMonthStatement = () => {
    validateFieldsAndScroll((errors, values) => {
      if (errors != null && errors.startTime) {
        return
      }
      let fields = getFieldsValue()
      let time = fields.startTime.format('YYYY-MM-DD').split('-')
      let year = time[0]
      let month = time[1]
      let data = {
       time: year+month,
       smYear:year,
       smMonth:month
      }
      dispatch({
        type: 'reportForm/getMonthStatement',
        payload: data,
      })
    })
  }

  // 获取季报
  const getQuarterStatement = () => {
    validateFieldsAndScroll((errors, values) => {
      if (values.b_year == undefined || values.b_quarter == undefined) {
        return
      }
      let fields = getFieldsValue()
      console.log(values)
      var data
      if(fields.b_quarter == '01'){
        data = {
          startTime: (fields.b_year-1)+ '12',
          endTime: fields.b_year+ '02',
          smYear:values.b_year,
          smQuarter:values.b_quarter
        }
      }else if(fields.b_quarter == '04'){
        data = {
          startTime: fields.b_year + '03',
          endTime: fields.b_year + '05',
          smYear:values.b_year,
          smQuarter:values.b_quarter
        }
      }else if(fields.b_quarter == '07') {
        data = {
          startTime: fields.b_year + '06',
          endTime: fields.b_year + '08',
          smYear:values.b_year,
          smQuarter:values.b_quarter
        }
      }else if(fields.b_quarter == '10'){
        data = {
          startTime: fields.b_year + '09',
          endTime: fields.b_year + '11',
          smYear:values.b_year,
          smQuarter:values.b_quarter
        }
      }
     
      // // console.log('请求前');
      dispatch({
        type: 'reportForm/getQuarterStatement',
        payload: data,
      })
    })
  }

  // 获取半年
  const getHalfYearStatement = () => {
    validateFieldsAndScroll((errors, values) => {
      if (values.c_smHalfYear == undefined) {
        return
      }
      let fields = getFieldsValue()
      const halfYearTime = fields.c_smHalfYear.split('-')
      let nexthalfYearTime=halfYearTime[1]
      if(halfYearTime[1].substring(5)=="5"){
        nexthalfYearTime=Number(halfYearTime[1].substring(0,4))+1+"05"; 
      }
      let data = {
        startTime: halfYearTime[0],
        endTime: nexthalfYearTime
      }
      dispatch({
        type: 'reportForm/getHalfYearStatement',
        payload: data,
      })
    })
  }

  // 获取年报
  const getYearStatement = () => {
    validateFieldsAndScroll((errors, values) => {
      if (values.d_smYear == undefined) {
        return
      }
      let fields = getFieldsValue();
      console.log(fields)
      let data = {
        startTime:(Number(fields.d_smYear)-Number(1))+ '12',
        endTime: fields.d_smYear+ '11'
      }
      dispatch({
        type: 'reportForm/getYearStatement',
        payload: data,
      })
    })
  }

  const token = `&token=${  localStorage.getItem('token')}`;
  // 下载月报
  const downloadMonthStatement = () => {
    let url = `${api.baseURL + api.downloadMonthStatement  }?time=${  reportForm.download.month.data  }${token}`;
    window.open(url)
  }

  // 下载季报
  const downloadQuarterStatement = () => {
    let url = `${api.baseURL + api.downloadQuarterStatement  }?startTime=${  reportForm.download.quarter.downloadData.startTime  }&endTime=${ reportForm.download.quarter.downloadData.endTime}${token}`;
    window.open(url)
  }

  // 下载半年报
  const downloadHalfYearStatement = () => {
    let url = `${api.baseURL + api.downloadHalfYearStatement  }?startTime=${  reportForm.download.halfYear.downloadData.startTime  }&endTime=${reportForm.download.halfYear.downloadData.endTime}&state=${reportForm.download.year.state}${token}`;
    window.open(url)
  }

  // 下载年报
  const downloadYearStatement = () => {
    let url = `${api.baseURL + api.downloadYearStatement  }?startTime=${  reportForm.download.year.downloadData.startTime  }&endTime=${reportForm.download.year.downloadData.endTime}&state=${reportForm.download.year.state}${token}`;
    window.open(url)
  }
console.log(reportForm.download)
  return (
    <div className={styles.reportForm}>
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="月报" key="1">
          <Form>
            <Row className={styles.selectRow} gutter={16}>
              <Col span={8}>
                <FormItem {...formItemLayout} label="选择日期:">
                  {getFieldDecorator('startTime', {
                    rules: [{ required: true, message: '请选择日期' }],
                  })(
                    <MonthPicker
                      disabledDate={disabledDate}
                    />
                    )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem>
                  <Button type="primary" onClick={getMonthStatement}>生成报表</Button>
                </FormItem>
              </Col>
              {reportForm.download.month.show &&
                <Col span={3}>
                  <FormItem>
                    <Button type="primary" onClick={downloadMonthStatement}>下载报表</Button>
                  </FormItem>
                </Col>
              }
            </Row>
          </Form>
          <Row className={styles.dataView}>
            {reportForm.download.month.show &&
              <Table
                pagination={false}
                className={styles.tb11}
                dataSource={monthStatementData}
                rowKey={record => record.name}
                columns={columns.monthStatementColumns}
                bordered size="small"
                scroll={{ x: 80 * 26 }}
                title={() => <div className={styles.tbTitle}><h2>{reportForm.download.month.yearText}年{reportForm.download.month.monthText}月份法律援助业务数据统计表（月报）</h2><p><span>填报单位：</span><span>填表人：</span><span>负责人：</span></p></div>}
              />
            }
          </Row>
        </TabPane>

        <TabPane tab="季报" key="2">
          <Form>
            <Row className={styles.selectRow} gutter={16}>
              <Col span={8}>
                <FormItem {...formItemLayout} label="请选择年份:">
                  {getFieldDecorator('b_year', {
                    rules: [{ required: true, message: '请选择年份' }],
                  })(
                    <Select
                      onChange={setValue}
                      style={{ width: '80%' }}
                      placeholder="选择年份"
                    >
                      {yearOption}
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label="请选择季度:">
                  {getFieldDecorator('b_quarter', {
                    rules: [{ required: true, message: '请选择季度' }],
                  })(
                    <Select
                      style={{ width: '80%' }}
                      placeholder="选择季度"
                    >
                      {getSuarterList(getFieldValue('b_year'))}
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem>
                  <Button type="primary" onClick={getQuarterStatement}>生成报表</Button>
                </FormItem>
              </Col>
              {reportForm.download.quarter.show &&
                <Col span={3}>
                  <FormItem>
                    <Button type="primary" onClick={downloadQuarterStatement}>下载报表</Button>
                  </FormItem>
                </Col>
              }
            </Row>
          </Form>
          <Row className={styles.dataView}>
            {reportForm.download.quarter.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                dataSource={quarterCount}
                rowKey={record => record.name}
                columns={columns.quarterStatementColumns}
                bordered size="small"
                scroll={{ x: 80 * 56 }}
                title={() => <div className={styles.tbTitle2}><h2>{reportForm.download.quarter.yearText}年第{reportForm.download.quarter.quarterText}季度法律咨询数据统计表（季报）</h2><p><span>填报单位：</span><span>填表人：</span></p></div>}
                //footer={() => <div className={styles.tbFooter}><p><b>注：</b>此表所报数据为当季数，每季度末由各市中心（汇总区县数据后）报省中心。统计口径为上季度末月21日起至本季度末月20日止。请在黄色框添加当地典型类型咨询，格子不够可自行增加。填报时请注意表内关系。</p><p><b>表内关系：</b>1=2+4+5+6+7 2≥3 1=18+28+38 合计项：同列数据求和</p></div>}
              />
            }
          </Row>
        </TabPane>

        <TabPane tab="半年报" key="3">
          <Form>
            <Row className={styles.selectRow} gutter={16}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="选择报表时间范围：">
                  {getFieldDecorator('c_smHalfYear', {
                    rules: [{ required: true, message: '请选择报表时间范围' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      size="large"
                      placeholder="选择报表时间范围"
                    >
                      {halfYearOption}
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem>
                  <Button type="primary" onClick={getHalfYearStatement}>生成报表</Button>
                </FormItem>
              </Col>
              {reportForm.download.halfYear.show &&
                <Col span={3}>
                  <FormItem>
                    <Button type="primary" onClick={downloadHalfYearStatement}>下载报表</Button>
                  </FormItem>
                </Col>
              }
            </Row>
          </Form>
        
          <Row className={styles.dataView}>
            {reportForm.download.halfYear.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                dataSource={criminalDto}
                rowKey={record => record.name}
                columns={columns.yearStatementColumns.panel}
                bordered size="small"
                scroll={{ x: 80 * 48 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表五（刑事法律援助）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><b>表内关系：</b></p><p><span>列1=12+13+28</span><span>12=2+3+4+5+6=7+8+9+10+11</span><span>18=14+15+16+17</span><span>28=24+25+26+27</span><span>44=40+41+42+43</span><span>29>=1</span></p><p><b>指标解释：</b></p><p>1、申请数、批准数、未批准数、已结案件数、未结案件数一名申请人就某一项申请法律援助的，申请数为“1”，批准数、未批准数、已结案件数、未结案件数类推。两名2以上的当事人申请法律援助，如果请求事项不可分（如交通事故当事人死亡，两个以上的继承人要求赔偿的），则为一个申请，申请数为“1”，批准数、未批准数、已结案件数、未结案件数类推。两名以上的当事人申请法律援助，如果请求事项是可分的，但类型相同（如几名农民工同时请求所在企业支付拖欠的劳动报酬），申请数按照申请人数计算，批准数、未批准数、已结案件数、未结案件数类推。此解释适用所有法律援助案件。</p><p>2、农民：指户籍在农村，以从事农业生产所得收入作为其主要生活来源的人。</p><p>3、农民工：指户籍仍在农村，主要从事非农产业，并已非农产业所得收入作为其主要生活来源的人。</p></div>}
              />
            }
          </Row>

           <Row className={styles.dataView}>
            {reportForm.download.halfYear.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                dataSource={civilDto}
                rowKey={record => record.name}
                columns={columns.yearStatementColumns.civil}
                bordered size="small"
                scroll={{ x: 80 * 49 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表六（民事法律援助）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><b>表内关系：</b></p><p><span>列1=2+19</span><span>1>=2</span><span>2=3+6+7+8+9+11+13+14+15+16+18</span><span>4>=5</span><span>9>=10</span><span>11>=12</span><span>16>=17</span><span>19=20+21+22</span><span>42=32+33+34+35+36+37</span><span>23>=2</span><span>37>=38、39、40、41</span><span>43>=44</span></p><p><b>指标解释：</b></p><p>（非诉讼）调解：是指法律援助人员代理受援人，在第三方主持下，与对方当事人进行协商并达成协议的一种纠纷解决的方式。和解：是指法律援助人员代理受援人，在自愿互谅的基础上与对方当事人进行协商并达成协议，自行解决纠纷的一种方式。</p></div>}
              />
            }
          </Row> 

          <Row className={styles.dataView}>
            {reportForm.download.halfYear.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                dataSource={amiDto}
                rowKey={record => record.name}
                columns={columns.yearStatementColumns.administrative}
                bordered size="small"
                scroll={{ x: 80 * 36 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表七（行政法律援助）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><b>表内关系：</b></p><p><span>列1=2+12</span><span>1>=2</span><span>2=3+4+7+9+10+11</span><span>4>=5</span><span>5>=6</span><span>7>=8</span><span>12=13+14+15</span><span>16>=2</span><span>31=25+26+27+28+29</span><span>29>=30</span></p><p><b>表间关系：</b></p><p><span>表七35=表五1+表六2+表七2</span><span>表七36=表五44+表六42+表七31</span><span>表七37=表五45+表六43+表七32</span><span>表七38=表五46+表六45+表七33</span><span>表七39=表五47+表六46+表七34</span><span>表七40=表五29+表六23+表七16</span><span>表七41=表五30+表六24+表七17</span><span>表七42=表五31+表五32+表六25+表七18</span><span>表七43=表五33+表六26+表七19</span><span>表七44=表五34+表六27+表七20</span><span>表七45=表五35+表六28+表七21</span><span>表七46=表五36+表六29+表七22</span><span>表七47=表五37+表六30+表七23</span><span>表七48=表五38+表六31+表七24</span></p></div>}
              />
            }
          </Row>
          <Row className={styles.dataView}>
            {reportForm.download.halfYear.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                dataSource={rpDto}
                columns={columns.yearStatementColumns.emptyListEight}
                rowKey={record => record.name}
                bordered size="small"
                scroll={{ x: 80 * 15 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表八（各类案件及受援人合计）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><b>表间关系:</b></p><p><span>表八1=表五1+表六2+表七2</span><span>表八2=表五44+表六33+表七32</span><span>表八3=表五45+表六45+表七33 </span></p><p><span>表八4=表五46+表六47+表七34</span><span>表八5=表五30+表六25+表七17</span><span>表八6=表五31+表六26+表七18</span></p><p><span>表八7=表五33+表六27+表七19</span><span>表八8=表五34+表六28=表七20</span><span>表八9=表五35+表六29+表七21</span></p><p><span> 表八10=表五36+表六30+表七22</span><span>表八11=表五37+表六31+表七23</span><span>表八12=表五38+表六32+表七24</span></p><p><span> 表八13=表五39</span></p></div>} 
                />
            }
          </Row>
          <Row className={styles.dataView}>
            {reportForm.download.halfYear.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                dataSource={rpUserDto}
                columns={columns.yearStatementColumns.emptyListNight}
                rowKey={record => record.name}
                bordered size="small"
                scroll={{ x: 80 * 15 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表九（受援人）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><b>表内关系:</b><span>1=2+3+4</span></p><p><b>表间关系:</b><span>表九5>=表八5，表九6>=表八6，表九7>=表八7，表九8>=表八8，表九9>=表八9, 表九10>=表八10，表九11>=表八11，表九12>=表八12，表九13>=表八13</span></p><p><b>指标解释:</b></p><p>1. 各类案件受援人：本年度内实际受援人次。
                //</p><p>2. 受援人分类中受援人身份有交叉的可分别统计。</p><p>3．农民：填报户籍在农村，以从事农业生产所得收入作为其主要生活来源的人。</p><p>4. 农民工：填报户籍仍在农村，主要从事非农产业，并以非农产业所得收入作为其主要生活来源的人。</p><p>5. 妇女：成年女性。</p></div>} 
                />
   }
          </Row>
          <Row className={styles.dataView}>
            {reportForm.download.halfYear.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                dataSource={dealStatusDto}
                rowKey={record => record.name}
                columns={columns.yearStatementColumns.hashslinger}
                bordered size="small"
                scroll={{ x: 80 * 29 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表十（已结案件中各类人员办理情况）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><b>表内关系：</b></p><p><span>列6=1+2+3+4+5</span><span>12=7+8+9+10+11</span><span>17=13+14+15+16</span><span>22=18+19+20+21</span><span>27=23+24+25+26</span></p><p><b>表间关系：</b></p><p><span>表八1+7=表五44</span><span>表八2+3+8+9+13+14+18+19+23+24=表六42</span><span>表八4+5+10+11+15+16+20+21+25+26=表七31</span><span>表八6+12+17+22+27=表七36</span></p></div>}
              />
            }
          </Row>

          <Row className={styles.dataView}>
            {reportForm.download.halfYear.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                dataSource={consultDto}
                columns={columns.yearStatementColumns.counsel}
                rowKey={record => record.name}
                bordered size="small"
                scroll={{ x: 80 * 30 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表十一（咨询）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><b>表内关系：</b></p><p><span>列14=1+10+11+13</span><span>11>=12</span><span>30=15+16+17+18+19+20+21+22+23+24+25+26+27+28+29</span><span>34>=35</span></p><p><b>指标解释：</b></p><p>咨询方式、咨询类型：1人1次咨询两种或两种以上类型事项，视为1人次咨询，2件或以上咨询。</p></div>}
              />
            }
          </Row> 
            <Row className={styles.dataView}>
            {reportForm.download.halfYear.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                // dataSource={}
                columns={columns.yearStatementColumns.emptyListOne}
                rowKey={record => record.name}
                bordered size="small"
                scroll={{ x: 80 * 31 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表一（机构）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><b>本表除办公用房建筑面积、宣传、培训情况外，其余各栏单位为“个”</b></p><p><span>表内关系:</span><span>1>=2,3</span><span> 1+4>=18,20</span><span>4>=5</span><span>4=6+7+9</span><span>4>=16+17</span><span>7>=8</span><span>4>=10,11,13,16,17</span><span>13>=14,15</span><span>18>=19</span><span>20>=21</span></p><p><b>指标解释：</b></p><p>1.法律援助管理机构、法律援助机构：法律援助管理机构填报司法行政机关设立的负责监督管理法律援助工作的内设或直属机构，如：法律援助局，法律援助处，法律援助科，包括挂牌在其他处室科的法律援助管理机构。法律援助机构填报各地设立的法律援助中心。一个机构同时挂两个牌子（合署办公）的，法律援助管理机构和法律援助机构都要填报。</p><p>2.同级财政预算是指法律援助业务经费列入本级财政预算项目，即法律援助业务经费在预算中单列科目。</p><p>3.法律援助律师：填报具有律师资格或法律职业资格，取得律师工作证的法律援助机构工作人员。法律援助机构工作人员注册为公职律师的，也视为法律援助律师。</p><p>4.使用法律援助信息管理系统：填报完成全国法律援助信息管理系统本地化部署，并使用信息管理系统上报数据、录入案件、接受群众咨询等事项的单位数。</p><p>5.12348独立机构：指当地12348机构具有单独的编制、人员、经费，独立于法律援助机构。</p><p>6.第16和17项只可填报其中一项。办公设备配置齐全：填报配备有计算机、打印机、复印机、照相机、电话、传真机、信息管理系统、文件档案橱柜、法律法规数据库、交通车辆等设备的机构。基本设备配置齐全：填报配备有计算机、打印机、电话、传真机、文件档案橱柜等设备的机构。</p><p>7.省部级以上表彰：填报省级以上（含省级）人民政府的表彰、司法行政系统及其他系统部级以上的表彰（限本年度，不含以往年度的表彰）。地市县级表彰：填报地市县级人民政府的表彰、司法行政系统以及其他系统地市县级表彰（限本年度，不含以往年度的表彰）。</p><p>8.法律援助民办非企业单位：填报经司法行政机关审核同意，在民政部门登记，利用非国有资产举办的，从事法律援助服务活动的民间社会组织。</p></div>}
              />
            }
          </Row>
          <Row className={styles.dataView}>
            {reportForm.download.halfYear.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                // dataSource={}
                columns={columns.yearStatementColumns.emptyListTwo}
                rowKey={record => record.name}
                bordered size="small"
                scroll={{ x: 80 * 22 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表二（人员）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><span>表内关系:</span><span>1=3+9</span><span>2=4+10</span><span>2>=15</span><span>4>=6</span><span>4>=7+8</span><span>10>=12</span><span>10>=13+14</span><span>15>=16</span></p><p><b>指标解释：</b></p><p>1.实有人数：机构的实际工作人员数，不包含短期、临时（一年内）用工。</p><p>2.法律援助管理机构只挂牌无管理人员的，请在3-8内填写0。</p><p>3.法律专业：填报国家承认学历的专科以上的法律专业毕业生，不包括中专及以下人员。</p><p>4.注册法律援助志愿者：填报在县和县以上法律援助志愿者组织或法律援助机构注册登记的，利用自身所具备的专业知识和能力,自愿为社会和他人提供免费法律服务和帮助的个人。</p><p>5.表一第29项填报有民办非企业单位的，本表第20项必须填报民办非企业单位人数。</p></div>}
              />
            }
          </Row>
          <Row className={styles.dataView}>
            {reportForm.download.halfYear.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                // dataSource={}
                columns={columns.yearStatementColumns.emptyListThree}
                rowKey={record => record.name}
                bordered size="small"
                // scroll={{ x: 80 * 2 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表三（经费投入）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><span>表内关系:</span><span>1=2+10+11</span><span>2=3+4+5+6</span><span>6=7+8</span><span>8>=9</span></p><p><b>指标解释：</b></p><p>1.法律援助信息化等专项经费：指上级政府或同级政府给予法律援助的专项经费，如：信息化建设专项经费、服务大厅建设专项经费等。</p><p>2.上级下拨经费：除同级财政拨款以外所有上级下拨的业务经费，包括中央补助地方法律援助专款、省级法律援助专项资金、中央、省级政法专项经费中的法律援助资金、中央专项彩票公益金法律援助项目资金，以及各地市下拨给县级的法律援助业务经费。</p></div>}
              />
            }
          </Row>
          <Row className={styles.dataView}>
            {reportForm.download.halfYear.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                // dataSource={}
                columns={columns.yearStatementColumns.emptyListFour}
                rowKey={record => record.name}
                bordered size="small"
                scroll={{ x: 80 * 25 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表四（经费支出）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><span>表内关系:</span><span>1=2+3+4+23</span><span>4=5+16+18+19+20+21+22</span><span>5=6+7+8+9+10=11+12+13+14+15</span><span>16>=17</span></p><p><b>指标解释：</b></p><p>1、业务经费：在支出部分，业务经费包括办案补贴及直接费用、咨询补贴、代书补贴、因受援人败诉支出的鉴定费、宣传费用、培训费用以及其他费用。</p><p>2、办案补贴及直接费用：法律援助机构指派或安排社会律师、基层法律服务工作者、社会组织人员、法律援助志愿者办理案件给予的补贴为"办案补贴"，法律援助机构工作人员办理案件的费用为"直接费用"。</p><p>3、咨询补贴：含在12348专线电话、法律援助接待大厅及工作站的值班人员补贴。</p></div>}
              />
            }
          </Row>

          <Row className={styles.dataView}>
            {reportForm.download.halfYear.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                // dataSource={}
                columns={columns.yearStatementColumns.emptyListTwelve}
                rowKey={record => record.name}
                bordered size="small"
                scroll={{ x: 80 * 29 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表十二（法律援助工作站）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p>本表统计工作站数量，单位：个</p><p><b>表内关系:</b></p><p><span>1=2+4+6+8+10+12+14+16+18+20+22+24+26</span></p><p><span>2>=3</span><span>4>=5</span><span>6>=7</span><span>8>=9</span><span>10>=11</span><span>12>=13</span><span>14>=15</span><span>16>=17</span><span>18>=19</span><span>20>=21</span><span>22>=23</span><span>24>=25</span><span>26>=27</span></p></div>} 
                />
   }
          </Row>
          <Row className={styles.dataView}>
            {reportForm.download.halfYear.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                // dataSource={}
                columns={columns.yearStatementColumns.emptyListThirteen}
                rowKey={record => record.name}
                bordered size="small"
                scroll={{ x: 80 * 11 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表十三（投诉处理情况）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><b>表内关系:</b></p><p><span>1=2+3+4+5=6+7+8 </span><span>11=9+10</span></p></div>} 
                />
   }
          </Row>
        </TabPane>

        <TabPane tab="年报" key="4">
          <Form>
            <Row className={styles.selectRow} gutter={16}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="选择报表时间范围：">
                  {getFieldDecorator('d_smYear', {
                    rules: [{ required: true, message: '请选择报表时间范围' }],
                  })(
                    <Select
                      style={{ width: '80%' }}
                      placeholder="选择报表时间范围"
                    >
                      {f_yearOption}
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem>
                  <Button type="primary" onClick={getYearStatement}>生成报表</Button>
                </FormItem>
              </Col>
              {reportForm.download.year.show &&
                <Col span={3}>
                  <FormItem>
                    <Button type="primary" onClick={downloadYearStatement}>下载报表</Button>
                  </FormItem>
                </Col>
              }
            </Row>
          </Form>
          <Row className={styles.dataView}>
            {reportForm.download.year.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                dataSource={criminalDtoYear}
                columns={columns.yearStatementColumns.panel}
                rowKey={record => record.name}
                bordered size="small"
                scroll={{ x: 80 * 48 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表五（刑事法律援助）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><b>表内关系：</b></p><p><span>列1=12+13+28</span><span>12=2+3+4+5+6=7+8+9+10+11</span><span>18=14+15+16+17</span><span>28=24+25+26+27</span><span>44=40+41+42+43</span><span>29>=1</span></p><p><b>指标解释：</b></p><p>1、申请数、批准数、未批准数、已结案件数、未结案件数一名申请人就某一项申请法律援助的，申请数为“1”，批准数、未批准数、已结案件数、未结案件数类推。两名2以上的当事人申请法律援助，如果请求事项不可分（如交通事故当事人死亡，两个以上的继承人要求赔偿的），则为一个申请，申请数为“1”，批准数、未批准数、已结案件数、未结案件数类推。两名以上的当事人申请法律援助，如果请求事项是可分的，但类型相同（如几名农民工同时请求所在企业支付拖欠的劳动报酬），申请数按照申请人数计算，批准数、未批准数、已结案件数、未结案件数类推。此解释适用所有法律援助案件。</p><p>2、农民：指户籍在农村，以从事农业生产所得收入作为其主要生活来源的人。</p><p>3、农民工：指户籍仍在农村，主要从事非农产业，并已非农产业所得收入作为其主要生活来源的人。</p></div>}
              />
            }
          </Row>
          <Row className={styles.dataView}>
            {reportForm.download.year.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                dataSource={civilDtoYear}
                columns={columns.yearStatementColumns.civil}
                rowKey={record => record.name}
                bordered size="small"
                scroll={{ x: 80 * 49 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表六（民事法律援助）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><b>表内关系：</b></p><p><span>列1=2+19</span><span>1>=2</span><span>2=3+6+7+8+9+11+13+14+15+16+18</span><span>4>=5</span><span>9>=10</span><span>11>=12</span><span>16>=17</span><span>19=20+21+22</span><span>42=32+33+34+35+36+37</span><span>23>=2</span><span>37>=38、39、40、41</span><span>43>=44</span></p><p><b>指标解释：</b></p><p>（非诉讼）调解：是指法律援助人员代理受援人，在第三方主持下，与对方当事人进行协商并达成协议的一种纠纷解决的方式。和解：是指法律援助人员代理受援人，在自愿互谅的基础上与对方当事人进行协商并达成协议，自行解决纠纷的一种方式。</p></div>}
              />
            }
          </Row>
          <Row className={styles.dataView}>
            {reportForm.download.year.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                dataSource={amiDtoYear}
                rowKey={record => record.name}
                columns={columns.yearStatementColumns.administrative}
                bordered size="small"
                scroll={{ x: 80 * 36 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表七（行政法律援助）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><b>表内关系：</b></p><p><span>列1=2+12</span><span>1>=2</span><span>2=3+4+7+9+10+11</span><span>4>=5</span><span>5>=6</span><span>7>=8</span><span>12=13+14+15</span><span>16>=2</span><span>31=25+26+27+28+29</span><span>29>=30</span></p><p><b>表间关系：</b></p><p><span>表七35=表五1+表六2+表七2</span><span>表七36=表五44+表六42+表七31</span><span>表七37=表五45+表六43+表七32</span><span>表七38=表五46+表六45+表七33</span><span>表七39=表五47+表六46+表七34</span><span>表七40=表五29+表六23+表七16</span><span>表七41=表五30+表六24+表七17</span><span>表七42=表五31+表五32+表六25+表七18</span><span>表七43=表五33+表六26+表七19</span><span>表七44=表五34+表六27+表七20</span><span>表七45=表五35+表六28+表七21</span><span>表七46=表五36+表六29+表七22</span><span>表七47=表五37+表六30+表七23</span><span>表七48=表五38+表六31+表七24</span></p></div>}
              />
            }
          </Row>
          <Row className={styles.dataView}>
            {reportForm.download.year.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                dataSource={rpDtoY}
                columns={columns.yearStatementColumns.emptyListEight}
                rowKey={record => record.name}
                bordered size="small"
                scroll={{ x: 80 * 15 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表八（各类案件及受援人合计）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><b>表间关系:</b></p><p><span>表八1=表五1+表六2+表七2</span><span>表八2=表五44+表六33+表七32</span><span>表八3=表五45+表六45+表七33 </span></p><p><span>表八4=表五46+表六47+表七34</span><span>表八5=表五30+表六25+表七17</span><span>表八6=表五31+表六26+表七18</span></p><p><span>表八7=表五33+表六27+表七19</span><span>表八8=表五34+表六28=表七20</span><span>表八9=表五35+表六29+表七21</span></p><p><span> 表八10=表五36+表六30+表七22</span><span>表八11=表五37+表六31+表七23</span><span>表八12=表五38+表六32+表七24</span></p><p><span> 表八13=表五39</span></p></div>} 
                />
            }
          </Row>
          <Row className={styles.dataView}>
            {reportForm.download.year.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                dataSource={rpUserDtoY}
                columns={columns.yearStatementColumns.emptyListNight}
                rowKey={record => record.name}
                bordered size="small"
                scroll={{ x: 80 * 15 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表九（受援人）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><b>表内关系:</b><span>1=2+3+4</span></p><p><b>表间关系:</b><span>表九5>=表八5，表九6>=表八6，表九7>=表八7，表九8>=表八8，表九9>=表八9, 表九10>=表八10，表九11>=表八11，表九12>=表八12，表九13>=表八13</span></p><p><b>指标解释:</b></p><p>1. 各类案件受援人：本年度内实际受援人次。
                //</p><p>2. 受援人分类中受援人身份有交叉的可分别统计。</p><p>3．农民：填报户籍在农村，以从事农业生产所得收入作为其主要生活来源的人。</p><p>4. 农民工：填报户籍仍在农村，主要从事非农产业，并以非农产业所得收入作为其主要生活来源的人。</p><p>5. 妇女：成年女性。</p></div>} 
                />
   }
          </Row>
          <Row className={styles.dataView}>
            {reportForm.download.year.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                dataSource={dealStatusDtoYear}
                rowKey={record => record.name}
                columns={columns.yearStatementColumns.hashslinger}
                bordered size="small"
                scroll={{ x: 80 * 29 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表十（已结案件中各类人员办理情况）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><b>表内关系：</b></p><p><span>列6=1+2+3+4+5</span><span>12=7+8+9+10+11</span><span>17=13+14+15+16</span><span>22=18+19+20+21</span><span>27=23+24+25+26</span></p><p><b>表间关系：</b></p><p><span>表八1+7=表五44</span><span>表八2+3+8+9+13+14+18+19+23+24=表六42</span><span>表八4+5+10+11+15+16+20+21+25+26=表七31</span><span>表八6+12+17+22+27=表七36</span></p></div>}
              />
            }
          </Row>
          <Row className={styles.dataView}>
            {reportForm.download.year.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                dataSource={consultDtoYear}
                rowKey={record => record.name}
                columns={columns.yearStatementColumns.counsel}
                bordered size="small"
                scroll={{ x: 80 * 30 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表十一（咨询）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><b>表内关系：</b></p><p><span>列14=1+10+11+13</span><span>11>=12</span><span>30=15+16+17+18+19+20+21+22+23+24+25+26+27+28+29</span><span>34>=35</span></p><p><b>指标解释：</b></p><p>咨询方式、咨询类型：1人1次咨询两种或两种以上类型事项，视为1人次咨询，2件或以上咨询。</p></div>}
              />
            }
          </Row>
            <Row className={styles.dataView}>
            {reportForm.download.year.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                // dataSource={}
                columns={columns.yearStatementColumns.emptyListOne}
                rowKey={record => record.name}
                bordered size="small"
                scroll={{ x: 80 * 31 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表一（机构）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><b>本表除办公用房建筑面积、宣传、培训情况外，其余各栏单位为“个”</b></p><p><span>表内关系:</span><span>1>=2,3</span><span> 1+4>=18,20</span><span>4>=5</span><span>4=6+7+9</span><span>4>=16+17</span><span>7>=8</span><span>4>=10,11,13,16,17</span><span>13>=14,15</span><span>18>=19</span><span>20>=21</span></p><p><b>指标解释：</b></p><p>1.法律援助管理机构、法律援助机构：法律援助管理机构填报司法行政机关设立的负责监督管理法律援助工作的内设或直属机构，如：法律援助局，法律援助处，法律援助科，包括挂牌在其他处室科的法律援助管理机构。法律援助机构填报各地设立的法律援助中心。一个机构同时挂两个牌子（合署办公）的，法律援助管理机构和法律援助机构都要填报。</p><p>2.同级财政预算是指法律援助业务经费列入本级财政预算项目，即法律援助业务经费在预算中单列科目。</p><p>3.法律援助律师：填报具有律师资格或法律职业资格，取得律师工作证的法律援助机构工作人员。法律援助机构工作人员注册为公职律师的，也视为法律援助律师。</p><p>4.使用法律援助信息管理系统：填报完成全国法律援助信息管理系统本地化部署，并使用信息管理系统上报数据、录入案件、接受群众咨询等事项的单位数。</p><p>5.12348独立机构：指当地12348机构具有单独的编制、人员、经费，独立于法律援助机构。</p><p>6.第16和17项只可填报其中一项。办公设备配置齐全：填报配备有计算机、打印机、复印机、照相机、电话、传真机、信息管理系统、文件档案橱柜、法律法规数据库、交通车辆等设备的机构。基本设备配置齐全：填报配备有计算机、打印机、电话、传真机、文件档案橱柜等设备的机构。</p><p>7.省部级以上表彰：填报省级以上（含省级）人民政府的表彰、司法行政系统及其他系统部级以上的表彰（限本年度，不含以往年度的表彰）。地市县级表彰：填报地市县级人民政府的表彰、司法行政系统以及其他系统地市县级表彰（限本年度，不含以往年度的表彰）。</p><p>8.法律援助民办非企业单位：填报经司法行政机关审核同意，在民政部门登记，利用非国有资产举办的，从事法律援助服务活动的民间社会组织。</p></div>}
              />
            }
          </Row>
          <Row className={styles.dataView}>
            {reportForm.download.year.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                // dataSource={}
                columns={columns.yearStatementColumns.emptyListTwo}
                rowKey={record => record.name}
                bordered size="small"
                scroll={{ x: 80 * 22 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表二（人员）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><span>表内关系:</span><span>1=3+9</span><span>2=4+10</span><span>2>=15</span><span>4>=6</span><span>4>=7+8</span><span>10>=12</span><span>10>=13+14</span><span>15>=16</span></p><p><b>指标解释：</b></p><p>1.实有人数：机构的实际工作人员数，不包含短期、临时（一年内）用工。</p><p>2.法律援助管理机构只挂牌无管理人员的，请在3-8内填写0。</p><p>3.法律专业：填报国家承认学历的专科以上的法律专业毕业生，不包括中专及以下人员。</p><p>4.注册法律援助志愿者：填报在县和县以上法律援助志愿者组织或法律援助机构注册登记的，利用自身所具备的专业知识和能力,自愿为社会和他人提供免费法律服务和帮助的个人。</p><p>5.表一第29项填报有民办非企业单位的，本表第20项必须填报民办非企业单位人数。</p></div>}
              />
            }
          </Row>
          <Row className={styles.dataView}>
            {reportForm.download.year.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                // dataSource={}
                columns={columns.yearStatementColumns.emptyListThree}
                rowKey={record => record.name}
                bordered size="small"
                // scroll={{ x: 80 * 2 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表三（经费投入）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><span>表内关系:</span><span>1=2+10+11</span><span>2=3+4+5+6</span><span>6=7+8</span><span>8>=9</span></p><p><b>指标解释：</b></p><p>1.法律援助信息化等专项经费：指上级政府或同级政府给予法律援助的专项经费，如：信息化建设专项经费、服务大厅建设专项经费等。</p><p>2.上级下拨经费：除同级财政拨款以外所有上级下拨的业务经费，包括中央补助地方法律援助专款、省级法律援助专项资金、中央、省级政法专项经费中的法律援助资金、中央专项彩票公益金法律援助项目资金，以及各地市下拨给县级的法律援助业务经费。</p></div>}
              />
            }
          </Row>
          <Row className={styles.dataView}>
            {reportForm.download.year.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                // dataSource={}
                columns={columns.yearStatementColumns.emptyListFour}
                rowKey={record => record.name}
                bordered size="small"
                scroll={{ x: 80 * 25 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表四（经费支出）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><span>表内关系:</span><span>1=2+3+4+23</span><span>4=5+16+18+19+20+21+22</span><span>5=6+7+8+9+10=11+12+13+14+15</span><span>16>=17</span></p><p><b>指标解释：</b></p><p>1、业务经费：在支出部分，业务经费包括办案补贴及直接费用、咨询补贴、代书补贴、因受援人败诉支出的鉴定费、宣传费用、培训费用以及其他费用。</p><p>2、办案补贴及直接费用：法律援助机构指派或安排社会律师、基层法律服务工作者、社会组织人员、法律援助志愿者办理案件给予的补贴为"办案补贴"，法律援助机构工作人员办理案件的费用为"直接费用"。</p><p>3、咨询补贴：含在12348专线电话、法律援助接待大厅及工作站的值班人员补贴。</p></div>}
              />
            }
          </Row>

          <Row className={styles.dataView}>
            {reportForm.download.year.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                // dataSource={}
                columns={columns.yearStatementColumns.emptyListTwelve}
                rowKey={record => record.name}
                bordered size="small"
                scroll={{ x: 80 * 29 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表十二（法律援助工作站）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p>本表统计工作站数量，单位：个</p><p><b>表内关系:</b></p><p><span>1=2+4+6+8+10+12+14+16+18+20+22+24+26</span></p><p><span>2>=3</span><span>4>=5</span><span>6>=7</span><span>8>=9</span><span>10>=11</span><span>12>=13</span><span>14>=15</span><span>16>=17</span><span>18>=19</span><span>20>=21</span><span>22>=23</span><span>24>=25</span><span>26>=27</span></p></div>} 
                />
   }
          </Row>
          <Row className={styles.dataView}>
            {reportForm.download.year.show &&
              <Table
                pagination={false}
                className={styles.tb21}
                // dataSource={}
                columns={columns.yearStatementColumns.emptyListThirteen}
                rowKey={record => record.name}
                bordered size="small"
                scroll={{ x: 80 * 11 }}
                title={() => <div className={styles.tbTitle}><h2>法律援助统计报表十三（投诉处理情况）</h2></div>}
                //footer={() => <div className={styles.tbFooter}><p><b>表内关系:</b></p><p><span>1=2+3+4+5=6+7+8 </span><span>11=9+10</span></p></div>} 
                />
   }
          </Row>
        </TabPane>
      </Tabs>
    </div >
  )
}

export default connect(({ reportForm }) => ({ reportForm }))(Form.create()(ReportForm))
