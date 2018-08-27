function compileEmpScript (html) {
  // let html = htmlStr.replace(/'/g, '"')
  return `<table class="js-tb-single-doc" cellpadding="0" cellspacing="0" border="0" style="margin-left:auto;margin-right:auto;page-break-after:always"><tr><td style="vertical-align:top;border-left:3px solid #909090;background-color:#FFF"><table cellpadding="0" cellspacing="0" border="0" style="width:890px"><tr><td colspan="3" style="height:40px;border-right:3px solid #222;border-top:3px solid #909090"></td><td style="height:40px;background-color:silver"></td></tr><tr><td style="width:50px"></td><td class="print-body"><div style="page-break-after:always">${html}</div></td><td style="width:50px;border-right:3px solid #222"></td><td style="width:50px;background-color:silver;vertical-align:top" class="printBody"><table cellpadding="0" style="" cellspacing="0" border="0"><tr><td class="td-item"></td></tr><tr class="tr-print"><td class="td-item"><input class="btnPrint" type="button" value="打印文书 " onclick="printForm(this)"></td></tr><tr><td class="td-item"><input class="btnClose" type="button" value="关闭 " onclick="window.close()"></td></tr> <tr class="tr-print"><td class="td-item"><input class="btndisPrint" type="button" value="不打印 " onclick="printClose(this)"></td></tr></table></td></tr><tr><td colspan="3" style="height:100px;border-right:3px solid #222;border-bottom:3px solid #222"></td><td style="height:40px;background-color:silver"></td></tr></table></td></tr></table>`
}

function compileGenScript (html) {
  // let html = htmlStr.replace(/'/g, '"')
  return `<table class="js-tb-single-doc"  cellpadding="0" cellspacing="0" border="0" style="margin-left:auto;margin-right:auto;page-break-after:always"><tr><td style="vertical-align:top;border-left:3px solid #909090;background-color:#FFF"><table cellpadding="0" cellspacing="0" border="0" style="width:890px"><tr><td colspan="3" style="height:40px;border-right:3px solid #222;border-top:3px solid #909090"></td><td style="height:40px;background-color:silver"></td></tr><tr><td style="width:50px"></td><td class="print-body genDocs" ><div style="page-break-after:always">${html}</div></td><td style="width:50px;border-right:3px solid #222"></td><td style="width:50px;background-color:silver;vertical-align:top" class="printBody"><table cellpadding="0" style="" cellspacing="0" border="0"><tr><td class="td-item"></td></tr><tr class="tr-print"><td class="td-item"><input class="btnPrint" type="button" value="打印文书 " onclick="printForm(this)"></td></tr><tr class="tr-empty-doc" style="display:none"><td class="td-item"><input class="btnGap" type="button" value="空白文书" onclick="getEmpDoc(this)"></td></tr><tr class="tr-save"><td class="td-item"><input class="saveDoc" type="button" value="保存文书" onclick="saveDoc(this)"></td></tr><tr class="tr-seal"><td class="td-item"><input class="btnDisplay" type="button" value="盖章 " onclick="displaySeal(this)"></td></tr><tr class="tr-cancel-seal"><td class="td-item"><input class="btnHide" type="button" value="取消盖章 " onclick="hideSeal(this)"></td></tr><tr><td class="td-item"><input class="btnClose" type="button" value="关闭 " onclick="window.close()"></td></tr> <tr class="tr-print"><td class="td-item"><input class="btndisPrint" type="button" value="不打印 " onclick="printClose(this)"></td></tr><tr class="tr-cancel-seal"><td class="td-item"><input class="btnHideMa" type="button" value="添加二维码 " onclick="displayCode(this)"></td></tr><tr class="tr-cancel-seal"><td class="td-item"><input class="btnHideMa" type="button" value="取消二维码" onclick="hideCode(this)"></td></tr></table></td></tr><tr><td colspan="3" style="height:100px;border-right:3px solid #222;border-bottom:3px solid #222"></td><td style="height:40px;background-color:silver"></td></tr></table></td></tr></table>`
}

function compilePrintDataScript (html) {
  return `<table class="js-tb-single-doc" cellpadding="0" cellspacing="0" border="0" style="margin-left:auto;margin-right:auto;page-break-after:always"><tr><td style="vertical-align:top;border-left:3px solid #909090;background-color:#FFF"><table id="content_table" cellpadding="0" cellspacing="0" border="0" style="width:890px"><tr id="tr1"><td colspan="3" style="height:40px;border-right:3px solid #222;border-top:3px solid #909090"></td><td style="height:40px;background-color:silver"></td></tr><tr><td style="width:50px"></td><td class="print-body"><div style="page-break-after:always">${html}</div></td><td style="width:50px;border-right:3px solid #222"></td></tr><tr><td colspan="3" style="height:100px;border-right:3px solid #222;border-bottom:3px solid #222"></td><td style="height:40px;background-color:silver"></td></tr></table></td></tr></table>`
}

function buildPrintForm (emptyDocs, genDocs) {
  let divNode = $('<div class="js-print-data-show" />') // 创建div，里面的内容用来展示
  let printDivNode = $('<div id="printDataContainer" style="display:none;" />')// 创建div， 里面的内容用来打印
  if (emptyDocs && emptyDocs.length) {
    $.each(emptyDocs, (i, item) => {
      divNode.append(compileEmpScript(item))
      // printDivNode.append(compilePrintDataScript(item))
    })
  }
  if (genDocs && genDocs.length) {
    $.each(genDocs, (i, item) => {
      divNode.append(compileGenScript(item))
      // printDivNode.append(compilePrintDataScript(item))
    })
  }
  
  // 绑定到dom中
  $('#printContainer').append(divNode)
  $('.print-body').find('div').css('height', 'auto')
  

  $('.btnHideMa').css('display','none')
  $('.js-print-data-show').find('.print-body').each(function (index, elem) {
    let $this = $(this)
    if($this.find('.erWeiMa').length>0){
      $this.next().next().find('.btnHideMa').css('display','')
    }
  })
  $('#printContainer').append(printDivNode)

  // 获取文档中所有可以编辑的文本框
  $('.seal-style').css('display', 'none')
  let x = document.getElementsByClassName('hidden')[0]
  if (x) {
    let status = x.innerHTML
    let caseStatus = ['02_02', '02_03', '02_05', '02_06', '01_03', '01_04', '01_05', '01_06', '01_07', '03_06', '03_07', '03_09', '03_10']
    		if (caseStatus.indexOf(status) > -1) {
    			$('.erWeiMa').css('display', '')
    		} else {
    			$('.erWeiMa').css('display', 'none')
    		}
    		}
  $('.js-print-data-show').find('.js-can-edit').each(function (index, elem) {
    let $this = $(this)
    let parentTr = $this.closest('.print-body')
    $(`<input name="${$this.attr('name')}"type="hidden" value="${$this.text()}"></input>`).appendTo(parentTr)
  })
  let url =  window.location.href
  let y = url.split('tCaseMaterialStorageId=')[1]
  let  tCaseMaterialStorageId = y.split(',')
  var genDocs = $('.genDocs')
  genDocs.each(function(index,elem){
    tCaseMaterialStorageId.map(function(value,i){
      if(index == i){
        $(`<input type="hidden" name="tCaseMaterialStorageId" value="${value}"></input>`).appendTo(genDocs[index])
      }
    })
  })
  $('.btnPrint').val('打印所有文书')
    // 报告记录不能保存文书
  if ($('input[name=isSubmit]').val() == '0') {
    $('.tr-save').hide()
  }

  $('.js-print-data-show').find('.js-can-edit').on('dblclick', function (e) {
    let _this = $(this)
    let editItem = _this// (_this).find('.js-can-edit')
    let parentTr = _this.closest('.print-body')
    layer.prompt({
      	formType: 2,
      value: editItem.text(),
      title: '请输入',
    }, (val, index) => {
      editItem.text(val)
      if (parentTr.find(`input[name=${editItem.attr('name')}]`).length) {
        parentTr.find(`input[name=${editItem.attr('name')}]`).val(val)
      } else {
        parentTr.find(`<input name="${editItem.attr('name')}"type="hidden" value="${val}"></input>`).appendTo(parentTr)
      }
      layer.close(index)
    })
  })
}
function buildTempPrintForm (htmlStr) {
  let divNode = $('<div class="js-print-data-show" />')
	let url = window.location.href
	if(url.indexOf('defaultFileAddr') > -1){
	  divNode.append(compileEmpScript(htmlStr))
	}else{
    divNode.append(compileGenScript(htmlStr))
 }
 $('#printContainer').append(divNode)
  // 获取文档中所有可以编辑的文本框
  $('.seal-style').css('display', 'none')
  let x = document.getElementsByClassName('hidden')[0]
  if (x) {
    let status = x.innerHTML
    let caseStatus = ['02_02', '02_03', '02_05', '02_06', '01_03', '01_04', '01_05', '01_06', '01_07', '03_06', '03_07', '03_09', '03_10']
    		if (caseStatus.indexOf(status) > -1) {
    			$('.erWeiMa').css('display', '')
    		} else {
    			$('.erWeiMa').css('display', 'none')
    		}
        }
        $('.btnHideMa').css('display','none')
  $('.js-print-data-show').find('.print-body').each(function (index, elem) {
    let $this = $(this)
    if($this.find('.erWeiMa').length>0){
      $this.next().next().find('.btnHideMa').css('display','')
    }
  })
  $('.js-print-data-show').find('.js-can-edit').each(function (index, elem) {
    let $this = $(this)
    $(`<input name="${$this.attr('name')}"type="hidden" value="${$this.text()}"></input>`).appendTo($('.print-body'))
  })
    // 报告记录不能保存文书
  if ($('input[name=isSubmit]').val() == '0') {
    $('.tr-save').hide()
  }

  $('.js-print-data-show').find('.js-can-edit').on('dblclick', function (e) {
    let _this = $(this)
    let editItem = _this// (_this).find('.js-can-edit')
    layer.prompt({
      	formType: 2,
      value: editItem.text(),
      title: '请输入',
    }, (val, index) => {
      editItem.text(val)
      if ($(`input[name=${editItem.attr('name')}]`).length) {
        $(`input[name=${editItem.attr('name')}]`).val(val)
      } else {
        $(`<input name="${editItem.attr('name')}"type="hidden" value="${val}"></input>`).appendTo($('#printForm'))
      }
      layer.close(index)
    })
  })
}
// 空白文书
function getEmpDoc (self) {
  let $this = $(self)
  $this.closest('.print-body').find('.js-can-edit').empty()
    // window.location.href = "WritePrint.aspx?CaseIndex=" + document.getElementById("hdCaseIndex").value + "&Kind=" + document.getElementById("hdKind").value;
}

// 点击隐藏后显示出现
function hideSeal (self) {
  let $this = $(self)
  $this.closest('.printBody').prev().prev().find('.seal-style').css('display', 'none')
}
// 点击显示后隐藏出现
function displaySeal (self) {
  let $this = $(self)
  $this.closest('.printBody').prev().prev().find('.seal-style').css('display', 'block')
}
function displayCode (self) {
  let $this = $(self)
  $this.closest('.printBody').prev().prev().find('.erWeiMa').css('display', 'block')
}
function hideCode (self) {
  let $this = $(self)
  $this.closest('.printBody').prev().prev().find('.erWeiMa').css('display', 'none')
}
function printForm () {
  // $('#printDataContainer').find('.print-body').jqprint()
  $('#printContainer').find('.print-body').not('.none').jqprint()
}
function printClose (self) {
  let $this = $(self)
  $this.closest('.printBody').css('display','none')
  $this.closest('.printBody').prev().prev().css('display','none').addClass('none')
  $this.closest('.printBody').prev().prev().closest('tr').siblings().css('display','none')
}
function getQueryString (name) {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}
function saveDoc (self) {
  let $this = $(self)
  let parentbody = $this.closest('.printBody').prev().prev()
  
    // 询问框
  layer.confirm('保存文书将会把当前页面修改的内容替换原文书的内容，确定保存？', {
    btn: ['确定', '取消'], // 按钮
  }, () => {
    let params = {}
    parentbody.find('input').each(function () {
      let url = window.location.href
      let _this = $(this)
      params[_this.attr('name')] = _this.val()
      if(url.indexOf('defaultFileAddr') > -1 && url.indexOf('tCaseMaterialStorageId') > -1){
        
      }else{
      params.tCaseMaterialStorageId = getQueryString('tCaseMaterialStorageId')
      }
    })
    
    httpPost(`${window.location.origin}/orm/zhejiang/material/exportDoc/againUpdateMaterialDoc`, params, (jdata) => {
      layer.msg('保存成功')
    }, () => {
      layer.msg('保存失败')
    })
  }, () => {

  })
}

function httpGet (url, params, success, failed, errHandler) {
  let isLoading = true
  if (!params) { params = {} }
  loadingView = layer.load(1, { shade: 0.4 })
  let mytoken = localStorage.getItem('token')
  params.random = new Date().getTime()

  $.ajax({
    url,
    method: 'GET',
    data: params,
    dataType: 'json',
    beforeSend (request) { request.setRequestHeader('token', mytoken) },

    contentType: 'application/json;charset=utf-8',
    success (data) {
      layer.close(loadingView)
      if (data.code == 1 && typeof success === 'function') {
        success(data)
      }
    },
    error (error) {
      layer.close(loadingView)
      if (typeof errHandler === 'function') {
        errHandler()
      }
    },
  })
}


function httpPost (url, params, success, failed) { // loading为falsebuloading
  let self = this
    // 删除loadding字段
  loadingView = layer.load(1, { shade: 0.4 })
  let mytoken = localStorage.getItem('token')
  $.ajax({
    url,
    type: 'post',
    data: JSON.stringify(params),
    dataType: 'json',
    beforeSend (request) { request.setRequestHeader('token', mytoken) },
    contentType: 'application/json;charset=utf-8',
    success (data) {
      layer.close(loadingView)
      if (typeof success === 'function') {
        if (data.code == 1) {
          success(data)
        } else {
          failed(data)
        }
      }
    },
    error (error) {
      layer.close(loadingView)
    },
  })
}
