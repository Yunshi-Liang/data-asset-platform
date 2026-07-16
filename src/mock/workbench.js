import { initialAssets } from './assetCatalog'
import { initialPublishedProducts } from './productPublish'
import { portalProducts } from './portalData'

export const currentUser={name:'数据管理员',department:'数据管理中心',role:'数据管理员',region:'华南地区',lastLogin:'2026-07-16 08:42'}

const favoriteNames=['广东省输电线路路径 GIS 数据集','粤港澳大湾区数字高程模型','珠三角地区雷电活动历史数据','广东省电网工程材料价格指标','输电线路杆塔三维模型库','电力工程设计规程规范知识库']
export const initialFavorites=portalProducts.filter(product=>favoriteNames.includes(product.name)).map((product,index)=>({...product,favoriteAt:`2026-07-${String(15-index).padStart(2,'0')} 10:20`,status:'已发布'}))

export const initialMyApplications=[
 {id:'DA-202607-001',productName:'广东省输电线路路径 GIS 数据集',productCode:'DP-GD-GIS-20260701',method:'文件下载',project:'粤东500kV输变电工程',purpose:'线路路径比选与交叉跨越分析',submittedAt:'2026-07-15 10:30',period:'2026-07-16 至 2027-01-15',node:'数据管理员审批',status:'审批中',department:'数据管理中心',confidentiality:'已承诺'},
 {id:'DA-202607-002',productName:'粤港澳大湾区数字高程模型',productCode:'DP-GD-DEM-20260702',method:'在线查看',project:'深圳东部电网规划',purpose:'站址初选和地形条件分析',submittedAt:'2026-07-13 09:10',period:'2026-07-14 至 2026-10-14',node:'部门负责人审批',status:'审批中',department:'数据管理中心',confidentiality:'已承诺'},
 {id:'DA-202607-003',productName:'广东省电网工程材料价格指标',productCode:'DP-GD-MAT-20260703',method:'文件下载',project:'广州北部网架加强工程',purpose:'工程投资估算和材料价格对标',submittedAt:'2026-07-12 14:20',period:'2026-07-13 至 2027-01-12',node:'权限已开通',status:'已通过',department:'数据管理中心',confidentiality:'已承诺'},
 {id:'DA-202607-004',productName:'输电线路杆塔三维模型库',productCode:'DP-GD-TOWER-20260518',method:'文件下载',project:'惠州线路三维设计',purpose:'杆塔模型复用与碰撞检查',submittedAt:'2026-07-10 11:00',period:'2026-07-11 至 2026-12-31',node:'数据管理员审批',status:'已驳回',department:'数据管理中心',confidentiality:'已承诺',opinion:'使用范围描述不够具体，请补充模型交付范围。'},
 {id:'DA-202607-005',productName:'电力工程设计规程规范知识库',productCode:'DP-SC-STD-20260112',method:'在线查看',project:'设计质量提升专项',purpose:'规程规范检索与校审',submittedAt:'2026-06-20 08:40',period:'2026-06-20 至 2027-06-19',node:'完成',status:'已通过',department:'数据管理中心',confidentiality:'已承诺'},
 {id:'DA-202606-006',productName:'海南水文气象数据服务',productCode:'DP-HN-MET-20260504',method:'API 调用',project:'海南沿海工程复核',purpose:'历史水文气象数据分析',submittedAt:'2026-01-15 15:30',period:'2026-01-16 至 2026-07-15',node:'已结束',status:'已过期',department:'数据管理中心',confidentiality:'已承诺'},
 {id:'DA-202607-007',productName:'珠三角地区雷电活动历史数据',productCode:'DP-GD-LGT-20260618',method:'数据推送',project:'珠海线路防雷专项',purpose:'线路防雷设计研究',submittedAt:'—',period:'3个月',node:'未提交',status:'草稿',department:'数据管理中心',confidentiality:'未承诺'},
 {id:'DA-202607-008',productName:'广东沿海地区风速风向数据集',productCode:'DP-GD-WIND-20260612',method:'API 调用',project:'湛江沿海线路工程',purpose:'风荷载分析',submittedAt:'2026-07-09 16:00',period:'一年',node:'申请人撤回',status:'已撤回',department:'数据管理中心',confidentiality:'已承诺'},
]

export const initialApprovals=[
 {id:'AP-202607-101',applicant:'李明',department:'输电设计部',role:'线路设计师',contact:'138****1201',productName:'广东省输电线路路径 GIS 数据集',productCode:'DP-GD-GIS-20260701',assetName:'广东省输电线路路径 GIS 数据集',securityLevel:'重要数据',method:'文件下载',project:'粤西500kV线路工程',purpose:'线路路径优化与交叉跨越复核',period:'半年',submittedAt:'2026-07-15 09:20',waiting:'25小时',risk:'涉及重要数据',status:'待审批',frequency:'每周使用',crossDepartment:'否',qualityScore:98,ownerDepartment:'输电工程数字化中心'},
 {id:'AP-202607-102',applicant:'陈静',department:'勘测工程部',role:'测绘工程师',contact:'139****2316',productName:'粤港澳大湾区数字高程模型',productCode:'DP-GD-DEM-20260702',assetName:'粤港澳大湾区数字高程模型',securityLevel:'一般数据',method:'在线查看',project:'佛山变电站选址',purpose:'地形坡度和高程条件分析',period:'三个月',submittedAt:'2026-07-15 13:10',waiting:'21小时',risk:'无明显风险',status:'待审批',frequency:'按需',crossDepartment:'否',qualityScore:97,ownerDepartment:'勘测工程中心'},
 {id:'AP-202607-103',applicant:'王磊',department:'技经中心',role:'造价工程师',contact:'136****8921',productName:'广东省电网工程材料价格指标',productCode:'DP-GD-MAT-20260703',assetName:'广东电网工程材料价格指标',securityLevel:'一般数据',method:'文件下载',project:'年度造价指标分析',purpose:'材料价格趋势分析与投资估算',period:'一年',submittedAt:'2026-07-14 10:05',waiting:'2天',risk:'申请期限较长',status:'待审批',frequency:'每月',crossDepartment:'是',qualityScore:98,ownerDepartment:'技术经济中心'},
 {id:'AP-202607-104',applicant:'周敏',department:'数字化中心',role:'系统工程师',contact:'135****6208',productName:'海南水文气象数据服务',productCode:'DP-HN-MET-20260504',assetName:'海南水文气象逐小时观测数据',securityLevel:'一般数据',method:'API 调用',project:'气象数据服务集成',purpose:'接入项目设计辅助系统',period:'一年',submittedAt:'2026-07-13 16:30',waiting:'3天',risk:'API 高频调用',status:'待审批',frequency:'每小时',crossDepartment:'是',qualityScore:94,ownerDepartment:'勘测工程中心'},
 {id:'AP-202607-105',applicant:'黄凯',department:'项目管理部',role:'项目经理',contact:'137****4302',productName:'输电线路杆塔三维模型库',productCode:'DP-GD-TOWER-20260518',assetName:'输电线路杆塔三维模型库',securityLevel:'重要数据',method:'文件下载',project:'惠州线路施工交底',purpose:'三维可视化施工交底',period:'半年',submittedAt:'2026-07-10 10:00',waiting:'已处理',risk:'跨部门使用',status:'已通过',frequency:'每周',crossDepartment:'是',qualityScore:97,ownerDepartment:'输电工程数字化中心'},
]

export const handledAssets=initialAssets.slice(0,12).map((item,index)=>({...item,duty:index%3===0?'资产负责人':index%3===1?'参与治理':'目录管理员'}))
export const handledProducts=initialPublishedProducts.slice(0,5).map((item,index)=>({...item,duty:index%2?'发布审核':'产品负责人'}))
export const initialApprovalHistory=[
 {id:'AH-001',applicationId:'AP-202607-090',productName:'广东省输电线路路径 GIS 数据集',applicant:'赵强',result:'通过',opinion:'用途明确，按项目范围授权',time:'2026-07-12 15:20',period:'半年'},
 {id:'AH-002',applicationId:'AP-202607-091',productName:'粤港澳大湾区数字高程模型',applicant:'林海',result:'通过',opinion:'符合勘测项目使用要求',time:'2026-07-11 10:10',period:'三个月'},
 {id:'AH-003',applicationId:'AP-202607-092',productName:'输电线路杆塔三维模型库',applicant:'吴迪',result:'驳回',opinion:'需补充模型使用范围',time:'2026-07-10 16:40',period:'—'},
]
