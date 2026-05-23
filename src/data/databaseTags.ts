// ============================================
// PhiNeuro 企业多维标签体系配置
// 九大核心维度、45+个具体标签
// ============================================

// D1: 技术路径标签
export const TECH_ROUTES = [
  { value: '侵入式', color: '#E74C3C', description: '电极直接植入大脑皮层，信号质量最高' },
  { value: '半侵入式', color: '#3498DB', description: '电极植入颅腔/硬膜外，不穿透皮层（ECoG）' },
  { value: '介入式', color: '#9B59B6', description: '电极通过血管递送至脑区，无需开颅' },
  { value: '非侵入式', color: '#27AE60', description: '体外采集脑电信号，安全性最高' },
] as const;

// D2: 产业链位置标签（层级+细分环节）
export const CHAIN_POSITIONS = {
  '上游-电极': ['侵入式微电极', '半侵入式ECoG电极', '非侵入式电极', '介入式支架电极'],
  '上游-芯片': ['BCI专用ASIC', '通用信号采集芯片', '通信芯片'],
  '上游-材料': ['生物相容性材料', '柔性基底材料', '电极涂层材料'],
  '上游-手术设备': ['手术机器人', '植入工具'],
  '中游-算法': ['神经编解码算法', 'AI大模型解码'],
  '中游-系统集成': ['全植入式系统', '可穿戴系统', '软件平台'],
  '下游-医疗应用': ['运动功能重建', '语言沟通恢复', '神经调控治疗', '康复训练', '诊断监测'],
  '下游-消费应用': ['睡眠/注意力', '游戏/娱乐', '工业安全'],
} as const;

// D3: 疾病领域（七大领域 + 22个细分适应症）
export const DISEASE_CATEGORIES = [
  {
    name: '神经退行性疾病',
    color: '#C0392B',
    indications: ['ALS/MND', '阿尔茨海默病', '帕金森病'],
    bciApps: ['运动解码/假肢控制', '认知增强/早期诊断', 'DBS闭环调控'],
  },
  {
    name: '运动功能障碍',
    color: '#D35400',
    indications: ['脊髓损伤', '脑卒中后遗症', '肌张力障碍'],
    bciApps: ['脑控外骨骼', '脑机康复', '神经调控'],
  },
  {
    name: '感觉功能缺陷',
    color: '#F39C12',
    indications: ['视觉障碍', '听觉障碍', '触觉缺失'],
    bciApps: ['视觉皮层假体', '听觉脑干植入', '触觉反馈闭环'],
  },
  {
    name: '癫痫及相关疾病',
    color: '#8E44AD',
    indications: ['难治性癫痫', '癫痫灶定位', '癫痫发作预测'],
    bciApps: ['RNS闭环刺激', 'SEEG监测', '预警系统'],
  },
  {
    name: '意识与认知障碍',
    color: '#2980B9',
    indications: ['意识障碍(DoC)', '认知运动分离(CMD)', '轻度认知障碍'],
    bciApps: ['意识评估', '隐蔽意识检测', '认知评估'],
  },
  {
    name: '精神心理疾病',
    color: '#16A085',
    indications: ['难治性抑郁症', '焦虑症', 'ADHD', '双相情感障碍'],
    bciApps: ['VNS神经调控', '神经反馈治疗', '注意力训练'],
  },
  {
    name: '慢性疼痛',
    color: '#27AE60',
    indications: ['神经病理性疼痛', '脊柱术后疼痛', '周围神经痛'],
    bciApps: ['SCS脊髓刺激', 'DRG刺激', '周围神经刺激'],
  },
] as const;

export const ALL_INDICATIONS = DISEASE_CATEGORIES.flatMap(d => d.indications);

// D4: 临床阶段标签
export const CLINICAL_STAGES = [
  { value: '临床前', color: '#95A5A6', description: '动物实验或概念验证阶段' },
  { value: 'I期临床', color: '#3498DB', description: '首次人体试验，评估安全性' },
  { value: 'II期临床', color: '#2980B9', description: '小规模有效性验证' },
  { value: 'III期临床', color: '#8E44AD', description: '大规模多中心确证性试验' },
  { value: '获批上市', color: '#27AE60', description: '获得监管机构批准销售' },
  { value: '商业化', color: '#F39C12', description: '已有规模化销售收入' },
  { value: '科研用', color: '#7F8C8D', description: '仅用于科研，未进入临床' },
] as const;

// D5: 监管状态标签
export const REGULATORY_STATUS = [
  { value: 'FDA突破性器械(BDD)', color: '#E74C3C', region: 'US' },
  { value: 'FDA IDE', color: '#C0392B', region: 'US' },
  { value: 'FDA 510(k)', color: '#D35400', region: 'US' },
  { value: 'FDA PMA', color: '#E67E22', region: 'US' },
  { value: 'NMPA创新医疗器械', color: '#27AE60', region: 'CN' },
  { value: 'NMPA注册证', color: '#2ECC71', region: 'CN' },
] as const;

// D6: 产品形态标签
export const PRODUCT_FORMS = [
  { value: '植入式设备', color: '#E74C3C', icon: 'microchip' },
  { value: '可穿戴设备', color: '#3498DB', icon: 'watch' },
  { value: '软件平台', color: '#9B59B6', icon: 'code' },
] as const;

// D7: 商业模式标签
export const BUSINESS_MODELS = [
  { value: 'To-B', color: '#3498DB', description: '向企业/医疗器械商销售核心部件' },
  { value: 'To-C', color: '#E74C3C', description: '直接向终端消费者销售' },
  { value: 'To-H', color: '#27AE60', description: '向医疗机构销售设备和方案' },
  { value: 'To-R', color: '#9B59B6', description: '向科研机构销售科研工具' },
  { value: 'To-G', color: '#F39C12', description: '承接政府项目/国防订单' },
] as const;

// D8: 融资阶段标签
export const FUNDING_STAGES = [
  { value: '天使轮/种子轮', color: '#95A5A6' },
  { value: 'A轮', color: '#3498DB' },
  { value: 'B轮', color: '#2980B9' },
  { value: 'C轮', color: '#8E44AD' },
  { value: 'D轮及以后', color: '#E74C3C' },
  { value: '独角兽', color: '#F39C12' },
  { value: 'IPO/上市', color: '#27AE60' },
  { value: '未披露/自研', color: '#7F8C8D' },
] as const;

// D9: 交叉创新标签
export const CROSS_INNOVATION = [
  { value: 'AI+脑机', color: '#E74C3C', description: '应用AI/大模型进行神经信号解码' },
  { value: '具身智能', color: '#3498DB', description: '脑机接口+机器人/假肢' },
  { value: '神经调控', color: '#27AE60', description: '电刺激治疗型神经技术(DBS/VNS/SCS)' },
  { value: '脑机+VR/AR', color: '#9B59B6', description: '结合虚拟现实/增强现实' },
  { value: '多模态融合', color: '#F39C12', description: '脑电+眼动+肌电等多信号融合' },
  { value: '脑机+数字疗法', color: '#16A085', description: '软件驱动的脑机干预方案' },
] as const;

// ============================================
// 标签维度总览（用于UI展示）
// ============================================
export interface TagDimension {
  id: string;
  name: string;
  color: string;
  description: string;
  tags: { value: string; color?: string; description?: string }[];
}

export const TAG_DIMENSIONS: TagDimension[] = [
  {
    id: 'techRoute',
    name: '技术路径',
    color: '#E74C3C',
    description: 'D1: 区分BCI技术路线',
    tags: TECH_ROUTES.map(t => ({ value: t.value, color: t.color })),
  },
  {
    id: 'chainPosition',
    name: '产业链位置',
    color: '#3498DB',
    description: 'D2: 定位企业在价值链中的环节',
    tags: Object.entries(CHAIN_POSITIONS).flatMap(([k, v]) =>
      v.map(sub => ({ value: `${k}-${sub}`, color: '#3498DB' }))
    ),
  },
  {
    id: 'clinicalStage',
    name: '临床阶段',
    color: '#F39C12',
    description: 'D3: 判断产品研发进度',
    tags: CLINICAL_STAGES.map(t => ({ value: t.value, color: t.color })),
  },
  {
    id: 'regulatoryStatus',
    name: '监管状态',
    color: '#8E44AD',
    description: 'D4: 追踪注册审批进展',
    tags: REGULATORY_STATUS.map(t => ({ value: t.value, color: t.color })),
  },
  {
    id: 'productForm',
    name: '产品形态',
    color: '#16A085',
    description: 'D5: 区分交付形式',
    tags: PRODUCT_FORMS.map(t => ({ value: t.value, color: t.color })),
  },
  {
    id: 'businessModel',
    name: '商业模式',
    color: '#2980B9',
    description: 'D6: 识别目标客户和收入模式',
    tags: BUSINESS_MODELS.map(t => ({ value: t.value, color: t.color })),
  },
  {
    id: 'fundingStage',
    name: '融资阶段',
    color: '#D35400',
    description: 'D7: 评估企业发展阶段',
    tags: FUNDING_STAGES.map(t => ({ value: t.value, color: t.color })),
  },
  {
    id: 'crossInnovation',
    name: '交叉创新',
    color: '#C0392B',
    description: 'D8: 标识跨界融合能力',
    tags: CROSS_INNOVATION.map(t => ({ value: t.value, color: t.color })),
  },
  {
    id: 'diseaseArea',
    name: '疾病领域',
    color: '#27AE60',
    description: 'D9: 按疾病检索企业',
    tags: DISEASE_CATEGORIES.flatMap(d =>
      d.indications.map(ind => ({ value: ind, color: d.color }))
    ),
  },
];

// ============================================
// 辅助函数
// ============================================

/** 获取技术路径颜色 */
export function getTechRouteColor(route: string): string {
  const found = TECH_ROUTES.find(t => route.includes(t.value));
  return found?.color || '#7F8C8D';
}

/** 获取临床阶段颜色 */
export function getClinicalStageColor(stage: string): string {
  const found = CLINICAL_STAGES.find(s => stage?.includes(s.value));
  return found?.color || '#95A5A6';
}

/** 获取疾病领域颜色 */
export function getDiseaseColor(indication: string): string {
  const found = DISEASE_CATEGORIES.find(d =>
    d.indications.some(i => indication?.includes(i))
  );
  return found?.color || '#7F8C8D';
}

/** 获取疾病领域名称 */
export function getDiseaseCategory(indication: string): string {
  const found = DISEASE_CATEGORIES.find(d =>
    d.indications.some(i => indication?.includes(i))
  );
  return found?.name || '其他';
}

/** 产业链位置层级映射 */
export function getChainLevel(position: string): string {
  if (position.includes('上游')) return '上游';
  if (position.includes('中游')) return '中游';
  if (position.includes('下游')) return '下游';
  return '其他';
}

/** 产业链位置颜色 */
export function getChainLevelColor(level: string): string {
  switch (level) {
    case '上游': return '#E67E22';
    case '中游': return '#3498DB';
    case '下游': return '#27AE60';
    default: return '#7F8C8D';
  }
}
