import * as XLSX from 'xlsx'
import PptxGenJS from 'pptxgenjs'
import { REPORT_FORMAT } from '../constants/reportTypes'

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// 触发浏览器下载
const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// 生成 Excel 文件
const generateExcel = (reportName, month) => {
  const wb = XLSX.utils.book_new()

  // 模拟数据表
  const data = [
    ['报表名称', reportName],
    ['报表月份', month],
    ['生成时间', new Date().toLocaleString('zh-CN')],
    [],
    ['活动编号', '活动名称', '参与人数', '状态', '创建时间'],
    ['1001', '七夕活动', '3,521', '已结束', '2026-08-01 10:00:00'],
    ['1002', '中秋促销', '2,180', '进行中', '2026-08-10 14:30:00'],
    ['1003', '国庆狂欢', '5,892', '未开始', '2026-09-20 09:00:00'],
    ['1004', '双11预热', '8,234', '未开始', '2026-10-15 08:00:00'],
    ['1005', '圣诞活动', '1,456', '未开始', '2026-12-01 10:00:00'],
  ]

  const ws = XLSX.utils.aoa_to_sheet(data)
  ws['!cols'] = [{ wch: 12 }, { wch: 20 }, { wch: 12 }, { wch: 10 }, { wch: 24 }]
  XLSX.utils.book_append_sheet(wb, ws, '报表数据')

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}

// 生成 PPT 文件
const generatePpt = async (reportName, month) => {
  const pptx = new PptxGenJS()

  // 标题页
  const slide1 = pptx.addSlide()
  slide1.background = { color: 'F7F8FA' }
  slide1.addText(reportName, {
    x: 0.5, y: 1.5, w: 9, h: 1,
    fontSize: 32, bold: true, color: '1F2329', align: 'center',
  })
  slide1.addText(`报表月份：${month}`, {
    x: 0.5, y: 2.5, w: 9, h: 0.5,
    fontSize: 18, color: '646A73', align: 'center',
  })
  slide1.addText(`生成时间：${new Date().toLocaleString('zh-CN')}`, {
    x: 0.5, y: 3.2, w: 9, h: 0.4,
    fontSize: 12, color: '8F959E', align: 'center',
  })

  // 数据概览页
  const slide2 = pptx.addSlide()
  slide2.addText('数据概览', {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 24, bold: true, color: '1F2329',
  })

  // 统计数据卡片
  const stats = [
    { label: '活动总数', value: '28' },
    { label: '参与人数', value: '21,283' },
    { label: '优惠券发放', value: '15,420' },
    { label: '核销率', value: '68.5%' },
  ]
  stats.forEach((stat, i) => {
    const x = 0.5 + i * 2.4
    slide2.addShape('roundRect', {
      x, y: 1.2, w: 2.2, h: 1.5,
      fill: { color: 'FFFFFF' }, line: { color: 'E5E6EB', width: 1 },
      rectRadius: 0.08,
    })
    slide2.addText(stat.value, {
      x, y: 1.35, w: 2.2, h: 0.6,
      fontSize: 28, bold: true, color: '1677FF', align: 'center',
    })
    slide2.addText(stat.label, {
      x, y: 2.0, w: 2.2, h: 0.4,
      fontSize: 12, color: '646A73', align: 'center',
    })
  })

  // 数据明细表
  const slide3 = pptx.addSlide()
  slide3.addText('活动明细', {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 24, bold: true, color: '1F2329',
  })
  slide3.addTable(
    [
      ['活动编号', '活动名称', '参与人数', '状态'],
      ['1001', '七夕活动', '3,521', '已结束'],
      ['1002', '中秋促销', '2,180', '进行中'],
      ['1003', '国庆狂欢', '5,892', '未开始'],
      ['1004', '双11预热', '8,234', '未开始'],
    ],
    {
      x: 0.5, y: 1.2, w: 9, h: 3,
      fontSize: 12, color: '1F2329',
      border: { type: 'solid', color: 'E5E6EB', pt: 1 },
      fill: { color: 'FFFFFF' },
      align: 'left', valign: 'middle',
      colWidth: [1.8, 3.2, 2, 2],
    }
  )

  const result = await pptx.write({ outputType: 'blob' })
  return result
}

export const reportApi = {
  async downloadReport(reportType, month) {
    await delay(800)
    const { name, format } = reportType
    // 文件名格式：年/月+报表名称，如 202608VVIP生日礼领取统计
    const cleanMonth = month.replace(/[/\-年月]/g, '')
    const filename = `${cleanMonth}${name}`

    if (format === REPORT_FORMAT.EXCEL) {
      const blob = generateExcel(name, month)
      triggerDownload(blob, `${filename}.xlsx`)
    } else if (format === REPORT_FORMAT.PPT) {
      const blob = await generatePpt(name, month)
      triggerDownload(blob, `${filename}.pptx`)
    }
  },
}
