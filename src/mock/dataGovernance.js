export const governanceOverview = [
  { key: 'pending', label: '待治理任务', value: 12, tone: 'blue' },
  { key: 'running', label: '治理中任务', value: 3, tone: 'cyan' },
  { key: 'completed', label: '本月完成', value: 86, tone: 'green' },
  { key: 'issues', label: '发现质量问题', value: 137, tone: 'red' },
  { key: 'score', label: '平均质量评分', value: 94.6, suffix: '%', precision: 1, tone: 'purple' },
]

export const governanceTasks = [
  { id: 'GOV-001', name: '广东输电线路 GIS 数据治理', object: 'transmission_line_segment', source: '广东输电线路 GIS 数据库', type: 'GIS 数据', domain: '电气设计数据', region: '广东省', volume: '860 万条 / 326 GB', records: 8600000, fields: 48, score: 82.6, status: 'pending', owner: '陈明', updateTime: '2026-07-15 10:18', accessTime: '2026-07-15 09:32', category: '电气设计数据 / 输电线路设计', security: '重要数据', department: '输电工程数字化中心' },
  { id: 'GOV-002', name: '广西地质钻孔成果标准化', object: 'geo_borehole_result', source: '广西地质勘察成果库', type: '结构化数据', domain: '勘测数据', region: '广西壮族自治区', volume: '128 万条 / 386 GB', records: 1280000, fields: 62, score: 88.4, status: 'running', owner: '周岩', updateTime: '2026-07-15 10:08', accessTime: '2026-07-15 01:42', category: '勘测数据 / 地质数据', security: '一般数据', department: '勘测工程中心' },
  { id: 'GOV-003', name: '海南水文气象接口数据治理', object: 'weather_station_hourly', source: '海南水文气象 API', type: 'API 数据', domain: '勘测数据', region: '海南省', volume: '2,460 万条 / 68.5 GB', records: 24600000, fields: 26, score: 91.2, status: 'confirming', owner: '林海', updateTime: '2026-07-15 10:12', accessTime: '2026-07-15 10:00', category: '勘测数据 / 水文气象', security: '一般数据', department: '勘测工程中心' },
  { id: 'GOV-004', name: '广东工程材料价格指标治理', object: 'material_price_index', source: '广东工程造价指标库', type: '结构化数据', domain: '技经数据', region: '广东省', volume: '580 万条 / 42.8 GB', records: 5800000, fields: 35, score: 86.9, status: 'pending', owner: '梁静', updateTime: '2026-07-15 09:40', accessTime: '2026-07-01 03:18', category: '技经数据 / 材料价格', security: '一般数据', department: '技术经济中心' },
  { id: 'GOV-005', name: '珠三角无人机测绘成果治理', object: 'uav_dom_dsm_catalog', source: '珠三角无人机测绘成果', type: 'GIS 数据', domain: '勘测数据', region: '珠海市', volume: '2,486 个文件 / 3.42 TB', records: 2486, fields: 18, score: 79.8, status: 'failed', owner: '邓航', updateTime: '2026-07-14 18:36', accessTime: '2026-07-13 23:26', category: '勘测数据 / 测绘成果', security: '重要数据', department: '勘测工程中心' },
  { id: 'GOV-006', name: '变电站设备台账字段标准化', object: 'substation_equipment', source: '广州变电站设备台账', type: '结构化数据', domain: '电气设计数据', region: '广州市', volume: '92 万条 / 126 GB', records: 920000, fields: 54, score: 84.1, status: 'pending', owner: '黄俊', updateTime: '2026-07-14 16:20', accessTime: '2026-07-14 04:06', category: '电气设计数据 / 设备参数', security: '重要数据', department: '变电工程设计中心' },
  { id: 'GOV-007', name: '深圳电网规划项目数据治理', object: 'grid_plan_project', source: '深圳电网规划数据接口', type: 'API 数据', domain: '工程数据', region: '深圳市', volume: '316 万条 / 96.2 GB', records: 3160000, fields: 41, score: 96.3, status: 'completed', owner: '赵越', updateTime: '2026-07-15 08:50', accessTime: '2026-07-15 06:11', category: '工程数据 / 规划项目', security: '一般数据', department: '规划咨询中心' },
  { id: 'GOV-008', name: '湛江沿海风速监测数据治理', object: 'wind_monitor_hourly', source: '湛江沿海风速监测数据', type: '实时数据', domain: '勘测数据', region: '湛江市', volume: '3,680 万条 / 218 GB', records: 36800000, fields: 22, score: 89.5, status: 'running', owner: '许峰', updateTime: '2026-07-15 10:16', accessTime: '2026-07-15 10:16', category: '勘测数据 / 水文气象', security: '一般数据', department: '新能源工程中心' },
]

export const rulesByType = {
  'GIS 数据': ['日期时间格式统一', '字符编码统一', '空值表达统一', '行政区划名称统一', '坐标系检查与转换', '经纬度范围检查', '高程单位统一', '字段命名规范化'],
  '结构化数据': ['日期时间格式统一', '字符编码统一', '空值表达统一', '行政区划名称统一', '字段命名规范化', '设备编码校验', '电压等级编码规范化', '参数单位统一'],
  'API 数据': ['日期时间格式统一', '字符编码统一', '空值表达统一', '字段命名规范化', '枚举值标准化', '单位换算'],
  '实时数据': ['日期时间格式统一', '空值表达统一', '字段命名规范化', '单位换算', '异常值范围检查', '时序连续性检查'],
}

export const qualityDimensions = [
  { key: 'completeness', name: '完整性', score: 96, issues: 12, status: '待确认' },
  { key: 'accuracy', name: '准确性', score: 91, issues: 4, status: '待确认' },
  { key: 'consistency', name: '一致性', score: 94, issues: 5, status: '可自动修复' },
  { key: 'uniqueness', name: '唯一性', score: 99, issues: 2, status: '可自动修复' },
  { key: 'standardization', name: '规范性', score: 89, issues: 8, status: '可自动修复' },
  { key: 'timeliness', name: '时效性', score: 98, issues: 0, status: '通过' },
]

export const initialQualityIssues = [
  { id: 'QI-001', type: '完整性', field: 'region_code', description: '12 条记录缺少行政区划编码', count: 12, severity: '中', suggestion: '自动填充标准行政区划代码', status: '待处理' },
  { id: 'QI-002', type: '准确性', field: 'longitude / latitude', description: '3 条线路坐标超出合理范围', count: 3, severity: '高', suggestion: '标记异常值供人工复核', status: '待处理' },
  { id: 'QI-003', type: '规范性', field: 'equipment_code', description: '8 个设备编码不符合命名规范', count: 8, severity: '中', suggestion: '按设备编码规则自动转换', status: '待处理' },
  { id: 'QI-004', type: '一致性', field: 'update_time', description: '5 条日期字段格式不一致', count: 5, severity: '低', suggestion: '转换为统一日期格式', status: '待处理' },
  { id: 'QI-005', type: '唯一性', field: 'object_id', description: '发现 2 条重复记录', count: 2, severity: '中', suggestion: '删除重复记录', status: '待处理' },
  { id: 'QI-006', type: '准确性', field: 'elevation', description: '1 个字段存在异常高程值', count: 1, severity: '高', suggestion: '暂不处理并记录例外', status: '待处理' },
]

export const metadataFields = [
  { key: 'object_id', name: '要素唯一编号', type: 'bigint', nullable: '否', example: '100286' },
  { key: 'line_name', name: '输电线路名称', type: 'varchar', nullable: '否', example: '粤东500kV甲线' },
  { key: 'voltage_level', name: '电压等级', type: 'varchar', nullable: '是', example: '500kV' },
  { key: 'longitude', name: '经度', type: 'decimal', nullable: '否', example: '113.2865' },
  { key: 'latitude', name: '纬度', type: 'decimal', nullable: '否', example: '23.1246' },
  { key: 'elevation', name: '高程', type: 'decimal', nullable: '是', example: '86.42' },
]

export const governanceExecutionStages = ['加载原始数据', '执行格式标准化', '运行质量规则', '抽取并完善元数据', '推荐分类和安全等级', '生成治理结果']
export const businessDomains = ['技经数据', '勘测数据', '电气设计数据', '工程数据', '标准知识库']
export const governanceRegions = ['广东省', '广西壮族自治区', '海南省', '广州市', '深圳市', '珠海市', '湛江市']
