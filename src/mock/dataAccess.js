export const accessOverview = [
  { key: 'sources', label: '已接入数据源', value: 32, tone: 'blue' },
  { key: 'normal', label: '正常运行', value: 27, tone: 'green' },
  { key: 'error', label: '异常数据源', value: 2, tone: 'red' },
  { key: 'tasks', label: '今日同步任务', value: 18, tone: 'cyan' },
  { key: 'volume', label: '今日新增数据量', value: 6.8, suffix: 'GB', precision: 1, tone: 'purple' },
]

export const sourceTypeGroups = [
  { key: 'database', title: '数据库接入', icon: 'database', types: ['Oracle', 'MySQL', 'SQL Server', 'PostgreSQL'] },
  { key: 'api', title: 'API 接入', icon: 'api', types: ['REST API', 'WebService', '第三方开放接口'] },
  { key: 'file', title: '文件接入', icon: 'file', types: ['Excel', 'CSV', 'JSON', 'XML'] },
  { key: 'gis', title: 'GIS 与勘测文件', icon: 'gis', types: ['Shapefile', 'GeoJSON', 'GeoTIFF', 'DEM', 'DOM'] },
  { key: 'design', title: '设计成果文件', icon: 'design', types: ['DWG', 'DXF', 'IFC', '三维模型文件'] },
  { key: 'realtime', title: '实时数据接入', icon: 'realtime', types: ['Kafka', 'RabbitMQ', 'OPC', 'Modbus'] },
]

export const businessDomains = ['技经数据', '勘测数据', '电气设计数据', '工程数据', '标准知识库']
export const regions = ['广东省', '广西壮族自治区', '海南省', '广州市', '深圳市', '珠海市', '佛山市', '湛江市']

export const initialDataSources = [
  { id: 'DS-001', name: '广东输电线路 GIS 数据库', group: 'database', type: 'PostgreSQL', system: '输电线路数字化设计平台', domain: '电气设计数据', region: '广东省', syncMode: '增量接入', frequency: '每天 02:00', lastSync: '2026-07-15 09:32', volume: '1.86 TB', status: 'normal', owner: '陈明', department: '输电工程数字化中心', host: '10.***.***.28:5432', schema: 'transmission_gis', records: '860 万条', fields: 48, error: '' },
  { id: 'DS-002', name: '广西地质勘察成果库', group: 'database', type: 'Oracle', system: '工程地质勘察系统', domain: '勘测数据', region: '广西壮族自治区', syncMode: '增量接入', frequency: '每天 01:30', lastSync: '2026-07-15 01:42', volume: '386 GB', status: 'normal', owner: '周岩', department: '勘测工程中心', host: '10.***.***.16:1521', schema: 'GEO_SURVEY', records: '128 万条', fields: 62, error: '' },
  { id: 'DS-003', name: '海南水文气象 API', group: 'api', type: 'REST API', system: '海南气象数据服务平台', domain: '勘测数据', region: '海南省', syncMode: '增量接入', frequency: '每小时', lastSync: '2026-07-15 10:00', volume: '68.5 GB', status: 'syncing', owner: '林海', department: '勘测工程中心', host: 'https://api.***.cn/weather', schema: '/v2/stations/hourly', records: '2,460 万条', fields: 26, error: '' },
  { id: 'DS-004', name: '广东工程造价指标库', group: 'database', type: 'MySQL', system: '工程技经指标平台', domain: '技经数据', region: '广东省', syncMode: '增量接入', frequency: '每月 1 日', lastSync: '2026-07-01 03:18', volume: '42.8 GB', status: 'normal', owner: '梁静', department: '技术经济中心', host: '10.***.***.53:3306', schema: 'cost_index', records: '580 万条', fields: 35, error: '' },
  { id: 'DS-005', name: '广州变电站设备台账', group: 'api', type: 'WebService', system: '变电设备资产系统', domain: '电气设计数据', region: '广州市', syncMode: '增量接入', frequency: '每天 04:00', lastSync: '2026-07-14 04:06', volume: '126 GB', status: 'error', owner: '黄俊', department: '变电工程设计中心', host: 'https://asset.***.cn/ws', schema: 'EquipmentService', records: '92 万条', fields: 54, error: '接口认证凭证已过期，连续 2 次同步失败。' },
  { id: 'DS-006', name: '珠三角无人机测绘成果', group: 'gis', type: 'GeoTIFF', system: '无人机测绘成果库', domain: '勘测数据', region: '珠海市', syncMode: '全量接入', frequency: '每周日', lastSync: '2026-07-13 23:26', volume: '3.42 TB', status: 'normal', owner: '邓航', department: '勘测工程中心', host: '/survey/uav/***', schema: 'DOM / DSM / 点云', records: '2,486 个文件', fields: 18, error: '' },
  { id: 'DS-007', name: '深圳电网规划数据接口', group: 'api', type: 'REST API', system: '深圳电网规划平台', domain: '工程数据', region: '深圳市', syncMode: '增量接入', frequency: '每天 06:00', lastSync: '2026-07-15 06:11', volume: '96.2 GB', status: 'normal', owner: '赵越', department: '规划咨询中心', host: 'https://plan.***.cn/openapi', schema: '/v1/grid/project', records: '316 万条', fields: 41, error: '' },
  { id: 'DS-008', name: '湛江沿海风速监测数据', group: 'realtime', type: 'Kafka', system: '沿海测风监测平台', domain: '勘测数据', region: '湛江市', syncMode: '实时接入', frequency: '实时', lastSync: '2026-07-15 10:16', volume: '218 GB', status: 'error', owner: '许峰', department: '新能源工程中心', host: 'kafka://10.***.***.77:9092', schema: 'wind-monitor-hourly', records: '3,680 万条', fields: 22, error: '消息队列消费延迟超过阈值，当前积压约 18.6 万条。' },
  { id: 'DS-009', name: '电力工程规程规范文档库', group: 'file', type: '文件目录', system: '企业标准知识管理系统', domain: '标准知识库', region: '广东省', syncMode: '增量接入', frequency: '每天 00:30', lastSync: '2026-07-15 00:38', volume: '18.6 GB', status: 'disabled', owner: '苏文', department: '科技质量部', host: '/knowledge/standard/***', schema: 'PDF / DOCX / HTML', records: '12,680 个文件', fields: 16, error: '' },
]

export const recentAccessTasks = [
  { id: 'TASK-20260715-018', name: '广东输电线路 GIS 增量同步', source: '广东输电线路 GIS 数据库', mode: '定时增量', startTime: '2026-07-15 09:30', duration: '2分18秒', volume: '2.6 GB', status: 'success', operator: '系统调度' },
  { id: 'TASK-20260715-017', name: '海南气象小时数据接入', source: '海南水文气象 API', mode: '定时增量', startTime: '2026-07-15 10:00', duration: '执行中', volume: '486 MB', status: 'running', operator: '系统调度' },
  { id: 'TASK-20260715-016', name: '湛江测风实时数据消费', source: '湛江沿海风速监测数据', mode: '实时接入', startTime: '2026-07-15 09:58', duration: '18分32秒', volume: '236 MB', status: 'failed', operator: '系统调度' },
  { id: 'TASK-20260715-015', name: '广西地质钻孔成果同步', source: '广西地质勘察成果库', mode: '定时增量', startTime: '2026-07-15 01:30', duration: '12分06秒', volume: '5.8 GB', status: 'success', operator: '系统调度' },
  { id: 'TASK-20260714-014', name: '珠三角 DOM 成果接入', source: '珠三角无人机测绘成果', mode: '人工全量', startTime: '2026-07-14 16:20', duration: '38分42秒', volume: '86.4 GB', status: 'success', operator: '邓航' },
]

const gisFields = [
  ['object_id', '要素唯一编号', 'integer', '100286', '主键'],
  ['line_name', '输电线路名称', 'varchar', '粤东500kV甲线', '输电线路'],
  ['voltage_level', '电压等级', 'varchar', '500kV', '电压等级'],
  ['longitude', '经度', 'decimal', '113.2865', '空间坐标'],
  ['latitude', '纬度', 'decimal', '23.1246', '空间坐标'],
  ['elevation', '高程', 'decimal', '86.42', '地形高程'],
  ['province', '所属省份', 'varchar', '广东省', '行政区划'],
  ['update_time', '更新时间', 'datetime', '2026-07-14 22:10', '技术元数据'],
]

const databaseFields = [
  ['record_id', '记录编号', 'bigint', '2026071500286', '主键'],
  ['project_name', '工程名称', 'varchar', '广州北500kV输变电工程', '工程项目'],
  ['category', '业务分类', 'varchar', '变电工程', '业务分类'],
  ['region', '所属地区', 'varchar', '广州市', '行政区划'],
  ['amount', '指标数值', 'decimal', '1286.50', '技经指标'],
  ['update_time', '更新时间', 'datetime', '2026-07-15 08:30', '技术元数据'],
]

export const previewProfiles = {
  database: { objectName: 'transmission_line_segment', objectCount: 12, fieldCount: 48, rowCount: '860 万', volume: '1.86 TB', fields: databaseFields },
  api: { objectName: '/v1/grid/project', objectCount: 6, fieldCount: 32, rowCount: '316 万', volume: '96.2 GB', fields: databaseFields },
  file: { objectName: '工程规程规范清单.xlsx', objectCount: 28, fieldCount: 16, rowCount: '12,680', volume: '18.6 GB', fields: databaseFields },
  gis: { objectName: 'transmission_line.shp', objectCount: 8, fieldCount: 48, rowCount: '860 万', volume: '326 GB', fields: gisFields },
  design: { objectName: '500kV变电站设计成果目录', objectCount: 186, fieldCount: 24, rowCount: '1.2 万', volume: '268 GB', fields: databaseFields },
  realtime: { objectName: 'wind-monitor-hourly', objectCount: 4, fieldCount: 22, rowCount: '3,680 万', volume: '218 GB', fields: databaseFields },
}

export const executionStages = ['建立连接', '读取数据结构', '抽取样例数据', '采集技术元数据', '识别业务分类', '写入原始数据区']
