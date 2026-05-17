const upsertMetaByName = (name, content) => {
  let element = document.querySelector(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const upsertMetaByProperty = (property, content) => {
  let element = document.querySelector(`meta[property="${property}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const upsertCanonical = (href) => {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', href);
};

export const applyInviteSeo = (event, inviteId) => {
  const title = `${event.title} | KKDesign Invitation`;
  const description = event.description
    ? event.description
    : `You're invited to ${event.title}. View details and RSVP on KKDesign.`;
  const url = `${window.location.origin}/invite/${inviteId}`;
  const image = event.image_url || `${window.location.origin}/favicon.svg`;

  document.title = title;
  upsertCanonical(url);
  upsertMetaByName('description', description);
  upsertMetaByProperty('og:type', 'website');
  upsertMetaByProperty('og:site_name', 'KKDesign');
  upsertMetaByProperty('og:title', title);
  upsertMetaByProperty('og:description', description);
  upsertMetaByProperty('og:url', url);
  upsertMetaByProperty('og:image', image);
  upsertMetaByName('twitter:card', 'summary_large_image');
  upsertMetaByName('twitter:title', title);
  upsertMetaByName('twitter:description', description);
  upsertMetaByName('twitter:image', image);
};
