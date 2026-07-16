import { FilterOutlined } from '@ant-design/icons'
import { Select, Typography } from 'antd'
import {
  categoryOptions,
  dataTypeOptions,
  regionOptions,
  securityOptions,
  sortOptions,
} from '../../../mock/portalData'

const { Text } = Typography

const withAllOption = (options) => [
  { label: '全部', value: 'all' },
  ...options.map((value) => ({ label: value, value })),
]

function FilterField({ label, children }) {
  return (
    <label className="portal-filter-field">
      <Text>{label}</Text>
      {children}
    </label>
  )
}

function PortalFilters({ filters, onChange }) {
  const updateFilter = (key, value) => onChange({ ...filters, [key]: value })

  return (
    <section className="portal-filters">
      <div className="portal-filter-title">
        <FilterOutlined />
        <Text strong>筛选条件</Text>
      </div>
      <div className="portal-filter-controls">
        <FilterField label="业务领域">
          <Select
            value={filters.category}
            options={withAllOption(categoryOptions.map((item) => item.value))}
            onChange={(value) => updateFilter('category', value)}
          />
        </FilterField>
        <FilterField label="数据形态">
          <Select
            value={filters.dataType}
            options={withAllOption(dataTypeOptions)}
            onChange={(value) => updateFilter('dataType', value)}
          />
        </FilterField>
        <FilterField label="安全等级">
          <Select
            value={filters.securityLevel}
            options={withAllOption(securityOptions)}
            onChange={(value) => updateFilter('securityLevel', value)}
          />
        </FilterField>
        <FilterField label="所属地区">
          <Select
            value={filters.region}
            options={[{ label: '全部', value: 'all' }, ...regionOptions]}
            onChange={(value) => updateFilter('region', value)}
          />
        </FilterField>
        <FilterField label="排序方式">
          <Select
            value={filters.sortBy}
            options={sortOptions}
            onChange={(value) => updateFilter('sortBy', value)}
          />
        </FilterField>
      </div>
    </section>
  )
}

export default PortalFilters
