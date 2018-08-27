import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Modal, Row, Col, Button, Form, Select } from 'antd'
import styles from './index.less'

const FormItem = Form.Item
const Option = Select.Option
const ModalView = ({
  present,
  current,
  url,
  visible,
  update,
  fileModify,
  pictureView,
  dispatch,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {

  const showImg = fileModify.showImg
  const imgFiles = pictureView.picArr.filter(item => {
    return item.dicCategory == fileModify.dicCategory
  })
  current =showImg ? pictureView.current : current;
  const total =imgFiles[0].ocadList.length
  
  const handlePrevious = (i) => {
    update({
      pictureView : {
            ...pictureView,
            current : current - 1,
          },
          showImg: true,
    });
}
const handleJump =  (i) => {
    const data = getFieldsValue()
    update({
      pictureView : {
            ...pictureView,
            current : Number(data.imgNum),
          },
          showImg: true,
    });
}
const handleTofirst = (i) => {
    update({
      pictureView : {
            ...pictureView,
            current : 0,
          },
          showImg: true,
    });
}
const handleNext = (i) => {
    update({
      pictureView : {
            ...pictureView,
         current: current+1 ,
        },
        showImg: true,
    })
}
  const props = {
    visible,
    title: imgFiles[0].ocadList[`${current}`].name,
    footer: null,
    width: '600px',
    style: { top: 0 },
    onCancel: () => {
      dispatch({
        type: 'fileModify/hideModalView',
      })
    },
  }

  return (
    <Modal {...props}>
      {/* <img src={url} alt="图片" style={{ width: '100%' }} /> */}
      {/* {imgFiles[0].ocadList[`${current}`].name} */}
      <div className={styles.Picfl}>
                <div className={styles.PicpicWrap}>
                    <img src={imgFiles[0].ocadList[`${current}`].addrUrl} />
                </div>
                </div>
      <div className={styles.Piccenter}>
                    {/* <Button type="primary" disabled={current+1 <= 1} onClick={e => handlePrevious(-1)}>上一页</Button>
                    <span className={styles.Picmargin10}>第 {current+1 || '--'} 张，共 {total || '--'} 张</span>
                    <Button type="primary" disabled={current+1 >= total} onClick={e => handleNext(1)}>下一页</Button> */}
                </div>

                <div className={styles.Piccenter}>
                    <Row>
                        <Col span={4}>
                {/* <Button type="primary"  onClick={e => handleTofirst()}>回到第一页</Button> */}
                </Col>
               <Col span={14}><FormItem>
                   <span className={styles.p40}>当前第 {current+1 || '--'} 页，跳转至:</span>
            {getFieldDecorator('imgNum')(              
                    <Select allowClear className={styles.num20}>
                       {imgFiles[0].ocadList.map((item,index) => {
                           return <Option key={index} value={(index).toString()}>{index+1}</Option>
                       })}
                    </Select>
            )}
            <span>页</span>
                    </FormItem>
                </Col>
                <Col span={4}>
                <Button type="primary" className={styles.ml125}  onClick={e => handleJump()}>跳转</Button>
                </Col>
                </Row>
                </div>   
    </Modal>
  )
}

export default connect(({ modalView }) => ({ modalView }))(Form.create()(ModalView))
