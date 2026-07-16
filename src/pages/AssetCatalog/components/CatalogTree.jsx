import { useState } from 'react'
import { Input, Tree, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

function addCounts(nodes, assets) {
  return nodes.map((node) => {
    const children = node.children ? addCounts(node.children, assets) : undefined
    const count = assets.filter((asset) => asset.catalogKey.startsWith(node.key)).length
    return { ...node, title: `${node.title} (${count})`, children }
  })
}

function filterTree(nodes, keyword) {
  if (!keyword) return nodes
  return nodes.reduce((result, node) => {
    const children = node.children ? filterTree(node.children, keyword) : []
    if (node.title.includes(keyword) || children.length) result.push({ ...node, children })
    return result
  }, [])
}

function CatalogTree({ assets, selectedKey, onSelect }) {
  const [keyword, setKeyword] = useState('')
  const treeData = filterTree(addCounts(catalogTree, assets), keyword)
  return <div className="catalog-tree-panel">
    <Typography.Title level={5}>数据资产目录</Typography.Title>
    <Input allowClear prefix={<SearchOutlined />} placeholder="搜索目录节点" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
    <Tree blockNode showLine defaultExpandedKeys={['survey','electrical','electrical/line']} selectedKeys={selectedKey ? [selectedKey] : []} treeData={treeData} onSelect={(keys) => onSelect(keys[0] || '')} />
  </div>
}

import { catalogTree } from '../../../mock/assetCatalog'
export default CatalogTree
