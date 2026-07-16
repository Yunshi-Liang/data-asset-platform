import { Table, Typography } from 'antd'
import { resourceColumnMap } from '../../../mock/portalData'

const { Paragraph } = Typography

function ResourceContent({ product }) {
  const columnTitles = resourceColumnMap[product.dataType]
  const columns = columnTitles.map((title, index) => ({
    title,
    dataIndex: `column${index}`,
    key: `column${index}`,
  }))
  const dataSource = product.resourceRows.map((row, rowIndex) => ({
    key: `${product.id}-resource-${rowIndex}`,
    ...row.reduce(
      (result, value, columnIndex) => ({ ...result, [`column${columnIndex}`]: value }),
      {},
    ),
  }))

  return (
    <div className="resource-content">
      <Paragraph>
        以下为该产品的资源内容示例，用于说明数据结构与交付形式，不代表完整数据范围。
      </Paragraph>
      <Table columns={columns} dataSource={dataSource} pagination={false} size="small" />
    </div>
  )
}

export default ResourceContent
