import { Statistic } from 'antd'

function PublishOverview({ pendingCount, listedCount }) {
  return (
    <div className="publish-overview-compact">
      <Statistic title="待审核上架资产" value={pendingCount} />
      <Statistic title="已上架产品" value={listedCount} />
    </div>
  )
}

export default PublishOverview
