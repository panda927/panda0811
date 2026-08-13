import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Form, Input, Button, message, Spin, DatePicker } from 'antd'
import dayjs from 'dayjs'
import ImageUpload from '../../../../../components/ImageUpload'
import { useActivityStore } from '../../../../../store/activityStore'
import { ACTIVITY_STATUS } from '../../../../../constants/activityTypes'

// 适配 antd Form 的日期选择组件
const DateTimePicker = ({ value, onChange }) => {
  return (
    <DatePicker
      showTime
      format="YYYY-MM-DD HH:mm:ss"
      value={value ? dayjs(value) : null}
      onChange={(val) => {
        onChange?.(val ? val.format('YYYY-MM-DD HH:mm:ss') : '')
      }}
      allowClear
      placeholder="请选择时间"
      className="datetime-picker"
    />
  )
}

// 第三方活动配置页面（匹配参考UI）
const ThirdPartyConfig = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const createThirdPartyActivity = useActivityStore(state => state.createThirdPartyActivity)
  const updateActivity = useActivityStore(state => state.updateActivity)
  const fetchActivityDetail = useActivityStore(state => state.fetchActivityDetail)

  const activityId = searchParams.get('id')

  useEffect(() => {
    // 默认时间：当前到7天后
    const now = dayjs()
    form.setFieldsValue({
      startTime: now.format('YYYY-MM-DD HH:mm:ss'),
      endTime: now.add(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
      displayStatus: true,
    })

    if (activityId) {
      setIsEdit(true)
      loadDetail(activityId)
    }
  }, [activityId])

  const loadDetail = async (id) => {
    setLoading(true)
    try {
      const detail = await fetchActivityDetail(id)
      form.setFieldsValue({
        activityName: detail.activityName || '',
        startTime: detail.startTime || '',
        endTime: detail.endTime || '',
        bannerUrl: detail.bannerUrl || '',
        appId: detail.appId || '',
        miniProgramPath: detail.miniProgramPath || '',
        displayStatus: detail.displayStatus !== false,
      })
    } catch (error) {
      message.error('加载活动详情失败')
    } finally {
      setLoading(false)
    }
  }

  const validateAppId = (_, value) => {
    if (!value || !value.trim()) {
      return Promise.resolve()
    }
    const len = value.trim().length
    if (len < 18 || len > 20) {
      return Promise.reject(new Error('AppID格式不正确（通常为18-20位字符）'))
    }
    return Promise.resolve()
  }

  const validateMiniProgramPath = (_, value) => {
    if (!value || !value.trim()) {
      return Promise.reject(new Error('请输入跳转小程序路径'))
    }
    if (!value.trim().startsWith('/')) {
      return Promise.reject(new Error('小程序路径必须以 / 开头'))
    }
    return Promise.resolve()
  }

  const buildPayload = (values, isDraft = false) => {
    return {
      activityName: (values.activityName || '').trim() || '未命名第三方活动',
      bannerUrl: values.bannerUrl,
      appId: (values.appId || '').trim(),
      miniProgramPath: (values.miniProgramPath || '').trim(),
      startTime: values.startTime,
      endTime: values.endTime,
      topicId: null,
      topicName: '',
      displayStatus: values.displayStatus !== false,
      status: isDraft ? ACTIVITY_STATUS.DRAFT : undefined,
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)
      const data = buildPayload(values, false)
      if (isEdit) {
        await updateActivity(activityId, data)
        message.success('活动更新成功')
      } else {
        await createThirdPartyActivity(data)
        message.success('活动创建成功')
      }
      navigate('/marketing/activity/list')
    } catch (error) {
      if (error?.errorFields) {
        message.error('请完善必填项')
      } else {
        message.error(isEdit ? '更新失败' : '创建失败')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => navigate('/marketing/activity/list')

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <>
      <div className="config-page-content" style={{ paddingBottom: '80px' }}>
        <Form form={form} layout="horizontal" className="simple-form" requiredMark="required">
          {/* 活动名称 */}
          <Form.Item
            name="activityName"
            label="活动名称"
            rules={[{ required: true, message: '请输入活动名称' }]}
            className="simple-form-item"
          >
            <Input
              placeholder="请输入活动名称"
              maxLength={50}
              className="form-input"
            />
          </Form.Item>

          {/* 活动时间 */}
          <Form.Item
            label="活动时间"
            required
            className="simple-form-item"
          >
            <div className="range-picker-wrap">
              <Form.Item
                name="startTime"
                noStyle
                rules={[{ required: true, message: '请选择开始时间' }]}
              >
                <DateTimePicker />
              </Form.Item>
              <span className="separator">~</span>
              <Form.Item
                name="endTime"
                noStyle
                rules={[{ required: true, message: '请选择结束时间' }]}
              >
                <DateTimePicker />
              </Form.Item>
            </div>
          </Form.Item>

          {/* 活动列表banner */}
          <Form.Item
            name="bannerUrl"
            label="活动列表banner"
            rules={[{ required: true, message: '请上传活动列表banner' }]}
            className="simple-form-item"
            extra="建议图片尺寸：750*270px；支持jpg、png图片格式"
          >
            <ImageUpload shape="banner" />
          </Form.Item>

          {/* 分组标题 - 跳转配置 */}
          <div className="form-group-title">banner跳转配置</div>

          {/* 小程序AppID */}
          <Form.Item
            name="appId"
            label="小程序AppID"
            rules={[{ validator: validateAppId }]}
            className="simple-form-item"
            extra="请输入要跳转的目标小程序AppID"
          >
            <Input
              placeholder="请输入小程序AppID"
              maxLength={30}
              className="form-input"
            />
          </Form.Item>

          {/* 跳转路径 */}
          <Form.Item
            name="miniProgramPath"
            label="跳转路径"
            rules={[{ required: true, message: '请输入跳转路径' }, { validator: validateMiniProgramPath }]}
            className="simple-form-item"
            extra="请输入跳转页面的小程序路径"
          >
            <Input
              placeholder="请输入跳转页面的小程序路径"
              className="form-input"
            />
          </Form.Item>
        </Form>
      </div>

      {/* 底部固定按钮栏 */}
      <div className="form-footer-bar">
        <div className="footer-right">
          <Button className="btn-default" onClick={handleCancel}>
            返回
          </Button>
          <Button
            type="primary"
            className="btn-primary"
            onClick={handleSubmit}
            loading={submitting}
          >
            {isEdit ? '确认修改' : '确认'}
          </Button>
        </div>
      </div>
    </>
  )
}

export default ThirdPartyConfig
