import React from 'react'
import PropTypes from 'prop-types'
import { Calendar, Form, Modal} from 'antd'
import moment from 'moment'
import style from './index.less'

const CalendarModal = ({ 
  ResvData,
  onPanelChange,
  handleClickDate,
  currentValue,
  ...calendarModalProps
}) => {
  //切换月份
  const onPanelChangeModal = (value) => {
    onPanelChange(value)
  }
  //日期cell信息
  function dateCellRender(value) {
    let info ,date, num, returnNode
    const returnNodeProps = {
      background:'#ccc',
      width:'100%',
      height:'80%',
      borderRadius: '5px',
      cursor: 'default'
    }
    returnNode = (info) => <div className={style.dateNote}><p>{info}</p></div>
    const now = moment()
    if((now - value) >= 0) {
      returnNode = () => <div style={returnNodeProps}></div>
    }else {
      if( typeof ResvData.data === 'object') {
        ResvData.data.forEach((resv) => {
          if(resv.isFull) {
            info = '满'
            return
          }
          date = new Date(resv.resvDate)
          if(value.format('YYYY-MM-DD') === date.format('yyyy-MM-dd')) {
            num = resv.resvAbleNum - resv.resvAlreadyNum
            info = `剩余预约数量  ${num}`
          }
        })   
      }
    }

    return returnNode(info)
  }
  //点击日期cell
  const handleClickDateModal = (value) => {
    const clickCellMonth = value.month()//点击日期的月份
    const calendarMonth = currentValue.month()//日历当前月份
    const now = moment()
    if((now - value) >= 0) {
      return
    }
    if(clickCellMonth != calendarMonth) {
      onPanelChange(value)
    }else{
      handleClickDate(value)      
    }
  }
  return (
    <div>      
      <Modal 
        {...calendarModalProps}
        width = "80%">
          <Calendar value={currentValue} dateCellRender={dateCellRender} onPanelChange={onPanelChangeModal} onSelect={handleClickDateModal}/>
      </Modal>
    </div>
  )
}

CalendarModal.propTypes = {}

export default Form.create()(CalendarModal)
