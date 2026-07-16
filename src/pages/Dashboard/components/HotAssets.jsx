import { Progress, Table, Tag } from 'antd'
import { hotAssets } from '../../../mock/dashboard'
import SectionCard from './SectionCard'

const columns = [
  {
    title: '资产名称',
    dataIndex: 'name',
    key: 'name',
    render: (name) => <span className="asset-name">{name}</span>,
  },
  {
    title: '所属分类',
    dataIndex: 'category',
    key: 'category',
    render: (category) => <Tag color="blue">{category}</Tag>,
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 120,
  },
  {
    title: '质量评分',
    dataIndex: 'qualityScore',
    key: 'qualityScore',
    width: 140,
    render: (score) => (
      <div className="quality-score">
        <Progress percent={score} size="small" showInfo={false} />
        <span>{score}</span>
      </div>
    ),
  },
]

function HotAssets() {
  return (
    <SectionCard title="热门数据资产" description="近期访问与使用频率较高的数据资产">
      <Table
        className="hot-assets-table"
        columns={columns}
        dataSource={hotAssets}
        pagination={false}
        size="middle"
      />
    </SectionCard>
  )
}

export default HotAssets
