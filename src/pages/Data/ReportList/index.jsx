import React, { useState } from 'react'
import { Button, Modal, DatePicker, Input, message } from 'antd'
import { DownloadOutlined, FileExcelOutlined, FilePptOutlined, SearchOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { REPORT_TYPES, REPORT_FORMAT, REPORT_FORMAT_LABELS } from '../../../constants/reportTypes'
import { useReportStore } from '../../../store/reportStore'

const { MonthPicker } = DatePicker

const ReportList = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const downloadReport = useReportStore(state => state.downloadReport)
  const downloadingId = useReportStore(state => state.downloadingId)

  const filteredReports = REPORT_TYPES.filter(report =>
    report.name.includes(searchKeyword)
  )

  const handleOpenModal = (report) => {
    setSelectedReport(report)
    setSelectedMonth(null)
    setModalOpen(true)
  }

  const handleModalOk = async () => {
    if (!selectedMonth) {
      message.warning('请先选择下载月份')
      return
    }
    const monthStr = selectedMonth.format('YYYY-MM')
    setModalOpen(false)
    try {
      await downloadReport(selectedReport, monthStr)
      message.success(`${selectedReport.name}下载成功`)
    } catch (error) {
      message.error('下载失败，请重试')
    }
  }

  const getFormatIcon = (format) => {
    return format === REPORT_FORMAT.EXCEL ? <FileExcelOutlined /> : <FilePptOutlined />
  }

  const getFormatColor = (format) => {
    return format === REPORT_FORMAT.EXCEL ? '#52C41A' : '#FA8C16'
  }

  return (
    <div className="report-page-content">
      <div className="report-search-bar">
        <span className="report-search-label">报表名称：</span>
        <Input.Group compact className="report-search-group">
          <Input
            placeholder="根据报表名称搜索"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            allowClear
            className="report-search-input"
          />
          <Button type="primary" className="report-search-btn">
            搜索
          </Button>
        </Input.Group>
      </div>
      <div className="report-grid">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => {
            const isDownloading = downloadingId === report.id
            return (
              <div key={report.id} className={`report-card report-card--${report.format}`}>
              <div className="report-card-accent" />
              <div className="report-card-header">
                <span
                  className="report-card-format"
                  style={{
                    color: getFormatColor(report.format),
                    borderColor: getFormatColor(report.format),
                    background: report.format === REPORT_FORMAT.EXCEL ? '#F6FFED' : '#FFF7E6',
                  }}
                >
                  {getFormatIcon(report.format)}
                  {REPORT_FORMAT_LABELS[report.format]}
                </span>
              </div>
              <div className="report-card-body">
                <h3 className="report-card-title">{report.name}</h3>
              </div>
              <div className="report-card-footer">
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  loading={isDownloading}
                  disabled={isDownloading}
                  onClick={() => handleOpenModal(report)}
                  className="report-card-download-btn"
                >
                  {isDownloading ? '下载中' : '下载'}
                </Button>
              </div>
            </div>
            )
          })
        ) : (
          <div className="report-empty">未找到匹配的报表</div>
        )}
      </div>

      <Modal
        title="选择下载月份"
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        okText="确认下载"
        cancelText="取消"
        width={420}
        centered
      >
        {selectedReport && (
          <div className="report-modal-content">
            <div className="report-modal-info">
              <span
                className="report-card-format"
                style={{
                  color: getFormatColor(selectedReport.format),
                  borderColor: getFormatColor(selectedReport.format),
                  background: selectedReport.format === REPORT_FORMAT.EXCEL ? '#F6FFED' : '#FFF7E6',
                }}
              >
                {getFormatIcon(selectedReport.format)}
                {REPORT_FORMAT_LABELS[selectedReport.format]}
              </span>
              <span className="report-modal-name">{selectedReport.name}</span>
            </div>
            <div className="report-modal-picker">
              <MonthPicker
                format="YYYY年M月"
                placeholder="请选择月份"
                value={selectedMonth}
                onChange={setSelectedMonth}
                defaultPickerValue={dayjs()}
                disabledDate={(current) => current && current.isAfter(dayjs().endOf('month'))}
                style={{ width: '100%' }}
                size="large"
                allowClear
              />
              <div className="report-modal-tip">选择需要下载的报表月份</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ReportList
