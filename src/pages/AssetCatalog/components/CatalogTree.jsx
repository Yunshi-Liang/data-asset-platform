import { useState } from 'react'
import { Button, Input, Space, Tree, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { catalogTree } from '../../../mock/assetCatalog'

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

function getAllExpandableKeys(nodes) {
  return nodes.flatMap((node) => [
    ...(node.children?.length ? [node.key] : []),
    ...(node.children ? getAllExpandableKeys(node.children) : []),
  ])
}

function CatalogTree({ assets, selectedKey, onSelect }) {
  const [keyword, setKeyword] = useState('')
  const [expandedKeys, setExpandedKeys] = useState(['survey', 'electrical', 'electrical/line'])
  const treeData = filterTree(addCounts(catalogTree, assets), keyword)
  return <div className="catalog-tree-panel">
    <div className="catalog-tree-toolbar">
      <Typography.Title level={5}>数据资产目录</Typography.Title>
      <Space size={2}>
        <Button type="link" size="small" onClick={() => setExpandedKeys(getAllExpandableKeys(catalogTree))}>全部展开</Button>
        <Button type="link" size="small" onClick={() => setExpandedKeys([])}>全部收起</Button>
      </Space>
    </div>
    <Input allowClear prefix={<SearchOutlined />} placeholder="搜索目录节点" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
    <Tree blockNode showLine expandedKeys={expandedKeys} selectedKeys={selectedKey ? [selectedKey] : []} treeData={treeData} onExpand={setExpandedKeys} onSelect={(keys) => onSelect(keys[0] || '')} />
  </div>
}

export default CatalogTree
