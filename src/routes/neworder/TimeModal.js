import React from 'react'
import PropTypes from 'prop-types'
import {  Input,  Calendar,  Row,  Col, Form, Button, Modal, Radio } from 'antd'
import style from './index.less'
import moment from 'moment'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const TimeModal = ({ 
  dayResvData,
  onPanelChange,  
  handleChangeValue,
  handleClickRadio,
  dayResvCurrentDate,
  ...timeModalProps
}) => {

  const handleChangeRadioModal = (event) => {
    const dayResvCurrentDateFormat = dayResvCurrentDate.format('YYYY-MM-DD')
    let value = dayResvCurrentDateFormat + " " + event.target.value
    let id = event.target.id
    handleChangeValue(value, id)
  }

  const clickRadio = () => {
    handleClickRadio()
  }

  let morning, afternoon, startTimeHour
  if(typeof dayResvData.data === 'object'){ 
    let morningData = dayResvData.data.filter((dayResv) => {
        startTimeHour = moment(dayResv.startTime).hour() 
        return startTimeHour < 12
    })
    let afternoonData = dayResvData.data.filter((dayResv) => {
        startTimeHour = moment(dayResv.startTime).hour() 
        return startTimeHour > 12 || startTimeHour === 12
    })
    morning = morningData.map((dayResv) => {
      let startTime = moment(dayResv.startTime).format('LTS')
      let endTime = moment(dayResv.endTime).format('LTS')
      const value = `${startTime}-${endTime}`   
      return ( 
      <RadioButton 
        className={style.RadioButton} 
        onClick={clickRadio}
        key={dayResv.startTime} 
        value={value}
        id={dayResv.id}>
        {value}
      </RadioButton>
      )}
    )  
    afternoon = afternoonData.map((dayResv) => {
      let startTime = moment(dayResv.startTime).format('LTS')
      let endTime = moment(dayResv.endTime).format('LTS')
      const value = `${startTime}-${endTime}`   
      return (
      <RadioButton 
        className={style.RadioButton} 
        onClick={clickRadio}
        key={dayResv.startTime} 
        value={value}
        id={dayResv.id}>
        {value}
      </RadioButton>
      )}
    ) 
  }
  return (
    <div>
      <Modal 
      {...timeModalProps}>
        <RadioGroup className={style.timeModalContent} onChange={handleChangeRadioModal}>
          <div className={style.morning}> 
            <p>上午</p>         
            {morning}
          </div>
          <div className={style.afternoon} >
            <p>下午</p>
            {afternoon}
          </div>
        </RadioGroup>
      </Modal>
    </div>
  )
}

TimeModal.propTypes = {
  dayResvData: PropTypes.object,
  onPanelChange: PropTypes.func,
  handleClickRadio: PropTypes.func,
  dayResvCurrentDate: PropTypes.object
}

export default Form.create()(TimeModal)


          // visible={this.state.visible}
          // onOk={this.handleOk}
          // onCancel={this.handleCancel}