import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Cpu, ArrowLeft, Activity, Zap, BrainCircuit, Database,
  ShoppingCart, ExternalLink, Check, Info
} from 'lucide-react';

type TechTab = 'routes' | 'datasets' | 'devices';

interface TechRoute {
  id: string;
  name: string;
  type: '侵入式' | '半侵入式' | '非侵入式';
  description: string;
  pros: string[];
  cons: string[];
  applications: string[];
  representative: string[];
}

interface Dataset {
  id: number;
  name: string;
  description: string;
  modality: string;
  samples: string;
  source: string;
  format: string;
  downloadUrl?: string;
}

interface Device {
  id: number;
  name: string;
  type: string;
  description: string;
  specs: string[];
  price: string;
  manufacturer: string;
  purchaseUrl?: string;
  inStock: boolean;
}

const techRoutes: TechRoute[] = [
  {
    id: 'intrusive',
    name: '侵入式脑机接口',
    type: '侵入式',
    description: '通过神经外科手术将电极直接植入大脑皮层或深部脑组织，实现最高空间分辨率和信号质量的神经信号采集。代表技术包括犹他阵列（Utah Array）、神经像素（Neuropixels）等。',
    pros: ['信号质量最高，空间分辨率达单神经元级别', '信息传输速率（ITR）最高', '可实现最精细的运动控制'],
    cons: ['需开颅手术，存在感染和免疫排斥风险', '长期稳定性挑战（胶质瘢痕包裹）', '伦理争议较大'],
    applications: ['瘫痪患者运动功能重建', '重度神经系统疾病治疗', '高级神经科学研究'],
    representative: ['Neuralink N1', 'Blackrock Neurotech Utah Array', 'Synchron Stentrode'],
  },
  {
    id: 'semi-intrusive',
    name: '半侵入式脑机接口',
    type: '半侵入式',
    description: '将电极置于颅骨与大脑之间的硬膜外或硬膜下位置，无需穿透脑组织即可记录皮层电位（ECoG）。兼顾信号质量和安全性，是目前中国重点发展的技术路径。',
    pros: ['信号质量较高（多神经元集群活动）', '无需穿透脑组织，手术风险较低', '长期稳定性优于侵入式'],
    cons: ['空间分辨率低于侵入式', '仍需开颅手术植入', '信号随硬膜增厚可能衰减'],
    applications: ['癫痫病灶定位与监测', '运动功能康复', '语言解码'],
    representative: ['博睿康无线脑电系统', '武汉衷华高通量电极', '上海脑虎蚕丝蛋白电极'],
  },
  {
    id: 'non-intrusive',
    name: '非侵入式脑机接口',
    type: '非侵入式',
    description: '通过头皮表面传感器记录脑电信号（EEG）、脑磁信号（MEG）或近红外光谱（fNIRS）。无需手术，安全性最高，是消费级和康复医疗领域的主流方案。',
    pros: ['完全无创，安全性最高', '使用便捷，可长期佩戴', '成本最低，适合大规模普及'],
    cons: ['信号受颅骨和头皮衰减，信噪比低', '空间分辨率有限', '易受环境电磁干扰'],
    applications: ['注意力训练与认知评估', '睡眠监测与改善', '游戏与VR交互', '康复训练'],
    representative: ['Emotiv Epoc X', 'NeuroSky MindWave', ' muse 头带', '浙江强脑Focus头环'],
  },
];

const datasets: Dataset[] = [
  {
    id: 1,
    name: 'BCI Competition IV Dataset',
    description: '国际BCI竞赛标准数据集，包含运动想象（MI）和P300拼写器任务的多通道EEG数据，广泛用于算法基准测试。',
    modality: 'EEG',
    samples: '9名受试者，每次实验约200试次',
    source: 'BCI Competition',
    format: '.gdf / .mat',
    downloadUrl: 'http://www.bbci.de/competition/iv/',
  },
  {
    id: 2,
    name: 'EEGMIDB (EEG Motor Movement/Imagery Dataset)',
    description: '美国NIH发布的公开EEG数据集，包含109名受试者在运动执行和运动想象任务下的64通道EEG记录。',
    modality: 'EEG',
    samples: '109名受试者，约1500条记录',
    source: 'PhysioNet / NIH',
    format: '.edf',
    downloadUrl: 'https://physionet.org/content/eegmmidb/1.0.0/',
  },
  {
    id: 3,
    name: 'SEED (SJTU Emotion EEG Dataset)',
    description: '上海交通大学发布的情感脑电数据集，包含15名受试者在观看情感视频时的62通道EEG记录及情感标签。',
    modality: 'EEG',
    samples: '15名受试者，3次实验session',
    source: '上海交通大学',
    format: '.mat',
    downloadUrl: 'https://bcmi.sjtu.edu.cn/home/seed/',
  },
  {
    id: 4,
    name: 'OpenNEURO ds003626',
    description: '静息态和任务态fMRI数据集，包含健康受试者和神经系统疾病患者的多模态神经影像数据。',
    modality: 'fMRI + EEG',
    samples: '200+名受试者',
    source: 'OpenNEURO',
    format: 'BIDS',
    downloadUrl: 'https://openneuro.org/',
  },
  {
    id: 5,
    name: 'China BCI Open Dataset 2024',
    description: '中国脑机接口产业联盟发布的国内首个大规模开源脑电数据集，覆盖运动想象、SSVEP、P300等多种范式。',
    modality: 'EEG',
    samples: '500+名受试者',
    source: '中国信通院 / BCI联盟',
    format: '.mat / .csv',
  },
];

const devices: Device[] = [
  {
    id: 1,
    name: 'Emotiv Epoc X',
    type: '非侵入式EEG头带',
    description: '14通道无线EEG采集设备，适用于科研、教育和开发场景。支持EmotivPRO软件进行实时信号处理和可视化。',
    specs: ['14通道 + 2参考电极', '采样率：2048 Hz（内部降采样至128/256 Hz）', '无线传输：蓝牙', '续航：12小时'],
    price: '¥ 18,800',
    manufacturer: 'Emotiv',
    purchaseUrl: 'https://www.emotiv.com/',
    inStock: true,
  },
  {
    id: 2,
    name: 'g.tec g.Nautilus',
    type: '非侵入式EEG放大器',
    description: '专业级无线EEG放大器，支持8-64通道配置，广泛应用于BCI研究和临床神经反馈。',
    specs: ['8/16/32/64通道可选', '采样率：900 Hz', '无线传输：2.4 GHz专有协议', '主动电极技术'],
    price: '¥ 85,000 起',
    manufacturer: 'g.tec',
    purchaseUrl: 'https://www.gtec.at/',
    inStock: true,
  },
  {
    id: 3,
    name: 'Neuroelectrics Enobio 8',
    type: '非侵入式EEG系统',
    description: '8通道无线EEG系统，采用干电极技术，无需导电膏，适合快速部署和移动场景。',
    specs: ['8通道', '采样率：500 Hz', '干电极（Ag/AgCl）', '续航：8小时'],
    price: '¥ 42,000',
    manufacturer: 'Neuroelectrics',
    purchaseUrl: 'https://www.neuroelectrics.com/',
    inStock: true,
  },
  {
    id: 4,
    name: 'Brain Products ActiChamp',
    type: '非侵入式EEG放大器',
    description: '高精度实验室级EEG放大器，支持最多160通道，是认知神经科学和BCI研究的主流选择。',
    specs: ['32/64/96/128/160通道可选', '采样率：100 kHz', '24位ADC分辨率', '主动 shielding 技术'],
    price: '¥ 120,000 起',
    manufacturer: 'Brain Products',
    purchaseUrl: 'https://www.brainproducts.com/',
    inStock: false,
  },
  {
    id: 5,
    name: '浙江强脑 BrainCo Focus 头环',
    type: '消费级注意力训练设备',
    description: '面向教育和消费市场的智能头环，基于非侵入式EEG技术，提供注意力监测和冥想训练功能。',
    specs: ['2通道EEG + 1通道参考', '采样率：250 Hz', 'APP配套训练课程', '续航：6小时'],
    price: '¥ 1,999',
    manufacturer: 'BrainCo 强脑科技',
    purchaseUrl: 'https://www.brainco.cn/',
    inStock: true,
  },
];

const tabs = [
  { key: 'routes' as TechTab, label: 'BCI 技术路径', icon: Activity },
  { key: 'datasets' as TechTab, label: '训练数据集', icon: Database },
  { key: 'devices' as TechTab, label: '训练设备', icon: ShoppingCart },
];

export default function TechRoutesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TechTab>('routes');

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm text-slate-blue/70 hover:text-burgundy transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </button>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-burgundy/10 text-burgundy text-sm font-medium mb-4">
              <Cpu className="w-4 h-4" />
              <span>PhiNeuro 技术路径中心</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy mb-4">
              技术路径
            </h1>
            <p className="text-slate-blue/70 max-w-2xl mx-auto">
              系统了解BCI技术路线、获取开源数据集、选购训练设备
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? 'bg-burgundy text-white shadow-card'
                    : 'bg-white text-slate-blue border border-gray-200 hover:border-burgundy/30 hover:text-burgundy'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ===== BCI 技术路径 ===== */}
        {activeTab === 'routes' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-border-light p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <BrainCircuit className="w-5 h-5 text-burgundy" />
                <h2 className="font-serif text-xl font-bold text-burgundy">脑机接口技术路径概览</h2>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                根据电极与大脑组织的接触程度，脑机接口可分为三大技术路径。不同路径在信号质量、安全性、应用场景等方面各有优劣，
                目前全球呈现出"侵入式引领科研、非侵入式主导消费、半侵入式探索临床"的发展格局。
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {techRoutes.map((route) => (
                <div
                  key={route.id}
                  className="bg-white rounded-xl border border-border-light p-6 hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      route.type === '侵入式' ? 'bg-red-50 text-red-600 border border-red-100' :
                      route.type === '半侵入式' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      'bg-green-50 text-green-600 border border-green-100'
                    }`}>
                      {route.type}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-burgundy mb-3">{route.name}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">
                    {route.description}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-semibold text-gold mb-1.5 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> 优势
                      </h4>
                      <ul className="space-y-1">
                        {route.pros.map((pro, i) => (
                          <li key={i} className="text-xs text-text-secondary flex items-start gap-1.5">
                            <Check className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-blue mb-1.5 flex items-center gap-1">
                        <Info className="w-3 h-3" /> 局限
                      </h4>
                      <ul className="space-y-1">
                        {route.cons.map((con, i) => (
                          <li key={i} className="text-xs text-text-secondary flex items-start gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-slate-blue/40 flex-shrink-0 mt-1.5" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-burgundy mb-1.5">典型应用</h4>
                      <div className="flex flex-wrap gap-1">
                        {route.applications.map((app) => (
                          <span key={app} className="px-2 py-0.5 bg-burgundy/[0.06] text-burgundy text-[11px] rounded-full">
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-burgundy mb-1.5">代表产品</h4>
                      <div className="flex flex-wrap gap-1">
                        {route.representative.map((rep) => (
                          <span key={rep} className="px-2 py-0.5 bg-gray-50 text-slate-blue text-[11px] rounded border border-gray-100">
                            {rep}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== 训练数据集 ===== */}
        {activeTab === 'datasets' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-border-light p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-5 h-5 text-burgundy" />
                <h2 className="font-serif text-xl font-bold text-burgundy">开源训练数据集</h2>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                高质量的公开数据集是BCI算法开发的基石。以下数据集覆盖运动想象、情感识别、P300等多种范式，
                可用于算法训练、模型验证和基准测试。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {datasets.map((ds) => (
                <div
                  key={ds.id}
                  className="bg-white rounded-xl border border-border-light p-5 hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-burgundy">{ds.name}</h3>
                    <span className="px-2 py-0.5 bg-gold/10 text-gold text-[10px] font-medium rounded">
                      {ds.modality}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed mb-3">
                    {ds.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-cream-dark rounded p-2">
                      <p className="text-[10px] text-slate-blue">样本规模</p>
                      <p className="text-xs font-medium text-burgundy">{ds.samples}</p>
                    </div>
                    <div className="bg-cream-dark rounded p-2">
                      <p className="text-[10px] text-slate-blue">数据格式</p>
                      <p className="text-xs font-medium text-burgundy">{ds.format}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-blue">来源：{ds.source}</span>
                    {ds.downloadUrl ? (
                      <button
                        onClick={() => window.open(ds.downloadUrl, '_blank')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-burgundy/10 text-burgundy text-xs hover:bg-burgundy hover:text-white transition-all"
                      >
                        <ExternalLink className="w-3 h-3" />
                        下载
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-blue/50">需申请获取</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== 训练设备 ===== */}
        {activeTab === 'devices' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-border-light p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingCart className="w-5 h-5 text-burgundy" />
                <h2 className="font-serif text-xl font-bold text-burgundy">BCI 训练设备</h2>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                从科研级高精度EEG系统到消费级智能头环，以下设备覆盖不同应用场景和预算需求。
                点击"前往购买"可跳转至厂商官网了解详情。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="bg-white rounded-xl border border-border-light overflow-hidden hover:shadow-card-hover transition-all duration-300 flex flex-col"
                >
                  <div className="p-5 flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                        device.inStock
                          ? 'bg-green-50 text-green-600 border border-green-100'
                          : 'bg-gray-50 text-gray-500 border border-gray-100'
                      }`}>
                        {device.inStock ? '现货' : '预订'}
                      </span>
                      <span className="text-xs text-gold font-semibold">{device.price}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-burgundy mb-1">{device.name}</h3>
                    <p className="text-[11px] text-slate-blue mb-3">{device.type}</p>
                    <p className="text-xs text-text-secondary leading-relaxed mb-3">
                      {device.description}
                    </p>
                    <div className="space-y-1.5">
                      {device.specs.map((spec, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-text-secondary">
                          <span className="w-1 h-1 rounded-full bg-burgundy/40 flex-shrink-0 mt-1.5" />
                          {spec}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="px-5 py-3 border-t border-border-light bg-cream-dark/50 flex items-center justify-between">
                    <span className="text-[11px] text-slate-blue">{device.manufacturer}</span>
                    {device.purchaseUrl ? (
                      <button
                        onClick={() => window.open(device.purchaseUrl, '_blank')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-burgundy text-white text-xs hover:bg-burgundy-dark transition-all"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        前往购买
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-blue/50">联系厂商</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-slate-blue/50">
          <p>设备信息仅供参考，价格和库存以厂商官网为准 | 数据集版权归原作者所有</p>
        </div>
      </div>
    </div>
  );
}
