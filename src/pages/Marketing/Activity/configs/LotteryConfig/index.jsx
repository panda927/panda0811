import React from 'react'
import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

const LotteryConfig = () => {
  const navigate = useNavigate()

  return (
    <div className="config-form-container">
      <Result
        status="info"
        title="抽奖活动配置"
        subTitle="抽奖活动配置功能开发中，敬请期待..."
        extra={
          <Button type="primary" onClick={() => navigate('/marketing/activity/list')}>
            返回活动列表
          </Button>
        }
      />
    </div>
  )
}

export default LotteryConfig
