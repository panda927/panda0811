import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  message,
  Card,
  Spin,
} from 'antd'
import dayjs from 'dayjs'
import ImageUpload from '../../../../../components/ImageUpload'
import { useActivityStore } from '../../../../../store/activityStore'
import { ACTIVITY_STATUS } from '../../../../../constants/activityTypes'

const { RangePicker } = DatePicker
const { Option } = Select
const { TextArea } = Input

const ThirdPartyConfig = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const topicList = useActivityStore(state => state.topicList)
  const topicLoading = useActivityStore(state => state.topicLoading)
  const fetchTopicList = useActivityStore(state => state.fetchTopicList)
  const createThirdPartyActivity = useActivityStore(state => state.createThirdPartyActivity)
  const updateActivity = useActivityStore(state => state.updateActivity)
  const fetchActivityDetail = useActivityStore(state => state.fetchActivityDetail)

  const activityId = searchParams.get('id')

  useEffect(() => {
    loadTopics()
    if (activityId) {
      setIsEdit(true)
      loadActivityDetail(activityId)
    } else {
      form.setFieldsValue({
        activityTime: [dayjs(), dayjs().add(7, 'day')],
      })
    }
  }, [activityId])

  const loadTopics = async () => {
    try {
      await fetchTopicList()
    } catch (error) {
      message.error('加载话题列表失败')
    }
  }

  const loadActivityDetail = async (id) => {
    setLoading(true)
    try {
      const detail = await fetchActivityDetail(id)
      form.setFieldsValue({
        activityName: detail.activityName,
        bannerUrl: detail.bannerUrl,
        miniProgramPath: detail.miniProgramPath,
        activityTime: detail.startTime && detail.endTime
          ? [dayjs(detail.startTime), dayjs(detail.endTime)]
          : undefined,
        topicId: detail.topicId,
      })
    } catch (error) {
      message.error('加载活动详情失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values, isDraft = false) => {
    setSubmitting(true)
    try {
      const [startTime, endTime] = values.activityTime
      const selectedTopic = topicList.find(t => t.id === values.topicId)

      const data = {
        activityName: values.activityName,
        bannerUrl: values.bannerUrl,
        miniProgramPath: values.miniProgramPath,
        startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
        endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
        topicId: values.topicId,
        topicName: selectedTopic?.name || '',
        status: isDraft ? ACTIVITY_STATUS.DRAFT : undefined,
      }

      if (isEdit) {
        await updateActivity(activityId, data)
        message.success('活动更新成功')
      } else {
        await createThirdPartyActivity(data)
        message.success(isDraft ? '草稿保存成功' : '活动创建成功')
      }

      navigate('/marketing/activity/list')
    } catch (error) {
      message.error(isEdit ? '更新失败' : '创建失败')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePublish = () => {
    form.validateFields().then(values => {
      handleSubmit(values, false)
    })
  }

  const handleSaveDraft = () => {
    form.validateFields().then(values => {
      handleSubmit(values, true)
    })
  }

  const handleCancel = () => {
    navigate('/marketing/activity/list')
  }

  const handleTopicSearch = (value) => {
    fetchTopicList({ keyword: value })
  }

  const validateMiniProgramPath = (_, value) => {
    if (!value) {
      return Promise.resolve()
    }
    if (!value.startsWith('/')) {
      return Promise.reject(new Error('小程序路径必须以 / 开头'))
    }
    return Promise.resolve()
  }

  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day')
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="config-form-container">
      <Card title={isEdit ? '编辑第三方活动' : '创建第三方活动'} bordered={false}>
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          initialValues={{}}
        >
          <Form.Item
            name="activityName"
            label="活动名称"
            rules={[
              { required: true, message: '请输入活动名称' },
              { max: 50, message: '活动名称不能超过50个字符' },
            ]}
          >
            <Input placeholder="请输入活动名称" size="large" />
          </Form.Item>

          <Form.Item
            name="bannerUrl"
            label="活动列表banner"
            rules={[{ required: true, message: '请上传活动banner' }]}
          >
            <ImageUpload
              tip="建议尺寸 750x300px，支持JPG/PNG格式，大小不超过2MB"
            />
          </Form.Item>

          <Form.Item
            name="miniProgramPath"
            label="跳转小程序路径"
            rules={[
              { required: true, message: '请输入跳转小程序路径' },
              { validator: validateMiniProgramPath },
            ]}
            extra="请填写小程序内的跳转路径，例如：/pages/activity/index?id=123"
          >
            <Input
              placeholder="请输入小程序页面路径，例如：/pages/activity/index?id=123"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="activityTime"
            label="活动时间"
            rules={[{ required: true, message: '请选择活动开始和结束时间' }]}
          >
            <RangePicker
              showTime={{
                format: 'HH:mm:ss',
              }}
              format="YYYY-MM-DD HH:mm:ss"
              size="large"
              style={{ width: '100%' }}
              disabledDate={disabledDate}
              placeholder={['开始时间', '结束时间']}
            />
          </Form.Item>

          <Form.Item
            name="topicId"
            label="关联话题"
            rules={[{ required: true, message: '请选择关联话题' }]}
          >
            <Select
              placeholder="请选择关联话题"
              size="large"
              showSearch
              loading={topicLoading}
              filterOption={false}
              onSearch={handleTopicSearch}
              notFoundContent={topicLoading ? <Spin size="small" /> : null}
            >
              {topicList.map(topic => (
                <Option key={topic.id} value={topic.id}>
                  {topic.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            wrapperCol={{ offset: 6, span: 14 }}
          >
            <div className="form-footer">
              <Button size="large" onClick={handleCancel}>
                取消
              </Button>
              <Button
                size="large"
                onClick={handleSaveDraft}
                loading={submitting}
              >
                保存草稿
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={handlePublish}
                loading={submitting}
              >
                {isEdit ? '保存修改' : '立即发布'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default ThirdPartyConfig
