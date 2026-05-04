# 变更日志

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循 [SemVer](https://semver.org/lang/zh-CN/)。

版本号说明：跟随上游 QQ 宠物怀旧服的版本（`1.2.4`），项目自身的迭代体现在第三位（`.0`、`.1`...），与上游游戏版本无关。

## [Unreleased]

## [1.5.1] - 2026-05-04

### 性能优化（保持 Electron 路径下的体积/内存优化）

- **Electron 升级**：28.0.0 → 33.4.11，electron-builder 24 → 25
  - 拿到 V8 内存压缩（V8 sandbox）、更紧的 binary、原生 fetch
- **electron-builder 配置精简**
  - `compression: maximum`（lzma）+ `asar: true` + `electronLanguages: [zh_CN, en]`（剥离 ~30 个 macOS .lproj 本地化）
  - 扩充 `files` 排除规则：tests / docs / .eslint / CHANGELOG / *.md / *.d.ts / .DS_Store
  - macOS 加 `minimumSystemVersion: 10.15.0` + `NSHighResolutionCapable`
- **Chromium 启动开关**（`main.js`）
  - `--max-old-space-size=128 --max-semi-space-size=8`：每个 renderer V8 堆上限收紧
  - `disable-features`: 关闭桌宠用不到的 `MediaRouter` / `GlobalMediaControls` / `Translate` / `OptimizationHints` / `Autofill` / `MediaSessionService` / `AcceptCHFrame` / `CertificateTransparencyComponentUpdater` / `HardwareMediaKeyHandling`
  - `enable-features=MemoryPressureBasedSourceBufferGC`：内存压力下更激进 GC

### 实测体积变化（macOS arm64）

- DMG: 259.4 MB → 254.1 MB（-2.0%）
- zip: 254.9 MB → 259.0 MB（+1.6%，Electron 33 binary 略大，被 lzma 抵消）

### 备注

应用 474 MB 里 200 MB 是 1341 个 SWF 资源（998 已 CWS 压缩），是不可压缩硬底。Electron runtime 本身已通过本次优化挤到极限。要继续减安装包体积，必须做 SWF → 现代格式的资源迁移，已超出"保持 Electron"范畴。

## [1.5.0] - 2026-05-04

### 新增
- **商城功能完整实现**（原版商店窗口只是空壳子，无入口、UI 未渲染、缺购买逻辑）
  - 右键菜单新增「商城」入口
  - 完全重写商品列表 UI（食品/日用品/药品 3 个分类，共 84 件可购买商品），不再依赖丢失的原版美术资源；改用现代卡片式 + emoji 图标 + 暖色琥珀风格
  - 卡片显示属性加成（饥饿/清洁/智力/魅力/武力 +N）+ 价格 + 购买按钮，元宝不足时按钮自动禁用
  - 顶部实时显示元宝余额，购买后即时刷新
  - 后端新增 `Goods.buy(goodKey)` 方法：校验商品/价格/余额，扣元宝并入库，事务一致
  - 新增 IPC 通道 `store_h_listGoods` / `store_h_buy` / `store_m_goods` / `store_m_buyResult`，购买结果通过 toast 反馈

## [1.4.0] - 2026-05-04

### 新增
- 接入 DeepSeek LLM 生成宠物对话：仅替换 `smallTalk`（日常闲聊）和 `toHeartTolk`（互动撒娇）两类硬编码台词，其余事件反馈保持原样。设置面板新增「AI 对话」标签，提供启用开关、API Key 输入框（密码态）和测试连接按钮。
  - 新增 `src/service/llm.js`：DeepSeek HTTPS 客户端 + 预取队列（每类最多缓存 3 条），异步预取、API 失败时自动降级到硬编码台词
  - 设置 UI 增加 `input` 控件类型（`src/windows/popups/setup/index.html` + `index.css`）
  - 启动时和每次取用后异步预取下一条，零延迟显示
- LLM 扩展接入更多事件（按需调用，不预取）：
  - **剪贴板文字评论**：复制文字时宠物会针对内容做俏皮评论（如识别代码/链接/邮件），>500 字自动截断；图片不发送 LLM。AI 关闭时回退到原文展示
  - **god 模式（Ctrl+方向键）**：宠物的反应改为 LLM 现编（替换原来 3 句固定话术）
  - **入场问候 (`enter`)**：每次启动时根据当前时间段（凌晨/早上/中午/...）和距上次登录的间隔（分钟/小时/天）生成个性化问候，替代 25+ 句固定话术
  - **状态嘟囔（饿/脏）**：宠物喊饿/喊脏时根据具体数值（饥饿值/清洁值百分比）生成有节奏感的吐槽，替代 2-4 句循环
  - **升级恭喜 (`levUp`)**：根据等级里程碑（蛋/幼年/成年阶段）生成个性化炫耀
  - 新增 `LLMService.generateOnce(promptType, contextData, petInfo)` 同步式 API（Promise），失败自动回退硬编码
  - 新增 `global._buildLLMCtx(kind)` 上下文构造工具（提取宠物当前状态、时间、登录间隔等数据供 LLM prompt 使用）
- AI 对话设置面板增加「**模型名称**」配置项，支持自由切换 `deepseek-chat`（默认 V3）/ `deepseek-reasoner`（R1）/ 其他 DeepSeek 官方支持的模型 ID。留空 fallback 到 `deepseek-chat`
- README 增加完整的「AI 对话（DeepSeek 接入）」章节：列出全部 7 个接入场景、启用步骤、模型对比、隐私声明、成本估算、失败回退说明

### 修复
- 「控制透明浏览器」(urlWindowOpen) 弹出窗口无法关闭：原代码显式调用了 `setClosable(false)` 禁用关闭按钮，改为可关闭，并监听 `closed` 事件联动关闭父控制面板，避免遗留孤儿窗口（[#3](https://github.com/xuemian168/qqpet_automation/issues/3)）
- 「渔港」/「后室」iframe 内 `<embed src="*.swf">` 在 Windows 上回退到原生 Flash 插件失效：iframe 内文档（`indexOnLine.html`）未注入 Ruffle，外层 `app.html` 的 Ruffle 不会被 iframe 自动继承。改为在两个 `indexOnLine.html` 内直接加载 `../../js/ruffle/ruffle.js` 并配置 `RufflePlayer`，由 Ruffle polyfill `<embed>`（[#2](https://github.com/xuemian168/qqpet_automation/issues/2)）

## [1.3.2] - 2026-05-01

### 新增
- Linux x64 / arm64 构建产物（AppImage + tar.gz）
- 项目许可与社区文件：`LICENSE`（MIT）、`NOTICE.md`（第三方权利声明）、`CONTRIBUTING.md`、`SECURITY.md`、`CHANGELOG.md`
- GitHub Issue 表单模板：Bug 报告、兼容性问题、功能建议，含 IP 边界与已知现状提示

### 修复
- Windows 构建步骤强制使用 bash，避免 PowerShell 解析 `-c.extraMetadata.version=VALUE` 时把 `=VALUE` 当文件路径
- Release artifact 文件名残留 `1.2.4`，改为使用 tag 名作为产物版本号

## [1.3.1] - 2026-04-19

### 新增
- 运行时资源完整入库：`swf` / `wasm` 二进制资源、第三方库

### 修复
- 外部修改 `config-macos.json` 后页面不会自动同步刷新
- E2E 测试中暴露的 3 个同步缺陷

### 变更
- 取消对 Synology Drive 冲突目录的版本控制追踪

## [1.3.0] - 2026-04-09

### 新增
- Windows 构建支持（NSIS 安装版 + Portable 便携版）
- 统一的 macOS / Windows CI/CD release 流水线

### 变更
- Ruffle 集成升级，改进鼠标事件处理
- README 增补项目细节、截图、演示视频链接

### 修复
- README 中 macOS Gatekeeper 解除命令的应用路径

## [1.2.4-clean] - 2026-04-07

首个公开版本。基于 QQ 宠物怀旧服 v1.2.4，移除遥测后的 macOS 干净版。

### 新增
- QQ 宠物怀旧服 v1.2.4 通信协议逆向分析（Express + WebSocket + RSA 上报）
- macOS 移植版 Electron 应用，移除遥测、设备指纹采集
- 用 Ruffle WASM 替代 PepFlash DLL
- macOS 数据路径自动检测
- Python 管理工具与 OpenClaw Skill：状态监控、一键养护、疾病诊断
- macOS 自动构建 GitHub Action（仅 arm64）

### 安全
- 移除 RSA 数据上报、`machineId` 与 `sysInfo` 采集
- 禁用远程自动更新检查
- 存储改为明文 JSON（方便审计与 CLI 读写）

[Unreleased]: https://github.com/xuemian168/qqpet_automation/compare/v1.3.2...HEAD
[1.3.2]: https://github.com/xuemian168/qqpet_automation/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/xuemian168/qqpet_automation/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/xuemian168/qqpet_automation/compare/v1.2.4-clean...v1.3.0
[1.2.4-clean]: https://github.com/xuemian168/qqpet_automation/releases/tag/v1.2.4-clean
