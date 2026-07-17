import { useMemo, useState } from 'react'
import { App, Button, Card, Descriptions, Modal, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ASSET_STATUS, getCatalogPath, initialAssets } from '../../mock/assetCatalog'
import { initialListedProducts } from '../../mock/productPublish'
import { getAssetStatusOverrides, setAssetStatusOverride } from '../../utils/catalogSession'
import PendingAssetTable from './components/PendingAssetTable'
import ProductDetailDrawer from './components/ProductDetailDrawer'
import PublishedProductTable from './components/PublishedProductTable'
import PublishOverview from './components/PublishOverview'
import PublishWizard from './components/PublishWizard'
import './productPublish.css'

const enrichAsset = (asset) => ({ ...asset, catalogName: getCatalogPath(asset.catalogKey), listingStatus: '待审核上架' })

function ProductPublish() {
  const navigate = useNavigate()
  const { message, modal } = App.useApp()
  const [statusOverrides] = useState(() => getAssetStatusOverrides())
  const [assets, setAssets] = useState(() => initialAssets.map((asset) => enrichAsset({ ...asset, status: statusOverrides.get(asset.id) || asset.status })))
  const [products, setProducts] = useState(() => initialListedProducts.filter((product) => {
    const sourceAsset = initialAssets.find((asset) => asset.id === product.assetId)
    return (statusOverrides.get(product.assetId) || sourceAsset?.status) === ASSET_STATUS.publishApplied
  }))
  const [wizardAsset, setWizardAsset] = useState(null)
  const [detailProduct, setDetailProduct] = useState(null)
  const [assetDetail, setAssetDetail] = useState(null)
  const listedAssetIds = useMemo(() => new Set(products.map((product) => product.assetId)), [products])
  const pendingAssets = useMemo(() => assets.filter((asset) => asset.status === ASSET_STATUS.publishApplied && !listedAssetIds.has(asset.id)), [assets, listedAssetIds])

  const updateAssetStatus = (assetId, status) => {
    setAssets((items) => items.map((item) => item.id === assetId ? { ...item, status } : item))
    setAssetStatusOverride(assetId, status)
  }
  const listed = (product, destination) => {
    setProducts((items) => items.some((item) => item.id === product.id) ? items : [product, ...items])
    updateAssetStatus(product.assetId, ASSET_STATUS.publishApplied)
    if (destination === 'portal') { setWizardAsset(null); navigate('/data-portal') }
    if (destination === 'detail') { setWizardAsset(null); setDetailProduct(product) }
  }
  const takeDown = (product) => modal.confirm({
    title: '确认下架该产品？', content: '下架后产品将从已上架列表移除，来源资产重新回到待审核上架列表。',
    okText: '确认下架', okButtonProps: { danger: true },
    onOk: () => { setProducts((items) => items.filter((item) => item.id !== product.id)); updateAssetStatus(product.assetId, ASSET_STATUS.publishApplied); message.success('产品已下架，来源资产已回到待审核上架列表') },
  })

  return (
    <div className="product-publish-page">
      <div className="page-header publish-title"><div className="page-header-copy"><Typography.Title className="page-header-title" level={3}>数据产品上架中心</Typography.Title><Typography.Text className="page-header-description">审核资产上架申请，完成产品信息封装、质量安全检查和门户配置。</Typography.Text></div><PublishOverview pendingCount={pendingAssets.length} listedCount={products.length} /></div>
      <Card className="publish-section" title="待审核上架资产" extra={<Typography.Text type="secondary">展示已在数据资产目录中提交上架申请、等待质量与安全检查的资产。</Typography.Text>}><PendingAssetTable data={pendingAssets} onStart={setWizardAsset} onView={setAssetDetail} /></Card>
      <Card className="publish-section" title="已上架产品"><PublishedProductTable data={products} onView={setDetailProduct} onTakeDown={takeDown} /></Card>
      <PublishWizard open={Boolean(wizardAsset)} asset={wizardAsset} onClose={() => setWizardAsset(null)} onListed={listed} />
      <ProductDetailDrawer open={Boolean(detailProduct)} product={detailProduct} onClose={() => setDetailProduct(null)} />
      <Modal open={Boolean(assetDetail)} title="待审核上架资产摘要" footer={<Space><Button onClick={() => setAssetDetail(null)}>关闭</Button><Button type="primary" onClick={() => { setWizardAsset(assetDetail); setAssetDetail(null) }}>开始上架</Button></Space>} onCancel={() => setAssetDetail(null)}>{assetDetail && <Descriptions bordered column={1} items={[['资产名称', assetDetail.name], ['资产编号', assetDetail.code], ['所属目录', assetDetail.catalogName], ['来源', assetDetail.source], ['质量评分', `${assetDetail.qualityScore} 分`], ['安全等级', assetDetail.securityLevel], ['健康度', `${assetDetail.health} 分`]].map(([label, children], index) => ({ key: index, label, children }))} />}</Modal>
    </div>
  )
}

export default ProductPublish
