import { create } from 'zustand'
import { reportApi } from '../services/reportData'

export const useReportStore = create((set) => ({
  downloadingId: null,

  downloadReport: async (reportType, month) => {
    set({ downloadingId: reportType.id })
    try {
      await reportApi.downloadReport(reportType, month)
    } catch (error) {
      throw error
    } finally {
      set({ downloadingId: null })
    }
  },
}))
