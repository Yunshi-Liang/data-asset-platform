const submittedAssets = new Map()
const assetStatusOverrides = new Map()

export function registerSubmittedAsset(asset) {
  submittedAssets.set(asset.id, asset)
  return asset
}

export function getSubmittedAssets() {
  return Array.from(submittedAssets.values())
}

export function setAssetStatusOverride(assetId, status) {
  assetStatusOverrides.set(assetId, status)
}

export function getAssetStatusOverrides() {
  return new Map(assetStatusOverrides)
}
