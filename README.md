# QQ 宠物管家 (WorkBuddy)

QQ 宠物（怀旧服 v1.2.4）的 OpenClaw Skill，通过直接读写 electron-store 数据文件实现宠物自动管理。

## 功能

- **状态监控**：查询饥饿/清洁/心情/健康/等级等完整状态
- **基础养护**：喂食、洗澡、逗玩
- **疾病诊断**：识别当前疾病、严重程度、所需药物
- **自动治疗**：匹配背包药物自动治病
- **一键养护**：按优先级自动处理所有问题
- **物品管理**：查看背包食物、清洁用品、药品

## 技术原理

QQ 宠物怀旧服是 Electron 应用，数据存储在 electron-store（AES-256-CBC 加密的 JSON 文件）中。本工具直接读写该数据文件，无需 OpenCV 或屏幕操控。

## 安装

```bash
pip install -r requirements.txt
```

依赖：
- `pyyaml` — 配置文件解析
- `pycryptodome` — AES 解密 electron-store

## 使用

```bash
# 查询状态
python -m src.qq_pet.cli status

# 喂食
python -m src.qq_pet.cli feed

# 洗澡
python -m src.qq_pet.cli bath

# 逗玩
python -m src.qq_pet.cli play

# 健康诊断
python -m src.qq_pet.cli diagnose

# 治病（自动匹配药物）
python -m src.qq_pet.cli heal

# 一键养护
python -m src.qq_pet.cli auto

# 查看背包
python -m src.qq_pet.cli inventory

# 备份数据
python -m src.qq_pet.cli backup
```

## OpenClaw Skill

将 `skills/qq-pet/` 目录复制到 OpenClaw skills 目录即可使用：

```bash
cp -r skills/qq-pet ~/.openclaw/skills/
```

## 配置

编辑 `config.yaml`：

```yaml
store_path: ""              # 留空自动检测
encryption_key: "aes-256-cbc"
thresholds:
  hunger: 720
  clean: 1080
  mood: 100
  health: 5
```

## 项目结构

```
workbuddy/
├── skills/qq-pet/SKILL.md     # OpenClaw Skill 定义
├── src/qq_pet/
│   ├── cli.py                 # CLI 入口
│   ├── pet_client.py          # 数据客户端
│   ├── store_reader.py        # electron-store 读写
│   ├── actions.py             # 动作封装
│   ├── game_data.py           # 游戏常量
│   └── models.py              # 数据模型
├── config.yaml                # 配置
└── docs/                      # 设计文档
```
