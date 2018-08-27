import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Text } from 'recharts'
import { Row, Col, Card, Button } from 'antd'
import styles from './index.less'

const Chars = ({
  StatisticsData,
}) => {
  let { totalCaseOfMonth = [], totalCaseOfYear = [], totalConsultsOfMonth = [], totalConsultsOfYear = [] } = StatisticsData
  const getTotal = (list, text) => {
    const result = {}
    let total = 0
    list.forEach(item => {
      total = total + item.v
    })
    result[text] = total
    result.addr = '浙江'
    return result
  }
  totalCaseOfMonth = totalCaseOfMonth.map(item => {
    item['未处理'] = item.v
    item.addr = item.k.replace('市', '').replace('省', '').replace('区','').replace('县','')
    return item
  })
  // totalCaseOfMonth.unshift(getTotal(totalCaseOfMonth, '未处理'))
  totalCaseOfYear = totalCaseOfYear.map(item => {
    item['受理数'] = item.v
    item.addr = item.k.replace('市', '').replace('省', '')
    return item
  })
  // totalCaseOfYear.unshift(getTotal(totalCaseOfYear, '受理数'))
  totalConsultsOfMonth = totalConsultsOfMonth.map(item => {
    item['未回复'] = item.v
    item.addr = item.k.replace('市', '').replace('省', '')
    return item
  })
  // totalConsultsOfMonth.unshift(getTotal(totalConsultsOfMonth, '未回复'))
  totalConsultsOfYear = totalConsultsOfYear.map(item => {
    item['咨询数'] = item.v
    item.addr = item.k.replace('市', '').replace('省', '')
    return item
  })
  // totalConsultsOfYear.unshift(getTotal(totalConsultsOfYear, '咨询数'))
  const CustomizedAxisTick = React.createClass({
    render () {
      const { x, y, stroke, payload } = this.props
      const listSingle = payload.value.split('')
      let list = []
      if (listSingle.length > 2) {
        listSingle.forEach((item, index) => {
          if (index % 2 === 0) {
            list[Math.floor(index / 2)] = item
          } else {
            list[Math.floor(index / 2)] = list[Math.floor(index / 2)] + item
          }
        })
      } else {
        list = [payload.value]
      }
      const listNode = list.map((item, index) => {
        return <tspan x={0} y={0} dy={index * 16 + 12} textAnchor="middle" fill="#666" key={index}>{item}</tspan>
      })
      return (
        <g transform={`translate(${x},${y})`}>
          <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
            {listNode}
          </text>
        </g>
      )
    },
  })

  const format = (data) => {
    if (parseInt(Number(data), 10) === Number(data)) {
      return data
    }
    return ''
  }
  const char = ({ currentData, color = '#8884d8', dataKey = 'pv' }) => {
    return (
      <ResponsiveContainer width="100%" aspect={1.5} className={styles.char}>
        <BarChart data={currentData} barSize={20}
        margin={{  right: 0, left: -38, bottom: 20 }}>
          <XAxis dataKey="addr" interval={0} tick={<CustomizedAxisTick />} />
          <YAxis tickFormatter={(data) => format(data)} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    )
  }
  const colProps = {
    lg: 12,
    md: 24,
  }
  return (
    <div className={styles.chars}>
      <Row gutter={40}>
        <Col {...colProps} className={styles.charItem}>
          <p className={styles.title}>本年省+地市咨询合计数</p>
          {char({ currentData: totalConsultsOfYear, dataKey: '咨询数', color: '#2cbcc9' })}
        </Col>
        <Col {...colProps} className={styles.charItem}>
          <p className={styles.title}>本年省+地市案件受理数</p>
          {char({ currentData: totalCaseOfYear, dataKey: '受理数', color: '#1577e4' })}
        </Col>
        <Col {...colProps} className={styles.charItem}>
          <p className={styles.title}>本月省+地市网络咨询超期未回复数</p>
          <p className={styles.subTitle}>（1个工作日）</p>
          {char({ currentData: totalConsultsOfMonth, dataKey: '未回复', color: '#ababab' })}
        </Col>
        <Col {...colProps} className={styles.charItem}>
          <p className={styles.title}>本月省+地市案件审批超期未处理数</p>
          <p className={styles.subTitle}>（受理后，7个工作日未指派）</p>
          {char({ currentData: totalCaseOfMonth, dataKey: '未处理', color: '#e44d6c' })}
        </Col>
      </Row>
    </div>
  )
}

export default connect(({ chars }) => ({ chars }))(Chars)
