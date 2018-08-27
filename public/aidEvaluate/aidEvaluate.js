$( function () {
  // 获取params
  function getParams() {
    var url = decodeURIComponent(window.location.search.substr(1))
    var resulte = {}
    if (!url) {
      return {}
    }
    if (url.indexOf('&') === -1) {
      resulte[url.split('=')[0]] = url.split('=')[1]
    }
    if (url.indexOf('&') > -1) {
      var paramsList = url.split('&')
      paramsList.forEach(function(item) {
        if (item.split('=')[0]) {
          resulte[item.split('=')[0]] = item.split('=')[1]
        }
      })
    }
    return resulte
  }
  var params = getParams()
  var info = {}
  // 获取info
  function getInfo() {
    $.ajax({
      type: 'get',
      url: window.location.origin + '/orm/judge/opinion/getCaseUndInfo?tCaseId=' + params.tCaseId,
      success: function(res) {
        info = res.data
        setParams(info)
      }
    })
  }
  getInfo();
  function setParams(info) {
    info.caseNum && $("#caseNum").text(info.caseNum)
    info.rpUserName && $("#rpName").text(info.rpUserName)
    info.caseReason && $("#caseReason").text(info.caseReason)
    info.hpName && $("#hpName").text(info.hpName)
    info.hpWorkUnit && $("#hpOrg").text(info.hpWorkUnit)
  }
  
  function getSendData() {
    var dicAttitude = $("input[name='dicAttitude']:checked").val()
    var dicInterflow = $("input[name='dicInterflow']:checked").val()
    var dicMaintain = $("input[name='dicMaintain']:checked").val()
    var dicResult = $("input[name='dicResult']:checked").val()
    var dicSummary = $("input[name='dicSummary']:checked").val()
     var isIllegal = $("input[name='isIllegal']").val()
			if($('input[type=checkbox]').is(':checked')){
				isIllegal =true
			}else{
				isIllegal=false}
    return {
      dicAttitude: dicAttitude,
      dicGlobalType: "1",
      dicInterflow: dicInterflow,
      dicMaintain: dicMaintain,
      dicResult: dicResult,
      dicSummary: dicSummary,
      isIllegal: isIllegal,
      tCaseId: params.tCaseId,
    }
  }
  $("#submit").on("click", function(){
    $.ajax({
      type: 'post',
      data: JSON.stringify(getSendData()),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      url: window.location.origin + '/orm/zhejiang/appraise/saveCaseEvaluate',
      // url: 'http://192.168.26.201:3003' + '/orm/judge/opinion/add',
      success: function(res) {
        if (res.code === '1') {
          alert('提交成功')
        } else {
          alert(res.data)
        }
      }
    })
  })
})