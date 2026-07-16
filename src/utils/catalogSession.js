const submittedAssets = new Map()

export function registerSubmittedAsset(asset) {
  submittedAssets.set(asset.id, asset)
  return asset
}

export function getSubmittedAssets() {
  return Array.from(submittedAssets.values())
}
