import { Button, Tooltip } from 'antd'

function TableIconButton({ label, disabledReason, icon, danger = false, loading = false, onClick, className = '' }) {
  const disabled = Boolean(disabledReason)
  return (
    <Tooltip title={disabledReason || label}>
      <span className="table-icon-button-wrap">
        <Button type="text" size="small" className={`table-icon-button ${className}`} aria-label={label} danger={danger} disabled={disabled} loading={loading} icon={icon} onClick={disabled ? undefined : onClick} />
      </span>
    </Tooltip>
  )
}

export default TableIconButton
