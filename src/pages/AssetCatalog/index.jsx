import { useEffect, useMemo, useState } from 'react'
import { App, Button, Card, Modal, Space, Typography } from 'antd'
import { FolderOpenOutlined, RocketOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import AssetFilters from './components/AssetFilters'
import AssetProfileDrawer from './components/AssetProfileDrawer'
import AssetTable from './components/AssetTable'
import CatalogMoveModal from './components/CatalogMoveModal'
import CatalogTree from './components/CatalogTree'
import { ASSET_STATUS, canAssetAction, catalogMap, getCatalogPath, initialAssets } from '../../mock/assetCatalog'
import { getSubmittedAssets } from '../../utils/catalogSession'
import './assetCatalog.css'

const enrich = (asset) => ({ ...asset, catalogName: getCatalogPath(asset.catalogKey) })
const emptyFilters = { keyword:'', domain:'', dataType:'', region:'', securityLevel:'', status:'', quality:'', tag:'' }

function AssetCatalog() {
  const navigate = useNavigate()
  const location = useLocation()
  const { message, modal } = App.useApp()
  const modalContextHolder = null
  const [assets,setAssets] = useState(() => {
    const merged = new Map(initialAssets.map((asset) => [asset.id, enrich(asset)]))
    getSubmittedAssets().forEach((asset) => merged.set(asset.id, enrich(asset)))
    return Array.from(merged.values())
  })
  const [selectedCatalog,setSelectedCatalog] = useState('')
  const [filters,setFilters] = useState(emptyFilters)
  const [selectedAssetId,setSelectedAssetId] = useState(null)
  const [moveAsset,setMoveAsset] = useState(null)
  const [publishResult,setPublishResult] = useState(null)
  const selectedAsset = assets.find((item)=>item.id===selectedAssetId)

  useEffect(() => {
    const assetId = new URLSearchParams(location.search).get('assetId')
    if (assetId && assets.some((asset) => asset.id === assetId)) setSelectedAssetId(assetId)
  }, [assets, location.search])

  const visibleAssets = useMemo(()=>assets.filter(asset=>{
    const keyword=filters.keyword.trim().toLowerCase()
    const searchable=[asset.name,asset.code,asset.sourceSystem,asset.owner,...asset.tags].join(' ').toLowerCase()
    const qualityOk=!filters.quality||(filters.quality==='90'?asset.qualityScore>=90:filters.quality==='80'?asset.qualityScore>=80&&asset.qualityScore<90:asset.qualityScore<80)
    return (!selectedCatalog||asset.catalogKey.startsWith(selectedCatalog))&&(!keyword||searchable.includes(keyword))&&(!filters.domain||asset.domain===filters.domain)&&(!filters.dataType||asset.dataType===filters.dataType)&&(!filters.region||asset.region===filters.region)&&(!filters.securityLevel||asset.securityLevel===filters.securityLevel)&&(!filters.status||asset.status===filters.status)&&qualityOk&&(!filters.tag||asset.tags.some(tag=>tag.includes(filters.tag)))
  }),[assets,filters,selectedCatalog])

  const updateAsset=(next)=>setAssets(items=>items.map(item=>item.id===next.id?enrich(next):item))
  const toggleAsset=(asset)=>{
    const enabling=canAssetAction(asset.status,'enable')
    const disabling=canAssetAction(asset.status,'disable')
    if(!enabling&&!disabling) return message.warning('当前资产状态不允许启用或停用')
    modal.confirm({title:`确认${enabling?'启用':'停用'}该资产？`,content:enabling?'启用后资产将进入待申请上架状态，关键资产信息将锁定。':'停用后资产可编辑，重新启用前不能申请上架。',onOk(){updateAsset({...asset,status:enabling?ASSET_STATUS.pendingPublish:ASSET_STATUS.pendingActivation});message.success(`资产已${enabling?'启用':'停用'}`)}})
  }
  const requestPublish=(asset)=>{
    if(!canAssetAction(asset.status,'publish')) return message.warning('仅已启用且待申请上架的资产可以申请上架')
    const checks=[
      {label:'资产已启用',pass:asset.status===ASSET_STATUS.pendingPublish,detail:`当前状态为“${asset.status}”`},
      {label:'质量评分不少于 80 分',pass:asset.qualityScore>=80,detail:`当前评分 ${asset.qualityScore} 分`},
      {label:'安全等级允许流通',pass:asset.securityLevel!=='核心数据',detail:asset.securityLevel==='核心数据'?'核心数据不可直接进入公开门户':`当前为${asset.securityLevel}`},
      {label:'元数据完整',pass:asset.metadataComplete,detail:asset.metadataComplete?'必填元数据已完善':'请补充必填元数据'},
    ]
    setPublishResult({asset,checks,passed:checks.every(item=>item.pass),code:null})
  }
  const submitPublish=()=>{
    const code=`PUB-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`
    updateAsset({...publishResult.asset,status:ASSET_STATUS.publishApplied,publishApplicationCode:code})
    setPublishResult(result=>({...result,code}));message.success(`上架申请已提交，申请编号：${code}`)
  }
  const cancelPublish=(asset)=>modal.confirm({title:'取消上架申请',content:`确认取消“${asset.name}”的上架申请？`,okButtonProps:{danger:true},onOk(){updateAsset({...asset,status:ASSET_STATUS.pendingPublish,publishApplicationCode:''});message.success('上架申请已取消')}})
  const rollback=(asset)=>navigate(`/data-governance?taskId=${asset.governanceTaskId || ''}`)

  return <div className="asset-catalog-page">{modalContextHolder}<div className="page-title-row"><div><Typography.Title level={3}>数据资产目录</Typography.Title><Typography.Text type="secondary">统一组织治理成果，形成可检索、可评价、可运营的数据资产详情。</Typography.Text></div><Button type="primary" icon={<RocketOutlined />} onClick={()=>navigate('/product-publish')}>进入产品上架</Button></div><div className="catalog-main-layout"><CatalogTree assets={assets} selectedKey={selectedCatalog} onSelect={setSelectedCatalog} /><Card className="asset-list-card" title={<Space><FolderOpenOutlined />{selectedCatalog?catalogMap[selectedCatalog]?.name:'全部资产'}<Typography.Text type="secondary">共 {visibleAssets.length} 条</Typography.Text></Space>}><AssetFilters filters={filters} onChange={(key,value)=>setFilters(prev=>({...prev,[key]:value||''}))} onReset={()=>{setFilters(emptyFilters);setSelectedCatalog('')}} /><AssetTable data={visibleAssets} onView={(asset)=>setSelectedAssetId(asset.id)} onPublish={requestPublish} onToggle={toggleAsset} onCancelPublish={cancelPublish} onRollback={rollback} /></Card></div><AssetProfileDrawer open={Boolean(selectedAsset)} asset={selectedAsset} onClose={()=>setSelectedAssetId(null)} onUpdate={updateAsset} onMove={setMoveAsset} onPublish={requestPublish} onToggle={toggleAsset} onCancelPublish={cancelPublish} onRollback={rollback} /><CatalogMoveModal open={Boolean(moveAsset)} asset={moveAsset} onCancel={()=>setMoveAsset(null)} onSubmit={(catalogKey)=>{updateAsset({...moveAsset,catalogKey});setMoveAsset(null);message.success('资产目录已调整')}} /><Modal open={Boolean(publishResult)} title="数据产品上架前检查" width={620} onCancel={()=>setPublishResult(null)} footer={publishResult?.code?<Button type="primary" onClick={()=>navigate('/product-publish')}>前往数据产品上架</Button>:<Space><Button onClick={()=>setPublishResult(null)}>取消</Button><Button type="primary" disabled={!publishResult?.passed} onClick={submitPublish}>提交上架申请</Button></Space>}>{publishResult&&<><Typography.Title level={5}>{publishResult.asset.name}</Typography.Title><div className="publish-check-list">{publishResult.checks.map(item=><div className={item.pass?'check-pass':'check-fail'} key={item.label}><strong>{item.pass?'✓':'✕'} {item.label}</strong><span>{item.detail}</span></div>)}</div>{publishResult.code&&<Card className="publish-success"><Typography.Title level={4}>上架申请已提交</Typography.Title><Typography.Text>申请编号：{publishResult.code}</Typography.Text></Card>}</>}</Modal></div>
}
export default AssetCatalog
