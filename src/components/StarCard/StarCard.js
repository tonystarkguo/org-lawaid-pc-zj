//数据结构示例
/**
const caseRate = {
  title: "评价情况",            //标题  必填
  stars: [                      //数据  必填
    {label: '受援人发起评价：', value: 1, content: '2017-3-15  15:48'},
    {label: '法律援助人员发起评价：', value: 2, content: ''},
    {label: '援助机构发起评价：', value: 3, content: '2017-3-15  15:48'},
    {label: '运营团队发起评价：', value: 4, content: ''},
  ]
}
*/
import React from 'react'
import PropTypes from 'prop-types'
import styles from './StarCard.less'
import { Card, Row, Col, Rate } from 'antd'


const StarCard = ({title, stars}) => {
  
  const listNode = stars.map((star) => {
    star.span = star.span || 24
    star.content = star.content || ""
    return (        
      <Col span={star.span} key={star.label} className={styles.item}>
          <span>{star.label}</span>
          <span>
            <Rate disabled defaultValue={star.value}/>
          </span>  
          <span style={{width: "calc(100% - 400px)"}}>{star.content}</span>
      </Col>
      )
  })

  return (
    <div>      
      <Card title={title} style={{marginTop: '20px'}}>
        <Row gutter={16}>
          {listNode} 
        </Row>
      </Card>
    </div>
  )
}

StarCard.propTypes = {
  title: PropTypes.string,
  star: PropTypes.object
}

export default StarCard