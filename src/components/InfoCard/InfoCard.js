// 数据结构示例
/**
const aidTypeCardProps = {
  border: false                                         //边框 默认有 false取消
  title: "援助类型",                                    //标题 可选
  infos : [                                             //信息  必填
    {label: '援助类型：', value: '刑事辩护'}            
  ],
  steps : {                                             //steps组件 可选
    current: 1,
    label: "标承办流程：",
    step: [
      {title: "第一步", description: "会见当事人"},
      {title: "第二步", description: "侦查准备"},
      {title: "第三步", description: "侦查准备"}
    ]
  }
}
*/
import React from 'react'
import PropTypes from 'prop-types'
import styles from './InfoCard.less'
import { Card, Row, Col, Steps, Table } from 'antd'

const Step = Steps.Step

const InfoCard = ({title, infos=[], steps, tableProps, border=true}) => {
  const listNode = infos.map((info) => {
    info.span = info.span || 12
    return (        
        <Col span={info.span} key={info.label} className={styles.item}>
            <span>{info.label}</span>
            <span style={{width: "calc(100% - 180px)"}}>{info.value}</span>  
        </Col>
      )
  })
  const hasSteps = typeof steps === 'object'
  const hasTable = typeof tableProps === 'object'
  let stepNode = (() => {return })
  if(hasSteps) {
    stepNode = steps.step.map((step) => {
      return (
          <Step title={step.title} description={step.description} key={step.flowId}/>
        )
    })
  }
  return (
    <div>      
      <Card title={title} bordered={true} style={{marginTop: '20px', marginBottom: '20px'}}>
        <Row gutter={24}>
          {listNode}
          {hasSteps && <Col span={24} className={styles.item}>
            <Col span={23} className={styles.item}>              
              <span>{steps.label}</span>
              <span style={{width: "calc(100% - 180px)"}}>   
                <div>      
                  <Steps current={steps.current}>
                    {stepNode}
                  </Steps>                 
                </div>     
              </span>  
            </Col>
            <Col span={10} className={styles.item}>
            </Col>
              
          </Col>}
          {hasTable && <Col span={24}><Table columns={tableProps.columns} scroll={{ x: 680 }} bordered={true} dataSource={tableProps.bidingLawyerList}></Table></Col>}
        </Row>
      </Card>
    </div>
  )
}

InfoCard.propTypes = {
  title: PropTypes.string,
  info: PropTypes.object,
  steps: PropTypes.object,
  border: PropTypes.bool
}

export default InfoCard
