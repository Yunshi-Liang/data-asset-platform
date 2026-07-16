import { useMemo, useRef, useState } from 'react'
import { Empty, Typography, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { portalProducts } from '../../mock/portalData'
import { createApplicationRecord } from '../../mock/application'
import { addSessionApplication } from '../../utils/applicationSession'
import CategoryNavigation from './components/CategoryNavigation'
import DataApplicationModal from './components/DataApplicationModal'
import DataProductCard from './components/DataProductCard'
import PortalFilters from './components/PortalFilters'
import PortalHeader from './components/PortalHeader'
import ProductDetailDrawer from './components/ProductDetailDrawer'
import './portal.css'

const { Text } = Typography

const initialFilters = {
  category: 'all',
  dataType: 'all',
  securityLevel: 'all',
  region: 'all',
  sortBy: 'recommended',
}

const buildSearchText = (product) =>
  [
    product.name,
    product.category,
    product.dataType,
    product.province,
    product.city,
    product.description,
    product.source,
    ...product.tags,
    ...product.scenarios,
  ]
    .join(' ')
    .toLocaleLowerCase('zh-CN')

function DataPortal() {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const [searchValue, setSearchValue] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [favoriteIds, setFavoriteIds] = useState(() => new Set())
  const [applicationsByProduct, setApplicationsByProduct] = useState(() => new Map())
  const [applicationIncrements, setApplicationIncrements] = useState({})
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [applicationProductId, setApplicationProductId] = useState(null)
  const applicationSequence = useRef(901)

  const productsWithStatus = useMemo(
    () =>
      portalProducts.map((product) => ({
        ...product,
        applications: product.applications + (applicationIncrements[product.id] || 0),
      })),
    [applicationIncrements],
  )

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLocaleLowerCase('zh-CN')
    const result = productsWithStatus.filter((product) => {
      const matchesKeyword = !keyword || buildSearchText(product).includes(keyword)
      const matchesCategory =
        filters.category === 'all' || product.category === filters.category
      const matchesDataType =
        filters.dataType === 'all' || product.dataType === filters.dataType
      const matchesSecurity =
        filters.securityLevel === 'all' || product.securityLevel === filters.securityLevel
      const matchesRegion =
        filters.region === 'all' ||
        product.province === filters.region ||
        product.city === filters.region

      return (
        matchesKeyword &&
        matchesCategory &&
        matchesDataType &&
        matchesSecurity &&
        matchesRegion
      )
    })

    return result.toSorted((first, second) => {
      if (filters.sortBy === 'latest') {
        return second.publishedAt.localeCompare(first.publishedAt)
      }
      if (filters.sortBy === 'applications') {
        return second.applications - first.applications
      }
      if (filters.sortBy === 'quality') {
        return second.qualityScore - first.qualityScore
      }

      return Number(second.featured) - Number(first.featured) || second.views - first.views
    })
  }, [filters, productsWithStatus, searchTerm])

  const productCounts = useMemo(
    () =>
      portalProducts.reduce(
        (counts, product) => ({
          ...counts,
          [product.category]: (counts[product.category] || 0) + 1,
        }),
        {},
      ),
    [],
  )

  const selectedProduct = productsWithStatus.find(
    (product) => product.id === selectedProductId,
  )
  const applicationProduct = productsWithStatus.find(
    (product) => product.id === applicationProductId,
  )

  const handleSearch = () => setSearchTerm(searchValue)

  const handleReset = () => {
    setSearchValue('')
    setSearchTerm('')
    setFilters(initialFilters)
  }

  const handleCategoryChange = (category) => {
    setFilters((current) => ({
      ...current,
      category: current.category === category ? 'all' : category,
    }))
  }

  const handleFavorite = (product) => {
    const willFavorite = !favoriteIds.has(product.id)
    setFavoriteIds((current) => {
      const next = new Set(current)
      if (willFavorite) next.add(product.id)
      else next.delete(product.id)
      return next
    })
    messageApi.success(willFavorite ? '已收藏该数据产品' : '已取消收藏')
  }

  const viewApplication = (product) => {
    const application = applicationsByProduct.get(product.id)
    if (!application) return
    navigate(`/workbench?tab=applications&applicationId=${application.id}&productCode=${product.code}`)
  }

  const openApplication = (product) => {
    if (applicationsByProduct.has(product.id)) {
      viewApplication(product)
      return
    }
    setApplicationProductId(product.id)
  }

  const handleApplicationSubmit = (product, values) => {
    const applicationNumber = `DA-202607-${String(applicationSequence.current).padStart(3, '0')}`
    applicationSequence.current += 1
    const application = createApplicationRecord({
      id: applicationNumber,
      product,
      values,
      submittedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
    })
    setApplicationsByProduct((current) => new Map(current).set(product.id, application))
    addSessionApplication(application)
    setApplicationIncrements((current) => ({
      ...current,
      [product.id]: (current[product.id] || 0) + 1,
    }))
    setApplicationProductId(null)
    messageApi.success(`数据使用申请已提交，申请编号：${applicationNumber}。`, 5)
  }

  return (
    <div className="data-portal-page">
      {contextHolder}
      <PortalHeader
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        onSearch={handleSearch}
        onReset={handleReset}
      />
      <CategoryNavigation
        value={filters.category}
        productCounts={productCounts}
        onChange={handleCategoryChange}
      />
      <PortalFilters filters={filters} onChange={setFilters} />

      <section className="product-results" aria-live="polite">
        <div className="product-results-header">
          <Text strong>数据产品</Text>
          <Text type="secondary">
            共找到 <span>{filteredProducts.length}</span> 个符合条件的产品
          </Text>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="product-card-grid">
            {filteredProducts.map((product) => (
              <DataProductCard
                key={product.id}
                product={product}
                favorite={favoriteIds.has(product.id)}
                applied={applicationsByProduct.has(product.id)}
                onFavorite={handleFavorite}
                onViewDetail={(item) => setSelectedProductId(item.id)}
                onApply={openApplication}
                onViewApplication={viewApplication}
              />
            ))}
          </div>
        ) : (
          <div className="portal-empty">
            <Empty description="暂无符合当前搜索和筛选条件的数据产品" />
          </div>
        )}
      </section>

      <ProductDetailDrawer
        product={selectedProduct}
        open={Boolean(selectedProduct)}
        favorite={selectedProduct ? favoriteIds.has(selectedProduct.id) : false}
        applied={selectedProduct ? applicationsByProduct.has(selectedProduct.id) : false}
        onClose={() => setSelectedProductId(null)}
        onFavorite={handleFavorite}
        onApply={openApplication}
        onViewApplication={viewApplication}
      />
      <DataApplicationModal
        product={applicationProduct}
        open={Boolean(applicationProduct)}
        onCancel={() => setApplicationProductId(null)}
        onSubmit={handleApplicationSubmit}
      />
    </div>
  )
}

export default DataPortal
