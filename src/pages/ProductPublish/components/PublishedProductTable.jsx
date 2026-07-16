import { EyeOutlined, StopOutlined } from '@ant-design/icons'
import { Table, Tag } from 'antd'
import TableIconButton from '../../../components/TableIconButton'

function PublishedProductTable({ data, onView, onTakeDown }) {
  const columns = [
    { title: '产品名称', dataIndex: 'name', width: 230 }, { title: '所属资产', dataIndex: 'assetName', width: 220 },
    { title: '上架时间', dataIndex: 'publishedAt', width: 150 }, { title: '浏览量', dataIndex: 'views' }, { title: '申请次数', dataIndex: 'applications' },
    { title: '收藏数', dataIndex: 'favorites' }, { title: '状态', dataIndex: 'status', render: (value) => <Tag color="success">{value}</Tag> }, { title: '负责人', dataIndex: 'owner' },
    { title: '操作', width: 86, render: (_, record) => <div className="table-icon-actions"><TableIconButton label="查看" icon={<EyeOutlined />} onClick={() => onView(record)} /><TableIconButton label="下架" danger icon={<StopOutlined />} onClick={() => onTakeDown(record)} /></div> },
  ]
  return <Table rowKey="id" size="middle" scroll={{ x: 1110 }} columns={columns} dataSource={data} pagination={{ pageSize: 6 }} />
}

export default PublishedProductTable
