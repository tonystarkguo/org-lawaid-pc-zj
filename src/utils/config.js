let baseURL = process.env.NODE_ENV === 'development' ? '' : ''
module.exports = {
  name: '浙江省法律援助统一服务平台',
  prefix: 'antdAdmin',
  footerText: '主办单位：浙江省司法厅 | 中文域名：浙江省法律援助统一服务平台 | 技术支持：上海百事通信息技术股份有限公司',
  logo: '/logo_fy.png',
  bg: 'background.jpg',
  head: '/head.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  qun: '/qun.png',
  hpPcUrl: 'http://120.78.71.239:8002', // 开发环境援助人端地址
// hpPcUrl: 'http://118.178.118.223:8002', // 产品环境援助人端地址
  baseURL, // 'http://localhost:8000',
// hpPcUrl: 'http://localhost:3000',
  YQL: ['https://fy.fabaogd.com/opm-api'],
  CORS: ['https://fy.fabaogd.com/opm-api'],
  openPages: ['/login'],
  // apiPrefix: '/api/v1',
  apiPrefix: '',
  api: {
    baseURL,
    publicBuketUrl: 'http://public-content-zj.oss-cn-hangzhou.aliyuncs.com', // 生产环境
    // publicBuketUrl: 'http://public-content-zhj.oss-cn-shenzhen.aliyuncs.com',//开发环境
    deleteCase: '/orm/zhejiang/case/pending/deleteCase', // 删除案件
    exportHpApplyHtml: '/orm/zhejiang/material/exportHpApplyHtml', // 打印申请表
    getTodoDaily: '/orm/zhejiang/report/getTodoDaily', // 获取代办统计日报
    dowloadTodoDaily: '/orm/zhejiang/report/dowloadTodoDaily', // 下载代办统计日报
    updateCaseHandlingResult: '/orm/zhejiang/case/detail/saveCase', // 保存案件办理结果

    AssistanceUndertakeList: '/orm/zhejiang/caseUndertake/AssistanceUndertakeList', // 获取案件援助人信息
    appraiseInfoUrl: '/orm/zhejiang/appraise/info', // 获取满意度
    getJudgeOpinionUrl: '/orm/judge/opinion/get', // 获取法官意见
    endAidUrl: '/orm/zhejiang/case/pending/endAid', // 终止法援
    getRemarkListUrl: '/orm/zhejiang/case/remark/getRemarkList', // 获取受援人回访/庭审旁听
    commitRemarkUrl: '/orm/zhejiang/case/remark/commitRemark', // 提交受援人回访/庭审旁听
    getCaseSettleUrl: '/orm/zhejiang/case/settle/get', // 获取案件补贴
    openCaseSettleUrl: '/orm/zhejiang/case/settle/add', // 案件补贴发放
    editCaseSettleUrl: 'orm/zhejiang/case/settle/update',  //编辑补贴发放
    exportSubsidyRelease: '/orm/zhejiang/material/exportDoc/exportSubsidyRelease', // 导出补贴发放表
    getCaseHandlingResult: '/orm/zhejiang/case/detail/getUndertakeCaseResult', // 获取案件办理结果

    queryExpertList: '/orm/zhejiang/expert/queryExpertList', // 获取评估专家列表
    queryExpertListBelongMyOrgForAssigned: '/orm/zhejiang/expert/queryExpertListBelongMyOrgForAssigned', // 获取评估专家列表
    ExpertList: '/orm/zhejiang/expert/queryLawyerListNotBelongMyOrg', // 添加评估专家
    modifyExpertInfo: '/orm/zhejiang/expert/modifyExpertInfo', // 修改评估专家
    addExpertsToMyOrg: '/orm/zhejiang/expert/addExpertsToMyOrg', // 新增评估专家
    operationExpert: '/orm/zhejiang/expert/removeOrRestoreExpertInMyOrg', // 删除/恢复评估专家
    
    customDataOne: '/orm/zhejiang/statement/customDataOne',  //自定义数据饼图分析
    getAllCityByCustom: '/orm/zhejiang/org/getAllCityByCustom', // 自定义分析获取的区域
    getAllConfig: '/orm/zhejiang/config/getAllConfig/', // 获取所有配置数据
    getAllrole: '/orm/zhejiang/sysManagement/role/queryAllrole', // 获取所有角色
    getCaseNotBidCaseByArea: '/orm/zhejiang/case/pending/getCaseNotBidCaseByArea', //获取案件列表（无竞价和承办信息）带区域 
    userLogin: '/orm/zhejiang/login', // 登陆
    userLogout: '/orm/zhejiang/login/exit', // 退出
    captchaValue: '/orm/zhejiang/login/captchaValue', // 获取登录手机号验证码接口
    captchaHp: '/hp/zhejiang/pc/login/captcha', // 获取登录手机号验证码接口（Hp端）
    updatePwdUrl: '/orm/zhejiang/user/updatePassword', // 修改密码
    updateHeadPicUrl: '/orm/zhejiang/user/updateHeadPic', // 修改头像

    getOrgPersonList: '/orm/zhejiang/user/list', // 获取机构人员列表
    getOrgPersonInfo: '/orm/zhejiang/user/info', // 获取机构人员信息
    updateOrgPersonInfo: '/orm/zhejiang/user/updateInfo', // 修改机构人员信息
    addOrgPerson: '/orm/zhejiang/user/add', // 新增机构人员
    deleteOrgPerson: '/orm/zhejiang/user/delete', // 删除机构人员
    isSms: '/orm/zhejiang/user/sms', // 是否取消接收短信
    getLawfirm: '/orm/zhejiang/hpUserLawfirm/getLawfirm', // 获取法律援助人员工作单位
    addLawfirm: '/orm/zhejiang/hpUserLawfirm/addLawfirm', // 新增法律援助人员工作单位
    updateLawfirm: '/orm/zhejiang/hpUserLawfirm/updateLawfirm', // 修改法律援助人员工作单位

    additionalConsult: '/orm/zhejiang/consult/additionalConsult', // 追加答复
    getConsultNumberUrl: '/orm/zhejiang/consult/getConsultNumber', // 获取咨询编号
    getConsultListUrl: '/orm/zhejiang/consult/consultList', // 获取咨询列表
    getAllCity: '/orm/zhejiang/org/getAllCity', //获取浙江省的市区信息
    saveOrCommitConsultUrl: '/orm/zhejiang/consult/saveOrCommitConsult', // 保存或提交咨询
    getConsultByIdUrl: '/orm/zhejiang/consult/getConsultById', // 获取咨询详情
    signForConsultUrl: '/orm/zhejiang/consult/signForConsult', // 咨询签收
    chargebackUrl: '/orm/zhejiang/consult/chargeback', // 咨询退单
    getAnswersUrl: 'orm/zhejiang/consult/getAnswers', // 获取解答人列表
    getConsultHistory: '/orm/zhejiang/consult/getMyHistoryConsults', // 获取同一申请人历史信息
    getSysAreas: 'orm/zhejiang/consult/getSysAreas',  //获取系统区域信息

    getOrgList: '/orm/zhejiang/org/list', // 获取机构列表
    addOrg: '/orm/zhejiang/org/add', // 新增机构
    deleteOrg: '/orm/zhejiang/org/delete', // 删除机构
    updateOrg: '/orm/zhejiang/org/update', // 编辑机构

    aidPersonManagementList: '/orm/zhejiang/hp/queryLawyerListBelongMyOrg', // 获取属于我的机构的律师列表
    layerList: '/orm/zhejiang/hp/queryLawyerListNotBelongMyOrg', // 获取不属于我的机构的律师列表
    addLayer: '/orm/zhejiang/hp/addLawyersToMyOrg', // 新增律师到我的机构下
    addNewLayer: '/orm/zhejiang/hp/addNewLawyersOrg', // 新增全新律师
    updateNewLayer: '/orm/zhejiang/hp/modifyHpUserInfo', // 修改律师信息
    operationLayer: '/orm/zhejiang/hp/removeOrRestoreHpUserInMyOrg', // 删除/恢复 我的机构下的法律援助人员

    getDocsUrl: '/orm/zhejiang/material/getMaterialDocs', // 获取文书材料
    getEmptyDocsUrl: '/orm/zhejiang/material/getMaterialModelDocs', // 获取空白文书模板
    createDocsUrl: '/orm/zhejiang/material/exportDoc', // 生成文书
    downloadDocsUrl: '/orm/zhejiang/material/exportBlankDoc', // 下载文书
    getSysAreas: '/orm/zhejiang/consult/getSysAreas', //获取系统区域信息
    updateReasonUrl: '/updateReasonUrl',
    saveFinInfoUrl: '/saveFinInfoUrl',
    operationList: '/orm/zhejiang/sysManagement/user/opmUserList', // 运营人员列表
    operationCreate: '/orm/zhejiang/sysManagement/user/createUser', // 新建运营人员
    operationUpdate: '/orm/zhejiang/sysManagement/user/modifyUser', // 修改运营人员
    operationDelete: '/orm/zhejiang/sysManagement/user/deleteUser', // 删除运营人员
    aidInfoList: '/orm/zhejiang/sysManagement/user/hp_list', // 法律援助人员信息列表
    recipientInfoList: '/orm/zhejiang/sysManagement/user/rp_list',
    getOrdList: '/orm/zhejiang/resv_list', // 预约管理
    newResv: '/orm/zhejiang/resv', // 新增预约
    orgList: '/orm/zhejiang/list', // 获取机构列表
    getCaseMaterialFile: '/orm/zhejiang/case/archive/activeArchive', // 发起归档-获取材料
    caseCheckSubmit: '/orm/zhejiang/case/archive/appendMaterial', // 发起归档-提交材料
    getSuppMaterial: '/orm/zhejiang/check/getMaterialArchive', // 预审-获取材料
    suppMaterialSubmit: '/orm/zhejiang/check/submitPre', // 预审-选择需补充材料
    needSuupAcc: '/orm/zhejiang/check/needSuupAcc', // 受理-选择需补充材料
    needSuupTheTrial: '/orm/zhejiang/check/needSuupTheTrial', // 初审-选择需补充材料
    // toNextStepSubmit: '/orm/zhejiang/check/submitPre', // 预审，进入下一环节
    toNextStepSubmitAcc: '/orm/zhejiang/check/submitAcc', // 受理，进入下一环节
    submitTheTrial: '/orm/zhejiang/check/submitTheTrial', // 初审，进入下一环节
    censorSubmit: '/orm/zhejiang/caseFlow/censorSubmit', // 审查，进入下一环节
    reauditSubmit: '/orm/zhejiang/caseFlow/reauditSubmit', // 审批，进入下一环节
    // confirmAppoint: '/orm/zhejiang/caseAppoint/appointHp', // 指派法律援助人员，进入下一环节
    confirmAppoint: '/orm/zhejiang/caseAppoint/appointHp', // 指派法律援助人员，进入下一环节
    queryLawyerListBelongMyOrgForAssigned: '/orm/zhejiang/hp/queryLawyerListBelongMyOrgForAssigned', // 获取律师管理。
    fuzzyQueryLawfirmByName: '/orm/zhejiang/hpUserLawfirm/fuzzyQueryLawfirmByName', // 律所模糊查询

    toNextSubmit: '/orm/zhejiang/case/archive/submit', // 发布归档，进入下一环节
    publishPrice: '/orm/zhejiang/bid/publish_price', // 发布竞价
    publishCount: '/orm/zhejiang/bid/count', // 根据竞价条件，查询符合条件总人数
    recommendAider: '/orm/zhejiang/bid/recommend', // 推荐法律援助人员
    submitAppraise: '/orm/zhejiang/appraise/appraise', // 提交评价

    getGoodAtDomains: '/orm/zhejiang/sysManagement/tag/getGoodAtDomains', // 查看所有擅长领域
    getRemarkList: '/orm/zhejiang/check/remark', // 获取备注列表
    // userLogin: '/orm/zhejiang/user/login',
    // userLogout: '/orm/zhejiang/user/exit',
    userInfo: '/userInfo',
    users: '/users',
    user: '/user/:id',
    lawcases: '/users',
    getCasesListUrl: '/users',
    lawcasesUrl: '/orm/zhejiang/case/pending/caseList',
    lawcase: '/user/:id',
    dashboard: '/dashboard',
    getMenuUrl: '/orm/zhejiang/user/get_menu',
    // getMenuUrl: '/getMenu', // 获取左侧菜单
    queryApplyerInfo: '/user/:id',
    queryApplyerFinancialInfo: '/user/:id',
    queryCaseBaseInfo: '/user/:id',
    queryCaseMeterialInfo: '/user/:id',
    queryCaseActLogInfo: '/user/:id',
    saveFinInfo: '/user/:id',
    saveCaseBaseInfo: '/user/:id',
    saveMeteriaInfo: '/user/:id',
    publishBidUrl: '/user/:id',
    recBidersUrl: '/user/:id',
    signCaseUrl: '/orm/zhejiang/pend/sign', // 签收，分派案件
    chargeBackCaseUrl: '/orm/zhejiang/pend/charge_back', // 退单
    getOpmUsersUrl: '/orm/zhejiang/pend/user_list', // 获取运营人员
    getSignCase: '/orm/zhejiang/pend/sign_case', // 获取运营人员手上的案件信息
    getAllProvince: '/orm/zhejiang/area/getAllProvince', // 获取所有省份
    getCityByProvinceIds: '/orm/zhejiang/area/getCityByProvinceIds', // 获取城市
    getDistrictByCityIds: '/orm/zhejiang/area/getDistrictByCityIds', // 获取区

    getCaseHasBid: '/orm/zhejiang/case/pending/getCaseHasBid', // 获取含有竞价信息的案件列表
    getCaseHasBidUndertake: '/orm/zhejiang/case/pending/getCaseHasBidUndertake', // 获取含有竞价与承办信息的案件列表
    getCaseHasUndertake: '/orm/zhejiang/case/pending/getCaseHasUndertake', // 获取含有承办信息的案件列表
    getCaseNotBidUndertake: '/orm/zhejiang/case/pending/getCaseNotBidUndertake', // 获取案件列表(无竞价与承办相关信息)
    getResvData: '/orm/zhejiang/resv', // 根据机构和日期(月份)查询机构预约状态接口
    getDayResvData: '/orm/zhejiang/resv_day', // 根据机构和日期(date)查询机构预约状态接口

    getCaseDetailUrl: '/orm/zhejiang/case/detail/getDetail', // 事项信息详情
    commitCase: '/orm/zhejiang/case/detail/commitCase', // 提交结案
    updataCaseBaseDataUrl: '/orm/zhejiang/case/detail/updateDetail', // 编辑事项信息详情
    getCaseReason: '/orm/zhejiang/case/detail/getCaseReason', // 案由节点树
    getApplyerDetailUrl: '/orm/zhejiang/rpUser/info', // 申请主体基本信息
    saveApplyerInfoUrl: '/orm/zhejiang/rpUser/editApplyInfo', // 编辑主体基本信息
    updataApplyerDetailUrl: '/orm/zhejiang/check/user', // 编辑主体基本信息
    getCaseFinacialDataUrl: '/orm/zhejiang/check/income', // 申请经济情况
    updataCaseFinacialDataUrl: '/orm/zhejiang/check/income', // 编辑经济情况
    aidedPersonInfo: '/orm/zhejiang/check/hp_info', // 法律援助人员信息
    getcaseOperLogUrl: '/orm/zhejiang/case/detail/getCaseStepLog', // 日志详情

    addDictionary: '/orm/zhejiang/sysManagement/dict/createDict', // 新增字典
    updataDictionary: '/orm/zhejiang/sysManagement/dict/modifyDict', // 编辑字典
    deleteDictionary: '/orm/zhejiang/sysManagement/dict/deleteDictByIds', // 删除字典
    getDictionaryList: '/orm/zhejiang/sysManagement/dict/getDictPage', // 字典分页

    checkRemark: '/orm/zhejiang/check/remark', // 备注
    getBidInfo: '/orm/zhejiang/bid/publish_price', // 获取竞价发布信息

    getRoleList: '/orm/zhejiang/sys/role/roleList', // 角色列表
    getOptById: '/orm/zhejiang/sys/permission/getPermissionsByRoleId', // 获取ID权限
    getOptTree: '/orm/zhejiang/sys/permission/allPermissions', // 权限列表
    addRole: '/orm/zhejiang/sys/role/addRole', // 新增角色
    deleteRole: '/orm/zhejiang/sys/role/deleteRole', // 删除角色
    modifyRole: '/orm/zhejiang/sys/role/modifyRole', // 修改角色

    getBidingLawyerList: '/orm/zhejiang/bid/bid_aider', // 参与竞价的律师列表
    getRpLawyerList: '/orm/zhejiang/bid/rpConfirm', // 点员律师列表
    getRecLawyerList: '/orm/zhejiang/bid/recommend_aider', // 获取推荐法律援助人员的列表
    getAppraiseList: '/orm/zhejiang/appraise/appraise', // 获取四方评价情况列表
    getLackMeterialList: '/orm/zhejiang/check/getSuppMaterialArchiveRpRemark', // 获取需补充材料的列表
    getLawyerInfo: '/orm/zhejiang/check/hp_info', // 获取法律援助人员信息
    getUndertakeInfo: '/orm/zhejiang/case/detail/getUndertakeFlow', // 获取承办阶段信息
    getAidFeesInfo: '/orm/zhejiang/case/archive/getOrmCaseSettle', // 案件费用信息
    getToConfLawyerList: '/orm/zhejiang/bid/aiderConfirm', // 待法律援助人员确认律师列表
    getLogUpdater: '/orm/zhejiang/user/Info', // 获取最新一条日志的人员姓名，头像

    appGetContentMock: '/appTest/contentMock', // app 页面

    ossGetPolicy: '/oss/getPolicy', // 获取阿里云授权
    getUrl: '/oss/getUrl', // 获取附件的Url

    saveCaseInfo: '/orm/zhejiang/ormApplayForCase/createOrmCase', // 援助申请
    addBaseInfo: '/orm/zhejiang/rpUser/applyInfo', // 新增受援人信息
    updataBaseInfo: '/orm/zhejiang/rpUser/update', // 修改受援人信息
    searchInfoById: '/orm/zhejiang/rpUser/info', // 线下受理查找code
    writeInfoById: '/orm/zhejiang/rpUser/getNativePlace', // 根据证件和证件号填入籍贯、性别、出生年月
    addRpUser: '/orm/zhejiang/rpUser/add', // 新增从案人员（线下受理）
    addRpUserCase: '/orm/zhejiang/case/addSuboAndRpUser', // 新增从案人员（案件）
    deleteRpUserCase: '/orm/zhejiang/case/deleteSuboCase', // 删除从案人员（案件）
    editRpUserCase: '/orm/zhejiang/case/updateSuboCase', // 编辑从案人员（案件）
    getTagList: '/orm/zhejiang/sys/tag/list', // 获取标签
    getSubPersonList: '/orm/zhejiang/case/detail/getSuboRpUserByCaseId', // 获取从案人员信息
    getPreAppTempUrl: '/orm/zhejiang/check/preInforcontent', // 查询预审模板
    getAppTempUrl: '/orm/zhejiang/caseFlow/preInforcontent', // 审批查询

    downloadFile: '/orm/zhejiang/material/exportLawaidApplicationDoc', // 下载申请表
    getExaminationMaterials: '/orm/zhejiang/case/archive/getExaminationMaterials', // 获取 审批卷材料
    getUndertakeVolumeMaterials: '/orm/zhejiang/case/archive/getUndertakeVolumeMaterials', // 获取 承办卷材料
    getCaseSmallDetail: '/orm/zhejiang/case/archive/getCaseSmallDetail', // 获取案件小详情与封面
    suupAcc: '/orm/zhejiang/check/suupAcc', // 受理 补充材料 add Or del
    suupAccs: '/orm/zhejiang/check/suupAccs', // 受理 补充材料 adds Or dels
    arrangeAdd: '/orm/zhejiang/case/archive/arrangeAdd', // 编排时 补充材料 add Or del
    arrangeAdds: '/orm/zhejiang/case/archive/arrangeAdds', // 编排时 补充材料 adds Or dels
    caseArchiveAndCreateCasePDF: '/orm/zhejiang/case/archive/caseArchiveAndCreateCasePDF', // 案件归档 并生成pdf文件
    submitMaterialsOrder: '/orm/zhejiang/case/archive/submitMaterialsOrder', // 提交材料(承办卷或审批卷)排序
    getCaseAndConsultCount: '/orm/zhejiang/home/getCaseAndConsultCount', // 获取 待回复网络咨询/待审批(评估)/承办中 案件统计
    getListSysAnnouncements: '/orm/zhejiang/announce/listSysAnnouncements', // 公告列表
    getStatisticsYearAndMonth: '/orm/zhejiang/home/getStatisticsYearAndMonth', // 咨询合计数/案件受理数/咨询未回复数目/审批超期未处理数
    getNoticeListDetail: '/orm/zhejiang/announce/listDetail', // 查询公告详情
    createAnnouncement: '/orm/zhejiang/announce/createAnnouncement', // 发布公告
    downloadFiles: '/orm/zhejiang/announce/downAnnouncementFile', //下载公告内容
    getCaseUndertakeList: '/orm/zhejiang/case/pending/getCaseUndertakeList', // 获取承办中案件(第二版)
    getRestrictDayWork: '/orm/zhejiang/case/pending/getRestrictDayWork', // 超时 获取3天内未开始办理的案件(第二版)
    getNotSatisfaction: '/orm/zhejiang/case/pending/getNotSatisfaction', // 获取满意度异常的案件(第二版)
    getJudgeOpinion: '/orm/judge/opinion/qlist', // 获取法官意见征询(第二版) 改~~
    getSpecialReport: '/orm/zhejiang/case/pending/getSpecialReport', // 获取承办人特殊情况报告(第二版)
    replaceUndertakeUser: '/orm/zhejiang/caseUndertake/replaceUndertakeUser', //更换承办人
    addUndertakeUser: '/orm/zhejiang/caseUndertake/addUndertakeUser', //新增承办人
    delUndertakeUser: '/orm/zhejiang/caseUndertake/delUndertakeUser', //删除承办人
    updateMainUndertake: '/orm/zhejiang/caseUndertake/updateUndertakeMain', //设置主承办人
    addAidPersonManagement: '/orm/zhejiang/caseUndertake/updateUndertakeMain', //变更承办人
    getChangeFile: '/orm/zhejiang/material/getChangeFile', //变更材料
    submitChangeFile: '/orm/zhejiang/material/submitChangeFile',  //改变变更材料
    getAssesmentCaseList: '/orm/zhejiang/caseAssesment/caseList', // 指派评估案件列表
    getAssesmentCaseAssesmentList: '/orm/zhejiang/caseAssesment/assesmentList', // 已指派案件列表查询
    postOrgEvalStand: '/orm/zhejiang/org/evalStand', // 设置评估标准
    getIsEvalStand: '/orm/zhejiang/org/isEvalStand', // 查询是否已设置评估标准
    getEvaluateItemsWithPage: '/orm/zhejiang/case/evaluation/getEvaluateItemsWithPage', // 评估项查询，带分页.
    getEvaluateItems: '/orm/zhejiang/case/evaluation/getEvaluateItems', // 评估项查询
    postEvaluateItemUpdate: '/orm/zhejiang/case/evaluation/itemUpdate', // 评估项添加或者修改
    resetEvaluateItems: '/orm/zhejiang/case/evaluation/resetEvaluateItems', //重置评估项
    ormUserList: '/orm/zhejiang/user/centerList', // 机构人员列表接口
    assesmentAppoint: '/orm/zhejiang/caseAssesment/assesmentAppoint', // 指派评估专家.
    evaluateDetail: '/orm/zhejiang/case/score/evaluateDetail', // 查询案件评估详情
    getPreviewPNG: '/orm/zhejiang/case/archive/getPreviewPNG', // 获取 预览卷宗的图片
    directEvaluate: '/orm/zhejiang/case/score/directEvaluate', // 案件直接评估
    reEvaluate: '/orm/zhejiang/case/score/reEvaluate', // 案件复评
    getCaseWaitCheck: '/orm/zhejiang/case/pending/getCaseWaitCheck', // 获取待结案审核(第二版)
    getOrmCategroLayoutMes: '/orm/zhejiang/case/archive/getOrmCategroLayoutMes', // 获取 案件卷宗类目
    endAid: '/orm/zhejiang/case/pending/endAid', // 终止法援(第二版)
    closeCheck: '/orm/zhejiang/case/pending/closeCheck', // 结案审核(第二版)
    updatefileStorageMes: '/orm/zhejiang/material/exportDoc/updatefileStorageMes', // 上传文书附件
    // 数据中心
    getAllCityOfZJ: '/orm/zhejiang/statement/getAllCityOfZJ', // 获取浙江省列表
    getCustomData: '/orm/zhejiang/statement/customData',   //自定义数据分析
    // --数据分析
    getCaseOrCounsel: '/orm/zhejiang/statement/caseOrCounsel', // 获取咨询、案件统计数据
    getCaseCause: '/orm/zhejiang/statement/caseCause', // 获取案由统计数据
    getApplicantOrCounselor: '/orm/zhejiang/statement/applicationOrCounselor', // 获取咨询人，申请人数据统计
    // --日报
    getDailyStatistics: '/orm/zhejiang/report/getDailyStatistics',
    // --下载日报
    downloadDailyStatistics: '/orm/zhejiang/report/downloadDailyStatistics',
    // --定期报表
    getMonthStatement: '/orm/zhejiang/statement/month/monthStatement', // 月报
    getQuarterStatement: '/orm/zhejiang/statement/month/quarterStatement', // 季报
    getHalfYearStatement: '/orm/zhejiang/statement/exportHalfYear', // 半年报和年报（最新接口）
    getYearStatement: '/orm/zhejiang/statement/yearStatement', // 年报
    // --下载报表
    downloadMonthStatement: '/orm/zhejiang/statement/month/downloadMonth', // 月报
    downloadQuarterStatement: '/orm/zhejiang/statement/month/downloadQuarter', // 季报
    downloadHalfYearStatement: '/orm/zhejiang/statement/downloadHalfYear', // 半年报
    downloadYearStatement: '/orm/zhejiang/statement/downloadHalfYear', // 年报
    updateEvaluate: '/orm/zhejiang/case/score/updateEvaluate', // 编辑保存评价内容
    rotateImage: '/orm/zhejiang/oss/rotateImage',  //旋转图片
    getHpBelongArea:'/orm/zhejiang/caseAssesment/getHpBelongAreas',//援助人所属区域
    getImgUrlForkey:'/orm/zhejiang/oss/getUrl',

    getHistoryEvaluateItems:'/orm/zhejiang/case/evaluation/getHistoryEvaluateItems',//
    getHistoryIsEvalStand:'/orm/zhejiang/case/evaluation/isEvalStand',
  },
}
