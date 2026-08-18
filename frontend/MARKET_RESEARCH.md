# Astral — Market Research

> **Source note:** the figures in this document were supplied directly by the
> Astral product team as inputs to strategy discussions. They have **not**
> been independently re-verified against primary sources (app store
> analytics providers, published market reports) as part of writing this
> doc. Treat ranges as directional, cite the original report before using
> any single number externally, and re-check before it's used in a pitch
> deck or public statement.

## Market size

| Scope | 2025 | 2026 (est.) | 2032–2035 (forecast) | CAGR |
|---|---|---|---|---|
| Global astrology app market | USD 3.94B – 7.11B | USD 8.28B – 16.07B | USD 13.48B – 49B | 6% – 25% (source-dependent) |
| Asian astrology market (broader, not app-only) | — | — | USD ~500B | — |

The wide spread reflects differing methodologies across market-research
vendors (some scope "astrology apps," others "astrology & spirituality
services" more broadly). The Asian astrology figure in particular spans far
more than mobile apps — physical consultations, TV/media astrology,
feng shui and Buddhist-astrology services — and should be read as the size
of the surrounding cultural/spending category, not an addressable app
market.

## Thailand & Southeast Asia

- Primary user base skews young: **ages 18–30**.
- Reported average spend: **~500 THB/month per paying user**, with a
  trend described as a 5x increase over recent years.
- High smartphone penetration; app market still growing relative to
  developed markets.
- **Gap identified:** very little astrology/horoscope content available
  natively in Thai, despite Thai astrology (โหราศาสตร์ไทย) and Thai-zodiac
  (ปีนักษัตร) traditions being culturally mainstream — daily horoscope
  segments on Thai TV/radio, lottery (หวย) number interpretation, and
  Buddhist-calendar awareness are all everyday practices that current
  global apps don't localize for.

## Competitive landscape

| App | Positioning | Scale (reported) | Known pain points |
|---|---|---|---|
| Co-Star | AI-driven daily horoscope, social/friend charts | 30M+ users, reported ~$400K–$500K+/mo revenue; acquired by Midjourney | Aggressive paywall, notification spam complaints |
| Nebula | Astrology + tarot + palmistry bundle | Mid-size | Cluttered UX, heavy upsell funnel |
| Chani | Astrologer-written daily readings, subscription | Mid-size, cult following | Slower/less "gamified," no social layer |
| The Pattern | Personality/relationship insights framed via astrology | Large | Opaque methodology, US-centric copy |
| Astral (this app) | Astronomically precise natal/transit/synastry calc + branches knowledge system | Pre-launch | N/A — see Product Strategy |

Common pain points across competitors, per market feedback:

- Core features locked behind paywalls with limited free-tier value.
- Inconsistent or buggy UX, especially chart rendering.
- No offline mode — apps assume constant connectivity.
- English-only or thin localization; no real support for non-Western
  zodiac systems that are the cultural default in large markets (Thailand,
  broader SEA, South Asia).

## User expectations (emerging trends)

- Social features: friend charts, compatibility/synastry comparisons.
- Real-time transit notifications ("Mercury retrograde starts now").
- Voice/personality AI as an emerging differentiator (conversational
  chart readings).
- Growing privacy-first / local-first sentiment — users wary of birth-data
  (a sensitive personal data category) being cloud-locked or resold.

## Astral's positioning

Astral is an **astronomically precise, privacy-respecting astrology
platform** that treats non-Western astrology systems as first-class, not an
afterthought. Where incumbents localize by translating English copy,
Astral's differentiation starts with **Thai zodiac (ปีนักษัตร) and Buddhist
calendar support built into the core experience**, backed by a
local-first architecture (Capacitor-packaged app, on-device computation
where possible) that doesn't require a permanent cloud connection to
function.

See `PRODUCT_STRATEGY.md` for the resulting product and go-to-market plan.
