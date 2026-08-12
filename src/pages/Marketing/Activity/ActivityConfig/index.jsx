import React from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import LotteryConfig from '../configs/LotteryConfig'
import PosterConfig from '../configs/PosterConfig'
import ThirdPartyConfig from '../configs/ThirdPartyConfig'
import { ACTIVITY_TYPES } from '../../../../constants/activityTypes'

const ActivityConfig = () => {
  const [searchParams] = useSearchParams()
  const activityType = searchParams.get('type')

  const renderConfigComponent = () => {
    switch (activityType) {
      case ACTIVITY_TYPES.LOTTERY:
        return <LotteryConfig />
      case ACTIVITY_TYPES.POSTER:
        return <PosterConfig />
      case ACTIVITY_TYPES.THIRD_PARTY:
        return <ThirdPartyConfig />
      default:
        return <Navigate to="/marketing/activity/list" replace />
    }
  }

  return renderConfigComponent()
}

export default ActivityConfig
