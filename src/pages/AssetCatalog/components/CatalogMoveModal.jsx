import { Modal, Tree } from 'antd'
import { useState } from 'react'
import { catalogTree } from '../../../mock/assetCatalog'

function CatalogMoveModal({ open, asset, onCancel, onSubmit }) {
  const [selected, setSelected] = useState('')
  return <Modal open={open} title="调整资产目录" okText="确认调整" onCancel={onCancel} onOk={()=>selected && onSubmit(selected)} okButtonProps={{disabled:!selected}}>
    <p>当前资产：{asset?.name}</p><Tree showLine defaultExpandAll selectedKeys={selected?[selected]:[]} treeData={catalogTree} onSelect={(keys)=>setSelected(keys[0]||'')} />
  </Modal>
}
export default CatalogMoveModal
