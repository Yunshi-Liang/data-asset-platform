import { useState } from 'react'
import { Button, Card, Descriptions, Modal, Space, Typography, message } from 'antd'
import { RocketOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import PendingAssetTable from './components/PendingAssetTable'
import ProductDetailDrawer from './components/ProductDetailDrawer'
import PublishedProductTable from './components/PublishedProductTable'
import PublishOverview from './components/PublishOverview'
import PublishWizard from './components/PublishWizard'
import { initialPublishedProducts, pendingAssets } from '../../mock/productPublish'
import './productPublish.css'

function ProductPublish(){
 const navigate=useNavigate(),[modal,contextHolder]=Modal.useModal(),[products,setProducts]=useState(initialPublishedProducts),[wizardAsset,setWizardAsset]=useState(null),[detailProduct,setDetailProduct]=useState(null),[assetDetail,setAssetDetail]=useState(null)
 const toggleProduct=product=>modal.confirm({title:product.status==='已发布'?'确认下架该产品？':'确认重新发布该产品？',content:product.name,onOk(){setProducts(items=>items.map(item=>item.id===product.id?{...item,status:product.status==='已发布'?'已下架':'已发布'}:item));message.success('产品状态已更新')}})
 const published=(product,goPortal=false)=>{if(!products.some(item=>item.id===product.id))setProducts(items=>[product,...items]);if(goPortal){setWizardAsset(null);navigate('/data-portal')}}
 return <div className="product-publish-page">{contextHolder}<div className="publish-title"><div><Typography.Title level={3}>数据产品发布中心</Typography.Title><Typography.Text type="secondary">将治理完成的数据资产封装、审核并发布为可申请、可运营的数据产品。</Typography.Text></div><Button type="primary" icon={<RocketOutlined/>} onClick={()=>setWizardAsset(pendingAssets[0])}>新建产品发布</Button></div>
  <PublishOverview/>
  <Card className="publish-section" title="待上架资产" extra={<Typography.Text type="secondary">治理资产经质量与安全检查后方可发布</Typography.Text>}><PendingAssetTable data={pendingAssets} onStart={setWizardAsset} onView={setAssetDetail}/></Card>
  <Card className="publish-section" title="已发布及审核产品"><PublishedProductTable data={products} onView={setDetailProduct} onEdit={product=>{const asset=pendingAssets.find(item=>item.name===product.assetName)||pendingAssets[0];setWizardAsset(asset)}} onToggle={toggleProduct}/></Card>
  <PublishWizard open={Boolean(wizardAsset)} asset={wizardAsset} onClose={()=>setWizardAsset(null)} onPublished={published}/>
  <ProductDetailDrawer open={Boolean(detailProduct)} product={detailProduct} onClose={()=>setDetailProduct(null)}/>
  <Modal open={Boolean(assetDetail)} title="待上架资产摘要" footer={<Space><Button onClick={()=>setAssetDetail(null)}>关闭</Button><Button type="primary" onClick={()=>{setWizardAsset(assetDetail);setAssetDetail(null)}}>开始上架</Button></Space>} onCancel={()=>setAssetDetail(null)}>{assetDetail&&<Descriptions bordered column={1} items={[['资产名称',assetDetail.name],['资产编号',assetDetail.code],['所属目录',assetDetail.catalogName],['来源',assetDetail.source],['质量评分',`${assetDetail.qualityScore} 分`],['安全等级',assetDetail.securityLevel],['健康度',`${assetDetail.health} 分`]].map(([label,children],i)=>({key:i,label,children}))}/>}</Modal>
 </div>
}
export default ProductPublish
