# QQ 宠物（怀旧服）OpenClaw Skill 设计文档

## Context

QQ 宠物怀旧服（v1.2.4）是一个 **Electron 应用**，内部使用 Express + Flash 渲染宠物动画。通过逆向分析 asar 包，发现所有游戏状态存储在 electron-store（AES-256-CBC 加密的 JSON 文件）中，并通过全局 JavaScript 函数（`setPetInfo`/`getPetInfo`/`addPetInfo` 等）管理。

**关键发现**：无需 OpenCV 模板匹配。可以直接读写 electron-store 数据文件来操控宠物状态，或通过注入脚本调用内部 API。

## 逆向分析结果

### 应用架构

```
pet.exe (Electron)
├── main.js           → 入口，加载 Flash 插件
├── src/ini/
│   ├── init.js       → 初始化链（aes → tool → store → sys → screen → safe → pet）
│   ├── store.js      → electron-store 封装（$Store 全局对象）
│   ├── pet.js        → 宠物数据全局函数（setPetInfo/getPetInfo/addPetInfo）
│   └── root.js       → Express 服务器（127.0.0.1:33385）
├── src/windows/util/pet/
│   ├── State.js      → 健康/疾病系统
│   ├── GrowUp.js     → 成长/衰减计算（60秒周期）
│   ├── Goods.js      → 物品/商店系统
│   ├── shop.js       → 商品定义
│   └── communication.js → 对话系统
└── src/service/
    ├── config.js     → API 配置（baseUrl: 127.0.0.1:33051）
    └── request.js    → axios HTTP 客户端
```

### 宠物数据结构

```javascript
// 基础信息（info）
{ name, host, sex, growth, hunger, clean, health, mood,
  birthDay, intel, charm, strong, onLineTime, yb, lastX, lastY,
  lastLoginTime, onlineDataTime }

// 最大值（maxInfo）
{ stopGrowth, level, upGrowth, nextGrowth, growthRate: 260,
  hunger: 3000+100*level, clean: 3000+100*level, health: 5, mood: 1000 }

// 活动状态（activeOption）
{ work, study, trip, ill, die }

// 其他选项（otherOptions）
{ pinkDiamond, growth, pinkDiamondLevel, sweetHeart }

// 物品缓存（cache.store）
{ food: [], commodity: [], medicine: [], background: [] }
```

### 关键阈值（来自源码）

| 属性 | 临界值 | 含义 |
|------|--------|------|
| hunger < 720 | 饥饿状态 | 触发"需要吃饭"提示，增加生病概率 |
| clean < 1080 | 脏了 | 触发"需要洗澡"提示，增加生病概率 |
| mood < 100 | 心情低落 | 增加生病概率，影响成长速率 |
| health = 5 | 正常 | — |
| health = 4/3/2/1 | 逐级严重疾病 | 需要对应药物治疗 |
| health = 0 | 死亡 | 需要还魂丹（60001） |

### 疾病链

```
感冒(板蓝根) → 发烧(退烧药) → 重感冒(银翘丸) → 肺炎(金色消炎药水) → 死亡(还魂丹)
咳嗽(枇杷糖浆) → 支气管炎(甘草剂) → 哮喘(定喘丸) → 肺结核(通风散) → 死亡
肚子胀(消食片) → 胃炎(蓝色消炎药水) → 胃溃疡(龙胆草) → 胃癌(仙人汤) → 死亡
```

### 属性衰减（每 60 秒）

- hunger: 减 5-8（心情低于 600 额外 +2）
- clean: 减 5-8（心情低于 600 额外 +2）
- mood: 减 2-4

### 调试快捷键（已内置）

- Ctrl+Shift+NumMult: 添加食物
- Ctrl+Shift+NumDiv: 添加清洁用品
- Ctrl+Shift+NumSub: 添加药品
- Ctrl+Shift+2: 增加 5000 成长值
- Ctrl+Shift+3: 增加 100 元宝
- ALT+.: 上帝模式

## 技术方案

### 交互方式：读写 electron-store 数据文件

electron-store 将数据保存在用户数据目录下的 `config.json`（正式模式，AES-256-CBC 加密）或 `configDev.json`（测试模式，明文）。

**方案**：通过 Python 脚本直接读写该数据文件：
1. 定位 electron-store 数据文件路径
2. 解密读取宠物状态
3. 修改状态后重新加密写入
4. 应用重启或下次读取时生效

**备选方案**（更实时）：通过 Electron DevTools Protocol 或注入 preload 脚本，直接调用 `setPetInfo()` 等全局函数。

### 推荐：双模式支持

- **离线模式**：直接读写 electron-store 文件（不需要应用运行）
- **在线模式**：通过 CDP (Chrome DevTools Protocol) 连接运行中的 Electron 应用，实时调用 JS API

## 架构概览

```
OpenClaw 智能体
    ↓ (exec 调用)
Python CLI (src/qq_pet/cli.py)
    ↓
┌─────────────────────────────────────┐
│          pet_client.py              │
│  ┌──────────┐  ┌──────────────────┐ │
│  │ 离线模式  │  │ 在线模式 (CDP)   │ │
│  │ 读写JSON  │  │ 调用 JS 全局函数  │ │
│  └──────────┘  └──────────────────┘ │
└─────────────────────────────────────┘
    ↓                    ↓
electron-store        Electron App
(config.json)         (运行中的进程)
```

## 项目结构

```
workbuddy/
├── skills/
│   └── qq-pet/
│       └── SKILL.md                # OpenClaw Skill 定义
├── src/
│   └── qq_pet/
│       ├── __init__.py
│       ├── cli.py                  # CLI 入口（JSON 输出）
│       ├── pet_client.py           # 宠物数据客户端（读写 electron-store）
│       ├── store_reader.py         # electron-store 文件读写 + AES 解密
│       ├── actions.py              # 高层动作（喂食、洗澡、治病、逗玩等）
│       ├── game_data.py            # 游戏数据常量（疾病链、物品ID、等级表等）
│       └── models.py               # 数据模型（PetInfo, PetStatus 等）
├── config.yaml                     # 配置（数据文件路径、阈值等）
├── requirements.txt
├── pyproject.toml
└── README.md
```

## Python CLI 接口

所有命令通过 `python -m src.qq_pet.cli <command>` 调用，输出 JSON。

### 命令列表

| 命令 | 功能 | 输出示例 |
|------|------|---------|
| `status` | 查询宠物完整状态 | `{"name":"小Q", "level":15, "hunger":2800, "hunger_max":4500, "clean":2100, "clean_max":4500, "health":5, "mood":800, "mood_max":1000, "growth":12500, "yb":300, "ill":null}` |
| `feed [item_id]` | 喂食（可指定食物ID） | `{"success":true, "action":"feed", "hunger_before":800, "hunger_after":1800}` |
| `bath [item_id]` | 洗澡（可指定清洁用品） | `{"success":true, "action":"bath", "clean_before":500, "clean_after":1500}` |
| `heal [medicine_id]` | 治病（自动匹配药物） | `{"success":true, "action":"heal", "illness":"感冒", "medicine":"板蓝根"}` |
| `play` | 逗玩（增加心情） | `{"success":true, "mood_before":300, "mood_after":400}` |
| `auto` | 一键养护 | `{"actions":["feed","bath","heal"], "status_after":{...}}` |
| `inventory` | 查看背包物品 | `{"food":[...], "commodity":[...], "medicine":[...]}` |
| `info` | 查看宠物详细信息 | `{"name":"小Q", "sex":"男", "level":15, "birthday":"...", ...}` |
| `diagnose` | 诊断宠物健康 | `{"health":4, "illness":"感冒", "cure":"板蓝根(10001)", "severity":"轻微"}` |

### 错误输出格式

```json
{"error": "store_not_found", "message": "未找到 electron-store 数据文件"}
{"error": "decrypt_failed", "message": "数据文件解密失败"}
{"error": "no_medicine", "message": "背包中没有需要的药品：板蓝根"}
```

## 核心模块设计

### store_reader.py

- `find_store_path() -> Path`：定位 electron-store 数据文件（Windows: `%APPDATA%/pet/config.json`，macOS: `~/Library/Application Support/pet/config.json`）
- `read_store(path: Path, encryption_key: str) -> dict`：读取并解密 electron-store 数据
- `write_store(path: Path, data: dict, encryption_key: str) -> None`：加密并写入数据
- 加密方式：AES-256-CBC，key = "aes-256-cbc"（来自源码 store.js）

### pet_client.py

- `get_pet_info() -> PetInfo`：读取宠物完整信息
- `set_pet_info(updates: dict) -> None`：更新宠物信息
- `add_pet_info(increments: dict) -> None`：增量更新（饥饿+x, 清洁+x 等）
- `get_cache() -> dict`：读取物品缓存
- `set_cache(updates: dict) -> None`：更新物品缓存

### models.py

```python
@dataclass
class PetInfo:
    name: str
    host: str
    sex: str
    level: int
    growth: float
    hunger: int
    hunger_max: int
    clean: int
    clean_max: int
    health: int      # 5=正常, 4-1=生病, 0=死亡
    mood: int
    mood_max: int     # 1000
    yb: int           # 元宝
    intel: int        # 智力
    charm: int        # 魅力
    strong: int       # 武力

@dataclass
class Illness:
    name: str
    health: int
    cure_id: str
    cure_name: str
    children: Optional['Illness']  # 恶化后的下一级疾病
```

### game_data.py

包含从源码提取的常量：
- `ILLNESS_CHAINS`: 3 条疾病链（感冒/咳嗽/肚子胀系列）
- `FOOD_ITEMS`: 食物物品 ID 和属性
- `COMMODITY_ITEMS`: 清洁用品
- `MEDICINE_ITEMS`: 药品和对应治疗的疾病
- `LEVEL_TABLE`: 400 级经验值表
- `THRESHOLDS`: 饥饿(720)、清洁(1080)、心情(100) 临界值

### actions.py

- `feed(client, item_id=None) -> ActionResult`：喂食，优先使用背包中已有食物
- `bath(client, item_id=None) -> ActionResult`：洗澡
- `heal(client, medicine_id=None) -> ActionResult`：治病（自动匹配疾病对应药物）
- `play(client) -> ActionResult`：逗玩（增加 mood +100）
- `auto_care(client, config) -> AutoCareResult`：一键养护
- `diagnose(client) -> DiagnoseResult`：健康诊断

## OpenClaw SKILL.md

```markdown
---
name: qq_pet
description: 管理 QQ 宠物（怀旧服）— 自动养护、状态监控、疾病诊断和定时照料
metadata:
  openclaw:
    emoji: "🐾"
    os: ["darwin", "win32"]
    requires:
      bins: ["python3"]
---

# QQ 宠物管家

你是 QQ 宠物（怀旧服 v1.2.4）的智能管家。通过 Python 脚本直接读写游戏数据文件，
实现宠物状态监控、自动养护、疾病诊断和物品管理。

## 工具链

通过 `exec` 工具执行 CLI 命令：
- 工作目录：workbuddy 项目根目录
- 命令前缀：`python -m src.qq_pet.cli`
- 输出格式：JSON

## 触发条件

用户提到以下关键词时激活：
- "QQ宠物"、"宠物"、"喂食"、"饥饿"、"洗澡"、"逗玩"
- "宠物状态"、"养护"、"自动照料"、"治病"、"诊断"

## 游戏机制参考

### 属性临界值
- 饥饿 < 720：进入饥饿状态（加速生病）
- 清洁 < 1080：进入脏污状态（加速生病）
- 心情 < 100：心情低落（影响成长）
- 健康 = 5 正常，4-1 逐级生病，0 = 死亡

### 疾病系统
三条疾病链，不治疗会逐级恶化直至死亡。每种疾病有对应药物。
`python -m src.qq_pet.cli diagnose` 可查看当前疾病和需要的药物。

### 属性衰减
每 60 秒：饥饿 -5~8, 清洁 -5~8, 心情 -2~4

## 操作流程

### 1. 状态查询（始终先执行）
```bash
python -m src.qq_pet.cli status
```

### 2. 智能养护决策
根据返回的状态值：
- hunger < 720 → `python -m src.qq_pet.cli feed`
- clean < 1080 → `python -m src.qq_pet.cli bath`
- health < 5 → `python -m src.qq_pet.cli heal`（自动匹配药物）
- mood < 100 → `python -m src.qq_pet.cli play`

### 3. 一键养护
```bash
python -m src.qq_pet.cli auto
```

### 4. 查看背包
```bash
python -m src.qq_pet.cli inventory
```

## 输出规范

- 用中文回复
- 状态报告用表格，包含当前值/最大值/状态（良好/注意/紧急）
- 疾病诊断时说明疾病名、严重程度、所需药物
- 操作后重新查询确认效果

## 安全注意

- 修改数据前先备份原始 config.json
- 不要将 health 直接设为 0
- 不要删除物品缓存，只做增量修改
```

## 配置文件 (config.yaml)

```yaml
# electron-store 数据文件位置（留空则自动检测）
store_path: ""

# 加密密钥（来自源码 store.js）
encryption_key: "aes-256-cbc"

# 养护阈值
thresholds:
  hunger: 720      # 低于此值触发喂食
  clean: 1080      # 低于此值触发洗澡
  mood: 100        # 低于此值触发逗玩
  health: 5        # 低于此值触发治疗

# 喂食/洗澡时的补充量
feed_amount: 1000
bath_amount: 1000
play_mood_boost: 100

# 定时自动化
schedule:
  interval_minutes: 30
  enabled: false
```

## 依赖项

```
pyyaml>=6.0
pycryptodome>=3.20.0   # AES 解密 electron-store
```

注意：不再需要 opencv-python、pyautogui 等重量级依赖。

## 验证方式

1. `python -m src.qq_pet.cli status` — 确认能读取宠物数据
2. `python -m src.qq_pet.cli diagnose` — 确认健康诊断正确
3. `python -m src.qq_pet.cli feed` — 确认喂食后饥饿值增加
4. `python -m src.qq_pet.cli auto` — 确认一键养护流程
5. `openclaw agent --message "查看宠物状态"` — 确认 Skill 完整链路
