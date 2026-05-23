# PhiNeuro 项目 1 个月冲刺路线图

> 原 12 个月计划压缩至 1 个月（30 天）执行。
> 策略：**MVP 优先，分阶段交付，每日有可见进度。**

---

## 阶段总览

| 周次 | 主题 | 核心交付物 | 验收标准 |
|---|---|---|---|
| **W1** | 数据层 + 情报自动化 | 爬虫上线、数据集详情页完成、120+海外企业入库 | 情报中心展示真实数据 |
| **W2** | 前端体验 + 企业扩展 | 公司详情页、视图优化、国家筛选、海外企业扩充至200+ | 所有企业可点进详情页 |
| **W3** | 数据质量 + 功能闭环 | 爬虫分类准确率优化、标签体系完善、搜索增强 | 情报分类准确率>80% |
| **W4** | 性能优化 + 发布准备 | 首屏加载优化、SEO、PWA、最终测试、文档 | Lighthouse评分>80 |

---

## W1 数据层与情报自动化（Day 1-7）

### Day 1-2：Phase 1 爬虫上线
- [x] 复用 `extended_sources.py` RSS 源列表 + 关键词过滤逻辑
- [x] 编写 Cloudflare Function `functions/api/cron/fetch-intel.ts`
- [x] 编写 GitHub Actions `.github/workflows/crawl-intel.yml`
- [ ] **待你操作**：在 Cloudflare Dashboard → Pages → `phineuro-datasets` → Settings → Environment Variables 中添加 `CRON_SECRET`（随机字符串）
- [ ] **待你操作**：在 GitHub Repo → Settings → Secrets and variables → Actions 中添加 `CRON_SECRET`（同上）
- [ ] 部署子站 `wrangler deploy` 并手动触发一次爬虫测试

### Day 3-4：数据集详情页增强
- [x] 数据集列表/详情 API 修复
- [x] 详情页新增：适用场景、技术类型、下载卡片
- [ ] 接入 3-5 个真实外部数据集链接（如 PhysioNet、BNCI Horizon）

### Day 5-7：情报中心整合
- [x] 主站 News.tsx 新增"7×24H情报"标签页
- [x] 主站直接拉取 `datasets.phineuro.life/api/intel`
- [ ] 爬虫跑满 7 天，积累首批 ~200 条情报数据
- [ ] 情报卡片展示优化（来源图标、分类色标）

---

## W2 前端体验与企业扩展（Day 8-14）

### Day 8-10：公司详情子页
- [x] 创建 `CompanyDetailPage.tsx`
- [x] App.tsx 添加 `/company/:id` 路由
- [x] DatabasePage 中产业链/列表/卡片视图的公司名称可点击跳转
- [x] 视图按钮排序调整：产业链 → 企业列表 → 疾病分类 → 标签云
- [ ] 补充 5-10 家美国/欧洲企业数据（Neuralink, Synchron, Blackrock Neurotech, Paradromics, Neurable 等）

### Day 11-12：国家筛选完善
- [x] 国家筛选从 `全部/中国/全球` 改为 `全球/中国/美国/其它`
- [ ] 为现有 120 家企业补全 `country` 字段
- [ ] 新增美国企业数据写入 `companiesData.ts`

### Day 13-14：九维标签与疾病分类
- [x] 疾病领域从第3位移至第9位（最后）
- [ ] 为每家企业补充完整的九维标签数据
- [ ] 疾病分类视图中的适应症按钮点击后自动跳转列表视图并筛选

---

## W3 数据质量与功能闭环（Day 15-21）

### Day 15-17：爬虫 Phase 2 — 分类准确率优化
- [ ] 收集首周爬虫数据，人工标注 100 条样本
- [ ] 基于标注结果调整 `CATEGORY_RULES` 权重和关键词
- [ ] 引入源类型权重（如 Fierce Biotech 的融资新闻更可能真的是融资）
- [ ] 添加"未分类"兜底，避免错误分类

### Day 18-19：搜索与筛选增强
- [ ] 数据库页面搜索支持拼音首字母（如 "jt" 匹配 "阶梯医疗"）
- [ ] 标签云中的标签点击后联动左侧筛选面板
- [ ] 筛选结果为空时展示推荐企业

### Day 20-21：数据补全
- [ ] 批量补充企业 `website`, `email`, `phone` 字段
- [ ] 补充企业 Logo 占位（可用首字母 + 色块作为 fallback）
- [ ] 企业总数达到 200 家（中国 120 + 海外 80）

---

## W4 性能优化与发布准备（Day 22-30）

### Day 22-24：性能优化
- [ ] 首屏加载优化：React.lazy 代码分割（CompanyDetailPage, News 独立 chunk）
- [ ] 图片懒加载 + WebP 格式
- [ ] 数据集/情报列表虚拟滚动（如单页 >100 条时）
- [ ] Lighthouse 评分目标：Performance > 80, Accessibility > 90, SEO > 85

### Day 25-27：SEO 与 PWA
- [ ] 为 `/company/:id` 添加动态 meta title/description
- [ ] 添加 `robots.txt` + `sitemap.xml`
- [ ] 配置 PWA：manifest.json, service worker, 离线缓存
- [ ] 添加 Google Analytics / 百度统计

### Day 28-29：测试与修复
- [ ] 端到端测试：所有路由、所有视图模式、所有筛选组合
- [ ] 移动端适配测试（iPhone SE / 12 Pro / iPad）
- [ ] 跨浏览器测试（Chrome, Safari, Edge）
- [ ] 修复所有 P0/P1 bug

### Day 30：发布与文档
- [ ] 撰写项目 README（含架构图、部署指南、数据更新流程）
- [ ] 撰写 AGENTS.md（编码规范、技术栈说明）
- [ ] 正式发布 v1.0
- [ ] 备份数据库 schema + seed 数据

---

## 关键决策与风险

| 决策 | 说明 |
|---|---|
| **MVP 优先** | 不托管原始数据文件，情报只做标题+摘要+外链 |
| **数据驱动** | 爬虫每日产出可量化数据，用数据质量倒推功能优先级 |
| **海外数据** | 第一周优先 Neuralink、Synchron 等标杆企业，提升网站可信度 |
| **风险：爬虫被封** | 已做 3 次重试 + 合理 User-Agent，如仍被封则启用备用源 |
| **风险：D1 写入限制** | D1 免费额度足够（50万读/天，5万写/天），爬虫每2小时写入 <100 条 |

---

## 每日站会检查清单

```
□ 昨日完成什么？（对应路线图 Day N 的任务）
□ 今日计划做什么？
□ 有什么阻塞？（需要我协助的）
□ 数据指标：情报新增多少条？企业总数多少？构建是否通过？
```

---

## 本周立即行动项（你做的）

1. **设置 CRON_SECRET**：Cloudflare Dashboard + GitHub Secrets 两处
2. **部署子站爬虫**：`cd phineuro-datasets-backend && wrangler deploy`
3. **手动触发测试**：GitHub Actions → `crawl-intel.yml` → Run workflow
4. **补充海外企业**：搜索 Neuralink / Synchron 的公开信息，填入 `companiesData.ts`
