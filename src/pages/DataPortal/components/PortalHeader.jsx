import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Statistic, Typography } from 'antd'
import { portalOverview } from '../../../mock/portalData'

const { Paragraph, Title } = Typography

function PortalHeader({ searchValue, onSearchValueChange, onSearch, onReset }) {
  return (
    <section className="portal-header-panel">
      <div className="portal-title-row">
        <div><Title level={2}>数据产品门户</Title><Paragraph>统一检索、浏览和申请电力设计院已上架数据产品。</Paragraph></div>
      </div>
      <div className="portal-command-row">
        <div className="portal-search-row">
          <Input size="large" value={searchValue} prefix={<SearchOutlined />} placeholder="搜索数据产品、标签或应用场景" allowClear onChange={(event) => onSearchValueChange(event.target.value)} onPressEnter={onSearch} />
          <Button size="large" type="primary" icon={<SearchOutlined />} onClick={onSearch}>搜索</Button>
          <Button size="large" icon={<ReloadOutlined />} onClick={onReset}>重置</Button>
        </div>
        <div className="portal-overview" aria-label="门户概览">
          {portalOverview.map((item) => (
            <Statistic key={item.key} title={item.label} value={item.value} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PortalHeader
