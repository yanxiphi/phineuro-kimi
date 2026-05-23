# PhiNeuro 项目 Agent 上下文备忘录

> 每次开始新任务前，先阅读此文件获取完整上下文。

---

## 项目概览

| 项目 | 路径 | 域名 | 部署方式 |
|---|---|---|---|
| **主站** | `20260520_3个模块增加/` | `phineuro.life` | GitHub Actions → Cloudflare Pages |
| **子站** | `phineuro-datasets-backend/` | `datasets.phineuro.life` | `npx wrangler pages deploy dist --branch=main` |

---

## 关键配置

### Cloudflare
- **Account**: `f866c886...`
- **D1 数据库**: `phineuro-datasets` (ID: `6fbb24cd...`)
- **子站 Pages 项目**: `phineuro-datasets`
- **主站 Pages 项目**: `phineuro-website`

### 环境变量（必须一致）
- `CRON_SECRET`: 同时存在于
  - Cloudflare Dashboard → `phineuro-datasets` → Settings → Variables and Secrets (Production)
  - GitHub Repo → Settings → Secrets and variables → Actions (Repository secrets)

### Git 仓库
- **主站**: `https://github.com/yanxiphi/phineuro-kimi.git`
- **子站**: 不是 Git 仓库，纯本地 + wrangler 部署

---

## 技术栈

| 层级 | 技术 |
|---|---|
| 前端 | React 19 + Vite + TypeScript + Tailwind CSS + shadcn/ui |
| 路由 | HashRouter (`/#/database`, `/#/company/:id`) |
| 后端 API | Cloudflare Pages Functions (TypeScript) |
| 数据库 | Cloudflare D1 (SQLite) |
| 部署 | GitHub Actions (主站) / wrangler CLI (子站) |

---

## TS 严格模式红线

```json
"noUnusedLocals": true,
"noUnusedParameters": true
```

**任何未使用变量都会导致构建失败。** 提交前必须 `npm run build` 验证。

---

## 已完成的核心功能

### 主站 (phineuro.life)
- [x] 首页 Hero + 情报流（接入子站 API）
- [x] 情报中心 (`/#/news`) 含 7×24H 情报标签页
- [x] 全球企业数据库 (`/#/database`)
  - [x] 四种视图：产业链 / 企业列表 / 疾病分类 / 标签云
  - [x] 九维标签筛选体系
  - [x] 国家筛选：全球 / 中国 / 美国 / 其它
  - [x] 疾病领域标签排序在最后（第9位）
  - [x] **公司名称可点击 → `/company/:id` 详情页**
- [x] 公司详情页 (`/#/company/:id`)
- [x] 报告页面
- [x] 技术路径页面

### 子站 (datasets.phineuro.life)
- [x] 数据集列表/详情 API
- [x] 情报列表 API (`/api/intel`)
- [x] 搜索 API
- [x] **情报爬虫 API** (`/api/cron/fetch-intel`) — POST/GET 均支持
  - 20 个 RSS 源抓取
  - 关键词过滤（神经科学/BCI/认知相关）
  - 7 类自动分类（融资/临床/政策/技术突破/产品发布/产业动态/学术）
  - SHA-256 去重 + `INSERT OR IGNORE`

---

## 已知问题与待办

### 当前阻塞
- [ ] **爬虫返回 401 Unauthorized** — GitHub Actions 调用 API 时 CRON_SECRET 验证失败。需确认 Cloudflare 和 GitHub 两边的 `CRON_SECRET` 值是否完全一致。

### 待完成（按优先级）
1. **海外企业数据补充** — Neuralink、Synchron 等美国公司需写入 `companiesData.ts`
2. **数据质量** — 为现有 120 家企业补全 `country` 字段（已修复筛选逻辑兜底）
3. **数据集外部链接** — 接入 3-5 个真实数据集（PhysioNet、BNCI Horizon 等）
4. **情报分类准确率优化** — 收集首批数据后人工标注调优
5. **搜索增强** — 拼音首字母匹配、空结果推荐
6. **性能优化** — React.lazy 代码分割、图片懒加载
7. **SEO + PWA**

---

## 部署命令速查

### 主站
```bash
git add .
git commit -m "feat: xxx"  # 必须用纯 ASCII commit message
git push origin main
```
> 自动触发 GitHub Actions 部署到 `phineuro.life`

### 子站
```bash
cd phineuro-datasets-backend
npm run build
npx wrangler pages deploy dist --branch=main
```
> 注意：是 `pages deploy` 不是 `deploy`（Pages 项目 vs Workers 项目）

---

## API 端点

| 端点 | 方法 | 说明 |
|---|---|---|
| `https://datasets.phineuro.life/api/intel` | GET | 情报列表，支持 `?category=&page=&limit=` |
| `https://datasets.phineuro.life/api/cron/fetch-intel` | POST/GET | 爬虫触发，需 `Authorization: Bearer CRON_SECRET` |
| `https://datasets.phineuro.life/api/datasets` | GET | 数据集列表 |
| `https://datasets.phineuro.life/api/datasets/:id` | GET | 数据集详情 |
| `https://datasets.phineuro.life/api/search` | GET | 全文搜索 |

---

## 爬虫调度

- GitHub Actions workflow: `crawl-intel.yml`
- 调度: `cron: '0 */2 * * *'`（每 2 小时 UTC）
- 手动触发: GitHub → Actions → Intel Crawler (Phase 1) → Run workflow

---

*最后更新: 2026-05-23*
