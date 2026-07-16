import {
  CheckCircleFilled,
  FileAddOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons'
import { Button, Descriptions, Drawer, Progress, Space, Tabs, Tag, Typography } from 'antd'
import ResourceContent from './ResourceContent'

const { Paragraph, Text, Title } = Typography

function QualityContent({ product }) {
  const qualityItems = [
    ['完整性', product.quality.completeness],
    ['准确性', product.quality.accuracy],
    ['一致性', product.quality.consistency],
    ['时效性', product.quality.timeliness],
  ]

  return (
    <div className="quality-detail">
      <div className="quality-overall">
        <Progress type="circle" percent={product.qualityScore} size={96} />
        <div>
          <Title level={4}>综合质量评分</Title>
          <Text type="secondary">最近一次质量检查已通过</Text>
        </div>
      </div>
      <div className="quality-dimensions">
        {qualityItems.map(([label, value]) => (
          <div className="quality-dimension" key={label}>
            <Text>{label}</Text>
            <Progress percent={value} size="small" />
          </div>
        ))}
      </div>
      <Descriptions column={2} size="small" bordered>
        <Descriptions.Item label="最近更新时间">{product.updatedAt}</Descriptions.Item>
        <Descriptions.Item label="更新周期">{product.updateFrequency}</Descriptions.Item>
        <Descriptions.Item label="质量检查状态" span={2}>
          <Tag icon={<CheckCircleFilled />} color="success">
            检查通过
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </div>
  )
}

function ProductDetailDrawer({ product, open, favorite, onClose, onFavorite, onApply }) {
  if (!product) return null

  const basicItems = [
    ['产品编码', product.code],
    ['业务分类', product.category],
    ['数据来源', product.source],
    ['所属地区', `${product.province} · ${product.city}`],
    ['数据形态', product.dataType],
    ['数据格式', product.format],
    ['数据规模', product.size],
    ['更新频率', product.updateFrequency],
    ['发布时间', product.publishedAt],
    ['责任部门', product.department],
    ['安全等级', product.securityLevel],
    ['使用方式', product.accessMethod],
  ]

  const tabItems = [
    {
      key: 'basic',
      label: '基本信息',
      children: (
        <div className="drawer-tab-content">
          <div className="detail-description">
            <Text type="secondary">产品描述</Text>
            <Paragraph>{product.description}</Paragraph>
          </div>
          <Descriptions column={2} size="small" bordered>
            {basicItems.map(([label, value]) => (
              <Descriptions.Item label={label} key={label}>
                {value}
              </Descriptions.Item>
            ))}
            <Descriptions.Item label="适用场景" span={2}>
              <Space size={[6, 6]} wrap>
                {product.scenarios.map((scenario) => (
                  <Tag color="blue" key={scenario}>
                    {scenario}
                  </Tag>
                ))}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </div>
      ),
    },
    {
      key: 'resource',
      label: '资源内容',
      children: <ResourceContent product={product} />,
    },
    {
      key: 'quality',
      label: '质量与更新',
      children: <QualityContent product={product} />,
    },
    {
      key: 'usage',
      label: '使用说明',
      children: (
        <Descriptions column={1} size="small" bordered>
          <Descriptions.Item label="适用对象">{product.usage.target}</Descriptions.Item>
          <Descriptions.Item label="典型应用场景">
            {product.scenarios.join('、')}
          </Descriptions.Item>
          <Descriptions.Item label="使用限制">{product.usage.restrictions}</Descriptions.Item>
          <Descriptions.Item label="申请所需材料">{product.usage.materials}</Descriptions.Item>
          <Descriptions.Item label="联系部门">{product.usage.contact}</Descriptions.Item>
        </Descriptions>
      ),
    },
  ]

  return (
    <Drawer
      className="product-detail-drawer"
      title={
        <div className="drawer-title">
          <Title level={4}>{product.name}</Title>
          <Space size={6} wrap>
            <Tag color="blue">{product.category}</Tag>
            <Tag>{product.dataType}</Tag>
            <Tag color={product.securityLevel === '重要数据' ? 'orange' : 'green'}>
              {product.securityLevel}
            </Tag>
          </Space>
        </div>
      }
      size={760}
      open={open}
      destroyOnHidden
      onClose={onClose}
      footer={
        <div className="drawer-footer">
          <Button
            icon={favorite ? <StarFilled /> : <StarOutlined />}
            onClick={() => onFavorite(product)}
          >
            {favorite ? '取消收藏' : '收藏产品'}
          </Button>
          <Button type="primary" icon={<FileAddOutlined />} onClick={() => onApply(product)}>
            申请使用
          </Button>
        </div>
      }
    >
      <Tabs items={tabItems} />
    </Drawer>
  )
}

export default ProductDetailDrawer
