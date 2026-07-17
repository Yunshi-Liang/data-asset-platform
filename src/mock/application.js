import { currentUser } from './currentUser'

export const applicationMethods = ['文件下载', '在线查看', 'API 调用', '数据推送']
export const usagePeriods = ['1 个月', '3 个月', '6 个月', '12 个月']

export const applicationStepState = {
  completed: { label: '已完成', color: 'blue', stepStatus: 'finish' },
  rejected: { label: '已驳回', color: 'error', stepStatus: 'error' },
  pending: { label: '未完成', color: 'default', stepStatus: 'wait' },
}

export function getApplicationDefaults(product) {
  return {
    applicant: currentUser.name,
    department: currentUser.department,
    productName: product?.name || product?.productName || '',
    confidentiality: false,
  }
}

export function createApplicationRecord({ id, product, values, submittedAt }) {
  return {
    id,
    productName: values.productName,
    productCode: product?.code || product?.productCode || 'DP-MOCK',
    method: values.method,
    project: values.project,
    purpose: values.purpose,
    scope: values.scope,
    submittedAt,
    period: values.period,
    node: '部门负责人审批',
    status: '审批中',
    applicant: currentUser.name,
    department: currentUser.department,
    confidentiality: '已承诺',
  }
}
