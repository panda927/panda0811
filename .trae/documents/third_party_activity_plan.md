# 社区营销活动优化 - 新增"第三方活动"类型实施计划

## 一、需求分析

### 1.1 现有功能概述
根据提供的截图，当前系统是一个社区营销管理后台，包含：
- 左侧导航栏：营销自动化、授权管理、微信模板管理、短信模板、优惠券管理、活动管理（活动列表、奖品库、奖池管理、中奖记录）
- 活动列表页面：展示活动编号、活动名称、话题名称、活动时间、活动状态、小程序显示状态、活动类型、操作
- 现有活动类型：抽奖活动、海报活动
- 创建活动流程：点击"创建活动" → 弹出"选择活动类型"弹窗 → 选择类型后进入配置页面

### 1.2 新增需求
新增"第三方活动"类型，配置项包括：
1. 活动列表banner（图片上传）
2. 跳转小程序路径（输入框）
3. 活动开始/结束时间（日期时间选择器）
4. 关联话题（话题选择器）
5. 活动名称（输入框）

## 二、技术选型

基于截图UI风格分析，采用以下技术栈：
- **前端框架**：React 18
- **UI组件库**：Ant Design 5.x（匹配截图的蓝色主题和组件风格）
- **路由**：React Router v6
- **状态管理**：Zustand（轻量级状态管理）
- **构建工具**：Vite
- **HTTP请求**：Axios
- **样式方案**：CSS Modules + Less

## 三、项目结构规划

```
src/
├── components/              # 公共组件
│   ├── Layout/             # 布局组件（侧边栏、顶部导航）
│   ├── ActivityTypeModal/  # 活动类型选择弹窗
│   └── ImageUpload/        # 图片上传组件
├── pages/
│   └── Marketing/
│       └── Activity/
│           ├── ActivityList/        # 活动列表页面
│           ├── ActivityConfig/      # 活动配置页面（通用容器）
│           └── configs/
│               ├── LotteryConfig/   # 抽奖活动配置（现有）
│               ├── PosterConfig/    # 海报活动配置（现有）
│               └── ThirdPartyConfig/# 第三方活动配置（新增）
├── store/                  # 状态管理
│   └── activityStore.js
├── services/               # API服务
│   └── activityApi.js
├── constants/              # 常量定义
│   └── activityTypes.js
├── router/                 # 路由配置
│   └── index.jsx
├── styles/                 # 全局样式
└── App.jsx
```

## 四、详细实施步骤

### 步骤1：项目初始化与基础搭建
- 使用 Vite 创建 React 项目
- 安装 Ant Design、React Router、Zustand、Axios、Day.js 等依赖
- 配置 Ant Design 主题色（蓝色系，匹配截图）
- 搭建基础路由结构

### 步骤2：实现整体布局框架
- 创建左侧导航栏组件（营销、用户、内容、任务、数据、配置、系统等菜单）
- 创建顶部导航栏组件（社区名称、用户信息）
- 实现面包屑导航（营销中心/活动管理/抽奖活动）
- 搭建主内容区域布局

### 步骤3：实现活动列表页面
- 创建活动列表表格，列包括：活动编号、活动名称、话题名称、活动时间、活动状态、小程序显示状态、活动类型、操作
- 实现状态标签（已结束/进行中/未开始、显示/不显示）
- 实现操作按钮（查看、关闭显示/开启显示、推广）
- 实现"创建活动"按钮
- 添加分页组件
- 使用模拟数据展示列表

### 步骤4：实现活动类型选择弹窗
- 创建模态框组件，标题为"选择活动类型"
- 展示三个活动类型卡片：
  - 抽奖活动：完成社区任务，赢取好礼或抽奖机会
  - 海报活动：常规社区活动（仅展示活动海报）
  - 第三方活动：跳转到第三方小程序的活动（新增）
- 实现卡片点击选中效果
- 底部"取消"和"立即创建"按钮

### 步骤5：新增活动类型常量定义
- 在 `constants/activityTypes.js` 中定义活动类型枚举：
  - LOTTERY: 'lottery'（抽奖活动）
  - POSTER: 'poster'（海报活动）
  - THIRD_PARTY: 'third_party'（第三方活动，新增）
- 定义各类型的配置表单字段映射

### 步骤6：实现第三方活动配置页面（核心）
创建 `ThirdPartyConfig` 组件，包含以下表单项：

1. **活动名称**
   - 表单项类型：Input 输入框
   - 字段名：activityName
   - 校验：必填，最大长度50字符
   - 占位符：请输入活动名称

2. **活动列表banner**
   - 表单项类型：图片上传组件
   - 字段名：bannerUrl
   - 校验：必填
   - 功能：支持上传图片，预览，删除
   - 尺寸提示：建议尺寸 750x300px
   - 格式限制：JPG/PNG，大小不超过2MB

3. **跳转小程序路径**
   - 表单项类型：Input 输入框
   - 字段名：miniProgramPath
   - 校验：必填
   - 占位符：请输入小程序页面路径，例如：/pages/activity/index?id=123
   - 帮助文本：请填写小程序内的跳转路径

4. **活动时间**
   - 表单项类型：RangePicker 日期时间范围选择器
   - 字段名：[startTime, endTime]
   - 校验：必填，结束时间必须晚于开始时间
   - 格式：YYYY-MM-DD HH:mm:ss
   - 默认值：当前时间至7天后

5. **关联话题**
   - 表单项类型：Select 选择器（支持搜索）
   - 字段名：topicId
   - 校验：必填
   - 功能：从话题列表中选择关联话题
   - 展示：话题名称
   - 提供模拟话题数据供选择

- 页面底部按钮：
  - "取消"：返回活动列表
  - "保存草稿"：保存为草稿状态
  - "立即发布"：发布活动

### 步骤7：配置页面路由整合
- 在活动配置页面容器 `ActivityConfig` 中根据活动类型动态加载对应配置组件
- 实现路由跳转：活动列表 → 类型选择 → 对应配置页面
- 配置页面支持"编辑"模式（查看/修改已有活动）

### 步骤8：API服务层定义
- 在 `services/activityApi.js` 中定义API接口：
  - `getActivityList()` - 获取活动列表
  - `createThirdPartyActivity(data)` - 创建第三方活动
  - `updateThirdPartyActivity(id, data)` - 更新第三方活动
  - `getThirdPartyActivityDetail(id)` - 获取第三方活动详情
  - `toggleActivityDisplay(id, status)` - 切换显示状态
  - `getTopicList()` - 获取话题列表（用于关联话题选择）
- 使用 Mock 数据进行前端开发

### 步骤9：状态管理
- 在 `store/activityStore.js` 中实现：
  - 活动列表数据状态
  - 当前编辑的活动数据
  - 加载状态管理
  - CRUD操作方法

### 步骤10：列表页集成新活动类型
- 在活动列表的"活动类型"列中正确显示"第三方活动"
- 确保第三方活动在列表中的状态、操作按钮正常工作
- 第三方活动的"查看"操作跳转到第三方活动详情/编辑页

### 步骤11：样式优化与交互完善
- 统一表单布局（两列布局或单列布局）
- 添加表单校验提示
- 优化图片上传交互体验
- 添加加载状态和成功/失败提示
- 确保页面响应式适配

### 步骤12：测试与验证
- 测试创建第三方活动完整流程
- 测试表单校验规则
- 测试编辑已有第三方活动
- 测试活动列表展示第三方活动
- 测试返回和取消操作
- 验证与其他活动类型的兼容性

## 五、关键文件清单

需要创建的主要文件：
1. `src/constants/activityTypes.js` - 活动类型常量
2. `src/components/ActivityTypeModal/index.jsx` - 活动类型选择弹窗
3. `src/pages/Marketing/Activity/ActivityList/index.jsx` - 活动列表页
4. `src/pages/Marketing/Activity/ActivityConfig/index.jsx` - 配置页面容器
5. `src/pages/Marketing/Activity/configs/ThirdPartyConfig/index.jsx` - 第三方活动配置（新增核心）
6. `src/components/ImageUpload/index.jsx` - 图片上传组件
7. `src/services/activityApi.js` - API服务
8. `src/store/activityStore.js` - 状态管理
9. `src/router/index.jsx` - 路由配置

## 六、注意事项与风险点

1. **数据兼容性**：第三方活动的数据结构需与现有抽奖、海报活动保持一致的基础字段（id、名称、时间、状态、话题等）
2. **类型区分**：在活动列表和API中通过 `activityType` 字段明确区分三种活动类型
3. **图片上传**：需考虑图片上传的实际接口对接，目前先实现前端上传组件UI
4. **小程序路径验证**：跳转路径格式需要做基本的格式校验
5. **时间校验**：开始时间不能晚于结束时间，且不能早于当前时间（可配置）
6. **话题选择**：话题列表需要支持搜索和分页加载（大数据量场景）
7. **编辑回填**：编辑模式下表单需要正确回填已有数据
8. **状态流转**：草稿、进行中、已结束等状态在第三方活动中需正确计算和展示

## 七、第三方活动数据结构设计

```javascript
{
  id: number,                    // 活动编号
  activityName: string,          // 活动名称
  activityType: 'third_party',   // 活动类型固定值
  bannerUrl: string,             // 活动列表banner图片URL
  miniProgramPath: string,       // 跳转小程序路径
  startTime: string,             // 活动开始时间 ISO格式
  endTime: string,               // 活动结束时间 ISO格式
  topicId: number,               // 关联话题ID
  topicName: string,             // 关联话题名称（列表展示用）
  displayStatus: boolean,        // 小程序显示状态
  status: 'draft' | 'ongoing' | 'ended' | 'not_started', // 活动状态
  createTime: string,            // 创建时间
  updateTime: string             // 更新时间
}
```

## 八、UI/UX 设计要点

1. 保持与现有抽奖活动、海报活动一致的页面风格和交互模式
2. 活动类型卡片采用和截图一致的样式（白色圆角卡片、居中标题和描述）
3. 表单采用 Ant Design 的 Form 组件，左标签右输入的布局
4. 图片上传区域使用 Ant Design Upload 组件，卡片式上传样式
5. 按钮样式与现有页面保持一致：主按钮蓝色（#1890ff 或类似），次按钮白色边框
6. 表格样式与截图匹配：斑马纹、操作列蓝色文字链接
