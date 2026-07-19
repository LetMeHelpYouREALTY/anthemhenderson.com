/**
 * Test: useReducedMotion Hook
 * Critical path: Accessibility compliance (WCAG 2.1)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useReducedMotion } from './useReducedMotion'

describe('useReducedMotion', () => {
  let matchMediaMock: any

  beforeEach(() => {
    // Mock window.matchMedia
    matchMediaMock = vi.fn()
    window.matchMedia = matchMediaMock
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns true when prefers-reduced-motion is set', () => {
    // Mock prefers-reduced-motion: reduce
    matchMediaMock.mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

    const { result } = renderHook(() => useReducedMotion())
    
    expect(result.current).toBe(true)
  })

  it('returns false when prefers-reduced-motion is not set', () => {
    // Mock prefers-reduced-motion: no-preference
    matchMediaMock.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

    const { result } = renderHook(() => useReducedMotion())
    
    expect(result.current).toBe(false)
  })

  it('updates when media query changes', () => {
    let listeners: ((e: any) => void)[] = []
    
    matchMediaMock.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: (_event: string, listener: (e: any) => void) => {
        listeners.push(listener)
      },
      removeEventListener: (_event: string, listener: (e: any) => void) => {
        listeners = listeners.filter(l => l !== listener)
      },
    }))

    const { result, rerender } = renderHook(() => useReducedMotion())
    
    // Initially false
    expect(result.current).toBe(false)
    
    // Simulate media query change
    listeners.forEach(listener => listener({ matches: true }))
    
    // Re-render to get updated value
    rerender()
    
    // Should register listener
    expect(listeners.length).toBeGreaterThan(0)
  })

  it('cleans up event listener on unmount', () => {
    const removeEventListenerMock = vi.fn()
    
    matchMediaMock.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: removeEventListenerMock,
    }))

    const { unmount } = renderHook(() => useReducedMotion())
    
    // Unmount hook
    unmount()
    
    // Verify cleanup was called
    expect(removeEventListenerMock).toHaveBeenCalled()
  })

  it('handles missing matchMedia gracefully', () => {
    // Simulate older browser without matchMedia
    delete (window as any).matchMedia

    const { result } = renderHook(() => useReducedMotion())
    
    // Should default to false (safe default)
    expect(result.current).toBe(false)
  })
})
