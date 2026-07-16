import { Button, Input, Select, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { assetStatuses, dataTypes, domains, regions, securityLevels } from '../../../mock/assetCatalog'

const options = (items) => items.map((value) => ({ label: value, value }))
function AssetFilters({ filters, onChange, onReset }) {
  const field = (key, placeholder, items) => <Select allowClear placeholder={placeholder} value={filters[key] || undefined} options={options(items)} onChange={(value) => onChange(key, value)} />
  return <Space wrap className="asset-filters">
    <Input allowClear prefix={<SearchOutlined />} placeholder="搜索名称、编码、来源、标签或负责人" value={filters.keyword} onChange={(e) => onChange('keyword', e.target.value)} />
    {field('domain','业务领域',domains)}{field('dataType','数据形态',dataTypes)}{field('region','所属地区',regions)}
    {field('securityLevel','安全等级',securityLevels)}{field('status','资产状态',assetStatuses)}
    <Select allowClear placeholder="质量评分" value={filters.quality || undefined} options={[{label:'90 分及以上',value:'90'},{label:'80–89 分',value:'80'},{label:'80 分以下',value:'low'}]} onChange={(value) => onChange('quality',value)} />
    <Input allowClear placeholder="标签" value={filters.tag} onChange={(e) => onChange('tag',e.target.value)} />
    <Button onClick={onReset}>重置</Button>
  </Space>
}
export default AssetFilters
