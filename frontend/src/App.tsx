import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { approveVendor, createVendor, listVendors } from './api'
import { VendorForm } from './VendorForm'
import { VendorTable } from './VendorTable'
import { VENDOR_CATEGORIES } from './types'
import type { Vendor, VendorCategory, VendorCreate } from './types'

export default function App() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [categoryFilter, setCategoryFilter] = useState<VendorCategory | ''>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [approvingId, setApprovingId] = useState<number | null>(null)

  const refresh = useCallback(async (category: VendorCategory | '') => {
    setLoading(true)
    try {
      setVendors(await listVendors(category))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vendors')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh(categoryFilter)
  }, [categoryFilter, refresh])

  async function handleCreate(payload: VendorCreate) {
    try {
      await createVendor(payload)
      setError(null)
      await refresh(categoryFilter)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register vendor')
    }
  }

  async function handleApprove(id: number) {
    setApprovingId(id)
    try {
      await approveVendor(id)
      setError(null)
      await refresh(categoryFilter)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve vendor')
    } finally {
      setApprovingId(null)
    }
  }

  return (
    <div className="page">
      <header>
        <h1>Vendor Management</h1>
        <p className="muted">Register hiring vendors and track their approval status.</p>
      </header>

      {error && <p className="banner error">{error}</p>}

      <div className="layout">
        <VendorForm onSubmit={handleCreate} />

        <section className="card">
          <div className="section-header">
            <h2>Vendors ({vendors.length})</h2>
            <label htmlFor="category-filter" className="filter">
              Filter by category
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value as VendorCategory | '')}
              >
                <option value="">All categories</option>
                {VENDOR_CATEGORIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <VendorTable
            vendors={vendors}
            loading={loading}
            onApprove={handleApprove}
            approvingId={approvingId}
          />
        </section>
      </div>
    </div>
  )
}
