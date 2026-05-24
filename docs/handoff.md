# 银联商务 APP 终端横屏适配交付文档

## 首页结构

当前首页严格按 `001-登录和一级页面.png` 中的“一级页面”做 854×480 横屏适配，不再使用左侧全局导航，也不再使用后台 Dashboard 框架。

首页结构：

1. 顶部商户信息区
   - 商户名称
   - 手机号 / 管理员角色
   - 当前时间 / 网络状态
   - 右侧消息入口
   - 点击商户信息区域进入“切换店铺 / 角色”

2. 今日收款核心数据区
   - 左侧突出今日收款金额与今日交易笔数
   - 右侧展示云闪付、支付宝、微信、借记卡、贷记卡、数字人民币金额
   - 点击今日收款金额、今日交易笔数或交易概览区域进入“今日交易”

3. 底部商户服务入口区
   - 收款语音播报
   - 消息中心管理
   - 关于我们
   - 退出登录

视觉参考图只用于蓝白配色、浅蓝灰背景、白色卡片、轻拟物质感、圆角和轻阴影，不参与功能和布局定义。

## 路由表

| 路由 | 页面 | 说明 |
| --- | --- | --- |
| `/#/login` | 登录 | 账号密码登录、失败、loading、会话过期弹窗 |
| `/#/dashboard` | 首页 / 一级页面 | 商户信息、今日收款核心数据、底部 4 个服务入口 |
| `/#/bind-role` | 绑定身份角色 | 登录/首次使用流程页，不作为首页入口 |
| `/#/stores` | 切换店铺 / 角色 | 由首页顶部商户信息区进入 |
| `/#/messages` | 消息 | 由首页顶部右侧消息入口进入 |
| `/#/transactions` | 今日交易 | 由首页今日收款金额、交易笔数或交易概览区域进入 |
| `/#/voice` | 收款语音播报 | 由首页底部“收款语音播报”进入 |
| `/#/message-settings` | 消息中心管理 | 由首页底部“消息中心管理”进入 |
| `/#/about` | 关于我们 | 由首页底部“关于我们”进入 |
| `/#/collect` | 信息采集 | 路由保留，不作为首页入口 |
| `/#/review` | 开发验收 | 仅用于 mock 状态验收，不作为真实业务入口 |

## 入口对应关系

| 页面 | 首页入口位置 | 对应交互稿位置 |
| --- | --- | --- |
| 切换店铺 / 角色 | 顶部商户信息区 | 首页商户名称 / 管理角色区域 |
| 消息 | 顶部右侧消息图标 | 首页右上角消息入口 |
| 今日交易 | 今日收款金额、交易笔数、交易概览区域 | 首页今日收款核心数据区 |
| 收款语音播报 | 底部商户服务入口 | 首页底部 4 个服务入口 |
| 消息中心管理 | 底部商户服务入口 | 首页底部 4 个服务入口 |
| 关于我们 | 底部商户服务入口 | 首页底部 4 个服务入口 |
| 退出登录 | 底部商户服务入口 | 首页底部 4 个服务入口 |
| 绑定身份角色 | 登录/首次使用流程 | 绑定身份角色模块，不在首页作为入口展示 |
| 信息采集 | 无首页入口 | 保留路由，不参与首页结构 |

## 已删除的错误入口

- 左侧全局导航
- 首页“功能入口大面板”
- 首页“绑定身份”入口
- 首页“切换店铺”入口按钮
- 首页“信息采集”入口
- “通知”作为独立全局导航
- “关于我们”作为左侧导航
- “退出登录”作为左侧导航
- 领券 / 优惠券 / 到店领券 / 券码 / 二维码领券相关页面、路由和逻辑

## 状态说明

- 首页：可通过 `/#/dashboard?state=loading`、`empty`、`error` 验证数据加载中、无数据、接口错误。
- 登录：失败、loading、会话过期。
- 绑定身份角色：无角色状态通过 `/#/bind-role?state=empty` 验证；扫码未完成、绑定成功为真实流程状态。
- 店铺/角色：无店铺、无角色、切换失败可通过 `/#/stores?state=empty`、`permission-error`、`failed` 验证。
- 消息：空消息通过 `/#/messages?state=empty` 验证；未读过滤、系统公告/交易通知分类为真实页面操作。
- 交易：无交易、查询失败可通过 `/#/transactions?state=empty`、`error` 验证；详情抽屉为真实页面操作。
- 播报：设备异常、权限异常通过 `/#/voice?state=device-error`、`permission-error` 验证。
- 通知管理：保存成功、保存失败可通过 `/#/message-settings?state=success`、`failed` 验证；保存设置、恢复默认为真实页面操作。
- 信息采集：地区选择、暂存、提交成功、提交失败、表单校验。

真实业务页面不展示状态切换按钮；开发验收统一从 `/#/review` 或 URL query 进入。

## 设计 Token

| 类型 | Token | 值 |
| --- | --- | --- |
| 主色 | `brand` | `#0191FF` |
| 辅助蓝 | `brand2` | `#38B6FF` |
| 背景 | `surface` | `#F3F7FB` |
| 浅蓝灰 | `panel` | `#EEF5FC` / `#F8FBFF` |
| 文字主色 | `ink` | `#1F2937` |
| 次级文字 | `muted` | `#7A8A9E` |
| 圆角 | 卡片 | `16px` |
| 圆角 | 按钮/输入 | `12px` |
| 阴影 | `soft` | `0 8px 24px rgba(1,145,255,.10)` |
| 字号 | 正文 | `14px` 以上 |
| 字号 | 核心金额 | `36px` |
| 点击区 | 高频按钮 | `44px` 以上 |

## Shell 与组件说明

- `HomeShell`：首页 / 一级页面专用壳层，只用于 `/#/dashboard`，页面内保留商户信息大卡片、时间、网络状态和消息入口。
- `SubPageShell`：二级页面专用壳层，用于收款语音播报、消息中心管理、今日交易、消息、关于我们、切换店铺/角色、绑定身份、信息采集、开发验收。顶部约 56px，左侧返回，中间标题居中，右侧预留轻量操作位。
- `AppShell`：兼容保留的基础组件别名，当前页面实现已显式使用 `HomeShell` / `SubPageShell`。
- `MetricCard`：通用核心指标卡。
- `ActionTile`：基础组件保留，当前首页不使用。
- `FilterBar` / `SelectPill`：交易筛选与横屏表单筛选。
- `Modal`：确认、地区选择、提交结果、退出等弹窗。
- `Drawer`：消息详情、交易详情。
- `Toast`：保存成功、切换成功、失败反馈。
- `EmptyState` / `ErrorState` / `LoadingState`：状态组件。
- `FormRow`：信息采集与绑定页表单行。
- `Stepper`：信息采集横屏步骤条。
- `ToggleRow`：播报与通知开关。

## 后端 / 客户端字段建议

### 登录

- `phone`
- `password`
- `sessionExpired`
- `token`
- `userRole`

### 门店 / 角色

- `storeId`
- `storeName`
- `merchantNo`
- `address`
- `roleName`
- `isCurrent`
- `switchable`

### 首页指标

- `todayAmount`
- `todayCount`
- `refundAmount`
- `channelStats[]`: `channelName`, `amount`, `count`
- `networkStatus`
- `terminalTime`

### 消息

- `messageId`
- `category`: `system | transaction`
- `title`
- `summary`
- `content`
- `createdAt`
- `readStatus`
- `relatedOrderNo`

### 交易

- `transactionId`
- `orderNo`
- `channel`
- `type`
- `status`
- `amount`
- `paidAt`
- `payerMasked`
- `refundAmount`

### 播报 / 通知设置

- `masterEnabled`
- `channelEnabledMap`
- `notificationType`
- `enabled`
- `deviceStatus`
- `permissionStatus`

## 开发注意

- Demo 使用 hash path 方式，便于直接部署到静态目录。
- 所有页面按 `854×480` 画布设计，不依赖浏览器大屏空间。
- 首页一屏完整展示，无滚动。
- 二级页面不显示首页商户信息卡片、不显示调试说明，标题居中。
- mock 状态入口集中在 `/#/review`，或通过 `?state=` query 触发。
- 表格一屏最多 6 条；数据更多时建议分页或分段加载。
