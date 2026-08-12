export const ACTIVITY_TYPES = {
  LOTTERY: 'lottery',
  POSTER: 'poster',
  THIRD_PARTY: 'third_party',
}

export const ACTIVITY_TYPE_LABELS = {
  [ACTIVITY_TYPES.LOTTERY]: '抽奖活动',
  [ACTIVITY_TYPES.POSTER]: '海报活动',
  [ACTIVITY_TYPES.THIRD_PARTY]: '第三方活动',
}

export const ACTIVITY_TYPE_DESCRIPTIONS = {
  [ACTIVITY_TYPES.LOTTERY]: '完成社区任务，赢取好礼或抽奖机会',
  [ACTIVITY_TYPES.POSTER]: '常规社区活动（仅展示活动海报）',
  [ACTIVITY_TYPES.THIRD_PARTY]: '跳转到第三方小程序的活动',
}

export const ACTIVITY_STATUS = {
  DRAFT: 'draft',
  NOT_STARTED: 'not_started',
  ONGOING: 'ongoing',
  ENDED: 'ended',
}

export const ACTIVITY_STATUS_LABELS = {
  [ACTIVITY_STATUS.DRAFT]: '草稿',
  [ACTIVITY_STATUS.NOT_STARTED]: '未开始',
  [ACTIVITY_STATUS.ONGOING]: '进行中',
  [ACTIVITY_STATUS.ENDED]: '已结束',
}

export const DISPLAY_STATUS = {
  SHOW: true,
  HIDE: false,
}

export const DISPLAY_STATUS_LABELS = {
  [DISPLAY_STATUS.SHOW]: '显示',
  [DISPLAY_STATUS.HIDE]: '不显示',
}
