import { useMemo, useState } from 'react'
import { Button, Card, Col, message, Modal, Row, Space, Typography } from 'antd'
import { FolderOpenOutlined, RocketOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import AssetFilters from './components/AssetFilters'
import AssetProfileDrawer from './components/AssetProfileDrawer'
import AssetTable from './components/AssetTable'
import CatalogMoveModal from './components/CatalogMoveModal'
import CatalogTree from './components/CatalogTree'
import { catalogTree, initialAssets } from '../../mock/assetCatalog'
import './assetCatalog.css'

function flattenCatalog(nodes, parent = []) {
  return nodes.flatMap((node) => {
    const path = [...parent, node.title]
    return [{ key: node.key, name: node.title, path: path.join(' / ') }, ...(node.children ? flattenCatalog(node.children, path) : [])]
  })
}
const catalogMap = Object.fromEntries(flattenCatalog(catalogTree).map((item) => [item.key, item]))
const enrich = (asset) => ({ ...asset, catalogName: catalogMap[asset.catalogKey]?.path || asset.catalogKey })
const emptyFilters = { keyword:'', domain:'', dataType:'', region:'', securityLevel:'', status:'', quality:'', tag:'' }

function AssetCatalog() {
  const navigate = useNavigate()
  const [modal, modalContextHolder] = Modal.useModal()
  const [assets,setAssets] = useState(initialAssets.map(enrich))
  const [selectedCatalog,setSelectedCatalog] = useState('')
  const [filters,setFilters] = useState(emptyFilters)
  const [selectedAssetId,setSelectedAssetId] = useState(null)
  const [editRequest,setEditRequest] = useState(0)
  const [moveAsset,setMoveAsset] = useState(null)
  const [publishResult,setPublishResult] = useState(null)
  const selectedAsset = assets.find(item=>item.id===selectedAssetId)

  const visibleAssets = useMemo(()=>assets.filter(asset=>{
    const keyword=filters.keyword.trim().toLowerCase()
    const searchable=[asset.name,asset.code,asset.sourceSystem,asset.owner,...asset.tags].join(' ').toLowerCase()
    const qualityOk=!filters.quality||(filters.quality==='90'?asset.qualityScore>=90:filters.quality==='80'?asset.qualityScore>=80&&asset.qualityScore<90:asset.qualityScore<80)
    return (!selectedCatalog||asset.catalogKey.startsWith(selectedCatalog))&&(!keyword||searchable.includes(keyword))&&(!filters.domain||asset.domain===filters.domain)&&(!filters.dataType||asset.dataType===filters.dataType)&&(!filters.region||asset.region===filters.region)&&(!filters.securityLevel||asset.securityLevel===filters.securityLevel)&&(!filters.status||asset.status===filters.status)&&qualityOk&&(!filters.tag||asset.tags.some(tag=>tag.includes(filters.tag)))
  }),[assets,filters,selectedCatalog])

  const updateAsset=(next)=>setAssets(items=>items.map(item=>item.id===next.id?enrich(next):item))
  const openAsset=(asset)=>setSelectedAssetId(asset.id)
  const toggleAsset=(asset)=>modal.confirm({title:`确认${asset.status==='已停用'?'启用':'停用'}该资产？`,content:asset.name,onOk(){updateAsset({...asset,status:asset.status==='已停用'?'已发布':'已停用'});message.success('资产状态已更新')}})
  const requestPublish=(asset)=>{
    const checks=[
      {label:'资产状态可用',pass:!['已停用','治理异常','草稿'].includes(asset.status),detail:['已停用','治理异常','草稿'].includes(asset.status)?`当前状态为“${asset.status}”`:'状态符合上架要求'},
      {label:'质量评分不少于 80 分',pass:asset.qualityScore>=80,detail:`当前评分 ${asset.qualityScore} 分`},
      {label:'安全等级允许流通',pass:asset.securityLevel!=='核心数据',detail:asset.securityLevel==='核心数据'?'核心数据不可直接进入公开门户':`当前为${asset.securityLevel}`},
      {label:'元数据完整',pass:asset.metadataComplete,detail:asset.metadataComplete?'必填元数据已完善':'请补充必填元数据'},
    ]
    setPublishResult({asset,checks,passed:checks.every(item=>item.pass),code:null})
  }
  const submitPublish=()=>{
    const code=`PUB-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`
    setPublishResult(result=>({...result,code}));message.success(`上架申请已提交，申请编号：${code}`)
  }

  return <div className="asset-catalog-page">
    {modalContextHolder}
    <div className="page-title-row"><div><Typography.Title level={3}>数据资产目录</Typography.Title><Typography.Text type="secondary">统一组织治理成果，形成可检索、可评价、可运营的数据资产画像。</Typography.Text></div><Button type="primary" icon={<RocketOutlined />} onClick={()=>navigate('/product-publish')}>进入产品上架</Button></div>
    <Row gutter={16} align="stretch">
      <Col flex="270px"><CatalogTree assets={assets} selectedKey={selectedCatalog} onSelect={setSelectedCatalog} /></Col>
      <Col flex="auto"><Card className="asset-list-card" title={<Space><FolderOpenOutlined />{selectedCatalog?catalogMap[selectedCatalog]?.name:'全部资产'}<Typography.Text type="secondary">共 {visibleAssets.length} 条</Typography.Text></Space>}>
        <AssetFilters filters={filters} onChange={(key,value)=>setFilters(prev=>({...prev,[key]:value||''}))} onReset={()=>{setFilters(emptyFilters);setSelectedCatalog('')}} />
        <AssetTable data={visibleAssets} onView={openAsset} onEdit={(asset)=>{setEditRequest(value=>value+1);openAsset(asset)}} onPublish={requestPublish} onToggle={toggleAsset} />
      </Card></Col>
    </Row>
    <AssetProfileDrawer open={Boolean(selectedAsset)} asset={selectedAsset} editRequest={editRequest} onClose={()=>setSelectedAssetId(null)} onUpdate={updateAsset} onMove={setMoveAsset} onPublish={requestPublish} onToggle={toggleAsset} />
    <CatalogMoveModal open={Boolean(moveAsset)} asset={moveAsset} onCancel={()=>setMoveAsset(null)} onSubmit={(catalogKey)=>{updateAsset({...moveAsset,catalogKey});setMoveAsset(null);message.success('资产目录已调整')}} />
    <Modal open={Boolean(publishResult)} title="数据产品上架前检查" width={620} onCancel={()=>setPublishResult(null)} footer={publishResult?.code?<Button type="primary" onClick={()=>navigate('/product-publish')}>前往数据产品上架</Button>:<Space><Button onClick={()=>setPublishResult(null)}>取消</Button><Button type="primary" disabled={!publishResult?.passed} onClick={submitPublish}>提交上架申请</Button></Space>}>
      {publishResult&&<><Typography.Title level={5}>{publishResult.asset.name}</Typography.Title><div className="publish-check-list">{publishResult.checks.map(item=><div className={item.pass?'check-pass':'check-fail'} key={item.label}><strong>{item.pass?'✓':'✕'} {item.label}</strong><span>{item.detail}</span></div>)}</div>{publishResult.code&&<Card className="publish-success"><Typography.Title level={4}>上架申请已提交</Typography.Title><Typography.Text>申请编号：{publishResult.code}</Typography.Text></Card>}</>}
    </Modal>
  </div>
}
export default AssetCatalog
