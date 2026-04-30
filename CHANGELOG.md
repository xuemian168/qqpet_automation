# 变更日志

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循 [SemVer](https://semver.org/lang/zh-CN/)。

版本号说明：跟随上游 QQ 宠物怀旧服的版本（`1.2.4`），项目自身的迭代体现在第三位（`.0`、`.1`...），与上游游戏版本无关。

## [Unreleased]

### 新增
- Linux x64 / arm64 构建产物（AppImage + tar.gz）
- 项目许可与社区文件：`LICENSE`（MIT）、`NOTICE.md`（第三方权利声明）、`CONTRIBUTING.md`、`SECURITY.md`

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

[Unreleased]: https://github.com/xuemian168/qqpet_automation/compare/v1.3.1...HEAD
[1.3.1]: https://github.com/xuemian168/qqpet_automation/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/xuemian168/qqpet_automation/compare/v1.2.4-clean...v1.3.0
[1.2.4-clean]: https://github.com/xuemian168/qqpet_automation/releases/tag/v1.2.4-clean
