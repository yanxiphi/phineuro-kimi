/**
 * 报告自动抓取脚本
 * 
 * 说明：
 * - 此脚本尝试从公开渠道抓取最新的脑机接口行业报告信息
 * - 由于大多数报告平台有反爬机制或需要付费，此脚本提供一个框架
 * - 用户可以在此框架基础上添加自定义抓取逻辑
 * 
 * 运行方式：
 *   node scripts/update-reports.js
 */

const fs = require('fs');
const path = require('path');

// 报告数据文件路径
const REPORTS_FILE = path.join(__dirname, '..', 'src', 'pages', 'Reports.tsx');

// 读取当前报告数据（简单解析）
function readCurrentReports() {
  const content = fs.readFileSync(REPORTS_FILE, 'utf-8');
  
  // 提取 bciReports 数组内容
  const match = content.match(/const bciReports: BCIReport\[\] = ([\s\S]*?);\n/);
  if (!match) {
    console.error('无法找到报告数据');
    return [];
  }
  
  try {
    // 使用eval安全地解析数组（仅用于本地脚本）
    // 注意：实际生产环境中应使用更安全的JSON解析
    const arrayStr = match[1].trim();
    // 简单的对象解析：移除TypeScript类型注解后解析
    const cleaned = arrayStr
      .replace(/(\w+):/g, '"$1":')
      .replace(/'/g, '"')
      .replace(/,\s*\}/g, '}')
      .replace(/,\s*\]/g, ']');
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('解析报告数据失败:', e.message);
    return [];
  }
}

// 模拟从公开渠道抓取新报告
// 实际使用时，可以替换为真实的API调用或网页抓取逻辑
async function fetchNewReports() {
  const newReports = [];
  
  // TODO: 在此处添加实际的抓取逻辑
  // 
  // 示例抓取源（需要用户自行实现具体逻辑）：
  // 1. 中国信通院官网
  // 2. 前瞻研究院公开报告
  // 3. 券商研报平台（如慧博投研、东方财富研报中心）
  // 4. 学术数据库（如知网、万方）
  // 5. 行业媒体（如动脉网、亿欧智库）
  //
  // 注意：抓取前请确认目标网站的robots.txt和使用条款
  
  console.log('抓取新报告...');
  console.log('当前报告数量:', readCurrentReports().length);
  console.log('提示：此脚本为框架，需要用户根据实际来源添加抓取逻辑');
  
  return newReports;
}

// 更新报告数据文件
function updateReportsFile(newReports) {
  if (newReports.length === 0) {
    console.log('没有新报告需要添加');
    return false;
  }
  
  const content = fs.readFileSync(REPORTS_FILE, 'utf-8');
  
  // 找到 bciReports 数组的结束位置
  const arrayEndMatch = content.match(/(  \{[\s\S]*?\}\n)\];\n/);
  if (!arrayEndMatch) {
    console.error('无法找到数组结束位置');
    return false;
  }
  
  // 生成新报告条目
  const newEntries = newReports.map(report => {
    const fields = Object.entries(report)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `    ${key}: '${value.replace(/'/g, "\\'")}'`;
        }
        return `    ${key}: ${value}`;
      })
      .join(',\n');
    return `  {\n${fields}\n  }`;
  }).join(',\n');
  
  // 在数组最后一个元素后插入新条目
  const lastEntryEnd = content.lastIndexOf('  },\n];');
  if (lastEntryEnd === -1) {
    console.error('无法定位插入位置');
    return false;
  }
  
  const updated = content.slice(0, lastEntryEnd + 5) + ',\n' + newEntries + content.slice(lastEntryEnd + 5);
  fs.writeFileSync(REPORTS_FILE, updated, 'utf-8');
  
  console.log(`成功添加 ${newReports.length} 条新报告`);
  return true;
}

// 主函数
async function main() {
  console.log('=== PhiNeuro 报告自动更新脚本 ===');
  console.log('运行时间:', new Date().toISOString());
  console.log('');
  
  const currentReports = readCurrentReports();
  console.log(`当前数据库中有 ${currentReports.length} 条报告`);
  
  const newReports = await fetchNewReports();
  
  if (newReports.length > 0) {
    const updated = updateReportsFile(newReports);
    if (updated) {
      console.log('\n更新完成！请检查更改并提交。');
      process.exit(0);
    }
  } else {
    console.log('\n本次运行未获取到新报告。');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('脚本运行出错:', err);
  process.exit(1);
});
