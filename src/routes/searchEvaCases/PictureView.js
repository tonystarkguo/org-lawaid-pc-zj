import React from 'react'
import moment from 'moment'
import { FilterItem } from '../../components'
import { Form, Button, Row, Col, TreeSelect, DatePicker, Input, Switch, Select } from 'antd'
import styles from './index.less'
import { createDicNodes } from '../../utils'
const {createSelectOption} = createDicNodes
const FormItem = Form.Item
const Option = Select.Option
// 预览.
const PictureView = ({
    update,
    pictureView,
    form: {
        getFieldDecorator,
        getFieldsValue,
        setFieldsValue,
      },
}) => {
    let current = pictureView.current
    let total = pictureView.picArr.length
   
    const handlePrevious = (i) => {
        update({
            pictureView : {
                ...pictureView,
                current : current - 1
            }
        });
    }
    const handleJump =  (i) => {
        const data = getFieldsValue()
        update({
            pictureView : {
                ...pictureView,
                current : Number(data.imgNum)
            }
        });
    }
    const handleTofirst = (i) => {
        update({
            pictureView : {
                ...pictureView,
                current : 0
            }
        });
    }
    const handleNext = (i) => {
        update({
            pictureView : {
                ...pictureView,
                current : current + 1
            }
        })
    }
    if(total == 0) {
        return (<div>暂无案件审批卷内容</div>);
    }
    // DOM
    return (
        <div className={styles.Picclearfix}>
            <div className={styles.Picfl}>
                <div className={styles.PicpicWrap}>
                    <img src={pictureView.picArr[`${current}`].addrUrl} />
                </div>

                <div className={styles.Piccenter}>
                    <Button type="primary" disabled={current+1 <= 1} onClick={e => handlePrevious(-1)}>上一页</Button>
                    <span className={styles.Picmargin10}>第 {current+1 || '--'} 张，共 {total || '--'} 张</span>
                    <Button type="primary" disabled={current+1 >= total} onClick={e => handleNext(1)}>下一页</Button>
                </div>
                <div className={styles.Piccenter}>
                    <Row>
                        <Col span={4}>
                <Button type="primary"  onClick={e => handleTofirst()}>回到第一页</Button>
                </Col>
               <Col span={14}><FormItem>
                   <span className={styles.p40}>跳转至:</span>
            {getFieldDecorator('imgNum')(              
                    <Select allowClear className={styles.num}>
                       {pictureView.picArr.map((item,index) => {
                           return <Option key={index} value={(index).toString()}>{index+1}</Option>
                       })}
                    </Select>
            )}
            <span>页</span>
                    </FormItem>
                </Col>
                <Col span={4}>
                <Button type="primary"  onClick={e => handleJump()}>跳转</Button>
                </Col>
                </Row>
                </div>   
            </div>
            <div className={styles.Picfl}></div>
        </div>
    );
};

export default Form.create()(PictureView)
