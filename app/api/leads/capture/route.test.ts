/**
 * Test: /api/leads/capture Route Handler
 * Critical path: Lead generation API endpoint
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from './route'

// Mock FUB client
vi.mock('@/lib/fub/client', () => ({
  fubClient: {
    createLead: vi.fn(),
  },
}))

describe('POST /api/leads/capture', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates lead with valid data', async () => {
    const { fubClient } = await import('@/lib/fub/client')
    
    // Mock successful lead creation
    ;(fubClient.createLead as any).mockResolvedValueOnce({
      id: 'lead-123',
      email: 'john@example.com',
    })

    const request = new Request('http://localhost:3000/api/leads/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '7025551234',
        message: 'Interested in buying',
        source: 'website-form',
        stage: 'New Lead',
        tags: ['website'],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.leadId).toBe('lead-123')
    expect(fubClient.createLead).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      })
    )
  })

  it('returns 400 for missing required fields', async () => {
    const request = new Request('http://localhost:3000/api/leads/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Missing firstName, lastName, email
        phone: '7025551234',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('required')
  })

  it('returns 400 for invalid email', async () => {
    const request = new Request('http://localhost:3000/api/leads/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: 'not-an-email',
        phone: '7025551234',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('email')
  })

  it('handles FUB API errors gracefully', async () => {
    const { fubClient } = await import('@/lib/fub/client')
    
    // Mock FUB API failure
    ;(fubClient.createLead as any).mockRejectedValueOnce(
      new Error('FUB API unavailable')
    )

    const request = new Request('http://localhost:3000/api/leads/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBeDefined()
  })

  it('enriches lead with source and tags', async () => {
    const { fubClient } = await import('@/lib/fub/client')
    
    ;(fubClient.createLead as any).mockResolvedValueOnce({
      id: 'lead-123',
    })

    const request = new Request('http://localhost:3000/api/leads/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        source: 'hero-section',
        stage: 'Hot Lead',
        tags: ['website', 'hero-cta', 'q1-2026'],
      }),
    })

    await POST(request)

    expect(fubClient.createLead).toHaveBeenCalledWith(
      expect.objectContaining({
        source: 'hero-section',
        stage: 'Hot Lead',
        tags: expect.arrayContaining(['website', 'hero-cta', 'q1-2026']),
      })
    )
  })

  it('handles property search criteria', async () => {
    const { fubClient } = await import('@/lib/fub/client')
    
    ;(fubClient.createLead as any).mockResolvedValueOnce({
      id: 'lead-123',
    })

    const request = new Request('http://localhost:3000/api/leads/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Buyer',
        lastName: 'Jones',
        email: 'buyer@example.com',
        priceMin: 400000,
        priceMax: 600000,
        bedrooms: 3,
        bathrooms: 2.5,
        timeline: '1-3 months',
        preApproved: true,
      }),
    })

    await POST(request)

    expect(fubClient.createLead).toHaveBeenCalledWith(
      expect.objectContaining({
        customFields: expect.objectContaining({
          priceMin: 400000,
          priceMax: 600000,
          bedrooms: 3,
          bathrooms: 2.5,
          timeline: '1-3 months',
          preApproved: true,
        }),
      })
    )
  })

  it('sanitizes input data', async () => {
    const { fubClient } = await import('@/lib/fub/client')
    
    ;(fubClient.createLead as any).mockResolvedValueOnce({
      id: 'lead-123',
    })

    const request = new Request('http://localhost:3000/api/leads/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: '<script>alert("xss")</script>',
        lastName: 'Doe',
        email: 'test@example.com',
      }),
    })

    await POST(request)

    // Verify XSS attempt was sanitized
    const callArg = (fubClient.createLead as any).mock.calls[0][0]
    expect(callArg.firstName).not.toContain('<script>')
  })
})
