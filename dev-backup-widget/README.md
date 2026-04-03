# dev-backup-widget

本地开发时一键把**当前项目源码**（遵守根目录 `.gitignore`，始终排除 `.git`）推送到 **GitHub** 指定分支。包含：

- **CLI**：`dev-backup serve` 在本机 `127.0.0.1` 起 HTTP 服务（备份 API + 可嵌入脚本）
- **浮动控件**：可拖动、备份中 / 成功 / 失败提示
- **可选**：`GET /snapshot.zip` 下载与备份规则一致的 zip（无需 token）

与 Vite / Webpack 等无关；任意本地预览页面只要加载脚本即可。

**运行要求：** Node.js **≥ 18**（使用全局 `fetch`）。

---

## 供 AI / 自动化助手参考（Agent-oriented summary）

以下为便于检索与执行检查的**事实表**；实现以仓库内代码为准。

| 项目 | 说明 |
|------|------|
| 包入口 CLI | `dev-backup`（`package.json` 的 `bin` → `bin/dev-backup.js`） |
| 子命令 | `serve`（常驻）、`init`（写模板）、`help` / `-h` |
| 监听地址 | 仅 **`127.0.0.1`**，非 `0.0.0.0` |
| 默认端口 | `37547`；可被 `DEV_BACKUP_PORT` 或 `--port` 覆盖 |
| 备份根目录 | `DEV_BACKUP_PROJECT_ROOT` 或 `serve --project-root`，否则 **`process.cwd()`** |
| GitHub 凭据 | `GITHUB_TOKEN` 或 **`GH_TOKEN`**；仓库 `GITHUB_REPOSITORY=owner/repo` 或 `GITHUB_OWNER`+`GITHUB_REPO` |
| 分支 | `GITHUB_BRANCH`，默认 **`main`** |
| 备份逻辑 | `lib/collect-files.js` 收集 → `lib/github.js` 推送；空仓先用 Contents API 再 Git Data API |
| 控件配置 | 页面设 `window.__DEV_BACKUP__ = { apiOrigin: 'http://127.0.0.1:<port>' }`，再加载 `/widget.js` |
| 修改代码后 | 需**重启** `dev-backup serve` 进程 |

**推荐自动化检查顺序：** `GET /health` 确认 `projectRoot` → 确认环境变量在同一 shell 已导出 → `POST /backup` 看 JSON 的 `ok` 字段。

---

## 仓库结构（维护/扩展时查阅）

```
dev-backup-widget/
├── bin/dev-backup.js      # CLI 入口
├── lib/
│   ├── serve.js           # HTTP 服务、CORS、路由
│   ├── collect-files.js   # 遍历 + 根目录 .gitignore + 排除 .git
│   ├── zip.js             # snapshot.zip
│   ├── github.js          # GitHub REST（空仓初始化 + 快照提交）
│   └── init.js            # init 子命令
├── widget/widget.js       # 浮动按钮脚本（由 serve 提供）
├── test/                  # node:test
└── README.md
```

---

## 安全说明

- **切勿**把 `GITHUB_TOKEN` 写进会被部署到公网的前端代码或提交进 Git 的明文配置（`.dev-backup.env` 应 **gitignore**）。
- 仅在**本机开发**使用；生产构建请移除 HTML 中的 widget 引用。
- Token 建议最小权限：**Fine-grained** 时对目标仓库勾选 **Contents: Read and write**（及元数据读取）；Classic PAT 需能推送该仓库（如 `repo` 范围仅限备份仓）。

## 安装

```bash
npm install -D dev-backup-widget
```

从本地路径安装示例：

```bash
npm install -D ./path/to/dev-backup-widget
```

## 快速开始

### 1. 在 GitHub 建一个用于接收快照的仓库

记下 `owner/repo`，并创建有权限的 **Personal Access Token**。空仓库即可；首次备份会自动初始化。

### 2. 配置环境变量

在**启动 `serve` 时所在的环境**中提供变量。常见做法：在项目里放 `.dev-backup.env`（**加入 `.gitignore`**）：

```env
GITHUB_TOKEN=ghp_xxxxxxxx
GITHUB_REPOSITORY=your-username/your-backup-repo
GITHUB_BRANCH=main
```

**`.env` 书写规则（易错）：**

- 使用 **半角** `KEY=value`，**不要**用中文全角冒号 `：`。
- `=` 两侧**不要**随意加空格（避免部分 shell/`xargs` 解析异常）。
- 路径示例：`DEV_BACKUP_PROJECT_ROOT=/absolute/path/to/project`（不要用 `：`）。

可选变量：

| 变量 | 作用 | 默认 |
|------|------|------|
| `DEV_BACKUP_PROJECT_ROOT` | 要备份的目录（绝对路径推荐） | 启动 `serve` 时的 **cwd** |
| `DEV_BACKUP_PORT` | HTTP 端口 | `37547` |
| `GH_TOKEN` | 同 `GITHUB_TOKEN` | — |
| `GITHUB_OWNER` + `GITHUB_REPO` | 代替 `GITHUB_REPOSITORY` | — |

### 3. 生成示例文件（可选）

```bash
npx dev-backup init
```

生成 `.dev-backup.env` 模板与 `dev-backup-snippet.html`；若文件已存在则**不会覆盖**。

### 4. 启动本地服务

**macOS / Linux**（在项目目录，先载入 env 再启动）：

```bash
set -a && source .dev-backup.env && set +a && npx dev-backup serve
```

或：

```bash
export $(grep -v '^#' .dev-backup.env | xargs) && npx dev-backup serve
```

**Windows（cmd）：** 逐条 `set GITHUB_TOKEN=...` 等，或在「系统环境变量」中配置后新开终端，再执行 `npx dev-backup serve`。

**Windows（PowerShell）：** 可用 `$env:GITHUB_TOKEN="..."` 等形式设置后执行 `npx dev-backup serve`。

也可用 CLI 显式指定目录（仍需要已导出 GitHub 相关变量）：

```bash
npx dev-backup serve --project-root /path/to/project --port 37547
```

建议在 `package.json` 中增加脚本，减少重复输入（`dev-backup:env` 仅适合 **bash/zsh**）：

```json
{
  "scripts": {
    "dev-backup": "dev-backup serve",
    "dev-backup:env": "set -a && source .dev-backup.env && set +a && dev-backup serve"
  }
}
```

Windows 请用手动 `set`/`$env:` 或在本机终端包装脚本载入 env，勿直接照搬含 `source` 的一行。

### 5. 在预览页面中嵌入控件

在 HTML 的 `</body>` 前加入（端口与 `serve` 一致）：

```html
<script>
  window.__DEV_BACKUP__ = { apiOrigin: 'http://127.0.0.1:37547' };
</script>
<script src="http://127.0.0.1:37547/widget.js" defer></script>
```

点击浮动按钮即 `POST` 上述 `apiOrigin` 的 `/backup`。

**预览方式：** `file://` 打开时浏览器会发 `Origin: null`，本服务已允许。**更推荐** `npx serve .` 或 `python3 -m http.server` 用 `http://127.0.0.1:…` 访问，可减少浏览器对 `file://` 的告警。

## HTTP API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/health` | 探活；响应 JSON：`ok`, `projectRoot`（解析后的备份根目录） |
| GET | `/widget.js` | 浮动控件脚本 |
| GET | `/snapshot.zip` | 按与备份相同规则打包 zip，**不需要** GitHub token |
| POST | `/backup` | 收集文件并推送 GitHub；**需要**已配置 token 与仓库 |

**监听：** 仅 `127.0.0.1`。

**CORS：** 允许来源为 `http(s)://localhost`、`127.0.0.1`、`[::1]`，以及 **`Origin: null`**（`file://`）。无 `Origin` 的客户端（如 curl）响应中带 `Access-Control-Allow-Origin: *`。

### `POST /backup` 响应约定（便于脚本解析）

成功示例（字段以实际返回为准）：

```json
{
  "ok": true,
  "message": "Backup complete",
  "commitSha": "<40-char-sha>",
  "branch": "main",
  "owner": "<owner>",
  "repo": "<repo>",
  "fileCount": 42
}
```

失败示例：

```json
{
  "ok": false,
  "error": "<可读错误信息，可能含 GitHub 原文>"
}
```

未配置 token / 仓库时 HTTP **503**，body 同上 `ok: false`。

## 架构简述

1. 浏览器中的 **widget** 只负责调用本机 HTTP API，**不**接触 token。
2. **serve** 进程读取磁盘上 `projectRoot` 内的文件（尊重根目录 `.gitignore`），由 **github** 模块调用 GitHub REST。
3. **空仓库：** 先 `PUT .../contents/{path}` 写入字典序第一个文件初始化 Git，再创建包含全部文件的 tree/commit，并用 **`PATCH .../git/refs/heads/...`**（注意 **`refs` 复数**）更新分支。

## 限制（MVP）

- 首次备份空仓库会产生 **两条提交**（初始化 + 全量快照），之后每次通常一条。
- 单次备份最多 **800** 个文件；超出请收紧 `.gitignore` 或拆分项目。
- 仅解析**根目录** `.gitignore`（不合并子目录 `.gitignore`）。
- 每次备份会令远端分支的**整棵树**与本地快照一致（适合**专用备份仓**；勿用于多人协作主线 unless 有意覆盖）。
- 受 GitHub API 单文件大小、速率限制等约束。

## 故障排查

| 现象 | 处理 |
|------|------|
| 控件无法连接 / `Failed to fetch` | 确认 `dev-backup serve` 已启动；`apiOrigin` 端口与监听一致；页面与 API 均为本机 |
| CORS / `Origin null` | 已内置支持；若仍失败，换用 `http://127.0.0.1` 静态服务打开页面 |
| `503` / 提示缺少 token | 环境变量未进入**当前**终端进程；检查 `source`/导出方式后重启 `serve` |
| `401` / `403` | Token 是否过期、是否对目标仓库有写权限；Fine-grained 是否含 Contents 写 |
| 备份文件数为 `0` | 文件是否全被 `.gitignore` 排除；`DEV_BACKUP_PROJECT_ROOT` 是否指向预期目录（对照 `GET /health`） |
| `409` + `Git Repository is empty`（blob） | 使用**当前版本**包；空仓会先 Contents 再 blob；仍报错则升级/重启 `serve` |
| `404` + `GitHub ref update failed` | 旧版误用 `git/ref` 做 `PATCH`；应使用 `git/refs`；请更新本包并重启 |
| `.dev-backup.env: no such file or directory` | 行内使用了全角 `：` 或错误符号；改为半角 `KEY=value` |
| 改代码后不生效 | 重启 `npx dev-backup serve` |

## 测试

```bash
npm test
```

## 许可

MIT
