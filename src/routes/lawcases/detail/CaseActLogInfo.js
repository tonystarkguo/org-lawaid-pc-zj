import React from 'react'
import PropTypes from 'prop-types'
import {Timeline} from 'antd'
import { dateUtil } from '../../../utils'

const TimeItem = Timeline.Item

const CaseActLogInfo = ({lawcaseDetail}) => {
	// const {lawcaseDetail, handleEdit, handleSave, handleCancel } = lawcaseDetail
  const {caseLogData} = lawcaseDetail
		/*
  	<Timeline>
	        <TimeItem>
	          <p>完成申请 2015-09-01</p>
	          <p>穗粤法申行(2017)302号</p>
	          <p>线上申请</p>
	        </TimeItem>
	        <TimeItem>
	          <p>完成申请 2015-09-01</p>
	          <p>穗粤法申行(2017)302号</p>
	          <p>线上申请</p>
	        </TimeItem>
	        <TimeItem dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />} color="red">
	          <p>完成申请 2015-09-01</p>
	          <p>穗粤法申行(2017)302号</p>
	          <p>线上申请</p>
	        </TimeItem>
	        <TimeItem>
	          <p>完成申请 2015-09-01</p>
	          <p>穗粤法申行(2017)302号</p>
	          <p>线上申请</p>
	        </TimeItem>
        </Timeline>

   */

		return (
				<div>
						{caseLogData.length
								? <Timeline>
												{caseLogData.map((item, index) => <TimeItem key={index}>
														<p style={{color: item.dicType == '1'? 'red':''}}>{item.logTitle} {item.createTime && dateUtil.convertToDate(item.createTime, 'yyyy-MM-dd hh:mm:ss')}
																{item.creatorName}</p>
														<p style={{color: item.dicType == '1'? 'red':''}}>{item.logMessage}</p>
												</TimeItem>)}
										</Timeline>
								: ''
						}
				</div>
		)
}

CaseActLogInfo.propTypes = {
  lawcaseDetail: PropTypes.object,
}

export default CaseActLogInfo
