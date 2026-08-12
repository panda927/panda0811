import React, { useState } from 'react'
import { Upload, message, Modal } from 'antd'
import { PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { useActivityStore } from '../../store/activityStore'

const ImageUpload = ({ value, onChange, tip, aspectRatio = 750 / 300 }) => {
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const uploadImage = useActivityStore(state => state.uploadImage)

  const handleChange = async (info) => {
    const { file } = info
    
    if (file.status === 'uploading') {
      return
    }

    if (file.originFileObj) {
      try {
        message.loading({ content: '上传中...', key: 'upload' })
        const result = await uploadImage(file.originFileObj)
        onChange?.(result.url)
        message.success({ content: '上传成功', key: 'upload' })
      } catch (error) {
        message.error({ content: '上传失败', key: 'upload' })
      }
    }
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这张图片吗？',
      onOk: () => {
        onChange?.('')
      },
    })
  }

  const handlePreview = () => {
    setPreviewImage(value)
    setPreviewVisible(true)
  }

  const uploadButton = (
    <div className="upload-placeholder">
      <PlusOutlined />
      <div className="upload-text">上传图片</div>
    </div>
  )

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('只能上传图片文件！')
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB！')
      return false
    }
    return false
  }

  return (
    <div className="image-upload-container">
      <Upload
        name="file"
        listType="picture-card"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        accept="image/*"
      >
        {value ? (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <img
              src={value}
              alt="banner"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                opacity: 0,
                transition: 'opacity 0.3s',
                borderRadius: '8px',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
            >
              <EyeOutlined
                style={{ fontSize: '20px', color: '#fff', cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation()
                  handlePreview()
                }}
              />
              <DeleteOutlined
                style={{ fontSize: '20px', color: '#fff', cursor: 'pointer' }}
                onClick={handleDelete}
              />
            </div>
          </div>
        ) : (
          uploadButton
        )}
      </Upload>
      {tip && <div className="upload-tip">{tip}</div>}
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        title="图片预览"
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  )
}

export default ImageUpload
