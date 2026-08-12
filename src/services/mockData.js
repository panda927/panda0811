import dayjs from 'dayjs'
import { ACTIVITY_TYPES, ACTIVITY_STATUS, DISPLAY_STATUS } from '../constants/activityTypes'

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

let mockActivities = [
  {
    id: 12,
    activityName: '七夕活动',
    activityType: ACTIVITY_TYPES.POSTER,
    topicId: 1,
    topicName: '共赴心动',
    startTime: '2026-08-05 15:27:23',
    endTime: '2026-08-09 15:27:23',
    displayStatus: DISPLAY_STATUS.SHOW,
    status: ACTIVITY_STATUS.ENDED,
    bannerUrl: 'https://picsum.photos/750/300?random=1',
    miniProgramPath: '',
    createTime: '2026-08-01 10:00:00',
  },
  {
    id: 10,
    activityName: '0625抽奖活动',
    activityType: ACTIVITY_TYPES.LOTTERY,
    topicId: 2,
    topicName: '新款上市',
    startTime: '2026-06-25 14:33:58',
    endTime: '2026-06-30 14:33:58',
    displayStatus: DISPLAY_STATUS.SHOW,
    status: ACTIVITY_STATUS.ENDED,
    bannerUrl: 'https://picsum.photos/750/300?random=2',
    miniProgramPath: '',
    createTime: '2026-06-20 10:00:00',
  },
  {
    id: 9,
    activityName: '有跳转的活动25',
    activityType: ACTIVITY_TYPES.POSTER,
    topicId: 3,
    topicName: '马力全开',
    startTime: '2026-06-25 14:24:32',
    endTime: '2026-06-30 14:24:32',
    displayStatus: DISPLAY_STATUS.SHOW,
    status: ACTIVITY_STATUS.ENDED,
    bannerUrl: 'https://picsum.photos/750/300?random=3',
    miniProgramPath: '/pages/activity/detail?id=25',
    createTime: '2026-06-20 09:00:00',
  },
  {
    id: 6,
    activityName: '海报活动0624',
    activityType: ACTIVITY_TYPES.POSTER,
    topicId: 3,
    topicName: '马力全开',
    startTime: '2026-06-24 14:47:01',
    endTime: '2026-06-30 14:47:01',
    displayStatus: DISPLAY_STATUS.SHOW,
    status: ACTIVITY_STATUS.ENDED,
    bannerUrl: 'https://picsum.photos/750/300?random=4',
    miniProgramPath: '',
    createTime: '2026-06-20 08:00:00',
  },
  {
    id: 4,
    activityName: '共赴心动',
    activityType: ACTIVITY_TYPES.LOTTERY,
    topicId: 1,
    topicName: '共赴心动',
    startTime: '2026-06-12 14:46:39',
    endTime: '2026-06-30 14:46:39',
    displayStatus: DISPLAY_STATUS.HIDE,
    status: ACTIVITY_STATUS.ENDED,
    bannerUrl: 'https://picsum.photos/750/300?random=5',
    miniProgramPath: '',
    createTime: '2026-06-10 10:00:00',
  },
  {
    id: 2,
    activityName: '马力全开C好运',
    activityType: ACTIVITY_TYPES.LOTTERY,
    topicId: 3,
    topicName: '马力全开',
    startTime: '2026-06-11 15:04:34',
    endTime: '2026-06-30 15:04:34',
    displayStatus: DISPLAY_STATUS.SHOW,
    status: ACTIVITY_STATUS.ENDED,
    bannerUrl: 'https://picsum.photos/750/300?random=6',
    miniProgramPath: '',
    createTime: '2026-06-08 10:00:00',
  },
  {
    id: 1,
    activityName: '城市达人计划',
    activityType: ACTIVITY_TYPES.LOTTERY,
    topicId: 4,
    topicName: '城市达人',
    startTime: '2026-06-11 14:53:05',
    endTime: '2026-06-12 10:53:05',
    displayStatus: DISPLAY_STATUS.SHOW,
    status: ACTIVITY_STATUS.ENDED,
    bannerUrl: 'https://picsum.photos/750/300?random=7',
    miniProgramPath: '',
    createTime: '2026-06-05 10:00:00',
  },
]

const mockTopics = [
  { id: 1, name: '共赴心动' },
  { id: 2, name: '新款上市' },
  { id: 3, name: '马力全开' },
  { id: 4, name: '城市达人' },
  { id: 5, name: '夏日狂欢' },
  { id: 6, name: '周年庆典' },
  { id: 7, name: '新人专享' },
  { id: 8, name: '会员日' },
]

let nextId = 13

const calculateActivityStatus = (startTime, endTime) => {
  const now = dayjs()
  const start = dayjs(startTime)
  const end = dayjs(endTime)

  if (now.isBefore(start)) {
    return ACTIVITY_STATUS.NOT_STARTED
  } else if (now.isAfter(end)) {
    return ACTIVITY_STATUS.ENDED
  } else {
    return ACTIVITY_STATUS.ONGOING
  }
}

export const activityApi = {
  async getActivityList(params = {}) {
    await delay()
    let list = [...mockActivities].map(activity => ({
      ...activity,
      status: calculateActivityStatus(activity.startTime, activity.endTime),
    }))

    if (params.keyword) {
      list = list.filter(item => 
        item.activityName.includes(params.keyword) ||
        item.topicName.includes(params.keyword)
      )
    }

    if (params.activityType) {
      list = list.filter(item => item.activityType === params.activityType)
    }

    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const total = list.length
    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
      list: list.slice(start, end),
      total,
      page,
      pageSize,
    }
  },

  async getActivityDetail(id) {
    await delay()
    const activity = mockActivities.find(item => item.id === Number(id))
    if (!activity) {
      throw new Error('活动不存在')
    }
    return { ...activity }
  },

  async createThirdPartyActivity(data) {
    await delay()
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const newActivity = {
      id: nextId++,
      activityType: ACTIVITY_TYPES.THIRD_PARTY,
      displayStatus: DISPLAY_STATUS.SHOW,
      status: data.status || ACTIVITY_STATUS.NOT_STARTED,
      createTime: now,
      updateTime: now,
      ...data,
    }
    mockActivities.unshift(newActivity)
    return { ...newActivity }
  },

  async updateActivity(id, data) {
    await delay()
    const index = mockActivities.findIndex(item => item.id === Number(id))
    if (index === -1) {
      throw new Error('活动不存在')
    }
    mockActivities[index] = {
      ...mockActivities[index],
      ...data,
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }
    return { ...mockActivities[index] }
  },

  async toggleActivityDisplay(id, displayStatus) {
    await delay()
    const index = mockActivities.findIndex(item => item.id === Number(id))
    if (index === -1) {
      throw new Error('活动不存在')
    }
    mockActivities[index].displayStatus = displayStatus
    return { success: true }
  },

  async deleteActivity(id) {
    await delay()
    const index = mockActivities.findIndex(item => item.id === Number(id))
    if (index === -1) {
      throw new Error('活动不存在')
    }
    mockActivities.splice(index, 1)
    return { success: true }
  },

  async getTopicList(params = {}) {
    await delay(200)
    let list = [...mockTopics]
    if (params.keyword) {
      list = list.filter(item => item.name.includes(params.keyword))
    }
    return { list, total: list.length }
  },

  async uploadImage(file) {
    await delay(1000)
    const randomId = Math.floor(Math.random() * 1000)
    return {
      url: `https://picsum.photos/750/300?random=${randomId}`,
      name: file.name || 'banner.jpg',
    }
  },
}
