import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import InitCard from './InitCard'
import EditModal from './EditModal'
import EditCivilModal from './EditCivilModal'
import styles from './index.less';
import { Breadcrumb, Row, Col, Form, Input, Button, Radio, Card, Modal } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;
/**
 * 设置评估标准.
 * 先接口判断是否需要进行初始设置.
 * 如果设置过后则展示一个列表，可以进行条目的控制.
 */
const SetEvaStandard = ({ location, dispatch, loading, setEvaStandard }) => {
    // 通用数据更新.
    const update = (value)=>{
        dispatch({
            type: 'setEvaStandard/update',
            payload: {
                ...value
            }
        });
    };
    // 当前要显示的视图，0表示初始化评估方式，1表示显示列表，2表示显示编辑.
    const showType = setEvaStandard.showType;
    if(showType == 0) {
        // 初始化评估方式，显示一个Card来提交配置评估方式.
        const initCardProps = {
            update,
            initForm : setEvaStandard.initForm,
            // 提交处理分值.
            submitForm(value){
                dispatch({
                    type: 'setEvaStandard/postOrgEvalStand',
                    payload : {
                        ...value
                    }
                });
            }
        };
        return (
            <div>
                <InitCard  {...initCardProps}></InitCard>
            </div>
        );
    }
    else if(showType == 1 || showType == 2 || showType == 3){
        // 列表模型.
        const listCriminalProps = {
            update : update,
            dataSource: setEvaStandard.listCriminal,
            // 分制.1为5分制，2为100分制.
            dicEvaluationMethod : setEvaStandard.dicEvaluationMethod,
            loading: loading.effects['setEvaStandard/refresh_list_criminal'],
            pagination : setEvaStandard.paginationCriminal,
            onChange(page) {
                const { query, pathname } = location;
                const {search} = setEvaStandard;
                dispatch(routerRedux.push({
                    pathname,
                    query: {
                        ...search,
                        pageNum : page.current,
                        pageSize : page.pageSize
                    }
                }))
            }
        };
        const listCivilProps = {
            update : update,
            dataSource: setEvaStandard.listCivil,
            // 分制.1为5分制，2为100分制.
            dicEvaluationMethod : setEvaStandard.dicEvaluationMethod,
            loading: loading.effects['setEvaStandard/refresh_list_civil'],
            pagination : setEvaStandard.paginationCivil,
            onChange(page) {
                const { query, pathname } = location;
                const {search} = setEvaStandard;
                dispatch(routerRedux.push({
                    pathname,
                    query: {
                        ...search,
                        pageNum : page.current,
                        pageSize : page.pageSize
                    }
                }))
            }
        };
        // 编辑评估项目.
        const editStandardCriminal = ()=>{
            update({
                showType : 2
            });
            dispatch({
                type: 'setEvaStandard/refresh_list_all_criminal',
                payload : {}
            });
        };
        const editStandardCivil = ()=>{
            update({
                showType : 3
            });
            dispatch({
                type: 'setEvaStandard/refresh_list_all_civil',
                payload : {}
            });
        };
        const resetEvaluationStandard = () => {
            Modal.confirm({
                title: '重置案件质量评估标准',
                content: (
                    <div>注意：重置案件质量评估标准后，已经指派评估的案件
                    将继续使用原有的评估标准，新指派评估的案件将会使
                    用新新设置的评估标准
                    </div>
                ),
                onOk(){
                    dispatch({
                        type: 'setEvaStandard/resetStandard'
                    })
                },
                okText: '重置',
                cancelText: '取消'
            })
        }
        let editCivilModalProps = {
            update,
            edit_items : setEvaStandard.edit_items,
            // 分制.1为5分制，2为100分制.
            dicEvaluationMethod : setEvaStandard.dicEvaluationMethod,
            visible : true,
            // 提交表单.
            handleOk(values){
                dispatch({
                    type: 'setEvaStandard/update_standard_civil',
                    payload : {
                        itemList : values
                    }
                });
            },
            // 取消的时候重置数据.
            handleCancel(){
                update({
                    showType : 1
                });
            }
        };
        let editCriminalModalProps = {
            update,
            edit_items : setEvaStandard.edit_items,
            // 分制.1为5分制，2为100分制.
            dicEvaluationMethod : setEvaStandard.dicEvaluationMethod,
            visible : true,
            // 提交表单.
            handleOk(values){
                dispatch({
                    type: 'setEvaStandard/update_standard_criminal',
                    payload : {
                        itemList : values
                    }
                });
            },
            // 取消的时候重置数据.
            handleCancel(){
                update({
                    showType : 1
                });
            }
        };
       
        // DOM
        return (
            <div className="content-inner">
             <div className={styles.btc}>
                    <Button type="danger" onClick={resetEvaluationStandard}>重置评估标准</Button>
                </div>
               
                <div className={styles.btc}>
                    <Button type="primary" onClick={editStandardCriminal}>编辑刑事评估项目</Button>
                </div>
                <List {...listCriminalProps} />
                {showType == 2 ? (
                    <EditModal {...editCriminalModalProps} />
                ): ""}
                 <div className={styles.btc}>
                    <Button type="primary" onClick={editStandardCivil}>编辑民事/行政评估项目</Button>
                </div>
                <List  {...listCivilProps}/>
                {showType == 3 ? (
                    <EditModal {...editCivilModalProps} />
                ): ""}
            </div>
        );
    }
    else{
        return (<div></div>);
    }
};
export default connect(({ setEvaStandard, loading }) => ({ setEvaStandard, loading }))(SetEvaStandard);