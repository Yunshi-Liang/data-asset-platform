import { Button, Space, Table, Tag } from 'antd'

function PublishedProductTable({ data, onView, onTakeDown }) {
  const columns = [
    { title: '产品名称', dataIndex: 'name', width: 230 }, { title: '所属资产', dataIndex: 'assetName', width: 220 },
    { title: '上架时间', dataIndex: 'publishedAt', width: 150 }, { title: '浏览量', dataIndex: 'views' },
    { title: '申请次数', dataIndex: 'applications' }, { title: '收藏数', dataIndex: 'favorites' },
    { title: '状态', dataIndex: 'status', render: (value) => <Tag color="success">{value}</Tag> },
    { title: '负责人', dataIndex: 'owner' },
    { title: '操作', width: 130, render: (_, record) => <Space size={2}><Button type="link" onClick={() => onView(record)}>查看</Button><Button type="link" danger onClick={() => onTakeDown(record)}>下架</Button></Space> },
  ]
  return <Table rowKey="id" size="middle" scroll={{ x: 1150 }} columns={columns} dataSource={data} pagination={{ pageSize: 6 }} />
}

export default PublishedProductTable
