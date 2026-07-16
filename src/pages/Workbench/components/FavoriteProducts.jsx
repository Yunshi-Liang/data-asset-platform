import { StarFilled } from '@ant-design/icons'
import { Button, Empty, Progress, Space, Table, Tag, Tooltip } from 'antd'

function FavoriteProducts({ data, onView, onApply, onRemove }) {
  if (!data.length) return <Empty description="暂无收藏的数据产品" />
  const columns = [
    { title: '产品名称', dataIndex: 'name', width: 240 }, { title: '产品编号', dataIndex: 'code', width: 190 },
    { title: '业务领域', dataIndex: 'category' }, { title: '数据形态', dataIndex: 'dataType' },
    { title: '所属地区', render: (_, record) => `${record.province} · ${record.city}` },
    { title: '质量评分', dataIndex: 'qualityScore', width: 120, render: (value) => <Progress percent={value} size="small" /> },
    { title: '安全等级', dataIndex: 'securityLevel', render: (value) => <Tag color={value === '重要数据' ? 'orange' : 'blue'}>{value}</Tag> },
    { title: '更新时间', dataIndex: 'updatedAt', width: 150 }, { title: '收藏时间', dataIndex: 'favoriteAt', width: 150 },
    { title: '状态', dataIndex: 'status', render: (value) => <Tag color="success">{value}</Tag> },
    { title: '操作', fixed: 'right', width: 160, render: (_, record) => <Space><Button type="link" onClick={() => onView(record)}>详情</Button><Button type="link" onClick={() => onApply(record)}>申请</Button><Tooltip title="取消收藏"><Button type="text" className="favorite-star-button" icon={<StarFilled />} aria-label={`取消收藏 ${record.name}`} onClick={() => onRemove(record)} /></Tooltip></Space> },
  ]
  return <Table rowKey="id" size="middle" scroll={{ x: 1700 }} columns={columns} dataSource={data} pagination={{ pageSize: 6 }} />
}

export default FavoriteProducts
