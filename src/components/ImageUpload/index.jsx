import React, { useState } from 'react'
import { Upload, message, Modal, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useActivityStore } from '../../store/activityStore'

// shape: 'square' (100x100) | 'banner' (320x88)
const ImageUpload = ({ value, onChange, tip, shape = 'square' }) => {
  const [previewVisible, setPreviewVisible] = useState(false)
  const [uploading, setUploading] = useState(false)
  const uploadImage = useActivityStore(state => state.uploadImage)

  const isBanner = shape === 'banner'

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

  const handlePreview = (e) => {
    e.stopPropagation()
    setPreviewVisible(true)
  }

  const beforeUpload = async (file) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('只能上传图片文件！')
      return Upload.LIST_IGNORE
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB！')
      return Upload.LIST_IGNORE
    }

    // 直接在 beforeUpload 中处理上传
    setUploading(true)
    try {
      message.loading({ content: '上传中...', key: 'upload' })
      const result = await uploadImage(file)
      onChange?.(result.url)
      message.success({ content: '上传成功', key: 'upload' })
    } catch (error) {
      message.error({ content: '上传失败', key: 'upload' })
    } finally {
      setUploading(false)
    }
    // 返回 false 阻止 antd 自动上传
    return false
  }

  const boxClass = isBanner ? 'banner-upload-box' : 'image-upload-box'
  const previewClass = isBanner ? 'banner-preview-box' : 'image-preview-box'

  return (
    <div className="image-upload-container">
      <Upload
        name="file"
        showUploadList={false}
        beforeUpload={beforeUpload}
        accept="image/*"
        openFileDialogOnClick={true}
      >
        {value ? (
          <div className={previewClass} onClick={(e) => e.stopPropagation()}>
            <img src={value} alt="preview" />
            <div className="image-preview-mask">
              <span onClick={handlePreview}>预览</span>
              <span onClick={handleDelete}>删除</span>
            </div>
          </div>
        ) : uploading ? (
          <div className={boxClass}>
            <Spin size="small" />
          </div>
        ) : (
          <div className={boxClass}>
            <PlusOutlined className="upload-plus" />
            <span className="upload-text">上传图片</span>
          </div>
        )}
      </Upload>
      {tip && <div className="form-tip">{tip}</div>}
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        title="图片预览"
      >
        <img alt="preview" style={{ width: '100%' }} src={value} />
      </Modal>
    </div>
  )
}

export default ImageUpload
