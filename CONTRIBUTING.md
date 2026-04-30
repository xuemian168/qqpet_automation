# 贡献指南 (Contributing Guide)

感谢你对 **WorkBuddy / QQ 宠物管家** 项目的关注！本项目是一个面向 QQ 宠物（怀旧服 v1.2.4）的 **个人逆向研究、桌面移植与怀旧存档** 项目。在提交贡献前，请务必通读本文件以及 [LICENSE](./LICENSE) 与 [NOTICE.md](./NOTICE.md)。

> 提交 Issue / PR 即视为你已阅读并同意本指南中的所有条款。

---

## 0. 贡献前必读 — 法律边界 (Legal Boundary, READ FIRST)

由于本项目涉及第三方（腾讯）的知识产权，**贡献范围有严格限制**。提交 PR 前请确认你的贡献：

### ✅ 欢迎的贡献

- 通信协议 / 二进制结构的逆向分析与文档完善
- 跨平台兼容性修复（macOS / Windows / Linux）
- 隐私加固（移除遥测、指纹采集、网络回连等）
- Flash → Ruffle / WebAssembly 替代方案改进
- Python 管理工具（CLI、状态监控、养护逻辑）的功能增强
- 单元测试、E2E 测试、CI/CD 改进
- 文档翻译、错别字修正、说明优化
- Bug 修复（包括崩溃、闪退、UI 错位）
- 构建产物体积优化、启动速度优化

### ❌ 不接受的贡献 (PR 将被直接关闭)

- **任何包含腾讯专有资源的提交**：美术素材、音频文件、角色图、UI 切图、未脱敏的服务端响应数据等。原始包中已有的资源不要新增、扩展、二创再上传。
- **可用于商业目的的功能**：付费代练、外挂代销、刷币刷资源、广告植入、付费墙等。
- **任何绕过腾讯在运营业务的代码**：如连接非怀旧服的腾讯线上服务器、伪造客户端身份请求、滥用账号体系等。
- **存在版权争议的第三方代码**：来源不明、许可证不兼容（GPL、未声明）的代码片段。
- **大规模复制粘贴 AI 生成内容而未审阅**：尤其是文档、注释。
- **恶意代码**：后门、远控、键盘记录、窃密等。

### IP 出处声明 (Provenance Statement)

提交 PR 时，请在描述中确认：

```
- [ ] 本 PR 不包含腾讯专有资源（美术、音频、未脱敏数据等）
- [ ] 本 PR 中所有代码均为我本人原创，或来自与 MIT 兼容的开源许可证
- [ ] 我同意将本 PR 按本仓库 LICENSE（MIT）授权
- [ ] 我已阅读 NOTICE.md，理解本项目的非商业、研究用途定位
```

---

## 1. 开发环境 (Development Setup)

### Electron 桌面端 (qq-pet-macos)

```bash
cd qq-pet-macos
npm install
npx electron .            # 本地运行
npm run build:mac         # macOS DMG/ZIP
npm run build:win         # Windows NSIS/Portable
npm run build:linux       # Linux AppImage/tar.gz
```

要求：Node.js ≥ 18，npm ≥ 9。

### Python 管理工具 (src/qq_pet)

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install -e ".[dev]"
pytest                    # 运行单元测试
```

要求：Python ≥ 3.10。

---

## 2. 提交流程 (Workflow)

1. **Fork** 本仓库到你自己的 GitHub 账号
2. 基于 `main` 创建特性分支：
   ```bash
   git checkout -b feat/your-feature
   git checkout -b fix/issue-123
   ```
3. 编写代码 + 测试（**必须先写测试**，参见第 4 节）
4. 本地验证：
   - `pytest` 全绿
   - `npx electron .` 应用可正常启动
   - 涉及 UI 改动需附运行截图 / 录屏
5. 按 [Conventional Commits](https://www.conventionalcommits.org/) 提交：
   ```
   feat(cli): 增加批量喂食命令
   fix(sync): 修复 Windows 路径包含空格时崩溃
   docs(readme): 补充 Linux 安装说明
   refactor(store): 抽取 electron-store 读写逻辑为单独模块
   test(actions): 为治病动作补单元测试
   chore(ci): 升级 GitHub Actions 到 v4
   ```
6. 推送并发起 Pull Request，目标分支 `main`
7. 等待 review，按反馈修改

### 分支命名

- `feat/<short-name>` — 新功能
- `fix/<short-name>` — Bug 修复
- `refactor/<short-name>` — 重构（无行为变化）
- `docs/<short-name>` — 文档
- `chore/<short-name>` — 杂项（CI、依赖升级、构建脚本等）

---

## 3. 编码规范 (Coding Standards)

### 通用原则

- **KISS / YAGNI / DRY / SOLID** — 优先简洁直观，反对过度设计
- **不变性优先** — 函数返回新对象而非原地修改入参
- **小文件优先** — 单文件 200~400 行为佳，800 行为上限；拆分关注点
- **错误处理显式化** — 不静默吞异常；面向用户的错误信息要友好
- **边界处校验** — 所有外部输入（文件、网络、CLI 参数）必须验证

### Python (`src/qq_pet/`)

- 遵循 **PEP 8**；类型标注覆盖率 100%
- 公共 API 必须有 docstring（说明参数、返回值、异常）
- 使用 `pathlib.Path` 而非字符串拼接路径
- 异常类继承层次清晰，不要直接 `raise Exception`

### JavaScript / Electron (`qq-pet-macos/`)

- 现代 ES (ES2020+)，使用 `const` / `let`，禁用 `var`
- 异步统一使用 `async/await`，避免回调地狱
- 主进程与渲染进程严格分离，IPC 通道命名清晰
- 路径处理使用 `path.join` / `path.resolve`，**永远用双引号包裹含空格的路径**

### 注释

- 默认 **不写注释**——好的命名已经说明 *做什么*
- 仅在**为什么这样做不显然**时写注释（隐藏约束、奇怪的 workaround、与上游 bug 的关联等）
- 不写"此处用于 X 流程"这类与调用方耦合的注释（PR 描述里写）

---

## 4. 测试要求 (Testing)

本项目采用 **测试驱动开发 (TDD)**：

1. **先写测试** (RED) — 测试应失败
2. **最小实现** (GREEN) — 让测试通过
3. **重构** (REFACTOR) — 保持测试绿

### 覆盖率要求

| 类型 | 最低覆盖率 |
|---|---|
| 单元测试 | **80%** |
| 集成测试 | 关键路径 100% |
| E2E 测试 | 主用户流程 100% |

### 测试位置

- Python：`tests/`，使用 `pytest`
- Electron：`qq-pet-macos/tests/`（如有），使用 Playwright 做 E2E

### 不接受的测试

- 仅断言"调用了某函数"而不验证行为
- mock 数据库 / 文件系统但实际生产路径走真 I/O 的（参见 `feedback`：integration tests must hit real database 的精神）

---

## 5. Issue 报告 (Reporting Issues)

提 Bug 时请提供：

1. **环境**：操作系统 + 版本、Node / Python 版本、本项目版本（`git rev-parse HEAD` 或 release tag）
2. **复现步骤**：最小化、按顺序列出
3. **预期行为** vs **实际行为**
4. **日志 / 截图**：终端输出、应用日志（路径见 README "数据文件位置"）
5. **是否已搜过现有 Issue**

提需求 (Feature Request) 时请说明：

1. **使用场景**：为什么需要这个功能？
2. **替代方案**：有没有现有方法可以绕过？
3. **是否符合本项目定位**：研究 / 怀旧 / 移植，**非商业**

---

## 6. 安全问题 (Security)

发现安全漏洞（如 RCE、本地提权、密钥泄漏）请 **不要直接提 Public Issue**。请通过 GitHub Security Advisory 私下报告，或联系仓库维护者邮箱。修复发布前请勿公开细节。

---

## 7. 代码审查 (Code Review)

- 所有 PR 至少需要 **1 名维护者批准** 后方可合并
- CI 检查必须全绿（构建、测试、lint）
- 触及核心模块（`store_reader.py`、`main.js`、构建配置）的改动需要更慎重的 review
- 维护者保留以"超出项目范围""引入风险""不符合项目定位"等理由关闭 PR 的权利

---

## 8. 许可证 (License)

通过提交 PR，你同意你的贡献按本仓库 [LICENSE](./LICENSE)（**MIT 许可证**）授权。

如你的贡献中包含来自其他开源项目的代码，必须：

1. 该项目使用 **与 MIT 兼容** 的许可证（MIT、BSD、Apache-2.0、ISC 等）
2. 在文件头或 `NOTICE.md` 中保留原始版权声明
3. 在 PR 描述中标注来源 URL 与许可证

---

## 9. 行为准则 (Code of Conduct)

请保持友善、专业、就事论事。本项目是一个 **怀旧爱好者社区**，不是发泄情绪的场所。维护者保留对违反此准则的评论 / 用户进行删除 / 屏蔽的权利。

---

再次感谢你的贡献。哪怕只是一个错别字修正，也欢迎提 PR。
