import { ASSET_STATUS, getCatalogPath, initialAssets } from './assetCatalog'
import { currentUser } from './currentUser'

export const PRODUCT_STATUS = { pending: '待上架', listed: '已上架' }

export const createListingAssets = (statusOverrides = new Map()) => initialAssets
  .map((asset) => ({ ...asset, status: statusOverrides.get(asset.id) || asset.status, catalogName: getCatalogPath(asset.catalogKey), listingStatus: PRODUCT_STATUS.pending }))
  .filter((asset) => asset.status === ASSET_STATUS.publishApplied)

export const initialListedProducts = [
  {id:'PP-002',assetId:'DA-GD-2026-002',code:'DP-GD-DEM-20260702',name:'粤港澳大湾区数字高程模型',assetName:'粤港澳大湾区数字高程模型',publishedAt:'2026-07-10 09:20',views:4216,applications:318,favorites:245,downloads:1026,apiCalls:0,status:'已上架',owner:'周岩',domain:'勘测数据',region:'广东省',format:'GeoTIFF、GDB',qualityScore:97,permission:'部门审批',accessMethods:['文件下载','在线查看'],description:'面向大湾区电力工程选址与路径设计的高精度 DEM、等高线及坡度分析成果。'},
  {id:'PP-005',assetId:'DA-GD-2026-005',code:'DP-GD-MAT-20260705',name:'广东电网工程材料价格指标',assetName:'广东电网工程材料价格指标',publishedAt:'2026-07-08 08:30',views:4630,applications:385,favorites:312,downloads:1256,apiCalls:0,status:'已上架',owner:'陈明',domain:'技经数据',region:'广东省',format:'XLSX、CSV',qualityScore:98,permission:'无需审批',accessMethods:['文件下载','在线查看'],description:'提供电网工程主要设备材料的区域价格和工程采购参考区间。'},
  {id:'PP-011',assetId:'DA-GD-2026-011',code:'DP-GD-TOWER-20260518',name:'输电线路杆塔三维模型库',assetName:'输电线路杆塔三维模型库',publishedAt:'2026-06-18 10:05',views:2876,applications:164,favorites:138,downloads:426,apiCalls:0,status:'已上架',owner:'陈明',domain:'工程数据',region:'惠州市',format:'IFC、RVT',qualityScore:97,permission:'管理员审批',accessMethods:['文件下载','在线查看'],description:'提供输电线路杆塔标准三维模型，用于三维设计复用和碰撞检查。'},
]

export const reviewRecords = [
  {stage:'质量检查',time:'2026-07-12 14:20',reviewer:'系统自动检查',opinion:'质量评分、元数据和血缘检查通过',result:'通过'},
  {stage:'安全检查',time:'2026-07-12 15:10',reviewer:'王安全',opinion:'重要数据采用授权访问，脱敏检查通过',result:'通过'},
  {stage:'上架确认',time:'2026-07-12 16:20',reviewer:currentUser.name,opinion:'产品信息及权限配置完整，同意上架',result:'通过'},
]

export const accessOptions=['文件下载','在线查看','API 调用','数据推送']
export const visibilityOptions=['全部用户','指定部门','指定角色','指定项目']
export const approvalOptions=['无需审批','部门审批','管理员审批']
export const validityOptions=['长期','一年','半年','一个月']
