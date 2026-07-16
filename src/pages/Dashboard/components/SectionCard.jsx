import { Card, Typography } from 'antd'

const { Text, Title } = Typography

function SectionCard({ title, description, extra, className = '', children }) {
  return (
    <Card className={`dashboard-card ${className}`}>
      <div className="dashboard-card-header">
        <div>
          <Title level={4}>{title}</Title>
          {description && <Text>{description}</Text>}
        </div>
        {extra}
      </div>
      {children}
    </Card>
  )
}

export default SectionCard
