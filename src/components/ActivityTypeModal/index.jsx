import React, { useState } from 'react'
import { Modal, Button } from 'antd'
import { ACTIVITY_TYPES, ACTIVITY_TYPE_LABELS, ACTIVITY_TYPE_DESCRIPTIONS } from '../../constants/activityTypes'

const ActivityTypeModal = ({ open, onCancel, onConfirm }) => {
  const [selectedType, setSelectedType] = useState(null)

  const activityTypes = [
    {
      type: ACTIVITY_TYPES.LOTTERY,
      title: ACTIVITY_TYPE_LABELS[ACTIVITY_TYPES.LOTTERY],
      desc: ACTIVITY_TYPE_DESCRIPTIONS[ACTIVITY_TYPES.LOTTERY],
    },
    {
      type: ACTIVITY_TYPES.POSTER,
      title: ACTIVITY_TYPE_LABELS[ACTIVITY_TYPES.POSTER],
      desc: ACTIVITY_TYPE_DESCRIPTIONS[ACTIVITY_TYPES.POSTER],
    },
    {
      type: ACTIVITY_TYPES.THIRD_PARTY,
      title: ACTIVITY_TYPE_LABELS[ACTIVITY_TYPES.THIRD_PARTY],
      desc: ACTIVITY_TYPE_DESCRIPTIONS[ACTIVITY_TYPES.THIRD_PARTY],
    },
  ]

  const handleCancel = () => {
    setSelectedType(null)
    onCancel?.()
  }

  const handleConfirm = () => {
    if (selectedType) {
      onConfirm?.(selectedType)
      setSelectedType(null)
    }
  }

  const handleCardClick = (type) => {
    setSelectedType(type)
  }

  return (
    <Modal
      title="选择活动类型"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={720}
      className="activity-type-modal"
      destroyOnHidden
    >
      <div className="activity-type-cards">
        {activityTypes.map((item) => (
          <div
            key={item.type}
            className={`activity-type-card ${selectedType === item.type ? 'selected' : ''}`}
            onClick={() => handleCardClick(item.type)}
          >
            <div className="card-title">{item.title}</div>
            <div className="card-desc">{item.desc}</div>
          </div>
        ))}
      </div>
      <div className="modal-footer">
        <Button onClick={handleCancel}>
          取消
        </Button>
        <Button
          type="primary"
          disabled={!selectedType}
          onClick={handleConfirm}
        >
          立即创建
        </Button>
      </div>
    </Modal>
  )
}

export default ActivityTypeModal
