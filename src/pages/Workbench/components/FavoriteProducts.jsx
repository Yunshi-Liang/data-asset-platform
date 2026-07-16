import { EyeOutlined, StarFilled } from '@ant-design/icons'
import { Empty, Progress, Table, Tag } from 'antd'
import TableIconButton from '../../../components/TableIconButton'

function FavoriteProducts({ data, onView, onRemove }) {
  if (!data.length) return <Empty description="暂无收藏的数据产品" />
  const columns = [
    { title: '产品名称', dataIndex: 'name', width: 240 }, { title: '产品编号', dataIndex: 'code', width: 190 },
    { title: '业务领域', dataIndex: 'category' }, { title: '数据形态', dataIndex: 'dataType' }, { title: '所属地区', render: (_, record) => `${record.province} · ${record.city}` },
    { title: '质量评分', dataIndex: 'qualityScore', width: 120, render: (value) => <Progress percent={value} size="small" /> },
    { title: '安全等级', dataIndex: 'securityLevel', render: (value) => <Tag color={value === '重要数据' ? 'orange' : 'blue'}>{value}</Tag> },
    { title: '更新时间', dataIndex: 'updatedAt', width: 150 }, { title: '收藏时间', dataIndex: 'favoriteAt', width: 150 },
    { title: '状态', dataIndex: 'status', render: (value) => <Tag color="success">{value}</Tag> },
    { title: '操作', fixed: 'right', width: 86, render: (_, record) => <div className="table-icon-actions"><TableIconButton label="详情" icon={<EyeOutlined />} onClick={() => onView(record)} /><TableIconButton label="取消收藏" icon={<StarFilled />} onClick={() => onRemove(record)} /></div> },
  ]
  return <Table rowKey="id" size="middle" scroll={{ x: 1620 }} columns={columns} dataSource={data} pagination={{ pageSize: 6 }} />
}

export default FavoriteProducts
