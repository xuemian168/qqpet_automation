# 第三方权利声明与免责声明

**WorkBuddy / QQ 宠物管家 — Third-Party Notices & Disclaimer**

> 本项目是一个对腾讯 QQ 宠物（怀旧服 v1.2.4）的 **个人逆向研究、桌面移植与怀旧存档** 项目，**不属于腾讯官方产品**，与腾讯控股有限公司及其关联方 **没有任何关联、隶属、授权或合作关系**。
>
> This project is an independent reverse-engineering, desktop-port and archival effort related to "QQ Pet" (QQ宠物 Legacy v1.2.4). It is **NOT an official Tencent product** and is **not affiliated with, endorsed by, sponsored by, or in any way connected to Tencent Holdings Ltd.** or any of its subsidiaries.

---

## 1. 知识产权归属 (Intellectual Property Ownership)

以下知识产权归 **腾讯控股有限公司**（Tencent Holdings Ltd.，下称"腾讯"）及其关联方所有，本项目对其不主张任何权利：

- "QQ"、"QQ宠物"、"QQ Pet" 等名称、商标与商业标识
- QQ 宠物角色形象（包括但不限于宠物外观、服饰、配饰、表情）
- 游戏内美术资源（精灵图、动画帧、UI 素材、图标）
- 游戏内音频资源（背景音乐、音效）
- 游戏世界观、剧情文本、道具命名、属性数值等设计要素

> All names, trademarks, characters, artwork, sprites, animations, UI assets, audio, lore, item names, and game-design data of "QQ宠物 / QQ Pet" are the exclusive intellectual property of Tencent Holdings Ltd. and/or its affiliates. No claim of ownership over any of the foregoing is made by this project.

---

## 2. 源程序来源声明 (Source Program Provenance)

本项目所基于的原始 Electron 应用程序（即 `qq_pet_asar/`、`qq_pet_app/`、`qq_pet_extracted/` 目录中的内容，以及 `qq-pet-macos/src/` 中由原始 `app.asar` 解包并修改而来的源码），**并非本项目原创**，而是来源于 **公开互联网上流传的"QQ宠物怀旧服 v1.2.4"安装包**。其著作权归原作者所有；本项目仅出于以下目的对其进行解包、分析与最小必要修改：

1. 学术性逆向研究与通信协议分析；
2. 跨平台（macOS / Windows / Linux）兼容性移植；
3. 移除遥测与设备指纹采集，保护用户隐私；
4. 用 Ruffle WASM 替代已废弃的 Adobe Flash 插件，使应用在现代系统上可运行；
5. 个人怀旧体验与文化存档。

> The original Electron application this project builds upon was obtained from a publicly circulated build of "QQ宠物 怀旧服 v1.2.4" found on the public internet. It is **not original work of this project**. Modifications are made strictly for research, cross-platform compatibility, privacy hardening, Flash-deprecation mitigation, and personal archival purposes.

---

## 3. 本项目原创部分 (Original Contributions of This Project)

以下内容为本项目原创，按 [LICENSE](./LICENSE) 文件中的 **MIT 许可证** 授权：

- 通信协议逆向分析报告（`新版QQ宠物1.2.4-逆向通信分析报告.{tex,pdf}`、`docs/`）
- Python 管理工具与命令行（`src/qq_pet/`、`tests/`、`pyproject.toml`、`requirements.txt`、`config.yaml`）
- macOS / Windows / Linux 移植所做的代码修改（`qq-pet-macos/main.js` 等由本项目作者编写或修改的部分）
- 构建脚本、CI 工作流（`.github/workflows/`）与项目元数据
- OpenClaw Skill 定义（`skills/qq-pet/`）
- `README.md`、`LICENSE`、`NOTICE.md`、`CONTRIBUTING.md` 等项目文档

---

## 4. 第三方依赖 (Third-Party Dependencies)

本项目使用了以下主要第三方组件，其版权与许可由各自项目持有：

| 组件 | 许可证 | 项目主页 |
|---|---|---|
| Electron | MIT | <https://github.com/electron/electron> |
| Chromium | BSD-style | 见 `qq_pet_app/LICENSES.chromium.html` |
| Ruffle (Flash WASM emulator) | MIT / Apache-2.0 | <https://ruffle.rs> |
| 其他 npm / PyPI 依赖 | 各自许可证 | 详见 `package.json` / `pyproject.toml` |

Electron 完整许可文本随构建产物分发，参见 `qq_pet_app/LICENSE.electron.txt` 与 `qq_pet_app/LICENSES.chromium.html`。

---

## 5. 使用限制与免责声明 (Use Restrictions & Disclaimer)

### 5.1 仅限非商业用途

本项目及其衍生构建产物 **仅供个人学习、研究、怀旧与技术交流使用**，**严禁** 将其用于任何商业目的（包括但不限于销售、广告、付费分发、游戏代练、外挂代销等）。

> For personal study, research, reminiscence and technical exchange only. **Commercial use is strictly prohibited.**

### 5.2 不提供任何担保

本项目按"原样"提供，不附带任何明示或暗示的担保（包括但不限于适销性、特定用途适用性、不侵权之担保）。使用者使用本项目所产生的任何风险与后果，均由使用者自行承担。

> THE PROJECT IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.

### 5.3 服务器端不可用

本项目原 Electron 程序所连接的腾讯官方 QQ 宠物服务器早已停服，本项目仅在本地模拟运行，**不会、也无法连接到任何腾讯服务器**，不会对腾讯任何在运营业务造成影响。

### 5.4 权利人主张时立即下架

若 **腾讯控股有限公司** 或其授权代理人认为本项目侵犯其合法权益，请通过 GitHub Issue 或仓库主页公示的联系方式与作者联系；作者承诺在收到合理通知后 **第一时间下架本仓库及相关构建产物**，绝不抗辩。

> If Tencent Holdings Ltd. or any rightful owner believes this project infringes their lawful rights, the author commits to taking down this repository and all related build artifacts promptly upon receipt of a reasonable notice via GitHub Issues or the contact channel listed on the repository homepage, without dispute.

### 5.5 用户行为

使用者应自行评估本地法律法规要求，遵守与腾讯相关产品（如 QQ）的用户协议；因使用本项目产生的法律责任由使用者自行承担，与作者无关。
