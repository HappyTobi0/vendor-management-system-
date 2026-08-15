import type { Vendor } from './types'

interface Props {
  vendors: Vendor[]
  loading: boolean
  onApprove: (id: number) => void
  approvingId: number | null
}

export function VendorTable({ vendors, loading, onApprove, approvingId }: Props) {
  if (loading) return <p className="muted">Loading vendors…</p>
  if (vendors.length === 0) return <p className="muted">No vendors yet.</p>

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Contact email</th>
          <th>Status</th>
          <th aria-label="Actions" />
        </tr>
      </thead>
      <tbody>
        {vendors.map((vendor) => (
          <tr key={vendor.id}>
            <td>{vendor.name}</td>
            <td>{vendor.category}</td>
            <td>{vendor.contact_email}</td>
            <td>
              <span className={vendor.status === 'Approved' ? 'badge approved' : 'badge pending'}>
                {vendor.status}
              </span>
            </td>
            <td>
              {vendor.status === 'Approved' ? (
                <span className="muted">—</span>
              ) : (
                <button
                  type="button"
                  className="secondary"
                  onClick={() => onApprove(vendor.id)}
                  disabled={approvingId === vendor.id}
                >
                  Approve
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
