import { useEffect, useState } from 'react'
import { Alert, App, Button, Card, Col, Descriptions, Divider, Drawer, Form, Input, List, Progress, Row, Select, Space, Statistic, Table, Tabs, Tag, Typography } from 'antd'
import { EditOutlined, RocketOutlined } from '@ant-design/icons'
import { canAssetAction, gisMetadata, qualityDimensions, qualityIssues, securityLevels } from '../../../mock/assetCatalog'

const scoreColor = (score) => score >= 90 ? '#1677ff' : score >= 80 ? '#faad14' : '#ff4d4f'

function BasicPanel({ asset, editing, onSave, onCancel, onDraftChange }) {
  const [form] = Form.useForm()
  useEffect(() => form.setFieldsValue(asset), [asset, form])
  if (editing) return <Form form={form} layout="vertical" onFinish={onSave} onValuesChange={(_, values)=>onDraftChange({...asset,...values})}><Row gutter={16}>
    <Col span={12}><Form.Item name="name" label="资产名称" rules={[{required:true}]}><Input /></Form.Item></Col>
    <Col span={12}><Form.Item name="department" label="责任部门"><Input /></Form.Item></Col>
    <Col span={12}><Form.Item name="owner" label="数据负责人"><Input /></Form.Item></Col>
    <Col span={12}><Form.Item name="frequency" label="更新频率"><Select options={['实时','每日','每周','每月','按项目'].map(v=>({label:v,value:v}))} /></Form.Item></Col>
    <Col span={24}><Form.Item name="description" label="资产描述"><Input.TextArea rows={3} /></Form.Item></Col>
    <Col span={24}><Form.Item name="scenarios" label="使用场景"><Input.TextArea rows={2} /></Form.Item></Col>
  </Row><Space><Button onClick={onCancel}>取消</Button><Button type="primary" htmlType="submit">保存详情</Button></Space></Form>
  const items = [
    ['资产名称',asset.name],['资产编码',asset.code],['业务名称',asset.name],['资产描述',asset.description],['所属业务领域',asset.domain],['所属目录路径',asset.catalogName],
    ['来源系统',asset.sourceSystem],['来源数据源',asset.source],['数据形态',asset.dataType],['数据格式',asset.dataType==='GIS 数据'?'GDB / SHP':'CSV / JSON'],['数据规模',asset.size],['记录数量',asset.records],
    ['字段数量',asset.fields],['所属地区',asset.region],['更新频率',asset.frequency],['创建时间',asset.createdAt],['最近更新时间',asset.updatedAt],['责任部门',asset.department],
    ['数据负责人',asset.owner],['联系方式',asset.contact],['生命周期阶段',asset.lifecycle],['使用场景',asset.scenarios],
  ]
  return <Descriptions bordered size="small" column={2} items={items.map(([label,children],i)=>({key:i,label,children,span:['资产描述','使用场景'].includes(label)?2:1}))} />
}

function MetadataPanel({ asset }) {
  const columns=[['字段名称','field'],['中文名称','name'],['字段类型','type'],['主键','primary'],['可为空','nullable'],['长度','length'],['示例值','sample'],['业务规则','rule'],['来源部门','source']].map(([title,dataIndex])=>({title,dataIndex,width:110}))
  return <><Typography.Title level={5}>技术与字段级业务元数据</Typography.Title><Descriptions size="small" column={3} items={[{key:1,label:'表名或文件名',children:asset.dataType==='GIS 数据'?'transmission_line.gdb':'asset_resource'},{key:2,label:'数据格式',children:asset.dataType},{key:3,label:'空间参考',children:asset.dataType==='GIS 数据'?'CGCS2000':'不适用'}]} /><Table rowKey="field" size="small" scroll={{x:1000}} pagination={false} columns={columns} dataSource={gisMetadata} /></>
}

function QualityPanel({ asset }) {
  return <><Row gutter={[16,16]}><Col span={5}><Card><Statistic title="综合质量评分" value={asset.qualityScore} suffix="分" valueStyle={{color:scoreColor(asset.qualityScore)}} /></Card></Col><Col span={19}><Row gutter={[12,12]}>{qualityDimensions.map((name,i)=><Col span={8} key={name}><div className="quality-item"><span>{name}</span><Progress percent={Math.max(70,asset.qualityScore-(i%3))} size="small" /></div></Col>)}</Row></Col></Row>
    <Descriptions className="profile-section" size="small" items={[{key:1,label:'最近质量检查',children:'2026-07-15 08:30'},{key:2,label:'未解决问题',children:`${asset.unresolvedIssues} 个`},{key:3,label:'趋势摘要',children:'近三次检查评分稳定提升'}]} />
    <Table rowKey="description" size="small" pagination={false} dataSource={asset.unresolvedIssues?qualityIssues:[]} locale={{emptyText:'当前没有未解决质量问题'}} columns={[['问题类型','type'],['影响字段','field'],['问题描述','description'],['严重程度','severity'],['影响记录数','count'],['处理状态','status']].map(([title,dataIndex])=>({title,dataIndex}))} /></>
}

function LineagePanel({ asset }) {
  const labels=['来源系统','接入任务','治理任务','当前数据资产','关联数据产品']
  const values=[asset.sourceSystem, `${asset.source}接入任务`, `${asset.name.replace('数据集','')}治理`, asset.name, asset.usage.products?`${asset.name}服务产品`:'暂未关联产品']
  const linked = values.map((_, index) => index < 4 || Boolean(asset.usage.products))
  return <><Alert showIcon type="info" message="资产血缘覆盖来源、接入、治理、资产和产品服务链路" /><div className="lineage-legend"><span><i className="linked" />已关联</span><span><i className="unlinked" />未关联</span></div><div className="lineage-flow">{values.map((name,index)=><div className={`lineage-node ${linked[index]?'is-linked':'is-unlinked'}`} key={labels[index]}><span className="lineage-node-type">{labels[index]}</span><strong>{name}</strong><small>{linked[index]?'已关联':'未关联'}</small></div>)}</div><List bordered dataSource={values} renderItem={(name,i)=><List.Item><List.Item.Meta title={`${labels[i]}：${name}`} description={`处理时间：${linked[i]?`2026-07-${11+i} 09:30`:'—'}　负责人：${i<2?'系统调度':asset.owner}　状态：${linked[i]?'已关联':'未关联'}`} /></List.Item>} /></>
}

function TagPanel({ asset, editing, onChange }) {
  const { message } = App.useApp()
  const [newTag,setNewTag]=useState('')
  const add=()=>{if(newTag&&!asset.tags.includes(newTag)){onChange({...asset,tags:[...asset.tags,newTag]});setNewTag('');message.success('标签已添加')}}
  return <Space orientation="vertical" size="large" style={{width:'100%'}}>
    <Descriptions bordered size="small" column={2} items={[{key:1,label:'一级业务域',children:asset.domain},{key:2,label:'目录分类',children:asset.catalogName},{key:3,label:'数据形态',children:asset.dataType},{key:4,label:'生命周期阶段',children:asset.lifecycle}]} />
    <div><Typography.Text strong>系统标签</Typography.Text><div className="tag-row"><Tag color="blue">{asset.domain}</Tag><Tag color="blue">{asset.dataType}</Tag><Tag color="blue">{asset.region}</Tag></div></div>
    <div><Typography.Text strong>人工标签</Typography.Text><div className="tag-row">{asset.tags.map(tag=><Tag key={tag} closable={editing} onClose={(e)=>{e.preventDefault();onChange({...asset,tags:asset.tags.filter(v=>v!==tag)})}}>{tag}</Tag>)}{editing&&<Space.Compact className="tag-add-control"><Input value={newTag} placeholder="输入新标签" onChange={e=>setNewTag(e.target.value)} onPressEnter={add}/><Button onClick={add}>添加</Button></Space.Compact>}</div></div>
    <div><Typography.Text strong>安全等级</Typography.Text><br/><Select disabled={!editing} style={{width:180,marginTop:8}} value={asset.securityLevel} options={securityLevels.map(v=>({label:v,value:v}))} onChange={securityLevel=>onChange({...asset,securityLevel})} />{asset.securityLevel==='核心数据'&&<Alert className="profile-section" type="error" showIcon message="核心数据不得直接面向门户公开上架，使用与流转需经过专项审批。" />}</div>
  </Space>
}

function ValuePanel({ asset }) {
  const healthItems=[['数据质量',asset.qualityScore],['更新及时性',asset.health],['元数据完整度',asset.metadataComplete?96:68],['血缘完整度',92],['安全合规度',95],['服务可用性',asset.status==='待启用'?45:94]]
  return <><Alert showIcon message="健康度与价值评分为基于质量、使用、更新和业务重要性等指标生成的模拟结果。" /><Row gutter={24} className="profile-section"><Col span={8}><Card className="score-card"><Progress type="dashboard" percent={asset.health} strokeColor={scoreColor(asset.health)} /><Typography.Title level={4}>资产健康度</Typography.Title></Card></Col><Col span={16}><Row gutter={[12,12]}>{healthItems.map(([name,value])=><Col span={12} key={name}><span>{name}</span><Progress percent={value} size="small" /></Col>)}</Row></Col></Row><Divider />
    <Row gutter={16}><Col span={6}><Statistic title="价值等级" value={asset.valueLevel} /></Col><Col span={6}><Statistic title="项目复用次数" value={asset.usage.applications} /></Col><Col span={6}><Statistic title="关联产品数" value={asset.usage.products} /></Col><Col span={6}><Statistic title="节约成本估算" value={128+asset.usage.products*46} suffix="万元" /></Col></Row></>
}

function UsagePanel({ asset }) {
  const stats=[['浏览次数',asset.usage.views],['收藏次数',asset.usage.favorites],['申请次数',asset.usage.applications],['下载次数',asset.usage.downloads],['API 调用次数',asset.usage.apiCalls],['关联产品',asset.usage.products]]
  return <><Row gutter={[12,12]}>{stats.map(([title,value])=><Col span={8} key={title}><Card><Statistic title={title} value={value} /></Card></Col>)}</Row><Descriptions className="profile-section" bordered size="small" items={[{key:1,label:'最近使用时间',children:'2026-07-15 10:26'},{key:2,label:'关联项目',children:'粤东500kV输变电工程等 18 个项目'},{key:3,label:'常用部门',children:'输电工程设计中心、勘测工程中心'}]} /><Typography.Title level={5}>最近访问记录</Typography.Title><List bordered dataSource={['广州设计一部 · 在线查看','输电工程中心 · 数据申请','勘测工程中心 · 文件下载']} renderItem={(item,i)=><List.Item extra={`2026-07-${15-i} 10:2${i}`}>{item}</List.Item>} /></>
}

function AssetProfileDrawer({ open, asset, onClose, onUpdate, onMove, onPublish, onToggle, onCancelPublish, onRollback }) {
  const { message } = App.useApp()
  const [editing,setEditing]=useState(false)
  const [editAsset,setEditAsset]=useState(null)
  useEffect(()=>{setEditing(false);setEditAsset(asset)},[asset])
  if(!asset) return null
  const viewAsset=editing&&editAsset?editAsset:asset
  const summary=[['质量评分',viewAsset.qualityScore],['健康度',viewAsset.health],['价值等级',viewAsset.valueLevel],['使用次数',viewAsset.usage.views],['关联产品',viewAsset.usage.products],['未解决问题',viewAsset.unresolvedIssues]]
  const tabs=[
    {key:'basic',label:'基本信息',children:<BasicPanel asset={viewAsset} editing={editing} onDraftChange={setEditAsset} onCancel={()=>{setEditAsset(asset);setEditing(false)}} onSave={(values)=>{onUpdate({...viewAsset,...values});setEditing(false);message.success('资产详情已更新')}} />},
    {key:'metadata',label:'元数据',children:<MetadataPanel asset={viewAsset} />},{key:'quality',label:'数据质量',children:<QualityPanel asset={viewAsset} />},
    {key:'lineage',label:'数据血缘',children:<LineagePanel asset={viewAsset} />},{key:'tags',label:'分类标签',children:<TagPanel asset={viewAsset} editing={editing} onChange={setEditAsset} />},
    {key:'value',label:'价值与健康度',children:<ValuePanel asset={viewAsset} />},{key:'usage',label:'使用与运营',children:<UsagePanel asset={viewAsset} />},
  ]
  const closeDrawer=()=>{setEditing(false);onClose()}
  return <Drawer open={open} onClose={closeDrawer} width="min(1120px, 94vw)" title="数据资产详情" extra={<Space>{editing&&<><Button onClick={()=>{setEditAsset(asset);setEditing(false)}}>取消编辑</Button><Button type="primary" onClick={()=>{onUpdate(editAsset);setEditing(false);message.success('资产详情已更新')}}>保存修改</Button></>}{canAssetAction(asset.status,'edit')&&!editing&&<Button icon={<EditOutlined />} onClick={()=>{setEditAsset(asset);setEditing(true)}}>编辑</Button>}{canAssetAction(asset.status,'edit')&&!editing&&<Button onClick={()=>onMove(asset)}>调整目录</Button>}{canAssetAction(asset.status,'enable')&&!editing&&<Button onClick={()=>onToggle(asset)}>启用</Button>}{canAssetAction(asset.status,'disable')&&<Button danger onClick={()=>onToggle(asset)}>停用</Button>}{canAssetAction(asset.status,'publish')&&<Button type="primary" icon={<RocketOutlined />} onClick={()=>onPublish(asset)}>申请上架</Button>}{canAssetAction(asset.status,'cancelPublish')&&<Button danger onClick={()=>onCancelPublish(asset)}>取消申请</Button>}{canAssetAction(asset.status,'rollback')&&<Button danger onClick={()=>onRollback(asset)}>退回</Button>}</Space>}>
    <div className="profile-heading"><div><Space wrap><Typography.Title level={4}>{viewAsset.name}</Typography.Title><Tag color="blue">{viewAsset.status}</Tag><Tag color={viewAsset.securityLevel==='核心数据'?'red':'orange'}>{viewAsset.securityLevel}</Tag></Space><Typography.Text type="secondary">{viewAsset.code}　·　{viewAsset.catalogName}　·　{viewAsset.region}　·　负责人 {viewAsset.owner}</Typography.Text><div className="tag-row">{viewAsset.tags.map(tag=><Tag key={tag}>{tag}</Tag>)}</div></div></div>
    <Row gutter={12} className="profile-summary">{summary.map(([title,value])=><Col span={4} key={title}><Card size="small"><Statistic title={title} value={value} suffix={['质量评分','健康度'].includes(title)?'分':''} /></Card></Col>)}</Row>
    <Tabs items={tabs} destroyOnHidden={false} />
  </Drawer>
}
export default AssetProfileDrawer
