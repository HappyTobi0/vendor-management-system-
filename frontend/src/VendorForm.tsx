import { useState } from 'react'
import { VENDOR_CATEGORIES } from './types'
import type { VendorCategory, VendorCreate } from './types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface Props {
  onSubmit: (payload: VendorCreate) => Promise<void>
}

interface FieldErrors {
  name?: string
  category?: string
  contact_email?: string
}

export function VendorForm({ onSubmit }: Props) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<VendorCategory | ''>('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  function validate(): FieldErrors {
    const next: FieldErrors = {}
    if (!name.trim()) next.name = 'Name is required'
    if (!category) next.category = 'Category is required'
    if (!email.trim()) next.contact_email = 'Email is required'
    else if (!EMAIL_PATTERN.test(email.trim())) next.contact_email = 'Enter a valid email address'
    return next
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      await onSubmit({
        name: name.trim(),
        category: category as VendorCategory,
        contact_email: email.trim(),
      })
      setName('')
      setCategory('')
      setEmail('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2>Register a vendor</h2>

      <label htmlFor="name">Vendor name</label>
      <input
        id="name"
        value={name}
        placeholder="Acme Staffing"
        onChange={(event) => setName(event.target.value)}
        aria-invalid={Boolean(errors.name)}
      />
      {errors.name && <p className="error">{errors.name}</p>}

      <label htmlFor="category">Category</label>
      <select
        id="category"
        value={category}
        onChange={(event) => setCategory(event.target.value as VendorCategory | '')}
        aria-invalid={Boolean(errors.category)}
      >
        <option value="">Select a category</option>
        {VENDOR_CATEGORIES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errors.category && <p className="error">{errors.category}</p>}

      <label htmlFor="email">Contact email</label>
      <input
        id="email"
        value={email}
        placeholder="contact@acme.com"
        onChange={(event) => setEmail(event.target.value)}
        aria-invalid={Boolean(errors.contact_email)}
      />
      {errors.contact_email && <p className="error">{errors.contact_email}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Registering…' : 'Register vendor'}
      </button>
    </form>
  )
}
