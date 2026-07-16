export const statistics = [
  {
    key: 'dataSources',
    title: '数据源',
    value: 32,
    description: '已接入业务系统',
    icon: 'database',
    color: '#1677ff',
    background: '#eaf3ff',
  },
  {
    key: 'dataAssets',
    title: '数据资产',
    value: 1248,
    description: '已编目数据资产',
    icon: 'assets',
    color: '#2f54eb',
    background: '#eef0ff',
  },
  {
    key: 'dataProducts',
    title: '数据产品',
    value: 168,
    description: '已上架产品',
    icon: 'product',
    color: '#08979c',
    background: '#e6fffb',
  },
  {
    key: 'apiServices',
    title: 'API 服务',
    value: 72,
    description: '共享服务接口',
    icon: 'api',
    color: '#13a8a8',
    background: '#e6fffb',
  },
  {
    key: 'dataQuality',
    title: '数据质量',
    value: 98,
    suffix: '%',
    description: '综合质量评分',
    icon: 'quality',
    color: '#389e0d',
    background: '#f0f9e8',
  },
  {
    key: 'todayVisits',
    title: '今日访问量',
    value: 3856,
    description: '门户访问次数',
    icon: 'visits',
    color: '#d48806',
    background: '#fff7e6',
  },
]

export const assetDistribution = [
  {
    name: '技经数据',
    value: 226,
    percent: 72,
    examples: '造价指标、设备材料价格、概预算成果',
  },
  {
    name: '勘测数据',
    value: 312,
    percent: 100,
    examples: '测绘成果、基础地理、水文气象、地质数据',
  },
  {
    name: '电气设计数据',
    value: 286,
    percent: 92,
    examples: '一次二次设计、线路设计、计算成果、设备参数',
  },
  {
    name: '工程数据',
    value: 258,
    percent: 83,
    examples: '工程档案、CAD 图纸、三维及 BIM 模型',
  },
  {
    name: '标准知识库',
    value: 166,
    percent: 53,
    examples: '设计规范、典型设计、标准计算书、经验案例',
  },
]

export const latestNews = [
  {
    key: 'news-1',
    date: '今天',
    title: '广东 500kV 输电工程 GIS 成果更新',
    description: '广州—佛山线路测绘与路径数据完成同步',
    color: '#1677ff',
  },
  {
    key: 'news-2',
    date: '昨天',
    title: '新增海南中部 DEM 数据资产',
    description: '新增两项工程选址高精度数字高程模型',
    color: '#13a8a8',
  },
  {
    key: 'news-3',
    date: '昨天',
    title: '上架广西沿海风资源数据产品',
    description: '北部湾区域风资源评估产品正式上架',
    color: '#52c41a',
  },
  {
    key: 'news-4',
    date: '前天',
    title: '深圳变电站 BIM 数据治理完成',
    description: '模型编码与设备参数质量核查任务已完成',
    color: '#8c8c8c',
  },
]

export const hotAssets = [
  {
    key: 'asset-1',
    name: '广东 500kV 输电线路路径成果',
    category: '电气设计数据',
    updateTime: '2026-07-15',
    qualityScore: 99,
  },
  {
    key: 'asset-2',
    name: '广州—佛山区域 GIS 地形图',
    category: '勘测数据',
    updateTime: '2026-07-14',
    qualityScore: 98,
  },
  {
    key: 'asset-3',
    name: '广西沿海风资源数据库',
    category: '勘测数据',
    updateTime: '2026-07-13',
    qualityScore: 97,
  },
  {
    key: 'asset-4',
    name: '海南变电站工程钻孔数据',
    category: '勘测数据',
    updateTime: '2026-07-12',
    qualityScore: 96,
  },
]

export const quickActions = [
  {
    key: 'portal',
    title: '数据产品门户',
    path: '/data-portal',
    icon: 'portal',
  },
  { key: 'access', title: '数据接入', path: '/data-access', icon: 'api' },
  {
    key: 'governance',
    title: '数据治理',
    path: '/data-governance',
    icon: 'governance',
  },
  {
    key: 'catalog',
    title: '数据资产目录',
    path: '/asset-catalog',
    icon: 'catalog',
  },
  {
    key: 'product',
    title: '数据产品上架',
    path: '/product-publish',
    icon: 'product',
  },
  {
    key: 'workbench',
    title: '个人工作台',
    path: '/workbench',
    icon: 'workbench',
  },
]
