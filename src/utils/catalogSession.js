const submittedAssets = new Map()
const assetStatusOverrides = new Map()
const returnedAssetIds = new Set()
const governanceTaskOverrides = new Map()

export function registerSubmittedAsset(asset) {
  submittedAssets.set(asset.id, asset)
  return asset
}

export function getSubmittedAssets() {
  return Array.from(submittedAssets.values()).filter((asset) => !returnedAssetIds.has(asset.id))
}

export function setAssetStatusOverride(assetId, status) {
  assetStatusOverrides.set(assetId, status)
}

export function getAssetStatusOverrides() {
  return new Map(assetStatusOverrides)
}

export function markAssetReturned(assetId, governanceTaskId) {
  returnedAssetIds.add(assetId)
  if (governanceTaskId) governanceTaskOverrides.set(governanceTaskId, { status: 'failed', catalogSubmission: 'returned', assetCode: '' })
}

export function getReturnedAssetIds() {
  return new Set(returnedAssetIds)
}

export function getGovernanceTaskOverrides() {
  return new Map(governanceTaskOverrides)
}
