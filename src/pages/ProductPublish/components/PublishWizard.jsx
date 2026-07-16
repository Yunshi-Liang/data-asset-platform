import { useEffect, useState } from 'react'
import { Alert, Button, Card, Checkbox, Col, Descriptions, Divider, Drawer, Form, Input, Modal, Progress, Radio, Result, Row, Select, Space, Statistic, Steps, Tag, Typography } from 'antd'
import { CheckCircleFilled, EyeOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { accessOptions, approvalOptions, validityOptions, visibilityOptions } from '../../../mock/productPublish'
import { currentUser } from '../../../mock/currentUser'

const options = (items) => items.map((value) => ({ label: value, value }))
const formRules = [{ required: true, message: '请填写此项' }]

function AssetStep({ asset, onReselect }) {
  const fields = [['资产名称',asset.name],['资产编号',asset.code],['来源',asset.source],['所属目录',asset.catalogName],['数据规模',asset.size],['数据形态',asset.dataType],['数据质量',`${asset.qualityScore} 分`],['健康度',`${asset.health} 分`],['安全等级',asset.securityLevel]]
  return <Space direction="vertical" size="large" className="wizard-step-stack"><Alert showIcon type="info" message="已选择治理完成的数据资产作为产品封装来源" /><Descriptions bordered column={2} items={fields.map(([label,children],index) => ({ key:index,label,children,span:label==='资产名称'?2:1 }))} /><Button onClick={onReselect}>重新选择资产</Button></Space>
}

function ProductForm({ form, asset }) {
  return <Form form={form} layout="vertical" initialValues={{name:asset.name,description:asset.description,category:asset.catalogName,domain:asset.domain,region:asset.region,target:'设计人员、项目经理和数据分析人员',scenarios:asset.scenarios,keywords:asset.tags.join('、'),tags:asset.tags.join('、'),frequency:asset.frequency,version:'V1.0',format:asset.dataType==='GIS 数据'?'GDB、SHP、GeoJSON':asset.dataType,dataSize:asset.size,department:asset.department,owner:asset.owner,contact:asset.contact,icon:'数据资产标准图标'}}><Row gutter={16}>
    <Col span={12}><Form.Item name="name" label="产品名称" rules={formRules}><Input /></Form.Item></Col><Col span={12}><Form.Item name="category" label="产品分类" rules={formRules}><Input /></Form.Item></Col>
    <Col span={24}><Form.Item name="description" label="产品描述" rules={formRules}><Input.TextArea rows={3} /></Form.Item></Col>
    <Col span={8}><Form.Item name="domain" label="所属业务领域" rules={formRules}><Select options={options(['技经数据','勘测数据','电气设计数据','工程数据','标准知识库'])} /></Form.Item></Col><Col span={8}><Form.Item name="region" label="所属地区" rules={formRules}><Select options={options(['广东省','广西壮族自治区','海南省','广州市','深圳市','珠海市'])} /></Form.Item></Col><Col span={8}><Form.Item name="frequency" label="更新频率" rules={formRules}><Select options={options(['实时','每日','每周','每月','按项目'])} /></Form.Item></Col>
    <Col span={12}><Form.Item name="target" label="适用对象" rules={formRules}><Input /></Form.Item></Col><Col span={12}><Form.Item name="scenarios" label="适用场景" rules={formRules}><Input /></Form.Item></Col>
    <Col span={12}><Form.Item name="keywords" label="关键词" rules={formRules}><Input /></Form.Item></Col><Col span={12}><Form.Item name="tags" label="产品标签" rules={formRules}><Input /></Form.Item></Col>
    <Col span={6}><Form.Item name="version" label="版本号" rules={formRules}><Input /></Form.Item></Col><Col span={6}><Form.Item name="format" label="数据格式" rules={formRules}><Input /></Form.Item></Col><Col span={6}><Form.Item name="dataSize" label="数据量" rules={formRules}><Input /></Form.Item></Col><Col span={6}><Form.Item name="icon" label="产品图标（Mock）"><Select options={options(['数据资产标准图标','GIS 地图图标','文档资料图标','API 服务图标'])} /></Form.Item></Col>
    <Col span={8}><Form.Item name="department" label="责任部门" rules={formRules}><Input /></Form.Item></Col><Col span={8}><Form.Item name="owner" label="责任人" rules={formRules}><Input /></Form.Item></Col><Col span={8}><Form.Item name="contact" label="联系方式" rules={formRules}><Input /></Form.Item></Col>
  </Row></Form>
}

function QualityReview({ asset }) {
  const [detailOpen,setDetailOpen] = useState(false)
  const checks = [['质量评分',asset.qualityScore>=80,`${asset.qualityScore} 分`],['元数据完整',asset.metadataComplete,asset.metadataComplete?'完整':'缺少必填项'],['血缘完整',true,'来源与加工链路完整'],['标签完整',asset.tags.length>=2,`${asset.tags.length} 个标签`],['质量检查通过',asset.unresolvedIssues<5,`${asset.unresolvedIssues} 个待处理问题`]]
  const passed = checks.every((item) => item[1])
  return <><Alert type={passed?'success':'error'} showIcon message={passed?'自动质量检查通过，可以进入安全检查':'质量检查未通过，当前产品不能上架'} /><Row gutter={16} className="wizard-block"><Col span={7}><Card><Progress type="dashboard" percent={asset.qualityScore} /></Card></Col><Col span={17}><div className="review-list">{checks.map(([name,pass,detail]) => <div className={pass?'review-pass':'review-fail'} key={name}><span>{pass?<CheckCircleFilled />:'✕'} {name}</span><strong>{detail}</strong></div>)}</div></Col></Row><Button onClick={() => setDetailOpen(true)}>查看检查详情</Button><Modal open={detailOpen} title="质量检查详情" footer={<Button type="primary" onClick={() => setDetailOpen(false)}>关闭</Button>} onCancel={() => setDetailOpen(false)}>资产质量评分 {asset.qualityScore} 分；元数据、血缘、标签和未解决问题均已完成自动检查。</Modal></>
}

function SecurityReview({ asset }) {
  const forbidden = asset.securityLevel === '核心数据'
  const conclusion = forbidden ? '禁止上架' : asset.securityLevel === '重要数据' ? '允许授权上架' : '允许上架'
  return <><Alert type={forbidden?'error':asset.securityLevel==='重要数据'?'warning':'success'} showIcon message={`安全检查结论：${conclusion}`} description={forbidden?'核心数据不可直接进入公开数据资产门户。':'已根据安全等级自动匹配开放与审批策略。'} /><Row gutter={12} className="wizard-block">{[['安全等级',asset.securityLevel],['脱敏状态','已完成'],['权限校验','通过'],['敏感字段',asset.securityLevel==='重要数据'?'3 个':'0 个'],['开放方式',asset.securityLevel==='一般数据'?'按配置开放':'授权访问'],['检查结论',conclusion]].map(([title,value]) => <Col span={8} key={title}><Card><Statistic title={title} value={value} /></Card></Col>)}</Row></>
}

function PermissionForm({ form, asset }) {
  return <Form form={form} layout="vertical" initialValues={{visibility:asset.securityLevel==='一般数据'?'全部用户':'指定角色',departments:'输电工程设计中心、勘测工程中心',roles:'专业设计人员、项目经理',projects:'已授权华南区域电力工程',methods:asset.dataType==='API 服务'?['API 调用','数据推送']:['文件下载','在线查看'],approval:asset.securityLevel==='一般数据'?'无需审批':'管理员审批',validity:'一年'}}><Form.Item name="visibility" label="产品可见范围" rules={formRules}><Radio.Group options={visibilityOptions} /></Form.Item><Row gutter={16}><Col span={12}><Form.Item name="departments" label="指定部门"><Input /></Form.Item></Col><Col span={12}><Form.Item name="roles" label="指定角色"><Input /></Form.Item></Col></Row><Form.Item name="projects" label="指定项目"><Input /></Form.Item><Form.Item name="methods" label="数据使用方式" rules={formRules}><Checkbox.Group options={accessOptions} /></Form.Item><Row gutter={16}><Col span={12}><Form.Item name="approval" label="审批方式" rules={formRules}><Select options={options(approvalOptions)} /></Form.Item></Col><Col span={12}><Form.Item name="validity" label="有效期" rules={formRules}><Select options={options(validityOptions)} /></Form.Item></Col></Row></Form>
}

function PublishPreview({ asset, product, permission, onPreview }) {
  return <Space direction="vertical" size="large" className="wizard-step-stack"><div className="portal-preview"><div><Tag color="blue">{product.domain}</Tag><Tag color="orange">{asset.securityLevel}</Tag><Typography.Title level={3}>{product.name}</Typography.Title><Typography.Paragraph>{product.description}</Typography.Paragraph><Space wrap>{product.tags?.split('、').map((tag) => <Tag key={tag}>{tag}</Tag>)}</Space></div><Divider /><Descriptions column={2} items={[['资产来源',asset.name],['所属地区',product.region],['数据格式',product.format],['质量评分',`${asset.qualityScore} 分`],['更新时间',asset.updatedAt],['申请方式',permission.approval],['可见范围',permission.visibility],['使用方式',permission.methods?.join('、')]].map(([label,children],index) => ({ key:index,label,children }))} /></div>{onPreview && <Button icon={<EyeOutlined />} onClick={onPreview}>产品门户预览</Button>}</Space>
}

function PublishWizard({ open, asset, onClose, onListed }) {
  const [current,setCurrent] = useState(0)
  const [productForm] = Form.useForm()
  const [permissionForm] = Form.useForm()
  const [product,setProduct] = useState({})
  const [permission,setPermission] = useState({})
  const [result,setResult] = useState(null)
  const [preview,setPreview] = useState(false)
  useEffect(() => {
    if (open) {
      setCurrent(0)
      setResult(null)
      setProduct({})
      setPermission({})
      productForm.resetFields()
      permissionForm.resetFields()
    }
  }, [asset?.id, open, permissionForm, productForm])
  if (!asset) return null
  const qualityPassed = asset.qualityScore>=80 && asset.metadataComplete && asset.unresolvedIssues<5
  const securityPassed = asset.securityLevel !== '核心数据'
  const next = async () => { if (current===1) setProduct(await productForm.validateFields()); if (current===4) setPermission(await permissionForm.validateFields()); setCurrent((value) => value+1) }
  const listProduct = () => { const code=`DP-2026-${String(Date.now()).slice(-4)}`; const publishedAt=new Date().toLocaleString('zh-CN',{hour12:false}); const nextProduct={id:code,assetId:asset.id,code,name:product.name,assetName:asset.name,publishedAt,views:0,applications:0,favorites:0,downloads:0,apiCalls:0,status:'已上架',owner:product.owner,domain:product.domain,region:product.region,format:product.format,qualityScore:asset.qualityScore,permission:permission.approval,accessMethods:permission.methods,description:product.description}; setResult(nextProduct); onListed(nextProduct) }
  const items = ['选择资产','产品信息配置','质量检查','安全检查','权限配置','上架确认'].map((title) => ({ title }))
  const content = [<AssetStep key="asset" asset={asset} onReselect={onClose} />,<ProductForm key="product" form={productForm} asset={asset} />,<QualityReview key="quality" asset={asset} />,<SecurityReview key="security" asset={asset} />,<PermissionForm key="permission" form={permissionForm} asset={asset} />,<PublishPreview key="preview" asset={asset} product={product} permission={permission} onPreview={() => setPreview(true)} />][current]
  return <><Drawer open={open} onClose={onClose} width="min(1080px,95vw)" title="数据产品上架工作区" extra={!result&&<Tag icon={<SafetyCertificateOutlined />} color="blue">Mock 上架检查流程</Tag>}>{result ? <Result status="success" title="数据产品上架成功" subTitle={`产品编号：${result.code}`} extra={[<Button key="pending" onClick={onClose}>返回待上架资产</Button>,<Button key="listed" onClick={() => onListed(result,'detail')}>查看已上架产品</Button>,<Button type="primary" key="portal" onClick={() => onListed(result,'portal')}>前往数据资产门户</Button>]}><Descriptions bordered column={1} items={[{key:1,label:'上架时间',children:result.publishedAt},{key:2,label:'上架人',children:currentUser.name},{key:3,label:'门户地址',children:'数据资产门户'}]} /></Result> : <><Steps current={current} items={items} /><div className="wizard-content">{content}</div><div className="wizard-footer"><Button disabled={current===0} onClick={() => setCurrent((value) => value-1)}>上一步</Button>{current<5 ? <Button type="primary" disabled={(current===2&&!qualityPassed)||(current===3&&!securityPassed)} onClick={next}>下一步</Button> : <Button type="primary" onClick={listProduct}>上架产品</Button>}</div></>}</Drawer><Modal open={preview} width={720} title="数据资产门户产品预览" footer={<Button type="primary" onClick={() => setPreview(false)}>关闭预览</Button>} onCancel={() => setPreview(false)}>{product.name&&<PublishPreview asset={asset} product={product} permission={permission} />}</Modal></>
}

export default PublishWizard
