/**
 * Lead Capture API — Follow Up Boss events (anthemhenderson.com)
 */

import { NextRequest, NextResponse } from 'next/server';
import { leadFormLimiter, getClientId, checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

const SITE_SOURCE = 'anthemhenderson.com';

export interface LeadCaptureRequest {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;

  source?: string;
  stage?: string;
  tags?: string[];
  message?: string;
  formType?: 'contact' | 'property-search' | 'home-valuation' | 'newsletter' | string;
  formName?: string;
  sourceUrl?: string;

  propertyType?: string;
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  neighborhoods?: string[];

  timeline?: string;
  financing?: string;
  preApproved?: boolean;

  turnstileToken?: string;

  /** Honeypot — must stay empty */
  company?: string;
  website?: string;

  customFields?: Record<string, unknown>;
}

async function verifyTurnstileToken(token: string): Promise<boolean> {
  if (!process.env.TURNSTILE_SECRET_KEY) {
    console.warn('TURNSTILE_SECRET_KEY not configured - skipping verification');
    return true;
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
        }),
      }
    );

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

function sanitizeText(value: string): string {
  return value.replace(/<[^>]*>/g, '').trim();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function resolveName(data: LeadCaptureRequest): { firstName: string; lastName: string } {
  if (data.firstName || data.lastName) {
    return {
      firstName: sanitizeText(data.firstName || ''),
      lastName: sanitizeText(data.lastName || ''),
    };
  }
  const full = sanitizeText(data.name || '');
  const parts = full.split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { firstName: '', lastName: '' };
  }
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

function getFubEventType(data: LeadCaptureRequest): string {
  const formType = (data.formType || '').toLowerCase();
  if (formType === 'home-valuation') return 'Seller Inquiry';
  if (formType === 'newsletter') return 'Registration';
  if (formType === 'property-search') return 'Property Inquiry';

  const source = (data.source || '').toLowerCase();
  if (source.includes('seller') || source.includes('valuation')) return 'Seller Inquiry';
  if (source.includes('newsletter') || source.includes('registration')) return 'Registration';
  if (source.includes('listing') || source.includes('property')) return 'Property Inquiry';

  return 'General Inquiry';
}

function buildTrackingTags(request: NextRequest, data: LeadCaptureRequest): string[] {
  const tags: string[] = [];
  const url = new URL(request.url);

  const utmSource = url.searchParams.get('utm_source');
  const utmMedium = url.searchParams.get('utm_medium');
  const utmCampaign = url.searchParams.get('utm_campaign');

  if (utmSource) tags.push(`utm_source:${utmSource}`);
  if (utmMedium) tags.push(`utm_medium:${utmMedium}`);
  if (utmCampaign) tags.push(`utm_campaign:${utmCampaign}`);

  const referrer = request.headers.get('referer');
  if (referrer) {
    try {
      const refUrl = new URL(referrer);
      if (
        !refUrl.hostname.includes('anthemhenderson.com') &&
        !refUrl.hostname.includes('heyberkshire.com')
      ) {
        tags.push(`referrer:${refUrl.hostname}`);
      }
    } catch {
      // ignore invalid referrer
    }
  }

  if (data.tags?.length) {
    tags.push(...data.tags);
  }

  return tags;
}

function buildMessage(data: LeadCaptureRequest): string {
  const lines: string[] = [];
  if (data.message) {
    lines.push(sanitizeText(data.message));
  }

  const criteria: string[] = [];
  if (data.propertyType) criteria.push(`Type: ${data.propertyType}`);
  if (data.priceMin || data.priceMax) {
    const min = data.priceMin ? `$${data.priceMin.toLocaleString()}` : 'Any';
    const max = data.priceMax ? `$${data.priceMax.toLocaleString()}` : 'Any';
    criteria.push(`Price: ${min} - ${max}`);
  }
  if (data.bedrooms) criteria.push(`Bedrooms: ${data.bedrooms}+`);
  if (data.bathrooms) criteria.push(`Bathrooms: ${data.bathrooms}+`);
  if (data.neighborhoods?.length) {
    criteria.push(`Areas: ${data.neighborhoods.join(', ')}`);
  }
  if (data.timeline) criteria.push(`Timeline: ${data.timeline}`);
  if (data.financing) criteria.push(`Financing: ${data.financing}`);
  if (data.preApproved) criteria.push('Pre-approved: yes');

  if (criteria.length > 0) {
    lines.push(`Search criteria:\n${criteria.join('\n')}`);
  }

  return lines.join('\n\n').trim() || 'Website lead capture';
}

async function sendFollowUpBossEvent(
  payload: Record<string, unknown>
): Promise<Response> {
  const apiKey = process.env.FOLLOW_UP_BOSS_API_KEY;
  if (!apiKey) {
    console.error(
      '[Lead Capture] FOLLOW_UP_BOSS_API_KEY is not configured — cannot send to Follow Up Boss'
    );
    throw new Error('FUB_NOT_CONFIGURED');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
    'X-System': SITE_SOURCE,
  };

  const systemKey = process.env.FUB_SYSTEM_KEY;
  if (systemKey) {
    headers['X-System-Key'] = systemKey;
  }

  return fetch('https://api.followupboss.com/v1/events', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
}

export async function POST(request: NextRequest) {
  try {
    const data: LeadCaptureRequest = await request.json();

    const clientId = getClientId(request);
    const rateLimit = await checkRateLimit(leadFormLimiter, clientId);

    if (!rateLimit.success) {
      const resetDate = new Date(rateLimit.reset);
      const minutesUntilReset = Math.ceil((rateLimit.reset - Date.now()) / 60000);

      return NextResponse.json(
        {
          error: `Too many submissions. Please try again in ${minutesUntilReset} minute${minutesUntilReset > 1 ? 's' : ''}.`,
          retryAfter: resetDate.toISOString(),
        },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimit),
        }
      );
    }

    if ((data.company && data.company.trim()) || (data.website && data.website.trim())) {
      return NextResponse.json(
        { success: true },
        { headers: getRateLimitHeaders(rateLimit) }
      );
    }

    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY) {
      if (!data.turnstileToken) {
        return NextResponse.json(
          { error: 'CAPTCHA verification required' },
          { status: 400 }
        );
      }

      const isValid = await verifyTurnstileToken(data.turnstileToken);
      if (!isValid) {
        return NextResponse.json(
          { error: 'CAPTCHA verification failed. Please try again.' },
          { status: 403 }
        );
      }
    }

    if (!data.email && !data.phone) {
      return NextResponse.json(
        { error: 'Email or phone is required' },
        { status: 400 }
      );
    }

    if (data.email && !isValidEmail(data.email)) {
      return NextResponse.json(
        { error: 'A valid email address is required' },
        { status: 400 }
      );
    }

    const { firstName, lastName } = resolveName(data);
    if (!firstName && !lastName) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!process.env.FOLLOW_UP_BOSS_API_KEY) {
      console.error(
        '[Lead Capture] FOLLOW_UP_BOSS_API_KEY is not configured — cannot send to Follow Up Boss'
      );
      return NextResponse.json(
        { error: 'Lead capture is temporarily unavailable. Please call or text Dr. Jan Duffy.' },
        { status: 503, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    const formName = data.formName || data.source || 'lead-capture';
    const sourceUrl =
      data.sourceUrl ||
      request.headers.get('referer') ||
      SITE_SOURCE;

    const trackingTags = buildTrackingTags(request, data);
    const personTags = [
      SITE_SOURCE,
      formName,
      ...trackingTags,
      ...getPropertyTags(data),
      ...getSourceTagList(data.source),
    ].filter((t): t is string => Boolean(t));

    const eventPayload = {
      source: SITE_SOURCE,
      system: SITE_SOURCE,
      type: getFubEventType(data),
      message: buildMessage(data),
      description: `${formName} — ${sourceUrl}`,
      sourceUrl,
      person: {
        firstName,
        lastName,
        emails: data.email ? [{ value: data.email.trim() }] : [],
        phones: data.phone ? [{ value: data.phone.trim() }] : [],
        tags: personTags,
      },
    };

    let fubResponse: Response;
    try {
      fubResponse = await sendFollowUpBossEvent(eventPayload);
    } catch (error) {
      if (error instanceof Error && error.message === 'FUB_NOT_CONFIGURED') {
        return NextResponse.json(
          { error: 'Lead capture is temporarily unavailable. Please call or text Dr. Jan Duffy.' },
          { status: 503, headers: getRateLimitHeaders(rateLimit) }
        );
      }
      console.error('[Lead Capture] Follow Up Boss request failed:', error);
      return NextResponse.json(
        { error: 'Failed to send lead to Follow Up Boss' },
        { status: 502, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    if (!fubResponse.ok) {
      console.error(
        `[Lead Capture] Follow Up Boss API error: HTTP ${fubResponse.status}`
      );
      return NextResponse.json(
        { error: 'Failed to send lead to Follow Up Boss' },
        { status: 502, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Lead submitted successfully',
      },
      { headers: getRateLimitHeaders(rateLimit) }
    );
  } catch (error) {
    console.error('[Lead Capture] Error:', error);

    return NextResponse.json(
      { error: 'Failed to capture lead' },
      { status: 500 }
    );
  }
}

function getSourceTagList(source?: string): string[] {
  if (!source) return [];

  const lowerSource = source.toLowerCase();
  const tags: string[] = [];

  if (lowerSource.includes('facebook')) tags.push('facebook-lead');
  if (lowerSource.includes('google')) tags.push('google-lead');
  if (lowerSource.includes('zillow')) tags.push('zillow-lead');
  if (lowerSource.includes('realtor')) tags.push('realtor-lead');
  if (lowerSource.includes('instagram')) tags.push('instagram-lead');

  return tags;
}

function getPropertyTags(data: LeadCaptureRequest): string[] {
  const tags: string[] = [];

  if (data.neighborhoods) {
    tags.push(...data.neighborhoods);
  }

  if (data.priceMax) {
    if (data.priceMax > 1000000) {
      tags.push('luxury');
    } else if (data.priceMax < 300000) {
      tags.push('first-time-buyer');
    }
  }

  if (data.propertyType) {
    tags.push(data.propertyType.toLowerCase());
  }

  if (data.preApproved) {
    tags.push('pre-approved');
  }

  if (data.timeline) {
    const lowerTimeline = data.timeline.toLowerCase();
    if (lowerTimeline.includes('immediately') || lowerTimeline.includes('asap')) {
      tags.push('urgent');
    }
  }

  return tags;
}
