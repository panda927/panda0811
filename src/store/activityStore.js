import { create } from 'zustand'
import { activityApi } from '../services/mockData'

export const useActivityStore = create((set, get) => ({
  activityList: [],
  total: 0,
  loading: false,
  currentActivity: null,
  topicList: [],
  topicLoading: false,

  fetchActivityList: async (params = {}) => {
    set({ loading: true })
    try {
      const result = await activityApi.getActivityList(params)
      set({
        activityList: result.list,
        total: result.total,
        loading: false,
      })
      return result
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  fetchActivityDetail: async (id) => {
    set({ loading: true })
    try {
      const activity = await activityApi.getActivityDetail(id)
      set({ currentActivity: activity, loading: false })
      return activity
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  createThirdPartyActivity: async (data) => {
    set({ loading: true })
    try {
      const result = await activityApi.createThirdPartyActivity(data)
      set({ loading: false })
      return result
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  updateActivity: async (id, data) => {
    set({ loading: true })
    try {
      const result = await activityApi.updateActivity(id, data)
      set({ loading: false })
      return result
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  toggleDisplay: async (id, displayStatus) => {
    try {
      await activityApi.toggleActivityDisplay(id, displayStatus)
      const { activityList } = get()
      const updatedList = activityList.map(item =>
        item.id === id ? { ...item, displayStatus } : item
      )
      set({ activityList: updatedList })
      return { success: true }
    } catch (error) {
      throw error
    }
  },

  fetchTopicList: async (params = {}) => {
    set({ topicLoading: true })
    try {
      const result = await activityApi.getTopicList(params)
      set({ topicList: result.list, topicLoading: false })
      return result
    } catch (error) {
      set({ topicLoading: false })
      throw error
    }
  },

  uploadImage: async (file) => {
    return await activityApi.uploadImage(file)
  },

  setCurrentActivity: (activity) => {
    set({ currentActivity: activity })
  },

  clearCurrentActivity: () => {
    set({ currentActivity: null })
  },
}))
