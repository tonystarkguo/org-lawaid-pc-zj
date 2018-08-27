import React from 'react'
import PropTypes from 'prop-types'
import styles from './Flowcharts.less'
import {Steps} from 'antd'

const Step = Steps.Step

const Flowcharts = ({flowNodes, caseBaseInfoData, flowNodesForNet, currentNodeNum}) => {
  let {dicOrignChannel, dicOrignChannelType} = caseBaseInfoData
  let toUsedNodes = flowNodes
  if(dicOrignChannel == 4 && dicOrignChannelType == 2){
    toUsedNodes = flowNodesForNet
  }
  return (
    <div>
    {
      toUsedNodes.length ? 
        <Steps current={currentNodeNum}>
          { toUsedNodes.map((item, index) => <Step key={item.nodeName} title={item.nodeName} />)}
        </Steps>
        : ''
    }
    </div>
  )
}

Flowcharts.propTypes = {
  flowNodes: PropTypes.array
}

export default Flowcharts