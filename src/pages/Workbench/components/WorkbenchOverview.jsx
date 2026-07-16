import { Avatar, Card, Col, Descriptions, Row, Statistic, Typography } from 'antd'
import { currentUser } from '../../../mock/workbench'
function WorkbenchOverview({favorites,applications,pendingApprovals,completedApprovals}){
 const stats=[['收藏数据产品',favorites],['进行中申请',applications],['待我审批',pendingApprovals],['本月完成审批',completedApprovals],['经手数据资产',12],['经手数据产品',5]]
 return <Row gutter={16}><Col flex="310px"><Card className="user-summary"><Avatar size={56}>管</Avatar><div><Typography.Title level={5}>{currentUser.name}</Typography.Title><Typography.Text type="secondary">{currentUser.department} · {currentUser.role}</Typography.Text></div><Descriptions size="small" column={1} items={[{key:1,label:'负责区域',children:currentUser.region},{key:2,label:'最近登录',children:currentUser.lastLogin}]}/></Card></Col><Col flex="auto"><Row gutter={[12,12]}>{stats.map(([title,value])=><Col span={8} key={title}><Card size="small"><Statistic title={title} value={value}/></Card></Col>)}</Row></Col></Row>
}
export default WorkbenchOverview
