export const REPORT_FORMAT = {
  EXCEL: 'excel',
  PPT: 'ppt',
}

export const REPORT_FORMAT_LABELS = {
  [REPORT_FORMAT.EXCEL]: 'Excel',
  [REPORT_FORMAT.PPT]: 'PPT',
}

export const REPORT_TYPES = [
  { id: 1, name: 'VVIP生日礼领取统计', format: REPORT_FORMAT.EXCEL, description: 'VVIP生日礼领取数据统计' },
  { id: 2, name: '生日礼Tracking', format: REPORT_FORMAT.EXCEL, description: '生日礼追踪数据' },
  { id: 3, name: 'VVIP生日名单', format: REPORT_FORMAT.EXCEL, description: 'VVIP生日用户名单' },
  { id: 4, name: '企微绑定&任务报告', format: REPORT_FORMAT.EXCEL, description: '企业微信绑定及任务数据' },
  { id: 5, name: 'Lifecycle Communication Tracking Report', format: REPORT_FORMAT.EXCEL, description: '生命周期沟通追踪报告' },
  { id: 6, name: '社区月报', format: REPORT_FORMAT.EXCEL, description: '社区月度运营数据' },
  { id: 7, name: '社区MA消息发送及追踪', format: REPORT_FORMAT.EXCEL, description: '社区营销自动化消息发送与追踪' },
  { id: 8, name: '会员小程序报告', format: REPORT_FORMAT.EXCEL, description: '会员小程序运营数据' },
  { id: 9, name: 'CRM Date Overview（会员中心+社区）', format: REPORT_FORMAT.PPT, description: 'CRM数据概览（会员中心+社区）' },
  { id: 10, name: 'MGM会员邀请有礼', format: REPORT_FORMAT.EXCEL, description: 'MGM会员邀请活动数据' },
  { id: 11, name: 'CK CRM-Adult Section Report', format: REPORT_FORMAT.EXCEL, description: 'CK CRM成人板块报告' },
  { id: 12, name: 'CK CRM- Points Report Format', format: REPORT_FORMAT.EXCEL, description: 'CK CRM积分报告' },
  { id: 13, name: 'Adhoc Communication Tracking Report', format: REPORT_FORMAT.EXCEL, description: '临时沟通追踪报告' },
  { id: 14, name: 'by门店复购率', format: REPORT_FORMAT.EXCEL, description: '按门店维度复购率数据' },
  { id: 15, name: 'J&U Cross Selling Monthly Report', format: REPORT_FORMAT.EXCEL, description: 'J&U交叉销售月度报告' },
]
