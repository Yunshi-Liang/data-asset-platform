import { SearchOutlined } from '@ant-design/icons'
import { Button, Input, Select, Space } from 'antd'
import { accessModes, businessDomains, regions, sourceTypeGroups } from '../../../mock/dataAccess'

const modeOptions = accessModes.map(({ key, title }) => ({ value: key, label: title }))
const statusOptions = [{ value: 'normal', label: '正常' }, { value: 'syncing', label: '同步中' }, { value: 'error', label: '异常' }, { value: 'disabled', label: '已停用' }]

function DataSourceFilters({ filters, onChange, onReset }) {
  const sourceTypeOptions = sourceTypeGroups.filter((item) => !filters.accessMode || item.accessMode === filters.accessMode).map(({ key, title }) => ({ value: key, label: title }))
  const update = (key, value) => onChange((current) => ({ ...current, [key]: value }))
  const updateMode = (value) => onChange((current) => ({ ...current, accessMode: value, sourceType: value && sourceTypeGroups.some((item) => item.key === current.sourceType && item.accessMode === value) ? current.sourceType : undefined }))
  return (
    <div className="source-filters">
      <Input allowClear prefix={<SearchOutlined />} placeholder="搜索数据源、来源系统、负责人或地区" value={filters.keyword} onChange={(event) => update('keyword', event.target.value)} />
      <Select allowClear placeholder="接入模式" value={filters.accessMode} options={modeOptions} onChange={updateMode} />
      <Select allowClear placeholder="数据源类型" value={filters.sourceType} options={sourceTypeOptions} onChange={(value) => update('sourceType', value)} />
      <Select allowClear placeholder="业务领域" value={filters.domain} options={businessDomains.map((value) => ({ value, label: value }))} onChange={(value) => update('domain', value)} />
      <Select allowClear placeholder="运行状态" value={filters.status} options={statusOptions} onChange={(value) => update('status', value)} />
      <Select allowClear placeholder="所属地区" value={filters.region} options={regions.map((value) => ({ value, label: value }))} onChange={(value) => update('region', value)} />
      <Space><Button onClick={onReset}>重置条件</Button></Space>
    </div>
  )
}

export default DataSourceFilters
