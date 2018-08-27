import React from 'react'
import { FilterItem } from '../../components'
import { Form, Button, Row, Col, Input} from 'antd'
// 列
const ColProps = {
    span: 8,
    style: {
        marginBottom: 16,
    }
};
// 过滤器
const ModalSearch2 = ({
    modal_search2,
    onFilterChange,
    update,
    form : {
        getFieldDecorator,
        getFieldsValue,
        setFieldsValue
    }
}) => {
    // 搜索.
    const handleSubmit = () => {
        let fields = getFieldsValue();
        onFilterChange(fields);
    };
    // DOM
    return (
        <Row gutter={24}>
            <Col {...ColProps}>
                <FilterItem label="姓名">
                {getFieldDecorator('name')(
                    <Input.Search onSearch={handleSubmit} />
                )}
                </FilterItem>
            </Col>
            <Col {...ColProps}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <Button type="primary" className="margin-right" onClick={handleSubmit}>搜索</Button>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default Form.create({
    mapPropsToFields(props) {
        let modal_search2 = props.modal_search2;
        return {
            ...modal_search2
        };
    },
    onFieldsChange(props, fields) {
        props.update({
            modal_search2 : {
                ...props.modal_search2,
                ...fields
            }
        });
    }
})(ModalSearch2);
