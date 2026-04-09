# QQ 宠物管家 (WorkBuddy)

QQ 宠物（怀旧服 v1.2.4）的逆向分析与桌面移植项目（macOS / Windows），附带 OpenClaw Skill 实现宠物自动管理。

<img width="480" alt="QQ宠物" src="https://github.com/user-attachments/assets/7fa61a7a-b23f-483f-b071-d297dc393417" />

## 项目概述

本项目完成了三件事：

1. **逆向分析** — 完整分析了 QQ 宠物的通信架构（Express + WebSocket + RSA 上报）
2. **桌面移植** — 提取 Electron 源码，移除遥测/指纹采集，用 Ruffle WASM 替代 Flash，适配 macOS 和 Windows
3. **自动化管理** — Python CLI 直接读写 electron-store 数据文件，实现宠物状态监控与养护

<img width="320" height="334" alt="image" src="https://github.com/user-attachments/assets/457cf203-b00f-4108-a6f8-cf44d75fe315" />

## 快速开始

### 1. 启动宠物

从 [Releases](https://github.com/xuemian168/qqpet_automation/releases) 下载对应平台的安装包：

| 平台 | 文件 | 说明 |
|------|------|------|
| macOS (Apple Silicon) | `QQ宠物-x.x.x-arm64.dmg` | DMG 安装包 |
| Windows (64位) | `QQ宠物 Setup x.x.x.exe` | NSIS 安装程序 |
| Windows (64位) | `QQ宠物-x.x.x-portable.exe` | 免安装便携版 |

#### macOS 安装

双击 `.dmg` 文件，将应用拖入 Applications 文件夹。

> **⚠️ "已损坏，无法打开" 解决方法**
>
> 由于应用未经 Apple 签名，macOS Gatekeeper 会阻止运行。请在终端执行以下命令：
>
> ```bash
> sudo xattr -rd com.apple.quarantine /Applications/QQ宠物.app
> ```
>
> 然后重新打开应用即可。

#### Windows 安装

- **安装版**：双击 `QQ宠物 Setup x.x.x.exe`，可自定义安装目录
- **便携版**：双击 `QQ宠物-x.x.x-portable.exe` 直接运行，无需安装

> **⚠️ Windows SmartScreen 提示**
>
> 应用未经 Microsoft 签名，首次运行时 SmartScreen 可能提示"Windows 已保护你的电脑"。
> 点击 **"更多信息"** → **"仍要运行"** 即可。

#### 从源码运行

```bash
cd qq-pet-macos && npm install && npx electron .
```

宠物会出现在桌面上，可拖动、右键菜单、状态栏图标。

### 2. 安装管理工具

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 3. 查看宠物状态

```bash
.venv/bin/python -m src.qq_pet.cli status
```

输出示例：

```json
{
  "name": "爹",
  "host": "主",
  "level": 1,
  "hunger": 3034,
  "hunger_max": 3100,
  "clean": 3026,
  "clean_max": 3100,
  "health": 5,
  "mood": 969,
  "mood_max": 1000,
  "is_hungry": false,
  "is_dirty": false,
  "is_sick": false
}
```

## CLI 命令

```bash
# 状态查询
.venv/bin/python -m src.qq_pet.cli status      # 宠物状态概览
.venv/bin/python -m src.qq_pet.cli info         # 详细信息（等级/成长/属性）
.venv/bin/python -m src.qq_pet.cli inventory    # 背包物品

# 养护操作
.venv/bin/python -m src.qq_pet.cli feed         # 喂食（+1000 饥饿值）
.venv/bin/python -m src.qq_pet.cli bath         # 洗澡（+1000 清洁值）
.venv/bin/python -m src.qq_pet.cli play         # 逗玩（+100 心情值）
.venv/bin/python -m src.qq_pet.cli feed --amount 2000  # 指定数量

# 医疗
.venv/bin/python -m src.qq_pet.cli diagnose     # 疾病诊断
.venv/bin/python -m src.qq_pet.cli heal         # 自动治病（匹配背包药物）

# 一键养护
.venv/bin/python -m src.qq_pet.cli auto         # 按优先级自动处理所有问题

# 数据管理
.venv/bin/python -m src.qq_pet.cli backup       # 备份数据文件
.venv/bin/python -m src.qq_pet.cli raw          # 查看原始数据（调试）
```

## OpenClaw Skill

将 `skills/qq-pet/` 复制到 skill 目录后，AI 助手可通过自然语言管理宠物：

```bash
cp -r skills/qq-pet ~/.openclaw/skills/
```

触发关键词：`QQ宠物`、`宠物状态`、`喂食`、`洗澡`、`治病`、`一键养护`

## 移植版改动

相比 Windows 原版（QQ 宠物怀旧服），桌面移植版做了以下修改：

| 修改项 | 说明 |
|--------|------|
| 遥测移除 | 移除 RSA 数据上报、machineId 采集、sysInfo 采集 |
| Flash 替代 | PepFlash DLL → Ruffle WASM（最新 nightly） |
| 自动更新 | 禁用远程更新检查 |
| 存储加密 | 改为明文 JSON（方便 CLI 读写） |
| 截图功能 | PrintScr.exe → macOS `screencapture` |
| 窗口适配 | 修复透明窗口白框、托盘图标 ICO→PNG |
| 拖动修复 | 鼠标事件监听提升到 document 级别 |
| IP 获取 | 修复 Darwin 平台网络接口枚举 |

## 游戏机制（逆向所得）

### 属性临界值

- **饥饿 < 720**：进入饥饿状态
- **清洁 < 1080**：进入脏污状态
- **心情 < 100**：心情低落
- **健康 = 5** 正常，**4→1** 逐级生病，**0** = 死亡

### 疾病系统

三条独立疾病链，不治疗会逐级恶化：

```
感冒(板蓝根) → 发烧(退烧药) → 重感冒(银翘丸) → 肺炎(金色消炎药水) → 死亡
咳嗽(枇杷糖浆) → 支气管炎(甘草剂) → 哮喘(定喘丸) → 肺结核(通风散) → 死亡
肚子胀(消食片) → 胃炎(蓝色消炎药水) → 胃溃疡(龙胆草) → 胃癌(仙人汤) → 死亡
```

### 属性衰减（每60秒）

- 饥饿/清洁：-5~8（心情<600 额外-2）
- 心情：-2~4

## 数据文件位置

| 平台 | 路径 |
|------|------|
| macOS（移植版） | `~/Library/Application Support/qq-pet-macos/config-macos.json` |
| Windows（移植版） | `%APPDATA%/qq-pet-macos/config-macos.json` |
| Windows（原版） | `%APPDATA%/pet/config.json`（AES 加密） |

## 项目结构

```
workbuddy/
├── qq-pet-macos/                 # macOS 移植版 Electron 应用
│   ├── main.js                   # 入口（已清理遥测）
│   ├── package.json
│   └── src/                      # 源码（从 app.asar 解包修改）
├── skills/qq-pet/SKILL.md        # OpenClaw Skill 定义
├── src/qq_pet/                   # Python 管理工具
│   ├── cli.py                    # CLI 入口
│   ├── pet_client.py             # 数据客户端
│   ├── store_reader.py           # electron-store 读写
│   ├── actions.py                # 养护动作
│   ├── game_data.py              # 游戏常量（逆向）
│   └── models.py                 # 数据模型
├── config.yaml                   # 配置文件
├── requirements.txt              # Python 依赖
└── pyproject.toml
```

## 配置

编辑 `config.yaml`：

```yaml
store_path: ""                # 留空自动检测
encryption_key: "aes-256-cbc" # Windows 原版加密密钥
thresholds:
  hunger: 720
  clean: 1080
  mood: 100
  health: 5
```
