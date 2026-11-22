# QQ 宠物管家 (WorkBuddy)

QQ 宠物（怀旧服 v1.2.4）的逆向分析与桌面移植项目（macOS / Windows / Linux），附带 OpenClaw Skill 实现宠物自动管理。

<img width="540" height="824" alt="image" src="https://github.com/user-attachments/assets/6597c635-fb8a-45cc-b0cb-8a49ca5b1314" />

## 项目概述

本项目完成了四件事：

1. **逆向分析** — 完整分析了 QQ 宠物的通信架构（Express + WebSocket + RSA 上报）
2. **桌面移植** — 提取 Electron 源码，移除遥测/指纹采集，用 Ruffle WASM 替代 Flash，适配 macOS 和 Windows
3. **自动化管理** — Python CLI 直接读写 electron-store 数据文件，实现宠物状态监控与养护
4. **AI 对话接入** — 桌宠对话从硬编码字典升级为 DeepSeek LLM 动态生成，宠物会感知时间、剪贴板内容、自身状态等上下文做出针对性反应

<img width="320" height="334" alt="image" src="https://github.com/user-attachments/assets/457cf203-b00f-4108-a6f8-cf44d75fe315" />

## 演示视频

<a href="https://www.bilibili.com/video/BV1uS9DB8EB3/" target="_blank">
  <img width="480" alt="全网独家，我复活了QQ宠物！（点击跳转 B 站观看）" src="https://i2.hdslb.com/bfs/archive/414aaeae10455c7d4cd7b3ecfd7d36e47dbeb00e.jpg">
</a>

> 点击封面跳转 B 站观看 · 作者：[是我_是我_就是我](https://www.bilibili.com/video/BV1uS9DB8EB3/)

## 快速开始

### 1. 启动宠物

从 [Releases](https://github.com/xuemian168/qqpet_automation/releases) 下载对应平台的安装包：

| 平台 | 文件 | 说明 |
|------|------|------|
| macOS (Apple Silicon) | `qq-pet-x.x.x-arm64-mac.dmg` | DMG 安装包 |
| Windows (64位) | `qq-pet-x.x.x-setup.exe` | NSIS 安装程序 |
| Windows (64位) | `qq-pet-x.x.x-portable.exe` | 免安装便携版 |
| Linux (x86_64) | `qq-pet-x.x.x-x86_64.AppImage` / `qq-pet-x.x.x-x64.tar.gz` | AppImage 或 tar.gz |
| Linux (arm64) | `qq-pet-x.x.x-arm64.AppImage` / `qq-pet-x.x.x-arm64.tar.gz` | AppImage 或 tar.gz |

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

- **安装版**：双击 `qq-pet-x.x.x-setup.exe`，可自定义安装目录
- **便携版**：双击 `qq-pet-x.x.x-portable.exe` 直接运行，无需安装

> **⚠️ Windows SmartScreen 提示**
>
> 应用未经 Microsoft 签名，首次运行时 SmartScreen 可能提示"Windows 已保护你的电脑"。
> 点击 **"更多信息"** → **"仍要运行"** 即可。

#### Linux 安装

- **AppImage（推荐）**：
  ```bash
  chmod +x qq-pet-x.x.x-<arch>.AppImage
  ./qq-pet-x.x.x-<arch>.AppImage
  ```
- **tar.gz**：解压后执行目录内的 `qq-pet` 二进制即可。

> **⚠️ AppImage 依赖 libfuse2**
>
> 部分发行版（Ubuntu 22.04+ / Debian 12+）默认不带 `libfuse2`，需手动安装：
>
> ```bash
> sudo apt install libfuse2
> ```
>
> 也可解压 AppImage（`./qq-pet-*.AppImage --appimage-extract`）后运行 `squashfs-root/qq-pet` 绕开 fuse。

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

## Agnet Skill

<img width="280" alt="QQ宠物" src="https://github.com/user-attachments/assets/7fa61a7a-b23f-483f-b071-d297dc393417" />

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

### 合规说明（中国法）

根据本项目随附的逆向分析，公开流传的 v1.2.4 Windows 构建包含启动时采集 `machineId`、主机名、CPU、内存、系统版本等设备信息，并向远程接口发送的逻辑。若相关处理未向用户充分告知并取得有效同意，则在中国法下至少可能涉及以下合规风险：

- 《中华人民共和国个人信息保护法》第 5 条、第 6 条、第 7 条、第 13 条至第 17 条：处理个人信息应具有合法基础，遵循合法、正当、必要、公开透明原则，并在处理前告知处理目的、方式、种类、保存期限等事项。
- 《中华人民共和国网络安全法》第 22 条第 3 款、第 41 条、第 42 条：网络产品、服务具有收集用户信息功能的，应向用户明示并取得同意；不得收集与服务无关的个人信息。
- 《中华人民共和国民法典》第一千零三十四条、第一千零三十五条、第一千零三十八条：自然人的个人信息受法律保护；处理个人信息应遵循合法、正当、必要原则；未经同意不得非法提供个人信息。
- 《电信和互联网用户个人信息保护规定》第 5 条、第 8 条、第 9 条、第 10 条、第 13 条：互联网信息服务提供者不得未经同意收集、使用用户个人信息，不得超出提供服务所必需的范围收集，并应采取安全保护措施。

本项目的移植版已移除上述设备指纹、系统信息上报和相关远程遥测逻辑，仅保留本地运行所必需的代码路径。具体个案是否构成违法，仍应以主管机关执法认定或司法裁判为准。

### 国际隐私合规（概览）

类似设备标识、系统信息采集与远程上传行为，在境外通常由各司法辖区的隐私、数据保护和消费者保护法律分别规制。若软件面向相关地区用户提供下载、服务或持续性运营，且未就数据采集与上传作出充分告知并取得有效授权，通常还可能涉及以下合规风险：

- 欧盟 / 欧洲经济区：`GDPR`。核心要求包括合法处理基础、透明告知、目的限定、数据最小化与跨境传输合规。
- 英国：`UK GDPR`。与欧盟 GDPR 逻辑基本一致，要求处理个人数据具有 lawful basis，且不得以隐蔽、误导方式处理。
- 美国：`FTC Act Section 5` 以及部分州法。若软件对数据采集、用途或共享方式存在隐瞒、误导或与对外声明不一致，可能被视为 unfair or deceptive acts or practices；对达到适用门槛的经营者，加州 `CCPA/CPRA` 还要求在收集时提供 notice at collection。
- 加拿大：`PIPEDA`。通常要求取得 meaningful consent，使用户能够理解所同意的数据收集、使用、披露的性质、目的和后果。
- 澳大利亚：`Privacy Act 1988` / `Australian Privacy Principles`。通常要求仅收集合理必要的个人信息，并在收集时或尽快向个人作出通知；如可能向境外接收方披露，还应作相应说明。
- 巴西：`LGPD`。通常要求具备合法基础，遵循目的、必要性、透明度和安全原则；向境外传输个人数据时还会触发额外规则。

这些规则是否实际适用，通常取决于软件是否面向相关法域用户提供产品或服务、是否监测其行为、数据接收方所在地以及是否存在跨境传输安排。

### 为什么暂未公开完整逆向报告

`新版QQ宠物1.2.4-逆向通信分析报告.pdf` 目前未随公开仓库分发。这不是因为项目放弃相关研究结论，而是基于最小必要披露原则作出的审慎处理：完整报告包含较细粒度的第三方程序内部实现、接口路径、通信细节和本地暴露面；在完成进一步脱敏、事实复核与责任披露评估前，直接公开并不合适。

当前公开仓库的目标，是说明移植版做了哪些修改、哪些遥测与设备标识逻辑已被移除，并提供本地可运行的替代实现；它不是一份面向公众分发的第三方程序内部技术手册。因此，仓库目前仅保留高层结论和与移植实现直接相关的必要说明。后续如公开报告，也将优先发布经过删减、脱敏和复核的版本。

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

## AI 对话（DeepSeek 接入）

桌宠原本只能从硬编码字典里随机抽固定话术。本项目将其升级为**可选的 LLM 动态生成**：宠物会根据当前**时间、自身状态、剪贴板内容**等上下文，由 DeepSeek 现编对话。功能默认**关闭**，开启后失败会自动回退到硬编码，不影响基础体验。

### 已接入的 7 个对话场景

| 触发场景 | 替换的固定话术 | LLM 上下文 | 调用方式 |
|---------|--------------|-----------|---------|
| `smallTalk` 日常闲聊 | 100+ 句 | 宠物状态 | 预取队列（零延迟） |
| `toHeartTolk` 互动撒娇 | 12 句 | 宠物状态 | 预取队列（零延迟） |
| `enter` 入场问候 | 25+ 句 | 时间段 + 距上次登录间隔 | 按需（启动时）|
| `state.eat` 饿了喊吃 | 3 句 | 当前饥饿百分比 | 按需 |
| `state.clean` 脏了喊洗 | 4 句 | 当前清洁百分比 | 按需 |
| `levUp` 升级炫耀 | 3 句 | 新等级 + 阶段（蛋/幼/成）| 按需 |
| `clipboardText` 复制评论 | 仅显示原文 | 剪贴板文字（截断 500 字）| 按需 |
| `godMode` 神秘按键 | 3 句 | 无 | 按需 |

> 入场问候示例：早上 9 点启动 → "主人早上好，工作日加油！"；凌晨 2 点 → "[host]，深夜了快去睡呀，别熬坏身体~"

### 启用步骤

1. 申请 DeepSeek API Key：访问 [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys)
2. 启动桌宠 → 右键托盘图标 → **设置** → 切到 **「AI 对话」** 标签
3. 配置 3 项：
   - **启用 AI 对话**：开关
   - **DeepSeek API Key**：粘贴 `sk-...`，回车保存（密码态显示）
   - **模型名称**：留空 = `deepseek-flash`（便宜又快），可改为 `deepseek-v4-pro` 或任何 [DeepSeek 官方](https://api-docs.deepseek.com/zh-cn/quick_start/pricing/) 支持的模型 ID
4. 点击 **「测试连接」** 按钮 → 宠物气泡显示「AI 连接成功！」即生效

### 模型对比建议

| 模型 ID | 适用场景 | 说明 |
|---------|---------|------|
| `deepseek-flash` | **默认推荐** | DeepSeek V4.1 Flash，输入 ¥1-2/M、输出 ¥4-8/M tokens（空闲/高峰时段） |
| `deepseek-v4-pro` | 想要文笔更好的回复 | DeepSeek V4 Pro，价格约为 Flash 的 3-4 倍 |
| `deepseek-chat` / `deepseek-reasoner` | 旧模型名，不建议 | DeepSeek 已宣布 2026-07-24 停用，能否调用以官方为准；`deepseek-reasoner` 是思考模型，响应最长要等 30 秒 |

> 桌宠台词只有十几个字，用不上"思考"，所以对 `deepseek-flash` / `deepseek-v4-pro` 会自动关闭思考模式，响应更快也更省钱。

### 隐私与安全

- API Key 存储在本地 `~/Library/Application Support/qq-pet-macos/config-macos.json`（macOS）等同位置，**不上传任何远程服务器**
- 剪贴板**文字**内容（截断到 500 字内）会发送到 DeepSeek 用于评论；**图片不发送**
- 关闭「实时监听播报剪切板」即可彻底禁用剪贴板上行
- 关闭「启用 AI 对话」开关，所有 LLM 调用立即停止，宠物回到原硬编码模式

### 成本估算

按 `deepseek-flash` 默认模型、高峰时段价格估算（输入 ¥2/M、输出 ¥8/M tokens，空闲时段减半）：

- 单次对话约 200-300 tokens（输入 prompt + 输出回复）
- 日常使用每天约 50-100 次对话 → **每天 ¥0.02-0.07**，每月约 ¥2 以内

### 失败回退

任何环节失败（API Key 错、网络断、超时 8 秒（`deepseek-reasoner` 为 30 秒）、未启用），都会**自动回退**到原硬编码话术，不会让宠物"哑巴"。

---

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

## 许可与免责声明

本项目是一个 **个人逆向研究、桌面移植与怀旧存档** 项目，**与腾讯控股有限公司无任何关联，亦未获得其授权**。

### 知识产权

- 从公开可核实资料看，`QQ宠物` 及其相关标识、角色形象、美术资源、软件程序和衍生内容，整体上属于 **腾讯及其关联主体** 享有或运营的知识产权资产；不同权利类型的登记主体、著作权人和运营主体可能并不完全相同。本项目对前述内容不主张任何权利。
- 项目所基于的原始 Electron 应用程序 **并非本项目原创**，源自 **公开互联网上流传的 "QQ宠物怀旧服 v1.2.4" 安装包**；本项目仅出于研究、跨平台兼容、隐私加固（移除遥测）、Flash 替代与个人怀旧存档目的进行解包与最小必要修改。
- 本项目原创部分（已公开的 Python 管理工具、跨平台移植所做的代码修改、构建脚本与文档，以及后续可能公开的脱敏版逆向分析材料）按 **MIT 许可证**（见 [LICENSE](./LICENSE)）授权。

### 使用限制

- **仅供** 个人学习、研究、怀旧与技术交流使用，**严禁** 任何商业用途。
- 未经相关权利人授权，将 `QQ宠物` 相关内容用于收费分发、商业运营、广告导流或其他营利性用途，通常具有较高的商标侵权、著作权侵权及不正当竞争风险。
- 项目按 "原样" 提供，**不附带任何明示或暗示的担保**；使用风险由使用者自行承担。
- 原腾讯官方服务器早已停服，本项目仅在本地运行，**不会、也无法连接到任何腾讯服务器**。
- 若腾讯控股有限公司或其授权代理人认为本项目侵犯其合法权益，请通过 GitHub Issue 与作者联系，作者承诺 **第一时间下架本仓库及构建产物，绝不抗辩**。

完整声明详见 [NOTICE.md](./NOTICE.md) 文件。如希望参与改进，请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)。
