import { useEffect, useState } from 'react'
import { App, Card, Descriptions, Modal, Tabs, Typography } from 'antd'
import { useSearchParams } from 'react-router-dom'
import ProductDetailDrawer from '../DataPortal/components/ProductDetailDrawer'
import ProductPublishDetail from '../ProductPublish/components/ProductDetailDrawer'
import ApplicationFormModal from './components/ApplicationFormModal'
import ApplicationProgressDrawer from './components/ApplicationProgressDrawer'
import ApprovalDrawer from './components/ApprovalDrawer'
import FavoriteProducts from './components/FavoriteProducts'
import HandledData from './components/HandledData'
import MyApplications from './components/MyApplications'
import PendingApprovals from './components/PendingApprovals'
import WorkbenchOverview from './components/WorkbenchOverview'
import { handledAssets, handledProducts, initialApprovalHistory, initialApprovals, initialFavorites, initialMyApplications } from '../../mock/workbench'
import { createApplicationRecord } from '../../mock/application'
import { getSessionApplications } from '../../utils/applicationSession'
import './workbench.css'

function Workbench(){
 const [searchParams]=useSearchParams()
 const {message,modal}=App.useApp(),modalContextHolder=null
 const [favorites,setFavorites]=useState(initialFavorites),[applications,setApplications]=useState(()=>[...getSessionApplications(),...initialMyApplications]),[approvals,setApprovals]=useState(initialApprovals),[history,setHistory]=useState(initialApprovalHistory),[completed,setCompleted]=useState(11)
 const [activeTab,setActiveTab]=useState(()=>searchParams.get('tab')||'favorites'),[highlightId,setHighlightId]=useState(null)
 const [portalProduct,setPortalProduct]=useState(null),[applicationProduct,setApplicationProduct]=useState(null),[editingApplication,setEditingApplication]=useState(null),[applicationDetail,setApplicationDetail]=useState(null),[approvalDetail,setApprovalDetail]=useState(null),[publishProduct,setPublishProduct]=useState(null),[summary,setSummary]=useState(null)
 const pendingCount=approvals.filter(item=>item.status==='待审批').length,processingCount=applications.filter(item=>item.status==='审批中').length
 useEffect(()=>{
  if(searchParams.get('tab')==='applications')setActiveTab('applications')
  const applicationId=searchParams.get('applicationId'),productCode=searchParams.get('productCode')
  const target=applications.find(item=>item.id===applicationId)||(productCode?applications.find(item=>item.productCode===productCode):null)
  if(!target)return undefined
  setHighlightId(target.id);setApplicationDetail(target)
  const timer=setTimeout(()=>setHighlightId(null),2600)
  return()=>clearTimeout(timer)
 },[applications,searchParams])
 const submitApplication=(product,values)=>{if(editingApplication){setApplications(items=>items.map(item=>item.id===editingApplication.id?{...item,...values,status:'审批中',node:'部门负责人审批',submittedAt:new Date().toLocaleString('zh-CN',{hour12:false})}:item));setEditingApplication(null);setApplicationProduct(null);message.success('申请已修改并重新提交');return}const id=`DA-${new Date().getFullYear()}07-${String(Date.now()).slice(-3)}`;const next=createApplicationRecord({id,product,values,submittedAt:new Date().toLocaleString('zh-CN',{hour12:false})});setApplications(items=>[next,...items]);setApplicationProduct(null);message.success(`申请已提交，申请编号：${id}`)}
 const removeFavorite=record=>{setFavorites(items=>items.filter(item=>item.id!==record.id));message.success('已取消收藏')}
 const toggleFavorite=record=>{
  const exists=favorites.some(item=>item.id===record.id)
  if(exists){removeFavorite(record);return}
  setFavorites(items=>[{...record,favoriteAt:new Date().toLocaleString('zh-CN',{hour12:false})},...items])
  message.success('已收藏')
 }
 const editApplication=record=>{setEditingApplication(record);setApplicationProduct({id:record.productCode,code:record.productCode,name:record.productName})}
 const withdraw=record=>modal.confirm({title:'确认撤回申请？',content:record.id,onOk(){setApplications(items=>items.map(item=>item.id===record.id?{...item,status:'已撤回',node:'申请人撤回'}:item));message.success('申请已撤回')}})
 const processApproval=values=>{const status=values.action==='通过'?'已通过':values.action==='驳回'?'已驳回':values.action==='转交'?'已转交':'待补充材料';setApprovals(items=>items.map(item=>item.id===approvalDetail.id?{...item,status,opinion:values.opinion}:item));setHistory(items=>[{id:`AH-${Date.now()}`,applicationId:approvalDetail.id,productName:approvalDetail.productName,applicant:approvalDetail.applicant,result:values.action,opinion:values.opinion,time:new Date().toLocaleString('zh-CN',{hour12:false}),period:values.period||'—'},...items]);if(['通过','驳回','转交'].includes(values.action))setCompleted(v=>v+1);setApprovalDetail(null);message.success(`审批处理已完成：${values.action}`)}
 const tabItems=[
  {key:'favorites',label:`我的收藏 ${favorites.length}`,children:<FavoriteProducts data={favorites} onView={setPortalProduct} onRemove={removeFavorite}/>},
  {key:'applications',label:`我的申请 ${applications.length}`,children:<MyApplications data={applications} highlightId={highlightId} onView={setApplicationDetail} onWithdraw={withdraw} onEdit={editApplication}/>},
  {key:'approvals',label:`待我审批 ${pendingCount}`,children:<PendingApprovals data={approvals} onApprove={setApprovalDetail}/>},
  {key:'handled',label:`经手数据 ${handledAssets.length}`,children:<HandledData assets={handledAssets} products={handledProducts} history={history} onViewAsset={setSummary} onViewProduct={setPublishProduct} onViewApplication={setSummary}/>},
 ]
 return <div className="workbench-page">{modalContextHolder}<div className="workbench-title"><Typography.Title level={3}>个人工作台</Typography.Title><Typography.Text type="secondary">集中查看数据收藏、使用申请、待办审批及个人经手的数据资产。</Typography.Text></div><WorkbenchOverview favorites={favorites.length} applications={processingCount} pendingApprovals={pendingCount} completedApprovals={completed} handledProductCount={handledProducts.length}/><Card className="workbench-tabs"><Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems}/></Card>
  <ProductDetailDrawer product={portalProduct} open={Boolean(portalProduct)} favorite={Boolean(portalProduct&&favorites.some(item=>item.id===portalProduct.id))} onClose={()=>setPortalProduct(null)} onFavorite={toggleFavorite} onApply={setApplicationProduct}/>
  <ApplicationFormModal open={Boolean(applicationProduct)} product={applicationProduct} initialValues={editingApplication} onCancel={()=>{setApplicationProduct(null);setEditingApplication(null)}} onSubmit={submitApplication}/><ApplicationProgressDrawer application={applicationDetail} open={Boolean(applicationDetail)} onClose={()=>setApplicationDetail(null)}/><ApprovalDrawer approval={approvalDetail} open={Boolean(approvalDetail)} onClose={()=>setApprovalDetail(null)} onSubmit={processApproval}/><ProductPublishDetail product={publishProduct} open={Boolean(publishProduct)} onClose={()=>setPublishProduct(null)}/>
  <Modal open={Boolean(summary)} title="经手记录摘要" footer={null} onCancel={()=>setSummary(null)}>{summary&&<Descriptions bordered column={1} items={Object.entries(summary).filter(([,v])=>typeof v!=='object').slice(0,8).map(([label,children])=>({key:label,label,children:String(children)}))}/>}</Modal>
 </div>
}
export default Workbench
