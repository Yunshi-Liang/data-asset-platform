export const catalogTree = [
  { title: '技经数据', key: 'cost', children: [
    { title: '工程造价', key: 'cost/project', children: [
      { title: '概算数据', key: 'cost/project/estimate' }, { title: '预算数据', key: 'cost/project/budget' },
      { title: '结算数据', key: 'cost/project/settlement' }, { title: '造价指标', key: 'cost/project/index' },
    ] },
    { title: '价格信息', key: 'cost/price', children: [
      { title: '设备价格', key: 'cost/price/equipment' }, { title: '材料价格', key: 'cost/price/material' },
      { title: '人工费用', key: 'cost/price/labor' },
    ] },
    { title: '投资分析', key: 'cost/investment', children: [
      { title: '投资估算', key: 'cost/investment/estimate' }, { title: '经济评价', key: 'cost/investment/evaluation' },
    ] },
  ] },
  { title: '勘测数据', key: 'survey', children: [
    { title: '测绘成果', key: 'survey/mapping', children: [
      { title: '地形图', key: 'survey/mapping/map' }, { title: '控制点', key: 'survey/mapping/control' },
      { title: 'DEM', key: 'survey/mapping/dem' }, { title: 'DOM', key: 'survey/mapping/dom' },
      { title: '无人机航测', key: 'survey/mapping/uav' },
    ] },
    { title: '基础地理信息', key: 'survey/geo', children: [
      { title: '行政区划', key: 'survey/geo/region' }, { title: '交通路网', key: 'survey/geo/traffic' },
      { title: '水系', key: 'survey/geo/water' }, { title: '遥感影像', key: 'survey/geo/image' },
    ] },
    { title: '水文气象', key: 'survey/weather', children: [
      { title: '降雨', key: 'survey/weather/rain' }, { title: '风速风向', key: 'survey/weather/wind' },
      { title: '温湿度', key: 'survey/weather/temp' }, { title: '雷电活动', key: 'survey/weather/lightning' },
    ] },
    { title: '地质数据', key: 'survey/geology', children: [
      { title: '钻孔数据', key: 'survey/geology/borehole' }, { title: '岩土试验', key: 'survey/geology/test' },
      { title: '地质构造', key: 'survey/geology/structure' }, { title: '地质灾害', key: 'survey/geology/hazard' },
    ] },
  ] },
  { title: '电气设计数据', key: 'electrical', children: [
    { title: '一次设计', key: 'electrical/primary', children: [
      { title: '主接线方案', key: 'electrical/primary/wiring' }, { title: '短路计算', key: 'electrical/primary/short' },
      { title: '设备选型', key: 'electrical/primary/selection' },
    ] },
    { title: '二次设计', key: 'electrical/secondary', children: [
      { title: '保护配置', key: 'electrical/secondary/protection' }, { title: '自动化系统', key: 'electrical/secondary/automation' },
      { title: '控制逻辑', key: 'electrical/secondary/control' },
    ] },
    { title: '线路设计', key: 'electrical/line', children: [
      { title: '线路路径', key: 'electrical/line/path' }, { title: '杆塔定位', key: 'electrical/line/tower' },
      { title: '导线与绝缘配置', key: 'electrical/line/conductor' },
    ] },
    { title: '设备参数', key: 'electrical/equipment', children: [
      { title: '变压器', key: 'electrical/equipment/transformer' }, { title: '断路器', key: 'electrical/equipment/breaker' },
      { title: '电缆', key: 'electrical/equipment/cable' }, { title: '杆塔', key: 'electrical/equipment/tower' },
    ] },
  ] },
  { title: '工程数据', key: 'project', children: [
    { title: '项目档案', key: 'project/archive', children: [
      { title: '可研', key: 'project/archive/research' }, { title: '初步设计', key: 'project/archive/preliminary' },
      { title: '施工图', key: 'project/archive/drawing' }, { title: '竣工资料', key: 'project/archive/completion' },
    ] },
    { title: '设计成果', key: 'project/design', children: [
      { title: 'CAD 图纸', key: 'project/design/cad' }, { title: '三维模型', key: 'project/design/3d' },
      { title: 'BIM 模型', key: 'project/design/bim' },
    ] },
    { title: '建设与运维', key: 'project/operation', children: [
      { title: '施工记录', key: 'project/operation/construction' }, { title: '验收资料', key: 'project/operation/acceptance' },
      { title: '运维记录', key: 'project/operation/record' }, { title: '缺陷记录', key: 'project/operation/defect' },
    ] },
  ] },
  { title: '标准知识库', key: 'knowledge', children: [
    { title: '规程规范', key: 'knowledge/standard' }, { title: '典型设计', key: 'knowledge/typical' },
    { title: '标准计算书', key: 'knowledge/calculation' }, { title: '技术规范书', key: 'knowledge/specification' },
    { title: '经验案例', key: 'knowledge/case' }, { title: '常见质量问题', key: 'knowledge/quality' },
    { title: '设计缺陷案例', key: 'knowledge/defect' },
  ] },
]

export function flattenCatalog(nodes = catalogTree, parent = []) {
  return nodes.flatMap((node) => {
    const path = [...parent, node.title]
    return [{ key: node.key, name: node.title, path: path.join(' / '), level: path.length }, ...(node.children ? flattenCatalog(node.children, path) : [])]
  })
}

export const catalogNodes = flattenCatalog()
export const catalogMap = Object.fromEntries(catalogNodes.map((item) => [item.key, item]))
export const catalogDomainOptions = catalogTree.map(({ key, title }) => ({ value: key, label: title }))
export const getCatalogChildren = (key) => catalogMap[key] ? (catalogTree.flatMap((domain) => [domain, ...(domain.children || [])]).find((node) => node.key === key)?.children || []) : []
export const getCatalogPath = (key) => catalogMap[key]?.path || key

export const ASSET_STATUS = {
  governanceError: '治理异常',
  pendingActivation: '待启用',
  pendingPublish: '待申请上架',
  publishApplied: '已申请上架',
}

export const assetStatusMeta = {
  [ASSET_STATUS.governanceError]: { color: 'error', actions: ['view', 'rollback'] },
  [ASSET_STATUS.pendingActivation]: { color: 'default', actions: ['view', 'edit', 'enable'] },
  [ASSET_STATUS.pendingPublish]: { color: 'processing', actions: ['view', 'disable', 'publish'] },
  [ASSET_STATUS.publishApplied]: { color: 'success', actions: ['view', 'cancelPublish'] },
}

export const canAssetAction = (status, action) => assetStatusMeta[status]?.actions.includes(action) ?? false

const baseAssets = [
  ['DA-GD-2026-001','广东省输电线路路径 GIS 数据集','electrical/line/path','电气设计数据','GIS 数据','广东省','广东输电线路 GIS 数据库',98,'重要数据','已申请上架',['输电线路','GIS','高价值']],
  ['DA-GD-2026-002','粤港澳大湾区数字高程模型','survey/mapping/dem','勘测数据','GIS 数据','广东省','珠三角无人机测绘成果',97,'一般数据','已申请上架',['DEM','高程数据','华南地区']],
  ['DA-GX-2026-003','广西地质钻孔与岩土试验成果','survey/geology/borehole','勘测数据','结构化数据','广西壮族自治区','广西地质勘察成果库',95,'重要数据','待申请上架',['地质钻孔','岩土试验']],
  ['DA-HN-2026-004','海南水文气象逐小时观测数据','survey/weather/rain','勘测数据','API 服务','海南省','海南水文气象 API',94,'一般数据','待申请上架',['水文气象','API']],
  ['DA-GD-2026-005','广东电网工程材料价格指标','cost/price/material','技经数据','结构化数据','广东省','广东工程造价指标库',98,'一般数据','已申请上架',['材料价格','技经','高频使用']],
  ['DA-GD-2026-006','广州变电站设备参数台账','electrical/equipment/transformer','电气设计数据','结构化数据','广州市','广州变电站设备台账',76,'重要数据','治理异常',['变电站','设备参数']],
  ['DA-GD-2026-007','珠三角无人机正射影像成果','survey/mapping/uav','勘测数据','GIS 数据','珠海市','珠三角无人机测绘成果',96,'重要数据','待申请上架',['无人机航测','DOM']],
  ['DA-GD-2026-008','深圳电网规划项目档案','project/archive/research','工程数据','文档资料','深圳市','深圳电网规划数据接口',93,'重要数据','待启用',['电网规划','可研']],
  ['DA-GD-2026-009','湛江沿海风速风向监测数据','survey/weather/wind','勘测数据','结构化数据','湛江市','湛江沿海风速监测数据',91,'一般数据','待启用',['风速风向','沿海工程']],
  ['DA-GD-2026-010','500kV 变电站典型主接线方案','electrical/primary/wiring','电气设计数据','文档资料','东莞市','电气专业知识管理平台',99,'重要数据','待申请上架',['主接线','典型设计']],
  ['DA-GD-2026-011','输电线路杆塔三维模型库','project/design/3d','工程数据','三维模型','惠州市','三维协同设计平台',97,'重要数据','已申请上架',['杆塔','三维模型']],
  ['DA-GD-2026-012','电力工程设计规程规范知识库','knowledge/standard','标准知识库','文档资料','广东省','企业标准知识管理系统',99,'一般数据','待申请上架',['设计规范','技术标准']],
  ['DA-GX-2026-013','广西输变电工程造价指标库','cost/project/index','技经数据','API 服务','广西壮族自治区','历史工程造价数据库',96,'重要数据','待启用',['工程造价','投资估算']],
  ['DA-HN-2026-014','海南变电站地质灾害风险数据','survey/geology/hazard','勘测数据','GIS 数据','海南省','工程地质勘察系统',88,'核心数据','待启用',['地质灾害','风险评估']],
]

const assetGovernanceTaskIds = {
  'DA-GD-2026-001': 'GOV-001', 'DA-GX-2026-003': 'GOV-002', 'DA-HN-2026-004': 'GOV-003',
  'DA-GD-2026-005': 'GOV-004', 'DA-GD-2026-006': 'GOV-006', 'DA-GD-2026-007': 'GOV-005',
  'DA-GD-2026-008': 'GOV-007', 'DA-GD-2026-009': 'GOV-008',
}

export const initialAssets = baseAssets.map((item, index) => ({
  id: item[0], code: item[0], name: item[1], catalogKey: item[2], domain: item[3], dataType: item[4], region: item[5],
  source: item[6], sourceSystem: item[6], qualityScore: item[7], securityLevel: item[8], status: item[9], tags: item[10],
  catalogPath: item[2], size: index % 3 === 0 ? '326 GB' : index % 3 === 1 ? '42.3 GB' : '128 万条',
  frequency: index % 2 ? '每月' : '每日', owner: index % 2 ? '周岩' : '陈明', department: index % 2 ? '勘测工程中心' : '输电工程数字化中心',
  updatedAt: `2026-07-${String(15 - index % 10).padStart(2,'0')} 09:30`, description: `${item[1]}经接入与治理形成的标准化数据资产，服务华南地区电力工程规划、勘测和设计。`,
  records: index % 2 ? '128 万条' : '860 万条', fields: index % 2 ? 36 : 48, createdAt: '2026-06-18', lifecycle: '设计与建设', scenarios: '工程规划、路径设计、方案比选', contact: '020-8888****',
  health: Math.max(72, item[7] - 5), valueLevel: index < 6 ? '高价值' : index < 11 ? '中价值' : '一般价值',
  usage: { views: 1280 + index * 237, favorites: 86 + index * 9, applications: 42 + index * 11, downloads: 136 + index * 17, apiCalls: index % 3 ? 0 : 28600 + index * 1000, products: index % 4 },
  unresolvedIssues: item[7] < 90 ? 5 : index % 3, metadataComplete: true, favorite: false,
  governanceTaskId: assetGovernanceTaskIds[item[0]] || null,
}))

export const gisMetadata = [
  { field:'object_id', name:'要素唯一编号', type:'bigint', primary:'是', nullable:'否', length:20, sample:'100286', rule:'全局唯一', source:'输电工程数字化中心' },
  { field:'line_name', name:'线路名称', type:'varchar', primary:'否', nullable:'否', length:100, sample:'粤东500kV甲线', rule:'正式工程名称', source:'输电工程数字化中心' },
  { field:'voltage_level', name:'电压等级', type:'varchar', primary:'否', nullable:'否', length:20, sample:'500kV', rule:'统一电压等级编码', source:'输电工程数字化中心' },
  { field:'geometry', name:'空间几何对象', type:'geometry', primary:'否', nullable:'否', length:'—', sample:'LINESTRING(...)', rule:'CGCS2000', source:'勘测工程中心' },
  { field:'longitude', name:'经度', type:'decimal', primary:'否', nullable:'否', length:'10,6', sample:'113.2865', rule:'东经度数', source:'勘测工程中心' },
  { field:'latitude', name:'纬度', type:'decimal', primary:'否', nullable:'否', length:'10,6', sample:'23.1246', rule:'北纬度数', source:'勘测工程中心' },
  { field:'province', name:'所属省份', type:'varchar', primary:'否', nullable:'否', length:32, sample:'广东省', rule:'国家行政区划', source:'数据管理中心' },
  { field:'city', name:'所属城市', type:'varchar', primary:'否', nullable:'是', length:32, sample:'广州市', rule:'国家行政区划', source:'数据管理中心' },
  { field:'update_time', name:'更新时间', type:'datetime', primary:'否', nullable:'否', length:'—', sample:'2026-07-15 09:30', rule:'北京时间', source:'数据管理中心' },
]

export const qualityDimensions = ['完整性','准确性','一致性','唯一性','规范性','时效性']
export const qualityIssues = [
  { type:'完整性', field:'city', description:'部分历史线路缺少城市区划编码', severity:'中', count:12, status:'待处理' },
  { type:'准确性', field:'geometry', description:'3 条线路坐标需要人工复核', severity:'高', count:3, status:'复核中' },
]
export const domains = ['技经数据','勘测数据','电气设计数据','工程数据','标准知识库']
export const regions = ['广东省','广西壮族自治区','海南省','广州市','深圳市','珠海市','惠州市','湛江市','东莞市']
export const dataTypes = ['结构化数据','文档资料','GIS 数据','三维模型','API 服务']
export const securityLevels = ['一般数据','重要数据','核心数据']
export const assetStatuses = Object.values(ASSET_STATUS)
