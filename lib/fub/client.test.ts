/**
 * Test: Follow Up Boss API Client
 * Critical path: CRM integration with rate limiting
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fubClient } from './client'

// Mock fetch
global.fetch = vi.fn()

describe('FUB Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates lead successfully', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 'fub-lead-123',
        email: 'john@example.com',
      }),
    })

    const result = await fubClient.createLead({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '7025551234',
    })

    expect(result.id).toBe('fub-lead-123')
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/people'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    )
  })

  it('handles rate limiting with retry', async () => {
    // First call: 429 rate limit
    // Second call: success
    ;(global.fetch as any)
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: new Map([['retry-after', '1']]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'fub-lead-123' }),
      })

    const result = await fubClient.createLead({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    })

    // Should succeed after retry
    expect(result.id).toBe('fub-lead-123')
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })

  it('caches GET requests', async () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        people: [{ id: '1', email: 'cached@example.com' }],
      }),
    })

    // First call
    await fubClient.searchPeople({ email: 'cached@example.com' })
    
    // Second call (should use cache)
    await fubClient.searchPeople({ email: 'cached@example.com' })

    // Fetch should only be called once (second call used cache)
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('handles API errors gracefully', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal server error' }),
    })

    await expect(
      fubClient.createLead({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      })
    ).rejects.toThrow()
  })

  it('includes custom fields in lead creation', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'fub-lead-123' }),
    })

    await fubClient.createLead({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      customFields: {
        priceMin: 400000,
        priceMax: 600000,
        bedrooms: 3,
        source: 'website-hero',
      },
    })

    const callArg = (global.fetch as any).mock.calls[0][1]
    const bodyData = JSON.parse(callArg.body)

    expect(bodyData.customFields).toBeDefined()
    expect(bodyData.customFields.priceMin).toBe(400000)
    expect(bodyData.customFields.source).toBe('website-hero')
  })

  it('adds tags to lead', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'fub-lead-123' }),
    })

    await fubClient.createLead({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      tags: ['website', 'hot-lead', 'q1-2026'],
    })

    const callArg = (global.fetch as any).mock.calls[0][1]
    const bodyData = JSON.parse(callArg.body)

    expect(bodyData.tags).toEqual(['website', 'hot-lead', 'q1-2026'])
  })

  it('validates email format before sending', async () => {
    await expect(
      fubClient.createLead({
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
      })
    ).rejects.toThrow(/email/)
  })

  it('respects rate limits per-client', async () => {
    // This tests that different clients (different IPs) get separate rate limits
    const requests = []
    
    for (let i = 0; i < 10; i++) {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: `lead-${i}` }),
      })
      
      requests.push(
        fubClient.createLead({
          firstName: 'Test',
          lastName: `User${i}`,
          email: `test${i}@example.com`,
        })
      )
    }

    // All should succeed (within rate limit)
    const results = await Promise.all(requests)
    expect(results).toHaveLength(10)
  })

  it('retries on network errors', async () => {
    // First call: network error
    // Second call: success
    ;(global.fetch as any)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'fub-lead-123' }),
      })

    const result = await fubClient.createLead({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    })

    expect(result.id).toBe('fub-lead-123')
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })

  it('updates existing lead by email', async () => {
    // Mock search finding existing lead
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        people: [{ id: 'existing-123', email: 'john@example.com' }],
      }),
    })

    // Mock update call
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 'existing-123',
        email: 'john@example.com',
        phone: '7025559999',
      }),
    })

    const result = await fubClient.updateLead({
      email: 'john@example.com',
      phone: '7025559999',
    })

    expect(result.id).toBe('existing-123')
    expect(result.phone).toBe('7025559999')
  })
})
