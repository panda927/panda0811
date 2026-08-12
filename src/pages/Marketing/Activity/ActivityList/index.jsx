import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Tag, Space, Pagination, message, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import ActivityTypeModal from '../../../../components/ActivityTypeModal'
import { useActivityStore } from '../../../../store/activityStore'
import {
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_STATUS,
  ACTIVITY_STATUS_LABELS,
  DISPLAY_STATUS,
  DISPLAY_STATUS_LABELS,
} from '../../../../constants/activityTypes'

const ActivityList = () => {
  const navigate = useNavigate()
  const [modalVisible, setModalVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const activityList = useActivityStore(state => state.activityList)
  const total = useActivityStore(state => state.total)
  const loading = useActivityStore(state => state.loading)
  const fetchActivityList = useActivityStore(state => state.fetchActivityList)
  const toggleDisplay = useActivityStore(state => state.toggleDisplay)

  useEffect(() => {
    loadData()
  }, [currentPage, pageSize])

  const loadData = () => {
    fetchActivityList({ page: currentPage, pageSize })
  }

  const handleCreateActivity = () => {
    setModalVisible(true)
  }

  const handleSelectType = (type) => {
    setModalVisible(false)
    navigate(`/marketing/activity/config?type=${type}`)
  }

  const handleView = (record) => {
    navigate(`/marketing/activity/config?id=${record.id}&type=${record.activityType}`)
  }

  const handleToggleDisplay = async (record) => {
    try {
      const newStatus = !record.displayStatus
      await toggleDisplay(record.id, newStatus)
      message.success(newStatus ? '已开启显示' : '已关闭显示')
      loadData()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handlePromote = (record) => {
    message.info(`推广活动：${record.activityName}`)
  }

  const getStatusTag = (status) => {
    const colorMap = {
      [ACTIVITY_STATUS.DRAFT]: 'default',
      [ACTIVITY_STATUS.NOT_STARTED]: 'blue',
      [ACTIVITY_STATUS.ONGOING]: 'green',
      [ACTIVITY_STATUS.ENDED]: 'default',
    }
    const dotColorMap = {
      [ACTIVITY_STATUS.DRAFT]: '#d9d9d9',
      [ACTIVITY_STATUS.NOT_STARTED]: '#1677ff',
      [ACTIVITY_STATUS.ONGOING]: '#52c41a',
      [ACTIVITY_STATUS.ENDED]: '#d9d9d9',
    }
    return (
      <span>
        <span
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: dotColorMap[status],
            marginRight: '6px',
          }}
        />
        {ACTIVITY_STATUS_LABELS[status]}
      </span>
    )
  }

  const getDisplayStatusTag = (displayStatus) => {
    return (
      <span style={{ color: displayStatus ? '#52c41a' : '#ff4d4f' }}>
        {DISPLAY_STATUS_LABELS[displayStatus]}
      </span>
    )
  }

  const columns = [
    {
      title: '活动编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '活动名称',
      dataIndex: 'activityName',
      key: 'activityName',
      width: 180,
    },
    {
      title: '话题名称',
      dataIndex: 'topicName',
      key: 'topicName',
      width: 120,
    },
    {
      title: '活动时间',
      dataIndex: 'activityTime',
      key: 'activityTime',
      width: 220,
      render: (_, record) => (
        <div>
          <div>{record.startTime}</div>
          <div style={{ color: '#999' }}>~</div>
          <div>{record.endTime}</div>
        </div>
      ),
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status),
    },
    {
      title: '小程序显示状态',
      dataIndex: 'displayStatus',
      key: 'displayStatus',
      width: 140,
      render: (displayStatus) => getDisplayStatusTag(displayStatus),
    },
    {
      title: '活动类型',
      dataIndex: 'activityType',
      key: 'activityType',
      width: 120,
      render: (type) => ACTIVITY_TYPE_LABELS[type],
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <a onClick={() => handleView(record)}>查看</a>
          <Popconfirm
            title={record.displayStatus ? '确定关闭显示吗？' : '确定开启显示吗？'}
            onConfirm={() => handleToggleDisplay(record)}
            okText="确定"
            cancelText="取消"
          >
            <a>{record.displayStatus ? '关闭显示' : '开启显示'}</a>
          </Popconfirm>
          <a onClick={() => handlePromote(record)}>推广</a>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: '16px', color: '#666' }}>
        结果：{total}条
      </div>
      <div className="create-btn-container">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleCreateActivity}
        >
          创建活动
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={activityList}
        rowKey="id"
        loading={loading}
        pagination={false}
        bordered={false}
        style={{ background: '#fff' }}
        rowClassName={(record, index) => index % 2 === 1 ? 'table-row-striped' : ''}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `共 ${total} 条`}
          onChange={(page, size) => {
            setCurrentPage(page)
            setPageSize(size)
          }}
        />
      </div>
      <ActivityTypeModal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleSelectType}
      />
      <style>{`
        .ant-table-thead > tr > th {
          background: #fafafa !important;
          font-weight: 600;
        }
        .table-row-striped {
          background: #fafafa;
        }
        .ant-table-tbody > tr:hover > td {
          background: #e6f4ff !important;
        }
      `}</style>
    </div>
  )
}

export default ActivityList
