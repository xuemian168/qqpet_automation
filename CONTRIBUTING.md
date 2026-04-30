# 贡献指南

这是一个 QQ 宠物怀旧服 v1.2.4 的逆向 + 移植项目。先说清楚边界，再说怎么改。

## 红线

QQ 宠物的 IP 是腾讯的，原 Electron 程序也是从网上扒来的怀旧版安装包。这两点决定了项目能接受什么、不能接受什么。

**不要提交：**

- 腾讯的美术、音频、未脱敏的服务端响应——已经在仓库里的不要再扩；没有的不要新加
- 任何商业化的东西：付费、广告、代练、刷资源
- 连接腾讯线上服务（非怀旧停服环境）的代码、伪造身份的请求
- 来源不明或许可证不兼容（GPL、未声明）的第三方代码
- 恶意代码——不解释

**欢迎做：**

- 协议逆向、文档完善
- 跨平台兼容（macOS / Windows / Linux）
- 隐私加固（移除遥测、指纹）
- Flash → Ruffle / WASM 改进
- Python CLI 的功能、测试、修 bug
- 错别字、翻译、说明改进

不确定算不算红线就先开 Issue 问。

## 跑起来

Electron 端：

```bash
cd qq-pet-macos
npm install
npx electron .
```

Python 工具：

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pip install -e ".[dev]"
pytest
```

要求 Node.js ≥ 18，Python ≥ 3.10。

## 提交

Fork → 建分支 → 改代码 → 跑测试 → PR 到 `main`。分支名 `feat/xxx`、`fix/xxx`、`docs/xxx` 这种就行。

Commit 用 [Conventional Commits](https://www.conventionalcommits.org/)，例如：

```
feat(cli): 增加批量喂食命令
fix(sync): 修复 Windows 路径含空格时崩溃
```

PR 改了 UI 的，附张截图或录屏，省得维护者本地复现。

## 测试

涉及逻辑改动的，先写测试再写实现。覆盖率目标 80%。Python 测试在 `tests/`，用 pytest。

不要为了凑覆盖率写"调用了某函数"这种空断言。也不要 mock 文件系统但生产路径走真 I/O——这种测试通过了也没意义。

## 风格

- 命名好就别加注释。注释只用来解释"为什么这样而不是那样"——隐藏的约束、奇怪的 workaround、上游 bug 编号。不要写"此处用于 X 流程"这种和调用方耦合的注释，那是 PR 描述该干的事。
- 函数返回新对象，别原地改入参。
- 文件 200~400 行为佳，800 是上限。超了就拆。
- Python 必须类型标注，路径用 `pathlib.Path`。
- JS 用 `const` / `let`，禁用 `var`，异步统一 `async/await`。

## Issue

报 bug 给到这些就够了：操作系统 + 版本、项目版本（commit hash 或 tag）、复现步骤、预期 vs 实际、必要的日志。

## 安全

发现 RCE、提权、密钥泄漏这类问题，不要直接开 public issue——走 GitHub Security Advisory 私下提，或邮箱联系维护者。

## 许可

提交 PR 即同意你的代码按本仓库 [LICENSE](./LICENSE)（MIT）授权。引用了别人代码的，确认许可证兼容（MIT / BSD / Apache-2.0 / ISC），保留原始版权声明，并在 PR 描述里写明出处。
