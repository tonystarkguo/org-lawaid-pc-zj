import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Modal, Row, Col, Popover, Button, Icon, Input } from 'antd'
import { SortableContainer, SortableElement, arrayMove, SortableHandle } from 'react-sortable-hoc'
import styles from './index.less'
const confirm = Modal.confirm
const ClassEditModal = ({
  visible,
  addClassText,
  dispatch,
  files,
  showAdd,
}) => {
  const props = {
    visible,
    title: '查看',
    footer: null,
    width: '400px',
    style: { top: 0 },
    onCancel: () => {
      dispatch({
        type: 'fileModify/hideClassEditModal',
      })
    },
  }
  const DragHandle = SortableHandle(({ value }) =>
    <p className={styles.classTitle}>{value.dicCategory}</p>
  )
  const SortableItem = SortableElement(({ value }) =>
    <div className={styles.classItem}>
      <DragHandle value={value} />
      {value.dicCategory !== '据已结案的相关文书（即承办卷）' &&
        <Icon type="delete" className={styles.classIcon} onClick={() => handleDelete(value)} />
      }
    </div>
  )
  const SortableList = SortableContainer(({ items }) => {
    return (
      <div className={styles.classList}>
        {items.map((value, index) => (
          <SortableItem key={`item-${index}`} index={index} value={value} />
        ))}
      </div>
    )
  })
  const handleDelete = (value) => {
    confirm({
      title: '删除',
      content: '是否确定删除此类别？',
      onOk () {
        dispatch({
          type: 'fileModify/deleteClass',
          payload: value,
        })
      },
    })
  }
  const handelOnSortEnd = (file, oldIndex, newIndex) => {
    if (oldIndex === newIndex) {
      return
    }
    dispatch({
      type: 'fileModify/setSortClass',
      payload: arrayMove(file, oldIndex, newIndex)
    })
  }
  const handleClassAdd = () => {
    dispatch({
      type: 'fileModify/showAddClass',
    })
  }
  const handleClassSubmit = () => {
    dispatch({
      type: 'fileModify/hideClassEditModal',
    })
  }
  const handleChangeClassText = (e) => {
    dispatch({
      type: 'fileModify/changeClassText',
      payload: e.target.value,
    })
  }
  const handleClassAddSubmit = () => {
    if (!addClassText) {
      return
    }
    dispatch({
      type: 'fileModify/handleClassAddSubmit',
    })
  }
  return (
    <Modal {...props} className={styles.classEdit}>
      <div className={styles.classControl}>
        <p>材料类别（上下以拖动排序）</p>
        <p>删除</p>
      </div>
      <SortableList
        helperClass="sortableHelper"
        items={files}
        onSortEnd={({ oldIndex, newIndex }) => handelOnSortEnd(files, oldIndex, newIndex)}
        axis="y"
        useDragHandle
      />
      <div className={styles.addClass}>
        <Input value={addClassText} onChange={e => handleChangeClassText(e)} placeholder="请输入新的类别" />
        <Button type="primary" onClick={handleClassAddSubmit}>新增类别</Button>
      </div>
    </Modal>
  )
}

export default connect(({ classEditModal }) => ({ classEditModal }))(ClassEditModal)
