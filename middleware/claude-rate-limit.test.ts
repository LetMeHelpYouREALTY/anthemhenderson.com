/**
 * Test: Claude API Rate Limiting Middleware
 * Critical path: AI API cost control and rate limiting
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { claudeRateLimiter } from './claude-rate-limit'

describe('Claude Rate Limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset rate limiter between tests
    claudeRateLimiter.reset()
  })

  it('allows requests within rate limit', async () => {
    const clientId = 'client-1'
    
    // Should allow first request
    const result1 = await claudeRateLimiter.check(clientId)
    expect(result1.allowed).toBe(true)
    expect(result1.remaining).toBeGreaterThan(0)
    
    // Should allow second request
    const result2 = await claudeRateLimiter.check(clientId)
    expect(result2.allowed).toBe(true)
    expect(result2.remaining).toBeLessThan(result1.remaining)
  })

  it('blocks requests exceeding rate limit', async () => {
    const clientId = 'client-excessive'
    
    // Make requests up to limit
    for (let i = 0; i < 10; i++) {
      const result = await claudeRateLimiter.check(clientId)
      if (i < 9) {
        expect(result.allowed).toBe(true)
      }
    }
    
    // 11th request should be blocked
    const blocked = await claudeRateLimiter.check(clientId)
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfter).toBeGreaterThan(0)
  })

  it('uses token bucket algorithm', async () => {
    const clientId = 'client-bucket'
    
    // Consume tokens rapidly
    const result1 = await claudeRateLimiter.check(clientId)
    const result2 = await claudeRateLimiter.check(clientId)
    
    expect(result1.remaining).toBeGreaterThan(result2.remaining)
    expect(result2.tokensConsumed).toBeGreaterThan(result1.tokensConsumed)
  })

  it('tracks different clients separately', async () => {
    const client1 = 'client-1'
    const client2 = 'client-2'
    
    // Exhaust client1's limit
    for (let i = 0; i < 10; i++) {
      await claudeRateLimiter.check(client1)
    }
    
    // Client1 should be blocked
    const blocked = await claudeRateLimiter.check(client1)
    expect(blocked.allowed).toBe(false)
    
    // Client2 should still be allowed
    const allowed = await claudeRateLimiter.check(client2)
    expect(allowed.allowed).toBe(true)
  })

  it('resets tokens after time window', async () => {
    const clientId = 'client-reset'
    
    // Consume all tokens
    for (let i = 0; i < 10; i++) {
      await claudeRateLimiter.check(clientId)
    }
    
    // Should be blocked
    const blocked = await claudeRateLimiter.check(clientId)
    expect(blocked.allowed).toBe(false)
    
    // Mock time passing (61 seconds)
    vi.useFakeTimers()
    vi.advanceTimersByTime(61000)
    
    // Should be allowed again
    const allowed = await claudeRateLimiter.check(clientId)
    expect(allowed.allowed).toBe(true)
    
    vi.useRealTimers()
  })

  it('provides retry-after time when blocked', async () => {
    const clientId = 'client-retry'
    
    // Exhaust limit
    for (let i = 0; i < 10; i++) {
      await claudeRateLimiter.check(clientId)
    }
    
    const blocked = await claudeRateLimiter.check(clientId)
    
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfter).toBeDefined()
    expect(blocked.retryAfter).toBeGreaterThan(0)
    expect(blocked.retryAfter).toBeLessThanOrEqual(60) // Max 60 seconds
  })

  it('handles concurrent requests correctly', async () => {
    const clientId = 'client-concurrent'
    
    // Make 5 concurrent requests
    const promises = Array.from({ length: 5 }, () =>
      claudeRateLimiter.check(clientId)
    )
    
    const results = await Promise.all(promises)
    
    // All should be allowed (within limit)
    results.forEach(result => {
      expect(result.allowed).toBe(true)
    })
    
    // Remaining should decrease correctly
    const remaining = results.map(r => r.remaining)
    expect(remaining[0]).toBeGreaterThan(remaining[4])
  })

  it('supports custom rate limits per endpoint', async () => {
    const clientId = 'client-custom'
    
    // Chat endpoint: 10/min
    const chatResult = await claudeRateLimiter.check(clientId, {
      endpoint: 'chat',
      limit: 10,
      window: 60,
    })
    
    // Completion endpoint: 100/min
    const completionResult = await claudeRateLimiter.check(clientId, {
      endpoint: 'completion',
      limit: 100,
      window: 60,
    })
    
    expect(chatResult.limit).toBe(10)
    expect(completionResult.limit).toBe(100)
  })

  it('tracks token consumption for cost monitoring', async () => {
    const clientId = 'client-tokens'
    
    const result1 = await claudeRateLimiter.check(clientId)
    const result2 = await claudeRateLimiter.check(clientId)
    
    expect(result1.tokensConsumed).toBe(1)
    expect(result2.tokensConsumed).toBe(2)
  })

  it('returns metadata for monitoring', async () => {
    const clientId = 'client-metadata'
    
    const result = await claudeRateLimiter.check(clientId)
    
    expect(result).toHaveProperty('allowed')
    expect(result).toHaveProperty('remaining')
    expect(result).toHaveProperty('limit')
    expect(result).toHaveProperty('reset')
    expect(result).toHaveProperty('tokensConsumed')
  })

  it('supports manual token refund for failed requests', async () => {
    const clientId = 'client-refund'
    
    // Consume token
    const result1 = await claudeRateLimiter.check(clientId)
    expect(result1.remaining).toBe(9) // Assuming limit of 10
    
    // Refund token (API call failed)
    await claudeRateLimiter.refund(clientId, 1)
    
    // Check again - should have refunded token
    const result2 = await claudeRateLimiter.check(clientId)
    expect(result2.remaining).toBe(9) // Back to 9
  })

  it('handles invalid client IDs', async () => {
    await expect(claudeRateLimiter.check('')).rejects.toThrow()
    await expect(claudeRateLimiter.check(null as any)).rejects.toThrow()
  })

  it('integrates with cost tracking', async () => {
    const clientId = 'client-cost'
    
    const result = await claudeRateLimiter.check(clientId, {
      trackCost: true,
      modelCost: 0.003, // $0.003 per request
    })
    
    expect(result.costTracking).toBeDefined()
    expect(result.costTracking.estimatedCost).toBe(0.003)
  })
})
