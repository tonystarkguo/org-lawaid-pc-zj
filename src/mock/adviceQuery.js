const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')
const { apiPrefix } = config

let adviceQueryData = Mock.mock({
  'data|80-100': [
    {
      'seq|+1': 1,
      id: '@id',
      name: '张三',
      sex: '男',
      org: '所属机构',
      year: '3',
      identity: '党员',
      record: '本科',
      school: '清华大学',
      nation: '汉族',
      type: '一级',
      date: '@datetime',
      job: '律师',
      status: '已答复',
      unit: '光明律师事务所',
      IdCard: '00',
      cardNum: '11',
      lastTime: '@datetime',
      hasSigned: '是',
      caseName: '民事诉讼-一审被告-判决阶段',
      caseStatus: '线上检查',
      phone: /^1[34578]\d{9}$/,
      applyer: '前端',
      address: '@county(true)',
      lawyer: '李四',
      lawyerchannel: '不知道',
      applyDate: '@datetime',
      bookDate:'@datetime',
      caseType:'民事诉讼',
      applyOrg:'天河法援局',
      belongsTo:'天河区',
      caseNo:'1102312313',
      bidScope:'1000 - 3000',
      orgSubmitTime:'@datetime',
      bidEndTime:'@datetime',
      bidNum:121,
      underTakeOrg:'光明律师事务所',
      lawyer:'张三',
      caseEndTime:'@datetime',
      envEndTime:'@datetime',
      lastUpdateTime:'@datetime',
      lawaidType:'劳动纠纷',
      curUndertakeStage:'一审判决',
      archieveTime:'@datetime',
      lastUpdater:'李四',
      source: '在线咨询',
      brief: '民事',
      respondent: '李四',
    }
  ]
})

let adviceQuery = adviceQueryData.data

module.exports = {

	[`GET ${apiPrefix}/getAdviceList`] (req, res) {
	  const { query } = req
	  let { pageSize, page, ...other } = query
	  pageSize = pageSize || 10
	  page = page || 1

	  let newData = adviceQuery
	  for (let key in other) {
	    if ({}.hasOwnProperty.call(other, key)) {
	      newData = newData.filter((item) => {
	        if ({}.hasOwnProperty.call(item, key)) {
	          if (key === 'address') {
	            return other[key].every(iitem => item[key].indexOf(iitem) > -1)
	          } else if (key === 'createTime') {
	            const start = new Date(other[key][0]).getTime()
	            const end = new Date(other[key][1]).getTime()
	            const now = new Date(item[key]).getTime()

	            if (start && end) {
	              return now >= start && now <= end
	            }
	            return true
	          }
	          return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1
	        }
	        return true
	      })
	    }
	  }

	  res.status(200).json({
	    data: newData.slice((page - 1) * pageSize, page * pageSize),
	    total: newData.length,
	  })
	},
}