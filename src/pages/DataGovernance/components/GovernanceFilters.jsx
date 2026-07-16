import { Button, Input, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { businessDomains, governanceRegions } from '../../../mock/dataGovernance'

const statusOptions = [['pending', '待治理'], ['running', '治理中'], ['confirming', '待确认'], ['completed', '已完成'], ['failed', '失败']]

function GovernanceFilters({ filters, onChange, onReset }) {
  const select = (key, options, placeholder) => <Select allowClear value={filters[key] || undefined} placeholder={placeholder} options={options} onChange={(value) => onChange(key, value || '')} />
  return <div className="governance-filters"><Input allowClear prefix={<SearchOutlined />} value={filters.keyword} placeholder="搜索任务、数据对象、来源或负责人" onChange={(event) => onChange('keyword', event.target.value)} />{select('status', statusOptions.map(([value, label]) => ({ value, label })), '治理状态')}{select('domain', businessDomains.map((value) => ({ value, label: value })), '业务领域')}{select('region', governanceRegions.map((value) => ({ value, label: value })), '所属地区')}{select('type', ['GIS 数据', '结构化数据', 'API 数据', '实时数据'].map((value) => ({ value, label: value })), '数据类型')}<Button onClick={onReset}>重置</Button></div>
}

export default GovernanceFilters
