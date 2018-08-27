import menu from '../utils/menu.js'
import OptTree from './roleTree.js'
const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')
const { apiPrefix } = config

let usersListData = Mock.mock({
  'data|80-100': [
    {
      id: '@id',
      caseName: '民事诉讼-一审被告-判决阶段',
      caseStatus: '线上检查',
      phone: /^1[34578]\d{9}$/,
      applyer: '张三',
      address: '@county(true)',
      lawyer: '李四',
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
      hasSigned: false,
      'seq|+1': 1
      // avatar () {
      //   return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
      // },
    }
  ]
})

let ordermanageData = Mock.mock({
  'data|80-100': [
    {
      id: '@id',
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
      hasSigned: false,
      'seq|+1': 1
      // avatar () {
      //   return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
      // },
    }
  ]
})

let recipientInfoData = Mock.mock({
  'data|80-100': [
    {
      id: '@id',
      name: '张三',
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
      'seq|+1': 1
      // avatar () {
      //   return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
      // },
    }
  ]
})

let aidInfoData = Mock.mock({
  'data|80-100': [
    {
      id: '@id',
      name: '张三',
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
      'seq|+1': 1
      // avatar () {
      //   return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
      // },
    }
  ]
})

let operationTeamInfoData = Mock.mock({
  'data|80-100': [
    {
      id: '@id',
      name: '张三',
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
      'seq|+1': 1
      // avatar () {
      //   return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
      // },
    }
  ]
})

let dictionaryData = Mock.mock({
  'data|80-100': [
    {
      'value|101-200': 101,
      labelName: '数据正常',
      type: 'data_isDelete',
      remark: '数据是否删除',
      'seq|+1': 1,
      'id|1-100': 1 
    }
  ]
})

let database = usersListData.data
let ordermanage = ordermanageData.data
let recipientInfo = recipientInfoData.data
let aidInfo = aidInfoData.data
let operationTeamInfo = operationTeamInfoData.data
let dictionary = dictionaryData.data

const userPermission = {
  DEFAULT: [
    'dashboard', 'chart',
  ],
  ADMIN: [
    'dashboard', 'users', 'UIElement', 'UIElementIconfont', 'chart',
  ],
  DEVELOPER: ['dashboard', 'users', 'UIElement', 'UIElementIconfont', 'chart'],
}

const adminUsers = [
  {
    id: 0,
    username: 'admin',
    password: 'admin',
    permissions: userPermission.ADMIN,
  }, {
    id: 1,
    username: 'guest',
    password: 'guest',
    permissions: userPermission.DEFAULT,
  }, {
    id: 2,
    username: '吴彦祖',
    password: '123456',
    permissions: userPermission.DEVELOPER,
  },
]

const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  let data

  for (let item of array) {
    if (item[keyAlias] === key) {
      data = item
      break
    }
  }

  if (data) {
    return data
  }
  return null
}

const NOTFOUND = {
  message: 'Not Found',
  documentation_url: 'http://localhost:8000/request',
}

module.exports = {

  [`POST ${apiPrefix}/user/login`] (req, res) {
    const { username, password } = req.body
    const user = adminUsers.filter((item) => item.username === username)

    if (user.length > 0 && user[0].password === password) {
      const now = new Date()
      now.setDate(now.getDate() + 1)
      res.cookie('token', JSON.stringify({ id: user[0].id, deadline: now.getTime() }), {
        maxAge: 900000,
        httpOnly: true,
      })
      res.json({ success: true, message: 'Ok' })
    } else {
      res.status(400).end()
    }
  },

  [`POST ${apiPrefix}/newResv`] (req, res) {
    // console.log(req.body)
    res.status(200).end()
  },

  [`POST ${apiPrefix}/updateReasonUrl`] (req, res) {
    // console.log(req.body)
    res.status(200).end()
  },

  [`POST ${apiPrefix}/saveFinInfoUrl`] (req, res) {
    // console.log(req.body)
    res.status(200).end()
  },

  [`GET ${apiPrefix}/user/logout`] (req, res) {
    res.clearCookie('token')
    res.status(200).end()
  },

  [`GET ${apiPrefix}/user`] (req, res) {
    const cookie = req.headers.cookie || ''
    const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' })
    const response = {}
    const user = {}
    if (!cookies.token) {
      res.status(200).send({ message: 'Not Login' })
      return
    }
    const token = JSON.parse(cookies.token)
    if (token) {
      response.success = token.deadline > new Date().getTime()
    }
    if (response.success) {
      const userItem = adminUsers.filter(_ => _.id === token.id)
      if (userItem.length > 0) {
        user.permissions = userItem[0].permissions
        user.username = userItem[0].username
        user.id = userItem[0].id
      }
    }
    response.user = user
    res.json(response)
  },

  [`GET ${apiPrefix}/users`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = database
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

  [`GET ${apiPrefix}/getOrdList`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = ordermanage
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

  [`GET ${apiPrefix}/recipientInfoList`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = recipientInfo
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
    
  [`GET ${apiPrefix}/aidInfoList`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = aidInfo
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

  [`GET ${apiPrefix}/operationList`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = operationTeamInfo
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

  [`GET ${apiPrefix}/getMenu`] (req, res) {
    const { query } = req
    res.status(200).json({
      data: menu,
      success: true,
      code: '1'
    })
  },

  [`POST ${apiPrefix}/user`] (req, res) {
    const newData = req.body
    newData.createTime = Mock.mock('@now')
    newData.avatar = newData.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newData.nickName.substr(0, 1))
    newData.id = Mock.mock('@id')

    database.unshift(newData)

    res.status(200).end()
  },

  [`GET ${apiPrefix}/user/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      res.status(200).json(data)
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`DELETE ${apiPrefix}/user/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      database = database.filter((item) => item.id !== id)
      res.status(204).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`PATCH ${apiPrefix}/user/:id`] (req, res) {
    const { id } = req.params
    const editItem = req.body
    let isExist = false

    database = database.map((item) => {
      if (item.id === id) {
        isExist = true
        return Object.assign({}, item, editItem)
      }
      return item
    })

    if (isExist) {
      res.status(201).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`POST ${apiPrefix}/user/:id`] (req, res) {
    const { id } = req.params
    const editItem = req.body
    let isExist = false

    database = database.map((item) => {
      if (item.id === id) {
        isExist = true
        return Object.assign({}, item, editItem)
      }
      return item
    })

    if (isExist) {
      res.status(201).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`GET ${apiPrefix}/system/dictionaryMock`] (req, res) {
    const { query } = req
    res.status(200).json({
      data: dictionary,
      success: true
    })
  },
  [`GET ${apiPrefix}/appTest/contentMock`] (req, res) {
    res.status(200).json({
      data: '曾在北京城建集团有限责任公司担任项目经理的王民岗，利用职务上的便利，先后多次采取与他人签订虚假协议、虚报工程造价等手段，贪污公款260余万元。昨天，记者从北京市一中院获悉，被告人王民岗犯贪污罪，被判有期徒刑15年。',
      success: true
    })
  },


  [`GET ${apiPrefix}/sys/RoleList`] (req, res) {
    res.status(200).json({
      "code": "1",
      "message": "成功",
      "data": {
        "pageNum": 1,
        "pageSize": 20,
        "size": 2,
        "orderBy": null,
        "startRow": 1,
        "endRow": 2,
        "total": 2,
        "pages": 1,
        "list": [
          {
            "id": 1,
            "name": "工作人员",
            "remark": "",
            "creatorGlobalId": "0",
            "createTime": 1496752020000,
            "modifierGlobalId": "0",
            "modifyTime": 1496752024000,
            "isDeleted": false,
            "oId": null,
            "isAdmin": null
          },
          {
            "id": 3,
            "name": "管理员",
            "remark": "",
            "creatorGlobalId": "0",
            "createTime": 1496815106000,
            "modifierGlobalId": "0",
            "modifyTime": 1496815109000,
            "isDeleted": false,
            "oId": null,
            "isAdmin": null
          }
        ],
        "firstPage": 1,
        "prePage": 0,
        "nextPage": 0,
        "lastPage": 1,
        "isFirstPage": true,
        "isLastPage": true,
        "hasPreviousPage": false,
        "hasNextPage": false,
        "navigatePages": 8,
        "navigatepageNums": [
          1
        ]
      }
    })
  },

  [`GET ${apiPrefix}/sys/OptTree`] (req, res) {
    res.status(200).json(OptTree)
  },
}
