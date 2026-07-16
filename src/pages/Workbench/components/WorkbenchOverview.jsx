import { Avatar, Card, Col, Descriptions, Row, Space, Statistic, Tag, Typography } from 'antd'
import { currentUser } from '../../../mock/currentUser'
function WorkbenchOverview({favorites,applications,pendingApprovals,completedApprovals,handledProductCount}){
 const stats=[['收藏数据产品',favorites],['进行中申请',applications],['待我审批',pendingApprovals],['本月完成审批',completedApprovals],['经手数据资产',12],['经手数据产品',handledProductCount]]
 return <Row gutter={16}><Col flex="330px"><Card className="user-summary"><Avatar size={56}>{currentUser.name.slice(0,1)}</Avatar><div><Typography.Title level={5}>{currentUser.name}</Typography.Title><Typography.Text type="secondary">{currentUser.department} · {currentUser.role}</Typography.Text></div><Descriptions size="small" column={1} items={[{key:1,label:'负责地区',children:currentUser.region},{key:2,label:'最近登录',children:currentUser.lastLogin}]}/><div className="user-permissions"><Typography.Text type="secondary">页面权限</Typography.Text><Space size={[6,8]} wrap>{currentUser.permissions.map((permission)=><Tag color="blue" key={permission}>{permission}</Tag>)}</Space></div></Card></Col><Col flex="auto"><Row gutter={[12,12]}>{stats.map(([title,value])=><Col span={8} key={title}><Card size="small"><Statistic title={title} value={value}/></Card></Col>)}</Row></Col></Row>
}
export default WorkbenchOverview
