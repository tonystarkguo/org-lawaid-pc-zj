import config from './config'
import _ from 'lodash'
import { Tooltip } from 'antd'
const isNull = (v) => { // 判断变量是否空值 undefined, null, '', [], {} 均返回true，否则返回false
  switch (typeof v) {
    case 'undefined':
      return true
    case 'string':
      if (v == null || v == '') {
        return true
      }
      break
    case 'object':
      if (v === null) { return true }
      if (undefined !== v.length && v.length == 0) { return true }

      for (let k in v) {
        return false
      }
      return true
      break
  }
  return false
}

const GetQueryString = (name) => { // 采用正则表达式获取地址栏参数
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2]); return null
}

const getAllConf = () => {
  return localStorage.getItem('allConfig') && JSON.parse(localStorage.getItem('allConfig'))
}

const jsUtil = {
  isNull,
  getAllConf,
  GetQueryString,

    /*
      将数组中的某个字段萃取出来，并且用指定的分隔符链接起来
      @params: arr Array, e.g [{name: 'richard'}, {name: 'andy'}]
      @params: key string, 萃取的字段
      @params: sp string, 分隔符
      @return: string. e.g 'richard,andy'
    */
  getJoinedValFromArr (arr, key, sp) {
    if (isNull(arr)) {
      return arr
    }
    return _.map(arr, key).join(sp)
  },

    /*
      将数组中的某个字段萃取出来，并且用指定的分隔符链接起来
      @params: arr Array, e.g [{name: 'richard'}, {name: 'andy'}]
      @params: val string, 萃取的字段
      @params: sp string, 分隔符
      @return: string. e.g 'richard,andy'
    */
  getObjByValFromArr (arr, key, val) {
    if (isNull(arr)) {
      return arr
    }

    return _.find(arr, (o) => {
      return o[key] == val
    })
  },

  getDictData () {
    const allConf = getAllConf()
    return allConf && allConf.dictData || {}
  },

  getAreaData () {
    const allConf = getAllConf()
    return allConf && allConf.areaData || {}
  },

  getDictDataByKey (code) {
    const allDicData = this.getDictData()
    return allDicData && allDicData[code] || []
  },
  filterFileTypes(l){
    let _this = this
    let r = _this.mapFileList(_this.filterDoneAtt(l))
    return r
  },
  filterDoneAtt(l){
    let _this = this
    return l.filter(item => {return (item.status === 'done' || item.status === 'removed' && !_this.isNull(item.storageId))})
  },
  mapFileList(l){
    let _this = this
    return l.map(item => {
      let o = {}
      o.addUrl = item.url
      o.fileName = item.name
      o.objectKey = item.objectKey
      o.storageId = item.storageId
      o.fileId = item.fileId
      o.isDelete = item.isDelete
      o.dicFileType = _this.getFileExt(item.name)
      o.tempUrl = item.tempUrl
      return o
    })
  },
    /*
      根据code获取字典库 中的值
      @params: dicLib Array, e.g [{name: 'richard'}, {name: 'andy'}]
      @params: code string, 字典编码
      @return: string. e.g 'richard,andy'
    */
  getCities (code) {
    const areaData = this.getAreaData()
    if (isNull(areaData)) {
      return code
    }

    let areaCode = `area_CITY_${code}`

    return areaData[areaCode]
  },

    /*
      根据code获取字典库 中的值
      @params: dicLib Array, e.g [{name: 'richard'}, {name: 'andy'}]
      @params: code string, 字典编码
      @return: string. e.g 'richard,andy'
    */
  getDistricts (code) {
    const areaData = this.getAreaData()
    if (isNull(areaData)) {
      return code
    }
    let districtCode = `area_DISTRICT_${code}`
    return areaData[districtCode]
  },

    /*
      根据全国省份列表
      @return: arrary.
    */
  getProvinceList () {
    const areaData = this.getAreaData()
    if (isNull(areaData)) {
      return []
    }
    let proviceList = areaData.area_PROVINCE_100000 || []
    return proviceList
  },

    /*
      获取省市区级联数据
      @return: [{
          value: 'zhejiang',
          label: 'Zhejiang',
          children: [{
            value: 'hangzhou',
            label: 'Hangzhou',
            children: [{
              value: 'xihu',
              label: 'West Lake',
            }],
          }],
        }, {
          value: 'jiangsu',
          label: 'Jiangsu',
          children: [{
            value: 'nanjing',
            label: 'Nanjing',
            children: [{
              value: 'zhonghuamen',
              label: 'Zhong Hua Men',
            }],
          }],
        }]
    */
  getProCascaderList () {
    const provinceList = this.getProvinceList()
    let cList = []
    if (isNull(provinceList)) {
      return []
    }
    let _this = this
    cList = _.map(provinceList, (item, index) => {
      let code = item.code || ''
      let cObj = { value: code, label: item.name }
      let cities = _this.getCities(code)
      let buildCities = []
      if (!isNull(cities)) {
        for (let i = 0; i < cities.length; i++) {
          let cityO = { value: cities[i].code, label: cities[i].name }
          let districts = _this.getDistricts(cities[i].code)
          let buildDistricts = _.map(districts, (itm, index) => {
            itm.value = itm.code
            itm.label = itm.name
            delete item.code
            delete item.name
            return itm
          })
          cityO.children = buildDistricts
          buildCities.push(cityO)
        }
        cObj.children = buildCities
      }
      return cObj
    })
    return cList
  },

  getCityCascaderList (code) {
    let _this = this
    let cities = _this.getCities(code)
    let buildCities = []
    if (!isNull(cities)) {
      for (let i = 0; i < cities.length; i++) {
        let cityO = { value: cities[i].code, label: cities[i].name }
        let districts = _this.getDistricts(cities[i].code)
        let buildDistricts = _.map(districts, (itm, index) => {
          itm.value = itm.code
          itm.label = itm.name
          delete item.code
          delete item.name
          return itm
        })
        cityO.children = buildDistricts
        buildCities.push(cityO)
      }
      return buildCities
    }
  },

  getFileExt (fileName) {
    if (isNull(fileName)) return fileName
    let ext = fileName.split('.')[1]
      // let result = 0
      // if(ext === 'doc' || ext === 'docx'){
      //   result = 1
      // }else if(ext === 'pdf'){
      //   result = 2
      // }else if(ext === 'txt'){
      //   result = 3
      // }else if(ext === 'jpg' || ext === 'jpeg'){
      //   result = 4
      // }else if(ext === 'png'){
      //   result = 5
      // }
    return ext
  },
  getAllAtts(underTakeData){
    if(isNull(underTakeData.resources)){
      return []
    }
    let allFiles = underTakeData.resources
    let result = {}
    let o = {}
     /*{
          "storageId": 629,
          "isDelete": 0,
          "fileId": 567,
          "tempUrl": "http://bestone-lawaid-zhj.oss-cn-shenzhen.aliyuncs.com/orm/20170828/1503911909396_bg.jpg?Expires=1504422248&OSSAccessKeyId=LTAIU1NhFmuggxrI&Signature=0p8gbG36gWYzt0SqWsMzAv6QsUE%3D",
          "dicFileType": "4",
          "fileName": "口头",
          "objectKey": "orm/20170828/1503911909396_bg.jpg",
          "objectMd5": "43E452A591EBA8E7ED7DBDBBC3918E1A",
          "addUrl": "http://bestone-lawaid.oss-cn-shenzhen.aliyuncs.com/rp/20170619/name_1497852741298.jpg"
        }*/
    if(allFiles.length){
      allFiles.forEach((item, index)=>{
        let fList = item.undertakeResources
        // o.dicCategory = item.dicCategory
        let dir = this.getFileType(item.dicCategory)
        fList = _.map(fList, (item, index) => {
          item.url = item.tempUrl
          // item.addr = item.addUrl
          item.uid = index
          item.name = item.fileName
          item.materialType = dir // item.dicFileType
          item.status = 'done'
          return item
        })
        o[dir] = fList
      })
    }
    return o
  },
  getFileType(t){
    let r
    switch(t){
      case '指派通知书': 
      r = 'zptzsFileList'
      break;
      case '委托协议': 
      r = 'wtxyFileList'
      break;
      case '授权委托书': 
      r = 'sqwtsFileList'
      break;
      case '询问笔录': 
      r = 'xwblFileList'
      break;
      case '证据材料': 
      r = 'dcxqFileList'
      break;
      case '代理词': 
      r = 'dlcFileList'
      break;
      case '辩护词': 
      r = 'dlcFileList'
      break;
      case '庭审笔录': 
      r = 'tsblFileList'
      break;
      case '裁判文书': 
      r = 'cpwsFileList'
      break;
      case '民事起诉状或答辩状、上诉状': 
      r = 'msqszFileList'
      break;
      case '和解协议书': 
      r = 'hjxyFileList'
      break;
      case '人民调解书': 
      r = 'rmtjsFileList'
      break;
      case '申诉书或再审申请书': 
      r = 'shsFileList'
      break;
      case '其他材料': 
      r = 'othersFileList'
      break;
      case '劳动仲裁申请书': 
      r = 'ldzcszsFileList'
      break;
      case '阅卷材料': 
      r = 'yjclFileList'
      break;
      case '会见专用证明': 
      r = 'hjzyzmFileList'
      break;
      case '会见笔录': 
      r = 'hjblFileList'
      break;
      case '刑事辩护（代理）意见书': 
      r = 'xsdlyjsFileList'
      break;
      case '刑事附带民事诉状': 
      r = 'xsfdmsszFileList'
      break; 
      default:
      break;
    }
    return r
  },
  getFileExtVal (fileName) {
    if (isNull(fileName)) return fileName
    let ext = fileName.split('.')[1]
    let result = 0
    if (ext === 'doc' || ext === 'docx') {
      result = 1
    } else if (ext === 'pdf') {
      result = 2
    } else if (ext === 'txt') {
      result = 3
    } else if (ext === 'jpg' || ext === 'jpeg') {
      result = 4
    } else if (ext === 'png') {
      result = 5
    }
    return result
  },
  getFileExt(fileName){
    if(isNull(fileName))return fileName
    let ext = fileName.split('.')[1]
    let result = 0
    if(ext === 'doc' || ext === 'docx'){
      result = 1
    }else if(ext === 'pdf'){
      result = 2
    }else if(ext === 'txt'){
      result = 3
    }else if(ext === 'jpg' || ext === 'jpeg'){
      result = 4
    }else if(ext === 'png'){
      result = 5
    }
    return result
  },
  filterFormData(data, prefix){
    let filteredObj = {}
    let otherObj = {}
    let pureList = []
    for (let key in data) {
      if (key.indexOf(prefix) > -1) {
        filteredObj[key.replace(prefix, '')] = data[key]
        pureList.push(data[key])
      } else{
        otherObj[key] = data[key]
      }
    }
    return { filteredObj, otherObj, pureList }
  },
  getLabelByValue (dics, value, label = 'name', key = 'code') {
    let string = ''
    let array = []
    if (typeof value === 'string' || typeof value === 'number') {
      dics.forEach(dic => {
        if (dic[key] == value) {
          string = dic[label]
          return
        }
        if (dic[key] == value) {
          string = dic[label]
          return
        }
      })
      return string
    }
    dics.forEach(dic => {
      value.forEach(item => {
        if (dic[key] == item.value) {
          array.push(dic[label])
          return
        }
      })
    })
    return array.join('，')
  },
  getValueByLabel (dics, label, labelName = 'name', key = 'code') {
    if (typeof label === 'string') {
      if (label.indexOf(',') > 0) {
        label = label.split(',')
      } else if (label.indexOf('，') > 0) {
        label = label.split('，')
      } else {
        label = [label]
      }
    }
    let result = []
    label.forEach((labelItem, index) => {
      dics.forEach(dicsItem => {
        if (labelItem === dicsItem[labelName]) {
          result[index] = dicsItem[key]
        }
      })
    })
    return result
  },
  createTreeBydics (first, second, third) {
    if (first) {
      let result = _.cloneDeep(first)
      result.forEach((itemF, index) => {
        let currentItem = []
        second.forEach(itemS => {
          if (itemS.code.split('_')[0] === itemF.code) {
            currentItem.push(itemS)
          }
          itemF.children = currentItem
        })
      })
      if (third) {
        result.forEach(itemS => {
          if (itemS.children) {
            itemS.children.forEach(itemChild => {
              let currentItem = []
              third.forEach(itemT => {
                const codeT = itemT.code.substring(0, itemT.code.length - 3)
                if (codeT === itemChild.code) {
                  currentItem.push(itemT)
                }
                itemChild.children = currentItem
              })
            })
          }
        })
      }
      return result
    }
    return []
  },
  filterArrName (objArray) {
    let result = []
    let temp = {}
    for (let i = 0; i < objArray.length; i++) {
      let myname = objArray[i].name
      if (temp[myname]) {
        continue
      }
      temp[myname] = true
      result.push(objArray[i])
    }
    return result
  },
  createCurrentList (list) {
    list.forEach(item => {
      item.label = item.name
      item.value = item.code
      if (item.children && item.children.length > 0) {
        jsUtil.createCurrentList(item.children)
      }
    })
    return list
  },
  isItemInList (item, list) {
    if (list.length === 0) {
      return false
    }
    return list.some(i => {
      return i.dicCategory === item
    })
  },
  getOcadList (data) {
    let result = []
    data.forEach(item => {
      result.push(...item.ocadList)
    })
    return result
  },
  preloadimages (arr, urlKey) {
    let newimages = []
    let loadedimages = 0
    let postaction = function () {}  // 此处增加了一个postaction函数
    arr = (typeof arr !== 'object') ? [arr] : arr
    function imageloadpost () {
      loadedimages++
      if (loadedimages === arr.length) {
        postaction(newimages) // 加载完成用我们调用postaction函数并将newimages数组做为参数传递进去
      }
    }
    for (let i = 0; i < arr.length; i++) {
      newimages[i] = new Image()
      if (urlKey) {
        newimages[i].src = arr[i][urlKey]
      } else {
        newimages[i].src = arr[i]
      }
      newimages[i].onload = function () {
        imageloadpost()
      }
      newimages[i].onerror = function () {
        imageloadpost()
      }
    }
    return { // 此处返回一个空白对象的done方法
      done (f) {
        postaction = f || postaction
      },
    }
  },
  setCaseReason (text) {
    if (text) {
      let textList = []
      if (text.indexOf(',') > -1) {
        textList = text.split(',')
        text = text.replace(',', '，')
      } else if (text.indexOf('，') > -1) {
        textList = text.split('，')
      } else if (text.indexOf('-') > -1) {
        textList = text.split('-')
        text = text.replace('-', '，')
      }
      if (textList.length > 2) {
        return (
            <Tooltip placement="top" title={text} getPopupContainer={() => document.getElementById('scroll-area')}>
              <p>{`${textList[0]}，${textList[1]}...`}</p>
            </Tooltip>
        )
      }
      return text
    }
    return '暂无'
  },
  becomeObjArr (keys, key) {
    if (!keys.length) {
      return []
    }
    let result = []
    for (let i = 0; i < keys.length; i++) {
      let o = {}
      o[key] = keys[i]
      result.push(o)
    }
    return result
  },
  filterArrByArr (arrOrg, arrFilter) {
    if (!arrFilter.length) {
      return arrOrg
    }
    let result = []
    for (let i = 0; i < arrOrg.length; i++) {
      for (let k = 0; k < arrFilter.length; k++) {
        if (arrOrg[i].id == arrFilter[k].id) {
          result.push(arrOrg[i])
        }
      }
    }
    return result
  },
  openwin (url) {
    let a = document.createElement('a') // 创建a对象
    a.setAttribute('href', url)
    a.setAttribute('target', '_blank')
    a.setAttribute('id', 'camnpr')
      // 防止反复添加
    if (!document.getElementById('camnpr')) {
      document.body.appendChild(a)
    }
    a.click() // 执行当前对象
  },
}

module.exports = jsUtil
