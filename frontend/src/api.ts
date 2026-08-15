import type { Vendor, VendorCategory, VendorCreate } from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

async function parseError(response: Response): Promise<string> {
  try {
    const body = await response.json()
    if (typeof body.detail === 'string') return body.detail
    if (Array.isArray(body.detail) && body.detail[0]?.msg) return body.detail[0].msg
  } catch {
    // fall through to the generic message
  }
  return `Request failed with status ${response.status}`
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!response.ok) throw new Error(await parseError(response))
  return (await response.json()) as T
}

export function listVendors(category?: VendorCategory | ''): Promise<Vendor[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : ''
  return request<Vendor[]>(`/vendors${query}`)
}

export function createVendor(payload: VendorCreate): Promise<Vendor> {
  return request<Vendor>('/vendors', { method: 'POST', body: JSON.stringify(payload) })
}

export function approveVendor(id: number): Promise<Vendor> {
  return request<Vendor>(`/vendors/${id}/approve`, { method: 'POST' })
}
