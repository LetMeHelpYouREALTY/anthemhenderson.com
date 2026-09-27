/**
 * Test: /api/leads/capture Route Handler
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from './route';

const originalEnv = process.env;

describe('POST /api/leads/capture', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env = {
      ...originalEnv,
      FOLLOW_UP_BOSS_API_KEY: 'test-fub-key',
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: undefined,
      TURNSTILE_SECRET_KEY: undefined,
    };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ id: 'evt-1' }), { status: 201 })
      )
    );
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.unstubAllGlobals();
  });

  it('returns 400 for empty JSON body', async () => {
    const request = new Request('http://localhost:3000/api/leads/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('required');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns 400 for missing name', async () => {
    const request = new Request('http://localhost:3000/api/leads/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john@example.com',
        phone: '7025551234',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

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
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('email');
  });

  it('returns 503 when FOLLOW_UP_BOSS_API_KEY is missing', async () => {
    delete process.env.FOLLOW_UP_BOSS_API_KEY;

    const request = new Request('http://localhost:3000/api/leads/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(503);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('posts a Follow Up Boss event with standard payload', async () => {
    const request = new Request('http://localhost:3000/api/leads/capture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        referer: 'https://www.anthemhenderson.com/contact',
      },
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '7025551234',
        message: 'Interested in buying',
        source: 'website-form',
        formType: 'contact',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      'https://api.followupboss.com/v1/events',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'X-System': 'anthemhenderson.com',
        }),
      })
    );

    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [
      string,
      { body: string },
    ];
    const body = JSON.parse(options.body);
    expect(body.source).toBe('anthemhenderson.com');
    expect(body.system).toBe('anthemhenderson.com');
    expect(body.type).toBe('General Inquiry');
    expect(body.person.emails).toEqual([{ value: 'john@example.com' }]);
    expect(body.person.phones).toEqual([{ value: '7025551234' }]);
    expect(body.person.tags).toContain('anthemhenderson.com');
  });

  it('maps home-valuation to Seller Inquiry', async () => {
    const request = new Request('http://localhost:3000/api/leads/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        formType: 'home-valuation',
      }),
    });

    await POST(request);

    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [
      string,
      { body: string },
    ];
    const body = JSON.parse(options.body);
    expect(body.type).toBe('Seller Inquiry');
  });

  it('returns 502 when Follow Up Boss responds with an error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('error', { status: 500 }))
    );

    const request = new Request('http://localhost:3000/api/leads/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(502);
  });

  it('returns success without calling FUB when honeypot is filled', async () => {
    const request = new Request('http://localhost:3000/api/leads/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Bot',
        lastName: 'Spam',
        email: 'spam@example.com',
        company: 'Acme Inc',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('sanitizes script tags in names', async () => {
    const request = new Request('http://localhost:3000/api/leads/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: '<script>alert("xss")</script>',
        lastName: 'Doe',
        email: 'test@example.com',
      }),
    });

    await POST(request);

    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [
      string,
      { body: string },
    ];
    const body = JSON.parse(options.body);
    expect(body.person.firstName).not.toContain('<script>');
  });
});
