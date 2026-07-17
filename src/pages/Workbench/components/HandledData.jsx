import { EyeOutlined } from '@ant-design/icons'
import { Card, Col, Progress, Row, Segmented, Statistic, Table, Tag, Typography } from 'antd'
import { useState } from 'react'
import TableIconButton from '../../../components/TableIconButton'

function HandledData({ assets, products, history, onViewAsset, onViewProduct, onViewApplication }) {
  const [type,setType] = useState('数据资产')
  const summary = [['负责资产',12],['参与治理',8],['上架产品',products.length],['已完成审批',34],['关联业务部门',7]]
  const viewColumn = (handler, label = '详情') => ({ title:'操作', width:54, render:(_,record)=><div className="table-icon-actions"><TableIconButton label={label} icon={<EyeOutlined />} onClick={()=>handler(record)} /></div> })
  const assetColumns = [['资产名称','name'],['资产编码','code'],['质量评分','qualityScore'],['健康度','health'],['安全等级','securityLevel'],['当前状态','status'],['我的职责','duty'],['最近更新','updatedAt']].map(([title,dataIndex]) => ({ title,dataIndex,render:dataIndex==='qualityScore'?(value)=><Progress percent={value} size="small"/>:dataIndex==='securityLevel'?(value)=><Tag>{value}</Tag>:undefined }))
  assetColumns.push(viewColumn(onViewAsset, '查看资产'))
  const productColumns = [['产品名称','name'],['产品编号','code'],['所属资产','assetName'],['上架时间','publishedAt'],['浏览量','views'],['收藏数','favorites'],['申请次数','applications'],['产品状态','status'],['我的职责','duty']].map(([title,dataIndex]) => ({ title,dataIndex }))
  productColumns.push(viewColumn(onViewProduct, '查看产品'))
  const historyColumns = [['申请编号','applicationId'],['数据产品','productName'],['申请人','applicant'],['审批结果','result'],['审批意见摘要','opinion'],['审批时间','time'],['授权期限','period']].map(([title,dataIndex]) => ({ title,dataIndex,render:dataIndex==='result'?(value)=><Tag color={value==='通过'?'success':'error'}>{value}</Tag>:undefined }))
  historyColumns.push(viewColumn(onViewApplication, '查看记录'))
  const config = type==='数据资产'?[assets,assetColumns,'id']:type==='数据产品'?[products,productColumns,'id']:[history,historyColumns,'id']
  return <><Row gutter={[12,12]}>{summary.map(([title,value]) => <Col flex="1 1 180px" key={title}><Card><Statistic title={title} value={value} /></Card></Col>)}</Row><Card className="personal-stats" title="个人工作统计（Demo 模拟统计）"><Row gutter={20}><Col span={4}><Statistic title="审批通过率" value={82} suffix="%" /></Col><Col span={4}><Statistic title="平均审批时长" value={4.6} suffix="小时" /></Col><Col span={8}><Typography.Text type="secondary">高频使用产品</Typography.Text><Typography.Paragraph strong>广东省输电线路路径 GIS 数据集</Typography.Paragraph></Col><Col span={8}><Typography.Text type="secondary">服务最多部门</Typography.Text><Typography.Paragraph strong>输电设计部</Typography.Paragraph></Col></Row></Card><div className="handled-switch"><Segmented value={type} options={['数据资产','数据产品','审批记录']} onChange={setType} /></div><Table rowKey={config[2]} size="middle" scroll={{x:1200}} dataSource={config[0]} columns={config[1]} pagination={{pageSize:6}} /></>
}

export default HandledData
