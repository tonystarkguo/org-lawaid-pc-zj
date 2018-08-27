import config from './config'
import lodash from 'lodash'


const caseStatusConverter = {

  /*
    根据案件状态返回案件属于哪一个阶段
    阶段分为：申请，审批，指派，承办，评价，归档
    @params: caseStatus-string
    @return: currentNodeNum
  */
  getStageByStatus(caseStatus, comefrom){
    if(!caseStatus){
      return caseStatus
    }

    let currentNodeNum = 1
    if(caseStatus === '1' || caseStatus === '2' || caseStatus === '4'){
      //待预审，预审需补充材料，预审不通过
      currentNodeNum = 1
    }else if(caseStatus === '3'){
      currentNodeNum = 2 //待初审
    }else if(caseStatus === '8' || caseStatus === '9'){
      currentNodeNum = 3 //待审查，初审不通过
    }else if(caseStatus === '10' || caseStatus === '11' || caseStatus === '13'){
      currentNodeNum = 4 //待审批，审查不通过，审批不通过
    }else if(caseStatus === '12'){
      currentNodeNum = 5 //待指派
    }else if(caseStatus === '14' || caseStatus === '15' ){
      currentNodeNum = 6 //承办中
    }else if(caseStatus === '16' || caseStatus === '17' ){
      currentNodeNum = 7 //结案审核
    }else if(caseStatus === '0' || caseStatus === '18' || caseStatus === '19'){
      currentNodeNum = 8 //待归档（卷宗归档，包含终止法援的案件。）
    }else if(caseStatus === '20'){
      currentNodeNum = 10 //归档完成（办结）不要点亮
    }
    
    if(comefrom === 'offline'){
      currentNodeNum = currentNodeNum - 1
    }
    return currentNodeNum
  },

  /*
    根据左侧菜单的路由获取请求案件列表的状态
    @params: listType
    @return: reqCaseStatus
  */

  getReqStatusByMenu(listType){
    let reqCaseStatus = ''
    switch (listType){
      case '0':// 首页进入的待办列表
      let userObj = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || {}
      let isCenterPerson = userObj.isCenterPerson
      if(userObj.roles[0].id == '36'){
        reqCaseStatus = '3'
      }else{
        reqCaseStatus = '1,3,8,9,10,11,12'
      }
      break;
      case '1'://预审
      reqCaseStatus = '1'
      break;
      case '2'://申请待受理：包含待受理补充材料，预审待补充材料，预审通过，预审不通过，初审待补充材料
      // reqCaseStatus = '2,3,4,5,7' 
      reqCaseStatus = '2,3,5,7'//吕程修改7月30
      break;
      case '3'://申请待初审
      reqCaseStatus = '3'//9.1状态3修改成了待受理
      break;
      case '4'://申请待审查
      reqCaseStatus = '8,9'
      break;
      case '5'://申请待审批：审查通过，审查不通过
      reqCaseStatus = '10,11'
      break;
      case '6'://待指派法律援助人员
      reqCaseStatus = '12'
      break;
      case '7'://待归档
      reqCaseStatus = '19'
      break;
      case '11'://承办监控
      reqCaseStatus = '15'
      break;
      case '10'://援助事项查询, 包含所有的案件
      reqCaseStatus = '0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20'
      break;
      default:
      reqCaseStatus = '1'
    }
    return reqCaseStatus
  },

  /*
    根据案件状态返回showType,用于案件详情中根据状态展示不同的信息
    @params: caseStatus-string
    @return: showType
  */
  getShowTypeByStatus(caseStatus){
    if(!caseStatus){
      return caseStatus
    }

    let showType = ''

    if(caseStatus === '1' || caseStatus === '2' ){
      //申请阶段：显示通用的最新日志
      showType = 1
    }else if(caseStatus === '3' || caseStatus === '5' || caseStatus === '6' || caseStatus === '8' || caseStatus === '12' || caseStatus === '14'){
      //初审，复审， 不予援助, 发起竞价（待办），推荐法律援助人员（待办）：显示案件信息
      showType = 2
    }else if(caseStatus === '4' || caseStatus === '7' || caseStatus === '20' || caseStatus === '23'){
      //初审复审阶段-需补充材料，归档中法律援助人员待补充材料：显示案件信息+需补充材料信息
      showType = 3
    }else if(caseStatus === '9'){
      //待指派，待机构端发起竞价金额，待受援人指定：显示案件信息 + 援助类型
      showType = 4
    }else if(caseStatus === '10'){
      //待受援人指定：显示案件信息+援助类型+律师列表
      showType = 12
    }else if(caseStatus === '11'){
      //待法律援助人员确定：显示案件信息+援助类型+律师列表
      showType = 5
    }else if(caseStatus === '13'){
      //竞价中：案件信息+援助类型+竞价事项
      showType = 6
    }else if(caseStatus === '15'){
      //待机构确定法律援助人员：案件信息+援助类型 + 已推荐法律援助人员
      showType = 7
    }else if(caseStatus === '17'){
      //事项监督（承办阶段）：显示案件信息+法律援助人员信息+援助类型
      showType = 8
    }else if(caseStatus === '18'){
      //评价中，评价管理：案件信息+法律援助人员信息+评价情况
      showType = 9
    }else if(caseStatus === '22' || caseStatus === '24'){
      //待归档完成：案件信息+法律援助人员信息+结算金额信息
      showType = 10
    }else if(caseStatus === '16' || caseStatus === '21' || caseStatus === '19'){
      //待签订委托协议，待受援人指定，待填写结算金额， 发起归档（待办）：显示案件信息 + 法律援助人员信息
      showType = 11
    }

    return showType
  }
}

module.exports = caseStatusConverter
