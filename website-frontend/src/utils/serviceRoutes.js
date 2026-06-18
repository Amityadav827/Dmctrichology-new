const RESERVED_ROOT_SLUGS = new Set([
  'about',
  'contact-us',
  'service',
  'blog',
  'results',
  'faqs',
  'virtual-tour',
  'press-media',
  'influencers',
  'team-of-dmc',
  'clients-feedback',
  'terms-conditions',
  'privacy-policy',
  'science-at-dmc',
  'science-at-dmc-trichology',
  'hair-transplant-clinic-in-delhi',
  'about-dadu-medical-centre',
  'about-dr-nandani-dadu',
  'about-dr-nivedita-dadu',
  'details',
  'api',
]);

export function buildServiceDetailPath(slug = '') {
  return slug ? `/${slug}` : '/';
}

export function isReservedRootSlug(slug = '') {
  return RESERVED_ROOT_SLUGS.has(String(slug || '').trim().toLowerCase());
}

export function extractServiceSlugFromPath(pathname = '') {
  const segments = String(pathname || '').split('/').filter(Boolean);

  if (segments.length === 2 && segments[0] === 'details' && segments[1]) {
    return segments[1];
  }

  if (segments.length === 1 && segments[0] && !isReservedRootSlug(segments[0])) {
    return segments[0];
  }

  return '';
}

