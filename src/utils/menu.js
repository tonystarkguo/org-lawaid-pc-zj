module.exports = [
  {
    id: 2,
    icon: 'question-circle-o',
    name: '法律咨询'
  },

  {
    id: 21,
    parentId: 2,
    name: '待办网上留言咨询',
    icon: 'login',
    url: '/adviceSort'
  },
  {
    id: 24,
    parentId: 2,
    name: '12348来电咨询',
    icon: 'phone',
    url: '/addAdvice/telephone12348',
  },
  {
    id: 25,
    parentId: 2,
    name: '来电咨询登记',
    icon: 'customer-service',
    url: '/addAdvice/telephone',
  },
  {
    id: 26,
    parentId: 2,
    name: '来访咨询登记',
    icon: 'message',
    url: '/addAdvice/visit'
  },
  {
    id: 27,
    parentId: 2,
    name: '来信咨询登记',
    icon: 'mail',
    url: '/addAdvice/letter',
  },
  {
    id: 29,
    parentId: 2,
    name: '咨询查询',
    icon: 'solution',
    url: '/adviceQuery'
  },
  {
    id: 3,
    icon: 'laptop',
    name: '案件审批'
  },
  {
    id: 31,
    parentId: 3,
    name: '窗口受理登记',
    icon: 'plus-square-o',
    url: '/createLawcase',
  },
  {
    id: 32,
    parentId: 3,
    name: '网上申请待预审',
    icon: 'check',
    url: '/lawcases?type=1'
  },
  {
    id: 34,
    parentId: 3,
    name: '待初审案件',
    icon: 'copy',
    url: '/lawcases?type=3'
  },
  {
    id: 35,
    parentId: 3,
    name: '待审查案件',
    icon: 'credit-card',
    url: '/lawcases?type=4'
  },
  {
    id: 36,
    parentId: 3,
    name: '待审批案件',
    icon: 'file',
    url: '/lawcases?type=5'
  },
  {
    id: 37,
    parentId: 3,
    name: '待指派案件',
    icon: 'folder',
    url: '/lawcases?type=6'
  },

  {
    id: 38,
    parentId: 3,
    name: '常用文书模板',
    icon: 'file-ppt',
    url: '/docLib',
  },

  {
    id: 4,
    name: '案件承办监控',
    icon: 'rocket',
    url: '/monitor?type=15',
  },
  {
    id: 5,
    name: '案件补贴发放',
    icon: 'pay-circle',
    url: '/granSubsidies',
  },

  {
    id: 6,
    name: '案件归档',
    icon: 'file',
    url: '/lawcases?type=7'
  },

  {
    id: 7,
    name: '案件查询',
    icon: 'scan',
    url: '/lawcases?type=10'
  },

  {
    id: 8,
    name: '案件质量评估',
    icon: 'api',
  },
  
  {
    id: 81,
    parentId: 8,
    name: '指派评估案件',
    icon: 'swap-right',
    url: '/assignEvaCases',
  },

  {
    id: 82,
    parentId: 8,
    name: '查询评估案件',
    icon: 'rollback',
    url: '/searchEvaCases',
  },

  {
    id: 83,
    parentId: 8,
    name: '设置评估标准',
    icon: 'up-square-o',
    url: '/setEvaStandard',
  },

  {
    id: 84,
    parentId: 8,
    name: '评估专家库',
    icon: 'team',
    url: '/expLib',
  },

  {
    id: 9,
    name: '数据中心',
    icon: 'line-chart',
  },

  {
    id: 91,
    parentId: 9,
    name: '定期报表',
    icon: 'area-chart',
    url: '/reportForm',
  },

  {
    id: 93,
    parentId: 9,
    name: '统计日报',
    icon: 'pie-chart',
    url: '/daily',
  },

  {
    id: 94,
    parentId: 9,
    name: '数据分析',
    icon: 'bar-chart',
    url: '/analysis',
  },

  {
    id: 11,
    name: '机构人员管理',
    icon: 'hdd'
  },

  {
    id: 71,
    parentId: 11,
    name: '机构管理',
    icon: 'layout',
    url: '/orgManagement'
  },

  {
    id: 72,
    parentId: 11,
    name: '工作人员管理',
    icon: 'team',
    url: '/orgPersonManagement'
  },

  {
    id: 73,
    parentId: 11,
    name: '法律援助人员管理',
    icon: 'usergroup-add',
    url: '/aidPersonManagement'
  },

  {
    id: 74,
    parentId: 11,
    name: '法律援助人员工作单位管理',
    icon: 'bars',
    url: '/workUnitManagement'
  },
]