import {
  ArrowRightOutlined,
  EyeOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons'
import { Button, Card, Progress, Space, Tag, Tooltip, Typography } from 'antd'

const { Paragraph, Text, Title } = Typography

const securityColors = {
  一般数据: 'green',
  重要数据: 'orange',
}

function DataProductCard({ product, favorite, applied, onFavorite, onViewDetail }) {
  return (
    <Card className="data-product-card">
      <div className="product-card-topline">
        <Space size={6} wrap>
          <Tag color="blue">{product.category}</Tag>
          <Tag>{product.dataType}</Tag>
          <Tag color={securityColors[product.securityLevel]}>{product.securityLevel}</Tag>
        </Space>
        {applied && <Tag color="processing">已申请</Tag>}
      </div>

      <Title level={4} title={product.name}>
        {product.name}
      </Title>
      <Paragraph className="product-description">{product.description}</Paragraph>

      <div className="product-meta-grid">
        <Text>所属地区</Text>
        <Text>{product.city ? `${product.province} · ${product.city}` : product.province}</Text>
        <Text>更新频率</Text>
        <Text>{product.updateFrequency}</Text>
      </div>

      <div className="product-quality">
        <Text>数据质量</Text>
        <Progress percent={product.qualityScore} size="small" showInfo={false} />
        <Text strong>{product.qualityScore}</Text>
      </div>

      <Space size={[6, 6]} wrap className="product-tags">
        {product.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </Space>

      <div className="product-card-footer">
        <Space size={14} className="product-activity">
          <Text>
            <EyeOutlined /> {product.views.toLocaleString()}
          </Text>
          <Text>申请 {product.applications.toLocaleString()} 次</Text>
        </Space>
        <Space size={6}>
          <Button type="link" onClick={() => onViewDetail(product)}>查看详情 <ArrowRightOutlined /></Button>
          <Tooltip title={favorite ? '取消收藏' : '收藏'}>
            <Button type="text" className={favorite ? 'favorite-button is-favorite' : 'favorite-button'} icon={favorite ? <StarFilled /> : <StarOutlined />} aria-label={`${favorite ? '取消收藏' : '收藏'} ${product.name}`} onClick={() => onFavorite(product)} />
          </Tooltip>
        </Space>
      </div>
    </Card>
  )
}

export default DataProductCard
