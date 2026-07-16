import { initialAssets } from './assetCatalog'

const catalogNames = {
  'electrical/line/path':'电气设计数据 / 线路设计 / 线路路径', 'survey/mapping/dem':'勘测数据 / 测绘成果 / DEM',
  'survey/geology/borehole':'勘测数据 / 地质数据 / 钻孔数据', 'survey/weather/rain':'勘测数据 / 水文气象 / 降雨',
  'cost/price/material':'技经数据 / 价格信息 / 材料价格', 'electrical/equipment/transformer':'电气设计数据 / 设备参数 / 变压器',
  'project/archive/research':'工程数据 / 项目档案 / 可研', 'survey/geology/hazard':'勘测数据 / 地质数据 / 地质灾害',
}

export const pendingAssets = [...initialAssets.slice(0,7), initialAssets[13]].map(asset=>({...asset,catalogName:catalogNames[asset.catalogKey]||asset.catalogKey,publishStatus:asset.qualityScore<80?'需整改':asset.securityLevel==='核心数据'?'限制上架':'待上架'}))

export const publishOverview = [
  {key:'pending',label:'待上架资产',value:12,color:'#1677ff'}, {key:'published',label:'已发布产品',value:168,color:'#52c41a'},
  {key:'reviewing',label:'待审核产品',value:6,color:'#faad14'}, {key:'rejected',label:'已驳回产品',value:3,color:'#ff4d4f'},
]

export const initialPublishedProducts = [
  {id:'PP-001',code:'DP-GD-GIS-20260701',name:'广东省输电线路路径 GIS 数据集',assetName:'广东省输电线路路径 GIS 数据集',publishedAt:'2026-07-12 16:30',views:3682,applications:286,favorites:196,downloads:842,apiCalls:0,status:'已发布',owner:'陈明',domain:'电气设计数据',region:'广东省',format:'GDB、SHP、GeoJSON',qualityScore:98,permission:'管理员审批',accessMethods:['文件下载','在线查看'],description:'汇集广东省重点输电工程线路中心线、杆塔点位、通道与交叉跨越等空间成果。'},
  {id:'PP-002',code:'DP-GD-DEM-20260702',name:'粤港澳大湾区数字高程模型',assetName:'粤港澳大湾区数字高程模型',publishedAt:'2026-07-10 09:20',views:4216,applications:318,favorites:245,downloads:1026,apiCalls:0,status:'已发布',owner:'周岩',domain:'勘测数据',region:'广东省',format:'GeoTIFF、GDB',qualityScore:97,permission:'部门审批',accessMethods:['文件下载','在线查看'],description:'面向大湾区电力工程选址与路径设计的高精度 DEM、等高线及坡度分析成果。'},
  {id:'PP-003',code:'DP-GX-GEO-20260603',name:'广西地质钻孔成果服务',assetName:'广西地质钻孔与岩土试验成果',publishedAt:'2026-06-28 11:10',views:2168,applications:146,favorites:92,downloads:315,apiCalls:0,status:'审核中',owner:'周岩',domain:'勘测数据',region:'广西壮族自治区',format:'XLSX、CSV、PDF',qualityScore:95,permission:'管理员审批',accessMethods:['文件下载'],description:'汇集广西电力工程钻孔编录、岩土试验与地质分层成果。'},
  {id:'PP-004',code:'DP-HN-MET-20260504',name:'海南水文气象数据服务',assetName:'海南水文气象逐小时观测数据',publishedAt:'2026-06-20 14:00',views:1852,applications:128,favorites:76,downloads:0,apiCalls:28600,status:'已发布',owner:'周岩',domain:'勘测数据',region:'海南省',format:'JSON',qualityScore:94,permission:'部门审批',accessMethods:['API 调用','数据推送'],description:'提供海南省水文气象站点逐小时观测数据查询服务。'},
  {id:'PP-005',code:'DP-GD-MAT-20260705',name:'广东电网工程材料价格指标',assetName:'广东电网工程材料价格指标',publishedAt:'2026-07-08 08:30',views:4630,applications:385,favorites:312,downloads:1256,apiCalls:0,status:'已下架',owner:'陈明',domain:'技经数据',region:'广东省',format:'XLSX、CSV',qualityScore:98,permission:'无需审批',accessMethods:['文件下载','在线查看'],description:'提供电网工程主要设备材料的区域价格和工程采购参考区间。'},
  {id:'PP-006',code:'DP-GD-UAV-20260607',name:'珠三角无人机正射影像成果',assetName:'珠三角无人机正射影像成果',publishedAt:'2026-06-16 10:05',views:1986,applications:97,favorites:83,downloads:286,apiCalls:0,status:'已停用',owner:'陈明',domain:'勘测数据',region:'珠海市',format:'GeoTIFF、DOM',qualityScore:96,permission:'管理员审批',accessMethods:['文件下载'],description:'珠三角重点工程区域无人机正射影像与测绘成果。'},
]

export const reviewRecords = [
  {stage:'质量审核',time:'2026-07-12 14:20',reviewer:'系统自动审核',opinion:'质量评分、元数据和血缘检查通过',result:'通过'},
  {stage:'安全审核',time:'2026-07-12 15:10',reviewer:'王安全',opinion:'重要数据采用授权访问，脱敏检查通过',result:'通过'},
  {stage:'发布审核',time:'2026-07-12 16:20',reviewer:'数据管理员',opinion:'产品信息及权限配置完整，同意发布',result:'通过'},
]

export const accessOptions=['文件下载','在线查看','API 调用','数据推送']
export const visibilityOptions=['全部用户','指定部门','指定角色','指定项目']
export const approvalOptions=['无需审批','部门审批','管理员审批']
export const validityOptions=['长期','一年','半年','一个月']
